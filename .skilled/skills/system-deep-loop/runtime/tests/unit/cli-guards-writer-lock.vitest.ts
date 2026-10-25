// ───────────────────────────────────────────────────────────────────
// MODULE: Writer Lock Guard Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import { spawnSync } from 'node:child_process';
// The default export is the same object cli-guards.cjs reads through require, so a
// spy on it reaches the lock code.
import fsModule from 'node:fs';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// cli-guards is CommonJS; pull the writer-lock primitive under test.
import { acquireWriterLock } from '../../scripts/lib/cli-guards.cjs';

const MAX_WAIT_ENV = 'DEEP_LOOP_WRITER_LOCK_MAX_WAIT_MS';
const MAX_HOLD_ENV = 'DEEP_LOOP_WRITER_LOCK_MAX_HOLD_MS';

const tempDirs: string[] = [];

/**
 * Creates a fresh temp lock path (unique dir) and tracks it for cleanup.
 */
function newLockPath(): string {
  const dir = mkdtempSync(join(tmpdir(), 'cli-guards-lock-'));
  tempDirs.push(dir);
  return join(dir, '.deep-loop-graph-writer.lock');
}

/**
 * Returns a pid that is guaranteed dead: spawnSync runs a no-op child to
 * completion, so its pid refers to an already-terminated process.
 */
function deadPid(): number {
  const child = spawnSync(process.execPath, ['-e', 'process.exit(0)']);
  return child.pid as number;
}

