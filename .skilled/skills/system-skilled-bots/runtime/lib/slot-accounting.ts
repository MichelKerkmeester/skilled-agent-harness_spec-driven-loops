// ───────────────────────────────────────────────────────────────────
// MODULE: Slot Accounting
// ───────────────────────────────────────────────────────────────────
//
// launchd merges every slot a sleeping host missed into one fire, and it
// never says which slot a fire stood for. Without accounting, a fire after a
// week asleep reads the same as an on-time one. Each schedule fire therefore
// names its slot, how late it ran and which slots it stood in for, before
// anything is dispatched. The slots come from the slot lister over the
// translator's dictionaries, never from a second cron reader. Missed slots
// are summarized and never run: a backfill would turn one wake-up into a
// burst of unattended runs.
//
// The previous fire is read from one small snapshot per schedule under the
// user-level state root. The fire writes its own snapshot before dispatch,
// so even a fire that is held or refused is counted once, and the next fire
// never lists it again.

import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { writeStateAtomic } from '../../../system-deep-loop/runtime/lib/deep-loop/atomic-state.js';
import { translateCron } from './cron-translator.js';
import { listSlots } from './slot-lister.js';
import { slotSnapshotFile, STATE_DIR_MODE } from './state-root.js';

import type { Translation } from './cron-translator.js';
import type { Trigger } from './definition.js';
import type { Result } from './repo-config.js';
import type { SkippedSlotSummary } from './run-record.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** How a fire relates to its slot: within grace, past it, or standing in for missed slots. */
export const LATENESS_CLASSES = ['on-time', 'late', 'catch-up'] as const;

export type LatenessClass = (typeof LATENESS_CLASSES)[number];

/** The grace window is half the schedule period, held between these bounds. */
export const GRACE_MIN_SECONDS = 120;
export const GRACE_MAX_SECONDS = 7_200;

/** Why a fired slot was counted as skipped instead of dispatched: the bot waits on a decision. */
export const HELD_SLOT_REASON = 'held-needs-you';

/** How far back a first fire looks for the slot it stood for. */
const FIRST_FIRE_LOOKBACK_DAYS = 8;

/** The window either side of a slot that the period is measured over. */
const PERIOD_WINDOW_DAYS = 8;

const DAY_MS = 86_400_000;

/** What one fire stood for, in the run record's dispatch vocabulary. */
export interface FireAccount {
  scheduledAt: string | null;
  latenessSeconds: number | null;
  latenessClass: LatenessClass | null;
  skippedSlots: SkippedSlotSummary;
  graceSeconds: number;
}

/** The last fire of one schedule, written before its dispatch. */
export interface SlotSnapshot {
  scheduledAt: string | null;
  firedAt: string;
  runId: string;
}

export interface AccountInput {
  translation: Translation;
  /** When launchd started the job. */
  firedAt: Date;
  /** The slot of the previous fire, or its fire time; null for a first fire. */
  previous: Date | null;
  /** How many skipped instants the summary may list. */
  summaryCap: number;
}

export interface ScheduledFireInput {
  stateRoot: string;
  identity: string;
  botId: string;
  scheduleIndex: number;
  trigger: Trigger;
  firedAt: Date;
  runId: string;
  summaryCap: number;
}

// ───────────────────────────────────────────────────────────────────
// 2. PERIOD & GRACE
// ───────────────────────────────────────────────────────────────────

/**
 * The shortest gap between two slots near an instant, in seconds.
 *
 * @returns The period, or null when the window holds fewer than two slots.
 */
export function schedulePeriodSeconds(translation: Translation, around: Date): number | null {
  if (translation.kind === 'interval') return translation.startInterval;
  const from = new Date(around.getTime() - PERIOD_WINDOW_DAYS * DAY_MS);
  const to = new Date(around.getTime() + PERIOD_WINDOW_DAYS * DAY_MS);
  const slots = listSlots(translation, from, to);
  if (!slots.ok || slots.value.length < 2) return null;
  let shortest = Number.POSITIVE_INFINITY;
  for (let index = 1; index < slots.value.length; index += 1) {
    const gap = (slots.value[index] as Date).getTime() - (slots.value[index - 1] as Date).getTime();
    if (gap > 0 && gap < shortest) shortest = gap;
  }
  return Number.isFinite(shortest) ? shortest / 1000 : null;
}

/**
 * Half the schedule period, clamped. A schedule with no second slot nearby
 * fires rarely, so it gets the widest window.
 */
export function graceWindowSeconds(translation: Translation, around: Date): number {
  const period = schedulePeriodSeconds(translation, around);
  if (period === null) return GRACE_MAX_SECONDS;
  return Math.min(GRACE_MAX_SECONDS, Math.max(GRACE_MIN_SECONDS, period / 2));
}

// ───────────────────────────────────────────────────────────────────
// 3. ACCOUNTING
// ───────────────────────────────────────────────────────────────────

function emptySummary(): SkippedSlotSummary {
  return { count: 0, slots: [], first: null, last: null };
}

