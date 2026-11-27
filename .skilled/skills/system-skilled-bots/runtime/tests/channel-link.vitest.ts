// bots channel link: a chat locks after five wrong codes, and a chat answers only as the actor its link names.

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { answerItem } from '../lib/answer.js';
import { pairChat, readLinks, resolveLink, rosterAdd, rosterRemove, startLink } from '../lib/channel-link.js';
import { needsYouExpiry, writeNeedsYouItem } from '../lib/needs-you.js';
import { queuePaths } from '../lib/request-queue.js';
import { newRunId } from '../lib/runner.js';
import { needsYouFile, operatorsFile } from '../lib/state-root.js';
import { temporaryStateRoot } from './channel-support.js';
import { cleanupTemp, tempDir } from './support.js';

import type { LinksFile } from '../lib/channel-link.js';
import type { NeedsYouItem } from '../lib/needs-you.js';
import type { TemporaryStateRoot } from './channel-support.js';

afterEach(cleanupTemp);

// The child that pairs from a second process, so a lockout is proved to live in the file rather than in memory.
const PAIR_CHILD = `
const [url, stateRoot, identity] = process.argv.slice(2);
const { pairChat } = await import(url);
process.stdout.write(JSON.stringify(pairChat({ stateRoot, identity, channel: 'telegram', chatId: '99887766', senderId: '99887766', text: '123456' })));
`;

/** The links file of a world, or a throw when the runtime refuses to read it. */
function linksOf(world: TemporaryStateRoot): LinksFile {
  const read = readLinks(world.stateRoot, world.identity);
  if (!read.ok) throw new Error(read.reason);
  return read.value;
}

/** An open decision item, written the way a parked run writes one. */
function openItem(world: TemporaryStateRoot): NeedsYouItem {
  const now = new Date();
  const id = newRunId(now);
  const item: NeedsYouItem = {
    id,
    runId: id,
    botId: 'digest',
    identity: world.identity,
    question: 'Ship the release?',
    options: [],
    createdAt: now.toISOString(),
    expiresAt: needsYouExpiry(now, 7),
    evidence: [],
    prompt: 'The parked prompt.',
    specFolder: null,
    answer: null,
    resumeRequestId: null,
  };
  const written = writeNeedsYouItem(world.stateRoot, item);
  if (!written.ok) throw new Error(written.reason);
  return item;
}

/** The item file exactly as it sits on disk, so a refusal can be proved to have written nothing. */
function itemBytes(world: TemporaryStateRoot, id: string): string {
  return readFileSync(needsYouFile(world.stateRoot, world.identity, id), 'utf8');
}

/** The resume requests waiting in the inbox, or none when the folder was never made. */
function inboxEntries(world: TemporaryStateRoot): string[] {
  const inbox = queuePaths(world.stateRoot, world.identity).inbox;
  return existsSync(inbox) ? readdirSync(inbox) : [];
}

/** A six-digit code that is not the pending one, so an attempt is wrong without being malformed. */
function wrongCode(code: string): string {
  return code === '000000' ? '111111' : '000000';
}

