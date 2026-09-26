import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    exclude: process.env.JEV_E2E ? [] : ["test/e2e.test.ts"],
    globalSetup: ["test/setup/build.ts"],
    testTimeout: 30_000,
    coverage: {
      provider: "v8",
      include: ["src/**"],
      exclude: ["src/cli.ts"],
      reporter: ["text", "lcov"],
    },
  },
});
