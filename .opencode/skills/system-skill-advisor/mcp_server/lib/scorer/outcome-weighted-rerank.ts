// ───────────────────────────────────────────────────────────────
// MODULE: Outcome-Weighted Shadow Re-Rank
// ───────────────────────────────────────────────────────────────
// Ranks skills by `similarity x reliability x penalty` over OBSERVED execution
// outcomes, not metadata similarity alone. This channel is off by default and,
// when wired into the live fused sort, only breaks near-ties — never the broad
// ordering. `reliability` comes from a thin adapter over the shared Beta-posterior
// primitive: an observed skill reads its bounded Beta posterior mean, while a
// skill with no recorded outcomes always reads the neutral fresh value, so an
// empty ledger leaves the blend a monotonic scaling of similarity (no re-order).

import { NEUTRAL_PRIOR, betaPosteriorMean } from './beta-reliability.js';
import type { SkillOutcomeFold } from './skill-outcome-store.js';

export const ADVISOR_OUTCOME_WEIGHTED_RERANK_FLAG = 'SPECKIT_ADVISOR_OUTCOME_WEIGHTED_RERANK';
const TRUE_FLAG_VALUES = new Set(['1', 'true', 'yes', 'on', 'enabled']);

/** Neutral reliability for a fresh skill (no recorded outcomes) and the whole
 * default resolver until the shared Beta primitive is wired. A uniform 0.5
 * preserves similarity order. */
export const FRESH_SKILL_RELIABILITY = 0.5;

export interface SkillReliabilityCounts {
  readonly success: number;
  readonly failure: number;
}

/** Maps folded (success, failure) counts to a reliability in [0,1]. The real
 * implementation is the shared Beta-posterior primitive; this seam lets the
 * advisor consume it without forking the math. */
export type ReliabilityResolver = (counts: SkillReliabilityCounts) => number;

/** Inert seam kept for callers that want a deliberately flat reliability (the
 * blend then equals similarity). Not the production default. */
export const neutralReliabilityResolver: ReliabilityResolver = () => FRESH_SKILL_RELIABILITY;

/** Production resolver: the bounded Beta posterior mean over observed outcomes.
 * Reuses the shared f64 primitive rather than forking the math, so an all-success
 * skill can never reach certainty (anti-flood) and the neutral prior keeps a
 * thin-evidence skill close to the fence. The rerank only consults this for a
 * skill that has recorded outcomes; a fresh skill short-circuits to the neutral
 * value before the resolver runs. */
export const betaReliabilityResolver: ReliabilityResolver = ({ success, failure }) =>
  betaPosteriorMean(NEUTRAL_PRIOR, { successes: success, failures: failure });

export interface OutcomeWeightedCandidate {
  readonly skillId: string;
  /** The live fused similarity score for this skill. */
  readonly similarity: number;
}

export interface OutcomeWeightedRerankOptions {
  /** Folded execution outcomes; absent means every skill is treated as fresh. */
  readonly fold?: SkillOutcomeFold;
  /** Reliability adapter; defaults to the neutral seam. */
  readonly reliabilityResolver?: ReliabilityResolver;
  /** Advisory penalty in (0,1]; defaults to 1.0 (no demotion). Failure-mode
   * recall is surfaced as context, so the penalty stays neutral unless a caller
   * deliberately supplies one. */
  readonly penaltyResolver?: (skillId: string) => number;
}

export interface OutcomeWeightedRanked {
  readonly skillId: string;
  readonly similarity: number;
  readonly reliability: number;
  readonly penalty: number;
  readonly shadowScore: number;
}

export function isAdvisorOutcomeWeightedRerankEnabled(): boolean {
  const value = process.env[ADVISOR_OUTCOME_WEIGHTED_RERANK_FLAG]?.trim().toLowerCase();
  return value ? TRUE_FLAG_VALUES.has(value) : false;
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) {
    return FRESH_SKILL_RELIABILITY;
  }
  return Math.min(1, Math.max(0, value));
}

function clampPenalty(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 1;
  }
  return Math.min(1, value);
}

function round6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

/** Pure shadow re-rank. A fresh skill (no recorded outcomes) always scores at
 * the neutral reliability regardless of the resolver, so an empty store yields
 * a blend that is a monotonic scaling of similarity (no re-order). */
export function outcomeWeightedRerank(
  candidates: readonly OutcomeWeightedCandidate[],
  options: OutcomeWeightedRerankOptions = {},
): OutcomeWeightedRanked[] {
  const resolver = options.reliabilityResolver ?? betaReliabilityResolver;
  const penaltyResolver = options.penaltyResolver ?? (() => 1);
  const fold = options.fold;

  return candidates
    .map((candidate) => {
      const counts = fold?.bySkill[candidate.skillId];
      const reliability = !counts || counts.total === 0
        ? FRESH_SKILL_RELIABILITY
        : clamp01(resolver({ success: counts.success, failure: counts.failure }));
      const penalty = clampPenalty(penaltyResolver(candidate.skillId));
      const shadowScore = round6(candidate.similarity * reliability * penalty);
      return {
        skillId: candidate.skillId,
        similarity: candidate.similarity,
        reliability: round6(reliability),
        penalty: round6(penalty),
        shadowScore,
      };
    })
    .sort((left, right) =>
      right.shadowScore - left.shadowScore
      || left.skillId.localeCompare(right.skillId));
}
