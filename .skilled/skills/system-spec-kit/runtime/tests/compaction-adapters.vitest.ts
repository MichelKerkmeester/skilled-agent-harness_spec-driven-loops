// ───────────────────────────────────────────────────────────────────
// MODULE: Compaction Adapters
// ───────────────────────────────────────────────────────────────────
// The post-compaction recovery the Pi, Devin and DSH adapters emit: the
// summary, the active spec folder, the packet purpose and the recovery
// pointer. The history lookup offer is gone, so no case prints one.

import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';

import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import sessionCompactContext from '../hooks/pi/session-compact-context.js';
import {
  composeCompactionContext,
  registerSessionCompactContext,
} from '../hooks/dsh/session-compact-context.mjs';

const require = createRequire(import.meta.url);
const WORKSPACE = mkdtempSync(join(tmpdir(), 'compaction-adapters-'));
afterAll(() => rmSync(WORKSPACE, { recursive: true, force: true }));

interface DevinAdapter {
  composeRecoverySections(summary: string, sessionId: string | null, projectDir: string): string[];
  fitSections(sections: string[]): string;
}

const devin = require('../hooks/devin/post-compaction.cjs') as DevinAdapter;

const sessions = new Set<string>();
const folders = new Set<string>();

function uniqueSession(label: string): string {
  const sessionId = `${label}-${process.pid}-${sessions.size}`;
  sessions.add(sessionId);
  return sessionId;
}

/** The state file both the Pi and Devin adapters read, keyed by cwd and session id. */
function statePathFor(cwd: string, sessionId: string): string {
  const projectHash = createHash('sha256').update(cwd).digest('hex').slice(0, 12);
  const sessionHash = createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
  return join(tmpdir(), 'speckit-claude-hooks', projectHash, `${sessionHash}.json`);
}

function recordLastSpecFolder(sessionId: string, specFolder: string, cwd = WORKSPACE): void {
  const statePath = statePathFor(cwd, sessionId);
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, JSON.stringify({ lastSpecFolder: specFolder }));
  sessions.add(sessionId);
}

afterEach(() => {
  for (const sessionId of sessions) rmSync(statePathFor(WORKSPACE, sessionId), { force: true });
  sessions.clear();
  for (const folder of folders) rmSync(folder, { recursive: true, force: true });
  folders.clear();
});

