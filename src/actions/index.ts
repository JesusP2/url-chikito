import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { crc32 } from "crc";
import { sql } from "drizzle-orm";
import { db } from "../lib/db";
import { urlsTable } from "../lib/db/schema";

export const server = {
  shortenUrl: defineAction({
    input: z.object({
      url: z.string(),
    }),
    handler: async (input) => {
      const hash = crc32(input.url).toString(16);
      const statement = sql`SELECT * FROM ${urlsTable} WHERE ${urlsTable.shortUrl} = ${hash}`;
      const value = await db.run(statement);
      const savedHash = value.rows[0]?.short_url as string;
      if (!savedHash) {
        await db.insert(urlsTable).values({
          shortUrl: hash,
          longUrl: input.url,
        });
      }
      return hash;
    },
  }),
};
