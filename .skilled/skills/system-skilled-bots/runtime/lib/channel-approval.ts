// ───────────────────────────────────────────────────────────────────
// MODULE: Channel Approval Index
// ───────────────────────────────────────────────────────────────────
//
// Every prompt a chat receives has an entry here, so a restart cannot lose
// the question a chat is holding. A press or a numbered reply resolves from
// this file alone and never from memory, because the process that sent the
// prompt may be gone by the time the answer arrives. This module is the only
// writer of the file, and every read-modify-write holds
// channels/approvals.lock, so two answer paths can never interleave.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { CAPABILITY_MATRIX, CHANNEL_NAMES, REPLIES, channelLockFile, withStateLock } from './channel.js';
import { readNeedsYouItem } from './needs-you.js';
import { channelFolder, ensureChannelState, isSafeSegment, writeStateFile } from './state-root.js';

import type { ChannelConversation, ChannelName, ChannelResult } from './channel.js';
import type { NeedsYouItem } from './needs-you.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The index's one schema version. */
export const APPROVALS_SCHEMA_VERSION = 1;

/** The prefix every action id carries, so a press is told apart from a typed line. */
export const ACTION_ID_PREFIX = 'approval-v1';

/** The two choices a prompt offers when its item names none. */
export const YES_NO_CHOICES: readonly string[] = Object.freeze(['YES', 'NO']);

/** One prompt a chat is holding, keyed in the index by the item it asks about. */
export interface ApprovalPrompt {
  channel: ChannelName;
  conversation: string;
  choices: string[];
  expiresAt: string;
  sentAt: string;
}

/** How often one actor answered a prompt it may not answer. */
export interface NotApproverCount {
  failures: number;
  lastAt: string;
}

/** The approvals.json file: every prompt a chat holds and every refusal count. */
export interface ApprovalIndex {
  schemaVersion: 1;
  prompts: Record<string, ApprovalPrompt>;
  notApprover: Record<string, NotApproverCount>;
}

/** The index as one read sees it, with the entries that read expired beside it. */
export interface IndexRead {
  index: ApprovalIndex;
  expired: Record<string, ApprovalPrompt>;
}

// ───────────────────────────────────────────────────────────────────
// 2. THE FILE
// ───────────────────────────────────────────────────────────────────

/**
 * The approvals.json file of one identity. Creates nothing.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 */
export function approvalsFile(stateRoot: string, identity: string): string {
  return join(channelFolder(stateRoot, identity), 'approvals.json');
}

/** Whether a parsed value is a plain object, the only shape an index section may take. */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Whether a value is a non-empty string. */
function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value !== '';
}

/** Whether a value is a non-empty array of strings, the only shape a choice list may take. */
function isChoiceList(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((entry) => typeof entry === 'string');
}

/**
 * Read the approvals.json file of one identity.
 *
 * A missing file reads as an empty index, so a host that prompted nothing yet
 * is not an error. A file the runtime cannot trust is refused by name rather
 * than read as empty, because an empty read would drop every prompt a chat is
 * still holding. A single damaged entry is dropped instead, so one bad entry
 * never costs the rest.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @returns Every prompt and refusal count, or a named refusal.
 */
