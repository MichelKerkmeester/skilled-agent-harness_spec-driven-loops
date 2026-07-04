// ───────────────────────────────────────────────────────────────
// MODULE: Memory Retention Sweep
// ───────────────────────────────────────────────────────────────
// Enforces governed memory_index.delete_after metadata.
import * as vectorIndex from '../search/vector-index.js';
import * as mutationLedger from '../storage/mutation-ledger.js';
import { init as initHistory, recordHistory } from '../storage/history.js';
import { BetterSqliteMaintenance, type MaintenanceOperation } from '../storage/ports/index.js';
import { recordGovernanceAudit } from './scope-governance.js';
import { aggregateEvents } from '../feedback/batch-learning.js';
import type { AggregatedSignal } from '../feedback/batch-learning.js';
import {
  evaluateFeedbackRetention,
  isFeedbackRetentionLearningEnabled,
  recordFeedbackRetentionAudit,
  resolveFeedbackRetentionMode,
  revalidateSpareOnlyRetention,
} from '../feedback/feedback-retention-reducer.js';
import { isRetentionForgettingEnabled } from '../search/search-flags.js';
import type {
  FeedbackRetentionDecisionResult,
  FeedbackRetentionMode,
} from '../feedback/feedback-retention-reducer.js';

import type Database from 'better-sqlite3';

const DEFAULT_RETENTION_FEEDBACK_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

/** Options for a governed memory retention sweep. */
export interface MemoryRetentionSweepArgs {
  dryRun?: boolean;
  feedbackRetention?: FeedbackRetentionSweepArgs;
  beforeApply?: () => void;
}

/** Options for the feedback-aware retention learning branch. */
export interface FeedbackRetentionSweepArgs {
  runAt?: number;
  windowMs?: number;
  extendDays?: number;
  shadowEvaluationPassed?: boolean;
  signals?: AggregatedSignal[];
}

/**
 * Expired memory_index row selected for retention deletion.
 *
 * Beyond `delete_after`, the row carries tier and usage metadata so the
 * destructive delete decision can protect high-tier and pinned records:
 * deletion must never be driven by TTL expiry alone.
 */
export interface RetentionExpiredRow {
  id: number;
  specFolder: string | null;
  filePath: string | null;
  contentHash: string | null;
  tenantId: string | null;
  userId: string | null;
  agentId: string | null;
  sessionId: string | null;
  deleteAfter: string;
  importanceTier: string | null;
  importanceWeight: number | null;
  qualityScore: number | null;
  retentionTrustScore: number | null;
  decayHalfLifeDays: number | null;
  isPinned: number | null;
  accessCount: number | null;
  lastAccessed: string | number | null;
  createdAt: string | null;
  deletedAt: string | null;
}

/** Aggregate sweep counts returned to callers and audit logs. */
export interface MemoryRetentionSweepSummary {
  swept: number;
  retained: number;
  protectedCount: number;
  dryRun: boolean;
  durationMs: number;
}

/** Physical residue disclosure for rows removed by a sweep. */
export interface MemoryResidualRetentionReport {
  dead_row_slots: {
    affectedRows: number;
    mayRetainBytesUntil: 'sqlite_page_reuse_or_vacuum';
  };
  wal: {
    affectedRows: number;
    mayRetainBytesUntil: 'wal_checkpoint_truncate';
    checkpointAttempted: boolean;
  };
  vector_tombstones: {
    affectedRows: number;
    mayRetainBytesUntil: 'vector_index_compaction';
  };
  persistent_deny_list: 'not_created';
}

/** Full sweep result including candidates, deletions, and ledger state. */
export interface MemoryRetentionSweepResult extends MemoryRetentionSweepSummary {
  candidates: RetentionExpiredRow[];
  deletedIds: number[];
  protectedIds: number[];
  extendedIds?: number[];
  ledgerRecorded: boolean | null;
  residual_retention: MemoryResidualRetentionReport;
  feedbackRetention?: FeedbackRetentionSweepReport;
  tombstoneState: {
    usesPurgeablePartition: boolean;
    usingPurgeableIndex: boolean;
    candidateCount: number;
    deletedCount: number;
  };
  edgeState: {
    causalEdgesTablePresent: boolean;
    candidateEdgeCount: number;
  };
}

