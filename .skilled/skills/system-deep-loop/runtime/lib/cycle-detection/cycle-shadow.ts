// ───────────────────────────────────────────────────────────────────
// MODULE: Additive-Dark Cycle Observer
// ───────────────────────────────────────────────────────────────────

import { applyCycleObservation } from './cycle-history.js';
import { evaluateCycleHistory } from './cycle-detector.js';
import {
  createCycleHealthEventPayload,
  cycleStoppingClockInput,
} from './cycle-health-events.js';

import type {
  CycleEvaluationResult,
  CycleEvidence,
  CycleHistoryProjection,
  CycleObservation,
  CycleStoppingClockInput,
} from './cycle-detection-types.js';

export interface CycleShadowResult<TAuthoritative> {
  readonly authoritative_result: TAuthoritative;
  readonly history: CycleHistoryProjection;
  readonly evaluation: CycleEvaluationResult;
  readonly stopping_clock_evidence: CycleStoppingClockInput | null;
}

/** Project cycle evidence beside an opaque authoritative result without changing it. */
export function observeCycleInShadow<TAuthoritative>(
  authoritativeResult: TAuthoritative,
  history: Readonly<CycleHistoryProjection>,
  observation: Readonly<CycleObservation>,
  activeCycle: CycleEvidence | null = null,
): CycleShadowResult<TAuthoritative> {
  const nextHistory = applyCycleObservation(history, observation);
  const evaluation = evaluateCycleHistory(nextHistory, activeCycle);
  const stoppingClockEvidence = (
    evaluation.status === 'cycle_suspected'
    || evaluation.status === 'cycle_confirmed'
    || evaluation.status === 'cycle_cleared'
  )
    ? cycleStoppingClockInput(createCycleHealthEventPayload(
        evaluation,
        observation.run_lineage_id,
      ))
    : null;
  return Object.freeze({
    authoritative_result: authoritativeResult,
    history: nextHistory,
    evaluation,
    stopping_clock_evidence: stoppingClockEvidence,
  });
}
