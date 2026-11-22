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

/** Evidence for a candidate contradiction between two claims within an incompatibility scope. */
export interface ContradictionCandidateInput extends CandidateEvidenceContext {
  readonly observedClaimId: string;
  readonly counterpartClaimId: string;
  readonly incompatibilityScope: string;
}

/**
 * Evidence for a candidate supersession of one claim by another, with the replacement scope and why the
 * successor is stronger.
 */
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

/** Ledger payload asserting that two claims contradict within a scope. */
export interface ContradictionEventPayload extends RelationshipPayloadBase {
  readonly left_claim_id: string;
  readonly right_claim_id: string;
  readonly incompatibility_scope: string;
}

/** Ledger payload asserting that a successor claim supersedes a predecessor within a scope. */
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

/** The assertion, any withdrawal and the evidence refs behind a relationship. */
export interface RelationshipEvidenceState extends JsonObject {
  readonly assertion_event_id: string;
  readonly withdrawal_event_id: string | null;
  readonly evidence_refs: RelationshipEvidenceRef[];
  readonly assertion_evidence_refs: RelationshipEvidenceRef[];
  readonly withdrawal_evidence_refs: RelationshipEvidenceRef[];
  readonly evidence_snapshot_ref: string;
}

/** A relationship that is currently asserted and not withdrawn, with its claims, scope, detector and evidence. */
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

/** One claim's status and the active contradiction and supersession relations that decide it. */
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

/** Full history of one relationship, from assertion to any withdrawal, with ledger sequences. */
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

/**
 * Root directory, reference snapshot and authority provider the service writes under, with optional ledger,
 * stream and producer overrides.
 */
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

/** The durable append receipt and the projection after recording a relationship event. */
export interface RecordedRelationship {
  readonly receipt: DurableAppendReceipt;
  readonly projection: ClaimRelationshipProjection;
}

/** Why a relationship replay failed, with the ledger sequence and event id when known. */
export interface RelationshipReplayFailure {
  readonly code: string;
  readonly sequence: number | null;
  readonly eventId: string | null;
  readonly message: string;
}

/** A trusted replay result with its projection and fingerprint. */
export interface RelationshipReplaySuccess {
  readonly ok: true;
  readonly trusted: true;
  readonly projection: ClaimRelationshipProjection;
  readonly fingerprint: DerivedReplayFingerprint<ClaimRelationshipProjection>;
}

/** An untrusted replay result that carries only the failure. */
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

/** Audit-ledger position and the decision, request and policy digests that authorized a relationship write. */
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

/** Ledger position and stream identity of a committed relationship event. */
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

/** One audited relationship event: its action, the event it retracts, the claims and evidence it touched. */
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

/** Audit report pairing the projection with every relationship event record and the replay fingerprint. */
export interface RelationshipAuditReport extends JsonObject {
  readonly projection: ClaimRelationshipProjection;
  readonly records: RelationshipAuditRecord[];
  readonly replay_fingerprint: string;
  readonly event_registry_digest: string;
  readonly reducer_version: string;
}

/** A successful audit with its report. */
export interface RelationshipAuditSuccess {
  readonly ok: true;
  readonly report: RelationshipAuditReport;
}

export type RelationshipAuditResult =
  | RelationshipAuditSuccess
  | RelationshipReplayFailureResult;
