import { evaluateAwaitPredicate, finalizeFanInDecisionCandidate } from './decision.js';

import type {
  AwaitPredicateResult,
  FanInDecisionView,
  FinalizedFanInDecision,
} from './types.js';

export interface ConditionalFanInShadowEvaluation {
  readonly authority: 'shadow';
  readonly legacyWaitForAllAuthoritative: true;
  readonly predicate: AwaitPredicateResult;
  readonly candidateDecision: FinalizedFanInDecision | null;
}

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
