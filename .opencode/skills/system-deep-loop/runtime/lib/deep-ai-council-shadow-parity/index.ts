// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Shadow Parity Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_AI_COUNCIL_COMPARATOR_VERSION,
  DEEP_AI_COUNCIL_LIFECYCLE_EVENT_MAP,
  DEEP_AI_COUNCIL_MODE_GATE_INPUT_VERSION,
  DEEP_AI_COUNCIL_PARITY_PROJECTION_VERSION,
  DEEP_AI_COUNCIL_REQUIRED_FIXTURE_SCENARIOS,
  DEEP_AI_COUNCIL_SHADOW_PARITY_SCHEMA_VERSION,
  DEEP_AI_COUNCIL_VOLATILITY_ALLOWLIST,
  DeepAiCouncilResumeParityDivergenceError,
  canonicalizeDeepAiCouncilEventStream,
  compareDeepAiCouncilEventStreams,
  compileDeepAiCouncilParityManifest,
  createDeepAiCouncilModeGateInput,
  createDeepAiCouncilLegacyResumeOracle,
  createDeepAiCouncilParityCaseDefinition,
  createDeepAiCouncilParityExecutors,
  deepAiCouncilParityInitialStateDigest,
  driveDeepAiCouncilResumeParity,
  parseDeepAiCouncilModeGateInput,
  parseDeepAiCouncilParityReceipt,
  runDeepAiCouncilParityCase,
  runDeepAiCouncilParitySuite,
  verifyDeepAiCouncilLifecycleEventMap,
  verifyDeepAiCouncilParityModeCertificate,
} from './harness-adapter.js';

export type * from './types.js';