function readApprovalsFile(stateRoot: string, identity: string): ChannelResult<ApprovalIndex> {
  let text: string;
  try {
    text = readFileSync(approvalsFile(stateRoot, identity), 'utf8');
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code === 'ENOENT') {
      return { ok: true, value: { schemaVersion: APPROVALS_SCHEMA_VERSION, prompts: {}, notApprover: {} } };
    }
    return { ok: false, reason: 'channel-approvals-invalid', detail: 'unreadable' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'channel-approvals-invalid', detail: 'not json' };
  }
  if (!isPlainObject(parsed)) {
    return { ok: false, reason: 'channel-approvals-invalid', detail: 'not an object' };
  }

  const file = parsed as { schemaVersion?: unknown; prompts?: unknown; notApprover?: unknown };
  if (file.schemaVersion !== undefined && file.schemaVersion !== 1) {
    const shown = typeof file.schemaVersion === 'number' ? String(file.schemaVersion) : 'not a number';
    return { ok: false, reason: 'channel-approvals-invalid', detail: `schemaVersion ${shown}` };
  }
  if (file.prompts !== undefined && !isPlainObject(file.prompts)) {
    return { ok: false, reason: 'channel-approvals-invalid', detail: 'prompts not an object' };
  }
  if (file.notApprover !== undefined && !isPlainObject(file.notApprover)) {
    return { ok: false, reason: 'channel-approvals-invalid', detail: 'notApprover not an object' };
  }

  const prompts: Record<string, ApprovalPrompt> = {};
  for (const [itemId, entry] of Object.entries((file.prompts ?? {}) as Record<string, unknown>)) {
    if (!isPlainObject(entry)) continue;
    const fields = entry as {
      channel?: unknown;
      conversation?: unknown;
      choices?: unknown;
      expiresAt?: unknown;
      sentAt?: unknown;
    };
    if (typeof fields.channel !== 'string' || !(CHANNEL_NAMES as readonly string[]).includes(fields.channel)) continue;
    if (!nonEmptyString(fields.conversation)) continue;
    if (!isChoiceList(fields.choices)) continue;
    if (typeof fields.expiresAt !== 'string' || typeof fields.sentAt !== 'string') continue;
    prompts[itemId] = {
      channel: fields.channel as ChannelName,
      conversation: fields.conversation,
      choices: fields.choices,
      expiresAt: fields.expiresAt,
      sentAt: fields.sentAt,
    };
  }

  const notApprover: Record<string, NotApproverCount> = {};
  for (const [actor, entry] of Object.entries((file.notApprover ?? {}) as Record<string, unknown>)) {
    if (!isPlainObject(entry)) continue;
    const fields = entry as { failures?: unknown; lastAt?: unknown };
    if (typeof fields.failures !== 'number' || !Number.isInteger(fields.failures) || fields.failures < 0) continue;
    if (typeof fields.lastAt !== 'string') continue;
    notApprover[actor] = { failures: fields.failures, lastAt: fields.lastAt };
  }

  return { ok: true, value: { schemaVersion: APPROVALS_SCHEMA_VERSION, prompts, notApprover } };
}

/**
 * Run one read-modify-write of the index under the approvals lock.
 *
 * Every prompt past its expiry is moved out of the index before fn sees it, so
 * an expired prompt is removed by the same read that notices it and no caller
 * has to sweep the file. The file is written only when something changed.
 *
 * A lock still held past the bound refuses the write rather than forcing it, so
 * the channel-busy throw is left to reach the caller.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @param now - The instant an entry is judged expired at.
 * @param fn - What to do with the index, and whether it changed.
 * @returns The value fn produced, or a named refusal.
 */
function withIndex<T>(
  stateRoot: string,
  identity: string,
  now: Date,
  fn: (read: IndexRead) => { value: T; changed: boolean },
): ChannelResult<T> {
  ensureChannelState(stateRoot, identity);
  return withStateLock(channelLockFile(stateRoot, identity, 'approvals'), () => {
    const read = readApprovalsFile(stateRoot, identity);
    if (!read.ok) return read;

    const index = read.value;
    const expired: Record<string, ApprovalPrompt> = {};
    for (const [itemId, prompt] of Object.entries(index.prompts)) {
      const at = Date.parse(prompt.expiresAt);
      if (Number.isNaN(at) || at <= now.getTime()) {
        expired[itemId] = prompt;
        delete index.prompts[itemId];
      }
    }

    const outcome = fn({ index, expired });
    if (Object.keys(expired).length > 0 || outcome.changed) {
      writeStateFile(approvalsFile(stateRoot, identity), index);
    }
    return { ok: true, value: outcome.value };
  });
}

/**
 * Read the index of one identity.
 *
 * An entry past its expiresAt is removed in the same read, so a caller that
 * only reads still leaves the file smaller than it found it.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @param now - The instant an entry is judged expired at.
 * @returns The index and the entries this read expired, or a named refusal.
 */
export function readApprovalIndex(
  stateRoot: string,
  identity: string,
  now: Date = new Date(),
): ChannelResult<IndexRead> {
  return withIndex(stateRoot, identity, now, (read) => ({ value: read, changed: false }));
}

// ───────────────────────────────────────────────────────────────────
// 3. THE ACTION ID
// ───────────────────────────────────────────────────────────────────

