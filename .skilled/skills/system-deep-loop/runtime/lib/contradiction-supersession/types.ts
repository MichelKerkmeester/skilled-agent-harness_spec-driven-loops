// ───────────────────────────────────────────────────────────────────
// MODULE: Contradiction and Supersession Types
// ───────────────────────────────────────────────────────────────────

import type {
  AuthoritySnapshot,
  DurableAppendReceipt,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  JsonObject,
} from '../event-envelope/index.js';
import type { DerivedReplayFingerprint } from '../replay-fingerprint/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. REFERENCE AND CANDIDATE TYPES
// ───────────────────────────────────────────────────────────────────

export type RelationshipKind = 'CONTRADICTION' | 'SUPERSESSION';
export type RelationAction = 'assert' | 'withdraw';
export type ClaimStatus = 'active' | 'contested' | 'superseded';
export type EvidencePosition = 'supporting' | 'refuting' | 'qualifying';

/** Exact evidence locator and content identity carried into relationship history. */
export interface RelationshipEvidenceRef extends JsonObject {
  readonly evidence_id: string;
  readonly locator: string;
  readonly digest: string;
  readonly position: EvidencePosition;
}

/** Immutable evidence identity available to pre-append and replay validation. */
export interface EvidenceCatalogRecord extends JsonObject {
  readonly evidence_id: string;
  readonly locator: string;
  readonly digest: string;
}

/** Content-addressed reference universe used by validation and replay. */
export interface RelationshipReferenceSnapshot extends JsonObject {
  readonly snapshot_ref: string;
  readonly claim_ids: string[];
  readonly evidence_records: EvidenceCatalogRecord[];
}

interface CandidateEvidenceContext {
  readonly semanticCommunityIds: readonly string[];
  readonly evidenceRefs: readonly RelationshipEvidenceRef[];
  readonly provenanceRefs: readonly string[];
  readonly independenceRefs: readonly string[];
  readonly detectorVersion: string;
  readonly evidenceSnapshotRef: string;
}

export interface ContradictionCandidateInput extends CandidateEvidenceContext {
  readonly observedClaimId: string;
  readonly counterpartClaimId: string;
  readonly incompatibilityScope: string;
}

export interface SupersessionCandidateInput extends CandidateEvidenceContext {
  readonly predecessorClaimId: string;
  readonly successorClaimId: string;
  readonly replacementScope: string;
  readonly strengthRationale: string;
}

interface RelationshipCandidateBase {
  readonly candidateId: string;
  readonly relationshipId: string;
  readonly semanticCommunityIds: readonly string[];
  readonly evidenceRefs: readonly RelationshipEvidenceRef[];
  readonly provenanceRefs: readonly string[];
  readonly independenceRefs: readonly string[];
  readonly detectorVersion: string;
  readonly evidenceSnapshotRef: string;
}

/** Inert detector output; it has no authority and is never part of a projection. */
export interface ContradictionCandidate extends RelationshipCandidateBase {
  readonly kind: 'CONTRADICTION';
  readonly leftClaimId: string;
  readonly rightClaimId: string;
  readonly incompatibilityScope: string;
}

/** Inert directional detector output; authorization decides whether it becomes history. */
export interface SupersessionCandidate extends RelationshipCandidateBase {
  readonly kind: 'SUPERSESSION';
  readonly predecessorClaimId: string;
  readonly successorClaimId: string;
  readonly replacementScope: string;
  readonly strengthRationale: string;
}

export type RelationshipCandidate = ContradictionCandidate | SupersessionCandidate;

// ───────────────────────────────────────────────────────────────────
// 2. EVENT PAYLOAD TYPES
// ───────────────────────────────────────────────────────────────────

interface RelationshipPayloadBase {
  readonly relationship_id: string;
  readonly semantic_community_ids: string[];
  readonly evidence_refs: RelationshipEvidenceRef[];
  readonly provenance_refs: string[];
  readonly independence_refs: string[];
  readonly detector_version: string;
  readonly evidence_snapshot_ref: string;
  readonly relation_action: RelationAction;
  readonly retracts_event_id?: string;
}

export interface ContradictionEventPayload extends RelationshipPayloadBase {
  readonly left_claim_id: string;
  readonly right_claim_id: string;
  readonly incompatibility_scope: string;
}

export interface SupersessionEventPayload extends RelationshipPayloadBase {
  readonly predecessor_claim_id: string;
  readonly successor_claim_id: string;
  readonly replacement_scope: string;
  readonly strength_rationale: string;
}

export type RelationshipEventPayload =
  | ContradictionEventPayload
  | SupersessionEventPayload;

