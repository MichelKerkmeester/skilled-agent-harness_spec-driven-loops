// bots chat: the one-message path, routing, the refusals, the loop, the transcript, the parked and resumed forms, the duplicate send, the secret and the paste.

import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { appendMessage, CHAT_SOURCE, CONVERSATION_LABEL, conversationFile, humanMessage, readConversation } from '../lib/conversation.js';
import { readNeedsYouItem } from '../lib/needs-you.js';
import { enqueueFromCheckout } from '../lib/request-queue.js';
import { setSecret } from '../lib/secrets.js';
import { ensureIdentityState } from '../lib/state-root.js';
import { drain, records } from './queue-support.js';
import { approveBots, botWorld, BOTS_CLI, commitAll, IDENTITY, stubReceipt, stubRunCount, writeBot } from './runner-support.js';
import { cleanupTemp, REAL_CHECKOUT } from './support.js';

import type { ConversationMessage } from '../lib/conversation.js';
import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

const GOLDEN = join(REAL_CHECKOUT, 'specs/system-skilled-bots/003-openbot-parity-build/contracts/fixtures/chat-transcript.json');

/** Run the CLI as its own process, with stdin when a test types into the loop. */
function chat(world: BotWorld, args: string[], input?: string) {
  const run = spawnSync(process.execPath, [BOTS_CLI, ...args, '--repo', world.checkoutRoot, '--skilled-tree', world.skilledTree], {
    cwd: world.checkoutRoot, env: world.env, encoding: 'utf8', timeout: 90_000, ...(input !== undefined ? { input } : {}),
  });
  return { status: run.status, stdout: run.stdout, stderr: run.stderr };
}

/** The conversation file of a world, or a throw when the id is not a safe segment. */
function fileOf(world: BotWorld, conversationId: string): string {
  const file = conversationFile(world.stateRoot, IDENTITY, conversationId);
  if (!file.ok) throw new Error(file.reason);
  return file.value;
}

/** The messages a conversation holds, read back the way the transcript reads them. */
function messagesOf(world: BotWorld, conversationId: string): ConversationMessage[] {
  return readConversation(fileOf(world, conversationId)).messages;
}

