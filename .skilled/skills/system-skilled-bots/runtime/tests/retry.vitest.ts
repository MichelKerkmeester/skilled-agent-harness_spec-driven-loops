// Retry: a failing request runs at most the bound times, then quarantines; a broken setup never burns the queue.

import { afterEach, describe, expect, it } from 'vitest';

import { enqueueFromCheckout, RETRY_BOUND, readClaimed, readQuarantineReasons } from '../lib/request-queue.js';
import { botWorld } from './runner-support.js';
import { drain, entries, queueOf } from './queue-support.js';
import { cleanupTemp } from './support.js';

import type { RunOutcome } from '../lib/runner.js';

afterEach(cleanupTemp);

describe('drain retry bound', () => {
  it('runs a request that always fails exactly the bound times, one per pass, then quarantines it', async () => {
    const world = botWorld();
    const sent = enqueueFromCheckout(world.checkoutRoot, { workflowId: 'crash', source: 'test', eventId: 'evt-1' }, world.env);
    if (!sent.ok) throw new Error(sent.reason);
    let calls = 0;
    const failing = async (): Promise<RunOutcome> => {
      calls += 1;
      return { kind: 'failed', reason: 'error', class: 'environment', runId: `run-${calls}`, recordPath: null, recursionGuard: false };
    };

    const outcomes: string[] = [];
    for (let pass = 0; pass < RETRY_BOUND + 1; pass += 1) {
      const report = await drain(world, { runBot: failing });
      if (!report.ok) throw new Error(report.reason);
      outcomes.push(...report.value.lines.map((line) => line.outcome));
    }

    expect(RETRY_BOUND).toBe(3);
    expect(calls).toBe(RETRY_BOUND);
    expect(outcomes).toEqual(['retry', 'retry', 'quarantined']);
    const queue = queueOf(world);
    expect(entries(queue.inbox)).toEqual([]);
    expect(readQuarantineReasons(queue)).toMatchObject([{ requestId: sent.value.requestId, reason: 'retry-bound', detail: 'error on attempt 3' }]);
  });

  it('names a busy bot as the last cause of a bound-reached request, never as a failure', async () => {
    const world = botWorld();
    const sent = enqueueFromCheckout(world.checkoutRoot, { workflowId: 'manual-ok', source: 'test', eventId: 'evt-busy' }, world.env);
    if (!sent.ok) throw new Error(sent.reason);
    const busy = async (): Promise<RunOutcome> => ({
      kind: 'refused',
      cause: 'lease-held',
      detail: 'held by pid 1',
      runId: 'run-busy',
      recordPath: null,
      itemId: null,
    });
    for (let pass = 0; pass < RETRY_BOUND; pass += 1) {
      const report = await drain(world, { runBot: busy });
      if (!report.ok) throw new Error(report.reason);
    }
    expect(readQuarantineReasons(queueOf(world))).toMatchObject([
      { requestId: sent.value.requestId, reason: 'retry-bound', detail: `lease-held on attempt ${RETRY_BOUND}` },
    ]);
  });

  it('stops the pass on a refusal that would hit every request, and puts the request back unchanged', async () => {
    const world = botWorld();
    const sent = enqueueFromCheckout(world.checkoutRoot, { workflowId: 'manual-ok', source: 'test', eventId: 'evt-1' }, world.env);
    if (!sent.ok) throw new Error(sent.reason);
    const refused = async (): Promise<RunOutcome> => ({
      kind: 'refused',
      cause: 'run-folder-refused',
      detail: 'skilled-tree-is-worktree',
      runId: null,
      recordPath: null,
      itemId: null,
    });

    const report = await drain(world, { runBot: refused });
    expect(report).toMatchObject({ ok: false, reason: 'drain-stopped' });
    const queue = queueOf(world);
    expect(entries(queue.inbox)).toEqual([`${sent.value.requestId}.json`]);
    expect(entries(queue.quarantine)).toEqual([]);
    // Read it the way a claim would, from the claimed folder's sibling: attempts were not counted.
    expect(readClaimed({ ...queue, claimed: queue.inbox }, `${sent.value.requestId}.json`)).toMatchObject({
      ok: true,
      value: { attempts: 0 },
    });
  });

  it('never dispatches again a run that already ran, and quarantines an author error at once', async () => {
    for (const reason of ['result-event-unrecorded', 'decision-marker-empty']) {
      const world = botWorld();
      const sent = enqueueFromCheckout(world.checkoutRoot, { workflowId: 'manual-ok', source: 'test', eventId: `evt-${reason}` }, world.env);
      if (!sent.ok) throw new Error(sent.reason);
      let calls = 0;
      const ranOnce = async (): Promise<RunOutcome> => {
        calls += 1;
        return { kind: 'failed', reason, class: reason === 'decision-marker-empty' ? 'author' : 'hub', runId: `run-${calls}`, recordPath: null, recursionGuard: false };
      };
      const report = await drain(world, { runBot: ranOnce });
      if (!report.ok) throw new Error(report.reason);
      expect(report.value.lines, reason).toMatchObject([{ outcome: 'quarantined', reason }]);
      const again = await drain(world, { runBot: ranOnce });
      if (!again.ok) throw new Error(again.reason);
      expect(calls, reason).toBe(1);
      expect(readQuarantineReasons(queueOf(world)), reason).toMatchObject([{ requestId: sent.value.requestId, reason }]);
    }
  });

  it('stops the pass when the executor is not on PATH, and spends no attempt of the request', async () => {
    const world = botWorld();
    const sent = enqueueFromCheckout(world.checkoutRoot, { workflowId: 'manual-ok', source: 'test', eventId: 'evt-path' }, world.env);
    if (!sent.ok) throw new Error(sent.reason);
    const unavailable = async (): Promise<RunOutcome> => ({
      kind: 'failed',
      reason: 'executor-unavailable',
      class: 'environment',
      runId: 'run-path',
      recordPath: null,
      recursionGuard: false,
    });

    const report = await drain(world, { runBot: unavailable });
    expect(report).toMatchObject({ ok: false, reason: 'drain-stopped', detail: expect.stringContaining('executor-unavailable') });
    const queue = queueOf(world);
    expect(entries(queue.inbox)).toEqual([`${sent.value.requestId}.json`]);
    expect(entries(queue.quarantine)).toEqual([]);
    expect(readClaimed({ ...queue, claimed: queue.inbox }, `${sent.value.requestId}.json`)).toMatchObject({ ok: true, value: { attempts: 0 } });
  });
});
