// ───────────────────────────────────────────────────────────────────
// MODULE: Lock Lifecycle Evidence
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  prepareEventWrite,
} from '../event-envelope/index.js';
import {
  LocksAndFencingError,
  LocksAndFencingErrorCodes,
} from './locks-and-fencing-errors.js';
import {
  AtomicityDomains,
  LockLifecycleActions,
} from './locks-and-fencing-types.js';

import type {
  DurableAppendReceipt,
  TransitionAuthorizationRequest,
  TypedReducerDefinition,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventReadResult,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  LockLifecycleAction,
  LockLifecycleDecision,
  ReplayIdentity,
} from './locks-and-fencing-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. EVENT CONTRACT
// ───────────────────────────────────────────────────────────────────

export const LOCK_LIFECYCLE_EVENT_TYPE = 'deep-loop.lock.lifecycle-recorded';

const PAYLOAD_FIELDS = new Set([
  'action',
  'reason',
  'resource_key_digest',
  'fence_token',
  'lease_id',
  'owner_id',
  'correlation_id',
  'atomicity_domain',
  'latency_ms',
  'replay_fingerprint',
  'observed_at',
]);
const ACTIONS = new Set<LockLifecycleAction>(Object.values(LockLifecycleActions));
const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;

export interface LockLifecycleEvidencePayload extends JsonObject {
  readonly action: LockLifecycleAction;
  readonly reason: string;
  readonly resource_key_digest: string;
  readonly fence_token: number;
  readonly lease_id: string | null;
  readonly owner_id: string;
  readonly correlation_id: string;
  readonly atomicity_domain: string;
  readonly latency_ms: number;
  readonly replay_fingerprint: string | null;
  readonly observed_at: string;
}

export interface LockLifecycleEnvelopeInput {
  readonly eventId: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKey: string;
}

export interface LockLifecycleEvidenceReceipt {
  readonly decisionId: string;
  readonly receipt: DurableAppendReceipt;
}

export interface VerifiedLockLifecycleEvidence {
  readonly sequence: number;
  readonly payload: LockLifecycleEvidencePayload;
}

export interface LockLifecycleProjection extends JsonObject {
  readonly totalEvents: number;
  readonly actionCounts: JsonObject;
  readonly latestFenceByResource: JsonObject;
  readonly lastCorrelationByResource: JsonObject;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 4_096;
}

function hasExactFields(payload: Readonly<JsonObject>): boolean {
  const fields = Object.keys(payload);
  return fields.length === PAYLOAD_FIELDS.size
    && fields.every((field) => PAYLOAD_FIELDS.has(field));
}

function validateLockLifecyclePayload(payload: Readonly<JsonObject>): boolean {
  return hasExactFields(payload)
    && ACTIONS.has(payload.action as LockLifecycleAction)
    && isNonEmptyString(payload.reason)
    && typeof payload.resource_key_digest === 'string'
    && DIGEST_PATTERN.test(payload.resource_key_digest)
    && typeof payload.fence_token === 'number'
    && Number.isSafeInteger(payload.fence_token)
    && payload.fence_token >= 0
    && (payload.lease_id === null || isNonEmptyString(payload.lease_id))
    && isNonEmptyString(payload.owner_id)
    && isNonEmptyString(payload.correlation_id)
    && payload.atomicity_domain === AtomicityDomains.SINGLE_HOST_FILESYSTEM
    && typeof payload.latency_ms === 'number'
    && Number.isSafeInteger(payload.latency_ms)
    && payload.latency_ms >= 0
    && (
      payload.replay_fingerprint === null
      || (
        typeof payload.replay_fingerprint === 'string'
        && DIGEST_PATTERN.test(payload.replay_fingerprint)
      )
    )
    && typeof payload.observed_at === 'string'
    && Number.isFinite(Date.parse(payload.observed_at));
}

/** Return the typed definition callers add to their frozen envelope registry. */
export function lockLifecycleEventDefinition(): EventTypeDefinition {
  return {
    eventType: LOCK_LIFECYCLE_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: Array.from(PAYLOAD_FIELDS),
        validate: validateLockLifecyclePayload,
      },
    }],
    upcasters: [],
  };
}

/** Create a schema-closed registry for standalone lock evidence ledgers. */
export function createLockLifecycleEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry([lockLifecycleEventDefinition()]);
}

/** Add a verified replay commitment to a lock decision without changing its authority. */
export function bindReplayIdentity(
  decision: LockLifecycleDecision,
  replayIdentity: ReplayIdentity,
): LockLifecycleDecision {
  return Object.freeze({
    ...decision,
    replayFingerprint: replayIdentity.finalDigest,
  });
}

/** Build validated canonical event bytes through the shared envelope boundary. */
export function prepareLockLifecycleEvidence(
  decision: LockLifecycleDecision,
  registry: EventTypeRegistry,
  envelope: LockLifecycleEnvelopeInput,
): EventWritePreflight {
  const payload: LockLifecycleEvidencePayload = {
    action: decision.action,
    reason: decision.reason,
    resource_key_digest: decision.resourceDigest,
    fence_token: decision.fenceToken,
    lease_id: decision.leaseId,
    owner_id: decision.ownerId,
    correlation_id: decision.correlationId,
    atomicity_domain: decision.atomicityDomain,
    latency_ms: decision.latencyMs,
    replay_fingerprint: decision.replayFingerprint,
    observed_at: decision.observedAt,
  };
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: envelope.eventId,
    event_type: LOCK_LIFECYCLE_EVENT_TYPE,
    event_version: 1,
    stream_id: envelope.streamId,
    stream_sequence: envelope.streamSequence,
    occurred_at: envelope.occurredAt,
    recorded_at: envelope.recordedAt,
    producer: envelope.producer,
    authority_epoch: envelope.authorityEpoch,
    correlation_id: envelope.correlationId,
    causation_id: envelope.causationId,
    idempotency_key: envelope.idempotencyKey,
    payload,
  }, registry);
}

