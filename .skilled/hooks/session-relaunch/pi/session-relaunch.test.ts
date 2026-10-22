// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Pi Extension Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';
import { EventEmitter } from 'node:events';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  AgentEndEvent,
  BeforeAgentStartEvent,
  ExtensionAPI,
  ExtensionContext,
  MessageEndEvent,
} from '@earendil-works/pi-coding-agent';
import { readState, writeState } from '../lib/nudge.cjs';
import relaunchCore, {
  arm,
  preparePending,
  readRelaunchFile,
  shouldRelaunch,
} from '../lib/relaunch-core.cjs';
import sessionRelaunch from './session-relaunch';

const { spawnMock } = vi.hoisted(() => ({ spawnMock: vi.fn(() => ({ unref: vi.fn() })) }));
vi.mock('node:child_process', () => ({ spawn: spawnMock }));

type ExtensionEvent = AgentEndEvent | BeforeAgentStartEvent | MessageEndEvent;
type Handler = (event: ExtensionEvent, ctx: ExtensionContext) => unknown;

const envKeys = [
  'SYSTEM_SESSION_RELAUNCH_DISABLED',
  'SESSION_RELAUNCH_THRESHOLD',
  'SESSION_RELAUNCH_WINDOW_TOKENS',
  'SKILLED_LOOP_ID',
  'SKILLED_LOOP_HOPS',
  'SESSION_RELAUNCH_MAX_HOPS',
  'SYSTEM_SPEC_FOLDER',
  'XDG_RUNTIME_DIR',
  'SESSION_RELAUNCH_REPO_ROOT',
  'HOOK_FLAGS_CONFIG',
];
const SPEC_FOLDER = 'specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters';
const CONTINUITY_WRITER = 'node .skilled/skills/system-spec-kit/runtime/cli/'
  + 'dist/continuity/generate-context.js';
const originalEnv = new Map(envKeys.map((key) => [key, process.env[key]]));
const roots: string[] = [];

function makeExtensionApi(): { api: ExtensionAPI; handlers: Map<string, Handler> } {
  const handlers = new Map<string, Handler>();
  const api = {
    on(event: string, handler: Handler) {
      handlers.set(event, handler);
    },
    sendMessage: vi.fn(),
  } as unknown as ExtensionAPI;
  return { api, handlers };
}

function setupEnv() {
  const root = mkdtempSync(path.join(tmpdir(), 'session-relaunch-pi-'));
  roots.push(root);
  process.env.XDG_RUNTIME_DIR = root;
  process.env.SESSION_RELAUNCH_REPO_ROOT = root;
  process.env.HOOK_FLAGS_CONFIG = path.join(root, 'hook-flags.env');
  process.env.SESSION_RELAUNCH_THRESHOLD = '0.8';
  delete process.env.SYSTEM_SESSION_RELAUNCH_DISABLED;
  delete process.env.SESSION_RELAUNCH_WINDOW_TOKENS;
  delete process.env.SKILLED_LOOP_ID;
  delete process.env.SKILLED_LOOP_HOPS;
  delete process.env.SESSION_RELAUNCH_MAX_HOPS;
  delete process.env.SYSTEM_SPEC_FOLDER;
}

function makeContext(sessionId = 'pi-session-0001', cwd = '/workspace/pi') {
  return {
    cwd,
    getContextUsage: () => ({ tokens: 80, contextWindow: 100 }),
    sessionManager: {
      getSessionId: () => sessionId,
      getSessionFile: () => '/workspace/pi/session.jsonl',
    },
  };
}

async function emit(handlers: Map<string, Handler>, name: string, event: unknown, ctx: unknown) {
  const handler = handlers.get(name);
  expect(handler).toBeTypeOf('function');
  return handler?.(event as ExtensionEvent, ctx as ExtensionContext);
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  for (const [key, value] of originalEnv) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  vi.clearAllMocks();
});

