// ───────────────────────────────────────────────────────────────
// MODULE: Embedder Reindex Orchestrator
// ───────────────────────────────────────────────────────────────

import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';

import { EmbeddingProfile } from '@spec-kit/shared/embeddings/profile';
import { invalidateProviderSingleton } from '@spec-kit/shared/embeddings';

import { attachActiveVectorShard, initializeDb } from '../search/vector-index-store.js';
import { to_embedding_buffer } from '../search/vector-index-types.js';
import {
  ensureVecTableForDim,
  getActiveEmbedder,
  setActiveEmbedder,
  vecTableNameForDim,
} from './schema.js';
import { getEmbedderAdapter, teardownEmbedderAfterSwap } from './execution-router.js';
import { getManifest } from './registry.js';
import { parseBoundedEnv } from '../util/env.js';
import { createLogger } from '../utils/logger.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

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

export interface ReindexRuntimeOptions {
  readonly db?: Database.Database;
}

interface ReindexInternalRuntimeOptions extends ReindexRuntimeOptions {
  readonly autoStart?: boolean;
}

type JobRow = Omit<ReindexJob, 'error'> & {
  readonly error: string | null;
};

interface MemoryRow {
  readonly id: number;
  readonly content_text: string | null;
  readonly title: string | null;
  readonly file_path: string | null;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const DEFAULT_BATCH_SIZE = 50;
const MIN_BATCH_SIZE = 1;
const MAX_BATCH_SIZE = 1_000;
const logger = createLogger('embedder-reindex');
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

const JOB_SELECT_COLUMNS = `
  id,
  from_name AS fromName,
  to_name AS toName,
  to_dim AS toDim,
  total,
  processed,
  status,
  started_at AS startedAt,
  updated_at AS updatedAt,
  error
`;

const runningJobs = new Set<string>();

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

export class InvalidDatabaseDirError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDatabaseDirError';
  }
}

function resolveDb(db?: Database.Database): Database.Database {
  return db ?? initializeDb();
}

function nowIso(): string {
  return new Date().toISOString();
}

function readJobStatus(db: Database.Database, jobId: string): ReindexJobStatus | null {
  ensureJobTable(db);
  const row = db.prepare('SELECT status FROM embedder_jobs WHERE id = ?').get(jobId) as
    | { status?: ReindexJobStatus }
    | undefined;
  return row?.status ?? null;
}

function getBatchSize(): number {
  return parseBoundedEnv('EMBEDDER_REINDEX_BATCH_SIZE', DEFAULT_BATCH_SIZE, MIN_BATCH_SIZE, MAX_BATCH_SIZE);
}

function jobFromRow(row: JobRow): ReindexJob {
  const { error, ...job } = row;
  return error ? { ...job, error } : job;
}

function ensureJobTable(db: Database.Database): void {
  db.exec(JOB_TABLE_SQL);
}

function selectJob(db: Database.Database, jobId: string): ReindexJob | null {
  ensureJobTable(db);
  const row = db.prepare(`
    SELECT ${JOB_SELECT_COLUMNS}
    FROM embedder_jobs
    WHERE id = ?
  `).get(jobId) as JobRow | undefined;

  return row ? jobFromRow(row) : null;
}

function selectActiveJob(db: Database.Database): ReindexJob | null {
  ensureJobTable(db);
  const row = db.prepare(`
    SELECT ${JOB_SELECT_COLUMNS}
    FROM embedder_jobs
    WHERE status IN ('queued', 'running')
    ORDER BY started_at DESC, id DESC
    LIMIT 1
  `).get() as JobRow | undefined;

  return row ? jobFromRow(row) : null;
}

