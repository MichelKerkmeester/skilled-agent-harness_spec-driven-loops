// ───────────────────────────────────────────────────────────────────
// MODULE: Routine State Tests
// ───────────────────────────────────────────────────────────────────
//
// The state file, the until outcome and the fatigue count are proven here.

import { chmodSync, existsSync, statSync, writeFileSync } from 'node:fs';

import { afterEach, describe, expect, it } from 'vitest';

import { listNeedsYouItems, needsYouExpiry, writeNeedsYouItem } from '../lib/needs-you.js';
import {
  disabledCause,
  EMPTY_ROUTINE_STATE,
  evaluateFatigue,
  failureStreak,
  FATIGUE_QUESTION,
  readRoutineState,
  recordEnable,
  recordUntilOutcome,
  routineStateFile,
  routineSwitch,
  writeRoutineState,
} from '../lib/routine-state.js';
import { clearSwitch, readSwitch } from '../lib/switches.js';
import { writeRecord } from './status-support.js';
import { cleanupTemp, tempDir } from './support.js';

import type { NeedsYouItem } from '../lib/needs-you.js';
import type { RoutineState } from '../lib/routine-state.js';
import type { FailureClass } from '../lib/run-record.js';

afterEach(cleanupTemp);

const IDENTITY = 'local/tool';
const BOT = 'nightly-report';

/** The dispatched instant of the nth failure, one minute apart from the first. */
function failureAt(index: number): string {
  return new Date(Date.parse('2026-11-25T01:00:00.000Z') + (index - 1) * 60_000).toISOString();
}

/** A run that failed on its own, so the streak counts it. */
function failed(stateRoot: string, runId: string, dispatchedAt: string): void {
  writeRecord(stateRoot, {
    identity: IDENTITY,
    botId: BOT,
    runId,
    dispatchedAt,
    repositoryPath: tempDir('bots-repo-'),
    exit: { reason: 'error', class: 'environment', needsYouItemId: null, refusal: null },
  });
}

/** A run refused before dispatch, with the cause and class given. */
function refused(stateRoot: string, runId: string, dispatchedAt: string, cause: string, failureClass: FailureClass | null): void {
  writeRecord(stateRoot, {
    identity: IDENTITY,
    botId: BOT,
    runId,
    dispatchedAt,
    repositoryPath: tempDir('bots-repo-'),
    exit: { reason: cause, class: failureClass, needsYouItemId: null, refusal: { cause, itemId: null, detail: null } },
  });
}

/** A run that reached its outcome, so the streak stops there. */
function completed(stateRoot: string, runId: string, dispatchedAt: string): void {
  writeRecord(stateRoot, {
    identity: IDENTITY,
    botId: BOT,
    runId,
    dispatchedAt,
    repositoryPath: tempDir('bots-repo-'),
    exit: { reason: 'converged', class: null, needsYouItemId: null, refusal: null },
  });
}

/** A run that parked on a question, which is never a failure. */
function parked(stateRoot: string, runId: string, dispatchedAt: string): void {
  writeRecord(stateRoot, {
    identity: IDENTITY,
    botId: BOT,
    runId,
    dispatchedAt,
    repositoryPath: tempDir('bots-repo-'),
    exit: { reason: 'awaiting-decision', class: 'operator', needsYouItemId: runId, refusal: null },
  });
}

/** Failed runs r01 to r<count>, one minute apart, so the last one is the newest. */
function failures(stateRoot: string, count: number): void {
  for (let index = 1; index <= count; index += 1) {
    failed(stateRoot, `r${String(index).padStart(2, '0')}`, failureAt(index));
  }
}

/** Ten failed runs in a row, the fatigue threshold. */
function tenFailures(stateRoot: string): void {
  failures(stateRoot, 10);
}

/** The fatigue notice a stopped run leaves, as its writer would have written it. */
function fatigueItem(now: Date): NeedsYouItem {
  return {
    id: 'r10',
    runId: 'r10',
    botId: BOT,
    identity: IDENTITY,
    question: FATIGUE_QUESTION,
    options: null,
    createdAt: now.toISOString(),
    expiresAt: needsYouExpiry(now, 7),
    evidence: [],
    prompt: 'Write the report.',
    specFolder: null,
    answer: null,
    resumeRequestId: null,
  };
}

/** The fatigue evaluation a failed run triggers. */
function fatigue(stateRoot: string, runId: string, now: Date) {
  return evaluateFatigue({ stateRoot, identity: IDENTITY, botId: BOT, runId, prompt: 'Write the report.', expiryDays: 7, now });
}