describe('Pi post-compaction context', () => {
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

  it('keeps the summary and the spec folder in the message', async () => {
    const sessionId = uniqueSession('pi-summary');
    recordLastSpecFolder(sessionId, 'specs/demo/001-demo');
    const { pi, handlers, messages } = createPi();
    sessionCompactContext(pi as never);
    await handlers.get('session_compact')!(
      { compactionEntry: { summary: 'Pi summary' } },
      { cwd: WORKSPACE, sessionManager: { getSessionId: () => sessionId } },
    );

    expect(messages).toHaveLength(1);
    expect(messages[0].content).toContain('## Post-Compaction Summary\nPi summary');
    expect(messages[0].content).toContain('## Active Spec Folder\nspecs/demo/001-demo');
    expect(messages[0].content).toContain('/speckit:resume');
  });

  it('names the packet purpose of the last active spec folder', async () => {
    const sessionId = uniqueSession('pi-purpose');
    const packetDir = mkdtempSync(join(WORKSPACE, 'pi-purpose-'));
    folders.add(packetDir);
    writeFileSync(
      join(packetDir, 'spec.md'),
      '### Problem Statement\nThe reason gets lost.\n\n### Purpose\nKeep the reason for the work in view.\n',
    );
    // Pi reads the state file keyed by the cwd it is handed, not by process.cwd().
    recordLastSpecFolder(sessionId, relative(WORKSPACE, packetDir));

    const { pi, handlers, messages } = createPi();
    sessionCompactContext(pi as never);
    await handlers.get('session_compact')!(
      { compactionEntry: { summary: 'Pi summary' } },
      { cwd: WORKSPACE, sessionManager: { getSessionId: () => sessionId } },
    );

    expect(messages).toHaveLength(1);
    expect(messages[0].content).toContain(
      '## Packet Purpose\nPurpose: Keep the reason for the work in view.\nProblem: The reason gets lost.',
    );
    expect(messages[0].content).toContain(`## Active Spec Folder\n${relative(WORKSPACE, packetDir)}`);
  });

  it('walks up from a packet subfolder to the packet purpose', async () => {
    const sessionId = uniqueSession('pi-purpose-walkup');
    const packetDir = mkdtempSync(join(WORKSPACE, 'pi-purpose-walkup-'));
    folders.add(packetDir);
    writeFileSync(join(packetDir, 'spec.md'), '### Purpose\nShow the packet purpose from a subfolder.\n');
    recordLastSpecFolder(sessionId, join(relative(WORKSPACE, packetDir), 'scratch'));

    const { pi, handlers, messages } = createPi();
    sessionCompactContext(pi as never);
    await handlers.get('session_compact')!(
      { compactionEntry: { summary: 'Pi summary' } },
      { cwd: WORKSPACE, sessionManager: { getSessionId: () => sessionId } },
    );

    expect(messages[0].content).toContain('## Packet Purpose\nPurpose: Show the packet purpose from a subfolder.');
  });

  it('adds no packet purpose for a last spec folder outside the workspace', async () => {
    const sessionId = uniqueSession('pi-purpose-outside');
    const outsideDir = mkdtempSync(join(tmpdir(), 'compaction-outside-'));
    folders.add(outsideDir);
    writeFileSync(join(outsideDir, 'spec.md'), '### Purpose\nA purpose from outside the workspace.\n');
    recordLastSpecFolder(sessionId, outsideDir);

    const { pi, handlers, messages } = createPi();
    sessionCompactContext(pi as never);
    await handlers.get('session_compact')!(
      { compactionEntry: { summary: 'Pi summary' } },
      { cwd: WORKSPACE, sessionManager: { getSessionId: () => sessionId } },
    );

    expect(messages).toHaveLength(1);
    expect(messages[0].content).not.toContain('## Packet Purpose');
    expect(messages[0].content).toContain(`## Active Spec Folder\n${outsideDir}`);
  });

  it('keeps the recovery pointer whole when a long summary fills the budget', async () => {
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
    expect(content.startsWith('## Post-Compaction Summary')).toBe(true);
    expect(content).toContain('## Recovery');
    expect(content).toContain('Run `/speckit:resume` against the active packet to recover session state.');
  });

  it('emits no history lookup section', async () => {
    const sessionId = uniqueSession('pi-no-lookup');
    const { pi, handlers, messages } = createPi();
    sessionCompactContext(pi as never);
    await handlers.get('session_compact')!(
      { compactionEntry: { summary: 'Pi summary' } },
      { cwd: WORKSPACE, sessionManager: { getSessionId: () => sessionId } },
    );

    expect(messages[0].content).not.toContain('History Lookup');
  });
});

describe('Devin post-compaction context', () => {
  it('keeps the recovery pointer whole when a long summary fills the budget', () => {
    const sections = devin.composeRecoverySections('y'.repeat(5_000), uniqueSession('devin-long'), WORKSPACE);
    const text = devin.fitSections(sections);

    expect(Buffer.byteLength(text, 'utf8')).toBeLessThanOrEqual(4_096);
    expect(text.startsWith('## Post-Compaction Summary')).toBe(true);
    expect(text).toContain('## Recovery');
    expect(text).toContain('Run `/speckit:resume` against the active packet to recover session state.');
  });

  it('emits no history lookup section', () => {
    const text = devin
      .composeRecoverySections('Devin summary', uniqueSession('devin-no-lookup'), WORKSPACE)
      .join('\n\n');

    expect(text).not.toContain('History Lookup');
  });
});

describe('DSH post-compaction context', () => {
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

  it('offers nothing when the compaction failed', async () => {
    const { handlers, injected } = createDsh();
    await handlers[0](
      { id: 'dsh-failed', header: { cwd: WORKSPACE } },
      { type: 'compaction/end', data: { error: 'failed' } },
    );

    expect(injected).toHaveLength(0);
  });

  it('keeps the summary and recovery pointer', () => {
    const text = composeCompactionContext('## Recovered Context\nBase');

    expect(text).toContain('Recovered Context');
    expect(text).toContain('/speckit:resume');
  });

  it('names /speckit:resume once when the primed context already names it', () => {
    const text = composeCompactionContext(
      '## Context Recovery\nContext was compacted. Run `/speckit:resume` against the active packet to recover session state.',
    );

    expect(text.split('/speckit:resume').length - 1).toBe(1);
    expect(text).not.toContain('## Recovery\n');
  });

  it('emits no history lookup section', async () => {
    const { handlers, injected } = createDsh();
    await handlers[0](
      { id: 'dsh-no-lookup', header: { cwd: WORKSPACE } },
      { type: 'compaction/end', data: {} },
    );

    expect((injected[0] as { text: string }).text).not.toContain('History Lookup');
  });
});
