// MODULE: Deep-Loop Lock

import { closeSync, existsSync, fsyncSync, openSync, readFileSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

// ───── TYPE DEFINITIONS ─────

import type { ExecutorKind } from './executor-config.js';

/** Metadata persisted in the advisory loop lock file. */
export interface LoopLockData {
  ownerPid: number;
  startedAtIso: string;
  ttlMs: number;
  lastHeartbeatIso: string;
  packetId: string;
  runtimeKind: ExecutorKind | 'main';
  phase?: string;
  lastActivityIso?: string;
}

/** Owner identity used by the heartbeat driver. */
export interface LoopLockOwnerToken {
  lockPath: string;
  ownerPid: number;
  phase?: string;
}

/** Optional metadata applied while refreshing the lock heartbeat. */
export interface RefreshLoopLockOptions {
  phase?: string;
  lastActivityIso?: string;
}

export type LoopLockAcquireResult =
  | { acquired: true; lock: LoopLockData; reclaimed?: LoopLockData }
  | { acquired: false; holder: LoopLockData };

// ───── CONSTANTS ─────

export const DEFAULT_LOOP_LOCK_HEARTBEAT_INTERVAL_MS = 15_000;

const DEFAULT_LOOP_LOCK_PHASE = 'running';

let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

// ───── DOMAIN ERRORS ─────

export class LoopLockHeldError extends Error {
  holder: LoopLockData;

  constructor(holder: LoopLockData) {
    super(`Deep-loop lock is held by pid ${holder.ownerPid} for packet ${holder.packetId}`);
    this.name = 'LoopLockHeldError';
    this.holder = holder;
  }
}

// ───── HELPERS ─────

type SerializedLoopLockData = {
  owner_pid: number;
  started_at_iso: string;
  ttl_ms: number;
  last_heartbeat_iso: string;
  packet_id: string;
  runtime_kind: ExecutorKind | 'main';
  phase?: string;
  last_activity_iso?: string;
};

function normalizeLoopLockData(data: LoopLockData): LoopLockData {
  const phase = typeof data.phase === 'string' && data.phase.length > 0
    ? data.phase
    : DEFAULT_LOOP_LOCK_PHASE;
  const lastActivityIso = typeof data.lastActivityIso === 'string' && data.lastActivityIso.length > 0
    ? data.lastActivityIso
    : data.lastHeartbeatIso;

  return {
    ...data,
    phase,
    lastActivityIso,
  };
}

function fsyncPath(path: string): void {
  let fd: number | undefined;
  try {
    fd = openSync(path, 'r');
    fsyncSync(fd);
  } finally {
    if (typeof fd === 'number') {
      closeSync(fd);
    }
  }
}

function makeTempPath(targetPath: string): string {
  return `${targetPath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
}

function serializeLock(data: LoopLockData): SerializedLoopLockData {
  const normalized = normalizeLoopLockData(data);
  return {
    owner_pid: normalized.ownerPid,
    started_at_iso: normalized.startedAtIso,
    ttl_ms: normalized.ttlMs,
    last_heartbeat_iso: normalized.lastHeartbeatIso,
    packet_id: normalized.packetId,
    runtime_kind: normalized.runtimeKind,
    phase: normalized.phase,
    last_activity_iso: normalized.lastActivityIso,
  };
}

function deserializeLock(raw: unknown): LoopLockData | null {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const candidate = raw as Partial<SerializedLoopLockData>;
  if (
    !Number.isInteger(candidate.owner_pid) ||
    typeof candidate.started_at_iso !== 'string' ||
    !Number.isInteger(candidate.ttl_ms) ||
    typeof candidate.last_heartbeat_iso !== 'string' ||
    typeof candidate.packet_id !== 'string' ||
    typeof candidate.runtime_kind !== 'string' ||
    (candidate.phase !== undefined && typeof candidate.phase !== 'string') ||
    (candidate.last_activity_iso !== undefined && typeof candidate.last_activity_iso !== 'string')
  ) {
    return null;
  }

  const ownerPid = candidate.owner_pid as number;
  const ttlMs = candidate.ttl_ms as number;

  return normalizeLoopLockData({
    ownerPid,
    startedAtIso: candidate.started_at_iso,
    ttlMs,
    lastHeartbeatIso: candidate.last_heartbeat_iso,
    packetId: candidate.packet_id,
    runtimeKind: candidate.runtime_kind as ExecutorKind | 'main',
    phase: candidate.phase,
    lastActivityIso: candidate.last_activity_iso,
  });
}

function readLoopLock(lockPath: string): LoopLockData | null {
  try {
    return deserializeLock(JSON.parse(readFileSync(lockPath, 'utf8')));
  } catch {
    return null;
  }
}

function writeLoopLockAtomic(lockPath: string, data: LoopLockData): void {
  const tempPath = makeTempPath(lockPath);
  try {
    writeFileSync(tempPath, `${JSON.stringify(serializeLock(data), null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    fsyncPath(tempPath);
    renameSync(tempPath, lockPath);
    try {
      fsyncPath(dirname(lockPath));
    } catch {
    }
  } catch (error: unknown) {
    rmSync(tempPath, { force: true });
    throw error;
  }
}

function writeLoopLockExclusive(lockPath: string, data: LoopLockData): boolean {
  let fd: number | undefined;
  try {
    fd = openSync(lockPath, 'wx');
    writeFileSync(fd, `${JSON.stringify(serializeLock(data), null, 2)}\n`, { encoding: 'utf8' });
    fsyncSync(fd);
  } catch (error: unknown) {
    const code = error && typeof error === 'object' && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
    if (code === 'EEXIST') {
      return false;
    }
    throw error;
  } finally {
    if (typeof fd === 'number') {
      closeSync(fd);
    }
  }

  try {
    fsyncPath(dirname(lockPath));
  } catch {
  }
  return true;
}

/**
 * Atomically claim a stale lock so exactly one reclaimer can replace it.
 *
 * rename() of a single inode succeeds for only the first caller; every
 * other concurrent reclaimer finds the source already gone (ENOENT) and
 * loses the race. The winner moves the stale file aside, then takes the
 * now-vacant path via the same O_EXCL create the fresh path uses, so two
 * reclaimers can never both end up holding the lock. A plain temp+rename
 * write would be last-writer-wins and let both believe they acquired.
 */
function tryReclaimStaleLoopLock(lockPath: string, data: LoopLockData): boolean {
  const reclaimPath = `${lockPath}.reclaiming.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
  try {
    renameSync(lockPath, reclaimPath);
  } catch (error: unknown) {
    const code = error && typeof error === 'object' && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
    if (code === 'ENOENT') {
      return false;
    }
    throw error;
  }

  try {
    return writeLoopLockExclusive(lockPath, data);
  } finally {
    rmSync(reclaimPath, { force: true });
  }
}

// ───── EXPORTS ─────

/**
 * Check whether a process is still alive.
 *
 * Uses kill(pid, 0) as a POSIX signal check. Returns true for
 * processes the current user has permission to signal.
 *
 * @param pid - Process ID to check.
 * @returns True if the process exists and is reachable.
 */
export function processAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'ESRCH') return false;
      if (error.code === 'EPERM') return true;
    }
    return true;
  }
}

/**
 * Determine whether a loop lock has expired or the owner process is dead.
 *
 * A lock is stale if the owner PID no longer exists or the heartbeat
 * has exceeded twice the TTL.
 *
 * @param data - The loop lock data to check.
 * @param now - Reference timestamp (defaults to now).
 * @returns True if the lock is stale and can be reclaimed.
 */
export function isStaleLoopLock(data: LoopLockData, now: Date = new Date()): boolean {
  const heartbeatMs = Date.parse(data.lastHeartbeatIso);
  const ttlMs = Number.isFinite(data.ttlMs) ? data.ttlMs : 0;
  const expired = !Number.isFinite(heartbeatMs) || now.getTime() - heartbeatMs > ttlMs * 2;

  return expired || !processAlive(data.ownerPid);
}

/**
 * Acquire the deep-loop lock, reclaiming stale locks automatically.
 *
 * @param lockPath - File path for the lock file.
 * @param data - Lock metadata for the acquiring process.
 * @returns Result indicating whether the lock was acquired and by whom.
 */
export function acquireLoopLock(lockPath: string, data: LoopLockData): LoopLockAcquireResult {
  const lock = normalizeLoopLockData(data);
  const holder = existsSync(lockPath) ? readLoopLock(lockPath) : null;
  if (holder && !isStaleLoopLock(holder)) {
    return { acquired: false, holder };
  }

  if (!holder) {
    if (writeLoopLockExclusive(lockPath, lock)) {
      return { acquired: true, lock };
    }
    const current = readLoopLock(lockPath);
    return { acquired: false, holder: current ?? lock };
  }

  if (tryReclaimStaleLoopLock(lockPath, lock)) {
    return { acquired: true, lock, reclaimed: holder };
  }
  const current = readLoopLock(lockPath);
  return { acquired: false, holder: current ?? holder };
}

/**
 * Refresh the loop lock heartbeat for the owning process.
 *
 * @param lockPath - File path for the lock file.
 * @param ownerPid - PID of the owning process (must match current owner).
 * @param now - Reference timestamp (defaults to now).
 * @param options - Metadata to store alongside the heartbeat.
 * @returns True if the heartbeat was successfully refreshed.
 */
export function refreshLoopLock(
  lockPath: string,
  ownerPid: number,
  now: Date = new Date(),
  options: RefreshLoopLockOptions = {},
): boolean {
  const holder = existsSync(lockPath) ? readLoopLock(lockPath) : null;
  if (!holder || holder.ownerPid !== ownerPid) {
    return false;
  }

  const heartbeatIso = now.toISOString();
  writeLoopLockAtomic(lockPath, {
    ...holder,
    lastHeartbeatIso: heartbeatIso,
    phase: options.phase ?? holder.phase,
    lastActivityIso: options.lastActivityIso ?? heartbeatIso,
  });
  return true;
}

/**
 * Start refreshing the current owner's lock on a fixed cadence.
 *
 * @param ownerToken - Lock path and owning process identity.
 * @param intervalMs - Refresh cadence in milliseconds.
 */
export function startHeartbeat(
  ownerToken: LoopLockOwnerToken,
  intervalMs: number = DEFAULT_LOOP_LOCK_HEARTBEAT_INTERVAL_MS,
): void {
  if (ownerToken === null || typeof ownerToken !== 'object') {
    throw new TypeError('Heartbeat owner token must be an object');
  }
  if (typeof ownerToken.lockPath !== 'string' || ownerToken.lockPath.length === 0) {
    throw new TypeError('Heartbeat owner token requires a lockPath');
  }
  if (!Number.isInteger(ownerToken.ownerPid) || ownerToken.ownerPid <= 0) {
    throw new TypeError('Heartbeat owner token requires a positive ownerPid');
  }
  if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
    throw new TypeError('Heartbeat interval must be a positive finite number');
  }

  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    try {
      const refreshed = refreshLoopLock(ownerToken.lockPath, ownerToken.ownerPid, new Date(), {
        phase: ownerToken.phase ?? DEFAULT_LOOP_LOCK_PHASE,
      });
      if (!refreshed) {
        stopHeartbeat();
      }
    } catch (error: unknown) {
      console.error(`Failed to refresh deep-loop lock heartbeat for ${ownerToken.lockPath}`, error);
    }
  }, intervalMs);
  heartbeatTimer.unref?.();
}

/** Stop the active lock heartbeat, if one is running. */
export function stopHeartbeat(): void {
  if (heartbeatTimer === null) {
    return;
  }

  clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

/**
 * Release the loop lock for the owning process.
 *
 * @param lockPath - File path for the lock file.
 * @param ownerPid - PID of the owning process (must match current owner).
 * @returns True if the lock was successfully released.
 */
export function releaseLoopLock(lockPath: string, ownerPid: number): boolean {
  const holder = existsSync(lockPath) ? readLoopLock(lockPath) : null;
  if (!holder || holder.ownerPid !== ownerPid) {
    return false;
  }

  unlinkSync(lockPath);
  return true;
}
