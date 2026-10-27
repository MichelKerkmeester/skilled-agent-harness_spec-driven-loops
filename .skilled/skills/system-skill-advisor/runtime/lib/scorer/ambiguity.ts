// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Ambiguity
// ───────────────────────────────────────────────────────────────

import type { AdvisorScoredRecommendation } from './types.js';

export const AMBIGUITY_MARGIN = 0.05;
export const AMBIGUITY_CONFIDENCE_MARGIN = 0.05;

// Compute ambiguity from ranking `score` so the cluster aligns
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
//
// One exception: a skill the typed-command bound capped just below the top
// (`heldBelow` names the top) sits close to it only because of that cap, and the
// cap already ranked the pair from the user's own command. Counting that gap as
// a tie would report the explicit command as a coin flip. Two skills close on
// their own evidence still cluster.
//
// The confidence margin has one exception of its own: when the top earned its
// confidence from its own evidence, a member whose confidence only reached a
// floor clusters on the score margin alone.

function clustersWithTop(
  top: AdvisorScoredRecommendation,
  recommendation: AdvisorScoredRecommendation,
  applyFloorException: boolean,
): boolean {
  if (recommendation !== top && recommendation.heldBelow === top.skill) return false;
  const scoreGap = Math.abs(top.score - recommendation.score);
  if (scoreGap <= AMBIGUITY_MARGIN + Number.EPSILON) return true;
  // A floor pins many unrelated skills to the same confidence, which is not a
  // tie with a top that earned its confidence from its own evidence.
  const floorOnlyMember = applyFloorException
    && recommendation.confidenceFloored === true
    && top.confidenceFloored !== true;
  if (floorOnlyMember) return false;
  return Math.abs(top.confidence - recommendation.confidence)
    <= AMBIGUITY_CONFIDENCE_MARGIN + Number.EPSILON;
}

function ambiguousCluster(
  recommendations: readonly AdvisorScoredRecommendation[],
  applyFloorException = true,
): AdvisorScoredRecommendation[] {
  const passing = recommendations.filter((recommendation) => recommendation.passes_threshold);
  const [top] = passing;
  if (!top) return [];
  return passing.filter((recommendation) => clustersWithTop(top, recommendation, applyFloorException));
}

export function isAmbiguousTopTwo(recommendations: readonly AdvisorScoredRecommendation[]): boolean {
  // Name preserved for back-compat with existing call sites; semantics are
  // now "is the passing top a member of an ambiguity cluster of size >= 2".
  return ambiguousCluster(recommendations).length >= 2;
}

export function wideAmbiguityMembers(
  recommendations: readonly AdvisorScoredRecommendation[],
): Set<string> {
  // The low-information abstention reads this wider set, so a skill the floor
  // exception dropped cannot slip through as the top of an under-specified
  // prompt.
  const wide = ambiguousCluster(recommendations, false);
  if (wide.length < 2) return new Set();
  return new Set(wide.map((recommendation) => recommendation.skill));
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
