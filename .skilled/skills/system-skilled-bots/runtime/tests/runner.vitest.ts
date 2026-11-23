import { chmodSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildExecutorDispatchEnv } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-audit.js';
import { parseExecutorConfig } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-config.js';
import { RUN_MARKER_ENV } from '../lib/dispatch.js';
import { needsYouExpiry, readNeedsYouItem, writeNeedsYouItem } from '../lib/needs-you.js';
import {
  EXIT_CODES,
  exitCodeFor,
  generationStampFile,
  leaseFile,
  leaseKey,
  runBot,
} from '../lib/runner.js';
import { readRunRecord } from '../lib/run-record.js';
import { openResultLedger, sendResultEvent } from '../lib/result-ledger.js';
import { identityStatePaths, receiptFolder, sharedStatePaths } from '../lib/state-root.js';
import { setSwitch } from '../lib/switches.js';
import { cleanupTemp } from './support.js';
import { botWorld, filesUnder, IDENTITY, runCli, stubReceipt, stubRunCount, writeBot } from './runner-support.js';

import type { NeedsYouItem } from '../lib/needs-you.js';
import type { RunOutcome } from '../lib/runner.js';
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
    expect(rec.posture).toEqual({ isolation: 'shared', sandbox: 'workspace-write', executorKind: 'cli-codex', model: null });
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
    writeNeedsYouItem(world.stateRoot, item(world, { answer: { text: 'use answer-secret-31xz', answeredAt: new Date().toISOString() } }));
    const outcome = await runBot(world.input('manual-ok', { request: { kind: 'resume', requestId: 'req-1', itemId: 'parked-1' } }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'body-secret' });
    if (outcome.kind !== 'refused') throw new Error('expected a refusal');
    expect(outcome.detail).toContain('answer holds a literal of key PLANTED_TOKEN');
    expect(stubRunCount(world)).toBe(0);
  });
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
