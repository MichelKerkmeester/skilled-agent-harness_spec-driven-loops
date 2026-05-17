// -------------------------------------------------------------------
// MODULE: Embedder Reindex Orchestrator
// -------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

import Database from 'better-sqlite3';

import { initializeDb } from '../search/vector-index-store.js';
import { to_embedding_buffer } from '../search/vector-index-types.js';
import {
  ensureVecTableForDim,
  getActiveEmbedder,
  setActiveEmbedder,
} from './schema.js';
import { getAdapter, getManifest } from './registry.js';

// -------------------------------------------------------------------
// 1. TYPE DEFINITIONS
// -------------------------------------------------------------------

export type ReindexJobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ReindexJob {
  readonly id: string;
  readonly fromName: string;
  readonly toName: string;
  readonly toDim: number;
  readonly total: number;
  readonly processed: number;
  readonly status: ReindexJobStatus;
  readonly startedAt: string;
  readonly updatedAt: string;
  readonly error?: string;
}

export interface StartReindexOptions {
  readonly toName: string;
}

interface ReindexRuntimeOptions {
  readonly db?: Database.Database;
  readonly autoStart?: boolean;
}

interface JobRow {
  readonly id: string;
  readonly from_name: string;
  readonly to_name: string;
  readonly to_dim: number;
  readonly total: number;
  readonly processed: number;
  readonly status: ReindexJobStatus;
  readonly started_at: string;
  readonly updated_at: string;
  readonly error: string | null;
}

interface MemoryRow {
  readonly id: number;
  readonly content_text: string | null;
  readonly title: string | null;
  readonly file_path: string | null;
}

// -------------------------------------------------------------------
// 2. CONSTANTS
// -------------------------------------------------------------------

const DEFAULT_BATCH_SIZE = 50;
const JOB_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS embedder_jobs (
    id TEXT PRIMARY KEY,
    from_name TEXT NOT NULL,
    to_name TEXT NOT NULL,
    to_dim INTEGER NOT NULL,
    total INTEGER NOT NULL,
    processed INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK(status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
    started_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    error TEXT
  )
`;

const ACTIVE_JOB_STATUSES: readonly ReindexJobStatus[] = ['queued', 'running'];

const runningJobs = new Set<string>();

// -------------------------------------------------------------------
// 3. HELPERS
// -------------------------------------------------------------------

function resolveDb(db?: Database.Database): Database.Database {
  return db ?? initializeDb();
}

function nowIso(): string {
  return new Date().toISOString();
}

function getBatchSize(): number {
  const raw = process.env.EMBEDDER_REINDEX_BATCH_SIZE;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }
  return DEFAULT_BATCH_SIZE;
}

function tableNameForDim(dim: number): string {
  if (!Number.isInteger(dim) || dim <= 0) {
    throw new RangeError(`Embedder dimension must be a positive integer, got ${dim}`);
  }
  return `vec_${dim}`;
}

function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
}

function normalizeJob(row: JobRow): ReindexJob {
  return {
    id: row.id,
    fromName: row.from_name,
    toName: row.to_name,
    toDim: row.to_dim,
    total: row.total,
    processed: row.processed,
    status: row.status,
    startedAt: row.started_at,
    updatedAt: row.updated_at,
    ...(row.error ? { error: row.error } : {}),
  };
}

function ensureJobTable(db: Database.Database): void {
  db.exec(JOB_TABLE_SQL);
}

function selectJob(db: Database.Database, jobId: string): ReindexJob | null {
  ensureJobTable(db);
  const row = db.prepare(`
    SELECT id, from_name, to_name, to_dim, total, processed, status, started_at, updated_at, error
    FROM embedder_jobs
    WHERE id = ?
  `).get(jobId) as JobRow | undefined;

  return row ? normalizeJob(row) : null;
}

function selectActiveJob(db: Database.Database): ReindexJob | null {
  ensureJobTable(db);
  const row = db.prepare(`
    SELECT id, from_name, to_name, to_dim, total, processed, status, started_at, updated_at, error
    FROM embedder_jobs
    WHERE status IN ('queued', 'running')
    ORDER BY started_at DESC, id DESC
    LIMIT 1
  `).get() as JobRow | undefined;

  return row ? normalizeJob(row) : null;
}

function setJobStatus(
  db: Database.Database,
  jobId: string,
  status: ReindexJobStatus,
  processed?: number,
  error?: string,
): void {
  const processedSql = typeof processed === 'number' ? ', processed = @processed' : '';
  const errorSql = typeof error === 'string' ? ', error = @error' : '';
  db.prepare(`
    UPDATE embedder_jobs
    SET status = @status,
        updated_at = @updatedAt
        ${processedSql}
        ${errorSql}
    WHERE id = @jobId
  `).run({
    jobId,
    status,
    updatedAt: nowIso(),
    processed,
    error,
  });
}

function getCancellationStatus(db: Database.Database, jobId: string): ReindexJobStatus | null {
  const row = db.prepare('SELECT status FROM embedder_jobs WHERE id = ?').get(jobId) as { status?: ReindexJobStatus } | undefined;
  return row?.status ?? null;
}

function selectMemoryBatch(db: Database.Database, offset: number, limit: number): MemoryRow[] {
  return db.prepare(`
    SELECT id, content_text, title, file_path
    FROM memory_index
    ORDER BY id ASC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as MemoryRow[];
}

function memoryText(row: MemoryRow): string {
  if (typeof row.content_text === 'string' && row.content_text.length > 0) {
    return row.content_text;
  }
  if (typeof row.title === 'string' && row.title.length > 0) {
    return row.title;
  }
  return row.file_path ?? '';
}

