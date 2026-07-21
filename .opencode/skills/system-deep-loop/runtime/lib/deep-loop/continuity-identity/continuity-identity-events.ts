// ───────────────────────────────────────────────────────────────────
// MODULE: Continuity Identity Events
// ───────────────────────────────────────────────────────────────────

import {
  AuthorizationReasonCodes,
  AuthorizationVerdicts,
  TransitionPolicyRegistry,
  TypedReducerRegistry,
} from '../../authorized-ledger/index.js';
import {
  EventTypeRegistry,
} from '../../event-envelope/index.js';
import {
  INITIAL_STATE_REPLAY_INPUT,
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
} from '../../replay-fingerprint/index.js';
import {
  ContinuityIdentityError,
  ContinuityIdentityErrorCodes,
  ContinuityIdentityKinds,
} from './continuity-identity-types.js';
import {
  aliasKey,
  createEmptyContinuityIdentityState,
  hasExactFields,
  identityRefFromTokenDigest,
  isHash,
  isPlainRecord,
  requireBoundedId,
  requireRegisteredIdentity,
  validateAliasNamespace,
  validateContinuityMode,
  validateIdentityRef,
} from './continuity-identity-schema.js';

import type {
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  PolicyReference,
  TypedReducerDefinition,
} from '../../authorized-ledger/index.js';
import type {
  EventReadResult,
  EventTypeDefinition,
  JsonObject,
} from '../../event-envelope/index.js';
import type {
  FingerprintVersionRegistry,
  ReplayComponentDefinition,
} from '../../replay-fingerprint/index.js';
import type {
  ContinuityAttemptRecord,
  ContinuityAttemptTransition,
  ContinuityCrossModeRecord,
  ContinuityIdentityRecord,
  ContinuityIdentityRef,
  ContinuityIdentityState,
  ContinuityRelationshipKind,
  ContinuityRelationshipRecord,
} from './continuity-identity-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const CONTINUITY_IDENTITY_MINTED_EVENT = 'deep-loop.identity.minted';
export const CONTINUITY_ALIAS_BOUND_EVENT = 'deep-loop.identity.alias-bound';
export const CONTINUITY_RELATIONSHIP_BOUND_EVENT = 'deep-loop.identity.relationship-bound';
export const CONTINUITY_ATTEMPT_RECORDED_EVENT = 'deep-loop.identity.attempt-recorded';
export const CONTINUITY_CROSS_MODE_REFERENCED_EVENT =
  'deep-loop.identity.cross-mode-referenced';

export const CONTINUITY_EVENT_TYPES = Object.freeze([
  CONTINUITY_IDENTITY_MINTED_EVENT,
  CONTINUITY_ALIAS_BOUND_EVENT,
  CONTINUITY_RELATIONSHIP_BOUND_EVENT,
  CONTINUITY_ATTEMPT_RECORDED_EVENT,
  CONTINUITY_CROSS_MODE_REFERENCED_EVENT,
]);

export const CONTINUITY_REDUCER_ID = 'continuity-identity-registry';
export const CONTINUITY_REDUCER_VERSION = '1';
export const CONTINUITY_PROJECTION_SCHEMA_VERSION = '1';
export const CONTINUITY_POLICY_ID = 'continuity-identity-dark-write';
export const CONTINUITY_POLICY_VERSION = 1;
export const CONTINUITY_WRITE_CAPABILITY = 'continuity-identity-write';

const RELATIONSHIP_KINDS = new Set<ContinuityRelationshipKind>([
  'continues_from',
  'forked_from',
]);
const ATTEMPT_TRANSITIONS = new Set<ContinuityAttemptTransition>([
  'new',
  'retry',
  'resume',
]);
const CONTINUITY_EVENT_TYPE_SET = new Set<string>(CONTINUITY_EVENT_TYPES);

// ───────────────────────────────────────────────────────────────────
// 2. PAYLOAD VALIDATORS
// ───────────────────────────────────────────────────────────────────

