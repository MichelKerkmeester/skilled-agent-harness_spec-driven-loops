// ───────────────────────────────────────────────────────────────
// MODULE: DB Instance Lock
// ───────────────────────────────────────────────────────────────
// Single-writer guard for a SQLite database file. Two processes writing
// the same database file is the corruption class this module exists to
// prevent, so every writer must acquire this lock before better-sqlite3
// opens the main database.
//
// Primitive: a sidecar SQLite database (`<db>.lock`) opened with
// locking_mode=EXCLUSIVE and written once inside BEGIN IMMEDIATE. SQLite's
// unix VFS then takes — and, under EXCLUSIVE locking mode, retains — a
// kernel fcntl lock on the sidecar for the life of the connection. The
// kernel releases that lock at process death (including SIGKILL), so
// there is no stale-lock state to detect or clear, and a process can
// never release a lock another process holds. The sidecar file itself is
// NEVER unlinked: arbitration rides on kernel lock state keyed by inode,
// not on file presence — unlinking it would silently break exclusion for
// a live holder.
//
// BEGIN IMMEDIATE matters: a read-only first touch would take (and
// retain) only a SHARED lock, letting two contenders each hold SHARED and
// then mutually starve on upgrade. Declaring write intent up front makes
// the kernel arbitrate cleanly: exactly one contender proceeds.

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { randomUUID } from 'crypto';

import Database from 'better-sqlite3';

import { VectorIndexError, VectorIndexErrorCode } from './vector-index-types.js';

/** Kill switch: set to '1' to disable single-writer enforcement entirely. */
export const DB_LOCK_DISABLE_ENV = 'SPECKIT_DB_LOCK_DISABLE';

export type DbInstanceLockHandle = {
  conn: Database.Database;
  token: string;
  lockPath: string;
  infoPath: string;
};

export type AcquireDbInstanceLockOptions = {
  /**
   * How long SQLite's busy handler waits for the kernel lock before the
   * acquire fails. The default absorbs a clean handover window (previous
   * holder still inside its shutdown path) without making a genuinely
   * contended boot hang.
   */
  acquireTimeoutMs?: number;
};

const held = new Map<string, DbInstanceLockHandle>();
let disabledWarningEmitted = false;

function lock_path_for(resolvedDbPath: string): string {
  return `${resolvedDbPath}.lock`;
}

function info_path_for(resolvedDbPath: string): string {
  return `${resolvedDbPath}.lock-info.json`;
}

function sqlite_error_code(error: unknown): string | undefined {
  return (error as { code?: string } | null | undefined)?.code;
}

function is_sqlite_busy(error: unknown): boolean {
  const code = sqlite_error_code(error);
  return code === 'SQLITE_BUSY' || code === 'SQLITE_BUSY_SNAPSHOT';
}

function is_sqlite_not_a_db(error: unknown): boolean {
  const code = sqlite_error_code(error);
  return code === 'SQLITE_NOTADB' || code === 'SQLITE_CORRUPT';
}

type HolderInfo = {
  pid?: number;
  startedAt?: string;
  token?: string;
};

function read_holder_info(infoPath: string): HolderInfo | null {
  try {
    return JSON.parse(fs.readFileSync(infoPath, 'utf8')) as HolderInfo;
  } catch (_: unknown) {
    return null;
  }
}

/**
 * Writes the diagnostic sidecar describing the current holder. A contender
 * cannot read the lock database while EXCLUSIVE is held, so refusal
 * messages and launcher diagnostics read this JSON instead. It is never
 * used for arbitration — wiping it harms nothing.
 */
function write_holder_info(handle: DbInstanceLockHandle, dbPath: string, startedAt: string): void {
  try {
    const payload = JSON.stringify({
      pid: process.pid,
      startedAt,
      token: handle.token,
      dbPath,
      hostname: os.hostname(),
    });
    const tmpPath = `${handle.infoPath}.tmp-${process.pid}`;
    fs.writeFileSync(tmpPath, payload, { mode: 0o600 });
    fs.renameSync(tmpPath, handle.infoPath);
  } catch (_: unknown) {
    // Diagnostics only — acquisition already succeeded on the kernel lock.
  }
}

/**
 * Acquires the single-writer lock for the given database path.
 *
 * Reentrant per process: a second acquire for the same resolved path
 * returns the already-held handle. Returns null when the kill switch is
 * set or the path is in-memory.
 *
 * @throws {VectorIndexError} code DB_LOCK_HELD when another live process
 *   holds the lock; code INTEGRITY_ERROR when the sidecar is unreadable.
 */
