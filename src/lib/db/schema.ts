import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const urlsTable = sqliteTable("urls_table", {
  id: int().primaryKey({ autoIncrement: true }),
  shortUrl: text('short_url').notNull().unique(),
  longUrl: text('long_url').notNull().unique(),
});
