// ───────────────────────────────────────────────────────────────────
// MODULE: Partial Failure Policy Types
// ───────────────────────────────────────────────────────────────────

import type {
  AuthorizedEvidenceAppendResult,
  AuthorizedEvidenceWriter,
} from '../receipts-and-effect-recovery/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  JsonObject,
} from '../event-envelope/index.js';
import type { FanInDecisionView } from '../conditional-fanin/index.js';
import type { DispatchReceiptPayload } from '../dispatch-receipts/index.js';
import type { LeafResultPayload } from '../result-envelopes/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. POLICY AND DENOMINATOR
// ───────────────────────────────────────────────────────────────────

export type PartialFailureMode = 'deadline' | 'progressive' | 'quorum' | 'strict';
export type DecisionBoundaryState = 'deadline_expired' | 'open' | 'terminal';
export type PartialFailureVerdict = 'abort' | 'await' | 'proceed' | 'proceed_degraded';
export type EvaluationFinality = 'final' | 'provisional';
export type PolicyApplicability = 'applicable' | 'not_applicable';

export interface CountFractionGate extends JsonObject {
  readonly count: number | null;
  readonly denominator: number;
  readonly numerator: number;
}

export interface PartialFailurePolicy extends JsonObject {
  readonly failureGate: CountFractionGate;
  readonly mode: PartialFailureMode;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly successGate: CountFractionGate;
}

export interface PartialFailurePolicyReference extends JsonObject {
  readonly policyDigest: string;
  readonly policyId: string;
  readonly policyVersion: number;
}

export interface NotAwaitedLeaf extends JsonObject {
  readonly evidenceId: string;
  readonly leafId: string;
  readonly logicalBranchId: string;
  readonly reasonCode: string;
}

export interface AdmittedBranch extends JsonObject {
  readonly attemptIds: string[];
  readonly dispatchIds: string[];
  readonly dispatchReceiptIds: string[];
  readonly executorKinds: string[];
  readonly leafId: string;
  readonly logicalBranchId: string;
}

export interface FrozenDecisionBoundary extends JsonObject {
  readonly ledgerId: string;
  readonly recordHash: string;
  readonly registryDigest: string;
  readonly sequence: number;
}

export interface FrozenAdmittedSet extends JsonObject {
  readonly admittedSetDigest: string;
  readonly branches: AdmittedBranch[];
  readonly decisionBoundary: FrozenDecisionBoundary;
  readonly decisionEpochId: string;
  readonly notAwaited: NotAwaitedLeaf[];
  readonly partialFailurePolicyReference: string | null;
  readonly replayFingerprint: string;
  readonly runId: string;
  readonly schemaVersion: 1;
  readonly waveId: string;
}

export interface FreezeAdmittedSetInput {
  readonly decisionView: FanInDecisionView;
  readonly dispatchReceipts: readonly DispatchReceiptPayload[];
  readonly notAwaited?: readonly NotAwaitedLeaf[];
}

