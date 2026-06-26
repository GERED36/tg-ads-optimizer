export interface OverviewData {
  totalSpend: number
  avgCpc: number
  avgCpm: number
  avgCpo: number
  totalConversions: number
  activeCampaigns: number
}

export interface CampaignRow {
  id: string
  name: string
  status: string
  dailyBudget: number
  cpc: number
  ctr: number
  cpm: number
  cpo: number
  conversions: number
  spend: number
}

export interface StatsPoint {
  timestamp: string
  cpc: number
  cpm: number
  ctr: number
  spend: number
  conversions: number
}

export interface DashboardData {
  overview: OverviewData
  campaigns: CampaignRow[]
  statsHistory: StatsPoint[]
}

export interface CampaignDetail {
  id: string
  telegramCampaignId: string
  name: string
  status: string
  dailyBudget: number
  cpcTarget: number
  cpoTarget: number
  createdAt: string
  updatedAt: string
  stats: Array<{
    id: string
    timestamp: string
    impressions: number
    clicks: number
    spend: number
    cpc: number
    ctr: number
    cpm: number
    conversions: number
    conversionsExternal: number
    cpo: number
  }>
  optimizations: Array<{
    id: string
    timestamp: string
    action: string
    reason: string
    oldBudget: number | null
    newBudget: number | null
  }>
}

function getToken(): string | null {
  return localStorage.getItem('auth-token')
}

function headers(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

export async function login(password: string): Promise<string> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Ошибка входа')
  }
  const data = await res.json()
  return data.token
}

export async function checkAuth(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/check', { headers: headers() })
    return res.ok
  } catch { return false }
}

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch('/api/metrics', { headers: headers() })
  if (!res.ok) throw new Error('Ошибка загрузки метрик')
  return res.json()
}

export async function fetchCampaignDetail(id: string): Promise<CampaignDetail> {
  const res = await fetch(`/api/campaigns/${id}`, { headers: headers() })
  if (!res.ok) throw new Error('Ошибка загрузки кампании')
  return res.json()
}

export async function fetchSettings(): Promise<Record<string, string>> {
  const res = await fetch('/api/settings', { headers: headers() })
  if (!res.ok) throw new Error('Ошибка загрузки настроек')
  return res.json()
}

export async function saveSetting(key: string, value: string): Promise<void> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ key, value }),
  })
  if (!res.ok) throw new Error('Ошибка сохранения')
}

export async function testTelegramConnection(token: string, baseUrl?: string): Promise<string> {
  const res = await fetch('/api/telegram/test', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ token, baseUrl }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Ошибка подключения')
  return data.message
}
