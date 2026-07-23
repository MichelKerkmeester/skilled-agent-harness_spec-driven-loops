// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Ledger Types
// ───────────────────────────────────────────────────────────────────

import type {
  EventEnvelope,
  JsonObject,
} from '../event-envelope/index.js';
import type { ReplayFingerprintDescriptor } from '../replay-fingerprint/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. IDENTITIES AND SHARED METADATA
// ───────────────────────────────────────────────────────────────────

export type RunId = string;
export type LineageId = string;
export type CandidateId = string;
export type EvaluationEpochId = string;
export type FixtureId = string;
export type ObservationId = string;
export type CanaryEpochId = string;
export type CanarySuiteId = string;
export type PromotionId = string;
export type BaselineId = string;
export type Digest = string;
export type Fingerprint = string;
export type Version = string;
export type Uint32 = number;

export type DeepImprovementVariant =
  | 'agent-improvement'
  | 'model-benchmark'
  | 'skill-benchmark';

export interface DeepImprovementCommonReplayMetadata extends JsonObject {
  readonly fingerprint_version: ReplayFingerprintDescriptor['fingerprint_version'];
  readonly final_digest: ReplayFingerprintDescriptor['final_digest'];
  readonly replay_input_digests: Record<string, string>;
}

export interface DeepImprovementCommonBaseScope extends JsonObject {
  readonly runId: RunId;
  readonly lineageId: LineageId;
  readonly variant: DeepImprovementVariant;
}

export interface DeepImprovementCommonCandidateScope
  extends DeepImprovementCommonBaseScope {
  readonly candidateId: CandidateId;
}

export interface DeepImprovementCommonEvaluationScope
  extends DeepImprovementCommonCandidateScope {
  readonly evaluationEpochId: EvaluationEpochId;
}

export interface DeepImprovementCommonObservationScope
  extends DeepImprovementCommonEvaluationScope {
  readonly fixtureId: FixtureId;
  readonly observationId: ObservationId;
}

export interface DeepImprovementCommonCanaryScope
  extends DeepImprovementCommonCandidateScope {
  readonly canaryEpochId: CanaryEpochId;
  readonly canarySuiteId: CanarySuiteId;
}

export interface DeepImprovementCommonPromotionScope
  extends DeepImprovementCommonCandidateScope {
  readonly promotionId: PromotionId;
  readonly baselineId: BaselineId;
}

export type DeepImprovementCommonScope =
  | DeepImprovementCommonBaseScope
  | DeepImprovementCommonCandidateScope
  | DeepImprovementCommonEvaluationScope
  | DeepImprovementCommonObservationScope
  | DeepImprovementCommonCanaryScope
  | DeepImprovementCommonPromotionScope;

// ───────────────────────────────────────────────────────────────────
// 2. PAYLOAD VALUE OBJECTS
// ───────────────────────────────────────────────────────────────────

export interface ScoreComponent extends JsonObject {
  readonly dimensionCode: string;
  readonly rawScore: number;
  readonly normalizedScore: number;
  readonly weight: number;
}

export interface DeepImprovementScoreVector extends JsonObject {
  readonly components: ScoreComponent[];
  readonly aggregateScore: number;
  readonly uncertainty: number;
}

export interface DeepImprovementCompletionCounts extends JsonObject {
  readonly candidates: Uint32;
  readonly evaluations: Uint32;
  readonly observations: Uint32;
  readonly canaryRuns: Uint32;
  readonly promotions: Uint32;
}

// ───────────────────────────────────────────────────────────────────
// 3. EVENT PAYLOAD DATA
// ───────────────────────────────────────────────────────────────────

export interface RunStartedData extends JsonObject {
  readonly generation: Uint32;
  readonly charterDigest: Digest;
  readonly configDigest: Digest;
  readonly operatorRef: string;
  readonly serviceContractVersion: Version;
  readonly replayFingerprint: Fingerprint;
  readonly maxIterations: Uint32;
}

export interface RunResumedData extends JsonObject {
  readonly priorTailDigest: Digest;
  readonly sourceLineageId: LineageId;
  readonly resumeReason: string;
  readonly generation: Uint32;
  readonly compatibilityDecision: DeepImprovementCommonCompatibilityStatus;
  readonly recoveryReceiptRef: string;
}

