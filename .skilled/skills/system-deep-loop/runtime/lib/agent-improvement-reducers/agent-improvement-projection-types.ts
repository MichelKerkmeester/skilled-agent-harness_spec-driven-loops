// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Projection Types
// ───────────────────────────────────────────────────────────────────

import type {
  AgentImprovementEventStem,
  AgentImprovementExtensionEventStem,
  AgentIrComponentReference,
  AgentIrInheritanceEdgeReference,
  AgentIrLocusReference,
  EvaluationManifestRingReference,
} from '../agent-improvement-ledger-schema/index.js';
import type {
  DeepImprovementCommonLegacyProjection,
  DeepImprovementCommonProjectionState,
} from '../deep-improvement-common-reducers/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. VERSION, STATUS, AND ERROR TYPES
// ───────────────────────────────────────────────────────────────────

export type AgentImprovementProjectionHealth =
  | 'blocked'
  | 'healthy'
  | 'inconclusive'
  | 'unassessed';

export type AgentImprovementCoverageState =
  | 'blocked'
  | 'covered'
  | 'partial'
  | 'unassessed';

export type AgentImprovementEvaluatorIntegrityState =
  | 'clean'
  | 'compromised'
  | 'unassessed';

export type AgentImprovementArtifactKind =
  | 'agent-definition'
  | 'agent-ir'
  | 'behavior-classification'
  | 'behavior-coverage'
  | 'change-contract'
  | 'evaluation-manifest'
  | 'experiment-plan'
  | 'failure-gradient'
  | 'fixture-exposure'
  | 'mutation-proposal'
  | 'patch'
  | 'raw-trial'
  | 'trace-slice';

export type AgentImprovementArtifactAvailability =
  | 'available'
  | 'invalid'
  | 'superseded';

export type AgentImprovementRebuildReasonCode =
  | 'checkpoint-digest-mismatch'
  | 'codec-version-mismatch'
  | 'cursor-gap'
  | 'event-order-invalid'
  | 'ordering-policy-mismatch'
  | 'projection-schema-mismatch'
  | 'reducer-version-mismatch'
  | 'source-truncated';

export type AgentImprovementReducerErrorCode =
  | 'duplicate-event-conflict'
  | 'duplicate-owner'
  | 'event-order-invalid'
  | 'event-not-agent-improvement'
  | 'event-schema-invalid'
  | 'impossible-status-transition'
  | 'projection-field-invalid'
  | 'projection-field-undeclared'
  | 'projection-not-frozen'
  | 'cursor-gap'
  | 'reducer-nondeterministic'
  | 'reducer-output-unowned'
  | 'referential-integrity'
  | 'run-identity-conflict'
  | 'state-mutated';

// ───────────────────────────────────────────────────────────────────
// 2. ITERATION AND CONVERGENCE PROJECTION
// ───────────────────────────────────────────────────────────────────

export interface AgentImprovementMutationRecord {
  readonly candidateId: string;
  readonly agentChangeId: string;
  readonly mutationId: string;
  readonly lifecycle: 'proposed' | 'rejected';
  readonly changeContractEventId: string;
  readonly changeContractPayloadDigest: string;
  readonly mutationOperatorRef: string;
  readonly mutationOperatorVersion: string;
  readonly mutationProposalRef: string;
  readonly mutationProposalDigest: string;
  readonly targetLocusIds: string[];
  readonly parentCandidateId: string | null;
  readonly diagnosticEvidenceRefs: string[];
  readonly proposalPolicyVersion: string;
  readonly proposalEventId: string;
  readonly rejectionReasonCode: string | null;
  readonly proposalPayloadDigest: string | null;
  readonly invalidLocusIds: string[];
  readonly rejectionEvidenceRefs: string[];
  readonly terminalEventId: string | null;
}

export interface AgentImprovementTraceSliceRecord {
  readonly candidateId: string;
  readonly evaluationEpochId: string;
  readonly behaviorFamilyId: string;
  readonly traceId: string;
  readonly evaluationObservationEventId: string;
  readonly evaluationObservationPayloadDigest: string;
  readonly traceRef: string;
  readonly traceDigest: string;
  readonly traceSliceRef: string;
  readonly traceSliceDigest: string;
  readonly failureRef: string;
  readonly failureDigest: string;
  readonly clauseIds: string[];
  readonly componentIds: string[];
  readonly attributionStatus: 'diagnostic' | 'insufficient-evidence';
  readonly attributionUncertainty: number;
  readonly producerEventId: string;
}

