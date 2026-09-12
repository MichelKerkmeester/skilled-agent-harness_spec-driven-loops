import { afterEach, describe, expect, it } from 'vitest';

import { mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { LoopLockHeldError, processAlive } from '../../lib/deep-loop/loop-lock.js';
import {
  WORKTREE_LEASE_FILENAME,
  isWorktreeReclaimable,
  refreshWorktreeLease,
  setWorktreeLeaseState,
  writeWorktreeLease,
} from '../../lib/deep-loop/worktree-lease.js';

/** Millisecond budgets small enough to expire inside a test, but still positive. */
const TINY_TTL_MS = 1;
const LONG_TTL_MS = 300_000;
const GRACE_MS = 60_000;

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop() as string, { recursive: true, force: true });
  }
});

function makeWorktree(): string {
  const dir = mkdtempSync(join(tmpdir(), 'worktree-lease-'));
  tempDirs.push(dir);
  return dir;
}

function leasePath(dir: string): string {
  return join(dir, WORKTREE_LEASE_FILENAME);
}

function readLeaseJson(dir: string): Record<string, unknown> {
  return JSON.parse(readFileSync(leasePath(dir), 'utf8')) as Record<string, unknown>;
}

/** A clock far enough ahead that a short-ttl lease has expired, without sleeping. */
function staleClock(): Date {
  return new Date(Date.now() + 60_000);
}

/** A clock beyond twice the long ttl, for leases written with the long budget. */
function expiredClock(): Date {
  return new Date(Date.now() + 10 * LONG_TTL_MS);
}

/** Backdate the directory so its mtime falls outside the grace window. */
function ageWorktree(dir: string): void {
  const old = new Date(Date.now() - 3_600_000);
  utimesSync(dir, old, old);
}

/** Backdate the lease heartbeat so the record expires without waiting out its ttl. */
function ageLeaseHeartbeat(dir: string): void {
  const record = readLeaseJson(dir);
  record.last_heartbeat_iso = new Date(Date.now() - 3_600_000).toISOString();
  writeFileSync(leasePath(dir), `${JSON.stringify(record, null, 2)}\n`, 'utf8');
}

function knownDeadPid(): number {
  for (let pid = 999_999; pid > 900_000; pid -= 1) {
    if (!processAlive(pid)) return pid;
  }
  throw new Error('Could not find a known-dead pid for worktree-lease test');
}

describe('worktree-lease / write', () => {
  it('writes an active lease and returns the record it persisted', () => {
    const dir = makeWorktree();

    const record = writeWorktreeLease(dir, {
      ownerPid: process.pid,
      runId: 'run-42',
      label: 'lineage-7',
      ttlMs: LONG_TTL_MS,
    });

    expect(record.state).toBe('active');
    expect(record.runId).toBe('run-42');
    expect(record.label).toBe('lineage-7');
    expect(record.ownerPid).toBe(process.pid);
    expect(typeof record.acquireNonce).toBe('string');

    const persisted = readLeaseJson(dir);
    expect(persisted.phase).toBe('active');
    expect(persisted.owner_pid).toBe(process.pid);
    expect(persisted.ttl_ms).toBe(LONG_TTL_MS);
  });

  it('refuses a live existing lease instead of overwriting it', () => {
    const dir = makeWorktree();
    writeWorktreeLease(dir, { ownerPid: process.pid, runId: 'run-1', label: 'lineage-1', ttlMs: LONG_TTL_MS });

    expect(() =>
      writeWorktreeLease(dir, { ownerPid: process.pid, runId: 'run-2', label: 'lineage-2', ttlMs: LONG_TTL_MS }),
    ).toThrow(LoopLockHeldError);

    expect(readLeaseJson(dir).packet_id).toBe('run-1');
  });

  it('replaces a lease whose owner is gone and whose heartbeat has expired', () => {
    const dir = makeWorktree();
    writeWorktreeLease(dir, { ownerPid: knownDeadPid(), runId: 'run-dead', label: 'lineage-dead', ttlMs: TINY_TTL_MS });
    ageLeaseHeartbeat(dir);

    const record = writeWorktreeLease(dir, {
      ownerPid: process.pid,
      runId: 'run-fresh',
      label: 'lineage-fresh',
      ttlMs: LONG_TTL_MS,
    });

    expect(record.runId).toBe('run-fresh');
    expect(readLeaseJson(dir).packet_id).toBe('run-fresh');
  });

  it('rejects a request that cannot describe a live, attributable owner', () => {
    const dir = makeWorktree();
    const base = { ownerPid: process.pid, runId: 'run-1', label: 'lineage-1', ttlMs: LONG_TTL_MS };

    expect(() => writeWorktreeLease(dir, { ...base, ownerPid: 0 })).toThrow(TypeError);
    expect(() => writeWorktreeLease(dir, { ...base, ttlMs: Number.NaN })).toThrow(TypeError);
    expect(() => writeWorktreeLease(dir, { ...base, runId: '' })).toThrow(TypeError);
  });
});

