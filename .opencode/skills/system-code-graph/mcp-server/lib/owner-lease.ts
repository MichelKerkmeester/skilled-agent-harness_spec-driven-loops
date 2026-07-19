// ───────────────────────────────────────────────────────────────────
// MODULE: Code Graph Owner Lease
// ───────────────────────────────────────────────────────────────────

import {
  closeSync,
  existsSync,
  fsyncSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

import { resolveCanonicalDbDir } from './canonical-db-dir.js';
import { CODE_GRAPH_DEFAULTS } from './config-defaults.js';

export interface OwnerLeaseData {
  ownerPid: number;
  ppid: number;
  executablePath: string;
  startedAtIso: string;
  lastHeartbeatIso: string;
  ttlMs: number;
  canonicalDbDir: string;
}

export type OwnerClassification =
  | 'live-owner'
  | 'stale-pid'
  | 'stale-heartbeat-reclaim'
  | 'ppid-1-orphan'
  | 'symlink-alias'
  | 'unknown-eperm';

export type OwnerLeaseAcquireResult =
  | { acquired: true; lease: OwnerLeaseData; leasePath: string; reclaimed?: OwnerLeaseData; classification?: OwnerClassification }
  | { acquired: false; holder: OwnerLeaseData; leasePath: string; classification: OwnerClassification };

export interface OwnerLeaseOptions {
  readonly ownerPid?: number;
  readonly ppid?: number;
  readonly executablePath?: string;
  readonly ttlMs?: number;
  readonly now?: Date;
  readonly processKill?: (pid: number, signal: 0) => boolean;
  readonly readParentPid?: (pid: number) => number | null;
}

export interface OwnerClassificationOptions {
  readonly processKill?: (pid: number, signal: 0) => boolean;
  readonly readParentPid?: (pid: number) => number | null;
  readonly candidateDbDir?: string;
  readonly now?: Date;
}

const OWNER_LEASE_FILE_NAME = '.code-graph-owner.json';
const OWNER_LEASE_LOCK_FILE_NAME = `${OWNER_LEASE_FILE_NAME}.lock`;
const DEFAULT_TTL_MS = CODE_GRAPH_DEFAULTS.ttlMs;
// A mutation lock is only ever held for a few synchronous fs ops, so any lock with an
// UNPARSEABLE pid (empty/partial) older than this is treated as a wedged orphan from a pre-fix
// binary or a hard crash between openSync and writeFileSync, and is self-healed once.
const WEDGED_MUTATION_LOCK_MAX_AGE_MS = 30_000;

interface OwnerLeaseMutationLock {
  readonly fd: number;
  readonly lockPath: string;
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

function ownerLeasePath(canonicalDbDir: string): string {
  return join(canonicalDbDir, OWNER_LEASE_FILE_NAME);
}

function ownerLeaseLockPath(canonicalDbDir: string): string {
  return join(canonicalDbDir, OWNER_LEASE_LOCK_FILE_NAME);
}

function readOwnerLeaseMutationLockPid(lockPath: string): number | null {
  try {
    const raw = readFileSync(lockPath, 'utf8').trim();
    const pid = Number.parseInt(raw, 10);
    return Number.isInteger(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

// Age (ms) of the lock file, or null if it cannot be stat'd. Used to gate self-healing of
// a wedged empty/partial lock whose pid is unparseable (so the live-pid stale check cannot apply).
function ownerLeaseMutationLockAgeMs(lockPath: string, now: number): number | null {
  try {
    return now - statSync(lockPath).mtimeMs;
  } catch {
    return null;
  }
}

function tryAcquireOwnerLeaseMutationLock(canonicalDbDir: string): OwnerLeaseMutationLock | null {
  const lockPath = ownerLeaseLockPath(canonicalDbDir);
  for (let attempt = 0; attempt < 2; attempt++) {
    let fd: number | undefined;
    try {
      fd = openSync(lockPath, 'wx', 0o600);
      writeFileSync(fd, `${process.pid}\n`, { encoding: 'utf8' });
      fsyncSync(fd);
      return { fd, lockPath };
    } catch (error: unknown) {
      if (typeof fd === 'number') {
        // The openSync('wx') succeeded (we own the just-created lock), but the
        // subsequent writeFileSync/fsyncSync threw (e.g. ENOSPC/EIO). Close the fd AND unlink the
        // orphan lock before re-throwing — otherwise it lingers empty/partial with no parseable
        // pid, every later EEXIST acquirer reads a null pid, the stale-reclaim guard (which
        // requires lockPid !== null) never removes it, and tryAcquire returns null forever ->
        // refreshOwnerLease() returns false forever -> the heartbeat self-shuts-down the server.
        closeSync(fd);
        try {
          unlinkSync(lockPath);
        } catch (cleanupError: unknown) {
          const cleanupCode = cleanupError && typeof cleanupError === 'object' && 'code' in cleanupError
            ? (cleanupError as NodeJS.ErrnoException).code
            : undefined;
          if (cleanupCode !== 'ENOENT') {
            throw cleanupError;
          }
        }
      }
      const code = error && typeof error === 'object' && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
      if (code !== 'EEXIST') {
        throw error;
      }

      const lockPid = readOwnerLeaseMutationLockPid(lockPath);
      if (attempt === 0 && lockPid !== null && getProcessLiveness(lockPid) === 'dead') {
        try {
          // Identity-checked stale-lock removal. Re-read immediately before unlink; a
          // successor may have replaced the dead lock between classification and removal, and
          // unlink-by-path would otherwise delete the successor's live lock. Only remove it if it
          // still holds the same dead PID we classified.
          if (readOwnerLeaseMutationLockPid(lockPath) === lockPid) {
            unlinkSync(lockPath);
          }
          continue;
        } catch (unlinkError: unknown) {
          const unlinkCode = unlinkError && typeof unlinkError === 'object' && 'code' in unlinkError
            ? (unlinkError as NodeJS.ErrnoException).code
            : undefined;
          if (unlinkCode !== 'ENOENT') {
            throw unlinkError;
          }
        }
      }

      // Self-heal a wedged lock whose pid is UNPARSEABLE (empty/partial) — the live-pid
      // check above can never clear it, so without this a pre-fix orphan (or one from a hard crash
      // between openSync and writeFileSync) would wedge tryAcquire -> refresh forever. Gate it on a
      // conservative mtime age (locks are held only for a few synchronous ops) and re-confirm the
      // pid is still unparseable AND the mtime is unchanged immediately before unlink, so we never
      // delete a successor's freshly-written live lock.
      if (attempt === 0 && lockPid === null) {
        const now = Date.now();
        const ageMs = ownerLeaseMutationLockAgeMs(lockPath, now);
        if (ageMs !== null && ageMs > WEDGED_MUTATION_LOCK_MAX_AGE_MS) {
          try {
            if (
              readOwnerLeaseMutationLockPid(lockPath) === null &&
              ownerLeaseMutationLockAgeMs(lockPath, now) === ageMs
            ) {
              unlinkSync(lockPath);
            }
            continue;
          } catch (unlinkError: unknown) {
            const unlinkCode = unlinkError && typeof unlinkError === 'object' && 'code' in unlinkError
              ? (unlinkError as NodeJS.ErrnoException).code
              : undefined;
            if (unlinkCode !== 'ENOENT') {
              throw unlinkError;
            }
          }
        }
      }

      return null;
    }
  }

  return null;
}

function releaseOwnerLeaseMutationLock(lock: OwnerLeaseMutationLock): void {
  try {
    closeSync(lock.fd);
  } finally {
    try {
      unlinkSync(lock.lockPath);
    } catch (error: unknown) {
      const code = error && typeof error === 'object' && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
      if (code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

function isSameOwnerLease(a: OwnerLeaseData, b: OwnerLeaseData): boolean {
  return a.ownerPid === b.ownerPid
    && a.ppid === b.ppid
    && a.executablePath === b.executablePath
    && a.startedAtIso === b.startedAtIso
    && a.lastHeartbeatIso === b.lastHeartbeatIso
    && a.ttlMs === b.ttlMs
    && a.canonicalDbDir === b.canonicalDbDir;
}

function isOwnerLeaseData(raw: unknown): raw is OwnerLeaseData {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const candidate = raw as Partial<OwnerLeaseData>;
  return (
    Number.isInteger(candidate.ownerPid) &&
    Number.isInteger(candidate.ppid) &&
    typeof candidate.executablePath === 'string' &&
    typeof candidate.startedAtIso === 'string' &&
    typeof candidate.lastHeartbeatIso === 'string' &&
    Number.isInteger(candidate.ttlMs) &&
    typeof candidate.canonicalDbDir === 'string'
  );
}

function writeOwnerLeaseAtomic(leasePath: string, data: OwnerLeaseData): void {
  const tempPath = makeTempPath(leasePath);
  try {
    writeFileSync(tempPath, `${JSON.stringify(data, null, 2)}\n`, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
    fsyncPath(tempPath);
    renameSync(tempPath, leasePath);
    try {
      fsyncPath(dirname(leasePath));
    } catch {
      // Directory fsync is best-effort on local filesystems.
    }
  } catch (error) {
    rmSync(tempPath, { force: true });
    throw error;
  }
}

function writeOwnerLeaseExclusive(leasePath: string, data: OwnerLeaseData): boolean {
  let fd: number | undefined;
  try {
    fd = openSync(leasePath, 'wx', 0o600);
    writeFileSync(fd, `${JSON.stringify(data, null, 2)}\n`, { encoding: 'utf8' });
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
    fsyncPath(dirname(leasePath));
  } catch {
    // Directory fsync is best-effort on local filesystems.
  }
  return true;
}

function getProcessLiveness(
  pid: number,
  processKill: (pid: number, signal: 0) => boolean = process.kill,
): 'alive' | 'dead' | 'unknown-eperm' {
  if (!Number.isInteger(pid) || pid <= 0) return 'dead';

  try {
    processKill(pid, 0);
    return 'alive';
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'ESRCH') return 'dead';
      if (error.code === 'EPERM') return 'unknown-eperm';
    }
    return 'alive';
  }
}

export function processAlive(pid: number): boolean {
  return getProcessLiveness(pid) !== 'dead';
}

function isHeartbeatStale(lease: OwnerLeaseData, now: Date = new Date()): boolean {
  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
  const ttlMs = Number.isFinite(lease.ttlMs) ? lease.ttlMs : 0;
  return !Number.isFinite(heartbeatMs) || now.getTime() - heartbeatMs > ttlMs * 2;
}

export function getOwnerLeasePath(dbDir: string): string {
  return ownerLeasePath(resolveCanonicalDbDir(dbDir));
}

export function readOwnerLease(dbDir: string): OwnerLeaseData | null {
  const canonicalDbDir = resolveCanonicalDbDir(dbDir);
  try {
    const parsed = JSON.parse(readFileSync(ownerLeasePath(canonicalDbDir), 'utf8')) as unknown;
    return isOwnerLeaseData(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function readProcessParentPid(pid: number): number | null {
  if (!Number.isInteger(pid) || pid <= 0) return null;

  if (process.platform === 'linux') {
    try {
      const status = readFileSync(`/proc/${pid}/status`, 'utf8');
      const match = /^PPid:\s+(\d+)$/m.exec(status);
      return match ? Number.parseInt(match[1], 10) : null;
    } catch {
      return null;
    }
  }

  try {
    const output = execFileSync('ps', ['-o', 'ppid=', '-p', String(pid)], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return output ? Number.parseInt(output, 10) : null;
  } catch {
    return null;
  }
}

export function classifyOwner(
  lease: OwnerLeaseData,
  options: OwnerClassificationOptions = {},
): OwnerClassification {
  const liveness = getProcessLiveness(lease.ownerPid, options.processKill);
  if (liveness === 'dead') return 'stale-pid';
  if (liveness === 'unknown-eperm') return 'unknown-eperm';

  const actualPpid = (options.readParentPid ?? readProcessParentPid)(lease.ownerPid);
  if (actualPpid !== null && actualPpid !== lease.ppid && actualPpid === 1) {
    return 'ppid-1-orphan';
  }

  if (isHeartbeatStale(lease, options.now)) {
    return 'stale-heartbeat-reclaim';
  }

  if (options.candidateDbDir) {
    const candidateResolved = resolve(options.candidateDbDir);
    const candidateCanonical = resolveCanonicalDbDir(options.candidateDbDir);
    if (candidateCanonical === lease.canonicalDbDir && candidateResolved !== lease.canonicalDbDir) {
      return 'symlink-alias';
    }
  }

  return 'live-owner';
}

export function acquireOwnerLease(dbDir: string, options: OwnerLeaseOptions = {}): OwnerLeaseAcquireResult {
  const canonicalDbDir = resolveCanonicalDbDir(dbDir);
  const leasePath = ownerLeasePath(canonicalDbDir);
  const existing = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
  const now = options.now ?? new Date();
  let existingClassification: OwnerClassification | undefined;

  if (existing) {
    const classification = classifyOwner(existing, {
      processKill: options.processKill,
      readParentPid: options.readParentPid,
      now,
    });
    existingClassification = classification;
    if (
      classification === 'live-owner' ||
      classification === 'symlink-alias' ||
      classification === 'unknown-eperm'
    ) {
      return { acquired: false, holder: existing, leasePath, classification };
    }
  }

  const lease: OwnerLeaseData = {
    ownerPid: options.ownerPid ?? process.pid,
    ppid: options.ppid ?? process.ppid,
    executablePath: options.executablePath ?? process.execPath,
    startedAtIso: now.toISOString(),
    lastHeartbeatIso: now.toISOString(),
    ttlMs: options.ttlMs ?? DEFAULT_TTL_MS,
    canonicalDbDir,
  };

  if (!existing) {
    if (writeOwnerLeaseExclusive(leasePath, lease)) {
      return { acquired: true, lease, leasePath };
    }
    const holder = readOwnerLease(canonicalDbDir);
    return holder
      ? {
          acquired: false,
          holder,
          leasePath,
          classification: classifyOwner(holder, {
            processKill: options.processKill,
            readParentPid: options.readParentPid,
            now,
          }),
        }
      : { acquired: false, holder: lease, leasePath, classification: 'live-owner' };
  }

  const lock = tryAcquireOwnerLeaseMutationLock(canonicalDbDir);
  if (!lock) {
    const holder = readOwnerLease(canonicalDbDir);
    return {
      acquired: false,
      holder: holder ?? existing,
      leasePath,
      classification: holder
        ? classifyOwner(holder, {
            processKill: options.processKill,
            readParentPid: options.readParentPid,
            now,
          })
        : existingClassification ?? 'live-owner',
    };
  }

  try {
    const current = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
    if (current && !isSameOwnerLease(current, existing)) {
      return {
        acquired: false,
        holder: current,
        leasePath,
        classification: classifyOwner(current, {
          processKill: options.processKill,
          readParentPid: options.readParentPid,
          now,
        }),
      };
    }
    if (current) {
      const currentClassification = classifyOwner(current, {
        processKill: options.processKill,
        readParentPid: options.readParentPid,
        now,
      });
      if (
        currentClassification === 'live-owner' ||
        currentClassification === 'symlink-alias' ||
        currentClassification === 'unknown-eperm'
      ) {
        return { acquired: false, holder: current, leasePath, classification: currentClassification };
      }
    }

    writeOwnerLeaseAtomic(leasePath, lease);
    return { acquired: true, lease, leasePath, reclaimed: current ?? existing, classification: existingClassification };
  } finally {
    releaseOwnerLeaseMutationLock(lock);
  }
}

export function refreshOwnerLease(
  dbDir: string,
  ownerPid: number,
  now: Date = new Date(),
  patch: Partial<Pick<OwnerLeaseData, 'ownerPid' | 'ppid' | 'executablePath'>> = {},
): boolean {
  const canonicalDbDir = resolveCanonicalDbDir(dbDir);
  const leasePath = ownerLeasePath(canonicalDbDir);
  const lock = tryAcquireOwnerLeaseMutationLock(canonicalDbDir);
  if (!lock) return false;

  try {
    const holder = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
    if (!holder || holder.ownerPid !== ownerPid) return false;

    writeOwnerLeaseAtomic(leasePath, {
      ...holder,
      ...patch,
      lastHeartbeatIso: now.toISOString(),
    });
    return true;
  } finally {
    releaseOwnerLeaseMutationLock(lock);
  }
}

export function releaseOwnerLease(dbDir: string, ownerPid: number): boolean {
  const canonicalDbDir = resolveCanonicalDbDir(dbDir);
  const leasePath = ownerLeasePath(canonicalDbDir);
  // Release under the same mutation lock as acquire/refresh, and re-read the lease
  // while holding it. Without the lock, a concurrent reclaim that writes a successor lease
  // between the read and the unlink would have its lease deleted by path (split-brain).
  const lock = tryAcquireOwnerLeaseMutationLock(canonicalDbDir);
  if (!lock) return false;
  try {
    const holder = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
    if (!holder || holder.ownerPid !== ownerPid) return false;
    unlinkSync(leasePath);
    return true;
  } finally {
    releaseOwnerLeaseMutationLock(lock);
  }
}

export { OWNER_LEASE_FILE_NAME };
