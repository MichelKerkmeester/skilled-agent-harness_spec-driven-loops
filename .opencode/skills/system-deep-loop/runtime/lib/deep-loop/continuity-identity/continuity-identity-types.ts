// ───────────────────────────────────────────────────────────────────
// MODULE: Continuity Identity Types
// ───────────────────────────────────────────────────────────────────

import type {
  DurableAppendReceipt,
  PolicyReference,
} from '../../authorized-ledger/index.js';
import type {
  EventProducer,
  JsonObject,
  JsonValue,
} from '../../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. IDENTITY CONTRACT
// ───────────────────────────────────────────────────────────────────

export const CONTINUITY_IDENTITY_SCHEMA_VERSION = 1;

export const ContinuityIdentityKinds = {
  LINEAGE: 'lineage',
  CLAIM: 'claim',
  CANDIDATE: 'candidate',
  MODE_SESSION: 'mode_session',
} as const;

export type ContinuityIdentityKind =
  typeof ContinuityIdentityKinds[keyof typeof ContinuityIdentityKinds];

export const ContinuityModes = {
  RESEARCH: 'research',
  REVIEW: 'review',
  COUNCIL: 'council',
  IMPROVEMENT: 'improvement',
  ALIGNMENT: 'alignment',
  BENCHMARK: 'benchmark',
} as const;

export type ContinuityMode = typeof ContinuityModes[keyof typeof ContinuityModes];
export type ContinuityRelationshipKind = 'continues_from' | 'forked_from';
export type ContinuityAttemptTransition = 'new' | 'retry' | 'resume';

/** Stable typed reference carried across every mode and persistence boundary. */
export interface ContinuityIdentityRef extends JsonObject {
  readonly id: string;
  readonly kind: ContinuityIdentityKind;
  readonly schema_version: number;
}

/** Immutable provenance retained for one accepted logical identity. */
export interface ContinuityIdentityRecord extends JsonObject {
  readonly ref: ContinuityIdentityRef;
  readonly mint_request_token_digest: string;
  readonly provenance_digest: string;
  readonly parent_ref: ContinuityIdentityRef | null;
  readonly mint_relationship_kind: ContinuityRelationshipKind | null;
  readonly minted_event_id: string;
}

/** Explicit lifecycle edge from a child identity to its prior logical identity. */
export interface ContinuityRelationshipRecord extends JsonObject {
  readonly relationship_kind: ContinuityRelationshipKind;
  readonly subject_ref: ContinuityIdentityRef;
  readonly related_ref: ContinuityIdentityRef;
  readonly event_id: string;
}

/** Execution attempt metadata that never replaces the logical mode-session ID. */
export interface ContinuityAttemptRecord extends JsonObject {
  readonly mode_session_ref: ContinuityIdentityRef;
  readonly attempt_id: string;
  readonly attempt_number: number;
  readonly transition: ContinuityAttemptTransition;
  readonly event_id: string;
}

/** Provenance edge for a typed reference crossing between logical mode sessions. */
export interface ContinuityCrossModeRecord extends JsonObject {
  readonly subject_ref: ContinuityIdentityRef;
  readonly source_mode_session_ref: ContinuityIdentityRef;
  readonly target_mode_session_ref: ContinuityIdentityRef;
  readonly source_mode: ContinuityMode;
  readonly target_mode: ContinuityMode;
  readonly event_id: string;
}

/** Disposable projection reconstructed only from verified authorized events. */
export interface ContinuityIdentityState extends JsonObject {
  schema_version: number;
  identities: Record<string, ContinuityIdentityRecord>;
  mint_requests: Record<string, string>;
  aliases: Record<string, string>;
  relationships: ContinuityRelationshipRecord[];
  attempts: Record<string, ContinuityAttemptRecord[]>;
  cross_mode_references: ContinuityCrossModeRecord[];
}

// ───────────────────────────────────────────────────────────────────
// 2. WRITE CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Stable envelope and authorization material retained by an idempotent request. */
export interface ContinuityWriteContext {
  readonly timestamp: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly mode: ContinuityMode;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly evidenceDigest: string;
  readonly policy: PolicyReference;
}

export interface MintIdentityInput {
  readonly kind: ContinuityIdentityKind;
  readonly mintRequestToken: string;
  readonly provenance: Readonly<JsonObject>;
  readonly parent?: Readonly<{
    ref: ContinuityIdentityRef;
    relationshipKind: ContinuityRelationshipKind;
  }>;
  readonly context: ContinuityWriteContext;
}

export interface BindAliasInput {
  readonly namespace: string;
  readonly legacyId: string;
  readonly subjectRef: ContinuityIdentityRef;
  readonly context: ContinuityWriteContext;
}

