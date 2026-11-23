// Queued run: a drained request's own prompt reaches the run, and its run record is written once, by the runner.

import { readFileSync, statSync } from 'node:fs';

import { afterEach, describe, expect, it } from 'vitest';

import { enqueueFromCheckout } from '../lib/request-queue.js';
import { generationStampFile, runBot } from '../lib/runner.js';
import { recordFile } from '../lib/state-root.js';
import { botWorld, IDENTITY, stubReceipt, stubRunCount } from './runner-support.js';
import { drain, entries, queueOf, records } from './queue-support.js';
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
});
