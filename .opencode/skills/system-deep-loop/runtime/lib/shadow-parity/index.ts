// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Parity Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export { compileParityCaseManifest } from './parity-case-manifest.js';
export {
  issueParityCertificate,
  verifyParityCertificate,
} from './parity-certificates.js';
export {
  createShadowEffectSink,
  runShadowParityCase,
} from './shadow-parity-harness.js';
export {
  MINIMUM_DETERMINISTIC_RUNS,
  SHADOW_PARITY_SCHEMA_VERSION,
  TRANSITION_ROLLBACK_MINIMUM_DAYS,
  TRANSITION_ROLLBACK_MINIMUM_SUCCESSFUL_RUNS,
  ShadowParityError,
  ShadowParityErrorCodes,
} from './shadow-parity-types.js';

export type {
  ParityBaselineRow,
  ParityCaseCapsule,
  ParityCaseDefinition,
  ParityCaseManifest,
  ParityCertificate,
  ParityCertificateBindings,
  ParityCertificateIssuanceResult,
  ParityCertificateRefusal,
  ParityCertificateRefusalCode,
  ParityCertificateVerificationResult,
  ParityDivergenceClass,
  ParityDivergenceLocation,
  ParityDivergenceRecord,
  ParityExecutionContext,
  ParityFingerprintEvidence,
  ParityObservationClass,
  ParityPathExecution,
  ParityPathExecutor,
  ParityProjectionObservation,
  ParityRunEvidence,
  ParitySealedInputBoundary,
  RunShadowParityCaseInput,
  ShadowEffectReceipt,
  ShadowEffectSink,
  ShadowParityCaseFailure,
  ShadowParityCasePass,
  ShadowParityCaseResult,
  VerifiedParityCaseCapsule,
} from './shadow-parity-types.js';
