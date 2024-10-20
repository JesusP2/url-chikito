// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react(), tailwind()],
  env: {
    schema: {
      PUBLIC_URL: envField.string({
        context: "client",
        access: "public",
      }),
      DATABASE_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      DATABASE_URL: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});
