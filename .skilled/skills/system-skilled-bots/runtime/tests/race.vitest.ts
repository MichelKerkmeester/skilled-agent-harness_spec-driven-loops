// Race: two drain processes released together against one request leave exactly one run, joined to it.

import { spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { enqueueFromCheckout } from '../lib/request-queue.js';
import { approveBots, botWorld, stubRunCount, waitFor } from './runner-support.js';
import { entries, queueOf, records } from './queue-support.js';
import { cleanupTemp, tempDir } from './support.js';

import type { DrainLine, DrainReport } from '../lib/request-drain.js';
import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

const ROUNDS = 50;
const RUNTIME = resolve(import.meta.dirname, '..');
const DRIVER = resolve(import.meta.dirname, 'fixtures', 'drain-race-driver.cjs');

function startDriver(world: BotWorld, readyFile: string, startFile: string): Promise<{ code: number | null; stdout: string; stderr: string }> {
  const child = spawn(process.execPath, [DRIVER, RUNTIME, world.checkoutRoot, world.skilledTree, readyFile, startFile], {
    cwd: world.checkoutRoot,
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
  return new Promise((done) => child.on('close', (code) => done({ code, stdout, stderr })));
}

function linesOf(stdout: string): DrainLine[] {
  const report = JSON.parse(stdout.trim().split('\n').at(-1) ?? '{}') as { ok: boolean; value?: DrainReport; reason?: string };
  if (!report.ok || report.value === undefined) throw new Error(`drain refused: ${report.reason ?? stdout}`);
  return report.value.lines;
}

describe('drain race', () => {
  it(`leaves exactly one run record joined to the request in each of ${ROUNDS} rounds`, async () => {
    const world = botWorld();
    approveBots(world);
    const signals = tempDir('bots-race-');
    let lostClaims = 0;

    for (let round = 0; round < ROUNDS; round += 1) {
      const firedSlot = `2026-11-23T${String(round % 24).padStart(2, '0')}:00:00Z`;
      const sent = enqueueFromCheckout(
        world.checkoutRoot,
        { workflowId: 'manual-ok', source: 'test', eventId: `race-${round}`, firedSlot },
        world.env,
      );
      if (!sent.ok) throw new Error(sent.reason);
      const requestId = sent.value.requestId;

      const start = join(signals, `start-${round}`);
      const ready = [join(signals, `ready-${round}-a`), join(signals, `ready-${round}-b`)];
      const runs = ready.map((file) => startDriver(world, file, start));
      await waitFor(() => ready.every((file) => existsSync(file)), 60_000);
      writeFileSync(start, 'go');
      const results = await Promise.all(runs);
      for (const result of results) expect(result.code, result.stderr).toBe(0);

      const lines = results.flatMap((result) => linesOf(result.stdout));
      expect(lines.filter((line) => line.outcome === 'ran')).toMatchObject([{ requestId }]);
      if (lines.some((line) => line.outcome === 'lost-claim' && line.requestId === requestId)) lostClaims += 1;

      const joined = records(world).filter((record) => record.request.requestId === requestId);
      expect(joined).toHaveLength(1);
      expect(joined[0]?.request.leaseNonce).toEqual(expect.any(String));
      expect(joined[0]?.request.resultEventId).toEqual(expect.any(String));
      expect(joined[0]?.request.firedSlot).toBe(firedSlot);
      expect(records(world)).toHaveLength(round + 1);
      expect(entries(queueOf(world).inbox)).toEqual([]);
    }

    expect(stubRunCount(world)).toBe(ROUNDS);
    // The barrier makes both drains list the request before either claims it in most rounds;
    // without it the loser usually finds an empty folder and the rename race is never exercised.
    console.log(`drain race: lost claim reported in ${lostClaims} of ${ROUNDS} rounds`);
    expect(lostClaims).toBeGreaterThan(ROUNDS / 2);
  }, 900_000);
});
