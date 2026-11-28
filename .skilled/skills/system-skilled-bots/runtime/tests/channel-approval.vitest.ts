// bots channel approval: the approval index and the reply grammar against a temp state root and a fake transport.

// ───────────────────────────────────────────────────────────────────
// MODULE: Channel Approval Tests
// ───────────────────────────────────────────────────────────────────
//
// Every test here drives the approval index and the reply grammar against a
// temp state root and a fake transport, so no test opens a socket and no test
// reads the operator's own state. A prompt is written the way a drain writes
// it, and a press or a typed line is answered the way a chat answers it, so
// the file on disk is the only thing a restart carries.

import { readFileSync } from 'node:fs';

import { afterEach, describe, expect, it } from 'vitest';

import { answerItem } from '../lib/answer.js';
import {
  actionIdFor,
  answerFromChat,
  approvalsFile,
  readApprovalIndex,
  replyAmbiguous,
  writePromptEntry,
} from '../lib/channel-approval.js';
import { rosterAdd } from '../lib/channel-link.js';
import { drainQueue, enqueueChannel, noticeKey, readQueueEntry } from '../lib/channel-queue.js';
import { REPLIES } from '../lib/channel.js';
import { needsYouExpiry, readNeedsYouItem, writeNeedsYouItem } from '../lib/needs-you.js';
import { newRunId } from '../lib/runner.js';
import { fakeTransport } from './channel-support.js';
import { entries, queueOf } from './queue-support.js';
import { botWorld, IDENTITY } from './runner-support.js';
import { cleanupTemp } from './support.js';

import type { ApprovalPrompt, ChannelAnswerFn, ChatAnswerOutcome } from '../lib/channel-approval.js';
import type { ChannelConversation, ChannelName } from '../lib/channel.js';
import type { NeedsYouGrant, NeedsYouItem } from '../lib/needs-you.js';
import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

/** A temp world whose roster names ada as an owner, so a chat answer is an approver's. */
function world(): BotWorld {
  const made = botWorld();
  expect(rosterAdd(made.stateRoot, IDENTITY, 'ada', 'owner').ok).toBe(true);
  return made;
}

/** One open needs-you item, written straight to the state root with the options a prompt offers. */
function item(made: BotWorld, options: string[] | null): NeedsYouItem {
  const created = new Date();
  const id = newRunId(created);
  const written: NeedsYouItem = {
    id,
    runId: id,
    botId: 'manual-ok',
    identity: IDENTITY,
    question: 'Which channel?',
    options,
    createdAt: created.toISOString(),
    expiresAt: needsYouExpiry(created, 7),
    evidence: [],
    prompt: 'The parked prompt.',
    specFolder: null,
    answer: null,
    resumeRequestId: null,
  };
  const stored = writeNeedsYouItem(made.stateRoot, written);
  if (!stored.ok) throw new Error(stored.reason);
  return written;
}

/** The answer seam a chat press calls, with a counter so a test can prove nothing was answered. */
function answerer(made: BotWorld): { fn: ChannelAnswerFn; calls: { count: number } } {
  const calls = { count: 0 };
  const fn: ChannelAnswerFn = (a) => {
    calls.count += 1;
    return answerItem({
      checkoutRoot: made.checkoutRoot,
      itemId: a.itemId,
      text: a.text,
      env: made.env,
      surface: 'channel',
      actor: 'ada',
    });
  };
  return { fn, calls };
}

/** Write the index entry of one prompt, as a drain that wrote the index and stopped would leave it. */
function prompt(made: BotWorld, itemId: string, channel: ChannelName, conversation: string, now?: Date): ApprovalPrompt {
  const written = writePromptEntry({ stateRoot: made.stateRoot, identity: IDENTITY, itemId, channel, conversation, now });
  if (!written.ok) throw new Error(written.reason);
  return written.value;
}

/** The fields one chat answer names, with the rest pinned by ask. */
interface AskFields {
  channel: ChannelName;
  conversation: ChannelConversation;
  answer: ChannelAnswerFn;
  text?: string;
  actionId?: string | null;
  delivered?: (itemId: string) => boolean;
  now?: Date;
}

