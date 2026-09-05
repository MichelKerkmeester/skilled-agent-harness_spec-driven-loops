// ───────────────────────────────────────────────────────────────
// MODULE: Vitest Config
// ───────────────────────────────────────────────────────────────

import path from 'node:path';

import { defineConfig } from 'vitest/config';

const TEST_TIMEOUT_MS = 30_000; // 30s default, increase for CI if needed
const TEARDOWN_TIMEOUT_MS = 1_000;
const _INCLUDE_BENCHES = process.env.SPECKIT_RUN_BENCHES === 'true';

export default defineConfig({
  root: path.resolve(import.meta.dirname, '..'),
  test: {
    include: [
      'runtime/tests/**/*.{vitest,test}.ts',
      '../system-deep-loop/runtime/tests/**/*.{vitest,test}.ts',
    ],
    exclude: [
      'runtime/tests/archive/**',
      'runtime/cli/**',
    ],
    setupFiles: [
      path.resolve(import.meta.dirname, 'tests', '_support', 'vitest-setup.ts'),
    ],
    // Several script suites mutate shared process-level state and temp project roots.
    // Run files serially so the combined config remains deterministic.
    fileParallelism: false,
    globals: true,
    environment: 'node',
    reporters: ['default', 'hanging-process'],
    testTimeout: TEST_TIMEOUT_MS,
    teardownTimeout: TEARDOWN_TIMEOUT_MS,
    alias: {
      '@lib': path.resolve(import.meta.dirname, 'lib'),
      '@spec-kit/shared': path.resolve(import.meta.dirname, '..', 'shared'),
    },
  },
});
