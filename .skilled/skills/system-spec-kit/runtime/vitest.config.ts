// ───────────────────────────────────────────────────────────────────
// MODULE: Vitest Config
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';

import { defineConfig } from 'vitest/config';

// A safety cap for a hung test. Files run side by side, so a heavy test takes longer than it does alone.
const TEST_TIMEOUT_MS = 120_000;
const TEARDOWN_TIMEOUT_MS = 1_000;
const _INCLUDE_BENCHES = process.env.SPECKIT_RUN_BENCHES === 'true';

export default defineConfig({
  root: path.resolve(import.meta.dirname, '..'),
  test: {
    // The deep-loop suite runs under its own config and CI job, so it is not collected here.
    include: [
      'runtime/tests/**/*.{vitest,test}.ts',
    ],
    exclude: [
      'runtime/cli/**',
    ],
    setupFiles: [
      path.resolve(import.meta.dirname, 'tests', '_support', 'vitest-setup.ts'),
    ],
    // Files run side by side. Each file runs in its own worker process, and the
    // setup file gives each one its own scratch database directory.
    fileParallelism: true,
    globals: true,
    environment: 'node',
    reporters: ['default', 'hanging-process'],
    testTimeout: TEST_TIMEOUT_MS,
    teardownTimeout: TEARDOWN_TIMEOUT_MS,
    alias: [
      { find: '@lib', replacement: path.resolve(import.meta.dirname, 'lib') },
      { find: '@spec-kit/shared', replacement: path.resolve(import.meta.dirname, '..', 'shared') },
      // Hook sources load from their real folder under `.pi`/`.opencode`, where each
      // entry file re-exports the adapter. A few hooks still carry a long
      // `../../.skilled/...` specifier left from the link-based layout, and only this
      // alias resolves it, in tests. The alias points those specifiers at the real
      // tree, mirroring the hooks config.
      {
        find: /^(\.\.\/)+\.(?:skilled|opencode)\//,
        replacement: `${path.resolve(import.meta.dirname, '..', '..', '..')}/`,
      },
    ],
  },
});
