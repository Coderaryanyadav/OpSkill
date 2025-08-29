import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import * as schema from '../db/schema';

async function main() {
  try {
    const db = drizzle(sql, { schema });
    
    console.log('Running database migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log('✅ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

main();
