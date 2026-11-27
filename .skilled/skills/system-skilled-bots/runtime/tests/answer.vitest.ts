// bots answer: the answer is recorded before one resume request keyed by the item, and the item can expire.

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { userInfo } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { answerItem } from '../lib/answer.js';
import { appendMemoryEntry, botMemoryFile, forgetMemoryEntry, MEMORY_LIMITS, readMemoryFile } from '../lib/memory.js';
import { itemAwaitingResume, needsYouExpiry, needsYouState, readNeedsYouItem, writeNeedsYouItem } from '../lib/needs-you.js';
import { requestIdFor } from '../lib/request-record.js';
import { readRunRecord } from '../lib/run-record.js';
import { generationStampFile, newRunId, runBot } from '../lib/runner.js';
import { identityStatePaths } from '../lib/state-root.js';
import { botWorld, IDENTITY, runCli } from './runner-support.js';
import { entries, queueOf, records, writeItem } from './queue-support.js';
import { cleanupTemp, REAL_CHECKOUT, tempDir, writeConfig } from './support.js';

import type { AnswerScope, NeedsYouItem } from '../lib/needs-you.js';
import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

const DAY_MS = 24 * 60 * 60 * 1000;

// The answer shape stored before answers named anyone.
const LEGACY = JSON.parse(
  readFileSync(join(REAL_CHECKOUT, 'specs', 'system-skilled-bots', '003-openbot-parity-build', '001-activity-and-actor', 'design', 'fixtures', 'legacy-records.json'), 'utf8'),
) as { answerBefore001: { text: string; answeredAt: string } };

// The child that races one answer: it announces itself, waits for the other child, then answers.
const ANSWER_CHILD = `
import { existsSync, writeFileSync } from 'node:fs';

const [answerUrl, mineReady, otherReady, checkoutRoot, itemId, text] = process.argv.slice(2);
const { answerItem } = await import(answerUrl);
writeFileSync(mineReady, '');
const sleeper = new Int32Array(new SharedArrayBuffer(4));
const until = Date.now() + 15_000;
while (!existsSync(otherReady) && Date.now() < until) Atomics.wait(sleeper, 0, 0, 5);
const result = answerItem({ checkoutRoot, itemId, text, env: process.env });
process.stdout.write(JSON.stringify(result));
`;

function generation(world: BotWorld): number {
  const path = generationStampFile(world.stateRoot, IDENTITY);
  return existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as { generation: number }).generation : 0;
}

