// ───────────────────────────────────────────────────────────────
// MODULE: Memory Drift Processing-Marker Sweep
// ───────────────────────────────────────────────────────────────
// Kept in its own module (rather than inline in startup-checks.ts) so its
// compiled size doesn't push that file's line-count checks over budget.
// Recovers `.memory-drift-dirty-paths.json.processing-*` files orphaned by
// a boot that was killed externally before it finished consuming the
// canonical drift marker. See sweepStaleMemoryDriftProcessingMarkers below
// for the full recovery contract.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {
  MEMORY_DRIFT_MARKER_FILENAME,
  type MemoryDriftMarkerEntry,
  type MemoryDriftMarkerPayload,
  memoryDriftMarkerEntryKey,
  parseMemoryDriftMarker,
  resolveMemoryDriftMarkerPath,
} from './memory-drift-healing.js';

interface DriftMarkerLockOwner {
  version: 1;
  pid: number;
  token: string;
  heartbeatAt: string;
}

interface DriftMarkerLockSnapshot {
  stats: fs.Stats;
  rawOwner: string | null;
  owner: DriftMarkerLockOwner | null;
}

// The git-hook producer uses these exact constants and owner shape. A live PID
// remains authoritative across debugger or scheduler pauses; age only permits
// reclaim when ownership is absent or invalid.
const LOCK_STALE_MS = 45_000;
const LOCK_HEARTBEAT_MS = 15_000;
const LOCK_WAIT_MS = 25;
const LOCK_WAIT_TIMEOUT_MS = 5_000;
const LOCK_OWNER_FILENAME = 'owner.json';

function errorCode(error: unknown): string | null {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : null;
}

function parseLockOwner(raw: string): DriftMarkerLockOwner | null {
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
      ? owner as unknown as DriftMarkerLockOwner
      : null;
  } catch {
    return null;
  }
}

function readLockSnapshot(lockDir: string): DriftMarkerLockSnapshot | null {
  let stats: fs.Stats;
  try {
    stats = fs.statSync(lockDir);
  } catch {
    return null;
  }

  let rawOwner: string | null = null;
  try {
    rawOwner = fs.readFileSync(path.join(lockDir, LOCK_OWNER_FILENAME), 'utf8');
  } catch (error: unknown) {
    if (errorCode(error) !== 'ENOENT') return null;
  }
  return {
    stats,
    rawOwner,
    owner: rawOwner === null ? null : parseLockOwner(rawOwner),
  };
}

function ownerLiveness(pid: number): boolean | null {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error: unknown) {
    const code = errorCode(error);
    if (code === 'ESRCH') return false;
    if (code === 'EPERM') return true;
    return null;
  }
}

function writeLockOwner(
  lockDir: string,
  owner: DriftMarkerLockOwner,
): DriftMarkerLockOwner {
  const nextOwner: DriftMarkerLockOwner = {
    ...owner,
    heartbeatAt: new Date().toISOString(),
  };
  const ownerPath = path.join(lockDir, LOCK_OWNER_FILENAME);
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

function restoreMovedLock(movedDir: string, lockDir: string): void {
  try {
    fs.renameSync(movedDir, lockDir);
  } catch {
    // A replacement lock wins; leave the mismatched directory untouched.
  }
}

function reclaimEligibleLock(
  lockDir: string,
  snapshot: DriftMarkerLockSnapshot,
): boolean {
  const reclaimedDir = `${lockDir}.reclaiming-${process.pid}-${Date.now()}`;
  try {
    fs.renameSync(lockDir, reclaimedDir);
  } catch {
    return false;
  }

  const movedSnapshot = readLockSnapshot(reclaimedDir);
  if (!movedSnapshot || movedSnapshot.rawOwner !== snapshot.rawOwner) {
    restoreMovedLock(reclaimedDir, lockDir);
    return false;
  }
  try { fs.rmSync(reclaimedDir, { recursive: true, force: true }); } catch { /* cleanup best-effort */ }
  return true;
}

function abandonUninitializedLock(lockDir: string): void {
  const abandonedDir = `${lockDir}.abandoned-${process.pid}-${Date.now()}`;
  try {
    fs.renameSync(lockDir, abandonedDir);
    fs.rmSync(abandonedDir, { recursive: true, force: true });
  } catch {
    // The lock remains unavailable until a later stale-owner recovery.
  }
}

function acquireMarkerLock(lockDir: string): DriftMarkerLockOwner | null {
  let owner: DriftMarkerLockOwner = {
    version: 1,
    pid: process.pid,
    token: crypto.randomUUID(),
    heartbeatAt: '',
  };
  const started = Date.now();
  while (true) {
    try {
      fs.mkdirSync(lockDir);
      try {
        owner = writeLockOwner(lockDir, owner);
      } catch {
        abandonUninitializedLock(lockDir);
        return null;
      }
      return owner;
    } catch (error: unknown) {
      if (errorCode(error) === 'EEXIST') {
        const snapshot = readLockSnapshot(lockDir);
        if (snapshot) {
          const liveness = snapshot.owner ? ownerLiveness(snapshot.owner.pid) : null;
          const isMissingOwnerStale = !snapshot.owner
            && (Date.now() - snapshot.stats.mtimeMs) > LOCK_STALE_MS;
          if ((liveness === false || isMissingOwnerStale)
            && reclaimEligibleLock(lockDir, snapshot)) {
            continue;
          }
        }
      }
      if (Date.now() - started > LOCK_WAIT_TIMEOUT_MS) return null;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, LOCK_WAIT_MS);
    }
  }
}

