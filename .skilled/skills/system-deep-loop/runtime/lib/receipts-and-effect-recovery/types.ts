// ───────────────────────────────────────────────────────────────────
// MODULE: Receipt and Effect Recovery Types
// ───────────────────────────────────────────────────────────────────

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  FencedLease,
  FencedLedgerWriter,
} from '../locks-and-fencing/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. BOUNDARY RECEIPTS
// ───────────────────────────────────────────────────────────────────

export type BoundaryScope = 'mode' | 'phase';
export type BoundaryAction =
  | 'abort'
  | 'completion'
  | 'enter'
  | 'handoff'
  | 'pause'
  | 'resume';
export type BoundaryKind = `${BoundaryScope}-${BoundaryAction}`;

/** A boundary kind and scope, the result event type it certifies, and the state transition it allows. */
export interface BoundaryDefinition {
  readonly boundaryKind: BoundaryKind;
  readonly scope: BoundaryScope;
  readonly action: BoundaryAction;
  readonly resultEventType: string;
  readonly allowedFromStates: readonly string[];
  readonly toState: string;
  readonly resultCode: string;
}

/** Ledger head as ledger id, sequence and record hash, as recorded inside receipt payloads. */
export interface LedgerHeadFacts extends JsonObject {
  readonly ledger_id: string;
  readonly sequence: number;
  readonly record_hash: string;
}

export type CertificationTrustScope =
  | 'durable-cross-resume'
  | 'process-local-advisory';

/** Scheme, provider, key, verifier version and trust scope a receipt is certified under. */
export interface CertificationProfile extends JsonObject {
  readonly scheme: string;
  readonly provider_id: string;
  readonly key_id: string;
  readonly verifier_version: string;
  readonly trust_scope: CertificationTrustScope;
}

/** A certification profile with the signed digest and base64 signature. */
export interface CertificationEnvelope extends JsonObject {
  readonly scheme: string;
  readonly provider_id: string;
  readonly key_id: string;
  readonly verifier_version: string;
  readonly trust_scope: CertificationTrustScope;
  readonly signed_digest: string;
  readonly signature_base64: string;
}

/**
 * Certified receipt for a boundary transition, binding the from and result heads, the result event digest and the
 * evidence digests.
 */
export interface BoundaryReceiptPayload extends JsonObject {
  readonly receipt_id: string;
  readonly boundary_id: string;
  readonly boundary_kind: BoundaryKind;
  readonly scope: BoundaryScope;
  readonly scope_id: string;
  readonly from_state: string;
  readonly to_state: string;
  readonly from_head: LedgerHeadFacts;
  readonly result_head: LedgerHeadFacts;
  readonly result_event_id: string;
  readonly result_event_type: string;
  readonly result_event_digest: string;
  readonly result_code: string;
  readonly evidence_digest: string;
  readonly artifact_digests: string[];
  readonly replay_fingerprint: string;
  readonly authority_epoch: number;
  readonly correlation_id: string;
  readonly causation_id: string;
  readonly issuer: string;
  readonly issued_at: string;
  readonly idempotency_key: string;
  readonly certification: CertificationEnvelope;
}

/** Signs and verifies canonical receipt bytes under one certification profile. */
export interface ReceiptCertificationProvider {
  readonly profile: CertificationProfile;
  sign(canonicalBytes: Uint8Array): Promise<Uint8Array>;
  verify(canonicalBytes: Uint8Array, signature: Uint8Array): Promise<boolean>;
}

/** Request to issue a receipt for one boundary result event under a certification profile. */
export interface BoundaryReceiptIssueInput {
  readonly boundaryId: string;
  readonly boundaryKind: BoundaryKind;
  readonly scopeId: string;
  readonly resultEventId: string;
  readonly issuer: string;
  readonly certificationProfile: CertificationProfile;
  readonly issuedAt?: string;
}

/** Outcome of issuing a boundary receipt, appended or idempotent, with the payload, durable receipt and event. */
export interface BoundaryReceiptIssueResult {
  readonly status: 'appended' | 'idempotent';
  readonly payload: BoundaryReceiptPayload;
  readonly receipt: DurableAppendReceipt;
  readonly event: EventWritePreflight;
}

// ───────────────────────────────────────────────────────────────────
// 2. AUTHORIZED WRITER
// ───────────────────────────────────────────────────────────────────

/** Mode, prior state, actor, capability, epoch, policy and evidence digest an evidence append is authorized against. */
export interface EvidenceAuthorizationContext {
  readonly mode: string;
  readonly priorStateVersion: string;
  readonly priorStateFingerprint: string;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly authorityEpoch: number;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly evidenceDigest: string;
}

/**
 * Ledger, fence, gateway, policies and registry an authorized evidence writer uses, plus how many head races it
 * retries.
 */
