// bots channel link, unlink and roster: the pairing code, the link record and the operators.json roster.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { userInfo } from 'node:os';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { readChannelConfig, writeChannelConfig } from '../lib/channel.js';
import { countNotApprover } from '../lib/channel-approval.js';
import { pairChat, readLinks, resolveLink, rosterAdd, startLink } from '../lib/channel-link.js';
import { enqueueChannel, listQueueEntries, readQueueEntry, sendKey } from '../lib/channel-queue.js';
import { identityStatePaths, operatorsFile } from '../lib/state-root.js';
import { CHANNEL_BOTS_CLI, fakeTransport, runBots, temporaryStateRoot } from './channel-support.js';
import { cleanupTemp } from './support.js';

import type { TemporaryStateRoot } from './channel-support.js';

/**
 * The channel verb body, loaded once from the CLI.
 *
 * A spawned CLI cannot be handed a fake transport, so the list, send and drain
 * tests call this in process with a scripted transport table and two streams
 * that collect what the verb printed.
 */
const { runChannelVerb } = createRequire(import.meta.url)(CHANNEL_BOTS_CLI) as {
  runChannelVerb: (
    argv: string[],
    transports: Record<string, unknown>,
    io: {
      env: NodeJS.ProcessEnv;
      stdout: { write(text: string): void };
      stderr: { write(text: string): void };
    },
  ) => Promise<number>;
};

afterEach(cleanupTemp);

/** The six-digit code a link printed, wherever the pty put it. */
function linkCode(stdout: string): string {
  const match = /bots: telegram link code ([0-9]{6}), valid for 5 minutes/.exec(stdout);
  if (match === null) throw new Error(`no link code in: ${stdout}`);
  return match[1];
}

/** The operators.json path of a world's identity. */
function rosterPath(world: TemporaryStateRoot): string {
  return operatorsFile(world.stateRoot, world.identity);
}

/** The parsed operators.json of a world's identity. */
function readOperators(world: TemporaryStateRoot): unknown {
  return JSON.parse(readFileSync(rosterPath(world), 'utf8'));
}

/** Whether a folder is absent or holds no entry. */
function isEmptyFolder(path: string): boolean {
  return !existsSync(path) || readdirSync(path).length === 0;
}

