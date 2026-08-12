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