/** Feedback-retention learning summary included only when the feature is enabled. */
export interface FeedbackRetentionSweepReport {
  mode: FeedbackRetentionMode;
  activeGatePassed: boolean;
  activeBlocked: boolean;
  auditCount: number;
  decisions: FeedbackRetentionDecisionResult[];
  extendedIds: number[];
  protectedIds: number[];
  deletedIds: number[];
}

function hasTable(database: Database.Database, tableName: string): boolean {
  const row = database.prepare(
    "SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1"
  ).get(tableName) as { present?: number } | undefined;
  return row?.present === 1;
}

function hasIndex(database: Database.Database, indexName: string): boolean {
  const row = database.prepare(
    "SELECT 1 AS present FROM sqlite_master WHERE type = 'index' AND name = ? LIMIT 1"
  ).get(indexName) as { present?: number } | undefined;
  return row?.present === 1;
}

/**
 * Tier/usage columns may be absent on legacy databases that predate the
 * corresponding migrations. Missing columns are selected as NULL so the
 * protection decision degrades conservatively instead of crashing the sweep.
 */
const OPTIONAL_RETENTION_COLUMNS: ReadonlyArray<{ column: string; alias: string }> = [
  { column: 'importance_tier', alias: 'importanceTier' },
  { column: 'importance_weight', alias: 'importanceWeight' },
  { column: 'quality_score', alias: 'qualityScore' },
  { column: 'retention_trust_score', alias: 'retentionTrustScore' },
  { column: 'decay_half_life_days', alias: 'decayHalfLifeDays' },
  { column: 'is_pinned', alias: 'isPinned' },
  { column: 'access_count', alias: 'accessCount' },
  { column: 'last_accessed', alias: 'lastAccessed' },
  { column: 'created_at', alias: 'createdAt' },
];

function isSoftDeleteTombstonesEnabled(): boolean {
  return process.env.SPECKIT_SOFT_DELETE_TOMBSTONES?.trim().toLowerCase() === 'true';
}

function selectExpiredRows(database: Database.Database, useSoftDeleteTombstones: boolean): RetentionExpiredRow[] {
  const presentColumns = new Set(
    (database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>)
      .map((row) => row.name),
  );
  const hasDeletedAt = presentColumns.has('deleted_at');
  const usePurgeableIndex = useSoftDeleteTombstones && hasDeletedAt && hasIndex(database, 'idx_memory_purgeable_retention');
  const memoryIndexSource = usePurgeableIndex
    ? 'memory_index INDEXED BY idx_memory_purgeable_retention'
    : 'memory_index';
  const deletedAtSelect = hasDeletedAt ? 'deleted_at AS deletedAt' : 'NULL AS deletedAt';
  const tombstonePredicate = useSoftDeleteTombstones && hasDeletedAt ? 'AND deleted_at IS NOT NULL' : '';
  const optionalSelects = OPTIONAL_RETENTION_COLUMNS
    .map(({ column, alias }) => (presentColumns.has(column)
      ? `${column} AS ${alias}`
      : `NULL AS ${alias}`))
    .join(',\n      ');

  return database.prepare(`
    SELECT
      id,
      spec_folder AS specFolder,
      file_path AS filePath,
      content_hash AS contentHash,
      tenant_id AS tenantId,
      user_id AS userId,
      agent_id AS agentId,
      session_id AS sessionId,
      delete_after AS deleteAfter,
      ${deletedAtSelect},
      ${optionalSelects}
    FROM ${memoryIndexSource}
    WHERE delete_after IS NOT NULL
      ${tombstonePredicate}
      AND datetime(delete_after) < datetime('now')
    ORDER BY datetime(delete_after) ASC, id ASC
  `).all() as RetentionExpiredRow[];
}

/** Importance tiers that must never be deleted on TTL expiry alone. */
const PROTECTED_RETENTION_TIERS = new Set(['constitutional', 'critical']);
const RETENTION_LIVE_INCOMING_RELATIONS = [
  'derived_from',
  'supports',
  'depends_on',
  'relates_to',
  'has_failure',
  'mentions',
] as const;

/**
 * Tier-aware deletion decision evaluated BEFORE the destructive delete path.
 * Constitutional/critical tiers and pinned rows are protected from TTL-only
 * deletion; a null or unknown tier falls back to the pre-existing behavior
 * (unprotected rows keep deleting) so legacy rows are handled without crashes.
 */