describe('bots channel link', () => {
  it('links a chat that sends the code', () => {
    const world = temporaryStateRoot();
    const me = userInfo().username;

    const added = runBots(world, ['channel', 'roster', 'add', me, '--role', 'owner']);
    expect(added.status).toBe(0);

    const linked = runBots(world, ['channel', 'link', 'telegram']);
    expect(linked.status).toBe(0);
    expect(linked.stdout).toMatch(/^bots: telegram link code [0-9]{6}, valid for 5 minutes\n$/);
    const code = linkCode(linked.stdout);

    const paired = pairChat({
      stateRoot: world.stateRoot,
      identity: world.identity,
      channel: 'telegram',
      chatId: '81234567',
      senderId: '81234567',
      text: code,
    });
    if (!paired.ok) throw new Error(paired.reason);
    if (paired.value.kind !== 'linked') throw new Error(`the chat did not link: ${paired.value.kind}`);
    expect(paired.value.link.actor).toBe(me);
    expect(paired.value.link.senderId).toBe('81234567');

    const links = readLinks(world.stateRoot, world.identity);
    if (!links.ok) throw new Error(links.reason);
    const record = links.value.links['telegram:81234567'];
    expect(record).toBeDefined();
    expect(Object.keys(record ?? {}).sort()).toEqual(['actor', 'channel', 'chatId', 'linkedAt', 'senderId']);
    expect(links.value.codes.telegram).toBeUndefined();

    const second = pairChat({
      stateRoot: world.stateRoot,
      identity: world.identity,
      channel: 'telegram',
      chatId: '81234568',
      senderId: '81234568',
      text: code,
    });
    if (!second.ok) throw new Error(second.reason);
    expect(second.value.kind).toBe('wrong-code');
    const afterSecond = readLinks(world.stateRoot, world.identity);
    if (!afterSecond.ok) throw new Error(afterSecond.reason);
    expect(Object.keys(afterSecond.value.links)).toEqual(['telegram:81234567']);

    const unlinked = resolveLink(world.stateRoot, world.identity, 'telegram', '4242', '4242');
    expect(unlinked).toEqual({ ok: false, reason: 'channel-unlinked', detail: 'no link' });

    const hello = pairChat({
      stateRoot: world.stateRoot,
      identity: world.identity,
      channel: 'telegram',
      chatId: '4242',
      senderId: '4242',
      text: 'hello',
    });
    if (!hello.ok) throw new Error(hello.reason);
    expect(hello.value).toEqual({ kind: 'not-a-code' });

    expect(isEmptyFolder(identityStatePaths(world.stateRoot, world.identity).records)).toBe(true);
  }, 120_000);

  it("links a member's chat with --as", () => {
    const world = temporaryStateRoot();
    expect(runBots(world, ['channel', 'roster', 'add', 'ada', '--role', 'owner']).status).toBe(0);
    expect(runBots(world, ['channel', 'roster', 'add', 'bob']).status).toBe(0);

    if (userInfo().username !== 'bob') {
      const refused = runBots(world, ['channel', 'link', 'telegram', '--as', 'bob']);
      expect(refused.status).toBe(2);
      expect(refused.stderr.startsWith('bots: --as needs a tty')).toBe(true);
    }

    if (process.platform === 'darwin') {
      const pty = runBots(world, ['channel', 'link', 'telegram', '--as', 'bob'], { tty: true });
      expect(pty.status).toBe(0);
      const code = linkCode(pty.stdout);

      const paired = pairChat({
        stateRoot: world.stateRoot,
        identity: world.identity,
        channel: 'telegram',
        chatId: '5550002',
        senderId: '5550002',
        text: code,
      });
      if (!paired.ok) throw new Error(paired.reason);
      if (paired.value.kind !== 'linked') throw new Error(`the chat did not link: ${paired.value.kind}`);
      expect(paired.value.link.actor).toBe('bob');

      const refused = runBots(world, ['channel', 'link', 'telegram', '--as', 'mallory'], { tty: true });
      expect(refused.status).toBe(4);
      expect(refused.stdout).toContain('bots: answer-not-approver: mallory');
    }
  }, 120_000);

  it('unlinks a chat', () => {
    const world = temporaryStateRoot();
    const me = userInfo().username;
    expect(runBots(world, ['channel', 'roster', 'add', me, '--role', 'owner']).status).toBe(0);

    const linked = runBots(world, ['channel', 'link', 'telegram']);
    expect(linked.status).toBe(0);
    const code = linkCode(linked.stdout);
    const paired = pairChat({
      stateRoot: world.stateRoot,
      identity: world.identity,
      channel: 'telegram',
      chatId: '81234567',
      senderId: '81234567',
      text: code,
    });
    if (!paired.ok) throw new Error(paired.reason);
    expect(paired.value.kind).toBe('linked');

    const unlinked = runBots(world, ['channel', 'unlink', 'telegram']);
    expect(unlinked.status).toBe(0);
    expect(unlinked.stdout).toBe('');

    const links = readLinks(world.stateRoot, world.identity);
    if (!links.ok) throw new Error(links.reason);
    expect(Object.values(links.value.links).filter((entry) => entry.channel === 'telegram')).toEqual([]);

    const config = readChannelConfig(world.stateRoot, world.identity);
    if (!config.ok) throw new Error(config.reason);
    expect(config.value.channels.telegram).toEqual({ secret: 'telegram', enabled: false });

    expect(resolveLink(world.stateRoot, world.identity, 'telegram', '81234567', '81234567')).toEqual({
      ok: false,
      reason: 'channel-unlinked',
      detail: 'no link',
    });

    expect(runBots(world, ['channel', 'unlink', 'discord']).status).toBe(2);
  }, 120_000);
});

