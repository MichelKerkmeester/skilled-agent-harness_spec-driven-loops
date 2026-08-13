// ───────────────────────────────────────────────────────────────────
// MODULE: Contracts Public API
// ───────────────────────────────────────────────────────────────────

export {
  CaptureMethods,
  ConfidenceStates,
  ContractKinds,
  RuntimeIds,
  SanitizationStatuses,
} from './common.js';
export { ContextAbsentReasons, PrivacyClasses, PrivacyReasonCodes } from './context.js';
export { ErrorOutcomeCodes } from './error-record.js';
export { ContractErrorCodes, ContractValidationError } from './errors.js';
export {
  EvaluationDimensionNames,
  TelemetryEventNames,
  TelemetryReasonCodes,
} from './evidence.js';
export { EventKinds, EventPhases, TerminalStatuses } from './event.js';
export {
  createExactOriginalRecord,
  createSha256Digest,
  decodeExactOriginal,
  verifyExactOriginal,
} from './exact-original.js';
export { RuntimeFixtureClasses } from './fixture.js';
export { ProjectionReasonCodes } from './projection.js';
export { ProviderCapabilityNames, ProviderProtocols } from './provider.js';
export { UnsupportedControlBehaviors } from './prompt.js';
export { assertValidContract, isContractKind, validateContract } from './registry.js';
export {
  validateBenchmarkRecord,
  validateErrorRecord,
  validateEvaluationManifest,
  validateTelemetryEvent,
} from './validate-evidence.js';
export {
  validateEventEnvelope,
  validateEventStream,
  validateExactOriginal,
} from './validate-event.js';
export {
  validateBoundedContext,
  validatePrivacyDecision,
  validateProjectionOutcome,
  validatePromptProfile,
  validateProviderRecord,
} from './validate-policy.js';

export type {
  CaptureMethod,
  ConfidenceState,
  ContractHeader,
  ContractKind,
  FixtureProvenance,
  JsonObject,
  JsonPrimitive,
  JsonValue,
  RuntimeId,
  SanitizationStatus,
  ValidationFailure,
  ValidationIssue,
  ValidationResult,
  ValidationSuccess,
} from './common.js';
export type {
  BoundedContextRecord,
  ContextAbsentReason,
  ContextTruncation,
  PrivacyClass,
  PrivacyDecision,
  PrivacyReasonCode,
  SelectedContextMessage,
  TranscriptFreshness,
} from './context.js';
export type { ContractErrorRecord, ErrorOutcomeCode } from './error-record.js';
export type { ContractErrorCode } from './errors.js';
export type {
  BaselineVarianceInput,
  BenchmarkEnvironment,
  BenchmarkRecord,
  EvaluationCorpusCase,
  EvaluationDimensionName,
  EvaluationManifest,
  EvaluationRubricDimension,
  EvaluationSampleSizeRule,
  TelemetryByteCounts,
  TelemetryDurations,
  TelemetryEvent,
  TelemetryEventName,
  TelemetryReasonCode,
} from './evidence.js';
export type {
  EventEnvelope,
  EventKind,
  EventOrder,
  EventPhase,
  TerminalStatus,
} from './event.js';
export type { ExactOriginalRecord } from './exact-original.js';
export type {
  ContractFixtureCase,
  FixtureCaseMetadata,
  RuntimeFixtureCase,
  RuntimeFixtureClass,
} from './fixture.js';
export type {
  AcceptedProjection,
  ExactOriginalFallback,
  ProjectionBase,
  ProjectionCandidate,
  ProjectionOutcome,
  ProjectionReasonCode,
  RejectedProjection,
} from './projection.js';
export type {
  ProviderCapability,
  ProviderCapabilityName,
  ProviderFallbackPolicy,
  ProviderProtocol,
  ProviderRecord,
} from './provider.js';
export type {
  PromptProfileRecord,
  ProviderControlMapping,
  UnsupportedControlBehavior,
} from './prompt.js';
export type { ContractRecord } from './registry.js';
