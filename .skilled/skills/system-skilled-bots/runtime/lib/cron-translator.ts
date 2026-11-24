// ───────────────────────────────────────────────────────────────────
// MODULE: Cron Translator
// ───────────────────────────────────────────────────────────────────
//
// launchd takes calendar dictionaries that hold one integer per key, and a
// bot author writes cron. A translation that fires a superset or a subset
// of cron's fire set runs an unattended agent on the wrong days, so every
// cron string either becomes dictionaries that fire exactly as cron would
// or is refused with a named invariant id. This is the only cron reader in
// the hub: the checker, the installer and the slot lister read its output.

import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** One launchd StartCalendarInterval dictionary. A missing key is a wildcard. */
export interface CalendarEntry {
  Month?: number;
  Day?: number;
  Weekday?: number;
  Hour?: number;
  Minute?: number;
}

export type Translation =
  | { kind: 'calendar'; entries: CalendarEntry[] }
  | { kind: 'interval'; startInterval: number };

/** A cron string that parsed: five expanded fields, or a recognised special. */
export type ParsedCron =
  | { kind: 'fields'; fields: CronFields }
  | { kind: 'special'; name: '@reboot' | '@AppleNotOnBattery' };

/** One expanded field: the sorted values, and whether cron sees it as a star. */
export interface CronField {
  values: number[];
  /** Cron treats a field that starts with `*` as unrestricted for the day-field rule. */
  star: boolean;
  /** Every value of the field's range is present. */
  full: boolean;
}

export interface CronFields {
  minute: CronField;
  hour: CronField;
  day: CronField;
  month: CronField;
  weekday: CronField;
}

/** Above this many dictionaries the translator refuses instead of truncating. */
export const DICTIONARY_CAP = 128;

/** The interval launchd uses for an every-minute schedule. */
export const EVERY_MINUTE_INTERVAL = 60;

/**
 * What the translator does with a cron that restricts only one of the two
 * day fields. launchd documents a missing key as a wildcard but never states
 * how a lone Weekday or Day key behaves. A live fire log settled it: a job
 * with Hour, Minute and a lone Weekday fired on its weekday and stayed silent
 * the next day with the host awake, so the key is emitted alone. A lone Day
 * key takes the same rule because the same wildcard sentence covers both.
 * Setting this back to refuse restores the refusal by its own id.
 */
export type SingleDayFieldRule = 'emit' | 'refuse';
export const SINGLE_DAY_FIELD_RULE: SingleDayFieldRule = 'emit';

/** Every refusal id the translator can return, so the checker and tests share one list. */
export const CRON_REFUSALS = [
  'cron-empty',
  'cron-percent-stdin',
  'cron-reboot',
  'cron-apple-not-on-battery',
  'cron-macro-unknown',
  'cron-field-count',
  'cron-field-invalid',
  'cron-value-out-of-range',
  'cron-day-fields-and',
  'cron-single-day-field-unverified',
  'cron-over-cap',
] as const;

export type CronRefusal = (typeof CRON_REFUSALS)[number];

const MACROS: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

const SPECIALS = ['@reboot', '@AppleNotOnBattery'] as const;

interface FieldSpec {
  name: keyof CronFields;
  min: number;
  max: number;
}

const FIELD_SPECS: readonly FieldSpec[] = [
  { name: 'minute', min: 0, max: 59 },
  { name: 'hour', min: 0, max: 23 },
  { name: 'day', min: 1, max: 31 },
  { name: 'month', min: 1, max: 12 },
  // Cron accepts 7 as a second Sunday; it folds to 0 after expansion.
  { name: 'weekday', min: 0, max: 7 },
];

const NUMBER = /^\d+$/;

function refuse(reason: CronRefusal, detail?: string): { ok: false; reason: CronRefusal; detail?: string } {
  return detail === undefined ? { ok: false, reason } : { ok: false, reason, detail };
}

