// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Shadow Parity Public API
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_ALIGNMENT_COMPARATOR_VERSION,
  DEEP_ALIGNMENT_LIFECYCLE_EVENT_MAP,
  DEEP_ALIGNMENT_MODE_GATE_INPUT_VERSION,
  DEEP_ALIGNMENT_PARITY_PROJECTION_VERSION,
  DEEP_ALIGNMENT_REQUIRED_FIXTURE_SCENARIOS,
  DEEP_ALIGNMENT_SHADOW_PARITY_SCHEMA_VERSION,
  DEEP_ALIGNMENT_VOLATILITY_ALLOWLIST,
  DeepAlignmentResumeParityDivergenceError,
  canonicalizeDeepAlignmentEventStream,
  compareDeepAlignmentEventStreams,
  compileDeepAlignmentParityManifest,
  createDeepAlignmentModeGateInput,
  createDeepAlignmentLegacyResumeOracle,
  createDeepAlignmentParityCaseDefinition,
  createDeepAlignmentParityExecutors,
  deepAlignmentParityInitialStateDigest,
  driveDeepAlignmentResumeParity,
  parseDeepAlignmentModeGateInput,
  parseDeepAlignmentParityReceipt,
  runDeepAlignmentParityCase,
  runDeepAlignmentParitySuite,
  verifyDeepAlignmentLifecycleEventMap,
  verifyDeepAlignmentParityModeCertificate,
} from './harness-adapter.js';

export type * from './types.js';
