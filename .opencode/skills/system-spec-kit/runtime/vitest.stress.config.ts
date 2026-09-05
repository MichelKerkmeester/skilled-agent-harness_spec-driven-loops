// ───────────────────────────────────────────────────────────────
// MODULE: Vitest Stress Config
// ───────────────────────────────────────────────────────────────

import path from 'node:path';

import { defineConfig } from 'vitest/config';

const STRESS_TIMEOUT_MS = 240_000;
const TEARDOWN_TIMEOUT_MS = 1_000;

export default defineConfig({
  root: path.resolve(import.meta.dirname, '..'),
  test: {
    include: [
      'runtime/stress-test/**/*.{vitest,test}.ts',
    ],
    exclude: [
      'runtime/tests/**',
      'scripts/tests/**',
    ],
    setupFiles: [
      path.resolve(import.meta.dirname, 'tests', '_support', 'vitest-setup.ts'),
    ],
    fileParallelism: false,
    globals: true,
    environment: 'node',
    testTimeout: STRESS_TIMEOUT_MS,
    teardownTimeout: TEARDOWN_TIMEOUT_MS,
    alias: {
      '@lib': path.resolve(import.meta.dirname, 'lib'),
    },
  },
});
