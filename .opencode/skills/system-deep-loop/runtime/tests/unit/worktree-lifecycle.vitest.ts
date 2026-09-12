// ───────────────────────────────────────────────────────────────────
// MODULE: Lineage Worktree Lifecycle Unit Tests
// ───────────────────────────────────────────────────────────────────
// Exercises create / seed / remove against real temporary git repositories, so
// the behaviour this module leans on is verified against git itself rather than
// assumed: a worktree carries HEAD and nothing else, removal refuses a tree with
// untracked content, and a directory git no longer knows is not an error.
// The ownership lease is asserted through the lease module that wrote it, so a
// worktree is only ever "owned" in the sense a sweep would read.

import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WORKTREE_LEASE_FILENAME, isWorktreeReclaimable } from '../../lib/deep-loop/worktree-lease.js';
import {
  createLineageWorktree,
  removeLineageWorktree,
  seedWorktree,
} from '../../lib/deep-loop/worktree-lifecycle.js';

const LONG_TTL_MS = 300_000;
const GRACE_MS = 60_000;

/** The dependency root the default shared list links, relative to the repository root. */
const SHARED_DEPS_REL = '.opencode/skills/system-deep-loop/runtime/node_modules';

const tempRoots: string[] = [];

// git resolves its target repo/config from these env vars IN PREFERENCE to cwd/-C. Left in
// place, a poisoned parent env (routine inside git hooks, which share one .git/config)
// redirects a fixture's init/config/commit onto the real repository.
const GIT_ENV_REDIRECTORS = [
  'GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE',
  'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_CONFIG', 'GIT_CONFIG_GLOBAL', 'GIT_CONFIG_SYSTEM', 'GIT_CONFIG_COUNT',
  'GIT_NAMESPACE', 'GIT_CEILING_DIRECTORIES',
];

function cleanGitEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  for (const key of GIT_ENV_REDIRECTORS) delete env[key];
  return env;
}

function git(cwd: string, args: string[]): string {
  const result = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-C', cwd, ...args], {
    encoding: 'utf8',
    env: cleanGitEnv(),
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed in ${cwd}: ${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

interface Fixture {
  /** Repository the worktrees are created from. */
  repoRoot: string;
  /** Worktree base outside the repository, so the main checkout stays clean. */
  worktreeBase: string;
  /** Temp root holding both, so one cleanup removes the whole fixture. */
  root: string;
}

function makeFixture(): Fixture {
  const root = mkdtempSync(join(tmpdir(), 'worktree-lifecycle-'));
  tempRoots.push(root);
  const repoRoot = join(root, 'repo');
  mkdirSync(repoRoot, { recursive: true });
  git(repoRoot, ['init', '-q']);
  git(repoRoot, ['config', 'user.email', 'test@local']);
  git(repoRoot, ['config', 'user.name', 'test']);
  // Isolate from the developer's global gitignore, so a personal rule cannot hide the
  // fixture's untracked paths from a status comparison in these cases.
  git(repoRoot, ['config', 'core.excludesFile', '/dev/null']);
  writeFileSync(join(repoRoot, '.gitignore'), 'node_modules\n', 'utf8');
  writeFileSync(join(repoRoot, 'tracked.txt'), 'HEAD tracked\n', 'utf8');
  writeFileSync(join(repoRoot, 'staged-modified.txt'), 'HEAD staged-modified\n', 'utf8');
  git(repoRoot, ['add', '-A']);
  git(repoRoot, ['commit', '-q', '-m', 'fixture']);
  // Untracked in the main checkout, exactly as an installed dependency root is.
  mkdirSync(join(repoRoot, SHARED_DEPS_REL), { recursive: true });
  writeFileSync(join(repoRoot, SHARED_DEPS_REL, 'dep.txt'), 'installed dependency\n', 'utf8');
  return { repoRoot, worktreeBase: join(root, 'worktrees'), root };
}

const LINEAGE = { prefix: 'fanout', runId: 'run-1', label: 'lineage-a' } as const;

function expectedWorktreeDir(fixture: Fixture): string {
  return join(fixture.worktreeBase, `${LINEAGE.prefix}-${LINEAGE.runId}-${LINEAGE.label}`);
}

function createDefault(fixture: Fixture, overrides: Partial<Parameters<typeof createLineageWorktree>[0]> = {}) {
  return createLineageWorktree({
    repoRoot: fixture.repoRoot,
    worktreeBase: fixture.worktreeBase,
    ...LINEAGE,
    ownerPid: process.pid,
    ttlMs: LONG_TTL_MS,
    ...overrides,
  });
}

function readLeaseJson(worktreeDir: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(worktreeDir, WORKTREE_LEASE_FILENAME), 'utf8')) as Record<string, unknown>;
}

