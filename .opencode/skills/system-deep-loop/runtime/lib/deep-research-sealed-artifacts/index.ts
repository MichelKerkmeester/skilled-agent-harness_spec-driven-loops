// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Sealed Artifacts Public API
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_RESEARCH_ARTIFACT_CANONICALIZATION_VERSION,
  DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY,
  DEEP_RESEARCH_ARTIFACT_MEDIA_TYPE,
  createDeepResearchArtifactCanonicalizerRegistry,
} from './deep-research-artifact-material.js';
export {
  createDeepResearchSealedArtifactStore,
  parseDeepResearchSealedArtifactBinding,
  readDeepResearchArtifact,
  sealDeepResearchArtifact,
} from './deep-research-sealed-artifacts.js';
export { DeepResearchArtifactKinds } from './deep-research-sealed-artifact-types.js';

export type {
  DeepResearchAnalysisArtifactMaterial,
  DeepResearchAnalysisStatus,
  DeepResearchArtifactEventReference,
  DeepResearchArtifactKind,
  DeepResearchArtifactKindRegistration,
  DeepResearchArtifactLifecycle,
  DeepResearchArtifactLocator,
  DeepResearchArtifactMaterial,
  DeepResearchArtifactMaterialByKind,
  DeepResearchArtifactMaterialFamily,
  DeepResearchConvergenceArtifactMaterial,
  DeepResearchConvergenceDecision,
  DeepResearchInputArtifactMaterial,
  DeepResearchMemoryHandoffArtifactMaterial,
  DeepResearchSealedArtifactBinding,
  DeepResearchSourceArtifactMaterial,
  DeepResearchSynthesisArtifactMaterial,
  DeepResearchVerifiedSealedArtifact,
} from './deep-research-sealed-artifact-types.js';
