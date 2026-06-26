import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Telegram API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should make authenticated GET requests to fetch campaigns', async () => {
    const mockResponse = [{ id: '1', name: 'Test Campaign', status: 'active', dailyBudget: 1000, bid: 0.5 }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { createTelegramClient } = await import('../src/api/telegram');
    const client = createTelegramClient({
      TELEGRAM_ADS_API_BASE_URL: 'https://api.telegram.org/ads/v1',
      TELEGRAM_ADS_API_TOKEN: 'test-token',
    });

    const campaigns = await client.getCampaigns();
    expect(campaigns).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.telegram.org/ads/v1/campaigns',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token',
        }),
      })
    );
  });

  it('should throw on non-OK response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Unauthorized'),
    });

    const { createTelegramClient } = await import('../src/api/telegram');
    const client = createTelegramClient({
      TELEGRAM_ADS_API_BASE_URL: 'https://api.telegram.org/ads/v1',
      TELEGRAM_ADS_API_TOKEN: 'bad-token',
    } as any);

    await expect(client.getCampaigns()).rejects.toThrow('Telegram API error 401: Unauthorized');
  });

  it('should send PATCH request to update campaign', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

    const { createTelegramClient } = await import('../src/api/telegram');
    const client = createTelegramClient({
      TELEGRAM_ADS_API_BASE_URL: 'https://api.telegram.org/ads/v1',
      TELEGRAM_ADS_API_TOKEN: 'test-token',
    } as any);

    await client.updateCampaign('camp-1', { dailyBudget: 500, status: 'paused' });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.telegram.org/ads/v1/campaigns/camp-1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ dailyBudget: 500, status: 'paused' }),
      })
    );
  });
});
