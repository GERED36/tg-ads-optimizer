const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL

let prisma: any

if (url) {
  const { PrismaClient } = require('@prisma/client')
  const { PrismaLibSql } = require('@prisma/adapter-libsql')
  const adapter = new PrismaLibSql({ url, authToken: process.env.TURSO_AUTH_TOKEN })
  prisma = new PrismaClient({ adapter })
} else {
  const now = new Date()
  const ts = (minsAgo: number) => new Date(now.getTime() - minsAgo * 60000)

  const mockCampaigns = [
    { id: 'demo-1', name: 'Summer Sale', status: 'active', dailyBudget: 5000, telegramCampaignId: 'tg-demo-1', createdAt: ts(1440), updatedAt: now },
    { id: 'demo-2', name: 'Brand Awareness', status: 'active', dailyBudget: 3000, telegramCampaignId: 'tg-demo-2', createdAt: ts(2880), updatedAt: now },
    { id: 'demo-3', name: 'Retargeting', status: 'paused', dailyBudget: 2000, telegramCampaignId: 'tg-demo-3', createdAt: ts(4320), updatedAt: now },
  ]

  const mockStats = [
    { id: 's1', campaignId: 'demo-1', timestamp: ts(30), impressions: 45000, clicks: 1350, spend: 4250, conversions: 85, conversionsExternal: 12, cpc: 3.15, ctr: 3.0, cpm: 94.44, cpo: 43.81 },
    { id: 's2', campaignId: 'demo-1', timestamp: ts(60), impressions: 42000, clicks: 1218, spend: 4100, conversions: 72, conversionsExternal: 8, cpc: 3.37, ctr: 2.9, cpm: 97.62, cpo: 51.25 },
    { id: 's3', campaignId: 'demo-1', timestamp: ts(90), impressions: 38000, clicks: 1064, spend: 3800, conversions: 65, conversionsExternal: 10, cpc: 3.57, ctr: 2.8, cpm: 100.0, cpo: 50.67 },
    { id: 's4', campaignId: 'demo-1', timestamp: ts(120), impressions: 41000, clicks: 1189, spend: 3950, conversions: 78, conversionsExternal: 9, cpc: 3.32, ctr: 2.9, cpm: 96.34, cpo: 45.4 },
    { id: 's5', campaignId: 'demo-2', timestamp: ts(30), impressions: 32000, clicks: 800, spend: 2800, conversions: 45, conversionsExternal: 5, cpc: 3.5, ctr: 2.5, cpm: 87.5, cpo: 56.0 },
    { id: 's6', campaignId: 'demo-2', timestamp: ts(60), impressions: 35000, clicks: 875, spend: 2900, conversions: 48, conversionsExternal: 6, cpc: 3.31, ctr: 2.5, cpm: 82.86, cpo: 53.7 },
    { id: 's7', campaignId: 'demo-2', timestamp: ts(90), impressions: 30000, clicks: 720, spend: 2600, conversions: 40, conversionsExternal: 4, cpc: 3.61, ctr: 2.4, cpm: 86.67, cpo: 59.09 },
    { id: 's8', campaignId: 'demo-2', timestamp: ts(120), impressions: 33000, clicks: 825, spend: 2750, conversions: 50, conversionsExternal: 7, cpc: 3.33, ctr: 2.5, cpm: 83.33, cpo: 48.25 },
    { id: 's9', campaignId: 'demo-3', timestamp: ts(60), impressions: 15000, clicks: 375, spend: 1800, conversions: 18, conversionsExternal: 2, cpc: 4.8, ctr: 2.5, cpm: 120.0, cpo: 90.0 },
  ]

  const mockLogs = [
    { id: 'l1', campaignId: 'demo-1', action: 'raise', reason: 'CTR above threshold (3.0% > 2.5%)', timestamp: ts(30), oldBudget: 4500, newBudget: 5000 },
    { id: 'l2', campaignId: 'demo-2', action: 'hold', reason: 'CPC within target range', timestamp: ts(30), oldBudget: null, newBudget: null },
    { id: 'l3', campaignId: 'demo-3', action: 'pause', reason: 'CPO too high (90.00 > 60.00)', timestamp: ts(60), oldBudget: null, newBudget: null },
  ]

  prisma = {
    campaign: {
      findMany: (_args?: any) => Promise.resolve(mockCampaigns),
      findUnique: (args: any) => Promise.resolve(mockCampaigns.find(c => c.id === args.where.id) ?? null),
      create: (args: any) => Promise.resolve(args.data),
      update: (args: any) => Promise.resolve({ ...mockCampaigns.find(c => c.id === args.where.id), ...args.data }),
    },
    campaignStat: {
      findMany: (_args?: any) => Promise.resolve(mockStats),
      create: (args: any) => Promise.resolve(args.data),
    },
    optimizationLog: {
      create: (args: any) => Promise.resolve(args.data),
      findMany: (_args?: any) => Promise.resolve(mockLogs),
    },
    budgetHistory: {
      create: (args: any) => Promise.resolve(args.data),
    },
    $disconnect: () => Promise.resolve(),
  }
}

export default prisma
