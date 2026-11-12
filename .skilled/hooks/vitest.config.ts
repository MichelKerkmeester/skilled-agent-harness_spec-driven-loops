// ───────────────────────────────────────────────────────────────────
// MODULE: Vitest Config - Hooks
// ───────────────────────────────────────────────────────────────────

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'vitest/config';

const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..');
const SKILLED_ROOT = path.join(REPO_ROOT, '.skilled');
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

// Pi imports a hook source from the real folder its entry file re-exports it from, so the
// relative imports are written for that folder; a few adapters also keep a long specifier left
// from the link-based layout. A literal one resolves only through the alias below, in tests, never
// from the adapter's own folder; one held in a constant resolves nowhere.
export default defineConfig({
  root: REPO_ROOT,
  resolve: {
    alias: [
      {
        find: /^(\.\.\/)+\.(?:skilled|opencode)\//,
        replacement: `${SKILLED_ROOT}/`,
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
