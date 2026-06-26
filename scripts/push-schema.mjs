import { createClient } from '@libsql/client'

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url || !authToken) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN')
  process.exit(1)
}

const client = createClient({ url, authToken })

const sql = `
CREATE TABLE IF NOT EXISTS Campaign (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  dailyBudget REAL NOT NULL DEFAULT 0,
  telegramCampaignId TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS CampaignStat (
  id TEXT PRIMARY KEY,
  campaignId TEXT NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  spend REAL NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  conversionsExternal INTEGER NOT NULL DEFAULT 0,
  cpc REAL NOT NULL DEFAULT 0,
  ctr REAL NOT NULL DEFAULT 0,
  cpm REAL NOT NULL DEFAULT 0,
  cpo REAL NOT NULL DEFAULT 0,
  FOREIGN KEY (campaignId) REFERENCES Campaign(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS OptimizationLog (
  id TEXT PRIMARY KEY,
  campaignId TEXT NOT NULL,
  action TEXT NOT NULL,
  reason TEXT NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  oldBudget REAL,
  newBudget REAL,
  FOREIGN KEY (campaignId) REFERENCES Campaign(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS BudgetHistory (
  id TEXT PRIMARY KEY,
  campaignId TEXT NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  oldBudget REAL NOT NULL,
  newBudget REAL NOT NULL,
  reason TEXT,
  FOREIGN KEY (campaignId) REFERENCES Campaign(id) ON DELETE CASCADE
);
`

try {
  await client.executeMultiple(sql)
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  console.log('Tables created:', result.rows.map(r => r.name).join(', '))
} catch (e) {
  console.error('Error:', e.message)
  process.exit(1)
} finally {
  client.close()
}
