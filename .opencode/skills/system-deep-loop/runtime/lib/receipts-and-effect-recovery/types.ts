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

export interface BoundaryDefinition {
  readonly boundaryKind: BoundaryKind;
  readonly scope: BoundaryScope;
  readonly action: BoundaryAction;
  readonly resultEventType: string;
  readonly allowedFromStates: readonly string[];
  readonly toState: string;
  readonly resultCode: string;
}

export interface LedgerHeadFacts extends JsonObject {
  readonly ledger_id: string;
  readonly sequence: number;
  readonly record_hash: string;
}

export type CertificationTrustScope =
  | 'durable-cross-resume'
  | 'process-local-advisory';

export interface CertificationProfile extends JsonObject {
  readonly scheme: string;
  readonly provider_id: string;
  readonly key_id: string;
  readonly verifier_version: string;
  readonly trust_scope: CertificationTrustScope;
}

export interface CertificationEnvelope extends JsonObject {
  readonly scheme: string;
  readonly provider_id: string;
  readonly key_id: string;
  readonly verifier_version: string;
  readonly trust_scope: CertificationTrustScope;
  readonly signed_digest: string;
  readonly signature_base64: string;
}

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

export interface ReceiptCertificationProvider {
  readonly profile: CertificationProfile;
  sign(canonicalBytes: Uint8Array): Promise<Uint8Array>;
  verify(canonicalBytes: Uint8Array, signature: Uint8Array): Promise<boolean>;
}

export interface BoundaryReceiptIssueInput {
  readonly boundaryId: string;
  readonly boundaryKind: BoundaryKind;
  readonly scopeId: string;
  readonly resultEventId: string;
  readonly issuer: string;
  readonly certificationProfile: CertificationProfile;
  readonly issuedAt?: string;
}

export interface BoundaryReceiptIssueResult {
  readonly status: 'appended' | 'idempotent';
  readonly payload: BoundaryReceiptPayload;
  readonly receipt: DurableAppendReceipt;
  readonly event: EventWritePreflight;
}

// ───────────────────────────────────────────────────────────────────
// 2. AUTHORIZED WRITER
// ───────────────────────────────────────────────────────────────────

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

export interface EffectAdapterDescriptor extends JsonObject {
  readonly adapter_id: string;
  readonly adapter_version: string;
  readonly effect_type: EffectType;
  readonly replay_safe: boolean;
  readonly idempotency_mode: 'postcondition' | 'target-key';
  readonly reconciliation: 'conclusive' | 'none';
}

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

export interface EffectObservation extends JsonObject {
  readonly external_receipt_digest: string;
  readonly postcondition_digest: string;
  readonly output_digest: string;
  readonly observed_at: string;
  readonly safe_result_metadata: JsonObject;
}

export interface EffectReconciliationObservation extends JsonObject {
  readonly verdict: RecoveryVerdict;
  readonly reason_code: string;
  readonly evidence_digest: string;
  readonly observed_at: string;
  readonly observation: EffectObservation | null;
}

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

export interface EffectRecoveryClaim extends JsonObject {
  readonly claim_id: string;
  readonly claimant_id: string;
  readonly fence_token: string;
  readonly acquired_at: string;
}

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

export interface OperatorResolutionPayload extends JsonObject {
  readonly resolution_id: string;
  readonly intent_event_id: string;
  readonly recovery_id: string;
  readonly operator_id: string;
  readonly resolution: 'confirmed_applied' | 'confirmed_not_applied' | 'terminal_failed';
  readonly evidence_digest: string;
  readonly resolved_at: string;
}

export interface EffectGatewayFaultInjection {
  readonly beforeIntent?: () => void;
  readonly afterIntent?: () => void;
  readonly afterEffectBeforeConfirmation?: () => void;
  readonly afterConfirmationBeforeResponse?: () => void;
}

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

export interface EffectExecutionResult {
  readonly status: 'confirmed' | 'idempotent';
  readonly idempotencyKey: string;
  readonly intent: EffectIntentPayload;
  readonly confirmation: EffectConfirmationPayload;
}

export interface EffectRecoveryResult {
  readonly status: 'confirmed' | 'conflict' | 'operator_required';
  readonly verdict: RecoveryVerdict;
  readonly idempotencyKey: string;
  readonly confirmation: EffectConfirmationPayload | null;
  readonly recovery: EffectReconciledPayload;
}

export interface EffectRecoveryInput<TRequest = unknown> {
  readonly execution: EffectExecutionInput<TRequest>;
  readonly claim: EffectRecoveryClaim;
  readonly reasonCode: string;
  readonly startedAt: string;
}
