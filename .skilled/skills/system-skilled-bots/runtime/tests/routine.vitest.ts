// ───────────────────────────────────────────────────────────────────
// MODULE: Routine Block Tests
// ───────────────────────────────────────────────────────────────────
//
// The block rules, the floor and the delivery mapping are proven here.

import { describe, expect, it } from 'vitest';

import { translateCron } from '../lib/cron-translator.js';
import { parseDefinition, parseTrigger } from '../lib/definition.js';
import { checkRoutineFloor, describeStart, parseRoutine, renderTrigger, routineDelivery } from '../lib/routine.js';
import { schedulePeriodSeconds } from '../lib/slot-accounting.js';

const ROUTINE_LINES = [
  'routine:',
  '  what: the morning digest',
  '  starts:',
  '    - {kind: cron, expression: "15 */6 * * *"}',
  '  does: tell',
];

function bot(lines: string[]): string {
  return ['---', 'id: digest', ...lines, 'runtime: {kind: cli-codex}', 'isolation: shared', '---', 'Summarize the commits.'].join('\n');
}

function block(extra: Record<string, unknown>): Record<string, unknown> {
  return {
    what: 'the morning digest',
    starts: [{ kind: 'cron', expression: '15 */6 * * *' }],
    does: 'tell',
    until: 'the digest is sent',
    ...extra,
  };
}

describe('routine block', () => {
  it('renders the trigger from the first start', () => {
    const parsed = parseRoutine(block({}), parseTrigger);
    if (!parsed.ok) throw new Error(parsed.reason);
    expect(renderTrigger(parsed.value)).toEqual({ kind: 'cron', expression: '15 */6 * * *' });

    const definition = parseDefinition(bot(ROUTINE_LINES));
    if (!definition.ok) throw new Error(definition.reason);
    expect(definition.value.trigger).toEqual({ kind: 'cron', expression: '15 */6 * * *' });

    expect(describeStart(definition.value.trigger)).toBe('every 6h');
    expect(describeStart({ kind: 'cron', expression: '0 2 * * *' })).toBe('daily 02:00');
  });

  it('refuses a start under fifteen minutes', () => {
    const translation = translateCron('*/5 * * * *');
    if (!translation.ok) throw new Error(translation.reason);
    const period = schedulePeriodSeconds(translation.value, new Date('2026-11-25T12:00:00Z'));
    expect(checkRoutineFloor('*/5 * * * *', period)).toMatchObject({ ok: false, reason: 'routine-floor-15-minutes' });
    expect(checkRoutineFloor('*/15 * * * *', 900)).toEqual({ ok: true, value: null });
    expect(checkRoutineFloor('0 2 * * *', 86400)).toEqual({ ok: true, value: null });
    expect(checkRoutineFloor('0 2 1 1 *', null)).toEqual({ ok: true, value: null });
  });

  it('maps does tell to local-only delivery', () => {
    expect(routineDelivery({ does: 'tell' }, { mode: 'targets', targets: [], onFailure: null }, false))
      .toEqual({ ok: true, value: { mode: 'local-only' } });
    expect(routineDelivery({ does: 'act' }, { mode: 'targets', targets: ['desktop'], onFailure: null }, true))
      .toEqual({ ok: true, value: { mode: 'targets', targets: ['desktop'], onFailure: null } });

    const definition = parseDefinition(bot(ROUTINE_LINES));
    if (!definition.ok) throw new Error(definition.reason);
    expect(definition.value.delivery).toEqual({ mode: 'local-only' });
  });

  it('refuses a check with no outcome', () => {
    expect(parseRoutine(block({ until: undefined, until_check: 'test -f reports/digest.md' }), parseTrigger))
      .toMatchObject({ ok: false, reason: 'routine-until-check-without-outcome' });

    const parsed = parseRoutine(block({}), parseTrigger);
    if (!parsed.ok) throw new Error(parsed.reason);
    expect(parsed.value.until).toBe('the digest is sent');
    expect(parsed.value.untilCheck).toBeNull();
  });

  it('refuses each parse name by name', () => {
    const cases: Array<[string, unknown]> = [
      ['routine-trigger-conflict', parseDefinition(bot(['trigger: {kind: manual}', 'routine:', '  what: x', '  starts:', '    - {kind: manual}', '  does: act']))],
      ['routine-tell-with-targets', parseDefinition(bot(['routine:', '  what: x', '  starts:', '    - {kind: manual}', '  does: tell', 'delivery: local-only']))],
      ['routine-starts-empty', parseRoutine(block({ starts: [] }), parseTrigger)],
      ['routine-starts-multiple-cron', parseRoutine(block({ starts: [{ kind: 'cron', expression: '0 9 * * *' }, { kind: 'cron', expression: '0 18 * * *' }] }), parseTrigger)],
      ['routine-starts-cron-not-first', parseRoutine(block({ starts: [{ kind: 'manual' }, { kind: 'cron', expression: '0 9 * * *' }] }), parseTrigger)],
      ['routine-starts-multiple', parseRoutine(block({ starts: [{ kind: 'cron', expression: '0 9 * * *' }, { kind: 'queue', name: 'inbox' }] }), parseTrigger)],
      ['routine-until-shell-metacharacters', parseRoutine(block({ until: 'the digest is sent; then stop' }), parseTrigger)],
    ];
    for (const [name, result] of cases) {
      expect(result, name).toMatchObject({ ok: false, reason: name });
    }
  });
});