/**
 * The action id of one choice on one item.
 *
 * The index is 1-based and is the same number a numbered reply sends, so a
 * press and a typed number name the same choice. It is derived here and never
 * stored, so an id can never disagree with the item it points at.
 *
 * @param itemId - The needs-you item the prompt asks about.
 * @param index - The 1-based choice number.
 */
export function actionIdFor(itemId: string, index: number): string {
  return `${ACTION_ID_PREFIX}:${itemId}:${index}`;
}

/**
 * Read an action id back.
 *
 * The item id is split at the last colon, because an item id may itself hold
 * one. Anything that is not an id this module minted reads as null, so a
 * provider string never reaches a lookup.
 *
 * @param actionId - The id a press carried.
 * @returns The item and the 1-based choice number, or null.
 */
export function parseActionId(actionId: string): { itemId: string; index: number } | null {
  const prefix = `${ACTION_ID_PREFIX}:`;
  if (!actionId.startsWith(prefix)) return null;
  const rest = actionId.slice(prefix.length);
  const cut = rest.lastIndexOf(':');
  if (cut < 0) return null;
  const itemId = rest.slice(0, cut);
  const digits = rest.slice(cut + 1);
  if (!nonEmptyString(itemId) || !isSafeSegment(itemId)) return null;
  if (!/^[1-9][0-9]*$/.test(digits)) return null;
  return { itemId, index: Number(digits) };
}

// ───────────────────────────────────────────────────────────────────
// 4. WRITES
// ───────────────────────────────────────────────────────────────────

/**
 * The choices a prompt offers.
 *
 * An item that names options offers exactly those, and an item that names none
 * offers YES and NO. The list is copied, so a caller that edits what it gets
 * back never edits the item or the constant.
 *
 * @param item - The item the prompt asks about.
 */
export function choicesFor(item: Pick<NeedsYouItem, 'options'>): string[] {
  return Array.isArray(item.options) && item.options.length > 0 ? [...item.options] : [...YES_NO_CHOICES];
}

/**
 * Write the index entry of one prompt.
 *
 * The drain calls this before the queue entry goes sending, so a prompt a chat
 * may already hold is on disk before the send can happen. Writing it again for
 * one item replaces it, so a drain that stopped after this step writes the same
 * entry on its next pass.
 *
 * @param input - The identity, the item, the chat and the instant the prompt was sent.
 * @returns The entry as written, or a named refusal.
 */
export function writePromptEntry(input: {
  stateRoot: string;
  identity: string;
  itemId: string;
  channel: ChannelName;
  conversation: string;
  now?: Date;
}): ChannelResult<ApprovalPrompt> {
  const item = readNeedsYouItem(input.stateRoot, input.identity, input.itemId);
  if (!item.ok) return { ok: false, reason: item.reason, detail: item.detail };

  const now = input.now ?? new Date();
  const prompt: ApprovalPrompt = {
    channel: input.channel,
    conversation: input.conversation,
    choices: choicesFor(item.value),
    expiresAt: item.value.expiresAt,
    sentAt: now.toISOString(),
  };

  return withIndex(input.stateRoot, input.identity, now, ({ index }) => {
    index.prompts[input.itemId] = prompt;
    return { value: prompt, changed: true };
  });
}

/**
 * Remove the index entry of one item.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @param itemId - The needs-you item whose entry goes.
 * @param now - The instant an entry is judged expired at.
 * @returns True when an entry was removed, false when the item held none.
 */
export function removePromptEntry(
  stateRoot: string,
  identity: string,
  itemId: string,
  now: Date = new Date(),
): ChannelResult<boolean> {
  return withIndex(stateRoot, identity, now, ({ index }) => {
    if (index.prompts[itemId] === undefined) return { value: false, changed: false };
    delete index.prompts[itemId];
    return { value: true, changed: true };
  });
}

/**
 * Count one answer from an actor the roster does not name.
 *
 * It counts and locks no chat, because the lockout belongs to a chat that has
 * no link yet. `bots channel list` is its only reader.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @param actor - The actor the answer was attributed to.
 * @param now - The instant the refusal was seen at.
 * @returns The actor's count after this refusal, or a named refusal.
 */
