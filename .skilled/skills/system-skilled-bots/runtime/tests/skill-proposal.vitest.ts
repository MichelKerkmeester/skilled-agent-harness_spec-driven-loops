// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Proposal Tests
// ───────────────────────────────────────────────────────────────────
//
// A finished run becomes a draft skill and one review item, and the answer
// to that item is pinned to the revision of the target the proposal read.
// Every test works in temp folders: a temp state root, a temp Skilled tree
// and a temp checkout, so no test reads a real key, a real vault or the
// checkout it runs from.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { readNeedsYouItem, writeNeedsYouItem } from '../lib/needs-you.js';
import { writeRunRecord } from '../lib/run-record.js';
import {
  buildDraft,
  claimProposalAnswer,
  proposalFile,
  proposalFolder,
  settleProposalAnswer,
  writeProposal,
} from '../lib/skill-proposal.js';
import { needsYouFile } from '../lib/state-root.js';
import { cleanupTemp, REAL_CHECKOUT, tempDir, tempSkilledTree } from './support.js';

import type { NeedsYouItem } from '../lib/needs-you.js';
import type { RunRecord } from '../lib/run-record.js';
import type { WriteProposalInput } from '../lib/skill-proposal.js';

afterEach(cleanupTemp);

// Built at run time so no token-shaped literal sits in the repository.
const FAKE_GITHUB_TOKEN = ['ghp', '_', 'A'.repeat(36)].join('');

const IDENTITY = 'acme/tool';
const BOT_ID = 'hello';
const RUN_ID = '20261125T210204Z-0b6e5f72';
const EXPIRY_DAYS = 7;

// ───────────────────────────────────────────────────────────────────
// 1. SETUP
// ───────────────────────────────────────────────────────────────────

/** The temp folders one test works in, and the environment its proposal reads. */
interface World {
  stateRoot: string;
  skilledTree: string;
  checkoutRoot: string;
  runFolder: string;
  env: NodeJS.ProcessEnv;
}

/** A record with every field group filled, for one completed run of the hello bot. */
function fullRecord(runFolder: string, exitReason = 'completed'): RunRecord {
  return {
    schemaVersion: 1,
    identity: {
      repository: IDENTITY,
      repositoryPath: '/work/acme/tool',
      botId: BOT_ID,
      runId: RUN_ID,
      definitionDigest: 'sha256:abc123',
    },
    request: { requestId: 'req-1', leaseNonce: 'nonce-1', resultEventId: 'evt-1', firedSlot: '2026-11-25T21:02:04Z' },
    dispatch: {
      source: 'launchd',
      scheduledAt: '2026-11-25T21:02:04Z',
      dispatchedAt: '2026-11-25T21:02:08Z',
      latenessSeconds: 4,
      latenessClass: 'on-time',
      skippedSlots: { count: 0, slots: [] },
    },
    budget: {
      declared: { maxIterations: 6, maxDurationMinutes: 120, timeoutSeconds: 900 },
      measured: { iterations: 3, elapsedMinutes: 12.5, costUsd: null, costSource: null },
    },
    posture: { isolation: 'worktree', sandbox: 'workspace-write', executorKind: 'cli-opencode', model: 'deepseek-v4-flash', apps: [] },
    exit: { reason: exitReason, class: null, needsYouItemId: null },
    evidence: {
      runFolder,
      ledgerDir: `${runFolder}/ledger`,
      receiptDir: `${runFolder}/receipts`,
      observabilityStream: `${runFolder}/events.jsonl`,
      worktreePath: '/work/acme/tool-wt/r1',
      branch: 'bots/r1',
    },
    delivery: [{ channel: 'desktop', target: 'local', state: 'attempted', evidence: null }],
  };
}

/**
 * A temp world with one run record written. The environment carries PATH and a
 * temp HOME only, so no real key and no real vault is read.
 */
function setup(exitReason = 'completed'): World {
  const stateRoot = tempDir();
  const skilledTree = tempSkilledTree(true);
  const checkoutRoot = tempDir();
  const runFolder = tempDir('bots-run-');
  const written = writeRunRecord(stateRoot, fullRecord(runFolder, exitReason));
  if (!written.ok) throw new Error(written.reason);
  return {
    stateRoot,
    skilledTree,
    checkoutRoot,
    runFolder,
    env: { PATH: process.env.PATH, HOME: tempDir('bots-home-') },
  };
}