// ───────────────────────────────────────────────────────────────────
// 2. AUTHORIZED RECORDING AND READING
// ───────────────────────────────────────────────────────────────────

/**
 * Authorize and append observational evidence without a lease requirement.
 *
 * This path can only append a canonical event through the authorization gateway and the
 * ledger's atomic head check. It has no coordinator-state or protected-state capability,
 * so recording evidence cannot grant, renew, release, or mutate a fenced resource.
 */
export async function recordLockLifecycleEvidence(
  ledger: AppendOnlyLedger,
  gateway: TransitionAuthorizationGateway,
  event: EventWritePreflight,
  request: TransitionAuthorizationRequest,
): Promise<LockLifecycleEvidenceReceipt> {
  if (
    event.envelope.event_type !== LOCK_LIFECYCLE_EVENT_TYPE
    || event.envelope.event_version !== 1
    || request.event.canonicalDigest !== event.canonicalDigest
  ) {
    throw new LocksAndFencingError(
      LocksAndFencingErrorCodes.EVIDENCE_DENIED,
      'evidence',
      'Lock evidence request is not bound to the supplied typed event',
      { eventType: event.envelope.event_type },
    );
  }
  const authorization = await gateway.authorize(request);
  if (authorization.verdict !== 'allow') {
    throw new LocksAndFencingError(
      LocksAndFencingErrorCodes.EVIDENCE_DENIED,
      'evidence',
      'Authorization gateway denied lock lifecycle evidence',
      { reasonCode: authorization.reasonCode },
    );
  }
  const receipt = await ledger.appendAuthorized(event, authorization.proof);
  return Object.freeze({
    decisionId: authorization.decision.decision_id,
    receipt,
  });
}

/** Read only verified ledger events and narrow the registered lock payloads. */
export async function readLockLifecycleEvidence(
  ledger: AppendOnlyLedger,
): Promise<readonly VerifiedLockLifecycleEvidence[]> {
  const verified = await ledger.readVerifiedEvents();
  const evidence: VerifiedLockLifecycleEvidence[] = [];
  for (const entry of verified) {
    if (entry.event.effective.envelope.event_type !== LOCK_LIFECYCLE_EVENT_TYPE) continue;
    const payload = parseLockLifecycleEvidencePayload(
      entry.event.effective.envelope.payload,
    );
    evidence.push(Object.freeze({ sequence: entry.frame.sequence, payload }));
  }
  return Object.freeze(evidence);
}

/** Narrow a registry-validated payload to the closed evidence schema. */
export function parseLockLifecycleEvidencePayload(
  payload: Readonly<JsonObject>,
): LockLifecycleEvidencePayload {
  if (!validateLockLifecyclePayload(payload)) {
    throw new LocksAndFencingError(
      LocksAndFencingErrorCodes.MALFORMED_STATE,
      'evidence',
      'Lock lifecycle payload does not match its closed schema',
      {},
    );
  }
  return Object.freeze({ ...payload }) as LockLifecycleEvidencePayload;
}

// ───────────────────────────────────────────────────────────────────
// 3. DETERMINISTIC REDUCER
// ───────────────────────────────────────────────────────────────────

/** Return the empty projection used before replaying verified evidence. */
export function initialLockLifecycleProjection(): LockLifecycleProjection {
  return Object.freeze({
    totalEvents: 0,
    actionCounts: Object.freeze({}),
    latestFenceByResource: Object.freeze({}),
    lastCorrelationByResource: Object.freeze({}),
  });
}

/** Build the pure reducer registered against the typed lock event. */
export function lockLifecycleReducerDefinition(): TypedReducerDefinition<LockLifecycleProjection> {
  return {
    eventType: LOCK_LIFECYCLE_EVENT_TYPE,
    reducerVersion: '1',
    reduce: reduceLockLifecycleEvidence,
  };
}

function reduceLockLifecycleEvidence(
  state: Readonly<LockLifecycleProjection>,
  event: Readonly<EventReadResult>,
): LockLifecycleProjection {
  const payload = parseLockLifecycleEvidencePayload(event.effective.envelope.payload);
  const priorCount = state.actionCounts[payload.action];
  const actionCount = typeof priorCount === 'number' ? priorCount : 0;
  const priorFence = state.latestFenceByResource[payload.resource_key_digest];
  const latestFence = typeof priorFence === 'number'
    ? Math.max(priorFence, payload.fence_token)
    : payload.fence_token;
  return Object.freeze({
    totalEvents: state.totalEvents + 1,
    actionCounts: Object.freeze({
      ...state.actionCounts,
      [payload.action]: actionCount + 1,
    }),
    latestFenceByResource: Object.freeze({
      ...state.latestFenceByResource,
      [payload.resource_key_digest]: latestFence,
    }),
    lastCorrelationByResource: Object.freeze({
      ...state.lastCorrelationByResource,
      [payload.resource_key_digest]: payload.correlation_id,
    }),
  });
}