/** Byte-for-byte equality, stated as a comparison of the bytes rather than of decoded text. */
function expectSameBytes(actualPath: string, expectedPath: string): void {
  expect(Buffer.compare(readFileSync(actualPath), readFileSync(expectedPath))).toBe(0);
}

function statusOf(repoRoot: string): string {
  return git(repoRoot, ['status', '--porcelain=v1']);
}

/** Every tree git currently has registered, canonicalized so the comparison survives /var vs /private/var. */
function listedWorktrees(repoRoot: string): string[] {
  return git(repoRoot, ['worktree', 'list', '--porcelain'])
    .split('\n')
    .filter((line) => line.startsWith('worktree '))
    .map((line) => realpathSync(line.slice('worktree '.length)));
}

beforeEach(() => {
  // Deterministic shared-path list: the default list is what these cases exercise, and the
  // override is the launch wrapper's own knob, so an operator shell could otherwise redirect it.
  vi.stubEnv('SPECKIT_WORKTREE_SHARED_PATHS', '');
});

afterEach(() => {
  vi.unstubAllEnvs();
  while (tempRoots.length > 0) {
    const root = tempRoots.pop() as string;
    try {
      rmSync(root, { recursive: true, force: true });
    } catch {
      // best-effort cleanup
    }
  }
});

describe('worktree-lifecycle / create', () => {
  it('creates a detached worktree that carries an active lease', () => {
    const fixture = makeFixture();

    const result = createDefault(fixture);

    expect(result).toEqual({ ok: true, worktreeDir: expectedWorktreeDir(fixture) });
    if (!result.ok) return;
    const worktreeDir = result.worktreeDir;
    expect(existsSync(worktreeDir)).toBe(true);

    // HEAD is what the tree starts from: committed content is present.
    expect(readFileSync(join(worktreeDir, 'tracked.txt'), 'utf8')).toBe('HEAD tracked\n');

    // The lease is what marks it owned, and it is the record the sweep reads.
    const lease = readLeaseJson(worktreeDir);
    expect(lease.phase).toBe('active');
    expect(lease.packet_id).toBe(LINEAGE.runId);
    expect(lease.runtime_kind).toBe(LINEAGE.label);
    expect(lease.owner_pid).toBe(process.pid);
    expect(lease.ttl_ms).toBe(LONG_TTL_MS);
    expect(typeof lease.acquire_nonce).toBe('string');
    expect(isWorktreeReclaimable(worktreeDir, { graceMs: GRACE_MS })).toEqual({
      reclaimable: false,
      reason: 'heartbeat-not-stale',
    });

    // The dependency root is linked from the main checkout, not copied.
    const linkPath = join(worktreeDir, SHARED_DEPS_REL);
    expect(lstatSync(linkPath).isSymbolicLink()).toBe(true);
    expect(realpathSync(linkPath)).toBe(realpathSync(join(fixture.repoRoot, SHARED_DEPS_REL)));

    // The tree is registered with git, detached rather than branching off a named ref.
    expect(listedWorktrees(fixture.repoRoot)).toContain(realpathSync(worktreeDir));
    expect(git(fixture.repoRoot, ['worktree', 'list', '--porcelain'])).toContain('detached');
  });

  it('writes the lease only after the tree it describes is complete', () => {
    const fixture = makeFixture();

    // Stopping creation at the last step is the only way to observe the order: the lease
    // refuses an owner identity it cannot use, and everything the lane needs must already
    // be in place by then, while the tree itself must still read as unowned.
    const result = createDefault(fixture, { ttlMs: 0 });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/lease/i);

    const worktreeDir = expectedWorktreeDir(fixture);
    expect(existsSync(worktreeDir)).toBe(true);
    expect(lstatSync(join(worktreeDir, SHARED_DEPS_REL)).isSymbolicLink()).toBe(true);
    expect(existsSync(join(worktreeDir, WORKTREE_LEASE_FILENAME))).toBe(false);
  });

  it('returns a result instead of throwing when the name is not one path segment', () => {
    const fixture = makeFixture();

    const result = createDefault(fixture, { label: 'lineage/../../escape' });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBeTruthy();
    // Refused before git was ever asked, so not even the base directory was created.
    expect(existsSync(fixture.worktreeBase)).toBe(false);
  });
});

