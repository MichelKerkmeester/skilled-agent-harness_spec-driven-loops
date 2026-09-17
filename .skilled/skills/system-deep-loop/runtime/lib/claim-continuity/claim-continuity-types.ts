// ───────────────────────────────────────────────────────────────────
// MODULE: Claim Continuity Types
// ───────────────────────────────────────────────────────────────────

import type {
  DurableAppendReceipt,
  PolicyReference,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  ContinuityIdentityFrontier,
  ContinuityIdentityRef,
  ContinuityWriteContext,
  MintIdentityInput,
} from '../deep-loop/continuity-identity/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLAIM PROJECTION
// ───────────────────────────────────────────────────────────────────

export const CLAIM_CONTINUITY_SCHEMA_VERSION = 1;

export const ClaimLifecycleStates = {
  PROPOSED: 'proposed',
  ACTIVE: 'active',
  SUPERSEDED: 'superseded',
  RETRACTED: 'retracted',
} as const;

export type ClaimLifecycleState =
  typeof ClaimLifecycleStates[keyof typeof ClaimLifecycleStates];

export const ClaimEpistemicStatuses = {
  UNASSESSED: 'unassessed',
  SUPPORTED: 'supported',
  CONTESTED: 'contested',
  REFUTED: 'refuted',
} as const;

export type ClaimEpistemicStatus =
  typeof ClaimEpistemicStatuses[keyof typeof ClaimEpistemicStatuses];

export const ClaimMatchDecisions = {
  MINT: 'mint',
  REUSE: 'reuse',
  UNRESOLVED: 'unresolved',
} as const;

export type ClaimMatchDecision =
  typeof ClaimMatchDecisions[keyof typeof ClaimMatchDecisions];

export const ClaimMatchReasons = {
  NO_CANDIDATE: 'no_candidate',
  EXACT_ALIAS: 'exact_alias',
  EXACT_FINGERPRINT: 'exact_fingerprint',
  SEMANTIC_EQUIVALENCE: 'semantic_equivalence',
  EXPLICITLY_DISTINCT: 'explicitly_distinct',
  MULTIPLE_QUALIFYING: 'multiple_qualifying',
  EXACT_COLLISION: 'exact_collision',
  CROSS_NAMESPACE_COLLISION: 'cross_namespace_collision',
  WEAK_SIMILARITY: 'weak_similarity',
  COMMUNITY_DISAGREEMENT: 'community_disagreement',
  UNKNOWN_CANDIDATE: 'unknown_candidate',
} as const;

export type ClaimMatchReason =
  typeof ClaimMatchReasons[keyof typeof ClaimMatchReasons];

export type ClaimSemanticDecision = 'equivalent' | 'distinct' | 'topical_only';
export type ClaimEvidenceStance = 'support' | 'qualification';
export type ClaimLifecycleTransition = 'admit' | 'retract';
export type ClaimAdjudicationOutcome = 'unassessed' | 'supported' | 'refuted';
export type ClaimRelationshipKind = 'contradiction' | 'supersession';

/** Immutable versioned policy used to turn candidates into one closed decision. */
export interface ClaimMatchPolicy extends JsonObject {
  readonly policy_version: string;
  readonly equivalence_threshold: number;
  readonly ambiguity_floor: number;
}

/** Sibling semantic-community candidate retained exactly as evaluated. */
export interface ClaimSemanticCandidate extends JsonObject {
  readonly claim_ref: ContinuityIdentityRef;
  readonly namespace: string;
  readonly normalized_fingerprint: string;
  readonly similarity_score: number;
  readonly semantic_decision: ClaimSemanticDecision;
  readonly community_id: string;
  readonly community_projection_version: string;
  readonly community_consensus: boolean;
  readonly provenance_digest: string;
}

/** Replay-stable result of exact and semantic candidate evaluation. */
export interface ClaimMatchRecord extends JsonObject {
  readonly match_record_id: string;
  readonly observation_id: string;
  readonly namespace: string;
  readonly aliases: string[];
  readonly normalized_fingerprint: string;
  readonly policy_version: string;
  readonly policy_digest: string;
  readonly candidate_set: ClaimSemanticCandidate[];
  readonly decision: ClaimMatchDecision;
  readonly reason: ClaimMatchReason;
  readonly resolved_claim_ref: ContinuityIdentityRef | null;
  readonly provenance_digest: string;
  readonly event_id: string;
  readonly ledger_sequence: number;
}

/** Raw observation stays audit-visible even when a later correction voids its effect. */
export interface ClaimObservationRecord extends JsonObject {
  readonly observation_id: string;
  readonly match_record_id: string;
  readonly raw_text: string;
  readonly normalized_fingerprint: string;
  readonly aliases: string[];
  readonly source_event_id: string;
  readonly provenance_digest: string;
  readonly event_id: string;
  readonly ledger_sequence: number;
  readonly effective: boolean;
}

