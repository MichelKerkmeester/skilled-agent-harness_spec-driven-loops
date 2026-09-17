// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime-Neutral Event Normalization
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

import { validateEventEnvelope } from '../contracts/validate-event.js';
import { isJsonValue } from '../contracts/validator-utils.js';

import type {
  ValidationIssue,
  ValidationResult,
} from '../contracts/common.js';
import type { EventEnvelope } from '../contracts/event.js';

/** Immutable normalized sequence plus a replay-stable digest. */
export interface NormalizedEventBatch {
  readonly events: readonly EventEnvelope[];
  readonly digest: string;
}

/** Validate, detach, and deeply freeze one runtime-neutral envelope. */
export function normalizeEvent(
  input: unknown,
): ValidationResult<EventEnvelope> {
  const result = validateEventEnvelope(input);
  if (!result.success) {
    return result;
  }

  if (!isJsonValue(result.value)) {
    return failure(input, [{
      path: '$',
      code: 'json',
      message: 'Normalized events must be finite, acyclic JSON values.',
    }]);
  }

  const detached = structuredClone(result.value);
  return {
    success: true,
    value: deepFreeze(detached),
  };
}

/** Normalize an ordered event sequence without collapsing its order fields. */
export function normalizeEventSequence(
  input: unknown,
): ValidationResult<NormalizedEventBatch> {
  if (!Array.isArray(input)) {
    return failure(input, [{
      path: '$',
      code: 'type',
      message: 'Expected an event array.',
    }]);
  }
  if (input.length === 0) {
    return failure(input, [{
      path: '$',
      code: 'sample_size',
      message: 'An event sequence cannot be empty.',
    }]);
  }

  const events: EventEnvelope[] = [];
  const issues: ValidationIssue[] = [];
  for (const [index, eventInput] of input.entries()) {
    const result = normalizeEvent(eventInput);
    if (!result.success) {
      issues.push(...result.issues.map((issue) => ({
        ...issue,
        path: prefixPath(index, issue.path),
      })));
      continue;
    }
    events.push(result.value);
  }

  if (issues.length > 0) {
    return failure(input, issues);
  }

  const frozenEvents = Object.freeze([...events]);
  return {
    success: true,
    value: Object.freeze({
      events: frozenEvents,
      digest: createNormalizedSequenceDigest(frozenEvents),
    }),
  };
}

/** Create the deterministic digest used to compare normalized replays. */
export function createNormalizedSequenceDigest(
  events: readonly EventEnvelope[],
): string {
  const serialized = stableSerialize(events);
  return `sha256:${createHash('sha256').update(serialized).digest('hex')}`;
}

function prefixPath(index: number, path: string): string {
  return path === '$' ? `$[${index}]` : `$[${index}]${path.slice(1)}`;
}

function failure(
  originalInput: unknown,
  issues: readonly ValidationIssue[],
): ValidationResult<never> {
  return {
    success: false,
    issues: Object.freeze([...issues]),
    originalInput,
  };
}

function deepFreeze<TValue>(value: TValue): TValue {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) {
    return value;
  }

  for (const child of Object.values(value)) {
    deepFreeze(child);
  }
  return Object.freeze(value);
}

function stableSerialize(value: unknown): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError('Cannot serialize a non-finite number.');
    }
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry)).join(',')}]`;
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const entries = Object.keys(record)
      .sort((left, right) => left.localeCompare(right))
      .map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`);
    return `{${entries.join(',')}}`;
  }
  throw new TypeError('Cannot serialize a non-JSON value.');
}
