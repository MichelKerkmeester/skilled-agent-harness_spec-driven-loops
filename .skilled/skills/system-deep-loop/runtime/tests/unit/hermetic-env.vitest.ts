// ───────────────────────────────────────────────────────────────────
// MODULE: Hermetic Test Env Helper Tests
// ───────────────────────────────────────────────────────────────────
//
// A spawned runner must not see the control switches or the git plumbing of
// the shell that launched the test run. A git hook exports GIT_DIR and friends,
// and an outer fan-out exports its lineage id, so either one would silently
// change what the child under test does.

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { resolveRepositoryRoot } from '../helpers/gateway-backed-lineage';
import { createHermeticEnv, HERMETIC_STRIPPED_ENV_KEYS } from '../helpers/spawn-cjs';

const LEAKED: Record<string, string> = {
  SPECKIT_FANOUT_LINEAGE_ID: 'leak',
  SPECKIT_PROVENANCE_CHECK: '1',
  SPECKIT_CLI_DISPATCH_STACK: 'cli-opencode',
  DEEP_LOOP_EVIDENCE_ENFORCEMENT: 'strict',
  DEEP_REVIEW_V2_ENFORCEMENT: 'off',
  DEEP_LOOP_TSX_LOADED: '1',
  DEEP_LOOP_LEDGER_BACKING_GATE: '0',
  DEEP_LOOP_REPO_ROOT: '/nonexistent',
  DEEP_LOOP_AUTHORITY_ROOT: '/nonexistent',
  GIT_DIR: '/nonexistent',
  GIT_WORK_TREE: '/nonexistent',
  GIT_INDEX_FILE: '/nonexistent/index',
  GIT_PREFIX: 'sub/',
  GIT_COMMON_DIR: '/nonexistent',
  GIT_OBJECT_DIRECTORY: '/nonexistent/objects',
};

const saved = new Map<string, string | undefined>();
const cleanups: Array<() => void> = [];

afterEach(() => {
  for (const [key, value] of saved) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  saved.clear();
  while (cleanups.length > 0) cleanups.pop()?.();
});

function leak(values: Record<string, string>): void {
  for (const [key, value] of Object.entries(values)) {
    if (!saved.has(key)) saved.set(key, process.env[key]);
    process.env[key] = value;
  }
}

describe('createHermeticEnv', () => {
  it('drops runner control switches and git plumbing inherited from the parent shell', () => {
    leak(LEAKED);
    const hermetic = createHermeticEnv('x');
    cleanups.push(hermetic.cleanup);

    for (const key of Object.keys(LEAKED)) {
      expect(hermetic.env, key).not.toHaveProperty(key);
    }
  });

  it('keeps the coverage database redirect and ordinary variables', () => {
    leak({ HERMETIC_ENV_PROBE: 'keep-me' });
    const hermetic = createHermeticEnv('x');
    cleanups.push(hermetic.cleanup);

    expect(hermetic.env.DEEP_LOOP_COVERAGE_DB_DIR).toBe(process.env.DEEP_LOOP_COVERAGE_DB_DIR);
    expect(hermetic.env.DEEP_LOOP_COVERAGE_DB_DIR).toBeTruthy();
    expect(hermetic.env.HERMETIC_ENV_PROBE).toBe('keep-me');
    expect(HERMETIC_STRIPPED_ENV_KEYS).not.toContain('DEEP_LOOP_COVERAGE_DB_DIR');
  });
});

describe('resolveRepositoryRoot', () => {
  it('returns the git toplevel of a vendored layout, not a fixed number of levels up', () => {
    const tmpRoot = mkdtempSync(join(tmpdir(), 'dlr-repo-root-'));
    cleanups.push(() => rmSync(tmpRoot, { recursive: true, force: true }));
    const project = join(tmpRoot, 'project');
    const nestedRuntime = join(project, 'skilled', '.skilled', 'skills', 'system-deep-loop', 'runtime');
    mkdirSync(nestedRuntime, { recursive: true });
    const init = spawnSync('git', ['init', '-q', project], { encoding: 'utf8' });
    expect(init.status, init.stderr).toBe(0);

    leak({ GIT_DIR: '/nonexistent', GIT_WORK_TREE: '/nonexistent' });
    expect(realpathSync(resolveRepositoryRoot(nestedRuntime))).toBe(realpathSync(project));
  });

  it('falls back to the folder that holds .skilled when no git checkout encloses it', () => {
    const tmpRoot = mkdtempSync(join(tmpdir(), 'dlr-repo-root-nogit-'));
    cleanups.push(() => rmSync(tmpRoot, { recursive: true, force: true }));
    const vendorRoot = join(tmpRoot, 'skilled');
    const nestedRuntime = join(vendorRoot, '.skilled', 'skills', 'system-deep-loop', 'runtime');
    mkdirSync(nestedRuntime, { recursive: true });

    leak({ GIT_CEILING_DIRECTORIES: realpathSync(tmpRoot) });
    expect(realpathSync(resolveRepositoryRoot(nestedRuntime))).toBe(realpathSync(vendorRoot));
  });
});
