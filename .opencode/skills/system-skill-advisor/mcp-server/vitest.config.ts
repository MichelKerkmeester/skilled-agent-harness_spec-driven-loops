// ───────────────────────────────────────────────────────────────
// MODULE: System Skill Advisor Vitest Config
// ───────────────────────────────────────────────────────────────

import path from 'node:path';

import { defineConfig } from 'vitest/config';

const TEST_TIMEOUT_MS = 30_000;
const TEARDOWN_TIMEOUT_MS = 1_000;
const INCLUDE_BENCHES = process.env.SPECKIT_RUN_BENCHES === 'true';

export default defineConfig({
  root: import.meta.dirname,
  test: {
    include: [
      'tests/**/*.vitest.ts',
      ...(INCLUDE_BENCHES ? ['bench/**/*.bench.ts'] : []),
    ],
    exclude: [
      'node_modules',
      'dist',
      ...(INCLUDE_BENCHES ? [] : ['bench/**/*.bench.ts']),
    ],
    setupFiles: [
      path.resolve(import.meta.dirname, '../../system-spec-kit/mcp-server/tests/_support/vitest-setup.ts'),
    ],
    fileParallelism: false,
    globals: true,
    environment: 'node',
    testTimeout: TEST_TIMEOUT_MS,
    teardownTimeout: TEARDOWN_TIMEOUT_MS,
    alias: {
      '@lib': path.resolve(import.meta.dirname, 'lib'),
    },
  },
});
