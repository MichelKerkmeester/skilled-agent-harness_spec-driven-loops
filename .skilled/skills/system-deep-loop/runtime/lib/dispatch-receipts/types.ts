// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Receipt Types
// ───────────────────────────────────────────────────────────────────

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type { AuthorizedEvidenceWriter } from '../receipts-and-effect-recovery/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. RESOLVED LAUNCH CONTRACT
// ───────────────────────────────────────────────────────────────────

/** Closed effective configuration returned by the resolved executor adapter. */
export interface DispatchEffectiveConfig extends JsonObject {
  readonly executable: string;
  readonly executableVersion: string;
  readonly kind: string;
  readonly model: string | null;
  readonly permissionMode: string;
  readonly reasoningEffort: string | null;
  readonly sandboxMode: string;
  readonly serviceTier: string | null;
  readonly webSearch: string;
}

/** Adapter output plus ephemeral values needed to independently verify its fingerprint. */
export interface ResolvedAdapterInvocation {
  readonly adapterIdentity: string;
  readonly adapterVersion: string;
  readonly args: readonly string[];
  readonly command: string;
  readonly effectiveConfig: DispatchEffectiveConfig;
  readonly input?: string;
  readonly invocationFingerprint: string;
  readonly prompt: string;
  readonly promptArgIndexes: readonly number[];
}

/** Safe digest and launch facts retained after raw adapter inputs are discarded. */
export interface VerifiedLaunchFacts {
  readonly adapterIdentity: string;
  readonly adapterVersion: string;
  readonly effectiveConfig: DispatchEffectiveConfig;
  readonly effectiveConfigDigest: string;
  readonly inputDigest: string;
  readonly invocationFingerprint: string;
  readonly promptDigest: string;
}

/** Ordered resolution stages that must complete before receipt construction. */
export interface DispatchResolutionPipeline<
  TExpandedConfig,
  TCapabilities,
  TManifestLeaf,
> {
  expandConfiguration(): TExpandedConfig | Promise<TExpandedConfig>;
  validateCapabilities(
    expandedConfig: Readonly<TExpandedConfig>,
  ): TCapabilities | Promise<TCapabilities>;
  expandManifest(
    expandedConfig: Readonly<TExpandedConfig>,
    capabilities: Readonly<TCapabilities>,
  ): TManifestLeaf | Promise<TManifestLeaf>;
  resolveAdapter(
    manifestLeaf: Readonly<TManifestLeaf>,
    capabilities: Readonly<TCapabilities>,
    expandedConfig: Readonly<TExpandedConfig>,
  ): ResolvedAdapterInvocation | Promise<ResolvedAdapterInvocation>;
}

// ───────────────────────────────────────────────────────────────────
// 2. EVENT AND INTEGRITY CONTRACT
// ───────────────────────────────────────────────────────────────────

export type DispatchReceiptMacTrustScope =
  | 'durable-cross-resume'
  | 'process-local-advisory';

export interface DispatchReceiptMacProfile {
  readonly keyId: string;
  readonly providerId: string;
  readonly scheme: 'hmac-sha256';
  readonly trustScope: DispatchReceiptMacTrustScope;
  readonly verifierVersion: string;
}

/** A provider owns key material and declares whether it can reconstruct it after restart. */
export interface DispatchReceiptMacProvider {
  readonly profile: DispatchReceiptMacProfile;
  canVerifyAfterRestart(): boolean;
  deriveKey(dispatchId: string): string;
}

export type DispatchReceiptMacVerification =
  | 'durable-verified'
  | 'ledger-only'
  | 'process-local-advisory-unavailable'
  | 'process-local-advisory-verified';

/** Closed payload persisted inside the canonical pre-spawn envelope. */
export interface DispatchReceiptPayload extends JsonObject {
  readonly adapter_identity: string;
  readonly adapter_version: string;
  readonly attempt_id: string;
  readonly canonicalization_version: string;
  readonly capability_row_id: string;
  readonly dispatch_id: string;
  readonly effective_config_digest: string;
  readonly event_name: string;
  readonly executable_identity: string;
  readonly executable_version: string;
  readonly executor_kind: string;
  readonly fingerprint_algorithm: string;
  readonly fingerprint_namespace: string;
  readonly fingerprint_version: number;
  readonly input_digest: string;
  readonly invocation_fingerprint: string;
  readonly leaf_id: string;
  readonly logical_branch_id: string;
  readonly mac: string | null;
  readonly mac_key_id: string;
  readonly mac_key_provider_id: string;
  readonly mac_scheme: 'hmac-sha256' | 'none';
  readonly mac_trust_scope:
    | 'durable-cross-resume'
    | 'ledger-only'
    | 'process-local-advisory';
  readonly mac_verifier_version: string;
  readonly model: string | null;
  readonly prompt_digest: string;
  readonly reasoning_effort: string | null;
  readonly receipt_id: string;
  readonly run_id: string;
  readonly search_policy: string;
  readonly service_tier: string | null;
}

export interface DispatchReceiptEnvelopeInput {
  readonly attemptId: string;
  readonly authorityEpoch: number;
  readonly capabilityRowId: string;
  readonly causationId: string | null;
  readonly correlationId: string;
  readonly dispatchId: string;
  readonly leafId: string;
  readonly logicalBranchId: string;
  readonly occurredAt: string;
  readonly producer: EventProducer;
  readonly recordedAt: string;
  readonly runId: string;
  readonly streamId: string;
  readonly streamSequence: number;
}

