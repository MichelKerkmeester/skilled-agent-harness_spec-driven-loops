// ───────────────────────────────────────────────────────────────
// MODULE: Memory Retention Sweep
// ───────────────────────────────────────────────────────────────
// Enforces governed memory_index.delete_after metadata.
import * as vectorIndex from '../search/vector-index.js';
import * as mutationLedger from '../storage/mutation-ledger.js';
import { init as initHistory, recordHistory } from '../storage/history.js';
import { recordGovernanceAudit } from './scope-governance.js';
import { aggregateEvents, BATCH_WINDOW_MS } from '../feedback/batch-learning.js';
import type { AggregatedSignal } from '../feedback/batch-learning.js';
import {
  evaluateFeedbackRetention,
  isFeedbackRetentionLearningEnabled,
  recordFeedbackRetentionAudit,
  resolveFeedbackRetentionMode,
} from '../feedback/feedback-retention-reducer.js';
import type {
  FeedbackRetentionDecisionResult,
  FeedbackRetentionMode,
} from '../feedback/feedback-retention-reducer.js';

import type Database from 'better-sqlite3';

/** Options for a governed memory retention sweep. */
export interface MemoryRetentionSweepArgs {
  dryRun?: boolean;
  feedbackRetention?: FeedbackRetentionSweepArgs;
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
  decayHalfLifeDays: number | null;
  isPinned: number | null;
  accessCount: number | null;
  lastAccessed: string | number | null;
}

/** Aggregate sweep counts returned to callers and audit logs. */
export interface MemoryRetentionSweepSummary {
  swept: number;
  retained: number;
  protectedCount: number;
  dryRun: boolean;
  durationMs: number;
}

