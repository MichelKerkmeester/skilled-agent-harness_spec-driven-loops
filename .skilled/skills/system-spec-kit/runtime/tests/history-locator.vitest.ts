// ───────────────────────────────────────────────────────────────────
// MODULE: History Locator Contract
// ───────────────────────────────────────────────────────────────────
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, afterEach, describe, expect, it } from 'vitest';

import {
  HISTORY_LOCATOR_VERSION,
  HistoryLocatorSchema,
  clearCompactPrime,
  detectHistoryRuntime,
  ensureStateDir,
  getStatePath,
  loadState,
  updateState,
  type HistoryLocator,
} from '../hooks/claude/hook-state.js';
import {
  mintHistoryLocator,
  persistCompactResult,
  type CompactResult,
} from '../hooks/claude/compact-inject.js';
import { buildHistoryLookupSection } from '../hooks/claude/session-prime.js';
import {
  HISTORY_LOOKUP_MAX_CHARS,
  HISTORY_LOOKUP_MAX_QUOTED_SESSION_ID,
  buildHistoryLookupSection as buildAdapterLookupSection,
  fitRecoverySections,
  placeLookup,
  shellQuote,
} from '../hooks/lib/history/lookup-offer.js';
import { persistHistoryLocator } from '../hooks/lib/history/locator-digest.js';
import { checkoutRoot } from './_support/history-fixtures.js';
import { createSharedPayloadEnvelope } from '../lib/context/shared-payload.js';
import {
  CANONICAL_FOLD_VERSION,
  getUnicodeRuntimeFingerprint,
} from '../cli/lib/unicode-normalization';

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

function compactResult(text: string): CompactResult {
  const generatedAt = new Date(NOW_MS).toISOString();
  return {
    text,
    payloadContract: createSharedPayloadEnvelope({
      kind: 'compaction',
      sections: [{ key: 'test', title: 'Test Compact Context', content: text, source: 'session' }],
      summary: 'Test compact payload',
      provenance: {
        producer: 'compact_merger',
        sourceSurface: 'test-compact-cache',
        trustState: 'cached',
        generatedAt,
        lastUpdated: null,
        sourceRefs: ['test-compact-cache', 'hook-state'],
        sanitizerVersion: CANONICAL_FOLD_VERSION,
        runtimeFingerprint: getUnicodeRuntimeFingerprint(),
      },
    }),
  };
}

function expectation(overrides: Partial<Parameters<typeof buildHistoryLookupSection>[1]> = {}) {
  return {
    sessionId: 'session-one',
    runtime: 'claude' as const,
    workspace: WORKSPACE,
    provenanceSource: 'precompact' as const,
    nowMs: NOW_MS,
    ...overrides,
  };
}

const TEST_SESSION_IDS = [
  'history-locator-schema',
  'history-locator-persist',
  'history-locator-clear',
  'history-locator-identity',
  'history-locator-legacy',
  'history-locator-malformed',
];

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

