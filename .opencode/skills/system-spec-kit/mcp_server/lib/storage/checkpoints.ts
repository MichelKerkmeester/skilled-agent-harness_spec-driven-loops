// ───────────────────────────────────────────────────────────────
// MODULE: Checkpoints
// ───────────────────────────────────────────────────────────────
// Feature catalog: Checkpoint creation (checkpoint_create)
// Feature catalog: Checkpoint restore (checkpoint_restore)
// Gzip-compressed database checkpoints with embedding preservation
// Node stdlib
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

// External packages
import { z } from 'zod';

// Internal utils
import { toErrorMessage } from '../../utils/db-helpers.js';
import { rebuildAutoEntities } from '../extraction/entity-extractor.js';
import {
  buildGovernanceLogicalKey,
  createScopeFilterPredicate,
  GOVERNANCE_AUDIT_ACTIONS,
  hasScopeConstraints,
  normalizeScopeContext,
  recordGovernanceAudit,
  recordTierDowngradeAudit,
} from '../governance/scope-governance.js';
import { detectCommunities, storeCommunityAssignments } from '../graph/community-detection.js';
import { generateCommunitySummaries } from '../graph/community-summaries.js';
import { storeCommunities } from '../graph/community-storage.js';
import { snapshotDegrees } from '../graph/graph-signals.js';
import { runLineageBackfill } from './lineage-state.js';
import { isIndexableConstitutionalMemoryPath, shouldIndexForMemory } from '../utils/index-scope.js';
import { reopenActiveDatabase } from '../search/vector-index-store.js';
import { SCHEMA_VERSION } from '../search/vector-index-schema.js';
import { sweepCausalEdges } from '../causal/sweep.js';
import { BetterSqliteContentionPolicy } from './ports/contention-policy.js';
import type Database from 'better-sqlite3';
import type {
  GovernanceAuditEntry,
  ScopeContext,
  TierDowngradeAuditParams,
} from '../governance/scope-governance.js';

function batchedInQuery<T>(db: Database.Database, sql: string, ids: (number | string)[], batchSize = 500): T[] {
  const results: T[] = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const placeholders = batch.map(() => '?').join(', ');
    const batchSql = sql.replace('__PLACEHOLDERS__', placeholders);
    results.push(...(db.prepare(batchSql).all(...batch) as T[]));
  }
  return results;
}

function dedupeRowsById<T extends Record<string, unknown>>(rows: T[]): T[] {
  const results: T[] = [];
  const seenIds = new Set<number | string>();

  for (const row of rows) {
    const id = row.id;
    if (typeof id === 'number' || typeof id === 'string') {
      if (seenIds.has(id)) {
        continue;
      }
      seenIds.add(id);
    }
    results.push(row);
  }

  return results;
}

function getSnapshotColumnsFromRows(rows: Array<Record<string, unknown>>): string[] {
  const columns = new Set<string>();

  for (const row of rows) {
    for (const key of Object.keys(row ?? {})) {
      if (typeof key === 'string' && key.length > 0) {
        columns.add(key);
      }
    }
  }

  return Array.from(columns);
}

function flushGovernanceAudits(
  database: Database.Database,
  entries: GovernanceAuditEntry[],
): void {
  for (const entry of entries) {
    try {
      recordGovernanceAudit(database, entry);
    } catch (error: unknown) {
      console.warn(`[checkpoints] governance_audit insert failed: ${toErrorMessage(error)}`);
    }
  }
}

function flushTierDowngradeAudits(
  database: Database.Database,
  entries: TierDowngradeAuditParams[],
): void {
  for (const entry of entries) {
    try {
      recordTierDowngradeAudit(database, entry);
    } catch (error: unknown) {
      console.warn(`[checkpoints] governance_audit insert failed: ${toErrorMessage(error)}`);
    }
  }
}

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

const MAX_CHECKPOINTS = 10;
const CHECKPOINT_CREATE_MAX_ATTEMPTS = 3;
const CHECKPOINT_CREATE_RETRY_MIN_DELAY_MS = 50;
const CHECKPOINT_CREATE_RETRY_MAX_DELAY_MS = 200;
const RESTORE_JOURNAL_NAME = '.restore-journal.json';
const NEEDS_REBUILD_SENTINEL_NAME = '.needs-rebuild';
const checkpointContention = new BetterSqliteContentionPolicy({ retryable: isCheckpointBusyError });

const CHECKPOINT_MANIFEST = Object.freeze({
  snapshot: [
    'memory_index',
    'vec_memories',
    'vec_metadata',
    'working_memory',
    'causal_edges',
    'weight_history',
    'memory_history',
    'mutation_ledger',
    'memory_conflicts',
    'memory_corrections',
    'adaptive_signal_events',
    'negative_feedback_events',
    'learned_feedback_audit',
    'session_learning',
    'governance_audit',
    'session_state',
    'session_sent_memories',
    'memory_summaries',
  ],
  rebuild: [
    'memory_lineage',
    'active_memory_projection',
    'memory_entities',
    'entity_catalog',
    'degree_snapshots',
    'community_assignments',
    'graph_communities',
    'community_summaries',
    'memory_fts',
  ],
  skip: [
    'checkpoints',
    'schema_version',
    'embedding_cache',
    'adaptive_shadow_runs',
  ],
});

const CHECKPOINT_RESTORE_ORDER = [
  'memory_index',
  'vec_memories',
  'vec_metadata',
  'working_memory',
  'causal_edges',
  'weight_history',
  'memory_history',
  'mutation_ledger',
  'memory_conflicts',
  'memory_corrections',
  'adaptive_signal_events',
  'negative_feedback_events',
  'learned_feedback_audit',
  'session_learning',
  'governance_audit',
  'session_state',
  'session_sent_memories',
  'memory_summaries',
] as const;

const CHECKPOINT_CLEAR_ORDER = [...CHECKPOINT_RESTORE_ORDER].reverse();

const MUTATION_LEDGER_TRIGGER_SQL = `
  CREATE TRIGGER IF NOT EXISTS prevent_ledger_update BEFORE UPDATE ON mutation_ledger
  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END;
  CREATE TRIGGER IF NOT EXISTS prevent_ledger_delete BEFORE DELETE ON mutation_ledger
  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END
`;

/* ───────────────────────────────────────────────────────────────
   2. INTERFACES
----------------------------------------------------------------*/

interface CheckpointEntry {
  id: number;
  name: string;
  created_at: string;
  spec_folder: string | null;
  git_branch: string | null;
  memory_snapshot: Buffer | null;
  file_snapshot: Buffer | null;
  snapshot_format?: string | null;
  snapshot_path?: string | null;
  metadata: string | null;
}

interface CheckpointInfo {
  id: number;
  name: string;
  createdAt: string;
  specFolder: string | null;
  gitBranch: string | null;
  snapshotSize: number;
  metadata: Record<string, unknown>;
  [key: string]: unknown;
}

interface CreateCheckpointOptions {
  name?: string;
  specFolder?: string | null;
  includeEmbeddings?: boolean;
  metadata?: Record<string, unknown>;
  scope?: ScopeContext;
}

type CheckpointCreateErrorCode =
  | 'CHECKPOINT_CREATE_SQLITE_BUSY'
  | 'CHECKPOINT_CREATE_SQLITE_LOCKED'
  | 'CHECKPOINT_CREATE_DUPLICATE_NAME'
  | 'CHECKPOINT_CREATE_INVALID_NAME'
  | 'CHECKPOINT_CREATE_PERMISSION_DENIED'
  | 'CHECKPOINT_CREATE_FAILED';

type CheckpointRestoreErrorCode =
  | 'CHECKPOINT_RESTORE_MANIFEST_INVALID'
  | 'CHECKPOINT_RESTORE_DOWNGRADE_UNSAFE'
  | 'CHECKPOINT_RESTORE_EMBEDDER_MISMATCH'
  | 'CHECKPOINT_RESTORE_FILE_MISSING'
  | 'CHECKPOINT_RESTORE_PATH_UNRESOLVED'
  | 'CHECKPOINT_RESTORE_JOURNAL_FAILED'
  | 'CHECKPOINT_RESTORE_SWAP_FAILED';

class CheckpointCreateError extends Error {
  public readonly code: CheckpointCreateErrorCode;
  public readonly originalCode: string | null;
  public readonly details: Record<string, unknown>;

  constructor(
    code: CheckpointCreateErrorCode,
    message: string,
    details: Record<string, unknown> = {},
    cause?: unknown,
  ) {
    super(message, { cause });
    Object.setPrototypeOf(this, CheckpointCreateError.prototype);
    this.name = 'CheckpointCreateError';
    this.code = code;
    this.originalCode = typeof details.originalCode === 'string' ? details.originalCode : null;
    this.details = details;
  }
}

class CheckpointRestoreError extends Error {
  public readonly code: CheckpointRestoreErrorCode;

  constructor(code: CheckpointRestoreErrorCode, message: string, cause?: unknown) {
    super(message, { cause });
    Object.setPrototypeOf(this, CheckpointRestoreError.prototype);
    this.name = 'CheckpointRestoreError';
    this.code = code;
  }
}

interface RestoreCheckpointV2Options {
  reopen?: (targetMainPath: string, swapFn: () => void) => Database.Database;
}

interface RestoreResult {
  restored: number;
  skipped: number;
  errors: string[];
  workingMemoryRestored: number;
  partialFailure?: boolean;
  rolledBackTables?: string[];
}

interface DerivedRebuildFailure {
  name: string;
  error: string;
}

interface DerivedRebuildSkipped {
  name: string;
  reason: string;
}

interface DerivedRebuildSummary {
  completed: string[];
  failed: DerivedRebuildFailure[];
  skipped: DerivedRebuildSkipped[];
}

interface RunDerivedArtifactRebuildOptions {
  specFolder?: string | null;
  actor?: string;
  logContext?: string;
}

interface NeedsRebuildSentinelFile {
  formatVersion: 1;
  createdAt: string;
  source: string;
  reason: string;
  rebuildSummary?: DerivedRebuildSummary;
}

interface NeedsRebuildSentinelWriteOptions {
  source: string;
  reason: string;
  summary?: DerivedRebuildSummary;
}

interface NeedsRebuildRepairOptions {
  source: string;
  specFolder?: string | null;
  actor?: string;
}

interface NeedsRebuildRepairResult {
  sentinelPresent: boolean;
  attempted: boolean;
  cleared: boolean;
  summary: DerivedRebuildSummary | null;
  error: string | null;
}

interface SnapshotVectorRow {
  rowid: number;
  embedding: Buffer | null;
}

interface TableSnapshot {
  columns: string[];
  rows: Array<Record<string, unknown>>;
}

interface CheckpointManifest {
  snapshot: string[];
  rebuild: string[];
  skip: string[];
}

interface CheckpointSnapshot {
  manifest?: CheckpointManifest;
  tables?: Record<string, TableSnapshot>;
  memories: Array<Record<string, unknown>>;
  workingMemory: Array<Record<string, unknown>>;
  vectors?: SnapshotVectorRow[];
  causalEdges?: Array<Record<string, unknown>>;
  timestamp: string;
}

interface DatabaseListRow {
  seq?: number;
  name?: string;
  file?: string;
}

interface CheckpointV2Manifest {
  formatVersion: 2;
  createdAt: string;
  specFolder: null;
  gitBranch: string | null;
  embedderSlug: string | null;
  includeEmbeddings: boolean;
  mainTables: string[];
  vecTables: string[];
  schemaVersion: number;
  memoryCount: number;
  vectorCount: number;
  mainBytes: number;
  vecBytes: number;
}

type RestoreJournalPhase = 'swap-pending' | 'swap-done';

interface RestoreJournalFile {
  formatVersion: 1;
  phase: RestoreJournalPhase;
  createdAt: string;
  checkpointName: string;
  liveMainPath: string;
  backupMainPath: string;
  snapshotMainPath: string;
  liveShardPath: string | null;
  backupShardPath: string | null;
  snapshotVecPath: string | null;
  shouldRestoreVec: boolean;
  liveShardPreexisted: boolean;
}

// Validate the decompressed checkpoint snapshot before
// restore. Previously the gzipped blob was JSON.parsed and cast directly
// to CheckpointSnapshot — malformed memory_index rows propagated through
// `getMemoryIds()` and the INSERT loops. This schema validates the
// outer envelope and the array shapes; individual row shapes are still
// permissive (sqlite columns evolve over time) but each row must be a
// non-null object so downstream column extraction doesn't NPE.
const CheckpointTableSnapshotSchema = z.object({
  columns: z.array(z.string()),
  rows: z.array(z.record(z.string(), z.unknown())),
});

const CheckpointVectorRowSchema = z.object({
  rowid: z.number(),
  embedding: z.unknown(), // Buffer or null — preserved as-is
});

const CheckpointSnapshotSchema = z.object({
  manifest: z.object({
    snapshot: z.array(z.string()),
    rebuild: z.array(z.string()),
    skip: z.array(z.string()),
  }).optional(),
  tables: z.record(z.string(), CheckpointTableSnapshotSchema).optional(),
  memories: z.array(z.record(z.string(), z.unknown())),
  workingMemory: z.array(z.record(z.string(), z.unknown())),
  vectors: z.array(CheckpointVectorRowSchema).optional(),
  causalEdges: z.array(z.record(z.string(), z.unknown())).optional(),
  timestamp: z.string(),
}).passthrough();

interface RestoreBarrierStatus {
  code: string;
  message: string;
}

interface RestoreBarrierHooks {
  afterAcquire?: (() => void) | null;
  beforeRelease?: (() => void) | null;
}

/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;
let restoreInProgress = false;
let restoreBarrierHooks: RestoreBarrierHooks = {};

const RESTORE_IN_PROGRESS_ERROR_CODE = 'E_RESTORE_IN_PROGRESS';
const RESTORE_IN_PROGRESS_ERROR_MESSAGE = 'Checkpoint restore maintenance is in progress. Retry after the restore lifecycle completes.';

/* ───────────────────────────────────────────────────────────────
   4. INITIALIZATION
----------------------------------------------------------------*/

function init(database: Database.Database): void {
  db = database;
}

function getDatabase(): Database.Database {
  if (!db) throw new Error('Database not initialized. The checkpoints module requires the MCP server to be running. Restart the MCP server and retry.');
  return db;
}

function getErrorCode(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : null;
  }
  return null;
}