describe('bots channel roster', () => {
  it('defaults the role to member', () => {
    const world = temporaryStateRoot();

    expect(runBots(world, ['channel', 'roster', 'add', 'ada', '--role', 'owner']).status).toBe(0);
    expect(readOperators(world)).toEqual({ schemaVersion: 1, owner: 'ada', members: [] });
    expect(statSync(rosterPath(world)).mode & 0o777).toBe(0o600);

    expect(runBots(world, ['channel', 'roster', 'add', 'grace']).status).toBe(0);
    expect(readOperators(world)).toEqual({ schemaVersion: 1, owner: 'ada', members: ['grace'] });

    expect(runBots(world, ['channel', 'roster', 'add', 'hank', '--role', 'member']).status).toBe(0);
    expect(readOperators(world)).toEqual({ schemaVersion: 1, owner: 'ada', members: ['grace', 'hank'] });

    const listed = runBots(world, ['channel', 'roster', 'list']);
    expect(listed.status).toBe(0);
    expect(listed.stdout).toBe('owner ada\nmember grace\nmember hank\n');

    const refused = runBots(world, ['channel', 'roster', 'add']);
    expect(refused.status).toBe(2);
    expect(refused.stderr).toContain('channel roster add needs a name');
    expect(refused.stderr).toContain('usage: bots');
  }, 120_000);

  it('replaces the owner and leaves the members', () => {
    const world = temporaryStateRoot();
    expect(runBots(world, ['channel', 'roster', 'add', 'ada', '--role', 'owner']).status).toBe(0);
    expect(runBots(world, ['channel', 'roster', 'add', 'bob']).status).toBe(0);

    expect(runBots(world, ['channel', 'roster', 'add', 'carol', '--role', 'owner']).status).toBe(0);
    expect(readOperators(world)).toEqual({ schemaVersion: 1, owner: 'carol', members: ['bob'] });

    const listed = runBots(world, ['channel', 'roster', 'list']);
    expect(listed.stdout).toBe('owner carol\nmember bob\n');

    const before = readFileSync(rosterPath(world), 'utf8');
    const refused = runBots(world, ['channel', 'roster', 'remove', 'carol']);
    expect(refused.status).toBe(4);
    expect(refused.stderr).toContain('bots: channel-roster-owner');
    expect(readFileSync(rosterPath(world), 'utf8')).toBe(before);
  }, 120_000);

  it('writes nothing for an actor already on the roster', () => {
    const world = temporaryStateRoot();
    expect(runBots(world, ['channel', 'roster', 'add', 'ada', '--role', 'owner']).status).toBe(0);
    expect(runBots(world, ['channel', 'roster', 'add', 'bob']).status).toBe(0);

    const before = readFileSync(rosterPath(world), 'utf8');
    const beforeMtime = statSync(rosterPath(world)).mtimeMs;

    expect(runBots(world, ['channel', 'roster', 'add', 'bob']).status).toBe(0);
    expect(runBots(world, ['channel', 'roster', 'add', 'bob', '--role', 'member']).status).toBe(0);
    expect(runBots(world, ['channel', 'roster', 'add', 'ada', '--role', 'owner']).status).toBe(0);

    expect(readFileSync(rosterPath(world), 'utf8')).toBe(before);
    expect(statSync(rosterPath(world)).mtimeMs).toBe(beforeMtime);
  }, 120_000);

  it('exits 0 for a remove of a non-member', () => {
    const world = temporaryStateRoot();
    expect(runBots(world, ['channel', 'roster', 'add', 'ada', '--role', 'owner']).status).toBe(0);
    const before = readFileSync(rosterPath(world), 'utf8');

    const removed = runBots(world, ['channel', 'roster', 'remove', 'zoe']);
    expect(removed.status).toBe(0);
    expect(removed.stderr).toBe('bots: zoe is not on the roster\n');
    expect(readFileSync(rosterPath(world), 'utf8')).toBe(before);
  }, 120_000);

  it('prints no roster on an absent file', () => {
    const world = temporaryStateRoot();

    const listed = runBots(world, ['channel', 'roster', 'list']);
    expect(listed.status).toBe(0);
    expect(listed.stdout).toBe('');
    expect(listed.stderr).toBe('bots: no roster\n');
    expect(existsSync(rosterPath(world))).toBe(false);

    const refused = runBots(world, ['channel', 'link', 'telegram']);
    expect(refused.status).toBe(4);
    expect(refused.stderr).toContain('channel-roster-missing');
  }, 120_000);

  it('leaves the owner and the other members on a remove', () => {
    const world = temporaryStateRoot();
    expect(runBots(world, ['channel', 'roster', 'add', 'ada', '--role', 'owner']).status).toBe(0);
    for (const name of ['bob', 'carol', 'dave']) {
      expect(runBots(world, ['channel', 'roster', 'add', name]).status).toBe(0);
    }

    expect(runBots(world, ['channel', 'roster', 'remove', 'carol']).status).toBe(0);
    expect(readOperators(world)).toEqual({ schemaVersion: 1, owner: 'ada', members: ['bob', 'dave'] });
  }, 120_000);

  it('refuses a member on an absent roster', () => {
    const world = temporaryStateRoot();

    const refused = runBots(world, ['channel', 'roster', 'add', 'bob', '--role', 'member']);
    expect(refused.status).toBe(4);
    expect(refused.stderr.startsWith('bots: channel-roster-missing')).toBe(true);
    expect(existsSync(rosterPath(world))).toBe(false);
  }, 120_000);
});

