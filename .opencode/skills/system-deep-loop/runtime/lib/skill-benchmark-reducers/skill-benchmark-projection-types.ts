// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Projection Types
// ───────────────────────────────────────────────────────────────────

import type {
  DeepImprovementCommonLegacyProjection,
  DeepImprovementCommonProjectionState,
} from '../deep-improvement-common-reducers/index.js';
import type {
  SkillBenchmarkEventStem,
  SkillBenchmarkSpecificEventStem,
} from '../skill-benchmark-ledger-schema/index.js';

export type SkillBenchmarkRunState =
  | 'planned'
  | 'active'
  | 'closed'
  | 'incomplete'
  | 'aborted';

export type SkillBenchmarkScenarioState =
  | 'assigned'
  | 'running'
  | 'finished'
  | 'aborted';

export type SkillBenchmarkCollectionStage =
  | 'assigned'
  | 'available'
  | 'loaded'
  | 'invoked'
  | 'trajectory-recorded'
  | 'outcome-recorded'
  | 'raw-score-recorded'
  | 'normalized'
  | 'blocked';

export type SkillBenchmarkModeState =
  | 'planned'
  | 'active'
  | 'collecting'
  | 'scoring'
  | 'ready'
  | 'blocked'
  | 'withheld'
  | 'issued'
  | 'expired'
  | 'closed'
  | 'incomplete'
  | 'aborted';

export type SkillBenchmarkScoringState =
  | 'not-started'
  | 'raw-observed'
  | 'normalized'
  | 'ranked'
  | 'blocked';

export type SkillBenchmarkCertificateState =
  | 'none'
  | 'pending'
  | 'eligible'
  | 'issued'
  | 'withheld'
  | 'expired';

export type SkillBenchmarkCompatibilityState =
  | 'compatible'
  | 'incompatible'
  | 'unknown';

export type SkillBenchmarkFoldOutcome =
  | 'projected'
  | 'rebuild_required';

export type SkillBenchmarkRebuildReasonCode =
  | 'checkpoint-digest-mismatch'
  | 'codec-version-mismatch'
  | 'cursor-gap'
  | 'event-order-invalid'
  | 'ordering-policy-mismatch'
  | 'projection-schema-mismatch'
  | 'reducer-version-mismatch'
  | 'source-truncated';

export type SkillBenchmarkReducerErrorCode =
  | 'duplicate-event-conflict'
  | 'duplicate-owner'
  | 'event-not-skill-benchmark'
  | 'event-order-invalid'
  | 'event-schema-invalid'
  | 'impossible-status-transition'
  | 'projection-field-invalid'
  | 'projection-field-undeclared'
  | 'projection-not-frozen'
  | 'reducer-nondeterministic'
  | 'reducer-output-unowned'
  | 'referential-integrity'
  | 'run-identity-conflict'
  | 'run-not-initialized'
  | 'state-mutated';

export interface SkillBenchmarkRunProjection {
  readonly runId: string | null;
  readonly lineageId: string | null;
  readonly benchmarkDesignId: string | null;
  readonly designRef: string | null;
  readonly designDigest: string | null;
  readonly taskSetRef: string | null;
  readonly taskSetDigest: string | null;
  readonly skillBundleRef: string | null;
  readonly skillBundleDigest: string | null;
  readonly registryDigest: string | null;
  readonly executorDescriptorRef: string | null;
  readonly executorDescriptorDigest: string | null;
  readonly environmentDigest: string | null;
  readonly dependencyDigest: string | null;
  readonly workloadDigest: string | null;
  readonly replicateCount: number;
  readonly designPolicyVersion: string | null;
  readonly state: SkillBenchmarkRunState;
  readonly plannedEventId: string | null;
  readonly closedEventId: string | null;
}

export interface SkillBenchmarkScenarioCell {
  readonly scenarioId: string;
  readonly assignmentId: string;
  readonly executionId: string | null;
  readonly designCellId: string;
  readonly pairedReplicateId: string;
  readonly replicateIndex: number;
  readonly treatmentArm:
    | 'auto-route'
    | 'compatibility-boundary'
    | 'component-ablation'
    | 'control'
    | 'distractor'
    | 'forced-activation'
    | 'no-skill'
    | 'placebo';
  readonly taskRef: string;
  readonly taskDigest: string;
  readonly skillBundleRef: string;
  readonly skillBundleDigest: string;
  readonly executorDescriptorRef: string;
  readonly executorDescriptorDigest: string;
  readonly environmentDigest: string;
  readonly toolDigest: string | null;
  readonly permissionDigest: string | null;
  readonly dependencyDigest: string | null;
  readonly workloadDigest: string | null;
  readonly state: SkillBenchmarkScenarioState;
  readonly collectionStage: SkillBenchmarkCollectionStage;
  readonly assignmentEventId: string;
  readonly startedEventId: string | null;
  readonly terminalEventId: string | null;
  readonly discoveryEventId: string | null;
  readonly loadEventId: string | null;
  readonly invocationEventId: string | null;
  readonly trajectoryEventId: string | null;
  readonly outcomeEventId: string | null;
  readonly rawScoreEventIds: string[];
  readonly goldIntegrityEventIds: string[];
  readonly compatibilityEventIds: string[];
  readonly requiredEvidenceComplete: boolean;
}

