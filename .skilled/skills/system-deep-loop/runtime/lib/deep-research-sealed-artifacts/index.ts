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
  DEEP_RESEARCH_ARTIFACT_SET_VERSION,
  bindDeepResearchArtifactSet,
  canonicalDeepResearchArtifactSetBytes,
  compareDeepResearchArtifactSets,
  deepResearchArtifactSetReplayInput,
  parseDeepResearchArtifactSet,
} from './deep-research-artifact-set.js';
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
  DeepResearchArtifactSet,
  DeepResearchArtifactSetContext,
  DeepResearchArtifactSetCore,
  DeepResearchArtifactSetMember,
  DeepResearchArtifactSetMemberInput,
  DeepResearchConvergenceArtifactMaterial,
  DeepResearchConvergenceDecision,
  DeepResearchInputArtifactMaterial,
  DeepResearchMemoryHandoffArtifactMaterial,
  DeepResearchSealedArtifactBinding,
  DeepResearchSourceArtifactMaterial,
  DeepResearchSynthesisArtifactMaterial,
  DeepResearchVerifiedSealedArtifact,
} from './deep-research-sealed-artifact-types.js';
