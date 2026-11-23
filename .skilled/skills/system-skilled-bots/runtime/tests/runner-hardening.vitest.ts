import { chmodSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { readNeedsYouItem } from '../lib/needs-you.js';
import { exitCodeFor, EXIT_CODES, leaseFile, leaseKey, runBot } from '../lib/runner.js';
import { readRunRecord } from '../lib/run-record.js';
import { identityStatePaths } from '../lib/state-root.js';
import { cleanupTemp } from './support.js';
import { botWorld, IDENTITY, stubRunCount } from './runner-support.js';

import type { BotWorld } from './runner-support.js';

// The item writer can be made to refuse or to throw, so a test reaches the
// two failure paths a real run only meets on a damaged state root.
const control = vi.hoisted(() => ({ mode: 'real' as 'real' | 'refuse' | 'throw', sendFails: false }));

vi.mock('../lib/result-ledger.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/result-ledger.js')>();
  return {
    ...actual,
    sendResultEvent: (...args: Parameters<typeof actual.sendResultEvent>) =>
      control.sendFails
        ? Promise.resolve({ ok: false as const, reason: 'append: APPEND_FAILED', attempts: 3 })
        : actual.sendResultEvent(...args),
  };
});

vi.mock('../lib/needs-you.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/needs-you.js')>();
  return {
    ...actual,
    writeNeedsYouItem: (...args: Parameters<typeof actual.writeNeedsYouItem>) => {
      if (control.mode === 'refuse') return { ok: false as const, reason: 'item-field-invalid', detail: 'question' };
      if (control.mode === 'throw') throw new Error('item writer broke');
      return actual.writeNeedsYouItem(...args);
    },
  };
});

afterEach(() => {
  control.mode = 'real';
  control.sendFails = false;
  cleanupTemp();
});

function records(world: BotWorld): string[] {
  return readdirSync(identityStatePaths(world.stateRoot, IDENTITY).records);
}

function leaseFiles(world: BotWorld): string[] {
  const dir = identityStatePaths(world.stateRoot, IDENTITY).leases;
  return existsSync(dir) ? readdirSync(dir) : [];
}

describe('runner hardening', () => {
  it('closes a run that throws right after taking its lease with one record, and releases the lease', async () => {
    const world = botWorld();
    // The first run creates the state folders; a directory where the lease side file goes
    // then makes the write after the lease throw.
    expect((await runBot(world.input('manual-ok'))).kind).toBe('completed');
    const lease = leaseFile(world.stateRoot, IDENTITY, leaseKey(IDENTITY, 'manual-ok', 'specs/demo/001-tidy'));
    mkdirSync(`${lease}.run.json`);
    const outcome = await runBot(world.input('manual-ok'));
    expect(outcome).toMatchObject({ kind: 'failed', reason: 'runner-error', class: 'environment' });
    const read = readRunRecord(world.stateRoot, IDENTITY, outcome.runId as string);
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.record.exit).toMatchObject({ reason: 'runner-error', class: 'environment' });
    expect(leaseFiles(world).filter((name) => name.endsWith('.lock'))).toEqual([]);
    expect(stubRunCount(world)).toBe(1);
  });

  it('keeps the parked item traceable when the result event of a parked run cannot be recorded', async () => {
    const world = botWorld();
    control.sendFails = true;
    const outcome = await runBot(world.input('needs-decision'));
    expect(outcome).toMatchObject({ kind: 'failed', reason: 'result-event-unrecorded', class: 'hub' });
    const read = readRunRecord(world.stateRoot, IDENTITY, outcome.runId as string);
    if (!read.ok) throw new Error(read.reason);
    // The item still holds the bot, so the failed exit names it.
    expect(read.value.record.exit).toMatchObject({ reason: 'result-event-unrecorded', needsYouItemId: outcome.runId });
    expect(readNeedsYouItem(world.stateRoot, IDENTITY, outcome.runId as string).ok).toBe(true);
  });

  it('holds a bot whose needs-you folder cannot be listed, without dispatch', async () => {
    const world = botWorld();
    expect((await runBot(world.input('manual-ok'))).kind).toBe('completed');
    const folder = identityStatePaths(world.stateRoot, IDENTITY).needsYou;
    chmodSync(folder, 0o000);
    try {
      const held = await runBot(world.input('manual-ok'));
      expect(held).toMatchObject({ kind: 'refused', cause: 'needs-you-unlistable' });
      expect(exitCodeFor(held)).toBe(EXIT_CODES.refused);
    } finally {
      chmodSync(folder, 0o700);
    }
    expect(stubRunCount(world)).toBe(1);
  });

  it('ends a parked run as a hub failure when its item is refused, never pointing at a missing item', async () => {
    const world = botWorld();
    control.mode = 'refuse';
    const outcome = await runBot(world.input('needs-decision'));
    expect(outcome).toMatchObject({ kind: 'failed', class: 'hub', reason: 'needs-you-item-refused:item-field-invalid' });
    expect(exitCodeFor(outcome)).toBe(EXIT_CODES.runFailure);
    const read = readRunRecord(world.stateRoot, IDENTITY, outcome.runId as string);
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.record.exit).toMatchObject({ class: 'hub', needsYouItemId: null });
    expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).needsYou)).toEqual([]);
  });

  it('closes a run that throws with exactly one record and releases its lease', async () => {
    const world = botWorld();
    control.mode = 'throw';
    const outcome = await runBot(world.input('needs-decision'));
    expect(outcome).toMatchObject({ kind: 'failed', reason: 'runner-error', class: 'hub' });
    expect(records(world)).toEqual([`${outcome.runId}.json`]);
    const read = readRunRecord(world.stateRoot, IDENTITY, outcome.runId as string);
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.record.exit).toMatchObject({ reason: 'runner-error', class: 'hub' });
    expect(leaseFiles(world)).toEqual([]);
    expect(stubRunCount(world)).toBe(1);
  });

  it('holds a bot on a needs-you item that does not read, without dispatch', async () => {
    const world = botWorld();
    const folder = identityStatePaths(world.stateRoot, IDENTITY).needsYou;
    // A first run creates the state folders; then a damaged item lands beside them.
    expect((await runBot(world.input('manual-ok'))).kind).toBe('completed');
    writeFileSync(join(folder, 'damaged-1.json'), '{ broken');
    const held = await runBot(world.input('manual-ok'));
    expect(held).toMatchObject({ kind: 'refused', cause: 'needs-you-unreadable', itemId: 'damaged-1' });
    expect(exitCodeFor(held)).toBe(EXIT_CODES.refused);
    expect(stubRunCount(world)).toBe(1);
    expect(leaseFiles(world)).toEqual([]);
  });

  it('fails a run whose result event cannot be recorded, with one record and no lease', async () => {
    const world = botWorld();
    control.sendFails = true;
    const outcome = await runBot(world.input('manual-ok'));
    expect(outcome).toMatchObject({ kind: 'failed', reason: 'result-event-unrecorded', class: 'hub' });
    expect(records(world)).toEqual([`${outcome.runId}.json`]);
    const read = readRunRecord(world.stateRoot, IDENTITY, outcome.runId as string);
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.record.request.resultEventId).toBeNull();
    expect(leaseFiles(world)).toEqual([]);
    expect(stubRunCount(world)).toBe(1);
  });
});
