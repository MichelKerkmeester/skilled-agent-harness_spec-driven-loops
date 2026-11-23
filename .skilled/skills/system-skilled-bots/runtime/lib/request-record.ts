// ───────────────────────────────────────────────────────────────────
// MODULE: Run Request Record
// ───────────────────────────────────────────────────────────────────
//
// Every producer (a typed enqueue, an answered needs-you item, a commit)
// writes the same record, so the drain reads one shape and dedupe works the
// same way for all of them. The idempotency key comes from the event source
// and that source's own event id, or from a key the caller supplies. It is
// never a hash of the body: a producer that re-sends one event with a
// changed payload must still land on the same key, or the event runs twice.
// The request id is derived from the bot and the key, so a re-sent event
// names the request that is already queued.

import { createHash } from 'node:crypto';
import { isAbsolute } from 'node:path';

import { IDENTITY_PATTERN } from './repo-config.js';
import { isSafeSegment } from './state-root.js';

import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** A plain run, or the run that continues a parked one after its answer. */
export const REQUEST_KINDS = ['run', 'resume'] as const;

export type RequestKind = (typeof REQUEST_KINDS)[number];

/** The source of every request `bots answer` writes. */
export const ANSWER_SOURCE = 'answer';

/** The source of every request the post-commit leg writes; its event id is the commit SHA. */
export const COMMIT_SOURCE = 'git-commit';

/** Where a request is meant to run: the repository identity beside the checkout path it was enqueued from. */
export interface RequestTarget {
  identity: string;
  path: string;
}

export interface QueuedRequest {
  schemaVersion: 1;
  id: string;
  kind: RequestKind;
  /** The bot the request runs. */
  workflowId: string;
  /** Written as given; the runner builds the dispatched prompt from the definition. */
  prompt: string;
  source: string;
  /** Who or what produced the request, as given; null when the producer says nothing. */
  origin: string | null;
  enqueuedAt: string;
  target: RequestTarget;
  firedSlot: string | null;
  idempotencyKey: string;
  /** A delivery hint carried to the run, as given; null for none. */
  delivery: string | null;
  /** Runs already attempted for this request. */
  attempts: number;
}

export interface RequestInput {
  kind?: RequestKind;
  workflowId: string;
  prompt?: string;
  source: string;
  /** The source's own id for the event. For a resume request it is the needs-you item id. */
  eventId?: string | null;
  /** A caller-supplied key; it wins over the derived one. */
  key?: string | null;
  origin?: string | null;
  target: RequestTarget;
  firedSlot?: string | null;
  delivery?: string | null;
  now?: Date;
}

const RECORD_KEYS = [
  'schemaVersion',
  'id',
  'kind',
  'workflowId',
  'prompt',
  'source',
  'origin',
  'enqueuedAt',
  'target',
  'firedSlot',
  'idempotencyKey',
  'delivery',
  'attempts',
] as const;

/** A lower-case word, so `<source>:<event id>` always splits at its first colon. */
const SOURCE_PATTERN = /^[a-z][a-z0-9-]*$/;

// ───────────────────────────────────────────────────────────────────
// 2. KEY & ID
// ───────────────────────────────────────────────────────────────────

/**
 * The idempotency key of one event: a caller key when given, otherwise the
 * source and the source's own event id. The body never takes part.
 *
 * @returns The key, or `event-id-missing` when there is neither.
 */
export function deriveIdempotencyKey(input: { source: string; eventId?: string | null; key?: string | null }): Result<string> {
  if (typeof input.key === 'string' && input.key.trim() !== '') return { ok: true, value: input.key.trim() };
  if (typeof input.eventId === 'string' && input.eventId.trim() !== '') {
    return { ok: true, value: `${input.source}:${input.eventId.trim()}` };
  }
  return { ok: false, reason: 'event-id-missing', detail: 'give an event id or a key' };
}

/**
 * The digest that names one event for one bot. It names the seen-key marker
 * and the request id, so one event can reach several bots once each.
 */
export function eventDigest(workflowId: string, idempotencyKey: string): string {
  return createHash('sha256').update(`${workflowId}\0${idempotencyKey}`).digest('hex');
}

/** The request id of one event for one bot; the same event always names the same request. */
export function requestIdFor(workflowId: string, idempotencyKey: string): string {
  return `rq-${eventDigest(workflowId, idempotencyKey).slice(0, 32)}`;
}

// ───────────────────────────────────────────────────────────────────
// 3. BUILD & VALIDATE
// ───────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