describe('worktree-lease / refresh', () => {
  it('keeps identity and state intact across a heartbeat refresh', () => {
    const dir = makeWorktree();
    writeWorktreeLease(dir, { ownerPid: process.pid, runId: 'run-42', label: 'lineage-7', ttlMs: LONG_TTL_MS });

    expect(refreshWorktreeLease(dir)).toBe(true);

    const persisted = readLeaseJson(dir);
    expect(persisted.phase).toBe('active');
    expect(persisted.packet_id).toBe('run-42');
    expect(persisted.runtime_kind).toBe('lineage-7');

    // The refreshed record must still read as a live lease rather than as an unmarked
    // directory: a heartbeat that erased the state would make the tree sweepable.
    expect(isWorktreeReclaimable(dir, { now: expiredClock(), graceMs: GRACE_MS })).toEqual({
      reclaimable: false,
      reason: 'owner-process-alive',
    });
  });

  it('reports false instead of throwing when there is no readable lease', () => {
    const dir = makeWorktree();

    expect(refreshWorktreeLease(dir)).toBe(false);

    writeFileSync(leasePath(dir), '{ not json', 'utf8');
    expect(refreshWorktreeLease(dir)).toBe(false);
  });
});

describe('worktree-lease / state transitions', () => {
  it('does not fabricate a lease for an unowned directory', () => {
    const dir = makeWorktree();

    expect(setWorktreeLeaseState(dir, 'retained')).toBe(false);
    expect(() => setWorktreeLeaseState(dir, 'not-a-state' as never)).toThrow(TypeError);
  });
});

