// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Sealed Artifacts Public API
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_KIND_REGISTRY,
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_MEDIA_TYPE,
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_SCHEMA_VERSION,
  DEEP_IMPROVEMENT_COMMON_SEALED_ARTIFACT_CONTRACT,
  createDeepImprovementCommonArtifactCanonicalizerRegistry,
  isDeepImprovementCommonArtifactKind,
  parseDeepImprovementCommonArtifactMaterial,
} from './deep-improvement-common-artifact-material.js';
export {
  createDeepImprovementCommonSealedArtifactStore,
  parseDeepImprovementCommonSealedArtifactBinding,
  readDeepImprovementCandidateView,
  readDeepImprovementCommonArtifact,
  readDeepImprovementPromotionEvidence,
  sealDeepImprovementCommonArtifact,
} from './deep-improvement-common-sealed-artifacts.js';
export {
  DeepImprovementArtifactReadError,
  DeepImprovementArtifactReadFailureCodes,
  DeepImprovementCommonArtifactKinds,
} from './deep-improvement-common-sealed-artifact-types.js';

export type {
  DeepImprovementArtifactAccessRole,
  DeepImprovementArtifactConsumer,
  DeepImprovementCommonArtifactDependency,
  DeepImprovementArtifactReadFailureCode,
  DeepImprovementArtifactReadPolicy,
  DeepImprovementBaselineInputMaterial,
  DeepImprovementBudgetPolicy,
  DeepImprovementCanaryEpochMaterial,
  DeepImprovementCanaryLifecycle,
  DeepImprovementCandidateFacingView,
  DeepImprovementCandidateInputMaterial,
  DeepImprovementCommonArtifactBaseMaterial,
  DeepImprovementCommonArtifactEventBinding,
  DeepImprovementCommonArtifactKind,
  DeepImprovementCommonArtifactKindRegistration,
  DeepImprovementCommonArtifactLifecycle,
  DeepImprovementCommonArtifactLocator,
  DeepImprovementCommonArtifactMaterial,
  DeepImprovementCommonArtifactMaterialByKind,
  DeepImprovementCommonSealedArtifactBinding,
  DeepImprovementCommonSealedArtifactContract,
  DeepImprovementEvaluatorCapsuleEventData,
  DeepImprovementEvaluatorCapsuleMaterial,
  DeepImprovementIntegrityObservation,
  DeepImprovementLeakagePolicy,
  DeepImprovementPromotionEvidenceMaterial,
  DeepImprovementPromotionEventData,
  DeepImprovementPromotionResult,
  DeepImprovementRawTrialCaseObservation,
  DeepImprovementRawTrialOutputMaterial,
  DeepImprovementScoreComponent,
  DeepImprovementScoreVector,
  DeepImprovementUsageObservation,
  DeepImprovementVerifiedSealedArtifact,
  DeepImprovementVisibilityPolicy,
} from './deep-improvement-common-sealed-artifact-types.js';
