// ───────────────────────────────────────────────────────────────────
// MODULE: Mixed-Version Fixtures Public API
// ───────────────────────────────────────────────────────────────────

export {
  MixedVersionCompatibilityAdapter,
  createMixedVersionCompatibilityAdapter,
  createMixedVersionEventDefinition,
  createMixedVersionStateDefinition,
} from './compatibility-adapter.js';
export {
  MIXED_VERSION_BASE_SHA,
  MIXED_VERSION_CONTRACT_DIGEST,
  MIXED_VERSION_EVENT_TYPE,
  MIXED_VERSION_INTERFACE_VERSION,
  MIXED_VERSION_SCENARIOS,
  PHASE_013_WORKSTREAMS,
  assertAuthoredMixedVersionCase,
  assertManifestWorkstreamCoverage,
  createMixedVersionCorpus,
} from './fixture-corpus.js';
export {
  assertResumeClassification,
  createFrozenInflightResumeClassifier,
  runMixedVersionOracle,
} from './reducer-resume-oracle.js';
export {
  compileMixedVersionCase,
  compileMixedVersionCorpus,
  replaceCapsuleReference,
  verifyCompiledMixedVersionCase,
} from './seal-compiler.js';
export {
  MixedVersionFixtureError,
  MixedVersionFixtureErrorCodes,
} from './mixed-version-types.js';

export type {
  AuthoredMixedVersionOutcome,
  AuthoredStateTransition,
  CompiledMixedVersionCase,
  MixedVersionCase,
  MixedVersionCausalBoundary,
  MixedVersionCompatibilityObservation,
  MixedVersionCompatibilityPort,
  MixedVersionCorpus,
  MixedVersionEventInput,
  MixedVersionExecutionContext,
  MixedVersionFixtureErrorCode,
  MixedVersionOracleFailure,
  MixedVersionOracleInput,
  MixedVersionOraclePass,
  MixedVersionOracleResult,
  MixedVersionReducerExecutor,
  MixedVersionReducerObservation,
  MixedVersionReplayInputs,
  MixedVersionRestartLease,
  MixedVersionRestartMetadata,
  MixedVersionRestartReceipt,
  MixedVersionResumeClassification,
  MixedVersionResumeClassifierConfig,
  MixedVersionScenarioFamily,
  MixedVersionStateInput,
  SealedMixedVersionInput,
} from './mixed-version-types.js';
