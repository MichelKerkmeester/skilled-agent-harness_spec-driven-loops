// ───────────────────────────────────────────────────────────────────
// MODULE: Slot Accounting Tests
// ───────────────────────────────────────────────────────────────────
//
// The pure accounting is checked against the translator's own output, and
// the runner's scheduled fires run in temp worlds with the stub executor, so
// a sleep gap and a held fire are proven on the record the runner writes.

import { afterEach, describe, expect, it } from 'vitest';

import { translateCron } from '../lib/cron-translator.js';
import { writeNeedsYouItem } from '../lib/needs-you.js';
import { runBot } from '../lib/runner.js';
import { validateRunRecord } from '../lib/run-record.js';
import { accountFire, graceWindowSeconds, GRACE_MAX_SECONDS, GRACE_MIN_SECONDS, HELD_SLOT_REASON } from '../lib/slot-accounting.js';
import { records, writeItem } from './queue-support.js';
import { approveBots, botWorld, stubRunCount, writeBot } from './runner-support.js';
import { cleanupTemp } from './support.js';

import type { Translation } from '../lib/cron-translator.js';
import type { RunRecord } from '../lib/run-record.js';
import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

function translation(expression: string): Translation {
  const translated = translateCron(expression);
  if (!translated.ok) throw new Error(translated.reason);
  return translated.value;
}

const EVERY_FIVE = translation('*/5 * * * *');
const DAILY = translation('0 9 * * *');

function local(year: number, month: number, date: number, hour: number, minute: number, second = 0): Date {
  return new Date(year, month - 1, date, hour, minute, second);
}

const TICK_BOT = [
  '---',
  'id: tick',
  'trigger: {kind: cron, expression: "*/5 * * * *"}',
  'runtime: {kind: cli-codex}',
  'isolation: shared',
  '---',
  'Count the open notes. FIXTURE-PROMPT-TEXT-7f3a',
  '',
].join('\n');

function fire(world: BotWorld, firedAt: Date) {
  approveBots(world);
  return runBot(world.input('tick', { request: { kind: 'scheduled', scheduleIndex: 0, firedAt } }));
}

function recordOf(world: BotWorld, runId: string | null): RunRecord {
  const found = records(world).find((record) => record.identity.runId === runId);
  if (found === undefined) throw new Error(`no record for ${String(runId)}`);
  return found;
}

describe('grace window', () => {
  it('is half the period, clamped to 120 and 7,200 seconds', () => {
    const around = local(2026, 11, 23, 9, 0);
    expect(graceWindowSeconds(translation('* * * * *'), around)).toBe(GRACE_MIN_SECONDS);
    expect(graceWindowSeconds(DAILY, around)).toBe(GRACE_MAX_SECONDS);
    expect(graceWindowSeconds(translation('0 * * * *'), around)).toBe(1_800);
  });
});

describe('lateness classes', () => {
  const slot = local(2026, 11, 23, 9, 0);

  it('reads a fire within grace as on time and one past it as late', () => {
    const onTime = accountFire({ translation: DAILY, firedAt: local(2026, 11, 23, 9, 0, 4), previous: local(2026, 11, 22, 9, 0), summaryCap: 100 });
    expect(onTime.ok && onTime.value).toMatchObject({ scheduledAt: slot.toISOString(), latenessSeconds: 4, latenessClass: 'on-time' });

    const late = accountFire({ translation: DAILY, firedAt: local(2026, 11, 23, 11, 30), previous: local(2026, 11, 22, 9, 0), summaryCap: 100 });
    expect(late.ok && late.value).toMatchObject({ scheduledAt: slot.toISOString(), latenessSeconds: 9_000, latenessClass: 'late' });
  });

  it('reads a fire that stood in for missed slots as a catch-up', () => {
    const caught = accountFire({ translation: DAILY, firedAt: local(2026, 11, 23, 9, 1), previous: local(2026, 11, 20, 9, 0), summaryCap: 100 });
    if (!caught.ok) throw new Error(caught.reason);
    expect(caught.value.latenessClass).toBe('catch-up');
    expect(caught.value.skippedSlots).toEqual({
      count: 2,
      slots: [local(2026, 11, 21, 9, 0).toISOString(), local(2026, 11, 22, 9, 0).toISOString()],
      first: local(2026, 11, 21, 9, 0).toISOString(),
      last: local(2026, 11, 22, 9, 0).toISOString(),
    });
  });

  it('gives a first fire an empty summary and a class from its own slot', () => {
    const first = accountFire({ translation: EVERY_FIVE, firedAt: local(2026, 11, 23, 9, 5, 2), previous: null, summaryCap: 100 });
    expect(first.ok && first.value).toMatchObject({
      scheduledAt: local(2026, 11, 23, 9, 5).toISOString(),
      latenessClass: 'on-time',
      skippedSlots: { count: 0, slots: [], first: null, last: null },
    });
  });
});

