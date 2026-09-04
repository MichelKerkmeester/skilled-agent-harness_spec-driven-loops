// ───────────────────────────────────────────────────────────────
// MODULE: hf-model-server Respawn-Lock Atomic Reclaim Tests
// ───────────────────────────────────────────────────────────────
// Regression for the respawn-lock stale-reclaim race: a bare unlink+open is not
// mutually exclusive (A unlink, A open/holds, B unlink removes A's lock, B
// open/holds -> both hold). The fix claims the stale lock via an atomic rename
// before deleting, so only one racer reclaims and a losing rename (ENOENT) yields
// acquired:false instead of a double-acquire.
//
// Also asserts shouldAbortRelaunchOnFire — the guard wired into the db-lock-held
// retry relaunch path so it aborts when the owning runtime vanished (ppid->1).

import { createRequire } from 'node:module';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const mss = require('../../../../bin/lib/model-server-supervision.cjs') as {
  acquireRespawnLockFileAt: (
    lockPath: string,
    label?: string,
    options?: Record<string, unknown>,
  ) => { acquired: boolean; fd?: number; path: string; reason?: string };
  shouldAbortRelaunchOnFire: (input: { shuttingDown: boolean; currentPpid: number; initialPpid: number }) => boolean;
};
const fs = require('node:fs') as typeof import('node:fs');

const tempDirs: string[] = [];

function findDeadPid(): number {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const pid = Math.floor(Math.random() * 1_000_000) + 100_000;
    try {
      process.kill(pid, 0);
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'ESRCH') return pid;
    }
  }
  throw new Error('unable to find an unused pid');
}

function tempLockPath(): string {
  const dir = mkdtempSync(join(tmpdir(), 'respawn-lock-'));
  tempDirs.push(dir);
  return join(dir, 'hf-model-server.respawn.lock');
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('acquireRespawnLockFileAt atomic stale reclaim', () => {
  it('reclaims a stale lock held by a dead pid and records this process as the new holder', () => {
    const lockPath = tempLockPath();
    // Plant a stale lock owned by a dead pid.
    writeFileSync(lockPath, `${JSON.stringify({ pid: findDeadPid(), startedAt: new Date(0).toISOString() })}\n`, { mode: 0o600 });

    const result = mss.acquireRespawnLockFileAt(lockPath, 'test-respawn', { log: () => undefined });
    expect(result.acquired).toBe(true);
    if (typeof result.fd === 'number') fs.closeSync(result.fd);
    const written = JSON.parse(readFileSync(lockPath, 'utf8')) as { pid: number };
    expect(written.pid).toBe(process.pid);
  });

  it('returns acquired:false (no double-acquire) when the stale-claim rename loses the race (ENOENT)', () => {
    const lockPath = tempLockPath();
    writeFileSync(lockPath, `${JSON.stringify({ pid: findDeadPid(), startedAt: new Date(0).toISOString() })}\n`, { mode: 0o600 });

    // Simulate a concurrent racer winning the rename: our renameSync sees ENOENT
    // because the stale lock was already claimed/removed by the other launcher.
    const fsOverride = {
      renameSync: () => {
        const err = new Error('ENOENT: simulated lost rename race') as NodeJS.ErrnoException;
        err.code = 'ENOENT';
        throw err;
      },
    };

    const result = mss.acquireRespawnLockFileAt(lockPath, 'test-respawn', { log: () => undefined, fs: fsOverride });
    expect(result.acquired).toBe(false);
  });

  it('does not reclaim a lock held by a live process', () => {
    const lockPath = tempLockPath();
    // The current process is alive; the lock must not be reclaimed.
    writeFileSync(lockPath, `${JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() })}\n`, { mode: 0o600 });
    const result = mss.acquireRespawnLockFileAt(lockPath, 'test-respawn', { log: () => undefined });
    expect(result.acquired).toBe(false);
  });
});

describe('shouldAbortRelaunchOnFire (db-lock retry abort guard)', () => {
  it('aborts when shutting down', () => {
    expect(mss.shouldAbortRelaunchOnFire({ shuttingDown: true, currentPpid: 100, initialPpid: 100 })).toBe(true);
  });

  it('aborts when the owning runtime is gone (reparented to init, ppid changed)', () => {
    expect(mss.shouldAbortRelaunchOnFire({ shuttingDown: false, currentPpid: 1, initialPpid: 100 })).toBe(true);
  });

  it('does not abort when not shutting down and the parent is unchanged', () => {
    expect(mss.shouldAbortRelaunchOnFire({ shuttingDown: false, currentPpid: 100, initialPpid: 100 })).toBe(false);
  });
});
