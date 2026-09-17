// ───────────────────────────────────────────────────────────────────
// MODULE: Health Degeneration Harness Public API
// ───────────────────────────────────────────────────────────────────

export {
  ModeHealthAdapterRegistry,
  adaptBudgetLifecyclePressure,
  adaptBudgetPressure,
  adaptCycleEvent,
  adaptFrontier,
  adaptProgress,
  adaptQuality,
  adaptSemanticConcentration,
  createNormalizedHealthInputs,
  inputFieldName,
  readCommittedProjectionGauge,
} from './health-adapters.js';
export {
  DEFAULT_HEALTH_POLICY,
  HEALTH_POLICY_VERSION,
  HealthPolicyRegistry,
  createDefaultHealthPolicyRegistry,
  createHealthPolicy,
} from './health-policy.js';
export {
  HEALTH_OBSERVATION_PROJECTOR_VERSION,
  HealthObservationProjector,
  adapterManifest,
  createHealthProjectionState,
  isBudgetPressure,
  observeHealthInShadow,
  replayHealthObservations,
  restoreHealthProjectionState,
} from './health-observation-projector.js';
export {
  HealthAggregateStates,
  HealthHarnessError,
  HealthHarnessErrorCodes,
  HealthInputFields,
  HealthResponseActions,
  HealthSeverities,
  HealthSignalKinds,
} from './health-harness-types.js';

export type {
  BudgetLifecyclePressureInput,
  ProjectionGaugeRead,
} from './health-adapters.js';
export type {
  BudgetPressureDimension,
  BudgetPressureHealthObservation,
  BudgetPressureKind,
  FrontierHealthObservation,
  FrontierStatus,
  HealthAggregate,
  HealthAggregateState,
  HealthBoundaryInput,
  HealthDeduplicationRecord,
  HealthHarnessErrorCode,
  HealthInputAvailability,
  HealthInputField,
  HealthLedgerCursor,
  HealthObservation,
  HealthPolicy,
  HealthProjectionBinding,
  HealthProjectionResult,
  HealthProjectionState,
  HealthRequestedScope,
  HealthResponseAction,
  HealthResponseRequest,
  HealthSeverity,
  HealthShadowResult,
  HealthSignal,
  HealthSignalKind,
  HealthSignalScope,
  HealthSourceProvenance,
  HealthValidationIssue,
  ModeHealthAdapterDefinition,
  NormalizedHealthInputs,
  ProgressHealthObservation,
  QualityHealthObservation,
  RegisteredModeHealthAdapter,
  SemanticConcentrationObservation,
} from './health-harness-types.js';
