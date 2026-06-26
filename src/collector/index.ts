import prisma from '../db';
import { TelegramApiClient } from '../api/types';

export class StatsCollector {
  constructor(
    private telegramClient: TelegramApiClient
  ) {}

  async collectAll(): Promise<void> {
    const campaigns = await prisma.campaign.findMany({
      where: { status: { not: 'completed' } },
    });

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const dateFrom = yesterday.toISOString().split('T')[0];
    const dateTo = now.toISOString().split('T')[0];

    for (const campaign of campaigns) {
      try {
        const stats = await this.telegramClient.getCampaignStats(
          campaign.telegramCampaignId,
          dateFrom,
          dateTo
        );

        await prisma.campaignStat.create({
          data: {
            campaignId: campaign.id,
            timestamp: now,
            impressions: stats.impressions,
            clicks: stats.clicks,
            spend: stats.spend,
            cpc: stats.cpc,
            ctr: stats.ctr,
            cpm: stats.cpm,
            conversions: stats.conversions,
            conversionsExternal: 0,
            cpo: stats.conversions > 0 ? stats.spend / stats.conversions : 0,
          },
        });

        await prisma.budgetHistory.upsert({
          where: {
            campaignId_date: {
              campaignId: campaign.id,
              date: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            },
          },
          update: { budgetSpent: { increment: stats.spend } },
          create: {
            campaignId: campaign.id,
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            budgetAllocated: campaign.dailyBudget,
            budgetSpent: stats.spend,
          },
        });
      } catch (error) {
        console.error(`Failed to collect stats for campaign ${campaign.name}:`, error);
      }
    }
  }
}
