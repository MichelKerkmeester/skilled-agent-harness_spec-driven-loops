// ---------------------------------------------------------------
// MODULE: Unified Graph Search Function
// Causal graph search channel — uses FTS5 for node matching
// ---------------------------------------------------------------

import { sanitizeFTS5Query } from './bm25-index';

import type Database from 'better-sqlite3';
import type { GraphSearchFn } from './hybrid-search';

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

interface CausalEdgeRow {
  id: string;
  source_id: string;
  target_id: string;
  relation: string;
  strength: number;
}

interface SubgraphWeights {
  causalWeight: number;
}

// ---------------------------------------------------------------
// 2. WEIGHTING
// ---------------------------------------------------------------

/**
 * Causal graph is the only graph channel.
 */
function getSubgraphWeights(_intent?: string): SubgraphWeights {
  return { causalWeight: 1.0 };
}

// ---------------------------------------------------------------
// 3. CAUSAL EDGE CHANNEL (FTS5-BACKED)
// ---------------------------------------------------------------

/**
 * Check whether the FTS5 table exists in the database.
 * Used to determine if FTS5 matching is available.
 */
function isFtsTableAvailable(database: Database.Database): boolean {
  try {
    const result = (database.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
    ) as Database.Statement).get() as { name: string } | undefined;
    return !!result;
  } catch {
    return false;
  }
}

/**
 * Find causal edges connected to memories matching the query.
 *
 * Uses FTS5 full-text search (memory_fts table) instead of naive LIKE matching.
 * Falls back to LIKE only when the FTS5 table is not available.
 */
function queryCausalEdges(
  database: Database.Database,
  query: string,
  limit: number
): Array<Record<string, unknown>> {
  try {
    // Prefer FTS5 matching for proper full-text search
    if (isFtsTableAvailable(database)) {
      return queryCausalEdgesFTS5(database, query, limit);
    }
    // Fallback: LIKE matching when FTS5 table is unavailable
    return queryCausalEdgesLikeFallback(database, query, limit);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[graph-search-fn] Causal edge query failed: ${msg}`);
    return [];
  }
}

/**
 * FTS5-backed causal edge query. Finds memory IDs via the memory_fts
 * virtual table, then retrieves causal edges connected to those memories.
 * Scores incorporate both edge strength and FTS5 BM25 relevance.
 */
function queryCausalEdgesFTS5(
  database: Database.Database,
  query: string,
  limit: number
): Array<Record<string, unknown>> {
  const sanitized = sanitizeFTS5Query(query);
  if (!sanitized) return [];

  // Find memory IDs matching the query via FTS5, then join to causal_edges
  const rows = (database.prepare(`
    SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength,
           -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
    FROM causal_edges ce
    JOIN memory_fts ON (
      memory_fts.rowid = CAST(ce.source_id AS INTEGER)
      OR memory_fts.rowid = CAST(ce.target_id AS INTEGER)
    )
    WHERE memory_fts MATCH ?
    ORDER BY (ce.strength * (-bm25(memory_fts, 10.0, 5.0, 2.0, 1.0))) DESC
    LIMIT ?
  `) as Database.Statement).all(sanitized, limit) as Array<CausalEdgeRow & { fts_score: number }>;

  return rows.map(row => ({
    id: `mem:${row.id}`,
    score: typeof row.strength === 'number'
      ? Math.min(1, Math.max(0, row.strength))
      : 0,
    source: 'graph' as const,
    title: `${row.source_id} -> ${row.target_id}`,
    relation: row.relation,
    sourceId: row.source_id,
    targetId: row.target_id,
  }));
}

/**
 * Legacy LIKE-based fallback when FTS5 table is unavailable.
 */
function queryCausalEdgesLikeFallback(
  database: Database.Database,
  query: string,
  limit: number
): Array<Record<string, unknown>> {
  const escaped = query.replace(/[%_]/g, '\\$&');
  const likeParam = `%${escaped}%`;

  const rows = (database.prepare(`
    SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength
    FROM causal_edges ce
    WHERE ce.source_id IN (
      SELECT id
      FROM memory_index
      WHERE COALESCE(content_text, title, '') LIKE ? ESCAPE '\\'
    )
       OR ce.target_id IN (
      SELECT id
      FROM memory_index
      WHERE COALESCE(content_text, title, '') LIKE ? ESCAPE '\\'
    )
    ORDER BY ce.strength DESC
    LIMIT ?
  `) as Database.Statement).all(likeParam, likeParam, limit) as CausalEdgeRow[];

  return rows.map(row => ({
    id: `mem:${row.id}`,
    score: typeof row.strength === 'number' ? Math.min(1, Math.max(0, row.strength)) : 0,
    source: 'graph' as const,
    title: `${row.source_id} -> ${row.target_id}`,
    relation: row.relation,
    sourceId: row.source_id,
    targetId: row.target_id,
  }));
}

// ---------------------------------------------------------------
// 4. FACTORY FUNCTION
// ---------------------------------------------------------------

/**
 * Creates a graph search function backed by causal_edges only.
 *
 * @param database  - An open better-sqlite3 Database instance
 * @returns A GraphSearchFn over causal edges
 */
function createUnifiedGraphSearchFn(
  database: Database.Database,
  _legacyArg?: string
): GraphSearchFn {
  return function unifiedGraphSearch(
    query: string,
    options: Record<string, unknown>
  ): Array<Record<string, unknown>> {
    const limit = typeof options['limit'] === 'number' ? options['limit'] : 20;
    const weights = getSubgraphWeights(typeof options['intent'] === 'string' ? options['intent'] : undefined);

    return queryCausalEdges(database, query, limit)
      .map((result) => ({
        ...result,
        score: (typeof result['score'] === 'number' ? result['score'] : 0) * weights.causalWeight,
      }))
      .sort((a, b) => {
        const scoreA = typeof a['score'] === 'number' ? a['score'] : 0;
        const scoreB = typeof b['score'] === 'number' ? b['score'] : 0;
        return scoreB - scoreA;
      });
  };
}

// ---------------------------------------------------------------
// 5. EXPORTS
// ---------------------------------------------------------------

export { createUnifiedGraphSearchFn, getSubgraphWeights };