function validateMintPayload(payload: Readonly<JsonObject>): boolean {
  const hasParent = Object.prototype.hasOwnProperty.call(payload, 'parent_ref');
  const hasRelationship = Object.prototype.hasOwnProperty.call(payload, 'relationship_kind');
  if (
    !hasExactFields(
      payload,
      ['identity_ref', 'mint_request_token_digest', 'provenance_digest'],
      ['parent_ref', 'relationship_kind'],
    )
    || hasParent !== hasRelationship
    || !isHash(payload.mint_request_token_digest)
    || !isHash(payload.provenance_digest)
  ) {
    return false;
  }
  const ref = validateIdentityRef(payload.identity_ref);
  const expected = identityRefFromTokenDigest(ref.kind, payload.mint_request_token_digest);
  if (expected.id !== ref.id) return false;
  if (!hasParent) return true;
  const parent = validateIdentityRef(payload.parent_ref, ref.kind);
  return parent.id !== ref.id
    && typeof payload.relationship_kind === 'string'
    && RELATIONSHIP_KINDS.has(payload.relationship_kind as ContinuityRelationshipKind);
}

function validateAliasPayload(payload: Readonly<JsonObject>): boolean {
  if (
    !hasExactFields(payload, ['alias_namespace', 'alias_digest', 'subject_ref'])
    || !isHash(payload.alias_digest)
  ) {
    return false;
  }
  validateAliasNamespace(payload.alias_namespace);
  validateIdentityRef(payload.subject_ref);
  return true;
}

function validateRelationshipPayload(payload: Readonly<JsonObject>): boolean {
  if (!hasExactFields(payload, ['relationship_kind', 'subject_ref', 'related_ref'])) {
    return false;
  }
  const subject = validateIdentityRef(payload.subject_ref);
  const related = validateIdentityRef(payload.related_ref, subject.kind);
  return subject.id !== related.id
    && typeof payload.relationship_kind === 'string'
    && RELATIONSHIP_KINDS.has(payload.relationship_kind as ContinuityRelationshipKind);
}

function validateAttemptPayload(payload: Readonly<JsonObject>): boolean {
  if (!hasExactFields(payload, [
    'mode_session_ref',
    'attempt_id',
    'attempt_number',
    'transition',
  ])) {
    return false;
  }
  validateIdentityRef(payload.mode_session_ref, ContinuityIdentityKinds.MODE_SESSION);
  requireBoundedId(payload.attempt_id, 'attempt_id');
  return Number.isSafeInteger(payload.attempt_number)
    && (payload.attempt_number as number) > 0
    && typeof payload.transition === 'string'
    && ATTEMPT_TRANSITIONS.has(payload.transition as ContinuityAttemptTransition);
}

function validateCrossModePayload(payload: Readonly<JsonObject>): boolean {
  if (!hasExactFields(payload, [
    'subject_ref',
    'source_mode_session_ref',
    'target_mode_session_ref',
    'source_mode',
    'target_mode',
  ])) {
    return false;
  }
  validateIdentityRef(payload.subject_ref);
  const source = validateIdentityRef(
    payload.source_mode_session_ref,
    ContinuityIdentityKinds.MODE_SESSION,
  );
  const target = validateIdentityRef(
    payload.target_mode_session_ref,
    ContinuityIdentityKinds.MODE_SESSION,
  );
  const sourceMode = validateContinuityMode(payload.source_mode);
  const targetMode = validateContinuityMode(payload.target_mode);
  return source.id !== target.id && sourceMode !== targetMode;
}

/** Construct the validator-bound frozen registry for continuity events. */
export function createContinuityIdentityEventRegistry(): EventTypeRegistry {
  const definitions: EventTypeDefinition[] = [
    {
      eventType: CONTINUITY_IDENTITY_MINTED_EVENT,
      currentVersion: 1,
      versions: [{
        version: 1,
        payload: {
          requiredFields: [
            'identity_ref',
            'mint_request_token_digest',
            'provenance_digest',
          ],
          optionalFields: ['parent_ref', 'relationship_kind'],
          validate: validateMintPayload,
        },
      }],
      upcasters: [],
    },
    {
      eventType: CONTINUITY_ALIAS_BOUND_EVENT,
      currentVersion: 1,
      versions: [{
        version: 1,
        payload: {
          requiredFields: ['alias_namespace', 'alias_digest', 'subject_ref'],
          validate: validateAliasPayload,
        },
      }],
      upcasters: [],
    },
    {
      eventType: CONTINUITY_RELATIONSHIP_BOUND_EVENT,
      currentVersion: 1,
      versions: [{
        version: 1,
        payload: {
          requiredFields: ['relationship_kind', 'subject_ref', 'related_ref'],
          validate: validateRelationshipPayload,
        },
      }],
      upcasters: [],
    },
    {
      eventType: CONTINUITY_ATTEMPT_RECORDED_EVENT,
      currentVersion: 1,
      versions: [{
        version: 1,
        payload: {
          requiredFields: [
            'mode_session_ref',
            'attempt_id',
            'attempt_number',
            'transition',
          ],
          validate: validateAttemptPayload,
        },
      }],
      upcasters: [],
    },
    {
      eventType: CONTINUITY_CROSS_MODE_REFERENCED_EVENT,
      currentVersion: 1,
      versions: [{
        version: 1,
        payload: {
          requiredFields: [
            'subject_ref',
            'source_mode_session_ref',
            'target_mode_session_ref',
            'source_mode',
            'target_mode',
          ],
          validate: validateCrossModePayload,
        },
      }],
      upcasters: [],
    },
  ];
  return new EventTypeRegistry(definitions);
}

