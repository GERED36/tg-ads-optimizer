import { describe, it, expect, vi } from 'vitest';

describe('createServer', () => {
  it('should create HTTP server with endpoints', async () => {
    const { createServer } = await import('../src/server');
    const mockReporter = {
      getDashboardData: vi.fn().mockResolvedValue({
        overview: { totalSpend: 100, avgCpc: 0.5, avgCpm: 20, avgCpo: 10, totalConversions: 10, activeCampaigns: 2 },
        campaigns: [],
        statsHistory: [],
      }),
      addWsClient: vi.fn(),
    };

    const server = createServer(
      { PORT: 0, DASHBOARD_URL: 'http://localhost:5173' } as any,
      mockReporter as any
    );

    expect(server).toBeDefined();
    server.close();
  });
});
