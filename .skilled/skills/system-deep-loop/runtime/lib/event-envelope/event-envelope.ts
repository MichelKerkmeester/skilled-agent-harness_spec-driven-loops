// ───────────────────────────────────────────────────────────────────
// MODULE: Versioned Event Envelope
// ───────────────────────────────────────────────────────────────────

import { asJsonObject, immutableJsonClone } from './canonical-json.js';
import { EnvelopeValidationError, EventEnvelopeErrorCodes } from './event-envelope-errors.js';

import type { JsonObject } from './canonical-json.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Stable producer identity bound into canonical event bytes. */
export interface EventProducer {
  readonly name: string;
  readonly version: string;
}

/** Closed fourteen-field wire envelope for every future spine event. */
export interface EventEnvelope {
  readonly envelope_version: number;
  readonly event_id: string;
  readonly event_type: string;
  readonly event_version: number;
  readonly stream_id: string;
  readonly stream_sequence: number;
  readonly occurred_at: string;
  readonly recorded_at: string;
  readonly producer: EventProducer;
  readonly authority_epoch: number;
  readonly correlation_id: string;
  readonly causation_id: string | null;
  readonly idempotency_key: string;
  readonly payload: Readonly<JsonObject>;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const CURRENT_ENVELOPE_VERSION = 1;
export const EVENT_TYPE_NAMESPACE_GRAMMAR =
  '<domain>.<aggregate>.<event>, with three lowercase kebab-case segments';
export const EVENT_TYPE_NAMESPACE_PATTERN =
  /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

export const EVENT_ENVELOPE_FIELDS = [
  'envelope_version',
  'event_id',
  'event_type',
  'event_version',
  'stream_id',
  'stream_sequence',
  'occurred_at',
  'recorded_at',
  'producer',
  'authority_epoch',
  'correlation_id',
  'causation_id',
  'idempotency_key',
  'payload',
] as const;

export const IMMUTABLE_ENVELOPE_FIELDS = [
  'envelope_version',
  'event_id',
  'event_type',
  'stream_id',
  'stream_sequence',
  'occurred_at',
  'recorded_at',
  'producer',
  'authority_epoch',
  'correlation_id',
  'causation_id',
  'idempotency_key',
] as const;

const EVENT_ENVELOPE_FIELD_SET = new Set<string>(EVENT_ENVELOPE_FIELDS);
const PRODUCER_FIELDS = ['name', 'version'] as const;
const PRODUCER_FIELD_SET = new Set<string>(PRODUCER_FIELDS);
const MAX_ID_LENGTH = 1_024;
const MAX_PRODUCER_FIELD_LENGTH = 256;
const UTC_TIMESTAMP_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function requireNonEmptyString(
  value: unknown,
  field: string,
  maxLength = MAX_ID_LENGTH,
): string {
  if (typeof value !== 'string' || value.trim() === '' || value.length > maxLength) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
      'Envelope field must be a bounded non-empty string',
      { field, maxLength, valueType: typeof value },
    );
  }
  return value;
}

function requirePositiveInteger(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) <= 0) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
      'Envelope field must be a positive safe integer',
      { field, valueType: typeof value },
    );
  }
  return value as number;
}

function requireUtcTimestamp(value: unknown, field: string): string {
  if (typeof value !== 'string') {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
      'Timestamp must be an RFC 3339 UTC string',
      { field, valueType: typeof value },
    );
  }
  const match = UTC_TIMESTAMP_PATTERN.exec(value);
  if (!match) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
      'Timestamp must use the UTC Z designator',
      { field },
    );
  }
  const fraction = (match[7] ?? '').padEnd(3, '0');
  const normalized = `${value.slice(0, 19)}.${fraction}Z`;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString() !== normalized) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
      'Timestamp is not a valid calendar instant',
      { field },
    );
  }
  return value;
}

