// ───────────────────────────────────────────────────────────────────
// MODULE: Needs-You Items
// ───────────────────────────────────────────────────────────────────
//
// An unattended run that needs a human decision ends instead of waiting,
// and leaves one item the operator answers later. The item lives under the
// user-level state root so a run can neither forge nor clear one. Its state
// (open, answered, expired) is derived from its fields every time it is
// read and never stored, so it can never disagree with them.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { writeStateAtomic } from '../../../system-deep-loop/runtime/lib/deep-loop/atomic-state.js';
import { ACTOR_PATTERN } from './actor.js';
import { IDENTITY_PATTERN } from './repo-config.js';
import { ensureIdentityState, identityStatePaths, isSafeSegment, needsYouFile } from './state-root.js';

import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

/** The scopes an answer may carry. A missing scope reads as once, never as an allow beyond this run. */
export const ANSWER_SCOPES = ['once', 'deny'] as const;
export type AnswerScope = (typeof ANSWER_SCOPES)[number];

/** The review kinds an item may carry. An absent or null kind reads as decision. */
export const ITEM_KINDS = ['decision', 'memory-proposal', 'skill-proposal'] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];
/** The four types a memory proposal may name, the same four a memory entry carries. */
export const PROPOSAL_TYPES = ['user', 'general', 'feedback', 'reference'] as const;
/** The longest fact a memory proposal may carry, the memory entry's own text bound. */
export const PROPOSAL_FACT_MAX = 400;

export interface NeedsYouAnswer {
  text: string;
  answeredAt: string;
  /** Who answered, by name. Null on an answer stored before answers named anyone. */
  by?: string | null;
  /** once or deny. An answer stored without one reads as once. */
  scope?: AnswerScope;
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
  /** The exact prompt the parked run was dispatched with, so a resumed run continues it. */
  prompt: string;
  /** The spec folder the parked run was bound to; the resumed run binds the same one. */
  specFolder: string | null;
  answer: NeedsYouAnswer | null;
  /** Set once an answer has enqueued its resume request. */
  resumeRequestId: string | null;
  /** The review kind. Absent or null reads as decision. */
  kind?: ItemKind | null;
  /** The entry type a memory proposal names. Null or absent on every other kind. */
  proposalType?: (typeof PROPOSAL_TYPES)[number] | null;
  /** The fact a memory proposal asks to store, at most 400 characters. Null or absent on every other kind. */
  proposalFact?: string | null;
  /** The bot whose memory file a confirmed proposal appends to. Null or absent on every other kind. */
  proposalBotId?: string | null;
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
  'prompt',
  'specFolder',
  'answer',
  'resumeRequestId',
  'kind',
  'proposalType',
  'proposalFact',
  'proposalBotId',
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

