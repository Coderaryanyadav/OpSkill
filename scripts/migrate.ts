import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../lib/schema';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is required');
}

const sql = postgres(connectionString);
const db = drizzle(sql, { schema });

async function runMigrations() {
  try {
    console.log('🚀 Running migrations...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('✅ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed');
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
