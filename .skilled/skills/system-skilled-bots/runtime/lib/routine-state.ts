// ───────────────────────────────────────────────────────────────────
// MODULE: Routine State
// ───────────────────────────────────────────────────────────────────
//
// The per-bot routine state file records when a routine's outcome was
// reached, when ten failed runs in a row switched the bot off and which
// notice says so and when the operator last enabled it. It lives under the
// user-level state root, outside every checkout, so a run cannot rewrite it.
// A missing or damaged file reads as every field null, never as met, so
// damage can never stop a bot.

import { chmodSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { writeStateAtomic } from '../../../system-deep-loop/runtime/lib/deep-loop/atomic-state.js';
import { listNeedsYouItems, needsYouExpiry, readNeedsYouItem, writeNeedsYouItem } from './needs-you.js';
import { AWAITING_DECISION, readRunRecord } from './run-record.js';
import { identityStatePaths, isSafeSegment, STATE_DIR_MODE } from './state-root.js';
import { readSwitch, setSwitch } from './switches.js';

import type { NeedsYouItem } from './needs-you.js';
import type { Result } from './repo-config.js';
import type { RunRecord } from './run-record.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const ROUTINE_STATE_SCHEMA_VERSION = 1;

/** Owner-only: writeStateAtomic sets no mode, so the writer sets it after every write. */
export const ROUTINE_STATE_FILE_MODE = 0o600;

/** How many failed runs in a row switch a bot off. */
export const FATIGUE_THRESHOLD = 10;

/** The one sentence the fatigue notice asks, so the inbox line is stable. */
export const FATIGUE_QUESTION = 'This bot failed 10 runs in a row. Enable it again?';

export interface RoutineState {
  schemaVersion: 1;
  /** When the until check last exited 0. */
  untilMetAt: string | null;
  /** When ten failed runs in a row switched the bot off. */
  fatiguedAt: string | null;
  /** The needs-you item that tells the operator so. */
  fatigueItemId: string | null;
  /** When the operator last enabled the bot. Only runs dispatched later count toward the streak. */
  enabledAt: string | null;
}

export const EMPTY_ROUTINE_STATE: Readonly<RoutineState> = Object.freeze({
  schemaVersion: 1,
  untilMetAt: null,
  fatiguedAt: null,
  fatigueItemId: null,
  enabledAt: null,
});

const STATE_KEYS = ['schemaVersion', 'untilMetAt', 'fatiguedAt', 'fatigueItemId', 'enabledAt'] as const;

/** A read: the state, and whether a file was there but did not read. */
export interface RoutineStateRead {
  state: RoutineState;
  damaged: boolean;
}

/** What a routine bot's switches and state add up to, the first that applies in this order. */
export type RoutineSwitch = 'fatigued' | 'disabled' | 'completed' | 'paused' | 'enabled';

// ───────────────────────────────────────────────────────────────────
// 2. PATHS
// ───────────────────────────────────────────────────────────────────

/**
 * The routine state file of one bot. The bot id must already pass
 * isSafeSegment, which readRoutineState and writeRoutineState check before
 * they call this, so the path never leaves the routines folder.
 */
export function routineStateFile(stateRoot: string, identity: string, botId: string): string {
  return join(identityStatePaths(stateRoot, identity).routines, `${botId}.json`);
}

// ───────────────────────────────────────────────────────────────────
// 3. READ & WRITE
// ───────────────────────────────────────────────────────────────────

/**
 * Read the routine state of one bot. An unsafe id, a missing file and a file
 * that does not read all give every field null, so damage can never read as
 * met and never stops a bot. Never throws.
 *
 * @returns The state, and whether a file was there but did not read.
 */
export function readRoutineState(stateRoot: string, identity: string, botId: string): RoutineStateRead {
  const empty: RoutineStateRead = { state: { ...EMPTY_ROUTINE_STATE }, damaged: false };
  const damaged: RoutineStateRead = { state: { ...EMPTY_ROUTINE_STATE }, damaged: true };
  if (!isSafeSegment(botId)) return empty;

  let raw: string;
  try {
    raw = readFileSync(routineStateFile(stateRoot, identity, botId), 'utf8');
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'ENOENT' ? empty : damaged;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return damaged;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return damaged;

  const record = parsed as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!(STATE_KEYS as readonly string[]).includes(key)) return damaged;
  }
  if (record.schemaVersion !== ROUTINE_STATE_SCHEMA_VERSION) return damaged;

  // The three instants must be a date a reader can compare. The item id is an
  // id, not a date, so it is only held to being a string.
  for (const key of ['untilMetAt', 'fatiguedAt', 'enabledAt'] as const) {
    const value = record[key];
    if (value === undefined || value === null) continue;
    if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) return damaged;
  }
  const itemId = record.fatigueItemId;
  if (itemId !== undefined && itemId !== null && typeof itemId !== 'string') return damaged;

  return {
    state: {
      schemaVersion: 1,
      untilMetAt: (record.untilMetAt as string | null | undefined) ?? null,
      fatiguedAt: (record.fatiguedAt as string | null | undefined) ?? null,
      fatigueItemId: (record.fatigueItemId as string | null | undefined) ?? null,
      enabledAt: (record.enabledAt as string | null | undefined) ?? null,
    },
    damaged: false,
  };
}

