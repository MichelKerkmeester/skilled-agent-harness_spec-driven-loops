// ───────────────────────────────────────────────────────────────
// MODULE: Temporal Edges
// ───────────────────────────────────────────────────────────────
// Feature catalog: Temporal contiguity layer
// Adds legacy and bi-temporal lifecycle columns to causal_edges,
// enabling edge invalidation and temporally-scoped graph queries.
// Feature-gated via SPECKIT_TEMPORAL_EDGES (default OFF).
import type Database from 'better-sqlite3';

import { isEdgePresenceCurrentnessEnabled, isTemporalEdgesEnabled } from '../search/search-flags.js';

// Closure-provenance marker value for edges retired by a direct local close
// (e.g. contradiction auto-invalidation), as opposed to the lineage canonical
// supersede writer. Kept in sync with the migration's documented value set.
const DIRECT_CLOSE_SOURCE = 'direct';
// Partial index supporting open-edge currentness reads (invalid_at IS NULL).
// Created here, where invalid_at is guaranteed present, and dropped by the
// migration teardown by the same name.
const OPEN_CURRENTNESS_INDEX = 'idx_causal_edges_open_currentness';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface Edge {
  sourceId: number;
  targetId: number;
  relation: string;
  strength: number;
  validAt: string | null;
  invalidAt: string | null;
}

export type TemporalEdge = Edge;

// ───────────────────────────────────────────────────────────────
// 2. SCHEMA MIGRATION
// ───────────────────────────────────────────────────────────────

/**
 * Add causal-edge lifecycle columns if not present.
 * Uses ALTER TABLE with try/catch for idempotency — re-running is safe.
 */
export function ensureTemporalColumns(db: Database.Database): void {
  if (!isTemporalEdgesEnabled()) {
    return;
  }

  const columns = [
    'valid_at',
    'invalid_at',
    'valid_from',
    'valid_to',
    'ingested_at',
    'expired_at',
    'invalidation_source',
  ] as const;

  for (const column of columns) {
    try {
      db.exec(`ALTER TABLE causal_edges ADD COLUMN ${column} TEXT DEFAULT NULL`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/duplicate column name/i.test(message)) {
        console.warn(`[temporal-edges] ensureTemporalColumns(${column}) failed (fail-open): ${message}`);
      }
    }
  }

  // invalid_at is guaranteed present above, so the partial currentness index can
  // be built safely here rather than in the migration (which runs on fresh
  // databases before invalid_at exists). Idempotent via IF NOT EXISTS.
  try {
    db.exec(`
      CREATE INDEX IF NOT EXISTS ${OPEN_CURRENTNESS_INDEX}
      ON causal_edges(source_id, target_id)
      WHERE invalid_at IS NULL
    `);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[temporal-edges] open-currentness index build failed (fail-open): ${message}`);
  }
}

// ───────────────────────────────────────────────────────────────
// 3. EDGE INVALIDATION
// ───────────────────────────────────────────────────────────────

/**
 * Mark an edge as invalidated (set invalid_at to current ISO timestamp).
 * Optionally records the reason in the evidence column.
 * No-op if the edge does not exist or is already invalidated.
 */
export function invalidateEdge(
  db: Database.Database,
  sourceId: number,
  targetId: number,
  reason: string = 'Edge invalidated',
  relation?: string,
): void {
  if (!isTemporalEdgesEnabled()) {
    return;
  }

  try {
    ensureTemporalColumns(db);
    const now = new Date().toISOString();
    const columns = new Set((db.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string }>)
      .map((column) => column.name));
    const assignments = [
      'invalid_at = ?',
      "evidence = COALESCE(evidence || ' | ', '') || ?",
    ];
    const params: unknown[] = [now, reason];
    if (columns.has('valid_to')) {
      assignments.push('valid_to = COALESCE(valid_to, ?)');
      params.push(now);
    }
    if (columns.has('expired_at')) {
      assignments.push('expired_at = COALESCE(expired_at, ?)');
      params.push(now);
    }
    if (columns.has('invalidation_source')) {
      // Callers of invalidateEdge are direct local closes; the lineage canonical
      // writer stamps 'lineage' on its own path. Reader-transparent: the close
      // is still keyed on invalid_at IS NULL.
      assignments.push('invalidation_source = COALESCE(invalidation_source, ?)');
      params.push(DIRECT_CLOSE_SOURCE);
    }

    if (relation) {
      (db.prepare(`
        UPDATE causal_edges
        SET ${assignments.join(', ')}
        WHERE source_id = ? AND target_id = ? AND relation = ? AND invalid_at IS NULL
      `) as Database.Statement).run(...params, String(sourceId), String(targetId), relation);
      return;
    }

    (db.prepare(`
      UPDATE causal_edges
      SET ${assignments.join(', ')}
      WHERE source_id = ? AND target_id = ? AND invalid_at IS NULL
    `) as Database.Statement).run(...params, String(sourceId), String(targetId));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[temporal-edges] invalidateEdge failed (fail-open): ${message}`);
  }
}

