export interface TelegramCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  dailyBudget: number;
  bid: number;
}

export interface TelegramCampaignStats {
  campaignId: string;
  dateFrom: string;
  dateTo: string;
  impressions: number;
  clicks: number;
  spend: number;
  cpc: number;
  ctr: number;
  cpm: number;
  conversions: number;
}

export interface TelegramUpdateRequest {
  dailyBudget?: number;
  bid?: number;
  status?: 'active' | 'paused';
}

export interface TelegramApiClient {
  getCampaigns(): Promise<TelegramCampaign[]>;
  getCampaignStats(campaignId: string, dateFrom: string, dateTo: string): Promise<TelegramCampaignStats>;
  updateCampaign(campaignId: string, updates: TelegramUpdateRequest): Promise<void>;
}
