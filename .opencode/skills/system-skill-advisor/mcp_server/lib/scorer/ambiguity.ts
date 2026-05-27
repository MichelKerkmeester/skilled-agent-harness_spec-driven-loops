// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Ambiguity
// ───────────────────────────────────────────────────────────────

import type { AdvisorScoredRecommendation } from './types.js';

export const AMBIGUITY_MARGIN = 0.05;
export const AMBIGUITY_CONFIDENCE_MARGIN = 0.05;

// F-012-C2-04: Compute ambiguity from ranking `score` so the cluster aligns
// with the score-based fusion ranking (top-two-by-confidence may not match
// top-two-by-score).
//
// Also compute on `confidence` and union the two
// clusters. Score-margin keeps ranking alignment; confidence-margin restores
// the documented "0.05 confidence window" and catches
// cross-domain prompts where confidence is near-tied (user-visible signal)
// even when score gaps just exceed the score margin. A candidate is in the
// ambiguity cluster when EITHER gap is within its respective 0.05 margin —
// "outside both margins" is required to be unambiguously ranked.

function ambiguousCluster(
  recommendations: readonly AdvisorScoredRecommendation[],
): AdvisorScoredRecommendation[] {
  const passing = recommendations.filter((recommendation) => recommendation.passes_threshold);
  const [top] = passing;
  if (!top) return [];
  return passing.filter((recommendation) => {
    const scoreGap = Math.abs(top.score - recommendation.score);
    const confidenceGap = Math.abs(top.confidence - recommendation.confidence);
    return (
      scoreGap <= AMBIGUITY_MARGIN + Number.EPSILON
      || confidenceGap <= AMBIGUITY_CONFIDENCE_MARGIN + Number.EPSILON
    );
  });
}

export function isAmbiguousTopTwo(recommendations: readonly AdvisorScoredRecommendation[]): boolean {
  // Name preserved for back-compat with existing call sites; semantics are
  // now "is the passing top a member of an ambiguity cluster of size >= 2".
  return ambiguousCluster(recommendations).length >= 2;
}

export function applyAmbiguity(
  recommendations: readonly AdvisorScoredRecommendation[],
): AdvisorScoredRecommendation[] {
  const cluster = ambiguousCluster(recommendations);
  if (cluster.length < 2) return [...recommendations];
  const ambiguousSet = new Set(cluster.map((recommendation) => recommendation.skill));
  return recommendations.map((recommendation) => (
    ambiguousSet.has(recommendation.skill)
      ? {
        ...recommendation,
        ambiguousWith: [...ambiguousSet].filter((skill) => skill !== recommendation.skill),
      }
      : recommendation
  ));
}
