// ───────────────────────────────────────────────────────────────────
// MODULE: History Lookup After SessionStart
// ───────────────────────────────────────────────────────────────────
// SessionStart(compact) prints a redemption command and then clears the cache
// it came from. This proves the printed command still works afterwards, which
// is the whole point of the offer.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  mintHistoryLocator,
  persistCompactResult,
  type CompactResult,
} from '../hooks/claude/compact-inject.js';
import {
  ensureStateDir,
  getStatePath,
  loadState,
  updateState,
  type HistoryLocator,
} from '../hooks/claude/hook-state.js';
import { runSessionStartHook } from '../hooks/claude/session-prime.js';
import { runHistoryLookupCli } from '../hooks/lib/history/cli.js';
import { createSharedPayloadEnvelope } from '../lib/context/shared-payload.js';
import { checkoutRoot } from './_support/history-fixtures.js';
import {
  CANONICAL_FOLD_VERSION,
  getUnicodeRuntimeFingerprint,
} from '../cli/lib/unicode-normalization';

type Fixture = {
  home: string;
  transcriptPath: string;
};

const homes: string[] = [];
const sessions = new Set<string>();
const ORIGINAL_RUNTIME = process.env.SPECKIT_RUNTIME;

// The hooks and the CLI check the locator against the working folder, and the
// offer prints only at a checkout root, so each test runs inside one.
const WORKSPACE = checkoutRoot();
afterAll(() => rmSync(WORKSPACE, { recursive: true, force: true }));
let originalCwd = process.cwd();

beforeEach(() => {
  process.env.SPECKIT_RUNTIME = 'claude';
  originalCwd = process.cwd();
  process.chdir(WORKSPACE);
  ensureStateDir();
});

afterEach(() => {
  if (ORIGINAL_RUNTIME === undefined) {
    delete process.env.SPECKIT_RUNTIME;
  } else {
    process.env.SPECKIT_RUNTIME = ORIGINAL_RUNTIME;
  }
  for (const home of homes.splice(0)) {
    rmSync(home, { recursive: true, force: true });
  }
  for (const sessionId of sessions) {
    rmSync(getStatePath(sessionId), { force: true });
    rmSync(`${getStatePath(sessionId)}.bad`, { force: true });
  }
  sessions.clear();
  process.chdir(originalCwd);
});

function compactResult(text: string): CompactResult {
  const generatedAt = new Date().toISOString();
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

function transcriptLines(sessionId: string): unknown[] {
  return [
    {
      type: 'user',
      uuid: 'after-start-u1',
      sessionId,
      timestamp: '2026-11-07T12:00:00.000Z',
      message: {
        role: 'user',
        content: [{ type: 'text', text: 'Find the authenticate handler.' }],
      },
    },
    {
      type: 'assistant',
      uuid: 'after-start-a1',
      sessionId,
      timestamp: '2026-11-07T12:00:01.000Z',
      message: {
        role: 'assistant',
        content: [{ type: 'text', text: 'The authenticate handler is in src/auth.ts.' }],
      },
    },
  ];
}

function seedTranscript(label: string): {
  sessionId: string;
  fixture: Fixture;
  locator: HistoryLocator;
} {
  const sessionId = `history-after-start-${process.pid}-${label}`;
  sessions.add(sessionId);

  const home = mkdtempSync(join(tmpdir(), 'history-after-session-start-'));
  homes.push(home);

  const workspace = process.cwd();
  const transcriptPath = join(
    home,
    '.claude',
    'projects',
    workspace.replace(/[^A-Za-z0-9]/g, '-'),
    `${sessionId}.jsonl`,
  );
  mkdirSync(dirname(transcriptPath), { recursive: true });
  writeFileSync(
    transcriptPath,
    `${transcriptLines(sessionId).map((line) => JSON.stringify(line)).join('\n')}\n`,
    'utf-8',
  );

  const timestamp = new Date().toISOString();
  const locator = mintHistoryLocator({
    sessionId,
    transcriptPath,
    workspace,
    runtime: 'claude',
    mintedAt: timestamp,
  });
  if (!locator) throw new Error('history lookup fixture could not mint a locator');

  return { sessionId, fixture: { home, transcriptPath }, locator };
}

function seedSession(label: string): { sessionId: string; fixture: Fixture } {
  const { sessionId, fixture, locator } = seedTranscript(label);
  if (!persistCompactResult(sessionId, compactResult('## Active Files\n- /test.ts'), locator.mintedAt, locator)) {
    throw new Error('history lookup fixture could not persist the compact result');
  }

  return { sessionId, fixture };
}

describe('history lookup after SessionStart(compact)', () => {
  it('keeps the locator after the cache clear and redeems the printed command', async () => {
    const { sessionId, fixture } = seedSession('redeem');
    const seeded = loadState(sessionId);
    if (!seeded.ok || !seeded.state.historyLocator) throw new Error('expected seeded locator');

    let output = '';
    await runSessionStartHook(
      { source: 'compact', session_id: sessionId },
      async (text) => { output = text; },
    );

    expect(output).toContain('History Lookup');
    expect(output).toContain(`--session '${sessionId}'`);
    expect(output).toContain(`--handle '${seeded.state.historyLocator.handle}'`);

    const afterHook = loadState(sessionId);
    expect(afterHook.ok).toBe(true);
    if (!afterHook.ok) throw new Error('expected persisted state after SessionStart');
    expect(afterHook.state.pendingCompactPrime).toBeNull();
    expect(afterHook.state.historyLocator?.handle).toBe(seeded.state.historyLocator.handle);

    let cliOutput = '';
    const exitCode = await runHistoryLookupCli(
      [
        '--session', sessionId,
        '--handle', seeded.state.historyLocator.handle,
        'search',
        JSON.stringify({ query: 'authenticate' }),
      ],
      { home: fixture.home, nowMs: Date.now(), runtime: 'claude' },
      (text) => { cliOutput += text; },
    );

    expect(cliOutput).not.toContain('locator_missing');
    expect(exitCode).toBe(0);
    const reply = JSON.parse(cliOutput.trim()) as { content?: Array<{ text?: string }> };
    expect(reply.content?.length).toBeGreaterThan(0);
  });

  it('keeps a fresh locator when SessionStart(compact) runs with no cached payload', async () => {
    const { sessionId, fixture, locator } = seedTranscript('no-cache');
    expect(updateState(sessionId, { historyLocator: locator }).persisted).toBe(true);

    let output = '';
    await runSessionStartHook(
      { source: 'compact', session_id: sessionId },
      async (text) => { output = text; },
    );

    expect(output).toContain('/speckit:resume');

    const afterHook = loadState(sessionId);
    expect(afterHook.ok).toBe(true);
    if (!afterHook.ok) throw new Error('expected persisted state after SessionStart');
    expect(afterHook.state.pendingCompactPrime).toBeNull();
    expect(afterHook.state.historyLocator?.handle).toBe(locator.handle);

    let cliOutput = '';
    const exitCode = await runHistoryLookupCli(
      [
        '--session', sessionId,
        '--handle', locator.handle,
        'search',
        JSON.stringify({ query: 'authenticate' }),
      ],
      { home: fixture.home, nowMs: Date.now(), runtime: 'claude' },
      (text) => { cliOutput += text; },
    );

    expect(cliOutput).not.toContain('locator_missing');
    expect(exitCode).toBe(0);
    const reply = JSON.parse(cliOutput.trim()) as { content?: Array<{ text?: string }> };
    expect(reply.content?.length).toBeGreaterThan(0);
  });
});
