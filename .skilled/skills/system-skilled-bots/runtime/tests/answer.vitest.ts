// bots answer: the answer is recorded before one resume request keyed by the item, and the item can expire.

import { existsSync, readFileSync } from 'node:fs';

import { afterEach, describe, expect, it } from 'vitest';

import { answerItem } from '../lib/answer.js';
import { needsYouState, readNeedsYouItem } from '../lib/needs-you.js';
import { generationStampFile, runBot } from '../lib/runner.js';
import { botWorld, IDENTITY, runCli } from './runner-support.js';
import { entries, queueOf, records, writeItem } from './queue-support.js';
import { cleanupTemp, writeConfig } from './support.js';

import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

const DAY_MS = 24 * 60 * 60 * 1000;

function generation(world: BotWorld): number {
  const path = generationStampFile(world.stateRoot, IDENTITY);
  return existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as { generation: number }).generation : 0;
}

async function parkedItemId(world: BotWorld): Promise<string> {
  const parked = await runBot(world.input('needs-decision'));
  if (parked.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${parked.kind}`);
  return parked.itemId;
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
});