function writeVectors(
  db: Database.Database,
  tableName: string,
  rows: MemoryRow[],
  embeddings: Float32Array[],
): void {
  const writeBatch = db.transaction(() => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO ${tableName} (id, vec)
      VALUES (?, ?)
    `);

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const embedding = embeddings[i];
      if (!row || !embedding) {
        throw new Error('Embedding batch cardinality mismatch');
      }
      stmt.run(row.id, to_embedding_buffer(embedding));
    }
  });

  writeBatch();
}

function enqueueJob(db: Database.Database, jobId: string): void {
  if (runningJobs.has(jobId)) {
    return;
  }

  runningJobs.add(jobId);
  void runJob(db, jobId).finally(() => {
    runningJobs.delete(jobId);
  });
}

async function runJob(db: Database.Database, jobId: string): Promise<void> {
  const initialJob = selectJob(db, jobId);
  if (!initialJob || initialJob.status === 'completed' || initialJob.status === 'failed' || initialJob.status === 'cancelled') {
    return;
  }

  const adapter = getAdapter(initialJob.toName);
  if (!adapter) {
    setJobStatus(db, jobId, 'failed', undefined, `UNKNOWN_EMBEDDER: ${initialJob.toName}`);
    return;
  }

  ensureVecTableForDim(db, initialJob.toDim);
  const tableName = tableNameForDim(initialJob.toDim);
  const batchSize = getBatchSize();
  let processed = initialJob.processed;

  try {
    setJobStatus(db, jobId, 'running');

    while (processed < initialJob.total) {
      if (getCancellationStatus(db, jobId) === 'cancelled') {
        return;
      }

      const rows = selectMemoryBatch(db, processed, batchSize);
      if (rows.length === 0) {
        break;
      }

      const embeddings = await adapter.embed(rows.map(memoryText));
      if (embeddings.length !== rows.length) {
        throw new Error(`Embedder returned ${embeddings.length} embeddings for ${rows.length} memories`);
      }

      writeVectors(db, tableName, rows, embeddings);
      processed += rows.length;
      setJobStatus(db, jobId, 'running', processed);
      await yieldToEventLoop();
    }

    if (getCancellationStatus(db, jobId) === 'cancelled') {
      return;
    }

    const complete = db.transaction(() => {
      setActiveEmbedder(db, initialJob.toName, initialJob.toDim);
      setJobStatus(db, jobId, 'completed', initialJob.total);
    });
    complete();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    setJobStatus(db, jobId, 'failed', processed, message);
  }
}

// -------------------------------------------------------------------
// 4. CORE LOGIC
// -------------------------------------------------------------------

export function startReindex(
  options: StartReindexOptions,
  runtimeOptions: ReindexRuntimeOptions = {},
): string {
  const db = resolveDb(runtimeOptions.db);
  ensureJobTable(db);

  const manifest = getManifest(options.toName);
  if (!manifest) {
    const error = new Error(`UNKNOWN_EMBEDDER: ${options.toName}`);
    error.name = 'UNKNOWN_EMBEDDER';
    throw error;
  }

  ensureVecTableForDim(db, manifest.dim);
  const active = getActiveEmbedder(db);
  const totalRow = db.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count?: number } | undefined;
  const total = Number(totalRow?.count ?? 0);
  const timestamp = nowIso();
  const id = `emb-swap-${timestamp.replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`;

  db.prepare(`
    INSERT INTO embedder_jobs (
      id, from_name, to_name, to_dim, total, processed, status, started_at, updated_at, error
    ) VALUES (?, ?, ?, ?, ?, 0, 'queued', ?, ?, NULL)
  `).run(id, active.name, manifest.name, manifest.dim, total, timestamp, timestamp);

  if (runtimeOptions.autoStart !== false) {
    enqueueJob(db, id);
  }

  return id;
}

export function getJobStatus(jobId: string, db?: Database.Database): ReindexJob | null {
  return selectJob(resolveDb(db), jobId);
}

export function getActiveJob(db?: Database.Database): ReindexJob | null {
  return selectActiveJob(resolveDb(db));
}

export function cancelJob(jobId: string, db?: Database.Database): ReindexJob | null {
  const resolvedDb = resolveDb(db);
  ensureJobTable(resolvedDb);
  const job = selectJob(resolvedDb, jobId);
  if (!job) {
    return null;
  }

  if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
    return job;
  }

  setJobStatus(resolvedDb, jobId, 'cancelled');
  return selectJob(resolvedDb, jobId);
}

export function resumeReindexJobs(db?: Database.Database): ReindexJob[] {
  const resolvedDb = resolveDb(db);
  ensureJobTable(resolvedDb);
  const rows = resolvedDb.prepare(`
    SELECT id, from_name, to_name, to_dim, total, processed, status, started_at, updated_at, error
    FROM embedder_jobs
    WHERE status IN ('queued', 'running')
    ORDER BY started_at ASC, id ASC
  `).all() as JobRow[];

  const jobs = rows.map(normalizeJob);
  for (const job of jobs) {
    enqueueJob(resolvedDb, job.id);
  }
  return jobs;
}

export function estimateEta(job: ReindexJob | null): number | null {
  if (!job || job.status === 'completed') {
    return 0;
  }
  if (job.processed <= 0 || job.total <= 0) {
    return null;
  }

  const elapsedMs = Date.now() - Date.parse(job.startedAt);
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) {
    return null;
  }

  const ratePerMs = job.processed / elapsedMs;
  if (ratePerMs <= 0) {
    return null;
  }

  return Math.ceil((job.total - job.processed) / ratePerMs / 1000);
}

export const ACTIVE_REINDEX_STATUSES = ACTIVE_JOB_STATUSES;
