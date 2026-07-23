// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Shadow Parity Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_RESEARCH_COMPARATOR_VERSION,
  DEEP_RESEARCH_LIFECYCLE_EVENT_MAP,
  DEEP_RESEARCH_MODE_GATE_INPUT_VERSION,
  DEEP_RESEARCH_PARITY_PROJECTION_VERSION,
  DEEP_RESEARCH_REQUIRED_FIXTURE_SCENARIOS,
  DEEP_RESEARCH_SHADOW_PARITY_SCHEMA_VERSION,
  DEEP_RESEARCH_VOLATILITY_ALLOWLIST,
  DeepResearchResumeParityDivergenceError,
  canonicalizeDeepResearchEventStream,
  compareDeepResearchEventStreams,
  compileDeepResearchParityManifest,
  createDeepResearchModeGateInput,
  createDeepResearchLegacyResumeOracle,
  createDeepResearchParityCaseDefinition,
  createDeepResearchParityExecutors,
  deepResearchParityInitialStateDigest,
  driveDeepResearchResumeParity,
  parseDeepResearchModeGateInput,
  parseDeepResearchParityReceipt,
  runDeepResearchParityCase,
  runDeepResearchParitySuite,
  verifyDeepResearchLifecycleEventMap,
} from './harness-adapter.js';

export type * from './types.js';
