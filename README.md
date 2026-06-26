# Marketing Agent

Automated Telegram Ads optimization agent with PID controller and real-time dashboard.

## Quick Start

```bash
# 1. Install
cd marketing-agent
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your Telegram Ads API token

# 3. Push database schema (creates SQLite file)
npx prisma db push

# 4. Start agent
npm run dev
```

## Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Open http://localhost:5173

## Docker Deployment

```bash
docker compose up --build -d
```

## Architecture

- **Collector** - Fetches campaign stats every 15 minutes
- **Optimizer** - PID controller adjusts bids based on CPC error
- **Engine** - Orchestrates the fetch-analyze-optimize loop
- **Server** - REST + WebSocket API for the dashboard
- **Dashboard** - React SPA with real-time metrics

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `CPC_TARGET` | 0.5 | Target cost per click |
| `CPO_TARGET` | 10.0 | Target cost per order |
| `MIN_CTR_PERCENT` | 0.5 | Min CTR before pausing |
| `PID_KP` | 0.1 | Proportional gain |
| `PID_KI` | 0.01 | Integral gain |
| `PID_KD` | 0.05 | Derivative gain |

## Development

```bash
npm test          # Run tests
npm run test:watch  # Watch mode
npm run dev       # Start agent with hot reload
```
