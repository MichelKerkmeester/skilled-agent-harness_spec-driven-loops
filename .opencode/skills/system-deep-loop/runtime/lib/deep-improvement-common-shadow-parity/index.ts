// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Shadow Parity Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
  DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP,
  DEEP_IMPROVEMENT_COMMON_MODE_GATE_INPUT_VERSION,
  DEEP_IMPROVEMENT_COMMON_PARITY_PROJECTION_VERSION,
  DEEP_IMPROVEMENT_COMMON_REQUIRED_FIXTURE_SCENARIOS,
  DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT,
  DEEP_IMPROVEMENT_COMMON_SHADOW_PARITY_SCHEMA_VERSION,
  DEEP_IMPROVEMENT_COMMON_VOLATILITY_ALLOWLIST,
  DeepImprovementCommonResumeParityDivergenceError,
  canonicalizeDeepImprovementCommonEventStream,
  compareDeepImprovementCommonEventStreams,
  compileDeepImprovementCommonParityManifest,
  createDeepImprovementCommonModeGateInput,
  createDeepImprovementCommonLegacyResumeOracle,
  createDeepImprovementCommonParityCaseDefinition,
  createDeepImprovementCommonParityExecutors,
  deepImprovementCommonParityInitialStateDigest,
  driveDeepImprovementCommonResumeParity,
  parseDeepImprovementCommonModeGateInput,
  parseDeepImprovementCommonParityReceipt,
  runDeepImprovementCommonParityCase,
  runDeepImprovementCommonParitySuite,
  verifyDeepImprovementCommonLifecycleEventMap,
} from './harness-adapter.js';

export type * from './types.js';