// ───────────────────────────────────────────────────────────────────
// 2. PARSE
// ───────────────────────────────────────────────────────────────────

function parseNumber(text: string, spec: FieldSpec): Result<number> {
  if (!NUMBER.test(text)) return refuse('cron-field-invalid', `${spec.name}: ${text}`);
  const value = Number(text);
  if (value < spec.min || value > spec.max) {
    return refuse('cron-value-out-of-range', `${spec.name}: ${value} outside ${spec.min}-${spec.max}`);
  }
  return { ok: true, value };
}

function parseField(text: string, spec: FieldSpec): Result<CronField> {
  const values = new Set<number>();
  for (const part of text.split(',')) {
    const [rangeText, stepText, extra] = part.split('/');
    if (rangeText === undefined || rangeText === '' || extra !== undefined) {
      return refuse('cron-field-invalid', `${spec.name}: ${text}`);
    }
    let step = 1;
    if (stepText !== undefined) {
      if (!NUMBER.test(stepText) || Number(stepText) === 0) return refuse('cron-field-invalid', `${spec.name}: ${text}`);
      step = Number(stepText);
    }

    let low: number;
    let high: number;
    if (rangeText === '*') {
      low = spec.min;
      high = spec.max;
    } else {
      const bounds = rangeText.split('-');
      if (bounds.length > 2) return refuse('cron-field-invalid', `${spec.name}: ${text}`);
      const first = parseNumber(bounds[0] ?? '', spec);
      if (!first.ok) return first;
      low = first.value;
      if (bounds.length === 2) {
        const second = parseNumber(bounds[1] ?? '', spec);
        if (!second.ok) return second;
        high = second.value;
      } else {
        // `a/n` runs from a to the end of the range, as cron reads it.
        high = stepText === undefined ? low : spec.max;
      }
      if (high < low) return refuse('cron-field-invalid', `${spec.name}: ${text} runs backwards`);
    }
    for (let value = low; value <= high; value += step) values.add(value);
  }

  if (spec.name === 'weekday' && values.delete(7)) values.add(0);
  const sorted = [...values].sort((a, b) => a - b);
  const span = spec.name === 'weekday' ? 7 : spec.max - spec.min + 1;
  return { ok: true, value: { values: sorted, star: text.startsWith('*'), full: sorted.length === span } };
}

/**
 * Parse a cron string into expanded fields, or a recognised special such as
 * `@reboot`. Parsing succeeds for the specials so a checker can tell "valid
 * cron that launchd cannot express" from "not cron at all".
 *
 * @param expression - Five-field cron or a macro.
 * @returns The parsed form, or a refusal naming the defect.
 */
export function parseCron(expression: string): Result<ParsedCron> {
  const text = expression.trim();
  if (text === '') return refuse('cron-empty');
  if (text.includes('%')) return refuse('cron-percent-stdin', 'cron feeds text after % to stdin; launchd has no such channel');

  if (text.startsWith('@')) {
    const special = SPECIALS.find((name) => name === text);
    if (special !== undefined) return { ok: true, value: { kind: 'special', name: special } };
    const expanded = MACROS[text];
    if (expanded === undefined) return refuse('cron-macro-unknown', text);
    return parseCron(expanded);
  }

  const parts = text.split(/\s+/);
  if (parts.length !== FIELD_SPECS.length) {
    return refuse('cron-field-count', `expected ${FIELD_SPECS.length} fields, found ${parts.length}`);
  }
  const fields: Partial<CronFields> = {};
  for (const [index, spec] of FIELD_SPECS.entries()) {
    const field = parseField(parts[index] ?? '', spec);
    if (!field.ok) return field;
    fields[spec.name] = field.value;
  }
  return { ok: true, value: { kind: 'fields', fields: fields as CronFields } };
}

// ───────────────────────────────────────────────────────────────────
// 3. TRANSLATE
// ───────────────────────────────────────────────────────────────────