export interface AuthorizedEvidenceWriterOptions {
  readonly ledger: AppendOnlyLedger;
  readonly ledgerFence: {
    readonly writer: FencedLedgerWriter;
    currentLease(): FencedLease | Promise<FencedLease>;
  };
  readonly gateway: TransitionAuthorizationGateway;
  readonly policies: TransitionPolicyRegistry;
  readonly registry: EventTypeRegistry;
  readonly authorizationContext: (
    event: Readonly<EventWritePreflight>,
  ) => EvidenceAuthorizationContext;
  readonly maxHeadRetries?: number;
}

/** Outcome of an authorized evidence append, appended or idempotent, with the receipt and the verified event. */
export interface AuthorizedEvidenceAppendResult {
  readonly status: 'appended' | 'idempotent';
  readonly receipt: DurableAppendReceipt;
  readonly verified: VerifiedLedgerEvent;
}

// ───────────────────────────────────────────────────────────────────
// 3. EFFECT CONTRACT
// ───────────────────────────────────────────────────────────────────

export type EffectType = 'api' | 'file' | 'subprocess';
export type RecoveryVerdict = 'applied' | 'conflict' | 'in_doubt' | 'not_applied';
export type EffectRetryDecision =
  | 'execute_once'
  | 'operator_required'
  | 'reject'
  | 'synthesize_confirmation';

/**
 * Adapter identity and the guarantees it declares: replay safety, idempotency mode and whether reconciliation is
 * conclusive.
 */
export interface EffectAdapterDescriptor extends JsonObject {
  readonly adapter_id: string;
  readonly adapter_version: string;
  readonly effect_type: EffectType;
  readonly replay_safe: boolean;
  readonly idempotency_mode: 'postcondition' | 'target-key';
  readonly reconciliation: 'conclusive' | 'none';
}

/**
 * Intent recorded before an external effect runs: target, input digest, idempotency key, recovery policy and expected
 * postcondition.
 */
export interface EffectIntentPayload extends JsonObject {
  readonly effect_id: string;
  readonly run_id: string;
  readonly logical_effect_id: string;
  readonly effect_type: EffectType;
  readonly operation: string;
  readonly target_identity: string;
  readonly input_digest: string;
  readonly safe_metadata: JsonObject;
  readonly secret_references: string[];
  readonly adapter: EffectAdapterDescriptor;
  readonly idempotency_key: string;
  readonly recovery_policy: string;
  readonly expected_postcondition_digest: string;
  readonly replay_fingerprint: string;
  readonly requested_at: string;
}

/** Digests of what an executed effect produced, with result metadata that is safe to record. */
export interface EffectObservation extends JsonObject {
  readonly external_receipt_digest: string;
  readonly postcondition_digest: string;
  readonly output_digest: string;
  readonly observed_at: string;
  readonly safe_result_metadata: JsonObject;
}

/** Reconciliation verdict for an effect of unknown outcome; the observation is null when nothing applied was found. */
export interface EffectReconciliationObservation extends JsonObject {
  readonly verdict: RecoveryVerdict;
  readonly reason_code: string;
  readonly evidence_digest: string;
  readonly observed_at: string;
  readonly observation: EffectObservation | null;
}

/** Executes one external effect type and reconciles its outcome when a prior attempt ended without confirmation. */
export interface EffectAdapter<TRequest = unknown> {
  readonly descriptor: EffectAdapterDescriptor;
  /**
   * The ledger elects one logical invocation owner. External at-most-once also
   * depends on this adapter making retries idempotent or conclusively observable.
   */
  execute(
    intent: Readonly<EffectIntentPayload>,
    request: TRequest,
    idempotencyKey: string,
  ): Promise<EffectObservation>;
  reconcile(
    intent: Readonly<EffectIntentPayload>,
    request: TRequest,
  ): Promise<EffectReconciliationObservation>;
}

/** A request to run one logical effect, with its canonical input, metadata, secret references and correlation ids. */
export interface EffectExecutionInput<TRequest = unknown> {
  readonly runId: string;
  readonly logicalEffectId: string;
  readonly operation: string;
  readonly targetIdentity: string;
  readonly request: TRequest;
  readonly canonicalInput: JsonValue;
  readonly safeMetadata: JsonObject;
  readonly secretReferences: readonly string[];
  readonly recoveryPolicy: string;
  readonly expectedPostconditionDigest: string;
  readonly replayFingerprint: string;
  readonly requestedAt: string;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
}

/** Confirmation that an intent took effect, by execution or by reconciliation, with its output digests. */
export interface EffectConfirmationPayload extends JsonObject {
  readonly confirmation_id: string;
  readonly effect_id: string;
  readonly intent_event_id: string;
  readonly intent_event_digest: string;
  readonly idempotency_key: string;
  readonly adapter: EffectAdapterDescriptor;
  readonly external_receipt_digest: string;
  readonly postcondition_digest: string;
  readonly output_digest: string;
  readonly completion_class: 'executed' | 'reconciled';
  readonly observed_at: string;
  readonly safe_result_metadata: JsonObject;
}

