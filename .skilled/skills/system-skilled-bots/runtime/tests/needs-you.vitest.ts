import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { classifyAction, clipAction } from '../lib/action-kind.js';
import { decideApproval } from '../lib/approval-ladder.js';
import {
  buildResumedPrompt,
  holdForBot,
  itemAwaitingResume,
  itemKind,
  listNeedsYouItems,
  needsYouExpiry,
  needsYouState,
  openItemForBot,
  readNeedsYouItem,
  validateNeedsYouItem,
  writeNeedsYouItem,
} from '../lib/needs-you.js';
import { defaultRepoConfig } from '../lib/repo-config.js';
import { identityStatePaths, userStateRoot } from '../lib/state-root.js';
import { cleanupTemp, REAL_CHECKOUT, tempDir } from './support.js';

import type { NeedsYouAnswer, NeedsYouGrant, NeedsYouItem } from '../lib/needs-you.js';

afterEach(cleanupTemp);

const IDENTITY = 'acme/tool';
const CREATED = new Date('2026-11-22T10:00:00Z');

// The answer shape stored before answers named anyone.
const LEGACY = JSON.parse(
  readFileSync(join(REAL_CHECKOUT, 'specs', 'system-skilled-bots', '003-openbot-parity-build', '001-activity-and-actor', 'design', 'fixtures', 'legacy-records.json'), 'utf8'),
) as { answerBefore001: NeedsYouAnswer; answerBefore001ReadsAs: NeedsYouAnswer };

function item(): NeedsYouItem {
  return {
    id: 'r1',
    runId: 'r1',
    botId: 'weekday-deep-review',
    identity: IDENTITY,
    question: 'Merge the fix branch or open a PR?',
    options: ['merge', 'open a PR'],
    createdAt: CREATED.toISOString(),
    expiresAt: needsYouExpiry(CREATED, defaultRepoConfig().needsYou.expiryDays),
    evidence: ['/tree/.skilled/skills/.state/system-skilled-bots/acme%2Ftool/runs/r1/ledger'],
    prompt: 'Bound spec folder: specs/demo\n\nReview the change.',
    specFolder: 'specs/demo',
    answer: null,
    resumeRequestId: null,
  };
}

function stateRoot(): string {
  return userStateRoot(defaultRepoConfig(), { XDG_STATE_HOME: tempDir() });
}