/** The input one propose call takes, with the world's folders and no name unless a test gives one. */
function proposalInput(world: World, overrides: Partial<WriteProposalInput> = {}): WriteProposalInput {
  return {
    stateRoot: world.stateRoot,
    identity: IDENTITY,
    checkoutRoot: world.checkoutRoot,
    skilledTree: world.skilledTree,
    runId: RUN_ID,
    expiryDays: EXPIRY_DAYS,
    env: world.env,
    ...overrides,
  };
}

/** Write one target skill into a temp Skilled tree, making its folder first, and return its path. */
function writeTarget(tree: string, name: string, body: string): string {
  const path = join(tree, '.skilled', 'skills', name, 'SKILL.md');
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, body);
  return path;
}

/** The draft one run produces, written out so a test can compare bytes. */
function draftOf(world: World, name: string, exitReason = 'completed'): string {
  return buildDraft({ name, runId: RUN_ID, botId: BOT_ID, runFolder: world.runFolder, exitReason });
}

/** The review item of the run, read back, or a thrown reason when it does not read. */
function itemOf(world: World): NeedsYouItem {
  const read = readNeedsYouItem(world.stateRoot, IDENTITY, RUN_ID);
  if (!read.ok) throw new Error(read.reason);
  return read.value;
}

// ───────────────────────────────────────────────────────────────────
// 2. WRITE
// ───────────────────────────────────────────────────────────────────