export interface RunPausedData extends JsonObject {
  readonly pauseReason: string;
  readonly checkpointRef: string;
  readonly checkpointDigest: Digest;
  readonly pendingCandidateIds: string[];
  readonly pausedAt: string;
}

export interface RunCompletedData extends JsonObject {
  readonly terminalOutcome: 'aborted' | 'completed' | 'quarantined';
  readonly stopReason:
    | 'blockedStop'
    | 'converged'
    | 'error'
    | 'manualStop'
    | 'maxIterationsReached'
    | 'stuckRecovery';
  readonly sessionOutcome: 'advisoryOnly' | 'keptBaseline' | 'promoted' | 'rolledBack';
  readonly finalLedgerTailHash: Digest;
  readonly counts: DeepImprovementCompletionCounts;
  readonly completionEvidenceRefs: string[];
}

export interface RunAbortedData extends JsonObject {
  readonly abortReason: string;
  readonly lastSafeEventId: string;
  readonly evidenceRefs: string[];
  readonly retryable: boolean;
}

export interface RunQuarantinedData extends JsonObject {
  readonly quarantineReasonCode: string;
  readonly quarantineEvidenceRef: string;
  readonly quarantineEvidenceDigest: Digest;
  readonly affectedCandidateIds: string[];
  readonly policyVersion: Version;
}

export interface CandidateProposedData extends JsonObject {
  readonly proposalRef: string;
  readonly proposalDigest: Digest;
  readonly mutationOperatorRef: string;
  readonly mutationOperatorVersion: Version;
  readonly parentCandidateId: CandidateId | null;
  readonly targetRef: string;
  readonly targetDigest: Digest;
  readonly proposalPolicyVersion: Version;
}

export interface CandidateGeneratedData extends JsonObject {
  readonly proposalEventId: string;
  readonly proposalPayloadDigest: Digest;
  readonly candidateArtifactRef: string;
  readonly candidateArtifactDigest: Digest;
  readonly generationReceiptRef: string;
  readonly mutationOperatorRef: string;
  readonly mutationOperatorVersion: Version;
}

export interface CandidateRejectedData extends JsonObject {
  readonly candidateEventId: string;
  readonly candidatePayloadDigest: Digest;
  readonly rejectionReasonCode: string;
  readonly evidenceRefs: string[];
  readonly evidenceSetDigest: Digest;
  readonly policyVersion: Version;
}

export interface CandidateLineageAttachedData extends JsonObject {
  readonly parentCandidateId: CandidateId;
  readonly parentCandidateDigest: Digest;
  readonly lineageEdgeRef: string;
  readonly lineageEdgeDigest: Digest;
  readonly operatorRef: string;
}

export interface EvaluationEpochSealedData extends JsonObject {
  readonly evaluatorRef: string;
  readonly evaluatorCapsuleDigest: Digest;
  readonly fixtureSetRef: string;
  readonly fixtureSetDigest: Digest;
  readonly scorePolicyVersion: Version;
  readonly scoreWriteBackendRef: string;
  readonly evaluationBudgetRef: string;
}

export interface EvaluationStartedData extends JsonObject {
  readonly epochSealedEventId: string;
  readonly epochPayloadDigest: Digest;
  readonly executionReceiptRef: string;
  readonly fixtureCount: Uint32;
  readonly evaluatorFingerprint: Fingerprint;
}

export interface EvaluationObservationRecordedData extends JsonObject {
  readonly evaluationStartedEventId: string;
  readonly evaluatorRef: string;
  readonly fixtureRef: string;
  readonly rawObservationRef: string;
  readonly rawObservationDigest: Digest;
  readonly executionReceiptRef: string;
  readonly observationOutcome: 'error' | 'fail' | 'pass' | 'timeout';
}

export interface EvaluationNormalizedData extends JsonObject {
  readonly observationEventIds: string[];
  readonly observationSetDigest: Digest;
  readonly scorePolicyVersion: Version;
  readonly scorerFingerprint: Fingerprint;
  readonly scoreWriteBackendRef: string;
  readonly scoreVector: DeepImprovementScoreVector;
  readonly normalizationReceiptRef: string;
}

export interface EvaluationVerificationRequestedData extends JsonObject {
  readonly normalizedEventId: string;
  readonly normalizedPayloadDigest: Digest;
  readonly verificationPolicyVersion: Version;
  readonly verifierRef: string;
  readonly reasonCode: string;
}

