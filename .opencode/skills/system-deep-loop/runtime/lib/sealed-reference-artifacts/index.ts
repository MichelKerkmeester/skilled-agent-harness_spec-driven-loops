// ───────────────────────────────────────────────────────────────────
// MODULE: Sealed Reference Artifacts Public API
// ───────────────────────────────────────────────────────────────────

export {
  ArtifactCanonicalizerRegistry,
  ArtifactDigestRegistry,
  createArtifactCanonicalizerRegistry,
  createArtifactDigestRegistry,
} from './artifact-registries.js';
export {
  ARTIFACT_LIFECYCLE_EVENT_TYPE,
  ARTIFACT_SEALED_EVENT_TYPE,
  ArtifactLifecycleActions,
  ArtifactRetentionRootTypes,
  parseArtifactLifecyclePayload,
  parseArtifactSealedPayload,
  prepareArtifactLifecycleEvent,
  prepareArtifactSealedEvent,
  readVerifiedArtifactEvidence,
  recordArtifactEvent,
  sealedArtifactEventDefinitions,
} from './artifact-events.js';
export {
  SEALED_ARTIFACT_REPLAY_INPUT_KEY,
  artifactReferenceSetReplayInput,
  bindVerifiedArtifactReferences,
  compareArtifactReferenceSets,
} from './artifact-reference-set.js';
export {
  artifactRetentionRootTypes,
  deriveArtifactLifecycleStates,
  planArtifactRetention,
  restoreArtifact,
  sweepArtifact,
} from './artifact-retention.js';
export {
  SealedArtifactStore,
  parseSealDescriptor,
  parseSealedArtifactReference,
} from './sealed-artifact-store.js';
export {
  ARTIFACT_DESCRIPTOR_VERSION,
  ARTIFACT_REFERENCE_VERSION,
  ARTIFACT_TOMBSTONE_VERSION,
  DEFAULT_ARTIFACT_CANONICALIZATION_VERSION,
  DEFAULT_ARTIFACT_DIGEST_ALGORITHM,
  DEFAULT_ARTIFACT_MEDIA_TYPE,
  InitialArtifactKinds,
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from './sealed-artifact-types.js';

export type {
  ArtifactAuthorizationContext,
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactEventWriteResult,
  ArtifactLifecycleAction,
  ArtifactLifecycleInput,
  ArtifactLifecyclePayload,
  ArtifactRetentionRootType,
  ArtifactSealedPayload,
  VerifiedArtifactEvidence,
} from './artifact-events.js';
export type {
  ArtifactInputEquivalenceFailure,
  ArtifactInputEquivalenceResult,
  ArtifactInputEquivalenceSuccess,
} from './artifact-reference-set.js';
export type {
  ArtifactLifecycleState,
  ArtifactRestorationResult,
  ArtifactRetentionDecision,
  ArtifactRetentionPlan,
  ArtifactRetentionPlanInput,
  ArtifactRetentionRoot,
  ArtifactSweepResult,
} from './artifact-retention.js';
export type {
  ArtifactCanonicalizerDefinition,
  ArtifactDeletionAuthorization,
  ArtifactDigestDefinition,
  ArtifactReferenceSet,
  ArtifactReferenceSetCore,
  ArtifactReferenceSetEntry,
  ArtifactReplayInput,
  ArtifactReplayInputSource,
  ArtifactStoreFaultInjection,
  ArtifactStoreOptions,
  ArtifactStorePaths,
  ArtifactTombstone,
  CanonicalizedArtifact,
  DerivedSealedArtifact,
  InitialArtifactKind,
  SealArtifactOptions,
  SealArtifactResult,
  SealDescriptor,
  SealedArtifactErrorCode,
  SealedArtifactErrorPhase,
  SealedArtifactReference,
  VerifiedSealedArtifact,
} from './sealed-artifact-types.js';
