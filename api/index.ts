import express from 'express';
import cors from 'cors';
import prisma from '../src/db';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/metrics', async (_req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany();
    const stats = await prisma.campaignStat.findMany({
      orderBy: { timestamp: 'desc' },
      take: 200,
    });

    const latestStats = new Map<string, typeof stats[0]>();
    for (const s of stats) {
      if (!latestStats.has(s.campaignId)) {
        latestStats.set(s.campaignId, s);
      }
    }

    const campaignRows = campaigns.map(c => {
      const s = latestStats.get(c.id);
      return {
        id: c.id, name: c.name, status: c.status, dailyBudget: c.dailyBudget,
        cpc: s?.cpc ?? 0, ctr: s?.ctr ?? 0, cpm: s?.cpm ?? 0, cpo: s?.cpo ?? 0,
        conversions: (s?.conversions ?? 0) + (s?.conversionsExternal ?? 0),
        spend: s?.spend ?? 0,
      };
    });

    const totalSpend = campaignRows.reduce((s, c) => s + c.spend, 0);
    const totalConversions = campaignRows.reduce((s, c) => s + c.conversions, 0);
    const activeCount = campaignRows.filter(c => c.status === 'active').length;

    const statsHistory = stats.slice(0, 100).reverse().map(s => ({
      timestamp: s.timestamp.toISOString(),
      cpc: s.cpc, cpm: s.cpm, ctr: s.ctr, spend: s.spend,
      conversions: s.conversions + s.conversionsExternal,
    }));

    res.json({
      overview: {
        totalSpend,
        avgCpc: campaignRows.length > 0 ? campaignRows.reduce((s, c) => s + c.cpc, 0) / campaignRows.length : 0,
        avgCpm: campaignRows.length > 0 ? campaignRows.reduce((s, c) => s + c.cpm, 0) / campaignRows.length : 0,
        avgCpo: campaignRows.length > 0 ? campaignRows.reduce((s, c) => s + c.cpo, 0) / campaignRows.length : 0,
        totalConversions,
        activeCampaigns: activeCount,
      },
      campaigns: campaignRows,
      statsHistory,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

app.get('/api/campaigns', async (_req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany();
    const stats = await prisma.campaignStat.findMany({
      orderBy: { timestamp: 'desc' },
      take: 200,
    });

    const latestStats = new Map<string, typeof stats[0]>();
    for (const s of stats) {
      if (!latestStats.has(s.campaignId)) {
        latestStats.set(s.campaignId, s);
      }
    }

    const rows = campaigns.map(c => {
      const s = latestStats.get(c.id);
      return {
        id: c.id, name: c.name, status: c.status, dailyBudget: c.dailyBudget,
        cpc: s?.cpc ?? 0, ctr: s?.ctr ?? 0, cpm: s?.cpm ?? 0, cpo: s?.cpo ?? 0,
        conversions: (s?.conversions ?? 0) + (s?.conversionsExternal ?? 0),
        spend: s?.spend ?? 0,
      };
    });

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: {
        stats: { orderBy: { timestamp: 'asc' }, take: 200 },
        optimizations: { orderBy: { timestamp: 'desc' }, take: 50 },
      },
    });
    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

export default app;