export interface AgentImprovementExperimentRecord {
  readonly candidateId: string;
  readonly experimentId: string;
  readonly traceSliceEventId: string;
  readonly traceSlicePayloadDigest: string;
  readonly behaviorFamilyId: string;
  readonly experimentPlanRef: string;
  readonly experimentPlanDigest: string;
  readonly scenarioSetRef: string;
  readonly scenarioSetDigest: string;
  readonly baselineExecutionRef: string;
  readonly baselineExecutionDigest: string;
  readonly candidateExecutionRef: string;
  readonly candidateExecutionDigest: string;
  readonly executorRef: string;
  readonly executorFingerprint: string;
  readonly verifierRef: string;
  readonly verifierFingerprint: string;
  readonly interventionIds: string[];
  readonly producerEventId: string;
}

export interface AgentImprovementInterventionRecord {
  readonly candidateId: string;
  readonly experimentId: string;
  readonly interventionId: string;
  readonly interventionKind:
    | 'ablation'
    | 'counterfactual'
    | 'known-defect';
  readonly sourceEventId: string;
  readonly sourcePayloadDigest: string;
  readonly rawObservationRef: string;
  readonly rawObservationDigest: string;
  readonly outcome:
    | 'changed'
    | 'degraded'
    | 'detected'
    | 'improved'
    | 'inconclusive'
    | 'missed'
    | 'unchanged';
  readonly uncertainty: number;
  readonly receiptRef: string;
  readonly producerEventId: string;
}

export interface AgentImprovementCoverageRecord {
  readonly candidateId: string;
  readonly evaluationEpochId: string;
  readonly behaviorFamilyId: string;
  readonly experimentEventIds: string[];
  readonly clauseIds: string[];
  readonly authorityConflictCaseIds: string[];
  readonly negativeCapabilityCaseIds: string[];
  readonly sideEffectOracleIds: string[];
  readonly semanticVariantIds: string[];
  readonly rawCoverageRef: string;
  readonly rawCoverageDigest: string;
  readonly evidenceSetDigest: string;
  readonly coverageOutcome: 'covered' | 'insufficient-evidence' | 'partial';
  readonly criticalInvariantOutcome: 'fail' | 'pass' | 'unknown';
  readonly coveragePolicyVersion: string;
  readonly producerEventId: string;
}

export interface AgentImprovementBehaviorClassification {
  readonly candidateId: string;
  readonly agentChangeId: string;
  readonly changeContractEventId: string;
  readonly changeContractPayloadDigest: string;
  readonly normalizedEventId: string;
  readonly normalizedPayloadDigest: string;
  readonly verificationEventId: string;
  readonly verificationPayloadDigest: string;
  readonly canaryGateEventId: string;
  readonly canaryGatePayloadDigest: string;
  readonly classificationPolicyVersion: string;
  readonly behavioralSemver: 'major' | 'minor' | 'patch';
  readonly affectedBehaviorFamilyIds: string[];
  readonly regressedBehaviorFamilyIds: string[];
  readonly preservedObligationIds: string[];
  readonly classificationEvidenceRef: string;
  readonly classificationEvidenceDigest: string;
  readonly classificationReceiptRef: string;
  readonly producerEventId: string;
}

export interface AgentImprovementIterationConvergenceProjection {
  readonly activeAgentIrId: string | null;
  readonly activeMutationId: string | null;
  readonly mutations: AgentImprovementMutationRecord[];
  readonly traceSlices: AgentImprovementTraceSliceRecord[];
  readonly experiments: AgentImprovementExperimentRecord[];
  readonly interventions: AgentImprovementInterventionRecord[];
  readonly coverage: AgentImprovementCoverageRecord[];
  readonly classifications: AgentImprovementBehaviorClassification[];
  readonly unresolvedEvidenceRefs: string[];
  readonly blockingVetoCodes: string[];
  readonly disposition: AgentImprovementProjectionHealth;
}

// ───────────────────────────────────────────────────────────────────
// 3. CANDIDATE AND ARTIFACT INDEX
// ───────────────────────────────────────────────────────────────────

export interface AgentImprovementDefinitionSnapshot {
  readonly agentDefinitionId: string;
  readonly definitionRef: string;
  readonly definitionDigest: string;
  readonly definitionSchemaVersion: string;
  readonly capabilityPolicyRef: string;
  readonly capabilityPolicyDigest: string;
  readonly verifierPolicyRef: string;
  readonly verifierPolicyDigest: string;
  readonly toolPolicyRef: string;
  readonly toolPolicyDigest: string;
  readonly routingPolicyRef: string;
  readonly routingPolicyDigest: string;
  readonly memoryPolicyRef: string;
  readonly memoryPolicyDigest: string;
  readonly sealingReceiptRef: string;
  readonly producerEventId: string;
}