function heartbeatOwnedLock(
  lockDir: string,
  owner: DriftMarkerLockOwner,
): DriftMarkerLockOwner | null {
  const snapshot = readLockSnapshot(lockDir);
  if (!snapshot || !snapshot.owner || snapshot.owner.token !== owner.token) return null;
  try {
    return writeLockOwner(lockDir, owner);
  } catch {
    return null;
  }
}

function releaseOwnedLock(lockDir: string, token: string): void {
  const snapshot = readLockSnapshot(lockDir);
  if (!snapshot || !snapshot.owner || snapshot.owner.token !== token) return;

  const releasingDir = `${lockDir}.releasing-${process.pid}-${token}`;
  try {
    fs.renameSync(lockDir, releasingDir);
  } catch {
    return;
  }
  const movedSnapshot = readLockSnapshot(releasingDir);
  if (!movedSnapshot || !movedSnapshot.owner || movedSnapshot.owner.token !== token) {
    restoreMovedLock(releasingDir, lockDir);
    return;
  }
  try { fs.rmSync(releasingDir, { recursive: true, force: true }); } catch { /* cleanup best-effort */ }
}

function processingOwnerPid(name: string, prefix: string): number | null {
  const separatorIndex = name.indexOf('-', prefix.length);
  if (separatorIndex < 0) return null;
  const pid = Number(name.slice(prefix.length, separatorIndex));
  return Number.isSafeInteger(pid) && pid > 0 ? pid : null;
}

export interface MemoryDriftProcessingSweepResult {
  /** Stale `.processing-*` files whose entries were successfully read and merged back. */
  recovered: number;
  /** Stale `.processing-*` files that were malformed/unreadable and could not be recovered. */
  unrecoverable: number;
  /** Total marker entries restored to the canonical marker path (post-dedup). */
  entries: number;
}

/**
 * Recovers `.memory-drift-dirty-paths.json.processing-*` files orphaned by a boot
 * that was killed externally (e.g. by an MCP client's init-timeout watchdog) after
 * `consumeMemoryDriftDirtyMarker` claimed the canonical marker via rename but before
 * it either consumed or restored it. Runs once at boot, immediately before the
 * normal `consumeMemoryDriftDirtyMarker` call, so any recovered entries reach the
 * existing consume-and-scan path on the same boot instead of being orphaned forever.
 *
 * Merge policy: every stale claim file found is merged (not just the most recent) --
 * each one represents marker entries a killed boot never finished processing, and
 * none of them are individually recoverable later, so dropping any would silently
 * lose that entry's chance at Layer 2 auto-healing. A stale file that already exists
 * at the canonical marker path (e.g. written fresh by the git hook after the sweep
 * started) is merged into rather than clobbered.
 *
 * Never blocks startup: a missing memory DB directory, or a malformed/unreadable
 * stale file, is treated as a no-op / logged-and-skipped, matching the canonical
 * marker's own "never block startup" precedent in `consumeMemoryDriftDirtyMarker`.
 */
