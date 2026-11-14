// ───────────────────────────────────────────────────────────────────
// MODULE: History Locator Adapters
// ───────────────────────────────────────────────────────────────────
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';

import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import { checkoutRoot } from './_support/history-fixtures.js';
import { HistoryLocatorSchema, getStatePath } from '../hooks/claude/hook-state.js';
import { mintHistoryLocator as mintClaudeLocator } from '../hooks/claude/compact-inject.js';
import { historyHandle as cliHistoryHandle } from '../hooks/lib/history/cli.js';
import { historyHandle } from '../hooks/lib/history/locator-digest.js';
import {
  buildHistoryLookupSection as buildLookupSection,
  type HistoryLookupTarget,
} from '../hooks/lib/history/lookup-offer.js';
import sessionCompactContext, {
  mintHistoryLocator as mintPiLocator,
} from '../hooks/pi/session-compact-context.js';
import {
  composeCompactionContext,
  mintHistoryLocator as mintDshLocator,
  registerSessionCompactContext,
} from '../hooks/dsh/session-compact-context.mjs';

const require = createRequire(import.meta.url);
const WORKSPACE = checkoutRoot();
afterAll(() => rmSync(WORKSPACE, { recursive: true, force: true }));

interface DevinAdapter {
  mintHistoryLocator(sessionId: string, workspace: string, mintedAt: string): HistoryLookupTarget | null;
  composeRecoverySections(
    summary: string,
    sessionId: string | null,
    projectDir: string,
    historyCapability: boolean,
    options?: { locator?: HistoryLookupTarget | null },
  ): string[];
}

const devin = require('../hooks/devin/post-compaction.cjs') as DevinAdapter;

const NOW = '2026-11-07T12:00:00.000Z';
const sessions = new Set<string>();

function uniqueSession(label: string): string {
  const sessionId = `${label}-${process.pid}-${sessions.size}`;
  sessions.add(sessionId);
  return sessionId;
}

afterEach(() => {
  // The adapters save state under the workspace they were handed, so the
  // files are removed from both the fixture checkout and the test folder.
  const original = process.cwd();
  for (const folder of [original, WORKSPACE]) {
    process.chdir(folder);
    for (const sessionId of sessions) {
      rmSync(getStatePath(sessionId), { force: true });
      rmSync(`${getStatePath(sessionId)}.bad`, { force: true });
    }
  }
  process.chdir(original);
  sessions.clear();
});