describe('mintHistoryLocator', () => {
  let root: string;

  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it('mints an opaque handle from the validated Claude transcript path', () => {
    root = mkdtempSync(join(tmpdir(), 'history-locator-mint-'));
    const sessionId = 'session-one';
    const transcriptPath = join(root, `${sessionId}.jsonl`);
    writeFileSync(transcriptPath, `${JSON.stringify({ type: 'user', message: { content: 'hello' } })}\n`);

    const locator = mintHistoryLocator({
      sessionId,
      transcriptPath,
      workspace: WORKSPACE,
      runtime: 'claude',
      mintedAt: new Date(NOW_MS).toISOString(),
    });

    expect(locator).not.toBeNull();
    expect(HistoryLocatorSchema.safeParse(locator).success).toBe(true);
    expect(locator!.version).toBe(HISTORY_LOCATOR_VERSION);
    expect(locator!.runtime).toBe('claude');
    expect(locator!.locatorKind).toBe('transcript_path');
    expect(locator!.handle).toMatch(/^hl1_[a-f0-9]{32}$/);
    expect(locator!.handle).not.toContain(root);
    expect(locator!.handle).not.toContain(transcriptPath);
    expect(locator!.provenance.source).toBe('precompact');
  });

  it('accepts a Codex rollout name that ends with the exact session id', () => {
    root = mkdtempSync(join(tmpdir(), 'history-locator-codex-'));
    const sessionId = 'codex-session';
    const transcriptPath = join(root, `rollout-2026-11-07T12-00-00-${sessionId}.jsonl`);
    writeFileSync(transcriptPath, '{}\n');

    const locator = mintHistoryLocator({
      sessionId,
      transcriptPath,
      workspace: WORKSPACE,
      runtime: 'codex',
      mintedAt: new Date(NOW_MS).toISOString(),
    });

    expect(locator).not.toBeNull();
    expect(HistoryLocatorSchema.safeParse(locator).success).toBe(true);
    expect(locator!.runtime).toBe('codex');
    expect(locator!.locatorKind).toBe('transcript_path');
  });

  it('does not mint when the transcript path is absent, empty or unreadable', () => {
    expect(mintHistoryLocator({
      sessionId: 'session-one', transcriptPath: undefined, workspace: WORKSPACE, runtime: 'claude',
    })).toBeNull();
    expect(mintHistoryLocator({
      sessionId: 'session-one', transcriptPath: '', workspace: WORKSPACE, runtime: 'claude',
    })).toBeNull();
    expect(mintHistoryLocator({
      sessionId: 'session-one', transcriptPath: join(tmpdir(), 'missing-transcript.jsonl'), workspace: WORKSPACE, runtime: 'claude',
    })).toBeNull();
  });

  it('does not mint when the transcript belongs to another session', () => {
    root = mkdtempSync(join(tmpdir(), 'history-locator-mismatch-'));
    const transcriptPath = join(root, 'other-session.jsonl');
    writeFileSync(transcriptPath, '{}\n');

    expect(mintHistoryLocator({
      sessionId: 'session-one', transcriptPath, workspace: WORKSPACE, runtime: 'claude',
    })).toBeNull();
  });
});

