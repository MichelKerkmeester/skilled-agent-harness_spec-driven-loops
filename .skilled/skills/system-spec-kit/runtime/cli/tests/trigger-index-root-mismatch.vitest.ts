// ───────────────────────────────────────────────────────────────────
// MODULE: Trigger Index Root Mismatch Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { DEFAULT_REPO_ROOT } from '../retrieval/generate-trigger-index.mjs';

const GENERATOR_SCRIPT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'retrieval',
  'generate-trigger-index.mjs',
);
const WARNING = 'generate-trigger-index: indexing';

const tempRoots = new Set<string>();

afterEach(() => {
  for (const dir of tempRoots) {
    fs.rmSync(dir, { force: true, recursive: true });
  }
  tempRoots.clear();
});

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(fs.realpathSync(tmpdir()), prefix));
  tempRoots.add(dir);
  return dir;
}

/** Runs check mode against a scratch index path, so nothing tracked is written. */
function runCheck(cwd: string, extra: string[] = []) {
  const out = path.join(makeTempDir('speckit-trigger-root-out-'), 'idx.json');
  return spawnSync(process.execPath, [GENERATOR_SCRIPT, '--check', '--out', out, ...extra], {
    cwd,
    encoding: 'utf8',
  });
}

describe('generate-trigger-index root mismatch warning', () => {
  it('names both roots when the working directory is another git repository', () => {
    const repo = makeTempDir('speckit-trigger-root-foreign-');
    fs.mkdirSync(path.join(repo, '.git'));

    const run = runCheck(repo);

    expect(run.stderr).toContain(WARNING);
    expect(run.stderr).toContain(fs.realpathSync(DEFAULT_REPO_ROOT));
    expect(run.stderr).toContain(repo);
  });

  it('stays quiet when the working directory is this repository', () => {
    const run = runCheck(DEFAULT_REPO_ROOT);

    expect(run.stderr).not.toContain(WARNING);
  });

  it('stays quiet when --repo-root names the caller repository', () => {
    const repo = makeTempDir('speckit-trigger-root-flag-');
    fs.mkdirSync(path.join(repo, '.git'));

    const run = runCheck(repo, ['--repo-root', '.']);

    expect(run.stderr).not.toContain(WARNING);
  });
});
