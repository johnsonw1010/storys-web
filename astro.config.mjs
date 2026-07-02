import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://storys.fm",
  output: "hybrid",
  trailingSlash: "ignore",

  // Brand id renamed zhenfan → zhenfang (matches the Master Sheet); keep the old URL alive.
  redirects: {
    "/brands/zhenfan": "/brands/zhenfang",
  },

  build: {
    inlineStylesheets: "auto",
  },

  adapter: cloudflare()
});