describe('scheduled fires through the runner', () => {
  it('turns a week-long sleep gap into one catch-up run with a bounded summary and no backfill', async () => {
    const world = botWorld();
    writeBot(world, 'tick', TICK_BOT);
    const before = local(2026, 11, 16, 9, 0, 3);
    const after = local(2026, 11, 23, 9, 0, 7);

    const firstFire = await fire(world, before);
    expect(firstFire.kind).toBe('completed');
    const gapFire = await fire(world, after);
    expect(gapFire.kind).toBe('completed');

    const all = records(world);
    expect(all).toHaveLength(2);
    expect(stubRunCount(world)).toBe(2);
    const afterGap = all.filter((record) => record.dispatch.scheduledAt !== null && Date.parse(record.dispatch.scheduledAt) > before.getTime());
    expect(afterGap).toHaveLength(1);

    const record = recordOf(world, gapFire.runId);
    expect(record.request.firedSlot).toBe(local(2026, 11, 23, 9, 0).toISOString());
    expect(record.dispatch).toMatchObject({
      source: 'schedule',
      scheduledAt: local(2026, 11, 23, 9, 0).toISOString(),
      latenessSeconds: 7,
      latenessClass: 'catch-up',
    });
    // 12 slots an hour for 7 days, less the fired slot itself.
    expect(record.dispatch.skippedSlots?.count).toBe(7 * 24 * 12 - 1);
    expect(record.dispatch.skippedSlots?.first).toBe(local(2026, 11, 16, 9, 5).toISOString());
    expect(record.dispatch.skippedSlots?.last).toBe(local(2026, 11, 23, 8, 55).toISOString());
    expect(record.dispatch.skippedSlots?.slots).toHaveLength(100);
  }, 120_000);

  it('holds a fire while an item is open, then runs the next fire normally', async () => {
    const world = botWorld();
    writeBot(world, 'tick', TICK_BOT);
    const item = writeItem(world, 'tick');

    const held = await fire(world, local(2026, 11, 23, 9, 0, 2));
    expect(held).toMatchObject({ kind: 'refused', cause: 'awaiting-decision-hold' });
    expect(stubRunCount(world)).toBe(0);
    const heldRecord = recordOf(world, held.runId);
    expect(heldRecord.dispatch.heldSlot).toEqual({ at: local(2026, 11, 23, 9, 0).toISOString(), reason: HELD_SLOT_REASON });
    expect(heldRecord.dispatch.scheduledAt).toBe(local(2026, 11, 23, 9, 0).toISOString());

    // Answered, and its resume already ran: the request is recorded and no longer queued, so nothing holds the bot.
    const answered = writeNeedsYouItem(world.stateRoot, { ...item, answer: { text: 'merge', answeredAt: new Date().toISOString() }, resumeRequestId: 'rq-resumed' });
    expect(answered.ok).toBe(true);

    const next = await fire(world, local(2026, 11, 23, 9, 5, 3));
    expect(next.kind).toBe('completed');
    expect(stubRunCount(world)).toBe(1);
    const nextRecord = recordOf(world, next.runId);
    expect(nextRecord.dispatch).toMatchObject({
      scheduledAt: local(2026, 11, 23, 9, 5).toISOString(),
      latenessClass: 'on-time',
      skippedSlots: { count: 0 },
      heldSlot: null,
    });
  }, 120_000);

  it('records no slot on a manual run, and refuses a fire for a bot that is no longer a cron bot', async () => {
    const world = botWorld();
    const manual = await runBot(world.input('manual-ok'));
    expect(recordOf(world, manual.runId).dispatch.scheduledAt).toBeNull();

    const stale = await runBot(world.input('manual-ok', { request: { kind: 'scheduled', scheduleIndex: 0, firedAt: new Date() } }));
    expect(stale).toMatchObject({ kind: 'refused', cause: 'schedule-stale' });
    expect(stubRunCount(world)).toBe(1);
  }, 120_000);
});

describe('run record slot fields', () => {
  function withDispatch(dispatch: Record<string, unknown>): unknown {
    return {
      schemaVersion: 1,
      identity: { repository: 'acme/tool', repositoryPath: '/r', botId: 'tick', runId: 'r1', definitionDigest: 'sha256:x' },
      request: { requestId: null, leaseNonce: null, resultEventId: null, firedSlot: null },
      dispatch: { source: 'schedule', scheduledAt: null, dispatchedAt: '2026-11-23T09:00:00Z', latenessSeconds: null, latenessClass: null, skippedSlots: null, ...dispatch },
      budget: { declared: { maxIterations: 1, maxDurationMinutes: 1, timeoutSeconds: 1 }, measured: { iterations: null, elapsedMinutes: null, costUsd: null, costSource: null } },
      posture: { isolation: 'shared', sandbox: null, executorKind: 'cli-codex', model: null },
      exit: { reason: 'converged', class: null, needsYouItemId: null },
      evidence: { runFolder: '/r/run', ledgerDir: null, receiptDir: null, observabilityStream: null, worktreePath: null, branch: null },
      delivery: [],
    };
  }

  it('accepts a bounded summary and a held slot, and refuses malformed ones', () => {
    expect(validateRunRecord(withDispatch({ skippedSlots: { count: 3, slots: [], first: 'a', last: 'b' }, heldSlot: { at: 'a', reason: HELD_SLOT_REASON } })).ok).toBe(true);
    expect(validateRunRecord(withDispatch({ skippedSlots: { count: 1, slots: ['a'] } })).ok).toBe(true);
    expect(validateRunRecord(withDispatch({ skippedSlots: { count: -1, slots: [] } }))).toMatchObject({ ok: false, detail: 'dispatch.skippedSlots' });
    expect(validateRunRecord(withDispatch({ heldSlot: { at: 'a' } }))).toMatchObject({ ok: false, detail: 'dispatch.heldSlot' });
  });
});
