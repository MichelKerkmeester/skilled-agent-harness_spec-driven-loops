// ───────────────────────────────────────────────────────────────────
// MODULE: Slot Lister
// ───────────────────────────────────────────────────────────────────
//
// launchd coalesces every slot a sleeping host missed into one fire, so the
// runner must list the slots that fire stood for to write `scheduled_at` and
// a skipped-slot summary. The lister reads only the translator's
// dictionaries, never a cron string: a second cron reader could drift from
// the one that decides what is installed, and the accounting would then lie.
//
// Calendar keys are read as local wall-clock values. Across a daylight-saving
// change a wall-clock time that does not exist is not listed, and a repeated
// one is listed once, at its first occurrence. The lister feeds accounting,
// not firing, so it never invents or doubles a slot. What launchd itself does
// at a clock change is not documented and is not assumed here.

import type { CalendarEntry, Translation } from './cron-translator.js';
import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

const ALL_HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const ALL_MINUTES = Array.from({ length: 60 }, (_, minute) => minute);

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

/** Whether a local calendar day matches an entry's Month, Day and Weekday keys. */
function dayMatches(entry: CalendarEntry, year: number, month: number, date: number): boolean {
  if (entry.Month !== undefined && entry.Month !== month + 1) return false;
  const weekday = new Date(year, month, date).getDay();
  const hasDay = entry.Day !== undefined;
  const hasWeekday = entry.Weekday !== undefined;
  // launchd's documented rule: with both day keys set, either one matching is enough.
  if (hasDay && hasWeekday) return entry.Day === date || entry.Weekday === weekday;
  if (hasDay) return entry.Day === date;
  if (hasWeekday) return entry.Weekday === weekday;
  return true;
}

/** The instant of a local wall-clock time, or null when that time does not exist that day. */
function localInstant(year: number, month: number, date: number, hour: number, minute: number): Date | null {
  const instant = new Date(year, month, date, hour, minute);
  const roundTrips = instant.getFullYear() === year && instant.getMonth() === month
    && instant.getDate() === date && instant.getHours() === hour && instant.getMinutes() === minute;
  // A time in a repeated hour has two instants. ECMAScript resolves an
  // ambiguous local time to the earlier one, which is the first occurrence
  // this rule wants; the fall-back test pins that behavior.
  return roundTrips ? instant : null;
}

// ───────────────────────────────────────────────────────────────────
// 3. LIST
// ───────────────────────────────────────────────────────────────────

/**
 * List the slots a translation schedules after `from` and up to `to`.
 *
 * For a calendar translation the slots are local wall-clock times. For
 * `StartInterval` they are `from` plus each whole interval, with no calendar
 * alignment, so `from` should be the last run.
 *
 * @param translation - The translator's output for one schedule.
 * @param from - Exclusive start: the last run or the previous fire.
 * @param to - Inclusive end: the fire being accounted for.
 * @returns Ascending, de-duplicated instants, or `slot-range-invalid` when `to` precedes `from`.
 */
export function listSlots(translation: Translation, from: Date, to: Date): Result<Date[]> {
  const start = from.getTime();
  const end = to.getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return { ok: false, reason: 'slot-range-invalid' };
  }

  if (translation.kind === 'interval') {
    const step = translation.startInterval * 1000;
    const slots: Date[] = [];
    for (let at = start + step; at <= end; at += step) slots.push(new Date(at));
    return { ok: true, value: slots };
  }

  const found = new Set<number>();
  const first = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  // Walk local calendar days by date parts, so a 23- or 25-hour day is still one day.
  for (let day = first; day.getTime() <= end; day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)) {
    const year = day.getFullYear();
    const month = day.getMonth();
    const date = day.getDate();
    for (const entry of translation.entries) {
      if (!dayMatches(entry, year, month, date)) continue;
      for (const hour of entry.Hour === undefined ? ALL_HOURS : [entry.Hour]) {
        for (const minute of entry.Minute === undefined ? ALL_MINUTES : [entry.Minute]) {
          const instant = localInstant(year, month, date, hour, minute);
          if (instant === null) continue;
          const at = instant.getTime();
          if (at > start && at <= end) found.add(at);
        }
      }
    }
  }
  return { ok: true, value: [...found].sort((a, b) => a - b).map((at) => new Date(at)) };
}
