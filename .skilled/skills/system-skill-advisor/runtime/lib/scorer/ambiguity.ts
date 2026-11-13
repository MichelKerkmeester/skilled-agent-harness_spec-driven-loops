// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Ambiguity
// ───────────────────────────────────────────────────────────────

import { COMMAND_BRIDGES } from './projection.js';
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
// The confidence margin has one exception of its own. A confidence floor pins
// many unrelated skills to the same confidence, so a floored member never ties
// on confidence alone. When the top is not floored, the member clusters on the
// score margin alone. When both are floored, the equal confidence carries no
// evidence either, so the score margin alone decides there too.

// A command bridge row and the skill that owns that command are one answer, so
// their near-tie is a single route rather than a choice between two. Two
// different skills, or a command row and a skill that does not own it, stay a
// real tie.

// The owner comes from the generated bridge data, never from the shape of an
// id: a bridge id says nothing reliable about which skill runs the command.
const OWNER_BY_BRIDGE_ID: ReadonlyMap<string, string> = new Map(
  COMMAND_BRIDGES.flatMap((bridge) => (bridge.ownerSkill ? [[bridge.id, bridge.ownerSkill] as const] : [])),
);

function ownsCommandBridge(skillId: string, bridgeId: string): boolean {
  return OWNER_BY_BRIDGE_ID.get(bridgeId) === skillId;
}

function answersSameRoute(
  top: AdvisorScoredRecommendation,
  recommendation: AdvisorScoredRecommendation,
): boolean {
  if (top.kind === 'command' && recommendation.kind === 'skill') {
    return ownsCommandBridge(recommendation.skill, top.skill);
  }
  if (top.kind === 'skill' && recommendation.kind === 'command') {
    return ownsCommandBridge(top.skill, recommendation.skill);
  }
  return false;
}

function clustersWithTop(
  top: AdvisorScoredRecommendation,
  recommendation: AdvisorScoredRecommendation,
  applyFloorException: boolean,
): boolean {
  if (recommendation !== top && recommendation.heldBelow === top.skill) return false;
  const scoreGap = Math.abs(top.score - recommendation.score);
  if (scoreGap <= AMBIGUITY_MARGIN + Number.EPSILON) return true;
  // The score margin already failed, so a floored member has nothing left to
  // cluster on. Its confidence is the floor, not its own evidence.
  const flooredMember = applyFloorException && recommendation.confidenceFloored === true;
  if (flooredMember) return false;
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
  // A member that answers the top's own route is the same recommendation written
  // twice, so it never counts as the rival that makes the top a coin flip.
  return passing.filter((recommendation) => (
    clustersWithTop(top, recommendation, applyFloorException)
    && !answersSameRoute(top, recommendation)
  ));
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
