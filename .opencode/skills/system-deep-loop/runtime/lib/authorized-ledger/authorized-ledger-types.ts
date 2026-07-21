// ───────────────────────────────────────────────────────────────────
// MODULE: Authorized Ledger Types
// ───────────────────────────────────────────────────────────────────

import type {
  CanonicalBytes,
  EventReadResult,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. LEDGER TYPES
// ───────────────────────────────────────────────────────────────────

/** Stable empty-chain marker used before the first immutable frame. */
export const GENESIS_RECORD_HASH = '0'.repeat(64);

/** Verified immutable head for one ledger identity. */
export interface LedgerHead {
  readonly ledgerId: string;
  readonly sequence: number;
  readonly recordHash: string;
}

/** Durable audit event location bound into an allow proof. */
export interface AuthorizationReference {
  readonly audit_ledger_id: string;
  readonly audit_sequence: number;
  readonly audit_record_hash: string;
  readonly decision_id: string;
  readonly decision_digest: string;
  readonly request_digest: string;
  readonly policy_digest: string;
  readonly authority_epoch: number;
}

/** Receipt fields persisted inside an immutable domain frame. */
export interface LedgerFrameReceipt {
  readonly ledger_id: string;
  readonly sequence: number;
  readonly event_id: string;
  readonly event_type: string;
  readonly event_version: number;
  readonly stream_id: string;
  readonly stream_sequence: number;
  readonly committed_at: string;
}

/** Closed on-disk frame for one authorized domain event. */
export interface LedgerRecordFrame {
  readonly frame_version: number;
  readonly ledger_id: string;
  readonly sequence: number;
  readonly prev_record_hash: string;
  readonly canonical_event_hash: string;
  readonly authorization_ref: AuthorizationReference;
  readonly receipt: LedgerFrameReceipt;
  readonly canonical_event_bytes: string;
  readonly record_hash: string;
}

/** Receipt returned only after the immutable frame and directory are durable. */
export interface DurableAppendReceipt extends LedgerFrameReceipt {
  readonly canonicalEventHash: string;
  readonly recordHash: string;
  readonly authorizationRef: AuthorizationReference;
}

/** Fully checked frame and current effective event returned by the reader. */
export interface VerifiedLedgerEvent {
  readonly frame: LedgerRecordFrame;
  readonly event: EventReadResult;
}

/** Recovery evidence for a byte-preserved torn final frame candidate. */
export interface TornTailRecoveryRecord {
  readonly recovery_version: number;
  readonly ledger_id: string;
  readonly sequence: number;
  readonly prior_sequence: number;
  readonly prior_record_hash: string;
  readonly quarantined_file: string;
  readonly quarantined_digest: string;
  readonly recovered_at: string;
  readonly recovery_hash: string;
}

/** Optional fault boundary used to prove receipt and recovery semantics. */
export interface LedgerFaultInjection {
  readonly beforeDomainCommit?: () => void;
  readonly afterFrameFsyncBeforeCommit?: () => void;
}

/** Filesystem and identity inputs for one immutable domain ledger. */
export interface LedgerStorageOptions {
  readonly rootDirectory: string;
  readonly ledgerId: string;
  readonly auditLedgerId?: string;
  readonly lockTimeoutMs?: number;
  readonly faultInjection?: LedgerFaultInjection;
}

/** Domain-ledger options including the authority source rechecked under lock. */
export interface AuthorizedLedgerOptions extends LedgerStorageOptions {
  readonly now?: () => Date;
  readonly authorityProvider: (
    mode: string,
  ) => AuthoritySnapshot | Promise<AuthoritySnapshot>;
}

// ───────────────────────────────────────────────────────────────────
// 2. AUTHORIZATION TYPES
// ───────────────────────────────────────────────────────────────────

export const AuthorizationVerdicts = {
  ALLOW: 'allow',
  DENY: 'deny',
} as const;

export type AuthorizationVerdict =
  typeof AuthorizationVerdicts[keyof typeof AuthorizationVerdicts];

export const AuthorizationReasonCodes = {
  ALLOWED: 'allowed',
  POLICY_DENIED: 'policy_denied',
  INVALID_INPUT: 'invalid_input',
  UNKNOWN_POLICY: 'unknown_policy',
  UNKNOWN_RULE: 'unknown_rule',
  UNSUPPORTED_EVENT: 'unsupported_event',
  STALE_HEAD: 'stale_head',
  STALE_AUTHORITY_EPOCH: 'stale_authority_epoch',
  EVALUATOR_EXCEPTION: 'evaluator_exception',
  EVALUATOR_TIMEOUT: 'evaluator_timeout',
  EVALUATOR_AMBIGUOUS: 'evaluator_ambiguous',
  GATEWAY_FAILURE: 'gateway_failure',
  AUDIT_STORAGE_FAILURE: 'audit_storage_failure',
  IDEMPOTENCY_CONFLICT: 'idempotency_conflict',
  AUDIT_EVENT_RECURSION: 'audit_event_recursion',
} as const;

export type AuthorizationReasonCode =
  typeof AuthorizationReasonCodes[keyof typeof AuthorizationReasonCodes];

export type AuthorityState =
  | 'legacy_authoritative'
  | 'shadowing'
  | 'cutover_ready'
  | 'new_authoritative_reversible'
  | 'rollback_pending'
  | 'new_authoritative_final';

/** Current compare-and-swap authority observation for one mode. */
export interface AuthoritySnapshot {
  readonly state: AuthorityState;
  readonly epoch: number;
}

/** Exact immutable policy identity requested by a transition. */
export interface PolicyReference {
  readonly policyId: string;
  readonly policyVersion: number;
  readonly policyDigest: string;
}

/** Complete deterministic evaluator input without raw event or evidence payloads. */
export interface PolicyEvaluationInput {
  readonly mode: string;
  readonly streamId: string;
  readonly priorHeadSequence: number;
  readonly priorHeadHash: string;
  readonly priorStateVersion: string;
  readonly priorStateFingerprint: string;
  readonly requestedEventId: string;
  readonly requestedEventType: string;
  readonly requestedEventVersion: number;
  readonly requestedEventDigest: string;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly authorityState: AuthorityState;
  readonly authorityEpoch: number;
  readonly evidenceDigest: string;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKeyDigest: string;
}

/** Closed policy output normalized by the gateway. */
export interface PolicyEvaluationResult {
  readonly verdict: AuthorizationVerdict;
  readonly reasonCode: AuthorizationReasonCode;
  readonly matchedRuleIds: readonly string[];
}

/** Immutable policy definition loaded at gateway construction. */
export interface TransitionPolicyDefinition {
  readonly policyId: string;
  readonly policyVersion: number;
  readonly evaluatorVersion: string;
  readonly ruleIds: readonly string[];
  readonly evaluate: (
    input: Readonly<PolicyEvaluationInput>,
  ) => PolicyEvaluationResult | Promise<PolicyEvaluationResult>;
}

/** Caller-supplied request after envelope preflight and before sequence allocation. */
export interface TransitionAuthorizationRequest {
  readonly requestId: string;
  readonly mode: string;
  readonly event: EventWritePreflight;
  readonly priorHead: LedgerHead;
  readonly priorStateVersion: string;
  readonly priorStateFingerprint: string;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly authorityEpoch: number;
  readonly policy: PolicyReference;
  readonly evidenceDigest: string;
}

/** Read-only domain-ledger view used by the pre-append gateway check. */
export interface AuthorizationLedgerView {
  readonly ledgerId: string;
  readonly registryDigest: string;
  getVerifiedHead(): Promise<LedgerHead>;
}

/** Immutable decision payload stored without raw event or capability material. */
export interface AuthorizationDecisionRecord extends JsonObject {
  readonly decision_id: string;
  readonly request_id: string;
  readonly decision: AuthorizationVerdict;
  readonly reason_code: AuthorizationReasonCode;
  readonly mode: string;
  readonly domain_ledger_id: string;
  readonly stream_id: string;
  readonly prior_head_sequence: number;
  readonly prior_head_hash: string;
  readonly prior_state_version: string;
  readonly prior_state_fingerprint: string;
  readonly requested_event_id: string;
  readonly requested_event_type: string;
  readonly requested_event_version: number;
  readonly requested_event_digest: string;
  readonly event_registry_digest: string;
  readonly actor_id: string;
  readonly capability_id: string;
  readonly authority_state: AuthorityState;
  readonly authority_epoch: number;
  readonly policy_id: string;
  readonly policy_version: number;
  readonly policy_digest: string;
  readonly evaluator_version: string;
  readonly matched_rule_ids: string[];
  readonly request_digest: string;
  readonly evidence_digest: string;
  readonly correlation_id: string;
  readonly causation_id: string | null;
  readonly idempotency_key_digest: string;
  readonly decided_at: string;
  readonly expires_at: string;
  readonly decision_digest: string;
}

/** Immutable non-domain frame emitted only by the gateway. */
export interface AuthorizationAuditFrame {
  readonly frame_version: number;
  readonly ledger_id: string;
  readonly sequence: number;
  readonly prev_record_hash: string;
  readonly canonical_event_hash: string;
  readonly decision_digest: string;
  readonly canonical_event_bytes: string;
  readonly record_hash: string;
}

/** Durable audit location used to construct an allow proof. */
export interface AuthorizationAuditReceipt {
  readonly auditLedgerId: string;
  readonly sequence: number;
  readonly recordHash: string;
  readonly canonicalEventHash: string;
}

/** Opaque-by-validation proof whose authority comes from the durable audit ledger. */
export interface GatewayAllowProof {
  readonly proofVersion: number;
  readonly decision: AuthorizationDecisionRecord;
  readonly auditReceipt: AuthorizationAuditReceipt;
}

export interface GatewayAllowResult {
  readonly verdict: 'allow';
  readonly decision: AuthorizationDecisionRecord;
  readonly proof: GatewayAllowProof;
}

export interface GatewayDenyResult {
  readonly verdict: 'deny';
  readonly reasonCode: AuthorizationReasonCode;
  readonly decision: AuthorizationDecisionRecord | null;
  readonly auditReceipt: AuthorizationAuditReceipt | null;
}

export type GatewayAuthorizationResult = GatewayAllowResult | GatewayDenyResult;

/** Runtime dependencies that cannot be supplied by untrusted requests. */
export interface AuthorizationGatewayOptions {
  readonly rootDirectory: string;
  readonly auditLedgerId?: string;
  readonly decisionFreshnessMs?: number;
  readonly evaluatorTimeoutMs?: number;
  readonly now?: () => Date;
  readonly authorityProvider: (
    mode: string,
  ) => AuthoritySnapshot | Promise<AuthoritySnapshot>;
}

// ───────────────────────────────────────────────────────────────────
// 3. REDUCTION AND REPLAY TYPES
// ───────────────────────────────────────────────────────────────────

/** Pure reducer registered for one event type and reducer version. */
export interface TypedReducerDefinition<TState extends JsonObject> {
  readonly eventType: string;
  readonly reducerVersion: string;
  readonly reduce: (
    state: Readonly<TState>,
    event: Readonly<EventReadResult>,
  ) => TState;
}

/** Rebuildable projection whose bytes derive only from verified input order. */
export interface RebuiltProjection<TState extends JsonObject> {
  readonly reducerVersion: string;
  readonly state: Readonly<TState>;
  readonly canonicalBytes: CanonicalBytes;
  readonly digest: string;
  readonly ledgerHead: LedgerHead;
}

/** Deterministic audit result across decision and domain ledgers. */
export interface AuthorizationReplayReport {
  readonly domainHead: LedgerHead;
  readonly auditHead: LedgerHead;
  readonly appliedDecisionIds: readonly string[];
  readonly unappliedAllowDecisionIds: readonly string[];
  readonly deniedDecisionIds: readonly string[];
  readonly policyDivergences: readonly string[];
  readonly replayDigest: string;
}