// ───────────────────────────────────────────────────────────────────
// 3. REDUCERS
// ───────────────────────────────────────────────────────────────────

function eventPayload(event: Readonly<EventReadResult>): Readonly<JsonObject> {
  return event.effective.envelope.payload;
}

function cloneState(state: Readonly<ContinuityIdentityState>): ContinuityIdentityState {
  return JSON.parse(JSON.stringify(state)) as ContinuityIdentityState;
}

function lifecycleParent(
  state: Readonly<ContinuityIdentityState>,
  identityId: string,
): ContinuityRelationshipRecord | undefined {
  return state.relationships.find((relationship) => relationship.subject_ref.id === identityId);
}

function assertRelationshipIsAcyclic(
  state: Readonly<ContinuityIdentityState>,
  subject: ContinuityIdentityRef,
  related: ContinuityIdentityRef,
): void {
  let cursor: string | null = related.id;
  const visited = new Set<string>();
  while (cursor !== null) {
    if (cursor === subject.id || visited.has(cursor)) {
      throw new ContinuityIdentityError(
        ContinuityIdentityErrorCodes.RELATIONSHIP_CONFLICT,
        'Lifecycle relationship would create a cycle',
        { identityId: subject.id },
      );
    }
    visited.add(cursor);
    cursor = lifecycleParent(state, cursor)?.related_ref.id ?? null;
  }
}

function bindRelationship(
  state: ContinuityIdentityState,
  subject: ContinuityIdentityRef,
  related: ContinuityIdentityRef,
  relationshipKind: ContinuityRelationshipKind,
  eventId: string,
): void {
  requireRegisteredIdentity(state, subject);
  requireRegisteredIdentity(state, related, subject.kind);
  const existing = lifecycleParent(state, subject.id);
  if (existing) {
    if (
      existing.related_ref.id === related.id
      && existing.relationship_kind === relationshipKind
    ) {
      return;
    }
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.RELATIONSHIP_CONFLICT,
      'Identity already has a different lifecycle parent',
      { identityId: subject.id },
    );
  }
  assertRelationshipIsAcyclic(state, subject, related);
  state.relationships.push({
    relationship_kind: relationshipKind,
    subject_ref: subject,
    related_ref: related,
    event_id: eventId,
  });
}

function reduceMint(
  state: Readonly<ContinuityIdentityState>,
  event: Readonly<EventReadResult>,
): ContinuityIdentityState {
  const next = cloneState(state);
  const payload = eventPayload(event);
  const ref = validateIdentityRef(payload.identity_ref);
  const tokenDigest = payload.mint_request_token_digest as string;
  const provenance = payload.provenance_digest as string;
  const expected = identityRefFromTokenDigest(ref.kind, tokenDigest);
  const parentRef = payload.parent_ref === undefined
    ? null
    : validateIdentityRef(payload.parent_ref, ref.kind);
  const relationshipKind = payload.relationship_kind === undefined
    ? null
    : payload.relationship_kind as ContinuityRelationshipKind;
  if (expected.id !== ref.id) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.IDENTITY_COLLISION,
      'Minted identity does not match its immutable request token digest',
      { identityId: ref.id },
    );
  }

  const tokenIdentity = next.mint_requests[tokenDigest];
  if (tokenIdentity !== undefined && tokenIdentity !== ref.id) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.TOKEN_CONFLICT,
      'Mint request token is already bound to another identity',
    );
  }
  const existing = next.identities[ref.id];
  if (
    existing
    && (
      existing.ref.kind !== ref.kind
      || existing.mint_request_token_digest !== tokenDigest
      || existing.provenance_digest !== provenance
      || existing.parent_ref?.id !== parentRef?.id
      || existing.mint_relationship_kind !== relationshipKind
    )
  ) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.IDENTITY_COLLISION,
      'Opaque identity is already bound to different immutable provenance',
      { identityId: ref.id },
    );
  }
  if (!existing) {
    const record: ContinuityIdentityRecord = {
      ref,
      mint_request_token_digest: tokenDigest,
      provenance_digest: provenance,
      parent_ref: parentRef,
      mint_relationship_kind: relationshipKind,
      minted_event_id: event.effective.envelope.event_id,
    };
    next.identities[ref.id] = record;
    next.mint_requests[tokenDigest] = ref.id;
  }

  if (parentRef !== null && relationshipKind !== null) {
    bindRelationship(
      next,
      ref,
      parentRef,
      relationshipKind,
      event.effective.envelope.event_id,
    );
  }
  return next;
}