async function parkedItemId(world: BotWorld): Promise<string> {
  const parked = await runBot(world.input('needs-decision'));
  if (parked.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${parked.kind}`);
  return parked.itemId;
}

function proposal(world: BotWorld, overrides: Partial<NeedsYouItem> = {}): NeedsYouItem {
  const now = new Date();
  const id = newRunId(now);
  const item: NeedsYouItem = {
    id,
    runId: id,
    botId: 'memory-proposals',
    identity: IDENTITY,
    question: 'Remember this fact for manual-ok: Prefers ISO dates.',
    options: ['confirm', 'reject'],
    createdAt: now.toISOString(),
    expiresAt: needsYouExpiry(now, 7),
    evidence: [],
    prompt: 'The dispatched prompt.',
    specFolder: null,
    answer: null,
    resumeRequestId: null,
    kind: 'memory-proposal',
    proposalType: 'user',
    proposalFact: 'Prefers ISO dates.',
    proposalBotId: 'manual-ok',
    ...overrides,
  };
  const written = writeNeedsYouItem(world.stateRoot, item);
  if (!written.ok) throw new Error(written.reason);
  return item;
}

describe('bots answer', () => {
  it('stores one resume request for the same answer twice, marks the item answered and drains into one run', async () => {
    const world = botWorld();
    const itemId = await parkedItemId(world);
    const stampBefore = generation(world);

    const first = runCli(world, ['answer', itemId, 'merge']);
    expect(first.status).toBe(0);
    expect(first.stdout).toMatch(/resume request rq-[0-9a-f]{32} enqueued/);
    const second = runCli(world, ['answer', itemId, 'merge']);
    expect(second.status).toBe(0);
    expect(second.stdout).toContain('duplicate');
    expect(generation(world)).toBe(stampBefore + 1);

    const requestId = /rq-[0-9a-f]{32}/.exec(first.stdout)?.[0] as string;
    expect(entries(queueOf(world).inbox)).toEqual([`${requestId}.json`]);
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, itemId);
    if (!item.ok) throw new Error(item.reason);
    expect(needsYouState(item.value)).toBe('answered');
    expect(item.value.resumeRequestId).toBe(requestId);

    const drained = runCli(world, ['drain']);
    expect(drained.status).toBe(0);
    expect(drained.stdout).toBe(`${requestId} ran\n`);
    const joined = records(world).filter((record) => record.request.resumedItemId === itemId);
    expect(joined).toHaveLength(1);
    expect(joined[0]?.request.requestId).toBe(requestId);
  }, 120_000);

  it('records the answer before it enqueues', async () => {
    const world = botWorld();
    const itemId = await parkedItemId(world);
    let seen: string | null = 'not called';
    const result = answerItem({
      checkoutRoot: world.checkoutRoot,
      itemId,
      text: 'merge',
      env: world.env,
      enqueue: (stateRoot, request) => {
        const item = readNeedsYouItem(stateRoot, IDENTITY, itemId);
        seen = item.ok ? needsYouState(item.value) : item.reason;
        return { ok: true, value: { status: 'enqueued', requestId: request.id, path: null } };
      },
    });
    expect(result.ok).toBe(true);
    expect(seen).toBe('answered');
  }, 60_000);

  it('refuses a different answer, an unknown item, a missing text and a secret named by key', async () => {
    const secret = 'Zx9-deploy-token-value-42';
    const world = botWorld({ DEPLOY_TOKEN: secret });
    const itemId = await parkedItemId(world);
    expect(runCli(world, ['answer', itemId, 'merge']).status).toBe(0);

    const different = runCli(world, ['answer', itemId, 'open a PR']);
    expect(different.status).not.toBe(0);
    expect(different.stderr).toContain('item-answered-differently');

    const unknown = runCli(world, ['answer', '20991231T000000Z-deadbeef', 'merge']);
    expect(unknown.status).not.toBe(0);
    expect(unknown.stderr).toContain('item-unknown');

    expect(runCli(world, ['answer', itemId]).status).toBe(2);

    const open = writeItem(world, 'manual-ok');
    const leaked = runCli(world, ['answer', open.id, `use ${secret}`]);
    expect(leaked.status).not.toBe(0);
    expect(leaked.stderr).toContain('DEPLOY_TOKEN');
    expect(leaked.stderr).not.toContain(secret);
    const stillOpen = readNeedsYouItem(world.stateRoot, IDENTITY, open.id);
    expect(stillOpen.ok && needsYouState(stillOpen.value)).toBe('open');
  }, 120_000);

  it('reads an unanswered item as expired once needsYou.expiryDays have passed, and refuses to answer it', async () => {
    const world = botWorld();
    writeConfig(world.checkoutRoot, { identity: IDENTITY, needsYou: { expiryDays: 2 } });
    const itemId = await parkedItemId(world);
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, itemId);
    if (!item.ok) throw new Error(item.reason);
    const expiresAt = Date.parse(item.value.expiresAt);
    expect(expiresAt - Date.parse(item.value.createdAt)).toBe(2 * DAY_MS);
    expect(needsYouState(item.value, new Date(expiresAt - 1))).toBe('open');
    expect(needsYouState(item.value, new Date(expiresAt))).toBe('expired');
    expect(
      answerItem({ checkoutRoot: world.checkoutRoot, itemId, text: 'merge', env: world.env, now: new Date(expiresAt) }),
    ).toMatchObject({ ok: false, reason: 'item-expired' });

    const stale = writeItem(world, 'manual-ok', { createdAt: new Date(Date.now() - 3 * DAY_MS), expiryDays: 2 });
    const refused = runCli(world, ['answer', stale.id, 'merge']);
    expect(refused.status).not.toBe(0);
    expect(refused.stderr).toContain('item-expired');
    expect(runCli(world, ['inbox']).stdout).toContain(`expired\t${stale.id}`);
    expect(entries(queueOf(world).inbox)).toEqual([]);
  }, 120_000);

  it('records the actor in by', async () => {
    const world = botWorld();
    const first = await parkedItemId(world);
    const answered = answerItem({ checkoutRoot: world.checkoutRoot, itemId: first, text: 'merge', env: world.env, actor: 'ada' });
    expect(answered.ok).toBe(true);
    const firstItem = readNeedsYouItem(world.stateRoot, IDENTITY, first);
    if (!firstItem.ok) throw new Error(firstItem.reason);
    expect(firstItem.value.answer?.by).toBe('ada');
    const record = readRunRecord(world.stateRoot, IDENTITY, first);
    if (!record.ok) throw new Error(record.reason);
    expect(record.value.record.answeredBy).toBe('ada');

    const second = await parkedItemId(world);
    const anonymous = answerItem({ checkoutRoot: world.checkoutRoot, itemId: second, text: 'merge', env: world.env });
    expect(anonymous.ok).toBe(true);
    const secondItem = readNeedsYouItem(world.stateRoot, IDENTITY, second);
    if (!secondItem.ok) throw new Error(secondItem.reason);
    const osName = userInfo().username;
    expect(secondItem.value.answer?.by).toBe(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(osName) ? osName : null);

    const third = await parkedItemId(world);
    const cased = answerItem({ checkoutRoot: world.checkoutRoot, itemId: third, text: 'merge', env: world.env, actor: 'Ada' });
    expect(cased.ok).toBe(true);
    const thirdItem = readNeedsYouItem(world.stateRoot, IDENTITY, third);
    if (!thirdItem.ok) throw new Error(thirdItem.reason);
    expect(thirdItem.value.answer?.by).toBe('Ada');
    expect(thirdItem.value.answer?.by).not.toBe(firstItem.value.answer?.by);
  }, 120_000);

  it('records the scope and refuses another', async () => {
    const world = botWorld();
    const denied = await parkedItemId(world);
    const deniedAnswer = answerItem({ checkoutRoot: world.checkoutRoot, itemId: denied, text: 'merge', env: world.env, actor: 'ada', scope: 'deny' });
    expect(deniedAnswer.ok).toBe(true);
    const deniedItem = readNeedsYouItem(world.stateRoot, IDENTITY, denied);
    if (!deniedItem.ok) throw new Error(deniedItem.reason);
    expect(deniedItem.value.answer?.scope).toBe('deny');

    const fresh = await parkedItemId(world);
    const onceAnswer = answerItem({ checkoutRoot: world.checkoutRoot, itemId: fresh, text: 'merge', env: world.env, actor: 'ada' });
    expect(onceAnswer.ok).toBe(true);
    const freshItem = readNeedsYouItem(world.stateRoot, IDENTITY, fresh);
    if (!freshItem.ok) throw new Error(freshItem.reason);
    expect(freshItem.value.answer?.scope).toBe('once');

    const duplicate = answerItem({ checkoutRoot: world.checkoutRoot, itemId: fresh, text: 'merge', env: world.env, actor: 'ada', scope: 'once' });
    expect(duplicate.ok && duplicate.value.status).toBe('duplicate');
    const other = answerItem({ checkoutRoot: world.checkoutRoot, itemId: fresh, text: 'merge', env: world.env, actor: 'ada', scope: 'deny' });
    expect(other).toMatchObject({ ok: false, reason: 'item-answered-differently' });

    const legacy = writeItem(world, 'manual-ok');
    const written = writeNeedsYouItem(world.stateRoot, { ...legacy, answer: LEGACY.answerBefore001 });
    if (!written.ok) throw new Error(written.reason);
    const legacySent = answerItem({ checkoutRoot: world.checkoutRoot, itemId: legacy.id, text: LEGACY.answerBefore001.text, env: world.env, actor: 'ada' });
    expect(legacySent.ok && legacySent.value.status).toBe('enqueued');
    const legacyDuplicate = answerItem({ checkoutRoot: world.checkoutRoot, itemId: legacy.id, text: LEGACY.answerBefore001.text, env: world.env, actor: 'ada' });
    expect(legacyDuplicate.ok && legacyDuplicate.value.status).toBe('duplicate');
    const legacyOther = answerItem({ checkoutRoot: world.checkoutRoot, itemId: legacy.id, text: LEGACY.answerBefore001.text, env: world.env, actor: 'ada', scope: 'deny' });
    expect(legacyOther).toMatchObject({ ok: false, reason: 'item-answered-differently' });
  }, 120_000);

  it('takes an explicit actor with no tty', async () => {
    expect(process.stdin.isTTY).not.toBe(true);
    const world = botWorld();
    const itemId = await parkedItemId(world);
    const answered = answerItem({ checkoutRoot: world.checkoutRoot, itemId, text: 'merge', env: world.env, actor: 'ada' });
    expect(answered.ok).toBe(true);
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, itemId);
    if (!item.ok) throw new Error(item.reason);
    expect(item.value.answer?.by).toBe('ada');
  }, 120_000);

  it('answers with no resume', async () => {
    const world = botWorld();
    const item = writeItem(world, 'manual-ok');
    const calls: string[] = [];
    const enqueue = () => {
      calls.push('called');
      throw new Error('a no-resume answer must not queue a request');
    };

    const result = answerItem({ checkoutRoot: world.checkoutRoot, itemId: item.id, text: 'enabled', resume: false, env: world.env, enqueue });
    const requestId = requestIdFor(item.botId, item.id);
    expect(result).toMatchObject({ ok: true, value: { status: 'reviewed', requestId } });
    expect(calls).toEqual([]);
    expect(entries(queueOf(world).inbox)).toEqual([]);

    const stored = readNeedsYouItem(world.stateRoot, IDENTITY, item.id);
    if (!stored.ok) throw new Error(stored.reason);
    expect(stored.value.answer?.text).toBe('enabled');
    expect(stored.value.answer?.scope).toBe('once');
    expect(stored.value.resumeRequestId).toBe(requestId);
    expect(needsYouState(stored.value)).toBe('answered');
    expect(itemAwaitingResume(world.stateRoot, IDENTITY, item.botId)).toBeNull();

    const again = answerItem({ checkoutRoot: world.checkoutRoot, itemId: item.id, text: 'something else', resume: false, env: world.env, enqueue });
    expect(again).toMatchObject({ ok: true, value: { status: 'reviewed' } });
    const after = readNeedsYouItem(world.stateRoot, IDENTITY, item.id);
    if (!after.ok) throw new Error(after.reason);
    expect(after.value.answer?.text).toBe('enabled');
  }, 60_000);

  it('records the scope the answer grants', () => {
    const world = botWorld();
    const cases: Array<{ text: string; scope?: AnswerScope; expected: AnswerScope }> = [
      { text: 'yes', scope: 'deny', expected: 'deny' },
      { text: 'yes', expected: 'once' },
      { text: 'no', expected: 'deny' },
      { text: 'n', expected: 'deny' },
      { text: '  NO  ', scope: 'once', expected: 'deny' },
    ];
    for (const one of cases) {
      const item = writeItem(world, 'manual-ok');
      const answered = answerItem({ checkoutRoot: world.checkoutRoot, itemId: item.id, text: one.text, env: world.env, actor: 'ada', scope: one.scope });
      expect(answered.ok, one.text).toBe(true);
      const stored = readNeedsYouItem(world.stateRoot, IDENTITY, item.id);
      if (!stored.ok) throw new Error(stored.reason);
      expect(stored.value.answer?.scope, one.text).toBe(one.expected);
      expect(stored.value.grants?.scope, one.text).toBe(one.expected);
      expect(stored.value.grants?.grantedBy, one.text).toBe('ada');
      expect(stored.value.grants?.grantedAt, one.text).toBe(stored.value.answer?.answeredAt);
    }

    const rejected = proposal(world);
    const rejection = answerItem({ checkoutRoot: world.checkoutRoot, itemId: rejected.id, text: 'reject', env: world.env, actor: 'ada', scope: 'once' });
    expect(rejection.ok).toBe(true);
    const rejectedStored = readNeedsYouItem(world.stateRoot, IDENTITY, rejected.id);
    if (!rejectedStored.ok) throw new Error(rejectedStored.reason);
    expect(rejectedStored.value.grants?.scope).toBe('deny');

    const confirmed = proposal(world);
    const confirmation = answerItem({ checkoutRoot: world.checkoutRoot, itemId: confirmed.id, text: 'confirm', env: world.env, actor: 'ada', scope: 'deny' });
    expect(confirmation.ok).toBe(true);
    const confirmedStored = readNeedsYouItem(world.stateRoot, IDENTITY, confirmed.id);
    if (!confirmedStored.ok) throw new Error(confirmedStored.reason);
    expect(confirmedStored.value.grants?.scope).toBe('once');
  }, 60_000);

  it('refuses a second answer with another scope', () => {
    const world = botWorld();
    const item = writeItem(world, 'manual-ok');
    const first = answerItem({ checkoutRoot: world.checkoutRoot, itemId: item.id, text: 'yes', env: world.env, actor: 'ada', scope: 'once' });
    expect(first.ok).toBe(true);

    const second = runCli(world, ['answer', item.id, 'yes', '--scope', 'deny']);
    expect(second.status).toBe(4);
    expect(second.stderr.startsWith('bots: item-answered-differently')).toBe(true);

    const stored = readNeedsYouItem(world.stateRoot, IDENTITY, item.id);
    if (!stored.ok) throw new Error(stored.reason);
    expect(stored.value.answer?.scope).toBe('once');
    expect(stored.value.grants?.scope).toBe('once');
  }, 60_000);

  it('two answers one lands', async () => {
    const world = botWorld();
    const item = writeItem(world, 'manual-ok');
    const folder = tempDir('bots-answer-race-');
    const childPath = join(folder, 'child.mts');
    writeFileSync(childPath, ANSWER_CHILD);
    const runtime = resolve(import.meta.dirname, '..');
    const answerUrl = pathToFileURL(resolve(runtime, 'lib', 'answer.ts')).href;
    const readyYes = join(folder, 'yes.ready');
    const readyNo = join(folder, 'no.ready');

    const start = (text: string, mineReady: string, otherReady: string) => {
      const child = spawn(process.execPath, ['--import', 'tsx', childPath, answerUrl, mineReady, otherReady, world.checkoutRoot, item.id, text], {
        cwd: runtime,
        env: world.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });
      child.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });
      return new Promise<{ code: number | null; stdout: string; stderr: string }>((done) =>
        child.on('close', (code) => done({ code, stdout, stderr })),
      );
    };

    const [yes, no] = await Promise.all([start('yes', readyYes, readyNo), start('no', readyNo, readyYes)]);
    expect(yes.code, yes.stderr).toBe(0);
    expect(no.code, no.stderr).toBe(0);
    const results = [JSON.parse(yes.stdout), JSON.parse(no.stdout)] as Array<Record<string, unknown>>;
    expect(results.filter((result) => result.ok === true)).toHaveLength(1);
    expect(results.filter((result) => result.ok === false)).toMatchObject([{ ok: false, reason: 'item-answered-differently' }]);

    const stored = readNeedsYouItem(world.stateRoot, IDENTITY, item.id);
    if (!stored.ok) throw new Error(stored.reason);
    expect([['yes', 'once'], ['no', 'deny']]).toContainEqual([stored.value.answer?.text, stored.value.grants?.scope]);
    const locks = readdirSync(identityStatePaths(world.stateRoot, IDENTITY).needsYou).filter((name) => name.endsWith('.lock'));
    expect(locks).toEqual([]);
  }, 60_000);

  it('a stale lock does not block the next answer', () => {
    const world = botWorld();
    const folder = identityStatePaths(world.stateRoot, IDENTITY).needsYou;
    const lockFor = (itemId: string, pid: number, createdAt: string) => {
      const path = join(folder, `${itemId}.lock`);
      writeFileSync(path, JSON.stringify({ pid, nonce: '9f2c1a7b4e8d0356c1b9a4f7e2d8063b', createdAt }));
      return path;
    };

    const dead = spawnSync(process.execPath, ['-e', '']).pid;
    const first = writeItem(world, 'manual-ok');
    const firstLock = lockFor(first.id, dead, new Date().toISOString());
    const firstAnswer = answerItem({ checkoutRoot: world.checkoutRoot, itemId: first.id, text: 'yes', env: world.env, actor: 'ada', scope: 'once' });
    expect(firstAnswer.ok).toBe(true);
    const firstStored = readNeedsYouItem(world.stateRoot, IDENTITY, first.id);
    if (!firstStored.ok) throw new Error(firstStored.reason);
    expect(firstStored.value.grants?.scope).toBe('once');
    expect(existsSync(firstLock)).toBe(false);

    const second = writeItem(world, 'manual-ok');
    const aged = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const secondLock = lockFor(second.id, process.pid, aged);
    const secondAnswer = answerItem({ checkoutRoot: world.checkoutRoot, itemId: second.id, text: 'yes', env: world.env, actor: 'ada', scope: 'once' });
    expect(secondAnswer.ok).toBe(true);
    expect(existsSync(secondLock)).toBe(false);

    const third = writeItem(world, 'manual-ok');
    const fresh = new Date().toISOString();
    const thirdLock = lockFor(third.id, process.pid, fresh);
    const started = Date.now();
    const busy = answerItem({ checkoutRoot: world.checkoutRoot, itemId: third.id, text: 'yes', env: world.env, actor: 'ada', scope: 'once' });
    const elapsed = Date.now() - started;
    expect(busy).toMatchObject({ ok: false, reason: 'item-busy', detail: `held by pid ${process.pid} since ${fresh}` });
    expect(elapsed).toBeGreaterThanOrEqual(1_900);
    const thirdStored = readNeedsYouItem(world.stateRoot, IDENTITY, third.id);
    if (!thirdStored.ok) throw new Error(thirdStored.reason);
    expect(needsYouState(thirdStored.value)).toBe('open');
    expect(existsSync(thirdLock)).toBe(true);
  }, 30_000);
});

describe('memory proposal answer', () => {
  it('confirm', () => {
    const world = botWorld();
    const item = proposal(world);
    const path = botMemoryFile(world.stateRoot, IDENTITY, 'manual-ok');
    if (!path.ok) throw new Error(path.reason);

    const answered = answerItem({ checkoutRoot: world.checkoutRoot, itemId: item.id, text: 'confirm', env: world.env, actor: 'ada' });
    expect(answered).toMatchObject({ ok: true, value: { status: 'reviewed', kind: 'memory-proposal', itemId: item.id } });
    const appended = readMemoryFile(path.value).entries;
    expect(appended).toHaveLength(1);
    expect(appended[0]).toMatchObject({
      type: 'user',
      actor: 'ada',
      text: 'Prefers ISO dates.',
      source: `bot:manual-ok (run ${item.runId})`,
    });

    const stored = readNeedsYouItem(world.stateRoot, IDENTITY, item.id);
    if (!stored.ok) throw new Error(stored.reason);
    expect(stored.value.answer?.text).toBe('confirm');
    expect(entries(queueOf(world).inbox)).toEqual([]);
    expect(itemAwaitingResume(world.stateRoot, IDENTITY, 'manual-ok')).toBeNull();

    const again = answerItem({ checkoutRoot: world.checkoutRoot, itemId: item.id, text: 'confirm', env: world.env, actor: 'ada' });
    expect(again).toMatchObject({ ok: true, value: { status: 'reviewed' } });
    expect(readMemoryFile(path.value).entries).toHaveLength(1);

    const second = proposal(world);
    const cli = runCli(world, ['answer', second.id, 'confirm']);
    expect(cli.status).toBe(0);
    expect(cli.stdout).toContain(`bots: item ${second.id} answered; memory-proposal review recorded`);
  }, 120_000);

  it('reject', () => {
    const world = botWorld();
    const path = botMemoryFile(world.stateRoot, IDENTITY, 'manual-ok');
    if (!path.ok) throw new Error(path.reason);
    for (const text of ['reject', 'No', 'n']) {
      const item = proposal(world);
      const answered = answerItem({ checkoutRoot: world.checkoutRoot, itemId: item.id, text, env: world.env, actor: 'ada' });
      expect(answered).toMatchObject({ ok: true, value: { status: 'reviewed', kind: 'memory-proposal' } });
      const stored = readNeedsYouItem(world.stateRoot, IDENTITY, item.id);
      if (!stored.ok) throw new Error(stored.reason);
      expect(stored.value.answer?.scope).toBe('deny');
      expect(existsSync(path.value)).toBe(false);
      expect(entries(queueOf(world).inbox)).toEqual([]);
    }
  });

  it('seam', () => {
    const world = botWorld();
    const item = proposal(world);
    expect(answerItem({ checkoutRoot: world.checkoutRoot, itemId: item.id, text: 'maybe', env: world.env, actor: 'ada' })).toEqual({
      ok: false,
      reason: 'review-answer-invalid',
      detail: 'maybe',
    });
    const open = readNeedsYouItem(world.stateRoot, IDENTITY, item.id);
    expect(open.ok && needsYouState(open.value)).toBe('open');

    const secretWorld = botWorld({ DEMO_TOKEN: 'demo-secret-value-91kq' });
    const secretItem = proposal(secretWorld, { proposalFact: 'the key is demo-secret-value-91kq' });
    expect(answerItem({ checkoutRoot: secretWorld.checkoutRoot, itemId: secretItem.id, text: 'confirm', env: secretWorld.env, actor: 'ada' })).toEqual({
      ok: false,
      reason: 'memory-secret',
      detail: 'DEMO_TOKEN',
    });
    const stillOpen = readNeedsYouItem(secretWorld.stateRoot, IDENTITY, secretItem.id);
    expect(stillOpen.ok && needsYouState(stillOpen.value)).toBe('open');
    const secretPath = botMemoryFile(secretWorld.stateRoot, IDENTITY, 'manual-ok');
    if (!secretPath.ok) throw new Error(secretPath.reason);
    expect(existsSync(secretPath.value)).toBe(false);

    const decision = writeItem(world, 'manual-ok');
    const merged = answerItem({ checkoutRoot: world.checkoutRoot, itemId: decision.id, text: 'merge', env: world.env, actor: 'ada' });
    if (!merged.ok) throw new Error(merged.reason);
    expect(merged.value.status).not.toBe('reviewed');
    expect(merged.value.kind).toBeNull();

    const confirmed = proposal(world);
    const confirmedAnswer = answerItem({ checkoutRoot: world.checkoutRoot, itemId: confirmed.id, text: 'confirm', env: world.env, actor: 'ada' });
    expect(confirmedAnswer).toMatchObject({ ok: true, value: { status: 'reviewed', kind: 'memory-proposal' } });
    const stored = readNeedsYouItem(world.stateRoot, IDENTITY, confirmed.id);
    if (!stored.ok) throw new Error(stored.reason);
    expect(stored.value.answer?.by).toBe('ada');
    expect(stored.value.answer?.scope).toBe('once');
    expect(stored.value.grants?.scope).toBe('once');
    expect(stored.value.grants?.grantedBy).toBe(stored.value.answer?.by);

    const denied = proposal(world);
    const deniedAnswer = answerItem({ checkoutRoot: world.checkoutRoot, itemId: denied.id, text: 'deny', env: world.env, actor: 'ada' });
    expect(deniedAnswer).toMatchObject({ ok: true, value: { status: 'reviewed' } });
    const deniedStored = readNeedsYouItem(world.stateRoot, IDENTITY, denied.id);
    if (!deniedStored.ok) throw new Error(deniedStored.reason);
    expect(deniedStored.value.answer?.scope).toBe('deny');

    const invalid = proposal(world);
    const cli = runCli(world, ['answer', invalid.id, 'maybe']);
    expect(cli.status).toBe(4);
    expect(cli.stderr.split('\n')[0]).toBe('bots: review-answer-invalid: maybe');
  });

  it('full file', () => {
    const world = botWorld();
    const item = proposal(world);
    const path = botMemoryFile(world.stateRoot, IDENTITY, 'manual-ok');
    if (!path.ok) throw new Error(path.reason);
    for (let index = 0; index < MEMORY_LIMITS.entries; index += 1) {
      const filled = appendMemoryEntry(path.value, {
        type: 'general',
        date: '2026-11-25',
        actor: 'ada',
        source: 'bots remember',
        text: `fact ${index}`,
      });
      if (!filled.ok) throw new Error(filled.reason);
    }
    const before = readFileSync(path.value);

    const refused = answerItem({ checkoutRoot: world.checkoutRoot, itemId: item.id, text: 'confirm', env: world.env, actor: 'ada' });
    expect(refused).toMatchObject({ ok: false, reason: 'memory-full' });
    if (refused.ok) throw new Error('expected a memory-full refusal');
    expect(refused.detail?.endsWith(' --bot manual-ok')).toBe(true);
    const open = readNeedsYouItem(world.stateRoot, IDENTITY, item.id);
    expect(open.ok && needsYouState(open.value)).toBe('open');
    expect(readFileSync(path.value).equals(before)).toBe(true);

    const rejected = proposal(world);
    const rejection = answerItem({ checkoutRoot: world.checkoutRoot, itemId: rejected.id, text: 'reject', env: world.env, actor: 'ada' });
    expect(rejection).toMatchObject({ ok: true, value: { status: 'reviewed', kind: 'memory-proposal' } });
    expect(readFileSync(path.value).equals(before)).toBe(true);

    const first = readMemoryFile(path.value).entries[0];
    expect(forgetMemoryEntry(path.value, first.id).ok).toBe(true);
    const answered = answerItem({ checkoutRoot: world.checkoutRoot, itemId: item.id, text: 'confirm', env: world.env, actor: 'ada' });
    expect(answered).toMatchObject({ ok: true, value: { status: 'reviewed' } });
    const after = readMemoryFile(path.value).entries;
    expect(after).toHaveLength(MEMORY_LIMITS.entries);
    expect(after[after.length - 1].text).toBe('Prefers ISO dates.');
  });
});
