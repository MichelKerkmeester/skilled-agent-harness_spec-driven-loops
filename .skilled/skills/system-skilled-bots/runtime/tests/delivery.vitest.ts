// ───────────────────────────────────────────────────────────────────
// MODULE: Delivery Tests
// ───────────────────────────────────────────────────────────────────
//
// Every send goes to a stub sender that counts its calls. No test reaches
// the real desktop channel, so no notice is ever shown.

import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, symlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createDesktopSender, deliverRecord, NO_SEND_ENTRY, resolveDeliveryEntries } from '../lib/delivery.js';
import { readRunRecord, writeRunRecord } from '../lib/run-record.js';
import { runBot } from '../lib/runner.js';
import { deliveryClaimFolder, generationStampFile, recordFile } from '../lib/state-root.js';
import { cleanupTemp, tempDir, writeConfig } from './support.js';
import { botWorld, IDENTITY, writeBot } from './runner-support.js';

import type { DeliveryMessage, DeliverySenders, SendResult } from '../lib/delivery.js';
import type { RunExit, RunRecord } from '../lib/run-record.js';
import type { BotWorld } from './runner-support.js';

afterEach(cleanupTemp);

const HALF_PROVISIONED_STUB = resolve(import.meta.dirname, 'fixtures', 'naming-stub', 'half-provisioned.sh');

const completed: RunExit = { reason: 'converged', class: null, needsYouItemId: null, refusal: null };
const failed: RunExit = { reason: 'error', class: 'author', needsYouItemId: null, refusal: null };

/** A stub desktop sender that records every message and answers as told. */
function stubSender(answer: () => SendResult) {
  const messages: DeliveryMessage[] = [];
  const senders: DeliverySenders = {
    desktop: (message) => {
      messages.push(message);
      return answer();
    },
  };
  return { messages, senders };
}

function recordOf(world: BotWorld, runId: string | null): RunRecord {
  const read = readRunRecord(world.stateRoot, IDENTITY, runId as string);
  if (!read.ok) throw new Error(read.reason);
  return read.value.record;
}

function bot(id: string, delivery: string, stub = ''): string {
  return `---\nid: ${id}\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: ${delivery}\n---\nReport on the notes folder.\n${stub}`;
}

describe('target resolution', () => {
  it('writes not-attempted for local-only, an empty list and a refusal that is not a failure', () => {
    expect(resolveDeliveryEntries({ mode: 'local-only' }, completed)).toEqual([NO_SEND_ENTRY]);
    expect(resolveDeliveryEntries({ mode: 'targets', targets: [], onFailure: null }, completed)).toEqual([NO_SEND_ENTRY]);
    const paused: RunExit = { reason: 'userPaused', class: null, needsYouItemId: null, refusal: { cause: 'paused', itemId: null, detail: null } };
    expect(resolveDeliveryEntries({ mode: 'targets', targets: ['desktop'], onFailure: null }, paused)).toEqual([NO_SEND_ENTRY]);
    expect(resolveDeliveryEntries(null, failed)).toEqual([NO_SEND_ENTRY]);
  });

  it('picks the failure override on a failed run and the target list otherwise', () => {
    const delivery = { mode: 'targets' as const, targets: ['desktop:team'], onFailure: ['desktop:oncall', 'desktop:oncall'] };
    expect(resolveDeliveryEntries(delivery, failed)).toEqual([{ channel: 'desktop', target: 'desktop:oncall', state: 'queued', evidence: null }]);
    expect(resolveDeliveryEntries(delivery, completed)).toEqual([{ channel: 'desktop', target: 'desktop:team', state: 'queued', evidence: null }]);
    expect(resolveDeliveryEntries({ mode: 'targets', targets: ['slack:ops'], onFailure: null }, completed)).toEqual([
      { channel: 'slack', target: 'slack:ops', state: 'not-attempted', evidence: 'channel-unsupported' },
    ]);
  });
});