function validateClosedKeys(
  value: Record<string, unknown>,
  expectedFields: readonly string[],
  expectedFieldSet: ReadonlySet<string>,
  field: string,
): void {
  for (const expected of expectedFields) {
    if (!Object.prototype.hasOwnProperty.call(value, expected)) {
      throw new EnvelopeValidationError(
        EventEnvelopeErrorCodes.ENVELOPE_MISSING_FIELD,
        'Required envelope field is missing',
        { field: field === '$' ? expected : `${field}.${expected}` },
      );
    }
  }
  for (const key of Object.keys(value)) {
    if (!expectedFieldSet.has(key)) {
      throw new EnvelopeValidationError(
        EventEnvelopeErrorCodes.ENVELOPE_UNKNOWN_FIELD,
        'Unknown envelope field is forbidden',
        { field: field === '$' ? key : `${field}.${key}` },
      );
    }
  }
}

function validateProducer(value: unknown): EventProducer {
  if (!isPlainObject(value)) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
      'Producer must be an object',
      { field: 'producer', valueType: typeof value },
    );
  }
  validateClosedKeys(value, PRODUCER_FIELDS, PRODUCER_FIELD_SET, 'producer');
  return Object.freeze({
    name: requireNonEmptyString(value.name, 'producer.name', MAX_PRODUCER_FIELD_LENGTH),
    version: requireNonEmptyString(value.version, 'producer.version', MAX_PRODUCER_FIELD_LENGTH),
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Validate and return an exact namespaced event discriminator. */
export function validateEventTypeNamespace(eventType: unknown): string {
  const validated = requireNonEmptyString(eventType, 'event_type');
  if (!EVENT_TYPE_NAMESPACE_PATTERN.test(validated)) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
      'Event type does not match the frozen namespace grammar',
      { field: 'event_type', grammar: EVENT_TYPE_NAMESPACE_GRAMMAR },
    );
  }
  return validated;
}

/** Validate, clone, and freeze one complete event envelope. */
export function validateEventEnvelope(input: unknown): EventEnvelope {
  if (!isPlainObject(input)) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
      'Event envelope must be an object',
      { field: '$', valueType: typeof input },
    );
  }
  validateClosedKeys(input, EVENT_ENVELOPE_FIELDS, EVENT_ENVELOPE_FIELD_SET, '$');

  const envelopeVersion = requirePositiveInteger(input.envelope_version, 'envelope_version');
  if (envelopeVersion !== CURRENT_ENVELOPE_VERSION) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.ENVELOPE_UNSUPPORTED_VERSION,
      'Envelope version is not supported',
      { envelopeVersion, supportedVersion: CURRENT_ENVELOPE_VERSION },
    );
  }

  const causationId = input.causation_id === null
    ? null
    : requireNonEmptyString(input.causation_id, 'causation_id');
  const payload = asJsonObject(input.payload, 'payload');
  const envelope: EventEnvelope = {
    envelope_version: envelopeVersion,
    event_id: requireNonEmptyString(input.event_id, 'event_id'),
    event_type: validateEventTypeNamespace(input.event_type),
    event_version: requirePositiveInteger(input.event_version, 'event_version'),
    stream_id: requireNonEmptyString(input.stream_id, 'stream_id'),
    stream_sequence: requirePositiveInteger(input.stream_sequence, 'stream_sequence'),
    occurred_at: requireUtcTimestamp(input.occurred_at, 'occurred_at'),
    recorded_at: requireUtcTimestamp(input.recorded_at, 'recorded_at'),
    producer: validateProducer(input.producer),
    authority_epoch: requirePositiveInteger(input.authority_epoch, 'authority_epoch'),
    correlation_id: requireNonEmptyString(input.correlation_id, 'correlation_id'),
    causation_id: causationId,
    idempotency_key: requireNonEmptyString(input.idempotency_key, 'idempotency_key'),
    payload,
  };

  return immutableJsonClone(envelope as unknown as JsonObject) as unknown as EventEnvelope;
}
