// ────────────────────────────────────────────────────────────────
// MODULE: Memory Embedding Reconcile
// ────────────────────────────────────────────────────────────────
// One-time/idempotent maintenance that converges memory_index.embedding_status
// with active vector coverage. A row that already has both active vector
// surfaces (vec_memories_rowids + vec_<dim>) must not stay failed/pending/retry.
//
// Safety model: dry-run is the default. The active shard is resolved from
// runtime metadata only (never a caller-supplied path) and verified against the
// main active-embedder pointer before any read or mutation; requireActiveShard
// fails closed on mismatch.

import type Database from 'better-sqlite3';

/** Maintenance modes. */
export type EmbeddingReconcileMode = 'dry-run' | 'apply';

/** Arguments for memory_embedding_reconcile. Dry-run defaults across the board. */
export interface EmbeddingReconcileArgs {
  mode?: EmbeddingReconcileMode;
  /** Resolve + verify the active shard from runtime metadata (default true). */
  activeOnly?: boolean;
  /** Reset genuinely missing-vector retention failures to retry-eligible (default true). */
  resetMissing?: boolean;
  /** Which missing-vector failures may be reset. Only retention failures by default. */
  missingFailureScope?: 'retry-retention';
  /** Masked-duplicate failed rows are reconciled to success, never pruned, here. */
  maskedFailedPolicy?: 'reconcile';
  /** Non-retention provider failures are reported, not mutated, by default. */
  providerFailurePolicy?: 'report-only';
  /** Fail closed when the active shard cannot be verified (default true). */
  requireActiveShard?: boolean;
  /**
   * Also reset `success` rows that are MISSING an active vector
   * surface back to `retry` so the retry-manager re-embeds them. Default false;
   * the count is always reported under `coverage` regardless.
   */
  repairSuccessCoverage?: boolean;
}

export interface ReconcileActiveEmbedder {
  provider: string | null;
  name: string | null;
  dim: number | null;
  shard: string | null;
}

export interface ReconcileSafety {
  activeShardVerified: boolean;
  vectorPresenceSource: string;
  dimensionTableChecked: string | null;
  /** Present only when verification failed — explains why. */
  reason?: string;
}

export interface ReconcileStatusSplit {
  failed: number;
  pending: number;
  retry: number;
}

export interface ReconcileBuckets {
  vector_present_status_stale: { count: number; byStatus: ReconcileStatusSplit };
  missing_active_vector_retry_eligible: { count: number };
  missing_active_vector_provider_failure: { count: number };
  failed_masked_by_newer_latest_path_anchor_row: {
    count: number;
    overlapsBucket: string;
    policy: string;
  };
}

export interface ReconcilePlannedMutation {
  name: string;
  rows: number;
}

export interface ReconcileApplied {
  reconciledToSuccess: number;
  resetToRetry: number;
  /** Success rows missing a vector that were reset to retry for re-embedding. */
  successCoverageReset?: number;
}

/** Success-rows-missing-active-vector coverage diagnostic. */
export interface ReconcileCoverage {
  successMissingActiveVector: number;
}

export interface EmbeddingReconcileResult {
  mode: EmbeddingReconcileMode;
  activeEmbedder: ReconcileActiveEmbedder;
  safety: ReconcileSafety;
  buckets: ReconcileBuckets;
  plannedMutations: ReconcilePlannedMutation[];
  applied?: ReconcileApplied;
  /** Success-coverage diagnostic; present once the active shard is verified. */
  coverage?: ReconcileCoverage;
  durationMs: number;
}

/** Raised when requireActiveShard is set but the active shard cannot be verified. */
export class ActiveShardGuardError extends Error {
  readonly code = 'E_ACTIVE_SHARD_UNVERIFIED';
  constructor(reason: string) {
    super(`Active vector shard could not be verified: ${reason}`);
    this.name = 'ActiveShardGuardError';
  }
}