/** One chat answer, with a delivered direct chat and an empty typed line unless a test says otherwise. */
function ask(made: BotWorld, fields: AskFields): ChatAnswerOutcome {
  const result = answerFromChat({
    stateRoot: made.stateRoot,
    identity: IDENTITY,
    actor: 'ada',
    delivered: () => true,
    text: '',
    actionId: null,
    ...fields,
  });
  if (!result.ok) throw new Error(result.reason);
  return result.value;
}

/** An instant without its milliseconds, as a reply prints it. */
function short(iso: string): string {
  return iso.replace(/\.\d{3}Z$/, 'Z');
}

// ───────────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────────

describe('bots channel approval', () => {
  it('resolves a press after a restart', async () => {
    const made = world();
    const i = item(made, ['merge', 'open a PR']);
    const queued = enqueueChannel({
      stateRoot: made.stateRoot,
      identity: IDENTITY,
      key: noticeKey(i.id, 'telegram'),
      channel: 'telegram',
      conversationId: '81234567',
      text: 'prompt',
      itemId: i.id,
      runId: i.id,
    });
    expect(queued.ok).toBe(true);

    const fake = fakeTransport();
    await drainQueue({
      stateRoot: made.stateRoot,
      identity: IDENTITY,
      transports: { telegram: fake },
      hooks: {
        beforeSend: (e) => {
          const w = writePromptEntry({ stateRoot: made.stateRoot, identity: IDENTITY, itemId: e.itemId as string, channel: e.channel, conversation: e.conversationId });
          return w.ok ? { ok: true, value: { choices: w.value.choices } } : w;
        },
      },
    });

    const sends = fake.calls.filter((call) => call.op === 'send');
    expect(sends).toHaveLength(1);
    expect(sends[0].intent).toMatchObject({ kind: 'buttons', choices: ['merge', 'open a PR'] });

    // The restart: nothing in memory is reused, only the file.
    const file = JSON.parse(readFileSync(approvalsFile(made.stateRoot, IDENTITY), 'utf8')) as {
      prompts: Record<string, { channel: string; conversation: string }>;
    };
    expect(file.prompts[i.id]).toMatchObject({ channel: 'telegram', conversation: '81234567' });

    const a = answerer(made);
    const answered = ask(made, {
      channel: 'telegram',
      conversation: { id: '81234567', isGroup: false },
      actionId: actionIdFor(i.id, 2),
      answer: a.fn,
    });
    expect(answered).toMatchObject({
      kind: 'reply',
      text: REPLIES.M07({ choice: '2', itemId: i.id, actor: 'ada' }),
      reason: null,
    });

    const stored = readNeedsYouItem(made.stateRoot, IDENTITY, i.id);
    if (!stored.ok) throw new Error(stored.reason);
    expect(stored.value.answer?.text).toBe('open a PR');

    expect(entries(queueOf(made).inbox)).toHaveLength(1);

    const after = readApprovalIndex(made.stateRoot, IDENTITY);
    if (!after.ok) throw new Error(after.reason);
    expect(after.value.index.prompts[i.id]).toBeUndefined();
  });

  it('refuses a press after expiresAt', () => {
    const made = world();
    const i = item(made, ['merge', 'open a PR']);
    prompt(made, i.id, 'telegram', '81234567');
    const later = new Date(Date.parse(i.expiresAt) + 1000);

    const a = answerer(made);
    const answered = ask(made, {
      channel: 'telegram',
      conversation: { id: '81234567', isGroup: false },
      actionId: actionIdFor(i.id, 1),
      answer: a.fn,
      now: later,
    });
    expect(answered).toMatchObject({
      kind: 'reply',
      reason: 'item-expired',
      text: REPLIES.M15({ itemId: i.id, instant: short(i.expiresAt) }),
    });
    expect(a.calls.count).toBe(0);

    const after = readApprovalIndex(made.stateRoot, IDENTITY, later);
    if (!after.ok) throw new Error(after.reason);
    expect(after.value.index.prompts[i.id]).toBeUndefined();
  });

  it('refuses a press from a group', () => {
    const made = world();
    const i = item(made, ['merge', 'open a PR']);
    prompt(made, i.id, 'telegram', '81234567');

    const a = answerer(made);
    const answered = ask(made, {
      channel: 'telegram',
      conversation: { id: '81234567', isGroup: true },
      actionId: actionIdFor(i.id, 1),
      answer: a.fn,
    });
    expect(answered).toMatchObject({ kind: 'reply', reason: 'channel-group-approval', text: REPLIES.M16() });
    expect(a.calls.count).toBe(0);

    const after = readApprovalIndex(made.stateRoot, IDENTITY);
    if (!after.ok) throw new Error(after.reason);
    expect(after.value.index.prompts[i.id]).toBeDefined();
  });

  it('falls through to answerItem when the item has no entry', () => {
    const made = world();
    const i = item(made, ['merge', 'open a PR']);
    const host = answerItem({
      checkoutRoot: made.checkoutRoot,
      itemId: i.id,
      text: 'open a PR',
      env: made.env,
      surface: 'terminal',
      actor: 'ada',
    });
    expect(host.ok).toBe(true);
    expect(entries(queueOf(made).inbox)).toHaveLength(1);

    const a = answerer(made);
    const same = ask(made, {
      channel: 'telegram',
      conversation: { id: '81234567', isGroup: false },
      actionId: actionIdFor(i.id, 2),
      answer: a.fn,
    });
    expect(a.calls.count).toBe(1);
    expect(same).toMatchObject({ kind: 'reply', text: REPLIES.M08({ itemId: i.id }), reason: null });

    const answered = readNeedsYouItem(made.stateRoot, IDENTITY, i.id);
    if (!answered.ok) throw new Error(answered.reason);
    const answeredAt = answered.value.answer?.answeredAt ?? '';

    const other = ask(made, {
      channel: 'telegram',
      conversation: { id: '81234567', isGroup: false },
      actionId: actionIdFor(i.id, 1),
      answer: a.fn,
    });
    expect(other).toMatchObject({
      kind: 'reply',
      reason: 'item-answered-differently',
      text: REPLIES.M18({ itemId: i.id, instant: short(answeredAt) }),
    });

    expect(entries(queueOf(made).inbox)).toHaveLength(1);
  });

  it('applies the reply grammar', () => {
    const made = world();
    const a = answerer(made);
    const direct = { id: '81234567', isGroup: false };
    const tooHigh = REPLIES.M20({ highest: 2 });

    const i1 = item(made, ['merge', 'open a PR']);
    prompt(made, i1.id, 'signal', '81234567');

    expect(ask(made, { channel: 'signal', conversation: direct, answer: a.fn, text: 'hello' })).toEqual({ kind: 'chat' });

    expect(ask(made, { channel: 'signal', conversation: direct, answer: a.fn, text: '7' })).toMatchObject({ kind: 'reply', text: tooHigh });
    const held = readApprovalIndex(made.stateRoot, IDENTITY);
    if (!held.ok) throw new Error(held.reason);
    expect(held.value.index.prompts[i1.id]).toBeDefined();

    expect(ask(made, { channel: 'signal', conversation: direct, answer: a.fn, text: 'yes' })).toMatchObject({ kind: 'reply', text: tooHigh });
    expect(ask(made, { channel: 'signal', conversation: direct, answer: a.fn, text: 'Y' })).toMatchObject({ kind: 'reply', text: tooHigh });
    expect(ask(made, { channel: 'signal', conversation: direct, answer: a.fn, text: '2.' })).toEqual({ kind: 'chat' });

    expect(ask(made, { channel: 'signal', conversation: direct, answer: a.fn, text: ' 2 ' })).toMatchObject({
      kind: 'reply',
      text: REPLIES.M07({ choice: '2', itemId: i1.id, actor: 'ada' }),
    });
    const first = readNeedsYouItem(made.stateRoot, IDENTITY, i1.id);
    if (!first.ok) throw new Error(first.reason);
    expect(first.value.answer?.text).toBe('open a PR');

    const i2 = item(made, ['merge', 'open a PR']);
    prompt(made, i2.id, 'signal', '81234567');
    expect(ask(made, { channel: 'signal', conversation: direct, answer: a.fn, text: 'no' })).toMatchObject({
      kind: 'reply',
      text: REPLIES.M07({ choice: 'NO', itemId: i2.id, actor: 'ada' }),
    });
    const second = readNeedsYouItem(made.stateRoot, IDENTITY, i2.id);
    if (!second.ok) throw new Error(second.reason);
    expect(second.value.answer?.text).toBe('no');
    expect(second.value.answer?.scope).toBe('deny');

    const i3 = item(made, ['merge', 'open a PR']);
    prompt(made, i3.id, 'signal', '81234567');
    expect(ask(made, { channel: 'signal', conversation: direct, answer: a.fn, text: 'N' })).toMatchObject({
      kind: 'reply',
      text: REPLIES.M07({ choice: 'NO', itemId: i3.id, actor: 'ada' }),
    });
    const third = readNeedsYouItem(made.stateRoot, IDENTITY, i3.id);
    if (!third.ok) throw new Error(third.reason);
    expect(third.value.answer?.text).toBe('no');
    expect(third.value.answer?.scope).toBe('deny');

    const i4 = item(made, null);
    prompt(made, i4.id, 'signal', '81234567');
    expect(ask(made, { channel: 'signal', conversation: direct, answer: a.fn, text: 'Y' })).toMatchObject({
      kind: 'reply',
      text: REPLIES.M07({ choice: 'YES', itemId: i4.id, actor: 'ada' }),
    });
    const fourth = readNeedsYouItem(made.stateRoot, IDENTITY, i4.id);
    if (!fourth.ok) throw new Error(fourth.reason);
    expect(fourth.value.answer?.text).toBe('yes');
    expect(fourth.value.answer?.scope).toBe('once');

    const long = 'a'.repeat(80);
    const i5 = item(made, ['email', long]);
    prompt(made, i5.id, 'slack', 'C0123ABCD');
    expect(ask(made, { channel: 'slack', conversation: { id: 'C0123ABCD', isGroup: false }, answer: a.fn, text: '2' })).toMatchObject({
      kind: 'reply',
      text: REPLIES.M07({ choice: '2', itemId: i5.id, actor: 'ada' }),
    });
    const fifth = readNeedsYouItem(made.stateRoot, IDENTITY, i5.id);
    if (!fifth.ok) throw new Error(fifth.reason);
    expect(fifth.value.answer?.text).toBe(long);

    const i6 = item(made, ['email', 'chat']);
    prompt(made, i6.id, 'slack', 'C0123ABCD');
    expect(ask(made, { channel: 'slack', conversation: { id: 'C0123ABCD', isGroup: false }, answer: a.fn, text: '2' })).toEqual({ kind: 'chat' });
    const sixth = readApprovalIndex(made.stateRoot, IDENTITY);
    if (!sixth.ok) throw new Error(sixth.reason);
    expect(sixth.value.index.prompts[i6.id]).toBeDefined();

    const i7 = item(made, ['email', 'chat']);
    prompt(made, i7.id, 'telegram', '81234567');
    expect(ask(made, { channel: 'telegram', conversation: direct, answer: a.fn, text: '2' })).toEqual({ kind: 'chat' });

    // An item that carries a grant, so a NO is proved to stamp deny on the grant and not only on the answer.
    const i8 = item(made, ['email', 'chat']);
    const grant: NeedsYouGrant = {
      kind: 'post',
      action: 'Post the release notes?',
      rung: 'kind',
      scope: null,
      grantedBy: null,
      grantedAt: null,
    };
    const granted = writeNeedsYouItem(made.stateRoot, {
      ...i8,
      question: 'Post the release notes?',
      options: ['email', 'chat'],
      grants: grant,
    });
    if (!granted.ok) throw new Error(granted.reason);
    prompt(made, i8.id, 'signal', '81234567');
    expect(ask(made, { channel: 'signal', conversation: direct, answer: a.fn, text: 'N' })).toMatchObject({
      kind: 'reply',
      text: REPLIES.M07({ choice: 'NO', itemId: i8.id, actor: 'ada' }),
    });
    const eighth = readNeedsYouItem(made.stateRoot, IDENTITY, i8.id);
    if (!eighth.ok) throw new Error(eighth.reason);
    expect(eighth.value.answer?.scope).toBe('deny');
    expect(eighth.value.grants?.scope).toBe('deny');
    expect(eighth.value.grants?.grantedBy).toBe('ada');
    expect(eighth.value.grants?.grantedAt).toBe(eighth.value.answer?.answeredAt);
  });

  it('answers only a delivered prompt', async () => {
    const made = world();
    const a = answerer(made);
    const iq = item(made, ['merge', 'open a PR']);
    const id2 = item(made, ['merge', 'open a PR']);

    for (const queued of [iq, id2]) {
      const enqueued = enqueueChannel({
        stateRoot: made.stateRoot,
        identity: IDENTITY,
        key: noticeKey(queued.id, 'signal'),
        channel: 'signal',
        conversationId: '81234567',
        text: 'prompt',
        itemId: queued.id,
        runId: queued.id,
      });
      expect(enqueued.ok).toBe(true);
    }

    // A drain that wrote the index and stopped.
    prompt(made, iq.id, 'signal', '81234567');

    await drainQueue({
      stateRoot: made.stateRoot,
      identity: IDENTITY,
      transports: { signal: fakeTransport({ name: 'signal' }) },
      only: noticeKey(id2.id, 'signal'),
      hooks: {
        beforeSend: (e) => {
          const w = writePromptEntry({ stateRoot: made.stateRoot, identity: IDENTITY, itemId: e.itemId as string, channel: e.channel, conversation: e.conversationId });
          return w.ok ? { ok: true, value: { choices: w.value.choices } } : w;
        },
      },
    });

    const delivered = (itemId: string): boolean => {
      const e = readQueueEntry(made.stateRoot, IDENTITY, noticeKey(itemId, 'signal'));
      return e.ok && e.value.state === 'delivered';
    };

    const answered = ask(made, {
      channel: 'signal',
      conversation: { id: '81234567', isGroup: false },
      answer: a.fn,
      text: '1',
      delivered,
    });
    expect(answered).toMatchObject({
      kind: 'reply',
      text: REPLIES.M07({ choice: '1', itemId: id2.id, actor: 'ada' }),
    });

    const quiet = readNeedsYouItem(made.stateRoot, IDENTITY, iq.id);
    if (!quiet.ok) throw new Error(quiet.reason);
    expect(quiet.value.answer).toBeNull();

    const after = readApprovalIndex(made.stateRoot, IDENTITY);
    if (!after.ok) throw new Error(after.reason);
    expect(after.value.index.prompts[iq.id]).toBeDefined();
  });

  it('answers nothing when two delivered prompts are open', () => {
    const made = world();
    const a = answerer(made);
    const direct = { id: '81234567', isGroup: false };
    const ia = item(made, ['merge', 'open a PR']);
    const ib = item(made, ['merge', 'open a PR']);
    const t0 = new Date();
    prompt(made, ia.id, 'signal', '81234567', t0);
    prompt(made, ib.id, 'signal', '81234567', new Date(t0.getTime() + 1000));

    const ambiguous = replyAmbiguous([ia.id, ib.id]);
    expect(ambiguous).toBe(`Two prompts are open in this chat, ${ia.id} and ${ib.id}, so a bare reply answers neither. Answer on the host.`);

    for (const text of ['1', 'YES', 'no']) {
      expect(ask(made, { channel: 'signal', conversation: direct, answer: a.fn, text })).toMatchObject({
        kind: 'reply',
        reason: 'reply-ambiguous',
        text: ambiguous,
      });
    }
    expect(a.calls.count).toBe(0);

    const first = readNeedsYouItem(made.stateRoot, IDENTITY, ia.id);
    if (!first.ok) throw new Error(first.reason);
    expect(first.value.answer).toBeNull();

    const second = readNeedsYouItem(made.stateRoot, IDENTITY, ib.id);
    if (!second.ok) throw new Error(second.reason);
    expect(second.value.answer).toBeNull();

    expect(ask(made, { channel: 'signal', conversation: direct, answer: a.fn, text: 'hello' })).toEqual({ kind: 'chat' });
  });
});