// ───────────────────────────────────────────────────────────────────
// 3. DISPATCH BARRIER
// ───────────────────────────────────────────────────────────────────

/** Stable typed evidence exposed to result, salvage, lease, and fan-in consumers. */
export interface DispatchReceiptEvidence {
  readonly canonicalEventHash: string;
  readonly dispatchId: string;
  readonly invocationFingerprint: string;
  readonly leafId: string;
  readonly ledgerId: string;
  readonly ledgerSequence: number;
  readonly logicalBranchId: string;
  readonly receiptId: string;
  readonly recordHash: string;
  readonly unresolvedClassification: 'dispatch-resolved' | 'unresolved';
}

export interface UnresolvedDispatchHandoff {
  readonly classification: 'unresolved';
  readonly effectRecovery: {
    readonly action: 'reconcile';
    readonly reason: 'dispatch-receipt-without-result';
  };
  readonly evidence: DispatchReceiptEvidence;
  readonly successorSalvage: {
    readonly action: 'inspect-and-salvage';
    readonly reason: 'terminal-result-missing';
  };
}

export interface DispatchBarrierFaultInjection {
  readonly afterDurableAppendBeforeSpawn?: () => void;
}

export interface DispatchWithReceiptInput<
  TExpandedConfig,
  TCapabilities,
  TManifestLeaf,
  TResult,
> {
  readonly envelope: DispatchReceiptEnvelopeInput;
  readonly faultInjection?: DispatchBarrierFaultInjection;
  readonly macProvider?: DispatchReceiptMacProvider;
  readonly pipeline: DispatchResolutionPipeline<
    TExpandedConfig,
    TCapabilities,
    TManifestLeaf
  >;
  readonly registry: EventTypeRegistry;
  readonly routeUnresolved?: (
    handoff: Readonly<UnresolvedDispatchHandoff>,
  ) => void | Promise<void>;
  readonly spawn: (
    invocation: Readonly<ResolvedAdapterInvocation>,
    evidence: Readonly<DispatchReceiptEvidence>,
  ) => TResult | Promise<TResult>;
  readonly writer: AuthorizedEvidenceWriter;
}

export type DispatchBarrierResult<TResult> =
  | {
      readonly authority: 'legacy-authoritative';
      readonly event: EventWritePreflight;
      readonly evidence: DispatchReceiptEvidence;
      readonly receipt: DurableAppendReceipt;
      readonly spawnResult: TResult;
      readonly status: 'spawned';
    }
  | {
      readonly authority: 'legacy-authoritative';
      readonly event: EventWritePreflight;
      readonly evidence: DispatchReceiptEvidence;
      readonly handoff: UnresolvedDispatchHandoff;
      readonly receipt: DurableAppendReceipt;
      readonly status: 'unresolved';
    };

// ───────────────────────────────────────────────────────────────────
// 4. RESUME CONTRACT
// ───────────────────────────────────────────────────────────────────

/** Result evidence must already have passed the successor's verifier. */
export interface VerifiedDispatchResultEvidence {
  readonly dispatchId: string;
  readonly invocationFingerprint: string;
  readonly receiptId: string;
  readonly resultDigest: string;
  readonly resultId: string;
  readonly verified: true;
}

export interface ResumeDispatchInput {
  readonly desiredInvocationFingerprint: string;
  readonly dispatchId: string;
  readonly ledger: AppendOnlyLedger;
  readonly macProviders?: readonly DispatchReceiptMacProvider[];
  readonly result?: VerifiedDispatchResultEvidence | null;
  readonly routeUnresolved?: (
    handoff: Readonly<UnresolvedDispatchHandoff>,
  ) => void | Promise<void>;
}

export type DispatchResumeDecision =
  | {
      readonly authority: 'ledger';
      readonly classification: 'not_dispatched';
      readonly eligibleForFirstDispatch: true;
    }
  | {
      readonly authority: 'ledger';
      readonly classification: 'result_recorded';
      readonly eligibleForFirstDispatch: false;
      readonly evidence: DispatchReceiptEvidence;
      readonly macVerification: DispatchReceiptMacVerification;
      readonly result: VerifiedDispatchResultEvidence;
    }
  | {
      readonly authority: 'ledger';
      readonly classification: 'unresolved';
      readonly eligibleForFirstDispatch: false;
      readonly evidence: DispatchReceiptEvidence;
      readonly handoff: UnresolvedDispatchHandoff;
      readonly macVerification: DispatchReceiptMacVerification;
    }
  | {
      readonly authority: 'ledger';
      readonly classification: 'conflict';
      readonly eligibleForFirstDispatch: false;
      readonly evidence: DispatchReceiptEvidence;
      readonly needsNewAuthorizedDispatchIdentity: true;
      readonly reasonCode: 'DESIRED_FINGERPRINT_MISMATCH' | 'RESULT_BINDING_MISMATCH';
    }
  | {
      readonly authority: 'ledger';
      readonly classification: 'corrupt';
      readonly eligibleForFirstDispatch: false;
      readonly reasonCode: string;
    };