// ───────────────────────────────────────────────────────────────────
// IN-PROCESS CHANNEL VERBS
// ───────────────────────────────────────────────────────────────────

/** What one in-process channel verb exited with and printed. */
interface VerbRun {
  code: number;
  stdout: string;
  stderr: string;
}

/**
 * Run one channel verb in this process against a world's checkout and state
 * root.
 *
 * The verb writes only to the two strings this collects, so a test reads what
 * an operator would see without spawning a process.
 */
async function verb(world: TemporaryStateRoot, args: string[], transports: Record<string, unknown> = {}): Promise<VerbRun> {
  let stdout = '';
  let stderr = '';
  const code = await runChannelVerb(['channel', ...args, '--repo', world.checkoutRoot], transports, {
    env: world.env,
    stdout: { write: (text: string): void => { stdout += text; } },
    stderr: { write: (text: string): void => { stderr += text; } },
  });
  return { code, stdout, stderr };
}

/**
 * Link one chat to the operator's own name.
 *
 * The roster add is ignored when it writes nothing, because a world that
 * linked before already names this owner.
 */
function linkChat(world: TemporaryStateRoot, chatId: string): void {
  const me = userInfo().username;
  rosterAdd(world.stateRoot, world.identity, me, 'owner');
  const started = startLink({ stateRoot: world.stateRoot, identity: world.identity, channel: 'telegram', actor: me, secret: null });
  if (!started.ok) throw new Error(started.reason);
  const paired = pairChat({
    stateRoot: world.stateRoot,
    identity: world.identity,
    channel: 'telegram',
    chatId,
    senderId: chatId,
    text: started.value.code,
  });
  if (!paired.ok) throw new Error(paired.reason);
  if (paired.value.kind !== 'linked') throw new Error(`the chat did not link: ${paired.value.kind}`);
}

describe('bots channel list', () => {
  it('lists both channels', async () => {
    const world = temporaryStateRoot();
    linkChat(world, '81234567');
    // The link writes the telegram entry, so the config is written last.
    writeChannelConfig(world.stateRoot, world.identity, {
      schemaVersion: 1,
      channels: {
        telegram: { secret: 'telegram', enabled: true },
        slack: { secret: 'slack-app-token', enabled: false },
      },
    });
    const queued = enqueueChannel({
      stateRoot: world.stateRoot,
      identity: world.identity,
      key: sendKey('telegram', '81234567', 'hello', new Date()),
      channel: 'telegram',
      conversationId: '81234567',
      text: 'hello',
    });
    if (!queued.ok) throw new Error(queued.reason);
    countNotApprover(world.stateRoot, world.identity, 'mallory');
    countNotApprover(world.stateRoot, world.identity, 'mallory');

    const json = await verb(world, ['list', '--json']);
    expect(json.code).toBe(0);
    expect(JSON.parse(json.stdout)).toEqual({
      version: 1,
      channels: [
        { name: 'slack', enabled: false, secret: 'slack-app-token', linkedChats: 0, queueDepth: 0 },
        { name: 'telegram', enabled: true, secret: 'telegram', linkedChats: 1, queueDepth: 1 },
      ],
    });
    expect(json.stdout).not.toContain('notApprover');
    expect(json.stdout.trimEnd().split('\n')).toHaveLength(1);

    const text = await verb(world, ['list']);
    expect(text.code).toBe(0);
    const lines = text.stdout.split('\n');
    expect(lines).toContain('slack disabled secret slack-app-token linked 0 queued 0');
    expect(lines).toContain('telegram enabled secret telegram linked 1 queued 1');
    expect(lines).toContain('notApprover mallory 2');
  }, 120_000);
});