function reduceAlias(
  state: Readonly<ContinuityIdentityState>,
  event: Readonly<EventReadResult>,
): ContinuityIdentityState {
  const next = cloneState(state);
  const payload = eventPayload(event);
  const ref = requireRegisteredIdentity(next, payload.subject_ref);
  const namespace = validateAliasNamespace(payload.alias_namespace);
  const digest = payload.alias_digest as string;
  const key = aliasKey(namespace, digest);
  const existing = next.aliases[key];
  if (existing !== undefined && existing !== ref.id) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.ALIAS_AMBIGUOUS,
      'Legacy alias resolves to more than one logical identity',
    );
  }
  next.aliases[key] = ref.id;
  return next;
}

function reduceRelationship(
  state: Readonly<ContinuityIdentityState>,
  event: Readonly<EventReadResult>,
): ContinuityIdentityState {
  const next = cloneState(state);
  const payload = eventPayload(event);
  const subject = validateIdentityRef(payload.subject_ref);
  bindRelationship(
    next,
    subject,
    validateIdentityRef(payload.related_ref, subject.kind),
    payload.relationship_kind as ContinuityRelationshipKind,
    event.effective.envelope.event_id,
  );
  return next;
}

function reduceAttempt(
  state: Readonly<ContinuityIdentityState>,
  event: Readonly<EventReadResult>,
): ContinuityIdentityState {
  const next = cloneState(state);
  const payload = eventPayload(event);
  const ref = requireRegisteredIdentity(
    next,
    payload.mode_session_ref,
    ContinuityIdentityKinds.MODE_SESSION,
  );
  const attemptId = requireBoundedId(payload.attempt_id, 'attempt_id');
  const attemptNumber = payload.attempt_number as number;
  const transition = payload.transition as ContinuityAttemptTransition;
  const attempts = next.attempts[ref.id] ?? [];
  const exact = attempts.find((attempt) => attempt.attempt_id === attemptId);
  if (exact) {
    if (exact.attempt_number === attemptNumber && exact.transition === transition) return next;
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.ATTEMPT_CONFLICT,
      'Attempt identity is already bound to different metadata',
      { identityId: ref.id },
    );
  }
  if (attemptNumber !== attempts.length + 1 || (attemptNumber === 1) !== (transition === 'new')) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.ATTEMPT_CONFLICT,
      'Attempt sequence or lifecycle transition is not contiguous',
      { identityId: ref.id, attemptNumber },
    );
  }
  const record: ContinuityAttemptRecord = {
    mode_session_ref: ref,
    attempt_id: attemptId,
    attempt_number: attemptNumber,
    transition,
    event_id: event.effective.envelope.event_id,
  };
  next.attempts[ref.id] = [...attempts, record];
  return next;
}

function reduceCrossMode(
  state: Readonly<ContinuityIdentityState>,
  event: Readonly<EventReadResult>,
): ContinuityIdentityState {
  const next = cloneState(state);
  const payload = eventPayload(event);
  const subject = requireRegisteredIdentity(next, payload.subject_ref);
  const source = requireRegisteredIdentity(
    next,
    payload.source_mode_session_ref,
    ContinuityIdentityKinds.MODE_SESSION,
  );
  const target = requireRegisteredIdentity(
    next,
    payload.target_mode_session_ref,
    ContinuityIdentityKinds.MODE_SESSION,
  );
  const sourceMode = validateContinuityMode(payload.source_mode);
  const targetMode = validateContinuityMode(payload.target_mode);
  const existing = next.cross_mode_references.find((reference) => (
    reference.subject_ref.id === subject.id
    && reference.source_mode_session_ref.id === source.id
    && reference.target_mode_session_ref.id === target.id
    && reference.source_mode === sourceMode
    && reference.target_mode === targetMode
  ));
  if (existing) return next;
  const record: ContinuityCrossModeRecord = {
    subject_ref: subject,
    source_mode_session_ref: source,
    target_mode_session_ref: target,
    source_mode: sourceMode,
    target_mode: targetMode,
    event_id: event.effective.envelope.event_id,
  };
  next.cross_mode_references.push(record);
  return next;
}

