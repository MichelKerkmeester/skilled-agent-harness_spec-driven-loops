// ───────────────────────────────────────────────────────────────────
// MODULE: Release Public API
// ───────────────────────────────────────────────────────────────────

export {
  SUPPORT_MATRIX_VERSION,
  SupportMatrix,
  assessOpenCodeGoHostedPrivacyFreshness,
  assessSupportMatrixFreshness,
  createSupportMatrix,
} from './support-matrix.js';
export { evaluateReleaseReadiness } from './release-gate.js';
export { OriginalOnlyEmergencyMode, planRollback } from './rollback.js';
export { ReleaseAbortReasonCodes } from './evidence.js';

export type {
  FreshSupportRow,
  FreshnessReasonCode,
  FreshnessResult,
  HostedPrivacyFreshnessResult,
  StaleSupportRow,
  SupportDimension,
  SupportMatrix as SupportMatrixRecord,
  SupportReleaseStatus,
  SupportRow,
} from './types.js';
export type {
  DatedReleaseEvidence,
  PrivacyCanaryEvidence,
  ReleaseAbort,
  ReleaseAbortReasonCode,
  ReleaseCheckEvidence,
  ReleaseEvidenceInput,
  ReleaseEvidenceInputName,
  ReleaseEvidenceManifest,
  ReleaseEvidenceManifestEntry,
  ReleaseEvidenceManifestReference,
  ReleaseEvidenceReasonCode,
  ReleaseEvidenceReferenceInput,
  ReleaseEvidenceStatus,
  ReleaseReadinessDecision,
  RuntimeSmokeEvidence,
} from './evidence.js';
export type {
  DisableProjectionRollbackStep,
  OriginalOnlyEmergencyModeConfig,
  PlanRollbackInput,
  RestorePreviousPackageRollbackStep,
  RollbackPlan,
  RollbackSteps,
  RollbackTrigger,
  SelectOriginalOnlyRollbackStep,
  VerifyCanonicalTranscriptRollbackStep,
} from './rollback.js';
