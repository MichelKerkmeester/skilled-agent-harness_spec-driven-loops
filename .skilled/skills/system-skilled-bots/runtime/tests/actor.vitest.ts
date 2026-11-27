// ───────────────────────────────────────────────────────────────────
// MODULE: Actor Tests
// ───────────────────────────────────────────────────────────────────
//
// The actor is a name and nothing else, so these tests pin the three
// sources it can come from and the two ways a record can carry it. A
// record written before records named anyone must read back as null
// rather than as a guess, and a shell that exports the pinned variable
// must never claim the operator's name.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { normalizeActor, osActor, PINNED_OPERATOR_ENV, resolveActor, sameActor } from '../lib/actor.js';
import { SCHEDULED_FIRE_ENV } from '../lib/plist-render.js';
import { readRunRecord, writeRunRecord } from '../lib/run-record.js';
import { runBot } from '../lib/runner.js';
import { approveBots, botWorld, IDENTITY } from './runner-support.js';
import { cleanupTemp, tempDir } from './support.js';

import type { RunRecord } from '../lib/run-record.js';

afterEach(cleanupTemp);

/** The contract fixture every record shape is checked against. */
const FIXTURE_RECORD = resolve(
  import.meta.dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  'specs/system-skilled-bots/003-openbot-parity-build/contracts/fixtures/run-record.additions.json',
);

/** A fresh copy of the fixture, so no row can change another row's record. */
function fixtureRecord(): RunRecord {
  return JSON.parse(readFileSync(FIXTURE_RECORD, 'utf8')) as RunRecord;
}

/** Write one record into a fresh state root and read it back. */
function roundTrip(record: RunRecord): RunRecord {
  const stateRoot = tempDir();
  record.evidence.runFolder = tempDir();
  const written = writeRunRecord(stateRoot, record);
  if (!written.ok) throw new Error(written.reason);
  const read = readRunRecord(stateRoot, record.identity.repository, record.identity.runId);
  if (!read.ok) throw new Error(read.reason);
  return read.value.record;
}

/** Resolve an explicit name that must be refused, and return the refusal. */
function refusal(value: string): { ok: false; reason: string; detail?: string } {
  const resolved = resolveActor({ as: value, env: {}, scheduled: false });
  if (resolved.ok) throw new Error(`expected a refusal for ${JSON.stringify(value)}`);
  return resolved;
}

type ActorSource = 'explicit' | 'pinned' | 'os';
type RecordAge = 'written now' | 'written before';

const MATRIX: Array<[string, ActorSource, boolean, RecordAge]> = [
  ['explicit interactive written now', 'explicit', false, 'written now'],
  ['explicit interactive written before', 'explicit', false, 'written before'],
  ['explicit scheduled written now', 'explicit', true, 'written now'],
  ['explicit scheduled written before', 'explicit', true, 'written before'],
  ['pinned interactive written now', 'pinned', false, 'written now'],
  ['pinned interactive written before', 'pinned', false, 'written before'],
  ['pinned scheduled written now', 'pinned', true, 'written now'],
  ['pinned scheduled written before', 'pinned', true, 'written before'],
  ['os interactive written now', 'os', false, 'written now'],
  ['os interactive written before', 'os', false, 'written before'],
  ['os scheduled written now', 'os', true, 'written now'],
  ['os scheduled written before', 'os', true, 'written before'],
];

describe('actor', () => {
  it.each(MATRIX)('resolves %s', (label, source, scheduled, age) => {
    const as = source === 'explicit' ? 'ada' : null;
    const env: NodeJS.ProcessEnv = source === 'pinned' ? { [PINNED_OPERATOR_ENV]: 'ops' } : {};
    const resolved = resolveActor({ as, env, scheduled, osUser: () => 'osuser' });
    if (!resolved.ok) throw new Error(resolved.reason);
    const expected = source === 'explicit' ? 'ada' : source === 'pinned' && scheduled ? 'ops' : 'osuser';
    expect(resolved.value, label).toBe(expected);

    const record = fixtureRecord();
    if (age === 'written now') {
      record.actor = resolved.value;
      expect(roundTrip(record).actor, label).toBe(expected);
      return;
    }

    // A record written before records named anyone carries neither key.
    delete record.actor;
    delete record.answeredBy;
    const read = roundTrip(record);
    expect(read.actor, label).toBeNull();
    expect(read.answeredBy, label).toBeNull();
  });

  it('pinned', async () => {
    // A shell that exports the variable cannot claim the operator's name.
    expect(resolveActor({ env: { [PINNED_OPERATOR_ENV]: 'ops' }, scheduled: false, osUser: () => 'osuser' })).toEqual({
      ok: true,
      value: 'osuser',
    });
    expect(resolveActor({ env: { [PINNED_OPERATOR_ENV]: 'ops' }, scheduled: true, osUser: () => 'osuser' })).toEqual({
      ok: true,
      value: 'ops',
    });
    // A pinned value that fails the pattern is ignored rather than stored.
    expect(resolveActor({ env: { [PINNED_OPERATOR_ENV]: 'a/b' }, scheduled: true, osUser: () => 'osuser' })).toEqual({
      ok: true,
      value: 'osuser',
    });

    const world = botWorld();
    approveBots(world);
    const fired = await runBot(
      world.input('manual-ok', {
        env: { ...world.env, [PINNED_OPERATOR_ENV]: 'ops', [SCHEDULED_FIRE_ENV]: '1' },
        request: { kind: 'scheduled', scheduleIndex: 0 },
      }),
    );
    // The bot has no cron trigger, so the fire is refused before dispatch and still writes its record.
    expect(fired.kind).toBe('refused');
    if (fired.runId === null) throw new Error('no run id');
    const firedRecord = readRunRecord(world.stateRoot, IDENTITY, fired.runId);
    if (!firedRecord.ok) throw new Error(firedRecord.reason);
    expect(firedRecord.value.record.actor).toBe('ops');

    const manual = await runBot(world.input('manual-ok'));
    expect(manual.kind).toBe('completed');
    if (manual.runId === null) throw new Error('no run id');
    const manualRecord = readRunRecord(world.stateRoot, IDENTITY, manual.runId);
    if (!manualRecord.ok) throw new Error(manualRecord.reason);
    expect(manualRecord.value.record.actor).toBe(osActor());
  });

  describe('adversarial', () => {
    it('refuses an empty name', () => {
      expect(refusal('')).toMatchObject({ reason: 'actor-invalid' });
      expect(normalizeActor('')).toBeNull();
    });

    it('refuses a name holding a slash', () => {
      expect(refusal('a/b')).toMatchObject({ reason: 'actor-invalid' });
      expect(normalizeActor('a/b')).toBeNull();
      // Case is significant, and surrounding whitespace is forgiven.
      expect(sameActor('Ada', 'ada')).toBe(false);
      expect(sameActor(' ada ', 'ada')).toBe(true);
    });

    it('refuses a name holding two dots', () => {
      expect(refusal('..')).toMatchObject({ reason: 'actor-invalid' });
      expect(normalizeActor('..')).toBeNull();
    });

    it('refuses a name over 64 characters', () => {
      const long = 'a'.repeat(65);
      expect(refusal(long)).toMatchObject({ reason: 'actor-invalid' });
      expect(normalizeActor(long)).toBeNull();
    });

    it('refuses a name holding a newline', () => {
      expect(refusal('ada\nbob')).toMatchObject({ reason: 'actor-invalid' });
      expect(normalizeActor('ada\nbob')).toBeNull();
    });
  });
});
