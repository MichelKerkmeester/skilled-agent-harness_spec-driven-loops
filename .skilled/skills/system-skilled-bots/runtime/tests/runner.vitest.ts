import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildExecutorDispatchEnv } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-audit.js';
import { parseExecutorConfig } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-config.js';
import { answerItem } from '../lib/answer.js';
import { RUN_MARKER_ENV, WORKING_PLACE_PREFIX, workingPlaceLine } from '../lib/dispatch.js';
import { appendMemoryEntry, botMemoryFile } from '../lib/memory.js';
import { listNeedsYouItems, needsYouExpiry, readNeedsYouItem, writeNeedsYouItem } from '../lib/needs-you.js';
import {
  EXIT_CODES,
  exitCodeFor,
  generationStampFile,
  leaseFile,
  leaseKey,
  runBot,
} from '../lib/runner.js';
import { postRunCausesOf, readRunRecord } from '../lib/run-record.js';
import { openResultLedger, sendResultEvent } from '../lib/result-ledger.js';
import { EMPTY_ROUTINE_STATE, FATIGUE_QUESTION, readRoutineState, writeRoutineState } from '../lib/routine-state.js';
import { setSecret } from '../lib/secrets.js';
import { skillDigest, skillFile } from '../lib/skills.js';
import { ensureIdentityState, identityStatePaths, receiptFolder, recordFile, sharedMemoryFile, sharedStatePaths } from '../lib/state-root.js';
import { readSwitch, setSwitch } from '../lib/switches.js';
import { cleanupTemp, isolatedEnv, tempDir } from './support.js';
import { approveBots, botWorld, filesUnder, FIXTURE_BOTS, IDENTITY, runCli, STUB_DIR, stubReceipt, stubRunCount, writeBot } from './runner-support.js';
import { writeRecord } from './status-support.js';

import type { CommandBuilder } from '../lib/dispatch.js';
import type { MemoryEntryInput } from '../lib/memory.js';
import type { NeedsYouItem } from '../lib/needs-you.js';
import type { RunOutcome } from '../lib/runner.js';
import type { RunRecord } from '../lib/run-record.js';
import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

function record(world: BotWorld, outcome: RunOutcome) {
  if (outcome.runId === null) throw new Error('no run id');
  const read = readRunRecord(world.stateRoot, IDENTITY, outcome.runId);
  if (!read.ok) throw new Error(read.reason);
  return read.value.record;
}

function leases(world: BotWorld): string[] {
  const dir = identityStatePaths(world.stateRoot, IDENTITY).leases;
  return existsSync(dir) ? readdirSync(dir) : [];
}

function item(world: BotWorld, overrides: Partial<NeedsYouItem> = {}): NeedsYouItem {
  const created = new Date();
  return {
    id: 'parked-1',
    runId: 'parked-1',
    botId: 'manual-ok',
    identity: IDENTITY,
    question: 'Keep the old notes?',
    options: ['keep', 'drop'],
    createdAt: created.toISOString(),
    expiresAt: needsYouExpiry(created, 7),
    evidence: [world.skilledTree],
    prompt: 'Bound spec folder: specs/demo/001-tidy.\n\nTidy the notes folder.',
    specFolder: 'specs/demo/001-tidy',
    answer: null,
    resumeRequestId: null,
    ...overrides,
  };
}

/** The item as a real answer leaves it: the answer and its grant written together, with one scope, actor and instant. */
function answeredAs(item: NeedsYouItem, text: string, extra: Partial<NeedsYouItem> = {}): NeedsYouItem {
  const answeredAt = new Date().toISOString();
  const grants = item.grants ?? null;
  return {
    ...item,
    ...extra,
    answer: { text, answeredAt, by: 'ada', scope: 'once' },
    grants: grants === null ? null : { ...grants, scope: 'once', grantedBy: 'ada', grantedAt: answeredAt },
  };
}

/**
 * A child that ignores the stub and prints a fixed answer, so a test can pin
 * what the runner reads back. `seen` captures the prompt the child was given.
 */
function speak(text: string, seen: string[] = [], exit = 0): CommandBuilder {
  return ({ prompt }) => {
    seen.push(prompt);
    return { command: process.execPath, args: ['-e', `process.stdout.write(${JSON.stringify(text)}); process.exit(${exit})`] };
  };
}

/** One memory entry, in the shape an append takes. */
function memoryEntry(text: string): MemoryEntryInput {
  return { type: 'general', date: '2026-11-25', actor: 'ada', source: 'bots remember', text };
}

/** A routine bot that runs by hand and checks its outcome with the given command. */
function routineBot(id: string, untilCheck: string): string {
  return ['---', `id: ${id}`, 'routine:', '  what: the tidy notes', '  starts:', '    - {kind: manual}', '  does: act', '  until: the notes are tidy', `  until_check: ${untilCheck}`, 'runtime: {kind: cli-codex}', 'isolation: shared', '---', 'Tidy the notes folder.', ''].join('\n');
}

