// ───────────────────────────────────────────────────────────────────
// MODULE: Replay Fingerprint Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  FINGERPRINT_CANONICALIZATION_ALGORITHM,
  FINGERPRINT_HASH_ALGORITHM,
  INITIAL_STATE_REPLAY_INPUT,
  hashReplayFingerprintBytes,
  serializeReplayFingerprintDescriptor,
} from './canonical-descriptor.js';
export {
  FingerprintVersionRegistry,
  createReplayFingerprintVersionRegistry,
} from './fingerprint-version-registry.js';
export { ReplayComponentRegistry } from './replay-component-registry.js';
export { deriveReplayFingerprint } from './derive-replay-fingerprint.js';
export {
  parseReplayFingerprintAttestationPayload,
  prepareReplayFingerprintAttestation,
  recordReplayFingerprintAttestation,
  replayFingerprintAttestationEventDefinition,
} from './replay-fingerprint-attestation.js';
export { verifyReplayFingerprint } from './verify-replay-fingerprint.js';
export {
  REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
  ReplayFingerprintError,
  ReplayFingerprintErrorCodes,
} from './replay-fingerprint-types.js';

export type { DeriveReplayFingerprintInput } from './derive-replay-fingerprint.js';
export type { VerifyReplayFingerprintInput } from './verify-replay-fingerprint.js';
export type {
  ContentAddressedReplayInputSource,
  DerivedReplayFingerprint,
  FingerprintVersionDefinition,
  LedgerEventReplayInputSource,
  ReplayComponentDefinition,
  ReplayExecutionInput,
  ReplayFingerprintAttestationEnvelopeInput,
  ReplayFingerprintAttestationPayload,
  ReplayFingerprintAttestationWriteResult,
  ReplayFingerprintComponent,
  ReplayFingerprintConsumer,
  ReplayFingerprintDescriptor,
  ReplayFingerprintDescriptorCore,
  ReplayFingerprintDivergence,
  ReplayFingerprintErrorCode,
  ReplayFingerprintFailure,
  ReplayFingerprintVerificationResult,
  ReplayInputSource,
  VerifiedReplayFingerprint,
} from './replay-fingerprint-types.js';
