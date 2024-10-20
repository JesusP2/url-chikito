import { sql } from "drizzle-orm";
import { db } from "../lib/db";
import { urlsTable } from "../lib/db/schema";
import type { APIRoute } from "astro";
export const GET: APIRoute = async ({ params }) => {
  const statement = sql`SELECT * FROM ${urlsTable} WHERE ${urlsTable.shortUrl} = ${params.id}`;
  const value = await db.run(statement);
  let longUrl = value.rows[0]?.long_url as string;
  longUrl = longUrl.startsWith("http") ? longUrl : "http://" + longUrl;
  return new Response(null, {
    status: 302,
    headers: {
      Location: new URL(longUrl).toString(),
    },
  });
};