export interface SkillBenchmarkEvidenceCoverage {
  readonly assignedScenarioCount: number;
  readonly terminalScenarioCount: number;
  readonly discoveredScenarioCount: number;
  readonly invokedScenarioCount: number;
  readonly trajectoryScenarioCount: number;
  readonly outcomeScenarioCount: number;
  readonly rawScoreScenarioCount: number;
  readonly acceptedGoldScenarioCount: number;
  readonly normalizedCandidateCount: number;
  readonly requiredScenarioCount: number;
  readonly complete: boolean;
}

export interface SkillBenchmarkHardVeto {
  readonly vetoCode: string;
  readonly source:
    | 'canary'
    | 'compatibility'
    | 'gold-integrity'
    | 'negative-transfer'
    | 'security-probe'
    | 'shared-common';
  readonly scenarioId: string | null;
  readonly evidenceRef: string;
  readonly evidenceDigest: string;
  readonly producerEventId: string;
}

export interface SkillBenchmarkIterationConvergenceProjection {
  readonly scenarios: SkillBenchmarkScenarioCell[];
  readonly coverage: SkillBenchmarkEvidenceCoverage;
  readonly hardVetoes: SkillBenchmarkHardVeto[];
  readonly collectionComplete: boolean;
  readonly scoringComplete: boolean;
  readonly certificateReady: boolean;
  readonly blockerCodes: string[];
  readonly lastAppliedSequenceByStream: SkillBenchmarkStreamTail[];
}

export type SkillBenchmarkArtifactKind =
  | 'assignment'
  | 'compatibility'
  | 'dependency'
  | 'design'
  | 'environment'
  | 'executor'
  | 'gold'
  | 'milestone'
  | 'negative-transfer'
  | 'normalized-score'
  | 'outcome'
  | 'permission'
  | 'raw-observation'
  | 'registry'
  | 'resource-exposure'
  | 'security-probe'
  | 'skill-bundle'
  | 'task'
  | 'tool'
  | 'trajectory'
  | 'workload';

export type SkillBenchmarkArtifactAvailability =
  | 'available'
  | 'invalid'
  | 'pending'
  | 'superseded'
  | 'unavailable';

export interface SkillBenchmarkArtifactRecord {
  readonly artifactId: string;
  readonly logicalArtifactId: string;
  readonly artifactKind: SkillBenchmarkArtifactKind;
  readonly reference: string;
  readonly digest: string;
  readonly producerEventId: string;
  readonly scenarioId: string | null;
  readonly candidateId: string | null;
  readonly availability: SkillBenchmarkArtifactAvailability;
  readonly supersedesArtifactIds: string[];
  readonly supersededByArtifactIds: string[];
}

export interface SkillBenchmarkRawMeasurement {
  readonly scenarioId: string;
  readonly assignmentId: string;
  readonly executionId: string;
  readonly observationId: string;
  readonly outcomeEventId: string;
  readonly evaluatorRef: string;
  readonly evaluatorVersion: string;
  readonly evaluatorFingerprint: string;
  readonly rawScoreAxes: ReadonlyArray<{
    readonly dimensionCode: string;
    readonly rawScore: number;
    readonly measurementRef: string;
    readonly measurementDigest: string;
  }>;
  readonly deterministicResultsRef: string;
  readonly deterministicResultsDigest: string;
  readonly dynamicReferenceResultsRef: string;
  readonly dynamicReferenceResultsDigest: string;
  readonly constraintCoverageRef: string;
  readonly constraintCoverageDigest: string;
  readonly tokenCount: number;
  readonly latencyMs: number;
  readonly costMicrounits: number;
  readonly goldIntegrityEventId: string;
  readonly goldPolicy: 'negative' | 'pending' | 'scored' | 'structural-only';
  readonly numeratorEligible: boolean;
  readonly scoreWriteBackendRef: 'backend:deep-improvement-score';
  readonly producerEventId: string;
}

export interface SkillBenchmarkDerivedRanking {
  readonly candidateId: string;
  readonly evaluationEpochId: string;
  readonly normalizedScoreEventId: string;
  readonly scorePolicyVersion: string;
  readonly aggregateScore: number;
  readonly uncertainty: number;
  readonly rank: number | null;
  readonly eligible: boolean;
  readonly promoted: boolean;
  readonly blockingVetoCodes: string[];
}

export interface SkillBenchmarkArtifactIndexProjection {
  readonly artifacts: SkillBenchmarkArtifactRecord[];
  readonly rawMeasurements: SkillBenchmarkRawMeasurement[];
  readonly derivedRankings: SkillBenchmarkDerivedRanking[];
}