/**
 * Account for one fire: the slot it stood for, its lateness and the slots it
 * skipped. Pure; it reads and writes nothing.
 *
 * The fired slot is the latest slot at or before the fire. Every earlier slot
 * after the previous fire is skipped, and only the most recent `summaryCap`
 * of them are listed. A fire with skipped slots is a catch-up; otherwise it
 * is on time within the grace window and late past it.
 *
 * @returns The account, or `slot-range-invalid` when the previous fire is after this one.
 */
export function accountFire(input: AccountInput): Result<FireAccount> {
  const { translation, firedAt } = input;
  const from = input.previous ?? new Date(firedAt.getTime() - FIRST_FIRE_LOOKBACK_DAYS * DAY_MS);
  const listed = listSlots(translation, from, firedAt);
  if (!listed.ok) return listed;

  let slots = listed.value;
  // A first fire has nothing before it to skip: it stands for its own slot only.
  if (input.previous === null && slots.length > 1) slots = slots.slice(-1);

  const fired = slots.at(-1) ?? (translation.kind === 'interval' ? firedAt : null);
  const grace = graceWindowSeconds(translation, fired ?? firedAt);
  if (fired === null) {
    return { ok: true, value: { scheduledAt: null, latenessSeconds: null, latenessClass: null, skippedSlots: emptySummary(), graceSeconds: grace } };
  }

  const skipped = slots.slice(0, -1);
  const cap = Math.max(0, Math.floor(input.summaryCap));
  const summary: SkippedSlotSummary = {
    count: skipped.length,
    slots: cap === 0 ? [] : skipped.slice(-cap).map((slot) => slot.toISOString()),
    first: skipped[0]?.toISOString() ?? null,
    last: skipped.at(-1)?.toISOString() ?? null,
  };
  const lateness = Math.max(0, Math.round((firedAt.getTime() - fired.getTime()) / 1000));
  let latenessClass: LatenessClass;
  if (skipped.length > 0) latenessClass = 'catch-up';
  else if (lateness <= grace) latenessClass = 'on-time';
  else latenessClass = 'late';

  return {
    ok: true,
    value: { scheduledAt: fired.toISOString(), latenessSeconds: lateness, latenessClass, skippedSlots: summary, graceSeconds: grace },
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. SNAPSHOT
// ───────────────────────────────────────────────────────────────────

/** Read one schedule's last-fire snapshot; null when there is none or it does not read. */
export function readSlotSnapshot(stateRoot: string, identity: string, botId: string, scheduleIndex: number): SlotSnapshot | null {
  const path = slotSnapshotFile(stateRoot, identity, botId, scheduleIndex);
  if (!existsSync(path)) return null;
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as Partial<SlotSnapshot>;
    if (typeof parsed.firedAt !== 'string' || typeof parsed.runId !== 'string') return null;
    return { scheduledAt: typeof parsed.scheduledAt === 'string' ? parsed.scheduledAt : null, firedAt: parsed.firedAt, runId: parsed.runId };
  } catch {
    return null;
  }
}

/**
 * Account for one schedule fire and write its snapshot before dispatch.
 *
 * The trigger is the definition as it reads at fire time. A trigger that is
 * no longer a cron, or whose cron no longer translates, cannot say what the
 * fire stood for, so it is refused and no snapshot is written.
 *
 * @returns The account, or `schedule-not-cron`, `schedule-index-invalid` or a translator refusal.
 */
export function recordScheduledFire(input: ScheduledFireInput): Result<FireAccount> {
  if (input.trigger.kind !== 'cron') return { ok: false, reason: 'schedule-not-cron', detail: input.trigger.kind };
  // A definition holds one trigger, so a schedule index past 0 names a schedule that no longer exists.
  if (input.scheduleIndex !== 0) return { ok: false, reason: 'schedule-index-invalid', detail: String(input.scheduleIndex) };
  const translation = translateCron(input.trigger.expression);
  if (!translation.ok) return translation;

  const snapshot = readSlotSnapshot(input.stateRoot, input.identity, input.botId, input.scheduleIndex);
  const previousText = snapshot === null ? null : snapshot.scheduledAt ?? snapshot.firedAt;
  const previous = previousText === null ? null : new Date(previousText);
  const usable = previous !== null && Number.isFinite(previous.getTime()) && previous.getTime() <= input.firedAt.getTime() ? previous : null;

  const account = accountFire({ translation: translation.value, firedAt: input.firedAt, previous: usable, summaryCap: input.summaryCap });
  if (!account.ok) return account;

  const path = slotSnapshotFile(input.stateRoot, input.identity, input.botId, input.scheduleIndex);
  mkdirSync(dirname(path), { recursive: true, mode: STATE_DIR_MODE });
  writeStateAtomic(path, {
    scheduledAt: account.value.scheduledAt,
    firedAt: input.firedAt.toISOString(),
    runId: input.runId,
  } satisfies SlotSnapshot);
  return account;
}
