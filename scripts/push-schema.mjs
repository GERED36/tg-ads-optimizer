import { createClient } from '@libsql/client'

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url || !authToken) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN')
  process.exit(1)
}

const client = createClient({ url, authToken })

const dropTables = `
DROP TABLE IF EXISTS BudgetHistory;
DROP TABLE IF EXISTS OptimizationLog;
DROP TABLE IF EXISTS CampaignStat;
DROP TABLE IF EXISTS Campaign;
`

const createTables = `
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "telegramCampaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dailyBudget" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "cpcTarget" REAL NOT NULL DEFAULT 0.5,
    "cpoTarget" REAL NOT NULL DEFAULT 10.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "Campaign_telegramCampaignId_key" ON "Campaign"("telegramCampaignId");

CREATE TABLE "CampaignStat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "impressions" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL,
    "spend" REAL NOT NULL,
    "cpc" REAL NOT NULL,
    "ctr" REAL NOT NULL,
    "cpm" REAL NOT NULL,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "conversionsExternal" INTEGER NOT NULL DEFAULT 0,
    "cpo" REAL NOT NULL,
    FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE
);

CREATE INDEX "CampaignStat_campaignId_timestamp_idx" ON "CampaignStat"("campaignId", "timestamp");
CREATE INDEX "CampaignStat_campaignId_idx" ON "CampaignStat"("campaignId");

CREATE TABLE "OptimizationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "oldBudget" REAL,
    "newBudget" REAL,
    "oldBid" REAL,
    "newBid" REAL,
    FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE
);

CREATE INDEX "OptimizationLog_campaignId_timestamp_idx" ON "OptimizationLog"("campaignId", "timestamp");

CREATE TABLE "BudgetHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "budgetAllocated" REAL NOT NULL,
    "budgetSpent" REAL NOT NULL,
    FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "BudgetHistory_campaignId_date_key" ON "BudgetHistory"("campaignId", "date");
`

try {
  console.log('Dropping existing tables...')
  await client.executeMultiple(dropTables)

  console.log('Creating tables...')
  await client.executeMultiple(createTables)

  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  console.log('Tables:', result.rows.map(r => r.name).join(', '))

  console.log('Schema pushed successfully!')
} catch (e) {
  console.error('Error:', e.message)
  process.exit(1)
} finally {
  client.close()
}
