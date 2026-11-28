// Queued run: a drained request's own prompt reaches the run, and its run record is written once, by the runner.

import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { answerItem } from '../lib/answer.js';
import { CHAT_SOURCE, conversationFile, readConversation } from '../lib/conversation.js';
import { validateNeedsYouItem, writeNeedsYouItem } from '../lib/needs-you.js';
import { enqueueFromCheckout } from '../lib/request-queue.js';
import { buildRequest, validateRequest } from '../lib/request-record.js';
import { generationStampFile, runBot } from '../lib/runner.js';
import { recordFile } from '../lib/state-root.js';
import { botWorld, IDENTITY, stubReceipt, stubRunCount } from './runner-support.js';
import { drain, entries, queueOf, records, writeItem } from './queue-support.js';
import { cleanupTemp } from './support.js';

import type { RunBotInput, RunOutcome } from '../lib/runner.js';
import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

function enqueue(world: BotWorld, prompt: string, firedSlot: string | null = null): string {
  const sent = enqueueFromCheckout(
    world.checkoutRoot,
    { workflowId: 'manual-ok', source: 'webhook', eventId: `evt-${prompt.length}`, prompt, firedSlot },
    world.env,
  );
  if (!sent.ok) throw new Error(sent.reason);
  return sent.value.requestId;
}