describe('Pi post-compaction locator', () => {
  function createPi() {
    const handlers = new Map<string, (event: unknown, ctx: unknown) => Promise<void>>();
    const messages: Array<{ content?: string }> = [];
    const pi = {
      on(event: string, handler: (event: unknown, ctx: unknown) => Promise<void>) {
        handlers.set(event, handler);
      },
      sendMessage(message: { content?: string }) {
        messages.push(message);
      },
    };
    return { pi, handlers, messages };
  }

  it('mints a schema-valid locator from the live session id', () => {
    const locator = mintPiLocator('pi-session', WORKSPACE, NOW);
    expect(locator).not.toBeNull();
    expect(HistoryLocatorSchema.safeParse(locator).success).toBe(true);
    expect(locator!.runtime).toBe('pi');
    expect(locator!.locatorKind).toBe('live_branch_or_session_log');
    expect(locator!.provenance.source).toBe('post_compaction');
  });

  it('offers the lookup section through sendMessage', async () => {
    const sessionId = uniqueSession('pi-offer');
    const { pi, handlers, messages } = createPi();
    sessionCompactContext(pi as never);
    await handlers.get('session_compact')!(
      { compactionEntry: { summary: 'Pi summary' } },
      { cwd: WORKSPACE, sessionManager: { getSessionId: () => sessionId } },
    );

    expect(messages).toHaveLength(1);
    expect(messages[0].content).toContain('## History Lookup');
    expect(messages[0].content).toContain('hl1_');
    expect(messages[0].content).toContain(`load '{"historyIds":["<id>"]}'`);
    expect(messages[0].content).toContain('(cd "$(git rev-parse --show-toplevel)" && ');
    expect(messages[0].content).toContain('SPECKIT_RUNTIME=pi');
    expect(messages[0].content).toContain(
      'node .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js',
    );
    expect(messages[0].content).toContain(`--session '${sessionId}'`);
    expect(messages[0].content).toContain("--handle 'hl1_");
    expect(messages[0].content).toContain(`browse '{"direction":"backward"}'`);
    expect(messages[0].content).toContain('/speckit:resume');
  });

  it('keeps the summary and spec folder only when no live session id exists', async () => {
    const { pi, handlers, messages } = createPi();
    sessionCompactContext(pi as never);
    await handlers.get('session_compact')!(
      { compactionEntry: { summary: 'Pi summary' } },
      { cwd: WORKSPACE, sessionManager: { getSessionId: () => null } },
    );

    expect(messages[0].content).toContain('Pi summary');
    expect(messages[0].content).not.toContain('## History Lookup');
    expect(messages[0].content).not.toContain('## Packet Purpose');
    expect(messages[0].content).toContain('/speckit:resume');
  });

  it('names the packet purpose of the last active spec folder', async () => {
    const sessionId = uniqueSession('pi-purpose');
    const packetDir = mkdtempSync(join(WORKSPACE, 'pi-purpose-'));
    writeFileSync(join(packetDir, 'spec.md'), '### Problem Statement\nThe reason gets lost.\n\n### Purpose\nKeep the reason for the work in view.\n');
    // Pi reads the state file keyed by the cwd it is handed, not by process.cwd().
    const stateDir = join(
      tmpdir(),
      'speckit-claude-hooks',
      createHash('sha256').update(WORKSPACE).digest('hex').slice(0, 12),
    );
    const statePath = join(stateDir, `${createHash('sha256').update(sessionId).digest('hex').slice(0, 16)}.json`);
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(statePath, JSON.stringify({ lastSpecFolder: relative(WORKSPACE, packetDir) }));
    try {
      const { pi, handlers, messages } = createPi();
      sessionCompactContext(pi as never);
      await handlers.get('session_compact')!(
        { compactionEntry: { summary: 'Pi summary' } },
        { cwd: WORKSPACE, sessionManager: { getSessionId: () => sessionId } },
      );

      expect(messages).toHaveLength(1);
      expect(messages[0].content).toContain('## Packet Purpose\nPurpose: Keep the reason for the work in view.\nProblem: The reason gets lost.');
      expect(messages[0].content).toContain(`## Active Spec Folder\n${relative(WORKSPACE, packetDir)}`);
    } finally {
      rmSync(statePath, { force: true });
      rmSync(packetDir, { recursive: true, force: true });
    }
  });

  it('adds no packet purpose for a last spec folder outside the workspace', async () => {
    const sessionId = uniqueSession('pi-purpose-outside');
    const outsideDir = mkdtempSync(join(tmpdir(), 'pi-purpose-outside-'));
    writeFileSync(join(outsideDir, 'spec.md'), '### Purpose\nA purpose from outside the workspace.\n');
    const stateDir = join(
      tmpdir(),
      'speckit-claude-hooks',
      createHash('sha256').update(WORKSPACE).digest('hex').slice(0, 12),
    );
    const statePath = join(stateDir, `${createHash('sha256').update(sessionId).digest('hex').slice(0, 16)}.json`);
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(statePath, JSON.stringify({ lastSpecFolder: outsideDir }));
    try {
      const { pi, handlers, messages } = createPi();
      sessionCompactContext(pi as never);
      await handlers.get('session_compact')!(
        { compactionEntry: { summary: 'Pi summary' } },
        { cwd: WORKSPACE, sessionManager: { getSessionId: () => sessionId } },
      );

      expect(messages).toHaveLength(1);
      expect(messages[0].content).not.toContain('## Packet Purpose');
      expect(messages[0].content).toContain(`## Active Spec Folder\n${outsideDir}`);
    } finally {
      rmSync(statePath, { force: true });
      rmSync(outsideDir, { recursive: true, force: true });
    }
  });

  it('emits no lookup section when the capability is off', () => {
    const locator = mintPiLocator('pi-session', WORKSPACE, NOW);
    expect(buildLookupSection(locator!, false)).toBeNull();
  });

  it('keeps the command and recovery pointer whole when a long summary fills the budget', async () => {
    const sessionId = uniqueSession('pi-long');
    const { pi, handlers, messages } = createPi();
    sessionCompactContext(pi as never);
    await handlers.get('session_compact')!(
      { compactionEntry: { summary: 'x'.repeat(5_000) } },
      { cwd: WORKSPACE, sessionManager: { getSessionId: () => sessionId } },
    );

    expect(messages).toHaveLength(1);
    const content = messages[0].content as string;
    expect(Buffer.byteLength(content, 'utf8')).toBeLessThanOrEqual(4_096);
    expect(content).toContain(`--session '${sessionId}'`);
    expect(content).toContain(`browse '{"direction":"backward"}'`);
    expect(content).toContain('## Recovery');
  });
});

