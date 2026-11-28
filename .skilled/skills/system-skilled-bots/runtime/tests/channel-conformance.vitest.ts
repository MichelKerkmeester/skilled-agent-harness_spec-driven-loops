// The five conformance rules over every cell of the capability matrix, each real transport over a fake platform, so no test reaches a network.
//
// ───────────────────────────────────────────────────────────────────
// MODULE: Channel Conformance Tests
// ───────────────────────────────────────────────────────────────────
//
// Every cell of the capability matrix runs here: the real transport for one
// channel over a fake platform that stands where the provider's API stands and
// records each wire call. A declared operation must return a receipt under one
// key. An undeclared one must return the explicit unsupported result and reach
// no platform at all. No test opens a socket and no provider is called.

import { afterEach, describe, expect, it } from 'vitest';

import {
  capabilityMatrix,
  conformanceCases,
  conformanceIntent,
  conformanceTransport,
  fakePlatform,
  keyedAdapter,
  storeConformanceSecrets,
  telegramConformanceTransport,
  temporaryStateRoot,
  CONFORMANCE_OPERATIONS,
} from './channel-support.js';
import { botWorld, IDENTITY, writeBot } from './runner-support.js';
import { cleanupTemp } from './support.js';
import { readApprovalIndex, writePromptEntry } from '../lib/channel-approval.js';
import { CHANNEL_NAMES } from '../lib/channel.js';
import { pairChat, resolveLink, rosterAdd, startLink } from '../lib/channel-link.js';
import { drainQueue, enqueueChannel, listQueueEntries, readQueueEntry, replyKey } from '../lib/channel-queue.js';
import { deliverRecord } from '../lib/delivery.js';
import { readNeedsYouItem, writeNeedsYouItem } from '../lib/needs-you.js';
import { readRunRecord, writeRunRecord } from '../lib/run-record.js';
import { runBot } from '../lib/runner.js';
import { setSecret } from '../lib/secrets.js';

import type { DrainHooks } from '../lib/channel-queue.js';
import type { ConformanceWorld } from './channel-support.js';
import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

/**
 * Run one conformance case: build a temp world, point the real transport at a
 * fake platform and check the rules the case names.
 *
 * A declared case must produce a receipt under one key. An undeclared one must
 * return the explicit unsupported result and reach no platform at all.
 */
async function runCase(name: string): Promise<void> {
  const found = conformanceCases().find((entry) => entry.name === name);
  if (found === undefined) throw new Error(`the driver yields no case named ${name}`);
  const world = temporaryStateRoot();
  storeConformanceSecrets(world);
  const platform = fakePlatform(found.channel);
  const transport = keyedAdapter(conformanceTransport(world, found.channel, platform), platform);
  const intent = conformanceIntent(found);
  const result = await transport.send(intent);

  if (!found.declared) {
    // R1: the explicit unsupported result, with no receipt and no throw.
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error(`${name}: an undeclared operation returned a receipt`);
    expect(result.error.unsupported).toBe(true);
    expect(result.error.retryable).toBe(false);
    expect(result.error.sentBeforeError).toBe(false);
    expect('receipt' in result).toBe(false);
    // R2: the fake platform saw no call of any kind.
    expect(platform.observations).toEqual([]);
    expect(platform.requests).toEqual([]);
    return;
  }

  // R3: a receipt and no send error.
  if (!result.ok) throw new Error(`${name}: the send failed: ${result.error.kind}: ${result.error.message}`);
  // R4: at least one call matches the operation, the channel and the conversation, and every call carries the one key.
  const matching = platform.observations.filter((call) => call.operation === found.operation && call.channel === found.channel && call.conversation === intent.conversationId);
  expect(matching.length).toBeGreaterThanOrEqual(1);
  expect([...new Set(platform.observations.map((call) => call.idempotencyKey))]).toEqual([intent.idempotencyKey]);
  // R5: the receipt names its platform message ids.
  expect(result.receipt.platformMessageIds.length).toBeGreaterThan(0);
  expect(result.receipt.primaryPlatformMessageId).toBe(result.receipt.platformMessageIds[0]);
}

