// ───────────────────────────────────────────────────────────────────
// MODULE: Value of Computation Allocation Events
// ───────────────────────────────────────────────────────────────────

import {
  constants as zlibConstants,
  deflateRawSync,
  inflateRawSync,
} from 'node:zlib';

import { AuthorizationVerdicts } from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  MAX_CANONICAL_BYTES,
  canonicalBytes,
  canonicalJson,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import { VOC_ALLOCATION_DECISION_VERSION } from './decision.js';

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  PolicyReference,
  TransitionAuthorizationGateway,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type { VocAllocationDecision } from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. EVENT CONTRACT
// ───────────────────────────────────────────────────────────────────

export const VOC_ALLOCATION_DECISION_EVENT_TYPE = 'allocation.voc.shadow-decided';
export const VOC_ALLOCATION_DECISION_EVENT_VERSION = 1;
export const VOC_ALLOCATION_DECISION_EVENT_NAME = 'allocation.voc_shadow_decided';
export const VOC_ALLOCATION_DECISION_CODEC = 'canonical-json+deflate-raw-fixed@1';

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const REQUIRED_FIELDS = Object.freeze([
  'decision_codec',
  'decision_data',
  'decision_digest',
  'decision_id',
] as const);

/** Closed payload containing the complete shadow decision and assessments. */
export interface VocAllocationDecisionPayload extends JsonObject {
  readonly decision_codec: typeof VOC_ALLOCATION_DECISION_CODEC;
  readonly decision_data: string;
  readonly decision_digest: string;
  readonly decision_id: string;
}

function isObject(value: unknown): value is JsonObject {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function deepFreezeJson<T extends JsonValue>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach((entry) => deepFreezeJson(entry));
    Object.freeze(value);
  }
  return value;
}

/** Fixed Huffman coding keeps complete evidence below the authorization preflight node ceiling. */
function encodeDecision(decision: VocAllocationDecision): string {
  return deflateRawSync(Buffer.from(canonicalJson(decision), 'utf8'), {
    level: 9,
    strategy: zlibConstants.Z_FIXED,
  }).toString('base64');
}

/** Recover and validate the complete immutable decision retained by an event. */
export function decodeVocAllocationDecisionPayload(
  payload: Readonly<VocAllocationDecisionPayload>,
): VocAllocationDecision {
  if (
    payload.decision_codec !== VOC_ALLOCATION_DECISION_CODEC
    || typeof payload.decision_data !== 'string'
    || payload.decision_data === ''
    || Buffer.from(payload.decision_data, 'base64').toString('base64')
      !== payload.decision_data
  ) {
    throw new TypeError('VOC allocation decision codec or canonical base64 is invalid');
  }
  let serialized: string;
  try {
    serialized = inflateRawSync(Buffer.from(payload.decision_data, 'base64'), {
      maxOutputLength: MAX_CANONICAL_BYTES,
    }).toString('utf8');
  } catch {
    throw new TypeError('VOC allocation decision data cannot be decoded');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    throw new TypeError('VOC allocation decision data is not JSON');
  }
  if (!isObject(parsed)) {
    throw new TypeError('VOC allocation decision data must contain one JSON object');
  }
  const decision = deepFreezeJson(parsed);
  if (canonicalJson(decision) !== serialized) {
    throw new TypeError('VOC allocation decision data is not canonical JSON');
  }
  return decision as unknown as VocAllocationDecision;
}