export interface AgentImprovementIrVersion {
  readonly agentDefinitionId: string;
  readonly agentIrId: string;
  readonly definitionSnapshotEventId: string;
  readonly definitionSnapshotPayloadDigest: string;
  readonly agentIrRef: string;
  readonly agentIrDigest: string;
  readonly agentIrSchemaVersion: string;
  readonly components: AgentIrComponentReference[];
  readonly inheritanceEdges: AgentIrInheritanceEdgeReference[];
  readonly loci: AgentIrLocusReference[];
  readonly compilerFingerprint: string;
  readonly compilationReceiptRef: string;
  readonly producerEventId: string;
}

export interface AgentImprovementChangeContract {
  readonly candidateId: string;
  readonly agentChangeId: string;
  readonly agentIrEventId: string;
  readonly agentIrPayloadDigest: string;
  readonly baseDefinitionRef: string;
  readonly baseDefinitionDigest: string;
  readonly candidateDefinitionRef: string;
  readonly candidateDefinitionDigest: string;
  readonly changeContractRef: string;
  readonly changeContractDigest: string;
  readonly patchRef: string;
  readonly patchDigest: string;
  readonly intendedObligationIds: string[];
  readonly preservedObligationIds: string[];
  readonly affectedBehaviorFamilyIds: string[];
  readonly behavioralSemverIntent: 'major' | 'minor' | 'patch';
  readonly contractPolicyVersion: string;
  readonly compilationReceiptRef: string;
  readonly producerEventId: string;
}

export interface AgentImprovementManifestRecord {
  readonly evaluationEpochId: string;
  readonly manifestId: string;
  readonly exposureEpochId: string;
  readonly manifestRef: string;
  readonly manifestDigest: string;
  readonly manifestVersion: string;
  readonly rings: EvaluationManifestRingReference[];
  readonly evaluatorCapsuleRef: string;
  readonly evaluatorCapsuleDigest: string;
  readonly leakVetoPolicyVersion: string;
  readonly sealingReceiptRef: string;
  readonly producerEventId: string;
}

export interface AgentImprovementFixtureExposure {
  readonly evaluationEpochId: string;
  readonly manifestId: string;
  readonly exposureEpochId: string;
  readonly manifestEventId: string;
  readonly manifestPayloadDigest: string;
  readonly exposureKind: 'activated' | 'retired';
  readonly exposedRingCodes: string[];
  readonly authorizedExposureRef: string;
  readonly authorizedExposureDigest: string;
  readonly exposureReceiptRef: string;
  readonly occurredAt: string;
  readonly producerEventId: string;
}

export interface AgentImprovementTransferTrial {
  readonly candidateId: string;
  readonly evaluationEpochId: string;
  readonly trialId: string;
  readonly sourceExecutorRef: string;
  readonly sourceExecutorFingerprint: string;
  readonly targetExecutorRef: string;
  readonly targetExecutorFingerprint: string;
  readonly verifierRef: string;
  readonly verifierFingerprint: string;
  readonly behaviorFamilyIds: string[];
  readonly scenarioSetRef: string;
  readonly scenarioSetDigest: string;
  readonly baselineExecutionRef: string;
  readonly baselineExecutionDigest: string;
  readonly candidateExecutionRef: string;
  readonly candidateExecutionDigest: string;
  readonly rawObservationRef: string;
  readonly rawObservationDigest: string;
  readonly transferOutcome: 'fail' | 'inconclusive' | 'pass';
  readonly uncertainty: number;
  readonly executionReceiptRef: string;
  readonly producerEventId: string;
}

export interface AgentImprovementArtifactRecord {
  readonly artifactId: string;
  readonly logicalArtifactId: string;
  readonly artifactKind: AgentImprovementArtifactKind;
  readonly reference: string;
  readonly digest: string;
  readonly producerEventId: string;
  readonly candidateId: string | null;
  readonly availability: AgentImprovementArtifactAvailability;
  readonly receiptRefs: string[];
  readonly supersedesArtifactIds: string[];
  readonly supersededByArtifactIds: string[];
}

export interface AgentImprovementArtifactIndexProjection {
  readonly definitionSnapshots: AgentImprovementDefinitionSnapshot[];
  readonly agentIrVersions: AgentImprovementIrVersion[];
  readonly changeContracts: AgentImprovementChangeContract[];
  readonly manifests: AgentImprovementManifestRecord[];
  readonly exposures: AgentImprovementFixtureExposure[];
  readonly transferTrials: AgentImprovementTransferTrial[];
  readonly artifacts: AgentImprovementArtifactRecord[];
}

// ───────────────────────────────────────────────────────────────────
// 4. NAMESPACED MODE-STATUS EXTENSION
// ───────────────────────────────────────────────────────────────────

export interface AgentImprovementProfileChampion {
  readonly profileRef: string;
  readonly candidateId: string;
}

