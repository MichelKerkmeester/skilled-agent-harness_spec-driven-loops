// ───────────────────────────────────────────────────────────────────
// MODULE: Worktree Reclaim Sweep Unit Tests
// ───────────────────────────────────────────────────────────────────
// Runs the sweep against real temporary git repositories, so every case meets the
// state a sweep actually faces in production: a live peer whose heartbeat went
// quiet, a run that died mid-flight, this run's own trees, the lanes a resume is
// about to requeue, and a tree retained on purpose after a failed publish. Each
// case reads the recorded decision reasons, because "nothing was deleted" is also
// true of a sweep that considered nothing at all.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { acquireLoopLock, processAlive, releaseLoopLock } from '../../lib/deep-loop/loop-lock.js';
import { WORKTREE_LEASE_FILENAME, isWorktreeReclaimable, setWorktreeLeaseState, writeWorktreeLease } from '../../lib/deep-loop/worktree-lease.js';
import { createLineageWorktree } from '../../lib/deep-loop/worktree-lifecycle.js';
import { reclaimWorktrees, worktreePrefixLeasePath } from '../../lib/deep-loop/worktree-reclaim.js';
import type { ReclaimWorktreesInput, ReclaimWorktreesResult } from '../../lib/deep-loop/worktree-reclaim.js';

const PREFIX = 'fanout';
const CURRENT_RUN_ID = 'run-current';
/** Expires inside a test without sleeping, but still a positive lease budget. */
const TINY_TTL_MS = 1;
const LONG_TTL_MS = 300_000;
const GRACE_MS = 60_000;

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
  const root = mkdtempSync(join(tmpdir(), 'worktree-reclaim-'));
  tempRoots.push(root);
  const repoRoot = join(root, 'repo');
  mkdirSync(repoRoot, { recursive: true });
  git(repoRoot, ['init', '-q']);
  git(repoRoot, ['config', 'user.email', 'test@local']);
  git(repoRoot, ['config', 'user.name', 'test']);
  git(repoRoot, ['config', 'core.excludesFile', '/dev/null']);
  writeFileSync(join(repoRoot, 'tracked.txt'), 'HEAD tracked\n', 'utf8');
  git(repoRoot, ['add', '-A']);
  git(repoRoot, ['commit', '-q', '-m', 'fixture']);
  return { repoRoot, worktreeBase: join(root, 'worktrees'), root };
}

function listedWorktreePaths(repoRoot: string): string[] {
  return git(repoRoot, ['worktree', 'list', '--porcelain'])
    .split('\n')
    .filter((line) => line.startsWith('worktree '))
    .map((line) => line.slice('worktree '.length));
}

