// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Reducers Public API
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_AI_COUNCIL_EVENT_ROUTING,
  DEEP_AI_COUNCIL_ORDERING_POLICY_VERSION,
  DEEP_AI_COUNCIL_PROJECTION_CODEC_VERSION,
  DEEP_AI_COUNCIL_PROJECTION_FIELD_OWNERSHIP,
  DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
  DEEP_AI_COUNCIL_REDUCER_ID,
  DEEP_AI_COUNCIL_REDUCER_SET,
  DEEP_AI_COUNCIL_REDUCER_SURFACE,
  DEEP_AI_COUNCIL_REDUCER_VERSION,
  createDeepAiCouncilProjectionState,
  deepAiCouncilProjectionIntegrityDigest,
  foldDeepAiCouncilEvents,
  projectDeepAiCouncilLegacyView,
  reduceDeepAiCouncilVerifiedEvent,
  verifyDeepAiCouncilReducerSurface,
} from './deep-ai-council-reducer.js';
export {
  DeepAiCouncilReducerError,
  assertDeepAiCouncilLegacyProjection,
  assertDeepAiCouncilProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './deep-ai-council-projection-schema.js';

export type * from './deep-ai-council-projection-types.js';
export type { DeepAiCouncilReducerSurface } from './deep-ai-council-reducer.js';
