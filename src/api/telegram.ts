import { TelegramApiClient, TelegramCampaign, TelegramCampaignStats, TelegramUpdateRequest } from './types';

export function createTelegramClient(config: { TELEGRAM_ADS_API_BASE_URL: string; TELEGRAM_ADS_API_TOKEN: string }): TelegramApiClient {
  const baseUrl = config.TELEGRAM_ADS_API_BASE_URL;
  const token = config.TELEGRAM_ADS_API_TOKEN;

  async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Telegram API error ${response.status}: ${errorBody}`);
    }

    return response.json() as Promise<T>;
  }

  return {
    async getCampaigns(): Promise<TelegramCampaign[]> {
      return request<TelegramCampaign[]>('/campaigns');
    },

    async getCampaignStats(campaignId: string, dateFrom: string, dateTo: string): Promise<TelegramCampaignStats> {
      return request<TelegramCampaignStats>(
        `/campaigns/${campaignId}/statistics?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
    },

    async updateCampaign(campaignId: string, updates: TelegramUpdateRequest): Promise<void> {
      await request(`/campaigns/${campaignId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
  };
}
