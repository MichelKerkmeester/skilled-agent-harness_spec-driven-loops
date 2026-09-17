// ───────────────────────────────────────────────────────────────────
// MODULE: Cycle Detection Public API
// ───────────────────────────────────────────────────────────────────

export {
  CYCLE_BLOCKER_REDUCER_VERSION,
  CYCLE_COVERAGE_REDUCER_VERSION,
  CYCLE_COVERAGE_GAIN_FLOOR_BPS,
  CYCLE_DETECTOR_POLICY,
  CYCLE_DETECTOR_POLICY_VERSION,
  CYCLE_HISTORY_REDUCER_VERSION,
  CYCLE_HISTORY_SCHEMA_VERSION,
  CYCLE_HISTORY_WINDOW,
  CYCLE_MAX_PERIOD,
  CYCLE_MINIMUM_TRAVERSALS,
  CYCLE_OBSERVATION_SCHEMA_VERSION,
  CYCLE_OCCURRENCE_THRESHOLD,
  CYCLE_PROGRESS_GATE_VERSION,
  CYCLE_PROGRESS_SIGNAL_VERSION,
  CYCLE_REPETITION_WINDOW,
  assertCycleDetectorPolicy,
  resolveCycleDetectorPolicy,
} from './cycle-detection-policy.js';
export {
  CycleClaimChangeKinds,
  CycleDetectionError,
  CycleDetectionErrorCodes,
  CycleEvaluationStatuses,
  CycleProgressVerdicts,
  CycleSignatureKinds,
} from './cycle-detection-types.js';
export {
  createCycleBlockerSnapshot,
  createCycleCoverageSnapshot,
  createCycleProgressVector,
  createMissingCycleProgressVector,
  projectCycleObservation,
  verifyCycleObservation,
  verifyCycleProgressVector,
} from './cycle-observation.js';
export {
  applyCycleObservation,
  createCycleHistoryProjection,
  cycleEmptyEvictionChainHash,
  replayCycleHistory,
  restoreCycleHistory,
  verifyCycleHistoryProjection,
} from './cycle-history.js';
export { assessCycleProgress } from './cycle-progress-gate.js';
export { evaluateCycleHistory } from './cycle-detector.js';
export {
  CYCLE_CLEARED_EVENT_TYPE,
  CYCLE_CONFIRMED_EVENT_TYPE,
  CYCLE_HEALTH_CAPABILITY_ID,
  CYCLE_HEALTH_EVENT_VERSION,
  CYCLE_HEALTH_POLICY_ID,
  CYCLE_HEALTH_POLICY_VERSION,
  CYCLE_HEALTH_SHADOW_MODE,
  CYCLE_SUSPECTED_EVENT_TYPE,
  createCycleHealthEventPayload,
  createCycleHealthEventRegistry,
  createCycleHealthPolicyRegistry,
  cycleHealthEventDefinitions,
  cycleHealthWriteContext,
  cycleStoppingClockInput,
  prepareCycleHealthEvent,
  recordCycleHealthEvent,
} from './cycle-health-events.js';
export { observeCycleInShadow } from './cycle-shadow.js';

export type {
  CompleteCycleProgressVector,
  CycleBlockerSnapshot,
  CycleBoundaryInput,
  CycleClaimChange,
  CycleClaimChangeKind,
  CycleClaimFrontierSignaturePayload,
  CycleCompositeSignaturePayload,
  CycleContradictionIdentity,
  CycleCoverageSnapshot,
  CycleDetectorPolicy,
  CycleDetectorSourceVersions,
  CycleEvaluationResult,
  CycleEvaluationStatus,
  CycleEvidence,
  CycleFocusCandidateIdentity,
  CycleFocusFrontierIdentity,
  CycleFocusSignaturePayload,
  CycleHealthEventEnvelopeInput,
  CycleHealthEventPayload,
  CycleHealthRecordResult,
  CycleHealthState,
  CycleHealthWriteContext,
  CycleHistoryEvictionBoundary,
  CycleHistoryProjection,
  CycleIndependentEvidenceRef,
  CycleLedgerCursor,
  CycleObservation,
  CycleObservationSourceEvidence,
  CycleProgressAssessment,
  CycleProgressVector,
  CycleSignature,
  CycleSignatureKind,
  CycleStoppingClockInput,
  CycleTraceEntry,
  MissingCycleProgressVector,
  ProjectCycleObservationInput,
} from './cycle-detection-types.js';
export type { CycleShadowResult } from './cycle-shadow.js';