describe('bots channel send', () => {
  it('sends one entry twice within a minute', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(new Date('2026-11-28T10:00:05.000Z'));
      const world = temporaryStateRoot();
      linkChat(world, '81234567');
      const fake = fakeTransport();

      const first = await verb(world, ['send', 'telegram', '81234567', 'hello'], { telegram: fake });
      expect(first.code).toBe(0);
      expect(first.stdout).toMatch(/^bots: channel telegram: send-[0-9a-f]{32} delivered\n$/);

      const second = await verb(world, ['send', 'telegram', '81234567', 'hello'], { telegram: fake });
      expect(second.code).toBe(0);
      expect(second.stdout).toMatch(/^bots: channel telegram: send-[0-9a-f]{32} delivered\n$/);

      const sends = fake.calls.filter((call) => call.op === 'send');
      expect(sends).toHaveLength(1);
      expect(sends[0].intent?.kind).toBe('text');
      expect(sends[0].intent?.text).toBe('hello');

      const entries = listQueueEntries(world.stateRoot, world.identity);
      expect(entries).toHaveLength(1);
      expect(entries[0].state).toBe('delivered');

      const unlinked = await verb(world, ['send', 'telegram', '99999999', 'hello'], { telegram: fake });
      expect(unlinked.code).toBe(4);
      expect(unlinked.stderr).toContain('channel-unlinked');
    } finally {
      vi.useRealTimers();
    }
  }, 120_000);
});

describe('bots channel drain', () => {
  it('exits 1 when a due entry failed', async () => {
    const world = temporaryStateRoot();
    const signalKey = sendKey('signal', '+15550001', 'hello', new Date());
    const signalQueued = enqueueChannel({
      stateRoot: world.stateRoot,
      identity: world.identity,
      key: signalKey,
      channel: 'signal',
      conversationId: '+15550001',
      text: 'hello',
    });
    if (!signalQueued.ok) throw new Error(signalQueued.reason);

    // No transport for signal, so the entry stays queued and changes no exit code.
    const noTransport = await verb(world, ['drain'], {});
    expect(noTransport.code).toBe(0);
    const stillQueued = readQueueEntry(world.stateRoot, world.identity, signalKey);
    if (!stillQueued.ok) throw new Error(stillQueued.reason);
    expect(stillQueued.value.state).toBe('queued');

    const telegramKey = sendKey('telegram', '81234567', 'bye', new Date());
    const telegramQueued = enqueueChannel({
      stateRoot: world.stateRoot,
      identity: world.identity,
      key: telegramKey,
      channel: 'telegram',
      conversationId: '81234567',
      text: 'bye',
    });
    if (!telegramQueued.ok) throw new Error(telegramQueued.reason);

    const fake = fakeTransport({
      sends: [{
        ok: false,
        error: {
          kind: 'bad-request',
          message: 'Bad Request: chat not found',
          unsupported: false,
          retryable: false,
          sentBeforeError: false,
        },
      }],
    });

    const failed = await verb(world, ['drain'], { telegram: fake });
    expect(failed.code).toBe(1);
    expect(failed.stdout).toContain(`bots: channel telegram: ${telegramKey} failed`);
    const read = readQueueEntry(world.stateRoot, world.identity, telegramKey);
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.state).toBe('failed');
  }, 120_000);

  it('exits 4 when the drain is refused', async () => {
    const world = temporaryStateRoot();
    const key = sendKey('signal', '+15550001', 'hello', new Date());
    const queued = enqueueChannel({
      stateRoot: world.stateRoot,
      identity: world.identity,
      key,
      channel: 'signal',
      conversationId: '+15550001',
      text: 'hello',
    });
    if (!queued.ok) throw new Error(queued.reason);

    const fake = fakeTransport({
      name: 'signal',
      sends: [{
        ok: false,
        error: {
          kind: 'channel-daemon-unreachable',
          message: 'signal-cli daemon not reachable',
          unsupported: false,
          retryable: false,
          sentBeforeError: false,
        },
      }],
    });

    const refused = await verb(world, ['drain'], { signal: fake });
    expect(refused.code).toBe(4);
    expect(refused.stderr).toContain('bots: channel-daemon-unreachable: signal-cli daemon not reachable');
    const read = readQueueEntry(world.stateRoot, world.identity, key);
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.state).toBe('queued');
    expect(read.value.attempts).toBe(0);
  }, 120_000);
});