describe('needs-you item', () => {
  it('round-trips at the user-level path and stores no state field', () => {
    const root = stateRoot();
    const written = writeNeedsYouItem(root, item());
    if (!written.ok) throw new Error(written.reason);
    expect(written.value).toBe(`${identityStatePaths(root, IDENTITY).needsYou}/r1.json`);
    expect(readNeedsYouItem(root, IDENTITY, 'r1')).toEqual({ ok: true, value: { ...item(), grants: null } });
    expect(Object.keys(JSON.parse(readFileSync(written.value, 'utf8')))).not.toContain('state');
  });

  it('derives open, expired and answered from the fields', () => {
    const parked = item();
    expect(parked.expiresAt).toBe('2026-11-29T10:00:00.000Z');
    expect(needsYouState(parked, new Date('2026-11-23T00:00:00Z'))).toBe('open');
    expect(needsYouState(parked, new Date('2026-11-29T10:00:00Z'))).toBe('expired');
    const answered = { ...parked, answer: { text: 'merge', answeredAt: '2026-11-30T08:00:00Z' } };
    expect(needsYouState(answered, new Date('2026-12-01T00:00:00Z'))).toBe('answered');
  });

  it('refuses a stored state field and an id that is not the run id', () => {
    const root = stateRoot();
    expect(writeNeedsYouItem(root, { ...item(), state: 'open' } as NeedsYouItem)).toMatchObject({
      reason: 'unknown-key',
      detail: 'state',
    });
    expect(writeNeedsYouItem(root, { ...item(), id: 'other' })).toEqual({ ok: false, reason: 'item-id-not-run-id' });
  });

  it('refuses an unsafe item id or identity by name instead of throwing', () => {
    const root = stateRoot();
    expect(writeNeedsYouItem(root, { ...item(), id: '../x', runId: '../x' })).toEqual({ ok: false, reason: 'item-id-invalid' });
    expect(writeNeedsYouItem(root, { ...item(), identity: '..' })).toEqual({ ok: false, reason: 'identity-invalid' });
  });

  it('reports a damaged or missing item by name', () => {
    const root = stateRoot();
    expect(readNeedsYouItem(root, IDENTITY, 'r1')).toEqual({ ok: false, reason: 'item-missing' });
    const written = writeNeedsYouItem(root, item());
    if (!written.ok) throw new Error(written.reason);
    writeFileSync(written.value, '{ broken');
    expect(readNeedsYouItem(root, IDENTITY, 'r1')).toMatchObject({ ok: false, reason: 'item-invalid' });
  });

  it('lists items with derived state and finds the open item that holds a bot', () => {
    const root = stateRoot();
    writeNeedsYouItem(root, item());
    writeNeedsYouItem(root, { ...item(), id: 'r2', runId: 'r2', answer: { text: 'merge', answeredAt: '2026-11-23T08:00:00Z' } });
    writeFileSync(`${identityStatePaths(root, IDENTITY).needsYou}/r3.json`, '{ broken');
    const listed = listNeedsYouItems(root, IDENTITY, new Date('2026-11-23T00:00:00Z'));
    expect(listed.items.map((entry) => [entry.item.id, entry.state])).toEqual([['r1', 'open'], ['r2', 'answered']]);
    expect(listed.unreadable).toEqual(['r3']);
    expect(openItemForBot(root, IDENTITY, 'weekday-deep-review', new Date('2026-11-23T00:00:00Z'))?.id).toBe('r1');
    expect(openItemForBot(root, IDENTITY, 'weekday-deep-review', new Date('2026-12-01T00:00:00Z'))).toBeNull();
    expect(openItemForBot(root, IDENTITY, 'other-bot', new Date('2026-11-23T00:00:00Z'))).toBeNull();
  });

  it('holds a bot on a damaged item that may be its own, and not on one that names another bot', () => {
    const root = stateRoot();
    const folder = identityStatePaths(root, IDENTITY).needsYou;
    writeNeedsYouItem(root, { ...item(), answer: { text: 'merge', answeredAt: '2026-11-23T08:00:00Z' } });
    expect(holdForBot(root, IDENTITY, 'weekday-deep-review')).toBeNull();
    writeFileSync(`${folder}/r4.json`, JSON.stringify({ botId: 'other-bot', question: 7 }));
    expect(holdForBot(root, IDENTITY, 'weekday-deep-review')).toBeNull();
    writeFileSync(`${folder}/r5.json`, '{ broken');
    expect(holdForBot(root, IDENTITY, 'weekday-deep-review')).toEqual({ kind: 'unreadable', itemIds: ['r5'] });
    writeNeedsYouItem(root, { ...item(), id: 'r6', runId: 'r6' });
    expect(holdForBot(root, IDENTITY, 'weekday-deep-review', new Date('2026-11-23T00:00:00Z'))).toMatchObject({ kind: 'open', item: { id: 'r6' } });
  });

  it('holds a bot when the needs-you folder exists but cannot be listed, and reads only a missing folder as empty', () => {
    const root = stateRoot();
    expect(listNeedsYouItems(root, IDENTITY)).toEqual({ items: [], unreadable: [], listError: null });
    expect(holdForBot(root, IDENTITY, 'weekday-deep-review')).toBeNull();
    const folder = identityStatePaths(root, IDENTITY).needsYou;
    mkdirSync(folder, { recursive: true });
    chmodSync(folder, 0o000);
    try {
      expect(listNeedsYouItems(root, IDENTITY).listError).toBe('EACCES');
      expect(holdForBot(root, IDENTITY, 'weekday-deep-review')).toEqual({ kind: 'unlistable', code: 'EACCES' });
    } finally {
      chmodSync(folder, 0o700);
    }
  });

  it('builds the resumed prompt from the parked prompt, the question and the answer', () => {
    expect(buildResumedPrompt(item())).toEqual({ ok: false, reason: 'item-not-answered' });
    const resumed = buildResumedPrompt({ ...item(), answer: { text: 'open a PR', answeredAt: '2026-11-23T08:00:00Z' } });
    if (!resumed.ok) throw new Error(resumed.reason);
    expect(resumed.value.startsWith(item().prompt)).toBe(true);
    expect(resumed.value).toContain('Question: Merge the fix branch or open a PR?');
    expect(resumed.value).toContain('Answer: open a PR');
  });

  it('refuses an item with no prompt', () => {
    expect(writeNeedsYouItem(stateRoot(), { ...item(), prompt: '' })).toEqual({ ok: false, reason: 'item-field-invalid', detail: 'prompt' });
  });

  it('reads an old answer as by null and scope once', () => {
    const root = stateRoot();
    const written = writeNeedsYouItem(root, { ...item(), answer: LEGACY.answerBefore001 });
    if (!written.ok) throw new Error(written.reason);
    const read = readNeedsYouItem(root, IDENTITY, 'r1');
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.answer).toEqual(LEGACY.answerBefore001ReadsAs);
    const onDisk = JSON.parse(readFileSync(written.value, 'utf8')) as { answer: Record<string, unknown> };
    expect(onDisk.answer).not.toHaveProperty('by');
    expect(onDisk.answer).not.toHaveProperty('scope');
  });

  it('checks the answer by and scope and accepts kind as a key only', () => {
    const answeredAt = LEGACY.answerBefore001.answeredAt;
    expect(validateNeedsYouItem({ ...item(), answer: { text: 'yes', answeredAt, by: 'a/b' } })).toMatchObject({
      ok: false,
      reason: 'item-field-invalid',
      detail: 'answer.by',
    });
    expect(validateNeedsYouItem({ ...item(), answer: { text: 'yes', answeredAt, scope: 'always' } })).toMatchObject({
      ok: false,
      reason: 'item-field-invalid',
      detail: 'answer.scope',
    });
    expect(validateNeedsYouItem({ ...item(), kind: null }).ok).toBe(true);
    expect(validateNeedsYouItem({ ...item(), kind: 'decision' }).ok).toBe(true);
    expect(validateNeedsYouItem({ ...item(), kind: 7 })).toMatchObject({ ok: false, reason: 'item-field-invalid', detail: 'kind' });
  });

  it('writes the grant a parked question classifies', () => {
    const root = stateRoot();
    const question = `Delete the stale branch? ${'x'.repeat(175)}`;
    expect(question).toHaveLength(200);
    const kind = classifyAction(question);
    if (!kind.ok) throw new Error(kind.reason);
    const decision = decideApproval({ kind: kind.value });
    const grants: NeedsYouGrant = {
      kind: kind.value,
      action: clipAction(question),
      rung: decision.rung,
      scope: null,
      grantedBy: null,
      grantedAt: null,
    };
    const written = writeNeedsYouItem(root, { ...item(), question, grants });
    if (!written.ok) throw new Error(written.reason);
    const read = readNeedsYouItem(root, IDENTITY, 'r1');
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.grants).toEqual({
      kind: 'delete',
      action: question.slice(0, 120),
      rung: 'kind',
      scope: null,
      grantedBy: null,
      grantedAt: null,
    });
  });

  it('reads an item written before this phase', () => {
    const root = stateRoot();
    const folder = identityStatePaths(root, IDENTITY).needsYou;
    mkdirSync(folder, { recursive: true });
    const raw = item();
    writeFileSync(`${folder}/r1.json`, JSON.stringify(raw));
    const read = readNeedsYouItem(root, IDENTITY, 'r1');
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.grants).toBeNull();
    expect(validateNeedsYouItem(raw).ok).toBe(true);
    const listed = listNeedsYouItems(root, IDENTITY, new Date('2026-11-23T00:00:00Z'));
    expect(listed.items.map((entry) => entry.item.id)).toEqual(['r1']);
    expect(listed.unreadable).toEqual([]);
  });

  it('names the granted scope in the resumed prompt', () => {
    const golden = readFileSync(
      join(REAL_CHECKOUT, 'specs', 'system-skilled-bots', '003-openbot-parity-build', '006-approval-grants', 'design', 'fixtures', 'resumed-prompt.txt'),
      'utf8',
    );
    const answeredAt = '2026-11-25T21:13:10.000Z';
    const base = {
      ...item(),
      prompt: 'Ship the release when the checks pass.',
      question: 'Ship the release?',
      options: null,
      answer: { text: 'no', answeredAt, by: 'ada', scope: 'deny' as const },
    };
    const denied = buildResumedPrompt({
      ...base,
      grants: { kind: 'post', action: 'Ship the release?', rung: 'kind', scope: 'deny', grantedBy: 'ada', grantedAt: answeredAt },
    });
    if (!denied.ok) throw new Error(denied.reason);
    expect(denied.value).toBe(golden.replace(/\n$/, ''));
    expect(denied.value).not.toContain('Continue the work');

    const once = buildResumedPrompt({
      ...base,
      answer: { text: 'yes', answeredAt, by: 'ada', scope: 'once' as const },
      grants: { kind: 'post', action: 'Ship the release?', rung: 'kind', scope: 'once', grantedBy: 'ada', grantedAt: answeredAt },
    });
    if (!once.ok) throw new Error(once.reason);
    expect(once.value).toContain('Granted scope: once');
    expect(once.value.endsWith('Continue the work from where that run stopped, following the answer.')).toBe(true);

    const bare = buildResumedPrompt(base);
    const nullGrant = buildResumedPrompt({ ...base, grants: null });
    if (!bare.ok) throw new Error(bare.reason);
    if (!nullGrant.ok) throw new Error(nullGrant.reason);
    expect(nullGrant.value).not.toContain('Granted scope');
    expect(nullGrant.value).toBe(bare.value);
  });

  it('refuses a grant whose scope disagrees with the answer', () => {
    const answeredAt = '2026-11-25T21:13:10.000Z';
    const answered = {
      ...item(),
      answer: { text: 'yes', answeredAt, by: 'ada', scope: 'once' as const },
    };
    const grant: NeedsYouGrant = {
      kind: 'post',
      action: 'Ship the release?',
      rung: 'kind',
      scope: 'deny',
      grantedBy: 'ada',
      grantedAt: answeredAt,
    };
    const refused = (grants: unknown) =>
      expect(validateNeedsYouItem({ ...answered, grants })).toEqual({
        ok: false,
        reason: 'item-field-invalid',
        detail: 'grants',
      });
    refused(grant);
    refused({ ...grant, extra: true });
    refused({ ...grant, kind: 'transfer' });
    refused({ ...grant, action: '' });
    refused({ ...grant, action: 'x'.repeat(121) });
    refused({ ...grant, rung: 'maybe' });
    refused({ ...grant, scope: 'always' });
    refused({ ...grant, grantedBy: null });
    refused({ ...grant, grantedAt: 'not a date' });
    expect(validateNeedsYouItem({ ...answered, grants: { ...grant, scope: null, grantedBy: null, grantedAt: null } }).ok).toBe(true);
  });
});

