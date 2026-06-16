// TEST: Generate Context Canonical Save Lock
// Verifies long-running saves keep single-writer ownership while abandoned locks recover.
import { spawn } from 'node:child_process';
import * as fsSync from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  acquireCanonicalSaveLock,
  CANONICAL_SAVE_HEARTBEAT_MS,
  CANONICAL_SAVE_STALE_MS,
  releaseCanonicalSaveLock,
} from '../memory/generate-context';

const tempRoots: string[] = [];

function makeTempSpecFolder(): string {
  const specFolder = fsSync.mkdtempSync(path.join(os.tmpdir(), 'canonical-save-lock-'));
  tempRoots.push(specFolder);
  return specFolder;
}

function makeAgedLock(specFolder: string, ownerPid: number | string): string {
  const lockPath = path.join(specFolder, '.canonical-save.lock');
  fsSync.mkdirSync(lockPath);
  fsSync.writeFileSync(path.join(lockPath, 'owner'), `${ownerPid}\n${new Date().toISOString()}\n`, 'utf8');
  const oldTime = new Date(Date.now() - CANONICAL_SAVE_STALE_MS - 1_000);
  fsSync.utimesSync(lockPath, oldTime, oldTime);
  return lockPath;
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

describe('generate-context canonical save lock', () => {
  afterEach(() => {
    vi.useRealTimers();
    for (const tempRoot of tempRoots.splice(0)) {
      fsSync.rmSync(tempRoot, { recursive: true, force: true });
    }
    vi.restoreAllMocks();
  });

  it('does not reap an aged lock owned by a live pid', () => {
    const specFolder = makeTempSpecFolder();
    const lockPath = makeAgedLock(specFolder, process.pid);
    const ownerBefore = fsSync.readFileSync(path.join(lockPath, 'owner'), 'utf8');

    expect(() => acquireCanonicalSaveLock(specFolder)).toThrow(/Canonical save lock is active/);

    expect(fsSync.existsSync(lockPath)).toBe(true);
    expect(fsSync.readFileSync(path.join(lockPath, 'owner'), 'utf8')).toBe(ownerBefore);
  });

  it('reaps an aged lock owned by a dead pid', async () => {
    const specFolder = makeTempSpecFolder();
    const deadPid = await getExitedChildPid();
    const lockPath = makeAgedLock(specFolder, deadPid);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const acquiredLock = acquireCanonicalSaveLock(specFolder);

    try {
      expect(acquiredLock).toBe(lockPath);
      expect(fsSync.readFileSync(path.join(lockPath, 'owner'), 'utf8')).toMatch(new RegExp(`^${process.pid}\\n`));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('removing abandoned canonical save lock'));
    } finally {
      releaseCanonicalSaveLock(acquiredLock);
    }
  });

  it('reaps an aged lock whose owner file is missing (unknown + stale)', () => {
    const specFolder = makeTempSpecFolder();
    const lockPath = path.join(specFolder, '.canonical-save.lock');
    fsSync.mkdirSync(lockPath);
    // No owner file written -> owner state is 'unknown'.
    const oldTime = new Date(Date.now() - CANONICAL_SAVE_STALE_MS - 1_000);
    fsSync.utimesSync(lockPath, oldTime, oldTime);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const acquiredLock = acquireCanonicalSaveLock(specFolder);

    try {
      expect(acquiredLock).toBe(lockPath);
      expect(fsSync.readFileSync(path.join(lockPath, 'owner'), 'utf8')).toMatch(new RegExp(`^${process.pid}\\n`));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('removing abandoned canonical save lock'));
    } finally {
      releaseCanonicalSaveLock(acquiredLock);
    }
  });

  it('refuses an unknown-owner lock that is still within the stale window', () => {
    const specFolder = makeTempSpecFolder();
    const lockPath = path.join(specFolder, '.canonical-save.lock');
    fsSync.mkdirSync(lockPath);
    // Fresh dir, no owner file -> 'unknown' but not yet stale: must not reap.
    expect(() => acquireCanonicalSaveLock(specFolder)).toThrow(/Canonical save lock is active/);
    expect(fsSync.existsSync(lockPath)).toBe(true);
  });

  it('writes the owner record without leaving a temp artifact behind', () => {
    const specFolder = makeTempSpecFolder();
    const lockPath = acquireCanonicalSaveLock(specFolder);
    try {
      expect(lockPath).not.toBeNull();
      // The owner file is published via a temp-file rename, so the held lock dir
      // carries exactly the owner record with no leftover *.tmp staging file.
      expect(fsSync.existsSync(path.join(lockPath as string, 'owner'))).toBe(true);
      const leftovers = fsSync.readdirSync(lockPath as string).filter((entry) => entry.endsWith('.tmp'));
      expect(leftovers).toEqual([]);
    } finally {
      releaseCanonicalSaveLock(lockPath);
    }
  });

  it('refreshes lock directory mtime while held', async () => {
    const specFolder = makeTempSpecFolder();
    const realNow = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(realNow + 60_000));

    const lockPath = acquireCanonicalSaveLock(specFolder);
    const initialMtimeMs = fsSync.statSync(lockPath).mtimeMs;

    try {
      vi.setSystemTime(new Date(realNow + 60_000 + CANONICAL_SAVE_HEARTBEAT_MS + 1_000));
      await vi.advanceTimersByTimeAsync(CANONICAL_SAVE_HEARTBEAT_MS);

      expect(fsSync.statSync(lockPath).mtimeMs).toBeGreaterThan(initialMtimeMs);
    } finally {
      releaseCanonicalSaveLock(lockPath);
    }
  });
});