describe('session-relaunch Pi extension', () => {
  it('kill switch silences the extension', async () => {
    setupEnv();
    process.env.SYSTEM_SESSION_RELAUNCH_DISABLED = '1';
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90, cacheRead: 0, cacheWrite: 0 } },
    }, makeContext());
    expect(api.sendMessage).not.toHaveBeenCalled();
  });

  it('reads the hook flags file again for each event', async () => {
    setupEnv();
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    // setupEnv() sets HOOK_FLAGS_CONFIG, so the test env has it.
    writeFileSync(process.env.HOOK_FLAGS_CONFIG!, 'SYSTEM_SESSION_RELAUNCH_DISABLED=1\n');

    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90, cacheRead: 0, cacheWrite: 0 } },
    }, makeContext());

    expect(api.sendMessage).not.toHaveBeenCalled();
  });

  it('uses the session window override instead of the runtime window', async () => {
    setupEnv();
    process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '200';
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);

    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 150 } },
    }, makeContext());

    expect(api.sendMessage).not.toHaveBeenCalled();
  });

  it('message_end below the threshold does nothing', async () => {
    setupEnv();
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 79, cacheRead: 0, cacheWrite: 0 } },
    }, makeContext());
    expect(api.sendMessage).not.toHaveBeenCalled();
  });

  it('message_end does nothing while this session already has a prepared handoff', async () => {
    setupEnv();
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    const loopId = 'pi-loop-prepared-0001';
    process.env.SKILLED_LOOP_ID = loopId;
    preparePending({
      loopId,
      // setupEnv() sets XDG_RUNTIME_DIR, so the test env has it.
      handoffPath: path.join(process.env.XDG_RUNTIME_DIR!, 'handoff.md'),
      sessionId: 'pi-session-0001',
      runtime: 'pi',
      cwd: '/workspace/pi',
      env: process.env,
    });

    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90 } },
    }, makeContext());

    expect(readRelaunchFile(loopId, process.env)).toMatchObject({ status: 'pending' });
    expect(api.sendMessage).not.toHaveBeenCalled();
  });

  it('keeps the agent quiet at the hop limit', async () => {
    setupEnv();
    process.env.SKILLED_LOOP_ID = 'pi-nudge-loop-0001';
    process.env.SKILLED_LOOP_HOPS = '1';
    process.env.SESSION_RELAUNCH_MAX_HOPS = '1';
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    const ctx = makeContext();

    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90 } },
    }, ctx);
    await emit(handlers, 'agent_end', {}, ctx);

    expect(api.sendMessage).not.toHaveBeenCalled();
  });

  it('retires a held nudge once the hop count reaches the cap before delivery', async () => {
    setupEnv();
    process.env.SKILLED_LOOP_ID = 'pi-nudge-loop-0001';
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    const ctx = makeContext();

    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90 } },
    }, ctx);
    process.env.SKILLED_LOOP_HOPS = '1';
    process.env.SESSION_RELAUNCH_MAX_HOPS = '1';
    await emit(handlers, 'agent_end', {}, ctx);

    expect(api.sendMessage).not.toHaveBeenCalled();
  });

  it('agent_end delivers the nudge held from message_end exactly once', async () => {
    setupEnv();
    process.env.SKILLED_LOOP_ID = 'pi-nudge-loop-0001';
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    const ctx = makeContext();

    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90 } },
    }, ctx);
    expect(api.sendMessage).not.toHaveBeenCalled();

    await emit(handlers, 'agent_end', {}, ctx);
    expect(api.sendMessage).toHaveBeenCalledOnce();
    const [, options] = api.sendMessage.mock.calls[0];
    expect(options).toEqual({ deliverAs: 'followUp', triggerTurn: true });

    await emit(handlers, 'agent_end', {}, ctx);
    expect(api.sendMessage).toHaveBeenCalledOnce();
  });

  it('agent_end stays quiet when the prepare call left a pending handoff', async () => {
    setupEnv();
    const loopId = 'pi-loop-pending-handoff';
    process.env.SKILLED_LOOP_ID = loopId;
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    const ctx = makeContext();

    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90 } },
    }, ctx);
    preparePending({
      loopId,
      handoffPath: '/workspace/pi/handoff.md',
      sessionId: 'pi-session-0001',
      runtime: 'pi',
      cwd: '/workspace/pi',
      env: process.env,
    });
    await emit(handlers, 'agent_end', {}, ctx);

    expect(api.sendMessage).not.toHaveBeenCalled();
  });

  it(
    'sends threshold nudges once, including the 0.05 reminder, then stays quiet',
    async () => {
      setupEnv();
      process.env.SKILLED_LOOP_ID = 'pi-nudge-loop-0001';
      const { api, handlers } = makeExtensionApi();
      sessionRelaunch(api);
      const ctx = makeContext();
      await emit(handlers, 'message_end', {
        message: { role: 'assistant', usage: { input: 80 } },
      }, ctx);
      await emit(handlers, 'agent_end', {}, ctx);
      await emit(handlers, 'message_end', {
        message: { role: 'assistant', usage: { input: 85 } },
      }, ctx);
      await emit(handlers, 'agent_end', {}, ctx);
      await emit(handlers, 'message_end', {
        message: { role: 'assistant', usage: { input: 90 } },
      }, ctx);
      await emit(handlers, 'agent_end', {}, ctx);

      expect(api.sendMessage).toHaveBeenCalledTimes(2);
      for (const [message, options] of api.sendMessage.mock.calls) {
        expect(message).toMatchObject({ customType: 'session-relaunch', display: false });
        expect(message.content).toContain('session-relaunch');
        expect(options).toEqual({ deliverAs: 'followUp', triggerTurn: true });
      }
    },
  );

  it('delivers the nudge without waiting for an operator turn', async () => {
    setupEnv();
    process.env.SKILLED_LOOP_ID = 'pi-nudge-loop-0001';
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);

    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90 } },
    }, makeContext());
    expect(api.sendMessage).not.toHaveBeenCalled();

    await emit(handlers, 'agent_end', {}, makeContext());
    expect(api.sendMessage).toHaveBeenCalledOnce();
    const [, options] = api.sendMessage.mock.calls[0];
    expect(options).toEqual({ deliverAs: 'followUp', triggerTurn: true });
  });

  it('includes the save step when SYSTEM_SPEC_FOLDER is unset', async () => {
    setupEnv();
    process.env.SKILLED_LOOP_ID = 'pi-nudge-loop-0001';
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);

    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90 } },
    }, makeContext());
    await emit(handlers, 'agent_end', {}, makeContext());

    expect(api.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringMatching(
          /\n2\. When a spec packet is bound to this session, save its continuity first:/,
        ),
      }),
      { deliverAs: 'followUp', triggerTurn: true },
    );
    const nudge = api.sendMessage.mock.calls[0][0] as { content: string };
    expect(nudge.content).toContain(
      `${CONTINUITY_WRITER} --stdin --full-auto '<spec-folder>'`,
    );
    expect(nudge.content).not.toContain('/speckit:save');
  });

  it('injects seedText in before_agent_start for a relaunch seed prompt', async () => {
    setupEnv();
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    const result = await emit(handlers, 'before_agent_start', {
      prompt: '[session-relaunch] claim and continue handoff /workspace/note.md',
      systemPrompt: 'base system prompt',
      systemPromptOptions: {},
    }, makeContext());

    expect(result).toMatchObject({
      systemPrompt: expect.stringContaining("claim '/workspace/note.md'"),
    });
    expect(api.sendMessage).not.toHaveBeenCalled();
  });

  it('uses the carried spec folder and keeps the suffixed note path intact', async () => {
    setupEnv();
    process.env.SYSTEM_SPEC_FOLDER = 'specs/from-environment';
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    const result = await emit(handlers, 'before_agent_start', {
      prompt: '[session-relaunch] claim and continue handoff /workspace/note.md'
        + ` | Spec folder: ${SPEC_FOLDER}`
        + ' (carried from the handoff; Gate 3 answered in the sending session)',
      systemPrompt: 'base system prompt',
      systemPromptOptions: {},
    }, makeContext());

    const systemPrompt = (result as { systemPrompt: string }).systemPrompt;
    expect(systemPrompt).toContain("claim '/workspace/note.md'");
    expect(systemPrompt).toContain(`/speckit:resume ${SPEC_FOLDER}`);
    expect(systemPrompt).not.toContain('specs/from-environment');
  });

  it(
    'agent_end arms the matching session and spawns a killer for this process',
    async () => {
      setupEnv();
      const loopId = 'pi-loop-0001';
      process.env.SKILLED_LOOP_ID = loopId;
      preparePending({
        loopId,
        handoffPath: '/workspace/pi/handoff.md',
        sessionId: 'pi-session-0001',
        runtime: 'pi',
        cwd: '/workspace/pi',
        env: process.env,
      });
      const { api, handlers } = makeExtensionApi();
      sessionRelaunch(api);
      await emit(handlers, 'agent_end', {}, makeContext());

      expect(readRelaunchFile(loopId, process.env)).toMatchObject({
        status: 'armed',
        cwd: '/workspace/pi',
      });
      expect(spawnMock).toHaveBeenCalledTimes(1);
      const [, args, options] = spawnMock.mock.calls[0];
      expect(args).toContain('--target-pid');
      expect(args).toContain(String(process.pid));
      expect(options.detached).toBe(true);
      expect(options.stdio).toBe('ignore');
      expect(spawnMock.mock.results[0].value.unref).toHaveBeenCalledOnce();

      const expectedKiller = path.resolve(
        // setupEnv() sets SESSION_RELAUNCH_REPO_ROOT, so the test env has it.
        process.env.SESSION_RELAUNCH_REPO_ROOT!,
        '.skilled',
        'hooks',
        'session-relaunch',
        'lib',
        'killer.cjs',
      );
      expect(args[0]).toBe(expectedKiller);
    },
  );

  it(
    'agent_end respawns one killer for an armed record whose killer is gone',
    async () => {
      setupEnv();
      const loopId = 'pi-loop-respawn-0001';
      process.env.SKILLED_LOOP_ID = loopId;
      preparePending({
        loopId,
        handoffPath: '/workspace/pi/handoff.md',
        sessionId: 'pi-session-0001',
        runtime: 'pi',
        cwd: '/workspace/pi',
        env: process.env,
      });
      arm({ loopId, cwd: '/workspace/pi', env: process.env });
      const { api, handlers } = makeExtensionApi();
      sessionRelaunch(api);

      await emit(handlers, 'agent_end', {}, makeContext());
      expect(spawnMock).toHaveBeenCalledTimes(1);

      // setupEnv() sets XDG_RUNTIME_DIR, so the test env has it.
      const stateDir = path.join(process.env.XDG_RUNTIME_DIR!, 'skilled-relaunch');
      mkdirSync(stateDir, { recursive: true });
      writeFileSync(
        path.join(stateDir, `killer-${loopId}.lock`),
        `${process.pid} ${new Date().toISOString()}\n`,
      );
      await emit(handlers, 'agent_end', {}, makeContext());
      expect(spawnMock).toHaveBeenCalledTimes(1);
      expect(readRelaunchFile(loopId, process.env)).toMatchObject({ status: 'armed' });
    },
  );

  it('spawns the killer from the repo lib when cwd is a repo subdirectory', async () => {
    setupEnv();
    delete process.env.SESSION_RELAUNCH_REPO_ROOT;
    const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url));
    const subdir = path.join(repoRoot, '.skilled', 'hooks');
    const loopId = 'pi-loop-subdir';
    process.env.SKILLED_LOOP_ID = loopId;
    preparePending({
      loopId,
      handoffPath: path.join(subdir, 'handoff.md'),
      sessionId: 'pi-session-0001',
      runtime: 'pi',
      cwd: subdir,
      env: process.env,
    });
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    await emit(handlers, 'agent_end', {}, makeContext('pi-session-0001', subdir));

    expect(spawnMock).toHaveBeenCalledTimes(1);
    const [, args] = spawnMock.mock.calls[0];
    const expectedKiller = path.join(
      repoRoot,
      '.skilled',
      'hooks',
      'session-relaunch',
      'lib',
      'killer.cjs',
    );
    expect(args[0]).toBe(expectedKiller);
    expect(existsSync(args[0])).toBe(true);
  });

  it('agent_end logs a killer spawn error and leaves the record armed', async () => {
    setupEnv();
    const loopId = 'pi-loop-spawn-error';
    process.env.SKILLED_LOOP_ID = loopId;
    preparePending({
      loopId,
      handoffPath: '/workspace/pi/handoff.md',
      sessionId: 'pi-session-0001',
      runtime: 'pi',
      cwd: '/workspace/pi',
      env: process.env,
    });
    const child = Object.assign(new EventEmitter(), { unref: vi.fn() });
    spawnMock.mockReturnValueOnce(child);
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    await emit(handlers, 'agent_end', {}, makeContext());

    child.emit('error', new Error('spawn denied'));

    expect(readRelaunchFile(loopId, process.env)).toMatchObject({ status: 'armed' });
    const logPath = path.join(
      // setupEnv() sets XDG_RUNTIME_DIR, so the test env has it.
      process.env.XDG_RUNTIME_DIR!,
      'skilled-relaunch',
      'relaunch.log',
    );
    const spawnErrors = readFileSync(logPath, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line.includes('agent-end-arm-error stage=spawn'));
    expect(spawnErrors).toHaveLength(1);
    expect(spawnErrors[0]).toMatch(/message=spawn_denied/);
  });

  it(
    'agent_end logs a synchronous killer spawn throw and leaves the record armed',
    async () => {
      setupEnv();
      const loopId = 'pi-loop-spawn-sync-error';
      process.env.SKILLED_LOOP_ID = loopId;
      preparePending({
        loopId,
        handoffPath: '/workspace/pi/handoff.md',
        sessionId: 'pi-session-0001',
        runtime: 'pi',
        cwd: '/workspace/pi',
        env: process.env,
      });
      spawnMock.mockImplementationOnce(() => {
        throw new Error('sync spawn denied');
      });
      const { api, handlers } = makeExtensionApi();
      sessionRelaunch(api);

      await expect(
        emit(handlers, 'agent_end', {}, makeContext()),
      ).resolves.toBeUndefined();

      expect(readRelaunchFile(loopId, process.env)).toMatchObject({ status: 'armed' });
      const logPath = path.join(
        // setupEnv() sets XDG_RUNTIME_DIR, so the test env has it.
        process.env.XDG_RUNTIME_DIR!,
        'skilled-relaunch',
        'relaunch.log',
      );
      const spawnErrors = readFileSync(logPath, 'utf8')
        .split(/\r?\n/)
        .filter((line) => line.includes('agent-end-arm-error stage=spawn'));
      expect(spawnErrors).toHaveLength(1);
      expect(spawnErrors[0]).toMatch(/message=sync_spawn_denied/);
    },
  );

  it('retries module loading after a dynamic import failure', async () => {
    setupEnv();
    process.env.SKILLED_LOOP_ID = 'pi-nudge-loop-0001';
    let failuresRemaining = 2;
    const failOncePerPath = async (specifier: string) => {
      if (failuresRemaining > 0) {
        failuresRemaining -= 1;
        throw new Error('transient dynamic import failure');
      }
      return vi.importActual(specifier);
    };
    vi.resetModules();
    vi.doMock('../lib/nudge.cjs', () => failOncePerPath('../lib/nudge.cjs'));
    vi.doMock('../../.skilled/hooks/session-relaunch/lib/nudge.cjs', () =>
      failOncePerPath('../../.skilled/hooks/session-relaunch/lib/nudge.cjs'));

    try {
      const retryModule = await import('./session-relaunch?retry-after-failure');
      const { api, handlers } = makeExtensionApi();
      retryModule.default(api);
      const event = {
        message: { role: 'assistant', usage: { input: 90 } },
      };
      const ctx = makeContext();

      await emit(handlers, 'message_end', event, ctx);
      expect(api.sendMessage).not.toHaveBeenCalled();
      await emit(handlers, 'message_end', event, ctx);
      await emit(handlers, 'agent_end', {}, ctx);
      expect(api.sendMessage).toHaveBeenCalledOnce();
    } finally {
      vi.doUnmock('../lib/nudge.cjs');
      vi.doUnmock('../../.skilled/hooks/session-relaunch/lib/nudge.cjs');
      vi.resetModules();
    }
  });

  it('refuses to load a relaunch core that lacks a function it calls', async () => {
    setupEnv();
    process.env.SKILLED_LOOP_ID = 'pi-nudge-loop-0001';
    const actual = await vi.importActual<Record<string, unknown>>('../lib/relaunch-core.cjs');
    const realCore = (actual.default ?? actual) as Record<string, unknown>;
    const brokenCore = { default: { ...realCore, arm: undefined } };
    vi.resetModules();
    vi.doMock('../lib/relaunch-core.cjs', () => brokenCore);
    vi.doMock('../../.skilled/hooks/session-relaunch/lib/relaunch-core.cjs', () => brokenCore);

    try {
      const brokenModule = await import('./session-relaunch?broken-core');
      const { api, handlers } = makeExtensionApi();
      brokenModule.default(api);
      const ctx = makeContext();

      // The nudge path calls no core function, so only a check at load stops it here.
      await emit(handlers, 'message_end', {
        message: { role: 'assistant', usage: { input: 90 } },
      }, ctx);
      await emit(handlers, 'agent_end', {}, ctx);
      expect(api.sendMessage).not.toHaveBeenCalled();
    } finally {
      vi.doUnmock('../lib/relaunch-core.cjs');
      vi.doUnmock('../../.skilled/hooks/session-relaunch/lib/relaunch-core.cjs');
      vi.resetModules();
    }
  });

  it('agent_end does nothing without a loop id or when the pending session differs', async () => {
    setupEnv();
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    await emit(handlers, 'agent_end', {}, makeContext());

    const loopId = 'pi-loop-different';
    process.env.SKILLED_LOOP_ID = loopId;
    preparePending({
      loopId,
      handoffPath: '/workspace/pi/handoff.md',
      sessionId: 'another-session',
      runtime: 'pi',
      cwd: '/workspace/pi',
      env: process.env,
    });
    await emit(handlers, 'agent_end', {}, makeContext());

    expect(readRelaunchFile(loopId, process.env)).toMatchObject({ status: 'pending' });
    expect(spawnMock).not.toHaveBeenCalled();
  });

  it('plans the handoff note under the resolved repo root', async () => {
    setupEnv();
    process.env.SKILLED_LOOP_ID = 'pi-nudge-loop-0001';
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90 } },
    }, makeContext());
    await emit(handlers, 'agent_end', {}, makeContext());

    const nudgeMessage = api.sendMessage.mock.calls[0][0] as { content: string };
    const match = nudgeMessage.content.match(/Write the handoff note at '([^']+)'/);
    expect(match).not.toBeNull();
    // The expect() above pins match to a non-null array.
    const notePath = match![1];
    expect(path.dirname(notePath)).toBe(
      path.join(
        // setupEnv() sets SESSION_RELAUNCH_REPO_ROOT, so the test env has it.
        process.env.SESSION_RELAUNCH_REPO_ROOT!,
        '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
      ),
    );
    expect(path.basename(notePath)).toMatch(/^\d{8}T\d{6}Z-pi-session-0001\.md$/);
  });

  it('resolves a relative SESSION_RELAUNCH_REPO_ROOT into an absolute note path', async () => {
    setupEnv();
    process.env.SKILLED_LOOP_ID = 'pi-nudge-loop-0001';
    process.env.SESSION_RELAUNCH_REPO_ROOT = 'relative-repo';
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90 } },
    }, makeContext());
    await emit(handlers, 'agent_end', {}, makeContext());

    const nudgeMessage = api.sendMessage.mock.calls[0][0] as { content: string };
    const match = nudgeMessage.content.match(/Write the handoff note at '([^']+)'/);
    expect(match).not.toBeNull();
    // The expect() above pins match to a non-null array.
    const notePath = match![1];
    expect(path.isAbsolute(notePath)).toBe(true);
    expect(path.dirname(notePath)).toBe(
      path.join(
        process.cwd(),
        'relative-repo',
        '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
      ),
    );
  });

  it('keeps the default threshold when the env switch is invalid', async () => {
    setupEnv();
    writeFileSync(
      // setupEnv() sets HOOK_FLAGS_CONFIG, so the test env has it.
      process.env.HOOK_FLAGS_CONFIG!,
      'SESSION_RELAUNCH_THRESHOLD=0.5\n',
    );
    process.env.SESSION_RELAUNCH_THRESHOLD = 'bogus';
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 60 } },
    }, makeContext());
    expect(api.sendMessage).not.toHaveBeenCalled();
  });

  it('reads the hook flags file once per message_end event', async () => {
    setupEnv();
    process.env.SKILLED_LOOP_ID = 'pi-nudge-loop-0001';
    delete process.env.SESSION_RELAUNCH_THRESHOLD;
    vi.resetModules();
    vi.doMock('../../.skilled/hooks/shared/hook-flags.mjs', async (importOriginal) => {
      const actual = await importOriginal<
        typeof import('../../.skilled/hooks/shared/hook-flags.mjs')
      >();
      return { ...actual, loadConfigFile: vi.fn(actual.loadConfigFile) };
    });
    try {
      const hookFlags = await import('../../.skilled/hooks/shared/hook-flags.mjs');
      const countedModule = await import('./session-relaunch?counted-config');
      const { api, handlers } = makeExtensionApi();
      countedModule.default(api);

      await emit(handlers, 'message_end', {
        message: { role: 'assistant', usage: { input: 90 } },
      }, makeContext());

      expect(api.sendMessage).not.toHaveBeenCalled();
      expect(vi.mocked(hookFlags.loadConfigFile)).toHaveBeenCalledTimes(1);

      await emit(handlers, 'agent_end', {}, makeContext());
      expect(api.sendMessage).toHaveBeenCalledOnce();
    } finally {
      vi.doUnmock('../../.skilled/hooks/shared/hook-flags.mjs');
      vi.resetModules();
    }
  });

  it('round-trips a literal backslash in the seed handoff path', async () => {
    setupEnv();
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    const result = await emit(handlers, 'before_agent_start', {
      prompt: '[session-relaunch] claim and continue handoff /tmp/we\\"ird.md',
      systemPrompt: 'base system prompt',
      systemPromptOptions: {},
    }, makeContext());

    expect((result as { systemPrompt: string }).systemPrompt)
      .toContain('/tmp/we\\"ird.md');
  });

  it('leaves the system prompt alone for a relative or untrimmed seed path', async () => {
    setupEnv();
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    for (const prompt of [
      '[session-relaunch] claim and continue handoff relative/handoff.md',
      '[session-relaunch] claim and continue handoff /workspace/note.md ',
    ]) {
      const result = await emit(handlers, 'before_agent_start', {
        prompt,
        systemPrompt: 'base system prompt',
        systemPromptOptions: {},
      }, makeContext());

      expect(result).toBeUndefined();
    }
  });

  // The extension shares the runtime's process, so it reports its own pid and lets the
  // core decide whether the loop variables were inherited from an outer session.
  it('drops the loop variables when the extension runs nested', async () => {
    setupEnv();
    // The drop rides the adapter's first module resolution, so only a fresh instance can
    // show it: the shared instance resolved its modules during an earlier test, and this
    // instance resolves its own on the first handler call.
    const dropNestedLoop = vi.fn(relaunchCore.dropNestedLoop);
    const observedCore = { default: { ...relaunchCore, dropNestedLoop } };
    vi.resetModules();
    vi.doMock('../lib/relaunch-core.cjs', () => observedCore);
    vi.doMock('../../.skilled/hooks/session-relaunch/lib/relaunch-core.cjs', () => observedCore);

    try {
      const nestedModule = await import('./session-relaunch?nested-drop');
      const { api, handlers } = makeExtensionApi();
      nestedModule.default(api);

      await emit(handlers, 'session_compact', {}, makeContext());

      expect(dropNestedLoop).toHaveBeenCalledOnce();
      expect(dropNestedLoop).toHaveBeenCalledWith(process.env, { hostPid: process.pid });

      // A second event on the same instance reuses the resolved modules, so the process
      // table is not read again for a host that already paid for one lookup.
      await emit(handlers, 'session_compact', {}, makeContext());

      expect(dropNestedLoop).toHaveBeenCalledOnce();
    } finally {
      vi.doUnmock('../lib/relaunch-core.cjs');
      vi.doUnmock('../../.skilled/hooks/session-relaunch/lib/relaunch-core.cjs');
      vi.resetModules();
    }
  });
});

