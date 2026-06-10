// ───────────────────────────────────────────────────────────────
// MODULE: Causal Edge Sweep
// ───────────────────────────────────────────────────────────────
// Tombstone-backed active causal edge deletion.
import type Database from 'better-sqlite3';

import { clearGraphSignalsCache } from '../graph/graph-signals.js';
import { clearDegreeCacheForDb } from '../search/graph-search-fn.js';
import { runInTransaction } from '../storage/transaction-manager.js';

type CausalEdgeSnapshot = {
  id: number;
  source_id: string;
  target_id: string;
  source_anchor: string | null;
  target_anchor: string | null;
  relation: string;
  strength: number;
  evidence: string | null;
  extracted_at: string | null;
  created_by: string | null;
  last_accessed: string | null;
};

type SweepSelector = {
  edgeIds?: readonly number[];
  memoryIds?: readonly (number | string)[];
  whereSql?: string;
  params?: readonly unknown[];
};

type SweepOptions = SweepSelector & {
  reason: string;
  command?: string;
  restoreContext?: Record<string, unknown>;
  invalidateCaches?: boolean;
};

type SweepResult = {
  matched: number;
  tombstoned: number;
  deleted: number;
  edgeIds: number[];
  tombstoneIds: number[];
};

function tableExists(database: Database.Database, tableName: string): boolean {
  const row = database.prepare(
    "SELECT 1 AS present FROM sqlite_master WHERE type='table' AND name = ?",
  ).get(tableName) as { present?: number } | undefined;
  return row?.present === 1;
}

function createIndex(database: Database.Database, name: string, sql: string, context: string): void {
  database.exec(sql);
  if (!tableExists(database, 'causal_edge_tombstones')) {
    throw new Error(`${context}: causal_edge_tombstones table missing after schema setup`);
  }
  const row = database.prepare(
    "SELECT 1 AS present FROM sqlite_master WHERE type='index' AND name = ?",
  ).get(name) as { present?: number } | undefined;
  if (row?.present !== 1) {
    throw new Error(`${context}: expected index ${name} to exist after schema setup`);
  }
}

