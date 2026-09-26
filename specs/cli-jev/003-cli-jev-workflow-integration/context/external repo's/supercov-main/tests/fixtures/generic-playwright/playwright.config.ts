import { defineConfig } from "@playwright/test";

const browserName = (process.env["SUPERCOV_BROWSER"] ?? "chromium") as
  | "chromium"
  | "firefox"
  | "webkit";

export default defineConfig({
  testDir: ".",
  testMatch: ["tests/e2e/**/*.spec.ts", "specs/**/*.spec.cjs"],
  // The coverage adapter must preserve exact attribution across independent
  // Playwright worker processes sharing one application server.
  workers: 2,
  // Exercise exact attempt identity and final-outcome filtering on every
  // engine/runner parity pass, not only in analyzer unit tests.
  retries: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4397",
    browserName,
    launchOptions: {
      executablePath: process.env["SUPERCOV_CHROME"] || undefined,
    },
  },
  webServer: {
    command: "node server.mjs",
    url: "http://127.0.0.1:4397",
    reuseExistingServer: false,
  },
});
