import {
  AuthorizationVerdicts,
} from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  PolicyReference,
  TransitionAuthorizationGateway,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type { FinalizedFanInDecision } from './types.js';

export const FANIN_DECISION_FINALIZED_EVENT_TYPE = 'fanout.fanin.decision-finalized';
export const FANIN_DECISION_FINALIZED_EVENT_VERSION = 1;
export const FANIN_DECISION_FINALIZED_EVENT_NAME = 'fan-in-decision-finalized';

const REQUIRED_FIELDS = Object.freeze([
  'event_name',
  'decision_version',
  'decision_id',
  'run_id',
  'wave_id',
  'event_cut_sequence',
  'event_cut_record_hash',
  'policy_digest',
  'replay_fingerprint',
  'reducer_input_digest',
  'decision_digest',
  'decision',
] as const);

export interface FanInDecisionFinalizedPayload extends JsonObject {
  readonly event_name: typeof FANIN_DECISION_FINALIZED_EVENT_NAME;
  readonly decision_version: 1;
  readonly decision_id: string;
  readonly run_id: string;
  readonly wave_id: string;
  readonly event_cut_sequence: number;
  readonly event_cut_record_hash: string;
  readonly policy_digest: string;
  readonly replay_fingerprint: string;
  readonly reducer_input_digest: string;
  readonly decision_digest: string;
  readonly decision: JsonObject;
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateFanInDecisionFinalizedPayload(
  payload: Readonly<JsonObject>,
): payload is FanInDecisionFinalizedPayload {
  if (Object.keys(payload).length !== REQUIRED_FIELDS.length) return false;
  if (!REQUIRED_FIELDS.every((field) => Object.hasOwn(payload, field))) return false;
  if (
    payload.event_name !== FANIN_DECISION_FINALIZED_EVENT_NAME
    || payload.decision_version !== FANIN_DECISION_FINALIZED_EVENT_VERSION
    || typeof payload.decision_id !== 'string'
    || typeof payload.run_id !== 'string'
    || typeof payload.wave_id !== 'string'
    || !Number.isSafeInteger(payload.event_cut_sequence)
    || typeof payload.event_cut_record_hash !== 'string'
    || typeof payload.policy_digest !== 'string'
    || typeof payload.replay_fingerprint !== 'string'
    || typeof payload.reducer_input_digest !== 'string'
    || typeof payload.decision_digest !== 'string'
    || !isObject(payload.decision)
  ) return false;
  const { decisionDigest: ignored, ...decisionBody } = payload.decision;
  void ignored;
  return sha256Bytes(canonicalBytes(decisionBody)) === payload.decision_digest
    && payload.decision.decisionDigest === payload.decision_digest
    && payload.decision.decisionId === payload.decision_id
    && payload.decision.runId === payload.run_id
    && payload.decision.waveId === payload.wave_id
    && payload.decision.policyDigest === payload.policy_digest
    && payload.decision.replayFingerprint === payload.replay_fingerprint
    && payload.decision.reducerInputDigest === payload.reducer_input_digest
    && isObject(payload.decision.cut)
    && payload.decision.cut.sequence === payload.event_cut_sequence
    && payload.decision.cut.recordHash === payload.event_cut_record_hash;
}

export function fanInDecisionEventDefinition(): EventTypeDefinition {
  return {
    eventType: FANIN_DECISION_FINALIZED_EVENT_TYPE,
    currentVersion: FANIN_DECISION_FINALIZED_EVENT_VERSION,
    versions: [{
      version: FANIN_DECISION_FINALIZED_EVENT_VERSION,
      payload: {
        requiredFields: REQUIRED_FIELDS,
        optionalFields: [],
        validate: validateFanInDecisionFinalizedPayload,
      },
    }],
    upcasters: [],
  };
}

export function createConditionalFanInEventRegistry(
  additionalDefinitions: readonly EventTypeDefinition[] = [],
): EventTypeRegistry {
  return new EventTypeRegistry([
    ...additionalDefinitions,
    fanInDecisionEventDefinition(),
  ]);
}

export function fanInDecisionPayload(
  decision: FinalizedFanInDecision,
): FanInDecisionFinalizedPayload {
  const payload: FanInDecisionFinalizedPayload = {
    event_name: FANIN_DECISION_FINALIZED_EVENT_NAME,
    decision_version: FANIN_DECISION_FINALIZED_EVENT_VERSION,
    decision_id: decision.decisionId,
    run_id: decision.runId,
    wave_id: decision.waveId,
    event_cut_sequence: decision.cut.sequence,
    event_cut_record_hash: decision.cut.recordHash,
    policy_digest: decision.policyDigest,
    replay_fingerprint: decision.replayFingerprint,
    reducer_input_digest: decision.reducerInputDigest,
    decision_digest: decision.decisionDigest,
    decision: decision as unknown as JsonObject,
  };
  if (!validateFanInDecisionFinalizedPayload(payload)) {
    throw new TypeError('Finalized fan-in decision does not satisfy its event schema');
  }
  return Object.freeze(payload);
}

export interface PrepareFanInDecisionEventInput {
  readonly decision: FinalizedFanInDecision;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly registry: EventTypeRegistry;
}

export function prepareFanInDecisionEvent(
  input: PrepareFanInDecisionEventInput,
): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: input.decision.decisionId,
    event_type: FANIN_DECISION_FINALIZED_EVENT_TYPE,
    event_version: FANIN_DECISION_FINALIZED_EVENT_VERSION,
    stream_id: input.streamId,
    stream_sequence: input.streamSequence,
    occurred_at: input.occurredAt,
    recorded_at: input.recordedAt,
    producer: input.producer,
    authority_epoch: input.authorityEpoch,
    correlation_id: input.correlationId,
    causation_id: input.causationId,
    idempotency_key: input.decision.decisionId,
    payload: fanInDecisionPayload(input.decision),
  }, input.registry);
}

