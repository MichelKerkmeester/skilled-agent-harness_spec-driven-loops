// ───────────────────────────────────────────────────────────────
// MODULE: Graph Causal Lane
// ───────────────────────────────────────────────────────────────

import type { NormalizedAffordance } from '../../affordance-normalizer.js';
import type { AdvisorProjection, LaneMatch } from '../types.js';

export interface GraphCausalOptions {
  readonly maxDepth?: number;
  readonly maxBreadth?: number;
}

export interface GraphCausalLaneSplit {
  readonly combinedMatches: LaneMatch[];
  readonly positiveMatches: LaneMatch[];
  readonly conflictMatches: LaneMatch[];
}

interface GraphCausalScoreEntry {
  readonly combinedScore: number;
  readonly positiveScore: number;
  readonly conflictScore: number;
  readonly evidence: readonly string[];
  readonly positiveEvidence: readonly string[];
  readonly conflictEvidence: readonly string[];
}

const EDGE_MULTIPLIER: Readonly<Record<string, number>> = {
  enhances: 0.55,
  siblings: 0.35,
  depends_on: 0.35,
  prerequisite_for: 0.30,
  conflicts_with: -0.35,
};

function buildGraphCausalScores(
  seedMatches: readonly LaneMatch[],
  projection: AdvisorProjection,
  options: GraphCausalOptions = {},
  affordances: readonly NormalizedAffordance[] = [],
): Map<string, GraphCausalScoreEntry> {
  const maxDepth = options.maxDepth ?? 2;
  const maxBreadth = options.maxBreadth ?? 4;
  const adjacency = new Map<string, typeof projection.edges>();
  for (const edge of projection.edges) {
    const current = adjacency.get(edge.sourceId) ?? [];
    adjacency.set(edge.sourceId, [...current, edge]);
  }
  for (const affordance of affordances) {
    const current = adjacency.get(affordance.skillId) ?? [];
    adjacency.set(affordance.skillId, [
      ...current,
      ...affordance.edges.map((edge) => ({
        sourceId: affordance.skillId,
        targetId: edge.targetSkillId,
        edgeType: edge.edgeType,
        weight: edge.weight,
        context: affordance.evidenceLabel,
      })),
    ]);
  }

  const seedScores = new Map<string, number>();
  for (const match of seedMatches) {
    if (match.lane === 'semantic_shadow') continue;
    seedScores.set(match.skillId, Math.max(seedScores.get(match.skillId) ?? 0, match.score));
  }

  const scores = new Map<string, {
    combinedScore: number;
    positiveScore: number;
    conflictScore: number;
    evidence: string[];
    positiveEvidence: string[];
    conflictEvidence: string[];
  }>();
  for (const [seedId, seedScore] of seedScores) {
    const queue: Array<{ id: string; depth: number; strength: number; path: string }> = [{ id: seedId, depth: 0, strength: seedScore, path: seedId }];
    const seen = new Set([seedId]);
    while (queue.length > 0) {
      // queue.length was checked immediately before shifting the next item.
      const current = queue.shift()!;
      if (current.depth >= maxDepth) continue;
      const outgoing = [...(adjacency.get(current.id) ?? [])]
        .sort((left, right) => right.weight - left.weight)
        .slice(0, maxBreadth);
      for (const edge of outgoing) {
        if (seen.has(edge.targetId)) continue;
        seen.add(edge.targetId);
        const multiplier = EDGE_MULTIPLIER[edge.edgeType];
        if (multiplier === undefined) continue;
        const propagated = current.strength * edge.weight * Math.abs(multiplier) * (1 / (current.depth + 1));
        if (propagated < 0.05) continue;
        const signed = multiplier < 0 ? -propagated : propagated;
        const entry = scores.get(edge.targetId) ?? {
          combinedScore: 0,
          positiveScore: 0,
          conflictScore: 0,
          evidence: [],
          positiveEvidence: [],
          conflictEvidence: [],
        };
        const evidence = `edge:${current.id}->${edge.targetId}:${edge.edgeType}`;
        entry.combinedScore += signed;
        entry.evidence.push(evidence);
        if (signed > 0) {
          entry.positiveScore += signed;
          entry.positiveEvidence.push(evidence);
        } else {
          entry.conflictScore += signed;
          entry.conflictEvidence.push(evidence);
        }
        scores.set(edge.targetId, entry);
        if (signed > 0) {
          queue.push({
            id: edge.targetId,
            depth: current.depth + 1,
            strength: signed,
            path: `${current.path}/${edge.targetId}`,
          });
        }
      }
    }
  }

  return scores;
}

function toLaneMatches(
  scores: Map<string, GraphCausalScoreEntry>,
  scoreKey: 'combinedScore' | 'positiveScore' | 'conflictScore',
  evidenceKey: 'evidence' | 'positiveEvidence' | 'conflictEvidence',
): LaneMatch[] {
  return [...scores.entries()]
    .filter(([, value]) => value[scoreKey] !== 0)
    .map(([skillId, value]) => ({
      skillId,
      lane: 'graph_causal' as const,
      score: Math.max(-1, Math.min(value[scoreKey], 1)),
      evidence: value[evidenceKey].slice(0, 6),
    }));
}

export function scoreGraphCausalLaneSplit(
  seedMatches: readonly LaneMatch[],
  projection: AdvisorProjection,
  options: GraphCausalOptions = {},
  affordances: readonly NormalizedAffordance[] = [],
): GraphCausalLaneSplit {
  const scores = buildGraphCausalScores(seedMatches, projection, options, affordances);
  return {
    combinedMatches: toLaneMatches(scores, 'combinedScore', 'evidence'),
    positiveMatches: toLaneMatches(scores, 'positiveScore', 'positiveEvidence'),
    conflictMatches: toLaneMatches(scores, 'conflictScore', 'conflictEvidence'),
  };
}

export function scoreGraphCausalLane(
  seedMatches: readonly LaneMatch[],
  projection: AdvisorProjection,
  options: GraphCausalOptions = {},
  affordances: readonly NormalizedAffordance[] = [],
): LaneMatch[] {
  return scoreGraphCausalLaneSplit(seedMatches, projection, options, affordances).combinedMatches;
}
