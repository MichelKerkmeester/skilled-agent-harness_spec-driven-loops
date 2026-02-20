// ---------------------------------------------------------------
// MODULE: Unified Graph Search Function
// Composite graph search across causal edges and SGQS skill graph
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { skillGraphCache } from './skill-graph-cache';
import type { SkillGraph, GraphNode } from '../../../scripts/sgqs/types';
import type { GraphSearchFn } from './hybrid-search';
import { isGraphAuthorityEnabled } from './graph-flags';

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

// ---------------------------------------------------------------
// 2. INTENT-TO-SUBGRAPH ROUTING (T009)
// ---------------------------------------------------------------

interface SubgraphWeights {
  causalWeight: number;
  sgqsWeight: number;
}

/**
 * Map query intent to subgraph source weight preferences (Pattern 3).
 * - Decision/cause intents → heavy causal graph
 * - Spec/procedure intents → heavy SGQS skill graph
 * - All other intents → balanced
 */
function getSubgraphWeights(intent?: string): SubgraphWeights {
  switch (intent) {
    case 'find_decision':
    case 'understand_cause':
      return { causalWeight: 0.8, sgqsWeight: 0.2 };
    case 'find_spec':
    case 'find_procedure':
      return { causalWeight: 0.2, sgqsWeight: 0.8 };
    default:
      return { causalWeight: 0.5, sgqsWeight: 0.5 };
  }
}

// ---------------------------------------------------------------
// 3. HELPERS
// ---------------------------------------------------------------

/**
 * Split a query string into lowercase keyword tokens.
 */
function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);
}

/**
 * Compute a keyword match score for a node against a set of query tokens.
 * Returns number of matching tokens / total tokens (0-1).
 */
function nodeMatchScore(node: GraphNode, tokens: string[]): number {
  if (tokens.length === 0) return 0;

  const nodeId = node.id.toLowerCase();
  const nodeName = typeof node.properties['name'] === 'string'
    ? node.properties['name'].toLowerCase()
    : '';

  let matched = 0;
  for (const token of tokens) {
    if (nodeId.includes(token) || nodeName.includes(token)) {
      matched++;
    }
  }

  return matched / tokens.length;
}

// ---------------------------------------------------------------
// 4. STRUCTURAL AUTHORITY (T013)
// ---------------------------------------------------------------

/**
 * Multipliers for each recognised node label category.
 * Higher values indicate nodes that serve as structural hubs or entry-points.
 */
const AUTHORITY_TYPE_MULTIPLIERS: Record<string, number> = {
  ':Index':       3.0,
  ':Entrypoint':  2.5,
  ':Node':        1.0,
  ':Reference':   0.5,
  ':Asset':       0.3,
};

/** Fallback multiplier when a node carries no recognised label. */
const AUTHORITY_DEFAULT_MULTIPLIER = 1.0;

/**
 * Module-level authority map, populated whenever a new SkillGraph snapshot
 * arrives.  Stored at module scope so it is computed once per cache warm
 * rather than once per query.
 */
let cachedAuthorityMap: Map<string, number> | null = null;

/**
 * Compute a structural authority score for every node in the graph.
 *
 * authority(node) = typeMultiplier(node) * (inDegree(node) / maxInDegree)
 *
 * Returns a Map<nodeId, authorityScore>.  Scores are in [0, typeMultiplier]
 * where typeMultiplier is the maximum multiplier present in the graph.
 *
 * When `inbound` is absent or all in-degrees are zero the normalised in-degree
 * falls back to 0, giving each node its raw type multiplier at zero in-degree.
 *
 * @param graph - The SkillGraph to compute authority scores for
 * @returns     Map from node ID to authority score
 */
export function computeAuthorityScores(graph: SkillGraph): Map<string, number> {
  const authorityMap = new Map<string, number>();

  // Compute raw in-degree for every node using the inbound adjacency map.
  const inDegreeMap = new Map<string, number>();
  for (const [nodeId, neighbours] of (graph.inbound ?? new Map<string, string[]>())) {
    inDegreeMap.set(nodeId, neighbours.length);
  }

  // Find the maximum in-degree so we can normalise.
  let maxInDegree = 0;
  for (const deg of inDegreeMap.values()) {
    if (deg > maxInDegree) maxInDegree = deg;
  }

  for (const [nodeId, node] of graph.nodes) {
    // Pick the first recognised label; fall back to default if none match.
    let multiplier = AUTHORITY_DEFAULT_MULTIPLIER;
    for (const label of node.labels) {
      const normalised = label.startsWith(':') ? label : `:${label}`;
      if (normalised in AUTHORITY_TYPE_MULTIPLIERS) {
        multiplier = AUTHORITY_TYPE_MULTIPLIERS[normalised]!;
        break;
      }
    }

    const rawInDegree = inDegreeMap.get(nodeId) ?? 0;
    const normInDegree = maxInDegree > 0 ? rawInDegree / maxInDegree : 0;
    authorityMap.set(nodeId, multiplier * normInDegree);
  }

  return authorityMap;
}

// ---------------------------------------------------------------
// 5. CAUSAL EDGE CHANNEL
// ---------------------------------------------------------------

