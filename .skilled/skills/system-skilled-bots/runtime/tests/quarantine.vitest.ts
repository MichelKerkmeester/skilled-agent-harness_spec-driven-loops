// Quarantine: every request the runner refuses leaves the watched folder with its reason, and none is replayed.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { answerItem } from '../lib/answer.js';
import { enqueueFromCheckout, queueFolders, readQuarantineReasons } from '../lib/request-queue.js';
import { setSwitch } from '../lib/switches.js';
import { approveBots, botWorld, FIXTURE_BOTS, IDENTITY, runCli, stubRunCount, writeBot } from './runner-support.js';
import { drain, entries, queueOf, writeItem } from './queue-support.js';
import { cleanupTemp } from './support.js';

afterEach(cleanupTemp);

const SHARED_BOT = readFileSync(join(FIXTURE_BOTS, 'manual-ok', 'BOT.md'), 'utf8');

function sharedBot(id: string): string {
  return SHARED_BOT.replace('id: manual-ok', `id: ${id}`);
}

describe('drain quarantine', () => {
  it('quarantines a malformed definition, a failing precheck, a disabled, a paused and a held bot, and empties the watched folder', () => {
    const world = botWorld();
    writeBot(world, 'broken', '---\nid: broken\ntrigger: {kind: nope}\n---\nNever parsed.\n');
    writeBot(world, 'off-bot', sharedBot('off-bot'));
    writeBot(world, 'paused-bot', sharedBot('paused-bot'));
    writeBot(world, 'held-bot', sharedBot('held-bot'));
    setSwitch(world.stateRoot, IDENTITY, 'off-bot', 'disabled');
    setSwitch(world.stateRoot, IDENTITY, 'paused-bot', 'paused');
    const held = writeItem(world, 'held-bot');

    const sent = new Map<string, string>();
    for (const botId of ['broken', 'failing-precheck', 'off-bot', 'paused-bot', 'held-bot']) {
      const result = enqueueFromCheckout(world.checkoutRoot, { workflowId: botId, source: 'test', eventId: `evt-${botId}` }, world.env);
      if (!result.ok) throw new Error(result.reason);
      sent.set(botId, result.value.requestId);
    }

    approveBots(world);
    const drained = runCli(world, ['drain']);
    expect(drained.stderr).toBe('');
    expect(drained.status).toBe(0);
    const queue = queueOf(world);
    expect(entries(queue.inbox)).toEqual([]);
    const reasons = Object.fromEntries(readQuarantineReasons(queue).map((row) => [row.requestId, row.reason]));
    expect(reasons).toEqual({
      [sent.get('broken') as string]: 'definition-malformed',
      [sent.get('failing-precheck') as string]: 'precheck-failed',
      [sent.get('off-bot') as string]: 'disabled',
      [sent.get('paused-bot') as string]: 'paused',
      [sent.get('held-bot') as string]: 'held-needs-you',
    });
    expect(entries(queue.quarantine).filter((name) => !name.endsWith('.reason.json'))).toHaveLength(5);
    for (const requestId of sent.values()) {
      expect(drained.stdout).toContain(`${requestId} quarantined: ${reasons[requestId] as string}`);
    }
    expect(stubRunCount(world)).toBe(0);

    // Answering the held item queues its own resume run; the held request stays in quarantine and is not replayed.
    const answered = answerItem({ checkoutRoot: world.checkoutRoot, itemId: held.id, text: 'merge', env: world.env, surface: 'terminal' });
    expect(answered.ok).toBe(true);
    expect(entries(queue.inbox)).toEqual([`${answered.ok ? answered.value.requestId : ''}.json`]);
    expect(entries(queue.quarantine)).toContain(`${sent.get('held-bot') as string}.json`);
    expect(answered.ok && answered.value.requestId).not.toBe(sent.get('held-bot'));
  }, 120_000);

  it('quarantines a file that is not a request without handing it to the runner', async () => {
    const world = botWorld();
    const queue = queueFolders(world.stateRoot, IDENTITY);
    writeFileSync(join(queue.inbox, 'junk.json'), '{"not": "a request"');
    writeFileSync(join(queue.inbox, '.DS_Store'), '');
    let calls = 0;
    const report = await drain(world, {
      runBot: async () => {
        calls += 1;
        throw new Error('a malformed request must never reach the runner');
      },
    });
    if (!report.ok) throw new Error(report.reason);
    expect(calls).toBe(0);
    expect(report.value.lines.map((line) => line.reason)).toEqual(['malformed-request', 'malformed-request']);
    expect(entries(queue.inbox)).toEqual([]);
  });
});
