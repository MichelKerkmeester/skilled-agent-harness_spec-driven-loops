// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Shadow Parity Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_REVIEW_COMPARATOR_VERSION,
  DEEP_REVIEW_LIFECYCLE_EVENT_MAP,
  DEEP_REVIEW_MODE_GATE_INPUT_VERSION,
  DEEP_REVIEW_PARITY_PROJECTION_VERSION,
  DEEP_REVIEW_REQUIRED_FIXTURE_SCENARIOS,
  DEEP_REVIEW_SHADOW_PARITY_SCHEMA_VERSION,
  DEEP_REVIEW_VOLATILITY_ALLOWLIST,
  DeepReviewResumeParityDivergenceError,
  canonicalizeDeepReviewEventStream,
  compareDeepReviewEventStreams,
  compileDeepReviewParityManifest,
  createDeepReviewModeGateInput,
  createDeepReviewLegacyResumeOracle,
  createDeepReviewParityCaseDefinition,
  createDeepReviewParityExecutors,
  deepReviewParityInitialStateDigest,
  driveDeepReviewResumeParity,
  parseDeepReviewModeGateInput,
  parseDeepReviewParityReceipt,
  runDeepReviewParityCase,
  runDeepReviewParitySuite,
  verifyDeepReviewLifecycleEventMap,
  verifyDeepReviewParityModeCertificate,
} from './harness-adapter.js';

export type * from './types.js';