describe('Devin post-compaction locator', () => {
  it('mints a schema-valid locator from session id and cwd', () => {
    const locator = devin.mintHistoryLocator('devin-session', WORKSPACE, NOW);
    expect(locator).not.toBeNull();
    expect(HistoryLocatorSchema.safeParse(locator).success).toBe(true);
    const typed = locator as { runtime: string; locatorKind: string; provenance: { source: string } };
    expect(typed.runtime).toBe('devin');
    expect(typed.locatorKind).toBe('transcript_file');
    expect(typed.provenance.source).toBe('post_compaction');
  });

  it('leaves the lookup offer to the next prompt and builds it for Devin', () => {
    const locator = devin.mintHistoryLocator('devin-session', WORKSPACE, NOW);
    const text = devin.composeRecoverySections('Devin summary', 'devin-session', WORKSPACE).join('\n\n');
    expect(text).toContain('Devin summary');
    expect(text).toContain('/speckit:resume');
    expect(text).not.toContain('## History Lookup');

    const offer = buildLookupSection(locator, true) as string;
    expect(offer).toContain('(cd "$(git rev-parse --show-toplevel)" && ');
    expect(offer).toContain('SPECKIT_RUNTIME=devin');
    expect(offer).toContain("--session 'devin-session'");
    expect(offer).toContain(`browse '{"direction":"backward"}'`);
  });

  it('never selects newest-in-project when the exact id is absent', () => {
    const sections = devin.composeRecoverySections('Devin summary', null, WORKSPACE);
    const text = sections.join('\n\n');

    expect(text).toContain('Devin summary');
    expect(text).not.toContain('## History Lookup');
    expect(text).toContain('/speckit:resume');
  });

  it('emits no lookup section when the capability is off', () => {
    const locator = devin.mintHistoryLocator('devin-session', WORKSPACE, NOW);
    expect(buildLookupSection(locator, false)).toBeNull();
  });

  it('keeps the recovery pointer whole when a long summary fills the budget', () => {
    const sections = devin.composeRecoverySections('y'.repeat(5_000), 'devin-session', WORKSPACE);
    const text = devin.fitSections(sections) as string;

    expect(Buffer.byteLength(text, 'utf8')).toBeLessThanOrEqual(4_096);
    expect(text.startsWith('## Post-Compaction Summary')).toBe(true);
    expect(text).toContain('## Recovery');
  });
});

