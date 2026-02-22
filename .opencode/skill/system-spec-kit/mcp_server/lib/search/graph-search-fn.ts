// ---------------------------------------------------------------
// MODULE: Unified Graph Search Function
// Causal graph search channel
// ---------------------------------------------------------------

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
// 3. CAUSAL EDGE CHANNEL
// ---------------------------------------------------------------

function queryCausalEdges(
  database: Database.Database,
  query: string,
  limit: number
): Array<Record<string, unknown>> {
  const escaped = query.replace(/[%_]/g, '\\$&');
  const likeParam = `%${escaped}%`;

  try {
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[graph-search-fn] Causal edge query failed: ${msg}`);
    return [];
  }
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
