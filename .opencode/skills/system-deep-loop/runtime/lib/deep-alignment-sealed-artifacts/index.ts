// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Sealed Artifacts Public API
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_ALIGNMENT_ARTIFACT_CANONICALIZATION_VERSION,
  DEEP_ALIGNMENT_ARTIFACT_KIND_REGISTRY,
  DEEP_ALIGNMENT_ARTIFACT_MEDIA_TYPE,
  createDeepAlignmentArtifactCanonicalizerRegistry,
} from './deep-alignment-artifact-material.js';
export {
  createDeepAlignmentSealedArtifactStore,
  deepAlignmentDependency,
  parseDeepAlignmentSealedArtifactBinding,
  readDeepAlignmentArtifact,
  sealDeepAlignmentArtifact,
} from './deep-alignment-sealed-artifacts.js';
export { DeepAlignmentArtifactKinds } from './deep-alignment-sealed-artifact-types.js';

export type {
  DeepAlignmentApplicabilityDecisionMaterial,
  DeepAlignmentArtifactDependency,
  DeepAlignmentArtifactEventReference,
  DeepAlignmentArtifactKind,
  DeepAlignmentArtifactKindRegistration,
  DeepAlignmentArtifactLifecycle,
  DeepAlignmentArtifactLocator,
  DeepAlignmentArtifactMaterial,
  DeepAlignmentArtifactMaterialBase,
  DeepAlignmentArtifactMaterialByKind,
  DeepAlignmentArtifactMaterialFamily,
  DeepAlignmentArtifactEventStem,
  DeepAlignmentArtifactReference,
  DeepAlignmentAuthorityCapsuleMaterial,
  DeepAlignmentConvergenceSnapshotMaterial,
  DeepAlignmentDiscoveryManifestMaterial,
  DeepAlignmentExceptionInvalidation,
  DeepAlignmentExceptionStatus,
  DeepAlignmentFindingEvidenceMaterial,
  DeepAlignmentGovernedExceptionMaterial,
  DeepAlignmentHandoffRole,
  DeepAlignmentLaneConfigurationMaterial,
  DeepAlignmentLedgerEventType,
  DeepAlignmentReadOptions,
  DeepAlignmentReportMaterial,
  DeepAlignmentResumeSaveHandoffMaterial,
  DeepAlignmentRuleManifestMaterial,
  DeepAlignmentSealedArtifactBinding,
  DeepAlignmentTargetSnapshotMaterial,
  DeepAlignmentVerificationInputMaterial,
  DeepAlignmentVerificationInputRole,
  DeepAlignmentVerifiedSealedArtifact,
  DeepAlignmentVerdict,
  DeepAlignmentWitnessKind,
  DeepAlignmentWitnessMatrixMaterial,
} from './deep-alignment-sealed-artifact-types.js';
