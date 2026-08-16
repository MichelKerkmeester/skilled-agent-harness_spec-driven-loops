// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Static output for S3 + CloudFront, same shape as the Tomte site.
export default defineConfig({
  output: "static",
  site: "https://remoteforopencode.com",
  trailingSlash: "never",
  integrations: [sitemap()],
  build: {
    // /download.html → /download, so the CloudFront url-rewrite function
    // can keep paths clean.
    format: "file",
  },
});