/** Validate the closed event payload and its internal decision commitment. */
export function validateVocAllocationDecisionPayload(
  payload: Readonly<JsonObject>,
): payload is VocAllocationDecisionPayload {
  if (
    Object.keys(payload).length !== REQUIRED_FIELDS.length
    || !REQUIRED_FIELDS.every((field) => Object.hasOwn(payload, field))
    || payload.decision_codec !== VOC_ALLOCATION_DECISION_CODEC
    || typeof payload.decision_data !== 'string'
    || typeof payload.decision_digest !== 'string'
    || !HASH_PATTERN.test(payload.decision_digest)
    || typeof payload.decision_id !== 'string'
  ) {
    return false;
  }
  let decision: VocAllocationDecision;
  try {
    decision = decodeVocAllocationDecisionPayload(
      payload as Readonly<VocAllocationDecisionPayload>,
    );
  } catch {
    return false;
  }
  const {
    decisionDigest: ignoredDigest,
    decisionId: ignoredId,
    ...decisionBody
  } = decision;
  void ignoredDigest;
  void ignoredId;
  return sha256Bytes(canonicalBytes(decisionBody)) === payload.decision_digest
    && decision.decisionDigest === payload.decision_digest
    && decision.decisionId === payload.decision_id
    && decision.decisionVersion === VOC_ALLOCATION_DECISION_EVENT_VERSION
    && typeof decision.runId === 'string'
    && typeof decision.replayFingerprint === 'string'
    && HASH_PATTERN.test(decision.replayFingerprint)
    && isObject(decision.eventCut)
    && isObject(decision.policy)
    && typeof decision.policy.policyDigest === 'string'
    && HASH_PATTERN.test(decision.policy.policyDigest)
    && decision.authority === 'shadow'
    && decision.authoritativeAllocationPath === 'uniform-static'
    && decision.authoritativeDispatchMoved === false
    && decision.converged === false;
}

/** Return the event definition for allocation decision ledgers. */
export function vocAllocationDecisionEventDefinition(): EventTypeDefinition {
  return {
    eventType: VOC_ALLOCATION_DECISION_EVENT_TYPE,
    currentVersion: VOC_ALLOCATION_DECISION_EVENT_VERSION,
    versions: [{
      version: VOC_ALLOCATION_DECISION_EVENT_VERSION,
      payload: {
        requiredFields: REQUIRED_FIELDS,
        optionalFields: [],
        validate: validateVocAllocationDecisionPayload,
      },
    }],
    upcasters: [],
  };
}

/** Compose the allocation event with any caller-owned event definitions. */
export function createVocAllocationEventRegistry(
  additionalDefinitions: readonly EventTypeDefinition[] = [],
): EventTypeRegistry {
  return new EventTypeRegistry([
    ...additionalDefinitions,
    vocAllocationDecisionEventDefinition(),
  ]);
}

/** Build and validate the canonical decision-event payload. */
export function vocAllocationDecisionPayload(
  decision: VocAllocationDecision,
): VocAllocationDecisionPayload {
  const payload: VocAllocationDecisionPayload = {
    decision_codec: VOC_ALLOCATION_DECISION_CODEC,
    decision_data: encodeDecision(decision),
    decision_digest: decision.decisionDigest,
    decision_id: decision.decisionId,
  };
  if (!validateVocAllocationDecisionPayload(payload)) {
    throw new TypeError('VOC allocation decision does not satisfy its event schema');
  }
  return Object.freeze(payload);
}

// ───────────────────────────────────────────────────────────────────
// 2. PREPARE AND COMMIT
// ───────────────────────────────────────────────────────────────────

/** Envelope metadata required to prepare one allocation decision event. */
export interface PrepareVocAllocationDecisionEventInput {
  readonly authorityEpoch: number;
  readonly causationId: string | null;
  readonly correlationId: string;
  readonly decision: VocAllocationDecision;
  readonly occurredAt: string;
  readonly producer: EventProducer;
  readonly recordedAt: string;
  readonly registry: EventTypeRegistry;
  readonly streamId: string;
  readonly streamSequence: number;
}

