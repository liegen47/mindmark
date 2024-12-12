import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
    throw new Error('⚠️ Cannot find Database URL. Please ensure it is set in the .env file.');
}

export default defineConfig({
    schema: './src/lib/supabase/schema.ts',
    out: './migrations',
   
      dbCredentials: {
        database: "postgres",
        port: 5432,
        host: "aws-0-ap-south-1.pooler.supabase.com",
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
    },
    dialect: 'postgresql',
  
});