describe('manual run, happy path', () => {
  it('dispatches once through the stub and leaves one terminal record pointing at its run folder', async () => {
    const world = botWorld();
    const outcome = await runBot(world.input('manual-ok'));
    expect(outcome.kind).toBe('completed');
    expect(exitCodeFor(outcome)).toBe(0);
    expect(stubRunCount(world)).toBe(1);

    const rec = record(world, outcome);
    expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).records)).toEqual([`${outcome.runId}.json`]);
    expect(rec.exit).toMatchObject({ reason: 'converged', class: null, needsYouItemId: null });
    expect(rec.posture).toEqual({ isolation: 'shared', sandbox: 'workspace-write', executorKind: 'cli-codex', model: null, apps: [], secretsUsed: [] });
    expect(rec.request.leaseNonce).toEqual(expect.any(String));
    expect(rec.request.resultEventId).toBe(`${outcome.runId}:result`);
    expect(rec.budget.measured.costUsd).toBeNull();
    expect(rec.delivery).toEqual([{ channel: 'local-only', target: 'local', state: 'not-attempted', evidence: null }]);

    const folder = rec.evidence.runFolder;
    expect(folder.startsWith(join(world.skilledTree, '.skilled', 'skills', '.state', 'system-skilled-bots'))).toBe(true);
    for (const pointer of [rec.evidence.ledgerDir, rec.evidence.observabilityStream]) {
      expect(pointer?.startsWith(folder)).toBe(true);
      expect(existsSync(pointer as string)).toBe(true);
    }
    // Receipts sit under the user-level state root, and the run folder holds none.
    expect(rec.evidence.receiptDir).toBe(receiptFolder(world.stateRoot, IDENTITY, outcome.runId as string));
    expect(readdirSync(rec.evidence.receiptDir as string).sort()).toEqual([
      `dispatch-${outcome.runId}.completion.json`,
      `dispatch-${outcome.runId}.intent.json`,
    ]);
    expect(filesUnder(folder).some((file) => file.includes('receipt'))).toBe(false);
    expect(leases(world)).toEqual([]);
  });

  it('stores a re-sent result event once, with one receipt pair and no second dispatch', async () => {
    const world = botWorld();
    const outcome = await runBot(world.input('manual-ok'));
    const rec = record(world, outcome);
    const ledger = openResultLedger({
      ledgerDir: rec.evidence.ledgerDir as string,
      authorityRoot: sharedStatePaths(world.stateRoot).authority,
      checkoutRoot: world.checkoutRoot,
    });
    if (!ledger.ok) throw new Error(ledger.reason);
    expect(await ledger.value.storedEventCount()).toBe(1);

    const again = ledger.value.prepare({ runId: outcome.runId as string, botId: 'manual-ok', reason: 'converged', class: null, needsYouItemId: null });
    const resent = await sendResultEvent(ledger.value, again);
    expect(resent).toMatchObject({ ok: true, replayed: true, attempts: 1 });
    expect(await ledger.value.storedEventCount()).toBe(1);
    expect(readdirSync(rec.evidence.receiptDir as string)).toHaveLength(2);
    expect(stubRunCount(world)).toBe(1);
  });

  it('leaves no prompt or command line in the run folder for a kind that takes its prompt on argv', async () => {
    const world = botWorld({ PLANTED_SECRET_KEY: 'not-for-the-child-8812' });
    const outcome = await runBot(world.input('claude-ok'));
    expect(outcome.kind).toBe('completed');
    const seen = stubReceipt(world, outcome.runId as string);
    // The stub got the prompt on argv, so the command line itself carries it.
    expect(seen?.prompt).toContain('CLAUDE-PROMPT-TEXT-4be0');
    const rec = record(world, outcome);
    const runFiles = filesUnder(rec.evidence.runFolder);
    expect(runFiles.length).toBeGreaterThan(2);
    for (const file of runFiles) {
      const text = readFileSync(file, 'utf8');
      expect(text, file).not.toContain('CLAUDE-PROMPT-TEXT-4be0');
      expect(text, file).not.toContain('--permission-mode');
      expect(text, file).not.toContain('not-for-the-child-8812');
    }
    // The receipts that do record the command line sit outside the run folder.
    const receipts = filesUnder(rec.evidence.receiptDir as string);
    expect(receipts).toHaveLength(2);
    expect(receipts.every((file) => !file.startsWith(rec.evidence.runFolder))).toBe(true);
  });

  it('hands the child the exemption, the spec folder, the run marker and only allowlisted keys', async () => {
    const world = botWorld({ PLANTED_SECRET_KEY: 'not-for-the-child-8812', XDG_CONFIG_HOME: '/planted/config' });
    const outcome = await runBot(world.input('manual-ok'));
    if (outcome.runId === null) throw new Error('no run');
    const seen = stubReceipt(world, outcome.runId);
    expect(seen?.prompt).toContain('AI_SESSION_CHILD=1 is set');
    expect(seen?.prompt).toContain('Bound spec folder: specs/demo/001-tidy.');
    expect(seen?.env.AI_SESSION_CHILD).toBe('1');
    expect(seen?.env[RUN_MARKER_ENV]).toBe(outcome.runId);
    expect(seen?.env.PLANTED_SECRET_KEY).toBeUndefined();
    expect(seen?.env.XDG_STATE_HOME).toBeUndefined();
    // The runner never sets the marker on itself, so no other dispatch inherits it.
    expect(process.env[RUN_MARKER_ENV]).toBeUndefined();
    const nonBot = buildExecutorDispatchEnv(parseExecutorConfig({ kind: 'cli-codex' }), { PATH: '/usr/bin' });
    expect(nonBot[RUN_MARKER_ENV]).toBeUndefined();
  });

  it('writes neither the prompt nor a planted environment value into any log it keeps', async () => {
    const world = botWorld({ PLANTED_SECRET_KEY: 'not-for-the-child-8812' });
    const outcome = await runBot(world.input('manual-ok'));
    const rec = record(world, outcome);
    const logs = [...filesUnder(rec.evidence.runFolder), ...filesUnder(identityStatePaths(world.stateRoot, IDENTITY).records)];
    expect(logs.length).toBeGreaterThan(3);
    for (const file of logs) {
      const text = readFileSync(file, 'utf8');
      expect(text, file).not.toContain('FIXTURE-PROMPT-TEXT-7f3a');
      expect(text, file).not.toContain('not-for-the-child-8812');
    }
  });

  it('spends under 2 seconds of its own work before dispatch', async () => {
    const world = botWorld();
    const outcome = await runBot(world.input('manual-ok'));
    const rows = readFileSync(record(world, outcome).evidence.observabilityStream as string, 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as { event: string; observed_at_iso: string });
    const at = (event: string) => Date.parse(rows.find((row) => row.event === event)?.observed_at_iso ?? '');
    const beforeDispatchMs = at('dispatching') - at('started');
    expect(beforeDispatchMs).toBeGreaterThanOrEqual(0);
    expect(beforeDispatchMs).toBeLessThan(2000);
  });

  it('runs the bots CLI end to end with exit 0', async () => {
    const world = botWorld();
    const run = runCli(world, ['run', 'manual-ok']);
    expect(run.status).toBe(EXIT_CODES.completed);
    expect(run.stdout).toMatch(/manual-ok run \S+ completed/);
    expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).records)).toHaveLength(1);
  });

  it('runs the until check after a completed run', async () => {
    const world = botWorld();
    writeBot(world, 'routine-met', routineBot('routine-met', 'test -d bots'));
    writeBot(world, 'routine-open', routineBot('routine-open', 'exit 1'));

    const met = await runBot(world.input('routine-met'));
    expect(met.kind).toBe('completed');
    expect(record(world, met).until).toEqual({ met: true });
    expect(typeof readRoutineState(world.stateRoot, IDENTITY, 'routine-met').state.untilMetAt).toBe('string');
    expect(readSwitch(world.stateRoot, IDENTITY, 'routine-met', 'completed')).not.toBeNull();
    expect(await runBot(world.input('routine-met'))).toMatchObject({ kind: 'refused', cause: 'routine-completed' });

    const open = await runBot(world.input('routine-open'));
    expect(open.kind).toBe('completed');
    expect(record(world, open).until).toEqual({ met: false });
    expect(readRoutineState(world.stateRoot, IDENTITY, 'routine-open').state.untilMetAt).toBeNull();
    expect(readSwitch(world.stateRoot, IDENTITY, 'routine-open', 'completed')).toBeNull();

    const plain = await runBot(world.input('manual-ok'));
    expect(plain.kind).toBe('completed');
    expect(record(world, plain).until).toBeNull();
  });

  it('completed outcome carries the answer text', async () => {
    const world = botWorld();
    const outcome = await runBot(world.input('manual-ok', { buildCommand: speak('All tidy.\n') }));
    expect(outcome.kind).toBe('completed');
    if (outcome.kind === 'completed') expect(outcome.answer).toBe('All tidy.\n');
  });

  it('completed outcome answer is the redacted copy', async () => {
    const world = botWorld();
    ensureIdentityState(world.stateRoot, IDENTITY);
    const set = setSecret({ stateRoot: world.stateRoot, identity: IDENTITY, name: 'demo', value: 'skilled-test-value-7f3a', store: 'file', setBy: 'ada' });
    if (!set.ok) throw new Error(set.reason);
    const outcome = await runBot(world.input('manual-ok', { buildCommand: speak('token skilled-test-value-7f3a end\n') }));
    expect(outcome.kind).toBe('completed');
    if (outcome.kind !== 'completed') throw new Error('expected a completed run');
    // The answer is read from the copy the post-run scan already redacted, so a value the
    // child printed never reaches the conversation that quotes it.
    expect(outcome.answer).toContain('[redacted: demo]');
    expect(outcome.answer).not.toContain('skilled-test-value-7f3a');
    expect(record(world, outcome).postRunCauses?.[0]).toMatchObject({ cause: 'secret-in-output' });
  });
});

