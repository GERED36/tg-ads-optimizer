import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'src/db/prisma/schema.prisma',
  datasource: {
    url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || 'file:./dev.db',
  },
})
