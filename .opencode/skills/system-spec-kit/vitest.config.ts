// ───────────────────────────────────────────────────────────────
// MODULE: Root Vitest configuration
// ───────────────────────────────────────────────────────────────

import path from 'node:path';

export default {
  test: {
    include: [
      'tests/**/*.vitest.ts',
      'scripts/tests/**/*.vitest.ts',
      'mcp-server/tests/**/*.vitest.ts',
    ],
    setupFiles: [
      path.resolve(__dirname, 'mcp-server', 'tests', '_support', 'vitest-setup.ts'),
    ],
    globals: true,
  },
};
