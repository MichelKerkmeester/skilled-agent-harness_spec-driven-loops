import { readFileSync, writeFileSync } from 'node:fs';

import { afterEach, describe, expect, it } from 'vitest';

import { needsYouExpiry, needsYouState, readNeedsYouItem, writeNeedsYouItem } from '../lib/needs-you.js';
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
});
