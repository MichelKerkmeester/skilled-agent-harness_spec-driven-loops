// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Ledger Types
// ───────────────────────────────────────────────────────────────────

import {
  DeepImprovementCommonEventStems,
  DeepImprovementCommonWireEventTypes,
} from '../deep-improvement-common-ledger-schema/index.js';

import type {
  DeepImprovementCommonEventStem,
  DeepImprovementCommonPayloadMap,
  DeepImprovementCommonReplayMetadata,
  DeepImprovementCommonScopeMap,
  DeepImprovementCommonCompatibilityStatus,
} from '../deep-improvement-common-ledger-schema/index.js';
import type {
  EventEnvelope,
  JsonObject,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. IDENTITIES AND SHARED METADATA
// ───────────────────────────────────────────────────────────────────

export type BenchmarkRunId = string;
export type LineageId = string;
export type BenchmarkDesignId = string;
export type BenchmarkCapsuleId = string;
export type WorkloadSnapshotId = string;
export type TrialBlockId = string;
export type TrialId = string;
export type TaskInstanceId = string;
export type TaskFamilyId = string;
export type CandidateId = string;
export type PairedBlockId = string;
export type CaseId = string;
export type JudgeCalibrationId = string;
export type ValidityPlanId = string;
export type EvidenceSetId = string;
export type Digest = string;
export type Fingerprint = string;
export type Version = string;
export type Uint32 = number;

export type ModelBenchmarkReplayMetadata =
  DeepImprovementCommonReplayMetadata;

export interface ModelBenchmarkBaseScope extends JsonObject {
  readonly runId: BenchmarkRunId;
  readonly lineageId: LineageId;
  readonly variant: 'model-benchmark';
}

export interface ModelBenchmarkDesignScope extends ModelBenchmarkBaseScope {
  readonly designId: BenchmarkDesignId;
}

export interface ModelBenchmarkCapsuleScope extends ModelBenchmarkBaseScope {
  readonly capsuleId: BenchmarkCapsuleId;
}

export interface ModelBenchmarkWorkloadScope extends ModelBenchmarkBaseScope {
  readonly workloadSnapshotId: WorkloadSnapshotId;
}

export interface ModelBenchmarkTrialBlockScope extends ModelBenchmarkBaseScope {
  readonly trialBlockId: TrialBlockId;
}

export interface ModelBenchmarkTrialScope extends ModelBenchmarkBaseScope {
  readonly trialId: TrialId;
  readonly taskInstanceId: TaskInstanceId;
  readonly taskFamilyId: TaskFamilyId;
  readonly candidateId: CandidateId;
  readonly modelFingerprint: Fingerprint;
  readonly executionPath: string;
  readonly pairedBlockId: PairedBlockId;
}

export interface ModelBenchmarkCaseScope extends ModelBenchmarkBaseScope {
  readonly caseId: CaseId;
  readonly taskInstanceId: TaskInstanceId;
  readonly taskFamilyId: TaskFamilyId;
}

export interface ModelBenchmarkJudgeScope extends ModelBenchmarkBaseScope {
  readonly judgeCalibrationId: JudgeCalibrationId;
}

export interface ModelBenchmarkValidityScope extends ModelBenchmarkBaseScope {
  readonly validityPlanId: ValidityPlanId;
}

export interface ModelBenchmarkSelectionScope extends ModelBenchmarkBaseScope {
  readonly evidenceSetId: EvidenceSetId;
}

export type ModelBenchmarkSpecificScope =
  | ModelBenchmarkBaseScope
  | ModelBenchmarkDesignScope
  | ModelBenchmarkCapsuleScope
  | ModelBenchmarkWorkloadScope
  | ModelBenchmarkTrialBlockScope
  | ModelBenchmarkTrialScope
  | ModelBenchmarkCaseScope
  | ModelBenchmarkJudgeScope
  | ModelBenchmarkValidityScope
  | ModelBenchmarkSelectionScope;

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED VALUE OBJECTS
// ───────────────────────────────────────────────────────────────────

export interface TrialMatrixKey extends JsonObject {
  readonly candidateId: CandidateId;
  readonly modelFingerprint: Fingerprint;
  readonly executionPath: string;
  readonly taskInstanceId: TaskInstanceId;
  readonly taskFamilyId: TaskFamilyId;
  readonly pairedBlockId: PairedBlockId;
  readonly protocolVariant: string;
  readonly seed: Uint32;
  readonly perturbationId: string;
  readonly workloadProfileId: string;
  readonly promptRecipeFingerprint: Fingerprint;
  readonly routeFingerprint: Fingerprint;
  readonly frameworkFingerprint: Fingerprint;
  readonly toolRecipeFingerprint: Fingerprint;
  readonly attempt: Uint32;
}

export interface ScoreObservationComponent extends JsonObject {
  readonly dimensionCode: string;
  readonly rawScore: number;
  readonly hardFloorStatus: 'fail' | 'not-applicable' | 'pass' | 'unknown';
  readonly measurementStatus: 'abstained' | 'missing' | 'observed';
  readonly uncertainty: number;
  readonly observationRef: string;
  readonly observationDigest: Digest;
}

export interface ScoreVectorObservation extends JsonObject {
  readonly components: ScoreObservationComponent[];
  readonly evaluatorContractHash: Digest;
  readonly evaluatorFingerprint: Fingerprint;
}

export interface UsageObservation extends JsonObject {
  readonly inputTokens: Uint32;
  readonly outputTokens: Uint32;
  readonly reasoningTokens: Uint32;
  readonly cacheReadTokens: Uint32;
  readonly cacheWriteTokens: Uint32;
  readonly retryCount: Uint32;
  readonly realizedCostMicrounits: Uint32;
  readonly currencyCode: string;
}

export interface LatencyObservation extends JsonObject {
  readonly ttftMs: Uint32;
  readonly interTokenP50Ms: Uint32;
  readonly endToEndMs: Uint32;
  readonly tailP95Ms: Uint32;
}

export interface TaskLineage extends JsonObject {
  readonly sourceCutoffAt: string;
  readonly visibility: 'private' | 'public' | 'sealed';
  readonly proposerVisibility: 'blind' | 'known';
  readonly oracleVisibility: 'blind' | 'known';
  readonly parentCaseId: CaseId | null;
  readonly firstExposureAt: string | null;
  readonly disclosedAt: string | null;
  readonly retiredAt: string | null;
  readonly replacementCaseId: CaseId | null;
}

export interface ModelBenchmarkCompletionCounts extends JsonObject {
  readonly admittedTrials: Uint32;
  readonly completedTrials: Uint32;
  readonly failedTrials: Uint32;
  readonly unknownTrials: Uint32;
  readonly invalidatedTrials: Uint32;
}

// ───────────────────────────────────────────────────────────────────
// 3. MODEL-BENCHMARK PAYLOAD DATA
// ───────────────────────────────────────────────────────────────────

export interface RunDeclaredData extends JsonObject {
  readonly generation: Uint32;
  readonly benchmarkRecipeRef: string;
  readonly benchmarkRecipeDigest: Digest;
  readonly evaluatorServiceRef: string;
  readonly canaryServiceRef: string;
  readonly promotionServiceRef: string;
  readonly sharedServiceContractVersion: Version;
  readonly replayFingerprint: Fingerprint;
}

export interface BenchmarkCapsuleSealedData extends JsonObject {
  readonly capsuleRef: string;
  readonly capsuleDigest: Digest;
  readonly taskSetDigest: Digest;
  readonly taskLineage: TaskLineage;
  readonly canarySuiteRef: string;
  readonly canarySuiteDigest: Digest;
  readonly sealReceiptRef: string;
}

export interface WorkloadSnapshotSealedData extends JsonObject {
  readonly workloadSnapshotRef: string;
  readonly workloadSnapshotDigest: Digest;
  readonly taskFamilyIds: string[];
  readonly caseCount: Uint32;
  readonly workloadProfileVersion: Version;
  readonly snapshotAt: string;
  readonly sealReceiptRef: string;
}

export interface RunStartedData extends JsonObject {
  readonly declarationEventId: string;
  readonly declarationPayloadDigest: Digest;
  readonly capsuleEventId: string;
  readonly capsulePayloadDigest: Digest;
  readonly workloadEventId: string;
  readonly workloadPayloadDigest: Digest;
  readonly executionReceiptRef: string;
  readonly startedAt: string;
}

export interface RunPausedData extends JsonObject {
  readonly pauseReason: string;
  readonly checkpointRef: string;
  readonly checkpointDigest: Digest;
  readonly pendingTrialIds: string[];
  readonly pausedAt: string;
}

export interface RunResumedData extends JsonObject {
  readonly priorTailDigest: Digest;
  readonly resumeReason: string;
  readonly compatibilityDecision: ModelBenchmarkCompatibilityStatus;
  readonly recoveryReceiptRef: string;
  readonly resumedAt: string;
}

export interface RunClosedData extends JsonObject {
  readonly terminalOutcome: 'aborted' | 'completed' | 'quarantined';
  readonly finalLedgerTailHash: Digest;
  readonly counts: ModelBenchmarkCompletionCounts;
  readonly completionEvidenceRefs: string[];
  readonly closedAt: string;
}

export interface BenchmarkDesignDeclaredData extends JsonObject {
  readonly designRef: string;
  readonly designDigest: Digest;
  readonly candidateIds: string[];
  readonly taskFamilyIds: string[];
  readonly pairedBlockIds: string[];
  readonly protocolVariants: string[];
  readonly familyQuotaPolicyVersion: Version;
  readonly designPolicyVersion: Version;
}

export interface TrialBlockDeclaredData extends JsonObject {
  readonly taskFamilyId: TaskFamilyId;
  readonly candidateIds: string[];
  readonly modelFingerprints: string[];
  readonly executionPaths: string[];
  readonly pairedBlockIds: string[];
  readonly protocolVariants: string[];
  readonly seed: Uint32;
  readonly perturbationId: string;
  readonly workloadProfileId: string;
  readonly blockDigest: Digest;
}

export interface TrialCaseAdmittedData extends JsonObject {
  readonly trialMatrixKey: TrialMatrixKey;
  readonly caseRef: string;
  readonly caseDigest: Digest;
  readonly taskLineage: TaskLineage;
  readonly admissionPolicyVersion: Version;
  readonly admissionReasonCode: string;
}

export interface TrialCaseRejectedData extends TrialCaseAdmittedData {
  readonly rejectionEvidenceRef: string;
  readonly rejectionEvidenceDigest: Digest;
}

export interface TrialDispatchedData extends JsonObject {
  readonly trialMatrixKey: TrialMatrixKey;
  readonly inputRef: string;
  readonly inputDigest: Digest;
  readonly dispatchReceiptRef: string;
  readonly dispatchReceiptDigest: Digest;
  readonly dispatchedAt: string;
}

export interface TrialCompletedData extends JsonObject {
  readonly trialMatrixKey: TrialMatrixKey;
  readonly dispatchedEventId: string;
  readonly dispatchedPayloadDigest: Digest;
  readonly rawResultRef: string;
  readonly rawResultDigest: Digest;
  readonly inputDigest: Digest;
  readonly outputDigest: Digest;
  readonly completionReceiptRef: string;
  readonly completedAt: string;
}

export interface TrialFailedData extends JsonObject {
  readonly trialMatrixKey: TrialMatrixKey;
  readonly dispatchedEventId: string;
  readonly failureStage: 'dispatch' | 'execution' | 'provider' | 'timeout';
  readonly reasonCode: string;
  readonly failureEvidenceRef: string;
  readonly failureEvidenceDigest: Digest;
  readonly failureReceiptRef: string;
  readonly retryable: boolean;
}

export interface TrialUnknownData extends JsonObject {
  readonly trialMatrixKey: TrialMatrixKey;
  readonly dispatchedEventId: string;
  readonly reasonCode: string;
  readonly lastReceiptRef: string;
  readonly evidenceDigest: Digest;
  readonly observedAt: string;
}

export interface TrialInvalidatedData extends JsonObject {
  readonly trialMatrixKey: TrialMatrixKey;
  readonly sourceEventId: string;
  readonly sourcePayloadDigest: Digest;
  readonly reasonCode: string;
  readonly invalidationEvidenceRef: string;
  readonly invalidationEvidenceDigest: Digest;
  readonly invalidatedAt: string;
}

export interface TrialObservationRecordedData extends JsonObject {
  readonly trialMatrixKey: TrialMatrixKey;
  readonly completedEventId: string;
  readonly completedPayloadDigest: Digest;
  readonly inputDigest: Digest;
  readonly rawOutputRef: string;
  readonly rawOutputDigest: Digest;
  readonly evaluatorObservationRef: string;
  readonly evaluatorObservationDigest: Digest;
  readonly executionReceiptRef: string;
}

export interface ScoreVectorObservedData extends JsonObject {
  readonly trialMatrixKey: TrialMatrixKey;
  readonly observationEventId: string;
  readonly observationPayloadDigest: Digest;
  readonly scorePolicyVersion: Version;
  readonly scoreWriteBackendRef: 'backend:deep-improvement-score';
  readonly scoreVector: ScoreVectorObservation;
  readonly scoringReceiptRef: string;
}

export interface UsageObservedData extends JsonObject {
  readonly trialMatrixKey: TrialMatrixKey;
  readonly observationEventId: string;
  readonly usage: UsageObservation;
  readonly latency: LatencyObservation;
  readonly usageReceiptRef: string;
  readonly usageReceiptDigest: Digest;
}

export interface JudgeObservationRecordedData extends JsonObject {
  readonly trialMatrixKey: TrialMatrixKey;
  readonly scoreEventId: string;
  readonly scorePayloadDigest: Digest;
  readonly blindedJudgeRef: string;
  readonly judgeFamilyCode: string;
  readonly judgeBuildFingerprint: Fingerprint;
  readonly promptDigest: Digest;
  readonly contextDigest: Digest;
  readonly toolDigest: Digest;
  readonly calibrationSliceId: string;
  readonly orderProbeOutcome: 'fail' | 'pass' | 'unknown';
  readonly styleProbeOutcome: 'fail' | 'pass' | 'unknown';
  readonly confidence: number;
  readonly uncertainty: number;
  readonly abstained: boolean;
  readonly disagreementState: 'disagreed' | 'not-observed' | 'resolved' | 'unknown';
  readonly observationRef: string;
  readonly observationDigest: Digest;
}

export interface OracleLabelAttestedData extends JsonObject {
  readonly oracleVersion: Version;
  readonly labelRef: string;
  readonly labelDigest: Digest;
  readonly attestationStatus: 'attested' | 'corrected' | 'unknown';
  readonly confidence: number;
  readonly uncertainty: number;
  readonly priorAttestationEventId: string | null;
  readonly attestationReceiptRef: string;
}

export interface ContaminationEvidenceRecordedData extends JsonObject {
  readonly contaminationStatus: 'clean' | 'confirmed' | 'suspected' | 'unknown';
  readonly detectorFingerprint: Fingerprint;
  readonly evidenceRef: string;
  readonly evidenceDigest: Digest;
  readonly exposureEventIds: string[];
  readonly reasonCode: string;
}

export interface ExposureRecordedData extends JsonObject {
  readonly exposureClass: 'candidate' | 'judge' | 'oracle' | 'proposer' | 'public';
  readonly exposedActorRef: string;
  readonly firstExposedAt: string;
  readonly evidenceRef: string;
  readonly evidenceDigest: Digest;
}

export interface CaseDisclosedData extends JsonObject {
  readonly disclosureRef: string;
  readonly disclosureDigest: Digest;
  readonly disclosedAt: string;
  readonly disclosurePolicyVersion: Version;
}

export interface CaseRetiredData extends JsonObject {
  readonly retirementReasonCode: string;
  readonly retirementEvidenceRef: string;
  readonly retirementEvidenceDigest: Digest;
  readonly retiredAt: string;
}

export interface CaseReplacedData extends JsonObject {
  readonly replacementCaseId: CaseId;
  readonly replacementCaseDigest: Digest;
  readonly replacementReasonCode: string;
  readonly lineageReceiptRef: string;
}

export interface JudgeCalibrationSealedData extends JsonObject {
  readonly blindedJudgeRef: string;
  readonly judgeFamilyCode: string;
  readonly judgeBuildFingerprint: Fingerprint;
  readonly calibrationSliceId: string;
  readonly calibrationRef: string;
  readonly calibrationDigest: Digest;
  readonly orderProbeDigest: Digest;
  readonly styleProbeDigest: Digest;
  readonly calibrationPolicyVersion: Version;
  readonly sealReceiptRef: string;
}

export interface ValidityPlanSealedData extends JsonObject {
  readonly validityPlanRef: string;
  readonly validityPlanDigest: Digest;
  readonly requiredEvidenceCodes: string[];
  readonly hardBlockerCodes: string[];
  readonly validityPolicyVersion: Version;
  readonly sealReceiptRef: string;
}

export interface ValidityCardDerivedData extends JsonObject {
  readonly state: 'invalid' | 'unknown' | 'valid';
  readonly evidenceEventIds: string[];
  readonly evidenceSetDigest: Digest;
  readonly blockerCodes: string[];
  readonly uncertainty: number;
  readonly derivationPolicyVersion: Version;
  readonly derivationReceiptRef: string;
}

export interface ValidityUnknownRecordedData extends JsonObject {
  readonly unknownCode: string;
  readonly requiredEvidenceRefs: string[];
  readonly evidenceSetDigest: Digest;
  readonly blocker: boolean;
  readonly recordedAt: string;
}

export interface SelectionEvidenceSealedData extends JsonObject {
  readonly evidenceEventIds: string[];
  readonly evidenceSetDigest: Digest;
  readonly manifestRef: string;
  readonly manifestDigest: Digest;
  readonly validityCardEventIds: string[];
  readonly sealedAt: string;
  readonly sealReceiptRef: string;
}

export interface SelectionReductionRequestedData extends JsonObject {
  readonly sealedEvidenceEventId: string;
  readonly sealedEvidencePayloadDigest: Digest;
  readonly reducerContractVersion: Version;
  readonly requestReceiptRef: string;
  readonly requestedAt: string;
}

// ───────────────────────────────────────────────────────────────────
// 4. EVENT UNION
// ───────────────────────────────────────────────────────────────────

export const ModelBenchmarkSpecificEventStems = Object.freeze([
  'model_benchmark.run_declared',
  'model_benchmark.benchmark_capsule_sealed',
  'model_benchmark.workload_snapshot_sealed',
  'model_benchmark.run_started',
  'model_benchmark.run_paused',
  'model_benchmark.run_resumed',
  'model_benchmark.run_closed',
  'model_benchmark.benchmark_design_declared',
  'model_benchmark.trial_block_declared',
  'model_benchmark.trial_case_admitted',
  'model_benchmark.trial_case_rejected',
  'model_benchmark.trial_dispatched',
  'model_benchmark.trial_completed',
  'model_benchmark.trial_failed',
  'model_benchmark.trial_unknown',
  'model_benchmark.trial_invalidated',
  'model_benchmark.trial_observation_recorded',
  'model_benchmark.score_vector_observed',
  'model_benchmark.usage_observed',
  'model_benchmark.judge_observation_recorded',
  'model_benchmark.oracle_label_attested',
  'model_benchmark.contamination_evidence_recorded',
  'model_benchmark.exposure_recorded',
  'model_benchmark.case_disclosed',
  'model_benchmark.case_retired',
  'model_benchmark.case_replaced',
  'model_benchmark.judge_calibration_sealed',
  'model_benchmark.validity_plan_sealed',
  'model_benchmark.validity_card_derived',
  'model_benchmark.validity_unknown_recorded',
  'model_benchmark.selection_evidence_sealed',
  'model_benchmark.selection_reduction_requested',
] as const);

export type ModelBenchmarkSpecificEventStem =
  typeof ModelBenchmarkSpecificEventStems[number];

export const ModelBenchmarkEventStems = Object.freeze([
  ...DeepImprovementCommonEventStems,
  ...ModelBenchmarkSpecificEventStems,
] as const);

export type ModelBenchmarkEventStem =
  | DeepImprovementCommonEventStem
  | ModelBenchmarkSpecificEventStem;

export const ModelBenchmarkSpecificWireEventTypes = Object.freeze({
  'model_benchmark.run_declared': 'deep-improvement.model-benchmark.run-declared',
  'model_benchmark.benchmark_capsule_sealed':
    'deep-improvement.model-benchmark.benchmark-capsule-sealed',
  'model_benchmark.workload_snapshot_sealed':
    'deep-improvement.model-benchmark.workload-snapshot-sealed',
  'model_benchmark.run_started': 'deep-improvement.model-benchmark.run-started',
  'model_benchmark.run_paused': 'deep-improvement.model-benchmark.run-paused',
  'model_benchmark.run_resumed': 'deep-improvement.model-benchmark.run-resumed',
  'model_benchmark.run_closed': 'deep-improvement.model-benchmark.run-closed',
  'model_benchmark.benchmark_design_declared':
    'deep-improvement.model-benchmark.benchmark-design-declared',
  'model_benchmark.trial_block_declared':
    'deep-improvement.model-benchmark.trial-block-declared',
  'model_benchmark.trial_case_admitted':
    'deep-improvement.model-benchmark.trial-case-admitted',
  'model_benchmark.trial_case_rejected':
    'deep-improvement.model-benchmark.trial-case-rejected',
  'model_benchmark.trial_dispatched':
    'deep-improvement.model-benchmark.trial-dispatched',
  'model_benchmark.trial_completed':
    'deep-improvement.model-benchmark.trial-completed',
  'model_benchmark.trial_failed': 'deep-improvement.model-benchmark.trial-failed',
  'model_benchmark.trial_unknown': 'deep-improvement.model-benchmark.trial-unknown',
  'model_benchmark.trial_invalidated':
    'deep-improvement.model-benchmark.trial-invalidated',
  'model_benchmark.trial_observation_recorded':
    'deep-improvement.model-benchmark.trial-observation-recorded',
  'model_benchmark.score_vector_observed':
    'deep-improvement.model-benchmark.score-vector-observed',
  'model_benchmark.usage_observed': 'deep-improvement.model-benchmark.usage-observed',
  'model_benchmark.judge_observation_recorded':
    'deep-improvement.model-benchmark.judge-observation-recorded',
  'model_benchmark.oracle_label_attested':
    'deep-improvement.model-benchmark.oracle-label-attested',
  'model_benchmark.contamination_evidence_recorded':
    'deep-improvement.model-benchmark.contamination-evidence-recorded',
  'model_benchmark.exposure_recorded':
    'deep-improvement.model-benchmark.exposure-recorded',
  'model_benchmark.case_disclosed': 'deep-improvement.model-benchmark.case-disclosed',
  'model_benchmark.case_retired': 'deep-improvement.model-benchmark.case-retired',
  'model_benchmark.case_replaced': 'deep-improvement.model-benchmark.case-replaced',
  'model_benchmark.judge_calibration_sealed':
    'deep-improvement.model-benchmark.judge-calibration-sealed',
  'model_benchmark.validity_plan_sealed':
    'deep-improvement.model-benchmark.validity-plan-sealed',
  'model_benchmark.validity_card_derived':
    'deep-improvement.model-benchmark.validity-card-derived',
  'model_benchmark.validity_unknown_recorded':
    'deep-improvement.model-benchmark.validity-unknown-recorded',
  'model_benchmark.selection_evidence_sealed':
    'deep-improvement.model-benchmark.selection-evidence-sealed',
  'model_benchmark.selection_reduction_requested':
    'deep-improvement.model-benchmark.selection-reduction-requested',
} as const satisfies Readonly<Record<ModelBenchmarkSpecificEventStem, string>>);

export const ModelBenchmarkWireEventTypes = Object.freeze({
  ...DeepImprovementCommonWireEventTypes,
  ...ModelBenchmarkSpecificWireEventTypes,
} as const satisfies Readonly<Record<ModelBenchmarkEventStem, string>>);

export type ModelBenchmarkWireEventType =
  typeof ModelBenchmarkWireEventTypes[ModelBenchmarkEventStem];

export interface ModelBenchmarkSpecificPayloadMap {
  readonly 'model_benchmark.run_declared': RunDeclaredData;
  readonly 'model_benchmark.benchmark_capsule_sealed': BenchmarkCapsuleSealedData;
  readonly 'model_benchmark.workload_snapshot_sealed': WorkloadSnapshotSealedData;
  readonly 'model_benchmark.run_started': RunStartedData;
  readonly 'model_benchmark.run_paused': RunPausedData;
  readonly 'model_benchmark.run_resumed': RunResumedData;
  readonly 'model_benchmark.run_closed': RunClosedData;
  readonly 'model_benchmark.benchmark_design_declared': BenchmarkDesignDeclaredData;
  readonly 'model_benchmark.trial_block_declared': TrialBlockDeclaredData;
  readonly 'model_benchmark.trial_case_admitted': TrialCaseAdmittedData;
  readonly 'model_benchmark.trial_case_rejected': TrialCaseRejectedData;
  readonly 'model_benchmark.trial_dispatched': TrialDispatchedData;
  readonly 'model_benchmark.trial_completed': TrialCompletedData;
  readonly 'model_benchmark.trial_failed': TrialFailedData;
  readonly 'model_benchmark.trial_unknown': TrialUnknownData;
  readonly 'model_benchmark.trial_invalidated': TrialInvalidatedData;
  readonly 'model_benchmark.trial_observation_recorded': TrialObservationRecordedData;
  readonly 'model_benchmark.score_vector_observed': ScoreVectorObservedData;
  readonly 'model_benchmark.usage_observed': UsageObservedData;
  readonly 'model_benchmark.judge_observation_recorded': JudgeObservationRecordedData;
  readonly 'model_benchmark.oracle_label_attested': OracleLabelAttestedData;
  readonly 'model_benchmark.contamination_evidence_recorded':
    ContaminationEvidenceRecordedData;
  readonly 'model_benchmark.exposure_recorded': ExposureRecordedData;
  readonly 'model_benchmark.case_disclosed': CaseDisclosedData;
  readonly 'model_benchmark.case_retired': CaseRetiredData;
  readonly 'model_benchmark.case_replaced': CaseReplacedData;
  readonly 'model_benchmark.judge_calibration_sealed': JudgeCalibrationSealedData;
  readonly 'model_benchmark.validity_plan_sealed': ValidityPlanSealedData;
  readonly 'model_benchmark.validity_card_derived': ValidityCardDerivedData;
  readonly 'model_benchmark.validity_unknown_recorded': ValidityUnknownRecordedData;
  readonly 'model_benchmark.selection_evidence_sealed': SelectionEvidenceSealedData;
  readonly 'model_benchmark.selection_reduction_requested':
    SelectionReductionRequestedData;
}

export interface ModelBenchmarkPayloadMap
  extends DeepImprovementCommonPayloadMap,
  ModelBenchmarkSpecificPayloadMap {}

export interface ModelBenchmarkSpecificScopeMap {
  readonly 'model_benchmark.run_declared': ModelBenchmarkBaseScope;
  readonly 'model_benchmark.benchmark_capsule_sealed': ModelBenchmarkCapsuleScope;
  readonly 'model_benchmark.workload_snapshot_sealed': ModelBenchmarkWorkloadScope;
  readonly 'model_benchmark.run_started': ModelBenchmarkBaseScope;
  readonly 'model_benchmark.run_paused': ModelBenchmarkBaseScope;
  readonly 'model_benchmark.run_resumed': ModelBenchmarkBaseScope;
  readonly 'model_benchmark.run_closed': ModelBenchmarkBaseScope;
  readonly 'model_benchmark.benchmark_design_declared': ModelBenchmarkDesignScope;
  readonly 'model_benchmark.trial_block_declared': ModelBenchmarkTrialBlockScope;
  readonly 'model_benchmark.trial_case_admitted': ModelBenchmarkTrialScope;
  readonly 'model_benchmark.trial_case_rejected': ModelBenchmarkTrialScope;
  readonly 'model_benchmark.trial_dispatched': ModelBenchmarkTrialScope;
  readonly 'model_benchmark.trial_completed': ModelBenchmarkTrialScope;
  readonly 'model_benchmark.trial_failed': ModelBenchmarkTrialScope;
  readonly 'model_benchmark.trial_unknown': ModelBenchmarkTrialScope;
  readonly 'model_benchmark.trial_invalidated': ModelBenchmarkTrialScope;
  readonly 'model_benchmark.trial_observation_recorded': ModelBenchmarkTrialScope;
  readonly 'model_benchmark.score_vector_observed': ModelBenchmarkTrialScope;
  readonly 'model_benchmark.usage_observed': ModelBenchmarkTrialScope;
  readonly 'model_benchmark.judge_observation_recorded': ModelBenchmarkTrialScope;
  readonly 'model_benchmark.oracle_label_attested': ModelBenchmarkCaseScope;
  readonly 'model_benchmark.contamination_evidence_recorded': ModelBenchmarkCaseScope;
  readonly 'model_benchmark.exposure_recorded': ModelBenchmarkCaseScope;
  readonly 'model_benchmark.case_disclosed': ModelBenchmarkCaseScope;
  readonly 'model_benchmark.case_retired': ModelBenchmarkCaseScope;
  readonly 'model_benchmark.case_replaced': ModelBenchmarkCaseScope;
  readonly 'model_benchmark.judge_calibration_sealed': ModelBenchmarkJudgeScope;
  readonly 'model_benchmark.validity_plan_sealed': ModelBenchmarkValidityScope;
  readonly 'model_benchmark.validity_card_derived': ModelBenchmarkValidityScope;
  readonly 'model_benchmark.validity_unknown_recorded': ModelBenchmarkValidityScope;
  readonly 'model_benchmark.selection_evidence_sealed': ModelBenchmarkSelectionScope;
  readonly 'model_benchmark.selection_reduction_requested':
    ModelBenchmarkSelectionScope;
}

export interface ModelBenchmarkScopeMap
  extends DeepImprovementCommonScopeMap,
  ModelBenchmarkSpecificScopeMap {}

export interface ModelBenchmarkLedgerPayload<
  TStem extends ModelBenchmarkEventStem,
> extends JsonObject {
  readonly stem: TStem;
  readonly eventVersion: 1;
  readonly scope: ModelBenchmarkScopeMap[TStem];
  readonly prevEventHash: Digest;
  readonly payloadDigest: Digest;
  readonly replay: ModelBenchmarkReplayMetadata;
  readonly data: ModelBenchmarkPayloadMap[TStem];
}

export type ModelBenchmarkEventEnvelope<
  TStem extends ModelBenchmarkEventStem = ModelBenchmarkEventStem,
> = EventEnvelope & {
  readonly event_type: typeof ModelBenchmarkWireEventTypes[TStem];
  readonly event_version: 1;
  readonly payload: ModelBenchmarkLedgerPayload<TStem>;
};

export type ModelBenchmarkLedgerEvent = {
  readonly [TStem in ModelBenchmarkEventStem]:
    ModelBenchmarkEventEnvelope<TStem>;
}[ModelBenchmarkEventStem];

// ───────────────────────────────────────────────────────────────────
// 5. COMPATIBILITY TYPES
// ───────────────────────────────────────────────────────────────────

export type ModelBenchmarkCompatibilityStatus =
  DeepImprovementCommonCompatibilityStatus;

export interface ModelBenchmarkCompatibilityDecision {
  readonly status: ModelBenchmarkCompatibilityStatus;
  readonly reasonCode: string;
  readonly targetStem: ModelBenchmarkEventStem | null;
  readonly sourceVersion: number | null;
  readonly targetVersion: 1;
}

export interface LegacyUpcastContext {
  readonly scope: ModelBenchmarkScopeMap[ModelBenchmarkEventStem];
  readonly prevEventHash: Digest;
  readonly replay: ModelBenchmarkReplayMetadata;
}

export interface LegacyUpcastCandidate {
  readonly status: 'migrated';
  readonly targetStem: ModelBenchmarkEventStem;
  readonly eventVersion: 1;
  readonly originalRecordDigest: Digest;
  readonly upcasterFingerprint: Fingerprint;
  readonly warnings: readonly string[];
  readonly scope: LegacyUpcastContext['scope'];
  readonly prevEventHash: Digest;
  readonly replay: ModelBenchmarkReplayMetadata;
  readonly data: JsonObject;
}

export type LegacyUpcastResult =
  | LegacyUpcastCandidate
  | {
    readonly status: 'refused';
    readonly decision: ModelBenchmarkCompatibilityDecision;
  };