describe('the capability-matrix driver', () => {
  it('yields one case per transport and operation and matches each transport', async () => {
    const cases = conformanceCases();
    expect(cases).toHaveLength(25);
    expect(cases.filter((entry) => !entry.declared)).toHaveLength(18);
    expect(cases.filter((entry) => entry.declared)).toHaveLength(7);
    for (const channel of CHANNEL_NAMES) {
      const world = temporaryStateRoot();
      storeConformanceSecrets(world);
      const platform = fakePlatform(channel);
      const transport = conformanceTransport(world, channel, platform);
      for (const operation of CONFORMANCE_OPERATIONS) {
        expect(transport.declaredCapabilities()[operation]).toBe(capabilityMatrix()[channel][operation]);
      }
    }
  }, 120_000);
});

describe('R2 undeclared operations return the unsupported result and reach no platform', () => {
  it('terminal buttons R1 R2', () => runCase('terminal buttons R1 R2'), 120_000);
  it('terminal edit R1 R2', () => runCase('terminal edit R1 R2'), 120_000);
  it('terminal react R1 R2', () => runCase('terminal react R1 R2'), 120_000);
  it('terminal file R1 R2', () => runCase('terminal file R1 R2'), 120_000);
  it('telegram edit R1 R2', () => runCase('telegram edit R1 R2'), 120_000);
  it('telegram react R1 R2', () => runCase('telegram react R1 R2'), 120_000);
  it('telegram file R1 R2', () => runCase('telegram file R1 R2'), 120_000);
  it('slack edit R1 R2', () => runCase('slack edit R1 R2'), 120_000);
  it('slack react R1 R2', () => runCase('slack react R1 R2'), 120_000);
  it('slack file R1 R2', () => runCase('slack file R1 R2'), 120_000);
  it('signal buttons R1 R2', () => runCase('signal buttons R1 R2'), 120_000);
  it('signal edit R1 R2', () => runCase('signal edit R1 R2'), 120_000);
  it('signal react R1 R2', () => runCase('signal react R1 R2'), 120_000);
  it('signal file R1 R2', () => runCase('signal file R1 R2'), 120_000);
  it('whatsapp buttons R1 R2', () => runCase('whatsapp buttons R1 R2'), 120_000);
  it('whatsapp edit R1 R2', () => runCase('whatsapp edit R1 R2'), 120_000);
  it('whatsapp react R1 R2', () => runCase('whatsapp react R1 R2'), 120_000);
  it('whatsapp file R1 R2', () => runCase('whatsapp file R1 R2'), 120_000);
});

describe('declared operations return a receipt under one key', () => {
  it('terminal sendText R3 R4 R5', () => runCase('terminal sendText R3 R4 R5'), 120_000);
  it('telegram sendText R3 R4 R5', () => runCase('telegram sendText R3 R4 R5'), 120_000);
  it('telegram buttons R3 R4 R5', () => runCase('telegram buttons R3 R4 R5'), 120_000);
  it('slack sendText R3 R4 R5', () => runCase('slack sendText R3 R4 R5'), 120_000);
  it('slack buttons R3 R4 R5', () => runCase('slack buttons R3 R4 R5'), 120_000);
  it('signal sendText R3 R4 R5', () => runCase('signal sendText R3 R4 R5'), 120_000);
  it('whatsapp sendText R3 R4 R5', () => runCase('whatsapp sendText R3 R4 R5'), 120_000);
});

/** The question a parked run asks, with two options, so a prompt carries a choice block. */
const PARK = 'STUB:decide=Which channel?\nSTUB:option=email\nSTUB:option=chat\n';

/** A bot definition whose delivery line is left out when the bot declares none. */
function bot(id: string, delivery: string | null): string {
  const line = delivery === null ? '' : `delivery: ${delivery}\n`;
  return `---\nid: ${id}\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\n${line}---\nReport on the notes folder.\n${PARK}`;
}

