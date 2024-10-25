import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { crc32 } from "crc";
import { sql } from "drizzle-orm";
import { db } from "../lib/db";
import { urlsTable } from "../lib/db/schema";
import puppeteer from "puppeteer";

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
        const longUrl = input.url.startsWith("http")
          ? input.url
          : "http://" + input.url;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
          width: 768,
          height: 425,
          deviceScaleFactor: 1,
        });
        try {
          await page.goto(longUrl);
          // get the title from the newly loaded page
          const title =
            (await page.$eval(`head > title`, (el) => el.textContent)) || null;

          // get the descriptions of the page using their CSS selectors
          const descriptions = await page.evaluate(() => {
            const descriptions: {
              desc: string | null;
              content: string;
              og: string | null;
              twitter: string | null;
            } = {} as any;

            let desc = document.querySelector(`meta[name='description']`) as any;
            let og = document.querySelector(`meta[property='og:description']`) as any;
            let twitter = document.querySelector(
              `meta[property='twitter:description']`
            ) as any;

            desc
              ? (descriptions.desc = desc.content)
              : (descriptions.desc = null);
            og ? (descriptions.og = og.content) : (descriptions.og = null);
            twitter
              ? (descriptions.twitter = twitter.content)
              : (descriptions.twitter = null);

            return descriptions;
          });

          // screenshot the page as a jpeg with a base64 encoding
          const screenshot = await page.screenshot({
            type: "jpeg",
            encoding: "base64",
          });
          console.log(screenshot.slice(0, 50));
          console.log(descriptions);
          // close the browser
          await browser.close();

          await db.insert(urlsTable).values({
            shortUrl: hash,
            longUrl,
          });
          return {
            hash,
            title,
            screenshot,
            description:
              descriptions.desc ||
              descriptions.og ||
              descriptions.twitter ||
              "",
          };
        } catch (err) {
          await browser.close();
          return {
            error: "Failed to shorten url, please try again.",
          };
        }
      }
      return {
        hash,
      };
    },
  }),
};
