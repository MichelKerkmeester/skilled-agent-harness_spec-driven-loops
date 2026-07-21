// ──────────────────────────────────────────────────────────────────
// MODULE: Result Envelope Types
// ──────────────────────────────────────────────────────────────────

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type { AuthorizedEvidenceWriter } from '../receipts-and-effect-recovery/index.js';

export type LeafResultStatus = 'cancelled' | 'failed' | 'partial' | 'succeeded' | 'timed_out';
export type ProvenanceKind = 'estimated' | 'measured' | 'unknown';

export interface DigestReference extends JsonObject {
  readonly digest: string;
  readonly kind: string;
  readonly reference: string;
  readonly required: boolean;
}

export interface UsageAccounting extends JsonObject {
  readonly input_tokens: number | null;
  readonly output_tokens: number | null;
  readonly provenance: ProvenanceKind;
  readonly total_tokens: number | null;
}

export interface CostAccounting extends JsonObject {
  readonly amount: number | null;
  readonly currency: string | null;
  readonly provenance: ProvenanceKind;
}

export interface ResultSalvageSummary extends JsonObject {
  readonly disposition: 'failed' | 'none' | 'partial';
  readonly fragment_count: number;
}

export interface LeafResultPayload extends JsonObject {
  readonly artifacts: DigestReference[];
  readonly attempt_id: string;
  readonly authority_epoch: number;
  readonly completed_at: string;
  readonly cost: CostAccounting;
  readonly dispatch_id: string;
  readonly dispatch_receipt_id: string;
  readonly duration_ms: number;
  readonly error_classification: string | null;
  readonly error_digest: string | null;
  readonly event_name: string;
  readonly evidence: DigestReference[];
  readonly invocation_fingerprint: string;
  readonly leaf_id: string;
  readonly logical_branch_id: string;
  readonly parsed_result: JsonValue;
  readonly parsed_result_digest: string;
  readonly parsed_result_reference: DigestReference | null;
  readonly replay_fingerprint: string;
  readonly result_digest: string;
  readonly result_envelope_id: string;
  readonly result_schema_version: number;
  readonly result_status: LeafResultStatus;
  readonly run_id: string;
  readonly salvage_summary: ResultSalvageSummary;
  readonly started_at: string;
  readonly usage: UsageAccounting;
}

export interface LeafResultFacts {
  readonly artifacts: readonly DigestReference[];
  readonly completedAt: string;
  readonly cost: CostAccounting;
  readonly durationMs: number;
  readonly errorClassification: string | null;
  readonly errorDigest: string | null;
  readonly evidence: readonly DigestReference[];
  readonly parsedResult: JsonValue;
  readonly parsedResultDigest: string;
  readonly parsedResultReference: DigestReference | null;
  readonly replayFingerprint: string;
  readonly resultSchemaVersion: number;
  readonly salvageSummary: ResultSalvageSummary;
  readonly startedAt: string;
  readonly status: LeafResultStatus;
  readonly usage: UsageAccounting;
}

export interface ResultEventContext {
  readonly authorityEpoch: number;
  readonly producer: EventProducer;
  readonly streamId: string;
  readonly streamSequence: number;
}

export interface RecordLeafResultInput {
  readonly context: ResultEventContext;
  readonly dispatchReceiptId: string;
  readonly facts: LeafResultFacts;
  readonly registry: EventTypeRegistry;
  readonly writer: AuthorizedEvidenceWriter;
}

export interface RecordedLeafResult {
  readonly authority: 'shadow';
  readonly event: EventWritePreflight;
  readonly receipt: DurableAppendReceipt;
  readonly status: 'appended' | 'idempotent';
  readonly verified: VerifiedLedgerEvent;
}

export type SalvageSourceKind =
  | 'captured_stdout'
  | 'future_typed_fragment'
  | 'iteration_artifact'
  | 'registry'
  | 'state_event';

export interface SalvageFragmentPayload extends JsonObject {
  readonly authority_epoch: number;
  readonly byte_identical_original: boolean;
  readonly byte_length: number;
  readonly completeness: 'complete' | 'partial' | 'unknown';
  readonly confidence: 'high' | 'low' | 'medium' | 'unknown';
  readonly content_digest: string;
  readonly dispatch_receipt_id: string;
  readonly effective_status: 'failed' | 'partial';
  readonly event_name: string;
  readonly failure_reason: string | null;
  readonly parser_name: string;
  readonly parser_version: string;
  readonly reconstructed: boolean;
  readonly recovered_scope: JsonObject;
  readonly replay_fingerprint: string;
  readonly result_envelope_id: string | null;
  readonly salvage_digest: string;
  readonly salvage_event_id: string;
  readonly schema_version: number;
  readonly source_digest: string;
  readonly source_kind: SalvageSourceKind;
  readonly source_reference: string;
  readonly verdict: 'conflict' | 'recovered' | 'rejected' | 'unrecoverable';
}