const ACTIVE_SCHEMA = 'active_vec';
const EMPTY_SPLIT: ReconcileStatusSplit = { failed: 0, pending: 0, retry: 0 };

function hasTable(database: Database.Database, schema: string, table: string): boolean {
  const row = database
    .prepare(`SELECT 1 AS present FROM ${schema}.sqlite_master WHERE type = 'table' AND name = ? LIMIT 1`)
    .get(table) as { present?: number } | undefined;
  return row?.present === 1;
}

function metadataMap(database: Database.Database, schema: string): Map<string, string> {
  const map = new Map<string, string>();
  if (!hasTable(database, schema, 'vec_metadata')) {
    return map;
  }
  const rows = database.prepare(`SELECT key, value FROM ${schema}.vec_metadata`).all() as Array<{ key: string; value: string }>;
  for (const row of rows) {
    map.set(row.key, row.value);
  }
  return map;
}

function readActiveEmbedder(database: Database.Database): { name: string | null; dim: number | null; provider: string | null } {
  const meta = metadataMap(database, 'main');
  const name = meta.get('active_embedder_name') ?? null;
  const rawDim = meta.get('active_embedder_dim');
  const dim = rawDim != null && /^[0-9]+$/.test(rawDim) ? Number.parseInt(rawDim, 10) : null;
  const rawProvider = meta.get('active_embedder_provider');
  const provider = rawProvider != null && rawProvider.trim().length > 0 ? rawProvider : null;
  return { name, dim, provider };
}

function attachedActiveVecPath(database: Database.Database): string | null {
  const rows = database.pragma('database_list') as Array<{ seq: number; name: string; file: string }>;
  const entry = rows.find((row) => row.name === ACTIVE_SCHEMA);
  return entry ? (entry.file || null) : null;
}

interface ShardVerification {
  verified: boolean;
  reason?: string;
  dimTable: string | null;
  shardPath: string | null;
}

/**
 * Verify the attached active_vec shard matches the runtime active-embedder
 * pointer (name + dim + provider) and exposes the expected dimension table.
 */
function verifyActiveShard(
  database: Database.Database,
  active: { name: string | null; dim: number | null; provider: string | null },
): ShardVerification {
  const shardPath = attachedActiveVecPath(database);
  if (!shardPath) {
    return { verified: false, reason: 'active_vec shard not attached', dimTable: null, shardPath: null };
  }
  if (active.name == null || active.dim == null) {
    return { verified: false, reason: 'main active-embedder pointer incomplete', dimTable: null, shardPath };
  }

  const shard = metadataMap(database, ACTIVE_SCHEMA);
  const shardName = shard.get('model') ?? shard.get('embedding_model') ?? null;
  const rawShardDim = shard.get('dim') ?? shard.get('embedding_dim') ?? null;
  const shardDim = rawShardDim != null && /^[0-9]+$/.test(rawShardDim) ? Number.parseInt(rawShardDim, 10) : null;
  const shardProvider = shard.get('provider') ?? null;

  if (shardName !== active.name) {
    return { verified: false, reason: `shard model '${shardName}' != active '${active.name}'`, dimTable: null, shardPath };
  }
  if (shardDim !== active.dim) {
    return { verified: false, reason: `shard dim ${shardDim} != active ${active.dim}`, dimTable: null, shardPath };
  }
  if (active.provider != null && shardProvider != null && active.provider !== shardProvider) {
    return { verified: false, reason: `shard provider '${shardProvider}' != active '${active.provider}'`, dimTable: null, shardPath };
  }

  const dimTable = `vec_${active.dim}`;
  if (!hasTable(database, ACTIVE_SCHEMA, dimTable) || !hasTable(database, ACTIVE_SCHEMA, 'vec_memories_rowids')) {
    return { verified: false, reason: `active shard missing ${dimTable}/vec_memories_rowids`, dimTable: null, shardPath };
  }
  return { verified: true, dimTable, shardPath };
}