describe('refusals before dispatch', () => {
  it('refuses disabled, paused, failing and silent prechecks with a record each and no dispatch', async () => {
    const world = botWorld();
    setSwitch(world.stateRoot, IDENTITY, 'manual-ok', 'disabled');
    setSwitch(world.stateRoot, IDENTITY, 'crash', 'paused');
    const cases: Array<[string, string, string]> = [
      ['manual-ok', 'disabled', 'disabled'],
      ['crash', 'paused', 'userPaused'],
      ['failing-precheck', 'precheck-failed', 'precheck-failed'],
      ['silent-precheck', 'precheck-silent', 'precheck-silent'],
    ];
    for (const [bot, cause, reason] of cases) {
      const outcome = await runBot(world.input(bot));
      expect(outcome).toMatchObject({ kind: 'refused', cause });
      expect(exitCodeFor(outcome)).toBe(EXIT_CODES.refused);
      expect(record(world, outcome).exit).toMatchObject({ reason, refusal: { cause } });
    }
    expect(stubRunCount(world)).toBe(0);
    expect(leases(world)).toEqual([]);
  });

  it('ends a timed-out precheck with its whole process group, a background grandchild included', async () => {
    const world = botWorld();
    const pidFile = join(world.home, 'grandchild.pid');
    writeBot(world, 'slow-precheck', [
      '---',
      'id: slow-precheck',
      'trigger: {kind: manual}',
      'runtime: {kind: cli-codex}',
      'isolation: shared',
      `precheck: "sleep 45 & echo $! > ${pidFile}; wait"`,
      '---',
      'Never dispatched: the precheck never finishes.',
      '',
    ].join('\n'));

    const outcome = await runBot(world.input('slow-precheck', { precheckTimeoutMs: 1_000 }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'precheck-failed' });
    const grandchild = Number(readFileSync(pidFile, 'utf8').trim());
    expect(grandchild).toBeGreaterThan(1);
    const alive = (): boolean => {
      try {
        process.kill(grandchild, 0);
        return true;
      } catch {
        return false;
      }
    };
    const until = Date.now() + 5_000;
    while (alive() && Date.now() < until) await new Promise((done) => setTimeout(done, 50));
    const survived = alive();
    if (survived) process.kill(grandchild, 'SIGKILL');
    expect(survived).toBe(false);
    expect(stubRunCount(world)).toBe(0);
  }, 30_000);

  it('refuses an unhonorable posture before dispatch', async () => {
    const world = botWorld();
    for (const bot of ['weak-write']) {
      const outcome = await runBot(world.input(bot));
      expect(outcome).toMatchObject({ kind: 'refused', cause: 'posture-refused' });
      expect(record(world, outcome).exit).toMatchObject({ reason: 'posture-refused', class: 'author' });
    }
    expect(stubRunCount(world)).toBe(0);
  });

  it('refuses a body that holds a secret value, naming the key only', async () => {
    const world = botWorld({ PLANTED_TOKEN: 'leaky-value-77xq9' });
    writeBot(world, 'leaky', '---\nid: leaky\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\n---\nLog in with leaky-value-77xq9.\n');
    const outcome = await runBot(world.input('leaky'));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'body-secret' });
    const rec = record(world, outcome);
    expect(rec.exit.refusal?.detail).toContain('PLANTED_TOKEN');
    expect(JSON.stringify(rec)).not.toContain('leaky-value-77xq9');
    expect(stubRunCount(world)).toBe(0);
  });

  it('refuses an unknown id without a record and a malformed definition with one', async () => {
    const world = botWorld();
    expect(await runBot(world.input('no-such-bot'))).toMatchObject({ kind: 'refused', cause: 'definition-missing', runId: null });
    writeBot(world, 'broken', '---\nid: broken\n---\nNo trigger.\n');
    const malformed = await runBot(world.input('broken'));
    expect(malformed).toMatchObject({ kind: 'refused', cause: 'definition-malformed', detail: 'missing-trigger' });
    expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).records)).toEqual([`${malformed.runId}.json`]);
  });

  it('gives a refusal and a run failure different CLI exit codes', async () => {
    const world = botWorld();
    setSwitch(world.stateRoot, IDENTITY, 'manual-ok', 'disabled');
    const refused = runCli(world, ['run', 'manual-ok']);
    const failed = runCli(world, ['run', 'crash']);
    expect(refused.status).toBe(EXIT_CODES.refused);
    expect(failed.status).toBe(EXIT_CODES.runFailure);
    expect(refused.status).not.toBe(failed.status);
  });

  it('exits 3 and dispatches nothing when the recursion guard refuses', async () => {
    const world = botWorld({ SPECKIT_CLI_DISPATCH_STACK: 'cli-codex' });
    const outcome = await runBot(world.input('manual-ok'));
    expect(outcome).toMatchObject({ kind: 'failed', class: 'hub', recursionGuard: true });
    expect(exitCodeFor(outcome)).toBe(EXIT_CODES.recursionGuard);
    expect(stubRunCount(world)).toBe(0);
  });

  it('refuses a completed routine', async () => {
    const world = botWorld();
    setSwitch(world.stateRoot, IDENTITY, 'manual-ok', 'completed');
    const done = await runBot(world.input('manual-ok'));
    expect(done).toMatchObject({ kind: 'refused', cause: 'routine-completed' });
    expect(record(world, done).exit).toMatchObject({ reason: 'routine-completed', class: null, refusal: { cause: 'routine-completed' } });
    expect(stubRunCount(world)).toBe(0);

    writeRoutineState(world.stateRoot, IDENTITY, 'crash', { ...EMPTY_ROUTINE_STATE, fatiguedAt: new Date().toISOString(), fatigueItemId: 'old-item' });
    setSwitch(world.stateRoot, IDENTITY, 'crash', 'disabled');
    expect(await runBot(world.input('crash'))).toMatchObject({ kind: 'refused', cause: 'routine-fatigued' });
    expect(stubRunCount(world)).toBe(0);

    // The disabled check reads first, and this bot has no fatigue record.
    setSwitch(world.stateRoot, IDENTITY, 'manual-ok', 'disabled');
    expect(await runBot(world.input('manual-ok'))).toMatchObject({ kind: 'refused', cause: 'disabled' });
  });
});

describe('stops during dispatch', () => {
  it('classes a stuck invocation as a timeout and a budget stop as its own class', async () => {
    const world = botWorld();
    const stuck = await runBot(world.input('stuck'));
    const overBudget = await runBot(world.input('over-budget', { minuteMs: 1500 }));
    expect(record(world, stuck).exit).toMatchObject({ reason: 'timeout', class: 'environment' });
    expect(record(world, overBudget).exit).toMatchObject({ reason: 'maxDurationReached', class: 'budget' });
    expect(leases(world)).toEqual([]);
  }, 30_000);

  it('records a child that exits non-zero as a run failure, dispatched once', async () => {
    const world = botWorld();
    const outcome = await runBot(world.input('crash'));
    expect(outcome).toMatchObject({ kind: 'failed', reason: 'crash', class: 'environment' });
    expect(stubRunCount(world)).toBe(1);
  });

  it('evaluates the fatigue rule after a failed run', async () => {
    const world = botWorld();
    const start = Date.now() - 2 * 60 * 60 * 1000;
    for (let index = 1; index <= 9; index += 1) {
      writeRecord(world.stateRoot, {
        identity: IDENTITY,
        botId: 'crash',
        runId: `old-${String(index).padStart(2, '0')}`,
        dispatchedAt: new Date(start + (index - 1) * 60_000).toISOString(),
        repositoryPath: world.checkoutRoot,
        exit: { reason: 'crash', class: 'environment', needsYouItemId: null, refusal: null },
      });
    }

    const outcome = await runBot(world.input('crash'));
    if (outcome.kind !== 'failed') throw new Error('expected a failed run');
    expect(readSwitch(world.stateRoot, IDENTITY, 'crash', 'disabled')).not.toBeNull();
    const state = readRoutineState(world.stateRoot, IDENTITY, 'crash').state;
    expect(state.fatigueItemId).toBe(outcome.runId);
    expect(typeof state.fatiguedAt).toBe('string');
    const items = listNeedsYouItems(world.stateRoot, IDENTITY).items;
    expect(items).toHaveLength(1);
    expect(items[0]?.item).toMatchObject({ botId: 'crash', id: outcome.runId, runId: outcome.runId, question: FATIGUE_QUESTION, options: null });

    expect(await runBot(world.input('crash'))).toMatchObject({ kind: 'refused', cause: 'routine-fatigued' });
    expect(stubRunCount(world)).toBe(1);
  }, 30_000);
});