export interface SalvageFragmentFacts {
  readonly byteIdenticalOriginal: boolean;
  readonly byteLength: number;
  readonly completeness: SalvageFragmentPayload['completeness'];
  readonly confidence: SalvageFragmentPayload['confidence'];
  readonly contentDigest: string;
  readonly effectiveStatus: SalvageFragmentPayload['effective_status'];
  readonly failureReason: string | null;
  readonly observedAt: string;
  readonly parserName: string;
  readonly parserVersion: string;
  readonly reconstructed: boolean;
  readonly recoveredScope: JsonObject;
  readonly replayFingerprint: string;
  readonly resultEnvelopeId: string | null;
  readonly schemaVersion: number;
  readonly sourceDigest: string;
  readonly sourceKind: SalvageSourceKind;
  readonly sourceReference: string;
  readonly verdict: SalvageFragmentPayload['verdict'];
}

export interface RecordSalvageFragmentInput {
  readonly context: ResultEventContext;
  readonly dispatchReceiptId: string;
  readonly facts: SalvageFragmentFacts;
  readonly registry: EventTypeRegistry;
  readonly writer: AuthorizedEvidenceWriter;
}

export interface LeafRecoveryPayload extends JsonObject {
  readonly attempt: number;
  readonly authority_epoch: number;
  readonly dispatch_receipt_id: string;
  readonly effect_evidence_digest: string;
  readonly event_name: string;
  readonly recovery_digest: string;
  readonly recovery_link_id: string;
  readonly replay_fingerprint: string;
  readonly retry_decision: 'execute_once' | 'operator_required' | 'reject' | 'synthesize_confirmation';
  readonly source_effect_event_digest: string;
  readonly source_effect_event_id: string;
  readonly terminal_status: 'confirmed' | 'conflict' | 'operator_required' | 'retrying';
  readonly verdict: 'applied' | 'conflict' | 'in_doubt' | 'not_applied';
}

export interface RecordLeafRecoveryInput {
  readonly context: ResultEventContext;
  readonly dispatchReceiptId: string;
  readonly expectedCorrelationId: string;
  readonly replayFingerprint: string;
  readonly registry: EventTypeRegistry;
  readonly source: VerifiedLedgerEvent;
  readonly writer: AuthorizedEvidenceWriter;
}

export interface ArtifactResolution {
  readonly byteLength: number;
  readonly digest: string;
}

export type DigestResolver = (
  reference: Readonly<DigestReference>,
) => ArtifactResolution | null | Promise<ArtifactResolution | null>;

export interface ExpectedLeafAttempt {
  readonly dispatchId: string;
  readonly leafId: string;
  readonly retryPolicyEligible: boolean;
}

export type LeafProgressClassification =
  | 'cancelled'
  | 'conflicted'
  | 'dispatched_in_flight'
  | 'failed'
  | 'not_dispatched'
  | 'partial'
  | 'salvaged'
  | 'succeeded'
  | 'timed_out'
  | 'unreadable';

export interface LeafProgressState extends JsonObject {
  readonly classification: LeafProgressClassification;
  readonly dispatch_id: string;
  readonly dispatch_receipt_id: string;
  readonly eligible_for_dispatch: boolean;
  readonly leaf_id: string;
  readonly reason_code: string;
  readonly recovery_verdict: string | null;
  readonly result_envelope_id: string | null;
  readonly terminal_status: LeafResultStatus | null;
}

export interface ResumeProgressSnapshot extends JsonObject {
  readonly authority: 'shadow';
  readonly completed_leaf_ids: string[];
  readonly eligible_dispatch_ids: string[];
  readonly expected_leaf_digest: string;
  readonly integrity: 'trusted' | 'unreadable';
  readonly leaves: LeafProgressState[];
  readonly ledger_head_hash: string;
  readonly ledger_head_sequence: number;
  readonly reducer_version: string;
  readonly registry_digest: string;
  readonly registry_version: string;
  readonly scheduling_exclusions: string[];
}

export interface FoldResumeInput {
  readonly expectedLeaves: readonly ExpectedLeafAttempt[];
  readonly ledger: AppendOnlyLedger;
  readonly registryVersion: string;
  readonly resolver: DigestResolver;
}

export interface FoldResumeResult {
  readonly canonicalBytes: string;
  readonly canonicalDigest: string;
  readonly snapshot: ResumeProgressSnapshot;
}