export function acquire_db_instance_lock(
  target_path: string,
  options: AcquireDbInstanceLockOptions = {},
): DbInstanceLockHandle | null {
  if (process.env[DB_LOCK_DISABLE_ENV] === '1') {
    if (!disabledWarningEmitted) {
      disabledWarningEmitted = true;
      console.warn(
        `[db-instance-lock] DISABLED via ${DB_LOCK_DISABLE_ENV}=1 — concurrent writers on the same database will NOT be blocked`,
      );
    }
    return null;
  }
  if (!target_path || target_path === ':memory:') return null;

  const key = path.resolve(target_path);
  const existing = held.get(key);
  if (existing) return existing;

  const lockPath = lock_path_for(key);
  const dir = path.dirname(key);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  const timeoutMs = options.acquireTimeoutMs ?? 1800;
  let conn: Database.Database | null = null;
  try {
    conn = new Database(lockPath);
    conn.pragma(`busy_timeout = ${Math.max(0, Math.floor(timeoutMs))}`);
    // WAL allows concurrent connections by design and would defeat the
    // exclusivity this lock exists to provide.
    conn.pragma('journal_mode = DELETE');
    conn.pragma('locking_mode = EXCLUSIVE');
    conn.exec('BEGIN IMMEDIATE');
    conn.exec(
      'CREATE TABLE IF NOT EXISTS lock_owner ('
      + 'id INTEGER PRIMARY KEY CHECK (id = 1), '
      + 'pid INTEGER NOT NULL, '
      + 'started_at TEXT NOT NULL, '
      + 'token TEXT NOT NULL)',
    );
    const token = randomUUID();
    const startedAt = new Date().toISOString();
    conn.prepare('INSERT OR REPLACE INTO lock_owner (id, pid, started_at, token) VALUES (1, ?, ?, ?)')
      .run(process.pid, startedAt, token);
    conn.exec('COMMIT');

    const handle: DbInstanceLockHandle = {
      conn,
      token,
      lockPath,
      infoPath: info_path_for(key),
    };
    held.set(key, handle);
    write_holder_info(handle, key, startedAt);
    return handle;
  } catch (error: unknown) {
    try { conn?.close(); } catch (_: unknown) { /* best-effort */ }
    if (is_sqlite_busy(error)) {
      const holder = read_holder_info(info_path_for(key));
      const holderNote = holder?.pid
        ? ` (held by pid ${holder.pid}${holder.startedAt ? ` since ${holder.startedAt}` : ''})`
        : '';
      throw new VectorIndexError(
        `another live process holds the single-writer lock for ${key}${holderNote}; `
        + 'refusing to open a second writer on the same database',
        VectorIndexErrorCode.DB_LOCK_HELD,
      );
    }
    if (is_sqlite_not_a_db(error)) {
      throw new VectorIndexError(
        `single-writer lock sidecar ${lockPath} is unreadable; it holds no data — `
        + 'after confirming no daemon or maintenance script is running, delete it manually and retry',
        VectorIndexErrorCode.INTEGRITY_ERROR,
      );
    }
    throw error;
  }
}

/**
 * Releases the lock this process holds for ONE database path. Closing the
 * connection is what releases the kernel lock; a non-holder has no map
 * entry, so this is structurally incapable of releasing another process's
 * lock. The diagnostic JSON is removed only when its token matches ours.
 */
export function release_db_instance_lock(target_path: string): void {
  const key = path.resolve(target_path);
  const handle = held.get(key);
  if (!handle) return;
  try { handle.conn.close(); } catch (_: unknown) { /* best-effort */ }
  try {
    const info = read_holder_info(handle.infoPath);
    if (info && info.token === handle.token) {
      fs.rmSync(handle.infoPath, { force: true });
    }
  } catch (_: unknown) { /* diagnostics only */ }
  held.delete(key);
}

/**
 * Releases every lock this process holds. Intended for whole-process
 * teardown (daemon close_db, standalone CLI exit); library-style callers
 * that may share a process should release their own path instead.
 */
export function release_db_instance_locks(): void {
  for (const key of [...held.keys()]) {
    release_db_instance_lock(key);
  }
}

/** Returns the held handle for a database path, or null. Read-only accessor. */
export function held_db_instance_lock(target_path: string): DbInstanceLockHandle | null {
  return held.get(path.resolve(target_path)) ?? null;
}

export {
  acquire_db_instance_lock as acquireDbInstanceLock,
  release_db_instance_lock as releaseDbInstanceLock,
  release_db_instance_locks as releaseDbInstanceLocks,
  held_db_instance_lock as heldDbInstanceLock,
};