describe('bots channel link', () => {
  it('locks a chat after five wrong codes', async () => {
    const world = temporaryStateRoot();
    const runtime = resolve(import.meta.dirname, '..');
    expect(rosterAdd(world.stateRoot, world.identity, 'ada', 'owner').ok).toBe(true);

    const startedAt = Date.now();
    const started = startLink({ stateRoot: world.stateRoot, identity: world.identity, channel: 'telegram', actor: 'ada' });
    expect(started.ok).toBe(true);
    if (!started.ok) throw new Error(started.reason);
    expect(started.value.code).toMatch(/^[0-9]{6}$/);

    const pending = linksOf(world).codes.telegram;
    if (pending === undefined) throw new Error('expected a pending telegram code');
    expect(pending.actor).toBe('ada');
    expect(pending.failures).toBe(0);
    const ttl = Date.parse(pending.expiresAt) - startedAt;
    expect(ttl).toBeGreaterThanOrEqual(4 * 60 * 1000);
    expect(ttl).toBeLessThanOrEqual(6 * 60 * 1000);

    const pairFrom = (chatId: string, text: string, now?: Date) =>
      pairChat({ stateRoot: world.stateRoot, identity: world.identity, channel: 'telegram', chatId, senderId: chatId, text, now });

    // Text that is not six digits counts nothing, so a chat cannot spend its guesses on a greeting.
    expect(pairFrom('99887766', 'hello')).toEqual({ ok: true, value: { kind: 'not-a-code' } });
    expect(linksOf(world).lockouts['telegram:99887766']).toBeUndefined();

    const wrong = wrongCode(started.value.code);
    for (const codesLeft of [4, 3, 2, 1]) {
      expect(pairFrom('99887766', wrong)).toEqual({ ok: true, value: { kind: 'wrong-code', codesLeft } });
    }
    expect(pairFrom('99887766', wrong)).toEqual({ ok: true, value: { kind: 'locked', secondsLeft: 300 } });

    const lockout = linksOf(world).lockouts['telegram:99887766'];
    if (lockout === undefined) throw new Error('expected a lockout for the chat');
    expect(lockout.failures).toBe(5);
    expect(typeof lockout.lockedUntil).toBe('string');
    if (lockout.lockedUntil === null) throw new Error('expected a locked chat');
    expect(linksOf(world).codes.telegram).toBeUndefined();

    // The right code is no help once the chat is locked, and the lock is checked before the code is.
    const sixth = pairFrom('99887766', started.value.code);
    expect(sixth).toMatchObject({ ok: true, value: { kind: 'locked' } });
    if (!sixth.ok || sixth.value.kind !== 'locked') throw new Error('expected a locked chat');
    expect(sixth.value.secondsLeft).toBeGreaterThan(0);
    expect(sixth.value.secondsLeft).toBeLessThanOrEqual(300);
    expect(linksOf(world).links['telegram:99887766']).toBeUndefined();

    // The lockout is a file, so a second process reads the same lock the first one wrote.
    const folder = tempDir('bots-pair-');
    const childPath = join(folder, 'child.mts');
    writeFileSync(childPath, PAIR_CHILD);
    const child = spawnSync(
      process.execPath,
      ['--import', 'tsx', childPath, pathToFileURL(resolve(runtime, 'lib', 'channel-link.ts')).href, world.stateRoot, world.identity],
      { cwd: runtime, env: world.env, encoding: 'utf8' },
    );
    expect(child.status, child.stderr).toBe(0);
    const fromChild = JSON.parse(child.stdout) as { ok: boolean; value: { kind: string; secondsLeft: number } };
    expect(fromChild.ok).toBe(true);
    expect(fromChild.value.kind).toBe('locked');
    expect(fromChild.value.secondsLeft).toBeGreaterThan(0);
    expect(fromChild.value.secondsLeft).toBeLessThanOrEqual(300);

    // Once the lock has run out the chat is unlinked again and the lockout entry is gone.
    const expired = pairFrom('99887766', 'hello', new Date(Date.parse(lockout.lockedUntil) + 1000));
    expect(expired).toEqual({ ok: true, value: { kind: 'not-a-code' } });
    expect(linksOf(world).lockouts['telegram:99887766']).toBeUndefined();

    // Five wrong codes across two chats void the code, so a second account cannot start a fresh five guesses.
    const second = startLink({ stateRoot: world.stateRoot, identity: world.identity, channel: 'telegram', actor: 'ada' });
    expect(second.ok).toBe(true);
    if (!second.ok) throw new Error(second.reason);
    const fresh = second.value.code;
    const freshWrong = wrongCode(fresh);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      expect(pairFrom('111', freshWrong)).toMatchObject({ ok: true, value: { kind: 'wrong-code' } });
    }
    for (let attempt = 0; attempt < 2; attempt += 1) {
      expect(pairFrom('222', freshWrong)).toMatchObject({ ok: true, value: { kind: 'wrong-code' } });
    }
    expect(linksOf(world).codes.telegram).toBeUndefined();
    expect(pairFrom('111', fresh)).toEqual({ ok: true, value: { kind: 'wrong-code', codesLeft: 1 } });
    expect(linksOf(world).links['telegram:111']).toBeUndefined();

    // A linked actor's refusals are counted per actor, so they never lock the chat the others share.
    expect(rosterAdd(world.stateRoot, world.identity, 'grace', 'member').ok).toBe(true);
    const grace = startLink({ stateRoot: world.stateRoot, identity: world.identity, channel: 'telegram', actor: 'grace' });
    expect(grace.ok).toBe(true);
    if (!grace.ok) throw new Error(grace.reason);
    expect(pairFrom('333', grace.value.code)).toMatchObject({
      ok: true,
      value: { kind: 'linked', link: { actor: 'grace', senderId: '333' } },
    });
    expect(rosterRemove(world.stateRoot, world.identity, 'grace').ok).toBe(true);

    const item = openItem(world);
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const refused = answerItem({
        checkoutRoot: world.checkoutRoot,
        itemId: item.id,
        text: 'yes',
        env: world.env,
        actor: 'grace',
        surface: 'channel',
      });
      expect(refused).toMatchObject({ ok: false, reason: 'answer-not-approver' });
    }
    expect(linksOf(world).lockouts['telegram:333']).toBeUndefined();
    expect(resolveLink(world.stateRoot, world.identity, 'telegram', '333', '333')).toMatchObject({
      ok: true,
      value: { actor: 'grace' },
    });
    expect(pairFrom('333', 'hello')).toMatchObject({ ok: true, value: { kind: 'already-linked' } });
  }, 120_000);

  it('refuses a chat whose actor is off the roster', () => {
    const world = temporaryStateRoot();
    expect(rosterAdd(world.stateRoot, world.identity, 'ada', 'owner').ok).toBe(true);
    expect(rosterAdd(world.stateRoot, world.identity, 'bob', 'member').ok).toBe(true);

    const started = startLink({ stateRoot: world.stateRoot, identity: world.identity, channel: 'telegram', actor: 'bob' });
    expect(started.ok).toBe(true);
    if (!started.ok) throw new Error(started.reason);
    const paired = pairChat({
      stateRoot: world.stateRoot,
      identity: world.identity,
      channel: 'telegram',
      chatId: '5550001',
      senderId: '5550001',
      text: started.value.code,
    });
    expect(paired).toMatchObject({ ok: true, value: { kind: 'linked', link: { actor: 'bob', senderId: '5550001' } } });

    // A name the roster does not carry mints no code, so the refusal leaves the links file as it was.
    expect(startLink({ stateRoot: world.stateRoot, identity: world.identity, channel: 'telegram', actor: 'mallory' })).toEqual({
      ok: false,
      reason: 'answer-not-approver',
      detail: 'mallory',
    });
    expect(linksOf(world).codes.telegram).toBeUndefined();

    expect(rosterRemove(world.stateRoot, world.identity, 'bob').ok).toBe(true);
    const item = openItem(world);
    const before = itemBytes(world, item.id);

    const link = resolveLink(world.stateRoot, world.identity, 'telegram', '5550001', '5550001');
    expect(link.ok).toBe(true);
    if (!link.ok) throw new Error(link.reason);
    const answer = answerItem({
      checkoutRoot: world.checkoutRoot,
      itemId: item.id,
      text: 'yes',
      env: world.env,
      actor: link.value.actor,
      surface: 'channel',
    });
    expect(answer).toEqual({ ok: false, reason: 'answer-not-approver', detail: 'bob' });
    expect(itemBytes(world, item.id)).toBe(before);
    expect(inboxEntries(world)).toEqual([]);

    // The actor comes from the link record and never from the message, so a press from another sender reaches no answer.
    expect(resolveLink(world.stateRoot, world.identity, 'telegram', '5550001', '9990009')).toEqual({
      ok: false,
      reason: 'channel-unlinked',
      detail: 'sender mismatch',
    });
    expect(resolveLink(world.stateRoot, world.identity, 'telegram', '4242', '4242')).toEqual({
      ok: false,
      reason: 'channel-unlinked',
      detail: 'no link',
    });

    // An absent roster refuses every channel answer, and the item is left exactly as it was.
    rmSync(operatorsFile(world.stateRoot, world.identity));
    const missing = answerItem({
      checkoutRoot: world.checkoutRoot,
      itemId: item.id,
      text: 'yes',
      env: world.env,
      actor: 'ada',
      surface: 'channel',
    });
    expect(missing).toMatchObject({ ok: false, reason: 'channel-roster-missing' });
    expect(itemBytes(world, item.id)).toBe(before);
  }, 120_000);
});
