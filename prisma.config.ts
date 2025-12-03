import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  database: {
    accelerateUrl: process.env.PRISMA_DATABASE_URL,
  },
  migrations: {
    directory: './prisma/migrations',
  },
})