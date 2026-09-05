// ───────────────────────────────────────────────────────────────
// MODULE: Root Vitest configuration
// ───────────────────────────────────────────────────────────────

import path from 'node:path';

const TEST_TIMEOUT_MS = 30_000;
const TEARDOWN_TIMEOUT_MS = 1_000;

// The CLI workspace nests inside runtime/ and carries its own tsconfig and
// package root; its cross-skill '.js'-suffixed imports only resolve when the
// files run from that root. A single shared root/include set here collected
// CLI test files from the skill root and broke those imports, so the CLI suite
// gets its own project rooted at runtime/cli instead. Both projects
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
