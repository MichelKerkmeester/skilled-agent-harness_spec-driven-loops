// ───────────────────────────────────────────────────────────────────
// MODULE: History Lookup Adapter End-to-End
// ───────────────────────────────────────────────────────────────────
// Each post-compaction adapter prints a lookup command. These cases run the
// real handler, take the arguments the handler printed, and redeem the handle
// through the CLI with no hand-seeded hook state.

import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { dshProjectKey } from '../../../../hooks/shared/session-readers/dsh.mjs';
import { piProjectDirectory } from '../../../../hooks/shared/session-readers/pi.mjs';
import sessionCompactContext from '../../../../../.pi/extensions/session-compact-context.js';
import { ensureStateDir, getStatePath } from '../hooks/claude/hook-state.js';
import { runHistoryLookupCli } from '../hooks/lib/history/cli.js';
import { registerSessionCompactContext } from '../hooks/dsh/session-compact-context.mjs';
import { checkoutRoot } from './_support/history-fixtures.js';

const NOW_MS = Date.parse('2026-11-07T12:00:00.000Z');
const SESSION_PREFIX = `history-adapter-e2e-${process.pid}`;
const DEVIN_HOOK = fileURLToPath(new URL('../hooks/devin/post-compaction.cjs', import.meta.url));

type StoreFixture = {
  home: string;
  workspace: string;
  sessionId: string;
};

type CliResult = {
  exitCode: number;
  output: string;
};

const homes: string[] = [];
const sessions = new Set<string>();

// The adapters, the hook state and the CLI all key on the working folder, and
// the offer prints only at a checkout root, so each test runs inside one.
const WORKSPACE = checkoutRoot();
afterAll(() => rmSync(WORKSPACE, { recursive: true, force: true }));
let originalCwd = process.cwd();

beforeEach(() => {
  originalCwd = process.cwd();
  process.chdir(WORKSPACE);
  ensureStateDir();
});