describe('memory proposal item', () => {
  const PROPOSAL = JSON.parse(
    readFileSync(join(REAL_CHECKOUT, 'specs', 'system-skilled-bots', '003-openbot-parity-build', '005-memory', 'design', 'fixtures', 'proposal-item.json'), 'utf8'),
  ) as NeedsYouItem;
  const PROPOSAL_IDENTITY = 'skilled-scratch/hello';
  const NOW = new Date('2026-11-25T22:00:00Z');

  it('holds nothing', () => {
    const root = stateRoot();
    expect(validateNeedsYouItem(PROPOSAL).ok).toBe(true);
    const written = writeNeedsYouItem(root, PROPOSAL);
    if (!written.ok) throw new Error(written.reason);
    expect(holdForBot(root, PROPOSAL_IDENTITY, 'hello', NOW)).toBeNull();
    expect(holdForBot(root, PROPOSAL_IDENTITY, 'memory-proposals', NOW)).toBeNull();
    const answered = writeNeedsYouItem(root, {
      ...PROPOSAL,
      answer: { text: 'confirm', answeredAt: '2026-11-25T21:30:00.000Z' },
      resumeRequestId: null,
    });
    if (!answered.ok) throw new Error(answered.reason);
    expect(itemAwaitingResume(root, PROPOSAL_IDENTITY, 'hello', NOW)).toBeNull();
    expect(itemAwaitingResume(root, PROPOSAL_IDENTITY, 'memory-proposals', NOW)).toBeNull();
    const decision = writeNeedsYouItem(root, { ...item(), identity: PROPOSAL_IDENTITY, botId: 'hello' });
    if (!decision.ok) throw new Error(decision.reason);
    expect(holdForBot(root, PROPOSAL_IDENTITY, 'hello', NOW)).toMatchObject({ kind: 'open' });
  });

  it('kind filter', () => {
    const root = stateRoot();
    const review = writeNeedsYouItem(root, {
      ...item(),
      identity: PROPOSAL_IDENTITY,
      botId: 'hello',
      kind: 'skill-proposal',
      proposalType: null,
      proposalFact: null,
      proposalBotId: null,
    });
    if (!review.ok) throw new Error(review.reason);
    expect(holdForBot(root, PROPOSAL_IDENTITY, 'hello', NOW)).toBeNull();
    expect(itemKind({})).toBe('decision');
    expect(itemKind({ kind: null })).toBe('decision');
    expect(itemKind({ kind: 'memory-proposal' })).toBe('memory-proposal');
    expect(validateNeedsYouItem({ ...PROPOSAL, kind: 'maybe' })).toMatchObject({
      ok: false,
      reason: 'item-field-invalid',
      detail: 'kind',
    });
    expect(validateNeedsYouItem({ ...PROPOSAL, proposalFact: null })).toMatchObject({
      ok: false,
      reason: 'item-field-invalid',
      detail: 'proposalFact',
    });
    expect(validateNeedsYouItem({ ...PROPOSAL, proposalFact: 'x'.repeat(401) })).toMatchObject({
      ok: false,
      reason: 'item-field-invalid',
      detail: 'proposalFact',
    });
    expect(validateNeedsYouItem({ ...PROPOSAL, proposalBotId: '../x' })).toMatchObject({
      ok: false,
      reason: 'item-field-invalid',
      detail: 'proposalBotId',
    });
    const stored = writeNeedsYouItem(root, { ...item(), identity: PROPOSAL_IDENTITY, id: 'r2', runId: 'r2' });
    if (!stored.ok) throw new Error(stored.reason);
    const read = readNeedsYouItem(root, PROPOSAL_IDENTITY, 'r2');
    if (!read.ok) throw new Error(read.reason);
    expect(Object.keys(read.value)).not.toContain('kind');
  });
});
