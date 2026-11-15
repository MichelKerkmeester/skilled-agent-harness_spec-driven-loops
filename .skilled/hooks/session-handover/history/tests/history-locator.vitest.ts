// ───────────────────────────────────────────────────────────────────
// MODULE: History Locator Contract
// ───────────────────────────────────────────────────────────────────
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  HISTORY_LOCATOR_KINDS,
  HISTORY_LOCATOR_VERSION,
  HistoryLocatorSchema,
  clearCompactPrime,
  detectHistoryRuntime,
  ensureStateDir,
  getStatePath,
  loadState,
  updateState,
  type HistoryLocator,
} from '../../../../skills/system-spec-kit/runtime/hooks/claude/hook-state.js';
import {
  HISTORY_LOOKUP_MAX_QUOTED_SESSION_ID,
  buildHistoryLookupSection,
  fitRecoverySections,
  fitsHistoryLookupOffer,
  isHistoryLookupRuntime,
  placeLookup,
} from '../lib/lookup-offer.js';
import { persistHistoryLocator } from '../lib/locator-digest.js';
import { buildLocator, checkoutRoot } from './_support/history-fixtures.js';

const WORKSPACE = checkoutRoot();
afterAll(() => rmSync(WORKSPACE, { recursive: true, force: true }));
const NOW_MS = Date.parse('2026-11-07T12:00:00.000Z');

function validLocator(overrides: Partial<HistoryLocator> = {}): HistoryLocator {
  const mintedAt = new Date(NOW_MS).toISOString();
  return {
    version: HISTORY_LOCATOR_VERSION,
    runtime: 'claude',
    sessionId: 'session-one',
    workspace: WORKSPACE,
    locatorKind: 'transcript_path',
    handle: 'hl1_0123456789abcdef0123456789abcdef',
    mintedAt,
    provenance: { source: 'precompact', capturedAt: mintedAt },
    ...overrides,
  };
}

function seededLocator(sessionId: string, mintedAt: string): HistoryLocator {
  return buildLocator({
    runtime: 'claude',
    sessionId,
    cwd: WORKSPACE,
    storePath: join(WORKSPACE, `${sessionId}.jsonl`),
    mintedAt,
  });
}

const TEST_SESSION_IDS = [
  'history-locator-clear',
  'history-locator-identity',
];

// The hooks create the state folder before their first write, so each test does too:
// on a fresh machine the temp folder holds no state folder yet.
beforeEach(() => ensureStateDir());

afterEach(() => {
  for (const sessionId of TEST_SESSION_IDS) {
    try { rmSync(getStatePath(sessionId)); } catch { /* ok */ }
    try { rmSync(`${getStatePath(sessionId)}.bad`); } catch { /* ok */ }
  }
});

