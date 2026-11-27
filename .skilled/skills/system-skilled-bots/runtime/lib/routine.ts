// ───────────────────────────────────────────────────────────────────
// MODULE: Routine Block
// ───────────────────────────────────────────────────────────────────
//
// A routine says what a bot is for, when it starts, whether it acts or only
// tells, and when it is done. Its first start renders into the trigger every
// other reader already consumes. `until` is prose and never reaches a shell.
// `until_check` is the one command that measures it.
//
// The block is pure data, so this module does no I/O. The trigger parser is
// passed in rather than imported, because the definition module imports this
// one and a value import back would close the cycle.

import type { Delivery, Trigger } from './definition.js';
import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const ROUTINE_KEYS = ['what', 'starts', 'does', 'until', 'until_check'] as const;

export const DOES_VALUES = ['act', 'tell'] as const;

export type Does = (typeof DOES_VALUES)[number];

export interface Routine {
  what: string;
  starts: Trigger[];
  does: Does;
  /** The outcome in the author's words. Printed, never executed. */
  until: string | null;
  /** The command run after a completed run. Exit 0 means the outcome is reached. */
  untilCheck: string | null;
}

/** The trigger parser definition.ts owns, passed in so this module imports no value from it. */
export type TriggerParser = (raw: unknown) => Result<Trigger>;

/** The shortest period a cron start may have. A standing instruction that fires more often is refused. */
export const ROUTINE_FLOOR_SECONDS = 900;

/** Characters that mean something to a shell. `until` is prose, so any of them is refused rather than escaped. */
export const UNTIL_SHELL_METACHARACTERS: readonly string[] = [';', '|', '&', '$', '`', '(', ')', '<', '>', '\n', '\r'];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

// ───────────────────────────────────────────────────────────────────
// 2. PARSE
// ───────────────────────────────────────────────────────────────────

/**
 * Parse a routine block into its five fields. Every defect comes back as a
 * refusal with a named reason, never a throw, so a checker can report every
 * bad file instead of stopping at the first.
 *
 * @param raw - The `routine` mapping as the frontmatter parser read it.
 * @param parseTrigger - The trigger parser, so this module imports no value from the definition module.
 * @returns The routine, or the first refusal in field order.
 */
