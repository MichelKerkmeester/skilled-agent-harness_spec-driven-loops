// ───────────────────────────────────────────────────────────────────
// MODULE: Compatibility Shadow Public API
// ───────────────────────────────────────────────────────────────────

export {
  CompatibilityError,
  CompatibilityErrorCodes,
  boundedErrorCode,
  isCompatibilityResolutionFailure,
} from './compatibility-errors.js';
export { readCompatibilityEvent } from './event-upcaster-adapter.js';
export {
  StateUpcasterRegistry,
  readWithUpcastingGate,
  requireExplicitStateVersion,
} from './state-upcaster-registry.js';
export {
  DualReadAdapter,
  mirrorAcceptedLegacyTransition,
  reconcileReadModels,
  validateComparisonToken,
} from './dual-read-adapter.js';

export type {
  CompatibilityErrorCode,
  CompatibilityErrorDetails,
} from './compatibility-errors.js';
export type {
  AcceptedLegacyTransition,
  DarkMirrorOptions,
  DarkMirrorRecorder,
  DualReadAdapterOptions,
} from './dual-read-adapter.js';
export type {
  ComparisonToken,
  CompatibilityGates,
  DarkReadModel,
  EffectiveStateArtifact,
  LegacyReadModel,
  ReconciliationEvidence,
  ReconciliationOutcome,
  StateIntroducedFieldProvenance,
  StateReadResult,
  StateRecordCodec,
  StateRecordTypeDefinition,
  StateRegistryInspectionEntry,
  StateUpcastHopTrace,
  StateUpcastOutcome,
  StateUpcasterDefinition,
  StateVersionDefinition,
  StoredStateBytes,
  StoredStateEvidence,
  VersionedStateRecord,
} from './compatibility-types.js';
