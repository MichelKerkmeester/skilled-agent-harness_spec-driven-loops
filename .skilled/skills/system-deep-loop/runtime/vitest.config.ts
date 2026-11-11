// MODULE: runtime/ Vitest Config
//
// Self-contained discovery config so the runtime suite runs from this skill
// root (npm test) without borrowing the system-spec-kit runtime config.
// It is the only config that collects these tests, locally and in CI.

import { defineConfig } from 'vitest/config';
import path from 'node:path';

// A safety cap for a hung test. Ledger tests fsync heavily and take up to 23 s alone, and longer when files run side by side.
const TEST_TIMEOUT_MS = 120_000;
const TEARDOWN_TIMEOUT_MS = 1_000;

// Tests that measure elapsed time, kill child processes or race for the graph
// lock assume a quiet machine. They run after the rest, one file at a time.
const SERIAL_FILES = [
  'tests/stress/**/*.{vitest,test}.ts',
  'tests/lifecycle/**/*.{vitest,test}.ts',
  'tests/unit/fanout-run.vitest.ts',
  'tests/unit/lineage-timestamp-window.vitest.ts',
  'tests/integration/deep-research-postflip-fanout.vitest.ts',
];

const shared = {
  globals: true,
  environment: 'node' as const,
  setupFiles: [
    path.resolve(import.meta.dirname, 'tests', '_support', 'hermetic-opencode-path.ts'),
  ],
  testTimeout: TEST_TIMEOUT_MS,
  teardownTimeout: TEARDOWN_TIMEOUT_MS,
};

export default defineConfig({
  root: path.resolve(import.meta.dirname),
  test: {
    projects: [
      {
        // Every other file runs side by side, each in its own worker process
        // with its own temp roots and databases.
        test: {
          ...shared,
          name: 'parallel',
          root: path.resolve(import.meta.dirname),
          include: ['tests/**/*.{vitest,test}.ts'],
          exclude: SERIAL_FILES,
          fileParallelism: true,
          sequence: { groupOrder: 0 },
        },
      },
      {
        test: {
          ...shared,
          name: 'serial',
          root: path.resolve(import.meta.dirname),
          include: SERIAL_FILES,
          fileParallelism: false,
          sequence: { groupOrder: 1 },
        },
      },
    ],
  },
});
