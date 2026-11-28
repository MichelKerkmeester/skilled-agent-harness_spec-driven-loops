// ───────────────────────────────────────────────────────────────────
// MODULE: Channel Send Queue
// ───────────────────────────────────────────────────────────────────
//
// Every outbound message is a file in channels/queue/ before it is sent, so
// a restart loses no send and a crash cannot repeat one. An entry is created
// exclusively under its idempotency key, so a second enqueue of one key
// enqueues nothing and the first entry stands. A state only moves forward:
// queued, then sending, then delivered or failed, and a send whose result is
// uncertain is unknown and never retried. This module is the only writer of
// the queue folder.

import { createHash, randomBytes } from 'node:crypto';
import { linkSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { CAPABILITY_MATRIX, CHANNEL_NAMES } from './channel.js';
import { readRunRecord, writeRunRecord } from './run-record.js';
import { channelFolder, ensureChannelState, isSafeSegment, STATE_DIR_MODE, STATE_FILE_MODE, writeGenerationStamp, writeStateFile } from './state-root.js';

import type { ChannelAdapter, ChannelIntentKind, ChannelName, ChannelOutboundIntent, ChannelResult, ChannelSendError, ChannelSendResult } from './channel.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

/**
 * The wait before each attempt, in milliseconds. The first row is zero, so a
 * new entry is due at once and a retry is the only thing that ever waits.
 */
export const BACKOFF_MS: readonly number[] = Object.freeze([0, 5000, 25000, 120000, 600000]);

/** How many attempts one entry gets before it is failed. The back-off table has one row per attempt. */
export const MAX_ATTEMPTS = 5;

/** The longest button label each channel draws, in code points. A channel with no row has no cap. Slack caps a button label at 75. */
export const BUTTON_LABEL_MAX: Readonly<Partial<Record<ChannelName, number>>> = Object.freeze({ slack: 75 });

/** Where one entry stands. A state only moves forward, so a later state is never overwritten by an earlier one. */
export type QueueState = 'queued' | 'sending' | 'delivered' | 'failed' | 'unknown';

/** Every state an entry can hold, in the order it moves through them. */
export const QUEUE_STATES: readonly QueueState[] = ['queued', 'sending', 'delivered', 'failed', 'unknown'];

/**
 * One outbound message, durable before it is sent. The idempotency key is the
 * file name, so the key and the entry can never disagree.
 */
export interface QueueEntry {
  schemaVersion: 1;
  idempotencyKey: string;
  channel: ChannelName;
  conversationId: string;
  text: string;
  /** Set on a prompt that answers one item, null otherwise. */
  itemId: string | null;
  /** Set on a message a run produced, null otherwise. */
  runId: string | null;
  state: QueueState;
  attempts: number;
  /** When the next attempt is due, null once the entry reached a final state. */
  nextAttemptAt: string | null;
  enqueuedAt: string;
  updatedAt: string;
  /** Why the last attempt failed, null while no attempt has failed. */
  error: ChannelSendError | null;
}

/** The form a prompt goes out in, chosen per prompt. */
export type PromptForm = 'buttons' | 'text';

// ───────────────────────────────────────────────────────────────────
// 2. FORM AND KEYS
// ───────────────────────────────────────────────────────────────────

/**
 * Choose the form one prompt goes out in.
 *
 * The form is chosen per prompt so one entry holds exactly what its transport
 * sends, and a Slack prompt with a longer option goes out in the text form
 * with no refusal.
 */
export function promptForm(channel: ChannelName, choices: readonly string[]): PromptForm {
  if (CAPABILITY_MATRIX[channel].buttons !== true) return 'text';
  const cap = BUTTON_LABEL_MAX[channel] ?? Infinity;
  return choices.every((choice) => [...choice].length <= cap) ? 'buttons' : 'text';
}

/** The queue folder of one identity. Creates nothing. */
export function queueFolder(stateRoot: string, identity: string): string {
  return join(channelFolder(stateRoot, identity), 'queue');
}

/** The file of one queue entry. Creates nothing. */
export function queueEntryFile(stateRoot: string, identity: string, key: string): string {
  return join(queueFolder(stateRoot, identity), `${key}.json`);
}

/** The key of the notice one run sends one channel, so a run notifies a channel once. */
export function noticeKey(runId: string, channel: ChannelName): string {
  return `notice-${runId}-${channel}`;
}

/**
 * The key of a plain send. The UTC minute is part of the hash, so a repeat
 * inside one minute is the same key and a later minute is a new send.
 */
export function sendKey(channel: ChannelName, conversationId: string, text: string, now: Date): string {
  const minute = now.toISOString().slice(0, 16);
  const digest = createHash('sha256').update(`${channel}\n${conversationId}\n${text}\n${minute}`).digest('hex');
  return `send-${digest.slice(0, 32)}`;
}

/** The key of a reply to one inbound message, so a redelivered message is answered once. */
export function replyKey(channel: ChannelName, conversationId: string, inboundMessageId: string): string {
  const digest = createHash('sha256').update(`${channel}\n${conversationId}\n${inboundMessageId}`).digest('hex');
  return `reply-${digest.slice(0, 32)}`;
}

// ───────────────────────────────────────────────────────────────────
// 3. READ
// ───────────────────────────────────────────────────────────────────

/** The refusal every malformed entry answers with, so a caller never reads a half entry. */
function invalidEntry(key: string): ChannelResult<QueueEntry> {
  return { ok: false, reason: 'queue-entry-invalid', detail: key };
}

/** Whether a field is a string or an explicit null. An absent field reads as null. */
function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

/** Whether a field holds a send error, every flag included, so a partial error is refused. */
function isSendError(value: unknown): value is ChannelSendError {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const fields = value as Record<string, unknown>;
  return typeof fields.kind === 'string'
    && typeof fields.message === 'string'
    && typeof fields.unsupported === 'boolean'
    && typeof fields.retryable === 'boolean'
    && typeof fields.sentBeforeError === 'boolean';
}

/**
 * Read one queue entry.
 *
 * A missing file is a named unknown, because a caller that cannot tell a
 * missing entry from a damaged one would resend. Every other failure is
 * invalid, so a damaged entry is never read as a fresh one.
 */
export function readQueueEntry(stateRoot: string, identity: string, key: string): ChannelResult<QueueEntry> {
  let text: string;
  try {
    text = readFileSync(queueEntryFile(stateRoot, identity, key), 'utf8');
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code === 'ENOENT') {
      return { ok: false, reason: 'queue-entry-unknown', detail: key };
    }
    return invalidEntry(key);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return invalidEntry(key);
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return invalidEntry(key);

  const file = parsed as Record<string, unknown>;
  if (file.schemaVersion !== undefined && file.schemaVersion !== 1) return invalidEntry(key);

  const { idempotencyKey, conversationId, text: body, enqueuedAt, updatedAt } = file;
  if (typeof idempotencyKey !== 'string'
    || typeof conversationId !== 'string'
    || typeof body !== 'string'
    || typeof enqueuedAt !== 'string'
    || typeof updatedAt !== 'string') return invalidEntry(key);

  const channel = file.channel;
  if (typeof channel !== 'string' || !(CHANNEL_NAMES as readonly string[]).includes(channel)) return invalidEntry(key);

  const state = file.state;
  if (typeof state !== 'string' || !(QUEUE_STATES as readonly string[]).includes(state)) return invalidEntry(key);

  const attempts = file.attempts === undefined ? 0 : file.attempts;
  if (typeof attempts !== 'number' || !Number.isSafeInteger(attempts) || attempts < 0) return invalidEntry(key);

  const itemId = file.itemId === undefined ? null : file.itemId;
  const runId = file.runId === undefined ? null : file.runId;
  const nextAttemptAt = file.nextAttemptAt === undefined ? null : file.nextAttemptAt;
  if (!isNullableString(itemId) || !isNullableString(runId) || !isNullableString(nextAttemptAt)) return invalidEntry(key);

  const error = file.error === undefined ? null : file.error;
  if (error !== null && !isSendError(error)) return invalidEntry(key);

  return {
    ok: true,
    value: {
      schemaVersion: 1,
      idempotencyKey,
      channel: channel as ChannelName,
      conversationId,
      text: body,
      itemId,
      runId,
      state: state as QueueState,
      attempts,
      nextAttemptAt,
      enqueuedAt,
      updatedAt,
      error,
    },
  };
}

/**
 * Read every entry in the queue folder.
 *
 * A missing folder is an empty queue, because a host that never sent anything
 * has no queue yet. A name that is not an entry file is skipped, and so is an
 * entry that does not read, so one damaged file never hides the rest.
 */
export function listQueueEntries(stateRoot: string, identity: string): QueueEntry[] {
  let names: string[];
  try {
    names = readdirSync(queueFolder(stateRoot, identity));
  } catch {
    return [];
  }

  const entries: QueueEntry[] = [];
  for (const name of names) {
    if (!name.endsWith('.json') || name.includes('.tmp')) continue;
    const read = readQueueEntry(stateRoot, identity, name.slice(0, -'.json'.length));
    if (!read.ok) continue;
    entries.push(read.value);
  }

  // An enqueuedAt is an ISO-8601 UTC string, so its text order is its time order.
  entries.sort((a, b) => {
    if (a.enqueuedAt !== b.enqueuedAt) return a.enqueuedAt < b.enqueuedAt ? -1 : 1;
    if (a.idempotencyKey === b.idempotencyKey) return 0;
    return a.idempotencyKey < b.idempotencyKey ? -1 : 1;
  });
  return entries;
}

// ───────────────────────────────────────────────────────────────────
// 4. ENQUEUE
// ───────────────────────────────────────────────────────────────────

/** What one enqueue asks for. The key is the idempotency key and the file name. */
export interface EnqueueInput {
  stateRoot: string;
  identity: string;
  key: string;
  channel: ChannelName;
  conversationId: string;
  text: string;
  itemId?: string | null;
  runId?: string | null;
  now?: Date;
}

/** A key names its own file, so it carries a kind prefix and no path separator. */
const QUEUE_KEY = /^[a-z]+-[A-Za-z0-9._-]+$/;

/**
 * Put one message in the queue.
 *
 * The file exists before any I/O, a second enqueue of one key enqueues
 * nothing, and the link makes the create atomic so no reader sees a torn
 * entry.
 */
export function enqueueChannel(input: EnqueueInput): ChannelResult<{ created: boolean; entry: QueueEntry }> {
  if (!QUEUE_KEY.test(input.key) || !isSafeSegment(input.key)) {
    return { ok: false, reason: 'queue-key-invalid', detail: input.key };
  }

  const stamp = (input.now ?? new Date()).toISOString();
  ensureChannelState(input.stateRoot, input.identity);
  mkdirSync(queueFolder(input.stateRoot, input.identity), { recursive: true, mode: STATE_DIR_MODE });

  const entry: QueueEntry = {
    schemaVersion: 1,
    idempotencyKey: input.key,
    channel: input.channel,
    conversationId: input.conversationId,
    text: input.text,
    itemId: input.itemId ?? null,
    runId: input.runId ?? null,
    state: 'queued',
    attempts: 0,
    nextAttemptAt: stamp,
    enqueuedAt: stamp,
    updatedAt: stamp,
    error: null,
  };

  const file = queueEntryFile(input.stateRoot, input.identity, input.key);
  const temp = `${file}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`;
  try {
    writeFileSync(temp, `${JSON.stringify(entry, null, 2)}\n`, { flag: 'wx', mode: STATE_FILE_MODE });
    linkSync(temp, file);
    return { ok: true, value: { created: true, entry } };
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code !== 'EEXIST') throw error;
    const existing = readQueueEntry(input.stateRoot, input.identity, input.key);
    if (!existing.ok) return existing;
    return { ok: true, value: { created: false, entry: existing.value } };
  } finally {
    rmSync(temp, { force: true });
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. DRAIN
// ───────────────────────────────────────────────────────────────────

/** A send error that may carry the provider's own wait, read when present and never stored. */
export interface SendErrorWithWait extends ChannelSendError {
  retryAfterMs?: number;
}

/** The transports one drain may send through, one per channel it can reach. */
export type ChannelTransports = Partial<Record<ChannelName, Pick<ChannelAdapter, 'send'>>>;

/** What a drain calls around an entry that answers one item. */
export interface DrainHooks {
  /** Runs before an entry that carries an item id goes sending. The caller writes the approval index entry here, and its choices pick the intent kind. */
  beforeSend?: (entry: QueueEntry) => ChannelResult<{ choices: string[] }>;
  /** Runs after an entry that carries an item id ends failed. The caller removes the approval index entry here, so a reply never resolves against a prompt that never arrived. */
  afterFailed?: (entry: QueueEntry) => void;
}

/** What one drain asks for. */
export interface DrainInput {
  stateRoot: string;
  identity: string;
  transports: ChannelTransports;
  hooks?: DrainHooks;
  /** Drain this one key only. */
  only?: string;
  now?: Date;
}

/** One entry's outcome in a drain report. */
export interface DrainLine {
  key: string;
  channel: ChannelName;
  state: QueueState;
  note: string | null;
}

/** What one drain did, so a caller can print it and a test can read it. */
export interface DrainReport {
  lines: DrainLine[];
  unknown: QueueEntry[];
  failed: number;
  refusal: { reason: string; detail: string } | null;
}

/** Send error kinds that mean the transport itself cannot be reached. The queue keeps the entry and the pass stops. */
export const DRAIN_REFUSALS: readonly string[] = ['channel-daemon-unreachable'];

/** The states one state may move to. A terminal state has no row, so it never moves again. */
const FORWARD_STATES: Readonly<Record<QueueState, readonly QueueState[]>> = {
  queued: ['sending'],
  sending: ['delivered', 'failed', 'unknown', 'queued'],
  delivered: [],
  failed: [],
  unknown: [],
};

/**
 * Move one entry to a later state, in place.
 *
 * A state only moves forward, so a late writer can never reopen a delivered
 * entry or resend a failed one. A backward move throws, because it means two
 * writers disagree about one entry and the file must not be written.
 */
function advance(entry: QueueEntry, to: QueueState): void {
  const from = entry.state;
  if (!FORWARD_STATES[from].includes(to)) throw new Error(`queue-state-backward: ${from} to ${to}`);
  entry.state = to;
}

/** The line a drain prints for an entry whose send may have landed, so an operator knows it is not retried. */
export function m21Line(entry: QueueEntry): string {
  return `bots: channel ${entry.channel}: ${entry.idempotencyKey} is unknown: the send may have landed, so it is not retried`;
}

/**
 * Write one entry's outcome to the run record it belongs to.
 *
 * The queue file stays the authority, so a record that cannot be read or
 * written leaves the entry as it is and the next reader still sees the truth.
 *
 * @returns True when the record was written.
 */
function recordOutcome(stateRoot: string, identity: string, entry: QueueEntry): boolean {
  try {
    // Only a terminal state has an outcome to record, and only these three are delivery states.
    const state = entry.state;
    if (state !== 'delivered' && state !== 'failed' && state !== 'unknown') return false;
    if (entry.runId === null) return false;
    const read = readRunRecord(stateRoot, identity, entry.runId);
    if (!read.ok) return false;
    const record = read.value.record;
    const target = `${entry.channel}:${entry.conversationId}`;
    let touched = false;
    for (const row of record.delivery) {
      if (row.channel !== entry.channel || row.target !== target) continue;
      row.state = state;
      row.evidence = state === 'delivered'
        ? entry.idempotencyKey
        : `${entry.idempotencyKey}: ${entry.error?.message ?? 'the send may have landed'}`;
      touched = true;
    }
    if (!touched) return false;
    return writeRunRecord(stateRoot, record).ok;
  } catch {
    return false;
  }
}

/**
 * Send every due entry once, in queue order.
 *
 * An entry is written as sending before the transport is called and its
 * outcome after, so a process that stops mid-send leaves a sending entry the
 * next drain turns into unknown rather than resending. A transport that cannot
 * be reached stops the pass, because no later entry could go out either.
 */
export async function drainQueue(input: DrainInput): Promise<DrainReport> {
  const now = input.now ?? new Date();
  const hooks = input.hooks ?? {};
  const only = input.only;
  const report: DrainReport = { lines: [], unknown: [], failed: 0, refusal: null };
  let recorded = false;

  const write = (entry: QueueEntry): void => {
    entry.updatedAt = now.toISOString();
    writeStateFile(queueEntryFile(input.stateRoot, input.identity, entry.idempotencyKey), entry);
  };

  const entries = listQueueEntries(input.stateRoot, input.identity)
    .filter((entry) => only === undefined || entry.idempotencyKey === only);

  // A sending entry at the start belongs to a process that stopped mid-send, so it is never resent.
  for (const entry of entries) {
    if (entry.state !== 'sending') continue;
    advance(entry, 'unknown');
    entry.nextAttemptAt = null;
    write(entry);
    if (recordOutcome(input.stateRoot, input.identity, entry)) recorded = true;
    report.unknown.push(entry);
    report.lines.push({
      key: entry.idempotencyKey,
      channel: entry.channel,
      state: entry.state,
      note: 'found sending at the start of a drain',
    });
  }

  const due = entries.filter((entry) => entry.state === 'queued'
    && (entry.nextAttemptAt === null || Date.parse(entry.nextAttemptAt) <= now.getTime()));

  for (const entry of due) {
    const transport = input.transports[entry.channel];
    if (transport === undefined) {
      report.lines.push({ key: entry.idempotencyKey, channel: entry.channel, state: 'queued', note: 'no transport' });
      continue;
    }

    let choices: string[] | null = null;
    if (entry.itemId !== null && hooks.beforeSend !== undefined) {
      let held: ChannelResult<{ choices: string[] }>;
      try {
        held = hooks.beforeSend(entry);
      } catch (error: unknown) {
        held = { ok: false, reason: error instanceof Error ? error.message : String(error) };
      }
      if (!held.ok) {
        report.lines.push({ key: entry.idempotencyKey, channel: entry.channel, state: 'queued', note: `held: ${held.reason}` });
        continue;
      }
      choices = held.value.choices;
    }

    const before = entry.attempts;
    advance(entry, 'sending');
    entry.attempts = before + 1;
    write(entry);

    const kind: ChannelIntentKind = choices !== null && promptForm(entry.channel, choices) === 'buttons' ? 'buttons' : 'text';
    const intent: ChannelOutboundIntent = {
      kind,
      idempotencyKey: entry.idempotencyKey,
      conversationId: entry.conversationId,
      text: entry.text,
      itemId: kind === 'buttons' ? entry.itemId : null,
      choices: kind === 'buttons' ? choices : null,
    };

    let result: ChannelSendResult;
    try {
      result = await transport.send(intent);
    } catch (error: unknown) {
      // A send that threw may already have reached the platform.
      result = {
        ok: false,
        error: {
          kind: 'send-threw',
          message: error instanceof Error ? error.message : String(error),
          unsupported: false,
          retryable: false,
          sentBeforeError: true,
        },
      };
    }

    if (result.ok) {
      advance(entry, 'delivered');
      entry.error = null;
      entry.nextAttemptAt = null;
    } else {
      const error = result.error;
      // The stored error is the five fields alone, so a provider wait is read and never written.
      entry.error = {
        kind: error.kind,
        message: error.message,
        unsupported: error.unsupported,
        retryable: error.retryable,
        sentBeforeError: error.sentBeforeError,
      };
      if (error.sentBeforeError) {
        // One entry covers every chunk, so a retry would send a landed chunk twice.
        advance(entry, 'unknown');
        entry.nextAttemptAt = null;
        report.unknown.push(entry);
      } else if (DRAIN_REFUSALS.includes(error.kind)) {
        // The transport itself is unreachable, so no later entry could go out either.
        advance(entry, 'queued');
        entry.attempts = before;
        entry.nextAttemptAt = now.toISOString();
        report.refusal = { reason: error.kind, detail: error.message };
        write(entry);
        report.lines.push({ key: entry.idempotencyKey, channel: entry.channel, state: entry.state, note: error.message });
        break;
      } else if (error.retryable && entry.attempts < MAX_ATTEMPTS) {
        const wait = (error as SendErrorWithWait).retryAfterMs;
        const retryAfterMs = typeof wait === 'number' && Number.isFinite(wait) && wait >= 0 ? wait : 0;
        advance(entry, 'queued');
        entry.nextAttemptAt = new Date(now.getTime() + Math.max(BACKOFF_MS[entry.attempts], retryAfterMs)).toISOString();
      } else {
        advance(entry, 'failed');
        entry.nextAttemptAt = null;
        report.failed += 1;
        if (entry.itemId !== null) {
          try {
            hooks.afterFailed?.(entry);
          } catch {
            // The entry is already failed, so a hook that throws must not stop the pass.
          }
        }
      }
    }

    write(entry);
    if (entry.state === 'delivered' || entry.state === 'failed' || entry.state === 'unknown') {
      if (recordOutcome(input.stateRoot, input.identity, entry)) recorded = true;
    }
    report.lines.push({
      key: entry.idempotencyKey,
      channel: entry.channel,
      state: entry.state,
      note: entry.error?.message ?? null,
    });
  }

  // One stamp per pass, so a status index sees the queue transitions.
  if (recorded) writeGenerationStamp(input.stateRoot, input.identity);
  return report;
}
