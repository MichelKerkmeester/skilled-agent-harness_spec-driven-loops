// ───────────────────────────────────────────────────────────────────
// MODULE: Contradiction and Supersession Public API
// ───────────────────────────────────────────────────────────────────

export {
  auditClaimRelationships,
  claimRelationshipAuditAsJson,
} from './audit.js';
export {
  ClaimRelationshipError,
  ClaimRelationshipErrorCodes,
} from './errors.js';
export {
  CLAIM_RELATIONSHIP_EVENT_VERSION,
  CLAIM_RELATIONSHIP_PROJECTION_SCHEMA_VERSION,
  CLAIM_RELATIONSHIP_REDUCER_ID,
  CLAIM_RELATIONSHIP_REDUCER_VERSION,
  RelationshipEventTypes,
  canonicalContradictionPair,
  contradictionRelationshipId,
  createClaimRelationshipEventRegistry,
  createContradictionCandidate,
  createSupersessionCandidate,
  normalizeReferenceSnapshot,
  relationshipPayload,
  supersessionRelationshipId,
} from './event-registry.js';
export {
  createEmptyClaimRelationshipProjection,
  foldVerifiedClaimRelationships,
  reduceClaimRelationshipEnvelope,
  sameClaimRelationshipProjection,
} from './projection.js';
export {
  CLAIM_RELATIONSHIP_REFERENCE_REPLAY_INPUT,
  claimRelationshipSnapshotFromJson,
  createClaimRelationshipReducerRegistry,
  createClaimRelationshipReplayComponentRegistry,
  deriveClaimRelationshipReplayFingerprint,
  replayClaimRelationships,
} from './replay.js';
export {
  CLAIM_RELATIONSHIP_CAPABILITY,
  CLAIM_RELATIONSHIP_MODE,
  CLAIM_RELATIONSHIP_POLICY_ID,
  CLAIM_RELATIONSHIP_POLICY_VERSION,
  ContradictionSupersessionService,
  createClaimRelationshipPolicyRegistry,
} from './service.js';

export type { ClaimRelationshipErrorCode } from './errors.js';
export type { RelationshipEventType } from './event-registry.js';
export type {
  DeriveClaimRelationshipReplayInput,
  ReplayClaimRelationshipsInput,
} from './replay.js';
export type {
  ActiveRelationshipProjection,
  RelationshipAppendReceiptEvidence,
  RelationshipAuditRecord,
  RelationshipAuditReport,
  RelationshipAuditResult,
  RelationshipAuditSuccess,
  RelationshipAuthorizationReference,
  ClaimRelationshipProjection,
  ClaimRelationshipStatusProjection,
  ClaimStatus,
  ContradictionCandidate,
  ContradictionCandidateInput,
  ContradictionEventPayload,
  ContradictionSupersessionServiceOptions,
  EvidenceCatalogRecord,
  EvidencePosition,
  RecordedRelationship,
  RelationAction,
  RelationshipCandidate,
  RelationshipEvidenceRef,
  RelationshipEvidenceState,
  RelationshipHistoryRecord,
  RelationshipKind,
  RelationshipRecordInput,
  RelationshipReferenceSnapshot,
  RelationshipReplayFailure,
  RelationshipReplayResult,
  SupersessionCandidate,
  SupersessionCandidateInput,
  SupersessionEventPayload,
} from './types.js';
