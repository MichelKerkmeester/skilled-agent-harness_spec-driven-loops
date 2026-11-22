// ───────────────────────────────────────────────────────────────────
// MODULE: Needs-You Items
// ───────────────────────────────────────────────────────────────────
//
// An unattended run that needs a human decision ends instead of waiting,
// and leaves one item the operator answers later. The item lives under the
// user-level state root so a run can neither forge nor clear one. Its state
// (open, answered, expired) is derived from its fields every time it is
// read and never stored, so it can never disagree with them.

import { readFileSync } from 'node:fs';

import { writeStateAtomic } from '../../../system-deep-loop/runtime/lib/deep-loop/atomic-state.js';
import { IDENTITY_PATTERN } from './repo-config.js';
import { ensureIdentityState, isSafeSegment, needsYouFile } from './state-root.js';

import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

export interface NeedsYouAnswer {
  text: string;
  answeredAt: string;
}

export interface NeedsYouItem {
  /** The parked run's id, so one run writes at most one item. */
  id: string;
  runId: string;
  botId: string;
  identity: string;
  question: string;
  options: string[] | null;
  createdAt: string;
  expiresAt: string;
  evidence: string[];
  answer: NeedsYouAnswer | null;
  /** Set once an answer has enqueued its resume request. */
  resumeRequestId: string | null;
}

export type NeedsYouState = 'open' | 'answered' | 'expired';

const ITEM_KEYS = [
  'id',
  'runId',
  'botId',
  'identity',
  'question',
  'options',
  'createdAt',
  'expiresAt',
  'evidence',
  'answer',
  'resumeRequestId',
] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION & STATE
// ───────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value !== '';
}

function isInstant(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

/**
 * Check an item's fields. An item that carries a stored state field is
 * rejected, because state is only ever derived.
 *
 * @returns The item, or a refusal naming the first bad field.
 */
export function validateNeedsYouItem(raw: unknown): Result<NeedsYouItem> {
  if (!isPlainObject(raw)) return { ok: false, reason: 'item-invalid', detail: 'expected an object' };
  const unknown = Object.keys(raw).find((key) => !(ITEM_KEYS as readonly string[]).includes(key));
  if (unknown !== undefined) return { ok: false, reason: 'unknown-key', detail: unknown };

  for (const key of ['id', 'runId', 'botId', 'identity', 'question'] as const) {
    if (!nonEmptyString(raw[key])) return { ok: false, reason: 'item-field-invalid', detail: key };
  }
  if (raw.id !== raw.runId) return { ok: false, reason: 'item-id-not-run-id' };
  if (!isSafeSegment(raw.id as string)) return { ok: false, reason: 'item-id-invalid' };
  if (!IDENTITY_PATTERN.test(raw.identity as string)) return { ok: false, reason: 'identity-invalid' };
  for (const key of ['createdAt', 'expiresAt'] as const) {
    if (!isInstant(raw[key])) return { ok: false, reason: 'item-field-invalid', detail: key };
  }
  if (raw.options !== null && !isStringList(raw.options)) {
    return { ok: false, reason: 'item-field-invalid', detail: 'options' };
  }
  if (!isStringList(raw.evidence)) return { ok: false, reason: 'item-field-invalid', detail: 'evidence' };
  if (raw.answer !== null) {
    const answer = raw.answer;
    if (!isPlainObject(answer) || typeof answer.text !== 'string' || !isInstant(answer.answeredAt)) {
      return { ok: false, reason: 'item-field-invalid', detail: 'answer' };
    }
  }
  if (raw.resumeRequestId !== null && !nonEmptyString(raw.resumeRequestId)) {
    return { ok: false, reason: 'item-field-invalid', detail: 'resumeRequestId' };
  }
  return { ok: true, value: raw as unknown as NeedsYouItem };
}

/**
 * Derive an item's state. An answer wins; an unanswered item past its
 * expiry is expired and is never answered automatically.
 *
 * @param item - The item.
 * @param now - The instant to judge at; defaults to now.
 */
export function needsYouState(item: Pick<NeedsYouItem, 'answer' | 'expiresAt'>, now: Date = new Date()): NeedsYouState {
  if (item.answer !== null) return 'answered';
  return now.getTime() >= Date.parse(item.expiresAt) ? 'expired' : 'open';
}

/**
 * The expiry instant for an item created at `createdAt`.
 *
 * @param expiryDays - The repository's `needsYou.expiryDays`.
 */
export function needsYouExpiry(createdAt: Date, expiryDays: number): string {
  return new Date(createdAt.getTime() + expiryDays * DAY_MS).toISOString();
}

// ───────────────────────────────────────────────────────────────────
// 3. WRITE & READ
// ───────────────────────────────────────────────────────────────────

/**
 * Validate and write an item by temp file and rename to
 * `<state root>/<identity key>/needs-you/<item id>.json`.
 *
 * @returns The item file path, or the validation refusal; nothing is written on a refusal.
 */
export function writeNeedsYouItem(stateRoot: string, item: NeedsYouItem): Result<string> {
  const valid = validateNeedsYouItem(item);
  if (!valid.ok) return valid;
  ensureIdentityState(stateRoot, item.identity);
  const path = needsYouFile(stateRoot, item.identity, item.id);
  writeStateAtomic(path, item);
  return { ok: true, value: path };
}

/**
 * Read one item back.
 *
 * @returns The item, or a refusal (`item-missing`, `item-unreadable`, a validation reason).
 */
export function readNeedsYouItem(stateRoot: string, identity: string, itemId: string): Result<NeedsYouItem> {
  const path = needsYouFile(stateRoot, identity, itemId);
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException | null)?.code;
    if (code === 'ENOENT') return { ok: false, reason: 'item-missing' };
    return { ok: false, reason: 'item-unreadable', detail: code ?? 'unknown error' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'item-invalid', detail: 'not valid JSON' };
  }
  return validateNeedsYouItem(parsed);
}