describe('worktree-lifecycle / seed', () => {
  interface SeedScenario extends Fixture {
    worktreeDir: string;
    /** Paths passed to the seed, in the order the assertions expect them copied. */
    seededPaths: string[];
  }

  /**
   * Build a worktree from HEAD, then change the working tree underneath it.
   *
   * The order is the point: the worktree is created first and so holds committed content
   * only, which is exactly the state a lineage dispatched without seeding would read.
   */
  function seedScenario(): SeedScenario {
    const fixture = makeFixture();
    const created = createDefault(fixture);
    if (!created.ok) {
      throw new Error(`fixture worktree could not be created: ${created.error}`);
    }

    writeFileSync(join(fixture.repoRoot, 'tracked.txt'), 'WORKING tracked\n', 'utf8'); // modified, unstaged
    writeFileSync(join(fixture.repoRoot, 'staged-new.txt'), 'STAGED new\n', 'utf8');
    writeFileSync(join(fixture.repoRoot, 'staged-modified.txt'), 'STAGED modified\n', 'utf8');
    git(fixture.repoRoot, ['add', 'staged-new.txt', 'staged-modified.txt']);
    mkdirSync(join(fixture.repoRoot, 'untracked', 'packet'), { recursive: true });
    writeFileSync(join(fixture.repoRoot, 'untracked', 'packet', 'notes.md'), 'UNTRACKED notes\n', 'utf8');

    return {
      ...fixture,
      worktreeDir: created.worktreeDir,
      seededPaths: ['tracked.txt', 'staged-modified.txt', 'staged-new.txt', 'untracked/packet/notes.md'],
    };
  }

  it('reproduces modified, staged and untracked content byte-for-byte', () => {
    const scenario = seedScenario();

    // The worktree carries HEAD and nothing else: this is what seeding has to fix.
    expect(readFileSync(join(scenario.worktreeDir, 'tracked.txt'), 'utf8')).toBe('HEAD tracked\n');
    expect(readFileSync(join(scenario.worktreeDir, 'staged-modified.txt'), 'utf8')).toBe('HEAD staged-modified\n');
    expect(existsSync(join(scenario.worktreeDir, 'staged-new.txt'))).toBe(false);
    expect(existsSync(join(scenario.worktreeDir, 'untracked'))).toBe(false);

    const statusBefore = statusOf(scenario.repoRoot);
    const result = seedWorktree({
      repoRoot: scenario.repoRoot,
      worktreeDir: scenario.worktreeDir,
      paths: scenario.seededPaths,
    });

    expect(result.ok).toBe(true);
    expect(result.copied).toEqual(scenario.seededPaths);
    expect(result.missing).toEqual([]);
    expect(result.errors).toEqual([]);

    for (const relativePath of scenario.seededPaths) {
      expectSameBytes(
        join(scenario.worktreeDir, relativePath),
        join(scenario.repoRoot, relativePath),
      );
    }

    // Named explicitly, because these are the three states the seed exists to cover.
    expect(readFileSync(join(scenario.worktreeDir, 'tracked.txt'), 'utf8')).toBe('WORKING tracked\n');
    expect(readFileSync(join(scenario.worktreeDir, 'staged-modified.txt'), 'utf8')).toBe('STAGED modified\n');
    expect(readFileSync(join(scenario.worktreeDir, 'staged-new.txt'), 'utf8')).toBe('STAGED new\n');
    expect(readFileSync(join(scenario.worktreeDir, 'untracked', 'packet', 'notes.md'), 'utf8')).toBe('UNTRACKED notes\n');

    // Seeding is a write into the worktree and nothing else.
    expect(statusOf(scenario.repoRoot)).toBe(statusBefore);
  });

  it('seeds a wholly untracked directory with its nested files', () => {
    const fixture = makeFixture();
    const created = createDefault(fixture);
    if (!created.ok) {
      throw new Error(`fixture worktree could not be created: ${created.error}`);
    }
    mkdirSync(join(fixture.repoRoot, 'packet', 'nested'), { recursive: true });
    writeFileSync(join(fixture.repoRoot, 'packet', 'spec.md'), 'SPEC\n', 'utf8');
    writeFileSync(join(fixture.repoRoot, 'packet', 'nested', 'task.md'), 'TASK\n', 'utf8');

    const result = seedWorktree({
      repoRoot: fixture.repoRoot,
      worktreeDir: created.worktreeDir,
      paths: ['packet'],
    });

    expect(result.ok).toBe(true);
    // Walk order is the filesystem's, so the membership is what is asserted.
    expect([...result.copied].sort()).toEqual(['packet/nested/task.md', 'packet/spec.md']);
    expect(result.errors).toEqual([]);
    expectSameBytes(join(created.worktreeDir, 'packet', 'spec.md'), join(fixture.repoRoot, 'packet', 'spec.md'));
    expectSameBytes(
      join(created.worktreeDir, 'packet', 'nested', 'task.md'),
      join(fixture.repoRoot, 'packet', 'nested', 'task.md'),
    );
  });

  it('never writes through a symlink the worktree already carries', () => {
    const fixture = makeFixture();
    const outsideTarget = join(fixture.root, 'outside-target.txt');
    writeFileSync(outsideTarget, 'OUTSIDE ORIGINAL\n', 'utf8');
    symlinkSync(outsideTarget, join(fixture.repoRoot, 'linked.txt'));
    git(fixture.repoRoot, ['add', 'linked.txt']);
    git(fixture.repoRoot, ['commit', '-q', '-m', 'link']);
    const created = createDefault(fixture);
    if (!created.ok) {
      throw new Error(`fixture worktree could not be created: ${created.error}`);
    }
    expect(lstatSync(join(created.worktreeDir, 'linked.txt')).isSymbolicLink()).toBe(true);

    rmSync(join(fixture.repoRoot, 'linked.txt'));
    writeFileSync(join(fixture.repoRoot, 'linked.txt'), 'SEEDED BYTES\n', 'utf8');
    const result = seedWorktree({
      repoRoot: fixture.repoRoot,
      worktreeDir: created.worktreeDir,
      paths: ['linked.txt'],
    });

    expect(result).toEqual({
      ok: true,
      copied: ['linked.txt'],
      missing: [],
      skipped: [],
      errors: [],
    });
    expect(lstatSync(join(created.worktreeDir, 'linked.txt')).isSymbolicLink()).toBe(false);
    expect(readFileSync(join(created.worktreeDir, 'linked.txt'), 'utf8')).toBe('SEEDED BYTES\n');
    expect(readFileSync(outsideTarget, 'utf8')).toBe('OUTSIDE ORIGINAL\n');
  });

  it('reports a path that is absent from the working tree without failing', () => {
    const fixture = makeFixture();
    writeFileSync(join(fixture.repoRoot, 'removed.txt'), 'HEAD removed\n', 'utf8');
    git(fixture.repoRoot, ['add', 'removed.txt']);
    git(fixture.repoRoot, ['commit', '-q', '-m', 'removable']);
    const created = createDefault(fixture);
    if (!created.ok) {
      throw new Error(`fixture worktree could not be created: ${created.error}`);
    }
    rmSync(join(fixture.repoRoot, 'removed.txt'));

    const result = seedWorktree({
      repoRoot: fixture.repoRoot,
      worktreeDir: created.worktreeDir,
      paths: ['removed.txt'],
    });

    expect(result).toEqual({
      ok: true,
      copied: [],
      missing: ['removed.txt'],
      skipped: [],
      errors: [],
    });
    // A seed only ever adds: the copy the worktree already has is left where it is.
    expect(readFileSync(join(created.worktreeDir, 'removed.txt'), 'utf8')).toBe('HEAD removed\n');
  });

  it('refuses a path that would leave the worktree', () => {
    const fixture = makeFixture();
    const created = createDefault(fixture);
    if (!created.ok) {
      throw new Error(`fixture worktree could not be created: ${created.error}`);
    }
    const decoy = join(fixture.root, 'escape.txt');
    writeFileSync(decoy, 'DECOY\n', 'utf8');

    const result = seedWorktree({
      repoRoot: fixture.repoRoot,
      worktreeDir: created.worktreeDir,
      paths: ['../escape.txt', '/etc/hosts', 'nested/../../escape.txt'],
    });

    expect(result.ok).toBe(false);
    expect(result.copied).toEqual([]);
    expect(result.errors).toHaveLength(3);
    expect(readFileSync(decoy, 'utf8')).toBe('DECOY\n');
    expect(existsSync(join(fixture.worktreeBase, 'escape.txt'))).toBe(false);
  });
});

