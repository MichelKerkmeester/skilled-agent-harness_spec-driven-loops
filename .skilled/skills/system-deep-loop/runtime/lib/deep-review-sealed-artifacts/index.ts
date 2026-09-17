// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Sealed Artifacts Public API
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_REVIEW_ARTIFACT_CANONICALIZATION_VERSION,
  DEEP_REVIEW_ARTIFACT_KIND_REGISTRY,
  DEEP_REVIEW_ARTIFACT_MEDIA_TYPE,
  createDeepReviewArtifactCanonicalizerRegistry,
} from './deep-review-artifact-material.js';
export {
  DEEP_REVIEW_ARTIFACT_SET_VERSION,
  bindDeepReviewArtifactSet,
  canonicalDeepReviewArtifactSetBytes,
  compareDeepReviewArtifactSets,
  deepReviewArtifactSetReplayInput,
  parseDeepReviewArtifactSet,
} from './deep-review-artifact-set.js';
export {
  createDeepReviewSealedArtifactStore,
  parseDeepReviewSealedArtifactBinding,
  readDeepReviewArtifact,
  sealDeepReviewArtifact,
} from './deep-review-sealed-artifacts.js';
export { DeepReviewArtifactKinds } from './deep-review-sealed-artifact-types.js';

export type {
  DeepReviewAdvisoryState,
  DeepReviewArtifactDependency,
  DeepReviewArtifactEventReference,
  DeepReviewArtifactKind,
  DeepReviewArtifactKindRegistration,
  DeepReviewArtifactLifecycle,
  DeepReviewArtifactLocator,
  DeepReviewArtifactMaterial,
  DeepReviewArtifactMaterialByKind,
  DeepReviewArtifactMaterialFamily,
  DeepReviewArtifactReadContext,
  DeepReviewArtifactSet,
  DeepReviewArtifactSetContext,
  DeepReviewArtifactSetCore,
  DeepReviewArtifactSetMember,
  DeepReviewArtifactSetMemberInput,
  DeepReviewCandidateArtifactMaterial,
  DeepReviewConvergenceArtifactMaterial,
  DeepReviewConvergenceDecision,
  DeepReviewDriftDisposition,
  DeepReviewEvidenceScope,
  DeepReviewEvidenceStrength,
  DeepReviewPassArtifactMaterial,
  DeepReviewResumeArtifactMaterial,
  DeepReviewScopeArtifactMaterial,
  DeepReviewSealedArtifactBinding,
  DeepReviewSynthesisArtifactMaterial,
  DeepReviewSynthesisVerdict,
  DeepReviewVerifiedSealedArtifact,
} from './deep-review-sealed-artifact-types.js';
