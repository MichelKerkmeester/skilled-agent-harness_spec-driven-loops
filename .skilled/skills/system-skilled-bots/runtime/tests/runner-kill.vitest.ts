import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runBot } from '../lib/runner.js';
import { readRunRecord } from '../lib/run-record.js';
import { identityStatePaths } from '../lib/state-root.js';
import { cleanupTemp } from './support.js';
import { botWorld, IDENTITY, startCli, stubReceipt, waitFor } from './runner-support.js';

const orphans: number[] = [];

afterEach(() => {
  for (const pid of orphans.splice(0)) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {
      // Already gone.
    }
  }
  cleanupTemp();
});

describe('a run killed mid-dispatch', () => {
  it('holds its lease while alive, then is reclaimed and closed as unknown once its owner is gone', async () => {
    const world = botWorld();
    const leases = identityStatePaths(world.stateRoot, IDENTITY).leases;
    const receipts = join(world.home, 'stub-receipts');

    const first = startCli(world, ['run', 'slow']);
    await waitFor(() => {
      try {
        return readdirSync(receipts).filter((name) => name.endsWith('.json')).length === 1;
      } catch {
        return false;
      }
    });
    const firstRunId = (readdirSync(receipts).filter((name) => name.endsWith('.json'))[0] as string).replace(/\.json$/, '');
    const stubPid = stubReceipt(world, firstRunId)?.pid;
    if (stubPid !== undefined) orphans.push(stubPid);

    // While the owner lives, a second run is refused at the lease and the first stays open.
    const concurrent = await runBot(world.input('slow'));
    expect(concurrent).toMatchObject({ kind: 'refused', cause: 'lease-held' });
    const concurrentRecord = readRunRecord(world.stateRoot, IDENTITY, concurrent.runId as string);
    expect(concurrentRecord.ok && concurrentRecord.value.record.exit.refusal?.cause).toBe('lease-held');
    expect(readRunRecord(world.stateRoot, IDENTITY, firstRunId)).toEqual({ ok: false, reason: 'record-missing' });

    const exited = new Promise<void>((done) => first.once('exit', () => done()));
    first.kill('SIGKILL');
    await exited;
    expect(readdirSync(leases).filter((name) => name.endsWith('.lock'))).toHaveLength(1);
    expect(readRunRecord(world.stateRoot, IDENTITY, firstRunId)).toEqual({ ok: false, reason: 'record-missing' });

    // The orphaned child is not the owner; the owner pid is gone, so the next run reclaims.
    writeFileSync(join(world.home, 'fast-flag'), '');
    const next = await runBot(world.input('slow'));
    expect(next.kind).toBe('completed');
    const killed = readRunRecord(world.stateRoot, IDENTITY, firstRunId);
    if (!killed.ok) throw new Error(killed.reason);
    expect(killed.value.record.exit).toMatchObject({ reason: 'unknown', class: 'environment' });
    expect(readdirSync(leases)).toEqual([]);
  }, 60_000);
});