function ensureCausalEdgeTombstoneSchema(database: Database.Database, context = 'causal edge tombstone schema'): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS causal_edge_tombstones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      tombstoned_at TEXT NOT NULL DEFAULT (datetime('now')),
      reason TEXT NOT NULL,
      lifecycle_generation INTEGER NOT NULL,
      restore_metadata TEXT NOT NULL
    )
  `);

  createIndex(
    database,
    'idx_causal_edge_tombstones_identity',
    `CREATE INDEX IF NOT EXISTS idx_causal_edge_tombstones_identity
       ON causal_edge_tombstones(source_id, target_id, relation, lifecycle_generation DESC)`,
    context,
  );
  createIndex(
    database,
    'idx_causal_edge_tombstones_tombstoned_at',
    `CREATE INDEX IF NOT EXISTS idx_causal_edge_tombstones_tombstoned_at
       ON causal_edge_tombstones(tombstoned_at DESC)`,
    context,
  );
  createIndex(
    database,
    'idx_causal_edge_tombstones_reason',
    'CREATE INDEX IF NOT EXISTS idx_causal_edge_tombstones_reason ON causal_edge_tombstones(reason)',
    context,
  );
}

function emptySweepResult(): SweepResult {
  return { matched: 0, tombstoned: 0, deleted: 0, edgeIds: [], tombstoneIds: [] };
}

function uniquePositiveEdgeIds(edgeIds: readonly number[] | undefined): number[] {
  return Array.from(new Set((edgeIds ?? [])
    .filter((id) => Number.isSafeInteger(id) && id > 0)));
}

function uniqueMemoryIds(memoryIds: readonly (number | string)[] | undefined): string[] {
  return Array.from(new Set((memoryIds ?? [])
    .map((id) => String(id).trim())
    .filter((id) => id.length > 0)));
}

function buildEdgeSelect(options: SweepOptions): { whereSql: string; params: unknown[] } {
  const edgeIds = uniquePositiveEdgeIds(options.edgeIds);
  if (edgeIds.length > 0) {
    return {
      whereSql: `id IN (${edgeIds.map(() => '?').join(', ')})`,
      params: edgeIds,
    };
  }

  const memoryIds = uniqueMemoryIds(options.memoryIds);
  if (memoryIds.length > 0) {
    const placeholders = memoryIds.map(() => '?').join(', ');
    return {
      whereSql: `(source_id IN (${placeholders}) OR target_id IN (${placeholders}))`,
      params: [...memoryIds, ...memoryIds],
    };
  }

  if (options.whereSql && options.whereSql.trim().length > 0) {
    return {
      whereSql: options.whereSql,
      params: [...(options.params ?? [])],
    };
  }

  throw new Error('Causal edge sweep requires edgeIds, memoryIds, or whereSql');
}

const OPTIONAL_EDGE_COLUMNS: readonly string[] = [
  'source_anchor',
  'target_anchor',
  'strength',
  'evidence',
  'extracted_at',
  'created_by',
  'confidence',
  'extraction_method',
  'last_accessed',
];

function readEdges(database: Database.Database, options: SweepOptions): CausalEdgeSnapshot[] {
  const selector = buildEdgeSelect(options);
  const existingColumns = new Set(
    (database.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string }>)
      .map((column) => column.name),
  );
  const optionalSelects = OPTIONAL_EDGE_COLUMNS
    .map((columnName) => (existingColumns.has(columnName)
      ? columnName
      : `NULL AS ${columnName}`))
    .join(',\n      ');
  return database.prepare(`
    SELECT
      id,
      source_id,
      target_id,
      relation,
      ${optionalSelects}
    FROM causal_edges
    WHERE ${selector.whereSql}
    ORDER BY id ASC
  `).all(...selector.params) as CausalEdgeSnapshot[];
}

function nextLifecycleGeneration(database: Database.Database, edge: CausalEdgeSnapshot): number {
  const row = database.prepare(`
    SELECT COALESCE(MAX(lifecycle_generation), 0) + 1 AS generation
    FROM causal_edge_tombstones
    WHERE source_id = ? AND target_id = ? AND relation = ?
  `).get(edge.source_id, edge.target_id, edge.relation) as { generation?: number } | undefined;

  return Number.isSafeInteger(row?.generation) && row!.generation! > 0 ? row!.generation! : 1;
}

function buildRestoreMetadata(edge: CausalEdgeSnapshot, options: SweepOptions): string {
  return JSON.stringify({
    edge,
    reason: options.reason,
    command: options.command ?? null,
    restoreContext: options.restoreContext ?? {},
  });
}

function deleteEdgesByIds(database: Database.Database, edgeIds: readonly number[]): number {
  let deleted = 0;
  const deleteStmt = database.prepare('DELETE FROM causal_edges WHERE id = ?');
  for (const edgeId of edgeIds) {
    const result = deleteStmt.run(edgeId) as { changes: number };
    deleted += result.changes;
  }
  return deleted;
}

function invalidateGraphCaches(database: Database.Database): void {
  try {
    clearDegreeCacheForDb(database);
  } catch (_error: unknown) {
    // Cache invalidation is best-effort after a durable edge delete.
  }
  try {
    clearGraphSignalsCache();
  } catch (_error: unknown) {
    // Cache invalidation is best-effort after a durable edge delete.
  }
}

function sweepCausalEdges(database: Database.Database, options: SweepOptions): SweepResult {
  if (!tableExists(database, 'causal_edges')) {
    return emptySweepResult();
  }

  const result = runInTransaction(database, () => {
    ensureCausalEdgeTombstoneSchema(database);
    const edges = readEdges(database, options);
    if (edges.length === 0) {
      return emptySweepResult();
    }

    const tombstoneIds: number[] = [];
    const insertTombstone = database.prepare(`
      INSERT INTO causal_edge_tombstones (
        source_id,
        target_id,
        relation,
        tombstoned_at,
        reason,
        lifecycle_generation,
        restore_metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const tombstonedAt = new Date().toISOString();
    for (const edge of edges) {
      const insertResult = insertTombstone.run(
        edge.source_id,
        edge.target_id,
        edge.relation,
        tombstonedAt,
        options.reason,
        nextLifecycleGeneration(database, edge),
        buildRestoreMetadata(edge, options),
      ) as { lastInsertRowid: number | bigint };
      tombstoneIds.push(Number(insertResult.lastInsertRowid));
    }

    const edgeIds = edges.map((edge) => edge.id);
    const deleted = deleteEdgesByIds(database, edgeIds);
    return {
      matched: edges.length,
      tombstoned: tombstoneIds.length,
      deleted,
      edgeIds,
      tombstoneIds,
    };
  });

  if (result.deleted > 0 && options.invalidateCaches !== false) {
    invalidateGraphCaches(database);
  }

  return result;
}

export {
  ensureCausalEdgeTombstoneSchema,
  sweepCausalEdges,
};

export type {
  SweepOptions as CausalEdgeSweepOptions,
  SweepResult as CausalEdgeSweepResult,
};
