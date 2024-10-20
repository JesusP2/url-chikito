import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { DATABASE_URL, DATABASE_SECRET } from 'astro:env/server';

const client = createClient({ 
  url: DATABASE_URL, 
  authToken: DATABASE_SECRET,
});
export const db = drizzle(client);