describe('writeProposal', () => {
  it('writes the draft then the proposal then the item', () => {
    const world = setup();
    const written = writeProposal(proposalInput(world, { name: 'report' }));
    if (!written.ok) throw new Error(written.reason);

    expect(existsSync(written.value.draftPath)).toBe(true);
    expect(existsSync(written.value.proposalPath)).toBe(true);
    expect(existsSync(needsYouFile(world.stateRoot, IDENTITY, RUN_ID))).toBe(true);

    const proposal = JSON.parse(readFileSync(written.value.proposalPath, 'utf8')) as Record<string, unknown>;
    expect(proposal).toEqual({
      schemaVersion: 1,
      targetPath: '.skilled/skills/report/SKILL.md',
      revisionRead: null,
      runId: RUN_ID,
      botId: BOT_ID,
      createdAt: expect.any(String),
    });
    expect(new Date(proposal.createdAt as string).toISOString()).toBe(proposal.createdAt);

    const item = itemOf(world);
    expect(item.botId).toBe('skill-proposals');
    expect(item.kind).toBe('skill-proposal');
    expect(item.question).toBe('Propose skill report?');
    expect(item.options).toEqual(['confirm', 'reject']);
    expect(item.evidence).toEqual([written.value.draftPath, written.value.proposalPath, world.runFolder]);
    expect(item.answer).toBeNull();
    expect(item.resumeRequestId).toBeNull();
    expect(item.proposalType).toBeNull();
    expect(item.proposalFact).toBeNull();
    expect(item.proposalBotId).toBeNull();
    expect(item.grants).toEqual({
      kind: 'other',
      action: 'Propose skill report?',
      rung: 'bot',
      scope: null,
      grantedBy: null,
      grantedAt: null,
    });

    expect(statSync(written.value.draftPath).mode & 0o777).toBe(0o600);
    expect(statSync(written.value.proposalPath).mode & 0o777).toBe(0o600);

    // A target that already exists pins the digest of its bytes.
    const second = setup();
    const target = writeTarget(second.skilledTree, 'report', '---\nname: report\n---\n');
    const pinned = writeProposal(proposalInput(second, { name: 'report' }));
    if (!pinned.ok) throw new Error(pinned.reason);
    expect(pinned.value.revisionRead).toBe(createHash('sha256').update(readFileSync(target)).digest('hex'));
    expect(pinned.value.revisionRead).toMatch(/^[0-9a-f]{64}$/);
  });

  it('defaults the name to the bot id', () => {
    const world = setup();
    const written = writeProposal(proposalInput(world));
    if (!written.ok) throw new Error(written.reason);

    expect(written.value.name).toBe(BOT_ID);
    expect(written.value.targetPath).toBe('.skilled/skills/hello/SKILL.md');
    const proposal = JSON.parse(readFileSync(written.value.proposalPath, 'utf8')) as Record<string, unknown>;
    expect(proposal.botId).toBe(BOT_ID);
    expect(readFileSync(written.value.draftPath, 'utf8').split('\n')).toContain('name: hello');
  });

  it('refuses a secret in the exit reason', () => {
    const world = setup(`exited with ${FAKE_GITHUB_TOKEN}`);
    const refused = writeProposal(proposalInput(world, { name: 'report' }));

    expect(refused).toMatchObject({ ok: false, reason: 'proposal-secret' });
    if (refused.ok) throw new Error('expected a refusal');
    expect(refused.detail).toBeDefined();
    expect(refused.detail).not.toContain(FAKE_GITHUB_TOKEN);
    expect(existsSync(proposalFolder(world.stateRoot, IDENTITY, RUN_ID))).toBe(false);
    expect(existsSync(needsYouFile(world.stateRoot, IDENTITY, RUN_ID))).toBe(false);
  });

  it('refuses a hidden direction character', () => {
    const exitReason = 'done \u202E reversed';
    const world = setup(exitReason);
    const refused = writeProposal(proposalInput(world, { name: 'report' }));

    const line = draftOf(world, 'report', exitReason)
      .split('\n')
      .findIndex((entry) => entry.startsWith('- The run this skill came from exited')) + 1;
    expect(refused).toEqual({ ok: false, reason: 'proposal-hidden-character', detail: `U+202E at line ${line}` });
    expect(existsSync(proposalFile(world.stateRoot, IDENTITY, RUN_ID, 'draft'))).toBe(false);
    expect(existsSync(proposalFile(world.stateRoot, IDENTITY, RUN_ID, 'proposal'))).toBe(false);
    expect(existsSync(needsYouFile(world.stateRoot, IDENTITY, RUN_ID))).toBe(false);

    // A variation selector is ordinary emoji, so it is not a hidden character.
    const emoji = setup('done \u2705\uFE0F');
    const accepted = writeProposal(proposalInput(emoji, { name: 'report' }));
    if (!accepted.ok) throw new Error(accepted.reason);
    expect(existsSync(accepted.value.draftPath)).toBe(true);
    expect(existsSync(accepted.value.proposalPath)).toBe(true);
  });

  it('passes the validator', () => {
    const world = setup();
    const folder = join(tempDir(), 'report');
    mkdirSync(folder, { recursive: true });
    writeFileSync(join(folder, 'SKILL.md'), draftOf(world, 'report'));

    const run = spawnSync(
      'python3',
      [join(REAL_CHECKOUT, '.skilled', 'skills', 'sk-doc', 'scripts', 'validate_skill_package.py'), folder],
      { encoding: 'utf8' },
    );
    expect(run.status).toBe(0);
    expect(run.stdout).toContain('PASS');
  });

  it('repairs an interrupted proposal', () => {
    const world = setup();
    const first = writeProposal(proposalInput(world, { name: 'report' }));
    if (!first.ok) throw new Error(first.reason);

    const itemPath = needsYouFile(world.stateRoot, IDENTITY, RUN_ID);
    rmSync(itemPath);
    writeFileSync(first.value.draftPath, 'stale');

    const repaired = writeProposal(proposalInput(world, { name: 'report' }));
    if (!repaired.ok) throw new Error(repaired.reason);
    expect(readFileSync(repaired.value.draftPath, 'utf8')).toBe(draftOf(world, 'report'));
    expect(existsSync(itemPath)).toBe(true);

    const draftBytes = readFileSync(repaired.value.draftPath);
    const proposalBytes = readFileSync(repaired.value.proposalPath);
    expect(writeProposal(proposalInput(world, { name: 'report' }))).toEqual({
      ok: false,
      reason: 'review-already-exists',
      detail: RUN_ID,
    });
    expect(readFileSync(repaired.value.draftPath).equals(draftBytes)).toBe(true);
    expect(readFileSync(repaired.value.proposalPath).equals(proposalBytes)).toBe(true);
  });

  it('refuses an item of another kind', () => {
    const world = setup();
    const decision: NeedsYouItem = {
      id: RUN_ID,
      runId: RUN_ID,
      botId: BOT_ID,
      identity: IDENTITY,
      question: 'Ship the release?',
      options: ['confirm', 'reject'],
      createdAt: '2026-11-25T21:02:04.000Z',
      expiresAt: '2026-12-02T21:02:04.000Z',
      evidence: [],
      prompt: 'Ship the release?',
      specFolder: null,
      answer: null,
      resumeRequestId: null,
      kind: 'decision',
      proposalType: null,
      proposalFact: null,
      proposalBotId: null,
      grants: null,
    };
    const written = writeNeedsYouItem(world.stateRoot, decision);
    if (!written.ok) throw new Error(written.reason);
    const before = readFileSync(written.value);

    expect(writeProposal(proposalInput(world, { name: 'report' }))).toEqual({
      ok: false,
      reason: 'review-already-exists',
      detail: `${RUN_ID} (decision)`,
    });
    expect(existsSync(proposalFolder(world.stateRoot, IDENTITY, RUN_ID))).toBe(false);
    expect(readFileSync(written.value).equals(before)).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. THE PIN
// ───────────────────────────────────────────────────────────────────

describe('the pin', () => {
  it('refuses a stale target', () => {
    const world = setup();
    const written = writeProposal(proposalInput(world, { name: 'report' }));
    if (!written.ok) throw new Error(written.reason);
    writeTarget(world.skilledTree, 'report', '---\nname: report\n---\n');

    expect(
      claimProposalAnswer({ stateRoot: world.stateRoot, identity: IDENTITY, skilledTree: world.skilledTree, item: itemOf(world) }),
    ).toEqual({ ok: false, reason: 'proposal-stale', detail: 'report' });

    // A target that existed when the proposal was written refuses once one byte changes.
    const second = setup();
    const target = writeTarget(second.skilledTree, 'report', '---\nname: report\n---\n');
    const pinned = writeProposal(proposalInput(second, { name: 'report' }));
    if (!pinned.ok) throw new Error(pinned.reason);
    expect(pinned.value.revisionRead).not.toBeNull();
    writeFileSync(target, '---\nname: report\n---\nX');

    expect(
      claimProposalAnswer({ stateRoot: second.stateRoot, identity: IDENTITY, skilledTree: second.skilledTree, item: itemOf(second) }),
    ).toEqual({ ok: false, reason: 'proposal-stale', detail: 'report' });
  });

  it('accepts an unchanged target', () => {
    const world = setup();
    writeTarget(world.skilledTree, 'report', '---\nname: report\n---\n');
    const written = writeProposal(proposalInput(world, { name: 'report' }));
    if (!written.ok) throw new Error(written.reason);

    const item = itemOf(world);
    expect(
      claimProposalAnswer({ stateRoot: world.stateRoot, identity: IDENTITY, skilledTree: world.skilledTree, item }),
    ).toEqual({ ok: true, value: 'claimed' });
    expect(
      claimProposalAnswer({
        stateRoot: world.stateRoot,
        identity: IDENTITY,
        skilledTree: world.skilledTree,
        item: { ...item, kind: 'decision' },
      }),
    ).toEqual({ ok: true, value: 'not-a-proposal' });

    const answeredAt = '2026-11-26T09:00:00.000Z';
    const answered: NeedsYouItem = { ...item, answer: { text: 'confirm', answeredAt, by: 'ada', scope: 'once' } };
    expect(settleProposalAnswer({ stateRoot: world.stateRoot, identity: IDENTITY, item: answered, decision: 'confirm' })).toEqual({
      ok: true,
      value: 'recorded',
    });

    const answerPath = proposalFile(world.stateRoot, IDENTITY, RUN_ID, 'answer');
    expect(JSON.parse(readFileSync(answerPath, 'utf8'))).toEqual({
      schemaVersion: 1,
      decision: 'confirm',
      text: 'confirm',
      by: 'ada',
      scope: 'once',
      answeredAt,
      revisionRead: written.value.revisionRead,
    });

    const bytes = readFileSync(answerPath);
    expect(settleProposalAnswer({ stateRoot: world.stateRoot, identity: IDENTITY, item: answered, decision: 'confirm' })).toEqual({
      ok: true,
      value: 'recorded',
    });
    expect(readFileSync(answerPath).equals(bytes)).toBe(true);
  });
});
