// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Reducers Public API
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_IMPROVEMENT_COMMON_EVENT_ROUTING,
  DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH,
  DEEP_IMPROVEMENT_COMMON_ORDERING_POLICY_VERSION,
  DEEP_IMPROVEMENT_COMMON_PROJECTION_CODEC_VERSION,
  DEEP_IMPROVEMENT_COMMON_PROJECTION_FIELD_OWNERSHIP,
  DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
  DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
  DEEP_IMPROVEMENT_COMMON_REDUCER_SET,
  DEEP_IMPROVEMENT_COMMON_REDUCER_SURFACE,
  DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
  createDeepImprovementCommonProjectionState,
  deepImprovementCommonProjectionIntegrityDigest,
  foldDeepImprovementCommonEvents,
  projectDeepImprovementCommonCandidateView,
  projectDeepImprovementCommonLegacyView,
  reduceDeepImprovementCommonVerifiedEvent,
  verifyDeepImprovementCommonReducerSurface,
} from './deep-improvement-common-reducer.js';
export {
  DeepImprovementCommonReducerError,
  assertDeepImprovementCommonCandidateView,
  assertDeepImprovementCommonLegacyProjection,
  assertDeepImprovementCommonProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './deep-improvement-common-projection-schema.js';

export type * from './deep-improvement-common-projection-types.js';
export type {
  DeepImprovementCommonFoldBranch,
  DeepImprovementCommonReducerSurface,
} from './deep-improvement-common-reducer.js';