describe('bots chat', () => {
  it('one message appends a human and a bot message and sends the block in the request prompt', () => {
    const world = botWorld();
    approveBots(world);

    const sent = chat(world, ['chat', 'manual-ok', '--message', 'hello']);
    expect(sent.status).toBe(0);
    expect(sent.stdout).toBe('manual-ok › stub done\n');
    expect(sent.stderr).toContain('· manual-ok · working…');

    const messages = messagesOf(world, 'manual-ok');
    expect(messages).toHaveLength(2);
    expect(messages[0]).toMatchObject({ role: 'human', botId: 'manual-ok', text: 'hello', runId: null });
    expect(messages[1]).toMatchObject({ role: 'bot', botId: 'manual-ok', by: 'bot', text: 'stub done' });

    const runId = messages[1].runId;
    if (runId === null) throw new Error('the bot message carries no run id');
    const receipt = stubReceipt(world, runId);
    if (receipt === null) throw new Error('the stub left no receipt');
    const prompt = receipt.prompt;
    const body = prompt.indexOf('FIXTURE-PROMPT-TEXT-7f3a');
    const open = prompt.indexOf('<conversation id="manual-ok">');
    const label = prompt.indexOf(CONVERSATION_LABEL);
    const human = prompt.indexOf('<human> hello');
    const close = prompt.indexOf('</conversation>');
    expect(body).toBeGreaterThanOrEqual(0);
    expect(open).toBeGreaterThan(body);
    expect(label).toBeGreaterThan(open);
    expect(human).toBeGreaterThan(label);
    expect(close).toBeGreaterThan(human);
    // The label sits on the line after the opening tag, and the human line on the line after the label.
    expect(prompt.slice(open, label)).toBe('<conversation id="manual-ok">\n');
    expect(prompt.slice(label, human)).toBe(`${CONVERSATION_LABEL}\n`);

    const all = records(world);
    expect(all).toHaveLength(1);
    expect(all[0].dispatch.source).toBe('chat');
  }, 120_000);

  it('routing sends an addressed message to the other bot', () => {
    const world = botWorld();
    writeBot(world, 'other-bot', '---\nid: other-bot\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\n---\nAnswer in one line.\n');
    commitAll(world.checkoutRoot);
    approveBots(world);

    const sent = chat(world, ['chat', 'manual-ok', '--message', '@other-bot hello']);
    expect(sent.status).toBe(0);
    expect(sent.stdout).toBe('other-bot › stub done\n');

    const messages = messagesOf(world, 'manual-ok');
    expect(messages).toHaveLength(2);
    expect(messages[0]).toMatchObject({ role: 'human', botId: 'other-bot', text: '@other-bot hello' });
    expect(messages[1]).toMatchObject({ role: 'bot', botId: 'other-bot' });

    const all = records(world);
    expect(all).toHaveLength(1);
    expect(all[0].identity.botId).toBe('other-bot');
  }, 120_000);

  it('bot-unknown refuses a malformed or undefined bot with exit 4 and appends nothing', () => {
    const world = botWorld();
    approveBots(world);

    const cases: Array<[string[], string]> = [
      [['chat', 'ghost', '--message', 'hi'], 'bots: bot-unknown: ghost'],
      [['chat', 'manual-ok', '--message', '@Ghost hi'], 'bots: bot-unknown: Ghost'],
      [['chat', 'manual-ok', '--message', '@manual-ok, hi'], 'bots: bot-unknown: manual-ok,'],
    ];
    for (const [args, line] of cases) {
      const refused = chat(world, args);
      expect(refused.status).toBe(4);
      expect(refused.stderr).toContain(line);
      expect(refused.stdout).toBe('');
    }

    expect(existsSync(fileOf(world, 'manual-ok'))).toBe(false);
    expect(stubRunCount(world)).toBe(0);
  }, 120_000);

  it('an empty message or an address with nothing after it exits 2', () => {
    const world = botWorld();
    approveBots(world);

    const empty = chat(world, ['chat', 'manual-ok', '--message', '']);
    expect(empty.status).toBe(2);
    expect(empty.stderr).toContain('bots: chat needs a message');

    const bare = chat(world, ['chat', 'manual-ok', '--message', '@manual-ok']);
    expect(bare.status).toBe(2);
    expect(bare.stderr).toContain('bots: chat needs a message after @manual-ok');

    const unsafe = chat(world, ['chat', 'manual-ok', '--conversation', '../x', '--message', 'hi']);
    expect(unsafe.status).toBe(2);
    expect(unsafe.stderr).toContain('bots: --conversation takes a safe name');

    expect(existsSync(fileOf(world, 'manual-ok'))).toBe(false);
    expect(stubRunCount(world)).toBe(0);
  }, 120_000);

  it('/exit leaves with exit 0 and appends nothing, and a typed line is sent', () => {
    const world = botWorld();
    approveBots(world);

    const left = chat(world, ['chat', 'manual-ok'], '/exit\n');
    expect(left.status).toBe(0);
    expect(left.stdout).toBe('');
    expect(existsSync(fileOf(world, 'manual-ok'))).toBe(false);

    const typed = chat(world, ['chat', 'manual-ok'], 'hello\n/status\n\n/exit\n');
    expect(typed.status).toBe(0);
    expect(typed.stdout).toBe('manual-ok › stub done\n');
    expect(typed.stderr).toContain('bots: unknown command: /status');
    expect(messagesOf(world, 'manual-ok')).toHaveLength(2);

    const closed = chat(world, ['chat', 'manual-ok'], '');
    expect(closed.status).toBe(0);
  }, 120_000);

  it('transcript prints the text form and the json envelope of the contract golden', () => {
    const world = botWorld();
    approveBots(world);
    const golden = JSON.parse(readFileSync(GOLDEN, 'utf8')) as { version: number; conversationId: string; messages: Array<Record<string, unknown>> };

    const empty = chat(world, ['chat', 'manual-ok', '--transcript', '--json']);
    expect(empty.status).toBe(0);
    expect(JSON.parse(empty.stdout)).toEqual({ version: 1, conversationId: 'manual-ok', messages: [] });
    expect(existsSync(fileOf(world, 'manual-ok'))).toBe(false);

    expect(chat(world, ['chat', 'manual-ok', '--message', 'hello']).status).toBe(0);

    const json = chat(world, ['chat', 'manual-ok', '--transcript', '--json']);
    expect(json.status).toBe(0);
    const parsed = JSON.parse(json.stdout) as { version: number; conversationId: string; messages: Array<Record<string, unknown>> };
    expect(Object.keys(parsed).sort()).toEqual(Object.keys(golden).sort());
    expect(parsed.messages).toHaveLength(2);
    for (const message of parsed.messages) expect(Object.keys(message)).toEqual(Object.keys(golden.messages[0]));

    const text = chat(world, ['chat', 'manual-ok', '--transcript']);
    expect(text.status).toBe(0);
    const lines = text.stdout.trimEnd().split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z \S+ → manual-ok: hello$/);
    expect(lines[1]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z manual-ok › stub done$/);

    const appended = appendMessage(
      fileOf(world, 'manual-ok'),
      humanMessage({ id: 'msg-late', conversationId: 'manual-ok', botId: 'manual-ok', text: 'are you there?', by: 'ada' }),
    );
    expect(appended.ok).toBe(true);
    const late = chat(world, ['chat', 'manual-ok', '--transcript']);
    const lateLines = late.stdout.trimEnd().split('\n');
    expect(lateLines[lateLines.length - 1]).toMatch(/are you there\? \(no reply yet\)$/);

    appendFileSync(fileOf(world, 'manual-ok'), '{"schemaVersion":1');
    const torn = chat(world, ['chat', 'manual-ok', '--transcript', '--json']);
    expect(torn.status).toBe(0);
    expect((JSON.parse(torn.stdout) as { messages: unknown[] }).messages).toHaveLength(3);
    expect(torn.stderr).toContain('did not parse and were skipped, the last one torn');
  }, 120_000);

  it('parked run appends the needs-you form and a failed run appends the failed form', () => {
    const world = botWorld();
    approveBots(world);

    const parked = chat(world, ['chat', 'needs-decision', '--message', 'ship it?']);
    expect(parked.status).toBe(5);
    const parkedMessages = messagesOf(world, 'needs-decision');
    expect(parkedMessages).toHaveLength(2);
    const itemId = parkedMessages[1].runId;
    if (itemId === null) throw new Error('the parked message carries no run id');
    expect(parked.stdout).toBe(`needs-decision › needs you: Merge the fix branch or open a PR? (item ${itemId})\n`);
    expect(parked.stderr).toContain(`bots: answer it with: bots answer ${itemId} <text>`);
    expect(parkedMessages[1].text).toBe(`needs you: Merge the fix branch or open a PR? (item ${itemId})`);

    const failed = chat(world, ['chat', 'crash', '--message', 'go']);
    expect(failed.status).toBe(1);
    expect(failed.stdout.startsWith('crash › failed: ')).toBe(true);
    const failedMessages = messagesOf(world, 'crash');
    expect(failedMessages).toHaveLength(2);
    expect(failedMessages[1].text.startsWith('failed: ')).toBe(true);
  }, 120_000);

  it('duplicate enqueue of the same message id writes no second run record', async () => {
    const world = botWorld();
    approveBots(world);

    const input = { workflowId: 'manual-ok', source: CHAT_SOURCE, eventId: 'msg-20261125T211200Z-1a2b3c4d', prompt: 'hello', conversationId: 'manual-ok' };
    const first = enqueueFromCheckout(world.checkoutRoot, input, world.env);
    if (!first.ok) throw new Error(first.reason);
    expect(first.value.status).toBe('enqueued');
    const second = enqueueFromCheckout(world.checkoutRoot, input, world.env);
    if (!second.ok) throw new Error(second.reason);
    expect(second.value.status).toBe('duplicate');
    expect(second.value.requestId).toBe(first.value.requestId);

    await drain(world);
    expect(records(world)).toHaveLength(1);
    expect(stubRunCount(world)).toBe(1);
  }, 120_000);

  it('resumed run appends its reply to the conversation the item names', () => {
    const world = botWorld();
    writeBot(world, 'park-bot', '---\nid: park-bot\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\n---\nEdit and ask.\nSTUB:park-edit=parked.txt\n');
    commitAll(world.checkoutRoot);
    approveBots(world);

    const parked = chat(world, ['chat', 'park-bot', '--message', 'start']);
    expect(parked.status).toBe(5);
    const parkedMessages = messagesOf(world, 'park-bot');
    expect(parkedMessages).toHaveLength(2);
    const itemId = parkedMessages[1].runId;
    if (itemId === null) throw new Error('the parked message carries no run id');
    expect(parkedMessages[1].text).toBe(`needs you: Keep the parked edit? (item ${itemId})`);

    const item = readNeedsYouItem(world.stateRoot, IDENTITY, itemId);
    if (!item.ok) throw new Error(item.reason);
    expect(item.value.conversationId).toBe('park-bot');

    expect(chat(world, ['answer', itemId, 'yes']).status).toBe(0);
    expect(chat(world, ['drain']).status).toBe(0);

    const transcript = chat(world, ['chat', 'park-bot', '--transcript', '--json']);
    expect(transcript.status).toBe(0);
    const parsed = JSON.parse(transcript.stdout) as { messages: ConversationMessage[] };
    expect(parsed.messages).toHaveLength(3);
    const reply = parsed.messages[2];
    expect(reply.role).toBe('bot');
    expect(reply.botId).toBe('park-bot');
    expect(reply.runId).not.toBe(itemId);
    expect(reply.text).toContain('continued parked.txt');

    const record = records(world).find((entry) => entry.identity.runId === reply.runId);
    if (record === undefined) throw new Error('the resumed run left no record');
    expect(record.request.resumedItemId).toBe(itemId);
  }, 120_000);

  it('secret: a stored value in a message is refused body-secret, and an echoed value is appended redacted', async () => {
    const world = botWorld();
    ensureIdentityState(world.stateRoot, IDENTITY);
    const stored = setSecret({ stateRoot: world.stateRoot, identity: IDENTITY, name: 'demo', value: 'skilled-test-value-7f3a', store: 'file', setBy: 'ada' });
    expect(stored.ok).toBe(true);
    approveBots(world);

    const refused = chat(world, ['chat', 'manual-ok', '--message', 'my token skilled-test-value-7f3a']);
    expect(refused.status).toBe(4);
    expect(refused.stderr).toContain('bots: body-secret');
    expect(refused.stderr).not.toContain('skilled-test-value-7f3a');
    expect(existsSync(fileOf(world, 'manual-ok'))).toBe(false);
    expect(stubRunCount(world)).toBe(0);

    const queued = enqueueFromCheckout(
      world.checkoutRoot,
      { workflowId: 'manual-ok', source: CHAT_SOURCE, eventId: 'msg-echo-1', prompt: 'echo it', conversationId: 'manual-ok' },
      world.env,
    );
    if (!queued.ok) throw new Error(queued.reason);
    await drain(world, {
      runOptions: {
        guard: { ancestryCmdlines: [], statePaths: [] },
        buildCommand: () => ({ command: process.execPath, args: ['-e', "process.stdout.write('here skilled-test-value-7f3a end\\n')"] }),
      },
    });

    const messages = messagesOf(world, 'manual-ok');
    expect(messages).toHaveLength(1);
    expect(messages[0].role).toBe('bot');
    expect(messages[0].text).toContain('[redacted: demo]');
    expect(messages[0].text).not.toContain('skilled-test-value-7f3a');

    const record = records(world).find((entry) => entry.identity.runId === messages[0].runId);
    if (record === undefined) throw new Error('the run left no record');
    expect(record.postRunCauses?.[0]?.cause).toBe('secret-in-output');
  }, 120_000);

  it('three-line paste dispatches exactly one run and stores the three lines in one human entry', () => {
    const world = botWorld();
    approveBots(world);

    const pasted = chat(world, ['chat', 'manual-ok'], '\u001b[200~one\ntwo\nthree\u001b[201~\n/exit\n');
    expect(pasted.status).toBe(0);
    expect(stubRunCount(world)).toBe(1);

    const messages = messagesOf(world, 'manual-ok');
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe('human');
    expect(messages[0].text).toBe('one\ntwo\nthree');
  }, 120_000);
});
