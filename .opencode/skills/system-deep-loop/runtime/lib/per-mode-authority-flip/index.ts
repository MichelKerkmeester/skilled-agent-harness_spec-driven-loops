// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip Public API
// ───────────────────────────────────────────────────────────────────

export { AuthorityRegistry } from './authority-registry.js';
export { isValidAuthorityRecord, selectAuthorityRoute } from './authority-selector.js';
export { AuthorityFlipCoordinator } from './cutover-coordinator.js';
export { createAuthorityFlipCoordinator } from './coordinator-factory.js';
export {
  AUTHORITY_FLIP_ACTOR_RULE_ID,
  AUTHORITY_FLIP_EVENT_RULE_ID,
  AUTHORITY_FLIP_POLICY_ID,
  AUTHORITY_FLIP_POLICY_VERSION,
  AUTHORITY_FLIP_STATE_RULE_ID,
  createAuthorityFlipTransitionPolicyRegistry,
} from './authority-flip-policy.js';
export {
  appendAuthorityTransitionEvent,
  buildAuthorityTransitionEvent,
  buildAuthorityTransitionFacts,
  createAuthorityTransitionEventRegistry,
  prepareAuthorityTransitionEventWrite,
} from './ledger-event.js';
export { checkManifestOrder, deriveFlippedModes } from './manifest-order.js';
export { evaluateCutoverPreflight, rollbackAssetSetDigest } from './preflight.js';
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
  AuthorityFlipCoordinatorFaultInjection,
  AuthorityFlipCoordinatorOptions,
  AuthorityFlipExpectedIdentity,
} from './cutover-coordinator.js';
export type {
  AuthorityFlipCoordinatorBundle,
  AuthorityFlipCoordinatorFactoryOptions,
} from './coordinator-factory.js';
export type { AuthorityFlipPolicyOptions } from './authority-flip-policy.js';
export type {
  AuthorityTransitionEnvelopeFields,
  AuthorityTransitionFactsInput,
} from './ledger-event.js';
export type { ModeOrderCheck } from './manifest-order.js';
export type {
  AuthorityFlipDenialReasonCode,
  AuthorityRecord,
  AuthorityRecordCore,
  AuthorityRoute,
  AuthoritySelectorExpectation,
  AuthoritySelectorResult,
  AuthorityTransitionEvent,
  AuthorityTransitionFacts,
  CutoverCertificateEvidence,
  CutoverCertificateMode,
  CutoverDecision,
  CutoverPreflightInput,
  CutoverPreflightResult,
  CutoverRequest,
  MigrationHandoffEvidence,
} from './types.js';
