import prisma from './index'

export async function ensureTables() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS User (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        name TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('[migrate] User table ensured')
  } catch (e) {
    console.log('[migrate] User table already exists or error:', (e as any)?.message)
  }
}