function emptyBuckets(): ReconcileBuckets {
  return {
    vector_present_status_stale: { count: 0, byStatus: { ...EMPTY_SPLIT } },
    missing_active_vector_retry_eligible: { count: 0 },
    missing_active_vector_provider_failure: { count: 0 },
    failed_masked_by_newer_latest_path_anchor_row: { count: 0, overlapsBucket: 'vector_present_status_stale', policy: 'reconcile' },
  };
}

/**
 * Count the four dry-run buckets. `dimTable` is a validated `vec_<int>` name
 * (interpolated only after the dim is confirmed to be a positive integer and
 * the table exists), so interpolation here is safe.
 */
function computeBuckets(database: Database.Database, dimTable: string): ReconcileBuckets {
  const presentPredicate = `
    EXISTS (SELECT 1 FROM ${ACTIVE_SCHEMA}.vec_memories_rowids r WHERE r.rowid = m.id)
    AND EXISTS (SELECT 1 FROM ${ACTIVE_SCHEMA}.${dimTable} v WHERE v.id = m.id)`;
  const missingPredicate = `
    NOT EXISTS (SELECT 1 FROM ${ACTIVE_SCHEMA}.vec_memories_rowids r WHERE r.rowid = m.id)
    OR NOT EXISTS (SELECT 1 FROM ${ACTIVE_SCHEMA}.${dimTable} v WHERE v.id = m.id)`;

  const staleRows = database.prepare(`
    SELECT m.embedding_status AS status, COUNT(*) AS n
    FROM memory_index m
    WHERE m.embedding_status IN ('failed', 'pending', 'retry')
      AND (${presentPredicate})
    GROUP BY m.embedding_status
  `).all() as Array<{ status: string; n: number }>;

  const byStatus: ReconcileStatusSplit = { ...EMPTY_SPLIT };
  for (const row of staleRows) {
    if (row.status === 'failed') byStatus.failed = row.n;
    else if (row.status === 'pending') byStatus.pending = row.n;
    else if (row.status === 'retry') byStatus.retry = row.n;
  }
  const staleCount = byStatus.failed + byStatus.pending + byStatus.retry;

  // Only genuinely-parked retention FAILURES missing a vector need reset to
  // retry. Already-pending/retry rows are queued for the daemon and are left
  // alone — counting them would overstate plannedMutations and break
  // idempotency (a second apply would clobber their retry_count). "Missing" =
  // either surface absent (OR), keeping this complementary with the
  // vector-present update (which requires BOTH surfaces). Matches the apply
  // UPDATE exactly so plannedMutations is accurate and a re-run is a no-op.
  const retryEligible = (database.prepare(`
    SELECT COUNT(*) AS n FROM memory_index m
    WHERE m.embedding_status = 'failed'
      AND m.failure_reason LIKE 'Retry retention%'
      AND (${missingPredicate})
  `).get() as { n: number }).n;

  const providerFailure = (database.prepare(`
    SELECT COUNT(*) AS n FROM memory_index m
    WHERE m.embedding_status = 'failed'
      AND (${missingPredicate})
      AND (m.failure_reason IS NULL OR m.failure_reason NOT LIKE 'Retry retention%')
  `).get() as { n: number }).n;

  const masked = (database.prepare(`
    WITH latest AS (
      SELECT COALESCE(canonical_file_path, file_path) AS canonical_path,
             COALESCE(anchor_id, '') AS anchor_key,
             MAX(id) AS latest_id
      FROM memory_index
      GROUP BY COALESCE(canonical_file_path, file_path), COALESCE(anchor_id, '')
    )
    SELECT COUNT(*) AS n FROM memory_index m
    JOIN latest ON latest.canonical_path = COALESCE(m.canonical_file_path, m.file_path)
              AND latest.anchor_key = COALESCE(m.anchor_id, '')
    WHERE m.embedding_status = 'failed' AND m.id <> latest.latest_id
  `).get() as { n: number }).n;

  return {
    vector_present_status_stale: { count: staleCount, byStatus },
    missing_active_vector_retry_eligible: { count: retryEligible },
    missing_active_vector_provider_failure: { count: providerFailure },
    failed_masked_by_newer_latest_path_anchor_row: { count: masked, overlapsBucket: 'vector_present_status_stale', policy: 'reconcile' },
  };
}