/** Write a bot, run it and hand back the run and item a parked run left. */
async function parked(world: BotWorld, id: string, delivery: string | null): Promise<{ runId: string; itemId: string }> {
  writeBot(world, id, bot(id, delivery));
  const outcome = await runBot(world.input(id));
  if (outcome.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${outcome.kind}`);
  return { runId: outcome.runId, itemId: outcome.itemId };
}

/** The four things a transport reads, taken from a runner world so a case drives the real transport. */
function botConformanceWorld(world: BotWorld): ConformanceWorld {
  return { stateRoot: world.stateRoot, identity: IDENTITY, checkoutRoot: world.checkoutRoot, env: world.env };
}

/** Write the approval index entry as a prompt goes out, so a press resolves against a prompt that arrived. */
function promptHooks(world: BotWorld): DrainHooks {
  return {
    beforeSend: (entry) => {
      const written = writePromptEntry({ stateRoot: world.stateRoot, identity: IDENTITY, itemId: entry.itemId as string, channel: entry.channel, conversation: entry.conversationId });
      return written.ok ? { ok: true, value: { choices: written.value.choices } } : written;
    },
  };
}

/** One press from one sender, carrying the action id of one choice on the parked item. */
function press(updateId: number, senderId: number, actionId: string): unknown {
  return { update_id: updateId, callback_query: { id: `cq-${updateId}`, from: { id: senderId, is_bot: false, first_name: 'Ada' }, message: { message_id: 900, date: 1764104700, chat: { id: 81234567, type: 'private' } }, data: actionId } };
}

describe('hardening', () => {
  it('a press from a sender the link does not name answers nothing and sends nothing', async () => {
    const world = botWorld();
    const conformance = botConformanceWorld(world);
    storeConformanceSecrets(conformance);
    const added = rosterAdd(world.stateRoot, IDENTITY, 'ada', 'owner');
    if (!added.ok) throw new Error(added.reason);
    const started = startLink({ stateRoot: world.stateRoot, identity: IDENTITY, channel: 'telegram', actor: 'ada' });
    if (!started.ok) throw new Error(started.reason);
    const paired = pairChat({ stateRoot: world.stateRoot, identity: IDENTITY, channel: 'telegram', chatId: '81234567', senderId: '81234567', text: started.value.code });
    if (!paired.ok) throw new Error(paired.reason);
    if (paired.value.kind !== 'linked') throw new Error(`expected a linked chat, got ${paired.value.kind}`);

    const { itemId } = await parked(world, 'ask-tg', '{targets: [telegram:81234567]}');
    const platform = fakePlatform('telegram');
    const transport = telegramConformanceTransport(conformance, platform);
    const drain = () => drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: keyedAdapter(transport, platform) }, hooks: promptHooks(world) });

    // The prompt itself goes out, so the chat holds a live question before the press arrives.
    await drain();
    expect(platform.observations).toHaveLength(1);

    platform.telegramUpdates.push([press(40, 55555555, `approval-v1:${itemId}:1`)]);
    expect(await transport.pollOnce()).toEqual({ ok: true, updates: 1, emitted: 0 });
    expect(resolveLink(world.stateRoot, IDENTITY, 'telegram', '81234567', '55555555')).toEqual({ ok: false, reason: 'channel-unlinked', detail: 'sender mismatch' });

    // Any reply the press had queued would go out here.
    await drain();
    // The answerCallbackQuery call stops the client's spinner on receipt and carries no message, so it is a request and not an observation.
    expect(platform.observations).toHaveLength(1);
    expect(listQueueEntries(world.stateRoot, IDENTITY).some((entry) => entry.idempotencyKey === replyKey('telegram', '81234567', 'update:40'))).toBe(false);
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, itemId);
    if (!item.ok) throw new Error(item.reason);
    expect(item.value.answer).toBeNull();
    const index = readApprovalIndex(world.stateRoot, IDENTITY);
    if (!index.ok) throw new Error(index.reason);
    expect(index.value.index.notApprover).toEqual({});

    // The same press from the linked sender answers, so the refusal came from the sender alone.
    platform.telegramUpdates.push([press(41, 81234567, `approval-v1:${itemId}:1`)]);
    expect(await transport.pollOnce()).toEqual({ ok: true, updates: 1, emitted: 1 });
    const answered = readNeedsYouItem(world.stateRoot, IDENTITY, itemId);
    if (!answered.ok) throw new Error(answered.reason);
    expect(answered.value.answer).toMatchObject({ text: 'email', by: 'ada' });
  }, 120_000);

  it('a prompt holding a stored secret is withheld and sends nothing', async () => {
    const world = botWorld();
    const conformance = botConformanceWorld(world);
    storeConformanceSecrets(conformance);
    const SECRET = 'planted-vault-value-5521';
    // No delivery line, so nothing is queued when the run parks.
    const { runId, itemId } = await parked(world, 'ask-local', null);
    const stored = setSecret({ stateRoot: world.stateRoot, identity: IDENTITY, name: 'demo', value: SECRET, store: 'file', setBy: null });
    if (!stored.ok) throw new Error(stored.reason);
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, itemId);
    if (!item.ok) throw new Error(item.reason);
    // The question now holds a stored value, so the send is withheld rather than leaked.
    const rewritten = writeNeedsYouItem(world.stateRoot, { ...item.value, question: `Which channel? ${SECRET}` });
    if (!rewritten.ok) throw new Error(rewritten.reason);
    const read = readRunRecord(world.stateRoot, IDENTITY, runId);
    if (!read.ok) throw new Error(read.reason);
    const record = read.value.record;
    const queued = writeRunRecord(world.stateRoot, { ...record, delivery: [{ channel: 'telegram', target: 'telegram:81234567', state: 'queued' as const, evidence: null, itemId }] });
    if (!queued.ok) throw new Error(queued.reason);
    expect(deliverRecord({ stateRoot: world.stateRoot, identity: IDENTITY, runId, env: world.env, checkoutRoot: world.checkoutRoot }).ok).toBe(true);
    const after = readRunRecord(world.stateRoot, IDENTITY, runId);
    if (!after.ok) throw new Error(after.reason);
    expect(after.value.record.delivery[0]?.state).toBe('not-attempted');
    expect(after.value.record.delivery[0]?.evidence).toBe('withheld: the message holds a literal of key vault:demo');

    const platform = fakePlatform('telegram');
    await drainQueue({ stateRoot: world.stateRoot, identity: IDENTITY, transports: { telegram: keyedAdapter(telegramConformanceTransport(conformance, platform), platform) } });
    // Nothing was queued, so the drain reaches no platform at all.
    expect(listQueueEntries(world.stateRoot, IDENTITY)).toEqual([]);
    expect(platform.observations).toEqual([]);
    expect(platform.requests).toEqual([]);
  }, 120_000);

  it('a 5,000 character Telegram send makes two calls under one key', async () => {
    const world = temporaryStateRoot();
    storeConformanceSecrets(world);
    const key = `send-${'e'.repeat(32)}`;
    expect(enqueueChannel({ stateRoot: world.stateRoot, identity: world.identity, key, channel: 'telegram', conversationId: '81234567', text: 'a'.repeat(5000) }).ok).toBe(true);
    const platform = fakePlatform('telegram');
    const report = await drainQueue({ stateRoot: world.stateRoot, identity: world.identity, transports: { telegram: keyedAdapter(telegramConformanceTransport(world, platform), platform) } });
    expect(report.failed).toBe(0);
    const entry = readQueueEntry(world.stateRoot, world.identity, key);
    if (!entry.ok) throw new Error(entry.reason);
    expect(entry.value.state).toBe('delivered');
    // A 5,000 character send splits at the provider's 4,096 byte limit under the one key.
    expect(platform.observations).toEqual([
      { operation: 'sendText', channel: 'telegram', conversation: '81234567', idempotencyKey: key },
      { operation: 'sendText', channel: 'telegram', conversation: '81234567', idempotencyKey: key },
    ]);
    const texts = platform.requests.filter((call) => call.url.endsWith('/sendMessage')).map((call) => String((JSON.parse(call.body) as { text: unknown }).text));
    expect(texts.map((text) => Buffer.byteLength(text, 'utf8'))).toEqual([4096, 904]);
  }, 120_000);
});