function isProtectedFromRetentionDelete(row: RetentionExpiredRow): boolean {
  const tier = typeof row.importanceTier === 'string'
    ? row.importanceTier.trim().toLowerCase()
    : null;
  if (tier !== null && PROTECTED_RETENTION_TIERS.has(tier)) {
    return true;
  }
  return row.isPinned != null && Number(row.isPinned) !== 0;
}

function getTableColumns(database: Database.Database, tableName: string): Set<string> {
  if (!hasTable(database, tableName)) {
    return new Set();
  }
  return new Set(
    (database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>)
      .map((row) => row.name),
  );
}

function hasLiveIncomingRetentionEdge(database: Database.Database, memoryId: number): boolean {
  if (!isRetentionForgettingEnabled() || !hasTable(database, 'causal_edges')) {
    return false;
  }
  const columns = getTableColumns(database, 'causal_edges');
  if (!columns.has('target_id') || !columns.has('relation')) {
    return false;
  }
  const placeholders = RETENTION_LIVE_INCOMING_RELATIONS.map(() => '?').join(', ');
  const invalidAtPredicate = columns.has('invalid_at')
    ? "AND (invalid_at IS NULL OR trim(cast(invalid_at AS text)) = '')"
    : '';
  const row = database.prepare(`
    SELECT 1 AS present
    FROM causal_edges
    WHERE target_id = ?
      AND lower(relation) IN (${placeholders})
      ${invalidAtPredicate}
    LIMIT 1
  `).get(String(memoryId), ...RETENTION_LIVE_INCOMING_RELATIONS) as { present?: number } | undefined;
  return row?.present === 1;
}

/**
 * Tier protection can only be evaluated when importance_tier is readable. On a
 * legacy memory_index that predates the tier migration the column aliases to
 * NULL, making a constitutional/critical row indistinguishable from a genuinely
 * unprotected one, so the sweep must fail closed (treat the row as protected)
 * rather than delete a row whose tier is unknown. is_pinned is intentionally not
 * required here: when that column is absent no row can ever have carried a pin,
 * so reading "not pinned" is accurate rather than unreadable.
 */
function retentionTierColumnReadable(database: Database.Database): boolean {
  return getTableColumns(database, 'memory_index').has('importance_tier');
}

function getRetentionProtectionReason(database: Database.Database, row: RetentionExpiredRow): string | null {
  if (!retentionTierColumnReadable(database)) {
    return 'retention_protection_columns_absent';
  }
  if (isProtectedFromRetentionDelete(row)) {
    return 'retention_tier_protected';
  }
  if (hasLiveIncomingRetentionEdge(database, row.id)) {
    return 'retention_live_edge_protected';
  }
  return null;
}

// Re-validate inside the delete transaction: a concurrent writer can raise or
// clear delete_after between candidate selection and deletion, so a row that is
// no longer expired must not be swept. Mirrors the selectExpiredRows predicate.
function getCurrentExpiredRow(
  database: Database.Database,
  id: number,
  useSoftDeleteTombstones = isSoftDeleteTombstonesEnabled(),
): RetentionExpiredRow | null {
  const presentColumns = new Set(
    (database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>)
      .map((row) => row.name),
  );
  const deletedAtSelect = presentColumns.has('deleted_at') ? 'deleted_at AS deletedAt' : 'NULL AS deletedAt';
  const tombstonePredicate = useSoftDeleteTombstones && presentColumns.has('deleted_at') ? 'AND deleted_at IS NOT NULL' : '';
  const optionalSelects = OPTIONAL_RETENTION_COLUMNS
    .map(({ column, alias }) => (presentColumns.has(column)
      ? `${column} AS ${alias}`
      : `NULL AS ${alias}`))
    .join(',\n      ');
  const row = database.prepare(`
    SELECT
      id,
      spec_folder AS specFolder,
      file_path AS filePath,
      content_hash AS contentHash,
      tenant_id AS tenantId,
      user_id AS userId,
      agent_id AS agentId,
      session_id AS sessionId,
      delete_after AS deleteAfter,
      ${deletedAtSelect},
      ${optionalSelects}
    FROM memory_index
    WHERE id = ?
      AND delete_after IS NOT NULL
      ${tombstonePredicate}
      AND datetime(delete_after) < datetime('now')
    LIMIT 1
  `).get(id) as RetentionExpiredRow | undefined;
  return row ?? null;
}