describe('worktree-lease / reclaim decision', () => {
  it('holds a live lease', () => {
    const dir = makeWorktree();
    writeWorktreeLease(dir, { ownerPid: process.pid, runId: 'run-live', label: 'lineage-live', ttlMs: LONG_TTL_MS });

    expect(isWorktreeReclaimable(dir, { graceMs: GRACE_MS })).toEqual({
      reclaimable: false,
      reason: 'heartbeat-not-stale',
    });
  });

  it('holds a stale lease while its owner process is still alive', () => {
    const dir = makeWorktree();
    writeWorktreeLease(dir, { ownerPid: process.pid, runId: 'run-slow', label: 'lineage-slow', ttlMs: TINY_TTL_MS });

    expect(isWorktreeReclaimable(dir, { now: staleClock(), graceMs: GRACE_MS })).toEqual({
      reclaimable: false,
      reason: 'owner-process-alive',
    });
  });

  it('reclaims a stale lease whose owner process is gone', () => {
    const dir = makeWorktree();
    writeWorktreeLease(dir, { ownerPid: knownDeadPid(), runId: 'run-dead', label: 'lineage-dead', ttlMs: TINY_TTL_MS });

    expect(isWorktreeReclaimable(dir, { now: staleClock(), graceMs: GRACE_MS })).toEqual({
      reclaimable: true,
      reason: 'stale-lease-owner-dead',
    });
  });

  it('discriminates heartbeat age from owner liveness', () => {
    const dir = makeWorktree();
    writeWorktreeLease(dir, { ownerPid: knownDeadPid(), runId: 'run-dying', label: 'lineage-dying', ttlMs: LONG_TTL_MS });

    // Owner already gone, heartbeat still fresh: a run that died mid-write keeps its tree
    // until the heartbeat itself runs out.
    expect(isWorktreeReclaimable(dir, { now: new Date(), graceMs: GRACE_MS })).toEqual({
      reclaimable: false,
      reason: 'heartbeat-not-stale',
    });

    expect(isWorktreeReclaimable(dir, { now: expiredClock(), graceMs: GRACE_MS })).toEqual({
      reclaimable: true,
      reason: 'stale-lease-owner-dead',
    });
  });

  it('never reclaims a claimed lease, even when stale and dead', () => {
    const dir = makeWorktree();
    writeWorktreeLease(dir, { ownerPid: knownDeadPid(), runId: 'run-claimed', label: 'lineage-claimed', ttlMs: TINY_TTL_MS });

    expect(setWorktreeLeaseState(dir, 'claimed')).toBe(true);
    expect(readLeaseJson(dir).phase).toBe('claimed');

    expect(isWorktreeReclaimable(dir, { now: staleClock(), graceMs: GRACE_MS })).toEqual({
      reclaimable: false,
      reason: 'state-claimed',
    });
  });

  it('never reclaims a retained lease, even when stale and dead', () => {
    const dir = makeWorktree();
    writeWorktreeLease(dir, { ownerPid: knownDeadPid(), runId: 'run-retained', label: 'lineage-retained', ttlMs: TINY_TTL_MS });

    expect(setWorktreeLeaseState(dir, 'retained')).toBe(true);
    expect(readLeaseJson(dir).phase).toBe('retained');

    expect(isWorktreeReclaimable(dir, { now: staleClock(), graceMs: GRACE_MS })).toEqual({
      reclaimable: false,
      reason: 'state-retained',
    });
  });

  it('never reclaims an unrecognized state', () => {
    const dir = makeWorktree();
    writeWorktreeLease(dir, { ownerPid: knownDeadPid(), runId: 'run-foreign', label: 'lineage-foreign', ttlMs: TINY_TTL_MS });
    const record = readLeaseJson(dir);
    record.phase = 'running';
    writeFileSync(leasePath(dir), `${JSON.stringify(record, null, 2)}\n`, 'utf8');

    expect(isWorktreeReclaimable(dir, { now: staleClock(), graceMs: GRACE_MS })).toEqual({
      reclaimable: false,
      reason: 'state-unrecognized',
    });
  });

  it('holds a lease-free directory that is still inside the grace window', () => {
    const dir = makeWorktree();

    expect(isWorktreeReclaimable(dir, { now: new Date(), graceMs: GRACE_MS })).toEqual({
      reclaimable: false,
      reason: 'lease-missing-within-grace',
    });
  });

  it('reclaims a lease-free directory that has been quiet beyond the grace window', () => {
    const dir = makeWorktree();
    ageWorktree(dir);

    expect(isWorktreeReclaimable(dir, { now: new Date(), graceMs: GRACE_MS })).toEqual({
      reclaimable: true,
      reason: 'unmarked-beyond-grace',
    });
  });

  it('holds an unreadable lease inside the grace window and reclaims it beyond', () => {
    const dir = makeWorktree();
    writeFileSync(leasePath(dir), '{ truncated', 'utf8');

    expect(isWorktreeReclaimable(dir, { now: new Date(), graceMs: GRACE_MS })).toEqual({
      reclaimable: false,
      reason: 'lease-unreadable-within-grace',
    });

    ageWorktree(dir);
    expect(isWorktreeReclaimable(dir, { now: new Date(), graceMs: GRACE_MS })).toEqual({
      reclaimable: true,
      reason: 'unmarked-beyond-grace',
    });
  });

  it('refuses to judge a directory that does not exist', () => {
    const dir = makeWorktree();

    expect(isWorktreeReclaimable(join(dir, 'gone'), { graceMs: GRACE_MS })).toEqual({
      reclaimable: false,
      reason: 'worktree-directory-missing',
    });
  });

  it('rejects a grace window or clock that cannot bound the decision', () => {
    const dir = makeWorktree();

    expect(() => isWorktreeReclaimable(dir, { graceMs: Number.NaN })).toThrow(TypeError);
    expect(() => isWorktreeReclaimable(dir, { graceMs: -1 })).toThrow(TypeError);
    expect(() => isWorktreeReclaimable(dir, { graceMs: GRACE_MS, now: new Date(Number.NaN) })).toThrow(TypeError);
  });
});