export interface SkillBenchmarkStatusTransition {
  readonly state: SkillBenchmarkModeState;
  readonly producerEventId: string;
  readonly producerStem: SkillBenchmarkEventStem;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly reasonCode: string | null;
}

export interface SkillBenchmarkModeStatusProjection {
  readonly state: SkillBenchmarkModeState;
  readonly scoringState: SkillBenchmarkScoringState;
  readonly certificateState: SkillBenchmarkCertificateState;
  readonly compatibilityState: SkillBenchmarkCompatibilityState;
  readonly blockingVetoCodes: string[];
  readonly terminal: boolean;
  readonly provenance: SkillBenchmarkStatusTransition[];
}

export interface SkillBenchmarkStreamTail {
  readonly streamId: string;
  readonly sequence: number;
  readonly eventId: string;
  readonly eventDigest: string;
}

export interface SkillBenchmarkProjectionCursors {
  readonly common: SkillBenchmarkStreamTail[];
  readonly iterationConvergence: SkillBenchmarkStreamTail[];
  readonly artifactIndex: SkillBenchmarkStreamTail[];
  readonly modeStatus: SkillBenchmarkStreamTail[];
}

export interface SkillBenchmarkSeenEvent {
  readonly eventId: string;
  readonly eventDigest: string;
  readonly payloadDigest: string;
  readonly stem: SkillBenchmarkEventStem;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly scenarioId: string | null;
  readonly assignmentId: string | null;
  readonly executionId: string | null;
  readonly observationId: string | null;
  readonly candidateId: string | null;
  readonly benchmarkDesignId: string | null;
  readonly certificateId: string | null;
}

export interface SkillBenchmarkProjectionState {
  readonly schemaVersion: string;
  readonly reducerVersion: string;
  readonly codecVersion: string;
  readonly orderingPolicyVersion: string;
  readonly common: DeepImprovementCommonProjectionState;
  readonly run: SkillBenchmarkRunProjection;
  readonly iterationConvergence: SkillBenchmarkIterationConvergenceProjection;
  readonly artifactIndex: SkillBenchmarkArtifactIndexProjection;
  readonly modeStatus: SkillBenchmarkModeStatusProjection;
  readonly cursors: SkillBenchmarkProjectionCursors;
  readonly seenEvents: SkillBenchmarkSeenEvent[];
}

export type SkillBenchmarkPersistedField =
  keyof SkillBenchmarkProjectionState & string;

export interface SkillBenchmarkProjectionCheckpoint {
  readonly projection: SkillBenchmarkProjectionState;
  readonly integrityDigest: string;
  readonly sourceTails: SkillBenchmarkStreamTail[];
}

export interface SkillBenchmarkProjectedResult {
  readonly outcome: 'projected';
  readonly projection: SkillBenchmarkProjectionState;
  readonly integrityDigest: string;
  readonly checkpoint: SkillBenchmarkProjectionCheckpoint;
}

export interface SkillBenchmarkRebuildRequiredResult {
  readonly outcome: 'rebuild_required';
  readonly reasonCodes: readonly SkillBenchmarkRebuildReasonCode[];
}

export type SkillBenchmarkFoldResult =
  | SkillBenchmarkProjectedResult
  | SkillBenchmarkRebuildRequiredResult;

export interface SkillBenchmarkFoldOptions {
  readonly checkpoint?: SkillBenchmarkProjectionCheckpoint;
  readonly expectedSchemaVersion?: string;
  readonly expectedReducerVersion?: string;
  readonly expectedCodecVersion?: string;
  readonly expectedOrderingPolicyVersion?: string;
}

export interface SkillBenchmarkLegacyProjection {
  readonly authority: 'shadow-only';
  readonly legacyAuthority: 'unchanged';
  readonly common: DeepImprovementCommonLegacyProjection;
  readonly runState: SkillBenchmarkRunState;
  readonly modeState: SkillBenchmarkModeState;
  readonly scoringState: SkillBenchmarkScoringState;
  readonly certificateState: SkillBenchmarkCertificateState;
  readonly collectionComplete: boolean;
  readonly scoringComplete: boolean;
  readonly certificateReady: boolean;
  readonly scenarioCount: number;
  readonly rawMeasurementCount: number;
  readonly rankings: SkillBenchmarkDerivedRanking[];
  readonly blockerCodes: string[];
}

export interface SkillBenchmarkProjectionFieldOwnership {
  readonly field: SkillBenchmarkPersistedField;
  readonly ownerReducerId: string;
  readonly inputStems: readonly SkillBenchmarkEventStem[];
  readonly foldAlgebra:
    | 'constant'
    | 'delegate-common'
    | 'insert-sorted'
    | 'insert-sorted-and-derive';
  readonly immutableOutput: true;
}

export interface SkillBenchmarkSpecificFoldBranch {
  readonly projectionKey:
    | 'artifactIndex'
    | 'iterationConvergence'
    | 'modeStatus';
  readonly eventStems: readonly SkillBenchmarkSpecificEventStem[];
}
