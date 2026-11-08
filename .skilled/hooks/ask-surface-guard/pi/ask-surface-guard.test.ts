// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Ask Surface Guard Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import askSurfaceGuard, { readRun } from './ask-surface-guard';

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

const here = dirname(fileURLToPath(import.meta.url));
const menu = JSON.parse(readFileSync(join(here, '..', 'fixtures', 'prose-menu-lettered.json'), 'utf8')).lastMessage as string;

type Handler = (event: unknown, context: unknown) => Promise<unknown>;

function fakePi() {
  const handlers = new Map<string, Handler>();
  const sent: Array<{ message: unknown; options: unknown }> = [];
  const pi = {
    on(name: string, handler: Handler) { handlers.set(name, handler); },
    sendMessage(message: unknown, options: unknown) { sent.push({ message, options }); },
  } as unknown as ExtensionAPI;
  return { pi, handlers, sent };
}

// The guard logs each fire under the session cwd, so cwd is the per-test
// directory: a shared temp root would gain a .skilled folder that other
// suites then resolve as their repository root.
let context = { hasUI: true, cwd: '', sessionManager: { getSessionId: () => 'session-pi' } };
const userThenMenu = [
  { role: 'user', content: 'pick one' },
  { role: 'assistant', content: [{ type: 'text', text: menu }] },
];

describe('pi ask-surface guard', () => {
  const saved = { ...process.env };
  let markerDir = '';
  beforeEach(() => {
    markerDir = mkdtempSync(join(tmpdir(), 'ask-surface-pi-'));
    context = { ...context, cwd: markerDir };
    process.env.HOOK_FLAGS_CONFIG = '/nonexistent/hook-flags.env';
    delete process.env.SYSTEM_ASK_SURFACE_DISABLED;
    delete process.env.SYSTEM_HOOKS_DISABLED;
  });
  afterEach(() => {
    process.env = { ...saved };
    rmSync(markerDir, { recursive: true, force: true });
  });

  it('starts one follow-up turn for a run ending in a prose menu', async () => {
    const { pi, handlers, sent } = fakePi();
    askSurfaceGuard(pi, { markerDir });
    await handlers.get('agent_end')!({ messages: userThenMenu }, context);
    expect(sent).toHaveLength(1);
    expect(sent[0].options).toEqual({ deliverAs: 'followUp', triggerTurn: true });
    expect(JSON.stringify(sent[0].message)).toContain('ask_user_question');
  });

  it('sends one operator turn back once, however many agent loops end in the menu', async () => {
    const { pi, handlers, sent } = fakePi();
    askSurfaceGuard(pi, { markerDir });
    const followUp = { role: 'custom', customType: 'ask-surface-guard', content: 'ask through the tool' };
    let messages: unknown[] = userThenMenu;
    for (let loop = 0; loop < 5; loop += 1) {
      await handlers.get('agent_end')!({ messages }, context);
      messages = [...messages, followUp, { role: 'assistant', content: [{ type: 'text', text: menu }] }];
    }
    expect(sent).toHaveLength(1);
    await handlers.get('agent_end')!({ messages: [...messages, { role: 'user', content: 'next task' }, { role: 'assistant', content: [{ type: 'text', text: menu }] }] }, context);
    expect(sent).toHaveLength(2);
  });

  it('never sends a run without a UI back, since no question tool can run there', async () => {
    const { pi, handlers, sent } = fakePi();
    askSurfaceGuard(pi, { markerDir });
    await handlers.get('agent_end')!({ messages: userThenMenu }, { ...context, hasUI: false });
    expect(sent).toHaveLength(0);
  });

  it('passes a run that asked through a question tool', async () => {
    const { pi, handlers, sent } = fakePi();
    askSurfaceGuard(pi);
    const messages = [
      { role: 'user', content: 'pick one' },
      { role: 'assistant', content: [{ type: 'toolCall', name: 'ask_user_question' }] },
      { role: 'toolResult', toolName: 'ask_user_question' },
      { role: 'assistant', content: [{ type: 'text', text: menu }] },
    ];
    await handlers.get('agent_end')!({ messages }, context);
    expect(sent).toHaveLength(0);
  });

  it('ignores a question asked before the operator last spoke', () => {
    const run = readRun([
      { role: 'assistant', content: [{ type: 'toolCall', name: 'question' }] },
      ...userThenMenu,
    ]);
    expect(run.askToolCalled).toBe(false);
  });

  it('registers nothing when the kill switch is set', () => {
    process.env.SYSTEM_ASK_SURFACE_DISABLED = '1';
    const { pi, handlers } = fakePi();
    askSurfaceGuard(pi);
    expect(handlers.size).toBe(0);
  });
});