describe('history locator schema', () => {
  it('accepts the closed, versioned shape', () => {
    expect(HistoryLocatorSchema.safeParse(validLocator()).success).toBe(true);
  });

  it('rejects an unknown version', () => {
    const parsed = HistoryLocatorSchema.safeParse({ ...validLocator(), version: 2 });
    expect(parsed.success).toBe(false);
  });

  it('rejects an unknown locator kind', () => {
    const parsed = HistoryLocatorSchema.safeParse({ ...validLocator(), locatorKind: 'session_id' });
    expect(parsed.success).toBe(false);
  });

  it('rejects a locator kind that belongs to another runtime', () => {
    const parsed = HistoryLocatorSchema.safeParse({
      ...validLocator(),
      runtime: 'claude',
      locatorKind: 'session_log',
    });
    expect(parsed.success).toBe(false);
  });

  it('rejects a handle that could carry a path', () => {
    const parsed = HistoryLocatorSchema.safeParse({ ...validLocator(), handle: '../etc/passwd' });
    expect(parsed.success).toBe(false);
  });

  it('rejects an unknown field instead of guessing its meaning', () => {
    const parsed = HistoryLocatorSchema.safeParse({ ...validLocator(), path: '/tmp/transcript.jsonl' });
    expect(parsed.success).toBe(false);
  });

  it('accepts the handover provenance source', () => {
    const parsed = HistoryLocatorSchema.safeParse({
      ...validLocator(),
      provenance: { source: 'handover', capturedAt: new Date(NOW_MS).toISOString() },
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects an unknown provenance source', () => {
    const parsed = HistoryLocatorSchema.safeParse({
      ...validLocator(),
      provenance: { source: 'model_authored', capturedAt: new Date(NOW_MS).toISOString() },
    });
    expect(parsed.success).toBe(false);
  });
});

describe('runtime labeling', () => {
  it('labels only the Claude and Codex runtimes with a locator contract', () => {
    expect(detectHistoryRuntime(undefined)).toBe('claude');
    expect(detectHistoryRuntime('claude')).toBe('claude');
    expect(detectHistoryRuntime('codex')).toBe('codex');
    expect(detectHistoryRuntime('devin')).toBeNull();
    expect(detectHistoryRuntime('opencode')).toBeNull();
    expect(detectHistoryRuntime('cursor')).toBeNull();
  });
});

describe('history locator session id shape', () => {
  it.each([
    ['a forward path separator', 'session/other'],
    ['a backward path separator', 'session\\other'],
    ['a parent segment', '..'],
    ['an embedded parent segment', 'session..other'],
    ['a newline control character', 'session\nother'],
    ['a NUL control character', 'session\u0000other'],
  ])('rejects a session id that carries %s', (_label, sessionId) => {
    expect(HistoryLocatorSchema.safeParse(validLocator({ sessionId })).success).toBe(false);
  });

  it('accepts a session id with a space and a quote because the command quotes it', () => {
    expect(HistoryLocatorSchema.safeParse(validLocator({ sessionId: "session one's id" })).success).toBe(true);
  });

  it('bounds the session id by its quoted length', () => {
    const plainAtBound = 'a'.repeat(HISTORY_LOOKUP_MAX_QUOTED_SESSION_ID - 2);
    const quoteDenseAbove = "'".repeat((HISTORY_LOOKUP_MAX_QUOTED_SESSION_ID - 2) / 4 + 1);

    expect(HistoryLocatorSchema.safeParse(validLocator({ sessionId: plainAtBound })).success).toBe(true);
    expect(HistoryLocatorSchema.safeParse(validLocator({ sessionId: plainAtBound + 'a' })).success).toBe(false);
    expect(HistoryLocatorSchema.safeParse(validLocator({ sessionId: quoteDenseAbove })).success).toBe(false);
  });

  // The schema keeps its own copy of the offer's bound, because the runtime builds before this
  // engine and cannot import it. This sweep fails as soon as the two copies disagree.
  it('admits exactly the session ids the lookup offer can print', () => {
    for (let quotes = 0; quotes <= 4; quotes += 1) {
      for (let plain = 50; plain <= 70; plain += 1) {
        const sessionId = `${"'".repeat(quotes)}${'a'.repeat(plain)}`;
        expect(HistoryLocatorSchema.safeParse(validLocator({ sessionId })).success, sessionId)
          .toBe(fitsHistoryLookupOffer(sessionId));
      }
    }
  });

  it('accepts the prefixed UUID shape that DSH issues', () => {
    const dshId = 'session-41989989-4ae8-42c5-9e7b-1ac1cd04587b';
    expect(HistoryLocatorSchema.safeParse(validLocator({ sessionId: dshId })).success).toBe(true);
  });
});

describe('history lookup offer runtime label', () => {
  // The label is printed unquoted, so the offer checks its shape. Every runtime the schema
  // names must pass that check, or its senders would silently lose the offer.
  it('offers every schema runtime and withholds a label that would be shell syntax', () => {
    const target = { sessionId: 's1', handle: `hl1_${'0'.repeat(32)}`, locatorKind: 'transcript_path', workspace: WORKSPACE };
    for (const runtime of Object.keys(HISTORY_LOCATOR_KINDS)) {
      expect(isHistoryLookupRuntime(runtime), runtime).toBe(true);
      expect(buildHistoryLookupSection({ ...target, runtime }, true), runtime).not.toBeNull();
    }
    expect(buildHistoryLookupSection({ ...target, runtime: 'codex;touch /tmp/x' }, true)).toBeNull();
    expect(buildHistoryLookupSection({ ...target, runtime: '$(id)' }, true)).toBeNull();
  });
});

describe('history locator workspace shape', () => {
  it.each([
    ['a relative path', 'relative/workspace'],
    ['a bare relative name', 'workspace'],
    ['a newline control character', '/workspace\nother'],
    ['a NUL control character', '/workspace\u0000other'],
  ])('rejects a workspace that carries %s', (_label, workspace) => {
    expect(HistoryLocatorSchema.safeParse(validLocator({ workspace })).success).toBe(false);
  });
});

describe('history locator session folder shape', () => {
  it('accepts a session folder below the workspace and rejects one beside or equal to it', () => {
    const base = validLocator({});
    const below = `${base.workspace}/packages/app`;
    expect(HistoryLocatorSchema.safeParse({ ...base, sessionDirectory: below }).success).toBe(true);
    expect(HistoryLocatorSchema.safeParse({ ...base, sessionDirectory: base.workspace }).success).toBe(false);
    expect(HistoryLocatorSchema.safeParse({ ...base, sessionDirectory: `${base.workspace}-other` }).success).toBe(false);
    expect(HistoryLocatorSchema.safeParse({ ...base, sessionDirectory: 'relative/app' }).success).toBe(false);
  });
});

describe('lookup placement', () => {
  it('keys a session by the nearest checkout root that can run the CLI', () => {
    const sub = join(WORKSPACE, 'packages', 'app');
    mkdirSync(sub, { recursive: true });
    expect(placeLookup(WORKSPACE)).toEqual({ workspace: WORKSPACE });
    expect(placeLookup(sub)).toEqual({ workspace: WORKSPACE, sessionDirectory: sub });
  });

  it('places nothing for a nested repository without the CLI or a folder outside any checkout', () => {
    const nested = join(WORKSPACE, 'vendor', 'lib');
    mkdirSync(join(nested, '.git'), { recursive: true });
    expect(placeLookup(join(nested))).toBeNull();
    const outside = mkdtempSync(join(tmpdir(), 'history-outside-'));
    try {
      expect(placeLookup(outside)).toBeNull();
    } finally {
      rmSync(outside, { recursive: true, force: true });
    }
  });
});

describe('locator clearing', () => {
  it('keeps the locator when the cache is cleared so the offered command stays redeemable', () => {
    const sessionId = 'history-locator-clear';
    const timestamp = new Date(NOW_MS).toISOString();
    const locator = seededLocator(sessionId, timestamp);

    expect(updateState(sessionId, {
      pendingCompactPrime: { payload: 'cache', cachedAt: timestamp },
      historyLocator: locator,
    }).persisted).toBe(true);

    expect(clearCompactPrime(sessionId)).not.toBeNull();

    const state = loadState(sessionId);
    expect(state.ok).toBe(true);
    if (!state.ok) throw new Error('expected persisted state');
    expect(state.state.pendingCompactPrime).toBeNull();
    expect(state.state.historyLocator).not.toBeNull();
  });

  it('skips the clear when the cache identity changed', () => {
    const sessionId = 'history-locator-identity';
    const timestamp = new Date(NOW_MS).toISOString();
    expect(updateState(sessionId, {
      pendingCompactPrime: { payload: 'cache', cachedAt: timestamp },
      historyLocator: seededLocator(sessionId, timestamp),
    }).persisted).toBe(true);
    const before = loadState(sessionId);
    if (!before.ok || !before.state.pendingCompactPrime) throw new Error('expected seeded cache');

    const newerTimestamp = new Date(NOW_MS + 5_000).toISOString();
    updateState(sessionId, {
      pendingCompactPrime: { payload: 'newer cache', cachedAt: newerTimestamp },
    });

    expect(clearCompactPrime(sessionId, {
      cachedAt: timestamp,
      opaqueId: before.state.pendingCompactPrime.opaqueId ?? null,
    })).toBeNull();

    const after = loadState(sessionId);
    expect(after.ok).toBe(true);
    if (!after.ok) throw new Error('expected persisted state');
    expect(after.state.pendingCompactPrime?.payload).toBe('newer cache');
    expect(after.state.historyLocator).not.toBeNull();
  });
});

describe('locator persistence result', () => {
  const target = { workspace: process.cwd(), handle: 'hl1_0123456789abcdef0123456789abcdef' };

  it('counts a write only when the stored locator keeps the minted handle', () => {
    expect(persistHistoryLocator(target, () => ({
      persisted: true,
      merged: { historyLocator: { handle: target.handle } },
    }))).toBe(true);
  });

  it('reports a locator the state schema dropped as not persisted', () => {
    expect(persistHistoryLocator(target, () => ({
      persisted: true,
      merged: { historyLocator: null },
    }))).toBe(false);
  });
});

describe('recovery section budget', () => {
  it('never returns more bytes than the budget, even when the kept sections overflow it', () => {
    expect(Buffer.byteLength(fitRecoverySections(`## S\n${'s'.repeat(10_000)}`, [], 10), 'utf8')).toBeLessThanOrEqual(10);
    expect(Buffer.byteLength(fitRecoverySections(null, ['k'.repeat(50)], 10), 'utf8')).toBeLessThanOrEqual(10);
    expect(Buffer.byteLength(fitRecoverySections('## S\nsummary', ['k'.repeat(50)], 20), 'utf8')).toBeLessThanOrEqual(20);
  });
});