/** Stable envelope metadata supplied by the relationship recorder. */
export interface RelationshipRecordInput {
  readonly candidate: RelationshipCandidate;
  readonly action: RelationAction;
  readonly retractsEventId?: string;
  readonly eventId: string;
  readonly requestId: string;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKey: string;
  readonly actorId: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. PROJECTION TYPES
// ───────────────────────────────────────────────────────────────────

export interface RelationshipEvidenceState extends JsonObject {
  readonly assertion_event_id: string;
  readonly withdrawal_event_id: string | null;
  readonly evidence_refs: RelationshipEvidenceRef[];
  readonly assertion_evidence_refs: RelationshipEvidenceRef[];
  readonly withdrawal_evidence_refs: RelationshipEvidenceRef[];
  readonly evidence_snapshot_ref: string;
}

export interface ActiveRelationshipProjection extends JsonObject {
  readonly relationship_id: string;
  readonly kind: RelationshipKind;
  readonly source_claim_id: string;
  readonly counterpart_claim_id: string;
  readonly scope: string;
  readonly assertion_event_id: string;
  readonly detector_version: string;
  readonly semantic_community_ids: string[];
  readonly evidence_state: RelationshipEvidenceState;
}

export interface ClaimRelationshipStatusProjection extends JsonObject {
  readonly claim_id: string;
  readonly status: ClaimStatus;
  readonly active_contradiction_relation_ids: string[];
  readonly active_incoming_supersession_relation_ids: string[];
  readonly active_outgoing_supersession_relation_ids: string[];
  readonly contradiction_counterpart_claim_ids: string[];
  readonly predecessor_claim_ids: string[];
  readonly successor_claim_ids: string[];
  readonly terminal_successor_claim_id: string | null;
  readonly evidence_state: RelationshipEvidenceState[];
}

export interface RelationshipHistoryRecord extends JsonObject {
  readonly relationship_id: string;
  readonly kind: RelationshipKind;
  readonly source_claim_id: string;
  readonly counterpart_claim_id: string;
  readonly scope: string;
  readonly assertion_event_id: string;
  readonly assertion_sequence: number;
  readonly withdrawal_event_id: string | null;
  readonly withdrawal_sequence: number | null;
  readonly detector_version: string;
  readonly semantic_community_ids: string[];
  readonly provenance_refs: string[];
  readonly independence_refs: string[];
  readonly evidence_state: RelationshipEvidenceState;
}

/** Disposable typed projection rebuilt exclusively from verified relationship events. */
export interface ClaimRelationshipProjection extends JsonObject {
  readonly projection_schema_version: string;
  readonly authority_mode: 'additive-dark';
  readonly history: RelationshipHistoryRecord[];
  readonly active_relationships: ActiveRelationshipProjection[];
  readonly claims: Record<string, ClaimRelationshipStatusProjection>;
  readonly canonical_active_contradiction_count: number;
}

// ───────────────────────────────────────────────────────────────────
// 4. SERVICE AND REPLAY TYPES
// ───────────────────────────────────────────────────────────────────

export interface ContradictionSupersessionServiceOptions {
  readonly rootDirectory: string;
  readonly referenceSnapshot: RelationshipReferenceSnapshot;
  readonly authorityProvider: (
    mode: string,
  ) => AuthoritySnapshot | Promise<AuthoritySnapshot>;
  readonly ledgerId?: string;
  readonly auditLedgerId?: string;
  readonly streamId?: string;
  readonly producer?: EventProducer;
  readonly now?: () => Date;
}

export interface RecordedRelationship {
  readonly receipt: DurableAppendReceipt;
  readonly projection: ClaimRelationshipProjection;
}

export interface RelationshipReplayFailure {
  readonly code: string;
  readonly sequence: number | null;
  readonly eventId: string | null;
  readonly message: string;
}

export interface RelationshipReplaySuccess {
  readonly ok: true;
  readonly trusted: true;
  readonly projection: ClaimRelationshipProjection;
  readonly fingerprint: DerivedReplayFingerprint<ClaimRelationshipProjection>;
}

export interface RelationshipReplayFailureResult {
  readonly ok: false;
  readonly trusted: false;
  readonly projection: null;
  readonly fingerprint: null;
  readonly failure: RelationshipReplayFailure;
}

export type RelationshipReplayResult =
  | RelationshipReplaySuccess
  | RelationshipReplayFailureResult;

export interface RelationshipAuthorizationReference extends JsonObject {
  readonly audit_ledger_id: string;
  readonly audit_sequence: number;
  readonly audit_record_hash: string;
  readonly decision_id: string;
  readonly decision_digest: string;
  readonly request_digest: string;
  readonly policy_digest: string;
  readonly authority_epoch: number;
}

export interface RelationshipAppendReceiptEvidence extends JsonObject {
  readonly ledger_id: string;
  readonly sequence: number;
  readonly event_id: string;
  readonly event_type: string;
  readonly event_version: number;
  readonly stream_id: string;
  readonly stream_sequence: number;
  readonly committed_at: string;
}

export interface RelationshipAuditRecord extends JsonObject {
  readonly event_id: string;
  readonly event_type: string;
  readonly event_version: number;
  readonly ledger_sequence: number;
  readonly relationship_id: string;
  readonly relation_action: RelationAction;
  readonly retracts_event_id: string | null;
  readonly claim_ids: string[];
  readonly evidence_refs: RelationshipEvidenceRef[];
  readonly evidence_snapshot_ref: string;
  readonly detector_version: string;
  readonly reducer_version: string;
  readonly authorization_reference: RelationshipAuthorizationReference;
  readonly append_receipt: RelationshipAppendReceiptEvidence;
}

export interface RelationshipAuditReport extends JsonObject {
  readonly projection: ClaimRelationshipProjection;
  readonly records: RelationshipAuditRecord[];
  readonly replay_fingerprint: string;
  readonly event_registry_digest: string;
  readonly reducer_version: string;
}

export interface RelationshipAuditSuccess {
  readonly ok: true;
  readonly report: RelationshipAuditReport;
}

export type RelationshipAuditResult =
  | RelationshipAuditSuccess
  | RelationshipReplayFailureResult;