describe('PreCompact persistence', () => {
  it('writes the locator beside the compact cache in one state update', () => {
    const sessionId = 'history-locator-persist';
    const timestamp = new Date(NOW_MS).toISOString();
    const locator = validLocator({ sessionId, mintedAt: timestamp, provenance: { source: 'precompact', capturedAt: timestamp } });

    expect(persistCompactResult(sessionId, compactResult('## Active Files\n- /test.ts'), timestamp, locator)).toBe(true);

    const state = loadState(sessionId);
    expect(state.ok).toBe(true);
    if (!state.ok) throw new Error('expected persisted state');
    expect(state.state.pendingCompactPrime?.cachedAt).toBe(timestamp);
    expect(state.state.historyLocator?.handle).toBe(locator.handle);
    expect(state.state.historyLocator?.sessionId).toBe(sessionId);
  });

  it('keeps a subfolder session locator where the session-start hook and the CLI each read it', () => {
    const sessionId = 'history-locator-subfolder';
    const folder = join(WORKSPACE, 'packages', 'app');
    mkdirSync(folder, { recursive: true });
    const transcriptPath = join(folder, `${sessionId}.jsonl`);
    writeFileSync(transcriptPath, '');
    const timestamp = new Date().toISOString();
    const previous = process.cwd();
    process.chdir(folder);
    try {
      ensureStateDir();
      const locator = mintHistoryLocator({ sessionId, transcriptPath, workspace: folder, runtime: 'claude', mintedAt: timestamp });
      expect(locator?.workspace).toBe(WORKSPACE);
      expect(locator?.sessionDirectory).toBe(folder);
      expect(persistCompactResult(sessionId, compactResult('summary'), timestamp, locator)).toBe(true);

      // The session-start hook runs in the session folder and offers from its copy.
      const folderState = loadState(sessionId);
      if (!folderState.ok) throw new Error('expected the session folder copy');
      const offer = buildHistoryLookupSection(folderState.state.historyLocator, {
        sessionId,
        runtime: 'claude',
        workspace: placeLookup(process.cwd())?.workspace ?? process.cwd(),
        provenanceSource: 'precompact',
      }, true);
      expect(offer?.content).toContain(`--handle '${locator?.handle}'`);
      rmSync(getStatePath(sessionId), { force: true });

      // The printed command runs the CLI from the checkout root, which reads the root copy.
      process.chdir(WORKSPACE);
      const rootState = loadState(sessionId);
      if (!rootState.ok) throw new Error('expected the checkout root copy');
      expect(rootState.state.historyLocator?.handle).toBe(locator?.handle);
      rmSync(getStatePath(sessionId), { force: true });
    } finally {
      process.chdir(previous);
    }
  });

  it('clears the locator when a later boundary has no transcript', () => {
    const sessionId = 'history-locator-persist';
    const timestamp = new Date(NOW_MS).toISOString();
    persistCompactResult(sessionId, compactResult('old'), timestamp, validLocator({
      sessionId,
      mintedAt: timestamp,
      provenance: { source: 'precompact', capturedAt: timestamp },
    }));

    const nextTimestamp = new Date(NOW_MS + 1_000).toISOString();
    expect(persistCompactResult(sessionId, compactResult('new'), nextTimestamp, null)).toBe(true);

    const state = loadState(sessionId);
    expect(state.ok).toBe(true);
    if (!state.ok) throw new Error('expected persisted state');
    expect(state.state.pendingCompactPrime?.cachedAt).toBe(nextTimestamp);
    expect(state.state.historyLocator).toBeNull();
  });

  it('reads a legacy state file that predates the locator field', () => {
    const sessionId = 'history-locator-legacy';
    const timestamp = new Date(NOW_MS).toISOString();
    writeFileSync(getStatePath(sessionId), JSON.stringify({
      claudeSessionId: sessionId,
      speckitSessionId: null,
      lastSpecFolder: null,
      sessionSummary: null,
      pendingCompactPrime: { payload: '## Active Files\n- /test.ts', cachedAt: timestamp },
      producerMetadata: null,
      metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
      createdAt: timestamp,
      updatedAt: timestamp,
    }));

    const state = loadState(sessionId);
    expect(state.ok).toBe(true);
    if (!state.ok) throw new Error('expected legacy state to load');
    expect(state.state.pendingCompactPrime).not.toBeNull();
    expect(state.state.historyLocator).toBeNull();
  });

  it('ignores a malformed locator without losing the compact summary', () => {
    const sessionId = 'history-locator-malformed';
    const timestamp = new Date(NOW_MS).toISOString();
    writeFileSync(getStatePath(sessionId), JSON.stringify({
      schemaVersion: 1,
      claudeSessionId: sessionId,
      speckitSessionId: null,
      lastSpecFolder: null,
      sessionSummary: null,
      pendingCompactPrime: { payload: '## Active Files\n- /test.ts', cachedAt: timestamp },
      historyLocator: { version: 99, runtime: 'claude' },
      producerMetadata: null,
      metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
      createdAt: timestamp,
      updatedAt: timestamp,
    }));

    const state = loadState(sessionId);
    expect(state.ok).toBe(true);
    if (!state.ok) throw new Error('expected state with a malformed locator to load');
    expect(state.state.pendingCompactPrime?.payload).toContain('Active Files');
    expect(state.state.historyLocator).toBeNull();
  });
});

