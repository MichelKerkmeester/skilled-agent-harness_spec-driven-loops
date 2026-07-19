import { describe, expect, it } from 'vitest';

import {
  applyStatediffActions,
  createStatediffAction,
  flattenCompositeTarget,
  notifyStatediffSubscribers,
  planStatediff,
  type JsonValue,
  type StatediffSubscriber,
  type StatediffTargetSink,
  type TargetStateRow,
} from '../lib/storage/statediff';

function row(target: string, key: string, payload: JsonValue, hash?: string): TargetStateRow {
  return { target, key, payload, ...(hash ? { hash } : {}) };
}

describe('statediff action planning', () => {
  it('plans deterministic insert, replace, delete, and no-op actions', () => {
    const actions = planStatediff(
      [
        row('memory_index', 'b', { title: 'same' }, 'same-hash'),
        row('memory_index', 'a', { title: 'new' }, 'new-hash'),
        row('memory_index', 'c', { title: 'next' }, 'next-hash'),
      ],
      [
        row('memory_index', 'd', { title: 'old' }, 'old-hash'),
        row('memory_index', 'b', { title: 'same' }, 'same-hash'),
        row('memory_index', 'c', { title: 'prior' }, 'prior-hash'),
      ],
      { sourceOperation: 'scan' },
    );

    expect(actions.map((action) => [action.action, action.target, action.key])).toEqual([
      ['insert', 'memory_index', 'a'],
      ['replace', 'memory_index', 'c'],
      ['delete', 'memory_index', 'd'],
    ]);
    expect(actions[1]?.oldStateHash).toBe('prior-hash');
    expect(actions[1]?.newStateHash).toBe('next-hash');
  });

  it('uses upsert when prior knowledge is incomplete', () => {
    const actions = planStatediff(
      [row('memory_index', 'a', { title: 'desired' })],
      [],
      { sourceOperation: 'save', incompletePrior: true },
    );

    expect(actions).toHaveLength(1);
    expect(actions[0]?.action).toBe('upsert');
    expect(actions[0]?.oldStateHash).toBeNull();
    expect(actions[0]?.newStateHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('flattens composite targets before planning child projection changes', () => {
    const desired = flattenCompositeTarget({
      parent: row('memory_index', 'parent', { title: 'Parent' }),
      children: [
        row('child_projection', 'parent#b', { label: 'B' }),
        row('child_projection', 'parent#a', { label: 'A' }),
      ],
    });

    const actions = planStatediff(desired, [row('memory_index', 'parent', { title: 'Parent' })], {
      sourceOperation: 'scan',
    });

    expect(actions.map((action) => `${action.target}:${action.key}:${action.action}`)).toEqual([
      'child_projection:parent#a:insert',
      'child_projection:parent#b:insert',
    ]);
  });

  it('applies action sets through target sinks in stable order', async () => {
    const applied: string[] = [];
    const sink: StatediffTargetSink = {
      target: 'memory_index',
      apply: (action) => {
        applied.push(`${action.action}:${action.key}`);
      },
    };

    const batch = await applyStatediffActions([
      createStatediffAction('delete', { target: 'memory_index', key: 'b', sourceOperation: 'test' }),
      createStatediffAction('insert', { target: 'memory_index', key: 'a', sourceOperation: 'test' }),
    ], [sink]);

    expect(applied).toEqual(['insert:a', 'delete:b']);
    expect(batch.actions).toHaveLength(2);
    expect(batch.sourceOperation).toBe('test');
  });

  it('notifies subscribers that opt in and reports per-subscriber success/failure', async () => {
    const actions = [
      createStatediffAction('insert', { target: 'memory_index', key: 'a', sourceOperation: 'test' }),
    ];
    const ran: string[] = [];
    const subscribers: StatediffSubscriber[] = [
      { name: 'skipped', shouldRun: () => false, run: () => { ran.push('skipped'); } },
      { name: 'ok', shouldRun: () => true, run: () => { ran.push('ok'); } },
      { name: 'boom', shouldRun: () => true, run: () => { throw new Error('subscriber failed'); } },
    ];

    const reports = await notifyStatediffSubscribers(actions, subscribers);

    expect(ran).toEqual(['ok']);
    expect(reports).toEqual([
      { name: 'ok', actionCount: 1, ok: true },
      { name: 'boom', actionCount: 1, ok: false, error: 'subscriber failed' },
    ]);
  });
});
