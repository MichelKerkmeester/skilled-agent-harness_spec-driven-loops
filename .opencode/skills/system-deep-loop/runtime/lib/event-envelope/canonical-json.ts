// ───────────────────────────────────────────────────────────────────
// MODULE: Canonical JSON
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

import {
  EnvelopeValidationError,
  EventEnvelopeError,
  EventEnvelopeErrorCodes,
} from './event-envelope-errors.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Scalar values accepted by canonical JSON serialization. */
export type JsonPrimitive = boolean | null | number | string;
/** Recursive JSON value accepted at the envelope boundary. */
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
/** Plain JSON object with recursively validated values. */
export interface JsonObject {
  [key: string]: JsonValue;
}
/** Immutable byte sequence returned to storage and authorization consumers. */
export type CanonicalBytes = readonly number[];

interface JsonValidationState {
  readonly ancestors: WeakSet<object>;
  nodes: number;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const MAX_CANONICAL_BYTES = 1_048_576;
export const MAX_JSON_DEPTH = 64;
export const MAX_JSON_NODES = 10_000;
export const MAX_STRING_LENGTH = 65_536;

const FORBIDDEN_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function hasLoneSurrogate(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!Number.isFinite(next) || next < 0xdc00 || next > 0xdfff) return true;
      index += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return true;
    }
  }
  return false;
}

function validateString(value: string, path: string): void {
  if (value.length > MAX_STRING_LENGTH) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.INPUT_LIMIT_EXCEEDED,
      'String value exceeds the canonical JSON limit',
      { field: path, limit: MAX_STRING_LENGTH },
    );
  }
  if (hasLoneSurrogate(value)) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.INVALID_UNICODE,
      'String value contains malformed Unicode',
      { field: path },
    );
  }
}

function validateJsonValue(
  value: unknown,
  path: string,
  depth: number,
  state: JsonValidationState,
): asserts value is JsonValue {
  state.nodes += 1;
  if (state.nodes > MAX_JSON_NODES || depth > MAX_JSON_DEPTH) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.INPUT_LIMIT_EXCEEDED,
      'JSON value exceeds structural limits',
      { field: path, maxDepth: MAX_JSON_DEPTH, maxNodes: MAX_JSON_NODES },
    );
  }

  if (value === null || typeof value === 'boolean') return;
  if (typeof value === 'string') {
    validateString(value, path);
    return;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new EnvelopeValidationError(
        EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
        'JSON numbers must be finite',
        { field: path },
      );
    }
    return;
  }
  if (typeof value !== 'object') {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
      'Value is not representable as canonical JSON',
      { field: path, valueType: typeof value },
    );
  }

  if (state.ancestors.has(value)) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.CANONICAL_SERIALIZATION_FAILED,
      'Circular JSON values are forbidden',
      { field: path },
    );
  }
  state.ancestors.add(value);

  if (Array.isArray(value)) {
    value.forEach((entry, index) => validateJsonValue(entry, `${path}[${index}]`, depth + 1, state));
  } else {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new EnvelopeValidationError(
        EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
        'Canonical JSON objects must have a plain prototype',
        { field: path },
      );
    }
    for (const [key, entry] of Object.entries(value)) {
      validateString(key, `${path}.__key__`);
      if (FORBIDDEN_OBJECT_KEYS.has(key)) {
        throw new EnvelopeValidationError(
          EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
          'Prototype-sensitive object keys are forbidden',
          { field: path, key },
        );
      }
      validateJsonValue(entry, `${path}.${key}`, depth + 1, state);
    }
  }

  state.ancestors.delete(value);
}

function sortJsonValue(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(sortJsonValue);
  if (value === null || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortJsonValue(value[key])]),
  );
}

function freezeJsonValue<T extends JsonValue>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach((entry) => freezeJsonValue(entry));
    Object.freeze(value);
  }
  return value;
}

// ───────────────────────────────────────────────────────────────────
// 4. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Serialize a bounded JSON value with recursively sorted object keys. */
export function canonicalJson(value: unknown): string {
  validateJsonValue(value, '$', 0, { ancestors: new WeakSet<object>(), nodes: 0 });
  const serialized = JSON.stringify(sortJsonValue(value));
  const byteLength = Buffer.byteLength(serialized, 'utf8');
  if (byteLength > MAX_CANONICAL_BYTES) {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.INPUT_LIMIT_EXCEEDED,
      'Canonical JSON exceeds the byte limit',
      { byteLength, limit: MAX_CANONICAL_BYTES },
    );
  }
  return serialized;
}

/** Serialize a JSON value into immutable, sorted-key UTF-8 bytes. */
export function canonicalBytes(value: unknown): CanonicalBytes {
  return Object.freeze(Array.from(Buffer.from(canonicalJson(value), 'utf8')));
}

/** Calculate a lowercase SHA-256 digest for an immutable byte sequence. */
export function sha256Bytes(bytes: CanonicalBytes | Uint8Array): string {
  return createHash('sha256').update(Uint8Array.from(bytes)).digest('hex');
}

/** Clone and recursively freeze a validated JSON value. */
export function immutableJsonClone<T extends JsonValue>(value: T): T {
  const clone = JSON.parse(canonicalJson(value)) as T;
  return freezeJsonValue(clone);
}

/** Narrow a value to a bounded, plain JSON object. */
export function asJsonObject(value: unknown, field = 'payload'): JsonObject {
  validateJsonValue(value, field, 0, { ancestors: new WeakSet<object>(), nodes: 0 });
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new EnvelopeValidationError(
      EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
      'Expected a JSON object',
      { field },
    );
  }
  return value;
}

/** Return a stable machine code for typed and unexpected errors. */
export function errorCodeOf(error: unknown): string {
  return error instanceof EventEnvelopeError ? error.code : 'UNEXPECTED_ERROR';
}
