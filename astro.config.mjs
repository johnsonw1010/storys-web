import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://storys.fm",
  output: "hybrid",
  trailingSlash: "ignore",

  build: {
    inlineStylesheets: "auto",
  },

  adapter: cloudflare()
});