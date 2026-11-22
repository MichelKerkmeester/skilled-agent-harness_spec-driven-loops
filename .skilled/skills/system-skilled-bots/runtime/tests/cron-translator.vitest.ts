// ───────────────────────────────────────────────────────────────────
// MODULE: Cron Translator Tests
// ───────────────────────────────────────────────────────────────────
//
// The matrix rows are cron field by form (star, list, range, step, macro).
// A translation must be exact or refused, so each refusal is asserted by id.

import { describe, expect, it } from 'vitest';

import {
  CRON_REFUSALS,
  DICTIONARY_CAP,
  SINGLE_DAY_FIELD_RULE,
  parseCron,
  translateCron,
} from '../lib/cron-translator.js';

import type { CalendarEntry } from '../lib/cron-translator.js';

function entries(expression: string): CalendarEntry[] {
  const result = translateCron(expression);
  if (!result.ok) throw new Error(`${expression} refused: ${result.reason}`);
  if (result.value.kind !== 'calendar') throw new Error(`${expression} is not a calendar translation`);
  return result.value.entries;
}

function refusal(expression: string): string {
  const result = translateCron(expression);
  if (result.ok) throw new Error(`${expression} translated`);
  return result.reason;
}

describe('translateCron: expansion', () => {
  it('yields 48 dictionaries for every 15 minutes in every second hour', () => {
    const list = entries('*/15 0-23/2 * * *');
    expect(list).toHaveLength(48);
    expect(list[0]).toEqual({ Hour: 0, Minute: 0 });
    expect(list[47]).toEqual({ Hour: 22, Minute: 45 });
  });

  it('keeps both day fields in one dictionary per time when both are restricted', () => {
    expect(entries('0 9 1 * 1')).toEqual([{ Day: 1, Weekday: 1, Hour: 9, Minute: 0 }]);
  });

  it('expands lists, ranges, a-from steps and months, and omits wildcard keys', () => {
    expect(entries('0,30 9-10 * * *')).toEqual([
      { Hour: 9, Minute: 0 }, { Hour: 9, Minute: 30 }, { Hour: 10, Minute: 0 }, { Hour: 10, Minute: 30 },
    ]);
    expect(entries('50/5 * * 6 *')).toEqual([{ Month: 6, Minute: 50 }, { Month: 6, Minute: 55 }]);
  });

  it('expands the daily and hourly macros', () => {
    expect(entries('@daily')).toEqual([{ Hour: 0, Minute: 0 }]);
    expect(entries('@hourly')).toEqual([{ Minute: 0 }]);
  });

  it('maps weekday 7 to 0 so 0,7 yields one Sunday entry', () => {
    expect(entries('0 9 1 * 0,7')).toEqual([{ Day: 1, Weekday: 0, Hour: 9, Minute: 0 }]);
  });

  it('emits every minute as StartInterval 60, including a full step', () => {
    expect(translateCron('* * * * *')).toEqual({ ok: true, value: { kind: 'interval', startInterval: 60 } });
    expect(translateCron('*/1 * * * *')).toEqual({ ok: true, value: { kind: 'interval', startInterval: 60 } });
  });

  it('is deterministic', () => {
    expect(translateCron('*/20 1,3 1-2 * 5')).toEqual(translateCron('*/20 1,3 1-2 * 5'));
  });

  it('translates a cron at the cap within the time bound', () => {
    const started = performance.now();
    // 16 minutes in each of 8 hours lands exactly on the cap.
    expect(entries('0-15 0-7 * * *')).toHaveLength(DICTIONARY_CAP);
    expect(performance.now() - started).toBeLessThan(50);
  });
});

describe('translateCron: day-field rules', () => {
  it('follows the current single-day-field rule for the weekday worked example', () => {
    // Refused until a fire log confirms a lone Weekday key fires only on matching days.
    expect(SINGLE_DAY_FIELD_RULE).toBe('refuse');
    expect(refusal('0 9 * * 1-5')).toBe('cron-single-day-field-unverified');
    expect(refusal('0 0 1 * *')).toBe('cron-single-day-field-unverified');
    expect(refusal('@weekly')).toBe('cron-single-day-field-unverified');
  });

  it('refuses a day pair cron reads as AND, which launchd cannot express', () => {
    expect(refusal('0 9 */2 * 1')).toBe('cron-day-fields-and');
  });

  it('treats a full day field next to a star as no day restriction', () => {
    expect(entries('0 9 1-31 * *')).toEqual([{ Hour: 9, Minute: 0 }]);
    expect(entries('0 9 * * 0-6')).toEqual([{ Hour: 9, Minute: 0 }]);
  });
});

describe('translateCron: refusals', () => {
  it('gives @reboot, @AppleNotOnBattery, percent-stdin and past-cap four distinct ids', () => {
    const ids = [
      refusal('@reboot'),
      refusal('@AppleNotOnBattery'),
      refusal('0 9 * * * echo %hello'),
      refusal('*/5 8-18 * * *'),
    ];
    expect(ids).toEqual(['cron-reboot', 'cron-apple-not-on-battery', 'cron-percent-stdin', 'cron-over-cap']);
    expect(new Set(ids).size).toBe(4);
  });

  it('parses @reboot before the translate step refuses it', () => {
    expect(parseCron('@reboot')).toEqual({ ok: true, value: { kind: 'special', name: '@reboot' } });
  });

  it('names the would-be count in the cap refusal instead of truncating', () => {
    const result = translateCron('*/5 8-18 * * *');
    expect(result).toMatchObject({ ok: false, reason: 'cron-over-cap' });
    expect(result.ok ? '' : result.detail).toContain('132');
  });

  it('refuses malformed input with named ids', () => {
    expect(refusal('')).toBe('cron-empty');
    expect(refusal('   ')).toBe('cron-empty');
    expect(refusal('@fortnightly')).toBe('cron-macro-unknown');
    expect(refusal('0 9 * *')).toBe('cron-field-count');
    expect(refusal('0 9 * * mon')).toBe('cron-field-invalid');
    expect(refusal('0 9-5 * * *')).toBe('cron-field-invalid');
    expect(refusal('*/0 * * * *')).toBe('cron-field-invalid');
    expect(refusal('60 * * * *')).toBe('cron-value-out-of-range');
    expect(refusal('0 0 0 * *')).toBe('cron-value-out-of-range');
  });

  it('only ever returns an id from the published list', () => {
    for (const expression of ['@reboot', '', '0 9 * * 1-5', '0 9 */2 * 1', '61 * * * *', 'x']) {
      const result = translateCron(expression);
      if (!result.ok) expect(CRON_REFUSALS).toContain(result.reason);
    }
  });
});
