// ───────────────────────────────────────────────────────────────
// MODULE: Maintenance Job Store
// ───────────────────────────────────────────────────────────────
// Kind-agnostic persisted job lifecycle: jobId, state record, progress
// counters, error capture+truncation, cancel flag, and crash-recovery
// reset. Shared lifecycle/registry across long-running maintenance jobs.

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomBytes } from 'node:crypto';

import { requireDb, toErrorMessage } from '../../utils/index.js';
import { withBusyRetry, withBusyRetrySync } from './sqlite-busy-retry.js';

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

export type MaintenanceJobKind = 'ingest' | 'index_scan';

export type JobLifecycleState = 'queued' | 'running' | 'complete' | 'failed' | 'cancelled';

export interface JobError {
  source: string;
  message: string;
  timestamp: string;
}

export interface MaintenanceJob {
  id: string;
  kind: MaintenanceJobKind;
  state: JobLifecycleState;
  phase: string | null;
  progressTotal: number;
  progressProcessed: number;
  cancelRequested: boolean;
  errors: JobError[];
  result: unknown | null;
  payload: unknown | null;
  createdAt: string;
  updatedAt: string;
}

interface MaintenanceJobRow {
  id: string;
  kind: string;
  state: string;
  phase: string | null;
  progress_total: number;
  progress_processed: number;
  cancel_requested: number;
  errors_json: string;
  result_json: string | null;
  payload_json: string | null;
  created_at: string;
  updated_at: string;
}

/* ───────────────────────────────────────────────────────────────
   3. CONSTANTS
──────────────────────────────────────────────────────────────── */

export const MAX_STORED_ERRORS = 50;

const TERMINAL_STATES = new Set<JobLifecycleState>(['complete', 'failed', 'cancelled']);

const ALLOWED_TRANSITIONS: Record<JobLifecycleState, Set<JobLifecycleState>> = {
  queued: new Set<JobLifecycleState>(['running', 'cancelled', 'failed']),
  running: new Set<JobLifecycleState>(['complete', 'failed', 'cancelled']),
  complete: new Set<JobLifecycleState>([]),
  failed: new Set<JobLifecycleState>([]),
  cancelled: new Set<JobLifecycleState>([]),
};

// URL-safe 12-char identifier without a UUID dependency.
const NANOID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/* ───────────────────────────────────────────────────────────────
   4. HELPERS
──────────────────────────────────────────────────────────────── */

function nowIso(): string {
  return new Date().toISOString();
}

function isTransitionAllowed(from: JobLifecycleState, to: JobLifecycleState): boolean {
  return ALLOWED_TRANSITIONS[from]?.has(to) ?? false;
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (_error: unknown) {
    return fallback;
  }
}

function parseJobErrors(value: string | null | undefined): JobError[] {
  const parsed = parseJson<unknown>(value, []);
  return Array.isArray(parsed) ? (parsed as JobError[]) : [];
}