export interface EvaluationVerificationRecordedData extends JsonObject {
  readonly requestEventId: string;
  readonly verifierRef: string;
  readonly verificationOutcome: 'confirmed' | 'disputed' | 'inconclusive';
  readonly verificationEvidenceRef: string;
  readonly verificationEvidenceDigest: Digest;
  readonly verificationReceiptRef: string;
}

export interface EvaluationInconclusiveData extends JsonObject {
  readonly relatedEventIds: string[];
  readonly reasonCode: string;
  readonly uncertainty: number;
  readonly evidenceRefs: string[];
  readonly evidenceSetDigest: Digest;
}

export interface EvaluationFailedData extends JsonObject {
  readonly failedEventId: string;
  readonly failureStage: 'execution' | 'fixture-load' | 'normalization' | 'verification';
  readonly reasonCode: string;
  readonly failureReceiptRef: string;
  readonly retryable: boolean;
}

export interface CanarySuiteSealedData extends JsonObject {
  readonly suiteRef: string;
  readonly suiteDigest: Digest;
  readonly canaryPolicyVersion: Version;
  readonly fixtureCount: Uint32;
  readonly protectedMaterialRef: string;
  readonly protectedMaterialDigest: Digest;
}

export interface CanaryExecutedData extends JsonObject {
  readonly suiteSealedEventId: string;
  readonly suitePayloadDigest: Digest;
  readonly executionReceiptRef: string;
  readonly canaryObservationRef: string;
  readonly canaryObservationDigest: Digest;
  readonly outcome: 'fail' | 'inconclusive' | 'pass';
}

export interface CanaryLeakDetectedData extends JsonObject {
  readonly executionEventId: string;
  readonly leakClass: 'candidate-contamination' | 'fixture-exposure' | 'gold-exposure';
  readonly leakEvidenceRef: string;
  readonly leakEvidenceDigest: Digest;
  readonly detectorFingerprint: Fingerprint;
  readonly reasonCode: string;
}

export interface CanaryDriftDetectedData extends JsonObject {
  readonly executionEventId: string;
  readonly baselineRef: string;
  readonly baselineDigest: Digest;
  readonly driftEvidenceRef: string;
  readonly driftEvidenceDigest: Digest;
  readonly driftRatio: number;
  readonly policyVersion: Version;
}

export interface CanaryInvariantFailedData extends JsonObject {
  readonly executionEventId: string;
  readonly invariantCode: string;
  readonly invariantVersion: Version;
  readonly evidenceRef: string;
  readonly evidenceDigest: Digest;
  readonly reasonCode: string;
}

export interface CanaryGatePassedData extends JsonObject {
  readonly executionEventIds: string[];
  readonly evidenceSetDigest: Digest;
  readonly policyVersion: Version;
  readonly policyFingerprint: Fingerprint;
  readonly decisionReceiptRef: string;
}

export interface CanaryGateFailedData extends JsonObject {
  readonly executionEventIds: string[];
  readonly failureClasses: string[];
  readonly evidenceSetDigest: Digest;
  readonly policyVersion: Version;
  readonly policyFingerprint: Fingerprint;
  readonly decisionReceiptRef: string;
}

export interface CanaryVetoedData extends JsonObject {
  readonly gateEventId: string;
  readonly gatePayloadDigest: Digest;
  readonly vetoReasonCode: string;
  readonly vetoEvidenceRef: string;
  readonly vetoEvidenceDigest: Digest;
  readonly quarantineRef: string;
}

export interface PromotionProposedData extends JsonObject {
  readonly normalizedEventId: string;
  readonly normalizedPayloadDigest: Digest;
  readonly canaryGateEventId: string;
  readonly canaryGatePayloadDigest: Digest;
  readonly proposalPolicyVersion: Version;
  readonly requestedRollout: 'canary' | 'shadow';
  readonly evidenceSetDigest: Digest;
}

export interface PromotionAuthorizedData extends JsonObject {
  readonly proposalEventId: string;
  readonly proposalPayloadDigest: Digest;
  readonly externalAuthorizationRef: string;
  readonly externalAuthorizationDigest: Digest;
  readonly authorizationPolicyVersion: Version;
  readonly authorizationReceiptRef: string;
}

export interface PromotionDeniedData extends JsonObject {
  readonly proposalEventId: string;
  readonly proposalPayloadDigest: Digest;
  readonly externalDecisionRef: string;
  readonly externalDecisionDigest: Digest;
  readonly denialReasonCode: string;
  readonly decisionReceiptRef: string;
}