/** Full sweep result including candidates, deletions, and ledger state. */
export interface MemoryRetentionSweepResult extends MemoryRetentionSweepSummary {
  candidates: RetentionExpiredRow[];
  deletedIds: number[];
  protectedIds: number[];
  extendedIds?: number[];
  ledgerRecorded: boolean | null;
  feedbackRetention?: FeedbackRetentionSweepReport;
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

/**
 * Tier/usage columns may be absent on legacy databases that predate the
 * corresponding migrations. Missing columns are selected as NULL so the
 * protection decision degrades conservatively instead of crashing the sweep.
 */
const OPTIONAL_RETENTION_COLUMNS: ReadonlyArray<{ column: string; alias: string }> = [
  { column: 'importance_tier', alias: 'importanceTier' },
  { column: 'decay_half_life_days', alias: 'decayHalfLifeDays' },
  { column: 'is_pinned', alias: 'isPinned' },
  { column: 'access_count', alias: 'accessCount' },
  { column: 'last_accessed', alias: 'lastAccessed' },
];

function selectExpiredRows(database: Database.Database): RetentionExpiredRow[] {
  const presentColumns = new Set(
    (database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>)
      .map((row) => row.name),
  );
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
      ${optionalSelects}
    FROM memory_index
    WHERE delete_after IS NOT NULL
      AND datetime(delete_after) < datetime('now')
    ORDER BY datetime(delete_after) ASC, id ASC
  `).all() as RetentionExpiredRow[];
}

/** Importance tiers that must never be deleted on TTL expiry alone. */
const PROTECTED_RETENTION_TIERS = new Set(['constitutional', 'critical']);

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

// Re-validate inside the delete transaction: a concurrent writer can raise or
// clear delete_after between candidate selection and deletion, so a row that is
// no longer expired must not be swept. Mirrors the selectExpiredRows predicate.
function isStillExpired(database: Database.Database, id: number): boolean {
  const row = database.prepare(`
    SELECT 1 AS expired
    FROM memory_index
    WHERE id = ?
      AND delete_after IS NOT NULL
      AND datetime(delete_after) < datetime('now')
    LIMIT 1
  `).get(id) as { expired?: number } | undefined;
  return row?.expired === 1;
}

/** Test-only surface for the retention TOCTOU guard. */
export const __retentionSweepTestables = { isStillExpired };

function countRows(database: Database.Database): number {
  const row = database.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count: number };
  return row.count;
}

function buildFeedbackRetentionReport(
  database: Database.Database,
  candidates: RetentionExpiredRow[],
  dryRun: boolean,
  args: FeedbackRetentionSweepArgs = {},
): FeedbackRetentionSweepReport {
  const mode = resolveFeedbackRetentionMode();
  const activeGatePassed = mode === 'active' && args.shadowEvaluationPassed === true;
  const signals = args.signals ?? (dryRun
    ? []
    : aggregateEvents(database, (args.runAt ?? Date.now()) - (args.windowMs ?? BATCH_WINDOW_MS), args.runAt ?? Date.now()));
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

  let shouldRunIncrementalVacuum = false;
  try {
    const autoVacuumMode = database.pragma('auto_vacuum', { simple: true });
    shouldRunIncrementalVacuum = Number(autoVacuumMode) === 2;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[memory-retention-sweep] auto_vacuum check skipped: ${message}`);
  }

  if (shouldRunIncrementalVacuum) {
    try {
      database.pragma('incremental_vacuum');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[memory-retention-sweep] incremental vacuum skipped: ${message}`);
    }
  }

  try {
    database.pragma('wal_checkpoint(TRUNCATE)');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
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
    };
  }

  const candidates = selectExpiredRows(database);
  const feedbackRetention = isFeedbackRetentionLearningEnabled()
    ? buildFeedbackRetentionReport(database, candidates, dryRun, args.feedbackRetention)
    : null;

  if (dryRun || candidates.length === 0) {
    const totalRows = countRows(database);
    const dryRunProtectedIds = candidates
      .filter((candidate) => isProtectedFromRetentionDelete(candidate))
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
      feedbackRetention,
    };
  }

  initHistory(database);

  const deletedIds: number[] = [];
  const protectedIds: number[] = [];
  const extendedIds: number[] = [];
  let ledgerRecorded: boolean | null = null;

  const sweepTx = database.transaction(() => {
    for (const candidate of candidates) {
      // TOCTOU guard: skip rows un-expired by another writer since selection.
      if (!isStillExpired(database, candidate.id)) {
        continue;
      }
      if (feedbackRetention) {
        const decision = feedbackRetention.decisions.find((entry) => entry.memoryId === candidate.id);
        if (!decision) {
          continue;
        }

        if (decision.decision === 'protect') {
          database.prepare('UPDATE memory_index SET delete_after = NULL WHERE id = ?').run(candidate.id);
          protectedIds.push(candidate.id);
          recordFeedbackRetentionAudit(database, candidate, decision, {
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
          recordFeedbackRetentionAudit(database, candidate, decision, {
            mode: feedbackRetention.mode,
            applied: true,
            activeGatePassed: feedbackRetention.activeGatePassed,
          });
          feedbackRetention.auditCount += 1;
          continue;
        }

        recordFeedbackRetentionAudit(database, candidate, decision, {
          mode: feedbackRetention.mode,
          applied: true,
          activeGatePassed: feedbackRetention.activeGatePassed,
        });
        feedbackRetention.auditCount += 1;
      }
      // Tier basement: protected rows are never deleted on TTL expiry alone.
      // Audited as decision='deny' (the delete was denied) with a protection reason.
      if (isProtectedFromRetentionDelete(candidate)) {
        protectedIds.push(candidate.id);
        recordGovernanceAudit(database, {
          action: 'retention_sweep',
          decision: 'deny',
          memoryId: candidate.id,
          logicalKey: candidate.filePath,
          tenantId: candidate.tenantId ?? undefined,
          userId: candidate.userId ?? undefined,
          agentId: candidate.agentId ?? undefined,
          sessionId: candidate.sessionId ?? undefined,
          reason: 'retention_tier_protected',
          metadata: {
            originalDeleteAfter: candidate.deleteAfter,
            importanceTier: candidate.importanceTier,
            isPinned: candidate.isPinned,
            specFolder: candidate.specFolder,
            filePath: candidate.filePath,
          },
        });
        continue;
      }
      const deleted = vectorIndex.deleteMemory(candidate.id, database);
      if (!deleted) {
        continue;
      }

      deletedIds.push(candidate.id);

      recordHistory(
        candidate.id,
        'DELETE',
        {
          reason: 'retention_expired',
          deleteAfter: candidate.deleteAfter,
          filePath: candidate.filePath,
        },
        null,
        'mcp:memory_retention_sweep',
        candidate.specFolder,
      );

      recordGovernanceAudit(database, {
        action: 'retention_sweep',
        decision: 'delete',
        memoryId: candidate.id,
        logicalKey: candidate.filePath,
        tenantId: candidate.tenantId ?? undefined,
        userId: candidate.userId ?? undefined,
        agentId: candidate.agentId ?? undefined,
        sessionId: candidate.sessionId ?? undefined,
        reason: 'retention_expired',
        metadata: {
          originalDeleteAfter: candidate.deleteAfter,
          delete_after: candidate.deleteAfter,
          specFolder: candidate.specFolder,
          filePath: candidate.filePath,
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
    ...(feedbackRetention ? { extendedIds } : {}),
    ...(feedbackRetention ? { feedbackRetention } : {}),
  };
}
