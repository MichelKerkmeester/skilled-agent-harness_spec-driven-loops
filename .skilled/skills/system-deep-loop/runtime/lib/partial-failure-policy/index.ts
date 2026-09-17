// ───────────────────────────────────────────────────────────────────
// MODULE: Partial Failure Policy Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  ABORT_EVENT_NAME,
  DEGRADED_RESULT_EVENT_NAME,
  LATE_RESULT_EVENT_NAME,
  MAX_RETRY_DIAGNOSTICS,
  POLICY_EVALUATION_EVENT_NAME,
  evaluatePartialFailurePolicy,
} from './evaluator.js';
export {
  FailureClassStage,
  MAX_ARTIFACT_REFERENCES,
  MAX_ATTEMPT_EVENT_IDS,
  MAX_DIAGNOSTIC_SUMMARY_LENGTH,
  TERMINAL_FAILURE_EVENT_NAME,
  buildDeadlineFailureEnvelope,
  buildIntegrityFailureEnvelope,
  buildTerminalFailureEnvelope,
  classifyTerminalResultFailure,
  isTerminalFailureEnvelope,
} from './failure.js';
export {
  DEGRADED_RESULT_EVENT_TYPE,
  LATE_RESULT_EXCLUDED_EVENT_TYPE,
  PARTIAL_FAILURE_ABORT_EVENT_TYPE,
  PARTIAL_FAILURE_EVENT_VERSION,
  POLICY_EVALUATION_EVENT_TYPE,
  POLICY_SHADOW_COMPARISON_EVENT_TYPE,
  TERMINAL_FAILURE_EVENT_TYPE,
  createPartialFailurePolicyEventRegistry,
  isAbortMarker,
  isDegradedResultMarker,
  isLateResultRecord,
  isPolicyEvaluationReceipt,
  isPolicyShadowComparisonReceipt,
  partialFailurePolicyEventDefinitions,
  preparePolicyEvaluationEvent,
  preparePolicyShadowComparisonEvent,
  prepareTerminalFailureEvent,
  recordPartialFailureEvaluation,
  recordPolicyShadowComparison,
} from './ledger-events.js';
export {
  DEFAULT_PARTIAL_FAILURE_POLICY_ID,
  DEFAULT_PARTIAL_FAILURE_POLICY_VERSION,
  MAX_ADMITTED_BRANCHES,
  PARTIAL_FAILURE_POLICY_SCHEMA_VERSION,
  defaultPartialFailurePolicy,
  freezeAdmittedSet,
  partialFailurePolicyDigest,
  partialFailurePolicyReference,
  requiredSuccessCount,
  toleratedFailureCeiling,
  validateAdmittedSet,
  validatePartialFailurePolicy,
} from './policy.js';
export { replayPartialFailureLedger } from './replay.js';
export {
  POLICY_SHADOW_COMPARISON_EVENT_NAME,
  evaluatePartialFailurePolicyDark,
} from './shadow.js';

export type { PartialFailureReplayProjection } from './replay.js';
export type * from './types.js';