describe('worktree-lifecycle / remove', () => {
  it('removes the worktree and leaves the main checkout untouched', () => {
    const fixture = makeFixture();
    const created = createDefault(fixture);
    if (!created.ok) {
      throw new Error(`fixture worktree could not be created: ${created.error}`);
    }
    const statusBefore = statusOf(fixture.repoRoot);
    const trackedBefore = readFileSync(join(fixture.repoRoot, 'tracked.txt'));
    // The lease is untracked content, so an unreleased lease is itself what would make
    // the unforced removal below fail.
    expect(existsSync(join(created.worktreeDir, WORKTREE_LEASE_FILENAME))).toBe(true);

    // No force: the lease has to be gone first, because git refuses any tree carrying
    // untracked content and the lease file is itself untracked.
    const result = removeLineageWorktree({
      repoRoot: fixture.repoRoot,
      worktreeDir: created.worktreeDir,
    });

    expect(result).toEqual({ ok: true, removed: true });
    expect(existsSync(created.worktreeDir)).toBe(false);
    expect(statusOf(fixture.repoRoot)).toBe(statusBefore);
    expect(Buffer.compare(readFileSync(join(fixture.repoRoot, 'tracked.txt')), trackedBefore)).toBe(0);
    // The registration went with the directory: only the main checkout is left.
    expect(listedWorktrees(fixture.repoRoot)).toEqual([realpathSync(fixture.repoRoot)]);
  });

  it('removes a tree the lane wrote into only when forced', () => {
    const fixture = makeFixture();
    const created = createDefault(fixture);
    if (!created.ok) {
      throw new Error(`fixture worktree could not be created: ${created.error}`);
    }
    writeFileSync(join(created.worktreeDir, 'artefact.md'), 'lane output\n', 'utf8');

    const refused = removeLineageWorktree({
      repoRoot: fixture.repoRoot,
      worktreeDir: created.worktreeDir,
    });

    expect(refused.ok).toBe(false);
    expect(refused.removed).toBe(false);
    expect(refused.error).toBeTruthy();
    expect(existsSync(created.worktreeDir)).toBe(true);

    const forced = removeLineageWorktree({
      repoRoot: fixture.repoRoot,
      worktreeDir: created.worktreeDir,
      force: true,
    });

    expect(forced).toEqual({ ok: true, removed: true });
    expect(existsSync(created.worktreeDir)).toBe(false);
  });

  it('treats an already-removed worktree as removed', () => {
    const fixture = makeFixture();
    const created = createDefault(fixture);
    if (!created.ok) {
      throw new Error(`fixture worktree could not be created: ${created.error}`);
    }
    removeLineageWorktree({ repoRoot: fixture.repoRoot, worktreeDir: created.worktreeDir });

    expect(removeLineageWorktree({ repoRoot: fixture.repoRoot, worktreeDir: created.worktreeDir })).toEqual({
      ok: true,
      removed: false,
    });
    expect(removeLineageWorktree({ repoRoot: fixture.repoRoot, worktreeDir: created.worktreeDir, force: true })).toEqual({
      ok: true,
      removed: false,
    });
    expect(
      removeLineageWorktree({
        repoRoot: fixture.repoRoot,
        worktreeDir: join(fixture.worktreeBase, 'never-created'),
      }),
    ).toEqual({ ok: true, removed: false });
  });
});
