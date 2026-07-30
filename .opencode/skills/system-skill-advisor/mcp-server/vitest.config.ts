// ───────────────────────────────────────────────────────────────
// MODULE: System Skill Advisor Vitest Config
// ───────────────────────────────────────────────────────────────

import path from 'node:path';

const TEST_TIMEOUT_MS = 30_000;
const TEARDOWN_TIMEOUT_MS = 1_000;
const INCLUDE_BENCHES = process.env.SPECKIT_RUN_BENCHES === 'true';

// A plain object export instead of vitest's defineConfig wrapper: the config is
// loaded by node's own module graph, where a bare `vitest` import only resolves
// if node_modules exists next to this file. CI's lean routing job runs vitest
// via npx against a fresh checkout with no local install, so the config must
// not import from the vitest package at all. defineConfig is an identity
// type-helper; dropping it changes nothing at runtime.
export default ({
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
