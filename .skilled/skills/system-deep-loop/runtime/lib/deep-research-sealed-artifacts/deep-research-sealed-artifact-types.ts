// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Sealed Artifact Types
// ───────────────────────────────────────────────────────────────────

import type {
  ArtifactReferenceSet,
  SealDescriptor,
  SealedArtifactReference,
  VerifiedArtifactEvidence,
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

/**
 * Registry entry for one Deep Research artifact kind: its lifecycle, material family, canonicalization version and
 * media type.
 */
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

/** Where an artifact's material came from, as a scheme, a locator digest, a selector and an optional revision. */
export interface DeepResearchArtifactLocator {
  readonly scheme: 'artifact' | 'file' | 'url';
  readonly locatorDigest: string;
  readonly selector: string;
  readonly revision: string | null;
}

/** Material for an input artifact: its id, material digest and reference, locator and producer version. */
export interface DeepResearchInputArtifactMaterial {
  readonly artifactId: string;
  readonly materialDigest: string;
  readonly materialRef: string;
  readonly locator: DeepResearchArtifactLocator;
  readonly producerVersion: string;
}

/**
 * Material for a captured source: response and retrieval digests, the extraction profile and the normalized passage
 * digests.
 */
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

/**
 * Material for an analysis observation, linking it to the source artifact digest and the evidence digests it rests on.
 */
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

/**
 * Material for a convergence witness: the snapshot digest, ordered input digests, evaluator version and the decision
 * reached.
 */
export interface DeepResearchConvergenceArtifactMaterial {
  readonly witnessId: string;
  readonly snapshotDigest: string;
  readonly snapshotRef: string;
  readonly orderedInputDigests: readonly string[];
  readonly evaluatorVersion: string;
  readonly decision: DeepResearchConvergenceDecision;
  readonly locator: DeepResearchArtifactLocator;
}

/**
 * Material for a synthesis output, either the claim-evidence view or the report, with the ordered inputs and reducer
 * and projection versions.
 */
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

/**
 * Material for a memory handoff: the final reference set digest, continuity payload digest, offered view and target
 * packet.
 */
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

/** Maps each Deep Research artifact kind to the material shape it must carry. */
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

/** Binds a sealed artifact reference of a Deep Research kind to the event reference that produced it. */
export interface DeepResearchSealedArtifactBinding<
  TKind extends DeepResearchArtifactKind = DeepResearchArtifactKind,
> {
  readonly bindingVersion: 1;
  readonly artifactKind: TKind;
  readonly eventReference: DeepResearchArtifactEventReference;
  readonly reference: SealedArtifactReference;
}

/** A sealed artifact whose binding and seal descriptor were verified, with its canonical bytes. */
export interface DeepResearchVerifiedSealedArtifact<
  TKind extends DeepResearchArtifactKind = DeepResearchArtifactKind,
> {
  readonly binding: DeepResearchSealedArtifactBinding<TKind>;
  readonly descriptor: SealDescriptor;
  readonly bytes: readonly number[];
}

// ───────────────────────────────────────────────────────────────────
// 4. ORDERED ARTIFACT SETS
// ───────────────────────────────────────────────────────────────────

/** Run, lineage, generation, source tail sequence and replay contract digest an artifact set is bound to. */
export interface DeepResearchArtifactSetContext {
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly sourceTailSequence: number;
  readonly replayContractDigest: string;
}

/**
 * A candidate artifact-set member: its iteration, logical sequence, sealed binding and verified evidence, before
 * validation.
 */
export interface DeepResearchArtifactSetMemberInput {
  readonly iteration: number;
  readonly logicalSequence: number;
  readonly binding: DeepResearchSealedArtifactBinding;
  readonly evidence: VerifiedArtifactEvidence;
}

/** A validated artifact-set member with its position, the lifecycle its kind registers and its sealed binding. */
export interface DeepResearchArtifactSetMember {
  readonly position: number;
  readonly lifecycle: DeepResearchArtifactLifecycle;
  readonly iteration: number;
  readonly logicalSequence: number;
  readonly binding: DeepResearchSealedArtifactBinding;
}

/** The frozen body of an artifact set: version, bound context, ordered members and their reference set. */
export interface DeepResearchArtifactSetCore {
  readonly artifactSetVersion: 1;
  readonly context: DeepResearchArtifactSetContext;
  readonly orderedMembers: readonly DeepResearchArtifactSetMember[];
  readonly referenceSet: ArtifactReferenceSet;
}

export type DeepResearchArtifactSet = DeepResearchArtifactSetCore;
