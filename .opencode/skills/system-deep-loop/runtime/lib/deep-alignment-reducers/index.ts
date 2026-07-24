// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Reducers Public API
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_ALIGNMENT_EVENT_ROUTING,
  DEEP_ALIGNMENT_ORDERING_POLICY_VERSION,
  DEEP_ALIGNMENT_PROJECTION_CODEC_VERSION,
  DEEP_ALIGNMENT_PROJECTION_FIELD_OWNERSHIP,
  DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
  DEEP_ALIGNMENT_REDUCER_ID,
  DEEP_ALIGNMENT_REDUCER_SET,
  DEEP_ALIGNMENT_REDUCER_SURFACE,
  DEEP_ALIGNMENT_REDUCER_VERSION,
  DEEP_ALIGNMENT_SHARED_REVIEW_LOOP_CONFIGURATION,
  createDeepAlignmentProjectionState,
  deepAlignmentProjectionIntegrityDigest,
  foldDeepAlignmentEvents,
  projectDeepAlignmentLegacyView,
  reduceDeepAlignmentVerifiedEvent,
  verifyDeepAlignmentReducerSurface,
} from './deep-alignment-reducer.js';
export {
  DeepAlignmentReducerError,
  assertDeepAlignmentLegacyProjection,
  assertDeepAlignmentProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './deep-alignment-projection-schema.js';

export type * from './deep-alignment-projection-types.js';
export type { DeepAlignmentReducerSurface } from './deep-alignment-reducer.js';