describe('queued run', () => {
  it('dispatches the request prompt after the bot body', async () => {
    const world = botWorld();
    const requestId = enqueue(world, 'Also sweep the drafts. QUEUED-PROMPT-TEXT-91c2', '2026-11-23T09:00:00Z');
    const drained = await drain(world);
    if (!drained.ok) throw new Error(drained.reason);
    const runId = drained.value.lines[0]?.runId as string;
    const seen = stubReceipt(world, runId);
    expect(seen?.prompt).toContain('QUEUED-PROMPT-TEXT-91c2');
    expect(seen?.prompt.indexOf('FIXTURE-PROMPT-TEXT-7f3a')).toBeLessThan(seen?.prompt.indexOf('QUEUED-PROMPT-TEXT-91c2') ?? -1);
    const [record] = records(world);
    expect(record?.request).toMatchObject({ requestId, firedSlot: '2026-11-23T09:00:00Z' });
    expect(record?.dispatch.source).toBe('webhook');
  }, 120_000);

  it('refuses a request prompt that holds a secret value, without dispatching', async () => {
    const world = botWorld({ PLANTED_TOKEN: 'queued-secret-58kd' });
    enqueue(world, 'Log in with queued-secret-58kd.');
    const drained = await drain(world);
    if (!drained.ok) throw new Error(drained.reason);
    expect(drained.value.lines[0]).toMatchObject({ outcome: 'quarantined', reason: 'body-secret' });
    expect(records(world)[0]?.exit.refusal?.detail).toContain('PLANTED_TOKEN');
    expect(JSON.stringify(records(world))).not.toContain('queued-secret-58kd');
    expect(stubRunCount(world)).toBe(0);
  }, 120_000);

  it('leaves the run record and the generation stamp as the runner wrote them', async () => {
    const world = botWorld();
    enqueue(world, 'One record only.', '2026-11-23T10:00:00Z');
    let seen: { record: string; mtimeMs: number; stamp: string } | null = null;
    const observingRun = async (input: RunBotInput): Promise<RunOutcome> => {
      const outcome = await runBot(input);
      const path = recordFile(world.stateRoot, IDENTITY, outcome.runId as string);
      seen = {
        record: readFileSync(path, 'utf8'),
        mtimeMs: statSync(path).mtimeMs,
        stamp: readFileSync(generationStampFile(world.stateRoot, IDENTITY), 'utf8'),
      };
      return outcome;
    };
    const drained = await drain(world, { runBot: observingRun });
    if (!drained.ok) throw new Error(drained.reason);
    expect(drained.value.lines[0]?.outcome).toBe('ran');
    const runId = drained.value.lines[0]?.runId as string;
    const path = recordFile(world.stateRoot, IDENTITY, runId);
    expect(seen).not.toBeNull();
    expect(readFileSync(path, 'utf8')).toBe(seen!.record);
    expect(statSync(path).mtimeMs).toBe(seen!.mtimeMs);
    expect(readFileSync(generationStampFile(world.stateRoot, IDENTITY), 'utf8')).toBe(seen!.stamp);
    expect(entries(queueOf(world).inbox)).toEqual([]);
  }, 120_000);

  it('requestIds filter runs one request', async () => {
    const world = botWorld();
    const first = enqueueFromCheckout(
      world.checkoutRoot,
      { workflowId: 'manual-ok', source: 'webhook', eventId: 'evt-first', prompt: 'First request.' },
      world.env,
    );
    if (!first.ok) throw new Error(first.reason);
    const second = enqueueFromCheckout(
      world.checkoutRoot,
      { workflowId: 'manual-ok', source: 'webhook', eventId: 'evt-second', prompt: 'Second request.' },
      world.env,
    );
    if (!second.ok) throw new Error(second.reason);
    const drained = await drain(world, { requestIds: [first.value.requestId] });
    if (!drained.ok) throw new Error(drained.reason);
    expect(drained.value.lines).toHaveLength(1);
    expect(drained.value.lines[0]).toMatchObject({ requestId: first.value.requestId, outcome: 'ran' });
    expect(entries(queueOf(world).inbox)).toEqual([`${second.value.requestId}.json`]);
    expect(stubRunCount(world)).toBe(1);
  }, 120_000);

  it('resumed answer reaches its conversation', async () => {
    const world = botWorld();
    const item = writeItem(world, 'manual-ok', { prompt: 'Continue the parked work.' });
    const rewritten = writeNeedsYouItem(world.stateRoot, { ...item, conversationId: 'talk' });
    if (!rewritten.ok) throw new Error(rewritten.reason);
    const answered = answerItem({ checkoutRoot: world.checkoutRoot, itemId: item.id, text: 'merge', env: world.env, surface: 'terminal' });
    if (!answered.ok) throw new Error(answered.reason);
    const [queued] = entries(queueOf(world).inbox);
    const request = JSON.parse(readFileSync(join(queueOf(world).inbox, queued as string), 'utf8')) as { conversationId?: string };
    expect(request.conversationId).toBe('talk');

    const report = await drain(world);
    if (!report.ok) throw new Error(report.reason);
    expect(report.value.lines[0]).toMatchObject({ outcome: 'ran' });
    const runId = report.value.lines[0]?.runId as string;

    const file = conversationFile(world.stateRoot, IDENTITY, 'talk');
    if (!file.ok) throw new Error(file.reason);
    const read = readConversation(file.value);
    expect(read.messages).toHaveLength(1);
    expect(read.messages[0]).toMatchObject({
      role: 'bot',
      botId: 'manual-ok',
      by: 'bot',
      runId,
      text: 'stub done',
      id: `msg-${runId}`,
    });
    const record = records(world).find((entry) => entry.identity.runId === runId);
    expect(record?.request.resumedItemId).toBe(item.id);
    expect(report.value.lines[0]?.reply).toEqual(read.messages[0]);
  }, 120_000);

  it('a chat request that fails is quarantined, not retried, and leaves one bot message', async () => {
    const world = botWorld();
    const sent = enqueueFromCheckout(
      world.checkoutRoot,
      { workflowId: 'crash', source: CHAT_SOURCE, eventId: 'msg-test-1', prompt: 'hello', conversationId: 'talk' },
      world.env,
    );
    if (!sent.ok) throw new Error(sent.reason);
    const drained = await drain(world);
    if (!drained.ok) throw new Error(drained.reason);
    expect(drained.value.lines[0]?.outcome).toBe('quarantined');
    expect(entries(queueOf(world).inbox)).toEqual([]);
    expect(entries(queueOf(world).quarantine)).toContain(`${sent.value.requestId}.json`);
    expect(stubRunCount(world)).toBe(1);

    const file = conversationFile(world.stateRoot, IDENTITY, 'talk');
    if (!file.ok) throw new Error(file.reason);
    const read = readConversation(file.value);
    expect(read.messages).toHaveLength(1);
    expect(read.messages[0]?.role).toBe('bot');
    expect(read.messages[0]?.text.startsWith('failed: ')).toBe(true);
  }, 120_000);

  it('an item and a request carrying conversationId validate', () => {
    const world = botWorld();
    const item = writeItem(world, 'manual-ok');
    expect(validateNeedsYouItem({ ...item, conversationId: 'talk' }).ok).toBe(true);
    expect(validateNeedsYouItem({ ...item, conversationId: '../x' })).toEqual({
      ok: false,
      reason: 'item-field-invalid',
      detail: 'conversationId',
    });

    const built = buildRequest({
      workflowId: 'manual-ok',
      source: 'chat',
      eventId: 'msg-1',
      target: { identity: IDENTITY, path: world.checkoutRoot },
      conversationId: 'talk',
    });
    if (!built.ok) throw new Error(built.reason);
    expect(built.value.conversationId).toBe('talk');
    expect(validateRequest(built.value).ok).toBe(true);

    const plain = buildRequest({
      workflowId: 'manual-ok',
      source: 'chat',
      eventId: 'msg-1',
      target: { identity: IDENTITY, path: world.checkoutRoot },
    });
    if (!plain.ok) throw new Error(plain.reason);
    expect('conversationId' in plain.value).toBe(false);
    expect(validateRequest({ ...built.value, conversationId: '../x' })).toEqual({
      ok: false,
      reason: 'request-field-invalid',
      detail: 'conversationId',
    });
  }, 120_000);
});
