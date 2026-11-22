// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Sealed Artifact Types
// ───────────────────────────────────────────────────────────────────

import type {
  DeepReviewEventStem,
} from '../deep-review-ledger-schema/index.js';
import type {
  ArtifactReferenceSet,
  InitialArtifactKind,
  SealDescriptor,
  SealedArtifactReference,
  VerifiedArtifactEvidence,
} from '../sealed-reference-artifacts/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. ARTIFACT KINDS
// ───────────────────────────────────────────────────────────────────

export const DeepReviewArtifactKinds = Object.freeze({
  TARGET_SNAPSHOT: 'deep-review-target-snapshot',
  SCOPE_REFERENCE_SET: 'deep-review-scope-reference-set',
  REVIEW_CONTRACT: 'deep-review-review-contract',
  CONTEXT_SNAPSHOT: 'deep-review-context-snapshot',
  CAPABILITY_COMMITMENT: 'deep-review-capability-commitment',
  PROMPT_RUBRIC: 'deep-review-prompt-rubric',
  POLICY_INPUT: 'deep-review-policy-input',
  DIMENSION_PASS: 'deep-review-dimension-pass',
  CANDIDATE_EVIDENCE: 'deep-review-candidate-evidence',
  ADJUDICATION_EVIDENCE: 'deep-review-adjudication-evidence',
  CONVERGENCE_WITNESS: 'deep-review-convergence-witness',
  SYNTHESIS_VIEW: 'deep-review-synthesis-view',
  SYNTHESIS_REPORT: 'deep-review-synthesis-report',
  RESUME_HANDOFF: 'deep-review-resume-handoff',
} as const);

export type DeepReviewArtifactKind =
  typeof DeepReviewArtifactKinds[keyof typeof DeepReviewArtifactKinds];

export type DeepReviewArtifactLifecycle =
  | 'candidate-adjudication'
  | 'convergence'
  | 'dimension-pass'
  | 'resume-save'
  | 'scope-init'
  | 'synthesis';

export type DeepReviewArtifactMaterialFamily =
  | 'candidate'
  | 'convergence'
  | 'pass'
  | 'resume'
  | 'scope'
  | 'synthesis';

/**
 * Registry entry for one Deep Review artifact kind: its lifecycle, material family, canonicalization version and media
 * type.
 */
