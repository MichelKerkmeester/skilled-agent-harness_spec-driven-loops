// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Reducers Public API
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_RESEARCH_EVENT_ROUTING,
  DEEP_RESEARCH_ORDERING_POLICY_VERSION,
  DEEP_RESEARCH_PROJECTION_CODEC_VERSION,
  DEEP_RESEARCH_PROJECTION_FIELD_OWNERSHIP,
  DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
  DEEP_RESEARCH_REDUCER_ID,
  DEEP_RESEARCH_REDUCER_SET,
  DEEP_RESEARCH_REDUCER_SURFACE,
  DEEP_RESEARCH_REDUCER_VERSION,
  createDeepResearchProjectionState,
  deepResearchProjectionIntegrityDigest,
  foldDeepResearchEvents,
  projectDeepResearchLegacyView,
  reduceDeepResearchVerifiedEvent,
  verifyDeepResearchReducerSurface,
} from './deep-research-reducer.js';
export {
  DeepResearchReducerError,
  assertDeepResearchLegacyProjection,
  assertDeepResearchProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './deep-research-projection-schema.js';

export type * from './deep-research-projection-types.js';
export type { DeepResearchReducerSurface } from './deep-research-reducer.js';
