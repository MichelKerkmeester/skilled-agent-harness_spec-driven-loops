// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Reducers Public API
// ───────────────────────────────────────────────────────────────────

export {
  AGENT_IMPROVEMENT_EVENT_ROUTING,
  AGENT_IMPROVEMENT_FOLD_BRANCH,
  AGENT_IMPROVEMENT_ORDERING_POLICY_VERSION,
  AGENT_IMPROVEMENT_PROJECTION_CODEC_VERSION,
  AGENT_IMPROVEMENT_PROJECTION_FIELD_OWNERSHIP,
  AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
  AGENT_IMPROVEMENT_REDUCER_ID,
  AGENT_IMPROVEMENT_REDUCER_SET,
  AGENT_IMPROVEMENT_REDUCER_SURFACE,
  AGENT_IMPROVEMENT_REDUCER_VERSION,
  agentImprovementProjectionIntegrityDigest,
  createAgentImprovementProjectionState,
  foldAgentImprovementEvents,
  projectAgentImprovementCandidateView,
  projectAgentImprovementLegacyView,
  reduceAgentImprovementVerifiedEvent,
  verifyAgentImprovementReducerSurface,
} from './agent-improvement-reducer.js';
export {
  AgentImprovementReducerError,
  assertAgentImprovementCandidateView,
  assertAgentImprovementLegacyProjection,
  assertAgentImprovementProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './agent-improvement-projection-schema.js';

export type * from './agent-improvement-projection-types.js';
export type {
  AgentImprovementReducerSurface,
} from './agent-improvement-reducer.js';
