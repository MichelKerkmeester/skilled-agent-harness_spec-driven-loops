// ───────────────────────────────────────────────────────────────────
// MODULE: Partial Failure Ledger Replay
// ───────────────────────────────────────────────────────────────────

import {
  DEGRADED_RESULT_EVENT_TYPE,
  LATE_RESULT_EXCLUDED_EVENT_TYPE,
  PARTIAL_FAILURE_ABORT_EVENT_TYPE,
  POLICY_EVALUATION_EVENT_TYPE,
  POLICY_SHADOW_COMPARISON_EVENT_TYPE,
  TERMINAL_FAILURE_EVENT_TYPE,
  isAbortMarker,
  isDegradedResultMarker,
  isLateResultRecord,
  isPolicyEvaluationReceipt,
  isPolicyShadowComparisonReceipt,
} from './ledger-events.js';
import { isTerminalFailureEnvelope } from './failure.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  AbortMarker,
  DegradedResultMarker,
  LateResultRecord,
  PolicyEvaluationReceipt,
  PolicyShadowComparisonReceipt,
  TerminalFailureEnvelope,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

export interface PartialFailureReplayProjection {
  readonly abortMarker: AbortMarker | null;
  readonly degradedMarker: DegradedResultMarker | null;
  readonly duplicateEventCount: number;
  readonly finalEvaluation: PolicyEvaluationReceipt | null;
  readonly integrityReasonCodes: readonly string[];
  readonly lateResults: readonly LateResultRecord[];
  readonly latestEvaluation: PolicyEvaluationReceipt | null;
  readonly shadowComparisons: readonly PolicyShadowComparisonReceipt[];
  readonly terminalFailures: readonly TerminalFailureEnvelope[];
}

// ───────────────────────────────────────────────────────────────────
// 2. REPLAY
// ───────────────────────────────────────────────────────────────────

/** Fold verified append-only evidence while preserving the first closed-epoch verdict. */
export function replayPartialFailureLedger(
  events: readonly VerifiedLedgerEvent[],
  decisionEpochId?: string,
): PartialFailureReplayProjection {
  const ordered = [...events].sort((left, right) => left.frame.sequence - right.frame.sequence);
  const eventDigests = new Map<string, string>();
  const failures = new Map<string, TerminalFailureEnvelope>();
  const lateResults = new Map<string, LateResultRecord>();
  const shadowComparisons = new Map<string, PolicyShadowComparisonReceipt>();
  const integrityReasonCodes = new Set<string>();
  let duplicateEventCount = 0;
  let latestEvaluation: PolicyEvaluationReceipt | null = null;
  let finalEvaluation: PolicyEvaluationReceipt | null = null;
  let degradedMarker: DegradedResultMarker | null = null;
  let abortMarker: AbortMarker | null = null;

  for (const verified of ordered) {
    const envelope = verified.event.effective.envelope;
    const priorDigest = eventDigests.get(envelope.event_id);
    if (priorDigest !== undefined) {
      if (priorDigest === verified.event.stored.digest) {
        duplicateEventCount += 1;
      } else {
        integrityReasonCodes.add('event_identity_collision');
      }
      continue;
    }
    eventDigests.set(envelope.event_id, verified.event.stored.digest);
    const payload = envelope.payload;

    if (envelope.event_type === TERMINAL_FAILURE_EVENT_TYPE) {
      if (!isTerminalFailureEnvelope(payload)) {
        integrityReasonCodes.add('invalid_terminal_failure_event');
        continue;
      }
      if (decisionEpochId !== undefined && payload.decision_epoch_id !== decisionEpochId) continue;
      failures.set(payload.failure_id, payload);
      continue;
    }

    if (envelope.event_type === POLICY_EVALUATION_EVENT_TYPE) {
      if (!isPolicyEvaluationReceipt(payload)) {
        integrityReasonCodes.add('invalid_policy_evaluation_event');
        continue;
      }
      if (decisionEpochId !== undefined && payload.decision_epoch_id !== decisionEpochId) continue;
      latestEvaluation = payload;
      if (payload.finality === 'final') {
        if (finalEvaluation === null) {
          finalEvaluation = payload;
        } else if (finalEvaluation.receipt_id !== payload.receipt_id) {
          integrityReasonCodes.add('closed_epoch_rewrite_attempt');
        }
      }
      continue;
    }

    if (envelope.event_type === DEGRADED_RESULT_EVENT_TYPE) {
      if (!isDegradedResultMarker(payload)) {
        integrityReasonCodes.add('invalid_degraded_marker_event');
        continue;
      }
      if (
        finalEvaluation !== null
        && payload.policy_evaluation_receipt_id === finalEvaluation.receipt_id
      ) {
        degradedMarker = payload;
      }
      continue;
    }

    if (envelope.event_type === PARTIAL_FAILURE_ABORT_EVENT_TYPE) {
      if (!isAbortMarker(payload)) {
        integrityReasonCodes.add('invalid_abort_marker_event');
        continue;
      }
      if (
        finalEvaluation !== null
        && payload.policy_evaluation_receipt_id === finalEvaluation.receipt_id
      ) {
        abortMarker = payload;
      }
      continue;
    }

    if (envelope.event_type === LATE_RESULT_EXCLUDED_EVENT_TYPE) {
      if (!isLateResultRecord(payload)) {
        integrityReasonCodes.add('invalid_late_result_event');
        continue;
      }
      if (decisionEpochId !== undefined && payload.decision_epoch_id !== decisionEpochId) continue;
      const existing = [...lateResults.values()].find(
        (late) => late.result_envelope_id === payload.result_envelope_id,
      );
      if (existing !== undefined && existing.result_digest !== payload.result_digest) {
        integrityReasonCodes.add('late_result_identity_collision');
      }
      lateResults.set(payload.late_result_id, payload);
      continue;
    }

    if (envelope.event_type === POLICY_SHADOW_COMPARISON_EVENT_TYPE) {
      if (!isPolicyShadowComparisonReceipt(payload)) {
        integrityReasonCodes.add('invalid_shadow_comparison_event');
        continue;
      }
      shadowComparisons.set(payload.comparison_id, payload);
    }
  }

  if (
    finalEvaluation?.verdict === 'proceed_degraded'
    && degradedMarker?.policy_evaluation_receipt_id !== finalEvaluation.receipt_id
  ) {
    integrityReasonCodes.add('missing_degraded_marker');
  }
  if (
    finalEvaluation?.verdict === 'abort'
    && abortMarker?.policy_evaluation_receipt_id !== finalEvaluation.receipt_id
  ) {
    integrityReasonCodes.add('missing_abort_marker');
  }
  return Object.freeze({
    abortMarker,
    degradedMarker,
    duplicateEventCount,
    finalEvaluation,
    integrityReasonCodes: Object.freeze([...integrityReasonCodes].sort()),
    lateResults: Object.freeze([...lateResults.values()].sort(
      (left, right) => left.late_result_id.localeCompare(right.late_result_id),
    )),
    latestEvaluation,
    shadowComparisons: Object.freeze([...shadowComparisons.values()].sort(
      (left, right) => left.comparison_id.localeCompare(right.comparison_id),
    )),
    terminalFailures: Object.freeze([...failures.values()].sort(
      (left, right) => left.failure_id.localeCompare(right.failure_id),
    )),
  });
}
