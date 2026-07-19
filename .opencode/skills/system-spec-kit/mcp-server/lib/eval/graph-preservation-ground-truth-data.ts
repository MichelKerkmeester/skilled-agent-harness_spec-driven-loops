// ───────────────────────────────────────────────────────────────
// MODULE: Graph Preservation Ground Truth Data Loader
// ───────────────────────────────────────────────────────────────
// Feature catalog: Graph preservation quality benchmark
//
// A scoped sibling fixture, separate from lib/eval/data/ground-truth.json.
// The shared fixture feeds unrelated calibration/ablation/BM25/false-confirm/
// eval-v2 scripts and tests; widening it for a new slicing dimension risks
// silently changing those unrelated benchmark populations, and the shared
// fixture's own id-mapping tool is hardcoded to it and mishandles special
// relevance classes -- a sibling file avoids both problems.
import type Database from 'better-sqlite3';

import graphPreservationData from './data/graph-preservation-ground-truth.json' with { type: 'json' };

export type GraphPreservationSlice = 'content_rich_short' | 'single_hop' | 'control';

export interface GraphPreservationQuery {
  id: number;
  query: string;
  slice: GraphPreservationSlice;
  notes?: string;
}

// Relevance rows anchor to a stable repo-relative file path rather than a raw
// memory_index row id. Raw ids drift as the corpus is reindexed (the shared
// ground-truth.json fixture already has 106 stale relevance rows for this
// reason); a file-path anchor survives reindexing and is resolved to whatever
// id currently owns that path at benchmark-run time.
export interface GraphPreservationRelevance {
  queryId: number;
  anchorFilePath: string;
  relevance: 0 | 1 | 2 | 3;
}

const { queries, relevances } = graphPreservationData as {
  queries: GraphPreservationQuery[];
  relevances: GraphPreservationRelevance[];
};

export const GRAPH_PRESERVATION_QUERIES: GraphPreservationQuery[] = queries;
export const GRAPH_PRESERVATION_RELEVANCES: GraphPreservationRelevance[] = relevances;

export interface ResolvedGraphPreservationRelevance {
  queryId: number;
  memoryId: number;
  relevance: 0 | 1 | 2 | 3;
  anchorFilePath: string;
}

export interface GraphPreservationAnchorResolutionResult {
  resolved: ResolvedGraphPreservationRelevance[];
  unresolved: GraphPreservationRelevance[];
}

/**
 * Resolves each relevance row's stable file-path anchor to the memory_index id
 * that currently owns that path in `db`. Matches by path suffix (not exact
 * equality) so the fixture is portable across machines/checkouts where the
 * repo root differs but the anchor's repo-relative suffix does not. Rows whose
 * anchor cannot be resolved are reported in `unresolved`, never silently
 * dropped -- callers that need a fail-closed benchmark must check that array
 * themselves rather than assume `resolved` is the complete set.
 */
export function resolveGraphPreservationRelevanceIds(
  db: Database.Database,
  relevances: readonly GraphPreservationRelevance[],
): GraphPreservationAnchorResolutionResult {
  const stmt = db.prepare(`
    SELECT id
    FROM memory_index
    WHERE parent_id IS NULL AND file_path LIKE '%' || ?
    ORDER BY id DESC
    LIMIT 1
  `);

  const resolved: ResolvedGraphPreservationRelevance[] = [];
  const unresolved: GraphPreservationRelevance[] = [];
  for (const relevance of relevances) {
    const row = stmt.get(relevance.anchorFilePath) as { id: number } | undefined;
    if (row) {
      resolved.push({
        queryId: relevance.queryId,
        memoryId: row.id,
        relevance: relevance.relevance,
        anchorFilePath: relevance.anchorFilePath,
      });
    } else {
      unresolved.push(relevance);
    }
  }
  return { resolved, unresolved };
}
