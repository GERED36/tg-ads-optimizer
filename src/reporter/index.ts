import { WebSocket } from 'ws';
import prisma from '../db';
import { CampaignMetrics } from '../optimizer';

export interface DashboardData {
  overview: {
    totalSpend: number;
    avgCpc: number;
    avgCpm: number;
    avgCpo: number;
    totalConversions: number;
    activeCampaigns: number;
  };
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    dailyBudget: number;
    cpc: number;
    ctr: number;
    cpm: number;
    cpo: number;
    conversions: number;
    spend: number;
  }>;
  statsHistory: Array<{
    timestamp: string;
    cpc: number;
    cpm: number;
    ctr: number;
    spend: number;
    conversions: number;
  }>;
}

export class Reporter {
  private wsClients = new Set<WebSocket>();
  private latestData: DashboardData | null = null;

  addWsClient(ws: WebSocket): void {
    this.wsClients.add(ws);
    ws.on('close', () => this.wsClients.delete(ws));
    ws.on('error', () => this.wsClients.delete(ws));

    if (this.latestData) {
      ws.send(JSON.stringify({ type: 'metrics', data: this.latestData }));
    }
  }

  updateMetrics(_metrics: CampaignMetrics[]): void {
    this.broadcast().catch(err => console.error('Broadcast failed:', err));
  }

  private async broadcast(): Promise<void> {
    this.latestData = await this.getDashboardData();
    const message = JSON.stringify({ type: 'metrics', data: this.latestData });

    for (const ws of this.wsClients) {
      try {
        ws.send(message);
      } catch {
        this.wsClients.delete(ws);
      }
    }
  }

  async getDashboardData(): Promise<DashboardData> {
    const campaigns = await prisma.campaign.findMany();

    const stats = await prisma.campaignStat.findMany({
      orderBy: { timestamp: 'desc' },
      take: 200,
    });

    const latestStats = new Map<string, typeof stats[0]>();
    for (const s of stats) {
      if (!latestStats.has(s.campaignId)) {
        latestStats.set(s.campaignId, s);
      }
    }

    const campaignRows = campaigns.map((c: any) => {
      const s = latestStats.get(c.id);
      return {
        id: c.id,
        name: c.name,
        status: c.status,
        dailyBudget: c.dailyBudget,
        cpc: s?.cpc ?? 0,
        ctr: s?.ctr ?? 0,
        cpm: s?.cpm ?? 0,
        cpo: s?.cpo ?? 0,
        conversions: (s?.conversions ?? 0) + (s?.conversionsExternal ?? 0),
        spend: s?.spend ?? 0,
      };
    });

    const totalSpend = campaignRows.reduce((s: number, c: any) => s + c.spend, 0);
    const totalConversions = campaignRows.reduce((s: number, c: any) => s + c.conversions, 0);
    const activeCount = campaignRows.filter((c: any) => c.status === 'active').length;

    const statsHistory = stats.slice(0, 100).reverse().map((s: any) => ({
      timestamp: s.timestamp.toISOString(),
      cpc: s.cpc,
      cpm: s.cpm,
      ctr: s.ctr,
      spend: s.spend,
      conversions: s.conversions + s.conversionsExternal,
    }));

    return {
      overview: {
        totalSpend,
        avgCpc: campaignRows.length > 0 ? campaignRows.reduce((s: number, c: any) => s + c.cpc, 0) / campaignRows.length : 0,
        avgCpm: campaignRows.length > 0 ? campaignRows.reduce((s: number, c: any) => s + c.cpm, 0) / campaignRows.length : 0,
        avgCpo: campaignRows.length > 0 ? campaignRows.reduce((s: number, c: any) => s + c.cpo, 0) / campaignRows.length : 0,
        totalConversions,
        activeCampaigns: activeCount,
      },
      campaigns: campaignRows,
      statsHistory,
    };
  }
}
