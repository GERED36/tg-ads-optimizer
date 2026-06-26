import express from 'express'
import cors from 'cors'
import prisma from '../src/db'
import { login, register, verify } from '../src/auth'
import { ensureTables } from '../src/db/migrate'

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

// Auto-migrate on startup
ensureTables()

// --- Auth ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {}
    if (!email || !password) {
      res.status(400).json({ error: 'Введите email и пароль' })
      return
    }
    if (password.length < 4) {
      res.status(400).json({ error: 'Пароль должен быть минимум 4 символа' })
      return
    }
    const token = await register(email, password, name)
    res.json({ token })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      res.status(400).json({ error: 'Введите email и пароль' })
      return
    }
    const token = await login(email, password)
    if (!token) {
      res.status(401).json({ error: 'Неверный email или пароль' })
      return
    }
    res.json({ token })
  } catch (e: any) {
    res.status(500).json({ error: 'Ошибка входа' })
  }
})

app.get('/api/auth/check', (req, res) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Не авторизован' })
    return
  }
  const payload = verify(header.slice(7))
  if (!payload) {
    res.status(401).json({ error: 'Токен истёк или недействителен' })
    return
  }
  res.json({ ok: true })
})

function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Не авторизован' })
    return
  }
  const payload = verify(header.slice(7))
  if (!payload) {
    res.status(401).json({ error: 'Токен истёк или недействителен' })
    return
  }
  next()
}

// --- Settings ---

app.get('/api/settings', authMiddleware, async (_req, res) => {
  try {
    const rows: any[] = await prisma.appSetting.findMany()
    const settings: Record<string, string> = {}
    for (const r of rows) settings[r.key] = r.value
    res.json(settings)
  } catch {
    res.status(500).json({ error: 'Ошибка загрузки настроек' })
  }
})

app.put('/api/settings', authMiddleware, async (req, res) => {
  try {
    const { key, value } = req.body || {}
    if (!key) {
      res.status(400).json({ error: 'Не указан ключ' })
      return
    }
    await prisma.appSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Ошибка сохранения настройки' })
  }
})

// --- Telegram test ---

app.post('/api/telegram/test', authMiddleware, async (req, res) => {
  try {
    const { token, baseUrl } = req.body || {}
    if (!token) {
      res.status(400).json({ error: 'Введите токен Telegram Ads' })
      return
    }
    const url = (baseUrl || 'https://api.telegram.org/ads/v1').replace(/\/+$/, '')
    const response = await fetch(`${url}/campaigns`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
    if (response.ok) {
      res.json({ ok: true, message: 'Подключение успешно' })
    } else {
      const text = await response.text()
      res.status(400).json({ error: `Ошибка ${response.status}: ${text}` })
    }
  } catch (e: any) {
    res.status(500).json({ error: `Ошибка подключения: ${e.message}` })
  }
})

// --- Metrics & Campaigns (protected) ---

app.get('/api/metrics', authMiddleware, async (_req, res) => {
  try {
    const campaigns: any[] = await prisma.campaign.findMany()
    const stats: any[] = await prisma.campaignStat.findMany({
      orderBy: { timestamp: 'desc' },
      take: 200,
    })

    const latestStats = new Map<string, any>()
    for (const s of stats) {
      if (!latestStats.has(s.campaignId)) {
        latestStats.set(s.campaignId, s)
      }
    }

    const campaignRows = campaigns.map(c => {
      const s = latestStats.get(c.id)
      return {
        id: c.id, name: c.name, status: c.status, dailyBudget: c.dailyBudget,
        cpc: s?.cpc ?? 0, ctr: s?.ctr ?? 0, cpm: s?.cpm ?? 0, cpo: s?.cpo ?? 0,
        conversions: (s?.conversions ?? 0) + (s?.conversionsExternal ?? 0),
        spend: s?.spend ?? 0,
      }
    })

    const totalSpend = campaignRows.reduce((s: number, c: any) => s + c.spend, 0)
    const totalConversions = campaignRows.reduce((s: number, c: any) => s + c.conversions, 0)
    const activeCount = campaignRows.filter((c: any) => c.status === 'active').length

    const statsHistory = stats.slice(0, 100).reverse().map((s: any) => ({
      timestamp: s.timestamp.toISOString(),
      cpc: s.cpc, cpm: s.cpm, ctr: s.ctr, spend: s.spend,
      conversions: s.conversions + s.conversionsExternal,
    }))

    res.json({
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
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки метрик' })
  }
})

app.get('/api/campaigns', authMiddleware, async (_req, res) => {
  try {
    const campaigns: any[] = await prisma.campaign.findMany()
    const stats: any[] = await prisma.campaignStat.findMany({
      orderBy: { timestamp: 'desc' },
      take: 200,
    })

    const latestStats = new Map<string, any>()
    for (const s of stats) {
      if (!latestStats.has(s.campaignId)) {
        latestStats.set(s.campaignId, s)
      }
    }

    const rows = campaigns.map(c => {
      const s = latestStats.get(c.id)
      return {
        id: c.id, name: c.name, status: c.status, dailyBudget: c.dailyBudget,
        cpc: s?.cpc ?? 0, ctr: s?.ctr ?? 0, cpm: s?.cpm ?? 0, cpo: s?.cpo ?? 0,
        conversions: (s?.conversions ?? 0) + (s?.conversionsExternal ?? 0),
        spend: s?.spend ?? 0,
      }
    })

    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки кампаний' })
  }
})

app.get('/api/campaigns/:id', authMiddleware, async (req, res) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: {
        stats: { orderBy: { timestamp: 'asc' }, take: 200 },
        optimizations: { orderBy: { timestamp: 'desc' }, take: 50 },
      },
    })
    if (!campaign) {
      res.status(404).json({ error: 'Кампания не найдена' })
      return
    }
    res.json(campaign)
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки кампании' })
  }
})

export default app
