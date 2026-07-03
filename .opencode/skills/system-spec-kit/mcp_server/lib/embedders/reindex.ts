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

import {
  attachActiveVectorShard,
  detachActiveVectorShard,
  isActiveVectorShardAttached,
  clear_vector_shard_repair_pending_sentinel,
  initializeDb,
} from '../search/vector-index-store.js';
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
import { getRestoreBarrierStatus } from '../storage/checkpoints.js';
import { BetterSqliteMaintenance } from '../storage/ports/maintenance.js';
import {
  getDegradedVectorObservabilitySnapshot,
  recordVectorShardRebuildCompleted,
  recordVectorShardRebuildFailed,
  recordVectorShardRebuildStarted,
} from '../observability/retrieval-observability.js';

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
  readonly vectorShardRepair?: {
    readonly reason: string;
    readonly shardPath: string;
  };
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
const RESTORE_REQUEUE_DELAY_MS = 100;
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
const vectorShardRepairJobs = new Map<string, { readonly reason: string; readonly shardPath: string }>();

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

function completeVectorShardRecovery(jobId: string, shardPath: string): void {
  recordVectorShardRebuildCompleted({ jobId, shardPath });
  clear_vector_shard_repair_pending_sentinel(shardPath);
}

function degradedVectorMatchesShard(shardPath: string): boolean {
  const degradedVector = getDegradedVectorObservabilitySnapshot();
  return degradedVector.degraded && degradedVector.lastShard === path.basename(shardPath);
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
  // Repair intent must survive a process restart: the in-memory repair map is
  // rebuilt from these columns on resume, and the de-dup guard consults them,
  // so a restart cannot schedule a second repair for the same shard.
  const columns = new Set(
    (db.prepare('PRAGMA table_info(embedder_jobs)').all() as Array<{ name: string }>).map((c) => c.name),
  );
  if (!columns.has('repair_reason')) {
    db.exec('ALTER TABLE embedder_jobs ADD COLUMN repair_reason TEXT');
  }
  if (!columns.has('repair_shard_path')) {
    db.exec('ALTER TABLE embedder_jobs ADD COLUMN repair_shard_path TEXT');
  }
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
    // A per-batch progress write must NOT clobber a terminal status set
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

function getDatabasePath(db: Database.Database): string | null {
  try {
    const row = (db.prepare('PRAGMA database_list').all() as Array<{ name?: string; file?: string }>)
      .find((entry) => entry.name === 'main');
    if (!row?.file || row.file === ':memory:') {
      return null;
    }
    return row.file;
  } catch (_error: unknown) {
    return null;
  }
}

function isClosedDatabaseHandleError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /database connection is not open|closed database|database handle is closed/i.test(message);
}

