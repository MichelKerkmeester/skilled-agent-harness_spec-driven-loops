// ───────────────────────────────────────────────────────────────────
// MODULE: Conditional Fan-In Shadow Adapter
// ───────────────────────────────────────────────────────────────────

import { evaluateAwaitPredicate, finalizeFanInDecisionCandidate } from './decision.js';

import type {
  AwaitPredicateResult,
  FanInDecisionView,
  FinalizedFanInDecision,
} from './types.js';

/** A shadow evaluation: what the conditional fan-in would decide while wait-for-all stays in charge. */
export interface ConditionalFanInShadowEvaluation {
  readonly authority: 'shadow';
  readonly legacyWaitForAllAuthoritative: true;
  readonly predicate: AwaitPredicateResult;
  readonly candidateDecision: FinalizedFanInDecision | null;
}

/**
 * Evaluate the conditional fan-in in shadow: the await predicate plus, when it would not wait, the
 * candidate decision, while wait-for-all stays authoritative.
 */
export function evaluateConditionalFanInShadow(
  view: FanInDecisionView,
): ConditionalFanInShadowEvaluation {
  const predicate = evaluateAwaitPredicate(view);
  return Object.freeze({
    authority: 'shadow',
    legacyWaitForAllAuthoritative: true,
    predicate,
    candidateDecision: predicate.shouldAwait
      ? null
      : finalizeFanInDecisionCandidate(view),
  });
}