/** Prepare one current-version event without appending it. */
export function prepareVocAllocationDecisionEvent(
  input: PrepareVocAllocationDecisionEventInput,
): EventWritePreflight {
  return prepareEventWrite({
    authority_epoch: input.authorityEpoch,
    causation_id: input.causationId,
    correlation_id: input.correlationId,
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: input.decision.decisionId,
    event_type: VOC_ALLOCATION_DECISION_EVENT_TYPE,
    event_version: VOC_ALLOCATION_DECISION_EVENT_VERSION,
    idempotency_key: input.decision.decisionId,
    occurred_at: input.occurredAt,
    payload: vocAllocationDecisionPayload(input.decision),
    producer: input.producer,
    recorded_at: input.recordedAt,
    stream_id: input.streamId,
    stream_sequence: input.streamSequence,
  }, input.registry);
}

/** Dependencies and authority evidence for one ledgered shadow decision. */
export interface CommitVocAllocationDecisionInput {
  readonly actorId: string;
  readonly authorityEpoch: number;
  readonly capabilityId: string;
  readonly causationId: string | null;
  readonly correlationId: string;
  readonly decision: VocAllocationDecision;
  readonly gateway: TransitionAuthorizationGateway;
  readonly ledger: AppendOnlyLedger;
  readonly mode: string;
  readonly occurredAt: string;
  readonly policy: PolicyReference;
  readonly producer: EventProducer;
  readonly recordedAt: string;
  readonly registry: EventTypeRegistry;
  readonly streamId: string;
}

function durableReceipt(event: VerifiedLedgerEvent): DurableAppendReceipt {
  return Object.freeze({
    ...event.frame.receipt,
    authorizationRef: event.frame.authorization_ref,
    canonicalEventHash: event.frame.canonical_event_hash,
    recordHash: event.frame.record_hash,
  });
}

/** Authorize and append one shadow decision through the immutable ledger boundary. */
export async function commitVocAllocationDecision(
  input: CommitVocAllocationDecisionInput,
): Promise<DurableAppendReceipt> {
  if (
    input.ledger.registryDigest !== input.registry.digest
    || input.ledger.ledgerId.trim() === ''
  ) {
    throw new TypeError('VOC allocation ledger and event registry must match exactly');
  }
  const existingEvents = await input.ledger.readVerifiedEvents();
  const existing = existingEvents.find((event) => (
    event.event.effective.envelope.event_id === input.decision.decisionId
  ));
  if (existing) {
    const existingPayload = existing.event.effective.envelope.payload;
    if (
      !validateVocAllocationDecisionPayload(existingPayload)
      || existingPayload.decision_digest !== input.decision.decisionDigest
    ) {
      throw new TypeError('VOC decision identity is already bound to another digest');
    }
    return durableReceipt(existing);
  }

  const priorHead = await input.ledger.getVerifiedHead();
  const event = prepareVocAllocationDecisionEvent({
    authorityEpoch: input.authorityEpoch,
    causationId: input.causationId,
    correlationId: input.correlationId,
    decision: input.decision,
    occurredAt: input.occurredAt,
    producer: input.producer,
    recordedAt: input.recordedAt,
    registry: input.registry,
    streamId: input.streamId,
    streamSequence: priorHead.sequence + 1,
  });
  const requestId = `voc-allocation-authorize:${sha256Bytes(canonicalBytes({
    decisionDigest: input.decision.decisionDigest,
    eventDigest: event.canonicalDigest,
    priorHead,
  }))}`;
  const authorization = await input.gateway.authorize({
    actorId: input.actorId,
    authorityEpoch: input.authorityEpoch,
    capabilityId: input.capabilityId,
    event,
    evidenceDigest: input.decision.decisionDigest,
    mode: input.mode,
    policy: input.policy,
    priorHead,
    priorStateFingerprint: priorHead.recordHash,
    priorStateVersion: `voc-allocation-decision@${VOC_ALLOCATION_DECISION_VERSION}`,
    requestId,
  });
  if (authorization.verdict !== AuthorizationVerdicts.ALLOW) {
    throw new TypeError(`VOC allocation authorization denied: ${authorization.reasonCode}`);
  }
  return input.ledger.appendAuthorized(event, authorization.proof);
}