describe('needs-you decisions', () => {
  it('parks a run whose child asks, writes one item, releases the lease and lists it in the inbox', async () => {
    const world = botWorld();
    const run = runCli(world, ['run', 'needs-decision']);
    expect(run.status).toBe(EXIT_CODES.awaitingDecision);
    const items = readdirSync(identityStatePaths(world.stateRoot, IDENTITY).needsYou);
    expect(items).toHaveLength(1);
    const itemId = (items[0] as string).replace(/\.json$/, '');
    const parked = readNeedsYouItem(world.stateRoot, IDENTITY, itemId);
    if (!parked.ok) throw new Error(parked.reason);
    expect(parked.value).toMatchObject({
      runId: itemId,
      botId: 'needs-decision',
      question: 'Merge the fix branch or open a PR?',
      options: ['merge', 'open a PR'],
      specFolder: 'specs/demo/002-merge',
      answer: null,
    });
    expect(parked.value.prompt).toContain('Bound spec folder: specs/demo/002-merge.');
    const rec = readRunRecord(world.stateRoot, IDENTITY, itemId);
    if (!rec.ok) throw new Error(rec.reason);
    expect(rec.value.record.exit).toMatchObject({ reason: 'awaiting-decision', class: 'operator', needsYouItemId: itemId });
    expect(leases(world)).toEqual([]);

    const inbox = runCli(world, ['inbox']);
    expect(inbox.status).toBe(0);
    expect(inbox.stdout).toContain(`open\t${itemId}\tneeds-decision`);
    expect(inbox.stdout).toContain('Merge the fix branch or open a PR?');
  });

  it('parks a Claude Code run whose stream-json result event carries the marker', async () => {
    const world = botWorld();
    const outcome = await runBot(world.input('claude-decision'));
    expect(stubRunCount(world)).toBe(1);
    expect(outcome.kind).toBe('awaiting-decision');
    if (outcome.kind !== 'awaiting-decision') throw new Error('expected a parked run');
    const parked = readNeedsYouItem(world.stateRoot, IDENTITY, outcome.itemId);
    if (!parked.ok) throw new Error(parked.reason);
    expect(parked.value).toMatchObject({ question: 'Delete the stale notes?', options: ['delete', 'keep'] });
    expect(record(world, outcome).exit).toMatchObject({ reason: 'awaiting-decision', class: 'operator' });
  });

  it('parks a read-only OpenCode run whose json text event carries the marker, with the read-only allowlist in its child', async () => {
    const world = botWorld();
    writeBot(world, 'oc-decision', '---\nid: oc-decision\ntrigger: {kind: manual}\nruntime: {kind: cli-opencode}\nisolation: shared\nsandbox: read-only\n---\nReview the notes and ask before deleting any.\nSTUB:decide=Delete the stale notes?\nSTUB:option=delete\nSTUB:option=keep\n');
    const outcome = await runBot(world.input('oc-decision'));
    expect(stubRunCount(world)).toBe(1);
    const seen = stubReceipt(world, outcome.runId as string) as { argv?: string[]; env: Record<string, string> } | null;
    // The allowlist rides in the child's inline config, at the top level and on the agent the
    // run names; argv alone would not show it.
    const readOnly = { '*': 'deny', read: 'allow', grep: 'allow', glob: 'allow', list: 'allow', external_directory: 'deny' };
    const inline = JSON.parse(seen?.env.OPENCODE_CONFIG_CONTENT ?? 'null') as { permission: Record<string, string>; agent: { build: { permission: Record<string, string> } } };
    expect(inline.permission).toEqual(readOnly);
    expect(Object.keys(inline.permission)[0]).toBe('*');
    expect(inline.agent.build.permission).toEqual(readOnly);
    const argv = seen?.argv ?? [];
    expect(argv[argv.indexOf('--agent') + 1]).toBe('build');
    expect(outcome.kind).toBe('awaiting-decision');
    if (outcome.kind !== 'awaiting-decision') throw new Error('expected a parked run');
    const parked = readNeedsYouItem(world.stateRoot, IDENTITY, outcome.itemId);
    if (!parked.ok) throw new Error(parked.reason);
    expect(parked.value).toMatchObject({ question: 'Delete the stale notes?', options: ['delete', 'keep'] });
    expect(record(world, outcome).posture).toMatchObject({ sandbox: 'read-only', executorKind: 'cli-opencode' });
  });

  it('refuses a read-only OpenCode run before dispatch when its resolved agent leaves a write action open', async () => {
    const world = botWorld();
    writeBot(world, 'oc-open', '---\nid: oc-open\ntrigger: {kind: manual}\nruntime: {kind: cli-opencode}\nisolation: shared\nsandbox: read-only\n---\nReview the notes.\n');
    // What OpenCode would resolve when a config source it orders after the inline rules re-allows the shell.
    writeFileSync(join(world.checkoutRoot, '.stub-opencode-agents.json'), JSON.stringify([
      { id: 'build', permissions: [{ action: '*', resource: '*', effect: 'deny' }, { action: 'read', resource: '*', effect: 'allow' }, { action: 'shell', resource: '*', effect: 'allow' }] },
    ]));
    const outcome = await runBot(world.input('oc-open'));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'read-only-unconfined' });
    expect(exitCodeFor(outcome)).toBe(EXIT_CODES.refused);
    expect(stubRunCount(world)).toBe(0);
    expect(record(world, outcome).exit).toMatchObject({ reason: 'read-only-unconfined', class: 'environment' });
    expect(record(world, outcome).exit.refusal?.detail).toContain('shell:*=allow');
  });

  it('parks a read-only Mistral Vibe run from a private lineage folder, with only the read tools enabled', async () => {
    const world = botWorld();
    writeBot(world, 'vibe-decision', '---\nid: vibe-decision\ntrigger: {kind: manual}\nruntime: {kind: cli-mistral-vibe, model: deepseek-flash}\nisolation: shared\nsandbox: read-only\n---\nReview the notes and ask before deleting any. VIBE-PROMPT-TEXT-5d1e\nSTUB:decide=Delete the stale notes?\nSTUB:option=delete\n');
    const outcome = await runBot(world.input('vibe-decision'));
    expect(stubRunCount(world)).toBe(1);
    const seen = stubReceipt(world, outcome.runId as string) as { argv?: string[]; cwd?: string; env: Record<string, string> } | null;
    const argv = seen?.argv ?? [];
    expect(argv.flatMap((arg, index) => (arg === '--enabled-tools' ? [argv[index + 1]] : []))).toEqual(['read_file', 'grep']);
    // The builder's lineage-local home reaches the child, and the lineage folder is gone after the run.
    expect(seen?.env.VIBE_HOME).toBe(join(seen?.cwd as string, 'vibe-home'));
    // The session-start hook would otherwise rebuild stale dist output outside any tool.
    expect(seen?.env.SPECKIT_DIST_AUTO_REBUILD).toBe('0');
    expect(existsSync(seen?.cwd as string)).toBe(false);
    // The child starts in its lineage folder, so the prompt names the checkout it reads through.
    expect((seen as { prompt?: string } | null)?.prompt).toContain(`The repository checkout is ${world.checkoutRoot}.`);
    expect(outcome.kind).toBe('awaiting-decision');
    if (outcome.kind !== 'awaiting-decision') throw new Error('expected a parked run');
    const parked = readNeedsYouItem(world.stateRoot, IDENTITY, outcome.itemId);
    if (!parked.ok) throw new Error(parked.reason);
    expect(parked.value).toMatchObject({ question: 'Delete the stale notes?', options: ['delete'] });
    const rec = record(world, outcome);
    expect(rec.posture).toMatchObject({ sandbox: 'read-only', executorKind: 'cli-mistral-vibe', model: 'deepseek-flash' });
    // The export record is kept beside the receipts, and the run folder holds no prompt.
    const exported = JSON.parse(readFileSync(join(rec.evidence.receiptDir as string, 'vibe-export.json'), 'utf8')) as { config: { enabled_tools: string[] } };
    expect(exported.config.enabled_tools).toEqual(['read_file', 'grep']);
    for (const file of filesUnder(rec.evidence.runFolder)) {
      expect(readFileSync(file, 'utf8'), file).not.toContain('VIBE-PROMPT-TEXT-5d1e');
    }
  });

  it('fails a Mistral Vibe run that exits 0 while its export record says it did not finish', async () => {
    const world = botWorld();
    writeBot(world, 'vibe-unfinished', '---\nid: vibe-unfinished\ntrigger: {kind: manual}\nruntime: {kind: cli-mistral-vibe, model: deepseek-flash}\nisolation: shared\nsandbox: read-only\n---\nReview the notes.\nSTUB:export-exit=1\n');
    const outcome = await runBot(world.input('vibe-unfinished'));
    expect(stubRunCount(world)).toBe(1);
    expect(outcome).toMatchObject({ kind: 'failed', reason: 'vibe-run-unfinished', class: 'environment' });
    expect(exitCodeFor(outcome)).toBe(EXIT_CODES.runFailure);
    const rec = record(world, outcome);
    expect(rec.exit).toMatchObject({ reason: 'vibe-run-unfinished', class: 'environment' });
    const exported = JSON.parse(readFileSync(join(rec.evidence.receiptDir as string, 'vibe-export.json'), 'utf8')) as { exit_code: number };
    expect(exported.exit_code).toBe(1);
  });

  it('still refuses OpenCode and Mistral Vibe for a write-capable posture, before dispatch', async () => {
    const world = botWorld();
    writeBot(world, 'oc-write', '---\nid: oc-write\ntrigger: {kind: manual}\nruntime: {kind: cli-opencode}\nisolation: shared\nsandbox: workspace-write\n---\nTidy the notes.\n');
    writeBot(world, 'vibe-write', '---\nid: vibe-write\ntrigger: {kind: manual}\nruntime: {kind: cli-mistral-vibe, model: deepseek-flash}\nisolation: shared\nsandbox: danger-full-access\n---\nTidy the notes.\n');
    for (const bot of ['oc-write', 'vibe-write']) {
      const outcome = await runBot(world.input(bot));
      expect(outcome).toMatchObject({ kind: 'refused', cause: 'posture-refused' });
      expect(record(world, outcome).exit.refusal?.detail).toContain('posture-unhonorable');
    }
    expect(stubRunCount(world)).toBe(0);
  });

  it('classes an empty question as an author failure and writes no item', async () => {
    const world = botWorld();
    const outcome = await runBot(world.input('decide-empty'));
    expect(outcome).toMatchObject({ kind: 'failed', reason: 'decision-marker-empty', class: 'author' });
    expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).needsYou)).toEqual([]);
  });

  it('keeps the timeout class when a marker was printed before the timeout', async () => {
    const world = botWorld();
    writeBot(world, 'ask-then-hang', '---\nid: ask-then-hang\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\nbudget: {timeoutSeconds: 1}\n---\nAsk, then hang.\nSTUB:decide=Which one?\nSTUB:sleep=30\n');
    const outcome = await runBot(world.input('ask-then-hang'));
    expect(outcome).toMatchObject({ kind: 'failed', reason: 'timeout' });
    expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).needsYou)).toEqual([]);
  }, 30_000);

  it('lists an 8-day-old item as expired without rewriting it', async () => {
    const world = botWorld();
    const created = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
    const written = writeNeedsYouItem(world.stateRoot, item(world, { createdAt: created.toISOString(), expiresAt: needsYouExpiry(created, 7) }));
    if (!written.ok) throw new Error(written.reason);
    const before = readFileSync(written.value, 'utf8');
    const inbox = runCli(world, ['inbox']);
    expect(inbox.stdout).toContain('expired\tparked-1\tmanual-ok');
    expect(readFileSync(written.value, 'utf8')).toBe(before);
    expect(JSON.parse(before).answer).toBeNull();
  });

  it('holds a bot while it has an open item, and releases the hold once answered or expired', async () => {
    const world = botWorld();
    writeNeedsYouItem(world.stateRoot, item(world));
    const held = await runBot(world.input('manual-ok'));
    expect(held).toMatchObject({ kind: 'refused', cause: 'awaiting-decision-hold', itemId: 'parked-1' });
    expect(record(world, held).exit).toMatchObject({ reason: 'blockedStop', refusal: { cause: 'awaiting-decision-hold', itemId: 'parked-1' } });
    expect(stubRunCount(world)).toBe(0);
    expect(leases(world)).toEqual([]);
    const cli = runCli(world, ['run', 'manual-ok']);
    expect(cli.status).toBe(EXIT_CODES.refused);
    expect(cli.stderr).toContain('bots inbox');

    writeNeedsYouItem(world.stateRoot, item(world, { answer: { text: 'keep', answeredAt: new Date().toISOString() } }));
    expect((await runBot(world.input('manual-ok'))).kind).toBe('completed');

    const created = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
    writeNeedsYouItem(world.stateRoot, item(world, { createdAt: created.toISOString(), expiresAt: needsYouExpiry(created, 7) }));
    expect((await runBot(world.input('manual-ok'))).kind).toBe('completed');
  });

  it('starts a resumed run from a resume request with the question, the answer and the same spec folder', async () => {
    const world = botWorld();
    approveBots(world);
    writeNeedsYouItem(world.stateRoot, item(world, { answer: { text: 'keep them', answeredAt: new Date().toISOString() } }));
    const outcome = await runBot(world.input('manual-ok', { request: { kind: 'resume', requestId: 'req-9', itemId: 'parked-1' } }));
    expect(outcome.kind).toBe('completed');
    if (outcome.runId === null) throw new Error('no run');
    expect(outcome.runId).not.toBe('parked-1');
    const rec = record(world, outcome);
    expect(rec.request).toMatchObject({ requestId: 'req-9', resumedItemId: 'parked-1' });
    expect(rec.dispatch.source).toBe('resume');
    const seen = stubReceipt(world, outcome.runId);
    expect(seen?.prompt).toContain('Question: Keep the old notes?');
    expect(seen?.prompt).toContain('Answer: keep them');
    expect(seen?.prompt).toContain('Bound spec folder: specs/demo/001-tidy.');
  });

  it('refuses a resumed run whose answer holds a secret, naming the key', async () => {
    const world = botWorld({ PLANTED_TOKEN: 'answer-secret-31xz' });
    approveBots(world);
    writeNeedsYouItem(world.stateRoot, item(world, { answer: { text: 'use answer-secret-31xz', answeredAt: new Date().toISOString() } }));
    const outcome = await runBot(world.input('manual-ok', { request: { kind: 'resume', requestId: 'req-1', itemId: 'parked-1' } }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'body-secret' });
    if (outcome.kind !== 'refused') throw new Error('expected a refusal');
    expect(outcome.detail).toContain('answer holds a literal of key PLANTED_TOKEN');
    expect(stubRunCount(world)).toBe(0);
  });

  it('writes the grant from the parked question', async () => {
    const world = botWorld();
    const outcome = await runBot(world.input('manual-ok', { buildCommand: speak('[NEEDS-DECISION] delete the stale branch?\n') }));
    expect(outcome.kind).toBe('awaiting-decision');
    if (outcome.kind !== 'awaiting-decision') throw new Error('expected a parked run');
    const parked = readNeedsYouItem(world.stateRoot, IDENTITY, outcome.itemId);
    if (!parked.ok) throw new Error(parked.reason);
    expect(parked.value.grants).toEqual({
      kind: 'delete',
      action: 'delete the stale branch?',
      rung: 'kind',
      scope: null,
      grantedBy: null,
      grantedAt: null,
    });

    // A declaration outside the seven kinds is the bot's own mistake, so the run fails and parks nothing.
    const invalidWorld = botWorld();
    const invalid = await runBot(invalidWorld.input('manual-ok', { buildCommand: speak('[NEEDS-DECISION] [ACTION: transfer] Move the balance?\n') }));
    expect(invalid).toMatchObject({ kind: 'failed', reason: 'action-kind-invalid', class: 'author' });
    expect(readdirSync(identityStatePaths(invalidWorld.stateRoot, IDENTITY).needsYou)).toEqual([]);
  }, 30_000);

  it('fills the grant on the memory-proposal branch', async () => {
    const world = botWorld();
    const outcome = await runBot(world.input('manual-ok', { buildCommand: speak('done\n[REMEMBER] user Prefers ISO dates.\n') }));
    expect(outcome.kind).toBe('completed');
    const items = listNeedsYouItems(world.stateRoot, IDENTITY).items;
    expect(items).toHaveLength(1);
    const proposal = items[0]?.item;
    if (proposal === undefined) throw new Error('no proposal');
    expect(proposal.question).toBe('Remember this fact for manual-ok: Prefers ISO dates.');
    expect(proposal.grants).toEqual({
      kind: 'other',
      action: proposal.question.slice(0, 120),
      rung: 'bot',
      scope: null,
      grantedBy: null,
      grantedAt: null,
    });
  }, 30_000);

  it('carries one grant line on the resumed record', async () => {
    const world = botWorld();
    const parked = await runBot(world.input('manual-ok', { buildCommand: speak('[NEEDS-DECISION] delete the stale branch?\n') }));
    if (parked.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${parked.kind}`);
    const itemId = parked.itemId;
    const answered = answerItem({ checkoutRoot: world.checkoutRoot, itemId, text: 'no', env: world.env, surface: 'terminal', actor: 'ada' });
    expect(answered.ok).toBe(true);

    const resumed = await runBot(world.input('manual-ok', { request: { kind: 'resume', requestId: 'rq-resume', itemId }, buildCommand: speak('done\n') }));
    expect(resumed.kind).toBe('completed');
    expect(record(world, resumed).request.grant).toEqual({ itemId, kind: 'delete', scope: 'deny', by: 'ada' });
    // A run that resumed no granted item carries no grant key at all.
    expect(record(world, parked).request).not.toHaveProperty('grant');
  }, 30_000);
});

describe('state the run cannot reach', () => {
  it('keeps switches and items out of reach of a child that tampers with everything under the checkout', async () => {
    const world = botWorld();
    setSwitch(world.stateRoot, IDENTITY, 'crash', 'disabled');
    const outcome = await runBot(world.input('tamper'));
    expect(outcome.kind).toBe('completed');
    // The child did write inside the checkout, so it had write access there.
    expect(existsSync(join(world.checkoutRoot, 'needs-you', 'forged.json'))).toBe(true);
    expect(world.stateRoot.startsWith(world.checkoutRoot)).toBe(false);
    expect(await runBot(world.input('crash'))).toMatchObject({ kind: 'refused', cause: 'disabled' });
    expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).needsYou)).toEqual([]);
  });

  it('advances the generation stamp after each record and each item, by rename', async () => {
    const world = botWorld();
    const stamp = () => JSON.parse(readFileSync(generationStampFile(world.stateRoot, IDENTITY), 'utf8')).generation as number;
    await runBot(world.input('manual-ok'));
    expect(stamp()).toBe(1);
    await runBot(world.input('crash'));
    expect(stamp()).toBe(2);
    await runBot(world.input('needs-decision'));
    expect(stamp()).toBe(4);
    const base = identityStatePaths(world.stateRoot, IDENTITY).base;
    expect(readdirSync(base).filter((name) => name.includes('.tmp'))).toEqual([]);
  });

  it('keys the lease by workflow, repository and spec target, never by a checkout path', async () => {
    const world = botWorld();
    const key = leaseKey(IDENTITY, 'manual-ok', 'specs/demo/001-tidy');
    expect(key).toBe('system-skilled-bots|acme/tool|manual-ok|specs/demo/001-tidy');
    expect(key).not.toContain(world.checkoutRoot);
    expect(leaseFile(world.stateRoot, IDENTITY, key).startsWith(identityStatePaths(world.stateRoot, IDENTITY).leases)).toBe(true);
  });
});

function makeOwnerWritable(dir: string): void {
  chmodSync(dir, statSync(dir).mode | 0o700);
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) makeOwnerWritable(join(dir, entry.name));
  }
}

describe('lineage folder cleanup', () => {
  it('completes a read-only Mistral Vibe run whose home holds a read-only folder tree, and removes the lineage folder', async () => {
    const world = botWorld();
    writeBot(world, 'vibe-locked', '---\nid: vibe-locked\ntrigger: {kind: manual}\nruntime: {kind: cli-mistral-vibe, model: deepseek-flash}\nisolation: shared\nsandbox: read-only\n---\nReview the notes.\nSTUB:readonly-tree\n');
    const outcome = await runBot(world.input('vibe-locked'));
    const seen = stubReceipt(world, outcome.runId as string) as { cwd?: string } | null;
    const lineage = seen?.cwd as string;
    try {
      expect(stubRunCount(world)).toBe(1);
      expect(outcome.kind).toBe('completed');
      expect(existsSync(lineage)).toBe(false);
    } finally {
      // A failed cleanup would leave the tree behind and break the temp-folder teardown.
      if (lineage !== undefined && existsSync(lineage)) makeOwnerWritable(lineage);
    }
  });
});

describe('working place', () => {
  const PARK_EDIT_BOT = '---\nid: park-edit\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: worktree\n---\nEdit the notes and ask before keeping them.\nSTUB:park-edit=parked.md\n';

  /** The record's evidence, read from the record file rather than from a copy in the run folder. */
  function evidenceOf(world: BotWorld, runId: string) {
    return (JSON.parse(readFileSync(recordFile(world.stateRoot, IDENTITY, runId), 'utf8')) as RunRecord).evidence;
  }

  /** The branch the checkout is on, read the way the runner reads it. */
  function checkoutBranchOf(checkoutRoot: string): string {
    return execFileSync('git', ['-C', checkoutRoot, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8', env: isolatedEnv() }).trim();
  }

  function placeLines(prompt: string): string[] {
    return prompt.split('\n').filter((entry) => entry.startsWith(WORKING_PLACE_PREFIX));
  }

  it('shared run branch', async () => {
    const world = botWorld();
    const outcome = await runBot(world.input('manual-ok'));
    expect(outcome.kind).toBe('completed');
    const runId = outcome.runId as string;
    const evidence = evidenceOf(world, runId);
    const branch = checkoutBranchOf(world.checkoutRoot);
    expect(evidence.branch).toBe(branch);
    expect(evidence.worktreePath).toBeNull();
    const line = workingPlaceLine({ path: world.checkoutRoot, branch, runFolder: evidence.runFolder });
    expect(placeLines(stubReceipt(world, runId)?.prompt ?? '')).toEqual([line]);
  });

  it('detached head', async () => {
    const world = botWorld();
    execFileSync('git', ['-C', world.checkoutRoot, 'checkout', '-q', '--detach'], { env: isolatedEnv(), stdio: 'ignore' });
    const outcome = await runBot(world.input('manual-ok'));
    expect(outcome.kind).toBe('completed');
    const runId = outcome.runId as string;
    const evidence = evidenceOf(world, runId);
    expect(evidence.branch).toBeNull();
    const line = workingPlaceLine({ path: world.checkoutRoot, branch: null, runFolder: evidence.runFolder });
    const lines = placeLines(stubReceipt(world, runId)?.prompt ?? '');
    expect(lines).toEqual([line]);
    expect(lines[0]).not.toContain(' on branch ');
  });

  it('unreadable branch', async () => {
    const realGit = execFileSync('sh', ['-c', 'command -v git'], { encoding: 'utf8' }).trim();
    const folder = tempDir('bots-git-');
    const fake = join(folder, 'git');
    writeFileSync(fake, ['#!/bin/sh', 'for a in "$@"; do [ "$a" = "--abbrev-ref" ] && exit 1; done', `exec ${realGit} "$@"`, ''].join('\n'));
    chmodSync(fake, 0o755);
    const world = botWorld({ PATH: [folder, STUB_DIR, dirname(process.execPath), '/usr/bin', '/bin'].join(':') });
    const outcome = await runBot(world.input('manual-ok'));
    // A git that cannot answer the branch question never refuses the run.
    expect(outcome.kind).toBe('completed');
    expect(stubRunCount(world)).toBe(1);
    expect(evidenceOf(world, outcome.runId as string).branch).toBeNull();
  });

  it('refusal records neither', async () => {
    const world = botWorld({ PLANTED_TOKEN: 'leaky-value-77xq9' });
    writeBot(world, 'leaky', '---\nid: leaky\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\n---\nLog in with leaky-value-77xq9.\n');
    const outcome = await runBot(world.input('leaky'));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'body-secret' });
    const evidence = evidenceOf(world, outcome.runId as string);
    expect(evidence.branch).toBeNull();
    expect(evidence.worktreePath).toBeNull();
  });

  it('parked prompt gains the line', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    writeBot(world, 'park-edit', PARK_EDIT_BOT);
    const parked = await runBot(world.input('park-edit', { senders: {} }));
    if (parked.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${parked.kind}`);
    const parkedEvidence = evidenceOf(world, parked.runId);
    const tree = parkedEvidence.worktreePath as string;
    const item = readNeedsYouItem(world.stateRoot, IDENTITY, parked.itemId);
    if (!item.ok) throw new Error(item.reason);
    // A prompt parked before the line existed carries no working-place line at all.
    const stripped = item.value.prompt.split('\n').filter((line) => !line.startsWith(WORKING_PLACE_PREFIX)).join('\n');
    expect(stripped).not.toBe(item.value.prompt);
    writeNeedsYouItem(world.stateRoot, answeredAs(item.value, 'keep it', { prompt: stripped }));

    const resumed = await runBot(world.input('park-edit', { senders: {}, request: { kind: 'resume', requestId: 'rq-resume', itemId: parked.itemId } }));
    expect(resumed.kind, JSON.stringify(resumed)).toBe('completed');
    const resumedEvidence = evidenceOf(world, resumed.runId as string);
    expect(resumedEvidence.worktreePath).toBe(tree);
    const line = workingPlaceLine({ path: tree, branch: parkedEvidence.branch, runFolder: resumedEvidence.runFolder });
    const prompt = stubReceipt(world, resumed.runId as string)?.prompt ?? '';
    expect(placeLines(prompt)).toEqual([line]);
    const lines = prompt.split('\n');
    expect(lines[lines.findIndex((entry) => entry.startsWith('Bound spec folder: ')) + 1]).toBe(line);
  }, 90_000);

  it('parked prompt same path', async () => {
    const world = botWorld();
    approveBots(world);
    const prompt = 'Bound spec folder: specs/demo/001-tidy.\n' + workingPlaceLine({ path: world.checkoutRoot, branch: 'an-old-branch', runFolder: '/old/run/folder' }) + '\n\nTidy the notes folder.';
    writeNeedsYouItem(world.stateRoot, item(world, { prompt, answer: { text: 'keep them', answeredAt: new Date().toISOString() } }));
    const outcome = await runBot(world.input('manual-ok', { request: { kind: 'resume', requestId: 'rq-resume', itemId: 'parked-1' } }));
    expect(outcome.kind).toBe('completed');
    const evidence = evidenceOf(world, outcome.runId as string);
    const line = workingPlaceLine({ path: world.checkoutRoot, branch: checkoutBranchOf(world.checkoutRoot), runFolder: evidence.runFolder });
    const seen = stubReceipt(world, outcome.runId as string)?.prompt ?? '';
    expect(placeLines(seen)).toEqual([line]);
    expect(seen).not.toContain('/old/run/folder');
    expect(seen).not.toContain('an-old-branch');
  });

  it('parked prompt another path', async () => {
    const world = botWorld();
    approveBots(world);
    const elsewhere = workingPlaceLine({ path: join(tempDir('bots-elsewhere-'), 'old-tree'), branch: 'main', runFolder: '/old/run/folder' });
    const prompt = 'Bound spec folder: specs/demo/001-tidy.\n' + elsewhere + '\n\nTidy the notes folder.';
    writeNeedsYouItem(world.stateRoot, item(world, { prompt, answer: { text: 'keep them', answeredAt: new Date().toISOString() } }));
    const outcome = await runBot(world.input('manual-ok', { request: { kind: 'resume', requestId: 'rq-resume', itemId: 'parked-1' } }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'resume-item-invalid', detail: 'the parked prompt names another working place' });
    expect(stubRunCount(world)).toBe(0);
    const written = JSON.parse(readFileSync(recordFile(world.stateRoot, IDENTITY, outcome.runId as string), 'utf8')) as RunRecord;
    expect(written.exit.reason).toBe('resume-item-invalid');
  });
});

