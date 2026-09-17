// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Projection Types
// ───────────────────────────────────────────────────────────────────

import type {
  LatencyObservation,
  ModelBenchmarkEventStem,
  ModelBenchmarkSpecificEventStem,
  ScoreVectorObservation,
  TrialMatrixKey,
  UsageObservation,
} from '../model-benchmark-ledger-schema/index.js';
import type {
  DeepImprovementCommonLegacyProjection,
  DeepImprovementCommonProjectionState,
} from '../deep-improvement-common-reducers/index.js';

export type ModelBenchmarkRebuildReasonCode =
  | 'checkpoint-digest-mismatch'
  | 'codec-version-mismatch'
  | 'cursor-gap'
  | 'event-order-invalid'
  | 'ordering-policy-mismatch'
  | 'projection-schema-mismatch'
  | 'reducer-version-mismatch'
  | 'source-truncated'
  | 'unhandled-event-stem';

export type ModelBenchmarkReducerErrorCode =
  | 'cell-transition-invalid'
  | 'duplicate-event-conflict'
  | 'event-not-model-benchmark'
  | 'event-schema-invalid'
  | 'projection-field-invalid'
  | 'projection-not-frozen'
  | 'referential-integrity'
  | 'reducer-nondeterministic'
  | 'state-mutated'
  | 'unhandled-event-stem';

export interface ModelBenchmarkRunProjection {
  readonly runId: string | null;
  readonly lineageId: string | null;
  readonly generation: number | null;
  readonly state:
    | 'closed'
    | 'declared'
    | 'not-started'
    | 'paused'
    | 'running';
  readonly declarationEventId: string | null;
  readonly capsuleEventId: string | null;
  readonly workloadEventId: string | null;
  readonly terminalOutcome: 'aborted' | 'completed' | 'quarantined' | null;
}

export interface ModelBenchmarkCellRecord {
  readonly cellKey: string;
  readonly trialId: string;
  readonly matrixKey: TrialMatrixKey;
  readonly disposition:
    | 'abstained'
    | 'admitted'
    | 'completed'
    | 'dispatched'
    | 'failed'
    | 'invalid'
    | 'observed'
    | 'rejected'
    | 'scored'
    | 'unknown';
  readonly sourceEventId: string;
  readonly rawResultEventId: string | null;
  readonly rawObservationEventId: string | null;
  readonly scoreEventId: string | null;
}

export interface ModelBenchmarkIterationConvergenceProjection {
  readonly designIds: string[];
  readonly trialBlockIds: string[];
  readonly cells: ModelBenchmarkCellRecord[];
  readonly paused: boolean;
  readonly unresolvedEvidenceRefs: string[];
  readonly stopSignals: string[];
}

export interface ModelBenchmarkArtifactRecord {
  readonly artifactId: string;
  readonly artifactKind:
    | 'benchmark-capsule'
    | 'design'
    | 'judge-calibration'
    | 'raw-result'
    | 'score-vector'
    | 'selection-evidence'
    | 'usage'
    | 'validity-card'
    | 'validity-plan'
    | 'workload-snapshot';
  readonly reference: string;
  readonly digest: string;
  readonly producerEventId: string;
  readonly sourceEventIds: string[];
}

export interface ModelBenchmarkArtifactIndexProjection {
  readonly artifacts: ModelBenchmarkArtifactRecord[];
}

export interface ModelBenchmarkRawObservationRecord {
  readonly trialId: string;
  readonly cellKey: string;
  readonly completedEventId: string;
  readonly observationEventId: string;
  readonly rawOutputRef: string;
  readonly rawOutputDigest: string;
  readonly evaluatorObservationRef: string;
  readonly evaluatorObservationDigest: string;
}

export interface ModelBenchmarkScoreRecord {
  readonly trialId: string;
  readonly candidateId: string;
  readonly cellKey: string;
  readonly observationEventId: string;
  readonly scoreEventId: string;
  readonly scorePolicyVersion: string;
  readonly scoreWriteBackendRef: 'backend:deep-improvement-score';
  readonly scoreVector: ScoreVectorObservation;
  readonly contaminationStatus:
    | 'clean'
    | 'confirmed'
    | 'not-observed'
    | 'suspected'
    | 'unknown';
  readonly contaminationEventIds: string[];
}

export interface ModelBenchmarkJudgeObservationRecord {
  readonly observationEventId: string;
  readonly trialId: string;
  readonly candidateId: string;
  readonly cellKey: string;
  readonly scoreEventId: string;
  readonly blindedJudgeRef: string;
  readonly judgeFamilyCode: string;
  readonly judgeBuildFingerprint: string;
  readonly calibrationSliceId: string;
  readonly orderProbeOutcome: 'fail' | 'pass' | 'unknown';
  readonly styleProbeOutcome: 'fail' | 'pass' | 'unknown';
  readonly confidence: number;
  readonly uncertainty: number;
  readonly abstained: boolean;
  readonly disagreementState:
    | 'disagreed'
    | 'not-observed'
    | 'resolved'
    | 'unknown';
  readonly observationRef: string;
  readonly observationDigest: string;
}

