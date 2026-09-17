// ───────────────────────────────────────────────────────────────────
// MODULE: Legacy Projection Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  createDeepResearchProjectionContract,
} from './deep-research-contract.js';
export {
  createDeepResearchDeltasProjectionContract,
} from './deep-research-deltas-contract.js';
export {
  createDeepResearchProjectionsProjectionContract,
} from './deep-research-projections-contract.js';
export {
  createDeepAiCouncilConfigStateProjectionContract,
} from './deep-ai-council-config-state-contract.js';
export {
  createDeepImprovementLedgersProjectionContract,
} from './deep-improvement-ledgers-contract.js';
export {
  createDeepReviewDeltasProjectionContract,
} from './deep-review-deltas-contract.js';
export {
  createDeepReviewProjectionsProjectionContract,
} from './deep-review-projections-contract.js';
export {
  createDeepReviewStateProjectionContract,
} from './deep-review-state-contract.js';
export {
  LegacyProjectionError,
  LegacyProjectionErrorCodes,
} from './legacy-projection-errors.js';
export {
  foldLegacyProjection,
  legacyProjectionDigest,
  serializeLegacyJson,
  serializeLegacyJsonl,
} from './legacy-projection-fold.js';
export {
  foldLegacyProjectionSurface,
} from './legacy-projection-surface-fold.js';
export type {
  FoldedSurfaceArtifact,
} from './legacy-projection-surface-fold.js';
export {
  LEGACY_PROJECTION_MANIFEST,
  LEGACY_PROJECTION_MANIFEST_DIGEST,
  requireProjectableManifestEntry,
  validateLegacyProjectionManifest,
} from './legacy-projection-manifest.js';
export { LegacyProjectionEngine } from './legacy-projection-engine.js';
export { ShadowProjectionStore } from './shadow-projection-store.js';

export type {
  CreateDeepResearchProjectionContractOptions,
  DeepResearchProjectionState,
} from './deep-research-contract.js';
export type {
  CreateDeepResearchDeltasProjectionContractOptions,
  DeepResearchDeltasProjectionState,
} from './deep-research-deltas-contract.js';
export type {
  CreateDeepResearchProjectionsProjectionContractOptions,
  DeepResearchProjectionsProjectionState,
} from './deep-research-projections-contract.js';
export type {
  CreateDeepAiCouncilConfigStateProjectionContractOptions,
  CouncilStateProjectionState,
  CouncilSessionStateProjectionState,
} from './deep-ai-council-config-state-contract.js';
export type {
  CreateDeepImprovementLedgersProjectionContractOptions,
  DeepImprovementLedgersProjectionState,
} from './deep-improvement-ledgers-contract.js';
export type {
  CreateDeepReviewDeltasProjectionContractOptions,
  DeepReviewDeltasProjectionState,
} from './deep-review-deltas-contract.js';
export type {
  CreateDeepReviewProjectionsProjectionContractOptions,
  DeepReviewProjectionsProjectionState,
} from './deep-review-projections-contract.js';
export type {
  CreateDeepReviewStateProjectionContractOptions,
  DeepReviewProjectionState,
} from './deep-review-state-contract.js';

export type {
  LegacyCensusDisposition,
  LegacyCensusSurfaceFormat,
  LegacyProjectionManifestEntry,
} from './legacy-projection-manifest.js';
export type {
  FoldedLegacyProjection,
  LegacyProjectionBase,
  LegacyProjectionContract,
  LegacyProjectionEngineOptions,
  LegacyProjectionFaultInjection,
  LegacyProjectionFormat,
  LegacyProjectionObservation,
  LegacyProjectionReceipt,
  LegacyProjectionRefreshBoundary,
  LegacyProjectionRequest,
  LegacyProjectionResult,
  LegacyProjectionSurfaceContract,
  LegacyProjectionWatermark,
} from './legacy-projection-types.js';