export interface AgentImprovementModeStatusExtension {
  readonly commonStatusWorkstream: 'agent-improvement';
  readonly activeAgentIrId: string | null;
  readonly activeMutationId: string | null;
  readonly activeMutationOperatorRef: string | null;
  readonly latestClassifiedCandidateId: string | null;
  readonly profileChampions: AgentImprovementProfileChampion[];
  readonly coverageState: AgentImprovementCoverageState;
  readonly evaluatorIntegrityState: AgentImprovementEvaluatorIntegrityState;
  readonly projectionHealth: AgentImprovementProjectionHealth;
  readonly failureClasses: string[];
  readonly blockingVetoCodes: string[];
}

export interface AgentImprovementVariantProjection {
  readonly iterationConvergence:
    AgentImprovementIterationConvergenceProjection;
  readonly artifactIndex: AgentImprovementArtifactIndexProjection;
  readonly modeStatus: AgentImprovementModeStatusExtension;
}

// ───────────────────────────────────────────────────────────────────
// 5. COMPOSITE REPLAY STATE AND PUBLIC RESULTS
// ───────────────────────────────────────────────────────────────────

export interface AgentImprovementSeenEvent {
  readonly eventId: string;
  readonly eventDigest: string;
  readonly payloadDigest: string;
  readonly stem: AgentImprovementEventStem;
  readonly streamId: string;
  readonly streamSequence: number;
}

export interface AgentImprovementStreamFrontier {
  readonly streamId: string;
  readonly lastSequence: number;
}

export interface AgentImprovementProjectionState {
  readonly schemaVersion: string;
  readonly reducerVersion: string;
  readonly codecVersion: string;
  readonly orderingPolicyVersion: string;
  readonly common: DeepImprovementCommonProjectionState;
  readonly agentImprovement: AgentImprovementVariantProjection;
  readonly streamFrontiers: AgentImprovementStreamFrontier[];
  readonly seenEvents: AgentImprovementSeenEvent[];
}

export type AgentImprovementPersistedField =
  keyof AgentImprovementProjectionState & string;

export interface AgentImprovementProjectionCheckpoint {
  readonly projection: AgentImprovementProjectionState;
  readonly integrityDigest: string;
  readonly sourceStreamTails: AgentImprovementStreamFrontier[];
}

export interface AgentImprovementProjectedResult {
  readonly outcome: 'projected';
  readonly projection: AgentImprovementProjectionState;
  readonly integrityDigest: string;
  readonly checkpoint: AgentImprovementProjectionCheckpoint;
}

export interface AgentImprovementRebuildRequiredResult {
  readonly outcome: 'rebuild_required';
  readonly reasonCodes: readonly AgentImprovementRebuildReasonCode[];
}

export type AgentImprovementFoldResult =
  | AgentImprovementProjectedResult
  | AgentImprovementRebuildRequiredResult;

export interface AgentImprovementFoldOptions {
  readonly checkpoint?: AgentImprovementProjectionCheckpoint;
  readonly expectedSchemaVersion?: string;
  readonly expectedReducerVersion?: string;
  readonly expectedCodecVersion?: string;
  readonly expectedOrderingPolicyVersion?: string;
}

export interface AgentImprovementLegacyProjection {
  readonly authority: 'shadow-only';
  readonly legacyAuthority: 'unchanged';
  readonly common: DeepImprovementCommonLegacyProjection;
  readonly activeAgentIrId: string | null;
  readonly activeMutationId: string | null;
  readonly latestClassifiedCandidateId: string | null;
  readonly coverageState: AgentImprovementCoverageState;
  readonly evaluatorIntegrityState: AgentImprovementEvaluatorIntegrityState;
  readonly projectionHealth: AgentImprovementProjectionHealth;
  readonly blockingVetoCodes: string[];
}

export interface AgentImprovementCandidateView {
  readonly authority: 'derived-redacted';
  readonly workstream: 'agent-improvement';
  readonly candidateStage:
    | 'evaluating'
    | 'failed'
    | 'generated'
    | 'inconclusive'
    | 'proposed'
    | 'rejected'
    | 'scored'
    | 'verified'
    | null;
  readonly coverageState: AgentImprovementCoverageState;
  readonly decisionBand: 'blocked' | 'eligible' | 'pending' | 'terminal';
}

export interface AgentImprovementProjectionFieldOwnership {
  readonly field: AgentImprovementPersistedField;
  readonly ownerReducerId: string;
  readonly inputStems: readonly AgentImprovementEventStem[];
  readonly foldAlgebra:
    | 'constant'
    | 'delegate-common'
    | 'insert-sorted'
    | 'insert-sorted-and-derive';
  readonly immutableOutput: true;
}

export interface AgentImprovementFoldBranch {
  readonly projectionKey: 'agentImprovement';
  readonly eventStems: readonly AgentImprovementExtensionEventStem[];
}
