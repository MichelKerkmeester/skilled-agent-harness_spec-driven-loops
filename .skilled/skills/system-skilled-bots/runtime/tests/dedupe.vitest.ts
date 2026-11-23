// Dedupe: one source event sent twice with a changed payload runs once.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { botWorld, runCli, stubRunCount } from './runner-support.js';
import { entries, queueOf, records } from './queue-support.js';
import { cleanupTemp } from './support.js';

afterEach(cleanupTemp);

describe('enqueue dedupe', () => {
  it('prints duplicate for the second send of one event and leaves one run record after drain', () => {
    const world = botWorld();
    const first = runCli(world, ['enqueue', 'manual-ok', '--source', 'webhook', '--event-id', 'evt-42', '--prompt', 'first payload']);
    const second = runCli(world, ['enqueue', 'manual-ok', '--source', 'webhook', '--event-id', 'evt-42', '--prompt', 'changed payload']);
    expect(first.status).toBe(0);
    expect(first.stdout).toMatch(/^bots: enqueued rq-[0-9a-f]{32}$/m);
    expect(second.status).toBe(0);
    const requestId = /rq-[0-9a-f]{32}/.exec(first.stdout)?.[0];
    expect(second.stdout).toBe(`bots: duplicate ${requestId}\n`);
    expect(entries(queueOf(world).inbox)).toEqual([`${requestId}.json`]);

    const drained = runCli(world, ['drain']);
    expect(drained.status).toBe(0);
    expect(drained.stdout).toBe(`${requestId} ran\n`);
    const all = records(world);
    expect(all).toHaveLength(1);
    expect(all[0]?.request.requestId).toBe(requestId);
    expect(stubRunCount(world)).toBe(1);
  }, 120_000);

  it('takes a free-text value that starts with a dash, and still refuses a missing value', () => {
    const world = botWorld();
    const run = runCli(world, ['enqueue', 'manual-ok', '--source', 'manual', '--event-id', '1', '--prompt', '- fix the lint warnings']);
    expect(run.status, run.stderr).toBe(0);
    const [name] = entries(queueOf(world).inbox);
    const stored = JSON.parse(readFileSync(join(queueOf(world).inbox, name as string), 'utf8')) as { prompt: string };
    expect(stored.prompt).toBe('- fix the lint warnings');

    const missing = runCli(world, ['enqueue', 'manual-ok', '--source', 'manual', '--event-id', '2', '--prompt']);
    expect(missing.status).toBe(2);
    expect(missing.stderr).toContain('option --prompt needs a value');
    // An option that is not free text keeps the old rule: a dash-led value is a missing value.
    const dashed = runCli(world, ['enqueue', 'manual-ok', '--source', '-manual', '--event-id', '3']);
    expect(dashed.status).toBe(2);
    expect(dashed.stderr).toContain('option --source needs a value');
    expect(entries(queueOf(world).inbox)).toHaveLength(1);
  });

  it('rejects an enqueue with no event id or key as a usage error', () => {
    const world = botWorld();
    const run = runCli(world, ['enqueue', 'manual-ok', '--source', 'webhook']);
    expect(run.status).toBe(2);
    expect(entries(queueOf(world).inbox)).toEqual([]);
  });
});