/** A field launchd should leave out: every value of its range is allowed. */
function omitted(field: CronField): boolean {
  return field.full;
}

/**
 * Decide how the two day fields reach launchd.
 *
 * Cron fires when either day field matches if both are restricted, and when
 * both match if either starts with `*`. launchd's documented rule for two
 * day keys is either-match, so the AND case has no exact translation.
 */
function dayKeys(fields: CronFields): Result<{ day: number[] | null; weekday: number[] | null }> {
  const dayRestricted = !fields.day.star || !fields.day.full;
  const weekdayRestricted = !fields.weekday.star || !fields.weekday.full;
  // A field written as `*` with every value is cron's unrestricted day field.
  const dayAll = fields.day.star && fields.day.full;
  const weekdayAll = fields.weekday.star && fields.weekday.full;

  if (dayAll && weekdayAll) return { ok: true, value: { day: null, weekday: null } };

  if (dayRestricted && weekdayRestricted) {
    if (fields.day.star || fields.weekday.star) {
      return refuse('cron-day-fields-and', 'cron needs both day fields to match here; launchd matches either');
    }
    return { ok: true, value: { day: fields.day.values, weekday: fields.weekday.values } };
  }

  // Exactly one day field restricts the schedule.
  const restrictedField = dayAll ? fields.weekday : fields.day;
  if (restrictedField.full) return { ok: true, value: { day: null, weekday: null } };
  if (SINGLE_DAY_FIELD_RULE === 'refuse') {
    return refuse(
      'cron-single-day-field-unverified',
      `a lone ${dayAll ? 'Weekday' : 'Day'} key is not yet confirmed to fire only on matching days`,
    );
  }
  return dayAll
    ? { ok: true, value: { day: null, weekday: fields.weekday.values } }
    : { ok: true, value: { day: fields.day.values, weekday: null } };
}

/**
 * Translate a cron string into launchd calendar dictionaries, or into
 * `StartInterval 60` for every minute, or refuse.
 *
 * The output order is fixed (month, day, weekday, hour, minute, each
 * ascending), so the same string always yields the same list.
 *
 * @param expression - Five-field cron or a macro.
 * @returns The translation, or a refusal with an invariant id from CRON_REFUSALS.
 */
export function translateCron(expression: string): Result<Translation> {
  const parsed = parseCron(expression);
  if (!parsed.ok) return parsed;
  if (parsed.value.kind === 'special') {
    return parsed.value.name === '@reboot'
      ? refuse('cron-reboot', 'launchd RunAtLoad also fires on every load, not only at boot')
      : refuse('cron-apple-not-on-battery', 'a power condition has no calendar form');
  }

  const fields = parsed.value.fields;
  if (omitted(fields.minute) && omitted(fields.hour) && omitted(fields.month)
    && fields.day.full && fields.weekday.full) {
    return { ok: true, value: { kind: 'interval', startInterval: EVERY_MINUTE_INTERVAL } };
  }

  const days = dayKeys(fields);
  if (!days.ok) return days;

  const axes: Array<[keyof CalendarEntry, number[] | null]> = [
    ['Month', omitted(fields.month) ? null : fields.month.values],
    ['Day', days.value.day],
    ['Weekday', days.value.weekday],
    ['Hour', omitted(fields.hour) ? null : fields.hour.values],
    ['Minute', omitted(fields.minute) ? null : fields.minute.values],
  ];

  const count = axes.reduce((product, [, values]) => product * (values === null ? 1 : values.length), 1);
  if (count > DICTIONARY_CAP) {
    return refuse('cron-over-cap', `${count} dictionaries exceed the cap of ${DICTIONARY_CAP}; split the schedule`);
  }

  let entries: CalendarEntry[] = [{}];
  for (const [key, values] of axes) {
    if (values === null) continue;
    entries = entries.flatMap((entry) => values.map((value) => ({ ...entry, [key]: value })));
  }
  return { ok: true, value: { kind: 'calendar', entries } };
}
