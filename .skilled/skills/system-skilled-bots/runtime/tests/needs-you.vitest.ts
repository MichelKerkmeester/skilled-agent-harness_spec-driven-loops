import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

import { afterEach, describe, expect, it } from 'vitest';

import {
  buildResumedPrompt,
  holdForBot,
  listNeedsYouItems,
  needsYouExpiry,
  needsYouState,
  openItemForBot,
  readNeedsYouItem,
  writeNeedsYouItem,
} from '../lib/needs-you.js';
import { defaultRepoConfig } from '../lib/repo-config.js';
import { identityStatePaths, userStateRoot } from '../lib/state-root.js';
import { cleanupTemp, tempDir } from './support.js';

import type { NeedsYouItem } from '../lib/needs-you.js';

afterEach(cleanupTemp);

const IDENTITY = 'acme/tool';
const CREATED = new Date('2026-11-22T10:00:00Z');

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
    expect(readNeedsYouItem(root, IDENTITY, 'r1')).toEqual({ ok: true, value: item() });
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
});