function scheduleJobAfterRestore(jobId: string, dbPath: string | null): void {
  setTimeout(() => {
    // Do not re-open the database while a checkpoint restore is still in
    // progress: initialize_db runs interrupted-restore recovery, which would
    // roll back the in-flight restore. Wait for the barrier to clear.
    if (getRestoreBarrierStatus()) {
      scheduleJobAfterRestore(jobId, dbPath);
      return;
    }
    try {
      enqueueJob(dbPath ? initializeDb(dbPath) : initializeDb(), jobId);
    } catch (error: unknown) {
      logger.warn('embedder reindex restore retry skipped', {
        event: 'embedder_reindex_restore_retry_skipped',
        jobId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, RESTORE_REQUEUE_DELAY_MS).unref?.();
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

function writeVectorsToShardTables(
  db: Database.Database,
  tableName: string,
  rows: MemoryRow[],
  embeddings: Float32Array[],
  includeKnn: boolean,
): void {
  const writeBatch = db.transaction(() => {
    const vectorInsert = db.prepare(`
      INSERT OR REPLACE INTO ${tableName} (id, vec)
      VALUES (?, ?)
    `);
    const knnDelete = includeKnn ? db.prepare('DELETE FROM vec_memories WHERE rowid = ?') : null;
    const knnInsert = includeKnn
      ? db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)')
      : null;

    for (let i = 0; i < rows.length; i += 1) {
      const { row, embedding } = getBatchPair(rows, embeddings, i);
      const vectorBuffer = to_embedding_buffer(embedding);
      vectorInsert.run(row.id, vectorBuffer);
      if (knnDelete && knnInsert) {
        const rowid = BigInt(row.id);
        knnDelete.run(rowid);
        knnInsert.run(rowid, vectorBuffer);
      }
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
    CREATE TABLE IF NOT EXISTS embedding_cache (
      content_hash TEXT NOT NULL,
      profile_key TEXT NOT NULL DEFAULT '',
      input_kind TEXT NOT NULL DEFAULT 'document' CHECK (input_kind IN ('document', 'query')),
      model_id TEXT NOT NULL,
      embedding BLOB NOT NULL,
      dimensions INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (content_hash, profile_key, input_kind, model_id, dimensions)
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

function countStagedShardRows(shardPath: string, tableName: string): number {
  if (!fs.existsSync(shardPath)) {
    return 0;
  }
  const shard = new Database(shardPath, { readonly: true, fileMustExist: true });
  try {
    const row = shard.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get() as { count?: number } | undefined;
    return Math.max(0, Number(row?.count ?? 0));
  } finally {
    shard.close();
  }
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

  // Writes target a caller-supplied STAGING shard path (default: the live
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

    writeVectorsToShardTables(shard, tableName, rows, embeddings, vecAvailable);
  } finally {
    // WAL-durability: flush + TRUNCATE the shard WAL before close so the shard file is
    // consistent at rest with an empty WAL — mirrors close_db's corruption-prevention.
    // better-sqlite3 .close() only does a passive checkpoint; an abrupt later kill could otherwise
    // corrupt un-checkpointed shard frames (vec0 / FTS segment writes). Best-effort; never block close.
    new BetterSqliteMaintenance(shard).checkpoint({ mode: 'truncate' });
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
  const dbPath = getDatabasePath(db);
  let jobDb = db;
  if (getRestoreBarrierStatus()) {
    scheduleJobAfterRestore(jobId, dbPath);
    return;
  }
  const resolveJobDb = (): Database.Database => {
    const barrierStatus = getRestoreBarrierStatus();
    if (barrierStatus) {
      const error = new Error(barrierStatus.message);
      error.name = barrierStatus.code;
      throw error;
    }
    return jobDb;
  };
  jobDb = resolveJobDb();
  const initialJob = selectJob(jobDb, jobId);
  if (!initialJob || initialJob.status === 'completed' || initialJob.status === 'failed' || initialJob.status === 'cancelled') {
    return;
  }

  const manifest = getManifest(initialJob.toName);
  if (!manifest) {
    setJobStatus(jobDb, jobId, 'failed', undefined, `UNKNOWN_EMBEDDER: ${initialJob.toName}`);
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

  ensureVecTableForDim(jobDb, initialJob.toDim);
  const tableName = vecTableNameForDim(initialJob.toDim);
  const batchSize = getBatchSize();
  let processed = initialJob.processed;

  // Stage every shard write into a per-job staging file, then atomically
  // rename it over the live active shard ONLY after the completion transaction commits.
  // A mid-loop throw (or cancel) leaves the live (active) shard untouched; the partial
  // staging artifact is unlinked in the catch/cancel paths. databaseDir is guaranteed
  // file-backed here (startReindexInternal already called requireDatabaseDir).
  const databaseDir = requireDatabaseDir(jobDb, 'reindex staging');
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
    setJobStatus(jobDb, jobId, 'running');
    const repairContext = vectorShardRepairJobs.get(jobId);
    if (repairContext) {
      recordVectorShardRebuildStarted({
        jobId,
        shardPath: repairContext.shardPath,
        reason: repairContext.reason,
      });
    }
    // Start each run from a clean staging slate (a prior crashed run may have left one).
    cleanupStaging();
    if (processed !== 0) {
      processed = 0;
      setJobStatus(jobDb, jobId, 'running', processed);
    }

    while (processed < initialJob.total) {
      jobDb = resolveJobDb();
      // Re-read the live cancel/status before each batch so cancelJob()
      // during a run stops the worker before the next write. Abort cleanly: drop the
      // staging artifact and leave the live shard + active pointer untouched.
      if (readJobStatus(jobDb, jobId) === 'cancelled') {
        cleanupStaging();
        return;
      }

      const rows = selectMemoryBatch(jobDb, processed, batchSize);
      if (rows.length === 0) {
        break;
      }

      const embeddings = await adapter.embed(rows.map(memoryText));
      jobDb = resolveJobDb();
      if (embeddings.length !== rows.length) {
        throw new Error(`Embedder returned ${embeddings.length} embeddings for ${rows.length} memories`);
      }

      writeVectors(jobDb, tableName, rows, embeddings);
      writeVectorsToShard(jobDb, targetProfile, tableName, rows, embeddings, stagingShardPath);
      processed += rows.length;
      // Clobber-safe: only advances while status is still 'running' (never resurrects
      // a concurrently-set 'cancelled').
      setJobStatus(jobDb, jobId, 'running', processed);
      await new Promise<void>((resolve) => {
        setImmediate(resolve);
      });
    }

    // Final cancel checkpoint before the irreversible swap/commit.
    jobDb = resolveJobDb();
    if (readJobStatus(jobDb, jobId) === 'cancelled') {
      cleanupStaging();
      return;
    }

    // Atomically swap the staged shard over the live active shard BEFORE the
    // completion transaction flips the active-embedder pointer. rename(2) is atomic on
    // the same filesystem; the staging file always lives beside the active shard, so the
    // active shard either is the old file (failure) or the fully-staged new file (success),
    // never a half-written mix. If no batch produced a staging file (e.g. zero rows), skip.
    if (fs.existsSync(stagingShardPath)) {
      const stagedRows = countStagedShardRows(stagingShardPath, tableName);
      if (stagedRows < initialJob.total) {
        throw new Error(`Incomplete staged vector shard: expected ${initialJob.total} rows, got ${stagedRows}`);
      }
      // Detach BEFORE the rename: rename(2) preserves the attachment's inode,
      // so a connection that stays attached keeps writing the orphaned
      // pre-rename file while the path-string attach check still matches.
      // The post-swap attach below then binds the new file.
      try {
        detachActiveVectorShard(jobDb);
      } catch (_detachErr: unknown) {
        // Swallow only the not-attached case; a busy/locked DETACH can throw with
        // the shard still bound, which the post-detach assertion below catches.
      }
      // A failed detach (e.g. busy/locked) must not fall through to the rename:
      // it would leave this connection bound to the orphaned old inode while the
      // post-swap path-string attach check still matches the new file, silently
      // serving stale pre-reindex vectors. Verify the attachment is released; if
      // it survived the first attempt, retry once and throw if it persists so the
      // run fails cleanly instead of completing on a stale binding.
      if (isActiveVectorShardAttached(jobDb)) {
        detachActiveVectorShard(jobDb);
        if (isActiveVectorShardAttached(jobDb)) {
          throw new Error('Active vector shard remained attached after detach; aborting swap to avoid binding to an orphaned inode');
        }
      }
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
    } else if (initialJob.total > 0) {
      throw new Error(`Incomplete staged vector shard: expected ${initialJob.total} rows, got 0`);
    }

    // The completion transaction below reconciles embedding_status by reading the
    // canonical vec_<dim> table via its unqualified name. The swap above detaches the
    // active shard and drops the temp alias view, so that name now resolves to the
    // canonical main-database table. That canonical table is best-effort "slimmed" away
    // on every shard attach, so a concurrent attach during this run (e.g. a second
    // attach that re-asserts a still-pending repair) can drop it out from under us,
    // turning the reconciliation read into a fatal "no such table" and stranding the
    // repair short of completion. Re-assert the (empty) canonical table immediately
    // before reading it. This never touches shard data — the rebuilt vectors live in
    // the freshly renamed active shard file — so it preserves repair completeness and
    // the single-writer staging discipline.
    ensureVecTableForDim(jobDb, initialJob.toDim);

    const complete = jobDb.transaction(() => {
      // Persist the active-embedder provider pointer too; omitting it leaves the pointer empty,
      // which readActiveEmbedderIfValid coerces to undefined and the next boot loses provider
      // identity. 'api' backends are ambiguous (openai vs voyage) from the manifest alone, so
      // leave the provider unset for those rather than guess.
      const activeEmbedderProvider = manifest.backend === 'ollama'
        ? 'ollama'
        : manifest.backend === 'sentence-transformers'
          ? 'hf-local'
          : undefined;
      setActiveEmbedder(jobDb, initialJob.toName, initialJob.toDim, activeEmbedderProvider);
      // Commit embedding_status for rows now backed by an active-profile vector.
      // A vector-only reindex previously wrote vectors but left memory_index.embedding_status
      // stale, so a "completed" bulk re-embed never raised the success count. Reconcile the
      // status for every row present in the just-written vec_<dim> table, inside the same
      // atomic completion transaction so vectors and status flip together.
      const completedAt = nowIso();
      jobDb.prepare(`
        UPDATE memory_index
        SET embedding_status = 'success',
            embedding_generated_at = COALESCE(embedding_generated_at, @ts),
            updated_at = @ts,
            failure_reason = NULL
        WHERE embedding_status != 'success'
          AND id IN (SELECT id FROM ${tableName})
      `).run({ ts: completedAt });
      setJobStatus(jobDb, jobId, 'completed', initialJob.total);
    });
    complete();
    if (repairContext) {
      completeVectorShardRecovery(jobId, repairContext.shardPath);
      vectorShardRepairJobs.delete(jobId);
    } else if (degradedVectorMatchesShard(activeShardPath)) {
      completeVectorShardRecovery(jobId, activeShardPath);
    }
    // The active-embedder pointer just flipped; drop the cached provider singleton so the
    // next embedding re-resolves against the new pointer instead of the stale model/dim.
    invalidateProviderSingleton();
    void teardownEmbedderAfterSwap(manifest.backend, initialJob.toName).catch((error: unknown) => {
      console.warn(`[embedder-reindex] embedder teardown after swap failed: ${error instanceof Error ? error.message : String(error)}`);
    });
    if (getDatabaseDir(jobDb)) {
      attachActiveVectorShard(jobDb, targetProfile);
    }
  } catch (error: unknown) {
    if (getRestoreBarrierStatus() || isClosedDatabaseHandleError(error)) {
      cleanupStaging();
      scheduleJobAfterRestore(jobId, dbPath);
      logger.warn('embedder reindex paused for checkpoint restore', {
        event: 'embedder_reindex_restore_paused',
        jobId,
        processed,
      });
      return;
    }
    // A failed run must not leave a half-written shard anywhere. The live active
    // shard was never mutated (all writes went to staging); discard the partial staging
    // artifact so the next attempt starts clean and the active shard stays the last-good one.
    cleanupStaging();
    const message = error instanceof Error ? error.message : String(error);
    setJobStatus(jobDb, jobId, 'failed', processed, message);
    const repairContext = vectorShardRepairJobs.get(jobId);
    if (repairContext) {
      recordVectorShardRebuildFailed({ jobId, shardPath: repairContext.shardPath, reason: message });
      vectorShardRepairJobs.delete(jobId);
    }
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

  if (runtimeOptions.vectorShardRepair) {
    vectorShardRepairJobs.set(id, runtimeOptions.vectorShardRepair);
    db.prepare('UPDATE embedder_jobs SET repair_reason = ?, repair_shard_path = ? WHERE id = ?')
      .run(runtimeOptions.vectorShardRepair.reason, runtimeOptions.vectorShardRepair.shardPath, id);
  }

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
  const repairRows = resolvedDb.prepare(
    "SELECT id, repair_reason AS reason, repair_shard_path AS shardPath FROM embedder_jobs WHERE status IN ('queued', 'running') AND repair_shard_path IS NOT NULL",
  ).all() as Array<{ id: string; reason: string | null; shardPath: string }>;
  for (const row of repairRows) {
    if (!vectorShardRepairJobs.has(row.id)) {
      vectorShardRepairJobs.set(row.id, { reason: row.reason ?? 'resumed repair', shardPath: row.shardPath });
    }
  }
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

export function startVectorShardRepairReindex(
  profile: EmbeddingProfile,
  runtimeOptions: ReindexRuntimeOptions & { readonly reason: string; readonly shardPath: string; readonly autoStart?: boolean },
): string {
  const db = resolveDb(runtimeOptions.db);
  requireDatabaseDir(db, 'startup');
  const targetShardPath = path.resolve(runtimeOptions.shardPath);
  ensureJobTable(db);
  const persisted = db.prepare(
    "SELECT id, repair_shard_path AS shardPath FROM embedder_jobs WHERE status IN ('queued', 'running') AND repair_shard_path IS NOT NULL",
  ).all() as Array<{ id: string; shardPath: string }>;
  for (const row of persisted) {
    if (path.resolve(row.shardPath) === targetShardPath) {
      logger.info('vector shard repair already in flight', {
        event: 'vector_shard_repair_already_in_flight',
        jobId: row.id,
        shardPath: runtimeOptions.shardPath,
      });
      return row.id;
    }
  }
  for (const [jobId, repairContext] of vectorShardRepairJobs.entries()) {
    if (path.resolve(repairContext.shardPath) !== targetShardPath) {
      continue;
    }
    const status = readJobStatus(db, jobId);
    if (status === 'queued' || status === 'running') {
      logger.info('vector shard repair already in flight', {
        event: 'vector_shard_repair_already_in_flight',
        jobId,
        shardPath: runtimeOptions.shardPath,
      });
      return jobId;
    }
  }

  return startReindexInternal(
    { toName: profile.model },
    {
      db,
      autoStart: runtimeOptions.autoStart,
      vectorShardRepair: {
        reason: runtimeOptions.reason,
        shardPath: runtimeOptions.shardPath,
      },
    },
  );
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