export interface PromotionShadowStartedData extends JsonObject {
  readonly authorizationEventId: string;
  readonly authorizationPayloadDigest: Digest;
  readonly rolloutRef: string;
  readonly rolloutDigest: Digest;
  readonly startedAt: string;
}

export interface PromotionCanaryStartedData extends PromotionShadowStartedData {}

export interface PromotionPausedData extends JsonObject {
  readonly activeRolloutEventId: string;
  readonly pauseReason: string;
  readonly checkpointRef: string;
  readonly checkpointDigest: Digest;
}

export interface PromotionAbortedData extends JsonObject {
  readonly activeRolloutEventId: string;
  readonly abortReason: string;
  readonly restorationRequired: boolean;
  readonly decisionReceiptRef: string;
}

export interface PromotionBaselineRestoredData extends JsonObject {
  readonly abortedEventId: string;
  readonly baselineRef: string;
  readonly baselineDigest: Digest;
  readonly restorationReceiptRef: string;
  readonly restoredAt: string;
}

export interface PromotionCompletedData extends JsonObject {
  readonly authorizationEventId: string;
  readonly rolloutEventIds: string[];
  readonly evidenceSetDigest: Digest;
  readonly completionReceiptRef: string;
  readonly completedAt: string;
}

// ───────────────────────────────────────────────────────────────────
// 4. EVENT UNION
// ───────────────────────────────────────────────────────────────────

export const DeepImprovementCommonEventStems = Object.freeze([
  'deep_improvement_common.run_started',
  'deep_improvement_common.run_resumed',
  'deep_improvement_common.run_paused',
  'deep_improvement_common.run_completed',
  'deep_improvement_common.run_aborted',
  'deep_improvement_common.run_quarantined',
  'deep_improvement_common.candidate_proposed',
  'deep_improvement_common.candidate_generated',
  'deep_improvement_common.candidate_rejected',
  'deep_improvement_common.candidate_lineage_attached',
  'deep_improvement_common.evaluation_epoch_sealed',
  'deep_improvement_common.evaluation_started',
  'deep_improvement_common.evaluation_observation_recorded',
  'deep_improvement_common.evaluation_normalized',
  'deep_improvement_common.evaluation_verification_requested',
  'deep_improvement_common.evaluation_verification_recorded',
  'deep_improvement_common.evaluation_inconclusive',
  'deep_improvement_common.evaluation_failed',
  'deep_improvement_common.canary_suite_sealed',
  'deep_improvement_common.canary_executed',
  'deep_improvement_common.canary_leak_detected',
  'deep_improvement_common.canary_drift_detected',
  'deep_improvement_common.canary_invariant_failed',
  'deep_improvement_common.canary_gate_passed',
  'deep_improvement_common.canary_gate_failed',
  'deep_improvement_common.canary_vetoed',
  'deep_improvement_common.promotion_proposed',
  'deep_improvement_common.promotion_authorized',
  'deep_improvement_common.promotion_denied',
  'deep_improvement_common.promotion_shadow_started',
  'deep_improvement_common.promotion_canary_started',
  'deep_improvement_common.promotion_paused',
  'deep_improvement_common.promotion_aborted',
  'deep_improvement_common.promotion_baseline_restored',
  'deep_improvement_common.promotion_completed',
] as const);

export type DeepImprovementCommonEventStem =
  typeof DeepImprovementCommonEventStems[number];