function isStillExpired(database: Database.Database, id: number, useSoftDeleteTombstones = isSoftDeleteTombstonesEnabled()): boolean {
  return getCurrentExpiredRow(database, id, useSoftDeleteTombstones) !== null;
}

/** Test-only surface for retention guards. */
export const __retentionSweepTestables = { getCurrentExpiredRow, isStillExpired, hasLiveIncomingRetentionEdge };

function countRows(database: Database.Database): number {
  const row = database.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count: number };
  return row.count;
}

function buildTombstoneState(
  database: Database.Database,
  candidateCount: number,
  deletedCount: number,
  useSoftDeleteTombstones = isSoftDeleteTombstonesEnabled(),
): MemoryRetentionSweepResult['tombstoneState'] {
  const columns = new Set(
    (database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>)
      .map((row) => row.name),
  );
  const usesPurgeablePartition = useSoftDeleteTombstones && columns.has('deleted_at');
  return {
    usesPurgeablePartition,
    usingPurgeableIndex: usesPurgeablePartition && hasIndex(database, 'idx_memory_purgeable_retention'),
    candidateCount,
    deletedCount,
  };
}

function buildEdgeState(
  database: Database.Database,
  candidates: RetentionExpiredRow[],
): MemoryRetentionSweepResult['edgeState'] {
  if (!hasTable(database, 'causal_edges') || candidates.length === 0) {
    return { causalEdgesTablePresent: hasTable(database, 'causal_edges'), candidateEdgeCount: 0 };
  }
  const ids = candidates.map((candidate) => String(candidate.id));
  const placeholders = ids.map(() => '?').join(', ');
  const row = database.prepare(`
    SELECT COUNT(*) AS count
    FROM causal_edges
    WHERE source_id IN (${placeholders}) OR target_id IN (${placeholders})
  `).get(...ids, ...ids) as { count: number };
  return { causalEdgesTablePresent: true, candidateEdgeCount: row.count };
}

function buildResidualRetentionReport(
  deletedCount: number,
  checkpointAttempted: boolean,
): MemoryResidualRetentionReport {
  return {
    dead_row_slots: {
      affectedRows: deletedCount,
      mayRetainBytesUntil: 'sqlite_page_reuse_or_vacuum',
    },
    wal: {
      affectedRows: deletedCount,
      mayRetainBytesUntil: 'wal_checkpoint_truncate',
      checkpointAttempted,
    },
    vector_tombstones: {
      affectedRows: deletedCount,
      mayRetainBytesUntil: 'vector_index_compaction',
    },
    persistent_deny_list: 'not_created',
  };
}

function buildFeedbackRetentionReport(
  database: Database.Database,
  candidates: RetentionExpiredRow[],
  dryRun: boolean,
  args: FeedbackRetentionSweepArgs = {},
): FeedbackRetentionSweepReport {
  const mode = resolveFeedbackRetentionMode();
  const activeGatePassed = mode === 'active' && args.shadowEvaluationPassed === true;
  // Dry-run previews must evaluate the SAME real signal window the apply
  // path would see — aggregation is a pure read, and an empty-signal preview
  // told operators nothing about what apply would actually do. The audit
  // write path stays unreachable in dry-run (the sweep returns before it).
  const signals = args.signals ?? aggregateEvents(
    database,
    (args.runAt ?? Date.now()) - (args.windowMs ?? DEFAULT_RETENTION_FEEDBACK_WINDOW_MS),
    args.runAt ?? Date.now(),
  );
  const evaluation = evaluateFeedbackRetention(candidates, signals, {
    runAt: args.runAt,
    extendDays: args.extendDays,
  });

  return {
    mode,
    activeGatePassed,
    activeBlocked: mode === 'active' && !activeGatePassed,
    auditCount: 0,
    decisions: evaluation.decisions,
    extendedIds: [],
    protectedIds: evaluation.decisions
      .filter((decision) => decision.decision === 'protect')
      .map((decision) => decision.memoryId),
    deletedIds: [],
  };
}