describe('memory in a run', () => {
  it('remember', async () => {
    const world = botWorld();
    // A plain completed run first, so the remember run's exit has one to be compared with.
    const plain = await runBot(world.input('manual-ok'));
    expect(plain.kind).toBe('completed');
    const plainReason = record(world, plain).exit.reason;

    const shared = sharedMemoryFile(world.stateRoot);
    const own = botMemoryFile(world.stateRoot, IDENTITY, 'manual-ok');
    if (!own.ok) throw new Error(own.reason);
    expect(appendMemoryEntry(shared, memoryEntry('the sales sheet is Q3')).ok).toBe(true);
    expect(appendMemoryEntry(own.value, memoryEntry('keep replies short')).ok).toBe(true);

    const seen: string[] = [];
    const outcome = await runBot(world.input('manual-ok', { buildCommand: speak('done\n[REMEMBER] user Prefers ISO dates.\n', seen) }));
    expect(outcome.kind).toBe('completed');
    const runId = outcome.runId as string;

    // Both files reach the prompt, the shared one first.
    const prompt = seen[0] ?? '';
    const sharedTag = `<memory file="${shared}">`;
    const ownTag = `<memory file="${own.value}">`;
    expect(prompt).toContain(sharedTag);
    expect(prompt).toContain(ownTag);
    expect(prompt.indexOf(sharedTag)).toBeLessThan(prompt.indexOf(ownTag));

    const items = listNeedsYouItems(world.stateRoot, IDENTITY).items;
    expect(items).toHaveLength(1);
    expect(items[0]?.item).toMatchObject({
      id: runId,
      runId,
      botId: 'memory-proposals',
      kind: 'memory-proposal',
      proposalType: 'user',
      proposalFact: 'Prefers ISO dates.',
      proposalBotId: 'manual-ok',
      options: ['confirm', 'reject'],
      question: 'Remember this fact for manual-ok: Prefers ISO dates.',
      answer: null,
    });
    expect(items[0]?.item.grants).toMatchObject({ kind: 'other', rung: 'bot', scope: null });

    const rec = record(world, outcome);
    expect(rec.exit.reason).toBe(plainReason);
    expect(rec.postRunCauses).toEqual([]);

    // A run that parked a question has not finished its work, so its remember line proposes nothing.
    const parkedWorld = botWorld();
    const parked = await runBot(parkedWorld.input('manual-ok', { buildCommand: speak('[NEEDS-DECISION] Ship it?\n[REMEMBER] user Prefers ISO dates.\n') }));
    expect(parked.kind).toBe('awaiting-decision');
    const parkedItems = listNeedsYouItems(parkedWorld.stateRoot, IDENTITY).items;
    expect(parkedItems).toHaveLength(1);
    expect(parkedItems[0]?.item.kind).not.toBe('memory-proposal');

    // A failed run proposes nothing either.
    const failedWorld = botWorld();
    const failed = await runBot(failedWorld.input('manual-ok', { buildCommand: speak('[REMEMBER] user Prefers ISO dates.\n', [], 3) }));
    expect(failed.kind).toBe('failed');
    expect(listNeedsYouItems(failedWorld.stateRoot, IDENTITY).items).toEqual([]);
  });

  it('remember type', async () => {
    const world = botWorld();
    const invalid = [{ cause: 'remember-type-invalid', names: [], detail: null }];

    const untyped = await runBot(world.input('manual-ok', { buildCommand: speak('[REMEMBER] Prefers ISO dates.') }));
    expect(untyped.kind).toBe('completed');
    expect(listNeedsYouItems(world.stateRoot, IDENTITY).items).toEqual([]);
    expect(record(world, untyped).postRunCauses).toEqual(invalid);

    const unknown = await runBot(world.input('manual-ok', { buildCommand: speak('[REMEMBER] maybe Prefers ISO dates.') }));
    expect(unknown.kind).toBe('completed');
    expect(listNeedsYouItems(world.stateRoot, IDENTITY).items).toEqual([]);
    expect(record(world, unknown).postRunCauses).toEqual(invalid);

    // The first line wins, so a second one proposes nothing.
    const two = await runBot(world.input('manual-ok', { buildCommand: speak('[REMEMBER] user First fact.\n[REMEMBER] user Second fact.\n') }));
    expect(two.kind).toBe('completed');
    const items = listNeedsYouItems(world.stateRoot, IDENTITY).items;
    expect(items).toHaveLength(1);
    expect(items[0]?.item.proposalFact).toBe('First fact.');
  });

  it('proposal secret', async () => {
    const world = botWorld();
    const secret = 'ghp_abcdefghijklmnopqrstuvwx';
    const outcome = await runBot(world.input('manual-ok', { buildCommand: speak(`[REMEMBER] user the token is ${secret}`) }));
    expect(outcome.kind).toBe('completed');
    expect(listNeedsYouItems(world.stateRoot, IDENTITY).items).toEqual([]);
    expect(record(world, outcome).postRunCauses).toEqual([{ cause: 'memory-proposal-secret', names: ['ghp_'], detail: null }]);
    expect(readFileSync(recordFile(world.stateRoot, IDENTITY, outcome.runId as string), 'utf8')).not.toContain(secret);
    for (const file of filesUnder(identityStatePaths(world.stateRoot, IDENTITY).needsYou)) {
      expect(readFileSync(file, 'utf8'), file).not.toContain(secret);
    }
  });

  it('remember fact too long', async () => {
    const world = botWorld();
    const outcome = await runBot(world.input('manual-ok', { buildCommand: speak(`[REMEMBER] user ${'x'.repeat(401)}`) }));
    expect(outcome.kind).toBe('completed');
    expect(listNeedsYouItems(world.stateRoot, IDENTITY).items).toEqual([]);
    expect(record(world, outcome).postRunCauses).toEqual([{ cause: 'remember-fact-too-long', names: [], detail: '401' }]);
  });

  it('post run causes', async () => {
    const world = botWorld();
    const plain = await runBot(world.input('manual-ok'));
    expect(plain.kind).toBe('completed');
    const stored = JSON.parse(readFileSync(recordFile(world.stateRoot, IDENTITY, plain.runId as string), 'utf8')) as RunRecord;
    expect(stored).toHaveProperty('postRunCauses');
    expect(stored.postRunCauses).toEqual([]);

    // A refusal is written by the same builder, so it carries the field too.
    setSwitch(world.stateRoot, IDENTITY, 'manual-ok', 'paused');
    const refused = await runBot(world.input('manual-ok'));
    expect(refused).toMatchObject({ kind: 'refused', cause: 'paused' });
    const refusedStored = JSON.parse(readFileSync(recordFile(world.stateRoot, IDENTITY, refused.runId as string), 'utf8')) as RunRecord;
    expect(refusedStored.postRunCauses).toEqual([]);

    // A record written before the field reads as none.
    expect(postRunCausesOf({})).toEqual([]);
  });

  it('memory secret', async () => {
    const world = botWorld({ DEMO_TOKEN: 'demo-secret-value-91kq' });
    const shared = sharedMemoryFile(world.stateRoot);
    expect(appendMemoryEntry(shared, memoryEntry('the key is demo-secret-value-91kq')).ok).toBe(true);

    const refused = await runBot(world.input('manual-ok'));
    expect(refused).toMatchObject({ kind: 'refused', cause: 'body-secret' });
    if (refused.kind !== 'refused') throw new Error('expected a refusal');
    expect(refused.detail?.startsWith(`memory ${shared} holds a literal of key DEMO_TOKEN`)).toBe(true);
    expect(stubRunCount(world)).toBe(0);
    expect(readFileSync(recordFile(world.stateRoot, IDENTITY, refused.runId as string), 'utf8')).not.toContain('demo-secret-value-91kq');

    // memory: false keeps both files out of the prompt, so the same secret never reaches the check.
    const manualOk = readFileSync(join(FIXTURE_BOTS, 'manual-ok', 'BOT.md'), 'utf8');
    writeBot(world, 'memory-off', manualOk.replace('id: manual-ok', 'id: memory-off').replace('\nisolation: shared\n', '\nisolation: shared\nmemory: false\n'));
    const seen: string[] = [];
    const outcome = await runBot(world.input('memory-off', { buildCommand: speak('done\n', seen) }));
    expect(outcome.kind).toBe('completed');
    expect(seen[0] ?? '').not.toContain('<memory');
  });

  it('budget refusal', async () => {
    const world = botWorld();
    const manualOk = readFileSync(join(FIXTURE_BOTS, 'manual-ok', 'BOT.md'), 'utf8');
    const frontmatter = manualOk.slice(0, manualOk.indexOf('\n---\n') + 5);
    writeBot(world, 'long-body', `${frontmatter.replace('id: manual-ok', 'id: long-body')}Tidy.${'x'.repeat(32_500)}\n`);
    const refused = await runBot(world.input('long-body'));
    expect(refused).toMatchObject({ kind: 'refused', cause: 'prompt-over-budget' });
    if (refused.kind !== 'refused') throw new Error('expected a refusal');
    expect(refused.detail).toMatch(/^body at \d+ of 32000 characters$/);
    expect(stubRunCount(world)).toBe(0);

    // A fresh tree is finished before the refusal is written, so no record names it as active.
    const treeWorld = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    const posture = readFileSync(join(FIXTURE_BOTS, 'worktree-posture', 'BOT.md'), 'utf8');
    const postureFrontmatter = posture.slice(0, posture.indexOf('\n---\n') + 5);
    writeBot(treeWorld, 'long-tree', `${postureFrontmatter.replace('id: worktree-posture', 'id: long-tree')}${'x'.repeat(32_500)}\n`);
    const treeRefused = await runBot(treeWorld.input('long-tree', { senders: {} }));
    expect(treeRefused).toMatchObject({ kind: 'refused', cause: 'prompt-over-budget' });
    expect(record(treeWorld, treeRefused).evidence.worktree).toMatchObject({ disposition: 'removed' });

    // A resumed tree goes back to waiting with its item, so the refusal never records it as active.
    const resumeWorld = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    writeBot(resumeWorld, 'park-tree', '---\nid: park-tree\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: worktree\n---\nReview the notes and ask before deleting any.\nSTUB:decide=Delete the stale notes?\n');
    const parked = await runBot(resumeWorld.input('park-tree', { senders: {} }));
    if (parked.kind !== 'awaiting-decision') throw new Error(`expected a parked run, got ${parked.kind}`);
    const tree = record(resumeWorld, parked).evidence.worktreePath as string;
    const parkedItem = readNeedsYouItem(resumeWorld.stateRoot, IDENTITY, parked.itemId);
    if (!parkedItem.ok) throw new Error(parkedItem.reason);
    writeNeedsYouItem(resumeWorld.stateRoot, answeredAs(parkedItem.value, 'keep them', { prompt: `${parkedItem.value.prompt}\n${'x'.repeat(32_500)}` }));
    const resumed = await runBot(resumeWorld.input('park-tree', { senders: {}, request: { kind: 'resume', requestId: 'rq-budget-tree', itemId: parked.itemId } }));
    expect(resumed).toMatchObject({ kind: 'refused', cause: 'prompt-over-budget' });
    if (resumed.kind !== 'refused') throw new Error('expected a refusal');
    expect(resumed.detail?.startsWith('resume at ')).toBe(true);
    expect(record(resumeWorld, resumed).evidence.worktree).toMatchObject({ disposition: 'kept', keptReason: 'awaiting-decision' });
    expect(existsSync(tree)).toBe(true);
  }, 90_000);

  it('resume over budget', async () => {
    const world = botWorld();
    approveBots(world);
    const parked = item(world);
    writeNeedsYouItem(world.stateRoot, {
      ...parked,
      prompt: `${parked.prompt}\n${'x'.repeat(32_500)}`,
      answer: { text: 'keep them', answeredAt: new Date().toISOString() },
    });
    const outcome = await runBot(world.input('manual-ok', { request: { kind: 'resume', requestId: 'req-budget', itemId: 'parked-1' } }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'prompt-over-budget' });
    if (outcome.kind !== 'refused') throw new Error('expected a refusal');
    expect(outcome.detail?.startsWith('resume at ')).toBe(true);
    expect(stubRunCount(world)).toBe(0);
  });
});

