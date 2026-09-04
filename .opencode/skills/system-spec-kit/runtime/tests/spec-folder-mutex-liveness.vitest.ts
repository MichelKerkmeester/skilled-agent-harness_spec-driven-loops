// TEST: Spec Folder Save Mutex Liveness
// Verifies the interprocess save mutex never reaps a lock whose owner process is
// still alive, reaps only provably-dead owners (or unreadable owners past the
// stale window), and refreshes the lock dir mtime while a save is held.
import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  LOCK_HEARTBEAT_MS,
  LOCK_STALE_MS,
  createInterprocessLock,
  getLockDir,
  getLockOwnerState,
  isReclaimableLock,
  reclaimInterprocessLock,
  releaseInterprocessLock,
} from '../handlers/save/spec-folder-mutex';

const tempLockDirs: string[] = [];

function makeAgedLock(specFolder: string, ownerPid: number | string | null): string {
  const lockDir = getLockDir(specFolder);
  tempLockDirs.push(lockDir);
  fs.mkdirSync(lockDir, { recursive: true });
  if (ownerPid !== null) {
    fs.writeFileSync(path.join(lockDir, 'owner.json'), JSON.stringify({
      version: 1,
      pid: ownerPid,
      token: 'fixture-owner-token',
      heartbeatAt: new Date().toISOString(),
      specFolder,
      acquiredAt: new Date().toISOString(),
    }));
  }
  const oldTime = new Date(Date.now() - LOCK_STALE_MS - 1_000);
  fs.utimesSync(lockDir, oldTime, oldTime);
  return lockDir;
}

function getNodeErrorCode(error: unknown): string | null {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : null;
}

async function getExitedChildPid(): Promise<number> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const pid = await new Promise<number>((resolve, reject) => {
      const child = spawn(process.execPath, ['-e', ''], { stdio: 'ignore' });
      const childPid = child.pid;
      if (!childPid) {
        reject(new Error('Child process did not expose a pid'));
        return;
      }
      child.once('error', reject);
      child.once('close', () => resolve(childPid));
    });

    try {
      process.kill(pid, 0);
    } catch (error: unknown) {
      if (getNodeErrorCode(error) === 'ESRCH') {
        return pid;
      }
    }
  }

  throw new Error('Unable to create an exited child pid for lock testing');
}

describe('spec-folder save mutex liveness', () => {
  afterEach(() => {
    vi.useRealTimers();
    for (const lockDir of tempLockDirs.splice(0)) {
      fs.rmSync(lockDir, { recursive: true, force: true });
    }
    vi.restoreAllMocks();
  });

  it('does not reclaim an aged lock owned by a live pid', () => {
    // Regression: the old reaper keyed purely on mtime age and would have
    // reclaimed this still-alive owner, allowing two concurrent indexers.
    const lockDir = makeAgedLock('specs/mutex-live-owner', process.pid);
    expect(getLockOwnerState(lockDir)).toBe('alive');
    expect(isReclaimableLock(lockDir)).toBe(false);
    expect(reclaimInterprocessLock(lockDir)).toBe(false);
    expect(fs.existsSync(lockDir)).toBe(true);
  });

  it('reclaims an aged lock owned by a dead pid', async () => {
    const deadPid = await getExitedChildPid();
    const lockDir = makeAgedLock('specs/mutex-dead-owner', deadPid);
    expect(getLockOwnerState(lockDir)).toBe('dead');
    expect(isReclaimableLock(lockDir)).toBe(true);
  });

  it('reclaims an unreadable owner only after the stale window', () => {
    const agedUnknown = makeAgedLock('specs/mutex-unknown-aged', null);
    expect(getLockOwnerState(agedUnknown)).toBe('unknown');
    expect(isReclaimableLock(agedUnknown)).toBe(true);

    // A fresh lock with an unreadable owner must not be reclaimed yet.
    const freshDir = getLockDir('specs/mutex-unknown-fresh');
    tempLockDirs.push(freshDir);
    fs.mkdirSync(freshDir, { recursive: true });
    expect(getLockOwnerState(freshDir)).toBe('unknown');
    expect(isReclaimableLock(freshDir)).toBe(false);
  });

  it('does not age-reclaim a valid owner when liveness is unknown', () => {
    const lockDir = makeAgedLock('specs/mutex-unknown-liveness', 42);
    vi.spyOn(process, 'kill').mockImplementation(() => {
      throw Object.assign(new Error('probe unavailable'), { code: 'EIO' });
    });

    expect(getLockOwnerState(lockDir)).toBe('unknown');
    expect(isReclaimableLock(lockDir)).toBe(false);
    expect(reclaimInterprocessLock(lockDir)).toBe(false);
  });

  it('does not release a lock after its ownership token changes', () => {
    const lockDir = getLockDir('specs/mutex-successor-owner');
    tempLockDirs.push(lockDir);
    fs.mkdirSync(path.dirname(lockDir), { recursive: true });
    const handle = createInterprocessLock('specs/mutex-successor-owner', lockDir);
    const successorOwner = {
      ...JSON.parse(fs.readFileSync(path.join(lockDir, 'owner.json'), 'utf8')),
      token: 'successor-owner-token',
    };
    fs.writeFileSync(path.join(lockDir, 'owner.json'), JSON.stringify(successorOwner));

    releaseInterprocessLock(handle);

    expect(fs.existsSync(lockDir)).toBe(true);
    expect(JSON.parse(fs.readFileSync(path.join(lockDir, 'owner.json'), 'utf8')).token)
      .toBe('successor-owner-token');
  });

  it('refreshes the lock directory mtime while the lock is held', async () => {
    const realNow = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(realNow + 60_000));

    const lockDir = getLockDir('specs/mutex-heartbeat');
    tempLockDirs.push(lockDir);
    fs.mkdirSync(path.dirname(lockDir), { recursive: true });
    const handle = createInterprocessLock('specs/mutex-heartbeat', lockDir);
    const initialMtimeMs = fs.statSync(lockDir).mtimeMs;

    try {
      vi.setSystemTime(new Date(realNow + 60_000 + LOCK_HEARTBEAT_MS + 1_000));
      await vi.advanceTimersByTimeAsync(LOCK_HEARTBEAT_MS);

      expect(fs.statSync(lockDir).mtimeMs).toBeGreaterThan(initialMtimeMs);
    } finally {
      releaseInterprocessLock(handle);
    }
  });
});
