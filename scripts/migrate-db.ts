import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from '../lib/db';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: path.join(__dirname, '../drizzle') });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    process.exit(0);
  }
}

runMigrations();
