// Resume requests: keyed by the needs-you item, so a second send is a duplicate, and drained like any request.

import { afterEach, describe, expect, it } from 'vitest';

import { enqueueFromCheckout, RETRY_BOUND, readQuarantineReasons } from '../lib/request-queue.js';
import { runBot } from '../lib/runner.js';
import { writeNeedsYouItem, readNeedsYouItem } from '../lib/needs-you.js';
import { botWorld, IDENTITY, stubRunCount } from './runner-support.js';
import { drain, entries, queueOf, records, writeItem } from './queue-support.js';
import { cleanupTemp } from './support.js';

import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

function enqueueResume(world: BotWorld, botId: string, itemId: string) {
  return enqueueFromCheckout(world.checkoutRoot, { kind: 'resume', workflowId: botId, source: 'answer', eventId: itemId }, world.env);
}

describe('resume requests', () => {
  it('stores two resume sends for one item once and drains them into one run that joins the item', async () => {
    const world = botWorld();
    const parked = await runBot(world.input('needs-decision'));
    if (parked.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${parked.kind}`);
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, parked.itemId);
    if (!item.ok) throw new Error(item.reason);
    writeNeedsYouItem(world.stateRoot, { ...item.value, answer: { text: 'merge', answeredAt: new Date().toISOString() } });

    const first = enqueueResume(world, 'needs-decision', parked.itemId);
    const second = enqueueResume(world, 'needs-decision', parked.itemId);
    expect(first).toMatchObject({ ok: true, value: { status: 'enqueued' } });
    expect(second).toMatchObject({ ok: true, value: { status: 'duplicate' } });
    const requestId = first.ok ? first.value.requestId : '';

    const before = records(world).length;
    const report = await drain(world);
    if (!report.ok) throw new Error(report.reason);
    expect(report.value.lines).toMatchObject([{ requestId, outcome: 'ran' }]);
    const resumed = records(world).filter((record) => record.request.resumedItemId === parked.itemId);
    expect(records(world)).toHaveLength(before + 1);
    expect(resumed).toHaveLength(1);
    expect(resumed[0]?.request.requestId).toBe(requestId);
  }, 120_000);

  it('retries a failing resume run to the bound and then quarantines it', async () => {
    const world = botWorld();
    // A resumed run dispatches the parked prompt, so the failing directive rides in it.
    const item = writeItem(world, 'crash', { answer: 'go ahead', prompt: 'Exit with a failure status.\nSTUB:exit=4' });
    const sent = enqueueResume(world, 'crash', item.id);
    if (!sent.ok) throw new Error(sent.reason);

    for (let pass = 0; pass < RETRY_BOUND; pass += 1) {
      const report = await drain(world);
      if (!report.ok) throw new Error(report.reason);
    }
    expect(stubRunCount(world)).toBe(RETRY_BOUND);
    const queue = queueOf(world);
    expect(entries(queue.inbox)).toEqual([]);
    expect(readQuarantineReasons(queue)).toMatchObject([{ requestId: sent.value.requestId, reason: 'retry-bound' }]);
  }, 120_000);
});