export interface ModelBenchmarkPairwiseComparisonResultRecord {
  readonly comparisonResultId: string;
  readonly pairedBlockId: string;
  readonly trialId: string;
  readonly candidateId: string;
  readonly cellKey: string;
  readonly scoreEventId: string;
  readonly judgeObservationEventId: string;
  readonly result: 'abstained' | 'inconclusive' | 'observed';
  readonly confidence: number;
  readonly uncertainty: number;
  readonly contaminationStatus:
    | 'clean'
    | 'confirmed'
    | 'not-observed'
    | 'suspected'
    | 'unknown';
  readonly contaminationEventIds: string[];
}

export interface ModelBenchmarkCostLatencySliceRecord {
  readonly sliceId: string;
  readonly trialId: string;
  readonly candidateId: string;
  readonly cellKey: string;
  readonly observationEventId: string;
  readonly usageEventId: string;
  readonly usage: UsageObservation;
  readonly latency: LatencyObservation;
  readonly usageReceiptRef: string;
  readonly usageReceiptDigest: string;
}

export interface ModelBenchmarkOracleLabelRecord {
  readonly attestationEventId: string;
  readonly caseId: string;
  readonly taskInstanceId: string;
  readonly taskFamilyId: string;
  readonly oracleVersion: string;
  readonly labelRef: string;
  readonly labelDigest: string;
  readonly attestationStatus: 'attested' | 'corrected' | 'unknown';
  readonly confidence: number;
  readonly uncertainty: number;
  readonly priorAttestationEventId: string | null;
  readonly attestationReceiptRef: string;
}

export interface ModelBenchmarkContaminationEvidenceRecord {
  readonly contaminationEventId: string;
  readonly caseId: string;
  readonly taskInstanceId: string;
  readonly taskFamilyId: string;
  readonly contaminationStatus: 'clean' | 'confirmed' | 'suspected' | 'unknown';
  readonly detectorFingerprint: string;
  readonly evidenceRef: string;
  readonly evidenceDigest: string;
  readonly exposureEventIds: string[];
  readonly reasonCode: string;
}

export interface ModelBenchmarkExposureRecord {
  readonly exposureEventId: string;
  readonly caseId: string;
  readonly taskInstanceId: string;
  readonly taskFamilyId: string;
  readonly exposureClass: 'candidate' | 'judge' | 'oracle' | 'proposer' | 'public';
  readonly exposedActorRef: string;
  readonly firstExposedAt: string;
  readonly evidenceRef: string;
  readonly evidenceDigest: string;
}

export interface ModelBenchmarkCaseLifecycleRecord {
  readonly caseId: string;
  readonly taskInstanceId: string;
  readonly taskFamilyId: string;
  readonly disclosedEventId: string | null;
  readonly disclosedAt: string | null;
  readonly disclosureRef: string | null;
  readonly disclosureDigest: string | null;
  readonly retiredEventId: string | null;
  readonly retiredAt: string | null;
  readonly retirementReasonCode: string | null;
  readonly retirementEvidenceRef: string | null;
  readonly retirementEvidenceDigest: string | null;
  readonly replacedEventId: string | null;
  readonly replacementCaseId: string | null;
  readonly replacementCaseDigest: string | null;
  readonly replacementReasonCode: string | null;
  readonly lineageReceiptRef: string | null;
}

export interface ModelBenchmarkValidityRecord {
  readonly validityPlanId: string;
  readonly validityEventId: string;
  readonly state: 'invalid' | 'unknown' | 'valid';
  readonly blockerCodes: string[];
  readonly uncertainty: number;
}

export interface ModelBenchmarkValidityUnknownRecord {
  readonly validityPlanId: string;
  readonly validityUnknownEventId: string;
  readonly unknownCode: string;
  readonly requiredEvidenceRefs: string[];
  readonly blocker: boolean;
}

export interface ModelBenchmarkSelectionEvidenceRecord {
  readonly evidenceSetId: string;
  readonly sealedEventId: string;
  readonly evidenceEventIds: string[];
  readonly validityCardEventIds: string[];
  readonly evidenceSetDigest: string;
}

export interface ModelBenchmarkRankingRecord {
  readonly evidenceSetId: string;
  readonly requestEventId: string;
  readonly reducerContractVersion: string;
  readonly candidateId: string;
  readonly aggregateScore: number | null;
  readonly uncertainty: number | null;
  readonly eligible: boolean;
  readonly rank: number | null;
  readonly blockingVetoCodes: string[];
  readonly sourceScoreEventIds: string[];
}