/**
 * Build one request. A `resume` request takes source `answer` and keys on
 * the needs-you item id, so a second answer to one item derives the same key.
 *
 * @returns The record with `attempts` at 0, or a refusal naming the first bad field.
 */
export function buildRequest(input: RequestInput): Result<QueuedRequest> {
  const kind = input.kind ?? 'run';
  if (!(REQUEST_KINDS as readonly string[]).includes(kind)) return { ok: false, reason: 'request-kind-invalid' };
  if (kind === 'resume') {
    if (input.source !== ANSWER_SOURCE) return { ok: false, reason: 'resume-source-invalid', detail: `expected ${ANSWER_SOURCE}` };
    if (typeof input.eventId !== 'string' || !isSafeSegment(input.eventId)) {
      return { ok: false, reason: 'resume-item-id-invalid' };
    }
    if (input.key !== undefined && input.key !== null && input.key !== input.eventId) {
      return { ok: false, reason: 'resume-key-invalid', detail: 'a resume request keys on its item id' };
    }
  }
  const key = kind === 'resume'
    ? { ok: true as const, value: input.eventId as string }
    : deriveIdempotencyKey({ source: input.source, eventId: input.eventId ?? null, key: input.key ?? null });
  if (!key.ok) return key;

  const record: QueuedRequest = {
    schemaVersion: 1,
    id: requestIdFor(input.workflowId, key.value),
    kind,
    workflowId: input.workflowId,
    prompt: input.prompt ?? '',
    source: input.source,
    origin: input.origin ?? null,
    enqueuedAt: (input.now ?? new Date()).toISOString(),
    target: { identity: input.target.identity, path: input.target.path },
    firedSlot: input.firedSlot ?? null,
    idempotencyKey: key.value,
    delivery: input.delivery ?? null,
    attempts: 0,
  };
  return validateRequest(record);
}

/**
 * Check a request record read back from a queue folder.
 *
 * @returns The record, or a refusal naming the first broken rule.
 */
export function validateRequest(raw: unknown): Result<QueuedRequest> {
  if (!isPlainObject(raw)) return { ok: false, reason: 'request-invalid', detail: 'expected an object' };
  const unknown = Object.keys(raw).find((key) => !(RECORD_KEYS as readonly string[]).includes(key));
  if (unknown !== undefined) return { ok: false, reason: 'unknown-key', detail: unknown };
  if (raw.schemaVersion !== 1) return { ok: false, reason: 'request-schema-unsupported' };
  if (!(REQUEST_KINDS as readonly string[]).includes(raw.kind as string)) return { ok: false, reason: 'request-kind-invalid' };
  if (typeof raw.workflowId !== 'string' || !isSafeSegment(raw.workflowId)) return { ok: false, reason: 'workflow-id-invalid' };
  if (typeof raw.source !== 'string' || !SOURCE_PATTERN.test(raw.source)) return { ok: false, reason: 'source-invalid' };
  if (typeof raw.prompt !== 'string') return { ok: false, reason: 'request-field-invalid', detail: 'prompt' };
  for (const key of ['origin', 'firedSlot', 'delivery'] as const) {
    if (!isNullableString(raw[key])) return { ok: false, reason: 'request-field-invalid', detail: key };
  }
  if (typeof raw.enqueuedAt !== 'string' || Number.isNaN(Date.parse(raw.enqueuedAt))) {
    return { ok: false, reason: 'request-field-invalid', detail: 'enqueuedAt' };
  }
  const target = raw.target;
  if (!isPlainObject(target) || typeof target.identity !== 'string' || !IDENTITY_PATTERN.test(target.identity)) {
    return { ok: false, reason: 'request-field-invalid', detail: 'target.identity' };
  }
  if (typeof target.path !== 'string' || !isAbsolute(target.path)) {
    return { ok: false, reason: 'request-field-invalid', detail: 'target.path' };
  }
  if (typeof raw.idempotencyKey !== 'string' || raw.idempotencyKey === '') {
    return { ok: false, reason: 'request-field-invalid', detail: 'idempotencyKey' };
  }
  if (raw.kind === 'resume' && (raw.source !== ANSWER_SOURCE || !isSafeSegment(raw.idempotencyKey))) {
    return { ok: false, reason: 'resume-key-invalid' };
  }
  if (typeof raw.attempts !== 'number' || !Number.isInteger(raw.attempts) || raw.attempts < 0) {
    return { ok: false, reason: 'request-field-invalid', detail: 'attempts' };
  }
  if (raw.id !== requestIdFor(raw.workflowId, raw.idempotencyKey)) return { ok: false, reason: 'request-id-mismatch' };
  return { ok: true, value: raw as unknown as QueuedRequest };
}
