// ───────────────────────────────────────────────────────────────────
// MODULE: History Lookup CLI
// ───────────────────────────────────────────────────────────────────
// The CLI is the model-facing redemption path for the opaque handle the
// compact boundary offers. These cases prove one reply per operation and
// every refusal gate, including that a call cannot mutate stored state.

import { mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';

import { dshProjectKey } from '../../../../hooks/shared/session-readers/dsh.mjs';
import { piProjectDirectory } from '../../../../hooks/shared/session-readers/pi.mjs';
import { mintHistoryLocator } from '../hooks/claude/compact-inject.js';
import {
  ensureStateDir,
  getStatePath,
  saveState,
  type HistoryLocator,
  type HookState,
} from '../hooks/claude/hook-state.js';
import { runHistoryLookupCli } from '../hooks/lib/history/cli.js';
import { mintHistoryLocator as mintDshLocator } from '../hooks/dsh/session-compact-context.mjs';
import { mintHistoryLocator as mintPiLocator } from '../hooks/pi/session-compact-context.js';
import { checkoutRoot } from './_support/history-fixtures.js';

const require = createRequire(import.meta.url);

interface DevinAdapter {
  mintHistoryLocator(sessionId: string, workspace: string, mintedAt: string): HistoryLocator | null;
}

const devin = require('../hooks/devin/post-compaction.cjs') as DevinAdapter;

const NOW_MS = Date.parse('2026-11-07T12:00:00.000Z');
// The locator schema bounds a session id to what the lookup offer can print,
// so fixture ids stay short; the pid keeps concurrent suites apart.
const SESSION_PREFIX = `hlc-${process.pid}`;

type Fixture = {
  home: string;
  transcriptPath: string;
  locator: HistoryLocator;
};

type LocatorFixture = {
  home: string;
  locator: HistoryLocator;
};

type CliResult = {
  exitCode: number;
  output: string;
};

const tempHomes: string[] = [];
const sessions = new Set<string>();
// The adapters key a locator by the checkout root above the session folder,
// so each case runs from a root the CLI can serve, as the printed command does.
const WORKSPACE = checkoutRoot();
const originalCwd = process.cwd();

beforeEach(() => {
  process.chdir(WORKSPACE);
  ensureStateDir();
});

afterEach(() => {
  for (const home of tempHomes.splice(0)) {
    rmSync(home, { recursive: true, force: true });
  }
  for (const sessionId of sessions) {
    try { rmSync(getStatePath(sessionId)); } catch { /* ok */ }
  }
  sessions.clear();
  process.chdir(originalCwd);
});

afterAll(() => {
  rmSync(WORKSPACE, { recursive: true, force: true });
});

function sessionIdFor(label: string): string {
  const sessionId = `${SESSION_PREFIX}-${label}`;
  sessions.add(sessionId);
  return sessionId;
}

function transcriptLines(sessionId: string): unknown[] {
  return [
    {
      type: 'user',
      uuid: 'lookup-u1',
      sessionId,
      timestamp: '2026-11-07T12:00:00.000Z',
      message: {
        role: 'user',
        content: [{ type: 'text', text: 'Find the authenticate handler in src/auth.ts.' }],
      },
    },
    {
      type: 'assistant',
      uuid: 'lookup-a1',
      sessionId,
      timestamp: '2026-11-07T12:00:01.000Z',
      message: {
        role: 'assistant',
        content: [
          { type: 'text', text: 'I will read src/auth.ts.' },
          { type: 'tool_use', id: 'lookup-call-auth', name: 'Read', input: { path: 'src/auth.ts' } },
        ],
      },
    },
    {
      type: 'user',
      uuid: 'lookup-r1',
      sessionId,
      timestamp: '2026-11-07T12:00:02.000Z',
      toolUseResult: { content: 'export function authenticate() { return true; }' },
      message: {
        role: 'user',
        content: [{
          type: 'tool_result',
          tool_use_id: 'lookup-call-auth',
          content: 'export function authenticate() { return true; }',
        }],
      },
    },
    {
      type: 'assistant',
      uuid: 'lookup-a2',
      sessionId,
      timestamp: '2026-11-07T12:00:03.000Z',
      message: {
        role: 'assistant',
        content: [{ type: 'text', text: 'The authenticate handler is in src/auth.ts.' }],
      },
    },
  ];
}

function createFixture(options: {
  label: string;
  workspace?: string;
  mintedAt?: string;
}): Fixture {
  const sessionId = sessionIdFor(options.label);
  const home = mkdtempSync(join(tmpdir(), 'history-lookup-cli-'));
  tempHomes.push(home);

  const workspace = options.workspace ?? process.cwd();
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

  const locator = mintHistoryLocator({
    sessionId,
    transcriptPath,
    workspace,
    runtime: 'claude',
    mintedAt: options.mintedAt ?? new Date(NOW_MS).toISOString(),
  });
  if (!locator) throw new Error('history lookup fixture could not mint a locator');

  return { home, transcriptPath, locator };
}

function saveLocator(sessionId: string, locator: HistoryLocator): void {
  const timestamp = new Date(NOW_MS).toISOString();
  const state: HookState = {
    claudeSessionId: sessionId,
    speckitSessionId: null,
    lastSpecFolder: null,
    sessionSummary: null,
    pendingCompactPrime: null,
    historyLocator: locator,
    producerMetadata: null,
    metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  expect(saveState(sessionId, state)).toBe(true);
}

function tempHome(): string {
  const home = mkdtempSync(join(tmpdir(), 'history-lookup-cli-'));
  tempHomes.push(home);
  return home;
}

function writeJson(filePath: string, value: unknown): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf-8');
}

function writeJsonl(filePath: string, lines: unknown[]): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${lines.map((line) => JSON.stringify(line)).join('\n')}\n`, 'utf-8');
}

function createPiFixture(label: string): LocatorFixture {
  const sessionId = sessionIdFor(label);
  const home = tempHome();
  const workspace = process.cwd();
  const directory = join(home, '.pi', 'agent', 'sessions', piProjectDirectory(workspace));
  writeJsonl(join(directory, `${NOW_MS}_${sessionId}.jsonl`), [
    {
      type: 'session',
      version: 3,
      id: sessionId,
      timestamp: new Date(NOW_MS).toISOString(),
      cwd: workspace,
    },
    {
      type: 'message',
      id: 'pi-u1',
      timestamp: new Date(NOW_MS + 1000).toISOString(),
      message: {
        role: 'user',
        content: [{ type: 'text', text: 'Find the authenticate handler in src/auth.ts.' }],
      },
    },
    {
      type: 'message',
      id: 'pi-a1',
      timestamp: new Date(NOW_MS + 2000).toISOString(),
      message: {
        role: 'assistant',
        content: [{ type: 'text', text: 'The authenticate handler is in src/auth.ts.' }],
      },
    },
  ]);

  const locator = mintPiLocator(sessionId, workspace, new Date(NOW_MS).toISOString());
  if (!locator) throw new Error('history lookup fixture could not mint a Pi locator');
  return { home, locator };
}

function createDevinFixture(label: string): LocatorFixture {
  const sessionId = sessionIdFor(label);
  const home = tempHome();
  const workspace = process.cwd();
  const dataDirectory = join(home, '.local', 'share', 'devin', 'cli');
  writeJson(join(dataDirectory, 'transcripts', `${sessionId}.json`), {
    schema_version: 'ATIF-v1.7',
    session_id: sessionId,
    steps: [
      {
        step_id: 1,
        timestamp: new Date(NOW_MS).toISOString(),
        source: 'user',
        message: 'Find the authenticate handler in src/auth.ts.',
      },
      {
        step_id: 2,
        timestamp: new Date(NOW_MS + 1000).toISOString(),
        source: 'agent',
        message: 'The authenticate handler is in src/auth.ts.',
      },
    ],
  });

  const database = new DatabaseSync(join(dataDirectory, 'sessions.db'));
  try {
    database.exec('CREATE TABLE sessions (id TEXT, working_directory TEXT, last_activity_at INTEGER)');
    database
      .prepare('INSERT INTO sessions (id, working_directory, last_activity_at) VALUES (?, ?, ?)')
      .run(sessionId, workspace, NOW_MS);
  } finally {
    database.close();
  }

  const locator = devin.mintHistoryLocator(sessionId, workspace, new Date(NOW_MS).toISOString());
  if (!locator) throw new Error('history lookup fixture could not mint a Devin locator');
  return { home, locator };
}

function createDshFixture(label: string, sessionFolder = process.cwd()): LocatorFixture {
  const sessionId = sessionIdFor(label);
  const home = tempHome();
  const workspace = sessionFolder;
  const directory = join(home, '.dsh', 'sessions', dshProjectKey(workspace), sessionId);
  writeJsonl(join(directory, 'session.v1.jsonl'), [
    {
      type: 'session',
      version: 4,
      id: sessionId,
      timestamp: new Date(NOW_MS).toISOString(),
      cwd: workspace,
    },
    {
      type: 'user/message',
      seq: 1,
      data: {
        role: 'user',
        id: 'dsh-u1',
        source: { kind: 'user' },
        content: [{ type: 'text', text: 'Find the authenticate handler in src/auth.ts.' }],
      },
    },
    {
      type: 'assistant/message',
      seq: 2,
      data: {
        turn: 1,
        step: 1,
        message: {
          role: 'assistant',
          id: 'dsh-a1',
          content: [{ type: 'text', text: 'The authenticate handler is in src/auth.ts.' }],
        },
      },
    },
  ]);

  const locator = mintDshLocator(sessionId, workspace, new Date(NOW_MS).toISOString());
  if (!locator) throw new Error('history lookup fixture could not mint a DSH locator');
  return { home, locator };
}

// The caller still holds the handle; only the state file is replaced, so this
// exercises the digest recomputation rather than the cheap local comparison.
function writeRawLocator(sessionId: string, locator: unknown): void {
  const statePath = getStatePath(sessionId);
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, JSON.stringify({ claudeSessionId: sessionId, historyLocator: locator }), 'utf-8');
}

async function invoke(
  fixture: LocatorFixture,
  operation: string,
  operationArgs?: unknown,
  overrides: {
    handle?: string;
    sessionId?: string;
    runtime?: HistoryLocator['runtime'] | null;
    nowMs?: number;
    env?: Record<string, string | undefined>;
  } = {},
): Promise<CliResult> {
  const argv = [
    '--session', overrides.sessionId ?? fixture.locator.sessionId,
    '--handle', overrides.handle ?? fixture.locator.handle,
    operation,
  ];
  if (operationArgs !== undefined) argv.push(JSON.stringify(operationArgs));

  let output = '';
  const exitCode = await runHistoryLookupCli(
    argv,
    {
      home: fixture.home,
      nowMs: overrides.nowMs ?? NOW_MS,
      runtime: overrides.runtime === undefined ? fixture.locator.runtime : overrides.runtime,
      env: overrides.env ?? { HOME: fixture.home },
    },
    (text) => { output += text; },
  );
  return { exitCode, output };
}

function replyFrom(result: CliResult): { content: { type: string; text: string }[] } {
  expect(result.exitCode).toBe(0);
  return JSON.parse(result.output.trim()) as { content: { type: string; text: string }[] };
}

function payloadFrom(result: CliResult): Record<string, unknown> {
  const reply = replyFrom(result);
  const first = reply.content[0];
  if (!first) throw new Error('history lookup reply had no content');
  return JSON.parse(first.text) as Record<string, unknown>;
}

function expectRefusal(result: CliResult, code: string): void {
  expect(result.exitCode).toBe(2);
  const lines = result.output.trim().split('\n');
  expect(lines).toHaveLength(1);
  expect(JSON.parse(lines[0] ?? '{}')).toEqual({ ok: false, code });
}

function snapshotTree(root: string): Map<string, string> {
  const snapshot = new Map<string, string>();
  for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const directory = (entry as unknown as { parentPath?: string }).parentPath
      ?? (entry as unknown as { path?: string }).path
      ?? root;
    const filePath = join(directory, entry.name);
    const stats = statSync(filePath);
    snapshot.set(filePath, `${stats.size}:${stats.mtimeMs}:${stats.ino}`);
  }
  return snapshot;
}

describe('history lookup CLI', () => {
  it('prints the search reply for a fresh matching locator', async () => {
    const fixture = createFixture({ label: 'search' });
    saveLocator(fixture.locator.sessionId, fixture.locator);

    const payload = payloadFrom(await invoke(fixture, 'search', { query: 'authenticate' }));
    const references = payload.references as Array<Record<string, unknown>>;

    expect(references.length).toBeGreaterThan(0);
    expect(references.some((reference) => reference.preview === undefined
      || String(reference.preview).includes('authenticate'))).toBe(true);
  });

  it('prints the browse reply for a fresh matching locator', async () => {
    const fixture = createFixture({ label: 'browse' });
    saveLocator(fixture.locator.sessionId, fixture.locator);

    const payload = payloadFrom(await invoke(fixture, 'browse', { direction: 'backward', count: 2 }));
    expect(payload.references as unknown[]).toHaveLength(2);
  });

  it('prints the load reply for a fresh matching locator', async () => {
    const fixture = createFixture({ label: 'load' });
    saveLocator(fixture.locator.sessionId, fixture.locator);

    const payload = payloadFrom(await invoke(fixture, 'load', ['lookup-a1']));
    const items = payload.items as Array<Record<string, unknown>>;
    expect(items[0]?.id).toBe('lookup-a1');
  });

  it('prints the page reply for a fresh matching locator', async () => {
    const fixture = createFixture({ label: 'page' });
    saveLocator(fixture.locator.sessionId, fixture.locator);

    const reply = replyFrom(await invoke(fixture, 'page', {
      historyId: 'lookup-u1',
      part: '/userMessage/content/0',
      mode: 'text',
    }));
    const header = JSON.parse(reply.content[0]?.text ?? '{}') as Record<string, unknown>;
    expect(header.historyId).toBe('lookup-u1');
    expect(reply.content[1]?.text).toContain('authenticate handler');
  });

  it('refuses a handle that does not match the stored locator', async () => {
    const fixture = createFixture({ label: 'wrong-handle' });
    saveLocator(fixture.locator.sessionId, fixture.locator);

    expectRefusal(
      await invoke(fixture, 'search', { query: 'authenticate' }, { handle: `hl1_${'0'.repeat(32)}` }),
      'handle_mismatch',
    );
  });

  it('refuses a forged handle that survives every local gate but not the digest', async () => {
    const fixture = createFixture({ label: 'forged-digest' });
    const forged = { ...fixture.locator, handle: `hl1_${'a'.repeat(32)}` };
    saveLocator(fixture.locator.sessionId, forged);

    expectRefusal(
      await invoke(fixture, 'search', { query: 'authenticate' }, { handle: forged.handle }),
      'handle_mismatch',
    );
  });

  it('refuses a locator whose own session id differs from the requested session', async () => {
    const fixture = createFixture({ label: 'wrong-session' });
    const requestedSession = sessionIdFor('wrong-session-request');
    saveLocator(requestedSession, fixture.locator);

    expectRefusal(
      await invoke(fixture, 'search', { query: 'authenticate' }, { sessionId: requestedSession }),
      'session_mismatch',
    );
  });

  it('refuses a locator minted for another workspace', async () => {
    // A folder outside any checkout mints no locator, so a stored one is moved.
    const fixture = createFixture({ label: 'wrong-workspace' });
    saveLocator(fixture.locator.sessionId, { ...fixture.locator, workspace: '/tmp/history-lookup-other-project' });

    expectRefusal(await invoke(fixture, 'search', { query: 'authenticate' }), 'workspace_mismatch');
  });

  it('refuses a locator at or past the 30-minute TTL', async () => {
    const fixture = createFixture({
      label: 'stale',
      mintedAt: new Date(NOW_MS - 31 * 60 * 1000).toISOString(),
    });
    saveLocator(fixture.locator.sessionId, fixture.locator);

    expectRefusal(await invoke(fixture, 'search', { query: 'authenticate' }), 'locator_stale');
  });

  it('refuses when no hook state exists for the session', async () => {
    const fixture = createFixture({ label: 'missing-state' });

    expectRefusal(await invoke(fixture, 'search', { query: 'authenticate' }), 'state_missing');
  });

  it('refuses when the host has no locator runtime', async () => {
    const fixture = createFixture({ label: 'unsupported-runtime' });
    saveLocator(fixture.locator.sessionId, fixture.locator);

    expectRefusal(
      await invoke(fixture, 'search', { query: 'authenticate' }, { runtime: null }),
      'unsupported_runtime',
    );
  });

  it('accepts a workspace recorded through a symlink to the current directory', async () => {
    const linkRoot = mkdtempSync(join(tmpdir(), 'history-cli-link-'));
    const linkedWorkspace = join(linkRoot, 'workspace');
    symlinkSync(process.cwd(), linkedWorkspace);
    try {
      const fixture = createFixture({ label: 'symlinked-workspace', workspace: linkedWorkspace });
      saveLocator(fixture.locator.sessionId, fixture.locator);

      const result = await invoke(fixture, 'search', { query: 'authenticate' });
      expect(result.output).not.toContain('workspace_mismatch');
      expect(result.exitCode).toBe(0);
    } finally {
      rmSync(linkRoot, { recursive: true, force: true });
    }
  });

  it('refuses an unsupported runtime before looking for hook state', async () => {
    const fixture = createFixture({ label: 'unsupported-no-state' });

    expectRefusal(
      await invoke(fixture, 'search', { query: 'authenticate' }, { runtime: null }),
      'unsupported_runtime',
    );
  });

  it('does not change the state file or transcript during a call', async () => {
    const fixture = createFixture({ label: 'read-only' });
    saveLocator(fixture.locator.sessionId, fixture.locator);

    const statePath = getStatePath(fixture.locator.sessionId);
    const beforeHome = snapshotTree(fixture.home);
    const beforeState = statSync(statePath);
    const beforeTranscript = statSync(fixture.transcriptPath);

    expect((await invoke(fixture, 'search', { query: 'authenticate' })).exitCode).toBe(0);

    const afterState = statSync(statePath);
    const afterTranscript = statSync(fixture.transcriptPath);
    expect(`${afterState.size}:${afterState.mtimeMs}:${afterState.ino}`)
      .toBe(`${beforeState.size}:${beforeState.mtimeMs}:${beforeState.ino}`);
    expect(`${afterTranscript.size}:${afterTranscript.mtimeMs}:${afterTranscript.ino}`)
      .toBe(`${beforeTranscript.size}:${beforeTranscript.mtimeMs}:${beforeTranscript.ino}`);
    expect(snapshotTree(fixture.home)).toEqual(beforeHome);
  });
});

describe('history lookup CLI for a session started in a subfolder', () => {
  it('redeems from the checkout root and reads the session where it ran', async () => {
    const folder = join(WORKSPACE, 'packages', 'app');
    mkdirSync(folder, { recursive: true });
    const fixture = createDshFixture('dsh-subfolder', folder);
    expect(fixture.locator.workspace).toBe(WORKSPACE);
    expect(fixture.locator.sessionDirectory).toBe(folder);
    saveLocator(fixture.locator.sessionId, fixture.locator);

    const payload = payloadFrom(await invoke(fixture, 'search', { query: 'authenticate' }, { runtime: 'dsh' }));
    expect((payload.references as unknown[]).length).toBeGreaterThan(0);
  });

  it('refuses a locator whose session folder was swapped after minting', async () => {
    const folder = join(WORKSPACE, 'packages', 'app');
    const other = join(WORKSPACE, 'packages', 'other');
    mkdirSync(folder, { recursive: true });
    mkdirSync(other, { recursive: true });
    const fixture = createDshFixture('dsh-swapped-folder', folder);
    saveLocator(fixture.locator.sessionId, { ...fixture.locator, sessionDirectory: other });

    const result = await invoke(fixture, 'search', { query: 'authenticate' }, { runtime: 'dsh' });
    expect(result.exitCode).toBe(2);
    expect(result.output).toMatch(/session_not_found|session_mismatch|handle_mismatch/);
  });
});

describe('history lookup CLI on a Devin store', () => {
  it('prints the search reply for the exact adapter-minted Devin locator', async () => {
    const fixture = createDevinFixture('devin-ready');
    saveLocator(fixture.locator.sessionId, fixture.locator);

    const payload = payloadFrom(await invoke(fixture, 'search', { query: 'authenticate' }, { runtime: 'devin' }));
    expect((payload.references as unknown[]).length).toBeGreaterThan(0);
  });
});

describe.each([
  ['pi', createPiFixture],
  ['dsh', createDshFixture],
] as const)('history lookup CLI on %s fixtures', (runtime, createStoreFixture) => {
  it('prints the search reply for the exact adapter-minted locator', async () => {
    const fixture = createStoreFixture(`${runtime}-happy`);
    saveLocator(fixture.locator.sessionId, fixture.locator);

    const payload = payloadFrom(await invoke(fixture, 'search', { query: 'authenticate' }, { runtime }));
    const references = payload.references as Array<Record<string, unknown>>;

    expect(references.length).toBeGreaterThan(0);
    expect(references.some((reference) => reference.preview === undefined
      || String(reference.preview).includes('authenticate'))).toBe(true);
  });

  it('refuses a forged handle at the digest check', async () => {
    const fixture = createStoreFixture(`${runtime}-wrong-handle`);
    const forged = { ...fixture.locator, handle: `hl1_${'a'.repeat(32)}` };
    saveLocator(fixture.locator.sessionId, forged);

    expectRefusal(
      await invoke(fixture, 'search', { query: 'authenticate' }, { runtime, handle: forged.handle }),
      'handle_mismatch',
    );
  });

  it('refuses a locator saved under a different session', async () => {
    const fixture = createStoreFixture(`${runtime}-wrong-session`);
    const requestedSession = sessionIdFor(`${runtime}-wrong-session-req`);
    saveLocator(requestedSession, fixture.locator);

    expectRefusal(
      await invoke(fixture, 'search', { query: 'authenticate' }, { runtime, sessionId: requestedSession }),
      'session_mismatch',
    );
  });

  it('refuses a locator whose kind does not belong to the runtime', async () => {
    const fixture = createStoreFixture(`${runtime}-wrong-kind`);
    writeRawLocator(fixture.locator.sessionId, { ...fixture.locator, locatorKind: 'transcript_path' });

    expectRefusal(await invoke(fixture, 'search', { query: 'authenticate' }, { runtime }), 'locator_invalid');
  });
});

describe('history lookup CLI on a Pi store with duplicate session files', () => {
  it('passes the reader session_ambiguous refusal through', async () => {
    const fixture = createPiFixture('pi-ambiguous');
    saveLocator(fixture.locator.sessionId, fixture.locator);
    const directory = join(fixture.home, '.pi', 'agent', 'sessions', piProjectDirectory(process.cwd()));
    writeJsonl(join(directory, `${NOW_MS + 1000}_${fixture.locator.sessionId}.jsonl`), [
      {
        type: 'session',
        version: 3,
        id: fixture.locator.sessionId,
        timestamp: new Date(NOW_MS + 1000).toISOString(),
        cwd: process.cwd(),
      },
    ]);

    expectRefusal(await invoke(fixture, 'search', { query: 'authenticate' }), 'session_ambiguous');
  });
});
