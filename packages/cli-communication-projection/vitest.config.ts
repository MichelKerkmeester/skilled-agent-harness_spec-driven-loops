// ───────────────────────────────────────────────────────────────────
// MODULE: Contract Test Configuration
// ───────────────────────────────────────────────────────────────────

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    testTimeout: 10_000,
    // Run test files serially: latency benchmarks must measure in a stable
    // environment, and parallel worker contention inflates their p95 above the
    // provisional budgets, making the shared gate non-deterministic.
    fileParallelism: false,
  },
});
