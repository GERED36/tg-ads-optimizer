import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/db', () => ({
  default: {
    campaign: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    campaignStat: {
      create: vi.fn(),
    },
    budgetHistory: {
      upsert: vi.fn(),
    },
    optimizationLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('node-cron', () => ({
  default: {
    schedule: vi.fn().mockReturnValue({ stop: vi.fn() }),
  },
}));

describe('Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should start and schedule cron task', async () => {
    const { Engine } = await import('../src/engine');

    const { default: prisma } = await import('../src/db');
    (prisma.campaign.findMany as any).mockResolvedValue([]);

    const mockClient = {
      getCampaignStats: vi.fn(),
      getCampaigns: vi.fn(),
      updateCampaign: vi.fn(),
    };
    const mockConfig = {
      OPTIMIZATION_INTERVAL_MS: 900000,
      CPC_TARGET: 0.5,
      CPO_TARGET: 10,
      MIN_CTR_PERCENT: 0.5,
      PID_KP: 0.1,
      PID_KI: 0.01,
      PID_KD: 0.05,
    };

    const cron = await import('node-cron');
    const engine = new Engine(mockConfig as any, mockClient);
    await engine.start();

    expect(cron.default.schedule).toHaveBeenCalled();
    engine.stop();
  });

  it('should handle empty campaigns gracefully', async () => {
    const { Engine } = await import('../src/engine');
    const { default: prisma } = await import('../src/db');
    (prisma.campaign.findMany as any).mockResolvedValue([]);

    const engine = new Engine({} as any, {} as any);
    await engine.start();
    engine.stop();
  });
});