function recordFeedbackRetentionAudits(
  database: Database.Database,
  candidates: RetentionExpiredRow[],
  report: FeedbackRetentionSweepReport,
  applied: boolean,
): number {
  const rowsById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  let auditCount = 0;
  for (const decision of report.decisions) {
    const row = rowsById.get(decision.memoryId);
    if (!row) continue;
    recordFeedbackRetentionAudit(database, row, decision, {
      mode: report.mode,
      applied,
      activeGatePassed: report.activeGatePassed,
    });
    auditCount += 1;
  }
  return auditCount;
}

function appendRetentionLedger(
  database: Database.Database,
  deletedIds: number[],
  candidates: RetentionExpiredRow[],
): boolean {
  try {
    mutationLedger.initLedger(database);
    mutationLedger.appendEntry(database, {
      mutation_type: 'delete',
      reason: `memory_retention_sweep: retention_expired ${deletedIds.length} memory row(s)`,
      prior_hash: null,
      new_hash: mutationLedger.computeHash(`retention-sweep:${deletedIds.join(',')}:${Date.now()}`),
      linked_memory_ids: deletedIds.slice(0, 50),
      decision_meta: {
        tool: 'memory_retention_sweep',
        reason: 'retention_expired',
        totalDeleted: deletedIds.length,
        originalDeleteAfter: candidates
          .filter((candidate) => deletedIds.includes(candidate.id))
          .map((candidate) => ({ id: candidate.id, deleteAfter: candidate.deleteAfter })),
      },
      actor: 'mcp:memory_retention_sweep',
    });
    return true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[memory-retention-sweep] mutation ledger append failed: ${message}`);
    return false;
  }
}

function runPostDeleteMaintenance(database: Database.Database): void {
  try {
    database.prepare("INSERT INTO memory_fts(memory_fts) VALUES('optimize')").run();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[memory-retention-sweep] FTS optimize skipped: ${message}`);
  }

  const maintenance = new BetterSqliteMaintenance(database, {
    onMaintenanceError: reportRetentionMaintenanceError,
  });
  maintenance.vacuum();
  maintenance.checkpoint({ mode: 'truncate' });
}

function reportRetentionMaintenanceError(operation: MaintenanceOperation, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  if (operation === 'auto_vacuum') {
    console.warn(`[memory-retention-sweep] auto_vacuum check skipped: ${message}`);
  } else if (operation === 'incremental_vacuum') {
    console.warn(`[memory-retention-sweep] incremental vacuum skipped: ${message}`);
  } else if (operation === 'wal_checkpoint') {
    console.warn(`[memory-retention-sweep] WAL checkpoint skipped: ${message}`);
  }
}

/**
 * Sweep expired governed memory rows.
 *
 * Rows are selected by normalized `datetime(delete_after) < datetime('now')`
 * to enforce the ISO timestamps persisted by governed ingest.
 */