function mapRowToJob(row: MaintenanceJobRow | undefined): MaintenanceJob | null {
  if (!row) return null;
  return {
    id: row.id,
    kind: row.kind as MaintenanceJobKind,
    state: row.state as JobLifecycleState,
    phase: row.phase,
    progressTotal: row.progress_total,
    progressProcessed: row.progress_processed,
    cancelRequested: row.cancel_requested === 1,
    errors: parseJobErrors(row.errors_json),
    result: row.result_json === null || row.result_json === undefined ? null : parseJson<unknown>(row.result_json, null),
    payload: row.payload_json === null || row.payload_json === undefined ? null : parseJson<unknown>(row.payload_json, null),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const SELECT_COLUMNS =
  'id, kind, state, phase, progress_total, progress_processed, cancel_requested, errors_json, result_json, payload_json, created_at, updated_at';

/* ───────────────────────────────────────────────────────────────
   5. SCHEMA
──────────────────────────────────────────────────────────────── */

export function ensureMaintenanceJobsTable(): void {
  const db = requireDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS maintenance_jobs (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      state TEXT NOT NULL,
      phase TEXT,
      progress_total INTEGER NOT NULL DEFAULT 0,
      progress_processed INTEGER NOT NULL DEFAULT 0,
      cancel_requested INTEGER NOT NULL DEFAULT 0,
      errors_json TEXT NOT NULL DEFAULT '[]',
      result_json TEXT,
      payload_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_maintenance_jobs_kind_state ON maintenance_jobs(kind, state)`);
}

/* ───────────────────────────────────────────────────────────────
   6. IDENTIFIERS
──────────────────────────────────────────────────────────────── */

export function createJobId(): string {
  const bytes = randomBytes(12);
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += NANOID_ALPHABET[bytes[i] % NANOID_ALPHABET.length];
  }
  return `job_${id}`;
}

/* ───────────────────────────────────────────────────────────────
   7. LIFECYCLE
──────────────────────────────────────────────────────────────── */

export async function createMaintenanceJob(args: {
  id: string;
  kind: MaintenanceJobKind;
  payload?: unknown;
}): Promise<MaintenanceJob> {
  const db = requireDb();
  const timestamp = nowIso();
  const payloadJson = args.payload === undefined ? null : JSON.stringify(args.payload);

  await withBusyRetry(() =>
    db.prepare(`
      INSERT INTO maintenance_jobs (
        id, kind, state, phase, progress_total, progress_processed,
        cancel_requested, errors_json, result_json, payload_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      args.id,
      args.kind,
      'queued',
      null,
      0,
      0,
      0,
      '[]',
      null,
      payloadJson,
      timestamp,
      timestamp,
    )
  );

  return {
    id: args.id,
    kind: args.kind,
    state: 'queued',
    phase: null,
    progressTotal: 0,
    progressProcessed: 0,
    cancelRequested: false,
    errors: [],
    result: null,
    payload: args.payload ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function getMaintenanceJob(jobId: string): MaintenanceJob | null {
  const db = requireDb();
  const row = db.prepare(`
    SELECT ${SELECT_COLUMNS}
    FROM maintenance_jobs
    WHERE id = ?
  `).get(jobId) as MaintenanceJobRow | undefined;
  return mapRowToJob(row);
}

export async function setJobState(jobId: string, nextState: JobLifecycleState): Promise<MaintenanceJob> {
  const db = requireDb();
  const current = getMaintenanceJob(jobId);
  if (!current) {
    throw new Error(`Maintenance job not found: ${jobId}`);
  }

  if (current.state === nextState) {
    return current;
  }

  if (!isTransitionAllowed(current.state, nextState)) {
    throw new Error(`Invalid maintenance job state transition: ${current.state} -> ${nextState}`);
  }

  const updatedAt = nowIso();
  const result = await withBusyRetry(() =>
    db.prepare(`
      UPDATE maintenance_jobs
      SET state = ?, updated_at = ?
      WHERE id = ? AND state = ?
    `).run(nextState, updatedAt, jobId, current.state)
  );

  if ((result as { changes: number }).changes === 0) {
    throw new Error(`State transition conflict: job ${jobId} state was changed by another process (expected '${current.state}')`);
  }

  return { ...current, state: nextState, updatedAt };
}

export async function setJobPhase(jobId: string, phase: string): Promise<void> {
  const db = requireDb();
  await withBusyRetry(() =>
    db.prepare(`UPDATE maintenance_jobs SET phase = ?, updated_at = ? WHERE id = ?`)
      .run(phase, nowIso(), jobId)
  );
}

export async function setJobProgress(jobId: string, progress: { processed: number; total: number }): Promise<void> {
  const db = requireDb();
  const processed = Math.max(0, Math.trunc(progress.processed));
  const total = Math.max(0, Math.trunc(progress.total));
  await withBusyRetry(() =>
    db.prepare(`UPDATE maintenance_jobs SET progress_processed = ?, progress_total = ?, updated_at = ? WHERE id = ?`)
      .run(processed, total, nowIso(), jobId)
  );
}

export async function appendJobError(jobId: string, source: string, error: unknown): Promise<MaintenanceJob> {
  const db = requireDb();
  const current = getMaintenanceJob(jobId);
  if (!current) {
    throw new Error(`Maintenance job not found: ${jobId}`);
  }

  let errors: JobError[] = [
    ...current.errors,
    { source, message: toErrorMessage(error), timestamp: nowIso() },
  ];

  if (errors.length > MAX_STORED_ERRORS) {
    const tailLength = Math.max(0, MAX_STORED_ERRORS - 1);
    const trimmedCount = errors.length - tailLength;
    const truncationNotice: JobError = {
      source: '__job__',
      message: `error log truncated (${trimmedCount} older entries removed)`,
      timestamp: nowIso(),
    };
    const truncatedTail = tailLength > 0 ? errors.slice(-tailLength) : [];
    errors = [truncationNotice, ...truncatedTail];
  }

  const updatedAt = nowIso();
  await withBusyRetry(() =>
    db.prepare(`UPDATE maintenance_jobs SET errors_json = ?, updated_at = ? WHERE id = ?`)
      .run(JSON.stringify(errors), updatedAt, jobId)
  );

  return { ...current, errors, updatedAt };
}

export async function requestCancel(jobId: string): Promise<void> {
  const db = requireDb();
  await withBusyRetry(() =>
    db.prepare(`UPDATE maintenance_jobs SET cancel_requested = 1, updated_at = ? WHERE id = ?`)
      .run(nowIso(), jobId)
  );
}

// Synchronous so the runner can poll it inline at batch/phase boundaries.
export function isCancelRequested(jobId: string): boolean {
  const db = requireDb();
  const row = db.prepare(`SELECT cancel_requested FROM maintenance_jobs WHERE id = ?`)
    .get(jobId) as { cancel_requested?: number } | undefined;
  return !!row && row.cancel_requested === 1;
}

export async function completeJob(
  jobId: string,
  options: { state: JobLifecycleState; result?: unknown },
): Promise<MaintenanceJob> {
  const db = requireDb();
  const current = getMaintenanceJob(jobId);
  if (!current) {
    throw new Error(`Maintenance job not found: ${jobId}`);
  }

  if (current.state !== options.state && !isTransitionAllowed(current.state, options.state)) {
    throw new Error(`Invalid maintenance job state transition: ${current.state} -> ${options.state}`);
  }

  const updatedAt = nowIso();
  const resultJson = options.result === undefined ? null : JSON.stringify(options.result);
  const completion = await withBusyRetry(() =>
    db.prepare(`UPDATE maintenance_jobs SET state = ?, result_json = ?, updated_at = ? WHERE id = ? AND state = ?`)
      .run(options.state, resultJson, updatedAt, jobId, current.state)
  );
  if (completion.changes === 0) {
    // The row moved out from under the read-then-check; refuse to clobber a state
    // another writer set rather than overwriting it from a stale read.
    throw new Error(`Maintenance job state changed concurrently: ${jobId}`);
  }

  return { ...current, state: options.state, result: options.result ?? null, updatedAt };
}

// Crash recovery: mark interrupted jobs of a kind terminal on boot. Index scans
// re-run fresh, so they are reset to 'failed' rather than re-enqueued.
export function resetRunningJobsForKind(
  kind: MaintenanceJobKind,
  // Crash recovery only moves interrupted jobs to a terminal state. Restricting the
  // target keeps a caller from persisting an illegal transition past the guard.
  options: { to: 'failed' | 'cancelled' },
): string[] {
  const db = requireDb();
  const rows = db.prepare(`
    SELECT id FROM maintenance_jobs
    WHERE kind = ? AND state IN ('queued', 'running')
  `).all(kind) as Array<{ id: string }>;

  if (rows.length === 0) return [];

  withBusyRetrySync(() =>
    db.prepare(`
      UPDATE maintenance_jobs
      SET state = ?, updated_at = ?
      WHERE kind = ? AND state IN ('queued', 'running')
    `).run(options.to, nowIso(), kind)
  );

  return rows.map((r) => r.id);
}

export function isTerminalJobState(state: JobLifecycleState): boolean {
  return TERMINAL_STATES.has(state);
}
