// The send queue driven against a temp state root and a fake transport, so no test opens a socket and no provider is called.
//
// ───────────────────────────────────────────────────────────────────
// MODULE: Channel Queue Tests
// ───────────────────────────────────────────────────────────────────
//
// Every entry is written under a temp state root and every send goes to a
// scripted fake transport. No test reaches a provider, so no message leaves
// the machine and no socket is opened. A parked run is the fixture that
// queues a prompt, because the runner is what turns a chat target into a
// queue entry.

import { existsSync, readFileSync } from 'node:fs';

import { afterEach, describe, expect, it } from 'vitest';

import { readApprovalIndex, writePromptEntry } from '../lib/channel-approval.js';
import {
  BACKOFF_MS,
  drainQueue,
  enqueueChannel,
  listQueueEntries,
  MAX_ATTEMPTS,
  m21Line,
  noticeKey,
  queueEntryFile,
  readQueueEntry,
} from '../lib/channel-queue.js';
import { deliverRecord } from '../lib/delivery.js';
import { readNeedsYouItem, writeNeedsYouItem } from '../lib/needs-you.js';
import { readRunRecord, writeRunRecord } from '../lib/run-record.js';
import { runBot } from '../lib/runner.js';
import { setSecret } from '../lib/secrets.js';
import { writeStateFile } from '../lib/state-root.js';
import { fakeTransport } from './channel-support.js';
import { approveBots, botWorld, IDENTITY, writeBot } from './runner-support.js';
import { cleanupTemp } from './support.js';

import type { ChannelSendError, ChannelSendResult } from '../lib/channel.js';
import type { DrainHooks, QueueEntry } from '../lib/channel-queue.js';
import type { RunRecord } from '../lib/run-record.js';
import type { RunBotInput } from '../lib/runner.js';
import type { FakeCall, FakeTransport } from './channel-support.js';
import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

/** The question a parked run asks, with two options, so a prompt has a choice block. */
const PARK = 'STUB:decide=Which channel?\nSTUB:option=email\nSTUB:option=chat\n';

/** A bot definition whose delivery line is left out when the bot declares none. */
function bot(id: string, delivery: string | null, stub = ''): string {
  const line = delivery === null ? '' : `delivery: ${delivery}\n`;
  return `---\nid: ${id}\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\n${line}---\nReport on the notes folder.\n${stub}`;
}