export interface CommitFanInDecisionInput extends PrepareFanInDecisionEventInput {
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly policy: PolicyReference;
  readonly mode: string;
  readonly actorId: string;
  readonly capabilityId: string;
}

export async function commitFanInDecision(
  input: CommitFanInDecisionInput,
): Promise<DurableAppendReceipt> {
  if (
    input.ledger.ledgerId !== input.decision.cut.ledgerId
    || input.ledger.registryDigest !== input.decision.cut.registryDigest
  ) {
    throw new TypeError('Decision cut is bound to a different ledger or event registry');
  }
  const priorHead = await input.ledger.getVerifiedHead();
  if (
    priorHead.sequence !== input.decision.cut.sequence
    || priorHead.recordHash !== input.decision.cut.recordHash
  ) {
    throw new TypeError('Decision event cut is stale; rebuild a new authorized decision');
  }
  const event = prepareFanInDecisionEvent(input);
  const requestId = `fanin-authorize:${sha256Bytes(canonicalBytes({
    decision_id: input.decision.decisionId,
    event_digest: event.canonicalDigest,
    cut: input.decision.cut,
  }))}`;
  const authorization = await input.gateway.authorize({
    requestId,
    mode: input.mode,
    event,
    priorHead,
    priorStateVersion: String(input.decision.decisionVersion),
    priorStateFingerprint: input.decision.reducerInputDigest,
    actorId: input.actorId,
    capabilityId: input.capabilityId,
    authorityEpoch: input.authorityEpoch,
    policy: input.policy,
    evidenceDigest: input.decision.decisionDigest,
  });
  if (authorization.verdict !== AuthorizationVerdicts.ALLOW) {
    throw new TypeError(`Fan-in decision authorization denied: ${authorization.reasonCode}`);
  }
  return input.ledger.appendAuthorized(event, authorization.proof);
}