// A compacted session keeps its id but loses the detail its open note holds, so the
// extension points the same session back at that note and spends its nudge level again.
describe('session_compact pointer', () => {
  const SESSION_ID = 'pi-session-0001';

  function writeOpenNote(): string {
    const directory = path.join(
      // setupEnv() sets SESSION_RELAUNCH_REPO_ROOT, so the note sits under the sandbox root.
      process.env.SESSION_RELAUNCH_REPO_ROOT!,
      '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
    );
    mkdirSync(directory, { recursive: true });
    const notePath = path.join(directory, `20261021T080000Z-${SESSION_ID.slice(0, 8)}.md`);
    writeFileSync(notePath, [
      '---',
      'status: open',
      `session_id: ${SESSION_ID}`,
      'spec_folder: ',
      '---',
      '## Goal', 'finish the handoff',
      '## Done', 'wrote the note',
      '## Remaining work', 'continue',
      '## In-flight state', 'pointer added',
    ].join('\n'));
    return notePath;
  }

  it('points a compacted session at its open note', async () => {
    setupEnv();
    const notePath = writeOpenNote();
    writeState(SESSION_ID, 1, process.env);
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);

    await emit(handlers, 'session_compact', {}, makeContext(SESSION_ID));

    expect(api.sendMessage).toHaveBeenCalledOnce();
    const message = api.sendMessage.mock.calls[0][0] as { content: string };
    expect(message).toMatchObject({ customType: 'session-relaunch', display: false });
    expect(message.content).toMatch(/^\[session-relaunch\] This session was compacted/);
    expect(message.content).toContain(notePath);
    expect(message.content).toContain('claim');
    expect(readState(SESSION_ID, process.env)).toBe(0);
  });

  it('adds nothing without an open note but resets the level', async () => {
    setupEnv();
    writeState(SESSION_ID, 1, process.env);
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);

    await emit(handlers, 'session_compact', {}, makeContext(SESSION_ID));

    expect(api.sendMessage).not.toHaveBeenCalled();
    expect(readState(SESSION_ID, process.env)).toBe(0);
  });

  it('drops a nudge held before the compaction', async () => {
    setupEnv();
    process.env.SKILLED_LOOP_ID = 'pi-compact-nudge-0001';
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);

    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90 } },
    }, makeContext(SESSION_ID));
    expect(api.sendMessage).not.toHaveBeenCalled();

    await emit(handlers, 'session_compact', {}, makeContext(SESSION_ID));
    await emit(handlers, 'agent_end', {}, makeContext(SESSION_ID));

    const nudges = api.sendMessage.mock.calls.filter(([message]) =>
      message.customType === 'session-relaunch' && /full/.test(String(message.content)));
    expect(nudges).toHaveLength(0);
  });

  it('adds nothing while a prepared hop owns the note', async () => {
    setupEnv();
    const notePath = writeOpenNote();
    const loopId = 'pi-compact-loop-0001';
    process.env.SKILLED_LOOP_ID = loopId;
    preparePending({
      loopId,
      handoffPath: notePath,
      sessionId: SESSION_ID,
      runtime: 'pi',
      cwd: '/workspace/pi',
      env: process.env,
    });
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);

    await emit(handlers, 'session_compact', {}, makeContext(SESSION_ID));

    expect(api.sendMessage).not.toHaveBeenCalled();
  });

  it('logs compact-pointer to relaunch.log', async () => {
    setupEnv();
    const notePath = writeOpenNote();
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);

    await emit(handlers, 'session_compact', {}, makeContext(SESSION_ID));

    const logPath = path.join(
      // setupEnv() sets XDG_RUNTIME_DIR, so the test env has it.
      process.env.XDG_RUNTIME_DIR!,
      'skilled-relaunch',
      'relaunch.log',
    );
    const pointerLines = readFileSync(logPath, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line.includes('compact-pointer'));
    expect(pointerLines).toHaveLength(1);
    expect(pointerLines[0]).toContain(notePath);
  });
});

