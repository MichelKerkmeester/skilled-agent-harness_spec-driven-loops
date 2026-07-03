// ───────────────────────────────────────────────────────────────
// MODULE: Spec Folder Mutex
// ───────────────────────────────────────────────────────────────
// Per-spec-folder save mutex to prevent concurrent indexing races (TOCTOU).

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Atomic-save parity and partial-indexing hints

const SPEC_FOLDER_LOCKS = new Map<string, Promise<unknown>>();
const LOCK_ROOT = path.join(os.tmpdir(), 'mk-spec-memory-save-locks');
const LOCK_WAIT_MS = 25;
const LOCK_TIMEOUT_MS = 30_000;
const LOCK_STALE_MS = 5 * 60 * 1000;
const LOCK_HEARTBEAT_MS = 60_000;

type LockOwnerState = 'alive' | 'dead' | 'unknown';

const lockHeartbeats = new Map<string, ReturnType<typeof setInterval>>();

interface InterprocessLockHandle {
  lockDir: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getLockDir(specFolder: string): string {
  const digest = createHash('sha1').update(specFolder).digest('hex');
  return path.join(LOCK_ROOT, digest);
}

function isExistingDirectoryError(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'EEXIST');
}

function getNodeErrorCode(error: unknown): string | null {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : null;
  }
  return null;
}

// Read back the lock owner pid and probe whether that process is still alive.
// A live owner must never be reaped — that is the TOCTOU this mutex prevents.
function getLockOwnerState(lockDir: string): LockOwnerState {
  let ownerRaw: string;
  try {
    ownerRaw = fs.readFileSync(path.join(lockDir, 'owner.json'), 'utf8');
  } catch {
    return 'unknown';
  }

  let ownerPid: number;
  try {
    const parsed = JSON.parse(ownerRaw) as { pid?: unknown };
    ownerPid = Number(parsed.pid);
  } catch {
    return 'unknown';
  }
  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
    return 'unknown';
  }

  try {
    process.kill(ownerPid, 0);
    return 'alive';
  } catch (error: unknown) {
    const code = getNodeErrorCode(error);
    if (code === 'ESRCH') {
      return 'dead';
    }
    if (code === 'EPERM') {
      return 'alive';
    }
    return 'unknown';
  }
}

// A lock is reclaimable only when its owner is provably gone (dead), or when the
// owner record is unreadable AND the dir has aged past the stale threshold.
// An alive owner is never reclaimable, regardless of age.
function isReclaimableLock(lockDir: string): boolean {
  let ageMs: number;
  try {
    const stats = fs.statSync(lockDir);
    ageMs = Date.now() - stats.mtimeMs;
  } catch {
    return false;
  }
  const ownerState = getLockOwnerState(lockDir);
  return ownerState === 'dead' || (ownerState === 'unknown' && ageMs > LOCK_STALE_MS);
}

function reclaimInterprocessLock(lockDir: string): boolean {
  const reclaimedDir = `${lockDir}.reclaiming-${process.pid}-${Date.now()}`;
  try {
    fs.renameSync(lockDir, reclaimedDir);
  } catch (error: unknown) {
    if (getNodeErrorCode(error) === 'ENOENT') {
      return true;
    }
    return false;
  }

  if (fs.existsSync(lockDir) || !fs.existsSync(reclaimedDir)) {
    return false;
  }

  try {
    fs.rmSync(reclaimedDir, { recursive: true, force: true });
  } catch (error: unknown) {
    console.warn('[memory-save] failed to remove reclaimed interprocess spec-folder lock:', error);
  }
  return true;
}

function stopHeartbeat(lockDir: string): void {
  const heartbeat = lockHeartbeats.get(lockDir);
  if (!heartbeat) {
    return;
  }
  clearInterval(heartbeat);
  lockHeartbeats.delete(lockDir);
}

// Refresh the lock dir mtime while fn() runs so a long-but-live save is never
// mistaken for an abandoned lock by the stale-age fallback.
function startHeartbeat(lockDir: string): void {
  stopHeartbeat(lockDir);
  const heartbeat = setInterval(() => {
    try {
      const now = new Date();
      fs.utimesSync(lockDir, now, now);
    } catch {
      stopHeartbeat(lockDir);
    }
  }, LOCK_HEARTBEAT_MS);
  const unref = (heartbeat as { unref?: () => void }).unref;
  unref?.call(heartbeat);
  lockHeartbeats.set(lockDir, heartbeat);
}

function createInterprocessLock(specFolder: string, lockDir: string): InterprocessLockHandle {
  fs.mkdirSync(lockDir);
  fs.writeFileSync(path.join(lockDir, 'owner.json'), JSON.stringify({
    pid: process.pid,
    specFolder,
    acquiredAt: new Date().toISOString(),
  }));
  startHeartbeat(lockDir);
  return { lockDir };
}

function releaseInterprocessLock(handle: InterprocessLockHandle): void {
  stopHeartbeat(handle.lockDir);
  try {
    fs.rmSync(handle.lockDir, { recursive: true, force: true });
  } catch (error: unknown) {
    console.warn('[memory-save] failed to release interprocess spec-folder lock:', error);
  }
}

async function acquireInterprocessLock(specFolder: string): Promise<InterprocessLockHandle> {
  const lockDir = getLockDir(specFolder);
  const deadline = Date.now() + LOCK_TIMEOUT_MS;

  fs.mkdirSync(LOCK_ROOT, { recursive: true });

  while (true) {
    try {
      return createInterprocessLock(specFolder, lockDir);
    } catch (error: unknown) {
      if (!isExistingDirectoryError(error)) {
        throw error;
      }

      if (isReclaimableLock(lockDir)) {
        if (reclaimInterprocessLock(lockDir)) {
          continue;
        }
      }

      if (Date.now() >= deadline) {
        throw new Error(`Timed out acquiring interprocess spec-folder lock for ${specFolder}`);
      }

      await sleep(LOCK_WAIT_MS);
    }
  }
}

async function withSpecFolderLock<T>(specFolder: string, fn: () => Promise<T>): Promise<T> {
  const normalizedFolder = specFolder || '__global__';
  const chain = (SPEC_FOLDER_LOCKS.get(normalizedFolder) ?? Promise.resolve())
    .catch((error: unknown) => {
      console.error('[memory-save] prior queued save failed:', error);
    })
    .then(async () => {
      const interprocessLock = await acquireInterprocessLock(normalizedFolder);
      try {
        return await fn();
      } finally {
        releaseInterprocessLock(interprocessLock);
      }
    });
  SPEC_FOLDER_LOCKS.set(normalizedFolder, chain);
  try {
    return await chain;
  } finally {
    if (SPEC_FOLDER_LOCKS.get(normalizedFolder) === chain) {
      SPEC_FOLDER_LOCKS.delete(normalizedFolder);
    }
  }
}

export {
  SPEC_FOLDER_LOCKS,
  withSpecFolderLock,
  // Exported for targeted lock-liveness tests; not part of the save flow API.
  LOCK_STALE_MS,
  LOCK_HEARTBEAT_MS,
  getLockDir,
  getLockOwnerState,
  isReclaimableLock,
  reclaimInterprocessLock,
  createInterprocessLock,
  releaseInterprocessLock,
};
