// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Sealed Artifact Types
// ───────────────────────────────────────────────────────────────────

import type {
  ArtifactCommittedData,
  DeepAiCouncilArtifactScope,
  DeepAiCouncilEventStem,
  ProposalObservedData,
} from '../deep-ai-council-ledger-schema/index.js';
import type {
  SealDescriptor,
  SealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';

export const DeepAiCouncilArtifactKinds = Object.freeze({
  TARGET_SNAPSHOT: 'deep-ai-council-target-snapshot',
  TASK_CLASS: 'deep-ai-council-task-class',
  COUNCIL_STRATEGY: 'deep-ai-council-council-strategy',
  PROTOCOL_POLICY: 'deep-ai-council-protocol-policy',
  PROMPT_CAPABILITY: 'deep-ai-council-prompt-capability',
  SEAT_ROSTER: 'deep-ai-council-seat-roster',
  REASONING_METHOD: 'deep-ai-council-reasoning-method',
  BUDGET_POLICY: 'deep-ai-council-budget-policy',
  CONVERGENCE_POLICY: 'deep-ai-council-convergence-policy',
  CONTRACT_REVISION: 'deep-ai-council-contract-revision',
  CONTROL_ARM: 'deep-ai-council-control-arm',
  TEST_FIXTURE: 'deep-ai-council-test-fixture',
  SEAT_PROPOSAL: 'deep-ai-council-seat-proposal',
  CRITIQUE_RECORD: 'deep-ai-council-critique-record',
  BLINDED_CANDIDATE: 'deep-ai-council-blinded-candidate',
  PAIRWISE_JUDGMENT: 'deep-ai-council-pairwise-judgment',
  BIAS_PROBE: 'deep-ai-council-bias-probe',
  COUNTERFACTUAL_PROBE: 'deep-ai-council-counterfactual-probe',
  STANCE_EVIDENCE: 'deep-ai-council-stance-evidence',
  CONVERGENCE_EVIDENCE: 'deep-ai-council-convergence-evidence',
  SYNTHESIS: 'deep-ai-council-synthesis',
  MINORITY_RECORD: 'deep-ai-council-minority-record',
  UNRESOLVED_VALUE: 'deep-ai-council-unresolved-value',
  COUNCIL_ARTIFACT: 'deep-ai-council-council-artifact',
  TEST_GATE_EVIDENCE: 'deep-ai-council-test-gate-evidence',
} as const);

export type DeepAiCouncilArtifactKind =
  typeof DeepAiCouncilArtifactKinds[keyof typeof DeepAiCouncilArtifactKinds];

export type DeepAiCouncilArtifactLifecycle =
  | 'init'
  | 'deliberate'
  | 'critique'
  | 'judge'
  | 'converge'
  | 'synthesize'
  | 'artifact'
  | 'test-gate';

export type DeepAiCouncilArtifactMaterialFamily = 'input' | 'output';

export interface DeepAiCouncilArtifactKindRegistration {
  readonly artifactKind: DeepAiCouncilArtifactKind;
  readonly lifecycle: DeepAiCouncilArtifactLifecycle;
  readonly materialFamily: DeepAiCouncilArtifactMaterialFamily;
  readonly canonicalizationVersion: string;
  readonly mediaType: string;
}

export type DeepAiCouncilArtifactVisibility =
  | 'public'
  | 'private-seat'
  | 'blinded'
  | 'judge'
  | 'test-gate';

export interface DeepAiCouncilArtifactLocator {
  readonly scheme: 'artifact' | 'file' | 'url';
  readonly locatorDigest: ArtifactCommittedData['contentDigest'];
  readonly selector: string;
  readonly revision: string | null;
}

export interface DeepAiCouncilArtifactSourceEventRange {
  readonly firstEventId: string;
  readonly lastEventId: string;
  readonly firstStem: DeepAiCouncilEventStem;
  readonly lastStem: DeepAiCouncilEventStem;
}

export interface DeepAiCouncilArtifactScopeDescriptor extends DeepAiCouncilArtifactScope {
  readonly runId: string;
  readonly roundId: string;
  readonly artifactId: string;
}

export interface DeepAiCouncilArtifactMaterialBase {
  readonly artifactId: string;
  readonly materialDigest: ProposalObservedData['artifactDigest'];
  readonly materialRef: ProposalObservedData['artifactRef'];
  readonly scope: DeepAiCouncilArtifactScopeDescriptor;
  readonly sourceEventRange: DeepAiCouncilArtifactSourceEventRange;
  readonly schemaVersion: string;
  readonly policyVersion: string;
  readonly replayFingerprint: string;
  readonly authorityEpoch: number;
  readonly dependencyDigests: readonly string[];
  readonly visibility: DeepAiCouncilArtifactVisibility;
  readonly supersedesArtifactDigest: string | null;
  readonly locator: DeepAiCouncilArtifactLocator;
  readonly producerVersion: string;
}

export type DeepAiCouncilInputArtifactMaterial = DeepAiCouncilArtifactMaterialBase;
export type DeepAiCouncilOutputArtifactMaterial = DeepAiCouncilArtifactMaterialBase;
export type DeepAiCouncilProposalArtifactMaterial = DeepAiCouncilArtifactMaterialBase;
export type DeepAiCouncilCritiqueArtifactMaterial = DeepAiCouncilArtifactMaterialBase;
export type DeepAiCouncilJudgmentArtifactMaterial = DeepAiCouncilArtifactMaterialBase;
export type DeepAiCouncilConvergenceArtifactMaterial = DeepAiCouncilArtifactMaterialBase;
export type DeepAiCouncilSynthesisArtifactMaterial = DeepAiCouncilArtifactMaterialBase;
export type DeepAiCouncilGateArtifactMaterial = DeepAiCouncilArtifactMaterialBase;

export interface DeepAiCouncilArtifactMaterialByKind {
  readonly 'deep-ai-council-target-snapshot': DeepAiCouncilInputArtifactMaterial;
  readonly 'deep-ai-council-task-class': DeepAiCouncilInputArtifactMaterial;
  readonly 'deep-ai-council-council-strategy': DeepAiCouncilInputArtifactMaterial;
  readonly 'deep-ai-council-protocol-policy': DeepAiCouncilInputArtifactMaterial;
  readonly 'deep-ai-council-prompt-capability': DeepAiCouncilInputArtifactMaterial;
  readonly 'deep-ai-council-seat-roster': DeepAiCouncilInputArtifactMaterial;
  readonly 'deep-ai-council-reasoning-method': DeepAiCouncilInputArtifactMaterial;
  readonly 'deep-ai-council-budget-policy': DeepAiCouncilInputArtifactMaterial;
  readonly 'deep-ai-council-convergence-policy': DeepAiCouncilInputArtifactMaterial;
  readonly 'deep-ai-council-contract-revision': DeepAiCouncilInputArtifactMaterial;
  readonly 'deep-ai-council-control-arm': DeepAiCouncilInputArtifactMaterial;
  readonly 'deep-ai-council-test-fixture': DeepAiCouncilInputArtifactMaterial;
  readonly 'deep-ai-council-seat-proposal': DeepAiCouncilProposalArtifactMaterial;
  readonly 'deep-ai-council-critique-record': DeepAiCouncilCritiqueArtifactMaterial;
  readonly 'deep-ai-council-blinded-candidate': DeepAiCouncilOutputArtifactMaterial;
  readonly 'deep-ai-council-pairwise-judgment': DeepAiCouncilJudgmentArtifactMaterial;
  readonly 'deep-ai-council-bias-probe': DeepAiCouncilJudgmentArtifactMaterial;
  readonly 'deep-ai-council-counterfactual-probe': DeepAiCouncilJudgmentArtifactMaterial;
  readonly 'deep-ai-council-stance-evidence': DeepAiCouncilOutputArtifactMaterial;
  readonly 'deep-ai-council-convergence-evidence': DeepAiCouncilConvergenceArtifactMaterial;
  readonly 'deep-ai-council-synthesis': DeepAiCouncilSynthesisArtifactMaterial;
  readonly 'deep-ai-council-minority-record': DeepAiCouncilOutputArtifactMaterial;
  readonly 'deep-ai-council-unresolved-value': DeepAiCouncilOutputArtifactMaterial;
  readonly 'deep-ai-council-council-artifact': DeepAiCouncilOutputArtifactMaterial;
  readonly 'deep-ai-council-test-gate-evidence': DeepAiCouncilGateArtifactMaterial;
}

export type DeepAiCouncilArtifactMaterial =
  DeepAiCouncilArtifactMaterialByKind[DeepAiCouncilArtifactKind];

export type DeepAiCouncilArtifactEventReference = string;

export interface DeepAiCouncilSealedArtifactBinding<
  TKind extends DeepAiCouncilArtifactKind = DeepAiCouncilArtifactKind,
> {
  readonly bindingVersion: 1;
  readonly artifactKind: TKind;
  readonly eventReference: DeepAiCouncilArtifactEventReference;
  readonly reference: SealedArtifactReference;
}

export interface DeepAiCouncilVerifiedSealedArtifact<
  TKind extends DeepAiCouncilArtifactKind = DeepAiCouncilArtifactKind,
> {
  readonly binding: DeepAiCouncilSealedArtifactBinding<TKind>;
  readonly descriptor: SealDescriptor;
  readonly bytes: readonly number[];
}

export interface DeepAiCouncilArtifactReadExpectations {
  readonly expectedAuthorityEpoch?: number;
  readonly expectedReplayFingerprint?: string;
  readonly expectedScope?: DeepAiCouncilArtifactScopeDescriptor;
  readonly allowedVisibility?: readonly DeepAiCouncilArtifactVisibility[];
  readonly requiredDependencyReferences?: readonly SealedArtifactReference[];
}
