// ───────────────────────────────────────────────────────────────────
// MODULE: Locks and Fencing Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export { FencedLeaseCoordinator } from './fenced-lease-coordinator.js';
export { FencedLedgerWriter } from './fenced-ledger-writer.js';
export { FencedShadowAdapter } from './fenced-shadow-adapter.js';
export { FencedStateStore } from './fenced-state-store.js';
export {
  LOCK_LIFECYCLE_EVENT_TYPE,
  bindReplayIdentity,
  createLockLifecycleEventRegistry,
  initialLockLifecycleProjection,
  lockLifecycleEventDefinition,
  lockLifecycleReducerDefinition,
  parseLockLifecycleEvidencePayload,
  prepareLockLifecycleEvidence,
  readLockLifecycleEvidence,
  recordLockLifecycleEvidence,
} from './lock-lifecycle-evidence.js';
export {
  LocksAndFencingError,
  LocksAndFencingErrorCodes,
} from './locks-and-fencing-errors.js';
export {
  AtomicityDomains,
  LockLifecycleActions,
  ProtectedResourceKinds,
} from './locks-and-fencing-types.js';
export {
  PROTECTED_WRITE_SURFACE_MANIFEST,
  canonicalizeProtectedResource,
  protectedWriteSurfaceManifestDigest,
  validateOpaqueIdentity,
} from './protected-resource-registry.js';
export { replayIdentityFromFingerprint } from './replay-identity.js';

export type { CoordinatorStoragePaths } from './fenced-lease-coordinator.js';
export type { FencedLedgerAppendRequest } from './fenced-ledger-writer.js';
export type {
  FencedShadowAdapterOptions,
  FencedShadowStatus,
  FencedShadowTelemetry,
} from './fenced-shadow-adapter.js';
export type {
  FencedStateReceipt,
  FencedStateReplaceRequest,
  VerifiedFencedState,
} from './fenced-state-store.js';
export type {
  LockLifecycleEnvelopeInput,
  LockLifecycleEvidencePayload,
  LockLifecycleEvidenceReceipt,
  LockLifecycleProjection,
  VerifiedLockLifecycleEvidence,
} from './lock-lifecycle-evidence.js';
export type {
  LocksAndFencingErrorCode,
  LocksAndFencingErrorPhase,
} from './locks-and-fencing-errors.js';
export type {
  AcquireLeaseRequest,
  AtomicityDomain,
  CanonicalProtectedResource,
  CoordinatorFaultInjection,
  FencedCommit,
  FencedLease,
  FencedLeaseCoordinatorOptions,
  FencedMutationContext,
  FencedMutationPreparation,
  FencingCoordinatorSnapshot,
  LeaseAcquisition,
  LeaseGrant,
  LockLifecycleAction,
  LockLifecycleDecision,
  ProtectedResourceIdentity,
  ProtectedResourceKind,
  ReplayFingerprintSource,
  ReplayIdentity,
} from './locks-and-fencing-types.js';
export type { ProtectedWriteSurfaceManifestEntry } from './protected-resource-registry.js';
