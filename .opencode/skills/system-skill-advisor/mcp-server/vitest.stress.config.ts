// ───────────────────────────────────────────────────────────────
// MODULE: System Skill Advisor Stress Vitest Config
// ───────────────────────────────────────────────────────────────

import { defineConfig } from 'vitest/config';

const STRESS_TIMEOUT_MS = 240_000;
const TEARDOWN_TIMEOUT_MS = 1_000;

export default defineConfig({
  root: import.meta.dirname,
  test: {
    include: [
      'stress-test/**/*.{vitest,test}.ts',
    ],
    exclude: [
      'node_modules',
      'dist',
      'tests/**',
      'bench/**',
    ],
    setupFiles: [
      '../../system-spec-kit/mcp-server/tests/_support/vitest-setup.ts',
    ],
    fileParallelism: false,
    globals: true,
    environment: 'node',
    testTimeout: STRESS_TIMEOUT_MS,
    teardownTimeout: TEARDOWN_TIMEOUT_MS,
  },
});
