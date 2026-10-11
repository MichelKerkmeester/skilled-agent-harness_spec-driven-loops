// ───────────────────────────────────────────────────────────────────
// MODULE: Vitest Config - Hooks
// ───────────────────────────────────────────────────────────────────

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'vitest/config';

const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..');
const OPENCODE_ROOT = path.join(REPO_ROOT, '.skilled');
const HOOKS_ROOT = import.meta.dirname;

// Some hook suites are written for `node --test` or plain `node`, which CI and each README
// run directly. Vitest reports such a file as "No test suite found" and fails the whole
// run, so a directory run skips every JavaScript test file that does not import vitest.
function nodeTestFiles(): string[] {
  return readdirSync(HOOKS_ROOT, { recursive: true, encoding: 'utf8' })
    .filter((rel) => /\.test\.(?:mjs|cjs|js)$/.test(rel) && !rel.split(path.sep).includes('node_modules'))
    .filter((rel) => !/(?:from\s+|require\()['"]vitest['"]/.test(readFileSync(path.join(HOOKS_ROOT, rel), 'utf8')))
    .map((rel) => path.relative(REPO_ROOT, path.join(HOOKS_ROOT, rel)));
}

// Hook sources load through runtime symlinks, so their relative imports are written
// against the link's base; the alias resolves those same imports from the real tree.
export default defineConfig({
  root: REPO_ROOT,
  resolve: {
    alias: [
      {
        find: /^(\.\.\/)+\.(?:skilled|opencode)\//,
        replacement: `${OPENCODE_ROOT}/`,
      },
    ],
  },
  test: {
    // Root is the repository so hook imports resolve; collection stays inside the hooks tree.
    include: [`${path.relative(REPO_ROOT, HOOKS_ROOT)}/**/*.{test,spec}.?(c|m)[jt]s?(x)`],
    exclude: [
      '**/node_modules/**',
      '**/.git/**',
      '**/.worktrees/**',
      '**/.claude/worktrees/**',
      ...nodeTestFiles(),
    ],
  },
});
