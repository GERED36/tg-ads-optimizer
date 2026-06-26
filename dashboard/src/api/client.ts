export interface OverviewData {
  totalSpend: number;
  avgCpc: number;
  avgCpm: number;
  avgCpo: number;
  totalConversions: number;
  activeCampaigns: number;
}

export interface CampaignRow {
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
}

export interface StatsPoint {
  timestamp: string;
  cpc: number;
  cpm: number;
  ctr: number;
  spend: number;
  conversions: number;
}

export interface DashboardData {
  overview: OverviewData;
  campaigns: CampaignRow[];
  statsHistory: StatsPoint[];
}

export interface CampaignDetail {
  id: string;
  telegramCampaignId: string;
  name: string;
  status: string;
  dailyBudget: number;
  cpcTarget: number;
  cpoTarget: number;
  createdAt: string;
  updatedAt: string;
  stats: Array<{
    id: string;
    timestamp: string;
    impressions: number;
    clicks: number;
    spend: number;
    cpc: number;
    ctr: number;
    cpm: number;
    conversions: number;
    conversionsExternal: number;
    cpo: number;
  }>;
  optimizations: Array<{
    id: string;
    timestamp: string;
    action: string;
    reason: string;
    oldBudget: number | null;
    newBudget: number | null;
  }>;
}

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch('/api/metrics');
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

export async function fetchCampaignDetail(id: string): Promise<CampaignDetail> {
  const res = await fetch(`/api/campaigns/${id}`);
  if (!res.ok) throw new Error('Failed to fetch campaign');
  return res.json();
}
