// ───────────────────────────────────────────────────────────────
// MODULE: Edge Semantic Retrieval
// ───────────────────────────────────────────────────────────────
// Shadow-only semantic lookup primitives for causal graph edges.

import type Database from 'better-sqlite3';
import {
  isEdgeTripletSearchEnabled,
  isEdgeVectorIndexEnabled,
} from '../search/search-flags.js';
import {
  nearestEdgeVectors,
  type EdgeVectorSearchOptions,
} from '../storage/edge-vector-store.js';

export interface SemanticEdgeHit {
  edgeId: number;
  sourceId: string;
  targetId: string;
  relation: string;
  strength: number;
  factText: string | null;
  score: number;
  modelId: string;
  profileKey: string;
}

export interface EdgeTripletScoreInput {
  sourceScore: number;
  edgeScore: number;
  targetScore: number;
  sourceWeight?: number;
  edgeWeight?: number;
  targetWeight?: number;
}

function tableExists(database: Database.Database, tableName: string): boolean {
  const row = database.prepare(`
    SELECT 1 AS present
    FROM sqlite_master
    WHERE type = 'table' AND name = ?
    LIMIT 1
  `).get(tableName) as { present?: number } | undefined;
  return row?.present === 1;
}

function finiteScore(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

export function scoreEdgeAwareTriplet(input: EdgeTripletScoreInput): number {
  const sourceWeight = input.sourceWeight ?? 1;
  const edgeWeight = input.edgeWeight ?? 1;
  const targetWeight = input.targetWeight ?? 1;
  const totalWeight = sourceWeight + edgeWeight + targetWeight;
  if (totalWeight <= 0) {
    return 0;
  }
  return (
    finiteScore(input.sourceScore) * sourceWeight
    + finiteScore(input.edgeScore) * edgeWeight
    + finiteScore(input.targetScore) * targetWeight
  ) / totalWeight;
}

export function findSemanticEdges(
  database: Database.Database,
  queryEmbedding: readonly number[] | Float32Array,
  options: EdgeVectorSearchOptions,
): SemanticEdgeHit[] {
  if (!isEdgeVectorIndexEnabled()) {
    return [];
  }
  if (!tableExists(database, 'causal_edges') || !tableExists(database, 'edge_vector_embeddings')) {
    return [];
  }

  const hits = nearestEdgeVectors(database, queryEmbedding, options);
  if (hits.length === 0) {
    return [];
  }
  const edgeIds = hits.map((hit) => hit.edgeId);
  const placeholders = edgeIds.map(() => '?').join(', ');
  const rows = database.prepare(`
    SELECT id, source_id, target_id, relation, strength, fact_text
    FROM causal_edges
    WHERE id IN (${placeholders})
  `).all(...edgeIds) as Array<{
    id: number;
    source_id: string;
    target_id: string;
    relation: string;
    strength: number | null;
    fact_text: string | null;
  }>;
  const edgesById = new Map(rows.map((row) => [row.id, row]));

  return hits.flatMap((hit): SemanticEdgeHit[] => {
    const edge = edgesById.get(hit.edgeId);
    if (!edge) {
      return [];
    }
    return [{
      edgeId: hit.edgeId,
      sourceId: edge.source_id,
      targetId: edge.target_id,
      relation: edge.relation,
      strength: typeof edge.strength === 'number' ? edge.strength : 1,
      factText: edge.fact_text,
      score: hit.score,
      modelId: hit.modelId,
      profileKey: hit.profileKey,
    }];
  });
}

export function rankEdgeTripletCandidates(
  candidates: Array<SemanticEdgeHit & { sourceScore: number; targetScore: number }>,
): Array<SemanticEdgeHit & { sourceScore: number; targetScore: number; tripletScore: number }> {
  if (!isEdgeTripletSearchEnabled()) {
    return [];
  }
  return candidates
    .map((candidate) => ({
      ...candidate,
      tripletScore: scoreEdgeAwareTriplet({
        sourceScore: candidate.sourceScore,
        edgeScore: candidate.score,
        targetScore: candidate.targetScore,
        edgeWeight: 2,
      }),
    }))
    .sort((a, b) => b.tripletScore - a.tripletScore || a.edgeId - b.edgeId);
}

/** A fused-pool candidate sourced from a semantically retrieved edge neighbor. */
export interface SemanticEdgeNeighborCandidate {
  id: number;
  score: number;
  source: 'graph';
  edgeId: number;
  relation: string;
  via: 'edge-semantic';
}

/**
 * Resolve query-time edge-neighbor candidates for the fused graph lane.
 *
 * Given a query embedding, find the nearest edges by fact_text embedding, then
 * emit each edge's BOTH endpoint memories as graph-family candidates (source:
 * 'graph') so the additive reserved-slot path can extend recall with edge
 * neighbors without ever displacing a baseline hit. When edge-triplet search is
 * enabled the per-candidate score is the relation-aware triplet score; otherwise
 * it is the raw edge cosine score. Returns [] when the vector-index flag is off
 * or no edge vectors are seeded, so the off-path is a strict no-op.
 *
 * Endpoint ids that fail to parse as integers (legacy spec-folder string ids on
 * hierarchy edges) are dropped, because the fused pool keys numeric memory ids.
 */
export function findSemanticEdgeNeighborCandidates(
  database: Database.Database,
  queryEmbedding: readonly number[] | Float32Array,
  options: EdgeVectorSearchOptions,
): SemanticEdgeNeighborCandidate[] {
  const hits = findSemanticEdges(database, queryEmbedding, options);
  if (hits.length === 0) {
    return [];
  }

  // Relation-aware re-scoring when triplet search is on. The endpoint memories
  // are not independently re-queried here (the fused pool already carries their
  // lexical/vector scores), so source and target weights stay neutral and the
  // edge score carries the relation signal.
  const ranked = isEdgeTripletSearchEnabled()
    ? new Map(
      rankEdgeTripletCandidates(
        hits.map((hit) => ({ ...hit, sourceScore: hit.score, targetScore: hit.score })),
      ).map((entry) => [entry.edgeId, entry.tripletScore]),
    )
    : null;

  const candidates: SemanticEdgeNeighborCandidate[] = [];
  const seen = new Set<number>();
  for (const hit of hits) {
    const score = ranked?.get(hit.edgeId) ?? hit.score;
    for (const endpoint of [hit.sourceId, hit.targetId]) {
      const memoryId = Number.parseInt(endpoint, 10);
      if (!Number.isInteger(memoryId) || seen.has(memoryId)) {
        continue;
      }
      seen.add(memoryId);
      candidates.push({
        id: memoryId,
        score,
        source: 'graph',
        edgeId: hit.edgeId,
        relation: hit.relation,
        via: 'edge-semantic',
      });
    }
  }
  return candidates;
}