/** Build the exact typed reducer set consumed by ledger replay and fingerprints. */
export function createContinuityIdentityReducerRegistry(): TypedReducerRegistry<ContinuityIdentityState> {
  const definitions: TypedReducerDefinition<ContinuityIdentityState>[] = [
    {
      eventType: CONTINUITY_IDENTITY_MINTED_EVENT,
      reducerVersion: CONTINUITY_REDUCER_VERSION,
      reduce: reduceMint,
    },
    {
      eventType: CONTINUITY_ALIAS_BOUND_EVENT,
      reducerVersion: CONTINUITY_REDUCER_VERSION,
      reduce: reduceAlias,
    },
    {
      eventType: CONTINUITY_RELATIONSHIP_BOUND_EVENT,
      reducerVersion: CONTINUITY_REDUCER_VERSION,
      reduce: reduceRelationship,
    },
    {
      eventType: CONTINUITY_ATTEMPT_RECORDED_EVENT,
      reducerVersion: CONTINUITY_REDUCER_VERSION,
      reduce: reduceAttempt,
    },
    {
      eventType: CONTINUITY_CROSS_MODE_REFERENCED_EVENT,
      reducerVersion: CONTINUITY_REDUCER_VERSION,
      reduce: reduceCrossMode,
    },
  ];
  return new TypedReducerRegistry(definitions);
}

/** Bind the continuity reducer and projection schema into replay identity. */
export function createContinuityReplayComponentRegistry(): ReplayComponentRegistry<ContinuityIdentityState> {
  const definition: ReplayComponentDefinition<ContinuityIdentityState> = {
    reducerId: CONTINUITY_REDUCER_ID,
    reducerVersion: CONTINUITY_REDUCER_VERSION,
    projectionSchemaVersion: CONTINUITY_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: [INITIAL_STATE_REPLAY_INPUT],
    reducerRegistry: createContinuityIdentityReducerRegistry(),
  };
  return new ReplayComponentRegistry([definition]);
}

export function createContinuityFingerprintVersionRegistry(): FingerprintVersionRegistry {
  return createReplayFingerprintVersionRegistry();
}

export function continuityInitialState(): ContinuityIdentityState {
  return createEmptyContinuityIdentityState();
}

// ───────────────────────────────────────────────────────────────────
// 4. AUTHORIZATION POLICY
// ───────────────────────────────────────────────────────────────────

function evaluateContinuityPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  const isDarkAuthority = input.authorityState === 'legacy_authoritative'
    || input.authorityState === 'shadowing';
  const isAllowed = isDarkAuthority
    && input.capabilityId === CONTINUITY_WRITE_CAPABILITY
    && CONTINUITY_EVENT_TYPE_SET.has(input.requestedEventType);
  return isAllowed
    ? {
      verdict: AuthorizationVerdicts.ALLOW,
      reasonCode: AuthorizationReasonCodes.ALLOWED,
      matchedRuleIds: ['dark-authority', 'typed-continuity-event', 'write-capability'],
    }
    : {
      verdict: AuthorizationVerdicts.DENY,
      reasonCode: AuthorizationReasonCodes.POLICY_DENIED,
      matchedRuleIds: ['dark-authority', 'typed-continuity-event', 'write-capability'],
    };
}

/** Create the dark-only policy and its exact immutable reference. */
export function createContinuityIdentityPolicyRegistry(): {
  readonly registry: TransitionPolicyRegistry;
  readonly reference: PolicyReference;
} {
  const registry = new TransitionPolicyRegistry([{
    policyId: CONTINUITY_POLICY_ID,
    policyVersion: CONTINUITY_POLICY_VERSION,
    evaluatorVersion: '1',
    ruleIds: ['dark-authority', 'typed-continuity-event', 'write-capability'],
    evaluate: evaluateContinuityPolicy,
  }]);
  const policy = registry.resolve(CONTINUITY_POLICY_ID, CONTINUITY_POLICY_VERSION);
  return Object.freeze({
    registry,
    reference: Object.freeze({
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    }),
  });
}
