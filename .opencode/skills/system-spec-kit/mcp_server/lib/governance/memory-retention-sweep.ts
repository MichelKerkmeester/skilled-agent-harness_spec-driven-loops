// ───────────────────────────────────────────────────────────────
// MODULE: Memory Retention Sweep
// ───────────────────────────────────────────────────────────────
// Enforces governed memory_index.delete_after metadata.
import * as vectorIndex from '../search/vector-index.js';
import * as mutationLedger from '../storage/mutation-ledger.js';
import { init as initHistory, recordHistory } from '../storage/history.js';
import { recordGovernanceAudit } from './scope-governance.js';

import type Database from 'better-sqlite3';

/** Options for a governed memory retention sweep. */
export interface MemoryRetentionSweepArgs {
  dryRun?: boolean;
}

/** Expired memory_index row selected for retention deletion. */
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
}

/** Aggregate sweep counts returned to callers and audit logs. */
export interface MemoryRetentionSweepSummary {
  swept: number;
  retained: number;
  dryRun: boolean;
  durationMs: number;
}

/** Full sweep result including candidates, deletions, and ledger state. */
export interface MemoryRetentionSweepResult extends MemoryRetentionSweepSummary {
  candidates: RetentionExpiredRow[];
  deletedIds: number[];
  ledgerRecorded: boolean | null;
}

function hasTable(database: Database.Database, tableName: string): boolean {
  const row = database.prepare(
    "SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1"
  ).get(tableName) as { present?: number } | undefined;
  return row?.present === 1;
}

function selectExpiredRows(database: Database.Database): RetentionExpiredRow[] {
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
      delete_after AS deleteAfter
    FROM memory_index
    WHERE delete_after IS NOT NULL
      AND datetime(delete_after) < datetime('now')
    ORDER BY datetime(delete_after) ASC, id ASC
  `).all() as RetentionExpiredRow[];
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
      dryRun,
      durationMs: Date.now() - startTime,
      candidates: [],
      deletedIds: [],
      ledgerRecorded: null,
    };
  }

  const candidates = selectExpiredRows(database);

  if (dryRun || candidates.length === 0) {
    const totalRows = countRows(database);
    return {
      swept: 0,
      retained: totalRows,
      dryRun,
      durationMs: Date.now() - startTime,
      candidates,
      deletedIds: [],
      ledgerRecorded: null,
    };
  }

  initHistory(database);

  const deletedIds: number[] = [];
  let ledgerRecorded: boolean | null = null;

  const sweepTx = database.transaction(() => {
    for (const candidate of candidates) {
      // TOCTOU guard: skip rows un-expired by another writer since selection.
      if (!isStillExpired(database, candidate.id)) {
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

  return {
    swept: deletedIds.length,
    retained: countRows(database),
    dryRun,
    durationMs: Date.now() - startTime,
    candidates,
    deletedIds,
    ledgerRecorded,
  };
}
