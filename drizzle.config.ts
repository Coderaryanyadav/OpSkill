import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL or DATABASE_URL environment variable is required');
}

// For Vercel Postgres
export default {
  schema: './lib/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString + (process.env.NODE_ENV === 'production' ? '?sslmode=require' : ''),
  },
  // Generate migrations in the migrations folder
  schemaFilter: ['public'],
  // Create a migration file for each table
  strict: true,
  verbose: true,
} satisfies Config;