export function parseRoutine(raw: unknown, parseTrigger: TriggerParser): Result<Routine> {
  if (!isPlainObject(raw)) return { ok: false, reason: 'routine-field-invalid', detail: 'routine' };

  const unknown = Object.keys(raw).find((key) => !(ROUTINE_KEYS as readonly string[]).includes(key));
  if (unknown !== undefined) return { ok: false, reason: 'unknown-key', detail: `routine.${unknown}` };

  const what = raw.what;
  if (!nonEmptyString(what)) return { ok: false, reason: 'routine-field-invalid', detail: 'what' };

  const rawStarts = raw.starts;
  if (!Array.isArray(rawStarts)) return { ok: false, reason: 'routine-field-invalid', detail: 'starts' };
  if (rawStarts.length === 0) {
    return { ok: false, reason: 'routine-starts-empty', detail: 'routine.starts holds no entry' };
  }

  const starts: Trigger[] = [];
  for (const [index, entry] of rawStarts.entries()) {
    const parsed = parseTrigger(entry);
    if (!parsed.ok) {
      return { ok: false, reason: 'routine-field-invalid', detail: `starts[${index}]: ${parsed.reason}` };
    }
    starts.push(parsed.value);
  }

  if (starts.length > 1) {
    const detail = `routine.starts holds ${starts.length} entries; one start is supported`;
    const cronCount = starts.filter((start) => start.kind === 'cron').length;
    if (cronCount >= 2) return { ok: false, reason: 'routine-starts-multiple-cron', detail };
    if (cronCount === 1 && starts[0]?.kind !== 'cron') {
      return { ok: false, reason: 'routine-starts-cron-not-first', detail };
    }
    return { ok: false, reason: 'routine-starts-multiple', detail };
  }

  const does = raw.does;
  if (!DOES_VALUES.includes(does as Does)) return { ok: false, reason: 'routine-field-invalid', detail: 'does' };

  let until: string | null = null;
  const rawUntil = raw.until;
  if (rawUntil !== undefined && rawUntil !== null) {
    if (!nonEmptyString(rawUntil)) return { ok: false, reason: 'routine-field-invalid', detail: 'until' };
    if (UNTIL_SHELL_METACHARACTERS.some((character) => rawUntil.includes(character))) {
      return {
        ok: false,
        reason: 'routine-until-shell-metacharacters',
        detail: 'routine.until is prose and never reaches a shell',
      };
    }
    until = rawUntil.trim();
  }

  let untilCheck: string | null = null;
  const rawUntilCheck = raw.until_check;
  if (rawUntilCheck !== undefined && rawUntilCheck !== null) {
    if (!nonEmptyString(rawUntilCheck)) {
      return { ok: false, reason: 'routine-field-invalid', detail: 'until_check' };
    }
    if (until === null) {
      return {
        ok: false,
        reason: 'routine-until-check-without-outcome',
        detail: 'routine.until_check needs the until it measures',
      };
    }
    untilCheck = rawUntilCheck.trim();
  }

  return {
    ok: true,
    value: {
      what: what.trim(),
      starts,
      does: does as Does,
      until,
      untilCheck,
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. RENDER
// ───────────────────────────────────────────────────────────────────

/**
 * Render the routine's trigger. The first start is the only source of the
 * trigger the installer, slot accounting and status read, so the list shape
 * never reaches them.
 *
 * @param routine - The routine whose first start is the trigger.
 * @returns The first start, which `parseRoutine` guarantees exists.
 */
export function renderTrigger(routine: Pick<Routine, 'starts'>): Trigger {
  return routine.starts[0] as Trigger;
}

/**
 * Phrase one start for a person, in the machine's local time. A cron
 * expression the table cannot phrase comes back as null rather than a guess.
 *
 * @param start - The parsed start to phrase.
 * @returns The short phrase, or null when the start has no phrase.
 */
export function describeStart(start: Trigger): string | null {
  if (start.kind === 'manual') return 'by hand';
  if (start.kind === 'git-hook') return 'on commit';
  if (start.kind === 'queue') return `on queue ${start.name}`;

  const fields = start.expression.trim().split(/\s+/);
  if (fields.length !== 5) return null;

  const [minute, hour, dom, month, dow] = fields;
  const minuteNumber = /^\d+$/.test(minute) ? Number(minute) : null;
  const hourNumber = /^\d+$/.test(hour) ? Number(hour) : null;
  const minuteStep = /^\*\/(\d+)$/.exec(minute);
  const hourStep = /^\*\/(\d+)$/.exec(hour);
  const dayFieldsAreStar = dom === '*' && month === '*';

  if (minuteNumber !== null && minuteNumber <= 59 && hourStep !== null && dayFieldsAreStar && dow === '*') {
    const step = Number(hourStep[1]);
    if (step >= 1 && step <= 23) return `every ${step}h`;
  }

  if (minuteStep !== null && hour === '*' && dayFieldsAreStar && dow === '*') {
    const step = Number(minuteStep[1]);
    if (step >= 1 && step <= 59) return `every ${step}m`;
  }

  if (minuteNumber !== null && minuteNumber <= 59 && hourNumber !== null && hourNumber <= 23 && dayFieldsAreStar) {
    const clock = `${String(hourNumber).padStart(2, '0')}:${String(minuteNumber).padStart(2, '0')}`;
    if (dow === '*') return `daily ${clock}`;
    if (dow === '1-5') return `weekdays ${clock}`;
  }

  return null;
}

/**
 * Map `does` to the delivery a run uses. `tell` sends nothing anywhere, so a
 * delivery key beside it has nothing to name and is refused.
 *
 * @param routine - The routine whose `does` decides the delivery.
 * @param declared - The delivery the definition parsed.
 * @param declaredInFile - Whether the BOT.md carried a `delivery` key.
 * @returns The delivery to use, or the refusal for `tell` beside a delivery key.
 */
export function routineDelivery(
  routine: Pick<Routine, 'does'>,
  declared: Delivery,
  declaredInFile: boolean,
): Result<Delivery> {
  if (routine.does === 'tell') {
    if (declaredInFile) {
      return {
        ok: false,
        reason: 'routine-tell-with-targets',
        detail: 'does: tell sends nothing, so a delivery key has nothing to name',
      };
    }
    return { ok: true, value: { mode: 'local-only' } };
  }
  return { ok: true, value: declared };
}

// ───────────────────────────────────────────────────────────────────
// 4. FLOOR
// ───────────────────────────────────────────────────────────────────

/**
 * Refuse a cron start that fires more often than the floor allows. The caller
 * measures the shortest period with the schedule module and passes it in,
 * because this module imports nothing outside its group.
 *
 * @param expression - The cron expression, named in the refusal so the author knows which start is too frequent.
 * @param periodSeconds - The shortest period between two slots near now, or null when fewer than two slots are near.
 * @returns Null when the start is allowed, or the refusal naming the floor.
 */
export function checkRoutineFloor(expression: string, periodSeconds: number | null): Result<null> {
  if (periodSeconds === null) return { ok: true, value: null };
  if (periodSeconds >= ROUTINE_FLOOR_SECONDS) return { ok: true, value: null };
  return {
    ok: false,
    reason: 'routine-floor-15-minutes',
    detail: `"${expression}" is under the ${ROUTINE_FLOOR_SECONDS}-second floor`,
  };
}
