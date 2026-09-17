// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Ledger Types
// ───────────────────────────────────────────────────────────────────

import {
  DeepImprovementCommonEventStems,
  DeepImprovementCommonWireEventTypes,
} from '../deep-improvement-common-ledger-schema/index.js';

import type {
  DeepImprovementCommonBaseScope,
  DeepImprovementCommonEventStem,
  DeepImprovementCommonPayloadMap,
  DeepImprovementCommonReplayMetadata,
  DeepImprovementCommonScopeMap,
} from '../deep-improvement-common-ledger-schema/index.js';
import type {
  EventEnvelope,
  JsonObject,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. IDENTITIES AND SHARED METADATA
// ───────────────────────────────────────────────────────────────────

export type AgentDefinitionId = string;
export type AgentIrId = string;
export type AgentChangeId = string;
export type ClauseId = string;
export type ComponentId = string;
export type MutableLocusId = string;
export type MutationId = string;
export type BehaviorFamilyId = string;
export type TraceId = string;
export type ExperimentId = string;
export type InterventionId = string;
export type ManifestId = string;
export type ExposureEpochId = string;
export type TrialId = string;
export type Digest = string;
export type Fingerprint = string;
export type Version = string;
export type Uint32 = number;

export interface AgentImprovementReplayMetadata
  extends DeepImprovementCommonReplayMetadata {}

export interface AgentImprovementBaseScope
  extends DeepImprovementCommonBaseScope {
  readonly variant: 'agent-improvement';
}

export interface AgentImprovementDefinitionScope
  extends AgentImprovementBaseScope {
  readonly agentDefinitionId: AgentDefinitionId;
}

export interface AgentImprovementIrScope
  extends AgentImprovementDefinitionScope {
  readonly agentIrId: AgentIrId;
}

export interface AgentImprovementCandidateScope
  extends AgentImprovementBaseScope {
  readonly candidateId: string;
}

export interface AgentImprovementChangeScope
  extends AgentImprovementCandidateScope {
  readonly agentChangeId: AgentChangeId;
}

export interface AgentImprovementMutationScope
  extends AgentImprovementChangeScope {
  readonly mutationId: MutationId;
}

export interface AgentImprovementTraceScope
  extends AgentImprovementCandidateScope {
  readonly evaluationEpochId: string;
  readonly behaviorFamilyId: BehaviorFamilyId;
  readonly traceId: TraceId;
}

export interface AgentImprovementExperimentScope
  extends AgentImprovementCandidateScope {
  readonly experimentId: ExperimentId;
}

export interface AgentImprovementInterventionScope
  extends AgentImprovementExperimentScope {
  readonly interventionId: InterventionId;
}

export interface AgentImprovementCoverageScope
  extends AgentImprovementCandidateScope {
  readonly evaluationEpochId: string;
  readonly behaviorFamilyId: BehaviorFamilyId;
}

export interface AgentImprovementManifestScope
  extends AgentImprovementBaseScope {
  readonly evaluationEpochId: string;
  readonly manifestId: ManifestId;
  readonly exposureEpochId: ExposureEpochId;
}

export interface AgentImprovementTransferScope
  extends AgentImprovementCandidateScope {
  readonly evaluationEpochId: string;
  readonly trialId: TrialId;
}

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED REFERENCE VALUE OBJECTS
// ───────────────────────────────────────────────────────────────────

export interface AgentIrComponentReference extends JsonObject {
  readonly componentId: ComponentId;
  readonly componentKind:
    | 'capability'
    | 'instruction'
    | 'memory'
    | 'routing'
    | 'tool-policy'
    | 'verifier-policy';
  readonly componentRef: string;
  readonly componentDigest: Digest;
}

export interface AgentIrInheritanceEdgeReference extends JsonObject {
  readonly edgeId: string;
  readonly parentComponentId: ComponentId;
  readonly childComponentId: ComponentId;
  readonly inheritanceKind: 'extends' | 'imports' | 'overrides' | 'preserves';
  readonly edgeDigest: Digest;
}

export interface AgentIrLocusReference extends JsonObject {
  readonly locusId: MutableLocusId;
  readonly componentId: ComponentId;
  readonly clauseId: ClauseId | null;
  readonly locusKind:
    | 'capability'
    | 'instruction'
    | 'memory'
    | 'routing'
    | 'tool-policy'
    | 'verifier-policy';
  readonly mutability: 'immutable' | 'mutable';
  readonly locusRef: string;
  readonly locusDigest: Digest;
}

export interface EvaluationManifestRingReference extends JsonObject {
  readonly ring:
    | 'canary'
    | 'heldout'
    | 'public'
    | 'transfer';
  readonly fixtureSetRef: string;
  readonly fixtureSetDigest: Digest;
  readonly fixtureCount: Uint32;
}

// ───────────────────────────────────────────────────────────────────
// 3. AGENT-SPECIFIC EVENT PAYLOAD DATA
// ───────────────────────────────────────────────────────────────────

export interface DefinitionSnapshotSealedData extends JsonObject {
  readonly definitionRef: string;
  readonly definitionDigest: Digest;
  readonly definitionSchemaVersion: Version;
  readonly capabilityPolicyRef: string;
  readonly capabilityPolicyDigest: Digest;
  readonly verifierPolicyRef: string;
  readonly verifierPolicyDigest: Digest;
  readonly toolPolicyRef: string;
  readonly toolPolicyDigest: Digest;
  readonly routingPolicyRef: string;
  readonly routingPolicyDigest: Digest;
  readonly memoryPolicyRef: string;
  readonly memoryPolicyDigest: Digest;
  readonly sealingReceiptRef: string;
}

export interface AgentIrCompiledData extends JsonObject {
  readonly definitionSnapshotEventId: string;
  readonly definitionSnapshotPayloadDigest: Digest;
  readonly agentIrRef: string;
  readonly agentIrDigest: Digest;
  readonly agentIrSchemaVersion: Version;
  readonly components: AgentIrComponentReference[];
  readonly inheritanceEdges: AgentIrInheritanceEdgeReference[];
  readonly loci: AgentIrLocusReference[];
  readonly compilerFingerprint: Fingerprint;
  readonly compilationReceiptRef: string;
}

export interface ChangeContractCompiledData extends JsonObject {
  readonly agentIrEventId: string;
  readonly agentIrPayloadDigest: Digest;
  readonly baseDefinitionRef: string;
  readonly baseDefinitionDigest: Digest;
  readonly candidateDefinitionRef: string;
  readonly candidateDefinitionDigest: Digest;
  readonly changeContractRef: string;
  readonly changeContractDigest: Digest;
  readonly patchRef: string;
  readonly patchDigest: Digest;
  readonly intendedObligationIds: string[];
  readonly preservedObligationIds: string[];
  readonly affectedBehaviorFamilyIds: string[];
  readonly behavioralSemverIntent: 'major' | 'minor' | 'patch';
  readonly contractPolicyVersion: Version;
  readonly compilationReceiptRef: string;
}

export interface MutationProposedData extends JsonObject {
  readonly changeContractEventId: string;
  readonly changeContractPayloadDigest: Digest;
  readonly mutationOperatorRef: string;
  readonly mutationOperatorVersion: Version;
  readonly mutationProposalRef: string;
  readonly mutationProposalDigest: Digest;
  readonly targetLocusIds: string[];
  readonly parentCandidateId: string | null;
  readonly diagnosticEvidenceRefs: string[];
  readonly diagnosticEvidenceSetDigest: Digest;
  readonly proposalPolicyVersion: Version;
}

export interface MutationRejectedData extends JsonObject {
  readonly proposalEventId: string;
  readonly proposalPayloadDigest: Digest;
  readonly rejectionReasonCode: string;
  readonly invalidLocusIds: string[];
  readonly rejectionEvidenceRefs: string[];
  readonly rejectionEvidenceSetDigest: Digest;
  readonly policyVersion: Version;
}

export interface TraceSlicedData extends JsonObject {
  readonly evaluationObservationEventId: string;
  readonly evaluationObservationPayloadDigest: Digest;
  readonly traceRef: string;
  readonly traceDigest: Digest;
  readonly traceSliceRef: string;
  readonly traceSliceDigest: Digest;
  readonly failureRef: string;
  readonly failureDigest: Digest;
  readonly clauseIds: string[];
  readonly componentIds: string[];
  readonly slicerFingerprint: Fingerprint;
  readonly attributionStatus: 'diagnostic' | 'insufficient-evidence';
  readonly attributionUncertainty: number;
  readonly slicingReceiptRef: string;
}

export interface BehaviorExperimentSealedData extends JsonObject {
  readonly traceSliceEventId: string;
  readonly traceSlicePayloadDigest: Digest;
  readonly experimentPlanRef: string;
  readonly experimentPlanDigest: Digest;
  readonly behaviorFamilyId: BehaviorFamilyId;
  readonly scenarioSetRef: string;
  readonly scenarioSetDigest: Digest;
  readonly baselineExecutionRef: string;
  readonly baselineExecutionDigest: Digest;
  readonly candidateExecutionRef: string;
  readonly candidateExecutionDigest: Digest;
  readonly freshPairedExecutionReceiptRef: string;
  readonly executorRef: string;
  readonly executorFingerprint: Fingerprint;
  readonly verifierRef: string;
  readonly verifierFingerprint: Fingerprint;
  readonly interventionIds: string[];
  readonly experimentPolicyVersion: Version;
}

export interface KnownDefectInjectedData extends JsonObject {
  readonly experimentEventId: string;
  readonly experimentPayloadDigest: Digest;
  readonly defectLocusId: MutableLocusId;
  readonly injectionRef: string;
  readonly injectionDigest: Digest;
  readonly controlExecutionRef: string;
  readonly controlExecutionDigest: Digest;
  readonly perturbedExecutionRef: string;
  readonly perturbedExecutionDigest: Digest;
  readonly rawObservationRef: string;
  readonly rawObservationDigest: Digest;
  readonly outcome: 'detected' | 'missed' | 'inconclusive';
  readonly uncertainty: number;
  readonly injectionReceiptRef: string;
}

export interface CounterfactualReplayedData extends JsonObject {
  readonly experimentEventId: string;
  readonly experimentPayloadDigest: Digest;
  readonly interventionRef: string;
  readonly interventionDigest: Digest;
  readonly sourceTraceRef: string;
  readonly sourceTraceDigest: Digest;
  readonly counterfactualTraceRef: string;
  readonly counterfactualTraceDigest: Digest;
  readonly replayCount: Uint32;
  readonly rawObservationRef: string;
  readonly rawObservationDigest: Digest;
  readonly outcome: 'changed' | 'unchanged' | 'inconclusive';
  readonly uncertainty: number;
  readonly executionReceiptRef: string;
}

export interface AblationCompletedData extends JsonObject {
  readonly experimentEventId: string;
  readonly experimentPayloadDigest: Digest;
  readonly ablatedLocusIds: string[];
  readonly ablationRef: string;
  readonly ablationDigest: Digest;
  readonly baselineExecutionRef: string;
  readonly baselineExecutionDigest: Digest;
  readonly ablatedExecutionRef: string;
  readonly ablatedExecutionDigest: Digest;
  readonly rawObservationRef: string;
  readonly rawObservationDigest: Digest;
  readonly outcome: 'degraded' | 'improved' | 'inconclusive' | 'unchanged';
  readonly uncertainty: number;
  readonly executionReceiptRef: string;
}

export interface BehaviorCoverageRecordedData extends JsonObject {
  readonly experimentEventIds: string[];
  readonly evidenceSetDigest: Digest;
  readonly clauseIds: string[];
  readonly authorityConflictCaseIds: string[];
  readonly negativeCapabilityCaseIds: string[];
  readonly sideEffectOracleIds: string[];
  readonly semanticVariantIds: string[];
  readonly rawCoverageRef: string;
  readonly rawCoverageDigest: Digest;
  readonly coverageOutcome: 'covered' | 'insufficient-evidence' | 'partial';
  readonly criticalInvariantOutcome: 'fail' | 'pass' | 'unknown';
  readonly coveragePolicyVersion: Version;
}

export interface EvaluationManifestSealedData extends JsonObject {
  readonly manifestRef: string;
  readonly manifestDigest: Digest;
  readonly manifestVersion: Version;
  readonly rings: EvaluationManifestRingReference[];
  readonly evaluatorCapsuleRef: string;
  readonly evaluatorCapsuleDigest: Digest;
  readonly leakVetoPolicyVersion: Version;
  readonly sealingReceiptRef: string;
}

export interface FixtureExposureRecordedData extends JsonObject {
  readonly manifestEventId: string;
  readonly manifestPayloadDigest: Digest;
  readonly exposureKind: 'activated' | 'retired';
  readonly exposedRingCodes: string[];
  readonly authorizedExposureRef: string;
  readonly authorizedExposureDigest: Digest;
  readonly exposureReceiptRef: string;
  readonly occurredAt: string;
}

export interface TransferTrialRecordedData extends JsonObject {
  readonly sourceExecutorRef: string;
  readonly sourceExecutorFingerprint: Fingerprint;
  readonly targetExecutorRef: string;
  readonly targetExecutorFingerprint: Fingerprint;
  readonly verifierRef: string;
  readonly verifierFingerprint: Fingerprint;
  readonly behaviorFamilyIds: string[];
  readonly scenarioSetRef: string;
  readonly scenarioSetDigest: Digest;
  readonly baselineExecutionRef: string;
  readonly baselineExecutionDigest: Digest;
  readonly candidateExecutionRef: string;
  readonly candidateExecutionDigest: Digest;
  readonly rawObservationRef: string;
  readonly rawObservationDigest: Digest;
  readonly transferOutcome: 'fail' | 'inconclusive' | 'pass';
  readonly uncertainty: number;
  readonly executionReceiptRef: string;
}

export interface BehavioralChangeClassifiedData extends JsonObject {
  readonly changeContractEventId: string;
  readonly changeContractPayloadDigest: Digest;
  readonly normalizedEventId: string;
  readonly normalizedPayloadDigest: Digest;
  readonly verificationEventId: string;
  readonly verificationPayloadDigest: Digest;
  readonly canaryGateEventId: string;
  readonly canaryGatePayloadDigest: Digest;
  readonly classificationPolicyVersion: Version;
  readonly behavioralSemver: 'major' | 'minor' | 'patch';
  readonly affectedBehaviorFamilyIds: string[];
  readonly regressedBehaviorFamilyIds: string[];
  readonly preservedObligationIds: string[];
  readonly classificationEvidenceRef: string;
  readonly classificationEvidenceDigest: Digest;
  readonly classificationReceiptRef: string;
}

// ───────────────────────────────────────────────────────────────────
// 4. EVENT UNION
// ───────────────────────────────────────────────────────────────────

export const AgentImprovementExtensionEventStems = Object.freeze([
  'agent_improvement.definition_snapshot_sealed',
  'agent_improvement.agent_ir_compiled',
  'agent_improvement.change_contract_compiled',
  'agent_improvement.mutation_proposed',
  'agent_improvement.mutation_rejected',
  'agent_improvement.trace_sliced',
  'agent_improvement.behavior_experiment_sealed',
  'agent_improvement.known_defect_injected',
  'agent_improvement.counterfactual_replayed',
  'agent_improvement.ablation_completed',
  'agent_improvement.behavior_coverage_recorded',
  'agent_improvement.evaluation_manifest_sealed',
  'agent_improvement.fixture_exposure_recorded',
  'agent_improvement.transfer_trial_recorded',
  'agent_improvement.behavioral_change_classified',
] as const);

export type AgentImprovementExtensionEventStem =
  typeof AgentImprovementExtensionEventStems[number];

export const AgentImprovementExtensionWireEventTypes = Object.freeze({
  'agent_improvement.definition_snapshot_sealed':
    'agent-improvement.ledger.definition-snapshot-sealed',
  'agent_improvement.agent_ir_compiled':
    'agent-improvement.ledger.agent-ir-compiled',
  'agent_improvement.change_contract_compiled':
    'agent-improvement.ledger.change-contract-compiled',
  'agent_improvement.mutation_proposed':
    'agent-improvement.ledger.mutation-proposed',
  'agent_improvement.mutation_rejected':
    'agent-improvement.ledger.mutation-rejected',
  'agent_improvement.trace_sliced':
    'agent-improvement.ledger.trace-sliced',
  'agent_improvement.behavior_experiment_sealed':
    'agent-improvement.ledger.behavior-experiment-sealed',
  'agent_improvement.known_defect_injected':
    'agent-improvement.ledger.known-defect-injected',
  'agent_improvement.counterfactual_replayed':
    'agent-improvement.ledger.counterfactual-replayed',
  'agent_improvement.ablation_completed':
    'agent-improvement.ledger.ablation-completed',
  'agent_improvement.behavior_coverage_recorded':
    'agent-improvement.ledger.behavior-coverage-recorded',
  'agent_improvement.evaluation_manifest_sealed':
    'agent-improvement.ledger.evaluation-manifest-sealed',
  'agent_improvement.fixture_exposure_recorded':
    'agent-improvement.ledger.fixture-exposure-recorded',
  'agent_improvement.transfer_trial_recorded':
    'agent-improvement.ledger.transfer-trial-recorded',
  'agent_improvement.behavioral_change_classified':
    'agent-improvement.ledger.behavioral-change-classified',
} as const satisfies Readonly<
  Record<AgentImprovementExtensionEventStem, string>
>);

export const AgentImprovementEventStems = Object.freeze([
  ...DeepImprovementCommonEventStems,
  ...AgentImprovementExtensionEventStems,
] as const);

export type AgentImprovementEventStem =
  typeof AgentImprovementEventStems[number];

export const AgentImprovementWireEventTypes = Object.freeze({
  ...DeepImprovementCommonWireEventTypes,
  ...AgentImprovementExtensionWireEventTypes,
} as const satisfies Readonly<Record<AgentImprovementEventStem, string>>);

export type AgentImprovementWireEventType =
  typeof AgentImprovementWireEventTypes[AgentImprovementEventStem];

export interface AgentImprovementExtensionPayloadMap {
  readonly 'agent_improvement.definition_snapshot_sealed':
    DefinitionSnapshotSealedData;
  readonly 'agent_improvement.agent_ir_compiled': AgentIrCompiledData;
  readonly 'agent_improvement.change_contract_compiled':
    ChangeContractCompiledData;
  readonly 'agent_improvement.mutation_proposed': MutationProposedData;
  readonly 'agent_improvement.mutation_rejected': MutationRejectedData;
  readonly 'agent_improvement.trace_sliced': TraceSlicedData;
  readonly 'agent_improvement.behavior_experiment_sealed':
    BehaviorExperimentSealedData;
  readonly 'agent_improvement.known_defect_injected': KnownDefectInjectedData;
  readonly 'agent_improvement.counterfactual_replayed':
    CounterfactualReplayedData;
  readonly 'agent_improvement.ablation_completed': AblationCompletedData;
  readonly 'agent_improvement.behavior_coverage_recorded':
    BehaviorCoverageRecordedData;
  readonly 'agent_improvement.evaluation_manifest_sealed':
    EvaluationManifestSealedData;
  readonly 'agent_improvement.fixture_exposure_recorded':
    FixtureExposureRecordedData;
  readonly 'agent_improvement.transfer_trial_recorded':
    TransferTrialRecordedData;
  readonly 'agent_improvement.behavioral_change_classified':
    BehavioralChangeClassifiedData;
}

export type AgentImprovementPayloadMap =
  DeepImprovementCommonPayloadMap & AgentImprovementExtensionPayloadMap;

export interface AgentImprovementExtensionScopeMap {
  readonly 'agent_improvement.definition_snapshot_sealed':
    AgentImprovementDefinitionScope;
  readonly 'agent_improvement.agent_ir_compiled': AgentImprovementIrScope;
  readonly 'agent_improvement.change_contract_compiled':
    AgentImprovementChangeScope;
  readonly 'agent_improvement.mutation_proposed': AgentImprovementMutationScope;
  readonly 'agent_improvement.mutation_rejected': AgentImprovementMutationScope;
  readonly 'agent_improvement.trace_sliced': AgentImprovementTraceScope;
  readonly 'agent_improvement.behavior_experiment_sealed':
    AgentImprovementExperimentScope;
  readonly 'agent_improvement.known_defect_injected':
    AgentImprovementInterventionScope;
  readonly 'agent_improvement.counterfactual_replayed':
    AgentImprovementInterventionScope;
  readonly 'agent_improvement.ablation_completed':
    AgentImprovementInterventionScope;
  readonly 'agent_improvement.behavior_coverage_recorded':
    AgentImprovementCoverageScope;
  readonly 'agent_improvement.evaluation_manifest_sealed':
    AgentImprovementManifestScope;
  readonly 'agent_improvement.fixture_exposure_recorded':
    AgentImprovementManifestScope;
  readonly 'agent_improvement.transfer_trial_recorded':
    AgentImprovementTransferScope;
  readonly 'agent_improvement.behavioral_change_classified':
    AgentImprovementChangeScope;
}

type NarrowedCommonScope<TStem extends DeepImprovementCommonEventStem> =
  Omit<DeepImprovementCommonScopeMap[TStem], 'variant'> & {
    readonly variant: 'agent-improvement';
  };

export type AgentImprovementScopeMap = {
  readonly [TStem in DeepImprovementCommonEventStem]:
    NarrowedCommonScope<TStem>;
} & AgentImprovementExtensionScopeMap;

export interface AgentImprovementLedgerPayload<
  TStem extends AgentImprovementEventStem,
> extends JsonObject {
  readonly stem: TStem;
  readonly eventVersion: 1;
  readonly scope: AgentImprovementScopeMap[TStem];
  readonly prevEventHash: Digest;
  readonly payloadDigest: Digest;
  readonly replay: AgentImprovementReplayMetadata;
  readonly data: AgentImprovementPayloadMap[TStem];
}

export type AgentImprovementEventEnvelope<
  TStem extends AgentImprovementEventStem = AgentImprovementEventStem,
> = EventEnvelope & {
  readonly event_type: typeof AgentImprovementWireEventTypes[TStem];
  readonly event_version: 1;
  readonly payload: AgentImprovementLedgerPayload<TStem>;
};

export type AgentImprovementLedgerEvent = {
  readonly [TStem in AgentImprovementEventStem]:
    AgentImprovementEventEnvelope<TStem>;
}[AgentImprovementEventStem];

// ───────────────────────────────────────────────────────────────────
// 5. COMPATIBILITY TYPES
// ───────────────────────────────────────────────────────────────────

export type AgentImprovementCompatibilityStatus =
  | 'blocked'
  | 'compatible'
  | 'exact'
  | 'migrate'
  | 'pin-old-runtime';

export interface AgentImprovementCompatibilityDecision {
  readonly status: AgentImprovementCompatibilityStatus;
  readonly reasonCode: string;
  readonly targetStem: AgentImprovementEventStem | null;
  readonly sourceVersion: number | null;
  readonly targetVersion: 1;
}

export interface LegacyUpcastContext {
  readonly scope:
    | AgentImprovementBaseScope
    | AgentImprovementDefinitionScope;
  readonly prevEventHash: Digest;
  readonly replay: AgentImprovementReplayMetadata;
}

export interface LegacyUpcastCandidate {
  readonly status: 'migrated';
  readonly targetStem: AgentImprovementEventStem;
  readonly eventVersion: 1;
  readonly originalRecordDigest: Digest;
  readonly upcasterFingerprint: Fingerprint;
  readonly warnings: readonly string[];
  readonly scope: LegacyUpcastContext['scope'];
  readonly prevEventHash: Digest;
  readonly replay: AgentImprovementReplayMetadata;
  readonly data: JsonObject;
}

export type LegacyUpcastResult =
  | LegacyUpcastCandidate
  | {
    readonly status: 'refused';
    readonly decision: AgentImprovementCompatibilityDecision;
  };