// The same cases tests/adapter-conformance.test.cjs runs through the other adapters,
// kept here because this extension loads through a TypeScript transform.
describe('session-relaunch Pi extension conformance', () => {
  const NOTE_PATH = '/workspace/handoffs/note.md';
  const SEED = `[session-relaunch] claim and continue handoff ${NOTE_PATH}`;
  const CARRIED = ' (carried from the handoff; Gate 3 answered in the sending session)';
  const SESSION_ID = 'pi-session-0001';

  async function seedPrompt(prompt: string): Promise<string> {
    setupEnv();
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    const result = await emit(handlers, 'before_agent_start', {
      prompt,
      systemPrompt: 'base system prompt',
      systemPromptOptions: {},
    }, makeContext(SESSION_ID));
    return result === undefined ? '' : (result as { systemPrompt: string }).systemPrompt;
  }

  async function nudgeAtNinety(configure: () => void): Promise<string> {
    setupEnv();
    configure();
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90 } },
    }, makeContext(SESSION_ID));
    await emit(handlers, 'agent_end', {}, makeContext(SESSION_ID));
    const calls = vi.mocked(api.sendMessage).mock.calls;
    return calls.length === 0 ? '' : (calls[0][0] as { content: string }).content;
  }

  it('a well-formed seed adds the claim command and resumes the carried packet', async () => {
    const text = await seedPrompt(`${SEED} | Spec folder: ${SPEC_FOLDER}${CARRIED}`);
    expect(text).toContain(`claim '${NOTE_PATH}' --session '${SESSION_ID}'`);
    expect(text).toContain(`/speckit:resume ${SPEC_FOLDER}`);
  });

  it('a seed with a relative note path adds nothing', async () => {
    expect(await seedPrompt('[session-relaunch] claim and continue handoff relative/note.md'))
      .toBe('');
  });

  it('a seed carrying an invalid spec folder claims without resuming it', async () => {
    const text = await seedPrompt(`${SEED} | Spec folder: specs/not-a-packet${CARRIED}`);
    expect(text).toContain(`claim '${NOTE_PATH}'`);
    expect(text).not.toContain('/speckit:resume');
  });

  it('a nudge writes the bound packet from SYSTEM_SPEC_FOLDER into the note', async () => {
    const text = await nudgeAtNinety(() => {
      process.env.SKILLED_LOOP_ID = 'pi-conformance-loop-0003';
      process.env.SYSTEM_SPEC_FOLDER = SPEC_FOLDER;
    });
    expect(text).toMatch(new RegExp(`^ +spec_folder: ${SPEC_FOLDER}$`, 'm'));
    expect(text).toContain("--runtime 'pi'");
  });

  it('a nudge drops an invalid spec folder instead of writing it into the note', async () => {
    const text = await nudgeAtNinety(() => {
      process.env.SKILLED_LOOP_ID = 'pi-conformance-loop-0003';
      process.env.SYSTEM_SPEC_FOLDER = `${SPEC_FOLDER}\nstatus: done`;
    });
    expect(text).toMatch(/^ +spec_folder: $/m);
    expect(text).not.toMatch(/^ +status: done$/m);
  });

  it('a nudge stays silent while this session has a pending handoff', async () => {
    const text = await nudgeAtNinety(() => {
      const loopId = 'pi-conformance-loop-0001';
      process.env.SKILLED_LOOP_ID = loopId;
      preparePending({
        loopId,
        // setupEnv() sets XDG_RUNTIME_DIR, so the test env has it.
        handoffPath: path.join(process.env.XDG_RUNTIME_DIR!, 'note.md'),
        sessionId: SESSION_ID,
        runtime: 'pi',
        cwd: '/workspace/pi',
        env: process.env,
      });
    });
    expect(text).toBe('');
  });

  it('a nudge outside skilled-loop asks for keep and never prepare', async () => {
    const text = await nudgeAtNinety(() => { delete process.env.SKILLED_LOOP_ID; });
    expect(text).toContain(' keep --handoff ');
    expect(text).toContain("--runtime 'pi'");
    expect(text).not.toContain(' prepare --handoff');
  });

  it('a nudge stays silent at the hop cap', async () => {
    const text = await nudgeAtNinety(() => {
      process.env.SKILLED_LOOP_ID = 'pi-conformance-loop-0002';
      process.env.SKILLED_LOOP_HOPS = '2';
      process.env.SESSION_RELAUNCH_MAX_HOPS = '2';
    });
    expect(text).toBe('');
  });

  // The arm cases. Pi signals its own process, so the no-target case does not apply here.
  const ARM_LOOP_ID = 'pi-conformance-arm-0001';
  const LIVE_CWD = '/workspace/pi-live';
  // Past the default max age, so only a fresh arm stamp keeps the record relaunchable.
  const STALE_ARMED_AGE_MS = 20 * 60 * 1000;

  function prepareArmRecord({
    runtime = 'pi',
    sessionId = SESSION_ID,
    armedAgoMs,
  }: { runtime?: string; sessionId?: string; armedAgoMs?: number } = {}) {
    setupEnv();
    process.env.SKILLED_LOOP_ID = ARM_LOOP_ID;
    preparePending({
      loopId: ARM_LOOP_ID,
      // setupEnv() sets XDG_RUNTIME_DIR, so the test env has it.
      handoffPath: path.join(process.env.XDG_RUNTIME_DIR!, 'note.md'),
      sessionId,
      runtime,
      cwd: '/workspace/pi',
      env: process.env,
    });
    if (armedAgoMs !== undefined) {
      arm({
        loopId: ARM_LOOP_ID,
        cwd: '/workspace/pi',
        env: process.env,
        now: Date.now() - armedAgoMs,
      });
    }
    return readRelaunchFile(ARM_LOOP_ID, process.env);
  }

  async function stopEvent(): Promise<void> {
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);
    await emit(handlers, 'agent_end', {}, makeContext(SESSION_ID, LIVE_CWD));
  }

  it('an arm turns this session\'s pending record armed from the live cwd'
    + ' and starts one killer', async () => {
    prepareArmRecord();
    await stopEvent();
    expect(readRelaunchFile(ARM_LOOP_ID, process.env)).toMatchObject({
      status: 'armed',
      cwd: LIVE_CWD,
    });
    expect(spawnMock).toHaveBeenCalledTimes(1);
    const [, args] = spawnMock.mock.calls[0];
    expect(args[args.indexOf('--loop-id') + 1]).toBe(ARM_LOOP_ID);
    expect(args[args.indexOf('--target-pid') + 1]).toBe(String(process.pid));
  });

  it('a re-arm restamps an armed record whose killer is gone,'
    + ' so the wrapper still relaunches it', async () => {
    prepareArmRecord({ armedAgoMs: STALE_ARMED_AGE_MS });
    await stopEvent();
    const record = readRelaunchFile(ARM_LOOP_ID, process.env);
    expect(record).toMatchObject({ status: 'armed', cwd: LIVE_CWD });
    expect(shouldRelaunch(record)).toEqual({ relaunch: true });
    expect(spawnMock).toHaveBeenCalledTimes(1);
  });

  it('an arm leaves a pending record from another session untouched', async () => {
    const before = prepareArmRecord({ sessionId: 'another-session-0001' });
    await stopEvent();
    expect(readRelaunchFile(ARM_LOOP_ID, process.env)).toEqual(before);
    expect(spawnMock).not.toHaveBeenCalled();
  });

  it('an arm leaves a pending record prepared for another runtime untouched', async () => {
    const before = prepareArmRecord({ runtime: 'claude' });
    await stopEvent();
    expect(readRelaunchFile(ARM_LOOP_ID, process.env)).toEqual(before);
    expect(spawnMock).not.toHaveBeenCalled();
  });
});