export const DeepImprovementCommonWireEventTypes = Object.freeze({
  'deep_improvement_common.run_started': 'deep-improvement-common.ledger.run-started',
  'deep_improvement_common.run_resumed': 'deep-improvement-common.ledger.run-resumed',
  'deep_improvement_common.run_paused': 'deep-improvement-common.ledger.run-paused',
  'deep_improvement_common.run_completed': 'deep-improvement-common.ledger.run-completed',
  'deep_improvement_common.run_aborted': 'deep-improvement-common.ledger.run-aborted',
  'deep_improvement_common.run_quarantined': 'deep-improvement-common.ledger.run-quarantined',
  'deep_improvement_common.candidate_proposed': 'deep-improvement-common.ledger.candidate-proposed',
  'deep_improvement_common.candidate_generated': 'deep-improvement-common.ledger.candidate-generated',
  'deep_improvement_common.candidate_rejected': 'deep-improvement-common.ledger.candidate-rejected',
  'deep_improvement_common.candidate_lineage_attached':
    'deep-improvement-common.ledger.candidate-lineage-attached',
  'deep_improvement_common.evaluation_epoch_sealed':
    'deep-improvement-common.ledger.evaluation-epoch-sealed',
  'deep_improvement_common.evaluation_started':
    'deep-improvement-common.ledger.evaluation-started',
  'deep_improvement_common.evaluation_observation_recorded':
    'deep-improvement-common.ledger.evaluation-observation-recorded',
  'deep_improvement_common.evaluation_normalized':
    'deep-improvement-common.ledger.evaluation-normalized',
  'deep_improvement_common.evaluation_verification_requested':
    'deep-improvement-common.ledger.evaluation-verification-requested',
  'deep_improvement_common.evaluation_verification_recorded':
    'deep-improvement-common.ledger.evaluation-verification-recorded',
  'deep_improvement_common.evaluation_inconclusive':
    'deep-improvement-common.ledger.evaluation-inconclusive',
  'deep_improvement_common.evaluation_failed': 'deep-improvement-common.ledger.evaluation-failed',
  'deep_improvement_common.canary_suite_sealed':
    'deep-improvement-common.ledger.canary-suite-sealed',
  'deep_improvement_common.canary_executed': 'deep-improvement-common.ledger.canary-executed',
  'deep_improvement_common.canary_leak_detected':
    'deep-improvement-common.ledger.canary-leak-detected',
  'deep_improvement_common.canary_drift_detected':
    'deep-improvement-common.ledger.canary-drift-detected',
  'deep_improvement_common.canary_invariant_failed':
    'deep-improvement-common.ledger.canary-invariant-failed',
  'deep_improvement_common.canary_gate_passed':
    'deep-improvement-common.ledger.canary-gate-passed',
  'deep_improvement_common.canary_gate_failed':
    'deep-improvement-common.ledger.canary-gate-failed',
  'deep_improvement_common.canary_vetoed': 'deep-improvement-common.ledger.canary-vetoed',
  'deep_improvement_common.promotion_proposed':
    'deep-improvement-common.ledger.promotion-proposed',
  'deep_improvement_common.promotion_authorized':
    'deep-improvement-common.ledger.promotion-authorized',
  'deep_improvement_common.promotion_denied':
    'deep-improvement-common.ledger.promotion-denied',
  'deep_improvement_common.promotion_shadow_started':
    'deep-improvement-common.ledger.promotion-shadow-started',
  'deep_improvement_common.promotion_canary_started':
    'deep-improvement-common.ledger.promotion-canary-started',
  'deep_improvement_common.promotion_paused':
    'deep-improvement-common.ledger.promotion-paused',
  'deep_improvement_common.promotion_aborted':
    'deep-improvement-common.ledger.promotion-aborted',
  'deep_improvement_common.promotion_baseline_restored':
    'deep-improvement-common.ledger.promotion-baseline-restored',
  'deep_improvement_common.promotion_completed':
    'deep-improvement-common.ledger.promotion-completed',
} as const satisfies Readonly<Record<DeepImprovementCommonEventStem, string>>);

export type DeepImprovementCommonWireEventType =
  typeof DeepImprovementCommonWireEventTypes[DeepImprovementCommonEventStem];