export function sweepStaleMemoryDriftProcessingMarkers(
  options: { databasePath: string },
): MemoryDriftProcessingSweepResult {
  const result: MemoryDriftProcessingSweepResult = { recovered: 0, unrecoverable: 0, entries: 0 };
  const markerPath = resolveMemoryDriftMarkerPath(options.databasePath);
  const dir = path.dirname(markerPath);
  const prefix = `${path.basename(markerPath)}.processing-`;

  let dirEntries: string[];
  try {
    dirEntries = fs.readdirSync(dir);
  } catch {
    // Memory DB directory doesn't exist yet (fresh install) -- nothing to sweep.
    return result;
  }

  const staleFiles = dirEntries
    .filter((name) => name.startsWith(prefix))
    .sort()
    .map((name) => path.join(dir, name));

  if (staleFiles.length === 0) {
    return result;
  }

  const lockDir = `${markerPath}.lock`;
  let lockOwner = acquireMarkerLock(lockDir);
  if (!lockOwner) return result;
  let tempPath: string | null = null;
  try {
    const mergedByKey = new Map<string, MemoryDriftMarkerEntry>();
    const recoverableFiles: string[] = [];
    let mostRecentUpdatedAt: string | undefined;
    let lastHeartbeatAt = Date.now();

    for (const staleFile of staleFiles) {
      const fileName = path.basename(staleFile);
      const ownerPid = processingOwnerPid(fileName, prefix);
      if (ownerPid !== null && ownerLiveness(ownerPid) !== false) {
        continue;
      }

      let raw: string;
      try {
        raw = fs.readFileSync(staleFile, 'utf8');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[context-server] stale ${fileName} unreadable, treating as unrecoverable: ${message}`);
        result.unrecoverable += 1;
        continue;
      }

      const parsed = parseMemoryDriftMarker(raw);
      if (!parsed || parsed.entries.length === 0) {
        console.warn(`[context-server] stale ${fileName} malformed or empty, treating as unrecoverable`);
        result.unrecoverable += 1;
        try { fs.unlinkSync(staleFile); } catch { /* cleanup best-effort */ }
        continue;
      }

      for (const entry of parsed.entries) {
        mergedByKey.set(memoryDriftMarkerEntryKey(entry), entry);
      }
      if (parsed.updatedAt && (!mostRecentUpdatedAt || parsed.updatedAt > mostRecentUpdatedAt)) {
        mostRecentUpdatedAt = parsed.updatedAt;
      }
      recoverableFiles.push(staleFile);

      if (Date.now() - lastHeartbeatAt >= LOCK_HEARTBEAT_MS) {
        const nextOwner = heartbeatOwnedLock(lockDir, lockOwner);
        if (!nextOwner) throw new Error('drift-marker lock ownership was lost during recovery');
        lockOwner = nextOwner;
        lastHeartbeatAt = Date.now();
      }
    }

    if (mergedByKey.size === 0) return result;

    try {
      const existingRaw = fs.readFileSync(markerPath, 'utf8');
      const existingParsed = parseMemoryDriftMarker(existingRaw);
      if (existingParsed) {
        for (const entry of existingParsed.entries) {
          mergedByKey.set(memoryDriftMarkerEntryKey(entry), entry);
        }
        if (existingParsed.updatedAt
          && (!mostRecentUpdatedAt || existingParsed.updatedAt > mostRecentUpdatedAt)) {
          mostRecentUpdatedAt = existingParsed.updatedAt;
        }
      }
    } catch (error: unknown) {
      if (errorCode(error) !== 'ENOENT') throw error;
    }

    const nextOwner = heartbeatOwnedLock(lockDir, lockOwner);
    if (!nextOwner) throw new Error('drift-marker lock ownership was lost before commit');
    lockOwner = nextOwner;

    const payload: MemoryDriftMarkerPayload = {
      version: 1,
      updatedAt: mostRecentUpdatedAt ?? new Date().toISOString(),
      entries: Array.from(mergedByKey.values()),
    };
    tempPath = `${markerPath}.tmp-${process.pid}-${Date.now()}-${crypto.randomUUID()}`;
    fs.writeFileSync(tempPath, `${JSON.stringify(payload)}\n`, 'utf8');
    fs.renameSync(tempPath, markerPath);
    tempPath = null;

    result.recovered = recoverableFiles.length;
    result.entries = payload.entries.length;
    for (const staleFile of recoverableFiles) {
      try { fs.unlinkSync(staleFile); } catch { /* canonical marker is now authoritative */ }
    }
    console.error(`[context-server] Recovered ${result.recovered} stale ${MEMORY_DRIFT_MARKER_FILENAME}.processing-* file(s) from a killed prior boot: ${result.entries} entr${result.entries === 1 ? 'y' : 'ies'} restored for consumption`);
  } catch (error: unknown) {
    if (tempPath !== null) {
      try { fs.unlinkSync(tempPath); } catch { /* cleanup best-effort */ }
    }
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[context-server] Could not restore recovered drift-marker entries; leaving stale files unconsumed: ${message}`);
  } finally {
    releaseOwnedLock(lockDir, lockOwner.token);
  }

  return result;
}