/**
 * Write the routine state of one bot by temp file and rename, then set the
 * file owner-only. The chmod runs on every write, not only the first, so a
 * file an older runtime created with a looser mode is repaired by the next
 * write. The folder is made here on first write, because nothing else makes it.
 *
 * @returns The state file path, or `bot-id-invalid`.
 */
export function writeRoutineState(stateRoot: string, identity: string, botId: string, state: RoutineState): Result<string> {
  if (!isSafeSegment(botId)) return { ok: false, reason: 'bot-id-invalid' };
  const path = routineStateFile(stateRoot, identity, botId);
  mkdirSync(dirname(path), { recursive: true, mode: STATE_DIR_MODE });
  writeStateAtomic(path, {
    schemaVersion: ROUTINE_STATE_SCHEMA_VERSION,
    untilMetAt: state.untilMetAt,
    fatiguedAt: state.fatiguedAt,
    fatigueItemId: state.fatigueItemId,
    enabledAt: state.enabledAt,
  });
  chmodSync(path, ROUTINE_STATE_FILE_MODE);
  return { ok: true, value: path };
}

// ───────────────────────────────────────────────────────────────────
// 4. OUTCOME & ENABLE
// ───────────────────────────────────────────────────────────────────

/**
 * Record that the until check reached its outcome, or that it did not.
 *
 * Exit 0 is the outcome being reached and only that is durable. A check that
 * exited non-zero, timed out or could not spawn never switches a bot off and
 * never clears an outcome already recorded, so `met` false writes nothing at
 * all. The caller sets the `completed` switch itself, because this file is the
 * record of the outcome and the switch is the effect of it.
 *
 * @returns The state file path, or null when nothing was written.
 */
export function recordUntilOutcome(stateRoot: string, identity: string, botId: string, met: boolean, now: Date = new Date()): Result<string | null> {
  if (!met) return { ok: true, value: null };
  const read = readRoutineState(stateRoot, identity, botId);
  return writeRoutineState(stateRoot, identity, botId, { ...read.state, untilMetAt: now.toISOString() });
}

/**
 * Record that the operator enabled the bot, once the fatigue notice is
 * answered and before the switches clear.
 *
 * `untilMetAt` is kept, because it is the record of an outcome reached and not
 * a stop. Writing `enabledAt` before the switches clear means a failed run that
 * started before the enable is never counted after it. Calling this twice
 * converges on the same fields, so a retried enable is harmless.
 *
 * @returns The state file path, or `bot-id-invalid`.
 */
export function recordEnable(stateRoot: string, identity: string, botId: string, now: Date = new Date()): Result<string> {
  const read = readRoutineState(stateRoot, identity, botId);
  return writeRoutineState(stateRoot, identity, botId, { ...read.state, enabledAt: now.toISOString(), fatiguedAt: null, fatigueItemId: null });
}

// ───────────────────────────────────────────────────────────────────
// 5. STREAK & FATIGUE
// ───────────────────────────────────────────────────────────────────

/**
 * Whether a record is a failed run the streak counts.
 *
 * A parked run carries class operator and reason awaiting-decision, and a run
 * refused before dispatch carries a refusal, so neither is ever counted.
 */
export function isFailedRun(record: RunRecord): boolean {
  const refusal = record.exit.refusal;
  return record.exit.class !== null && (refusal === undefined || refusal === null) && record.exit.reason !== AWAITING_DECISION;
}

/**
 * How many failed runs in a row the bot has, read from its run records newest
 * first.
 *
 * The count is derived every time and never stored, because a stored count
 * would be a second truth beside the records. A refusal whose class is null
 * (precheck-silent, lease-held, paused, disabled) is skipped and the count
 * continues, so a stop between two failures leaves both counted. Any other
 * record stops the count, and so does a run dispatched at or before the
 * instant the operator last enabled the bot.
 *
 * @returns The count, at most FATIGUE_THRESHOLD.
 */
