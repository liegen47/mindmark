import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../../migrations/schema";
import * as relations from "../../../migrations/relations";
import type { Sql } from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as unknown as {
  postgresClient?: Sql;
};

const connectionString =
  process.env.DATABASE_URL_POOLED ?? process.env.DATABASE_URL;

// IMPORTANT: When using Supabase pooling with postgres-js in serverless, 
// make sure to use port 6543 (Transaction Mode) in your connection string 
// to avoid (EMAXCONNSESSION) "max clients reached in session mode" errors.
const client =
  globalForDb.postgresClient ??
  postgres(connectionString, {
    prepare: false,
    max: 1,
    idle_timeout: 1,
    max_lifetime: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

const db = drizzle(client, { schema: { ...schema, ...relations } });

export default db;
