import { describe, it, expect, vi } from 'vitest';

describe('getConfig', () => {
  it('should parse config from environment', async () => {
    vi.resetModules();
    process.env.DATABASE_URL = 'postgresql://localhost:5432/test';
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.TELEGRAM_ADS_API_TOKEN = 'test-token';
    process.env.OPTIMIZATION_INTERVAL_MS = '600000';
    process.env.CPC_TARGET = '1.0';
    process.env.CPO_TARGET = '20.0';
    process.env.MIN_CTR_PERCENT = '1.0';
    process.env.PORT = '4000';
    process.env.DASHBOARD_URL = 'http://localhost:3000';
    process.env.TELEGRAM_ADS_API_BASE_URL = 'https://api.telegram.org/ads/v1';

    const { getConfig } = await import('../src/config');
    const cfg = getConfig();

    expect(cfg.CPC_TARGET).toBe(1.0);
    expect(cfg.CPO_TARGET).toBe(20.0);
    expect(cfg.OPTIMIZATION_INTERVAL_MS).toBe(600000);
    expect(cfg.MIN_CTR_PERCENT).toBe(1.0);
    expect(cfg.PORT).toBe(4000);
    expect(cfg.DASHBOARD_URL).toBe('http://localhost:3000');
  });

  it('should exit on invalid config', async () => {
    vi.resetModules();
    const exitMock = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    const errorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    delete process.env.DATABASE_URL;
    const { getConfig } = await import('../src/config');
    expect(() => getConfig()).toThrow('exit');

    exitMock.mockRestore();
    errorMock.mockRestore();
  });
});