afterEach(() => {
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

function sessionIdFor(label: string): string {
  const sessionId = `${SESSION_PREFIX}-${label}`;
  sessions.add(sessionId);
  return sessionId;
}

function tempHome(): string {
  const home = mkdtempSync(join(tmpdir(), 'history-adapter-e2e-'));
  homes.push(home);
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

function createPiStore(label: string): StoreFixture {
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
  return { home, workspace, sessionId };
}

function createDevinStore(label: string): StoreFixture {
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

  return { home, workspace, sessionId };
}

function createDshStore(label: string): StoreFixture {
  const sessionId = sessionIdFor(label);
  const home = tempHome();
  const workspace = process.cwd();
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
  return { home, workspace, sessionId };
}

function printedOffer(text: string | undefined): { sessionId: string; handle: string } {
  const session = /--session '([^']+)'/.exec(text ?? '');
  const handle = /--handle '(hl1_[A-Za-z0-9_-]+)'/.exec(text ?? '');
  if (!session || !handle) {
    throw new Error(`offer did not print a lookup command: ${text ?? '<empty>'}`);
  }
  return { sessionId: session[1] as string, handle: handle[1] as string };
}

function storedHandle(sessionId: string): unknown {
  const state = JSON.parse(readFileSync(getStatePath(sessionId), 'utf-8')) as {
    historyLocator?: { handle?: unknown };
  };
  return state.historyLocator?.handle;
}

async function redeem(fixture: StoreFixture, offer: string, runtime: string): Promise<CliResult> {
  const args = printedOffer(offer);
  let output = '';
  const exitCode = await runHistoryLookupCli(
    [
      '--session', args.sessionId,
      '--handle', args.handle,
      'search',
      JSON.stringify({ query: 'authenticate' }),
    ],
    {
      home: fixture.home,
      nowMs: Date.now(),
      runtime: runtime as 'pi' | 'devin' | 'dsh',
      env: { HOME: fixture.home },
    },
    (text) => { output += text; },
  );
  return { exitCode, output };
}

function expectRedeemed(result: CliResult): void {
  expect(result.output).not.toContain('state_missing');
  expect(result.exitCode).toBe(0);
  const reply = JSON.parse(result.output.trim()) as { content?: Array<{ text?: string }> };
  expect(reply.content?.length).toBeGreaterThan(0);
  const payload = JSON.parse(reply.content?.[0]?.text ?? '{}') as {
    references?: Array<{ preview?: string }>;
  };
  expect(payload.references?.length).toBeGreaterThan(0);
}

function createPiAdapter() {
  const handlers = new Map<string, (event: unknown, ctx: unknown) => Promise<void>>();
  const messages: Array<{ content?: string }> = [];
  sessionCompactContext({
    on(event: string, handler: (event: unknown, ctx: unknown) => Promise<void>) {
      handlers.set(event, handler);
    },
    sendMessage(message: { content?: string }) {
      messages.push(message);
    },
  } as never);
  return { handlers, messages };
}

describe('history lookup adapter end-to-end', () => {
  it('refuses the lookup before an adapter has persisted anything', async () => {
    const fixture = createPiStore('no-handler');
    expect(existsSync(getStatePath(fixture.sessionId))).toBe(false);

    let output = '';
    const exitCode = await runHistoryLookupCli(
      [
        '--session', fixture.sessionId,
        '--handle', `hl1_${'0'.repeat(32)}`,
        'search',
        JSON.stringify({ query: 'authenticate' }),
      ],
      {
        home: fixture.home,
        nowMs: Date.now(),
        runtime: 'pi',
        env: { HOME: fixture.home },
      },
      (text) => { output += text; },
    );

    expect(exitCode).toBe(2);
    expect(JSON.parse(output.trim())).toEqual({ ok: false, code: 'state_missing' });
  });

  it('redeems the Pi offer from the state the Pi handler persisted', async () => {
    const fixture = createPiStore('pi');
    expect(existsSync(getStatePath(fixture.sessionId))).toBe(false);

    const { handlers, messages } = createPiAdapter();
    await handlers.get('session_compact')!(
      { compactionEntry: { summary: 'Pi summary' } },
      { cwd: fixture.workspace, sessionManager: { getSessionId: () => fixture.sessionId } },
    );

    const offer = messages[0]?.content ?? '';
    expect(offer).toContain('## History Lookup');
    const args = printedOffer(offer);
    expect(args.sessionId).toBe(fixture.sessionId);
    expect(storedHandle(fixture.sessionId)).toBe(args.handle);

    expectRedeemed(await redeem(fixture, offer, 'pi'));
  });

  it('leaves the Devin offer to the next prompt', async () => {
    const fixture = createDevinStore('devin');

    const child = spawnSync(process.execPath, [DEVIN_HOOK], {
      cwd: fixture.workspace,
      input: JSON.stringify({
        session_id: fixture.sessionId,
        cwd: fixture.workspace,
        summary: 'Devin summary',
      }),
      encoding: 'utf8',
      timeout: 20_000,
    });
    expect(child.status).toBe(0);

    const envelope = JSON.parse(child.stdout.trim()) as {
      hookSpecificOutput?: { additionalContext?: string };
    };
    const context = envelope.hookSpecificOutput?.additionalContext ?? '';
    expect(context).toContain('Devin summary');
    expect(context).toContain('## Recovery');
    expect(context).not.toContain('## History Lookup');
  });

  it('redeems the DSH offer from the state the DSH handler persisted', async () => {
    const fixture = createDshStore('dsh');
    expect(existsSync(getStatePath(fixture.sessionId))).toBe(false);

    const handlers: Array<(session: unknown, event: unknown) => Promise<void>> = [];
    const injected: Array<{ text?: string }> = [];
    registerSessionCompactContext(
      {
        on(_event: string, handler: (session: unknown, event: unknown) => Promise<void>) {
          handlers.push(handler);
        },
        logger: { warn: vi.fn() },
      },
      {
        core: { runSessionPrime: () => '## Recovered Context\nBase' },
        getAgent: () => ({
          inject: (notice: unknown) => { injected.push(notice as { text?: string }); },
        }),
        isEnabled: () => true,
        createNotice: async (text: string) => ({ text }),
      },
    );

    await handlers[0]!(
      { id: fixture.sessionId, header: { cwd: fixture.workspace } },
      { type: 'compaction/end', data: {} },
    );

    const offer = injected[0]?.text ?? '';
    expect(offer).toContain('## History Lookup');
    const args = printedOffer(offer);
    expect(args.sessionId).toBe(fixture.sessionId);
    expect(storedHandle(fixture.sessionId)).toBe(args.handle);

    expectRedeemed(await redeem(fixture, offer, 'dsh'));
  });
});
