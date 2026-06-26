import cron from 'node-cron';
import prisma from '../db';
import { Config } from '../config';
import { TelegramApiClient } from '../api/types';
import { StatsCollector } from '../collector';
import { PidController, optimizeCampaign, reallocateBudget, CampaignMetrics } from '../optimizer';

export class Engine {
  private pidControllers = new Map<string, PidController>();
  private collector: StatsCollector;
  private cronTask: cron.ScheduledTask | null = null;
  private running = false;
  private onMetricsUpdated?: (metrics: CampaignMetrics[]) => void;

  constructor(
    private config: Config,
    private telegramClient: TelegramApiClient,
    onMetricsUpdated?: (metrics: CampaignMetrics[]) => void
  ) {
    this.collector = new StatsCollector(telegramClient);
    this.onMetricsUpdated = onMetricsUpdated;
  }

  async start(): Promise<void> {
    console.log('Engine starting...');
    this.running = true;

    // Run immediately on start
    await this.runCycle();

    // Schedule recurring runs
    const intervalMinutes = Math.floor(this.config.OPTIMIZATION_INTERVAL_MS / 60000);
    this.cronTask = cron.schedule(`*/${intervalMinutes} * * * *`, () => {
      this.runCycle().catch(err => console.error('Engine cycle failed:', err));
    });

    console.log(`Engine running every ${intervalMinutes} minutes`);
  }

  stop(): void {
    this.running = false;
    if (this.cronTask) {
      this.cronTask.stop();
    }
  }

  private async runCycle(): Promise<void> {
    console.log(`[${new Date().toISOString()}] Running optimization cycle`);

    // 1. Collect fresh stats
    await this.collector.collectAll();

    // 2. Get current campaign data
    const campaigns = await prisma.campaign.findMany({
      where: { status: 'active' },
      include: {
        stats: { orderBy: { timestamp: 'desc' }, take: 5 },
      },
    });

    const metrics: CampaignMetrics[] = [];

    for (const campaign of campaigns) {
      if (campaign.stats.length < 3) {
        console.log(`Campaign ${campaign.name}: insufficient data (${campaign.stats.length} points), skipping`);
        continue;
      }

      const latest = campaign.stats[0];
      metrics.push({
        campaignId: campaign.id,
        cpc: latest.cpc,
        ctr: latest.ctr,
        cpo: latest.cpo,
        conversions: latest.conversions + latest.conversionsExternal,
        spend: latest.spend,
        impressions: latest.impressions,
      });
    }

    if (metrics.length === 0) {
      console.log('No campaigns with sufficient data');
      return;
    }

    // 3. Optimize each campaign
    for (const m of metrics) {
      let controller = this.pidControllers.get(m.campaignId);
      if (!controller) {
        controller = new PidController(
          this.config.PID_KP,
          this.config.PID_KI,
          this.config.PID_KD,
          this.config.CPC_TARGET
        );
        this.pidControllers.set(m.campaignId, controller);
      }

      const result = optimizeCampaign(
        { CPC_TARGET: this.config.CPC_TARGET, CPO_TARGET: this.config.CPO_TARGET, MIN_CTR_PERCENT: this.config.MIN_CTR_PERCENT },
        controller,
        m
      );
      console.log(`Campaign ${m.campaignId}: ${result.action} — ${result.reason}`);

      await prisma.optimizationLog.create({
        data: {
          campaignId: m.campaignId,
          action: result.action,
          reason: result.reason,
        },
      });

      // 4. Execute optimization action
      if (result.action === 'pause') {
        const campaign = campaigns.find(c => c.id === m.campaignId);
        if (campaign) {
          await this.telegramClient.updateCampaign(campaign.telegramCampaignId, { status: 'paused' });
          await prisma.campaign.update({
            where: { id: m.campaignId },
            data: { status: 'paused' },
          });
        }
      } else if (result.action === 'raise' || result.action === 'lower') {
        const campaign = campaigns.find(c => c.id === m.campaignId);
        if (campaign) {
          const newBudget = Math.max(100, Math.round(campaign.dailyBudget * (1 + result.budgetAdjustment)));
          await this.telegramClient.updateCampaign(campaign.telegramCampaignId, {
            dailyBudget: newBudget,
          });
          await prisma.campaign.update({
            where: { id: m.campaignId },
            data: { dailyBudget: newBudget },
          });
        }
      }
    }

    // 5. Reallocate budget across campaigns
    if (metrics.length > 1) {
      const totalBudget = campaigns.reduce((sum, c) => sum + c.dailyBudget, 0);
      const allocation = reallocateBudget(metrics, totalBudget);

      for (const [campaignId, newBudget] of allocation) {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (campaign && Math.abs(campaign.dailyBudget - newBudget) > 10) {
          const roundedBudget = Math.round(newBudget);
          await this.telegramClient.updateCampaign(campaign.telegramCampaignId, {
            dailyBudget: roundedBudget,
          });
          await prisma.campaign.update({
            where: { id: campaignId },
            data: { dailyBudget: roundedBudget },
          });

          await prisma.optimizationLog.create({
            data: {
              campaignId,
              action: 'reallocate',
              reason: `Budget redistributed from ${campaign.dailyBudget} to ${roundedBudget}`,
              oldBudget: campaign.dailyBudget,
              newBudget: roundedBudget,
            },
          });
        }
      }
    }

    // 6. Notify listeners
    if (this.onMetricsUpdated) {
      this.onMetricsUpdated(metrics);
    }

    console.log(`[${new Date().toISOString()}] Cycle complete`);
  }
}