/**
 * Count `success` rows MISSING an active vector surface — the
 * inverse hazard of status-stale rows. `dimTable` is a validated `vec_<int>`
 * name, so interpolation is safe.
 */
function computeSuccessCoverage(database: Database.Database, dimTable: string): number {
  return (database.prepare(`
    SELECT COUNT(*) AS n FROM memory_index m
    WHERE m.embedding_status = 'success'
      AND (
        NOT EXISTS (SELECT 1 FROM ${ACTIVE_SCHEMA}.vec_memories_rowids r WHERE r.rowid = m.id)
        OR NOT EXISTS (SELECT 1 FROM ${ACTIVE_SCHEMA}.${dimTable} v WHERE v.id = m.id)
      )
  `).get() as { n: number }).n;
}

/**
 * Reconcile memory_index.embedding_status against active vector coverage.
 * Assumes the active shard is attached as `active_vec` (the runtime attaches it
 * during initialization; tests attach it explicitly).
 */
export function runMemoryEmbeddingReconcile(
  database: Database.Database,
  args: EmbeddingReconcileArgs = {},
): EmbeddingReconcileResult {
  const startTime = Date.now();
  const mode: EmbeddingReconcileMode = args.mode === 'apply' ? 'apply' : 'dry-run';
  const resetMissing = args.resetMissing !== false;
  const requireActiveShard = args.requireActiveShard !== false;
  const repairSuccessCoverage = args.repairSuccessCoverage === true;

  const active = readActiveEmbedder(database);

  if (!hasTable(database, 'main', 'memory_index')) {
    return {
      mode,
      activeEmbedder: { provider: active.provider, name: active.name, dim: active.dim, shard: null },
      safety: { activeShardVerified: false, vectorPresenceSource: 'vec_memories_rowids', dimensionTableChecked: null, reason: 'memory_index table missing' },
      buckets: emptyBuckets(),
      plannedMutations: [
        { name: 'reconcile_vector_present_to_success', rows: 0 },
        { name: 'reset_missing_active_vector_to_retry_eligible', rows: 0 },
      ],
      applied: mode === 'apply' ? { reconciledToSuccess: 0, resetToRetry: 0 } : undefined,
      durationMs: Date.now() - startTime,
    };
  }

  const verification = verifyActiveShard(database, active);
  const activeEmbedder: ReconcileActiveEmbedder = {
    provider: active.provider,
    name: active.name,
    dim: active.dim,
    shard: verification.shardPath,
  };
  const safety: ReconcileSafety = {
    activeShardVerified: verification.verified,
    vectorPresenceSource: 'vec_memories_rowids',
    dimensionTableChecked: verification.dimTable,
    ...(verification.verified ? {} : { reason: verification.reason }),
  };

  if (!verification.verified || verification.dimTable == null) {
    if (requireActiveShard && mode === 'apply') {
      throw new ActiveShardGuardError(verification.reason ?? 'unknown');
    }
    // Dry-run (or apply with requireActiveShard disabled): fail closed to zero work.
    return {
      mode,
      activeEmbedder,
      safety,
      buckets: emptyBuckets(),
      plannedMutations: [
        { name: 'reconcile_vector_present_to_success', rows: 0 },
        { name: 'reset_missing_active_vector_to_retry_eligible', rows: 0 },
      ],
      applied: mode === 'apply' ? { reconciledToSuccess: 0, resetToRetry: 0 } : undefined,
      durationMs: Date.now() - startTime,
    };
  }

  const dimTable = verification.dimTable;
  const buckets = computeBuckets(database, dimTable);
  const coverage: ReconcileCoverage = { successMissingActiveVector: computeSuccessCoverage(database, dimTable) };
  const plannedMutations: ReconcilePlannedMutation[] = [
    { name: 'reconcile_vector_present_to_success', rows: buckets.vector_present_status_stale.count },
    { name: 'reset_missing_active_vector_to_retry_eligible', rows: resetMissing ? buckets.missing_active_vector_retry_eligible.count : 0 },
  ];
  if (repairSuccessCoverage) {
    plannedMutations.push({ name: 'repair_success_missing_active_vector_to_retry', rows: coverage.successMissingActiveVector });
  }

  if (mode === 'dry-run') {
    return { mode, activeEmbedder, safety, buckets, plannedMutations, coverage, durationMs: Date.now() - startTime };
  }

  // ── Apply: one BEGIN IMMEDIATE transaction, reconcile-before-reset (F2). ──
  // .immediate() takes the write lock at BEGIN so a concurrent daemon writer
  // cannot trigger a mid-transaction lock-upgrade failure (NFR-P02).
  const applied: ReconcileApplied = { reconciledToSuccess: 0, resetToRetry: 0 };
  const reconcileTx = database.transaction(() => {
    const reconcile = database.prepare(`
      UPDATE memory_index
      SET embedding_status = 'success',
          embedding_generated_at = COALESCE(embedding_generated_at, CURRENT_TIMESTAMP),
          failure_reason = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE embedding_status IN ('failed', 'pending', 'retry')
        AND EXISTS (SELECT 1 FROM ${ACTIVE_SCHEMA}.vec_memories_rowids r WHERE r.rowid = memory_index.id)
        AND EXISTS (SELECT 1 FROM ${ACTIVE_SCHEMA}.${dimTable} v WHERE v.id = memory_index.id)
    `).run();
    applied.reconciledToSuccess = reconcile.changes;

    if (resetMissing) {
      // Reset only parked retention FAILURES missing a vector surface back to
      // retry. failed -> retry makes this idempotent (a second apply finds no
      // matching 'failed' rows) and never touches already-queued pending/retry
      // rows' retry_count. Missing = either surface absent (OR), matching the
      // retryEligible bucket above.
      const reset = database.prepare(`
        UPDATE memory_index
        SET embedding_status = 'retry',
            retry_count = 0,
            last_retry_at = NULL,
            failure_reason = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE embedding_status = 'failed'
          AND failure_reason LIKE 'Retry retention%'
          AND (
            NOT EXISTS (SELECT 1 FROM ${ACTIVE_SCHEMA}.vec_memories_rowids r WHERE r.rowid = memory_index.id)
            OR NOT EXISTS (SELECT 1 FROM ${ACTIVE_SCHEMA}.${dimTable} v WHERE v.id = memory_index.id)
          )
      `).run();
      applied.resetToRetry = reset.changes;
    }

    if (repairSuccessCoverage) {
      const repair = database.prepare(`
        UPDATE memory_index
        SET embedding_status = 'retry',
            retry_count = 0,
            last_retry_at = NULL,
            failure_reason = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE embedding_status = 'success'
          AND (
            NOT EXISTS (SELECT 1 FROM ${ACTIVE_SCHEMA}.vec_memories_rowids r WHERE r.rowid = memory_index.id)
            OR NOT EXISTS (SELECT 1 FROM ${ACTIVE_SCHEMA}.${dimTable} v WHERE v.id = memory_index.id)
          )
      `).run();
      applied.successCoverageReset = repair.changes;
    }
  });
  reconcileTx.immediate();

  // Recompute buckets + coverage post-apply so the response reflects the converged state.
  const postBuckets = computeBuckets(database, dimTable);
  const postCoverage: ReconcileCoverage = { successMissingActiveVector: computeSuccessCoverage(database, dimTable) };
  return {
    mode,
    activeEmbedder,
    safety,
    buckets: postBuckets,
    plannedMutations,
    applied,
    coverage: postCoverage,
    durationMs: Date.now() - startTime,
  };
}