export interface DeepImprovementCommonPayloadMap {
  readonly 'deep_improvement_common.run_started': RunStartedData;
  readonly 'deep_improvement_common.run_resumed': RunResumedData;
  readonly 'deep_improvement_common.run_paused': RunPausedData;
  readonly 'deep_improvement_common.run_completed': RunCompletedData;
  readonly 'deep_improvement_common.run_aborted': RunAbortedData;
  readonly 'deep_improvement_common.run_quarantined': RunQuarantinedData;
  readonly 'deep_improvement_common.candidate_proposed': CandidateProposedData;
  readonly 'deep_improvement_common.candidate_generated': CandidateGeneratedData;
  readonly 'deep_improvement_common.candidate_rejected': CandidateRejectedData;
  readonly 'deep_improvement_common.candidate_lineage_attached': CandidateLineageAttachedData;
  readonly 'deep_improvement_common.evaluation_epoch_sealed': EvaluationEpochSealedData;
  readonly 'deep_improvement_common.evaluation_started': EvaluationStartedData;
  readonly 'deep_improvement_common.evaluation_observation_recorded':
    EvaluationObservationRecordedData;
  readonly 'deep_improvement_common.evaluation_normalized': EvaluationNormalizedData;
  readonly 'deep_improvement_common.evaluation_verification_requested':
    EvaluationVerificationRequestedData;
  readonly 'deep_improvement_common.evaluation_verification_recorded':
    EvaluationVerificationRecordedData;
  readonly 'deep_improvement_common.evaluation_inconclusive': EvaluationInconclusiveData;
  readonly 'deep_improvement_common.evaluation_failed': EvaluationFailedData;
  readonly 'deep_improvement_common.canary_suite_sealed': CanarySuiteSealedData;
  readonly 'deep_improvement_common.canary_executed': CanaryExecutedData;
  readonly 'deep_improvement_common.canary_leak_detected': CanaryLeakDetectedData;
  readonly 'deep_improvement_common.canary_drift_detected': CanaryDriftDetectedData;
  readonly 'deep_improvement_common.canary_invariant_failed': CanaryInvariantFailedData;
  readonly 'deep_improvement_common.canary_gate_passed': CanaryGatePassedData;
  readonly 'deep_improvement_common.canary_gate_failed': CanaryGateFailedData;
  readonly 'deep_improvement_common.canary_vetoed': CanaryVetoedData;
  readonly 'deep_improvement_common.promotion_proposed': PromotionProposedData;
  readonly 'deep_improvement_common.promotion_authorized': PromotionAuthorizedData;
  readonly 'deep_improvement_common.promotion_denied': PromotionDeniedData;
  readonly 'deep_improvement_common.promotion_shadow_started': PromotionShadowStartedData;
  readonly 'deep_improvement_common.promotion_canary_started': PromotionCanaryStartedData;
  readonly 'deep_improvement_common.promotion_paused': PromotionPausedData;
  readonly 'deep_improvement_common.promotion_aborted': PromotionAbortedData;
  readonly 'deep_improvement_common.promotion_baseline_restored':
    PromotionBaselineRestoredData;
  readonly 'deep_improvement_common.promotion_completed': PromotionCompletedData;
}

export interface DeepImprovementCommonScopeMap {
  readonly 'deep_improvement_common.run_started': DeepImprovementCommonBaseScope;
  readonly 'deep_improvement_common.run_resumed': DeepImprovementCommonBaseScope;
  readonly 'deep_improvement_common.run_paused': DeepImprovementCommonBaseScope;
  readonly 'deep_improvement_common.run_completed': DeepImprovementCommonBaseScope;
  readonly 'deep_improvement_common.run_aborted': DeepImprovementCommonBaseScope;
  readonly 'deep_improvement_common.run_quarantined': DeepImprovementCommonBaseScope;
  readonly 'deep_improvement_common.candidate_proposed': DeepImprovementCommonCandidateScope;
  readonly 'deep_improvement_common.candidate_generated': DeepImprovementCommonCandidateScope;
  readonly 'deep_improvement_common.candidate_rejected': DeepImprovementCommonCandidateScope;
  readonly 'deep_improvement_common.candidate_lineage_attached':
    DeepImprovementCommonCandidateScope;
  readonly 'deep_improvement_common.evaluation_epoch_sealed':
    DeepImprovementCommonEvaluationScope;
  readonly 'deep_improvement_common.evaluation_started': DeepImprovementCommonEvaluationScope;
  readonly 'deep_improvement_common.evaluation_observation_recorded':
    DeepImprovementCommonObservationScope;
  readonly 'deep_improvement_common.evaluation_normalized':
    DeepImprovementCommonEvaluationScope;
  readonly 'deep_improvement_common.evaluation_verification_requested':
    DeepImprovementCommonEvaluationScope;
  readonly 'deep_improvement_common.evaluation_verification_recorded':
    DeepImprovementCommonEvaluationScope;
  readonly 'deep_improvement_common.evaluation_inconclusive':
    DeepImprovementCommonEvaluationScope;
  readonly 'deep_improvement_common.evaluation_failed': DeepImprovementCommonEvaluationScope;
  readonly 'deep_improvement_common.canary_suite_sealed': DeepImprovementCommonCanaryScope;
  readonly 'deep_improvement_common.canary_executed': DeepImprovementCommonCanaryScope;
  readonly 'deep_improvement_common.canary_leak_detected': DeepImprovementCommonCanaryScope;
  readonly 'deep_improvement_common.canary_drift_detected': DeepImprovementCommonCanaryScope;
  readonly 'deep_improvement_common.canary_invariant_failed':
    DeepImprovementCommonCanaryScope;
  readonly 'deep_improvement_common.canary_gate_passed': DeepImprovementCommonCanaryScope;
  readonly 'deep_improvement_common.canary_gate_failed': DeepImprovementCommonCanaryScope;
  readonly 'deep_improvement_common.canary_vetoed': DeepImprovementCommonCanaryScope;
  readonly 'deep_improvement_common.promotion_proposed': DeepImprovementCommonPromotionScope;
  readonly 'deep_improvement_common.promotion_authorized': DeepImprovementCommonPromotionScope;
  readonly 'deep_improvement_common.promotion_denied': DeepImprovementCommonPromotionScope;
  readonly 'deep_improvement_common.promotion_shadow_started':
    DeepImprovementCommonPromotionScope;
  readonly 'deep_improvement_common.promotion_canary_started':
    DeepImprovementCommonPromotionScope;
  readonly 'deep_improvement_common.promotion_paused': DeepImprovementCommonPromotionScope;
  readonly 'deep_improvement_common.promotion_aborted': DeepImprovementCommonPromotionScope;
  readonly 'deep_improvement_common.promotion_baseline_restored':
    DeepImprovementCommonPromotionScope;
  readonly 'deep_improvement_common.promotion_completed': DeepImprovementCommonPromotionScope;
}