afterEach(() => {
  delete process.env[MAX_WAIT_ENV];
  delete process.env[MAX_HOLD_ENV];
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('acquireWriterLock stale-lock reclamation', () => {
  it('reclaims a lock owned by a dead pid and acquires successfully', () => {
    const lockPath = newLockPath();
    const dpid = deadPid();
    // Sanity: the pid is truly gone.
    expect(() => process.kill(dpid, 0)).toThrow();

    // Fresh ts so reclamation must rely on dead-pid detection, not age-out.
    writeFileSync(lockPath, JSON.stringify({ pid: dpid, ts: Date.now() }));

    // maxWait=0 → a wrongly-respected live lock would throw immediately, so a
    // successful acquire proves the dead lock was reclaimed (not just waited out).
    process.env[MAX_WAIT_ENV] = '0';
    const release = acquireWriterLock(lockPath);
    expect(typeof release).toBe('function');

    // The reclaimed lock now belongs to this process.
    const body = JSON.parse(readFileSync(lockPath, 'utf8'));
    expect(Number(body.pid)).toBe(process.pid);

    release();
    expect(existsSync(lockPath)).toBe(false);
  });

  it('respects a lock held by the current live pid within the age window', () => {
    const lockPath = newLockPath();
    // Owner = this (live) process, ts = now → inside the max-hold window.
    writeFileSync(lockPath, JSON.stringify({ pid: process.pid, ts: Date.now() }));

    // maxWait=0 → fail fast rather than loop to a deadline.
    process.env[MAX_WAIT_ENV] = '0';
    expect(() => acquireWriterLock(lockPath)).toThrowError(
      expect.objectContaining({ code: 'DB_ERROR' }),
    );

    // A failed acquirer must not delete a live holder's lock.
    expect(existsSync(lockPath)).toBe(true);
  });

  it('reclaims an aged-out lock even when the owning pid is still alive', () => {
    const lockPath = newLockPath();
    // Live owner (us) but ts older than the hold window → reclaimable.
    writeFileSync(lockPath, JSON.stringify({ pid: process.pid, ts: Date.now() - 10 * 60_000 }));

    process.env[MAX_WAIT_ENV] = '0';
    process.env[MAX_HOLD_ENV] = '60000';
    const release = acquireWriterLock(lockPath);
    expect(typeof release).toBe('function');
    release();
    expect(existsSync(lockPath)).toBe(false);
  });

  it('round-trips a normal uncontended acquire and release', () => {
    const lockPath = newLockPath();
    const release = acquireWriterLock(lockPath);
    expect(existsSync(lockPath)).toBe(true);
    // Lock body is stamped with owner pid + a timestamp + a unique nonce.
    const body = JSON.parse(readFileSync(lockPath, 'utf8'));
    expect(Number(body.pid)).toBe(process.pid);
    expect(typeof body.ts).toBe('number');
    expect(typeof body.nonce).toBe('string');
    expect(body.nonce.length).toBeGreaterThan(0);
    release();
    expect(existsSync(lockPath)).toBe(false);
  });

  it('release does NOT delete a lock it no longer owns', () => {
    const lockPath = newLockPath();
    // Acquire normally → on-disk body carries our nonce.
    const release = acquireWriterLock(lockPath);
    expect(existsSync(lockPath)).toBe(true);

    // Simulate being reclaimed mid-critical-section: a peer rmSync'd our lock
    // and recreated its own with a DIFFERENT nonce while we still hold our fd.
    const foreign = JSON.stringify({ pid: process.pid, ts: Date.now(), nonce: 'foreign-holder-nonce' });
    writeFileSync(lockPath, foreign);

    // Release must be ownership-blind no longer: it sees a foreign nonce and
    // skips the rmSync, leaving the new holder's lock intact.
    release();
    expect(existsSync(lockPath)).toBe(true);
    const after = JSON.parse(readFileSync(lockPath, 'utf8'));
    expect(after.nonce).toBe('foreign-holder-nonce');
  });

  it('release skips rmSync on a missing or half-written lock file', () => {
    const lockPath = newLockPath();
    const release = acquireWriterLock(lockPath);

    // Half-written / non-JSON body reads as "not mine" → release must not throw
    // and must not delete it (a peer may be mid-write between open and stamp).
    writeFileSync(lockPath, '{ partial');
    expect(() => release()).not.toThrow();
    expect(existsSync(lockPath)).toBe(true);
  });
});

describe('acquireWriterLock reclaim removes only the lock it judged', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function tryAcquire(lockPath: string): { error?: unknown } {
    try {
      acquireWriterLock(lockPath);
      return {};
    } catch (error) {
      return { error };
    }
  }

  const livePeerBody = (nonce: string): string =>
    JSON.stringify({ pid: process.pid, ts: Date.now(), nonce });

  /**
   * Intercepts the first read of the lock path, which is the staleness verdict's
   * read, and runs `onFirstRead` around the real read so a test can change what
   * sits at the path between the verdict and the removal.
   */
  function interceptFirstRead(
    lockPath: string,
    onFirstRead: (read: () => string) => string,
  ): void {
    const realRead = fsModule.readFileSync;
    let intercepted = false;
    vi.spyOn(fsModule, 'readFileSync').mockImplementation(((target: unknown, ...rest: unknown[]) => {
      if (!intercepted && target === lockPath) {
        intercepted = true;
        return onFirstRead(() => (realRead as (...args: unknown[]) => string)(target, ...rest));
      }
      return (realRead as (...args: unknown[]) => unknown)(target, ...rest);
    }) as typeof fsModule.readFileSync);
  }

  it('does not remove a peer lock created after the lock it tried to read had vanished', () => {
    const lockPath = newLockPath();
    writeFileSync(lockPath, livePeerBody('first-holder'));

    // The holder releases between the failed open and the read, and a peer takes
    // the path before this writer acts on the "gone" answer.
    interceptFirstRead(lockPath, (read) => {
      rmSync(lockPath, { force: true });
      try {
        return read();
      } finally {
        writeFileSync(lockPath, livePeerBody('peer-holder'));
      }
    });

    process.env[MAX_WAIT_ENV] = '0';
    const outcome = tryAcquire(lockPath);
    // The peer's lock survives, so this writer must not hold the lock too.
    expect(JSON.parse(readFileSync(lockPath, 'utf8')).nonce).toBe('peer-holder');
    expect(outcome.error).toEqual(expect.objectContaining({ code: 'DB_ERROR' }));
  });

  it('does not remove a peer lock that replaced the stale lock it judged', () => {
    const lockPath = newLockPath();
    writeFileSync(lockPath, JSON.stringify({ pid: deadPid(), ts: Date.now(), nonce: 'dead-holder' }));

    // The verdict reads the dead holder's body, then another reclaimer clears it
    // and a peer takes the path before this writer removes what it judged.
    interceptFirstRead(lockPath, (read) => {
      const judged = read();
      rmSync(lockPath, { force: true });
      writeFileSync(lockPath, livePeerBody('peer-holder'));
      return judged;
    });

    process.env[MAX_WAIT_ENV] = '0';
    const outcome = tryAcquire(lockPath);
    // The peer's lock survives, so this writer must not hold the lock too.
    expect(JSON.parse(readFileSync(lockPath, 'utf8')).nonce).toBe('peer-holder');
    expect(outcome.error).toEqual(expect.objectContaining({ code: 'DB_ERROR' }));
  });

  it('acquires when the lock vanishes after the failed open and nobody replaces it', () => {
    const lockPath = newLockPath();
    writeFileSync(lockPath, livePeerBody('first-holder'));

    interceptFirstRead(lockPath, (read) => {
      rmSync(lockPath, { force: true });
      return read();
    });

    process.env[MAX_WAIT_ENV] = '0';
    const release = acquireWriterLock(lockPath);
    expect(Number(JSON.parse(readFileSync(lockPath, 'utf8')).pid)).toBe(process.pid);
    release();
    expect(existsSync(lockPath)).toBe(false);
  });
});
