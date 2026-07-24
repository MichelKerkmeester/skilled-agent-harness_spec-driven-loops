// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Sealed Artifact Public API
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_AI_COUNCIL_ARTIFACT_CANONICALIZATION_VERSION,
  DEEP_AI_COUNCIL_ARTIFACT_KIND_REGISTRY,
  DEEP_AI_COUNCIL_ARTIFACT_MEDIA_TYPE,
  createDeepAiCouncilArtifactCanonicalizerRegistry,
} from './deep-ai-council-artifact-material.js';
export {
  createDeepAiCouncilSealedArtifactStore,
  parseDeepAiCouncilSealedArtifactBinding,
  readDeepAiCouncilArtifact,
  sealDeepAiCouncilArtifact,
} from './deep-ai-council-sealed-artifacts.js';
export { DeepAiCouncilArtifactKinds } from './deep-ai-council-sealed-artifact-types.js';

export type {
  DeepAiCouncilArtifactEventReference,
  DeepAiCouncilArtifactKind,
  DeepAiCouncilArtifactKindRegistration,
  DeepAiCouncilArtifactLifecycle,
  DeepAiCouncilArtifactLocator,
  DeepAiCouncilArtifactMaterial,
  DeepAiCouncilArtifactMaterialBase,
  DeepAiCouncilArtifactMaterialByKind,
  DeepAiCouncilArtifactMaterialFamily,
  DeepAiCouncilArtifactReadExpectations,
  DeepAiCouncilArtifactScopeDescriptor,
  DeepAiCouncilArtifactSourceEventRange,
  DeepAiCouncilArtifactVisibility,
  DeepAiCouncilConvergenceArtifactMaterial,
  DeepAiCouncilCritiqueArtifactMaterial,
  DeepAiCouncilGateArtifactMaterial,
  DeepAiCouncilInputArtifactMaterial,
  DeepAiCouncilJudgmentArtifactMaterial,
  DeepAiCouncilOutputArtifactMaterial,
  DeepAiCouncilProposalArtifactMaterial,
  DeepAiCouncilSealedArtifactBinding,
  DeepAiCouncilSynthesisArtifactMaterial,
  DeepAiCouncilVerifiedSealedArtifact,
} from './deep-ai-council-sealed-artifact-types.js';
