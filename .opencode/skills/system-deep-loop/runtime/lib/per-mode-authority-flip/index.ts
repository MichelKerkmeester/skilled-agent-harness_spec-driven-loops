// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip Public API
// ───────────────────────────────────────────────────────────────────

export { AuthorityRegistry } from './authority-registry.js';
export { isValidAuthorityRecord, selectAuthorityRoute } from './authority-selector.js';
export {
  AUTHORITY_FLIP_COMMON_MODE,
  AUTHORITY_FLIP_COMMON_VARIANTS,
  AUTHORITY_FLIP_EVENT_TYPE,
  AUTHORITY_FLIP_MODE_ORDER,
  AUTHORITY_FLIP_SCHEMA_VERSION,
  AuthorityFlipError,
  AuthorityFlipStates,
} from './types.js';

export type {
  AuthorityCompareAndSwapInput,
  AuthorityCompareAndSwapRollbackInput,
  AuthorityPendingTransition,
  AuthorityPrepareCutoverInput,
} from './authority-registry.js';
export type {
  AuthorityFlipDenialReasonCode,
  AuthorityRecord,
  AuthorityRecordCore,
  AuthorityRoute,
  AuthoritySelectorExpectation,
  AuthoritySelectorResult,
  CutoverCertificateMode,
} from './types.js';