/** The claimant and fence token that own one recovery attempt. */
export interface EffectRecoveryClaim extends JsonObject {
  readonly claim_id: string;
  readonly claimant_id: string;
  readonly fence_token: string;
  readonly acquired_at: string;
}

/** Event payload that opens a recovery attempt for an intent, with the attempt number and its claim. */
export interface EffectRecoveryStartedPayload extends JsonObject {
  readonly recovery_id: string;
  readonly intent_event_id: string;
  readonly intent_event_digest: string;
  readonly intent_head: LedgerHeadFacts;
  readonly attempt: number;
  readonly reason_code: string;
  readonly claim: EffectRecoveryClaim;
  readonly started_at: string;
}

/** Event payload that closes a recovery attempt with its verdict, retry decision and terminal status. */
export interface EffectReconciledPayload extends JsonObject {
  readonly recovery_id: string;
  readonly intent_event_id: string;
  readonly verdict: RecoveryVerdict;
  readonly reason_code: string;
  readonly evidence_digest: string;
  readonly attempt: number;
  readonly claim: EffectRecoveryClaim;
  readonly retry_decision: EffectRetryDecision;
  readonly terminal_status: 'confirmed' | 'conflict' | 'operator_required' | 'retrying';
  readonly observed_at: string;
}

/**
 * Event payload for a logical effect presented again with an intent that does not match the recorded one; keys are
 * stored only as digests.
 */
export interface EffectConflictPayload extends JsonObject {
  readonly conflict_id: string;
  readonly existing_intent_event_id: string;
  readonly run_id: string;
  readonly logical_effect_id: string;
  readonly existing_idempotency_key_digest: string;
  readonly presented_idempotency_key_digest: string;
  readonly reason_code: string;
  readonly detected_at: string;
}

/** Event payload recording an operator ruling on a recovery that needed one. */
export interface OperatorResolutionPayload extends JsonObject {
  readonly resolution_id: string;
  readonly intent_event_id: string;
  readonly recovery_id: string;
  readonly operator_id: string;
  readonly resolution: 'confirmed_applied' | 'confirmed_not_applied' | 'terminal_failed';
  readonly evidence_digest: string;
  readonly resolved_at: string;
}

/** Test hooks that run at each crash point between intent, effect, confirmation and response. */
export interface EffectGatewayFaultInjection {
  readonly beforeIntent?: () => void;
  readonly afterIntent?: () => void;
  readonly afterEffectBeforeConfirmation?: () => void;
  readonly afterConfirmationBeforeResponse?: () => void;
}

/**
 * Evidence writer, registry, producer, recovery and race-wait limits, claim validator and fault hooks for the effect
 * gateway.
 */
export interface EffectRecoveryGatewayOptions {
  readonly writer: {
    append(event: EventWritePreflight): Promise<AuthorizedEvidenceAppendResult>;
    findEvent(eventId: string): Promise<VerifiedLedgerEvent | null>;
    readVerifiedEvents(): Promise<readonly VerifiedLedgerEvent[]>;
  };
  readonly registry: EventTypeRegistry;
  readonly producer: EventProducer;
  readonly now?: () => Date;
  readonly maxRecoveryAttempts?: number;
  readonly intentRaceWaitMs?: number;
  readonly intentRacePollMs?: number;
  readonly validateRecoveryClaim: (
    claim: Readonly<EffectRecoveryClaim>,
    intent: Readonly<EffectIntentPayload>,
  ) => boolean | Promise<boolean>;
  readonly faultInjection?: EffectGatewayFaultInjection;
}

/** Outcome of executing an effect, confirmed now or idempotent, with the intent and confirmation. */
export interface EffectExecutionResult {
  readonly status: 'confirmed' | 'idempotent';
  readonly idempotencyKey: string;
  readonly intent: EffectIntentPayload;
  readonly confirmation: EffectConfirmationPayload;
}

/** Outcome of a recovery attempt; the confirmation is null when the attempt ends in conflict or needs an operator. */
export interface EffectRecoveryResult {
  readonly status: 'confirmed' | 'conflict' | 'operator_required';
  readonly verdict: RecoveryVerdict;
  readonly idempotencyKey: string;
  readonly confirmation: EffectConfirmationPayload | null;
  readonly recovery: EffectReconciledPayload;
}

/** The original execution input plus the claim, reason code and start time for a recovery attempt. */
export interface EffectRecoveryInput<TRequest = unknown> {
  readonly execution: EffectExecutionInput<TRequest>;
  readonly claim: EffectRecoveryClaim;
  readonly reasonCode: string;
  readonly startedAt: string;
}
