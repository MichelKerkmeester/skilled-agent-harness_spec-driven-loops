// ───────────────────────────────────────────────────────────────────
// MODULE: Label Grammar Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  LABEL_PREFIX,
  MEMORY_PROPOSALS_BOT_ID,
  RESERVED_BOT_IDS,
  buildBotLabel,
  buildDrainLabel,
  identityFromSlug,
  identitySlug,
  parseLabel,
} from '../lib/label.js';

function label(identity: string, botId: string, index: number): string {
  const result = buildBotLabel(identity, botId, index);
  if (!result.ok) throw new Error(result.reason);
  return result.value;
}

describe('bot labels', () => {
  it('gives two repositories with the same bot id two labels that parse back', () => {
    const first = label('acme/web', 'review', 0);
    const second = label('local/tool', 'review', 2);
    expect(first).not.toBe(second);
    expect(first.startsWith(LABEL_PREFIX)).toBe(true);
    expect(parseLabel(first)).toEqual({ ok: true, value: { kind: 'bot', identity: 'acme/web', botId: 'review', scheduleIndex: 0 } });
    expect(parseLabel(second)).toEqual({ ok: true, value: { kind: 'bot', identity: 'local/tool', botId: 'review', scheduleIndex: 2 } });
  });

  it('keeps a near-collision identity pair apart and round-trips dots and underscores', () => {
    expect(identitySlug('a/b-c')).not.toBe(identitySlug('a-b/c'));
    for (const identity of ['a/b-c', 'a-b/c', 'my.org/repo_name.js']) {
      expect(identityFromSlug(identitySlug(identity))).toBe(identity);
      expect(identitySlug(identity)).not.toContain('.');
    }
  });

  it('refuses an unknown identity, the reserved id and a bad index', () => {
    expect(buildBotLabel('no-slash', 'review', 0)).toMatchObject({ ok: false, reason: 'identity-invalid' });
    expect(buildBotLabel('acme/web', 'drain', 0)).toMatchObject({ ok: false, reason: 'bot-id-reserved' });
    expect(buildBotLabel('acme/web', 'Review', 0)).toMatchObject({ ok: false, reason: 'bot-id-invalid' });
    expect(buildBotLabel('acme/web', 'review', -1)).toMatchObject({ ok: false, reason: 'schedule-index-invalid' });
  });
});

describe('drain labels and foreign labels', () => {
  it('parses a drain label back to its identity with no bot id', () => {
    const built = buildDrainLabel('acme/web');
    expect(built.ok).toBe(true);
    expect(parseLabel(built.ok ? built.value : '')).toEqual({ ok: true, value: { kind: 'drain', identity: 'acme/web' } });
  });

  it('rejects a label outside the hub prefix and a malformed hub label', () => {
    expect(parseLabel('com.skilled.probe.weekday')).toMatchObject({ ok: false, reason: 'label-not-hub' });
    expect(parseLabel(`${LABEL_PREFIX}acme_2fweb.review`)).toMatchObject({ ok: false, reason: 'label-invalid' });
    expect(parseLabel(`${LABEL_PREFIX}acme_2fweb.review.01`)).toMatchObject({ ok: false, reason: 'label-invalid' });
    expect(parseLabel(`${LABEL_PREFIX}acme_2fweb.drain.0`)).toMatchObject({ ok: false, reason: 'label-invalid' });
  });
});

describe('memory proposals sentinel', () => {
  it('reserved', () => {
    expect(MEMORY_PROPOSALS_BOT_ID).toBe('memory-proposals');
    expect(RESERVED_BOT_IDS).toContain(MEMORY_PROPOSALS_BOT_ID);
    expect(RESERVED_BOT_IDS[0]).toBe('drain');
    expect(buildBotLabel('acme/web', 'memory-proposals', 0)).toMatchObject({ ok: false, reason: 'bot-id-reserved', detail: 'memory-proposals' });
    expect(parseLabel(`${LABEL_PREFIX}${identitySlug('acme/web')}.memory-proposals.0`)).toMatchObject({ ok: false, reason: 'label-invalid' });
  });
});
