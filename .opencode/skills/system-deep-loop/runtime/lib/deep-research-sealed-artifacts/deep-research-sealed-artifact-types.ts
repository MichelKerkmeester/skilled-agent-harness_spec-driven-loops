// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Sealed Artifact Types
// ───────────────────────────────────────────────────────────────────

import type {
  SealDescriptor,
  SealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. ARTIFACT KINDS
// ───────────────────────────────────────────────────────────────────

export const DeepResearchArtifactKinds = Object.freeze({
  OBJECTIVE: 'deep-research-objective',
  PLAN_FRONTIER: 'deep-research-plan-frontier',
  SEARCH_RECIPE: 'deep-research-search-recipe',
  CAPABILITY_COMMITMENT: 'deep-research-capability-commitment',
  MODE_CONFIGURATION: 'deep-research-mode-configuration',
  POLICY_INPUT: 'deep-research-policy-input',
  SOURCE_CAPTURE: 'deep-research-source-capture',
  NORMALIZED_PASSAGE: 'deep-research-normalized-passage',
  BRANCH_OBSERVATION: 'deep-research-branch-observation',
  ATOMIC_CLAIM: 'deep-research-atomic-claim',
  EVIDENCE_SPAN: 'deep-research-evidence-span',
  CROSS_VALIDATION: 'deep-research-cross-validation',
  UNRESOLVED_STATE: 'deep-research-unresolved-state',
  CONTRADICTION_OBLIGATION: 'deep-research-contradiction-obligation',
  CONVERGENCE_INPUT: 'deep-research-convergence-input',
  CONVERGENCE_WITNESS: 'deep-research-convergence-witness',
  SYNTHESIS_VIEW: 'deep-research-synthesis-view',
  SYNTHESIS_REPORT: 'deep-research-synthesis-report',
  MEMORY_HANDOFF: 'deep-research-memory-handoff',
} as const);

export type DeepResearchArtifactKind =
  typeof DeepResearchArtifactKinds[keyof typeof DeepResearchArtifactKinds];

export type DeepResearchArtifactLifecycle =
  | 'analyze'
  | 'convergence'
  | 'gather'
  | 'init'
  | 'memory-save'
  | 'synthesize';

export type DeepResearchArtifactMaterialFamily =
  | 'analysis'
  | 'convergence'
  | 'handoff'
  | 'input'
  | 'source'
  | 'synthesis';

export interface DeepResearchArtifactKindRegistration {
  readonly artifactKind: DeepResearchArtifactKind;
  readonly lifecycle: DeepResearchArtifactLifecycle;
  readonly materialFamily: DeepResearchArtifactMaterialFamily;
  readonly canonicalizationVersion: string;
  readonly mediaType: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED MATERIAL SHAPES
// ───────────────────────────────────────────────────────────────────

export interface DeepResearchArtifactLocator {
  readonly scheme: 'artifact' | 'file' | 'url';
  readonly locatorDigest: string;
  readonly selector: string;
  readonly revision: string | null;
}

export interface DeepResearchInputArtifactMaterial {
  readonly artifactId: string;
  readonly materialDigest: string;
  readonly materialRef: string;
  readonly locator: DeepResearchArtifactLocator;
  readonly producerVersion: string;
}

export interface DeepResearchSourceArtifactMaterial {
  readonly sourceVersionId: string;
  readonly sourceIdentityDigest: string;
  readonly responseDigest: string;
  readonly responseRef: string;
  readonly retrievalMetadataDigest: string;
  readonly extractionProfileDigest: string;
  readonly normalizedPassageDigests: readonly string[];
  readonly locator: DeepResearchArtifactLocator;
  readonly captureVersion: string;
}

export type DeepResearchAnalysisStatus =
  | 'abstained'
  | 'admitted'
  | 'confirmed'
  | 'contested'
  | 'contradicted'
  | 'degraded'
  | 'inconclusive'
  | 'observed'
  | 'open'
  | 'quarantined'
  | 'resolved'
  | 'supported'
  | 'unresolved';

export interface DeepResearchAnalysisArtifactMaterial {
  readonly observationId: string;
  readonly observationDigest: string;
  readonly observationRef: string;
  readonly sourceArtifactDigest: string;
  readonly evidenceDigests: readonly string[];
  readonly status: DeepResearchAnalysisStatus;
  readonly locator: DeepResearchArtifactLocator;
  readonly analysisVersion: string;
}

export type DeepResearchConvergenceDecision =
  | 'blocked'
  | 'continue'
  | 'converged'
  | 'incomplete'
  | 'pending'
  | 'recover';

export interface DeepResearchConvergenceArtifactMaterial {
  readonly witnessId: string;
  readonly snapshotDigest: string;
  readonly snapshotRef: string;
  readonly orderedInputDigests: readonly string[];
  readonly evaluatorVersion: string;
  readonly decision: DeepResearchConvergenceDecision;
  readonly locator: DeepResearchArtifactLocator;
}

export interface DeepResearchSynthesisArtifactMaterial {
  readonly outputId: string;
  readonly outputDigest: string;
  readonly outputRef: string;
  readonly orderedInputDigests: readonly string[];
  readonly reducerVersion: string;
  readonly projectionVersion: string;
  readonly outputRole: 'claim-evidence-view' | 'report';
  readonly locator: DeepResearchArtifactLocator;
}

export interface DeepResearchMemoryHandoffArtifactMaterial {
  readonly handoffId: string;
  readonly finalReferenceSetDigest: string;
  readonly continuityPayloadDigest: string;
  readonly offeredViewDigest: string;
  readonly offeredViewRef: string;
  readonly targetPacket: string;
  readonly locator: DeepResearchArtifactLocator;
  readonly handoffVersion: string;
}

export interface DeepResearchArtifactMaterialByKind {
  readonly 'deep-research-objective': DeepResearchInputArtifactMaterial;
  readonly 'deep-research-plan-frontier': DeepResearchInputArtifactMaterial;
  readonly 'deep-research-search-recipe': DeepResearchInputArtifactMaterial;
  readonly 'deep-research-capability-commitment': DeepResearchInputArtifactMaterial;
  readonly 'deep-research-mode-configuration': DeepResearchInputArtifactMaterial;
  readonly 'deep-research-policy-input': DeepResearchInputArtifactMaterial;
  readonly 'deep-research-source-capture': DeepResearchSourceArtifactMaterial;
  readonly 'deep-research-normalized-passage': DeepResearchSourceArtifactMaterial;
  readonly 'deep-research-branch-observation': DeepResearchAnalysisArtifactMaterial;
  readonly 'deep-research-atomic-claim': DeepResearchAnalysisArtifactMaterial;
  readonly 'deep-research-evidence-span': DeepResearchAnalysisArtifactMaterial;
  readonly 'deep-research-cross-validation': DeepResearchAnalysisArtifactMaterial;
  readonly 'deep-research-unresolved-state': DeepResearchAnalysisArtifactMaterial;
  readonly 'deep-research-contradiction-obligation': DeepResearchAnalysisArtifactMaterial;
  readonly 'deep-research-convergence-input': DeepResearchConvergenceArtifactMaterial;
  readonly 'deep-research-convergence-witness': DeepResearchConvergenceArtifactMaterial;
  readonly 'deep-research-synthesis-view': DeepResearchSynthesisArtifactMaterial;
  readonly 'deep-research-synthesis-report': DeepResearchSynthesisArtifactMaterial;
  readonly 'deep-research-memory-handoff': DeepResearchMemoryHandoffArtifactMaterial;
}

export type DeepResearchArtifactMaterial =
  DeepResearchArtifactMaterialByKind[DeepResearchArtifactKind];

// ───────────────────────────────────────────────────────────────────
// 3. SEALED BINDINGS
// ───────────────────────────────────────────────────────────────────

export type DeepResearchArtifactEventReference = string;

export interface DeepResearchSealedArtifactBinding<
  TKind extends DeepResearchArtifactKind = DeepResearchArtifactKind,
> {
  readonly bindingVersion: 1;
  readonly artifactKind: TKind;
  readonly eventReference: DeepResearchArtifactEventReference;
  readonly reference: SealedArtifactReference;
}

export interface DeepResearchVerifiedSealedArtifact<
  TKind extends DeepResearchArtifactKind = DeepResearchArtifactKind,
> {
  readonly binding: DeepResearchSealedArtifactBinding<TKind>;
  readonly descriptor: SealDescriptor;
  readonly bytes: readonly number[];
}
