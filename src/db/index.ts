const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL

let prisma: any

if (url) {
  const { PrismaClient } = require('@prisma/client')
  const { PrismaLibSql } = require('@prisma/adapter-libsql')
  const adapter = new PrismaLibSql({ url, authToken: process.env.TURSO_AUTH_TOKEN })
  prisma = new PrismaClient({ adapter })
} else {
  const emptyArr = Promise.resolve([])
  const emptyNull = Promise.resolve(null)
  prisma = {
    campaign: { findMany: () => emptyArr, findUnique: () => emptyNull, create: (a: any) => Promise.resolve(a.data), update: (a: any) => Promise.resolve(a.data) },
    campaignStat: { findMany: () => emptyArr, create: (a: any) => Promise.resolve(a.data) },
    optimizationLog: { create: (a: any) => Promise.resolve(a.data), findMany: () => emptyArr },
    budgetHistory: { create: (a: any) => Promise.resolve(a.data) },
    $disconnect: () => Promise.resolve(),
    $executeRawUnsafe: () => Promise.resolve([]),
  }
}

export default prisma