/** Backdate the lease heartbeat so the record expires without waiting out its ttl. */
function ageLeaseHeartbeat(worktreeDir: string): void {
  const leasePath = join(worktreeDir, WORKTREE_LEASE_FILENAME);
  const record = JSON.parse(readFileSync(leasePath, 'utf8')) as Record<string, unknown>;
  record.last_heartbeat_iso = new Date(Date.now() - 3_600_000).toISOString();
  writeFileSync(leasePath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
}

function knownDeadPid(): number {
  for (let pid = 999_999; pid > 900_000; pid -= 1) {
    if (!processAlive(pid)) return pid;
  }
  throw new Error('Could not find a known-dead pid for worktree-reclaim test');
}

interface EntrySpec {
  runId: string;
  label: string;
  ownerPid: number;
  ttlMs: number;
  /** Push the heartbeat an hour into the past, past any ttl. */
  stale?: boolean;
  /** Terminal lease state to write after creation. */
  state?: 'claimed' | 'retained';
}

function createEntry(fixture: Fixture, spec: EntrySpec): string {
  const result = createLineageWorktree({
    repoRoot: fixture.repoRoot,
    worktreeBase: fixture.worktreeBase,
    prefix: PREFIX,
    runId: spec.runId,
    label: spec.label,
    ownerPid: spec.ownerPid,
    ttlMs: spec.ttlMs,
  });
  if (!result.ok) {
    throw new Error(`fixture worktree failed: ${result.error}`);
  }
  if (spec.stale === true) {
    ageLeaseHeartbeat(result.worktreeDir);
  }
  if (spec.state !== undefined && !setWorktreeLeaseState(result.worktreeDir, spec.state)) {
    throw new Error('fixture lease state transition failed');
  }
  return result.worktreeDir;
}

/** A dead run's tree: dead owner, expired heartbeat, still an active lease. */
function createDeadEntry(fixture: Fixture, runId: string, label: string): string {
  return createEntry(fixture, {
    runId,
    label,
    ownerPid: knownDeadPid(),
    ttlMs: TINY_TTL_MS,
    stale: true,
  });
}

function reclaim(
  fixture: Fixture,
  overrides: Partial<ReclaimWorktreesInput> = {},
): ReclaimWorktreesResult {
  return reclaimWorktrees({
    repoRoot: fixture.repoRoot,
    worktreeBase: fixture.worktreeBase,
    prefix: PREFIX,
    currentRunId: CURRENT_RUN_ID,
    ownerPid: process.pid,
    resumableLabels: [],
    graceMs: GRACE_MS,
    ttlMs: LONG_TTL_MS,
    ...overrides,
  });
}

beforeEach(() => {
  // Deterministic shared-path list: this fixture has none of the default dependency
  // roots, and the override is the launch wrapper's own knob, so an operator shell
  // could otherwise redirect what creation tries to link.
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

describe('worktree-reclaim / liveness', () => {
  it('keeps a live peer’s worktree and names its liveness', () => {
    const fixture = makeFixture();
    const liveDir = createEntry(fixture, {
      runId: 'run-live',
      label: 'lineage-live',
      ownerPid: process.pid,
      ttlMs: TINY_TTL_MS,
      stale: true,
    });

    // The heartbeat alone reads as expired, so the live owner is the only reason
    // this tree must survive.
    expect(isWorktreeReclaimable(liveDir, { graceMs: GRACE_MS })).toEqual({
      reclaimable: false,
      reason: 'owner-process-alive',
    });

    const result = reclaim(fixture);

    expect(result).toEqual({
      decisions: [{ path: liveDir, action: 'kept', reason: 'owner-process-alive' }],
      reclaimed: 0,
      kept: 1,
    });
    expect(existsSync(liveDir)).toBe(true);
    expect(existsSync(join(liveDir, 'tracked.txt'))).toBe(true);
  });

  it('reclaims a worktree whose owner died and heartbeat expired', () => {
    const fixture = makeFixture();
    const deadDir = createDeadEntry(fixture, 'run-dead', 'lineage-dead');

    expect(isWorktreeReclaimable(deadDir, { graceMs: GRACE_MS })).toEqual({
      reclaimable: true,
      reason: 'stale-lease-owner-dead',
    });

    const result = reclaim(fixture);

    expect(result.reclaimed).toBe(1);
    expect(result.kept).toBe(0);
    expect(result.decisions).toEqual([
      { path: deadDir, action: 'reclaimed', reason: 'stale-lease-owner-dead' },
    ]);
    expect(existsSync(deadDir)).toBe(false);
    expect(listedWorktreePaths(fixture.repoRoot).some((path) => path.endsWith(basename(deadDir)))).toBe(false);
    // The whole pass is done, so its own prefix lease is gone again.
    expect(existsSync(worktreePrefixLeasePath(fixture.worktreeBase, PREFIX))).toBe(false);
  });
});

describe('worktree-reclaim / ownership guards', () => {
  it('never touches the current run’s own worktrees', () => {
    const fixture = makeFixture();
    const ownDir = createEntry(fixture, {
      runId: CURRENT_RUN_ID,
      label: 'lineage-own',
      ownerPid: knownDeadPid(),
      ttlMs: TINY_TTL_MS,
      stale: true,
    });

    // Dead to the liveness delegate; the current-run guard is the only thing
    // standing between this tree and removal.
    expect(isWorktreeReclaimable(ownDir, { graceMs: GRACE_MS }).reclaimable).toBe(true);

    const result = reclaim(fixture);

    expect(result).toEqual({
      decisions: [{ path: ownDir, action: 'kept', reason: 'entry-belongs-to-current-run' }],
      reclaimed: 0,
      kept: 1,
    });
    expect(existsSync(ownDir)).toBe(true);
    expect(existsSync(join(ownDir, WORKTREE_LEASE_FILENAME))).toBe(true);
  });

  it('keeps a resumable label even when its lease looks dead, and reclaims it once the label is not resumable', () => {
    const fixture = makeFixture();
    const resumableDir = createDeadEntry(fixture, 'run-orphan', 'lineage-resume');

    // A sweep that ran before the ledger read would take this tree: the ledger, not
    // liveness, is the only discriminator for an orphaned lane.
    expect(isWorktreeReclaimable(resumableDir, { graceMs: GRACE_MS }).reclaimable).toBe(true);

    const guarded = reclaim(fixture, { resumableLabels: ['lineage-resume'] });
    expect(guarded).toEqual({
      decisions: [{ path: resumableDir, action: 'kept', reason: 'resumable-label' }],
      reclaimed: 0,
      kept: 1,
    });
    expect(existsSync(resumableDir)).toBe(true);

    // Same tree, same dead lease, no resumable claim: now the sweep may take it.
    const unguarded = reclaim(fixture, { resumableLabels: [] });
    expect(unguarded.reclaimed).toBe(1);
    expect(unguarded.decisions).toEqual([
      { path: resumableDir, action: 'reclaimed', reason: 'stale-lease-owner-dead' },
    ]);
    expect(existsSync(resumableDir)).toBe(false);
  });

  it('never reclaims a worktree retained after a failed publish', () => {
    const fixture = makeFixture();
    const retainedDir = createEntry(fixture, {
      runId: 'run-publish',
      label: 'lineage-retained',
      ownerPid: knownDeadPid(),
      ttlMs: TINY_TTL_MS,
      stale: true,
      state: 'retained',
    });

    const result = reclaim(fixture);

    expect(result).toEqual({
      decisions: [{ path: retainedDir, action: 'kept', reason: 'state-retained' }],
      reclaimed: 0,
      kept: 1,
    });
    expect(existsSync(retainedDir)).toBe(true);
  });
});

describe('worktree-reclaim / prefix lease', () => {
  it('aborts the whole pass when a foreign prefix lease is live', () => {
    const fixture = makeFixture();
    const deadDir = createDeadEntry(fixture, 'run-dead', 'lineage-dead');
    const liveDir = createEntry(fixture, {
      runId: 'run-live',
      label: 'lineage-live',
      ownerPid: process.pid,
      ttlMs: LONG_TTL_MS,
    });

    const leasePath = worktreePrefixLeasePath(fixture.worktreeBase, PREFIX);
    const foreign = acquireLoopLock(leasePath, {
      ownerPid: process.pid,
      startedAtIso: new Date().toISOString(),
      ttlMs: LONG_TTL_MS,
      lastHeartbeatIso: new Date().toISOString(),
      packetId: 'run-foreign',
      runtimeKind: 'main',
      phase: 'reclaiming',
    });
    expect(foreign.acquired).toBe(true);

    const result = reclaim(fixture);

    // Every entry is kept, and the reason says the pass never reached the liveness
    // question -- including the tree that is genuinely dead.
    expect(result.reclaimed).toBe(0);
    expect(result.kept).toBe(2);
    expect(result.decisions).toHaveLength(2);
    for (const decision of result.decisions) {
      expect(decision.action).toBe('kept');
      expect(decision.reason).toBe('prefix-lease-held-by-live-run');
    }
    expect(existsSync(deadDir)).toBe(true);
    expect(existsSync(liveDir)).toBe(true);

    // The peer's lease is left exactly as found: not released, not replaced.
    const holder = JSON.parse(readFileSync(leasePath, 'utf8')) as Record<string, unknown>;
    expect(holder.packet_id).toBe('run-foreign');

    if (foreign.acquired) {
      releaseLoopLock(leasePath, process.pid, foreign.lock.acquireNonce);
    }
  });

  it('reports a kept entry with the failure when removal cannot complete, and still releases the prefix lease', () => {
    const fixture = makeFixture();
    mkdirSync(fixture.worktreeBase, { recursive: true });
    // A leased directory git does not recognize: removal fails after the entry has
    // already been judged reclaimable, which exercises the failure branch.
    const failDir = join(fixture.worktreeBase, `${PREFIX}-run-fail-lineage-fail`);
    mkdirSync(failDir, { recursive: true });
    writeWorktreeLease(failDir, {
      ownerPid: knownDeadPid(),
      runId: 'run-fail',
      label: 'lineage-fail',
      ttlMs: TINY_TTL_MS,
    });
    ageLeaseHeartbeat(failDir);

    expect(isWorktreeReclaimable(failDir, { graceMs: GRACE_MS })).toEqual({
      reclaimable: true,
      reason: 'stale-lease-owner-dead',
    });

    const result = reclaim(fixture);

    expect(result.reclaimed).toBe(0);
    expect(result.kept).toBe(1);
    expect(result.decisions).toHaveLength(1);
    expect(result.decisions[0].path).toBe(failDir);
    expect(result.decisions[0].action).toBe('kept');
    expect(result.decisions[0].reason).toMatch(/^worktree-removal-failed: /);
    expect(existsSync(failDir)).toBe(true);
    // A failed pass must not leak the lease that serializes sweeps.
    expect(existsSync(worktreePrefixLeasePath(fixture.worktreeBase, PREFIX))).toBe(false);
  });

  it('refuses an omitted resumableLabels instead of defaulting to an empty list', () => {
    const fixture = makeFixture();
    const deadDir = createDeadEntry(fixture, 'run-dead', 'lineage-dead');

    expect(() => reclaim(fixture, { resumableLabels: undefined as unknown as string[] })).toThrow(TypeError);
    expect(() => reclaim(fixture, { resumableLabels: [''] })).toThrow(TypeError);

    // Refused before any lease was taken and before any entry was touched.
    expect(existsSync(deadDir)).toBe(true);
    expect(existsSync(worktreePrefixLeasePath(fixture.worktreeBase, PREFIX))).toBe(false);
  });
});

describe('worktree-reclaim / decision accounting', () => {
  it('records a decision with a reason for every entry it considers', () => {
    const fixture = makeFixture();
    const liveDir = createEntry(fixture, {
      runId: 'run-live',
      label: 'lineage-live',
      ownerPid: process.pid,
      ttlMs: TINY_TTL_MS,
      stale: true,
    });
    const deadDir = createDeadEntry(fixture, 'run-dead', 'lineage-dead');
    const ownDir = createEntry(fixture, {
      runId: CURRENT_RUN_ID,
      label: 'lineage-own',
      ownerPid: knownDeadPid(),
      ttlMs: TINY_TTL_MS,
      stale: true,
    });
    const resumableDir = createDeadEntry(fixture, 'run-orphan', 'lineage-resume');
    const retainedDir = createEntry(fixture, {
      runId: 'run-publish',
      label: 'lineage-retained',
      ownerPid: knownDeadPid(),
      ttlMs: TINY_TTL_MS,
      stale: true,
      state: 'retained',
    });
    const strayPath = join(fixture.worktreeBase, `${PREFIX}-stray-file`);
    writeFileSync(strayPath, 'not a worktree\n', 'utf8');
    const foreignDir = join(fixture.worktreeBase, 'otherprefix-run-x-lineage-y');
    mkdirSync(foreignDir, { recursive: true });

    const result = reclaim(fixture, { resumableLabels: ['lineage-resume'] });

    expect(result.decisions).toHaveLength(6);
    expect(result.reclaimed).toBe(1);
    expect(result.kept).toBe(5);

    const reasonByPath = new Map(result.decisions.map((decision) => [decision.path, decision.reason]));
    expect(reasonByPath.get(liveDir)).toBe('owner-process-alive');
    expect(reasonByPath.get(deadDir)).toBe('stale-lease-owner-dead');
    expect(reasonByPath.get(ownDir)).toBe('entry-belongs-to-current-run');
    expect(reasonByPath.get(resumableDir)).toBe('resumable-label');
    expect(reasonByPath.get(retainedDir)).toBe('state-retained');
    expect(reasonByPath.get(strayPath)).toBe('not-a-worktree-directory');

    for (const decision of result.decisions) {
      expect(['reclaimed', 'kept']).toContain(decision.action);
      expect(typeof decision.reason).toBe('string');
      expect((decision.reason ?? '').trim().length).toBeGreaterThan(0);
    }

    // A different prefix is not a candidate: untouched, and not reported as if the
    // sweep had considered it.
    expect(existsSync(foreignDir)).toBe(true);
    expect(reasonByPath.has(foreignDir)).toBe(false);
  });
});
