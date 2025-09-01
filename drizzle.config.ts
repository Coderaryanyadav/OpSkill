import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || './opskill.db',
  },
  tablesFilter: ['opskill_*'],
} satisfies Config;