export interface ModelBenchmarkScoringMatrixProjection {
  readonly rawObservations: ModelBenchmarkRawObservationRecord[];
  readonly scores: ModelBenchmarkScoreRecord[];
  readonly judgeObservations: ModelBenchmarkJudgeObservationRecord[];
  readonly pairwiseComparisonResults:
    ModelBenchmarkPairwiseComparisonResultRecord[];
  readonly costLatencySlices: ModelBenchmarkCostLatencySliceRecord[];
  readonly oracleLabels: ModelBenchmarkOracleLabelRecord[];
  readonly contaminationEvidence:
    ModelBenchmarkContaminationEvidenceRecord[];
  readonly exposures: ModelBenchmarkExposureRecord[];
  readonly caseLifecycle: ModelBenchmarkCaseLifecycleRecord[];
  readonly validity: ModelBenchmarkValidityRecord[];
  readonly validityUnknowns: ModelBenchmarkValidityUnknownRecord[];
  readonly selectionEvidence: ModelBenchmarkSelectionEvidenceRecord[];
  readonly rankings: ModelBenchmarkRankingRecord[];
}

export interface ModelBenchmarkModeStatusExtension {
  readonly commonStatusWorkstream: 'model-benchmark';
  readonly activeMatrixProfile: string | null;
  readonly incumbentCandidateId: string | null;
  readonly matrixCoverage: number;
  readonly rankingState: 'blocked' | 'ranked' | 'unranked';
  readonly blockingCellKeys: string[];
  readonly blockingVetoCodes: string[];
}

export interface ModelBenchmarkVariantProjection {
  readonly run: ModelBenchmarkRunProjection;
  readonly iterationConvergence: ModelBenchmarkIterationConvergenceProjection;
  readonly artifactIndex: ModelBenchmarkArtifactIndexProjection;
  readonly scoringMatrix: ModelBenchmarkScoringMatrixProjection;
  readonly modeStatus: ModelBenchmarkModeStatusExtension;
}

export interface ModelBenchmarkSeenEvent {
  readonly eventId: string;
  readonly eventDigest: string;
  readonly payloadDigest: string;
  readonly stem: ModelBenchmarkEventStem;
  readonly streamId: string;
  readonly streamSequence: number;
}

export interface ModelBenchmarkStreamFrontier {
  readonly streamId: string;
  readonly lastSequence: number;
}

export interface ModelBenchmarkProjectionState {
  readonly schemaVersion: string;
  readonly reducerVersion: string;
  readonly codecVersion: string;
  readonly orderingPolicyVersion: string;
  readonly common: DeepImprovementCommonProjectionState;
  readonly modelBenchmark: ModelBenchmarkVariantProjection;
  readonly streamFrontiers: ModelBenchmarkStreamFrontier[];
  readonly seenEvents: ModelBenchmarkSeenEvent[];
}

export interface ModelBenchmarkProjectionCheckpoint {
  readonly projection: ModelBenchmarkProjectionState;
  readonly integrityDigest: string;
  readonly sourceStreamTails: ModelBenchmarkStreamFrontier[];
}

export interface ModelBenchmarkProjectedResult {
  readonly outcome: 'projected';
  readonly projection: ModelBenchmarkProjectionState;
  readonly integrityDigest: string;
  readonly checkpoint: ModelBenchmarkProjectionCheckpoint;
}

export interface ModelBenchmarkRebuildRequiredResult {
  readonly outcome: 'rebuild_required';
  readonly reasonCodes: readonly ModelBenchmarkRebuildReasonCode[];
}

export type ModelBenchmarkFoldResult =
  | ModelBenchmarkProjectedResult
  | ModelBenchmarkRebuildRequiredResult;

export interface ModelBenchmarkFoldOptions {
  readonly checkpoint?: ModelBenchmarkProjectionCheckpoint;
  readonly expectedSchemaVersion?: string;
  readonly expectedReducerVersion?: string;
  readonly expectedCodecVersion?: string;
  readonly expectedOrderingPolicyVersion?: string;
}

export interface ModelBenchmarkLegacyProjection {
  readonly authority: 'shadow-only';
  readonly legacyAuthority: 'unchanged';
  readonly common: DeepImprovementCommonLegacyProjection;
  readonly runState: ModelBenchmarkRunProjection['state'];
  readonly terminalOutcome: ModelBenchmarkRunProjection['terminalOutcome'];
  readonly rankingState: ModelBenchmarkModeStatusExtension['rankingState'];
  readonly incumbentCandidateId: string | null;
  readonly blockingVetoCodes: string[];
}

export interface ModelBenchmarkFoldBranch {
  readonly projectionKey: 'modelBenchmark';
  readonly eventStems: readonly ModelBenchmarkSpecificEventStem[];
}
