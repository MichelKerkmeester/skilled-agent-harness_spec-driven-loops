// ───────────────────────────────────────────────────────────────
// MODULE: Temporal Edges
// ───────────────────────────────────────────────────────────────
// Feature catalog: Temporal contiguity layer
// Adds legacy and bi-temporal lifecycle columns to causal_edges,
// enabling edge invalidation and temporally-scoped graph queries.
// Feature-gated via SPECKIT_TEMPORAL_EDGES (default OFF).
import type Database from 'better-sqlite3';

import { isTemporalEdgesEnabled } from '../search/search-flags.js';

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