// ───────────────────────────────────────────────────────────────
// 4. VALID EDGE RETRIEVAL
// ───────────────────────────────────────────────────────────────

/**
 * Get only currently valid edges for a node (invalid_at IS NULL).
 * Returns edges where the node appears as either source or target.
 */
export function getValidEdges(db: Database.Database, nodeId: number): Edge[] {
  if (!isTemporalEdgesEnabled()) {
    return [];
  }

  try {
    ensureTemporalColumns(db);
    const rows = (db.prepare(`
      SELECT source_id, target_id, relation, COALESCE(strength, 1.0) AS strength,
             valid_at, invalid_at
      FROM causal_edges
      WHERE (source_id = ? OR target_id = ?) AND invalid_at IS NULL
    `) as Database.Statement).all(String(nodeId), String(nodeId)) as Array<{
      source_id: string;
      target_id: string;
      relation: string;
      strength: number;
      valid_at: string | null;
      invalid_at: string | null;
    }>;

    return rows.map((row) => ({
      sourceId: Number.parseInt(row.source_id, 10),
      targetId: Number.parseInt(row.target_id, 10),
      relation: row.relation,
      strength: row.strength,
      validAt: row.valid_at,
      invalidAt: row.invalid_at,
    }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[temporal-edges] getValidEdges failed (fail-open): ${message}`);
    return [];
  }
}

// ───────────────────────────────────────────────────────────────
// 5. EDGE-PRESENCE CURRENTNESS RECONCILIATION
// ───────────────────────────────────────────────────────────────

export interface CurrentnessReconciliation {
  /** Whether the reconciliation pass was permitted to run. */
  enabled: boolean;
  /** Open edges whose stray closure marker was cleared (marker must match presence). */
  clearedOpenMarkers: number;
  /** Closed edges whose missing marker was backfilled to 'legacy'. */
  markedLegacyClosures: number;
}

/**
 * Reconcile the closure-provenance marker with edge presence so the lineage
 * canonical writer and the derived causal projection cannot fork into a third
 * source of truth. The invariant: an OPEN edge (invalid_at IS NULL) carries no
 * marker, and a CLOSED edge always carries one. Two stray states are repaired —
 * an open edge with a marker (clear it) and a closed edge without one (stamp
 * 'legacy'). Gated default-off behind SPECKIT_EDGE_PRESENCE_CURRENTNESS because
 * making edge presence the live retirement path must earn benchmark promotion;
 * when off this is a no-op, so default recall is byte-identical to today.
 */
export function reconcileEdgePresenceCurrentness(db: Database.Database): CurrentnessReconciliation {
  if (!isEdgePresenceCurrentnessEnabled()) {
    return { enabled: false, clearedOpenMarkers: 0, markedLegacyClosures: 0 };
  }

  try {
    ensureTemporalColumns(db);
    const columns = new Set((db.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string }>)
      .map((column) => column.name));
    if (!columns.has('invalid_at') || !columns.has('invalidation_source')) {
      return { enabled: true, clearedOpenMarkers: 0, markedLegacyClosures: 0 };
    }

    const clearedOpenMarkers = (db.prepare(`
      UPDATE causal_edges
      SET invalidation_source = NULL
      WHERE invalid_at IS NULL AND invalidation_source IS NOT NULL
    `) as Database.Statement).run().changes;

    const markedLegacyClosures = (db.prepare(`
      UPDATE causal_edges
      SET invalidation_source = 'legacy'
      WHERE invalid_at IS NOT NULL AND invalidation_source IS NULL
    `) as Database.Statement).run().changes;

    return { enabled: true, clearedOpenMarkers, markedLegacyClosures };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[temporal-edges] reconcileEdgePresenceCurrentness failed (fail-open): ${message}`);
    return { enabled: true, clearedOpenMarkers: 0, markedLegacyClosures: 0 };
  }
}
