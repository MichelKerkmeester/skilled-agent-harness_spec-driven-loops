// ───────────────────────────────────────────────────────────────────
// MODULE: Authorized Ledger Public API
// ───────────────────────────────────────────────────────────────────

export { AppendOnlyLedger } from './append-only-ledger.js';
export {
  AuthorizedLedgerError,
  AuthorizedLedgerErrorCodes,
} from './authorized-ledger-errors.js';
export {
  AUTHORIZATION_DECISION_EVENT_TYPE,
  createAuthorizationDecisionRegistry,
} from './authorization-decision-event.js';
export { verifyAuthorizationReplay } from './authorization-replay.js';
export {
  TypedReducerRegistry,
  rebuildProjection,
} from './deterministic-reducer.js';
export {
  DarkLedgerAdapter,
  LEGACY_DARK_BOUNDARIES,
} from './dark-ledger-adapter.js';
export {
  TransitionAuthorizationGateway,
  authorizationDecisionDigest,
  readAuthorizationAudit,
} from './transition-authorization-gateway.js';
export { TransitionPolicyRegistry } from './transition-policy-registry.js';
export {
  AuthorizationReasonCodes,
  AuthorizationVerdicts,
  GENESIS_RECORD_HASH,
} from './authorized-ledger-types.js';

export type {
  AuthorizationAuditFrame,
  AuthorizationAuditReceipt,
  AuthorizationDecisionRecord,
  AuthorizationGatewayOptions,
  AuthorizationReasonCode,
  AuthorizationReplayReport,
  AuthorizationVerdict,
  AuthorizedLedgerOptions,
  AuthoritySnapshot,
  AuthorityState,
  DurableAppendReceipt,
  GatewayAllowProof,
  GatewayAuthorizationResult,
  LedgerHead,
  LedgerRecordFrame,
  LedgerStorageOptions,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  PolicyReference,
  RebuiltProjection,
  TornTailRecoveryRecord,
  TransitionAuthorizationRequest,
  TransitionPolicyDefinition,
  TypedReducerDefinition,
  VerifiedLedgerEvent,
} from './authorized-ledger-types.js';
export type {
  RegisteredTransitionPolicy,
  TransitionPolicyInspectionEntry,
} from './transition-policy-registry.js';
export type {
  DarkLedgerAdapterOptions,
  DarkLedgerStatus,
  DarkLedgerTelemetryEvent,
  LegacyDarkBoundaryId,
} from './dark-ledger-adapter.js';
export type { VerifiedAuthorizationAudit } from './transition-authorization-gateway.js';
