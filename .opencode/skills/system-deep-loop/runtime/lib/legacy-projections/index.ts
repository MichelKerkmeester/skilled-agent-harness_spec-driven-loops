// ───────────────────────────────────────────────────────────────────
// MODULE: Legacy Projection Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

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
  LEGACY_PROJECTION_MANIFEST,
  LEGACY_PROJECTION_MANIFEST_DIGEST,
  requireProjectableManifestEntry,
  validateLegacyProjectionManifest,
} from './legacy-projection-manifest.js';
export { LegacyProjectionEngine } from './legacy-projection-engine.js';
export { ShadowProjectionStore } from './shadow-projection-store.js';

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
  LegacyProjectionWatermark,
} from './legacy-projection-types.js';
