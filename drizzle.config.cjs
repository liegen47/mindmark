const { defineConfig } = require('drizzle-kit');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('Cannot find DATABASE_URL in .env');
}

module.exports = defineConfig({
  schema: './migrations/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
