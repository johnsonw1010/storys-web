import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://storys.fm",
  output: "static",
  trailingSlash: "ignore",
  build: {
    inlineStylesheets: "auto",
  },
});