describe('desktop channel', () => {
  // An absolute stub path, so no test can resolve the real osascript.
  const STUB = resolve(import.meta.dirname, 'fixtures', 'osascript-stub', 'osascript');

  it('hands title and body over as separate arguments and claims only attempted', () => {
    const log = `${tempDir('bots-osa-')}/argv.log`;
    process.env.OSASCRIPT_STUB_LOG = log;
    process.env.OSASCRIPT_STUB_EXIT = '0';
    try {
      const sent = createDesktopSender(STUB)({ channel: 'desktop', target: 'desktop', title: 'Skilled bot x', body: 'Run r1: "quoted" & done' });
      expect(sent).toEqual({ outcome: 'attempted', evidence: 'osascript exit 0' });
      const argv = readFileSync(log, 'utf8').split('\n--\n').filter((entry) => entry !== '');
      expect(argv.slice(-2)).toEqual(['Skilled bot x', 'Run r1: "quoted" & done']);
      expect(argv.join(' ')).not.toContain('"quoted" & done"');

      process.env.OSASCRIPT_STUB_EXIT = '1';
      expect(createDesktopSender(STUB)({ channel: 'desktop', target: 'desktop', title: 't', body: 'b' })).toEqual({
        outcome: 'failed',
        evidence: 'osascript exit 1',
      });
    } finally {
      delete process.env.OSASCRIPT_STUB_LOG;
      delete process.env.OSASCRIPT_STUB_EXIT;
    }
  });
});