function setJobStatus(
  db: Database.Database,
  jobId: string,
  status: ReindexJobStatus,
  processed?: number,
  error?: string,
): void {
  const params = {
    jobId,
    status,
    updatedAt: nowIso(),
    processed,
    error,
  };

  if (typeof processed === 'number' && typeof error === 'string') {
    db.prepare(`
      UPDATE embedder_jobs
      SET status = @status,
          updated_at = @updatedAt,
          processed = @processed,
          error = @error
      WHERE id = @jobId
    `).run(params);
    return;
  }

  if (typeof processed === 'number') {
    // DR-001-P1-002: a per-batch progress write must NOT clobber a terminal status set
    // by a concurrent cancelJob(). The only caller that passes processed without an error
    // is the in-loop 'running' progress update, which must only apply while the job is
    // still 'running' (or being re-affirmed as 'running'); never resurrect a 'cancelled'
    // (or 'completed'/'failed') row back to 'running'. Terminal transitions (completed /
    // failed) always carry the other branches and stay unconditional.
    if (status === 'running') {
      db.prepare(`
        UPDATE embedder_jobs
        SET status = @status,
            updated_at = @updatedAt,
            processed = @processed
        WHERE id = @jobId
          AND status = 'running'
      `).run(params);
      return;
    }
    db.prepare(`
      UPDATE embedder_jobs
      SET status = @status,
          updated_at = @updatedAt,
          processed = @processed
      WHERE id = @jobId
    `).run(params);
    return;
  }

  if (typeof error === 'string') {
    db.prepare(`
      UPDATE embedder_jobs
      SET status = @status,
          updated_at = @updatedAt,
          error = @error
      WHERE id = @jobId
    `).run(params);
    return;
  }

  db.prepare(`
    UPDATE embedder_jobs
    SET status = @status,
        updated_at = @updatedAt
    WHERE id = @jobId
  `).run(params);
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

function getBatchPair(
  rows: MemoryRow[],
  embeddings: Float32Array[],
  index: number,
): { readonly row: MemoryRow; readonly embedding: Float32Array } {
  const row = rows[index];
  const embedding = embeddings[index];
  if (!row || !embedding) {
    const missing: string[] = [];
    if (!row) missing.push('row=undefined');
    if (!embedding) missing.push('embedding=undefined');
    throw new Error(
      `Embedding batch entry missing at index ${index}: ${missing.join(', ')} ` +
        `(rows.length=${rows.length}, embeddings.length=${embeddings.length})`,
    );
  }
  return { row, embedding };
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
      const { row, embedding } = getBatchPair(rows, embeddings, i);
      stmt.run(row.id, to_embedding_buffer(embedding));
    }
  });

  writeBatch();
}

function getDatabaseDir(db: Database.Database): string | null {
  const row = (db.prepare('PRAGMA database_list').all() as Array<{ name?: string; file?: string }>)
    .find((entry) => entry.name === 'main');
  if (!row?.file || row.file === ':memory:') {
    return null;
  }
  return path.dirname(row.file);
}

function requireDatabaseDir(db: Database.Database, operation: string): string {
  const databaseDir = getDatabaseDir(db);
  if (!databaseDir) {
    throw new InvalidDatabaseDirError(
      `Embedder reindex ${operation} requires a file-backed database; received an in-memory or anonymous database without a database directory`,
    );
  }
  return databaseDir;
}

function writeVectorsToKnn(
  db: Database.Database,
  rows: MemoryRow[],
  embeddings: Float32Array[],
): void {
  const writeBatch = db.transaction(() => {
    const del = db.prepare('DELETE FROM vec_memories WHERE rowid = ?');
    const ins = db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)');
    for (let i = 0; i < rows.length; i += 1) {
      const { row, embedding } = getBatchPair(rows, embeddings, i);
      del.run(BigInt(row.id));
      ins.run(BigInt(row.id), to_embedding_buffer(embedding));
    }
  });

  writeBatch();
}

function ensureShardSchema(shard: Database.Database, profile: EmbeddingProfile, tableName: string): void {
  shard.exec(`
    CREATE TABLE IF NOT EXISTS vec_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY,
      vec BLOB NOT NULL
    );
  `);

  const writeMetadata = shard.transaction(() => {
    const stmt = shard.prepare('INSERT OR REPLACE INTO vec_metadata (key, value) VALUES (?, ?)');
    stmt.run('provider', profile.provider);
    stmt.run('model', profile.model);
    stmt.run('dim', String(profile.dim));
    stmt.run('embedding_dim', String(profile.dim));
  });
  writeMetadata();
}

