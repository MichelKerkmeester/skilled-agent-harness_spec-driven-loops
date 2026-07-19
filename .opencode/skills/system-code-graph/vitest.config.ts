// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Vitest Configuration
// ───────────────────────────────────────────────────────────────

import { defineConfig } from 'vitest/config';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '../../..');

export default defineConfig({
  root: repoRoot,
  test: {
    include: [
      '.opencode/skills/system-code-graph/mcp-server/tests/**/*.{vitest,test}.ts',
      '.opencode/skills/system-code-graph/mcp-server/stress-test/code-graph/**/*.{vitest,test}.ts',
      '.opencode/skills/system-code-graph/runtime/**/*.{vitest,test}.ts',
    ],
    exclude: ['node_modules', 'dist'],
    globals: false,
    testTimeout: 30000,
  },
});