describe('delivery through the runner', () => {
  it('writes the terminal record before the first send and records a desktop notice as attempted, never delivered', async () => {
    const world = botWorld();
    writeBot(world, 'notify-ok', bot('notify-ok', '{targets: [desktop]}'));
    const seen: Array<{ reason: string; state: string }> = [];
    const { messages, senders } = stubSender(() => ({ outcome: 'acknowledged', evidence: 'stub' }));
    const wrapped: DeliverySenders = {
      desktop: (message) => {
        // The record on disk at send time is already terminal, with this send claimed.
        const runId = /^Run (\S+):/.exec(message.body)?.[1] ?? '';
        const onDisk = JSON.parse(readFileSync(recordFile(world.stateRoot, IDENTITY, runId), 'utf8')) as RunRecord;
        seen.push({ reason: onDisk.exit.reason, state: onDisk.delivery[0]?.state ?? '' });
        return (senders.desktop as (m: DeliveryMessage) => SendResult)(message);
      },
    };
    const outcome = await runBot(world.input('notify-ok', { senders: wrapped }));
    expect(outcome.kind).toBe('completed');
    expect(seen).toEqual([{ reason: 'converged', state: 'claimed' }]);
    const rec = recordOf(world, outcome.runId);
    expect(rec.exit.reason).toBe('converged');
    expect(rec.delivery).toEqual([{ channel: 'desktop', target: 'desktop', state: 'attempted', evidence: 'stub' }]);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.title).toBe('Skilled bot notify-ok');
    expect(messages[0]?.body).toContain(`Run ${outcome.runId}: completed`);
  });

  it('stores an uncertain send as unknown, sends once and never retries it, and leaves the run outcome alone', async () => {
    const world = botWorld();
    writeBot(world, 'notify-unsure', bot('notify-unsure', '{targets: [desktop]}'));
    let calls = 0;
    const senders: DeliverySenders = {
      desktop: () => {
        calls += 1;
        throw new Error('connection dropped after write');
      },
    };
    const outcome = await runBot(world.input('notify-unsure', { senders }));
    expect(outcome.kind).toBe('completed');
    const rec = recordOf(world, outcome.runId);
    expect(rec.exit).toMatchObject({ reason: 'converged', class: null });
    expect(rec.delivery).toHaveLength(1);
    expect(rec.delivery[0]).toMatchObject({ state: 'unknown' });
    expect(calls).toBe(1);

    const again = deliverRecord({ stateRoot: world.stateRoot, identity: IDENTITY, runId: outcome.runId as string, senders });
    expect(again).toMatchObject({ ok: true, value: { sends: 0 } });
    expect(calls).toBe(1);
    expect(recordOf(world, outcome.runId).delivery[0]?.state).toBe('unknown');
  });

  it('notes a refused record rewrite in the claim file and advances the generation stamp once per pass', async () => {
    const world = botWorld();
    writeBot(world, 'notify-stamp', bot('notify-stamp', '{targets: [desktop]}'));
    const { messages, senders } = stubSender(() => ({ outcome: 'attempted', evidence: null }));
    const outcome = await runBot(world.input('notify-stamp', { senders }));
    const runId = outcome.runId as string;
    // Queue one more target by hand, then make the records folder refuse every write.
    const queued = { ...recordOf(world, runId), delivery: [{ channel: 'desktop', target: 'desktop:later', state: 'queued' as const, evidence: null }] };
    expect(writeRunRecord(world.stateRoot, queued).ok).toBe(true);
    const stamp = () => JSON.parse(readFileSync(generationStampFile(world.stateRoot, IDENTITY), 'utf8')).generation as number;
    const before = stamp();
    const records = dirname(recordFile(world.stateRoot, IDENTITY, runId));
    chmodSync(records, 0o500);
    let pass;
    try {
      pass = deliverRecord({ stateRoot: world.stateRoot, identity: IDENTITY, runId, senders });
    } finally {
      chmodSync(records, 0o700);
    }
    expect(pass).toMatchObject({ ok: true, value: { sends: 1 } });
    expect(messages.map((message) => message.target)).toEqual(['desktop', 'desktop:later']);
    expect(stamp()).toBe(before + 1);
    const claims = readdirSync(deliveryClaimFolder(world.stateRoot, IDENTITY)).map(
      (name) => JSON.parse(readFileSync(join(deliveryClaimFolder(world.stateRoot, IDENTITY), name), 'utf8')) as { target: string; state: string; evidence: string | null },
    );
    const later = claims.find((claim) => claim.target === 'desktop:later');
    expect(later).toMatchObject({ state: 'attempted', evidence: expect.stringMatching(/^record write failed: as claimed: .*EACCES.*; as attempted: .*EACCES/) });
    // The record on disk still says queued, and the claim file is what stops a second send.
    expect(recordOf(world, runId).delivery[0]?.state).toBe('queued');
    expect(deliverRecord({ stateRoot: world.stateRoot, identity: IDENTITY, runId, senders })).toMatchObject({ ok: true, value: { sends: 0 } });
    expect(messages).toHaveLength(2);
    expect(stamp()).toBe(before + 2);
  });

  it('sends a failed run to its failure override', async () => {
    const world = botWorld();
    writeBot(world, 'notify-crash', bot('notify-crash', '{targets: [desktop:team], onFailure: [desktop:oncall]}', 'STUB:exit=4\n'));
    const { messages, senders } = stubSender(() => ({ outcome: 'attempted', evidence: null }));
    const outcome = await runBot(world.input('notify-crash', { senders }));
    expect(outcome.kind).toBe('failed');
    expect(recordOf(world, outcome.runId).delivery).toEqual([{ channel: 'desktop', target: 'desktop:oncall', state: 'attempted', evidence: null }]);
    expect(messages.map((message) => message.target)).toEqual(['desktop:oncall']);
    expect(messages[0]?.body).toMatch(/: failed \(/);
  });

  it('sends one needs-you notice per target, keyed by the item id, and nothing on a second pass', async () => {
    const world = botWorld();
    writeBot(
      world,
      'notify-ask',
      bot('notify-ask', '{targets: [desktop, desktop:phone]}', 'STUB:decide=Merge the fix branch or open a PR?\nSTUB:option=merge\n'),
    );
    const { messages, senders } = stubSender(() => ({ outcome: 'attempted', evidence: null }));
    const outcome = await runBot(world.input('notify-ask', { senders }));
    expect(outcome.kind).toBe('awaiting-decision');
    const itemId = outcome.kind === 'awaiting-decision' ? outcome.itemId : '';
    const rec = recordOf(world, outcome.runId);
    expect(rec.delivery).toEqual([
      { channel: 'desktop', target: 'desktop', state: 'attempted', evidence: null, itemId },
      { channel: 'desktop', target: 'desktop:phone', state: 'attempted', evidence: null, itemId },
    ]);
    expect(messages.map((message) => message.target)).toEqual(['desktop', 'desktop:phone']);
    for (const message of messages) {
      expect(message.title).toContain('notify-ask');
      expect(message.body).toContain(`Run ${outcome.runId}: needs your decision`);
      expect(message.body).toContain(`Needs-you item ${itemId}: Merge the fix branch or open a PR?`);
    }

    const second = deliverRecord({ stateRoot: world.stateRoot, identity: IDENTITY, runId: outcome.runId as string, senders });
    expect(second).toMatchObject({ ok: true, value: { sends: 0 } });
    expect(messages).toHaveLength(2);
  });

  it('puts no environment value, secret or command line in any delivery body', async () => {
    const world = botWorld({
      PLANTED_API_KEY: 'sk-planted-value-9xq7w2',
      OPENAI_API_KEY: 'sk-proj-planted-openai-4k2m',
      LANG: 'en_US.UTF-8',
    });
    writeBot(world, 'notify-env', bot('notify-env', '{targets: [desktop]}', 'FIXTURE-PROMPT-TEXT-7f3a\n'));
    writeBot(world, 'notify-env-ask', bot('notify-env-ask', '{targets: [desktop]}', 'STUB:decide=Keep the old notes?\n'));
    writeBot(world, 'notify-env-crash', bot('notify-env-crash', '{targets: [desktop]}', 'STUB:exit=4\n'));
    const { messages, senders } = stubSender(() => ({ outcome: 'attempted', evidence: null }));
    for (const id of ['notify-env', 'notify-env-ask', 'notify-env-crash']) await runBot(world.input(id, { senders }));
    expect(messages).toHaveLength(3);

    const values = Object.values(world.env).filter((value): value is string => typeof value === 'string' && value.length >= 8);
    expect(values.length).toBeGreaterThan(3);
    for (const message of messages) {
      const text = `${message.title}\n${message.body}`;
      for (const value of values) expect(text).not.toContain(value);
      expect(text).not.toContain('FIXTURE-PROMPT-TEXT');
      expect(text).not.toMatch(/codex|exec |--sandbox/);
    }
  });

  it('names a kept worktree, its branch and its reason in the notice', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    writeBot(world, 'notify-tree', bot('notify-tree', '{targets: [desktop]}').replace('isolation: shared', 'isolation: worktree'));
    const { messages, senders } = stubSender(() => ({ outcome: 'attempted', evidence: null }));
    const outcome = await runBot(world.input('notify-tree', { senders, namingScript: HALF_PROVISIONED_STUB }));
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'worktree-setup-failed' });
    expect(messages).toHaveLength(1);
    expect(messages[0]?.body).toMatch(/^Worktree kept \(half-provisioned\): \/.+\/001-bot-notify-tree on worktrees\/001-bot-notify-tree$/m);
  });

  it('keeps a tree whose real linking step fails, and names it half-provisioned in the notice', async () => {
    const world = botWorld({ SPECKIT_WORKTREE_BASE: tempDir('bots-wt-base-') });
    writeConfig(world.checkoutRoot, { identity: IDENTITY, worktreeSharedPaths: ['node_modules'] });
    writeBot(world, 'notify-link', bot('notify-link', '{targets: [desktop]}').replace('isolation: shared', 'isolation: worktree'));
    // A scope folder nobody may list makes the real linking step throw part way.
    const scope = join(world.checkoutRoot, 'node_modules', '@ws');
    mkdirSync(join(world.checkoutRoot, 'pkgs', 'own'), { recursive: true });
    mkdirSync(scope, { recursive: true });
    symlinkSync('../../pkgs/own', join(scope, 'own'));
    chmodSync(scope, 0o000);
    const { messages, senders } = stubSender(() => ({ outcome: 'attempted', evidence: null }));
    let outcome;
    try {
      outcome = await runBot(world.input('notify-link', { senders }));
    } finally {
      chmodSync(scope, 0o700);
    }
    expect(outcome).toMatchObject({ kind: 'refused', cause: 'worktree-setup-failed', detail: expect.stringContaining('linking failed') });
    const record = recordOf(world, outcome.runId);
    expect(record.evidence.worktree).toMatchObject({ disposition: 'kept', keptReason: 'half-provisioned' });
    expect(record.exit.refusal?.detail).toMatch(/^worktree-half-provisioned: linking failed: .*EACCES/);
    expect(existsSync(record.evidence.worktreePath as string)).toBe(true);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.body).toMatch(/^Worktree kept \(half-provisioned\): \/.+\/001-bot-notify-link on worktrees\/001-bot-notify-link$/m);
  });

  it('withholds a message that would carry a known secret literal', async () => {
    const world = botWorld({ PLANTED_TOKEN: 'notify-withheld-x' });
    writeBot(world, 'notify-withheld-x', bot('notify-withheld-x', '{targets: [desktop]}'));
    const { messages, senders } = stubSender(() => ({ outcome: 'attempted', evidence: null }));
    const outcome = await runBot(world.input('notify-withheld-x', { senders }));
    expect(outcome.kind).toBe('completed');
    expect(messages).toHaveLength(0);
    expect(recordOf(world, outcome.runId).delivery[0]).toMatchObject({
      state: 'not-attempted',
      evidence: expect.stringContaining('PLANTED_TOKEN'),
    });
  });
});