function isCheckpointBusyError(error: unknown): boolean {
  const code = getErrorCode(error);
  const message = toErrorMessage(error);
  return code === 'SQLITE_BUSY'
    || code === 'SQLITE_LOCKED'
    || /\bSQLITE_BUSY\b|\bSQLITE_LOCKED\b|database is locked/i.test(message);
}

function classifyCheckpointCreateError(
  error: unknown,
  context: Record<string, unknown> = {},
): CheckpointCreateError {
  if (error instanceof CheckpointCreateError) {
    return error;
  }

  const originalCode = getErrorCode(error);
  const message = toErrorMessage(error);
  const details = {
    ...context,
    ...(originalCode ? { originalCode } : {}),
    originalMessage: message,
  };

  if (originalCode === 'SQLITE_BUSY' || /\bSQLITE_BUSY\b|database is locked/i.test(message)) {
    return new CheckpointCreateError(
      'CHECKPOINT_CREATE_SQLITE_BUSY',
      'Checkpoint creation failed because the SQLite database was busy. Retry after current writes finish.',
      details,
      error,
    );
  }

  if (originalCode === 'SQLITE_LOCKED' || /\bSQLITE_LOCKED\b/i.test(message)) {
    return new CheckpointCreateError(
      'CHECKPOINT_CREATE_SQLITE_LOCKED',
      'Checkpoint creation failed because the SQLite database was locked by another operation.',
      details,
      error,
    );
  }

  if (/UNIQUE constraint failed: checkpoints\.name|constraint failed/i.test(message)) {
    return new CheckpointCreateError(
      'CHECKPOINT_CREATE_DUPLICATE_NAME',
      'Checkpoint creation failed because a checkpoint with this name already exists.',
      details,
      error,
    );
  }

  if (
    originalCode === 'EACCES'
    || originalCode === 'EPERM'
    || originalCode === 'SQLITE_READONLY'
    || /permission denied|readonly|read-only/i.test(message)
  ) {
    return new CheckpointCreateError(
      'CHECKPOINT_CREATE_PERMISSION_DENIED',
      'Checkpoint creation failed because the database path is not writable.',
      details,
      error,
    );
  }

  return new CheckpointCreateError(
    'CHECKPOINT_CREATE_FAILED',
    `Checkpoint creation failed: ${message}`,
    details,
    error,
  );
}

function checkpointRetryDelayMs(): number {
  return CHECKPOINT_CREATE_RETRY_MIN_DELAY_MS
    + Math.floor(Math.random() * (CHECKPOINT_CREATE_RETRY_MAX_DELAY_MS - CHECKPOINT_CREATE_RETRY_MIN_DELAY_MS + 1));
}

function isRestoreInProgress(): boolean {
  return restoreInProgress;
}

function getRestoreBarrierStatus(): RestoreBarrierStatus | null {
  if (!restoreInProgress) {
    return null;
  }

  return {
    code: RESTORE_IN_PROGRESS_ERROR_CODE,
    message: RESTORE_IN_PROGRESS_ERROR_MESSAGE,
  };
}

function setRestoreBarrierHooks(hooks: RestoreBarrierHooks | null): void {
  restoreBarrierHooks = hooks ?? {};
}

function acquireRestoreBarrier(): void {
  restoreInProgress = true;
  restoreBarrierHooks.afterAcquire?.();
}

function releaseRestoreBarrier(): void {
  try {
    restoreBarrierHooks.beforeRelease?.();
  } finally {
    restoreInProgress = false;
  }
}

/* ───────────────────────────────────────────────────────────────
   5. HELPERS
----------------------------------------------------------------*/

function getGitBranch(): string | null {
  const candidates = [
    process.env.GIT_BRANCH,
    process.env.BRANCH_NAME,
    process.env.CI_COMMIT_REF_NAME,
    process.env.VERCEL_GIT_COMMIT_REF,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return null;
}

function quoteSqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function getDatabaseList(database: Database.Database): DatabaseListRow[] {
  return database.prepare('PRAGMA database_list').all() as DatabaseListRow[];
}

function sanitizeCheckpointName(name: string): string {
  const sanitized = name.trim();
  if (
    sanitized.length === 0
    || sanitized.length > 128
    || sanitized.includes('/')
    || sanitized.includes('\\')
    || sanitized.includes('..')
    || sanitized.includes('\0')
  ) {
    throw new CheckpointCreateError(
      'CHECKPOINT_CREATE_INVALID_NAME',
      'Checkpoint creation failed because the checkpoint name is invalid.',
      { name },
    );
  }
  return sanitized;
}

function resolveCheckpointDir(database: Database.Database, name: string): string {
  const sanitizedName = sanitizeCheckpointName(name);
  const mainRow = getDatabaseList(database).find((row) => row.name === 'main');
  const mainFile = mainRow?.file;
  if (!mainFile || mainFile === ':memory:') {
    throw new CheckpointCreateError(
      'CHECKPOINT_CREATE_FAILED',
      'Checkpoint creation failed because the main database file path could not be resolved.',
      { name: sanitizedName },
    );
  }
  return path.join(path.dirname(mainFile), 'checkpoints', sanitizedName);
}

function getActiveVectorShardPath(database: Database.Database): string | null {
  const activeVec = getDatabaseList(database).find((row) => row.name === 'active_vec');
  return activeVec?.file && activeVec.file.length > 0 ? activeVec.file : null;
}

function deriveEmbedderSlug(shardPath: string | null): string | null {
  if (!shardPath) {
    return null;
  }
  const match = /^context-vectors__(.+)\.sqlite$/.exec(path.basename(shardPath));
  return match?.[1] ?? null;
}

function sweepStaleCheckpointTmpDirs(checkpointsDir: string): void {
  if (!fs.existsSync(checkpointsDir)) {
    return;
  }
  for (const entry of fs.readdirSync(checkpointsDir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.includes('.tmp-')) {
      fs.rmSync(path.join(checkpointsDir, entry.name), { recursive: true, force: true });
    }
  }
}

function resolvePathSafe(targetPath: string): string {
  try {
    return fs.realpathSync(targetPath);
  } catch (_error: unknown) {
    return path.resolve(targetPath);
  }
}

function sweepOrphanCheckpointSnapshotDirs(database: Database.Database, checkpointsDir: string): void {
  // Checkpoint pruning removes the catalog row inside the create transaction but deletes
  // the snapshot dir AFTER commit. A crash in that gap leaves a snapshot dir with no
  // catalog row — never swept by the .tmp-* sweep (it has a published name) and never
  // restorable. Reconcile on-disk v2 snapshot dirs against the live catalog and remove
  // any that no catalog row references. Best-effort: never throw out of the create path.
  try {
    if (!fs.existsSync(checkpointsDir) || !tableExists(database, 'checkpoints')) {
      return;
    }

    const checkpointColumns = new Set(getTableColumns(database, 'checkpoints'));
    if (!checkpointColumns.has('snapshot_path')) {
      return;
    }
    const referenced = new Set<string>();
    const rows = database.prepare(
      "SELECT snapshot_path FROM checkpoints WHERE snapshot_path IS NOT NULL AND snapshot_path <> ''",
    ).all() as Array<{ snapshot_path?: string | null }>;
    for (const row of rows) {
      if (typeof row.snapshot_path === 'string' && row.snapshot_path.length > 0) {
        referenced.add(resolvePathSafe(row.snapshot_path));
      }
    }

    for (const entry of fs.readdirSync(checkpointsDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.includes('.tmp-')) {
        continue;
      }
      const entryPath = path.join(checkpointsDir, entry.name);
      if (referenced.has(resolvePathSafe(entryPath))) {
        continue;
      }
      try {
        fs.rmSync(entryPath, { recursive: true, force: true });
        console.warn(`[checkpoints] Swept orphan checkpoint snapshot dir with no catalog row: ${entry.name}`);
      } catch (_removeError: unknown) {
        // Best-effort: a single un-removable dir must not block checkpoint creation.
      }
    }
  } catch (error: unknown) {
    console.warn(`[checkpoints] Orphan checkpoint snapshot sweep skipped (non-fatal): ${toErrorMessage(error)}`);
  }
}

function readSchemaVersion(database: Database.Database): number | null {
  try {
    const row = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version?: number } | undefined;
    return typeof row?.version === 'number' ? row.version : null;
  } catch (_error: unknown) {
    return null;
  }
}

function countTableRows(database: Database.Database, tableName: string): number {
  if (!tableExists(database, tableName)) {
    return 0;
  }
  const row = database.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get() as { count?: number } | undefined;
  return typeof row?.count === 'number' ? row.count : 0;
}

function countActiveVectorRows(database: Database.Database): number {
  try {
    const row = database.prepare(`
      SELECT 1 AS found
      FROM active_vec.sqlite_master
      WHERE type IN ('table', 'view') AND name = 'vec_memories'
      LIMIT 1
    `).get() as { found?: number } | undefined;
    if (row?.found !== 1) {
      return 0;
    }
    const countRow = database.prepare('SELECT COUNT(*) AS count FROM active_vec.vec_memories').get() as { count?: number } | undefined;
    return typeof countRow?.count === 'number' ? countRow.count : 0;
  } catch (_error: unknown) {
    return 0;
  }
}

function readCheckpointV2Manifest(snapshotPath: string | null): CheckpointV2Manifest | null {
  if (!snapshotPath) {
    return null;
  }
  try {
    const raw = fs.readFileSync(path.join(snapshotPath, 'manifest.json'), 'utf-8');
    const parsed = JSON.parse(raw) as Partial<CheckpointV2Manifest>;
    return parsed.formatVersion === 2 ? parsed as CheckpointV2Manifest : null;
  } catch (_error: unknown) {
    return null;
  }
}

