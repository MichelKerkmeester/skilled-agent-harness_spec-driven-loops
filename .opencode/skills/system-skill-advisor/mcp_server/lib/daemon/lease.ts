// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Daemon Lease
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { chmodSync, existsSync, mkdirSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export interface LeaseOptions {
  readonly workspaceRoot: string;
  readonly leaseDbPath?: string;
  readonly ownerId?: string;
  readonly staleAfterMs?: number;
  readonly heartbeatMs?: number;
  readonly now?: () => number;
}

export interface LeaseAcquireResult {
  readonly acquired: boolean;
  readonly ownerId: string;
  readonly reason: 'acquired' | 'held_by_other';
  readonly incumbentOwnerId: string | null;
  readonly staleReclaimed: boolean;
}

export interface LeaseSnapshot {
  readonly workspaceKey: string;
  readonly ownerId: string;
  readonly pid: number;
  readonly acquiredAt: number;
  readonly heartbeatAt: number;
  readonly startedAt: string;
}

export interface LeaseHeldResult {
  readonly held: boolean;
  readonly ownerPid: number | null;
  readonly staleReclaimable: boolean;
  readonly startedAt: string | null;
  readonly legacyPath?: string | null;
}

export interface SkillGraphLease {
  readonly ownerId: string;
  readonly acquired: boolean;
  readonly result: LeaseAcquireResult;
  heartbeat: () => void;
  release: () => void;
  close: () => void;
}

const DEFAULT_STALE_AFTER_MS = 30_000;
const DEFAULT_HEARTBEAT_MS = 5_000;
const LEASE_DB_FILENAME = 'skill-graph-daemon-lease.sqlite';
const LEGACY_LEASE_RELATIVE_PATH = join(
  '.opencode',
  'skills',
  '.advisor-state',
  LEASE_DB_FILENAME,
);

interface OpenLeaseDatabaseOptions {
  readonly readonly?: boolean;
}

function canonicalizePath(pathValue: string): string {
  const resolvedPath = resolve(pathValue);
  try {
    return realpathSync.native(resolvedPath);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return resolvedPath;
    }
    throw error;
  }
}

function ensureCanonicalDir(dirPath: string): string {
  mkdirSync(canonicalizePath(dirPath), { recursive: true, mode: 0o700 });
  return canonicalizePath(dirPath);
}

function resolveSkillAdvisorDbDir(workspaceRoot: string): string {
  const overrideDbDir = process.env.MK_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  if (overrideDbDir) {
    return canonicalizePath(overrideDbDir);
  }
  return canonicalizePath(join(
    canonicalizePath(workspaceRoot),
    '.opencode',
    'skills',
    'system-skill-advisor',
    'mcp_server',
    'database',
  ));
}

function defaultLeaseDbPath(workspaceRoot: string): string {
  return join(resolveSkillAdvisorDbDir(workspaceRoot), LEASE_DB_FILENAME);
}

function resolveLeaseDbPath(workspaceRoot: string, leaseDbPath?: string): string {
  return leaseDbPath ? canonicalizePath(leaseDbPath) : defaultLeaseDbPath(workspaceRoot);
}

function legacyLeaseDbPath(workspaceRoot: string): string {
  return canonicalizePath(join(canonicalizePath(workspaceRoot), LEGACY_LEASE_RELATIVE_PATH));
}

function workspaceKey(workspaceRoot: string, leaseDbPath?: string): string {
  return dirname(resolveLeaseDbPath(workspaceRoot, leaseDbPath));
}

function legacyWorkspaceKey(workspaceRoot: string): string {
  return resolve(workspaceRoot);
}

function createOwnerId(): string {
  return `${process.pid}:${Date.now()}:${Math.random().toString(16).slice(2)}`;
}