/** Evidence provenance remains separate from the status it contributes to. */
export interface ClaimEvidenceRecord extends JsonObject {
  readonly evidence_ref: string;
  readonly source_ref: string;
  readonly stance: ClaimEvidenceStance;
  readonly independence_key: string;
  readonly is_duplicate: boolean;
  readonly provenance_digest: string;
  readonly event_id: string;
  readonly ledger_sequence: number;
  readonly effective: boolean;
}

/** Active and historical sibling relationships share one auditable record. */
export interface ClaimRelationshipRecord extends JsonObject {
  readonly relationship_id: string;
  readonly relationship_kind: ClaimRelationshipKind;
  readonly source_claim_ref: ContinuityIdentityRef;
  readonly target_claim_ref: ContinuityIdentityRef;
  readonly assertion_event_id: string;
  readonly withdrawal_event_id: string | null;
  readonly evidence_refs: string[];
  readonly active: boolean;
}

/** Durable claim view keyed only by the shared typed claim identity. */
export interface ClaimContinuityRecord extends JsonObject {
  readonly claim_ref: ContinuityIdentityRef;
  readonly namespace: string;
  readonly mint_match_record_id: string;
  readonly mint_identity_event_id: string;
  readonly mint_request_token_digest: string;
  readonly provenance_digest: string;
  lifecycle: ClaimLifecycleState;
  epistemic_status: ClaimEpistemicStatus;
  readonly aliases: string[];
  readonly normalized_fingerprints: string[];
  readonly observations: ClaimObservationRecord[];
  readonly evidence: ClaimEvidenceRecord[];
  readonly active_relationship_ids: string[];
  readonly historical_relationship_ids: string[];
  readonly contributing_event_ids: string[];
  readonly corrected_event_ids: string[];
  last_applied_ledger_sequence: number;
}

/** Canonical event evidence retained so compensating events can trigger recomputation. */
export interface ClaimEventJournalEntry extends JsonObject {
  readonly event_id: string;
  readonly event_type: string;
  readonly ledger_sequence: number;
  readonly payload: JsonObject;
}

/** Disposable state rebuilt only from verified event order and identity input. */
export interface ClaimContinuityState extends JsonObject {
  schema_version: number;
  reducer_version: string;
  identity_projection_digest: string;
  records: Record<string, ClaimContinuityRecord>;
  match_records: Record<string, ClaimMatchRecord>;
  relationships: Record<string, ClaimRelationshipRecord>;
  unresolved_match_ids: string[];
  event_journal: ClaimEventJournalEntry[];
  last_applied_ledger_sequence: number;
}

// ───────────────────────────────────────────────────────────────────
// 2. WRITE INPUTS
// ───────────────────────────────────────────────────────────────────

/** Stable authorization metadata for one claim-domain event. */
export interface ClaimContinuityWriteContext {
  readonly timestamp: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly mode: string;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly evidenceDigest: string;
  readonly policy: PolicyReference;
}

export interface RecordClaimMatchInput {
  readonly observationId: string;
  readonly namespace: string;
  readonly aliases: readonly string[];
  readonly normalizedFingerprint: string;
  readonly semanticCandidates: readonly ClaimSemanticCandidate[];
  readonly policy: ClaimMatchPolicy;
  readonly provenanceDigest: string;
  readonly context: ClaimContinuityWriteContext;
}

export interface MintClaimInput {
  readonly matchRecordId: string;
  readonly identityMint: Omit<MintIdentityInput, 'kind'> & {
    readonly kind?: 'claim';
    readonly context: ContinuityWriteContext;
  };
  readonly context: ClaimContinuityWriteContext;
}

export interface AttachClaimObservationInput {
  readonly claimRef: ContinuityIdentityRef;
  readonly matchRecordId: string;
  readonly observationId: string;
  readonly rawText: string;
  readonly normalizedFingerprint: string;
  readonly aliases: readonly string[];
  readonly sourceEventId: string;
  readonly provenanceDigest: string;
  readonly context: ClaimContinuityWriteContext;
}

export interface AttachClaimEvidenceInput {
  readonly claimRef: ContinuityIdentityRef;
  readonly evidenceRef: string;
  readonly sourceRef: string;
  readonly stance: ClaimEvidenceStance;
  readonly independenceKey: string;
  readonly isDuplicate: boolean;
  readonly provenanceDigest: string;
  readonly context: ClaimContinuityWriteContext;
}

export interface RecordClaimLifecycleInput {
  readonly claimRef: ContinuityIdentityRef;
  readonly transition: ClaimLifecycleTransition;
  readonly rationaleRef: string;
  readonly context: ClaimContinuityWriteContext;
}