export interface LinkIdentitiesInput {
  readonly subjectRef: ContinuityIdentityRef;
  readonly relatedRef: ContinuityIdentityRef;
  readonly relationshipKind: ContinuityRelationshipKind;
  readonly context: ContinuityWriteContext;
}

export interface RecordAttemptInput {
  readonly modeSessionRef: ContinuityIdentityRef;
  readonly attemptId: string;
  readonly attemptNumber: number;
  readonly transition: ContinuityAttemptTransition;
  readonly context: ContinuityWriteContext;
}

export interface RecordCrossModeReferenceInput {
  readonly subjectRef: ContinuityIdentityRef;
  readonly sourceModeSessionRef: ContinuityIdentityRef;
  readonly targetModeSessionRef: ContinuityIdentityRef;
  readonly sourceMode: ContinuityMode;
  readonly targetMode: ContinuityMode;
  readonly context: ContinuityWriteContext;
}

export interface ContinuityWriteResult<TValue> {
  readonly status: 'appended' | 'idempotent';
  readonly value: TValue;
  readonly receipt: DurableAppendReceipt | null;
}

// ───────────────────────────────────────────────────────────────────
// 3. HANDOVER CONTRACT
// ───────────────────────────────────────────────────────────────────

export interface ContinuityLedgerCursor extends JsonObject {
  readonly ledger_id: string;
  readonly sequence: number;
  readonly record_hash: string;
}

export interface ContinuityReplayReference extends JsonObject {
  readonly fingerprint_version: number;
  readonly run_id: string;
  readonly range_start_sequence: number;
  readonly range_end_sequence: number;
  readonly event_registry_digest: string;
  readonly projection_digest: string;
  readonly final_digest: string;
}

export interface ContinuityFrontierAttempt extends JsonObject {
  readonly attempt_id: string;
  readonly attempt_number: number;
}

/** Closed resume/handover frontier resolved before any dispatch is permitted. */
export interface ContinuityIdentityFrontier extends JsonObject {
  readonly schema_version: number;
  readonly mode_session_ref: ContinuityIdentityRef;
  readonly lineage_refs: ContinuityIdentityRef[];
  readonly active_claim_refs: ContinuityIdentityRef[];
  readonly active_candidate_refs: ContinuityIdentityRef[];
  readonly attempt: ContinuityFrontierAttempt;
  readonly ledger_cursor: ContinuityLedgerCursor;
  readonly replay_fingerprint: ContinuityReplayReference;
  readonly frontier_digest: string;
}

// ───────────────────────────────────────────────────────────────────
// 4. ERRORS
// ───────────────────────────────────────────────────────────────────

export const ContinuityIdentityErrorCodes = {
  INVALID_IDENTITY: 'INVALID_IDENTITY',
  WRONG_KIND: 'WRONG_KIND',
  INVALID_MINT_TOKEN: 'INVALID_MINT_TOKEN',
  TOKEN_CONFLICT: 'TOKEN_CONFLICT',
  IDENTITY_COLLISION: 'IDENTITY_COLLISION',
  UNKNOWN_IDENTITY: 'UNKNOWN_IDENTITY',
  ALIAS_CONFLICT: 'ALIAS_CONFLICT',
  ALIAS_AMBIGUOUS: 'ALIAS_AMBIGUOUS',
  RELATIONSHIP_CONFLICT: 'RELATIONSHIP_CONFLICT',
  ATTEMPT_CONFLICT: 'ATTEMPT_CONFLICT',
  CROSS_MODE_CONFLICT: 'CROSS_MODE_CONFLICT',
  AUTHORIZATION_DENIED: 'AUTHORIZATION_DENIED',
  REGISTRY_MISMATCH: 'REGISTRY_MISMATCH',
  INVALID_FRONTIER: 'INVALID_FRONTIER',
  STALE_FRONTIER: 'STALE_FRONTIER',
  REPLAY_MISMATCH: 'REPLAY_MISMATCH',
  LEDGER_EMPTY: 'LEDGER_EMPTY',
} as const;

export type ContinuityIdentityErrorCode =
  typeof ContinuityIdentityErrorCodes[keyof typeof ContinuityIdentityErrorCodes];

/** Fail-closed error returned without raw aliases, tokens, or provenance content. */
export class ContinuityIdentityError extends Error {
  public readonly code: ContinuityIdentityErrorCode;
  public readonly details: Readonly<Record<string, JsonValue>>;

  public constructor(
    code: ContinuityIdentityErrorCode,
    message: string,
    details: Readonly<Record<string, JsonValue>> = {},
  ) {
    super(message);
    this.name = 'ContinuityIdentityError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
