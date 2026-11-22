// ───────────────────────────────────────────────────────────────────
// MODULE: Slot Lister Tests
// ───────────────────────────────────────────────────────────────────
//
// Runs under a fixed time zone with both daylight-saving changes of 2026.
// The agreement test compares the lister, which reads only translator
// output, against a minute-by-minute cron walk that lives here in the test
// and nowhere in the runtime.

process.env.TZ = 'Europe/Amsterdam';

import { describe, expect, it } from 'vitest';

import { parseCron, translateCron } from '../lib/cron-translator.js';
import { listSlots } from '../lib/slot-lister.js';

import type { CronFields, Translation } from '../lib/cron-translator.js';

function translation(expression: string): Translation {
  const result = translateCron(expression);
  if (!result.ok) throw new Error(`${expression} refused: ${result.reason}`);
  return result.value;
}

function slots(value: Translation, from: Date, to: Date): Date[] {
  const result = listSlots(value, from, to);
  if (!result.ok) throw new Error(result.reason);
  return result.value;
}

/** Cron's own day rule: both restricted means either matches, a star means both must. */
function cronMatches(fields: CronFields, at: Date): boolean {
  const has = (field: CronFields[keyof CronFields], value: number) => field.values.includes(value);
  if (!has(fields.minute, at.getMinutes()) || !has(fields.hour, at.getHours()) || !has(fields.month, at.getMonth() + 1)) {
    return false;
  }
  const day = has(fields.day, at.getDate());
  const weekday = has(fields.weekday, at.getDay());
  return fields.day.star || fields.weekday.star ? day && weekday : day || weekday;
}

/** Every real minute in (from, to], keeping the first instant of each local wall-clock time. */
function cronWalk(expression: string, from: Date, to: Date): Date[] {
  const parsed = parseCron(expression);
  if (!parsed.ok || parsed.value.kind !== 'fields') throw new Error(`${expression} does not parse to fields`);
  const seen = new Set<string>();
  const out: Date[] = [];
  const firstMinute = Math.floor(from.getTime() / 60_000) * 60_000 + 60_000;
  for (let at = firstMinute; at <= to.getTime(); at += 60_000) {
    const instant = new Date(at);
    const wall = `${instant.getFullYear()}-${instant.getMonth()}-${instant.getDate()} ${instant.getHours()}:${instant.getMinutes()}`;
    if (seen.has(wall)) continue;
    seen.add(wall);
    if (cronMatches(parsed.value.fields, instant)) out.push(instant);
  }
  return out;
}

const SPRING = { from: new Date('2026-03-28T00:00:00Z'), to: new Date('2026-03-30T23:00:00Z') };
const AUTUMN = { from: new Date('2026-10-24T00:00:00Z'), to: new Date('2026-10-26T23:00:00Z') };

describe('time zone guard', () => {
  it('runs in a zone where 02:30 on the spring change does not exist', () => {
    const gap = new Date(2026, 2, 29, 2, 30);
    expect(gap.getHours()).not.toBe(2);
  });
});

describe('daylight-saving rule', () => {
  it('drops a gap slot and lists a repeated slot once, at its first occurrence', () => {
    const daily = translation('30 2 * * *');
    const spring = slots(daily, SPRING.from, SPRING.to).map((at) => at.toISOString());
    expect(spring).toEqual(['2026-03-28T01:30:00.000Z', '2026-03-30T00:30:00.000Z']);

    const autumn = slots(daily, AUTUMN.from, AUTUMN.to).map((at) => at.toISOString());
    // 02:30 local occurs at 00:30Z (summer time) and 01:30Z (winter time) on 25 October.
    expect(autumn).toEqual(['2026-10-24T00:30:00.000Z', '2026-10-25T00:30:00.000Z', '2026-10-26T01:30:00.000Z']);
  });

  it('refuses a range that runs backwards', () => {
    expect(listSlots(translation('0 9 * * *'), SPRING.to, SPRING.from)).toMatchObject({ ok: false, reason: 'slot-range-invalid' });
  });
});

describe('lister and translator agree', () => {
  const cases: Array<{ name: string; expression: string; from: Date; to: Date }> = [
    { name: 'spring-forward boundary, 02:30 daily', expression: '30 2 * * *', ...SPRING },
    { name: 'fall-back boundary, every 15 minutes in every second hour', expression: '*/15 0-23/2 * * *', ...AUTUMN },
    { name: 'both day fields, first of the month or Monday', expression: '0 9 1 * 1', from: new Date('2026-05-30T00:00:00Z'), to: new Date('2026-07-02T00:00:00Z') },
    { name: 'day list with weekday range', expression: '0 0 1,15 * 1-5', from: new Date('2026-01-01T00:00:00Z'), to: new Date('2026-02-28T00:00:00Z') },
    { name: 'month restricted hourly', expression: '0 * * 6 *', from: new Date('2026-05-31T12:00:00Z'), to: new Date('2026-06-02T00:00:00Z') },
  ];

  for (const testCase of cases) {
    it(testCase.name, () => {
      const listed = slots(translation(testCase.expression), testCase.from, testCase.to).map((at) => at.getTime());
      const walked = cronWalk(testCase.expression, testCase.from, testCase.to).map((at) => at.getTime());
      expect(listed.length).toBeGreaterThan(0);
      expect(listed).toEqual(walked);
    });
  }

  it('StartInterval 60: one slot per minute after the last run, matching every-minute cron', () => {
    const from = new Date('2026-06-10T08:00:00Z');
    const to = new Date('2026-06-10T09:00:00Z');
    const value = translation('* * * * *');
    expect(value).toEqual({ kind: 'interval', startInterval: 60 });
    const listed = slots(value, from, to).map((at) => at.getTime());
    expect(listed).toHaveLength(60);
    expect(listed).toEqual(cronWalk('* * * * *', from, to).map((at) => at.getTime()));
  });

  it('lists a week of a five-minute schedule within the time bound', () => {
    const value = translation('*/5 * * * *');
    const started = performance.now();
    const week = slots(value, new Date('2026-06-01T00:00:00Z'), new Date('2026-06-08T00:00:00Z'));
    expect(performance.now() - started).toBeLessThan(200);
    expect(week).toHaveLength(7 * 24 * 12);
  });
});
