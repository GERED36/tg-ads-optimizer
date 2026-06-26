import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url || !authToken) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN')
  process.exit(1)
}

try {
  const adapter = new PrismaLibSql({ url, authToken })
  const prisma = new PrismaClient({ adapter })

  const campaigns = await prisma.campaign.findMany()
  console.log('Campaigns:', JSON.stringify(campaigns))

  const stats = await prisma.campaignStat.findMany({ take: 5 })
  console.log('Stats count:', stats.length)

  await prisma.$disconnect()
  console.log('OK')
} catch (e) {
  console.error('Error:', e.message)
  if (e.stack) console.error(e.stack)
  process.exit(1)
}
