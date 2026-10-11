// ───────────────────────────────────────────────────────────────────
// MODULE: Template Phrase Lint Fail-Open Tests
// ───────────────────────────────────────────────────────────────────
// The pre-commit phrase gate must warn and exit 0 when its checks cannot run.
// The census module it reads frontmatter through requires js-yaml at module
// load, so a static import resolves that dependency before any guard exists and
// a clone without node_modules would crash the linter, which the hook reports
// as a phrase block nobody judged. This case runs a dependency-free copy of the
// linter inside a temp Git repository and pins the fail-open verdict.

import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const CLI_ROOT = resolve(import.meta.dirname, '..', 'cli');
const LINTER_RELATIVE_PATH = join('spec', 'template-phrase-lint.mjs');
const FIXTURE_FILES = [
  LINTER_RELATIVE_PATH,
  join('spec', 'template-phrase-census.mjs'),
  join('retrieval', 'lib', 'normalize.mjs'),
  join('retrieval', 'lib', 'phrase-judge.mjs'),
];

const roots: string[] = [];

/**
 * Copies the linter's import graph into a dependency-free temp Git repository,
 * preserving the relative layout its imports are written against.
 *
 * The temp root is canonicalized because the platform temp directory is itself
 * reached through a symlink on some systems, and the linter's direct-run guard
 * compares its launch path against the canonical location of its own file.
 */
function makeDependencyFreeRepo(): string {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'phrase-lint-fail-open-')));
  roots.push(root);

  for (const relativePath of FIXTURE_FILES) {
    const target = join(root, 'cli', relativePath);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(CLI_ROOT, relativePath), target);
  }

  execFileSync('git', ['init', '--quiet'], { cwd: root });
  return root;
}

afterEach(() => {
  while (roots.length > 0) {
    try {
      rmSync(roots.pop() as string, { recursive: true, force: true });
    } catch {
      // best-effort cleanup
    }
  }
});

describe('template-phrase-lint with no node_modules', () => {
  it('warns and exits 0 when the census module cannot load its YAML dependency', () => {
    const root = makeDependencyFreeRepo();
    expect(existsSync(join(root, 'node_modules'))).toBe(false);

    const env = { ...process.env };
    delete env.NODE_PATH;
    delete env.SPECKIT_SKIP_PHRASE_LINT;

    const result = spawnSync(process.execPath, [join(root, 'cli', LINTER_RELATIVE_PATH)], {
      cwd: root,
      encoding: 'utf8',
      env,
    });

    expect(result.status, result.stderr).toBe(0);
    expect(result.stderr).toContain('WARNING [gate:template-phrase-lint]: could not read staged phrases; checks skipped:');
    expect(result.stderr).toContain('js-yaml');
  });
});
