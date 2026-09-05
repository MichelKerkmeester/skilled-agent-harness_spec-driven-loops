// ───────────────────────────────────────────────────────────────
// MODULE: Root Vitest configuration
// ───────────────────────────────────────────────────────────────

import path from 'node:path';

const TEST_TIMEOUT_MS = 30_000;
const TEARDOWN_TIMEOUT_MS = 1_000;

// The CLI workspace nests inside runtime/ and its own tsconfig chain resolves
// modules under 'nodenext' (its cross-skill '.js'-suffixed imports resolve to
// sibling '.ts' sources); the skill-root tsconfig above it still resolves under
// plain 'node'. A single shared root/include set here would run CLI test files
// under the wrong resolution mode and break those cross-skill imports, so the
// CLI suite gets its own project rooted at runtime/cli instead. Both projects
// carry the same timeout/parallelism settings as runtime/vitest.config.ts so a
// project picked up through this config never silently falls back to vitest's
// bare 5s default.
export default {
  test: {
    projects: [
      {
        test: {
          root: path.resolve(__dirname),
          include: [
            'tests/**/*.vitest.ts',
            'runtime/tests/**/*.vitest.ts',
          ],
          setupFiles: [
            path.resolve(__dirname, 'runtime', 'tests', '_support', 'vitest-setup.ts'),
          ],
          globals: true,
          environment: 'node',
          fileParallelism: false,
          testTimeout: TEST_TIMEOUT_MS,
          teardownTimeout: TEARDOWN_TIMEOUT_MS,
          name: 'root',
        },
      },
      {
        test: {
          root: path.resolve(__dirname, 'runtime', 'cli'),
          include: [
            'tests/**/*.vitest.ts',
          ],
          setupFiles: [
            path.resolve(__dirname, 'runtime', 'tests', '_support', 'vitest-setup.ts'),
          ],
          globals: true,
          environment: 'node',
          fileParallelism: false,
          testTimeout: TEST_TIMEOUT_MS,
          teardownTimeout: TEARDOWN_TIMEOUT_MS,
          name: 'cli',
        },
      },
    ],
  },
};