describe('routine state', () => {
  it('reads and writes the state file at 0600', () => {
    const stateRoot = tempDir('bots-state-');
    expect(readRoutineState(stateRoot, IDENTITY, BOT)).toEqual({ state: { ...EMPTY_ROUTINE_STATE }, damaged: false });

    const state: RoutineState = {
      schemaVersion: 1,
      untilMetAt: '2026-11-25T10:00:00.000Z',
      fatiguedAt: '2026-11-25T11:00:00.000Z',
      fatigueItemId: 'r10',
      enabledAt: '2026-11-25T12:00:00.000Z',
    };
    const written = writeRoutineState(stateRoot, IDENTITY, BOT, state);
    if (!written.ok) throw new Error(written.reason);
    expect(readRoutineState(stateRoot, IDENTITY, BOT)).toEqual({ state, damaged: false });
    expect(statSync(written.value).mode & 0o777).toBe(0o600);

    // A file an older runtime left looser is repaired by the next write.
    chmodSync(written.value, 0o644);
    expect(writeRoutineState(stateRoot, IDENTITY, BOT, state).ok).toBe(true);
    expect(statSync(written.value).mode & 0o777).toBe(0o600);

    writeFileSync(written.value, '{bad');
    expect(readRoutineState(stateRoot, IDENTITY, BOT)).toEqual({ state: { ...EMPTY_ROUTINE_STATE }, damaged: true });
    writeFileSync(written.value, '{"schemaVersion":1,"extra":true}');
    expect(readRoutineState(stateRoot, IDENTITY, BOT)).toEqual({ state: { ...EMPTY_ROUTINE_STATE }, damaged: true });
  });

  it('records the until outcome', () => {
    const stateRoot = tempDir('bots-state-');
    expect(recordUntilOutcome(stateRoot, IDENTITY, BOT, true, new Date('2026-11-25T10:00:00Z')).ok).toBe(true);
    expect(readRoutineState(stateRoot, IDENTITY, BOT).state.untilMetAt).toBe('2026-11-25T10:00:00.000Z');

    // A check that did not reach its outcome writes nothing and clears nothing.
    for (const outcome of [
      'exit 1',
      'timed out',
      'cannot spawn',
    ]) {
      expect(recordUntilOutcome(stateRoot, IDENTITY, BOT, false), outcome).toEqual({ ok: true, value: null });
      expect(readRoutineState(stateRoot, IDENTITY, BOT).state.untilMetAt, outcome).toBe('2026-11-25T10:00:00.000Z');
    }
  });

  it('counts the fatigue streak and raises one item', () => {
    const stateRoot = tempDir('bots-state-');
    const now = new Date('2026-11-25T02:00:00Z');

    failures(stateRoot, 9);
    expect(failureStreak(stateRoot, IDENTITY, BOT)).toBe(9);
    expect(fatigue(stateRoot, 'r09', now)).toEqual({ ok: true, value: null });
    expect(listNeedsYouItems(stateRoot, IDENTITY, now).items).toEqual([]);

    failed(stateRoot, 'r10', failureAt(10));
    expect(failureStreak(stateRoot, IDENTITY, BOT)).toBe(10);
    expect(fatigue(stateRoot, 'r10', now)).toEqual({ ok: true, value: 'r10' });

    const items = listNeedsYouItems(stateRoot, IDENTITY, now).items;
    expect(items).toHaveLength(1);
    expect(items[0]?.item).toMatchObject({ id: 'r10', runId: 'r10', botId: BOT, question: FATIGUE_QUESTION, options: null });
    const state = readRoutineState(stateRoot, IDENTITY, BOT).state;
    expect(state.fatiguedAt).toBe(now.toISOString());
    expect(state.fatigueItemId).toBe('r10');
    expect(readSwitch(stateRoot, IDENTITY, BOT, 'disabled')).not.toBeNull();
    expect(disabledCause(state)).toBe('routine-fatigued');
    expect(routineSwitch(stateRoot, IDENTITY, BOT, state)).toBe('fatigued');

    // A parked run and a completed run each stop the count, and so does a refusal that carries a class.
    const parkedRoot = tempDir('bots-state-');
    failed(parkedRoot, 'r01', failureAt(1));
    parked(parkedRoot, 'r02', failureAt(2));
    failed(parkedRoot, 'r03', failureAt(3));
    expect(failureStreak(parkedRoot, IDENTITY, BOT)).toBe(1);

    const refusedRoot = tempDir('bots-state-');
    failed(refusedRoot, 'r01', failureAt(1));
    refused(refusedRoot, 'r02', failureAt(2), 'definition-malformed', 'author');
    failed(refusedRoot, 'r03', failureAt(3));
    expect(failureStreak(refusedRoot, IDENTITY, BOT)).toBe(1);

    const completedRoot = tempDir('bots-state-');
    failed(completedRoot, 'r01', failureAt(1));
    completed(completedRoot, 'r02', failureAt(2));
    failed(completedRoot, 'r03', failureAt(3));
    expect(failureStreak(completedRoot, IDENTITY, BOT)).toBe(1);
  });

  it('skips a refusal with no failure class', () => {
    const stateRoot = tempDir('bots-state-');
    failed(stateRoot, 'r01', failureAt(1));
    refused(stateRoot, 'r02', failureAt(2), 'precheck-silent', null);
    failed(stateRoot, 'r03', failureAt(3));
    expect(failureStreak(stateRoot, IDENTITY, BOT)).toBe(2);
  });

  it('counts only runs after enabledAt', () => {
    const stateRoot = tempDir('bots-state-');
    tenFailures(stateRoot);
    expect(recordEnable(stateRoot, IDENTITY, BOT, new Date('2026-11-25T02:00:00Z')).ok).toBe(true);
    failed(stateRoot, 'r11', '2026-11-25T03:00:00.000Z');
    expect(failureStreak(stateRoot, IDENTITY, BOT)).toBe(1);

    const freshRoot = tempDir('bots-state-');
    tenFailures(freshRoot);
    expect(readRoutineState(freshRoot, IDENTITY, BOT).state.enabledAt).toBeNull();
    expect(failureStreak(freshRoot, IDENTITY, BOT)).toBe(10);
  });

  it('repairs an interrupted write', () => {
    const now = new Date('2026-11-25T02:00:00Z');

    // Stopped after the item write: the notice is there and the state file and switch are not.
    const itemRoot = tempDir('bots-state-');
    tenFailures(itemRoot);
    expect(writeNeedsYouItem(itemRoot, fatigueItem(now)).ok).toBe(true);
    expect(existsSync(routineStateFile(itemRoot, IDENTITY, BOT))).toBe(false);
    expect(readSwitch(itemRoot, IDENTITY, BOT, 'disabled')).toBeNull();
    expect(fatigue(itemRoot, 'r10', now)).toEqual({ ok: true, value: 'r10' });
    expect(listNeedsYouItems(itemRoot, IDENTITY, now).items).toHaveLength(1);
    expect(readRoutineState(itemRoot, IDENTITY, BOT).state.fatigueItemId).toBe('r10');
    expect(readSwitch(itemRoot, IDENTITY, BOT, 'disabled')).not.toBeNull();

    // Stopped after the state file write: the switch is missing and the notice is not doubled.
    const stateRoot = tempDir('bots-state-');
    tenFailures(stateRoot);
    expect(writeNeedsYouItem(stateRoot, fatigueItem(now)).ok).toBe(true);
    expect(writeRoutineState(stateRoot, IDENTITY, BOT, { ...EMPTY_ROUTINE_STATE, fatiguedAt: now.toISOString(), fatigueItemId: 'r10' }).ok).toBe(true);
    expect(readSwitch(stateRoot, IDENTITY, BOT, 'disabled')).toBeNull();
    expect(fatigue(stateRoot, 'r10', now)).toEqual({ ok: true, value: 'r10' });
    expect(readSwitch(stateRoot, IDENTITY, BOT, 'disabled')).not.toBeNull();
    expect(listNeedsYouItems(stateRoot, IDENTITY, now).items).toHaveLength(1);

    // A second evaluation converges on the same files.
    for (const root of [itemRoot, stateRoot]) {
      const before = readRoutineState(root, IDENTITY, BOT).state;
      expect(fatigue(root, 'r10', now)).toEqual({ ok: true, value: 'r10' });
      expect(listNeedsYouItems(root, IDENTITY, now).items).toHaveLength(1);
      expect(readRoutineState(root, IDENTITY, BOT).state).toEqual(before);
    }

    // A retried enable and a retried clear are harmless.
    expect(recordEnable(stateRoot, IDENTITY, BOT, now).ok).toBe(true);
    const enabled = readRoutineState(stateRoot, IDENTITY, BOT).state;
    expect(recordEnable(stateRoot, IDENTITY, BOT, now).ok).toBe(true);
    expect(readRoutineState(stateRoot, IDENTITY, BOT).state).toEqual(enabled);
    expect(clearSwitch(stateRoot, IDENTITY, BOT, 'disabled')).toEqual({ ok: true, value: true });
    expect(clearSwitch(stateRoot, IDENTITY, BOT, 'disabled')).toEqual({ ok: true, value: false });
    expect(readSwitch(stateRoot, IDENTITY, BOT, 'disabled')).toBeNull();
  });
});
