import Database from 'better-sqlite3';
import path from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';

// Initialize SQLite database
const sqlite = new Database(path.join(process.cwd(), 'opskill.db'), {
  fileMustExist: false, // Create the file if it doesn't exist
});

// Enable WAL mode for better concurrency
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

// Run migrations
export function runMigrations() {
  migrate(db, { migrationsFolder: 'drizzle' });
}

// Initialize the database with schema if it doesn't exist
export async function initDb() {
  try {
    // Create tables by executing the schema SQL file
    const schemaSql = (await import('fs/promises')).readFileSync(
      path.join(process.cwd(), 'db/schema.sql'),
      'utf-8'
    );
    
    // Split the SQL file into individual statements and execute them
    const statements = schemaSql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      try {
        sqlite.exec(statement + ';');
      } catch (error) {
        console.error('Error executing SQL statement:', statement);
        console.error(error);
      }
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:');
    console.error(error);
    process.exit(1);
  }
}

// Close the database connection when the app exits
process.on('exit', () => {
  sqlite.close();
});

process.on('SIGINT', () => {
  sqlite.close();
  process.exit(0);
});

export default db;