export function runMemoryRetentionSweep(
  database: Database.Database,
  args: MemoryRetentionSweepArgs = {},
): MemoryRetentionSweepResult {
  const startTime = Date.now();
  const dryRun = args.dryRun === true;
  const useSoftDeleteTombstones = isSoftDeleteTombstonesEnabled();

  if (!hasTable(database, 'memory_index')) {
    return {
      swept: 0,
      retained: 0,
      protectedCount: 0,
      dryRun,
      durationMs: Date.now() - startTime,
      candidates: [],
      deletedIds: [],
      protectedIds: [],
      ledgerRecorded: null,
      residual_retention: buildResidualRetentionReport(0, false),
      tombstoneState: {
        usesPurgeablePartition: false,
        usingPurgeableIndex: false,
        candidateCount: 0,
        deletedCount: 0,
      },
      edgeState: {
        causalEdgesTablePresent: false,
        candidateEdgeCount: 0,
      },
    };
  }

  const candidates = selectExpiredRows(database, useSoftDeleteTombstones);
  const initialEdgeState = buildEdgeState(database, candidates);
  const feedbackRetention = isFeedbackRetentionLearningEnabled()
    ? buildFeedbackRetentionReport(database, candidates, dryRun, args.feedbackRetention)
    : null;

  if (dryRun || candidates.length === 0) {
    const totalRows = countRows(database);
    const dryRunProtectedIds = candidates
      .filter((candidate) => getRetentionProtectionReason(database, candidate) !== null)
      .map((candidate) => candidate.id);
    return {
      swept: 0,
      retained: totalRows,
      protectedCount: dryRunProtectedIds.length,
      dryRun,
      durationMs: Date.now() - startTime,
      candidates,
      deletedIds: [],
      protectedIds: dryRunProtectedIds,
      ledgerRecorded: null,
      residual_retention: buildResidualRetentionReport(0, false),
      tombstoneState: buildTombstoneState(database, candidates.length, 0, useSoftDeleteTombstones),
      edgeState: initialEdgeState,
      ...(feedbackRetention ? { feedbackRetention } : {}),
    };
  }

  if (feedbackRetention && (feedbackRetention.mode === 'shadow' || feedbackRetention.activeBlocked)) {
    const auditTx = database.transaction(() => {
      feedbackRetention.auditCount = recordFeedbackRetentionAudits(
        database,
        candidates,
        feedbackRetention,
        false,
      );
    });
    auditTx();

    return {
      swept: 0,
      retained: countRows(database),
      protectedCount: feedbackRetention.protectedIds.length,
      dryRun,
      durationMs: Date.now() - startTime,
      candidates,
      deletedIds: [],
      protectedIds: feedbackRetention.protectedIds,
      extendedIds: [],
      ledgerRecorded: null,
      residual_retention: buildResidualRetentionReport(0, false),
      tombstoneState: buildTombstoneState(database, candidates.length, 0, useSoftDeleteTombstones),
      edgeState: initialEdgeState,
      feedbackRetention,
    };
  }

  initHistory(database);

  const deletedIds: number[] = [];
  const protectedIds: number[] = [];
  const extendedIds: number[] = [];
  let ledgerRecorded: boolean | null = null;

  args.beforeApply?.();

  const sweepTx = database.transaction(() => {
    for (const candidate of candidates) {
      // TOCTOU guard: skip rows un-expired by another writer since selection.
      const currentCandidate = getCurrentExpiredRow(database, candidate.id, useSoftDeleteTombstones);
      if (!currentCandidate) {
        continue;
      }
      let feedbackDeleteDecision: FeedbackRetentionDecisionResult | null = null;
      if (feedbackRetention) {
        const decision = feedbackRetention.decisions.find((entry) => entry.memoryId === candidate.id);
        if (!decision) {
          continue;
        }

        if (decision.decision === 'protect') {
          database.prepare('UPDATE memory_index SET delete_after = NULL WHERE id = ?').run(candidate.id);
          protectedIds.push(candidate.id);
          recordFeedbackRetentionAudit(database, currentCandidate, decision, {
            mode: feedbackRetention.mode,
            applied: true,
            activeGatePassed: feedbackRetention.activeGatePassed,
          });
          feedbackRetention.auditCount += 1;
          continue;
        }

        if (decision.decision === 'extend') {
          database.prepare('UPDATE memory_index SET delete_after = ? WHERE id = ?').run(
            decision.nextDeleteAfter,
            candidate.id,
          );
          extendedIds.push(candidate.id);
          recordFeedbackRetentionAudit(database, currentCandidate, decision, {
            mode: feedbackRetention.mode,
            applied: true,
            activeGatePassed: feedbackRetention.activeGatePassed,
          });
          feedbackRetention.auditCount += 1;
          continue;
        }
        // Re-validate the spare axes against the row as it stands inside the
        // transaction, mirroring the delete_after re-validation above. The spare
        // decision was computed from the pre-transaction snapshot; a concurrent
        // writer can raise importance, trust, quality, or age above the spare
        // floors after selection, so a stale delete must not remove a now-spared
        // row. Re-reads the same axes getCurrentExpiredRow already refreshed.
        const freshSpareDecision = revalidateSpareOnlyRetention(currentCandidate, {
          runAt: args.feedbackRetention?.runAt,
          extendDays: args.feedbackRetention?.extendDays,
        });
        if (freshSpareDecision && freshSpareDecision.decision === 'protect') {
          database.prepare('UPDATE memory_index SET delete_after = NULL WHERE id = ?').run(candidate.id);
          protectedIds.push(candidate.id);
          recordFeedbackRetentionAudit(database, currentCandidate, {
            ...decision,
            decision: 'protect',
            reason: freshSpareDecision.reason,
            nextDeleteAfter: null,
          }, {
            mode: feedbackRetention.mode,
            applied: true,
            activeGatePassed: feedbackRetention.activeGatePassed,
          });
          feedbackRetention.auditCount += 1;
          continue;
        }
        feedbackDeleteDecision = decision;
      }
      // Rows protected by tier, pin, or live incoming semantic edges are never
      // deleted on TTL expiry alone.
      const protectionReason = getRetentionProtectionReason(database, currentCandidate);
      if (protectionReason !== null) {
        if (feedbackRetention && feedbackDeleteDecision) {
          recordFeedbackRetentionAudit(database, currentCandidate, feedbackDeleteDecision, {
            mode: feedbackRetention.mode,
            applied: false,
            activeGatePassed: feedbackRetention.activeGatePassed,
          });
          feedbackRetention.auditCount += 1;
        }
        protectedIds.push(currentCandidate.id);
        recordGovernanceAudit(database, {
          action: 'retention_sweep',
          decision: 'deny',
          memoryId: currentCandidate.id,
          logicalKey: currentCandidate.filePath,
          tenantId: currentCandidate.tenantId ?? undefined,
          userId: currentCandidate.userId ?? undefined,
          agentId: currentCandidate.agentId ?? undefined,
          sessionId: currentCandidate.sessionId ?? undefined,
          reason: protectionReason,
          metadata: {
            originalDeleteAfter: currentCandidate.deleteAfter,
            importanceTier: currentCandidate.importanceTier,
            isPinned: currentCandidate.isPinned,
            retentionForgetting: isRetentionForgettingEnabled(),
            specFolder: currentCandidate.specFolder,
            filePath: currentCandidate.filePath,
          },
        });
        continue;
      }
      if (feedbackRetention && feedbackDeleteDecision) {
        recordFeedbackRetentionAudit(database, currentCandidate, feedbackDeleteDecision, {
          mode: feedbackRetention.mode,
          applied: true,
          activeGatePassed: feedbackRetention.activeGatePassed,
        });
        feedbackRetention.auditCount += 1;
      }
      const deleted = vectorIndex.deleteMemory(currentCandidate.id, database);
      if (!deleted) {
        continue;
      }

      deletedIds.push(currentCandidate.id);

      recordHistory(
        currentCandidate.id,
        'DELETE',
        {
          reason: 'retention_expired',
          deleteAfter: currentCandidate.deleteAfter,
          filePath: currentCandidate.filePath,
        },
        null,
        'mcp:memory_retention_sweep',
        currentCandidate.specFolder,
      );

      recordGovernanceAudit(database, {
        action: 'retention_sweep',
        decision: 'delete',
        memoryId: currentCandidate.id,
        logicalKey: currentCandidate.filePath,
        tenantId: currentCandidate.tenantId ?? undefined,
        userId: currentCandidate.userId ?? undefined,
        agentId: currentCandidate.agentId ?? undefined,
        sessionId: currentCandidate.sessionId ?? undefined,
        reason: 'retention_expired',
        metadata: {
          originalDeleteAfter: currentCandidate.deleteAfter,
          delete_after: currentCandidate.deleteAfter,
          specFolder: currentCandidate.specFolder,
          filePath: currentCandidate.filePath,
        },
      });
    }

    if (deletedIds.length > 0) {
      ledgerRecorded = appendRetentionLedger(database, deletedIds, candidates);
    }
  });

  sweepTx();
  if (deletedIds.length > 0) {
    runPostDeleteMaintenance(database);
  }
  if (feedbackRetention) {
    feedbackRetention.extendedIds = extendedIds;
    feedbackRetention.protectedIds = protectedIds;
    feedbackRetention.deletedIds = deletedIds;
  }

  return {
    swept: deletedIds.length,
    retained: countRows(database),
    protectedCount: protectedIds.length,
    dryRun,
    durationMs: Date.now() - startTime,
    candidates,
    deletedIds,
    protectedIds,
    ledgerRecorded,
    residual_retention: buildResidualRetentionReport(deletedIds.length, deletedIds.length > 0),
    tombstoneState: buildTombstoneState(database, candidates.length, deletedIds.length, useSoftDeleteTombstones),
    edgeState: initialEdgeState,
    ...(feedbackRetention ? { extendedIds } : {}),
    ...(feedbackRetention ? { feedbackRetention } : {}),
  };
}
