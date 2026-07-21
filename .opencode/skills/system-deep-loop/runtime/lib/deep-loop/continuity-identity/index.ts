// ───────────────────────────────────────────────────────────────────
// MODULE: Continuity Identity Public API
// ───────────────────────────────────────────────────────────────────

export {
  CONTINUITY_IDENTITY_PREFIX,
  CONTINUITY_MINT_TOKEN_PATTERN,
  aliasKey,
  assertIdentityKind,
  continuityDigest,
  createEmptyContinuityIdentityState,
  createMintRequestToken,
  identityRefFromTokenDigest,
  legacyAliasDigest,
  mintIdentity,
  mintRequestTokenDigest,
  parseIdentity,
  provenanceDigest,
  requireRegisteredIdentity,
  resolveAlias,
  validateAliasNamespace,
  validateContinuityKind,
  validateContinuityMode,
  validateIdentityRef,
} from './continuity-identity-schema.js';
export {
  CONTINUITY_ALIAS_BOUND_EVENT,
  CONTINUITY_ATTEMPT_RECORDED_EVENT,
  CONTINUITY_CROSS_MODE_REFERENCED_EVENT,
  CONTINUITY_EVENT_TYPES,
  CONTINUITY_IDENTITY_MINTED_EVENT,
  CONTINUITY_POLICY_ID,
  CONTINUITY_POLICY_VERSION,
  CONTINUITY_PROJECTION_SCHEMA_VERSION,
  CONTINUITY_REDUCER_ID,
  CONTINUITY_REDUCER_VERSION,
  CONTINUITY_RELATIONSHIP_BOUND_EVENT,
  CONTINUITY_WRITE_CAPABILITY,
  createContinuityFingerprintVersionRegistry,
  createContinuityIdentityEventRegistry,
  createContinuityIdentityPolicyRegistry,
  createContinuityIdentityReducerRegistry,
  createContinuityReplayComponentRegistry,
  continuityInitialState,
} from './continuity-identity-events.js';
export {
  ContinuityIdentityService,
  DarkContinuityIdentityObserver,
  continuityEvidenceDigest,
  createContinuityIdentityRuntime,
  readContinuityIdentityProjection,
} from './continuity-identity-service.js';
export {
  createContinuityFrontier,
  deriveContinuityReplayFingerprint,
  restoreContinuityFrontier,
  validateIdentityBearingDomainPayload,
} from './continuity-frontier.js';
export {
  CONTINUITY_IDENTITY_SCHEMA_VERSION,
  ContinuityIdentityError,
  ContinuityIdentityErrorCodes,
  ContinuityIdentityKinds,
  ContinuityModes,
} from './continuity-identity-types.js';

export type {
  CreateContinuityFrontierInput,
  RestoredContinuityFrontier,
} from './continuity-frontier.js';
export type {
  ContinuityIdentityRuntime,
  ContinuityIdentityRuntimeOptions,
  DarkContinuityIdentityTelemetry,
} from './continuity-identity-service.js';
export type {
  BindAliasInput,
  ContinuityAttemptRecord,
  ContinuityAttemptTransition,
  ContinuityCrossModeRecord,
  ContinuityFrontierAttempt,
  ContinuityIdentityErrorCode,
  ContinuityIdentityFrontier,
  ContinuityIdentityKind,
  ContinuityIdentityRecord,
  ContinuityIdentityRef,
  ContinuityIdentityState,
  ContinuityLedgerCursor,
  ContinuityMode,
  ContinuityRelationshipKind,
  ContinuityRelationshipRecord,
  ContinuityReplayReference,
  ContinuityWriteContext,
  ContinuityWriteResult,
  LinkIdentitiesInput,
  MintIdentityInput,
  RecordAttemptInput,
  RecordCrossModeReferenceInput,
} from './continuity-identity-types.js';