function queryCausalEdges(
  database: Database.Database,
  query: string,
  limit: number
): Array<Record<string, unknown>> {
  const likeParam = `%${query}%`;

  try {
    const rows = (database.prepare(`
      SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength
      FROM causal_edges ce
      WHERE ce.source_id IN (SELECT id FROM memories WHERE content LIKE ?)
         OR ce.target_id IN (SELECT id FROM memories WHERE content LIKE ?)
      ORDER BY ce.strength DESC
      LIMIT ?
    `) as Database.Statement).all(likeParam, likeParam, limit) as CausalEdgeRow[];

    return rows.map(row => ({
      id: `mem:${row.id}`,
      score: typeof row.strength === 'number' ? Math.min(1, Math.max(0, row.strength)) : 0,
      source: 'graph' as const,
      title: `${row.source_id} → ${row.target_id}`,
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
// 5b. SGQS SKILL GRAPH CHANNEL
// ---------------------------------------------------------------

function querySkillGraph(
  graph: SkillGraph,
  query: string,
  limit: number
): Array<Record<string, unknown>> {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored: Array<{ node: GraphNode; score: number }> = [];

  for (const [, node] of graph.nodes) {
    const score = nodeMatchScore(node, tokens);
    if (score > 0) {
      scored.push({ node, score });
    }
  }

  // T013: When Structural Authority Propagation is enabled, multiply each
  // result's keyword-match score by its precomputed authority score.
  // The authority map is computed once per cache warm (module-level variable),
  // so this lookup is O(1) per node.  When the flag is off or no map exists,
  // scores are used unchanged.
  const useAuthority = isGraphAuthorityEnabled() && cachedAuthorityMap !== null;

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ node, score }) => {
      const finalScore = useAuthority
        ? score * (cachedAuthorityMap!.get(node.id) ?? 1)
        : score;
      return {
        id: `skill:${node.path}`,
        score: finalScore,
        source: 'graph' as const,
        title: typeof node.properties['name'] === 'string'
          ? node.properties['name']
          : node.id,
        skill: node.skill,
        labels: node.labels,
      };
    });
}

// ---------------------------------------------------------------
// 6. FACTORY FUNCTION (createUnifiedGraphSearchFn)
// ---------------------------------------------------------------

/**
 * Creates a unified GraphSearchFn that queries both:
 * - Causal edge graph (SQLite `causal_edges` table)
 * - SGQS skill graph (via SkillGraphCacheManager)
 *
 * The returned function is synchronous per the GraphSearchFn contract.
 * SGQS results use a locally maintained snapshot updated asynchronously
 * on each invocation so the sync call path always has a best-effort graph.
 *
 * Feature flag checking is the CALLER's responsibility.
 *
 * @param database  - An open better-sqlite3 Database instance
 * @param skillRoot - Absolute path to the skill root directory for SGQS
 * @returns A GraphSearchFn combining both graph sources
 */
function createUnifiedGraphSearchFn(
  database: Database.Database,
  skillRoot: string
): GraphSearchFn {
  // Local snapshot: the most recent successfully resolved SkillGraph.
  // Updated in the background after each call to keep data fresh without
  // blocking the synchronous return path.
  let cachedGraph: SkillGraph | null = null;

  // Kick off an initial warm load in the background immediately.
  // Also pre-compute the authority map so T013 scores are available on first query.
  skillGraphCache.get(skillRoot).then(graph => {
    cachedGraph = graph;
    cachedAuthorityMap = computeAuthorityScores(graph);
  }).catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[graph-search-fn] Initial SGQS warm load failed: ${msg}`);
  });

  return function unifiedGraphSearch(
    query: string,
    options: Record<string, unknown>
  ): Array<Record<string, unknown>> {
    const limit = typeof options['limit'] === 'number' ? options['limit'] : 20;
    const intent = typeof options['intent'] === 'string' ? options['intent'] : undefined;

    // T009: Intent-to-subgraph routing — weight each channel by intent
    const weights = getSubgraphWeights(intent);

    // --- Causal edge channel ---
    const causalResults = queryCausalEdges(database, query, limit);

    // --- SGQS skill graph channel (use best-effort snapshot) ---
    let sgqsResults: Array<Record<string, unknown>> = [];
    if (cachedGraph !== null) {
      sgqsResults = querySkillGraph(cachedGraph, query, limit);
    }

    // Trigger a background refresh for the next invocation.
    // Update authority map alongside the graph snapshot so T013 stays in sync.
    skillGraphCache.get(skillRoot).then(graph => {
      cachedGraph = graph;
      cachedAuthorityMap = computeAuthorityScores(graph);
    }).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[graph-search-fn] SGQS background refresh failed: ${msg}`);
    });

    // --- Merge results with intent-based weighting ---
    const weighted = [
      ...causalResults.map(r => ({
        ...r,
        score: (typeof r['score'] === 'number' ? r['score'] : 0) * weights.causalWeight,
      })),
      ...sgqsResults.map(r => ({
        ...r,
        score: (typeof r['score'] === 'number' ? r['score'] : 0) * weights.sgqsWeight,
      })),
    ];

    return weighted.sort((a, b) => {
      const scoreA = typeof a['score'] === 'number' ? a['score'] : 0;
      const scoreB = typeof b['score'] === 'number' ? b['score'] : 0;
      return scoreB - scoreA;
    });
  };
}

// ---------------------------------------------------------------
// 7. EXPORTS
// ---------------------------------------------------------------

export { createUnifiedGraphSearchFn, getSubgraphWeights };
