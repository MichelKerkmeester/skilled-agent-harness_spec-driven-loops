// ───────────────────────────────────────────────────────────────────
// MODULE: Hierarchical Budget Events
// ───────────────────────────────────────────────────────────────────

import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';

import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export const BudgetEventTypes = Object.freeze({
  SCOPE_CREATED: 'budget.scope.created',
  CHILD_ALLOCATED: 'budget.child.allocated',
  RESERVATION_GRANTED: 'budget.reservation.granted',
  RESERVATION_DENIED: 'budget.reservation.denied',
  RESERVATION_RENEWED: 'budget.reservation.renewed',
  RESERVATION_RELEASED: 'budget.reservation.released',
  RESERVATION_CANCELLED: 'budget.reservation.cancelled',
  RESERVATION_EXPIRED: 'budget.reservation.expired',
  SPEND_COMMITTED: 'budget.spend.committed',
  EXHAUSTION_RECORDED: 'budget.exhaustion.recorded',
  RECONCILIATION_RECORDED: 'budget.reconciliation.recorded',
  ANOMALY_RECORDED: 'budget.anomaly.recorded',
} as const);

export type BudgetEventType = typeof BudgetEventTypes[keyof typeof BudgetEventTypes];

/** Closed common payload retained by every budget lifecycle event. */
export interface BudgetLifecyclePayload extends JsonObject {
  readonly operation_id: string;
  readonly request_id: string;
  readonly scope_id: string;
  readonly scope_path: string[];
  readonly replay_fingerprint: string;
  readonly reason_code: string;
  readonly before_balances: JsonObject;
  readonly after_balances: JsonObject;
  readonly data: JsonObject;
  readonly outcome: JsonObject;
}

export interface BudgetLifecycleEventInput {
  readonly eventType: BudgetEventType;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly payload: BudgetLifecyclePayload;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const BUDGET_EVENT_VERSION = 1;
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const PAYLOAD_FIELDS = Object.freeze([
  'operation_id',
  'request_id',
  'scope_id',
  'scope_path',
  'replay_fingerprint',
  'reason_code',
  'before_balances',
  'after_balances',
  'data',
  'outcome',
] as const);

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION
// ───────────────────────────────────────────────────────────────────

function isJsonObject(value: JsonValue | undefined): value is JsonObject {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isIdentity(value: JsonValue | undefined): value is string {
  return typeof value === 'string' && value.trim() !== '' && value.length <= 4_096;
}

function validateBudgetLifecyclePayload(payload: Readonly<JsonObject>): boolean {
  if (
    !isIdentity(payload.operation_id)
    || !isIdentity(payload.request_id)
    || !isIdentity(payload.scope_id)
    || !isIdentity(payload.reason_code)
    || typeof payload.replay_fingerprint !== 'string'
    || !HASH_PATTERN.test(payload.replay_fingerprint)
    || !Array.isArray(payload.scope_path)
    || payload.scope_path.length === 0
    || payload.scope_path.some((scopeId) => !isIdentity(scopeId))
    || !isJsonObject(payload.before_balances)
    || !isJsonObject(payload.after_balances)
    || !isJsonObject(payload.data)
    || !isJsonObject(payload.outcome)
  ) {
    return false;
  }
  return true;
}

function eventDefinition(eventType: BudgetEventType): EventTypeDefinition {
  return {
    eventType,
    currentVersion: BUDGET_EVENT_VERSION,
    versions: [{
      version: BUDGET_EVENT_VERSION,
      payload: {
        requiredFields: PAYLOAD_FIELDS,
        validate: validateBudgetLifecyclePayload,
      },
    }],
    upcasters: [],
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Create the validator-bound registry for the complete budget lifecycle. */
export function createBudgetEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry(Object.values(BudgetEventTypes).map(eventDefinition));
}

/** Validate one event payload after it crosses the shared read boundary. */
export function asBudgetLifecyclePayload(
  payload: Readonly<JsonObject>,
): BudgetLifecyclePayload {
  if (!validateBudgetLifecyclePayload(payload)) {
    throw new TypeError('Budget lifecycle payload does not match the closed schema');
  }
  return payload as BudgetLifecyclePayload;
}

/** Build canonical current-version bytes for one authorized budget append. */
export function prepareBudgetLifecycleEvent(
  input: BudgetLifecycleEventInput,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const identityDigest = sha256Bytes(canonicalBytes({
    eventType: input.eventType,
    requestId: input.payload.request_id,
    operationId: input.payload.operation_id,
    scopeId: input.payload.scope_id,
  }));
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: `budget-event-${identityDigest}`,
    event_type: input.eventType,
    event_version: BUDGET_EVENT_VERSION,
    stream_id: input.streamId,
    stream_sequence: input.streamSequence,
    occurred_at: input.occurredAt,
    recorded_at: input.recordedAt,
    producer: input.producer,
    authority_epoch: input.authorityEpoch,
    correlation_id: input.correlationId,
    causation_id: input.causationId,
    idempotency_key: input.payload.request_id,
    payload: input.payload,
  }, registry);
}