export function failureStreak(stateRoot: string, identity: string, botId: string): number {
  let names: string[];
  try {
    names = readdirSync(identityStatePaths(stateRoot, identity).records);
  } catch {
    return 0;
  }

  const records: RunRecord[] = [];
  for (const name of names) {
    if (!name.endsWith('.json')) continue;
    const runId = name.slice(0, -'.json'.length);
    if (!isSafeSegment(runId)) continue;
    const read = readRunRecord(stateRoot, identity, runId);
    if (!read.ok) continue;
    if (read.value.record.identity.botId !== botId) continue;
    records.push(read.value.record);
  }

  records.sort((a, b) => {
    const byTime = Date.parse(b.dispatch.dispatchedAt) - Date.parse(a.dispatch.dispatchedAt);
    if (byTime !== 0) return byTime;
    if (a.identity.runId === b.identity.runId) return 0;
    return a.identity.runId < b.identity.runId ? 1 : -1;
  });

  const enabledAt = readRoutineState(stateRoot, identity, botId).state.enabledAt;
  const cutoff = enabledAt === null ? null : Date.parse(enabledAt);

  let count = 0;
  for (const record of records) {
    if (cutoff !== null && Date.parse(record.dispatch.dispatchedAt) <= cutoff) break;
    if (isFailedRun(record)) {
      count += 1;
      if (count >= FATIGUE_THRESHOLD) break;
      continue;
    }
    const refusal = record.exit.refusal;
    if (refusal !== undefined && refusal !== null && record.exit.class === null) continue;
    break;
  }
  return count;
}

/**
 * The cause the disabled check names: fatigue when the routine state records
 * it, the operator's own stop otherwise. That check refuses before anything
 * else could name fatigue, so it reads the record to tell the two apart.
 */
export function disabledCause(state: Pick<RoutineState, 'fatiguedAt'>): 'routine-fatigued' | 'disabled' {
  return state.fatiguedAt !== null ? 'routine-fatigued' : 'disabled';
}

/**
 * What a routine bot's switches and state add up to, the first that applies.
 *
 * A recorded fatiguedAt with no disabled switch is not fatigued, because the
 * operator cleared the switch and the bot runs.
 */
export function routineSwitch(stateRoot: string, identity: string, botId: string, state: Pick<RoutineState, 'fatiguedAt'>): RoutineSwitch {
  if (readSwitch(stateRoot, identity, botId, 'disabled') !== null) {
    return state.fatiguedAt !== null ? 'fatigued' : 'disabled';
  }
  if (readSwitch(stateRoot, identity, botId, 'completed') !== null) return 'completed';
  if (readSwitch(stateRoot, identity, botId, 'paused') !== null) return 'paused';
  return 'enabled';
}

export interface FatigueInput {
  stateRoot: string;
  identity: string;
  botId: string;
  /** The failed run just recorded. */
  runId: string;
  /** The prompt that run was dispatched with. */
  prompt: string;
  /** The repository's needs-you expiry, in days. */
  expiryDays: number;
  now?: Date;
}

/**
 * Switch a bot off once it has failed FATIGUE_THRESHOLD runs in a row, and
 * tell the operator once.
 *
 * Called after a failed run's record is written, so that run is counted. The
 * order item, then state file, then switch is fixed: the disabled check reads
 * fatiguedAt to name the refusal, so the record lands before the switch, and
 * the notice lands first so a stop leaves something the operator can see.
 * Every step is safe to repeat, so a second evaluation converges on the same
 * three files.
 *
 * @returns The fatigue item's id, or null when the streak is short of the threshold.
 */
export function evaluateFatigue(input: FatigueInput): Result<string | null> {
  const { stateRoot, identity, botId } = input;
  if (failureStreak(stateRoot, identity, botId) < FATIGUE_THRESHOLD) return { ok: true, value: null };

  const { state } = readRoutineState(stateRoot, identity, botId);
  const now = input.now ?? new Date();

  // Reusing the open notice keeps one notice when a stop between two writes is
  // repaired by a later failed run.
  const open = listNeedsYouItems(stateRoot, identity, now).items.find(
    (listing) => listing.state === 'open' && listing.item.botId === botId && listing.item.question === FATIGUE_QUESTION,
  );
  const itemId = state.fatigueItemId ?? open?.item.id ?? input.runId;

  if (!readNeedsYouItem(stateRoot, identity, itemId).ok) {
    const item = {
      id: itemId,
      runId: itemId,
      botId,
      identity,
      question: FATIGUE_QUESTION,
      options: null,
      createdAt: now.toISOString(),
      expiresAt: needsYouExpiry(now, input.expiryDays),
      evidence: [],
      prompt: input.prompt,
      specFolder: null,
      answer: null,
      resumeRequestId: null,
    } satisfies NeedsYouItem;
    const written = writeNeedsYouItem(stateRoot, item);
    if (!written.ok) return written;
  }

  if (state.fatiguedAt === null || state.fatigueItemId !== itemId) {
    const written = writeRoutineState(stateRoot, identity, botId, { ...state, fatiguedAt: now.toISOString(), fatigueItemId: itemId });
    if (!written.ok) return written;
  }

  const switched = setSwitch(stateRoot, identity, botId, 'disabled', now);
  if (!switched.ok) return switched;

  return { ok: true, value: itemId };
}
