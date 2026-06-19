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