export interface DeepReviewArtifactKindRegistration {
  readonly artifactKind: DeepReviewArtifactKind;
  readonly lifecycle: DeepReviewArtifactLifecycle;
  readonly materialFamily: DeepReviewArtifactMaterialFamily;
  readonly canonicalizationVersion: string;
  readonly mediaType: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED MATERIAL SHAPES
// ───────────────────────────────────────────────────────────────────

/** Where an artifact's material came from, as a scheme, a locator digest, a selector and an optional revision. */
export interface DeepReviewArtifactLocator {
  readonly scheme: 'artifact' | 'file' | 'url';
  readonly locatorDigest: string;
  readonly selector: string;
  readonly revision: string | null;
}

/** A sealed reference to another artifact, Deep Review or shared initial kind, that this material depends on. */
export interface DeepReviewArtifactDependency {
  readonly artifactKind: DeepReviewArtifactKind | InitialArtifactKind;
  readonly reference: SealedArtifactReference;
}

/**
 * Material shared by the scope-family kinds (target snapshot, scope reference set, contract, context, capability,
 * rubric, policy input), bound to its event and authority epoch.
 */
export interface DeepReviewScopeArtifactMaterial {
  readonly artifactId: string;
  readonly eventStem: DeepReviewEventStem;
  readonly eventId: string;
  readonly authorityEpoch: number;
  readonly materialDigest: string;
  readonly materialRef: string;
  readonly dependencies: readonly DeepReviewArtifactDependency[];
  readonly locator: DeepReviewArtifactLocator;
  readonly producerVersion: string;
}

/**
 * Material for a dimension pass: ordered inputs, selected target digests, the search ledger and diagnostics digests,
 * bound to its event.
 */
export interface DeepReviewPassArtifactMaterial {
  readonly passId: string;
  readonly eventStem: DeepReviewEventStem;
  readonly eventId: string;
  readonly authorityEpoch: number;
  readonly orderedInputDigests: readonly string[];
  readonly selectedTargetDigests: readonly string[];
  readonly searchLedgerDigest: string;
  readonly diagnosticsDigest: string;
  readonly observationDigests: readonly string[];
  readonly graphEventDigest: string;
  readonly iterationDigest: string;
  readonly deltaDigest: string;
  readonly dependencies: readonly DeepReviewArtifactDependency[];
  readonly locator: DeepReviewArtifactLocator;
  readonly passVersion: string;
}

export type DeepReviewEvidenceStrength = 'direct' | 'limited' | 'substantial';
export type DeepReviewEvidenceScope = 'complete' | 'partial' | 'targeted';

/**
 * Material for candidate or adjudication evidence: the claim digest, evidence and intermediate fact digests and
 * reproduction digest.
 */
export interface DeepReviewCandidateArtifactMaterial {
  readonly candidateId: string;
  readonly eventStem: DeepReviewEventStem;
  readonly eventId: string;
  readonly authorityEpoch: number;
  readonly claimDigest: string;
  readonly evidenceDigests: readonly string[];
  readonly intermediateFactDigests: readonly string[];
  readonly reproductionDigest: string;
  readonly refutationDigest: string;
  readonly rawScore: number;
  readonly confidence: number;
  readonly impact: number;
  readonly reachability: number;
  readonly exploitability: number;
  readonly evidenceStrength: DeepReviewEvidenceStrength;
  readonly evidenceScope: DeepReviewEvidenceScope;
  readonly dependencies: readonly DeepReviewArtifactDependency[];
  readonly locator: DeepReviewArtifactLocator;
  readonly candidateVersion: string;
}

export type DeepReviewConvergenceDecision =
  | 'blocked'
  | 'continue'
  | 'converged'
  | 'incomplete'
  | 'recover';

/** Material for a convergence witness: ordered inputs, state history, findings registry input and coverage digests. */
export interface DeepReviewConvergenceArtifactMaterial {
  readonly witnessId: string;
  readonly eventStem: DeepReviewEventStem;
  readonly eventId: string;
  readonly authorityEpoch: number;
  readonly orderedInputDigests: readonly string[];
  readonly stateHistoryDigest: string;
  readonly findingsRegistryInputDigest: string;
  readonly coverageDigest: string;
  readonly gateResultDigests: readonly string[];
  readonly graphConvergenceDigest: string;
  readonly decision: DeepReviewConvergenceDecision;
  readonly recoveryDecision: 'blocked' | 'continue' | 'recover' | 'none';
  readonly dependencies: readonly DeepReviewArtifactDependency[];
  readonly locator: DeepReviewArtifactLocator;
  readonly evaluatorVersion: string;
}

export type DeepReviewSynthesisVerdict = 'blocked' | 'fail' | 'incomplete' | 'pass';
export type DeepReviewAdvisoryState = 'advisory' | 'blocked' | 'ready' | 'unavailable';

/**
 * Material for a synthesis view or report: ordered inputs and the findings registry, dashboard and resource map
 * digests.
 */
export interface DeepReviewSynthesisArtifactMaterial {
  readonly outputId: string;
  readonly eventStem: DeepReviewEventStem;
  readonly eventId: string;
  readonly authorityEpoch: number;
  readonly orderedInputDigests: readonly string[];
  readonly findingsRegistryDigest: string;
  readonly dashboardDigest: string;
  readonly resourceMapDigest: string | null;
  readonly reportDigest: string;
  readonly unresolvedFindingDigests: readonly string[];
  readonly verdict: DeepReviewSynthesisVerdict;
  readonly advisoryState: DeepReviewAdvisoryState;
  readonly reducerVersion: string;
  readonly projectionVersion: string;
  readonly dependencies: readonly DeepReviewArtifactDependency[];
  readonly locator: DeepReviewArtifactLocator;
}

export type DeepReviewDriftDisposition =
  | 'changed'
  | 'missing'
  | 'unchanged'
  | 'unverifiable';

/**
 * Material for a resume handoff: the prior reference set digest, the changed input and the findings and reports it
 * affects.
 */
export interface DeepReviewResumeArtifactMaterial {
  readonly handoffId: string;
  readonly eventStem: DeepReviewEventStem;
  readonly eventId: string;
  readonly authorityEpoch: number;
  readonly priorReferenceSetDigest: string;
  readonly changedInputDigest: string;
  readonly affectedFindingDigests: readonly string[];
  readonly affectedReportDigests: readonly string[];
  readonly continuityPointer: string;
  readonly driftDisposition: DeepReviewDriftDisposition;
  readonly dependencies: readonly DeepReviewArtifactDependency[];
  readonly locator: DeepReviewArtifactLocator;
  readonly handoffVersion: string;
}

/** Maps each Deep Review artifact kind to the material shape it must carry. */
export interface DeepReviewArtifactMaterialByKind {
  readonly 'deep-review-target-snapshot': DeepReviewScopeArtifactMaterial;
  readonly 'deep-review-scope-reference-set': DeepReviewScopeArtifactMaterial;
  readonly 'deep-review-review-contract': DeepReviewScopeArtifactMaterial;
  readonly 'deep-review-context-snapshot': DeepReviewScopeArtifactMaterial;
  readonly 'deep-review-capability-commitment': DeepReviewScopeArtifactMaterial;
  readonly 'deep-review-prompt-rubric': DeepReviewScopeArtifactMaterial;
  readonly 'deep-review-policy-input': DeepReviewScopeArtifactMaterial;
  readonly 'deep-review-dimension-pass': DeepReviewPassArtifactMaterial;
  readonly 'deep-review-candidate-evidence': DeepReviewCandidateArtifactMaterial;
  readonly 'deep-review-adjudication-evidence': DeepReviewCandidateArtifactMaterial;
  readonly 'deep-review-convergence-witness': DeepReviewConvergenceArtifactMaterial;
  readonly 'deep-review-synthesis-view': DeepReviewSynthesisArtifactMaterial;
  readonly 'deep-review-synthesis-report': DeepReviewSynthesisArtifactMaterial;
  readonly 'deep-review-resume-handoff': DeepReviewResumeArtifactMaterial;
}

export type DeepReviewArtifactMaterial =
  DeepReviewArtifactMaterialByKind[DeepReviewArtifactKind];

// ───────────────────────────────────────────────────────────────────
// 3. SEALED BINDINGS
// ───────────────────────────────────────────────────────────────────

export type DeepReviewArtifactEventReference = string;

/** Binds a sealed artifact reference to the Deep Review event, authority epoch and dependencies that produced it. */
export interface DeepReviewSealedArtifactBinding<
  TKind extends DeepReviewArtifactKind = DeepReviewArtifactKind,
> {
  readonly bindingVersion: 1;
  readonly artifactKind: TKind;
  readonly eventStem: DeepReviewEventStem;
  readonly eventId: string;
  readonly authorityEpoch: number;
  readonly eventReference: DeepReviewArtifactEventReference;
  readonly dependencies: readonly DeepReviewArtifactDependency[];
  readonly reference: SealedArtifactReference;
}

/**
 * Optional event stem, event id and authority epoch a reader expects; any field given must match the sealed binding or
 * the read is refused.
 */
export interface DeepReviewArtifactReadContext {
  readonly eventStem?: DeepReviewEventStem;
  readonly eventId?: string;
  readonly authorityEpoch?: number;
}

/** A sealed artifact whose binding and seal descriptor were verified, with its canonical bytes. */
export interface DeepReviewVerifiedSealedArtifact<
  TKind extends DeepReviewArtifactKind = DeepReviewArtifactKind,
> {
  readonly binding: DeepReviewSealedArtifactBinding<TKind>;
  readonly descriptor: SealDescriptor;
  readonly bytes: readonly number[];
}

// ───────────────────────────────────────────────────────────────────
// 4. ORDERED ARTIFACT SETS
// ───────────────────────────────────────────────────────────────────

/** Run, session, generation, source tail sequence and replay contract digest an artifact set is bound to. */
export interface DeepReviewArtifactSetContext {
  readonly runId: string;
  readonly sessionId: string;
  readonly generation: number;
  readonly sourceTailSequence: number;
  readonly replayContractDigest: string;
}

/**
 * A candidate artifact-set member: its iteration, logical sequence, sealed binding and verified evidence, before
 * validation.
 */
export interface DeepReviewArtifactSetMemberInput {
  readonly iteration: number;
  readonly logicalSequence: number;
  readonly binding: DeepReviewSealedArtifactBinding;
  readonly evidence: VerifiedArtifactEvidence;
}

/** A validated artifact-set member with its position, the lifecycle its kind registers and its sealed binding. */
export interface DeepReviewArtifactSetMember {
  readonly position: number;
  readonly lifecycle: DeepReviewArtifactLifecycle;
  readonly iteration: number;
  readonly logicalSequence: number;
  readonly binding: DeepReviewSealedArtifactBinding;
}

/** The frozen body of an artifact set: version, bound context, ordered members and their reference set. */
export interface DeepReviewArtifactSetCore {
  readonly artifactSetVersion: 1;
  readonly context: DeepReviewArtifactSetContext;
  readonly orderedMembers: readonly DeepReviewArtifactSetMember[];
  readonly referenceSet: ArtifactReferenceSet;
}

export type DeepReviewArtifactSet = DeepReviewArtifactSetCore;