  for (const key of ['id', 'runId', 'botId', 'identity', 'question', 'prompt'] as const) {
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
  if (raw.specFolder !== null && !nonEmptyString(raw.specFolder)) {
    return { ok: false, reason: 'item-field-invalid', detail: 'specFolder' };
  }
  if (raw.answer !== null) {
    const answer = raw.answer;
    if (!isPlainObject(answer) || typeof answer.text !== 'string' || !isInstant(answer.answeredAt)) {
      return { ok: false, reason: 'item-field-invalid', detail: 'answer' };
    }
    if (answer.by !== undefined && answer.by !== null && !(typeof answer.by === 'string' && ACTOR_PATTERN.test(answer.by))) {
      return { ok: false, reason: 'item-field-invalid', detail: 'answer.by' };
    }
    if (answer.scope !== undefined && !(ANSWER_SCOPES as readonly unknown[]).includes(answer.scope)) {
      return { ok: false, reason: 'item-field-invalid', detail: 'answer.scope' };
    }
  }
  if (raw.resumeRequestId !== null && !nonEmptyString(raw.resumeRequestId)) {
    return { ok: false, reason: 'item-field-invalid', detail: 'resumeRequestId' };
  }
  if (raw.kind !== undefined && raw.kind !== null && !(ITEM_KINDS as readonly unknown[]).includes(raw.kind)) {
    return { ok: false, reason: 'item-field-invalid', detail: 'kind' };
  }
  if (raw.proposalType !== undefined && raw.proposalType !== null && !(PROPOSAL_TYPES as readonly unknown[]).includes(raw.proposalType)) {
    return { ok: false, reason: 'item-field-invalid', detail: 'proposalType' };
  }
  if (raw.proposalFact !== undefined && raw.proposalFact !== null) {
    const fact = raw.proposalFact;
    if (!nonEmptyString(fact) || fact.length > PROPOSAL_FACT_MAX) {
      return { ok: false, reason: 'item-field-invalid', detail: 'proposalFact' };
    }
  }
  if (raw.proposalBotId !== undefined && raw.proposalBotId !== null) {
    const botId = raw.proposalBotId;
    if (typeof botId !== 'string' || !isSafeSegment(botId)) {
      return { ok: false, reason: 'item-field-invalid', detail: 'proposalBotId' };
    }
  }
  if (raw.kind === 'memory-proposal') {
    for (const key of ['proposalType', 'proposalFact', 'proposalBotId'] as const) {
      if (raw[key] === undefined || raw[key] === null) {
        return { ok: false, reason: 'item-field-invalid', detail: key };
      }
    }
  }
  return { ok: true, value: raw as unknown as NeedsYouItem };
}

/**
 * An item's review kind. A stored item keeps whatever it holds, and absent or
 * null reads as kind: 'decision'.
 */
export function itemKind(item: Pick<NeedsYouItem, 'kind'>): ItemKind {
  return item.kind ?? 'decision';
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
 * Fill in an answer's optional fields. A read never rewrites the file on disk,
 * so an answer stored before answers named anyone, or before a scope existed,
 * keeps its stored shape and reads here as `by: null` and `scope: 'once'`.
 */
export function normalizeAnswer(answer: NeedsYouAnswer): Required<NeedsYouAnswer> {
  return { text: answer.text, answeredAt: answer.answeredAt, by: answer.by ?? null, scope: answer.scope ?? 'once' };
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
  const valid = validateNeedsYouItem(parsed);
  if (!valid.ok) return valid;
  return {
    ok: true,
    value: {
      ...valid.value,
      answer: valid.value.answer === null ? null : normalizeAnswer(valid.value.answer),
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. LISTING, HOLD & RESUME
// ───────────────────────────────────────────────────────────────────

/** An item read back with its state derived at one instant. */
export interface NeedsYouListing {
  item: NeedsYouItem;
  state: NeedsYouState;
}

/**
 * List every readable item of one identity with its derived state, oldest
 * first. A damaged item file is skipped and named, never fatal, so one bad
 * file cannot hide the rest of the inbox. Only a missing folder means no
 * items; a folder that exists but cannot be listed is reported, because an
 * empty answer there would hide every open item.
 *
 * @returns The listings, the ids of files that did not read, and the error
 *   code when the folder could not be listed (null otherwise).
 */
export function listNeedsYouItems(
  stateRoot: string,
  identity: string,
  now: Date = new Date(),
): { items: NeedsYouListing[]; unreadable: string[]; listError: string | null } {
  const folder = identityStatePaths(stateRoot, identity).needsYou;
  let names: string[];
  try {
    names = readdirSync(folder);
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException | null)?.code;
    if (code === 'ENOENT') return { items: [], unreadable: [], listError: null };
    return { items: [], unreadable: [], listError: typeof code === 'string' ? code : 'unknown error' };
  }
  const items: NeedsYouListing[] = [];
  const unreadable: string[] = [];
  for (const name of names) {
    if (!name.endsWith('.json')) continue;
    const id = name.slice(0, -'.json'.length);
    if (!isSafeSegment(id)) continue;
    const read = readNeedsYouItem(stateRoot, identity, id);
    if (!read.ok) {
      unreadable.push(id);
      continue;
    }
    items.push({ item: read.value, state: needsYouState(read.value, now) });
  }
  items.sort((a, b) => Date.parse(a.item.createdAt) - Date.parse(b.item.createdAt));
  return { items, unreadable, listError: null };
}

/**
 * The item that holds a bot: unanswered and not past its expiry. An answered
 * or expired item holds nothing, so no item can hold a bot past its expiry.
 *
 * @returns The oldest open item of the bot, or null.
 */
export function openItemForBot(
  stateRoot: string,
  identity: string,
  botId: string,
  now: Date = new Date(),
): NeedsYouItem | null {
  const open = listNeedsYouItems(stateRoot, identity, now).items.find(
    (listing) => listing.item.botId === botId && listing.state === 'open',
  );
  return open?.item ?? null;
}

/** What holds a bot: an open item, item files that do not read and may be its own, or a folder that cannot be listed. */
export type BotHold =
  | { kind: 'open'; item: NeedsYouItem }
  | { kind: 'unreadable'; itemIds: string[] }
  | { kind: 'unlistable'; code: string };

/** The bot id a damaged item file still names, when its JSON parses that far. */
function peekBotId(stateRoot: string, identity: string, itemId: string): string | null {
  try {
    const parsed = JSON.parse(readFileSync(needsYouFile(stateRoot, identity, itemId), 'utf8')) as { botId?: unknown };
    return typeof parsed.botId === 'string' ? parsed.botId : null;
  } catch {
    return null;
  }
}

/**
 * Decide whether a bot is held. An open item of the bot holds it. An item
 * file that does not read holds it too, unless the file still names another
 * bot: an item's file name is its run id and never names the bot, so a damaged
 * item that might be this bot's must hold, the same way a damaged stop switch
 * still stops. A folder that cannot be listed holds every bot for the same
 * reason. A hold that fails open would let a bot run past a question.
 *
 * @returns The hold, or null when nothing holds the bot.
 */
export function holdForBot(stateRoot: string, identity: string, botId: string, now: Date = new Date()): BotHold | null {
  const { items, unreadable, listError } = listNeedsYouItems(stateRoot, identity, now);
  // Any item in a folder that cannot be listed may be this bot's open question.
  if (listError !== null) return { kind: 'unlistable', code: listError };
  const open = items.find((listing) => {
    // A review item asks about a fact or a draft and never about the bot's own work, so it holds no bot and needs no resume.
    const kind = itemKind(listing.item);
    return kind === 'decision' && listing.item.botId === botId && listing.state === 'open';
  });
  if (open !== undefined) return { kind: 'open', item: open.item };
  const mine = unreadable.filter((itemId) => {
    const named = peekBotId(stateRoot, identity, itemId);
    return named === null || named === botId;
  });
  return mine.length > 0 ? { kind: 'unreadable', itemIds: mine } : null;
}

/**
 * Whether a resume request has still to run: it sits in the watched folder or
 * is claimed. A request id that is not a safe name cannot be looked up, so it
 * counts as still to run, the side that keeps the answered work.
 */
export function resumeRequestPending(stateRoot: string, identity: string, requestId: string): boolean {
  if (!isSafeSegment(requestId)) return true;
  const folders = identityStatePaths(stateRoot, identity).requests;
  return existsSync(join(folders.inbox, `${requestId}.json`)) || existsSync(join(folders.claimed, `${requestId}.json`));
}

/**
 * An answered item of the bot whose resume has not run: no resume request
 * recorded yet, or its request still queued or claimed. While one exists the
 * bot's other unattended runs wait, because a run started in between could
 * take the lease the resume needs, or park a new question that then refuses
 * the resume, and either way the answered work would never continue.
 *
 * @returns The oldest such item, or null.
 */
export function itemAwaitingResume(stateRoot: string, identity: string, botId: string, now: Date = new Date()): NeedsYouItem | null {
  const waiting = listNeedsYouItems(stateRoot, identity, now).items.find(({ item, state }) => {
    // A review item asks about a fact or a draft and never about the bot's own work, so it holds no bot and needs no resume.
    const kind = itemKind(item);
    return (
      kind === 'decision' &&
      item.botId === botId &&
      state === 'answered' &&
      (item.resumeRequestId === null || resumeRequestPending(stateRoot, identity, item.resumeRequestId))
    );
  });
  return waiting?.item ?? null;
}

/**
 * The prompt of a run resumed after an answer: the parked run's own prompt,
 * then the question and the answer. The parked prompt already names the bound
 * spec folder, so the resumed run binds the same one.
 *
 * @returns The prompt, or `item-not-answered` for an item with no answer.
 */
export function buildResumedPrompt(item: NeedsYouItem): Result<string> {
  if (item.answer === null) return { ok: false, reason: 'item-not-answered' };
  const lines = [
    item.prompt,
    '',
    'An earlier run of this bot stopped to ask the operator a question. The operator has answered it.',
    `Question: ${item.question}`,
  ];
  if (item.options !== null && item.options.length > 0) lines.push(`Options offered: ${item.options.join(' | ')}`);
  lines.push(`Answer: ${item.answer.text}`, 'Continue the work from where that run stopped, following the answer.');
  return { ok: true, value: lines.join('\n') };
}
