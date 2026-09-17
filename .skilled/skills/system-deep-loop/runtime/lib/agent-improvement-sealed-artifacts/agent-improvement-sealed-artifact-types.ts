// MODULE: Agent Improvement Sealed Artifact Types

import type {
  DeepImprovementArtifactAccessRole,
  DeepImprovementArtifactConsumer,
  DeepImprovementArtifactReadPolicy,
  DeepImprovementCandidateFacingView,
  DeepImprovementCommonArtifactKind,
  DeepImprovementCommonSealedArtifactBinding,
  DeepImprovementVerifiedSealedArtifact,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import type {
  InitialArtifactKind,
  SealDescriptor,
  SealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import type {
  AgentImprovementEventStem,
  AgentIrComponentReference,
  AgentIrInheritanceEdgeReference,
  AgentIrLocusReference,
  EvaluationManifestRingReference,
} from '../agent-improvement-ledger-schema/index.js';

const CANONICAL_ARTIFACT_KINDS = {
  BASE_AGENT_BUNDLE: 'agent-improvement-base-agent-bundle',
  CHANGE_CONTRACT_BUNDLE: 'agent-improvement-change-contract-bundle',
  IMPROVER_LANE_REFERENCE: 'agent-improvement-improver-lane-reference',
  CAUSAL_ANALYSIS_INPUT: 'agent-improvement-causal-analysis-input',
  CANDIDATE_PROPOSAL: 'agent-improvement-candidate-proposal',
  TRIAL_TRAJECTORY: 'agent-improvement-trial-trajectory',
  BEHAVIOR_COVERAGE: 'agent-improvement-behavior-coverage',
  FOUR_RING_EXPOSURE: 'agent-improvement-four-ring-exposure',
} as const;

type ArtifactKindAliases = {
  readonly AGENT_IR: typeof CANONICAL_ARTIFACT_KINDS.BASE_AGENT_BUNDLE;
  readonly AGENT_IR_BUNDLE: typeof CANONICAL_ARTIFACT_KINDS.BASE_AGENT_BUNDLE;
  readonly BASE_AGENT_IR: typeof CANONICAL_ARTIFACT_KINDS.BASE_AGENT_BUNDLE;
  readonly CHANGE_CONTRACT: typeof CANONICAL_ARTIFACT_KINDS.CHANGE_CONTRACT_BUNDLE;
  readonly IMPROVER_LANE: typeof CANONICAL_ARTIFACT_KINDS.IMPROVER_LANE_REFERENCE;
  readonly CAUSAL_ANALYSIS: typeof CANONICAL_ARTIFACT_KINDS.CAUSAL_ANALYSIS_INPUT;
  readonly FAILURE_CAUSAL_ANALYSIS: typeof CANONICAL_ARTIFACT_KINDS.CAUSAL_ANALYSIS_INPUT;
  readonly AGENT_TRIAL: typeof CANONICAL_ARTIFACT_KINDS.TRIAL_TRAJECTORY;
  readonly AGENT_TRIAL_TRAJECTORY: typeof CANONICAL_ARTIFACT_KINDS.TRIAL_TRAJECTORY;
  readonly BEHAVIOR_FAMILY_COVERAGE: typeof CANONICAL_ARTIFACT_KINDS.BEHAVIOR_COVERAGE;
  readonly EXPOSURE_MANIFEST: typeof CANONICAL_ARTIFACT_KINDS.FOUR_RING_EXPOSURE;
  readonly FOUR_RING_EXPOSURE_MANIFEST: typeof CANONICAL_ARTIFACT_KINDS.FOUR_RING_EXPOSURE;
};

export const AgentImprovementArtifactKinds = Object.freeze(
  Object.defineProperties(CANONICAL_ARTIFACT_KINDS, {
    AGENT_IR: { value: CANONICAL_ARTIFACT_KINDS.BASE_AGENT_BUNDLE },
    AGENT_IR_BUNDLE: { value: CANONICAL_ARTIFACT_KINDS.BASE_AGENT_BUNDLE },
    BASE_AGENT_IR: { value: CANONICAL_ARTIFACT_KINDS.BASE_AGENT_BUNDLE },
    CHANGE_CONTRACT: { value: CANONICAL_ARTIFACT_KINDS.CHANGE_CONTRACT_BUNDLE },
    IMPROVER_LANE: { value: CANONICAL_ARTIFACT_KINDS.IMPROVER_LANE_REFERENCE },
    CAUSAL_ANALYSIS: { value: CANONICAL_ARTIFACT_KINDS.CAUSAL_ANALYSIS_INPUT },
    FAILURE_CAUSAL_ANALYSIS: { value: CANONICAL_ARTIFACT_KINDS.CAUSAL_ANALYSIS_INPUT },
    AGENT_TRIAL: { value: CANONICAL_ARTIFACT_KINDS.TRIAL_TRAJECTORY },
    AGENT_TRIAL_TRAJECTORY: { value: CANONICAL_ARTIFACT_KINDS.TRIAL_TRAJECTORY },
    BEHAVIOR_FAMILY_COVERAGE: { value: CANONICAL_ARTIFACT_KINDS.BEHAVIOR_COVERAGE },
    EXPOSURE_MANIFEST: { value: CANONICAL_ARTIFACT_KINDS.FOUR_RING_EXPOSURE },
    FOUR_RING_EXPOSURE_MANIFEST: { value: CANONICAL_ARTIFACT_KINDS.FOUR_RING_EXPOSURE },
  }),
) as typeof CANONICAL_ARTIFACT_KINDS & ArtifactKindAliases;

export type AgentImprovementArtifactKind =
  typeof AgentImprovementArtifactKinds[keyof typeof AgentImprovementArtifactKinds];

export type AgentImprovementArtifactLifecycle =
  | 'coverage'
  | 'exposure'
  | 'input'
  | 'proposal'
  | 'trial';

export type AgentImprovementArtifactMaterialFamily =
  | 'agent-ir'
  | 'causal'
  | 'change'
  | 'coverage'
  | 'exposure'
  | 'improver'
  | 'proposal'
  | 'trial';

export interface AgentImprovementArtifactKindRegistration {
  readonly artifactKind: AgentImprovementArtifactKind;
  readonly lifecycle: AgentImprovementArtifactLifecycle;
  readonly materialFamily: AgentImprovementArtifactMaterialFamily;
  readonly canonicalizationVersion: string;
  readonly mediaType: string;
}

export interface AgentImprovementArtifactLocator {
  readonly scheme: 'artifact' | 'file' | 'ledger' | 'url';
  readonly locatorDigest: string;
  readonly selector: string;
  readonly revision: string | null;
}

export type AgentImprovementDependencyKind =
  | AgentImprovementArtifactKind
  | DeepImprovementCommonArtifactKind
  | InitialArtifactKind;

export interface AgentImprovementArtifactDependency {
  readonly artifactKind: AgentImprovementDependencyKind;
  readonly purpose: string;
  readonly reference: SealedArtifactReference;
}

export interface AgentImprovementArtifactEventBinding {
  readonly eventStem: AgentImprovementEventStem;
  readonly eventId: string;
  readonly payloadDigest: string;
}

export interface AgentImprovementArtifactMaterialBase {
  readonly schemaVersion: string;
  readonly artifactId: string;
  readonly dependencyReferences: readonly AgentImprovementArtifactDependency[];
  readonly originEvent: AgentImprovementArtifactEventBinding;
  readonly producerVersion: string;
  readonly locator: AgentImprovementArtifactLocator;
}

export interface AgentImprovementAgentIrBundleMaterial
  extends AgentImprovementArtifactMaterialBase {
  readonly agentDefinitionRef: string;
  readonly agentDefinitionDigest: string;
  readonly agentIrRef: string;
  readonly agentIrDigest: string;
  readonly agentIrSchemaVersion: string;
  readonly components: readonly AgentIrComponentReference[];
  readonly inheritanceEdges: readonly AgentIrInheritanceEdgeReference[];
  readonly loci: readonly AgentIrLocusReference[];
  readonly capabilityPolicyDigest: string;
  readonly authorityPolicyDigest: string;
  readonly toolConfigurationDigest: string;
  readonly routingConfigurationDigest: string;
  readonly memoryConfigurationDigest: string;
  readonly inferenceConfigurationDigest: string;
  readonly executorConfigurationDigest: string;
  readonly parentAgentReference: SealedArtifactReference | null;
}

export interface AgentImprovementChangeContractBundleMaterial
  extends AgentImprovementArtifactMaterialBase {
  readonly agentIrReference: SealedArtifactReference;
  readonly baseDefinitionRef: string;
  readonly baseDefinitionDigest: string;
  readonly candidateDefinitionRef: string;
  readonly candidateDefinitionDigest: string;
  readonly changeContractRef: string;
  readonly changeContractDigest: string;
  readonly patchRef: string;
  readonly patchDigest: string;
  readonly changedComponentIds: readonly string[];
  readonly changedClauseIds: readonly string[];
  readonly inheritedClauseIds: readonly string[];
  readonly intendedBehaviorDigest: string;
  readonly preservedBehaviorDigest: string;
  readonly staticAssertionsDigest: string;
  readonly tracePolicyDigest: string;
  readonly scenarioSetDigest: string;
  readonly behavioralSemverIntent: 'major' | 'minor' | 'patch';
  readonly operatorReference: string;
  readonly parentLineageReference: SealedArtifactReference | null;
}

export interface AgentImprovementImproverLaneReferenceMaterial
  extends AgentImprovementArtifactMaterialBase {
  readonly experimentLineageId: string;
  readonly improverModelRef: string;
  readonly improverModelDigest: string;
  readonly improverBuildRef: string;
  readonly improverBuildDigest: string;
  readonly promptPolicyDigest: string;
  readonly trainingCorpusDigest: string;
  readonly developmentCorpusDigest: string;
  readonly sealedFailureCorpusDigest: string;
  readonly optimizerVersion: string;
  readonly mutationOperatorReference: string;
  readonly mutationOperatorVersion: string;
  readonly visibilityPolicy: AgentImprovementVisibilityPolicy;
  readonly queryBudget: AgentImprovementQueryBudget;
  readonly parentCandidateReference: SealedArtifactReference | null;
}

export interface AgentImprovementVisibilityPolicy {
  readonly candidateVisibleEvidence: 'commitment-only' | 'bounded-diagnostic';
  readonly hiddenFixtures: 'withheld';
  readonly exactTerminalScores: 'withheld';
  readonly evaluatorInternals: 'withheld';
  readonly terminalEvidence: 'withheld';
}

export interface AgentImprovementQueryBudget {
  readonly maxQueries: number;
  readonly maxBytes: number;
  readonly maxWallClockMs: number;
  readonly maxCostMicros: number;
}

export interface AgentImprovementCausalAnalysisInputMaterial
  extends AgentImprovementArtifactMaterialBase {
  readonly failureClusterReference: SealedArtifactReference;
  readonly failureClusterDigest: string;
  readonly firstDivergentTraceReference: SealedArtifactReference;
  readonly firstDivergentTraceDigest: string;
  readonly knownDefectLocusId: string;
  readonly knownDefectLocusDigest: string;
  readonly counterfactualInterventionReference: SealedArtifactReference;
  readonly counterfactualInterventionDigest: string;
  readonly proposalVisibleEvidenceReference: SealedArtifactReference;
  readonly proposalVisibleEvidenceDigest: string;
  readonly parentCandidateReference: SealedArtifactReference | null;
  readonly evidenceExposurePolicy: 'bounded-diagnostic' | 'commitment-only';
}

export interface AgentImprovementCandidateProposalMaterial
  extends AgentImprovementArtifactMaterialBase {
  readonly candidateId: string;
  readonly candidatePackageRef: string;
  readonly candidatePackageDigest: string;
  readonly candidateAgentIrRef: string;
  readonly candidateAgentIrDigest: string;
  readonly parentAgentReference: SealedArtifactReference;
  readonly changeContractReference: SealedArtifactReference;
  readonly improverLaneReference: SealedArtifactReference;
  readonly causalAnalysisReference: SealedArtifactReference;
  readonly atomicPatchLineageReference: SealedArtifactReference;
  readonly atomicPatchLineageDigest: string;
  readonly proposalRationaleReference: SealedArtifactReference;
  readonly proposalRationaleDigest: string;
  readonly mutationOperatorReference: string;
  readonly mutationOperatorVersion: string;
  readonly parentCandidateReference: SealedArtifactReference | null;
}

export interface AgentImprovementTrialTrajectoryMaterial
  extends AgentImprovementArtifactMaterialBase {
  readonly trialId: string;
  readonly candidateProposalReference: SealedArtifactReference;
  readonly baselineAgentReference: SealedArtifactReference;
  readonly evaluatorCapsuleReference: SealedArtifactReference;
  readonly commonRawTrialReference: SealedArtifactReference;
  readonly evaluationEpochId: string;
  readonly taskManifestReference: SealedArtifactReference;
  readonly taskManifestDigest: string;
  readonly behaviorFamilyId: string;
  readonly semanticVariantReference: SealedArtifactReference;
  readonly semanticVariantDigest: string;
  readonly authorityConflictReference: SealedArtifactReference;
  readonly authorityConflictDigest: string;
  readonly negativeCapabilityReference: SealedArtifactReference;
  readonly negativeCapabilityDigest: string;
  readonly seed: number;
  readonly executorReference: SealedArtifactReference;
  readonly executorFingerprint: string;
  readonly environmentReference: SealedArtifactReference;
  readonly environmentDigest: string;
  readonly normalizedTraceReference: SealedArtifactReference;
  readonly normalizedTraceDigest: string;
  readonly sideEffectObservationReference: SealedArtifactReference;
  readonly sideEffectObservationDigest: string;
  readonly receiptPredicateReference: SealedArtifactReference;
  readonly receiptPredicateDigest: string;
  readonly caseOutcomeVectorDigest: string;
  readonly integrityObservationReference: SealedArtifactReference;
  readonly integrityObservationDigest: string;
  readonly normalizationVersion: string;
}

export interface AgentImprovementBehaviorCoverageMaterial
  extends AgentImprovementArtifactMaterialBase {
  readonly coverageId: string;
  readonly evaluationEpochId: string;
  readonly exposureEpochId: string;
  readonly clauseDigests: readonly string[];
  readonly behaviorFamilyIds: readonly string[];
  readonly authorityConflictCaseDigests: readonly string[];
  readonly transitionCaseDigests: readonly string[];
  readonly sideEffectOracleDigests: readonly string[];
  readonly negativeCapabilityCaseDigests: readonly string[];
  readonly perturbationDigests: readonly string[];
  readonly untouchedFamilySentinelDigests: readonly string[];
  readonly semanticVariantDigests: readonly string[];
  readonly executorDigests: readonly string[];
  readonly rotatingCanaryReference: SealedArtifactReference;
  readonly coverageManifestDigest: string;
  readonly coverageOutcome: 'covered' | 'insufficient-evidence' | 'partial';
  readonly criticalInvariantOutcome: 'fail' | 'pass' | 'unknown';
}

export type AgentImprovementExposureRing =
  | 'rotating-canary'
  | 'sealed-semantic-variant'
  | 'untouched-family-sentinel'
  | 'visible-optimizer';

export interface AgentImprovementExposureRingReference {
  readonly ring: AgentImprovementExposureRing;
  readonly fixtureSetReference: SealedArtifactReference;
  readonly fixtureSetDigest: string;
  readonly fixtureCount: number;
  readonly exposureEpochId: string;
  readonly lifecycle: 'activated' | 'retired';
  readonly retirementReason: string | null;
}

export interface AgentImprovementFourRingExposureMaterial
  extends AgentImprovementArtifactMaterialBase {
  readonly manifestId: string;
  readonly evaluationEpochId: string;
  readonly exposureEpochId: string;
  readonly rings: readonly AgentImprovementExposureRingReference[];
  readonly evaluatorCapsuleReference: SealedArtifactReference;
  readonly canaryEpochReference: SealedArtifactReference;
  readonly hiddenAnchorCommitmentDigest: string;
  readonly leakVetoPolicyVersion: string;
}

export interface AgentImprovementArtifactMaterialByKind {
  readonly 'agent-improvement-base-agent-bundle': AgentImprovementAgentIrBundleMaterial;
  readonly 'agent-improvement-change-contract-bundle': AgentImprovementChangeContractBundleMaterial;
  readonly 'agent-improvement-improver-lane-reference': AgentImprovementImproverLaneReferenceMaterial;
  readonly 'agent-improvement-causal-analysis-input': AgentImprovementCausalAnalysisInputMaterial;
  readonly 'agent-improvement-candidate-proposal': AgentImprovementCandidateProposalMaterial;
  readonly 'agent-improvement-trial-trajectory': AgentImprovementTrialTrajectoryMaterial;
  readonly 'agent-improvement-behavior-coverage': AgentImprovementBehaviorCoverageMaterial;
  readonly 'agent-improvement-four-ring-exposure': AgentImprovementFourRingExposureMaterial;
}

export type AgentImprovementArtifactMaterial =
  AgentImprovementArtifactMaterialByKind[AgentImprovementArtifactKind];

export type AgentImprovementArtifactEventReference = string;

export interface AgentImprovementSealedArtifactBinding<
  TKind extends AgentImprovementArtifactKind = AgentImprovementArtifactKind,
> {
  readonly bindingVersion: 1;
  readonly artifactKind: TKind;
  readonly eventReference: AgentImprovementArtifactEventReference;
  readonly reference: SealedArtifactReference;
}

export interface AgentImprovementVerifiedSealedArtifact<
  TKind extends AgentImprovementArtifactKind = AgentImprovementArtifactKind,
> {
  readonly binding: AgentImprovementSealedArtifactBinding<TKind>;
  readonly descriptor: SealDescriptor;
  readonly bytes: readonly number[];
}

export interface AgentImprovementCommonServiceBindings {
  readonly evaluatorCapsule: DeepImprovementCommonSealedArtifactBinding;
  readonly canaryEpoch: DeepImprovementCommonSealedArtifactBinding;
  readonly candidateView: DeepImprovementCandidateFacingView;
  readonly promotionEvidence: DeepImprovementCommonSealedArtifactBinding;
}

export interface AgentImprovementSuccessorReferenceBundle {
  readonly candidateProposalReference: SealedArtifactReference;
  readonly baseAgentReference: SealedArtifactReference;
  readonly changeContractReference: SealedArtifactReference;
  readonly behaviorCoverageReference: SealedArtifactReference;
  readonly evaluatorCapsuleReference: SealedArtifactReference;
  readonly executorEnvironmentDigest: string;
  readonly canaryEpochReference: SealedArtifactReference;
  readonly transferTrialReference: SealedArtifactReference;
  readonly rollbackParentReference: SealedArtifactReference | null;
}

export interface AgentImprovementArtifactReadPolicy
  extends Pick<DeepImprovementArtifactReadPolicy, 'consumer' | 'accessRole' | 'now'> {
  readonly requiredEvaluationEpochId?: string;
  readonly requiredExposureEpochId?: string;
  readonly requiredExecutorFingerprint?: string;
}

export type AgentImprovementCommonArtifactConsumer = DeepImprovementArtifactConsumer;
export type AgentImprovementCommonArtifactAccessRole = DeepImprovementArtifactAccessRole;
export type AgentImprovementCommonVerifiedArtifact = DeepImprovementVerifiedSealedArtifact;
export type AgentImprovementLedgerRingReference = EvaluationManifestRingReference;

export type AgentImprovementBaseAgentBundleMaterial = AgentImprovementAgentIrBundleMaterial;
export type AgentImprovementChangeContractMaterial = AgentImprovementChangeContractBundleMaterial;
export type AgentImprovementImproverLaneMaterial = AgentImprovementImproverLaneReferenceMaterial;
export type AgentImprovementCausalAnalysisMaterial = AgentImprovementCausalAnalysisInputMaterial;
export type AgentImprovementTrialMaterial = AgentImprovementTrialTrajectoryMaterial;
export type AgentImprovementExposureManifestMaterial = AgentImprovementFourRingExposureMaterial;
export type AgentImprovementBaseAgentArtifactMaterial = AgentImprovementAgentIrBundleMaterial;
export type AgentImprovementChangeContractArtifactMaterial = AgentImprovementChangeContractBundleMaterial;
export type AgentImprovementImproverLaneArtifactMaterial = AgentImprovementImproverLaneReferenceMaterial;
export type AgentImprovementCausalEvidenceArtifactMaterial = AgentImprovementCausalAnalysisInputMaterial;
export type AgentImprovementCandidateProposalArtifactMaterial = AgentImprovementCandidateProposalMaterial;
export type AgentImprovementTrialTrajectoryArtifactMaterial = AgentImprovementTrialTrajectoryMaterial;
export type AgentImprovementBehaviorFamilyCoverageArtifactMaterial = AgentImprovementBehaviorCoverageMaterial;
export type AgentImprovementFourRingExposureArtifactMaterial = AgentImprovementFourRingExposureMaterial;