function loadCheckpointV2Manifest(snapshotPath: string | null): CheckpointV2Manifest {
  if (!snapshotPath) {
    throw new CheckpointRestoreError(
      'CHECKPOINT_RESTORE_MANIFEST_INVALID',
      'Checkpoint v2 restore failed because snapshot_path is missing.',
    );
  }

  const manifestPath = path.join(snapshotPath, 'manifest.json');
  try {
    const raw = fs.readFileSync(manifestPath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<CheckpointV2Manifest>;
    if (
      parsed.formatVersion !== 2
      || typeof parsed.includeEmbeddings !== 'boolean'
      || !Array.isArray(parsed.mainTables)
      || !Array.isArray(parsed.vecTables)
      || typeof parsed.schemaVersion !== 'number'
      || typeof parsed.memoryCount !== 'number'
      || typeof parsed.vectorCount !== 'number'
    ) {
      throw new Error('manifest shape is invalid');
    }
    return parsed as CheckpointV2Manifest;
  } catch (error: unknown) {
    throw new CheckpointRestoreError(
      'CHECKPOINT_RESTORE_MANIFEST_INVALID',
      `Checkpoint v2 restore failed because manifest.json could not be read: ${toErrorMessage(error)}`,
      error,
    );
  }
}

function resolveMainDatabasePath(database: Database.Database): string {
  const mainRow = getDatabaseList(database).find((row) => row.name === 'main');
  const mainFile = mainRow?.file;
  if (!mainFile || mainFile === ':memory:') {
    throw new CheckpointRestoreError(
      'CHECKPOINT_RESTORE_PATH_UNRESOLVED',
      'Checkpoint v2 restore failed because the live main database path could not be resolved.',
    );
  }
  return mainFile;
}

function removeSqliteSidecars(databasePath: string): void {
  for (const sidecarPath of [`${databasePath}-wal`, `${databasePath}-shm`]) {
    fs.rmSync(sidecarPath, { force: true });
  }
}

function getRestoreJournalPath(liveMainPath: string): string {
  return path.join(path.dirname(liveMainPath), 'checkpoints', RESTORE_JOURNAL_NAME);
}

function getNeedsRebuildSentinelPath(liveMainPath: string): string {
  return path.join(path.dirname(liveMainPath), 'checkpoints', NEEDS_REBUILD_SENTINEL_NAME);
}

function fsyncFileIfPossible(filePath: string): void {
  let fd: number | null = null;
  try {
    fd = fs.openSync(filePath, 'r');
    fs.fsyncSync(fd);
  } catch (_error: unknown) {
    // Best-effort durability; the next boot still treats any visible journal as authoritative.
  } finally {
    if (fd !== null) {
      try { fs.closeSync(fd); } catch (_error: unknown) { /* best-effort */ }
    }
  }
}

function fsyncDirectoryIfPossible(dirPath: string): void {
  let fd: number | null = null;
  try {
    fd = fs.openSync(dirPath, 'r');
    fs.fsyncSync(fd);
  } catch (_error: unknown) {
    // Directory fsync is unavailable on some platforms/filesystems.
  } finally {
    if (fd !== null) {
      try { fs.closeSync(fd); } catch (_error: unknown) { /* best-effort */ }
    }
  }
}

function writeRestoreJournal(journalPath: string, journal: RestoreJournalFile): void {
  const journalDir = path.dirname(journalPath);
  const tempJournalPath = `${journalPath}.tmp`;
  fs.mkdirSync(journalDir, { recursive: true, mode: 0o700 });
  fs.writeFileSync(tempJournalPath, `${JSON.stringify(journal, null, 2)}\n`, { mode: 0o600 });
  fsyncFileIfPossible(tempJournalPath);
  fs.renameSync(tempJournalPath, journalPath);
  fsyncDirectoryIfPossible(journalDir);
}

function clearRestoreJournal(journalPath: string): void {
  fs.rmSync(journalPath, { force: true });
  fsyncDirectoryIfPossible(path.dirname(journalPath));
}

function writeNeedsRebuildSentinelAtPath(
  sentinelPath: string,
  options: NeedsRebuildSentinelWriteOptions,
): void {
  const sentinelDir = path.dirname(sentinelPath);
  const tempSentinelPath = `${sentinelPath}.tmp`;
  const sentinel: NeedsRebuildSentinelFile = {
    formatVersion: 1,
    createdAt: new Date().toISOString(),
    source: options.source,
    reason: options.reason,
    ...(options.summary ? { rebuildSummary: options.summary } : {}),
  };

  fs.mkdirSync(sentinelDir, { recursive: true, mode: 0o700 });
  fs.writeFileSync(tempSentinelPath, `${JSON.stringify(sentinel, null, 2)}\n`, { mode: 0o600 });
  fsyncFileIfPossible(tempSentinelPath);
  fs.renameSync(tempSentinelPath, sentinelPath);
  fsyncDirectoryIfPossible(sentinelDir);
}

function clearNeedsRebuildSentinelAtPath(sentinelPath: string): boolean {
  const existed = fs.existsSync(sentinelPath);
  fs.rmSync(sentinelPath, { force: true });
  if (existed) {
    fsyncDirectoryIfPossible(path.dirname(sentinelPath));
  }
  return existed;
}

function getNeedsRebuildSentinelPathForDatabase(database: Database.Database): string | null {
  try {
    return getNeedsRebuildSentinelPath(resolveMainDatabasePath(database));
  } catch (_error: unknown) {
    return null;
  }
}

function hasNeedsRebuildSentinel(database: Database.Database): boolean {
  const sentinelPath = getNeedsRebuildSentinelPathForDatabase(database);
  return sentinelPath !== null && fs.existsSync(sentinelPath);
}

function writeNeedsRebuildSentinelForDatabase(
  database: Database.Database,
  options: NeedsRebuildSentinelWriteOptions,
): string | null {
  const sentinelPath = getNeedsRebuildSentinelPathForDatabase(database);
  if (sentinelPath === null) {
    return null;
  }
  writeNeedsRebuildSentinelAtPath(sentinelPath, options);
  return sentinelPath;
}

function writeNeedsRebuildSentinelForMainPath(
  liveMainPath: string,
  options: NeedsRebuildSentinelWriteOptions,
): string {
  const sentinelPath = getNeedsRebuildSentinelPath(liveMainPath);
  writeNeedsRebuildSentinelAtPath(sentinelPath, options);
  return sentinelPath;
}

function clearNeedsRebuildSentinelForDatabase(database: Database.Database): boolean {
  const sentinelPath = getNeedsRebuildSentinelPathForDatabase(database);
  if (sentinelPath === null) {
    return false;
  }
  return clearNeedsRebuildSentinelAtPath(sentinelPath);
}

function removeRestoreBackupIfPossible(backupPath: string): void {
  try {
    fs.rmSync(backupPath, { force: true });
  } catch (error: unknown) {
    console.warn(`[checkpoints] restore backup cleanup skipped for ${backupPath}: ${toErrorMessage(error)}`);
  }
}

function readCheckpointCatalogRows(database: Database.Database): Array<Record<string, unknown>> {
  if (!tableExists(database, 'checkpoints')) {
    return [];
  }
  return database.prepare('SELECT * FROM checkpoints ORDER BY id ASC').all() as Array<Record<string, unknown>>;
}

function mergeCheckpointCatalogRows(database: Database.Database, rows: Array<Record<string, unknown>>): void {
  if (rows.length === 0 || !tableExists(database, 'checkpoints')) {
    return;
  }

  const targetColumns = new Set(getTableColumns(database, 'checkpoints'));
  for (const row of rows) {
    const name = row.name;
    if (typeof name !== 'string' || name.length === 0) {
      continue;
    }
    const existingByName = database.prepare('SELECT id FROM checkpoints WHERE name = ?').get(name) as { id?: number } | undefined;
    if (existingByName?.id) {
      continue;
    }

    let columns = Object.keys(row).filter((column) => targetColumns.has(column));
    const id = row.id;
    if (typeof id === 'number') {
      const existingById = database.prepare('SELECT name FROM checkpoints WHERE id = ?').get(id) as { name?: string } | undefined;
      if (existingById?.name && existingById.name !== name) {
        columns = columns.filter((column) => column !== 'id');
      }
    }
    if (columns.length === 0) {
      continue;
    }

    const placeholders = columns.map(() => '?').join(', ');
    database.prepare(`
      INSERT OR IGNORE INTO checkpoints (${columns.join(', ')})
      VALUES (${placeholders})
    `).run(...columns.map((column) => row[column]));
  }
}

function pruneCheckpointCatalogRowsMissingSnapshots(database: Database.Database): void {
  // The restored snapshot-main DB carries the full checkpoints table as of the
  // snapshot, including v2 rows whose snapshot dir was deleted after the snapshot
  // was taken. Those rows would resurface in listCheckpoints with no restorable
  // dir, so drop any v2 row whose snapshot_path no longer exists on disk.
  // Best-effort: never throw out of the restore path.
  try {
    if (!tableExists(database, 'checkpoints')) {
      return;
    }
    const checkpointColumns = new Set(getTableColumns(database, 'checkpoints'));
    if (!checkpointColumns.has('snapshot_path') || !checkpointColumns.has('snapshot_format')) {
      return;
    }
    const rows = database.prepare(
      "SELECT id, snapshot_path FROM checkpoints WHERE snapshot_format = 'v2' AND snapshot_path IS NOT NULL AND snapshot_path <> ''",
    ).all() as Array<{ id: number; snapshot_path: string }>;
    for (const row of rows) {
      if (!fs.existsSync(row.snapshot_path)) {
        database.prepare('DELETE FROM checkpoints WHERE id = ?').run(row.id);
        console.warn(`[checkpoints] Dropped restored catalog row with missing snapshot dir: ${row.snapshot_path}`);
      }
    }
  } catch (error: unknown) {
    console.warn(`[checkpoints] Post-restore catalog reconciliation skipped (non-fatal): ${toErrorMessage(error)}`);
  }
}

function statPathBytes(targetPath: string): number {
  try {
    const stats = fs.statSync(targetPath);
    if (stats.isFile()) {
      return stats.size;
    }
    if (!stats.isDirectory()) {
      return 0;
    }
    return fs.readdirSync(targetPath).reduce((total, entry) => total + statPathBytes(path.join(targetPath, entry)), 0);
  } catch (_error: unknown) {
    return 0;
  }
}

function getCheckpointV2SnapshotSize(snapshotPath: string | null): number {
  const manifest = readCheckpointV2Manifest(snapshotPath);
  if (manifest) {
    return manifest.mainBytes + manifest.vecBytes;
  }
  return snapshotPath ? statPathBytes(snapshotPath) : 0;
}

function removeCheckpointSnapshotDirs(snapshotPaths: string[]): void {
  for (const snapshotPath of snapshotPaths) {
    try {
      fs.rmSync(snapshotPath, { recursive: true, force: true });
    } catch (_error: unknown) {
      // Best-effort cleanup; the checkpoint row is already gone.
    }
  }
}

function collectPrunedCheckpointSnapshotPaths(database: Database.Database, pruneCount: number): string[] {
  if (pruneCount <= 0) {
    return [];
  }
  const checkpointColumns = new Set(getTableColumns(database, 'checkpoints'));
  const snapshotPathSelect = checkpointColumns.has('snapshot_path') ? 'snapshot_path' : 'NULL AS snapshot_path';
  const snapshotFormatSelect = checkpointColumns.has('snapshot_format') ? 'snapshot_format' : "'v1' AS snapshot_format";
  const rows = database.prepare(`
    SELECT id, ${snapshotPathSelect}, ${snapshotFormatSelect}
    FROM checkpoints
    ORDER BY created_at ASC, id ASC
    LIMIT ?
  `).all(pruneCount) as Array<{ id: number; snapshot_path?: string | null; snapshot_format?: string | null }>;

  if (rows.length === 0) {
    return [];
  }
  const ids = rows.map((row) => row.id);
  const placeholders = ids.map(() => '?').join(', ');
  database.prepare(`DELETE FROM checkpoints WHERE id IN (${placeholders})`).run(...ids);
  return rows
    .filter((row) => row.snapshot_format === 'v2' && typeof row.snapshot_path === 'string' && row.snapshot_path.length > 0)
    .map((row) => row.snapshot_path as string);
}

function enforceMaxCheckpointsInTransaction(database: Database.Database): string[] {
  const checkpointCount = (database.prepare(
    'SELECT COUNT(*) as count FROM checkpoints'
  ) as Database.Statement).get() as { count: number };

  if (checkpointCount.count <= MAX_CHECKPOINTS) {
    return [];
  }

  return collectPrunedCheckpointSnapshotPaths(database, checkpointCount.count - MAX_CHECKPOINTS);
}

function supportsCheckpointV2(database: Database.Database): boolean {
  const checkpointColumns = new Set(getTableColumns(database, 'checkpoints'));
  return checkpointColumns.has('snapshot_format') && checkpointColumns.has('snapshot_path');
}

function hasMainVectorPayloadTables(database: Database.Database): boolean {
  try {
    // Gate v2 selection on vec_memories ONLY — the actual vector payload that the
    // shard-attach slimming removes from main. vec_metadata is a tiny key/value
    // config table that the same slimming intentionally RETAINS in main as a
    // dimension fallback, so its presence does NOT mean vector payload lives in
    // main. Including it here made full-DB create always observe "payload in main"
    // on a sharded runtime and silently fall back to the v1 whole-snapshot path
    // that overflows V8's single-string ceiling — the exact failure v2 prevents.
    const row = database.prepare(`
      SELECT 1 AS found
      FROM sqlite_master
      WHERE type IN ('table', 'view')
        AND name = 'vec_memories'
      LIMIT 1
    `).get() as { found?: number } | undefined;
    return row?.found === 1;
  } catch (_error: unknown) {
    return false;
  }
}

function tableExists(database: Database.Database, tableName: string): boolean {
  try {
    if (tableName === 'vec_memories') {
      const mainOrTempRow = database.prepare(`
        SELECT 1 AS found
        FROM temp.sqlite_master
        WHERE type IN ('table','view') AND name = 'vec_memories'
        UNION ALL
        SELECT 1 AS found
        FROM sqlite_master
        WHERE type IN ('table','view') AND name = 'vec_memories'
        LIMIT 1
      `).get() as { found?: number } | undefined;
      if (mainOrTempRow?.found === 1) {
        return true;
      }

      const hasActiveVectorShard = (database.prepare('PRAGMA database_list').all() as Array<{ name?: string }>)
        .some((entry) => entry.name === 'active_vec');
      if (!hasActiveVectorShard) {
        return false;
      }

      const vectorRow = database.prepare(`
        SELECT 1 AS found
        FROM active_vec.sqlite_master
        WHERE type IN ('table','view') AND name = 'vec_memories'
        LIMIT 1
      `).get() as { found?: number } | undefined;
      return vectorRow?.found === 1;
    }

    const row = database.prepare(
      "SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name = ?"
    ).get(tableName) as { name?: string } | undefined;
    return !!row?.name;
  } catch (_error: unknown) {
    return false;
  }
}

// Static allowlist for dynamic table name interpolation
const ALLOWED_TABLE_NAMES = new Set([
  // Core tables
  'memory_index', 'memory_fts', 'vec_memories', 'vec_metadata', 'causal_edges',
  'memory_conflicts', 'memory_corrections', 'memory_lineage', 'memory_history',
  'memory_summaries', 'mutation_ledger',
  // Working memory & session
  'working_memory', 'session_state', 'session_sent_memories', 'session_learning',
  // Graph & signals
  'weight_history', 'adaptive_signal_events', 'negative_feedback_events',
  'active_memory_projection', 'auto_entities', 'community_assignments', 'degree_snapshots',
  // Feedback & learning
  'learned_feedback_audit', 'learned_trigger_scores', 'learned_trigger_feedback',
  // Governance
  'governance_audit',
  // Checkpoints & system
  'checkpoints', 'checkpoint_items', 'deletion_log', 'consumption_log',
  'eval_shadow_comparisons',
]);

function validateTableName(tableName: string): void {
  if (!ALLOWED_TABLE_NAMES.has(tableName)) {
    throw new Error(`[checkpoints] Table name "${tableName}" not in allowlist`);
  }
}

function getTableColumns(database: Database.Database, tableName: string): string[] {
  validateTableName(tableName);
  try {
    return (database.prepare(`PRAGMA table_info("${tableName}")`).all() as Array<{ name: string }>)
      .map((column) => column.name)
      .filter((name) => typeof name === 'string' && name.length > 0);
  } catch (_error: unknown) {
    return [];
  }
}

function tableHasColumn(
  database: Database.Database,
  tableName: string,
  columnName: string,
): boolean {
  return getTableColumns(database, tableName).includes(columnName);
}

function toBuffer(value: unknown): Buffer | null {
  if (Buffer.isBuffer(value)) return value;
  if (value && typeof value === 'object') {
    const maybeSerialized = value as { type?: unknown; data?: unknown };
    if (
      maybeSerialized.type === 'Buffer' &&
      Array.isArray(maybeSerialized.data) &&
      maybeSerialized.data.every((entry) => typeof entry === 'number')
    ) {
      return Buffer.from(maybeSerialized.data);
    }
  }
  return null;
}

function deserializeSnapshotValue(value: unknown): unknown {
  if (value === undefined) {
    return null;
  }
  return toBuffer(value) ?? value;
}

function getMemoryIds(memories: Array<Record<string, unknown>>): number[] {
  const ids = new Set<number>();
  for (const memory of memories) {
    if (!memory || typeof memory !== 'object') {
      continue;
    }
    const rawId = memory.id;
    if (typeof rawId === 'number' && Number.isSafeInteger(rawId)) {
      ids.add(rawId);
      continue;
    }
    if (typeof rawId === 'string' && /^\d+$/.test(rawId)) {
      ids.add(Number.parseInt(rawId, 10));
    }
  }
  return Array.from(ids);
}

function parseCheckpointMetadata(value: unknown): Record<string, unknown> {
  if (!value) {
    return {};
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? parsed as Record<string, unknown>
        : {};
    } catch (_error: unknown) {
      return {};
    }
  }
  return typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function checkpointMetadataMatchesScope(rawMetadata: unknown, scope: ScopeContext): boolean {
  const normalizedScope = normalizeScopeContext(scope);
  if (!hasScopeConstraints(normalizedScope)) {
    return true;
  }

  const metadata = parseCheckpointMetadata(rawMetadata);
  return (
    (normalizedScope.tenantId === undefined || metadata.tenantId === normalizedScope.tenantId)
    && (normalizedScope.userId === undefined || metadata.userId === normalizedScope.userId)
    && (normalizedScope.agentId === undefined || metadata.agentId === normalizedScope.agentId)
  );
}

function hasDirectScopeColumns(columns: ReadonlySet<string>): boolean {
  return (
    columns.has('tenant_id')
    || columns.has('user_id')
    || columns.has('agent_id')
    || columns.has('session_id')
  );
}

function getScopeFilterContext(
  _database: Database.Database,
  scope: ScopeContext = {},
): {
  normalizedScope: ScopeContext;
  predicate: ((row: Record<string, unknown>) => boolean) | null;
} {
  const normalizedScope = normalizeScopeContext(scope);
  if (!hasScopeConstraints(normalizedScope)) {
    return {
      normalizedScope,
      predicate: null,
    };
  }

  return {
    normalizedScope,
    predicate: createScopeFilterPredicate<Record<string, unknown>>(normalizedScope),
  };
}

function getScopedMemories(
  database: Database.Database,
  specFolder: string | null,
  scope: ScopeContext = {},
): {
  memories: Array<Record<string, unknown>>;
  memoryIds: number[];
  normalizedScope: ScopeContext;
} {
  const { normalizedScope, predicate } = getScopeFilterContext(database, scope);
  const baseMemories = specFolder
    ? database.prepare('SELECT * FROM memory_index WHERE spec_folder = ?').all(specFolder) as Array<Record<string, unknown>>
    : database.prepare('SELECT * FROM memory_index').all() as Array<Record<string, unknown>>;
  const memories = predicate ? baseMemories.filter((row) => predicate(row)) : baseMemories;

  return {
    memories,
    memoryIds: getMemoryIds(memories),
    normalizedScope,
  };
}

function getCurrentScopedMemoryIds(
  database: Database.Database,
  specFolder: string | null,
  scope: ScopeContext = {},
): number[] {
  return getScopedMemories(database, specFolder, scope).memoryIds;
}

function buildRestoreScopeDeleteWhere(
  columns: ReadonlySet<string>,
  checkpointSpecFolder: string | null,
  scope: ScopeContext = {},
): {
  clauses: string[];
  params: string[];
} {
  const normalizedScope = normalizeScopeContext(scope);
  const clauses: string[] = [];
  const params: string[] = [];

  if (checkpointSpecFolder && columns.has('spec_folder')) {
    clauses.push('spec_folder = ?');
    params.push(checkpointSpecFolder);
  }
  if (normalizedScope.tenantId && columns.has('tenant_id')) {
    clauses.push('tenant_id = ?');
    params.push(normalizedScope.tenantId);
  }
  if (normalizedScope.userId && columns.has('user_id')) {
    clauses.push('user_id = ?');
    params.push(normalizedScope.userId);
  }
  if (normalizedScope.agentId && columns.has('agent_id')) {
    clauses.push('agent_id = ?');
    params.push(normalizedScope.agentId);
  }

  return { clauses, params };
}

function getEdgeIds(edges: Array<Record<string, unknown>>): number[] {
  const ids = new Set<number>();
  for (const edge of edges) {
    const rawId = edge?.id;
    if (typeof rawId === 'number' && Number.isSafeInteger(rawId)) {
      ids.add(rawId);
      continue;
    }
    if (typeof rawId === 'string' && /^\d+$/.test(rawId)) {
      ids.add(Number.parseInt(rawId, 10));
    }
  }
  return Array.from(ids);
}

function deleteRowsByIds(
  database: Database.Database,
  tableName: string,
  columnName: string,
  ids: number[],
): void {
  if (ids.length === 0) {
    return;
  }

  const sql = `DELETE FROM ${tableName} WHERE ${columnName} IN (__PLACEHOLDERS__)`;
  for (let i = 0; i < ids.length; i += 500) {
    const batch = ids.slice(i, i + 500);
    const placeholders = batch.map(() => '?').join(', ');
    database.prepare(sql.replace('__PLACEHOLDERS__', placeholders)).run(...batch);
  }
}

function snapshotCausalEdgesForMemoryIds(
  database: Database.Database,
  memoryIds: number[],
): Array<Record<string, unknown>> {
  if (memoryIds.length === 0 || !tableExists(database, 'causal_edges')) {
    return [];
  }

  try {
    const edgeIds = memoryIds.map((id) => String(id));
    return dedupeRowsById([
      ...batchedInQuery<Record<string, unknown>>(
        database,
        `
          SELECT * FROM causal_edges
          WHERE source_id IN (__PLACEHOLDERS__)
        `,
        edgeIds,
      ),
      ...batchedInQuery<Record<string, unknown>>(
        database,
        `
          SELECT * FROM causal_edges
          WHERE target_id IN (__PLACEHOLDERS__)
        `,
        edgeIds,
      ),
    ]);
  } catch (_error: unknown) {
    return [];
  }
}

function getTableSnapshotColumns(database: Database.Database, tableName: string): string[] {
  if (tableName === 'vec_memories') {
    return ['rowid', 'embedding'];
  }
  return getTableColumns(database, tableName);
}

function selectTableRows(
  database: Database.Database,
  tableName: string,
  options: {
    specFolder: string | null;
    memoryIds: number[];
    scope?: ScopeContext;
  },
): Array<Record<string, unknown>> {
  const { specFolder, memoryIds, scope = {} } = options;
  const normalizedScope = normalizeScopeContext(scope);
  const hasScope = hasScopeConstraints(normalizedScope);
  const scopePredicate = hasScope
    ? createScopeFilterPredicate<Record<string, unknown>>(normalizedScope)
    : null;

  if (tableName === 'memory_index') {
    const rows = specFolder
      ? database.prepare(
        'SELECT * FROM memory_index WHERE spec_folder = ?'
      ).all(specFolder) as Array<Record<string, unknown>>
      : database.prepare('SELECT * FROM memory_index').all() as Array<Record<string, unknown>>;
    return scopePredicate ? rows.filter((row) => scopePredicate(row)) : rows;
  }

  if (tableName === 'vec_memories') {
    if (memoryIds.length > 0) {
      return batchedInQuery<Record<string, unknown>>(
        database,
        'SELECT rowid AS rowid, embedding FROM vec_memories WHERE rowid IN (__PLACEHOLDERS__)',
        memoryIds,
      );
    }
    if (specFolder) {
      return database.prepare(`
      SELECT v.rowid AS rowid, v.embedding AS embedding
      FROM vec_memories v
      JOIN memory_index m ON m.id = v.rowid
      WHERE m.spec_folder = ?
    `).all(specFolder) as Array<Record<string, unknown>>;
    }
    return hasScope ? [] : database.prepare(
      'SELECT rowid AS rowid, embedding FROM vec_memories'
    ).all() as Array<Record<string, unknown>>;
  }

  if (tableName === 'causal_edges') {
    if (memoryIds.length > 0) {
      return snapshotCausalEdgesForMemoryIds(database, memoryIds);
    }
    return hasScope ? [] : database.prepare('SELECT * FROM causal_edges').all() as Array<Record<string, unknown>>;
  }

  const columns = new Set(getTableColumns(database, tableName));

  if (specFolder && columns.has('spec_folder')) {
    return database.prepare(
      `SELECT * FROM ${tableName} WHERE spec_folder = ?`
    ).all(specFolder) as Array<Record<string, unknown>>;
  }

  if (memoryIds.length > 0 && columns.has('memory_id')) {
    return batchedInQuery<Record<string, unknown>>(
      database,
      `SELECT * FROM ${tableName} WHERE memory_id IN (__PLACEHOLDERS__)`,
      memoryIds,
    );
  }

  if (memoryIds.length > 0 && tableName === 'memory_corrections') {
    return dedupeRowsById([
      ...batchedInQuery<Record<string, unknown>>(
        database,
        `
          SELECT * FROM memory_corrections
          WHERE original_memory_id IN (__PLACEHOLDERS__)
        `,
        memoryIds,
      ),
      ...batchedInQuery<Record<string, unknown>>(
        database,
        `
          SELECT * FROM memory_corrections
          WHERE correction_memory_id IN (__PLACEHOLDERS__)
        `,
        memoryIds,
      ),
    ]);
  }

  const allRows = database.prepare(`SELECT * FROM ${tableName}`).all() as Array<Record<string, unknown>>;
  if (!scopePredicate) {
    return allRows;
  }

  if (hasDirectScopeColumns(columns)) {
    return allRows.filter((row) => scopePredicate(row));
  }

  return [];
}

function createTableSnapshot(
  database: Database.Database,
  tableName: string,
  options: {
    specFolder: string | null;
    memoryIds: number[];
    scope?: ScopeContext;
  },
): TableSnapshot | null {
  if (!tableExists(database, tableName)) {
    return null;
  }

  const columns = getTableSnapshotColumns(database, tableName);
  if (columns.length === 0) {
    return null;
  }

  const rows = selectTableRows(database, tableName, options);
  return { columns, rows };
}

function buildCheckpointManifest(): CheckpointManifest {
  return {
    snapshot: [...CHECKPOINT_MANIFEST.snapshot],
    rebuild: [...CHECKPOINT_MANIFEST.rebuild],
    skip: [...CHECKPOINT_MANIFEST.skip],
  };
}

function buildLegacyTableSnapshots(snapshot: CheckpointSnapshot): Record<string, TableSnapshot> {
  const tableSnapshots: Record<string, TableSnapshot> = {};

  if (Array.isArray(snapshot.memories)) {
    tableSnapshots.memory_index = {
      columns: Object.keys(snapshot.memories[0] ?? {}),
      rows: snapshot.memories,
    };
  }

  if (Array.isArray(snapshot.workingMemory)) {
    tableSnapshots.working_memory = {
      columns: Object.keys(snapshot.workingMemory[0] ?? {}),
      rows: snapshot.workingMemory,
    };
  }

  if (Array.isArray(snapshot.vectors)) {
    tableSnapshots.vec_memories = {
      columns: ['rowid', 'embedding'],
      rows: snapshot.vectors.map((row) => ({
        rowid: row.rowid,
        embedding: row.embedding,
      })),
    };
  }

  if (Array.isArray(snapshot.causalEdges)) {
    tableSnapshots.causal_edges = {
      columns: getSnapshotColumnsFromRows(snapshot.causalEdges),
      rows: snapshot.causalEdges,
    };
  }

  return tableSnapshots;
}

function getSnapshotTables(snapshot: CheckpointSnapshot): Record<string, TableSnapshot> {
  const legacyTables = buildLegacyTableSnapshots(snapshot);
  return {
    ...legacyTables,
    ...(snapshot.tables ?? {}),
  };
}

function clearTable(database: Database.Database, tableName: string): void {
  if (!tableExists(database, tableName)) {
    return;
  }

  if (tableName === 'memory_fts') {
    database.exec(`INSERT INTO memory_fts(memory_fts) VALUES('delete-all')`);
    return;
  }

  if (tableName === 'mutation_ledger') {
    database.exec('DROP TRIGGER IF EXISTS prevent_ledger_update');
    database.exec('DROP TRIGGER IF EXISTS prevent_ledger_delete');
    database.prepare('DELETE FROM mutation_ledger').run();
    database.exec(MUTATION_LEDGER_TRIGGER_SQL);
    return;
  }

  database.prepare(`DELETE FROM ${tableName}`).run();
}

function clearTableForRestoreScope(
  database: Database.Database,
  tableName: string,
  options: {
    checkpointSpecFolder: string | null;
    memoryIds: number[];
    edgeIds: number[];
    scope?: ScopeContext;
    allowFullTableFallback?: boolean;
  },
): void {
  const {
    checkpointSpecFolder,
    memoryIds,
    edgeIds,
    scope = {},
    allowFullTableFallback = true,
  } = options;
  const normalizedScope = normalizeScopeContext(scope);
  const hasScope = hasScopeConstraints(normalizedScope);
  if (!tableExists(database, tableName)) {
    return;
  }

  if (tableName === 'causal_edges') {
    if (!checkpointSpecFolder && !hasScope && allowFullTableFallback) {
      sweepCausalEdges(database, {
        whereSql: '1 = 1',
        reason: 'checkpoint restore causal edge reset',
        command: 'checkpoints.clearTableForRestoreScope',
        restoreContext: { checkpointSpecFolder, scope: normalizedScope },
      });
      return;
    }

    if (memoryIds.length > 0) {
      sweepCausalEdges(database, {
        memoryIds,
        reason: 'checkpoint restore scoped causal cleanup',
        command: 'checkpoints.clearTableForRestoreScope',
        restoreContext: { checkpointSpecFolder, scope: normalizedScope },
      });
    }
    return;
  }

  if (!checkpointSpecFolder && !hasScope && allowFullTableFallback) {
    clearTable(database, tableName);
    return;
  }

  const columns = new Set(getTableColumns(database, tableName));
  const { clauses: scopedClauses, params: scopedParams } = buildRestoreScopeDeleteWhere(
    columns,
    checkpointSpecFolder,
    normalizedScope,
  );

  if (tableName === 'memory_index') {
    if (scopedClauses.length > 0) {
      database.prepare(`DELETE FROM memory_index WHERE ${scopedClauses.join(' AND ')}`).run(...scopedParams);
    }
    return;
  }

  if (tableName === 'vec_memories') {
    deleteRowsByIds(database, 'vec_memories', 'rowid', memoryIds);
    return;
  }

  if (tableName === 'memory_corrections') {
    if (memoryIds.length === 0) {
      return;
    }
    deleteRowsByIds(database, tableName, 'original_memory_id', memoryIds);
    deleteRowsByIds(database, tableName, 'correction_memory_id', memoryIds);
    return;
  }

  if (tableName === 'weight_history') {
    deleteRowsByIds(database, tableName, 'edge_id', edgeIds);
    return;
  }

  if (scopedClauses.length > 0) {
    database.prepare(`DELETE FROM ${tableName} WHERE ${scopedClauses.join(' AND ')}`).run(...scopedParams);
    return;
  }

  if (columns.has('spec_folder')) {
    database.prepare(`DELETE FROM ${tableName} WHERE spec_folder = ?`).run(checkpointSpecFolder);
    return;
  }

  if (memoryIds.length > 0 && columns.has('memory_id')) {
    deleteRowsByIds(database, tableName, 'memory_id', memoryIds);
    return;
  }

  if (!hasScope && allowFullTableFallback) {
    clearTable(database, tableName);
  }
}

function clearDerivedTablesForRestore(
  database: Database.Database,
  options: {
    checkpointSpecFolder: string | null;
    memoryIds: number[];
    scope?: ScopeContext;
  },
): void {
  const { checkpointSpecFolder, memoryIds, scope = {} } = options;
  const hasScope = hasScopeConstraints(normalizeScopeContext(scope));

  for (const tableName of CHECKPOINT_MANIFEST.rebuild) {
    if (!tableExists(database, tableName)) {
      continue;
    }

    if (!checkpointSpecFolder && !hasScope) {
      clearTable(database, tableName);
      continue;
    }

    if (tableName === 'entity_catalog') {
      continue;
    }

    if (tableName === 'memory_fts') {
      continue;
    }

    const columns = new Set(getTableColumns(database, tableName));
    if (memoryIds.length > 0 && columns.has('memory_id')) {
      deleteRowsByIds(database, tableName, 'memory_id', memoryIds);
      continue;
    }

    if (!hasScope) {
      clearTable(database, tableName);
    }
  }
}

function restoreMergeTableAtomically(
  database: Database.Database,
  tableName: string,
  tableSnapshot: TableSnapshot,
  options: {
    checkpointSpecFolder: string | null;
    memoryIds: number[];
    edgeIds: number[];
    scope: ScopeContext;
  },
): { restoredCount: number; error?: string } {
  const savepointName = `checkpoint_merge_${tableName.replace(/[^a-z0-9_]/gi, '_')}`;

  database.exec(`SAVEPOINT ${savepointName}`);
  try {
    clearTableForRestoreScope(database, tableName, {
      ...options,
      allowFullTableFallback: false,
    });
    const restoredCount = restoreGenericTable(database, tableName, tableSnapshot);
    database.exec(`RELEASE SAVEPOINT ${savepointName}`);
    return { restoredCount };
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    try {
      database.exec(`ROLLBACK TO SAVEPOINT ${savepointName}`);
    } finally {
      try {
        database.exec(`RELEASE SAVEPOINT ${savepointName}`);
      } catch {
        // Ignore follow-up release errors after rollback.
      }
    }
    return {
      restoredCount: 0,
      error: `${tableName}: merge restore rolled back after pre-clear because reinsertion failed: ${msg}`,
    };
  }
}

function ensureWorkingMemorySchema(database: Database.Database): void {
  try {
    database.exec(`
      CREATE TABLE IF NOT EXISTS working_memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        memory_id INTEGER,
        attention_score REAL DEFAULT 1.0,
        added_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
        focus_count INTEGER DEFAULT 1,
        event_counter INTEGER NOT NULL DEFAULT 0,
        mention_count INTEGER NOT NULL DEFAULT 0,
        source_tool TEXT,
        source_call_id TEXT,
        extraction_rule_id TEXT,
        redaction_applied INTEGER NOT NULL DEFAULT 0,
        UNIQUE(session_id, memory_id),
        FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
      )
    `);

    const wmColumns = (database.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
      .map((column) => column.name);
    if (!wmColumns.includes('event_counter')) {
      database.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
    }
    if (!wmColumns.includes('mention_count')) {
      database.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
    }
    if (!wmColumns.includes('source_tool')) {
      database.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
    }
    if (!wmColumns.includes('source_call_id')) {
      database.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
    }
    if (!wmColumns.includes('extraction_rule_id')) {
      database.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
    }
    if (!wmColumns.includes('redaction_applied')) {
      database.exec('ALTER TABLE working_memory ADD COLUMN redaction_applied INTEGER NOT NULL DEFAULT 0');
    }
  } catch (_error: unknown) {
    // Best-effort schema preparation only.
  }
}

function restoreGenericTable(
  database: Database.Database,
  tableName: string,
  tableSnapshot: TableSnapshot,
): number {
  if (!tableExists(database, tableName)) {
    return 0;
  }

  const columns = tableSnapshot.columns.length > 0
    ? tableSnapshot.columns
    : Object.keys(tableSnapshot.rows[0] ?? {});
  if (columns.length === 0 || tableSnapshot.rows.length === 0) {
    return 0;
  }

  const placeholders = columns.map(() => '?').join(', ');
  const insertVerb = tableName === 'vec_memories' ? 'INSERT' : 'INSERT OR REPLACE';
  const insertStmt = database.prepare(`
    ${insertVerb} INTO ${tableName} (${columns.join(', ')})
    VALUES (${placeholders})
  `) as Database.Statement;
  const deleteVecById = tableName === 'vec_memories'
    ? database.prepare('DELETE FROM vec_memories WHERE rowid = ?') as Database.Statement
    : null;

  let restored = 0;
  for (const row of tableSnapshot.rows) {
    const values = columns.map((column) => deserializeSnapshotValue(row[column]));
    if (deleteVecById) {
      deleteVecById.run(row.rowid);
    }
    insertStmt.run(...values);
    restored++;
  }
  return restored;
}

function isDerivedRebuildComplete(summary: DerivedRebuildSummary): boolean {
  return summary.failed.length === 0 && summary.skipped.length === 0;
}

function runDerivedArtifactRebuilds(
  database: Database.Database,
  options: RunDerivedArtifactRebuildOptions = {},
): DerivedRebuildSummary {
  const hasMemoryParentId = tableHasColumn(database, 'memory_index', 'parent_id');
  const checkpointSpecFolder = options.specFolder ?? null;
  const actor = options.actor ?? 'mcp:checkpoint_restore';
  const logContext = options.logContext ?? 'derived-artifact';

  const rebuildSteps: Array<{ name: string; deps: string[]; run: () => void }> = [
    {
      name: 'auto-entities',
      deps: ['lineage-backfill'],
      run: () => rebuildAutoEntities(database, { specFolder: checkpointSpecFolder ?? undefined }),
    },
    {
      name: 'degree-snapshots',
      deps: ['lineage-backfill'],
      run: () => snapshotDegrees(database),
    },
    {
      name: 'community-artifacts',
      deps: ['degree-snapshots'],
      run: () => {
        const communities = detectCommunities(database);
        storeCommunities(database, communities);
        storeCommunityAssignments(database, communities);
        generateCommunitySummaries(database, communities);
      },
    },
    {
      name: 'fts-rebuild',
      deps: ['lineage-backfill', 'auto-entities'],
      run: () => {
        if (tableExists(database, 'memory_fts')) {
          database.exec(`INSERT INTO memory_fts(memory_fts) VALUES('rebuild')`);
        }
      },
    },
  ];

  if (hasMemoryParentId) {
    rebuildSteps.unshift({
      name: 'lineage-backfill',
      deps: [],
      run: () => runLineageBackfill(database, { actor }),
    });
  }

  const completed = new Set<string>();
  const failed: DerivedRebuildFailure[] = [];
  const skipped: DerivedRebuildSkipped[] = [];

  for (const { name, deps, run } of rebuildSteps) {
    const missingDeps = deps.filter((dependency) => !completed.has(dependency));
    if (missingDeps.length > 0) {
      const reason = `dependencies did not complete: ${missingDeps.join(', ')}`;
      skipped.push({ name, reason });
      console.warn(
        `[checkpoints] Skipping ${logContext} rebuild "${name}" because ${reason}`,
      );
      continue;
    }

    try {
      run();
      completed.add(name);
    } catch (err: unknown) {
      const error = toErrorMessage(err);
      failed.push({ name, error });
      console.warn(`[checkpoints] ${logContext} rebuild "${name}" failed (non-fatal): ${error}`);
    }
  }

  const summary: DerivedRebuildSummary = {
    completed: [...completed],
    failed,
    skipped,
  };

  console.warn(
    `[checkpoints] ${logContext} rebuild summary: completed=${summary.completed.join(', ') || 'none'}; failed=${summary.failed.map((entry) => entry.name).join(', ') || 'none'}; skipped=${summary.skipped.map((entry) => entry.name).join(', ') || 'none'}`,
  );

  return summary;
}

function runPostRestoreRebuilds(
  database: Database.Database,
  checkpointSpecFolder: string | null,
): DerivedRebuildSummary {
  return runDerivedArtifactRebuilds(database, {
    specFolder: checkpointSpecFolder,
    actor: 'mcp:checkpoint_restore',
    logContext: 'post-restore',
  });
}

function repairNeedsRebuildSentinel(
  database: Database.Database,
  options: NeedsRebuildRepairOptions,
): NeedsRebuildRepairResult {
  if (!hasNeedsRebuildSentinel(database)) {
    return {
      sentinelPresent: false,
      attempted: false,
      cleared: false,
      summary: null,
      error: null,
    };
  }

  let summary: DerivedRebuildSummary | null = null;
  try {
    summary = runDerivedArtifactRebuilds(database, {
      specFolder: options.specFolder ?? null,
      actor: options.actor ?? `mcp:${options.source}`,
      logContext: `${options.source} repair`,
    });

    if (!isDerivedRebuildComplete(summary)) {
      return {
        sentinelPresent: true,
        attempted: true,
        cleared: false,
        summary,
        error: null,
      };
    }

    clearNeedsRebuildSentinelForDatabase(database);
    return {
      sentinelPresent: true,
      attempted: true,
      cleared: true,
      summary,
      error: null,
    };
  } catch (error: unknown) {
    return {
      sentinelPresent: true,
      attempted: true,
      cleared: false,
      summary,
      error: toErrorMessage(error),
    };
  }
}

function normalizeMemoryColumnValue(column: string, value: unknown): unknown {
  if (value === undefined) {
    if (column === 'confidence') return 0.5;
    if (column === 'stability') return 1.0;
    if (column === 'difficulty') return 5.0;
    if (column === 'review_count') return 0;
    return null;
  }

  if (column === 'confidence') {
    return Number.isFinite(value) ? value : 0.5;
  }
  if (column === 'stability') {
    return Number.isFinite(value) ? value : 1.0;
  }
  if (column === 'difficulty') {
    return Number.isFinite(value) ? value : 5.0;
  }
  if (column === 'review_count') {
    return Number.isFinite(value) ? value : 0;
  }

  if ((column === 'trigger_phrases' || column === 'quality_flags') && Array.isArray(value)) {
    return JSON.stringify(value);
  }

  return value;
}

function getMemoryRestoreColumns(
  database: Database.Database,
  memories: Array<Record<string, unknown>>
): string[] {
  const tableColumns = new Set(getTableColumns(database, 'memory_index'));
  if (tableColumns.size === 0) {
    return [];
  }

  const snapshotColumns = new Set<string>();
  for (const memory of memories) {
    for (const key of Object.keys(memory)) {
      if (tableColumns.has(key)) {
        snapshotColumns.add(key);
      }
    }
  }

  const preferredOrder = [
    'id',
    'spec_folder',
    'file_path',
    'canonical_file_path',
    'anchor_id',
    'title',
    'trigger_phrases',
    'importance_weight',
    'created_at',
    'updated_at',
    'embedding_model',
    'embedding_generated_at',
    'embedding_status',
    'retry_count',
    'last_retry_at',
    'failure_reason',
    'base_importance',
    'decay_half_life_days',
    'is_pinned',
    'access_count',
    'last_accessed',
    'importance_tier',
    'session_id',
    'context_type',
    'channel',
    'content_hash',
    'expires_at',
    'confidence',
    'validation_count',
    'stability',
    'difficulty',
    'last_review',
    'review_count',
    'file_mtime_ms',
    'is_archived', // DEPRECATED schema compatibility
    'document_type',
    'spec_level',
    'content_text',
    'quality_score',
    'quality_flags',
    'parent_id',
    'chunk_index',
    'chunk_label',
  ];

  const ordered = preferredOrder.filter((column) => snapshotColumns.has(column));
  const extras = Array.from(snapshotColumns)
    .filter((column) => !ordered.includes(column))
    .sort((a, b) => a.localeCompare(b));

  return [...ordered, ...extras];
}

/* ───────────────────────────────────────────────────────────────
   6. Fix: CHECKPOINT SCHEMA VALIDATION
   Validate each memory row before restore to prevent silent data
   loss from corrupt/malformed checkpoint snapshots.
----------------------------------------------------------------*/

/**
 * Validates a single memory row from a checkpoint snapshot.
 * Throws on invalid data — caller should reject the entire restore.
 *
 * Strict on identity fields (id, file_path, spec_folder).
 * Required-but-lenient on INSERT-needed fields (must be present, type flexible).
 * Optional fields (anchor_id, embedding_*, etc.) may be null/undefined for
 * backwards compatibility with older checkpoint formats.
 */
function validateMemoryRow(
  row: unknown,
  index: number,
  governanceAudits: GovernanceAuditEntry[] = [],
  tierDowngradeAudits: TierDowngradeAuditParams[] = [],
): void {
  if (!row || typeof row !== 'object') {
    throw new Error(`Checkpoint row ${index}: not an object (got ${typeof row})`);
  }
  const r = row as Record<string, unknown>;

  // --- Strict identity fields (core to INSERT and data integrity) ---
  if (typeof r.id !== 'number' || !Number.isFinite(r.id)) {
    throw new Error(`Checkpoint row ${index}: id must be a finite number, got ${typeof r.id} (${String(r.id)})`);
  }
  if (typeof r.file_path !== 'string' || !r.file_path) {
    throw new Error(`Checkpoint row ${index}: file_path must be non-empty string, got ${typeof r.file_path}`);
  }
  if (typeof r.spec_folder !== 'string' || !r.spec_folder) {
    throw new Error(`Checkpoint row ${index}: spec_folder must be non-empty string, got ${typeof r.spec_folder}`);
  }

  // --- Required fields for INSERT (must be present; type flexibility for compat) ---
  const requiredFields = ['title', 'importance_weight', 'created_at', 'updated_at', 'importance_tier'];
  for (const field of requiredFields) {
    if (r[field] === undefined) {
      throw new Error(`Checkpoint row ${index}: missing required field '${field}'`);
    }
  }

  const resolvedPath = typeof r.canonical_file_path === 'string' && r.canonical_file_path.length > 0
    ? r.canonical_file_path
    : r.file_path;

  if (!shouldIndexForMemory(resolvedPath as string)) {
    governanceAudits.push({
      action: GOVERNANCE_AUDIT_ACTIONS.CHECKPOINT_RESTORE_EXCLUDED_PATH_REJECTED,
      decision: 'deny',
      memoryId: r.id as number,
      logicalKey: buildGovernanceLogicalKey(
        typeof r.spec_folder === 'string' ? r.spec_folder : null,
        resolvedPath as string,
        typeof r.anchor_id === 'string' ? r.anchor_id : null,
      ),
      reason: 'checkpoint_restore_path_excluded',
      metadata: {
        source: 'checkpoint_restore',
        rowIndex: index,
        filePath: r.file_path,
        canonicalFilePath: typeof r.canonical_file_path === 'string' ? r.canonical_file_path : null,
        importanceTier: r.importance_tier ?? null,
      },
    });
    throw new Error(`Checkpoint row ${index}: path excluded from memory indexing (${resolvedPath as string})`);
  }

  if (r.importance_tier === 'constitutional' && !isIndexableConstitutionalMemoryPath(resolvedPath as string)) {
    tierDowngradeAudits.push({
      memoryId: r.id as number,
      logicalKey: buildGovernanceLogicalKey(
        typeof r.spec_folder === 'string' ? r.spec_folder : null,
        resolvedPath as string,
        typeof r.anchor_id === 'string' ? r.anchor_id : null,
      ),
      action: GOVERNANCE_AUDIT_ACTIONS.TIER_DOWNGRADE_NON_CONSTITUTIONAL_PATH,
      reason: 'non_constitutional_path',
      requestedTier: 'constitutional',
      nextTier: 'important',
      source: 'checkpoint_restore',
      filePath: typeof r.file_path === 'string' ? r.file_path : null,
      canonicalFilePath: typeof r.canonical_file_path === 'string' ? r.canonical_file_path : null,
      metadata: {
        rowIndex: index,
        importanceTier: r.importance_tier ?? null,
      },
    });
    r.importance_tier = 'important';
  }
}

/* ───────────────────────────────────────────────────────────────
   7. CHECKPOINT OPERATIONS
----------------------------------------------------------------*/

function createCheckpointV2(
  database: Database.Database,
  options: Required<Pick<CreateCheckpointOptions, 'name' | 'includeEmbeddings' | 'metadata'>>,
): CheckpointInfo {
  const sanitizedName = sanitizeCheckpointName(options.name);
  const finalDir = resolveCheckpointDir(database, sanitizedName);
  const checkpointsDir = path.dirname(finalDir);
  const tmpDir = `${finalDir}.tmp-${process.pid}`;
  const mainSnapshotPath = path.join(tmpDir, 'snapshot-main.sqlite');
  const vecSnapshotPath = path.join(tmpDir, 'snapshot-vec.sqlite');
  let published = false;

  try {
    const existing = database.prepare('SELECT id FROM checkpoints WHERE name = ?').get(sanitizedName) as { id?: number } | undefined;
    if (existing?.id) {
      throw new CheckpointCreateError(
        'CHECKPOINT_CREATE_DUPLICATE_NAME',
        'Checkpoint creation failed because a checkpoint with this name already exists.',
        { name: sanitizedName },
      );
    }

    checkpointContention.setBusyTimeout(database, 5000, { ignoreErrors: true });

    fs.mkdirSync(checkpointsDir, { recursive: true, mode: 0o700 });
    sweepStaleCheckpointTmpDirs(checkpointsDir);
    sweepOrphanCheckpointSnapshotDirs(database, checkpointsDir);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.mkdirSync(tmpDir, { recursive: true, mode: 0o700 });

    let lastVacuumError: unknown;
    checkpointContention.withRetry(() => {
        database.exec(`VACUUM main INTO ${quoteSqlString(mainSnapshotPath)}`);
        const activeVecPath = getActiveVectorShardPath(database);
        if (options.includeEmbeddings && activeVecPath) {
          database.exec(`VACUUM active_vec INTO ${quoteSqlString(vecSnapshotPath)}`);
        }
    }, {
      attempts: CHECKPOINT_CREATE_MAX_ATTEMPTS,
      delayMs: checkpointRetryDelayMs,
      sync: true,
      onRetry: (error, { attempt, delayMs }) => {
        lastVacuumError = error;
        fs.rmSync(mainSnapshotPath, { force: true });
        fs.rmSync(vecSnapshotPath, { force: true });
        console.warn(
          `[checkpoints] createCheckpoint v2 VACUUM busy for "${sanitizedName}" on attempt ${attempt}; retrying in ${delayMs}ms`,
        );
      },
    });

    if (lastVacuumError && !fs.existsSync(mainSnapshotPath)) {
      throw lastVacuumError;
    }

    const createdAt = new Date().toISOString();
    const gitBranch = getGitBranch();
    const activeVecPath = getActiveVectorShardPath(database);
    const vecIncluded = options.includeEmbeddings && !!activeVecPath && fs.existsSync(vecSnapshotPath);
    const mainBytes = fs.statSync(mainSnapshotPath).size;
    const vecBytes = vecIncluded ? fs.statSync(vecSnapshotPath).size : 0;
    const manifest: CheckpointV2Manifest = {
      formatVersion: 2,
      createdAt,
      specFolder: null,
      gitBranch,
      embedderSlug: deriveEmbedderSlug(activeVecPath),
      includeEmbeddings: options.includeEmbeddings,
      mainTables: CHECKPOINT_MANIFEST.snapshot.filter((tableName) => tableName !== 'vec_memories' && tableName !== 'vec_metadata'),
      vecTables: vecIncluded ? ['vec_memories', 'vec_metadata'] : [],
      schemaVersion: readSchemaVersion(database) ?? SCHEMA_VERSION,
      memoryCount: countTableRows(database, 'memory_index'),
      vectorCount: vecIncluded ? countActiveVectorRows(database) : 0,
      mainBytes,
      vecBytes,
    };
    fs.writeFileSync(path.join(tmpDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
    fs.renameSync(tmpDir, finalDir);
    published = true;

    let prunedSnapshotPaths: string[] = [];
    const checkpointMetadata = {
      ...options.metadata,
      formatVersion: 2,
      memoryCount: manifest.memoryCount,
      vectorCount: manifest.vectorCount,
      includeEmbeddings: options.includeEmbeddings,
      manifest,
    };

    const checkpointInfo = database.transaction(() => {
      const result = (database.prepare(`
        INSERT INTO checkpoints (name, created_at, spec_folder, git_branch, memory_snapshot, snapshot_format, snapshot_path, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `) as Database.Statement).run(
        sanitizedName,
        createdAt,
        null,
        gitBranch,
        null,
        'v2',
        finalDir,
        JSON.stringify(checkpointMetadata),
      );

      prunedSnapshotPaths = enforceMaxCheckpointsInTransaction(database);

      return {
        id: (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number,
        name: sanitizedName,
        createdAt,
        specFolder: null,
        gitBranch,
        snapshotSize: mainBytes + vecBytes,
        snapshotFormat: 'v2',
        snapshotPath: finalDir,
        metadata: {
          ...options.metadata,
          formatVersion: 2,
          memoryCount: manifest.memoryCount,
          vectorCount: manifest.vectorCount,
        },
      };
    })();

    removeCheckpointSnapshotDirs(prunedSnapshotPaths.filter((snapshotPath) => snapshotPath !== finalDir));
    console.error(`[checkpoints] Created checkpoint "${sanitizedName}" (${checkpointInfo.snapshotSize} bytes file snapshot)`);
    return checkpointInfo;
  } catch (error: unknown) {
    if (!published) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } else {
      // The snapshot dir was already published (renamed into place) before the
      // catalog INSERT ran. A failed INSERT would otherwise orphan finalDir, and
      // a later same-name re-create would hit ENOTEMPTY on the rename and never
      // be swept. Best-effort remove the published dir so re-creates can proceed.
      fs.rmSync(finalDir, { recursive: true, force: true });
    }
    throw classifyCheckpointCreateError(error, {
      name: sanitizedName,
      specFolder: null,
      attempts: CHECKPOINT_CREATE_MAX_ATTEMPTS,
    });
  }
}

function createCheckpoint(options: CreateCheckpointOptions = {}): CheckpointInfo {
  const database = getDatabase();

  const {
    name = `checkpoint-${Date.now()}`,
    specFolder = null,
    includeEmbeddings = true,
    metadata = {},
    scope = {},
  } = options;

  const normalizedScopeForSelection = normalizeScopeContext(scope);
  const useV2 = specFolder == null
    && !normalizedScopeForSelection.tenantId
    && !normalizedScopeForSelection.userId
    && !normalizedScopeForSelection.agentId
    && supportsCheckpointV2(database)
    && !hasMainVectorPayloadTables(database);

  if (useV2) {
    return createCheckpointV2(database, { name, includeEmbeddings, metadata });
  }

  try {
    try {
      checkpointContention.setBusyTimeout(database, 1000, { ignoreErrors: true });
    } catch (_pragmaError: unknown) {
      // Non-fatal: older/mocked better-sqlite3 handles may not expose pragma.
    }

    const {
      memories,
      memoryIds: scopedMemoryIds,
      normalizedScope,
    } = getScopedMemories(database, specFolder, scope);
    const tables: Record<string, TableSnapshot> = {};

    for (const tableName of CHECKPOINT_MANIFEST.snapshot) {
      if (!includeEmbeddings && (tableName === 'vec_memories' || tableName === 'vec_metadata')) {
        continue;
      }

      const tableSnapshot = createTableSnapshot(database, tableName, {
        specFolder,
        memoryIds: scopedMemoryIds,
        scope: normalizedScope,
      });
      if (!tableSnapshot) {
        continue;
      }
      tables[tableName] = tableSnapshot;
    }

    const vectorRows = tables.vec_memories?.rows ?? [];
    const workingMemorySnapshot = tables.working_memory?.rows ?? [];
    const causalEdgesSnapshot = tables.causal_edges?.rows ?? [];
    const vectors = vectorRows.map((row) => ({
      rowid: Number(row.rowid),
      embedding: toBuffer(row.embedding),
    })).filter((row) => Number.isFinite(row.rowid));

    const manifest = buildCheckpointManifest();
    const snapshot: CheckpointSnapshot = {
      manifest,
      tables,
      memories,
      workingMemory: workingMemorySnapshot,
      vectors,
      causalEdges: causalEdgesSnapshot,
      timestamp: new Date().toISOString(),
    };

    const snapshotJson = JSON.stringify(snapshot);
    const compressed = zlib.gzipSync(Buffer.from(snapshotJson));
    const gitBranch = getGitBranch();
    const now = new Date().toISOString();
    const checkpointMetadata = {
      ...metadata,
      ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
      ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
      ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
      memoryCount: memories.length,
      vectorCount: vectors.length,
      includeEmbeddings,
      manifest,
    };

    const writeCheckpoint = (): CheckpointInfo => {
      let prunedSnapshotPaths: string[] = [];
      const checkpointInfo = database.transaction(() => {
        const result = (database.prepare(`
          INSERT INTO checkpoints (name, created_at, spec_folder, git_branch, memory_snapshot, metadata)
          VALUES (?, ?, ?, ?, ?, ?)
        `) as Database.Statement).run(
          name,
          now,
          specFolder,
          gitBranch,
          compressed,
          JSON.stringify(checkpointMetadata),
        );

        prunedSnapshotPaths = enforceMaxCheckpointsInTransaction(database);

        return {
          id: (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number,
          name,
          createdAt: now,
          specFolder,
          gitBranch,
          snapshotSize: compressed.length,
          metadata: {
            ...metadata,
            ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
            ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
            ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
            memoryCount: memories.length,
          },
        };
      })();
      removeCheckpointSnapshotDirs(prunedSnapshotPaths);
      return checkpointInfo;
    };

    let attempt = 0;
    try {
      const checkpointInfo = checkpointContention.withRetry(() => {
        attempt += 1;
        const checkpointInfo = writeCheckpoint();
        if (attempt > 1) {
          console.warn(`[checkpoints] createCheckpoint succeeded after ${attempt} attempts for "${name}"`);
        }
        return checkpointInfo;
      }, {
        attempts: CHECKPOINT_CREATE_MAX_ATTEMPTS,
        delayMs: checkpointRetryDelayMs,
        sync: true,
        onRetry: (_error, { attempt: retryAttempt, delayMs }) => {
        console.warn(
          `[checkpoints] createCheckpoint write busy for "${name}" on attempt ${retryAttempt}; retrying in ${delayMs}ms`,
        );
        },
      }) as CheckpointInfo;
      console.error(`[checkpoints] Created checkpoint "${name}" (${checkpointInfo.snapshotSize} bytes compressed)`);
      return checkpointInfo;
    } catch (lastError: unknown) {
      throw classifyCheckpointCreateError(lastError, {
        name,
        specFolder,
        attempts: CHECKPOINT_CREATE_MAX_ATTEMPTS,
      });
    }
  } catch (error: unknown) {
    const typedError = classifyCheckpointCreateError(error, {
      name,
      specFolder,
    });
    console.warn(`[checkpoints] createCheckpoint error: ${typedError.code}: ${typedError.message}`);
    throw typedError;
  }
}

function restoreCheckpointV2(
  database: Database.Database,
  checkpoint: CheckpointEntry,
  _scope: ScopeContext = {},
  opts: RestoreCheckpointV2Options = {},
): RestoreResult {
  const result: RestoreResult = {
    restored: 0,
    skipped: 0,
    errors: [],
    workingMemoryRestored: 0,
    partialFailure: false,
    rolledBackTables: [],
  };
  const reopen = opts.reopen ?? reopenActiveDatabase;
  let backupMainPath: string | null = null;
  let backupShardPath: string | null = null;
  let restoreJournalPath: string | null = null;
  let mainBackedUp = false;
  let shardBackedUp = false;
  let shouldRestoreVec = false;
  let liveShardPreexisted = false;

  const restoreBackups = (liveMainPath: string, liveShardPath: string | null): void => {
    removeSqliteSidecars(liveMainPath);
    if (mainBackedUp && backupMainPath && fs.existsSync(backupMainPath)) {
      fs.rmSync(liveMainPath, { force: true });
      fs.renameSync(backupMainPath, liveMainPath);
      fsyncDirectoryIfPossible(path.dirname(liveMainPath));
      mainBackedUp = false;
    }

    if (liveShardPath) {
      removeSqliteSidecars(liveShardPath);
      if (shardBackedUp && backupShardPath && fs.existsSync(backupShardPath)) {
        fs.rmSync(liveShardPath, { force: true });
        fs.renameSync(backupShardPath, liveShardPath);
        fsyncDirectoryIfPossible(path.dirname(liveShardPath));
        shardBackedUp = false;
      } else if (shouldRestoreVec && !liveShardPreexisted) {
        fs.rmSync(liveShardPath, { force: true });
        fsyncDirectoryIfPossible(path.dirname(liveShardPath));
      }
    }
  };

  acquireRestoreBarrier();
  try {
    const snapshotDir = checkpoint.snapshot_path ?? null;
    const manifest = loadCheckpointV2Manifest(snapshotDir);
    if (manifest.schemaVersion > SCHEMA_VERSION) {
      throw new CheckpointRestoreError(
        'CHECKPOINT_RESTORE_DOWNGRADE_UNSAFE',
        `Checkpoint v2 restore refused because snapshot schema version ${manifest.schemaVersion} is newer than runtime schema version ${SCHEMA_VERSION}.`,
      );
    }

    const liveMainPath = resolveMainDatabasePath(database);
    const liveShardPath = getActiveVectorShardPath(database);
    const liveCheckpointCatalogRows = readCheckpointCatalogRows(database);
    const liveEmbedderSlug = deriveEmbedderSlug(liveShardPath);
    if (manifest.embedderSlug !== null && manifest.embedderSlug !== liveEmbedderSlug) {
      throw new CheckpointRestoreError(
        'CHECKPOINT_RESTORE_EMBEDDER_MISMATCH',
        `Checkpoint v2 restore refused because snapshot embedder ${manifest.embedderSlug} does not match active embedder ${liveEmbedderSlug ?? 'none'}.`,
      );
    }

    const snapshotMainPath = path.join(snapshotDir as string, 'snapshot-main.sqlite');
    const snapshotVecPath = path.join(snapshotDir as string, 'snapshot-vec.sqlite');
    if (!fs.existsSync(snapshotMainPath)) {
      throw new CheckpointRestoreError(
        'CHECKPOINT_RESTORE_FILE_MISSING',
        'Checkpoint v2 restore failed because snapshot-main.sqlite is missing.',
      );
    }
    shouldRestoreVec = manifest.vecTables.length > 0;
    if (shouldRestoreVec) {
      // A null snapshot embedder slug means the equality guard above could not
      // verify embedder/dimension compatibility. Restoring an unverified vec
      // shard over the live one risks a dimension mismatch that corrupts
      // similarity search, so refuse rather than trust an unknown embedder.
      if (manifest.embedderSlug === null) {
        throw new CheckpointRestoreError(
          'CHECKPOINT_RESTORE_EMBEDDER_MISMATCH',
          'Checkpoint v2 restore refused because the snapshot embedder slug is unknown and the vector shard cannot be verified as compatible.',
        );
      }
      if (!liveShardPath) {
        throw new CheckpointRestoreError(
          'CHECKPOINT_RESTORE_PATH_UNRESOLVED',
          'Checkpoint v2 restore failed because the live vector shard path could not be resolved.',
        );
      }
      if (!fs.existsSync(snapshotVecPath)) {
        throw new CheckpointRestoreError(
          'CHECKPOINT_RESTORE_FILE_MISSING',
          'Checkpoint v2 restore failed because snapshot-vec.sqlite is missing.',
        );
      }
    }

    backupMainPath = `${liveMainPath}.bak`;
    backupShardPath = shouldRestoreVec && liveShardPath ? `${liveShardPath}.bak` : null;
    restoreJournalPath = getRestoreJournalPath(liveMainPath);

    const restoreJournal: RestoreJournalFile = {
      formatVersion: 1,
      phase: 'swap-pending',
      createdAt: new Date().toISOString(),
      checkpointName: checkpoint.name,
      liveMainPath,
      backupMainPath,
      snapshotMainPath,
      liveShardPath: shouldRestoreVec ? liveShardPath : null,
      backupShardPath,
      snapshotVecPath: shouldRestoreVec ? snapshotVecPath : null,
      shouldRestoreVec,
      liveShardPreexisted: false,
    };

    const swapFn = (): void => {
      // Clear any stale backups from a prior restore BEFORE writing the journal,
      // so a crash in the write window can never make boot recovery roll back
      // from a backup that does not belong to this restore.
      fs.rmSync(backupMainPath as string, { force: true });
      // Persist the stale-.bak removal before the journal records its .bak slot,
      // so a crash between here and the journal write cannot leave boot recovery
      // rolling back from a half-removed backup that does not belong to this restore.
      fsyncDirectoryIfPossible(path.dirname(liveMainPath));
      if (shouldRestoreVec && backupShardPath) {
        fs.rmSync(backupShardPath, { force: true });
        if (liveShardPath) {
          fsyncDirectoryIfPossible(path.dirname(liveShardPath));
        }
      }
      liveShardPreexisted = shouldRestoreVec && liveShardPath ? fs.existsSync(liveShardPath) : false;
      const swapPendingJournal = { ...restoreJournal, liveShardPreexisted };
      writeRestoreJournal(restoreJournalPath as string, swapPendingJournal);
      removeSqliteSidecars(liveMainPath);
      fs.renameSync(liveMainPath, backupMainPath as string);
      mainBackedUp = true;
      fsyncDirectoryIfPossible(path.dirname(liveMainPath));
      fs.copyFileSync(snapshotMainPath, liveMainPath);
      removeSqliteSidecars(liveMainPath);
      fsyncFileIfPossible(liveMainPath);
      fsyncDirectoryIfPossible(path.dirname(liveMainPath));

      if (shouldRestoreVec && liveShardPath && backupShardPath) {
        removeSqliteSidecars(liveShardPath);
        if (liveShardPreexisted) {
          fs.renameSync(liveShardPath, backupShardPath);
          shardBackedUp = true;
          fsyncDirectoryIfPossible(path.dirname(liveShardPath));
        }
        fs.copyFileSync(snapshotVecPath, liveShardPath);
        removeSqliteSidecars(liveShardPath);
        fsyncFileIfPossible(liveShardPath);
        fsyncDirectoryIfPossible(path.dirname(liveShardPath));
      }
      writeRestoreJournal(restoreJournalPath as string, { ...swapPendingJournal, phase: 'swap-done' });
    };

    let newDb: Database.Database;
    try {
      newDb = reopen(liveMainPath, swapFn);
    } catch (error: unknown) {
      // Demote the journal to swap-pending BEFORE the rollback reopen, mirroring the
      // post-swap in-process catch below. swapFn may have already written swap-done
      // (the snapshot is staged and the journal flipped) before the reopen's own
      // DB-open step threw. restoreBackups rolls back via rmSync(live) -> rename(.bak
      // -> live); a crash inside that gap while the journal still says swap-done makes
      // boot recovery DELETE the .bak instead of rolling back from it — losing both the
      // live and backup copies. Re-pinning swap-pending keeps crash and in-process
      // rollback deterministically restoring from .bak.
      if (restoreJournalPath) {
        try {
          writeRestoreJournal(restoreJournalPath, { ...restoreJournal, liveShardPreexisted });
        } catch (_demoteError: unknown) {
          // Best-effort: if the demotion write fails, the in-process rollback below still
          // restores from .bak; only the crash-vs-in-process symmetry is at risk.
        }
      }
      try {
        reopen(liveMainPath, () => {
          restoreBackups(liveMainPath, liveShardPath);
          if (restoreJournalPath) {
            clearRestoreJournal(restoreJournalPath);
          }
        });
      } catch (rollbackError: unknown) {
        result.errors.push(`Checkpoint v2 rollback failed: ${toErrorMessage(rollbackError)}`);
      }
      throw new CheckpointRestoreError(
        'CHECKPOINT_RESTORE_SWAP_FAILED',
        `Checkpoint v2 restore failed during file swap: ${toErrorMessage(error)}`,
        error,
      );
    }

    try {
      init(newDb);
      mergeCheckpointCatalogRows(newDb, liveCheckpointCatalogRows);
      pruneCheckpointCatalogRowsMissingSnapshots(newDb);
      const rebuildSummary = runPostRestoreRebuilds(newDb, null);
      if (!isDerivedRebuildComplete(rebuildSummary)) {
        try {
          writeNeedsRebuildSentinelForMainPath(liveMainPath, {
            source: 'checkpoint_restore',
            reason: 'post-restore derived rebuild did not complete',
            summary: rebuildSummary,
          });
        } catch (sentinelError: unknown) {
          console.warn(`[checkpoints] Failed to write needs-rebuild sentinel after restore (non-fatal): ${toErrorMessage(sentinelError)}`);
        }
      }
      // Report the rows actually swapped in, not the manifest's create-time
      // count, so a count drift or truncated-but-openable snapshot cannot make
      // restore claim a memory total that is not present post-swap.
      result.restored = countTableRows(newDb, 'memory_index');
      if (result.restored !== manifest.memoryCount) {
        console.warn(`[checkpoints] Restored memory_index row count ${result.restored} diverges from manifest memoryCount ${manifest.memoryCount}`);
      }
      result.workingMemoryRestored = countTableRows(newDb, 'working_memory');
      if (restoreJournalPath) {
        clearRestoreJournal(restoreJournalPath);
      }
      if (backupMainPath) {
        removeRestoreBackupIfPossible(backupMainPath);
      }
      if (backupShardPath) {
        removeRestoreBackupIfPossible(backupShardPath);
      }
      mainBackedUp = false;
      shardBackedUp = false;
      console.error(`[checkpoints] Restored v2 checkpoint "${checkpoint.name}" with ${result.restored} memories`);
    } catch (error: unknown) {
      // Demote the journal from swap-done back to swap-pending BEFORE the in-process
      // revert. Boot crash recovery rolls back ONLY while the journal is swap-pending
      // (it keeps a swap-done snapshot as committed), so without this demotion an
      // in-process failure here would revert the live DB while an identically-timed
      // crash would keep it — divergent outcomes for the same post-swap fault. Writing
      // the swap-pending journal makes both paths roll back from .bak deterministically.
      if (restoreJournalPath) {
        try {
          writeRestoreJournal(restoreJournalPath, { ...restoreJournal, liveShardPreexisted });
        } catch (_demoteError: unknown) {
          // Best-effort: if the demotion write fails, the in-process revert below still
          // restores from .bak; only the crash-vs-in-process symmetry is at risk.
        }
      }
      try {
        const rolledBackDb = reopen(liveMainPath, () => {
          restoreBackups(liveMainPath, liveShardPath);
          if (restoreJournalPath) {
            clearRestoreJournal(restoreJournalPath);
          }
        });
        init(rolledBackDb);
      } catch (rollbackError: unknown) {
        result.errors.push(`Checkpoint v2 rollback failed: ${toErrorMessage(rollbackError)}`);
      }
      throw error;
    }
  } catch (error: unknown) {
    const typedMessage = error instanceof CheckpointRestoreError
      ? `${error.code}: ${error.message}`
      : toErrorMessage(error);
    result.restored = 0;
    result.workingMemoryRestored = 0;
    result.partialFailure = true;
    result.errors.push(typedMessage);
    console.warn(`[checkpoints] restoreCheckpoint v2 error: ${typedMessage}`);
  } finally {
    releaseRestoreBarrier();
  }

  return result;
}

function listCheckpoints(
  specFolder: string | null = null,
  limit: number = 50,
  scope: ScopeContext = {},
): CheckpointInfo[] {
  const database = getDatabase();

  try {
    const folderFilter = specFolder ? 'WHERE spec_folder = ?' : '';
    const params: Array<string | number> = specFolder ? [specFolder] : [];
    params.push(limit);
    const checkpointColumns = new Set(getTableColumns(database, 'checkpoints'));
    const snapshotFormatSelect = checkpointColumns.has('snapshot_format')
      ? 'snapshot_format'
      : "'v1' AS snapshot_format";
    const snapshotPathSelect = checkpointColumns.has('snapshot_path')
      ? 'snapshot_path'
      : 'NULL AS snapshot_path';

    const rows = database.prepare(`
      SELECT id, name, created_at, spec_folder, git_branch, LENGTH(memory_snapshot) as snapshot_size, ${snapshotFormatSelect}, ${snapshotPathSelect}, metadata
      FROM checkpoints ${folderFilter}
      ORDER BY created_at DESC
      LIMIT ?
    `).all(...params) as Array<Record<string, unknown>>;

    return rows
      .filter((row) => checkpointMetadataMatchesScope(row.metadata, scope))
      .map(row => {
        const snapshotFormat = (row.snapshot_format as string | null | undefined) ?? 'v1';
        const snapshotPath = (row.snapshot_path as string | null | undefined) ?? null;
        return {
          id: row.id as number,
          name: row.name as string,
          createdAt: row.created_at as string,
          specFolder: row.spec_folder as string | null,
          gitBranch: row.git_branch as string | null,
          snapshotSize: snapshotFormat === 'v2'
            ? getCheckpointV2SnapshotSize(snapshotPath)
            : (row.snapshot_size as number) || 0,
          snapshotFormat,
          snapshotPath,
          metadata: row.metadata ? JSON.parse(row.metadata as string) : {},
        };
      });
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.warn(`[checkpoints] listCheckpoints error: ${msg}`);
    return [];
  }
}

function getCheckpoint(nameOrId: string | number, scope: ScopeContext = {}): CheckpointEntry | null {
  const database = getDatabase();

  try {
    const row = typeof nameOrId === 'number'
      ? database.prepare('SELECT * FROM checkpoints WHERE id = ?').get(nameOrId)
      : database.prepare('SELECT * FROM checkpoints WHERE name = ?').get(nameOrId);

    const checkpoint = (row as CheckpointEntry) || null;
    if (checkpoint && !checkpointMetadataMatchesScope(checkpoint.metadata, scope)) {
      return null;
    }
    return checkpoint;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.warn(`[checkpoints] getCheckpoint error: ${msg}`);
    return null;
  }
}

function restoreCheckpoint(
  nameOrId: string | number,
  clearExisting: boolean = false,
  scope: ScopeContext = {},
  opts: RestoreCheckpointV2Options = {},
): RestoreResult {
  const database = getDatabase();
  const result: RestoreResult = {
    restored: 0,
    skipped: 0,
    errors: [],
    workingMemoryRestored: 0,
    partialFailure: false,
    rolledBackTables: [],
  };

  let restoreBarrierHeld = false;
  const governanceAudits: GovernanceAuditEntry[] = [];
  const tierDowngradeAudits: TierDowngradeAuditParams[] = [];

  try {
    const checkpoint = getCheckpoint(nameOrId, scope);
    if (checkpoint?.snapshot_format === 'v2' && checkpoint.snapshot_path) {
      return restoreCheckpointV2(database, checkpoint, scope, opts);
    }

    if (!checkpoint || !checkpoint.memory_snapshot) {
      result.errors.push('Checkpoint not found or empty');
      return result;
    }

    // Decompress snapshot
    const decompressed = zlib.gunzipSync(checkpoint.memory_snapshot);
    let parsedSnapshot: unknown;
    try {
      parsedSnapshot = JSON.parse(decompressed.toString());
    } catch (parseError: unknown) {
      const message = parseError instanceof Error ? parseError.message : String(parseError);
      result.errors.push(`Invalid snapshot JSON: ${message}`);
      return result;
    }

    // Validate the snapshot envelope against
    // CheckpointSnapshotSchema before restore. Failures route into
    // `result.errors` as a single `Malformed snapshot row N: <reason>`
    // entry per failing path so callers see exactly which structural
    // expectation was violated instead of inheriting a runtime cast bug.
    const snapshotValidation = CheckpointSnapshotSchema.safeParse(parsedSnapshot);
    if (!snapshotValidation.success) {
      for (const issue of snapshotValidation.error.issues) {
        const pathStr = issue.path.length > 0 ? issue.path.join('.') : 'root';
        result.errors.push(`Malformed snapshot row ${pathStr}: ${issue.message}`);
      }
      return result;
    }
    const snapshot = snapshotValidation.data as CheckpointSnapshot;
    const tableSnapshots = getSnapshotTables(snapshot);
    const memorySnapshot = tableSnapshots.memory_index;
    const memoryRows = memorySnapshot?.rows ?? snapshot.memories;

    if (!Array.isArray(memoryRows)) {
      result.errors.push('Invalid snapshot format');
      return result;
    }

    const checkpointSpecFolder = checkpoint.spec_folder ?? null;
    const snapshotMemoryIds = getMemoryIds(memoryRows);
    const { normalizedScope } = getScopeFilterContext(database, scope);
    const currentScopedMemoryIds = checkpointSpecFolder
      ? getCurrentScopedMemoryIds(database, checkpointSpecFolder, normalizedScope)
      : getCurrentScopedMemoryIds(database, null, normalizedScope);
    const scopedMemoryIdsToReplace = Array.from(
      new Set([...currentScopedMemoryIds, ...snapshotMemoryIds])
    );
    const edgeIds = getEdgeIds(tableSnapshots.causal_edges?.rows ?? []);

    const memoryRestoreColumns = memoryRows.length > 0
      ? getMemoryRestoreColumns(database, memoryRows)
      : [];
    if (memoryRows.length > 0 && memoryRestoreColumns.length === 0) {
      result.errors.push('No compatible memory_index columns found for restore');
      return result;
    }

    // FIX: Split INSERT strategy by restore mode.
    // ClearExisting mode: INSERT OR REPLACE is safe (table was already emptied).
    // Merge mode: INSERT OR REPLACE triggers CASCADE DELETE on working_memory
    // Via the FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE.
    // Use INSERT OR IGNORE + explicit UPDATE to avoid the delete-reinsert cycle.
    const memoryInsertStmt = memoryRestoreColumns.length > 0
      ? database.prepare(`
          INSERT OR ${clearExisting ? 'REPLACE' : 'IGNORE'} INTO memory_index (${memoryRestoreColumns.join(', ')})
          VALUES (${memoryRestoreColumns.map(() => '?').join(', ')})
        `) as Database.Statement
      : null;

    const nonIdColumns = memoryRestoreColumns.filter(c => c !== 'id');
    const memoryUpdateStmt = (!clearExisting && nonIdColumns.length > 0)
      ? database.prepare(`
          UPDATE memory_index SET ${nonIdColumns.map(c => `${c} = ?`).join(', ')}
          WHERE id = ?
        `) as Database.Statement
      : null;

    // Ensure working_memory table schema is ready BEFORE the transaction.
    // DDL (CREATE TABLE, ALTER TABLE) causes SQLite to auto-commit, which would
    // Corrupt a surrounding transaction. Run DDL outside the transaction boundary.
    if (tableSnapshots.working_memory) {
      ensureWorkingMemorySchema(database);
    }

    acquireRestoreBarrier();
    restoreBarrierHeld = true;

    // Transaction-wrap checkpoint restore to prevent data loss.
    // When clearExisting=true, the DELETE and all INSERTs must be atomic.
    // If any INSERT fails after DELETE, ROLLBACK restores original data.
    // Previously, individual insert errors were silently swallowed inside
    // The transaction, allowing COMMIT after DELETE + partial inserts = data loss.
    const restoreTx = database.transaction(() => {
      if (memoryRows.length > 0) {
        for (let i = 0; i < memoryRows.length; i++) {
          try {
            validateMemoryRow(memoryRows[i], i, governanceAudits, tierDowngradeAudits);
          } catch (validationError: unknown) {
            throw new Error(`Restore validation failed: ${toErrorMessage(validationError)}`);
          }
        }
      }

      // Clear existing data if requested
      if (clearExisting) {
        try {
          clearDerivedTablesForRestore(database, {
            checkpointSpecFolder,
            memoryIds: scopedMemoryIdsToReplace,
            scope: normalizedScope,
          });
          for (const tableName of CHECKPOINT_CLEAR_ORDER) {
            if (!tableSnapshots[tableName]) {
              continue;
            }
            try {
              clearTableForRestoreScope(database, tableName, {
                checkpointSpecFolder,
                memoryIds: scopedMemoryIdsToReplace,
                edgeIds,
                scope: normalizedScope,
              });
            } catch (tableError: unknown) {
              throw new Error(`${tableName}: ${toErrorMessage(tableError)}`);
            }
          }
        } catch (error: unknown) {
          const msg = toErrorMessage(error);
          result.errors.push(`Restore clearExisting cleanup failed: ${msg}`);
          throw error;
        }
      }

      const txErrors: string[] = [];
      const rolledBackTables = new Set<string>();
      const restoredMemoryIds = new Set<number>();

      for (const memory of memoryRows) {
        try {
          // When clearExisting=false, check for duplicate logical key
          // (spec_folder + file_path + anchor_id) before inserting.
          if (!clearExisting) {
            const existingByPath = database.prepare(
              `
                SELECT id FROM memory_index
                WHERE spec_folder = ?
                  AND file_path = ?
                  AND (
                    (anchor_id IS NULL AND ? IS NULL)
                    OR anchor_id = ?
                  )
                  AND id != ?
              `
            ).get(
              memory.spec_folder,
              memory.file_path,
              memory.anchor_id ?? null,
              memory.anchor_id ?? null,
              memory.id
            ) as { id: number } | undefined;

            if (existingByPath) {
              console.error(
                `[checkpoints] Skipping restore of memory ${memory.id}: identity "${memory.spec_folder}:${memory.file_path}:${String(memory.anchor_id ?? '')}" already exists as memory ${existingByPath.id}`
              );
              result.skipped++;
              continue;
            }

            // Protect merge mode from primary-key collision overwrite.
            // If the snapshot ID already exists for a different logical identity,
            // Skip this row instead of applying UPDATE ... WHERE id = ?.
            const existingById = database.prepare(
              `
                SELECT spec_folder, file_path, anchor_id
                FROM memory_index
                WHERE id = ?
              `
            ).get(memory.id) as {
              spec_folder: string;
              file_path: string;
              anchor_id: string | null;
            } | undefined;

            if (existingById) {
              const existingAnchor = existingById.anchor_id ?? null;
              const incomingAnchor = memory.anchor_id ?? null;
              const sameIdentity = (
                existingById.spec_folder === memory.spec_folder
                && existingById.file_path === memory.file_path
                && existingAnchor === incomingAnchor
              );
              if (!sameIdentity) {
                console.error(
                  `[checkpoints] Skipping restore of memory ${memory.id}: id collision with existing identity "${existingById.spec_folder}:${existingById.file_path}:${String(existingById.anchor_id ?? '')}"`
                );
                result.skipped++;
                continue;
              }
            }
          }

          if (!memoryInsertStmt) {
            txErrors.push(`Memory ${memory.id}: restore statement unavailable`);
            result.skipped++;
            continue;
          }

          const values = memoryRestoreColumns.map((column) =>
            normalizeMemoryColumnValue(column, memory[column as keyof typeof memory])
          );
          const insertResult = memoryInsertStmt.run(...values) as { changes: number };

          // In merge mode, INSERT OR IGNORE returns changes=0 when
          // The row already exists. Follow up with an explicit UPDATE to
          // Apply the snapshot values without triggering CASCADE deletes.
          if (!clearExisting && insertResult.changes === 0 && memoryUpdateStmt) {
            const updateValues = nonIdColumns.map((column) =>
              normalizeMemoryColumnValue(column, memory[column as keyof typeof memory])
            );
            updateValues.push(memory.id); // WHERE id = ?
            memoryUpdateStmt.run(...updateValues);
          }

          restoredMemoryIds.add(memory.id as number);
          result.restored++;
        } catch (e: unknown) {
          const msg = toErrorMessage(e);
          txErrors.push(`Memory ${memory.id}: ${msg}`);
          result.skipped++;
        }
      }

      for (const tableName of CHECKPOINT_RESTORE_ORDER) {
        if (tableName === 'memory_index') {
          continue;
        }

        const tableSnapshot = tableSnapshots[tableName];
        if (!tableSnapshot) {
          continue;
        }

        try {
          let restoredCount = 0;
          // In merge mode, replace only the in-scope rows captured by the checkpoint.
          if (!clearExisting && tableSnapshot.rows.length > 0) {
            const mergeResult = restoreMergeTableAtomically(database, tableName, tableSnapshot, {
              checkpointSpecFolder,
              memoryIds: scopedMemoryIdsToReplace,
              edgeIds,
              scope: normalizedScope,
            });
            if (mergeResult.error) {
              rolledBackTables.add(tableName);
              txErrors.push(mergeResult.error);
              continue;
            }
            restoredCount = mergeResult.restoredCount;
          } else {
            restoredCount = restoreGenericTable(database, tableName, tableSnapshot);
          }
          if (tableName === 'working_memory') {
            result.workingMemoryRestored += restoredCount;
          }
        } catch (e: unknown) {
          const msg = toErrorMessage(e);
          txErrors.push(`${tableName}: ${msg}`);
        }
      }

      // When clearExisting=true, any insert error means data loss risk.
      // Throw to trigger ROLLBACK — this undoes both the DELETEs and partial INSERTs,
      // Leaving original data intact.
      if (clearExisting && txErrors.length > 0) {
        // Reset counters — ROLLBACK will undo all DB changes
        result.restored = 0;
        result.skipped = 0;
        result.workingMemoryRestored = 0;
        result.errors = txErrors;
        throw new Error(
          `Restore aborted: ${txErrors.length} error(s) during restore with clearExisting=true. ` +
          `Transaction rolled back to prevent data loss. First error: ${txErrors[0]}`
        );
      }

      // For non-clearExisting, partial failures are acceptable (no data was deleted)
      if (txErrors.length > 0) {
        result.partialFailure = true;
        result.rolledBackTables = Array.from(rolledBackTables);
        result.errors.push(...txErrors);
      }
    });

    restoreTx();
    const rebuildSummary = runPostRestoreRebuilds(database, checkpointSpecFolder);
    if (!isDerivedRebuildComplete(rebuildSummary)) {
      // Mirror the v2 path: a partial derived rebuild must leave a sentinel so a later
      // boot or repair re-runs the rebuild instead of trusting stale derived artifacts.
      try {
        writeNeedsRebuildSentinelForDatabase(database, {
          source: 'checkpoint_restore',
          reason: 'post-restore derived rebuild did not complete',
          summary: rebuildSummary,
        });
      } catch (sentinelError: unknown) {
        console.warn(`[checkpoints] Failed to write needs-rebuild sentinel after restore (non-fatal): ${toErrorMessage(sentinelError)}`);
      }
    }

    console.error(`[checkpoints] Restored ${result.restored} memories, ${result.workingMemoryRestored} working memory entries from "${checkpoint.name}"`);
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    result.errors.push(msg);
    console.warn(`[checkpoints] restoreCheckpoint error: ${msg}`);
  } finally {
    if (tierDowngradeAudits.length > 0) {
      flushTierDowngradeAudits(database, tierDowngradeAudits);
    }
    if (governanceAudits.length > 0) {
      flushGovernanceAudits(database, governanceAudits);
    }
    if (restoreBarrierHeld) {
      releaseRestoreBarrier();
    }
  }

  return result;
}

function deleteCheckpoint(nameOrId: string | number, scope: ScopeContext = {}): boolean {
  const database = getDatabase();

  try {
    const checkpoint = getCheckpoint(nameOrId, scope);
    if (!checkpoint) {
      return false;
    }

    const result = typeof nameOrId === 'number'
      ? (database.prepare('DELETE FROM checkpoints WHERE id = ?') as Database.Statement).run(nameOrId)
      : (database.prepare('DELETE FROM checkpoints WHERE name = ?') as Database.Statement).run(nameOrId);

    const deleted = (result as { changes: number }).changes > 0;
    if (deleted && checkpoint.snapshot_format === 'v2' && checkpoint.snapshot_path) {
      removeCheckpointSnapshotDirs([checkpoint.snapshot_path]);
    }
    return deleted;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.warn(`[checkpoints] deleteCheckpoint error: ${msg}`);
    return false;
  }
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
----------------------------------------------------------------*/

export {
  MAX_CHECKPOINTS,

  init,
  getDatabase,
  getGitBranch,
  isRestoreInProgress,
  getRestoreBarrierStatus,
  setRestoreBarrierHooks,
  runDerivedArtifactRebuilds,
  repairNeedsRebuildSentinel,
  getNeedsRebuildSentinelPathForDatabase,
  hasNeedsRebuildSentinel,
  writeNeedsRebuildSentinelForDatabase,
  clearNeedsRebuildSentinelForDatabase,
  validateMemoryRow,
  createCheckpoint,
  listCheckpoints,
  getCheckpoint,
  restoreCheckpoint,
  restoreCheckpointV2,
  deleteCheckpoint,
  CheckpointCreateError,
  CheckpointRestoreError,
  RESTORE_IN_PROGRESS_ERROR_CODE,
  RESTORE_IN_PROGRESS_ERROR_MESSAGE,
  // Snapshot schema exposed for direct shape testing.
  CheckpointSnapshotSchema,
};

/**
 * Re-exports related public types.
 */
export type {
  CheckpointEntry,
  CheckpointInfo,
  CheckpointCreateErrorCode,
  CheckpointRestoreErrorCode,
  CreateCheckpointOptions,
  DerivedRebuildFailure,
  DerivedRebuildSkipped,
  DerivedRebuildSummary,
  NeedsRebuildRepairResult,
  NeedsRebuildRepairOptions,
  NeedsRebuildSentinelWriteOptions,
  RunDerivedArtifactRebuildOptions,
  RestoreCheckpointV2Options,
  RestoreResult,
};