export function countNotApprover(
  stateRoot: string,
  identity: string,
  actor: string,
  now: Date = new Date(),
): ChannelResult<NotApproverCount> {
  return withIndex(stateRoot, identity, now, ({ index }) => {
    const count: NotApproverCount = {
      failures: (index.notApprover[actor]?.failures ?? 0) + 1,
      lastAt: now.toISOString(),
    };
    index.notApprover[actor] = count;
    return { value: count, changed: true };
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. CHAT ANSWERS
// ───────────────────────────────────────────────────────────────────

/** The result of the caller's answer call, the shape answerItem returns. Declared here because this module may not import the answer module. */
export type ChannelAnswerResult =
  | { ok: true; value: { status: string; itemId: string } }
  | { ok: false; reason: string; detail?: string };

/** Calls answerItem with the linked actor and the surface channel. The caller binds the checkout, the actor and the environment. */
export type ChannelAnswerFn = (input: { itemId: string; text: string }) => ChannelAnswerResult;

/** One press or typed line a chat delivered, with everything the answer path reads. */
export interface ChatAnswerInput {
  stateRoot: string;
  identity: string;
  channel: ChannelName;
  conversation: ChannelConversation;
  /** The actor the chat linked, never a display name. */
  actor: string;
  /** approval-v1:<itemId>:<index> on a press, null on a typed line. */
  actionId: string | null;
  /** The typed line. Ignored on a press. */
  text: string;
  /** Whether the queue entry of an item's prompt on this channel is delivered. Only the reply grammar reads it. */
  delivered: (itemId: string) => boolean;
  answer: ChannelAnswerFn;
  now?: Date;
}

/** What the chat is told, or that the line is a chat message the reply grammar owns. */
export type ChatAnswerOutcome =
  | { kind: 'chat' }
  | { kind: 'reply'; text: string | null; itemId: string | null; reason: string | null };

/**
 * An instant without its milliseconds.
 *
 * A reply prints the second a human reads, and the stored instant keeps its
 * milliseconds, so the shortening happens here and never in the file.
 *
 * @param iso - The stored instant.
 */
function shortInstant(iso: string): string {
  return iso.replace(/\.\d{3}Z$/, 'Z');
}

/** One reply outcome, so every refusal in this section returns the same shape. */
function replyOutcome(
  text: string | null,
  itemId: string | null,
  reason: string | null,
): ChannelResult<ChatAnswerOutcome> {
  return { ok: true, value: { kind: 'reply', text, itemId, reason } };
}

/** Remove the index entry of one item, ignoring a failure or a throw. */
function removeEntry(input: ChatAnswerInput, itemId: string, now: Date): void {
  try {
    removePromptEntry(input.stateRoot, input.identity, itemId, now);
  } catch {
    // The answer is already recorded, and a stale entry resolves to the duplicate row on the next press.
  }
}

/** Count one refusal from an actor the roster does not name, ignoring a failure or a throw. */
function countRefusal(input: ChatAnswerInput, now: Date): void {
  try {
    countNotApprover(input.stateRoot, input.identity, input.actor, now);
  } catch {
    // The answer is already recorded, and a stale entry resolves to the duplicate row on the next press.
  }
}

/**
 * Turn the caller's answer result into the reply the chat sees.
 *
 * A settled answer drops the index entry, because the item now holds the truth
 * and a stale entry would only be read again. A failed removal is ignored,
 * because the answer is already recorded and a stale entry resolves to the
 * duplicate row on the next press.
 *
 * @param input - The chat, the actor and the caller's answer call.
 * @param itemId - The item the press named.
 * @param label - The choice number or the word YES or NO, as M07 prints it.
 * @param expiresAt - The instant the prompt expired at, as M15 prints it.
 * @param result - What the caller's answer call returned.
 */
function settle(
  input: ChatAnswerInput,
  itemId: string,
  label: string,
  expiresAt: string,
  result: ChannelAnswerResult,
): ChannelResult<ChatAnswerOutcome> {
  const now = input.now ?? new Date();

  if (result.ok) {
    removeEntry(input, itemId, now);
    if (result.value.status === 'duplicate') return replyOutcome(REPLIES.M08({ itemId }), itemId, null);
    return replyOutcome(REPLIES.M07({ choice: label, itemId, actor: input.actor }), itemId, null);
  }

  switch (result.reason) {
    case 'answer-not-approver':
      countRefusal(input, now);
      return replyOutcome(REPLIES.M14({ actor: input.actor }), itemId, 'answer-not-approver');
    case 'channel-roster-missing':
      return replyOutcome(REPLIES.M17(), itemId, result.reason);
    case 'item-expired':
      removeEntry(input, itemId, now);
      return replyOutcome(REPLIES.M15({ itemId, instant: shortInstant(expiresAt) }), itemId, result.reason);
    case 'item-answered-differently': {
      removeEntry(input, itemId, now);
      const item = readNeedsYouItem(input.stateRoot, input.identity, itemId);
      const answeredAt = item.ok && item.value.answer !== null ? item.value.answer.answeredAt : null;
      const text = answeredAt === null ? null : REPLIES.M18({ itemId, instant: shortInstant(answeredAt) });
      return replyOutcome(text, itemId, result.reason);
    }
    case 'item-busy':
      return replyOutcome(REPLIES.M19({ itemId }), itemId, result.reason);
    default:
      return replyOutcome(null, itemId, result.reason);
  }
}

/** Whether a prompt on this channel went out in the text form, the only form a typed reply answers. A buttons channel draws buttons except for a Slack prompt whose option is over the Slack cap. */
function takesTypedReply(channel: ChannelName, choices: readonly string[]): boolean {
  if (CAPABILITY_MATRIX[channel].buttons !== true) return true;
  return channel === 'slack' && choices.some((choice) => [...choice].length > SLACK_BUTTON_LABEL_MAX);
}

/**
 * Answer one item from a chat press.
 *
 * The index is the only source of the choices, so a press resolves against the
 * prompt the chat actually received and never against the item as it reads now.
 * A typed line is not a press, so the reply grammar resolves it against the
 * prompts this chat is holding.
 *
 * @param input - The chat, the actor, the press and the caller's answer call.
 * @returns The reply to send, or a named refusal when the index cannot be read.
 */
export function answerFromChat(input: ChatAnswerInput): ChannelResult<ChatAnswerOutcome> {
  const now = input.now ?? new Date();

  // A typed line carries no action id, so the reply grammar owns it.
  if (input.actionId === null) {
    const line = parseReply(input.text);
    if (line.kind === 'chat') return { ok: true, value: { kind: 'chat' } };

    if (input.conversation.isGroup) return replyOutcome(REPLIES.M16(), null, 'channel-group-approval');

    const read = readApprovalIndex(input.stateRoot, input.identity, now);
    if (!read.ok) return read;

    // Only a prompt whose queue entry is delivered is a prompt the person received.
    const candidates = Object.entries(read.value.index.prompts)
      .filter(
        ([itemId, prompt]) =>
          prompt.channel === input.channel &&
          prompt.conversation === input.conversation.id &&
          input.delivered(itemId) &&
          takesTypedReply(input.channel, prompt.choices),
      )
      .sort(([leftId, left], [rightId, right]) => {
        if (left.sentAt !== right.sentAt) return left.sentAt < right.sentAt ? -1 : 1;
        return leftId < rightId ? -1 : leftId > rightId ? 1 : 0;
      });

    if (candidates.length === 0) return { ok: true, value: { kind: 'chat' } };

    // None of the three says which prompt it means.
    if (candidates.length > 1 && (line.kind === 'number' || line.kind === 'yes' || line.kind === 'no')) {
      return replyOutcome(replyAmbiguous(candidates.map(([itemId]) => itemId)), null, 'reply-ambiguous');
    }

    const [itemId, prompt] = candidates[candidates.length - 1];
    const choices = prompt.choices;
    const yesNo = choices.length === 2 && choices[0] === 'YES' && choices[1] === 'NO';

    if (line.kind === 'not-a-choice') return replyOutcome(REPLIES.M20({ highest: choices.length }), itemId, null);
    if (line.kind === 'number' && line.value > choices.length) {
      return replyOutcome(REPLIES.M20({ highest: choices.length }), itemId, null);
    }

    let text: string;
    let label: string;
    if (line.kind === 'number') {
      text = yesNo ? (line.value === 1 ? 'yes' : 'no') : choices[line.value - 1];
      label = yesNo ? (line.value === 1 ? 'YES' : 'NO') : String(line.value);
    } else if (line.kind === 'yes') {
      if (!yesNo) return replyOutcome(REPLIES.M20({ highest: choices.length }), itemId, null);
      text = 'yes';
      label = 'YES';
    } else {
      // N maps to no before the answer call, so the answer seam records deny and the channel passes no scope of its own.
      text = 'no';
      label = 'NO';
    }

    const result = input.answer({ itemId, text });
    return settle(input, itemId, label, prompt.expiresAt, result);
  }

  const parsed = parseActionId(input.actionId);
  if (parsed === null) return replyOutcome(null, null, 'action-invalid');
  const { itemId, index } = parsed;

  if (input.conversation.isGroup) return replyOutcome(REPLIES.M16(), itemId, 'channel-group-approval');

  const read = readApprovalIndex(input.stateRoot, input.identity, now);
  if (!read.ok) return read;

  const entry = read.value.index.prompts[itemId];
  const gone = read.value.expired[itemId];

  if (gone !== undefined && gone.channel === input.channel && gone.conversation === input.conversation.id) {
    return replyOutcome(REPLIES.M15({ itemId, instant: shortInstant(gone.expiresAt) }), itemId, 'item-expired');
  }

  if (entry !== undefined && (entry.channel !== input.channel || entry.conversation !== input.conversation.id)) {
    // The index holds one chat per item, so another chat's press answers nothing.
    return replyOutcome(null, itemId, 'item-unknown');
  }

  let choices: string[];
  let expiresAt: string;
  if (entry !== undefined) {
    choices = entry.choices;
    expiresAt = entry.expiresAt;
  } else {
    // A second press, a redelivery after a crash and the second chat of a two-target bot reach this path, so the reply is the item's existing answered or expired row and never a new refusal.
    const item = readNeedsYouItem(input.stateRoot, input.identity, itemId);
    if (!item.ok) return replyOutcome(null, itemId, item.reason);
    choices = choicesFor(item.value);
    expiresAt = item.value.expiresAt;
  }

  if (index > choices.length) return replyOutcome(REPLIES.M20({ highest: choices.length }), itemId, null);

  const yesNo = choices.length === 2 && choices[0] === 'YES' && choices[1] === 'NO';
  const text = yesNo ? (index === 1 ? 'yes' : 'no') : choices[index - 1];
  const label = yesNo ? (index === 1 ? 'YES' : 'NO') : String(index);

  const result = input.answer({ itemId, text });
  return settle(input, itemId, label, expiresAt, result);
}

// ───────────────────────────────────────────────────────────────────
// 6. REPLY GRAMMAR
// ───────────────────────────────────────────────────────────────────

/** What one typed line means to the reply grammar. */
export type ReplyLine =
  | { kind: 'number'; value: number }
  | { kind: 'yes' }
  | { kind: 'no' }
  | { kind: 'not-a-choice' }
  | { kind: 'chat' };

/** Slack's button label cap, in code points. It mirrors the queue's BUTTON_LABEL_MAX for slack, because this module may not import the queue. A Slack prompt with a longer option was queued in the text form, so only that prompt takes a typed reply on Slack. */
export const SLACK_BUTTON_LABEL_MAX = 75;

/**
 * Read one typed line as a reply.
 *
 * Only a bare number or a bare yes or no is a reply, so a line that carries
 * punctuation stays a chat message and never answers a prompt by accident.
 *
 * @param text - The line the chat delivered.
 */
export function parseReply(text: string): ReplyLine {
  const t = text.trim().toLowerCase();
  if (/^[0-9]+$/.test(t)) {
    if (t === '0' || t.startsWith('0')) return { kind: 'not-a-choice' };
    return { kind: 'number', value: Number(t) };
  }
  if (t === 'yes' || t === 'y') return { kind: 'yes' };
  if (t === 'no' || t === 'n') return { kind: 'no' };
  return { kind: 'chat' };
}

/**
 * The reply a chat gets when a bare answer could mean more than one prompt.
 *
 * The line names every open prompt, so the person answers on the host instead
 * of the bot taking the answer for a question they did not mean.
 *
 * @param itemIds - The open prompts, oldest first, two or more.
 */
export function replyAmbiguous(itemIds: readonly string[]): string {
  const n = itemIds.length;
  const count = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'][n - 2] ?? String(n);
  const list = `${itemIds.slice(0, -1).join(', ')} and ${itemIds[n - 1]}`;
  const tail = n === 2 ? 'answers neither' : 'answers none of them';
  return `${count} prompts are open in this chat, ${list}, so a bare reply ${tail}. Answer on the host.`;
}
