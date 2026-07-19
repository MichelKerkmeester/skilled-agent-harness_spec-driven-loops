// ───────────────────────────────────────────────────────────────
// MODULE: Spec Folder Mutex
// ───────────────────────────────────────────────────────────────
// Per-spec-folder save mutex to prevent concurrent indexing races (TOCTOU).

import { createHash, randomUUID } from 'node:crypto';
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

interface InterprocessLockOwner {
  version: 1;
  pid: number;
  token: string;
  heartbeatAt: string;
  specFolder: string;
  acquiredAt: string;
}

interface InterprocessLockSnapshot {
  stats: fs.Stats;
  rawOwner: string | null;
  owner: InterprocessLockOwner | null;
}

const lockHeartbeats = new Map<string, {
  token: string;
  timer: ReturnType<typeof setInterval>;
}>();

export interface InterprocessLockHandle {
  lockDir: string;
  token: string;
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

function parseLockOwner(raw: string): InterprocessLockOwner | null {
  try {
    const value = JSON.parse(raw) as unknown;
    if (typeof value !== 'object' || value === null) return null;
    const owner = value as Record<string, unknown>;
    return owner.version === 1
      && Number.isSafeInteger(owner.pid)
      && Number(owner.pid) > 0
      && typeof owner.token === 'string'
      && owner.token.length > 0
      && typeof owner.heartbeatAt === 'string'
      && typeof owner.specFolder === 'string'
      && typeof owner.acquiredAt === 'string'
      ? owner as unknown as InterprocessLockOwner
      : null;
  } catch {
    return null;
  }
}

function readLockSnapshot(lockDir: string): InterprocessLockSnapshot | null {
  let stats: fs.Stats;
  try {
    stats = fs.statSync(lockDir);
  } catch {
    return null;
  }

  let rawOwner: string | null = null;
  try {
    rawOwner = fs.readFileSync(path.join(lockDir, 'owner.json'), 'utf8');
  } catch (error: unknown) {
    if (getNodeErrorCode(error) !== 'ENOENT') return null;
  }
  return {
    stats,
    rawOwner,
    owner: rawOwner === null ? null : parseLockOwner(rawOwner),
  };
}

function getOwnerState(owner: InterprocessLockOwner): LockOwnerState {
  try {
    process.kill(owner.pid, 0);
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

// Read back the lock owner pid and probe whether that process is still alive.
// A live owner must never be reaped — that is the TOCTOU this mutex prevents.
function getLockOwnerState(lockDir: string): LockOwnerState {
  const snapshot = readLockSnapshot(lockDir);
  return snapshot?.owner ? getOwnerState(snapshot.owner) : 'unknown';
}

// A lock is reclaimable only when its owner is provably gone (dead), or when the
// owner record is unreadable AND the dir has aged past the stale threshold.
// An alive owner is never reclaimable, regardless of age.
function isReclaimableLock(lockDir: string, staleMs: number = LOCK_STALE_MS): boolean {
  const snapshot = readLockSnapshot(lockDir);
  if (!snapshot) return false;
  if (snapshot.owner) return getOwnerState(snapshot.owner) === 'dead';
  return Date.now() - snapshot.stats.mtimeMs > staleMs;
}

function restoreMovedLock(movedDir: string, lockDir: string): void {
  try {
    fs.renameSync(movedDir, lockDir);
  } catch {
    // A replacement lock wins; leave the mismatched directory untouched.
  }
}

function reclaimInterprocessLock(lockDir: string, staleMs: number = LOCK_STALE_MS): boolean {
  const snapshot = readLockSnapshot(lockDir);
  if (!snapshot) return false;
  const reclaimable = snapshot.owner
    ? getOwnerState(snapshot.owner) === 'dead'
    : Date.now() - snapshot.stats.mtimeMs > staleMs;
  if (!reclaimable) return false;

  const reclaimedDir = `${lockDir}.reclaiming-${process.pid}-${Date.now()}`;
  try {
    fs.renameSync(lockDir, reclaimedDir);
  } catch (error: unknown) {
    if (getNodeErrorCode(error) === 'ENOENT') {
      return true;
    }
    return false;
  }

  const movedSnapshot = readLockSnapshot(reclaimedDir);
  if (!movedSnapshot || movedSnapshot.rawOwner !== snapshot.rawOwner) {
    restoreMovedLock(reclaimedDir, lockDir);
    return false;
  }

  try {
    fs.rmSync(reclaimedDir, { recursive: true, force: true });
  } catch (error: unknown) {
    console.warn('[memory-save] failed to remove reclaimed interprocess spec-folder lock:', error);
  }
  return true;
}

function stopHeartbeat(lockDir: string, token: string): void {
  const heartbeat = lockHeartbeats.get(lockDir);
  if (!heartbeat || heartbeat.token !== token) {
    return;
  }
  clearInterval(heartbeat.timer);
  lockHeartbeats.delete(lockDir);
}

function writeLockOwner(lockDir: string, owner: InterprocessLockOwner): InterprocessLockOwner {
  const nextOwner = { ...owner, heartbeatAt: new Date().toISOString() };
  const ownerPath = path.join(lockDir, 'owner.json');
  const tempPath = path.join(lockDir, `.owner-${owner.pid}-${owner.token}.tmp`);
  try {
    fs.writeFileSync(tempPath, `${JSON.stringify(nextOwner)}\n`, 'utf8');
    fs.renameSync(tempPath, ownerPath);
    const now = new Date();
    fs.utimesSync(lockDir, now, now);
    return nextOwner;
  } catch (error: unknown) {
    try { fs.unlinkSync(tempPath); } catch { /* cleanup best-effort */ }
    throw error;
  }
}

// Refresh ownership only while the same token remains published at the path.
function startHeartbeat(handle: InterprocessLockHandle, owner: InterprocessLockOwner): void {
  const existing = lockHeartbeats.get(handle.lockDir);
  if (existing) clearInterval(existing.timer);
  let currentOwner = owner;
  const timer = setInterval(() => {
    const snapshot = readLockSnapshot(handle.lockDir);
    if (!snapshot?.owner || snapshot.owner.token !== handle.token) {
      stopHeartbeat(handle.lockDir, handle.token);
      return;
    }
    try {
      currentOwner = writeLockOwner(handle.lockDir, currentOwner);
    } catch {
      stopHeartbeat(handle.lockDir, handle.token);
    }
  }, LOCK_HEARTBEAT_MS);
  const unref = (timer as { unref?: () => void }).unref;
  unref?.call(timer);
  lockHeartbeats.set(handle.lockDir, { token: handle.token, timer });
}

function abandonUninitializedLock(lockDir: string): void {
  const abandonedDir = `${lockDir}.abandoned-${process.pid}-${Date.now()}`;
  try {
    fs.renameSync(lockDir, abandonedDir);
    fs.rmSync(abandonedDir, { recursive: true, force: true });
  } catch {
    // A later stale-owner recovery can reclaim an incomplete lock.
  }
}

function createInterprocessLock(specFolder: string, lockDir: string): InterprocessLockHandle {
  fs.mkdirSync(lockDir);
  const acquiredAt = new Date().toISOString();
  const owner: InterprocessLockOwner = {
    version: 1,
    pid: process.pid,
    token: randomUUID(),
    heartbeatAt: '',
    specFolder,
    acquiredAt,
  };
  let publishedOwner: InterprocessLockOwner;
  try {
    publishedOwner = writeLockOwner(lockDir, owner);
  } catch (error: unknown) {
    abandonUninitializedLock(lockDir);
    throw error;
  }
  const handle = { lockDir, token: owner.token };
  startHeartbeat(handle, publishedOwner);
  return handle;
}

function releaseInterprocessLock(handle: InterprocessLockHandle): void {
  stopHeartbeat(handle.lockDir, handle.token);
  const snapshot = readLockSnapshot(handle.lockDir);
  if (!snapshot?.owner || snapshot.owner.token !== handle.token) return;

  const releasingDir = `${handle.lockDir}.releasing-${process.pid}-${handle.token}`;
  try {
    fs.renameSync(handle.lockDir, releasingDir);
  } catch (error: unknown) {
    console.warn('[memory-save] failed to release interprocess spec-folder lock:', error);
    return;
  }
  const movedSnapshot = readLockSnapshot(releasingDir);
  if (!movedSnapshot?.owner || movedSnapshot.owner.token !== handle.token) {
    restoreMovedLock(releasingDir, handle.lockDir);
    return;
  }
  try {
    fs.rmSync(releasingDir, { recursive: true, force: true });
  } catch (error: unknown) {
    console.warn('[memory-save] failed to remove released interprocess spec-folder lock:', error);
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