describe('lookup offer', () => {
  it('offers one bounded section at 29:59 of the cache TTL', () => {
    const locator = validLocator();
    const section = buildHistoryLookupSection(
      locator,
      expectation({ nowMs: NOW_MS + 29 * 60 * 1000 + 59 * 1000 }),
      true,
    );

    expect(section).not.toBeNull();
    expect(section!.title).toBe('History Lookup');
    expect(section!.content).toContain(locator.handle);
    expect(section!.content).toContain(`load '{"historyIds":["<id>"]}'`);
    expect(section!.content.length).toBeLessThanOrEqual(600);
    expect(section!.content).not.toContain('transcript.jsonl');
  });

  it('rejects the locator at exactly 30:00', () => {
    expect(buildHistoryLookupSection(
      validLocator(),
      expectation({ nowMs: NOW_MS + 30 * 60 * 1000 }),
      true,
    )).toBeNull();
  });

  it('rejects a future timestamp as clock skew', () => {
    expect(buildHistoryLookupSection(
      validLocator(),
      expectation({ nowMs: NOW_MS - 1 }),
      true,
    )).toBeNull();
  });

  it('rejects a malformed locator', () => {
    expect(buildHistoryLookupSection(
      { ...validLocator(), handle: 'short' },
      expectation(),
      true,
    )).toBeNull();
  });

  it('rejects a runtime mismatch as a provenance failure', () => {
    expect(buildHistoryLookupSection(
      validLocator({ runtime: 'devin', locatorKind: 'transcript_file' }),
      expectation(),
      true,
    )).toBeNull();
  });

  it('rejects a provenance source mismatch', () => {
    expect(buildHistoryLookupSection(
      validLocator({ provenance: { source: 'post_compaction', capturedAt: new Date(NOW_MS).toISOString() } }),
      expectation(),
      true,
    )).toBeNull();
  });

  it('rejects a session mismatch', () => {
    expect(buildHistoryLookupSection(
      validLocator({ sessionId: 'another-session' }),
      expectation(),
      true,
    )).toBeNull();
  });

  it('rejects a workspace mismatch', () => {
    expect(buildHistoryLookupSection(
      validLocator({ workspace: '/other-workspace' }),
      expectation(),
      true,
    )).toBeNull();
  });

  it('emits no section when the reader capability is off', () => {
    expect(buildHistoryLookupSection(validLocator(), expectation(), false)).toBeNull();
  });

  it('keeps the full command when a quote-dense maximum-length id fills the offer', () => {
    const sessionId = "'".repeat((HISTORY_LOOKUP_MAX_QUOTED_SESSION_ID - 2) / 4);
    const handle = 'hl1_0123456789abcdef0123456789abcdef';
    const section = buildAdapterLookupSection(
      { runtime: 'pi', sessionId, handle, locatorKind: 'live_branch_or_session_log', workspace: WORKSPACE },
      true,
    );

    expect(section).not.toBeNull();
    expect(section!.length).toBeLessThanOrEqual(HISTORY_LOOKUP_MAX_CHARS);
    expect(section).toContain(`--session ${shellQuote(sessionId)}`);
    expect(section).toContain("--handle 'hl1_0123456789abcdef0123456789abcdef'");
    expect(section).toContain(`browse '{"direction":"backward"}'`);
  });

  it('withholds the Claude offer below the checkout root and outside a Skilled checkout', () => {
    const subfolder = join(WORKSPACE, 'packages', 'app');
    const bare = mkdtempSync(join(tmpdir(), 'history-bare-checkout-'));
    try {
      mkdirSync(join(bare, '.git'));
      for (const workspace of [subfolder, bare]) {
        expect(buildHistoryLookupSection(
          validLocator({ workspace }),
          expectation({ workspace }),
          true,
        )).toBeNull();
      }
      expect(buildHistoryLookupSection(validLocator(), expectation(), true)).not.toBeNull();
    } finally {
      rmSync(bare, { recursive: true, force: true });
    }
  });

  it('withholds the offer for a workspace below the checkout root', () => {
    const subfolder = join(WORKSPACE, 'packages', 'app');
    const locator = {
      runtime: 'pi',
      sessionId: 'pi-session',
      handle: 'hl1_0123456789abcdef0123456789abcdef',
      locatorKind: 'live_branch_or_session_log',
    };
    expect(buildAdapterLookupSection({ ...locator, workspace: WORKSPACE }, true)).not.toBeNull();
    expect(buildAdapterLookupSection({ ...locator, workspace: subfolder }, true)).toBeNull();
  });
});

describe('locator clearing', () => {
  it('keeps the locator when the cache is cleared so the offered command stays redeemable', () => {
    const sessionId = 'history-locator-clear';
    const timestamp = new Date(NOW_MS).toISOString();
    persistCompactResult(sessionId, compactResult('cache'), timestamp, validLocator({
      sessionId,
      mintedAt: timestamp,
      provenance: { source: 'precompact', capturedAt: timestamp },
    }));

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
    persistCompactResult(sessionId, compactResult('cache'), timestamp, validLocator({
      sessionId,
      mintedAt: timestamp,
      provenance: { source: 'precompact', capturedAt: timestamp },
    }));
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

  it('accepts the prefixed UUID shape that DSH issues', () => {
    const dshId = 'session-41989989-4ae8-42c5-9e7b-1ac1cd04587b';
    expect(HistoryLocatorSchema.safeParse(validLocator({ sessionId: dshId })).success).toBe(true);
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
