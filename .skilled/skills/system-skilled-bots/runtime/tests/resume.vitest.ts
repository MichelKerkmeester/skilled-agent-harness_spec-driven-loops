// Resume requests: keyed by the needs-you item, so a second send is a duplicate, and drained like any request.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { answerItem } from '../lib/answer.js';
import { enqueueFromCheckout, RETRY_BOUND, readQuarantineReasons } from '../lib/request-queue.js';
import { runBot } from '../lib/runner.js';
import { installFile } from '../lib/state-root.js';
import { writeNeedsYouItem, readNeedsYouItem } from '../lib/needs-you.js';
import { approveBots, botWorld, IDENTITY, stubRunCount, writeBot } from './runner-support.js';
import { drain, entries, queueOf, records, writeItem } from './queue-support.js';
import { cleanupTemp } from './support.js';

import type { NeedsYouItem } from '../lib/needs-you.js';
import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

/** The item as a real answer leaves it: the answer and its grant written together, with one scope, actor and instant. */
function answeredAs(item: NeedsYouItem, text: string, extra: Partial<NeedsYouItem> = {}): NeedsYouItem {
  const answeredAt = new Date().toISOString();
  const grants = item.grants ?? null;
  return {
    ...item,
    ...extra,
    answer: { text, answeredAt, by: 'ada', scope: 'once' },
    grants: grants === null ? null : { ...grants, scope: 'once', grantedBy: 'ada', grantedAt: answeredAt },
  };
}

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
    writeNeedsYouItem(world.stateRoot, answeredAs(item.value, 'merge'));

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

  it('keeps danger-full-access for a full-access bot the drain resumes', async () => {
    const world = botWorld();
    const botId = 'full-access-decision';
    writeBot(world, botId, [
      '---',
      `id: ${botId}`,
      'trigger: {kind: manual}',
      'runtime: {kind: cli-codex}',
      'isolation: shared',
      'sandbox: danger-full-access',
      '---',
      'Merge the fix branch when it is ready.',
      'STUB:decide=Merge the fix branch or open a PR?',
      'STUB:option=merge',
      'STUB:option=open a PR',
      '',
    ].join('\n'));
    // The operator's install-time flag is the only thing that lifts the cap on a declared class.
    const installPath = installFile(world.stateRoot, IDENTITY, botId);
    mkdirSync(dirname(installPath), { recursive: true });
    writeFileSync(installPath, JSON.stringify({ schemaVersion: 1, agent: 'bot', botId, identity: IDENTITY, labels: [], plistPaths: [], fullAccess: true }));

    const parked = await runBot(world.input(botId));
    if (parked.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${parked.kind}`);
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, parked.itemId);
    if (!item.ok) throw new Error(item.reason);
    writeNeedsYouItem(world.stateRoot, answeredAs(item.value, 'merge'));
    const sent = enqueueResume(world, botId, parked.itemId);
    if (!sent.ok) throw new Error(sent.reason);

    const report = await drain(world);
    if (!report.ok) throw new Error(report.reason);
    expect(report.value.lines).toMatchObject([{ requestId: sent.value.requestId, outcome: 'ran' }]);

    const parkedRecord = records(world).find((record) => record.identity.runId === parked.runId);
    expect(parkedRecord?.posture.sandbox).toBe('danger-full-access');
    const resumed = records(world).filter((record) => record.request.resumedItemId === parked.itemId);
    expect(resumed).toHaveLength(1);
    expect(resumed[0]?.posture.sandbox).toBe('danger-full-access');
    expect(resumed[0]?.exit.refusal?.cause).not.toBe('resume-posture-changed');
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

  it('holds scheduled and queued runs while an answered item waits for its resume, and still runs the resume', async () => {
    const world = botWorld();
    writeBot(world, 'tick', ['---', 'id: tick', 'trigger: {kind: cron, expression: "*/5 * * * *"}', 'runtime: {kind: cli-codex}', 'isolation: shared', '---', 'Count the open notes.', ''].join('\n'));
    // Answered by hand with no resume request recorded yet: the same state `bots answer` leaves between its two writes.
    const item = writeItem(world, 'tick', { answer: 'merge' });
    approveBots(world);

    const queued = await runBot(world.input('tick', { request: { kind: 'queued', requestId: 'rq-queued', source: 'test', firedSlot: null, prompt: '' } }));
    expect(queued).toMatchObject({ kind: 'refused', cause: 'awaiting-resume-hold', itemId: item.id });
    const scheduled = await runBot(world.input('tick', { request: { kind: 'scheduled', scheduleIndex: 0, firedAt: new Date() } }));
    expect(scheduled).toMatchObject({ kind: 'refused', cause: 'awaiting-resume-hold', itemId: item.id });
    const held = records(world).find((record) => record.identity.runId === scheduled.runId);
    expect(held?.dispatch.heldSlot).toMatchObject({ reason: 'held-needs-you' });
    expect(stubRunCount(world)).toBe(0);

    const resumed = await runBot(world.input('tick', { request: { kind: 'resume', requestId: 'rq-resume', itemId: item.id } }));
    expect(resumed.kind).toBe('completed');
    expect(stubRunCount(world)).toBe(1);
  }, 120_000);

  it('lets a request queued behind an answer wait for the resume, then run once the resume has run', async () => {
    const world = botWorld();
    const open = writeItem(world, 'manual-ok');
    const queued = enqueueFromCheckout(world.checkoutRoot, { workflowId: 'manual-ok', source: 'test', eventId: 'evt-behind' }, world.env);
    if (!queued.ok) throw new Error(queued.reason);
    // The window `bots answer` leaves between writing the answer and queueing its resume.
    writeNeedsYouItem(world.stateRoot, { ...open, answer: { text: 'merge', answeredAt: new Date().toISOString() } });

    const held = await drain(world);
    if (!held.ok) throw new Error(held.reason);
    expect(held.value.lines).toMatchObject([{ requestId: queued.value.requestId, outcome: 'retry' }]);
    expect(stubRunCount(world)).toBe(0);

    const answered = answerItem({ checkoutRoot: world.checkoutRoot, itemId: open.id, text: 'merge', env: world.env, surface: 'terminal' });
    if (!answered.ok) throw new Error(answered.reason);
    // Inbox order follows request ids, so the queued request may meet the hold once more before the resume runs.
    for (let pass = 0; pass < 2 && entries(queueOf(world).inbox).length > 0; pass += 1) {
      const report = await drain(world);
      if (!report.ok) throw new Error(report.reason);
    }
    expect(entries(queueOf(world).inbox)).toEqual([]);
    expect(entries(queueOf(world).quarantine)).toEqual([]);
    const resumedAt = records(world).find((record) => record.request.requestId === answered.value.requestId)?.dispatch.dispatchedAt;
    const queuedRuns = records(world).filter((record) => record.request.requestId === queued.value.requestId && record.exit.refusal == null);
    expect(queuedRuns).toHaveLength(1);
    expect(resumedAt).toBeDefined();
    expect(Date.parse(queuedRuns[0]?.dispatch.dispatchedAt ?? '')).toBeGreaterThanOrEqual(Date.parse(resumedAt ?? ''));
  }, 120_000);
});