/** Write a bot, run it and hand back the run and item a parked run left. */
async function parked(
  world: BotWorld,
  id: string,
  delivery: string | null,
  stub = PARK,
  extra: Partial<RunBotInput> = {},
): Promise<{ runId: string; itemId: string }> {
  writeBot(world, id, bot(id, delivery, stub));
  const outcome = await runBot(world.input(id, extra));
  if (outcome.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${outcome.kind}`);
  return { runId: outcome.runId, itemId: outcome.itemId };
}

/** The record of one run, or a throw naming the read refusal. */
function recordOf(world: BotWorld, runId: string): RunRecord {
  const read = readRunRecord(world.stateRoot, IDENTITY, runId);
  if (!read.ok) throw new Error(read.reason);
  return read.value.record;
}

/** One queue entry, or a throw naming the read refusal. */
function entryOf(world: BotWorld, key: string): QueueEntry {
  const read = readQueueEntry(world.stateRoot, IDENTITY, key);
  if (!read.ok) throw new Error(read.reason);
  return read.value;
}

/** The drain hooks a real caller binds: the approval index entry is written before the entry goes sending. */
function hooks(world: BotWorld): DrainHooks {
  return {
    beforeSend: (entry) => {
      const written = writePromptEntry({
        stateRoot: world.stateRoot,
        identity: IDENTITY,
        itemId: entry.itemId as string,
        channel: entry.channel,
        conversation: entry.conversationId,
      });
      return written.ok ? { ok: true, value: { choices: written.value.choices } } : written;
    },
  };
}

/** Every send the fake transport received, in order. */
function sends(fake: FakeTransport): FakeCall[] {
  return fake.calls.filter((call) => call.op === 'send');
}

/** A send error whose message carries a provider token, so a stored entry can be checked for it. */
function err(fields: Partial<ChannelSendError>): ChannelSendResult {
  return {
    ok: false,
    error: {
      kind: 'timeout',
      message: 'POST https://api.telegram.org/bot<redacted>/sendMessage timed out',
      unsupported: false,
      retryable: false,
      sentBeforeError: false,
      ...fields,
    },
  };
}

describe('bots channel queue', () => {
  it('records an uncertain send as unknown', async () => {
    const world = botWorld();
    const { runId } = await parked(world, 'ask-tg', '{targets: [telegram:81234567]}');
    const key = noticeKey(runId, 'telegram');
    expect(existsSync(queueEntryFile(world.stateRoot, IDENTITY, key))).toBe(true);

    const fake = fakeTransport({ sends: [err({ sentBeforeError: true })] });
    const report = await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: fake }, hooks: hooks(world) });
    const entry = entryOf(world, key);
    expect(entry.state).toBe('unknown');
    expect(report.unknown.map((held) => held.idempotencyKey)).toEqual([key]);
    expect(m21Line(entry)).toBe(`bots: channel telegram: ${key} is unknown: the send may have landed, so it is not retried`);
    expect(recordOf(world, runId).delivery[0]?.state).toBe('unknown');

    await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: fake }, hooks: hooks(world) });
    expect(sends(fake)).toHaveLength(1);

    const raw = readFileSync(queueEntryFile(world.stateRoot, IDENTITY, key), 'utf8');
    expect(raw).toContain('<redacted>');
    expect(raw).not.toMatch(/bot[0-9]+:[A-Za-z0-9_-]{20,}/);

    const sendingKey = `send-${'a'.repeat(32)}`;
    const queued = enqueueChannel({ stateRoot: world.stateRoot, identity: IDENTITY, key: sendingKey, channel: 'telegram', conversationId: '81234567', text: 'hello' });
    expect(queued.ok).toBe(true);
    writeStateFile(queueEntryFile(world.stateRoot, IDENTITY, sendingKey), { ...entryOf(world, sendingKey), state: 'sending' });
    const second = await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: fake }, hooks: hooks(world) });
    expect(entryOf(world, sendingKey).state).toBe('unknown');
    expect(second.unknown.map((held) => held.idempotencyKey)).toEqual([sendingKey]);
    expect(sends(fake)).toHaveLength(1);
  });

  it('moves an error that may have landed to unknown', async () => {
    const world = botWorld();
    const { runId } = await parked(world, 'ask-tg', '{targets: [telegram:81234567]}');
    const key = noticeKey(runId, 'telegram');
    const fake = fakeTransport({ sends: [err({ retryable: true, sentBeforeError: true })] });

    const report = await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: fake }, hooks: hooks(world) });
    expect(entryOf(world, key).state).toBe('unknown');
    expect(report.unknown.map((held) => held.idempotencyKey)).toEqual([key]);
    expect(report.failed).toBe(0);
    expect(recordOf(world, runId).delivery[0]?.state).toBe('unknown');

    await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: fake }, hooks: hooks(world) });
    expect(sends(fake)).toHaveLength(1);
  });

  it('queues the text form for a Slack label over 75 characters', async () => {
    const world = botWorld();
    const long = 'a'.repeat(80);
    const { runId } = await parked(world, 'ask-slack', '{targets: [slack:C0123ABCD]}', `STUB:decide=Which channel?\nSTUB:option=email\nSTUB:option=${long}\n`);
    const key = noticeKey(runId, 'slack');
    const entry = entryOf(world, key);
    expect(entry.text.endsWith(`\n\nReply with a number:\n1  email\n2  ${long}`)).toBe(true);
    expect(entry.text).not.toContain('Press a button');
    expect(recordOf(world, runId).delivery[0]?.state).toBe('queued');

    const fake = fakeTransport({ name: 'slack' });
    await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { slack: fake } });
    const sent = sends(fake);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.intent).toMatchObject({ kind: 'text', choices: null });
  });

  it('waits the backoff ladder', async () => {
    expect(BACKOFF_MS).toEqual([0, 5000, 25000, 120000, 600000]);
    expect(MAX_ATTEMPTS).toBe(5);

    const world = botWorld();
    const t0 = new Date('2026-11-25T21:05:04.000Z');
    const key = `send-${'b'.repeat(32)}`;
    const queued = enqueueChannel({ stateRoot: world.stateRoot, identity: IDENTITY, key, channel: 'telegram', conversationId: '81234567', text: 'hello', now: t0 });
    expect(queued.ok).toBe(true);
    expect(entryOf(world, key).nextAttemptAt).toBe(t0.toISOString());

    const fake = fakeTransport({ sends: [err({ retryable: true }), err({ retryable: true }), err({ retryable: true }), err({ retryable: true }), err({ retryable: true })] });
    let due = t0;
    for (let n = 1; n <= 4; n += 1) {
      await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: fake }, now: due });
      const entry = entryOf(world, key);
      expect(entry.attempts).toBe(n);
      expect(entry.state).toBe('queued');
      expect(entry.nextAttemptAt).toBe(new Date(due.getTime() + BACKOFF_MS[n]).toISOString());
      const before = sends(fake).length;
      await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: fake }, now: new Date(due.getTime() + BACKOFF_MS[n] - 1) });
      expect(sends(fake).length).toBe(before);
      due = new Date(due.getTime() + BACKOFF_MS[n]);
    }

    const last = await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: fake }, now: due });
    const failed = entryOf(world, key);
    expect(failed.state).toBe('failed');
    expect(failed.attempts).toBe(5);
    expect(last.failed).toBe(1);

    const limitedKey = `send-${'c'.repeat(32)}`;
    const limitedQueued = enqueueChannel({ stateRoot: world.stateRoot, identity: IDENTITY, key: limitedKey, channel: 'telegram', conversationId: '81234567', text: 'hello', now: t0 });
    expect(limitedQueued.ok).toBe(true);
    const waitError = { kind: 'rate-limited', message: 'HTTP 429', unsupported: false, retryable: true, sentBeforeError: false, retryAfterMs: 9000 };
    const limited = fakeTransport({ sends: [{ ok: false, error: waitError }] });
    await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: limited }, now: t0 });
    const waited = entryOf(world, limitedKey);
    expect(waited.nextAttemptAt).toBe(new Date(t0.getTime() + 9000).toISOString());
    expect(Object.keys(waited.error ?? {}).sort()).toEqual(['kind', 'message', 'retryable', 'sentBeforeError', 'unsupported']);
  });

  it('withholds a prompt whose option holds a secret', async () => {
    const world = botWorld();
    const SECRET = 'planted-vault-value-7731';
    const { runId, itemId } = await parked(world, 'ask-local', null);

    const stored = setSecret({ stateRoot: world.stateRoot, identity: IDENTITY, name: 'demo', value: SECRET, store: 'file', setBy: null });
    expect(stored.ok).toBe(true);

    const item = readNeedsYouItem(world.stateRoot, IDENTITY, itemId);
    if (!item.ok) throw new Error(item.reason);
    expect(writeNeedsYouItem(world.stateRoot, { ...item.value, options: ['email', `send ${SECRET}`] }).ok).toBe(true);

    const record = recordOf(world, runId);
    const queuedRow = { channel: 'telegram', target: 'telegram:81234567', state: 'queued' as const, evidence: null, itemId };
    expect(writeRunRecord(world.stateRoot, { ...record, delivery: [queuedRow] }).ok).toBe(true);

    const delivered = deliverRecord({ stateRoot: world.stateRoot, identity: IDENTITY, runId, env: world.env, checkoutRoot: world.checkoutRoot });
    expect(delivered.ok).toBe(true);
    const row = recordOf(world, runId).delivery[0];
    expect(row?.state).toBe('not-attempted');
    expect(row?.evidence).toBe('withheld: the message holds a literal of key vault:demo');
    expect(listQueueEntries(world.stateRoot, IDENTITY)).toEqual([]);
  });

  it('queues the button form on a buttons channel', async () => {
    const world = botWorld();
    const { runId, itemId } = await parked(world, 'ask-tg', '{targets: [telegram:81234567]}');
    const entry = entryOf(world, noticeKey(runId, 'telegram'));
    expect(entry.text.endsWith('\n\nPress a button to answer.')).toBe(true);
    expect(entry.text).toContain(`Needs-you item ${itemId}: Which channel?`);
    expect(entry.text).not.toContain('Reply with a number');

    const fake = fakeTransport();
    await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: fake }, hooks: hooks(world) });
    const sent = sends(fake);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.intent).toMatchObject({ kind: 'buttons', itemId, choices: ['email', 'chat'] });
  });

  it('queues the text form otherwise', async () => {
    const world = botWorld();
    const { runId } = await parked(world, 'ask-signal', '{targets: [signal:+15550001]}');
    const entry = entryOf(world, noticeKey(runId, 'signal'));
    expect(entry.text.endsWith('\n\nReply with a number:\n1  email\n2  chat')).toBe(true);

    const fake = fakeTransport({ name: 'signal' });
    await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { signal: fake }, hooks: hooks(world) });
    const sent = sends(fake);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.intent).toMatchObject({ kind: 'text', choices: null });
  });

  it('queues a prompt for the channel that asked', async () => {
    const world = botWorld();
    const { runId, itemId } = await parked(world, 'ask-tg', '{targets: [telegram:81234567]}');
    const key = noticeKey(runId, 'telegram');
    expect(recordOf(world, runId).delivery).toEqual([{ channel: 'telegram', target: 'telegram:81234567', state: 'queued', evidence: key, itemId }]);
    expect(entryOf(world, key)).toMatchObject({ state: 'queued', conversationId: '81234567', itemId, runId });

    const before = readApprovalIndex(world.stateRoot, IDENTITY);
    if (!before.ok) throw new Error(before.reason);
    expect(before.value.index.prompts[itemId]).toBeUndefined();

    const fake = fakeTransport();
    await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: fake }, hooks: hooks(world) });
    const after = readApprovalIndex(world.stateRoot, IDENTITY);
    if (!after.ok) throw new Error(after.reason);
    expect(after.value.index.prompts[itemId]).toMatchObject({ channel: 'telegram', conversation: '81234567', choices: ['email', 'chat'] });
    expect(entryOf(world, key).state).toBe('delivered');
    expect(recordOf(world, runId).delivery[0]?.state).toBe('delivered');
  });

  it("queues a prompt for the request's reply target", async () => {
    const world = botWorld();
    // A queued run uses only approved bytes, so the definition is approved before it runs.
    writeBot(world, 'ask-chat', bot('ask-chat', null, PARK));
    approveBots(world);
    const { runId, itemId } = await parked(world, 'ask-chat', null, PARK, {
      request: { kind: 'queued', requestId: 'rq-reply-target', source: 'telegram', firedSlot: null, prompt: '', delivery: 'telegram:81234567' },
    });
    const key = noticeKey(runId, 'telegram');
    expect(recordOf(world, runId).delivery).toEqual([{ channel: 'telegram', target: 'telegram:81234567', state: 'queued', evidence: key, itemId }]);
    expect(entryOf(world, key).conversationId).toBe('81234567');
    expect(entryOf(world, key).state).toBe('queued');

    const fake = fakeTransport();
    await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: fake }, hooks: hooks(world) });
    expect(recordOf(world, runId).delivery[0]?.state).toBe('delivered');
  });
});