function ensureSchema(db: Database.Database): void {
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS skill_graph_daemon_lease (
      workspace_key TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      pid INTEGER NOT NULL,
      acquired_at INTEGER NOT NULL,
      heartbeat_at INTEGER NOT NULL
    );
  `);
}

export function openLeaseDatabase(
  workspaceRoot: string,
  leaseDbPath?: string,
  options: OpenLeaseDatabaseOptions = {},
): Database.Database {
  const dbPath = resolveLeaseDbPath(workspaceRoot, leaseDbPath);
  if (!options.readonly) {
    ensureCanonicalDir(dirname(dbPath));
  }
  const db = options.readonly
    ? new Database(dbPath, { readonly: true, fileMustExist: true })
    : new Database(dbPath);
  if (!options.readonly) {
    chmodSync(dbPath, 0o600);
  }
  db.pragma('busy_timeout = 1000');
  if (!options.readonly) {
    ensureSchema(db);
  }
  return db;
}

function readLeaseSnapshotForKey(
  workspaceRoot: string,
  leaseDbPath: string | undefined,
  key: string,
  openOptions: OpenLeaseDatabaseOptions,
): LeaseSnapshot | null {
  const db = openLeaseDatabase(workspaceRoot, leaseDbPath, openOptions);
  try {
    const row = db.prepare(`
      SELECT workspace_key, owner_id, pid, acquired_at, heartbeat_at
      FROM skill_graph_daemon_lease
      WHERE workspace_key = ?
    `).get(key) as {
      workspace_key: string;
      owner_id: string;
      pid: number;
      acquired_at: number;
      heartbeat_at: number;
    } | undefined;
    if (!row) return null;
    return {
      workspaceKey: row.workspace_key,
      ownerId: row.owner_id,
      pid: row.pid,
      acquiredAt: row.acquired_at,
      heartbeatAt: row.heartbeat_at,
      startedAt: new Date(row.acquired_at).toISOString(),
    };
  } finally {
    db.close();
  }
}

export function readLeaseSnapshot(
  workspaceRoot: string,
  options: Pick<LeaseOptions, 'leaseDbPath'> = {},
  openOptions: OpenLeaseDatabaseOptions = {},
): LeaseSnapshot | null {
  return readLeaseSnapshotForKey(
    workspaceRoot,
    options.leaseDbPath,
    workspaceKey(workspaceRoot, options.leaseDbPath),
    openOptions,
  );
}

function readLeaseHeldAt(
  workspaceRoot: string,
  leaseDbPath: string | undefined,
  key: string,
  legacyPath: string | null = null,
): LeaseHeldResult {
  if (!existsSync(resolveLeaseDbPath(workspaceRoot, leaseDbPath))) {
    return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath };
  }
  let snapshot: LeaseSnapshot | null;
  try {
    snapshot = readLeaseSnapshotForKey(workspaceRoot, leaseDbPath, key, { readonly: true });
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT' || code === 'SQLITE_CANTOPEN') {
      return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath };
    }
    throw error;
  }
  if (!snapshot) {
    return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath };
  }

  try {
    process.kill(snapshot.pid, 0);
    return {
      held: true,
      ownerPid: snapshot.pid,
      staleReclaimable: false,
      startedAt: snapshot.startedAt,
      legacyPath,
    };
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ESRCH') {
      return {
        held: false,
        ownerPid: snapshot.pid,
        staleReclaimable: true,
        startedAt: snapshot.startedAt,
        legacyPath,
      };
    }
    if (code === 'EPERM') {
      return {
        held: true,
        ownerPid: snapshot.pid,
        staleReclaimable: false,
        startedAt: snapshot.startedAt,
        legacyPath,
      };
    }
    throw error;
  }
}

export function isLeaseHeld(
  workspaceRoot: string,
  options: Pick<LeaseOptions, 'leaseDbPath'> = {},
): LeaseHeldResult {
  const primary = readLeaseHeldAt(
    workspaceRoot,
    options.leaseDbPath,
    workspaceKey(workspaceRoot, options.leaseDbPath),
  );
  if (primary.held) {
    return primary;
  }

  if (!options.leaseDbPath) {
    const legacyPath = legacyLeaseDbPath(workspaceRoot);
    const legacy = readLeaseHeldAt(
      workspaceRoot,
      legacyPath,
      legacyWorkspaceKey(workspaceRoot),
      legacyPath,
    );
    if (legacy.held) {
      return legacy;
    }
    if (legacy.staleReclaimable) {
      return legacy;
    }
  }

  return primary;
}

export function acquireSkillGraphLease(options: LeaseOptions): SkillGraphLease {
  const ownerId = options.ownerId ?? createOwnerId();
  const staleAfterMs = options.staleAfterMs ?? DEFAULT_STALE_AFTER_MS;
  const heartbeatMs = options.heartbeatMs ?? DEFAULT_HEARTBEAT_MS;
  const now = options.now ?? (() => Date.now());
  const db = openLeaseDatabase(options.workspaceRoot, options.leaseDbPath);
  const workspace = workspaceKey(options.workspaceRoot, options.leaseDbPath);
  let acquired = false;

  const reserve = db.transaction((): LeaseAcquireResult => {
    const currentTime = now();
    const row = db.prepare(`
      SELECT owner_id, heartbeat_at
      FROM skill_graph_daemon_lease
      WHERE workspace_key = ?
    `).get(workspace) as { owner_id: string; heartbeat_at: number } | undefined;

    const staleReclaimed = Boolean(row && currentTime - row.heartbeat_at >= staleAfterMs);
    if (row && !staleReclaimed && row.owner_id !== ownerId) {
      return {
        acquired: false,
        ownerId,
        reason: 'held_by_other',
        incumbentOwnerId: row.owner_id,
        staleReclaimed: false,
      };
    }

    db.prepare(`
      INSERT INTO skill_graph_daemon_lease (workspace_key, owner_id, pid, acquired_at, heartbeat_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(workspace_key) DO UPDATE SET
        owner_id = excluded.owner_id,
        pid = excluded.pid,
        acquired_at = excluded.acquired_at,
        heartbeat_at = excluded.heartbeat_at
    `).run(workspace, ownerId, process.pid, currentTime, currentTime);

    return {
      acquired: true,
      ownerId,
      reason: 'acquired',
      incumbentOwnerId: row?.owner_id ?? null,
      staleReclaimed,
    };
  });

  const result = reserve();
  acquired = result.acquired;
  let heartbeatTimer: NodeJS.Timeout | null = null;

  function heartbeat(): void {
    if (!acquired) return;
    const currentTime = now();
    const result = db.prepare(`
      UPDATE skill_graph_daemon_lease
      SET heartbeat_at = ?, pid = ?
      WHERE workspace_key = ? AND owner_id = ?
    `).run(currentTime, process.pid, workspace, ownerId);
    if (result.changes === 0) {
      acquired = false;
    }
  }

  function release(): void {
    if (!acquired) return;
    const result = db.prepare('DELETE FROM skill_graph_daemon_lease WHERE workspace_key = ? AND owner_id = ?')
      .run(workspace, ownerId);
    if (result.changes === 0) {
      acquired = false;
      return;
    }
    acquired = false;
  }

  function close(): void {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    release();
    db.close();
  }

  if (acquired && heartbeatMs > 0) {
    heartbeatTimer = setInterval(heartbeat, heartbeatMs);
    heartbeatTimer.unref?.();
  }

  return {
    ownerId,
    get acquired() {
      return acquired;
    },
    result,
    heartbeat,
    release,
    close,
  };
}

export const __testables = {
  defaultLeaseDbPath,
  workspaceKey,
};
