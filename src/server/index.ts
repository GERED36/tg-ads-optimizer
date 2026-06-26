import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { Config } from '../config';
import { Reporter } from '../reporter';

export function createServer(config: Config, reporter: Reporter): http.Server {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(cors({ origin: config.DASHBOARD_URL }));
  app.use(express.json());

  app.get('/api/metrics', async (_req, res) => {
    try {
      const data = await reporter.getDashboardData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка загрузки метрик' });
    }
  });

  app.get('/api/campaigns', async (_req, res) => {
    try {
      const data = await reporter.getDashboardData();
      res.json(data.campaigns);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка загрузки кампаний' });
    }
  });

  app.get('/api/campaigns/:id', async (req, res) => {
    try {
      const prisma = (await import('../db')).default;
      const campaign = await prisma.campaign.findUnique({
        where: { id: req.params.id },
        include: {
          stats: { orderBy: { timestamp: 'asc' }, take: 200 },
          optimizations: { orderBy: { timestamp: 'desc' }, take: 50 },
        },
      });
      if (!campaign) {
        res.status(404).json({ error: 'Кампания не найдена' });
        return;
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка загрузки кампании' });
    }
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Dashboard connected');
    reporter.addWsClient(ws);
  });

  server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });

  return server;
}
