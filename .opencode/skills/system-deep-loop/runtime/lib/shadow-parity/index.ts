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
export { createParityInvalidationIdentityRegistry } from './parity-identity-registry.js';
export { closeParityDivergence } from './parity-divergence-closure.js';
export { SHADOW_PARITY_SCHEMA_FILES } from './parity-schemas.js';
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
  ParityCleanupReceipt,
  ParityCertificate,
  ParityCertificateBindings,
  ParityCertificateInvalidationBindings,
  ParityCertificateIssuanceResult,
  ParityCertificateRefusal,
  ParityCertificateRefusalCode,
  ParityCertificateVerificationResult,
  ParityCoverageInventory,
  ParityDivergenceClass,
  ParityDivergenceClosure,
  ParityDivergenceClosureResult,
  ParityDivergenceLocation,
  ParityDivergenceRecord,
  ParityExecutionContext,
  ParityFingerprintEvidence,
  ParityInvalidationIdentityRegistry,
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
export type { ShadowParitySchemaFile } from './parity-schemas.js';