export interface RecordClaimAdjudicationInput {
  readonly claimRef: ContinuityIdentityRef;
  readonly outcome: ClaimAdjudicationOutcome;
  readonly evidenceRefs: readonly string[];
  readonly rationaleRef: string;
  readonly context: ClaimContinuityWriteContext;
}

export interface RecordClaimCorrectionInput {
  readonly claimRef: ContinuityIdentityRef;
  readonly targetEventId: string;
  readonly rationaleRef: string;
  readonly context: ClaimContinuityWriteContext;
}

export interface ClaimContinuityWriteResult<TValue> {
  readonly status: 'appended' | 'idempotent';
  readonly value: TValue;
  readonly receipt: DurableAppendReceipt | null;
}

export interface MintClaimResult extends JsonObject {
  readonly claim_ref: ContinuityIdentityRef;
  readonly identity_status: 'appended' | 'idempotent';
  readonly claim_status: 'appended' | 'idempotent';
}

// ───────────────────────────────────────────────────────────────────
// 3. RESUME FRONTIER
// ───────────────────────────────────────────────────────────────────

export interface ClaimContinuityLedgerCursor extends JsonObject {
  readonly ledger_id: string;
  readonly sequence: number;
  readonly record_hash: string;
}

export interface ClaimContinuityReplayReference extends JsonObject {
  readonly fingerprint_version: number;
  readonly run_id: string;
  readonly range_start_sequence: number;
  readonly range_end_sequence: number;
  readonly event_registry_digest: string;
  readonly projection_digest: string;
  readonly final_digest: string;
}

/** Extension wrapper that leaves the frozen identity frontier unchanged. */
export interface ClaimContinuityFrontier extends JsonObject {
  readonly schema_version: number;
  readonly continuity_identity_frontier_digest: string;
  readonly identity_projection_digest: string;
  readonly active_claim_refs: ContinuityIdentityRef[];
  readonly unresolved_match_ids: string[];
  readonly claim_reducer_version: string;
  readonly claim_projection_schema_version: string;
  readonly claim_ledger_cursor: ClaimContinuityLedgerCursor;
  readonly claim_replay_fingerprint: ClaimContinuityReplayReference;
  readonly claim_projection_digest: string;
  readonly frontier_digest: string;
}

export interface RestoredClaimContinuityFrontier {
  readonly identityFrontier: ContinuityIdentityFrontier;
  readonly frontier: ClaimContinuityFrontier;
  readonly state: Readonly<ClaimContinuityState>;
}

// ───────────────────────────────────────────────────────────────────
// 4. SHADOW COMPARISON
// ───────────────────────────────────────────────────────────────────

export interface LegacyClaimFindingSnapshot extends JsonObject {
  readonly legacy_key: string;
  readonly lifecycle: string;
  readonly epistemic_status: string;
}

export interface ClaimShadowComparison extends JsonObject {
  readonly authority: 'legacy';
  readonly legacy_key_digest: string;
  readonly claim_ref: ContinuityIdentityRef;
  readonly divergent_fields: string[];
  readonly comparison_digest: string;
}

// ───────────────────────────────────────────────────────────────────
// 5. ERRORS
// ───────────────────────────────────────────────────────────────────

export const ClaimContinuityErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  WRONG_KIND: 'WRONG_KIND',
  UNKNOWN_CLAIM: 'UNKNOWN_CLAIM',
  IDENTITY_CONFLICT: 'IDENTITY_CONFLICT',
  MATCH_CONFLICT: 'MATCH_CONFLICT',
  UNRESOLVED_MATCH: 'UNRESOLVED_MATCH',
  EVENT_CONFLICT: 'EVENT_CONFLICT',
  TRANSITION_CONFLICT: 'TRANSITION_CONFLICT',
  RELATIONSHIP_CONFLICT: 'RELATIONSHIP_CONFLICT',
  AUTHORIZATION_DENIED: 'AUTHORIZATION_DENIED',
  REGISTRY_MISMATCH: 'REGISTRY_MISMATCH',
  INVALID_FRONTIER: 'INVALID_FRONTIER',
  STALE_FRONTIER: 'STALE_FRONTIER',
  REPLAY_MISMATCH: 'REPLAY_MISMATCH',
} as const;

export type ClaimContinuityErrorCode =
  typeof ClaimContinuityErrorCodes[keyof typeof ClaimContinuityErrorCodes];

/** Bounded failure that never substitutes an unverified claim projection. */
export class ClaimContinuityError extends Error {
  public readonly code: ClaimContinuityErrorCode;
  public readonly details: Readonly<Record<string, JsonValue>>;

  public constructor(
    code: ClaimContinuityErrorCode,
    message: string,
    details: Readonly<Record<string, JsonValue>> = {},
  ) {
    super(message);
    this.name = 'ClaimContinuityError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
