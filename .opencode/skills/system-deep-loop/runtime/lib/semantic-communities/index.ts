// ───────────────────────────────────────────────────────────────────
// MODULE: Semantic Communities Public API
// ───────────────────────────────────────────────────────────────────

export {
  createEmptySemanticCommunityProjection,
  createSemanticProjectionHistory,
  projectSemanticClaimIncrementally,
  rebuildSemanticCommunityProjection,
  semanticCommunityCoverageSnapshot,
  semanticCommunityIdentityDigest,
  transitionSemanticProjectionVersion,
} from './community-projection.js';
export {
  admitSemanticEquivalenceEdge,
  createSemanticClaimRecord,
  defineSemanticProjectionConfig,
  retrieveNamespaceCandidates,
  sameSemanticNamespace,
  semanticCandidateSetDigest,
  semanticCoverageEdgeBoundary,
} from './semantic-equivalence.js';
export {
  createSemanticCommunityEventRegistry,
  createSemanticCommunityReducerRegistry,
  prepareSemanticClaimObservationEvent,
  rebuildSemanticCommunityProjectionFromLedger,
  semanticClaimObservationEventDefinition,
  semanticCommunityReplayComponentDefinition,
} from './semantic-community-events.js';
export { computeSemanticNoveltyShadow } from './semantic-novelty.js';
export {
  SEMANTIC_CLAIM_EVENT_TYPE,
  SEMANTIC_EQUIVALENCE_RELATION,
  SEMANTIC_PROJECTION_SCHEMA_VERSION,
} from './semantic-community-types.js';

export type { SemanticObservationEnvelopeInput } from './semantic-community-events.js';
export type {
  CreateSemanticClaimInput,
  SemanticCandidateAssessment,
  SemanticClaimObservation,
  SemanticClaimRecord,
  SemanticCommunityLineageRecord,
  SemanticCommunityProjection,
  SemanticCommunityRecord,
  SemanticConceptNovelty,
  SemanticCoverageEdgeBoundary,
  SemanticEquivalenceDecision,
  SemanticEquivalenceEdgeRecord,
  SemanticEvidenceNovelty,
  SemanticIncrementalResult,
  SemanticIncrementalTelemetry,
  SemanticLedgerOrigin,
  SemanticLegacyNoveltyInput,
  SemanticMembershipRecord,
  SemanticMembershipStatus,
  SemanticNamespaceRecord,
  SemanticNoveltyResult,
  SemanticNoveltyShadowResult,
  SemanticProjectionConfig,
  SemanticProjectionConfigInput,
  SemanticProjectionHistory,
} from './semantic-community-types.js';
