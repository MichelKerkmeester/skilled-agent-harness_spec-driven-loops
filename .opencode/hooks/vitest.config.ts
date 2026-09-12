// ───────────────────────────────────────────────────────────────────
// MODULE: Vitest Config - Hooks
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';

import { defineConfig } from 'vitest/config';

const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..');
const OPENCODE_ROOT = path.join(REPO_ROOT, '.opencode');

// Hook sources load through runtime symlinks, so their relative imports are written
// against the link's base; the alias resolves those same imports from the real tree.
export default defineConfig({
  root: REPO_ROOT,
  resolve: {
    alias: [
      {
        find: /^(\.\.\/)+\.opencode\//,
        replacement: `${OPENCODE_ROOT}/`,
      },
    ],
  },
  test: {
    exclude: [
      '**/node_modules/**',
      '**/.git/**',
      '**/.worktrees/**',
      '**/.claude/worktrees/**',
    ],
  },
});