describe('the skills load', () => {
  /** A bot that names skills, written from manual-ok so only its id and its list differ. */
  function skilledBot(world: BotWorld, id: string, skills: string): void {
    const manualOk = readFileSync(join(FIXTURE_BOTS, 'manual-ok', 'BOT.md'), 'utf8');
    writeBot(world, id, manualOk.replace('id: manual-ok', `id: ${id}`).replace('\nisolation: shared\n', `\nisolation: shared\nskills: [${skills}]\n`));
  }

  /** One SKILL.md in a world's Skilled tree, so the run reads the body from the tree it was given. */
  function writeSkill(world: BotWorld, name: string, body: string): void {
    const path = skillFile(world.skilledTree, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, body);
  }

  it('loads the named bodies before dispatch', async () => {
    const world = botWorld();
    skilledBot(world, 'skilled-ok', 'demo');
    writeSkill(world, 'demo', 'Demo skill body. SKILL-BODY-TEXT-41c2\n');
    const seen: string[] = [];
    const outcome = await runBot(world.input('skilled-ok', { buildCommand: speak('done\n', seen) }));
    expect(outcome.kind).toBe('completed');

    const prompt = seen[0] ?? '';
    const tag = '<skill_content name="demo">';
    const marker = prompt.indexOf('If you reach a decision');
    expect(prompt).toContain(tag);
    expect(prompt).toContain('SKILL-BODY-TEXT-41c2');
    // The block sits after the memory position and before the decision marker and the body.
    expect(prompt.indexOf(tag)).toBeLessThan(marker);
    expect(prompt.indexOf('SKILL-BODY-TEXT-41c2')).toBeLessThan(marker);
    expect(prompt.split('\n').at(-1)).toBe('Tidy the notes folder. FIXTURE-PROMPT-TEXT-7f3a');
  });

  it('refuses an unknown skill before dispatch', async () => {
    const world = botWorld();
    skilledBot(world, 'skilled-unknown', 'no-such-skill');
    const seen: string[] = [];
    const outcome = await runBot(world.input('skilled-unknown', { buildCommand: speak('done\n', seen) }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'skill-unknown', detail: 'no-such-skill' });
    expect(seen).toEqual([]);
    expect(record(world, outcome).exit.refusal?.cause).toBe('skill-unknown');
  });

  it('records each loaded body on the run record', async () => {
    const world = botWorld();
    skilledBot(world, 'skilled-ok', 'demo');
    writeSkill(world, 'demo', 'Demo skill body. SKILL-BODY-TEXT-41c2\n');
    const outcome = await runBot(world.input('skilled-ok'));
    expect(outcome.kind).toBe('completed');
    const rec = record(world, outcome);
    expect(rec.posture.skills).toEqual([{ name: 'demo', digest: skillDigest(readFileSync(skillFile(world.skilledTree, 'demo'))) }]);
    // The record keeps the name and the digest, never the text.
    expect(JSON.stringify(rec)).not.toContain('SKILL-BODY-TEXT-41c2');

    const plain = await runBot(world.input('manual-ok'));
    expect(plain.kind).toBe('completed');
    expect(record(world, plain).posture).not.toHaveProperty('skills');
  });
});
