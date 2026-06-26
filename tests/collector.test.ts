import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/db', () => ({
  default: {
    campaign: {
      findMany: vi.fn(),
    },
    campaignStat: {
      create: vi.fn(),
    },
    budgetHistory: {
      upsert: vi.fn(),
    },
  },
}));

import prisma from '../src/db';
import { StatsCollector } from '../src/collector';

describe('StatsCollector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should collect stats for all active campaigns', async () => {
    const mockClient = {
      getCampaignStats: vi.fn().mockResolvedValue({
        impressions: 1000, clicks: 50, spend: 25, cpc: 0.5, ctr: 0.05, cpm: 25, conversions: 5,
      }),
      getCampaigns: vi.fn(),
      updateCampaign: vi.fn(),
    };

    (prisma.campaign.findMany as any).mockResolvedValue([
      { id: 'c1', telegramCampaignId: 'tg1', name: 'Camp1', dailyBudget: 1000, status: 'active' },
      { id: 'c2', telegramCampaignId: 'tg2', name: 'Camp2', dailyBudget: 500, status: 'active' },
    ]);

    const collector = new StatsCollector(mockClient);
    await collector.collectAll();

    expect(mockClient.getCampaignStats).toHaveBeenCalledTimes(2);
    expect(prisma.campaignStat.create).toHaveBeenCalledTimes(2);
    expect(prisma.budgetHistory.upsert).toHaveBeenCalledTimes(2);
  });

  it('should handle errors gracefully for individual campaigns', async () => {
    const mockClient = {
      getCampaignStats: vi.fn()
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({ impressions: 500, clicks: 25, spend: 10, cpc: 0.4, ctr: 0.05, cpm: 20, conversions: 2 }),
      getCampaigns: vi.fn(),
      updateCampaign: vi.fn(),
    };

    (prisma.campaign.findMany as any).mockResolvedValue([
      { id: 'c1', telegramCampaignId: 'tg1', name: 'Camp1', dailyBudget: 1000, status: 'active' },
      { id: 'c2', telegramCampaignId: 'tg2', name: 'Camp2', dailyBudget: 500, status: 'active' },
    ]);

    const collector = new StatsCollector(mockClient);
    await expect(collector.collectAll()).resolves.not.toThrow();
    expect(prisma.campaignStat.create).toHaveBeenCalledTimes(1);
  });
});
