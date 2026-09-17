// ───────────────────────────────────────────────────────────────────
// MODULE: Blinded Adjudication Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  ADJUDICATION_MODE,
  ADJUDICATION_PRESENTATION_POLICY_VERSION,
  ADJUDICATION_PROJECTION_SCHEMA_VERSION,
  ADJUDICATION_REDUCER_VERSION,
  ADJUDICATION_REQUEST_VERSION,
  ADJUDICATION_TRANSITION_POLICY_ID,
  ADJUDICATION_TRANSITION_POLICY_VERSION,
  AdjudicationDecisionKinds,
  AdjudicationError,
  AdjudicationErrorCodes,
  AdjudicationStatuses,
  AssignmentOrders,
  CounterfactualKinds,
  CounterfactualOutcomes,
  JudgmentOutcomes,
  REQUIRED_COUNTERFACTUALS_BY_DECISION_KIND,
  adjudicationEvidenceId,
  digestCandidateContent,
} from './contracts.js';
export {
  BlindingRegistrar,
  CandidateIdentityVault,
  adjudicationPairId,
} from './blinding.js';
export {
  AdjudicationCapabilities,
  AdjudicationEventTypes,
  CAPABILITY_BY_ADJUDICATION_EVENT,
  createAdjudicationEventPayload,
  createAdjudicationEventRegistry,
  createAdjudicationTransitionPolicyRegistry,
} from './event-registry.js';
export {
  counterfactualEventData,
  adjudicationVerdictEvidenceId,
  judgeProfileEventData,
  rawJudgmentEventData,
  reductionEventData,
  requestEventData,
  verdictEventData,
} from './event-data.js';
export {
  evaluateCounterfactual,
  measureEffectiveIndependence,
} from './judging.js';
export { reduceAdjudication } from './reducer.js';
export {
  EMPTY_ADJUDICATION_REPLAY_PROJECTION,
  createAdjudicationReducerRegistry,
  createAdjudicationReplayComponentRegistry,
  createAdjudicationReplayInput,
  deriveAdjudicationReplayFingerprint,
  readAdjudicationEvents,
  verifyAdjudicationVerdictReplay,
} from './replay.js';
export {
  adaptCouncilVerdict,
  adaptDeepReviewVerdict,
  adaptImprovementVerdict,
  adaptModelBenchmarkVerdict,
  adaptSkillBenchmarkVerdict,
  createCouncilAdjudicationRequest,
  createDeepReviewAdjudicationRequest,
  createImprovementAdjudicationRequest,
  createModelBenchmarkAdjudicationRequest,
  createSkillBenchmarkAdjudicationRequest,
  joinModelBenchmarkCost,
} from './mode-adapters.js';
export { BlindedAdjudicationService } from './service.js';
export {
  assertClosedKeys,
  isPlainRecord,
  requireCounterfactualToken,
  requireDigest,
  requireFiniteUnitInterval,
  requireIdentity,
  normalizeCandidateContentForJudging,
  validateAdjudicationRequest,
  validateCandidateRegistration,
  validateJudgeProfile,
  validateJudgeSubmission,
} from './validation.js';

export type {
  AdjudicationDecisionKind,
  AdjudicationErrorCode,
  AdjudicationReduction,
  AdjudicationRequest,
  AdjudicationStatus,
  AdjudicationVerdict,
  AssignmentOrder,
  BlindedCandidateView,
  CandidateRegistration,
  CounterfactualCue,
  CounterfactualKind,
  CounterfactualOutcome,
  CounterfactualResult,
  EffectiveIndependenceEvidence,
  IndependenceCluster,
  JudgeAssignment,
  JudgePresentationTransformation,
  JudgeProfile,
  JudgeSubmission,
  JudgmentOutcome,
  ModeAdjudicationInput,
  PairwiseGraphEdge,
  PresentationTransformation,
  RawJudgment,
} from './contracts.js';
export type {
  BlindedPresentationEvidence,
  DeblindedIdentity,
} from './blinding.js';
export type {
  AdjudicationEventPayload,
  AdjudicationEventType,
  AdjudicationPolicyVersions,
} from './event-registry.js';
export type {
  AdjudicationReplayProjection,
  TypedAdjudicationEvent,
} from './replay.js';
export type {
  ModelBenchmarkCostJoin,
  ModeRequestInput,
} from './mode-adapters.js';
export type {
  AuthenticatedDeblindingAuthorization,
  BlindedAdjudicationServiceOptions,
  DeblindingAuthorizationRequest,
} from './service.js';