export interface DeepImprovementCommonLedgerPayload<
  TStem extends DeepImprovementCommonEventStem,
> extends JsonObject {
  readonly stem: TStem;
  readonly eventVersion: 1;
  readonly scope: DeepImprovementCommonScopeMap[TStem];
  readonly prevEventHash: Digest;
  readonly payloadDigest: Digest;
  readonly replay: DeepImprovementCommonReplayMetadata;
  readonly data: DeepImprovementCommonPayloadMap[TStem];
}

export type DeepImprovementCommonEventEnvelope<
  TStem extends DeepImprovementCommonEventStem = DeepImprovementCommonEventStem,
> = EventEnvelope & {
  readonly event_type: typeof DeepImprovementCommonWireEventTypes[TStem];
  readonly event_version: 1;
  readonly payload: DeepImprovementCommonLedgerPayload<TStem>;
};

export type DeepImprovementCommonLedgerEvent = {
  readonly [TStem in DeepImprovementCommonEventStem]:
    DeepImprovementCommonEventEnvelope<TStem>;
}[DeepImprovementCommonEventStem];

// ───────────────────────────────────────────────────────────────────
// 5. COMPATIBILITY TYPES
// ───────────────────────────────────────────────────────────────────

export type DeepImprovementCommonCompatibilityStatus =
  | 'blocked'
  | 'compatible'
  | 'exact'
  | 'migrate'
  | 'pin-old-runtime';

export interface DeepImprovementCommonCompatibilityDecision {
  readonly status: DeepImprovementCommonCompatibilityStatus;
  readonly reasonCode: string;
  readonly targetStem: DeepImprovementCommonEventStem | null;
  readonly sourceVersion: number | null;
  readonly targetVersion: 1;
}

export interface LegacyUpcastContext {
  readonly scope:
    | DeepImprovementCommonBaseScope
    | DeepImprovementCommonCandidateScope
    | DeepImprovementCommonEvaluationScope;
  readonly prevEventHash: Digest;
  readonly replay: DeepImprovementCommonReplayMetadata;
}

export interface LegacyUpcastCandidate {
  readonly status: 'migrated';
  readonly targetStem: DeepImprovementCommonEventStem;
  readonly eventVersion: 1;
  readonly originalRecordDigest: Digest;
  readonly upcasterFingerprint: Fingerprint;
  readonly warnings: readonly string[];
  readonly scope: LegacyUpcastContext['scope'];
  readonly prevEventHash: Digest;
  readonly replay: DeepImprovementCommonReplayMetadata;
  readonly data: JsonObject;
}

export type LegacyUpcastResult =
  | LegacyUpcastCandidate
  | {
    readonly status: 'refused';
    readonly decision: DeepImprovementCommonCompatibilityDecision;
  };