function writeVectorsToShard(
  db: Database.Database,
  profile: EmbeddingProfile,
  tableName: string,
  rows: MemoryRow[],
  embeddings: Float32Array[],
  shardPath?: string,
): void {
  const databaseDir = requireDatabaseDir(db, 'vector shard write');

  // DR-020: writes target a caller-supplied STAGING shard path (default: the live
  // active shard for backward compatibility). runJob writes every batch to the staging
  // path and atomically renames staging -> active on success, so a mid-loop failure can
  // never leave the live (active) shard half-written.
  const shard = new Database(shardPath ?? profile.getVectorShardPath(databaseDir));
  try {
    shard.pragma('journal_mode = WAL');

    // Load sqlite-vec so the runtime KNN virtual table can be created
    // and populated alongside the canonical vec_<dim> blob table. When the extension
    // is unavailable the runtime falls back to vec_<dim> only and search degrades to
    // lexical signals; we surface that through the existing console.warn in vector-index-store.
    let vecAvailable = true;
    try {
      sqliteVec.load(shard);
    } catch (_err) {
      vecAvailable = false;
    }

    ensureShardSchema(shard, profile, tableName);

    if (vecAvailable) {
      shard.exec(`
        CREATE VIRTUAL TABLE IF NOT EXISTS vec_memories USING vec0(
          embedding FLOAT[${profile.dim}]
        )
      `);
    }

    writeVectors(shard, tableName, rows, embeddings);
    if (vecAvailable) {
      writeVectorsToKnn(shard, rows, embeddings);
    }
  } finally {
    // WAL-durability: flush + TRUNCATE the shard WAL before close so the shard file is
    // consistent at rest with an empty WAL — mirrors close_db's corruption-prevention.
    // better-sqlite3 .close() only does a passive checkpoint; an abrupt later kill could otherwise
    // corrupt un-checkpointed shard frames (vec0 / FTS segment writes). Best-effort; never block close.
    try { shard.pragma('wal_checkpoint(TRUNCATE)'); } catch (_err: unknown) { /* best-effort */ }
    shard.close();
  }
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

  const manifest = getManifest(initialJob.toName);
  if (!manifest) {
    setJobStatus(db, jobId, 'failed', undefined, `UNKNOWN_EMBEDDER: ${initialJob.toName}`);
    return;
  }
  const adapter = getEmbedderAdapter(manifest.backend, initialJob.toName, initialJob.toDim);
  const targetProfile = new EmbeddingProfile({
    provider: manifest.backend,
    model: manifest.name,
    dim: manifest.dim,
    dtype: null,
    baseUrl: null,
  });

  ensureVecTableForDim(db, initialJob.toDim);
  const tableName = vecTableNameForDim(initialJob.toDim);
  const batchSize = getBatchSize();
  let processed = initialJob.processed;

  // DR-020: stage every shard write into a per-job staging file, then atomically
  // rename it over the live active shard ONLY after the completion transaction commits.
  // A mid-loop throw (or cancel) leaves the live (active) shard untouched; the partial
  // staging artifact is unlinked in the catch/cancel paths. databaseDir is guaranteed
  // file-backed here (startReindexInternal already called requireDatabaseDir).
  const databaseDir = requireDatabaseDir(db, 'reindex staging');
  const activeShardPath = targetProfile.getVectorShardPath(databaseDir);
  const stagingShardPath = `${activeShardPath}.reindex-${jobId}.staging`;

  const cleanupStaging = (): void => {
    for (const suffix of ['', '-wal', '-shm']) {
      try {
        fs.unlinkSync(`${stagingShardPath}${suffix}`);
      } catch (_err: unknown) {
        /* best-effort: staging may not exist */
      }
    }
  };

  try {
    setJobStatus(db, jobId, 'running');
    // Start each run from a clean staging slate (a prior crashed run may have left one).
    cleanupStaging();

    while (processed < initialJob.total) {
      // DR-001-P1-002: re-read the live cancel/status before each batch so cancelJob()
      // during a run stops the worker before the next write. Abort cleanly: drop the
      // staging artifact and leave the live shard + active pointer untouched.
      if (readJobStatus(db, jobId) === 'cancelled') {
        cleanupStaging();
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
      writeVectorsToShard(db, targetProfile, tableName, rows, embeddings, stagingShardPath);
      processed += rows.length;
      // Clobber-safe: only advances while status is still 'running' (never resurrects
      // a concurrently-set 'cancelled').
      setJobStatus(db, jobId, 'running', processed);
      await new Promise<void>((resolve) => {
        setImmediate(resolve);
      });
    }

    // DR-001-P1-002: final cancel checkpoint before the irreversible swap/commit.
    if (readJobStatus(db, jobId) === 'cancelled') {
      cleanupStaging();
      return;
    }

    // DR-020: atomically swap the staged shard over the live active shard BEFORE the
    // completion transaction flips the active-embedder pointer. rename(2) is atomic on
    // the same filesystem; the staging file always lives beside the active shard, so the
    // active shard either is the old file (failure) or the fully-staged new file (success),
    // never a half-written mix. If no batch produced a staging file (e.g. zero rows), skip.
    if (fs.existsSync(stagingShardPath)) {
      // Drop any stale sidecars next to the active shard so the renamed WAL/SHM (already
      // TRUNCATE-checkpointed at staging close) is the authoritative pair.
      for (const suffix of ['-wal', '-shm']) {
        try {
          fs.unlinkSync(`${activeShardPath}${suffix}`);
        } catch (_err: unknown) {
          /* best-effort */
        }
      }
      fs.renameSync(stagingShardPath, activeShardPath);
    }

    const complete = db.transaction(() => {
      // Persist the active-embedder provider pointer too; omitting it leaves the pointer empty,
      // which readActiveEmbedderIfValid coerces to undefined and the next boot loses provider
      // identity. 'api' backends are ambiguous (openai vs voyage) from the manifest alone, so
      // leave the provider unset for those rather than guess.
      const activeProvider = manifest.backend === 'ollama'
        ? 'ollama'
        : manifest.backend === 'sentence-transformers'
          ? 'hf-local'
          : undefined;
      setActiveEmbedder(db, initialJob.toName, initialJob.toDim, activeProvider);
      // Commit embedding_status for rows now backed by an active-profile vector.
      // A vector-only reindex previously wrote vectors but left memory_index.embedding_status
      // stale, so a "completed" bulk re-embed never raised the success count. Reconcile the
      // status for every row present in the just-written vec_<dim> table, inside the same
      // atomic completion transaction so vectors and status flip together.
      const completedAt = nowIso();
      db.prepare(`
        UPDATE memory_index
        SET embedding_status = 'success',
            embedding_generated_at = COALESCE(embedding_generated_at, @ts),
            updated_at = @ts,
            failure_reason = NULL
        WHERE embedding_status != 'success'
          AND id IN (SELECT id FROM ${tableName})
      `).run({ ts: completedAt });
      setJobStatus(db, jobId, 'completed', initialJob.total);
    });
    complete();
    // The active-embedder pointer just flipped; drop the cached provider singleton so the
    // next embedding re-resolves against the new pointer instead of the stale model/dim.
    invalidateProviderSingleton();
    void teardownEmbedderAfterSwap(manifest.backend, initialJob.toName).catch((error: unknown) => {
      console.warn(`[embedder-reindex] embedder teardown after swap failed: ${error instanceof Error ? error.message : String(error)}`);
    });
    if (getDatabaseDir(db)) {
      attachActiveVectorShard(db, targetProfile);
    }
  } catch (error: unknown) {
    // DR-020: a failed run must not leave a half-written shard anywhere. The live active
    // shard was never mutated (all writes went to staging); discard the partial staging
    // artifact so the next attempt starts clean and the active shard stays the last-good one.
    cleanupStaging();
    const message = error instanceof Error ? error.message : String(error);
    setJobStatus(db, jobId, 'failed', processed, message);
    logger.error('embedder reindex job failed', {
      event: 'embedder_reindex_failed',
      jobId,
      toName: initialJob.toName,
      processed,
      total: initialJob.total,
      error: message,
    });
  }
}

// ───────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function startReindex(
  options: StartReindexOptions,
  runtimeOptions: ReindexRuntimeOptions = {},
): string {
  return startReindexInternal(options, runtimeOptions);
}

function startReindexInternal(
  options: StartReindexOptions,
  runtimeOptions: ReindexInternalRuntimeOptions = {},
): string {
  const db = resolveDb(runtimeOptions.db);
  requireDatabaseDir(db, 'startup');
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
  requireDatabaseDir(resolvedDb, 'resume');
  ensureJobTable(resolvedDb);
  const rows = resolvedDb.prepare(`
    SELECT ${JOB_SELECT_COLUMNS}
    FROM embedder_jobs
    WHERE status IN ('queued', 'running')
    ORDER BY started_at ASC, id ASC
  `).all() as JobRow[];

  const jobs = rows.map(jobFromRow);
  for (const job of jobs) {
    enqueueJob(resolvedDb, job.id);
  }
  return jobs;
}

export function startReindexForTest(
  options: StartReindexOptions,
  runtimeOptions: ReindexInternalRuntimeOptions = {},
): string {
  return startReindexInternal(options, runtimeOptions);
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