export interface DecisionEpoch extends JsonObject {
  readonly boundaryState: DecisionBoundaryState;
  readonly deadlineAt: string | null;
  readonly emptyTickDeclared: boolean;
  readonly epochId: string;
  readonly evaluatedAt: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. FAILURE TAXONOMY
// ───────────────────────────────────────────────────────────────────

export type FailureStage =
  | 'artifact'
  | 'budget'
  | 'executor'
  | 'orchestration'
  | 'policy'
  | 'salvage';

export type LeafFailureClass =
  | 'artifact_missing'
  | 'artifact_parse'
  | 'budget_rejected'
  | 'deadline_expired'
  | 'executor_exit'
  | 'executor_signal'
  | 'executor_timeout'
  | 'leaf_policy_violation'
  | 'orchestration_integrity'
  | 'salvage_exhausted';

export type FailureRetryability = 'exhausted' | 'non_retryable';
export type FailureImpact = 'leaf_local' | 'run_fatal';

export interface RetryDiagnostic extends JsonObject {
  readonly attemptEventId: string;
  readonly attemptId: string;
  readonly attemptNumber: number;
  readonly diagnosticCode: string;
  readonly diagnosticSummary: string | null;
  readonly logicalBranchId: string;
  readonly occurredAt: string;
  readonly retryScheduled: boolean;
}

export interface TerminalFailureEnvelope extends JsonObject {
  readonly artifact_references: string[];
  readonly attempt_event_ids: string[];
  readonly attempt_id: string | null;
  readonly completed_at: string;
  readonly decision_epoch_id: string;
  readonly diagnostic_code: string;
  readonly diagnostic_summary: string | null;
  readonly dispatch_id: string | null;
  readonly dispatch_receipt_id: string | null;
  readonly event_name: string;
  readonly executor_kind: string | null;
  readonly failure_class: LeafFailureClass;
  readonly failure_id: string;
  readonly impact: FailureImpact;
  readonly leaf_id: string | null;
  readonly logical_branch_id: string | null;
  readonly retryability: FailureRetryability;
  readonly run_id: string;
  readonly source_result_digest: string | null;
  readonly source_result_envelope_id: string | null;
  readonly stage: FailureStage;
  readonly started_at: string;
  readonly terminal: true;
}

export interface TerminalFailureInput {
  readonly artifactReferences?: readonly string[];
  readonly attemptEventIds?: readonly string[];
  readonly attemptId: string;
  readonly completedAt: string;
  readonly diagnosticCode: string;
  readonly diagnosticSummary?: string | null;
  readonly dispatchReceiptId: string;
  readonly failureClass: Exclude<LeafFailureClass, 'orchestration_integrity'>;
  readonly retryability: FailureRetryability;
  readonly sourceResult?: LeafResultPayload | null;
  readonly startedAt: string;
}

export interface IntegrityFailureInput {
  readonly completedAt: string;
  readonly decisionEpochId: string;
  readonly diagnosticCode: string;
  readonly diagnosticSummary?: string | null;
  readonly runId: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. EVALUATION AND HANDOFF
// ───────────────────────────────────────────────────────────────────

export interface SuccessFraction extends JsonObject {
  readonly denominator: number;
  readonly numerator: number;
}

export interface PolicyEvaluationReceipt extends JsonObject {
  readonly admitted: number;
  readonly admitted_set_digest: string;
  readonly applicability: PolicyApplicability;
  readonly boundary_state: DecisionBoundaryState;
  readonly decision_epoch_id: string;
  readonly evaluated_at: string;
  readonly evaluation_digest: string;
  readonly event_name: string;
  readonly failed: number;
  readonly failed_logical_branch_ids: string[];
  readonly finality: EvaluationFinality;
  readonly not_awaited: number;
  readonly ordered_input_ids: string[];
  readonly pending: number;
  readonly policy_digest: string;
  readonly policy_id: string;
  readonly policy_mode: PartialFailureMode;
  readonly policy_version: number;
  readonly reason_codes: string[];
  readonly receipt_id: string;
  readonly replay_fingerprint: string;
  readonly required_success_count: number;
  readonly retry_event_ids: string[];
  readonly run_id: string;
  readonly success_fraction: SuccessFraction;
  readonly succeeded: number;
  readonly successful_result_envelope_ids: string[];
  readonly terminal_failure_ids: string[];
  readonly tolerated_failure_ceiling: number;
  readonly verdict: PartialFailureVerdict | null;
}

export interface DegradedResultMarker extends JsonObject {
  readonly admitted: number;
  readonly degraded: true;
  readonly failed: number;
  readonly failed_logical_branch_ids: string[];
  readonly finality: 'final';
  readonly marker_id: string;
  readonly marker_type: 'degraded';
  readonly not_awaited: number;
  readonly policy_evaluation_receipt_id: string;
  readonly policy_id: string;
  readonly policy_version: number;
  readonly reason_codes: string[];
  readonly success_fraction: SuccessFraction;
  readonly succeeded: number;
  readonly tolerated_failure_ceiling: number;
}

export interface AbortMarker extends JsonObject {
  readonly abort_id: string;
  readonly decision_epoch_id: string;
  readonly failed_logical_branch_ids: string[];
  readonly marker_type: 'abort';
  readonly policy_evaluation_receipt_id: string;
  readonly reason_codes: string[];
  readonly run_id: string;
}

export interface LateResultRecord extends JsonObject {
  readonly closed_policy_evaluation_receipt_id: string;
  readonly decision_epoch_id: string;
  readonly event_name: string;
  readonly excluded: true;
  readonly late_result_id: string;
  readonly logical_branch_id: string;
  readonly observed_at: string;
  readonly reason_code: 'decision_epoch_closed';
  readonly result_digest: string;
  readonly result_envelope_id: string;
  readonly run_id: string;
}

export interface PartialFailureReductionRequest {
  readonly degradedMarker: DegradedResultMarker | null;
  readonly policyEvaluationReceipt: PolicyEvaluationReceipt;
  readonly successfulEnvelopes: readonly LeafResultPayload[];
}

export interface PartialFailureEvaluation {
  readonly abortMarker: AbortMarker | null;
  readonly applicability: PolicyApplicability;
  readonly degradedMarker: DegradedResultMarker | null;
  readonly finality: EvaluationFinality;
  readonly lateResults: readonly LateResultRecord[];
  readonly policyEvaluationReceipt: PolicyEvaluationReceipt;
  readonly reductionRequest: PartialFailureReductionRequest | null;
  readonly synthesizedFailures: readonly TerminalFailureEnvelope[];
  readonly verdict: PartialFailureVerdict | null;
}

export interface LegacyFanOutOutcome<TValue> {
  readonly exitCode: 0 | 2 | 3;
  readonly status: 'ok' | 'partial';
  readonly value: TValue;
}

export type ShadowDifferenceClassification =
  | 'aligned'
  | 'known_defect_difference'
  | 'not_applicable'
  | 'unexpected_difference';

export interface PolicyShadowComparisonReceipt extends JsonObject {
  readonly classification: ShadowDifferenceClassification;
  readonly compared_at: string;
  readonly comparison_digest: string;
  readonly comparison_id: string;
  readonly event_name: string;
  readonly legacy_exit_code: 0 | 2 | 3;
  readonly legacy_status: 'ok' | 'partial';
  readonly policy_evaluation_receipt_id: string;
  readonly run_id: string;
  readonly typed_applicability: PolicyApplicability;
  readonly typed_finality: EvaluationFinality;
  readonly typed_verdict: PartialFailureVerdict | null;
}

export interface PartialFailureShadowResult<TValue> {
  readonly authority: 'legacy-authoritative';
  readonly comparison: PolicyShadowComparisonReceipt;
  readonly legacyOutcome: LegacyFanOutOutcome<TValue>;
  readonly shadowEvaluation: PartialFailureEvaluation;
}

export interface EvaluatePartialFailureInput {
  readonly admittedSet: FrozenAdmittedSet;
  readonly closedEvaluation?: PartialFailureEvaluation | null;
  readonly decisionEpoch: DecisionEpoch;
  readonly policy: PartialFailurePolicy | null;
  readonly retryDiagnostics?: readonly RetryDiagnostic[];
  readonly successfulResults: readonly LeafResultPayload[];
  readonly terminalFailures: readonly TerminalFailureEnvelope[];
}

// ───────────────────────────────────────────────────────────────────
// 4. LEDGER EVENTS
// ───────────────────────────────────────────────────────────────────

export interface PartialFailureEventContext {
  readonly authorityEpoch: number;
  readonly causationId: string | null;
  readonly correlationId: string;
  readonly producer: EventProducer;
  readonly recordedAt: string;
  readonly streamId: string;
  readonly streamSequence: number;
}

export interface RecordPartialFailureEvaluationInput {
  readonly context: PartialFailureEventContext;
  readonly evaluation: PartialFailureEvaluation;
  readonly registry: EventTypeRegistry;
  readonly terminalFailures: readonly TerminalFailureEnvelope[];
  readonly writer: AuthorizedEvidenceWriter;
}

export interface RecordedPartialFailureEvaluation {
  readonly evaluation: AuthorizedEvidenceAppendResult;
  readonly lateResults: readonly AuthorizedEvidenceAppendResult[];
  readonly terminalFailures: readonly AuthorizedEvidenceAppendResult[];
  readonly transition: AuthorizedEvidenceAppendResult | null;
}