describe('DSH post-compaction locator', () => {
  function createDsh(overrides: {
    runSessionPrime?: () => string;
    inject?: (notice: unknown) => void;
    getAgent?: () => unknown;
  } = {}) {
    const handlers: Array<(session: unknown, event: unknown) => Promise<void>> = [];
    const injected: unknown[] = [];
    const ctx = {
      on(_event: string, handler: (session: unknown, event: unknown) => Promise<void>) {
        handlers.push(handler);
      },
      logger: { warn: vi.fn() },
    };
    registerSessionCompactContext(ctx, {
      core: { runSessionPrime: overrides.runSessionPrime ?? (() => '## Recovered Context\nBase') },
      getAgent: overrides.getAgent ?? (() => ({ inject: overrides.inject ?? ((notice) => injected.push(notice)) })),
      isEnabled: () => true,
      createNotice: async (text: string) => ({ text }),
    });
    return { handlers, injected };
  }

  it('mints a schema-valid locator from session.id and header cwd', () => {
    const locator = mintDshLocator('dsh-session', WORKSPACE, NOW);
    expect(locator).not.toBeNull();
    expect(HistoryLocatorSchema.safeParse(locator).success).toBe(true);
    expect(locator!.runtime).toBe('dsh');
    expect(locator!.locatorKind).toBe('session_log');
  });

  it('offers the lookup section through agent.inject on compaction/end', async () => {
    const sessionId = uniqueSession('dsh-offer');
    const { handlers, injected } = createDsh();
    await handlers[0](
      { id: sessionId, header: { cwd: WORKSPACE } },
      { type: 'compaction/end', data: {} },
    );

    expect(injected).toHaveLength(1);
    const notice = injected[0] as { text: string };
    expect(notice.text).toContain('## History Lookup');
    expect(notice.text).toContain('hl1_');
    expect(notice.text).toContain('(cd "$(git rev-parse --show-toplevel)" && ');
    expect(notice.text).toContain(`load '{"historyIds":["<id>"]}'`);
    expect(notice.text).toContain('SPECKIT_RUNTIME=dsh');
    expect(notice.text).toContain(
      'node .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js',
    );
    expect(notice.text).toContain(`--session '${sessionId}'`);
    expect(notice.text).toContain(`browse '{"direction":"backward"}'`);
    expect(notice.text).toContain('/speckit:resume');
  });

  it('offers nothing when the compaction failed', async () => {
    const { handlers, injected } = createDsh();
    await handlers[0](
      { id: 'dsh-session', header: { cwd: WORKSPACE } },
      { type: 'compaction/end', data: { error: 'failed' } },
    );
    expect(injected).toHaveLength(0);
  });

  it('keeps the summary and recovery pointer when no locator is available', () => {
    const text = composeCompactionContext('## Recovered Context\nBase', null, true);
    expect(text).toContain('Recovered Context');
    expect(text).not.toContain('## History Lookup');
    expect(text).toContain('/speckit:resume');
  });

  it('names /speckit:resume once when the primed context already names it', () => {
    const text = composeCompactionContext(
      '## Context Recovery\nContext was compacted. Run `/speckit:resume` against the active packet to recover session state.',
      null,
      true,
    );
    expect(text.split('/speckit:resume').length - 1).toBe(1);
    expect(text).not.toContain('## Recovery\n');
  });

  it('emits no lookup section when the capability is off', () => {
    const locator = mintDshLocator('dsh-session', WORKSPACE, NOW);
    expect(buildLookupSection(locator!, false)).toBeNull();
  });
});

describe('shared history handle digest', () => {
  it('keeps all four producers and the CLI verifier on one algorithm', () => {
    const workspace = WORKSPACE;
    const sessionId = 'shared-digest-session';
    const root = mkdtempSync(join(tmpdir(), 'history-digest-'));
    const transcriptPath = join(root, `${sessionId}.jsonl`);
    writeFileSync(transcriptPath, `${JSON.stringify({ type: 'user', uuid: 'digest-u1' })}\n`, 'utf-8');

    try {
      const claudeLocator = mintClaudeLocator({
        sessionId,
        transcriptPath,
        workspace,
        runtime: 'claude',
        mintedAt: NOW,
      });
      const piLocator = mintPiLocator(sessionId, workspace, NOW)!;
      const devinLocator = devin.mintHistoryLocator(sessionId, workspace, NOW) as {
        handle: string;
      } | null;
      const dshLocator = mintDshLocator(sessionId, workspace, NOW)!;

      expect(claudeLocator).not.toBeNull();
      expect(devinLocator).not.toBeNull();

      // The CLI re-derives the stored handle through the same helper.
      const claudeHandle = historyHandle({
        runtime: 'claude',
        sessionId,
        workspace,
        locatorKind: 'transcript_path',
      }, transcriptPath);
      expect(claudeLocator!.handle).toBe(claudeHandle);
      expect(cliHistoryHandle(claudeLocator!, transcriptPath)).toBe(claudeHandle);

      const identityOnly = [
        ['pi', piLocator, 'live_branch_or_session_log'],
        ['devin', devinLocator!, 'transcript_file'],
        ['dsh', dshLocator, 'session_log'],
      ] as const;

      for (const [runtime, locator, locatorKind] of identityOnly) {
        const expected = historyHandle({ runtime, sessionId, workspace, locatorKind });
        expect(locator.handle).toBe(expected);
        expect(cliHistoryHandle(locator, null)).toBe(expected);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
