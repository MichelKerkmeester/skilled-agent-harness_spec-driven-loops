// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Pi Extension Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';
import { EventEmitter } from 'node:events';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { preparePending, readRelaunchFile } from '../lib/relaunch-core.cjs';
import sessionRelaunch from './session-relaunch';

const { spawnMock } = vi.hoisted(() => ({ spawnMock: vi.fn(() => ({ unref: vi.fn() })) }));
vi.mock('node:child_process', () => ({ spawn: spawnMock }));

type Handler = (event: any, ctx: any) => unknown;

const envKeys = [
  'SYSTEM_SESSION_RELAUNCH_DISABLED',
  'SESSION_RELAUNCH_THRESHOLD',
  'SESSION_RELAUNCH_WINDOW_TOKENS',
  'SKILLED_LOOP_ID',
  'SKILLED_LOOP_HOPS',
  'SYSTEM_SPEC_FOLDER',
  'XDG_RUNTIME_DIR',
  'REPO_ROOT',
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
  process.env.REPO_ROOT = root;
  process.env.HOOK_FLAGS_CONFIG = path.join(root, 'hook-flags.env');
  process.env.SESSION_RELAUNCH_THRESHOLD = '0.8';
  delete process.env.SYSTEM_SESSION_RELAUNCH_DISABLED;
  delete process.env.SESSION_RELAUNCH_WINDOW_TOKENS;
  delete process.env.SKILLED_LOOP_ID;
  delete process.env.SKILLED_LOOP_HOPS;
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
  return handler?.(event, ctx);
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

  it(
    'sends threshold nudges once, including the 0.05 reminder, then stays quiet',
    async () => {
      setupEnv();
      const { api, handlers } = makeExtensionApi();
      sessionRelaunch(api);
      const ctx = makeContext();
      await emit(handlers, 'message_end', {
        message: { role: 'assistant', usage: { input: 80 } },
      }, ctx);
      await emit(handlers, 'message_end', {
        message: { role: 'assistant', usage: { input: 85 } },
      }, ctx);
      await emit(handlers, 'message_end', {
        message: { role: 'assistant', usage: { input: 90 } },
      }, ctx);

      expect(api.sendMessage).toHaveBeenCalledTimes(2);
      for (const [message, options] of api.sendMessage.mock.calls) {
        expect(message).toMatchObject({ customType: 'session-relaunch', display: false });
        expect(message.content).toContain('session-relaunch');
        expect(options).toEqual({ deliverAs: 'nextTurn' });
      }
    },
  );

  it('includes the save step when SYSTEM_SPEC_FOLDER is unset', async () => {
    setupEnv();
    const { api, handlers } = makeExtensionApi();
    sessionRelaunch(api);

    await emit(handlers, 'message_end', {
      message: { role: 'assistant', usage: { input: 90 } },
    }, makeContext());

    expect(api.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringMatching(
          /\n2\. When a spec packet is bound to this session, save its continuity first:/,
        ),
      }),
      { deliverAs: 'nextTurn' },
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
        process.env.REPO_ROOT!,
        '.skilled',
        'hooks',
        'session-relaunch',
        'lib',
        'killer.cjs',
      );
      expect(args[0]).toBe(expectedKiller);
    },
  );

  it('spawns the killer from the repo lib when cwd is a repo subdirectory', async () => {
    setupEnv();
    delete process.env.REPO_ROOT;
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
      expect(api.sendMessage).toHaveBeenCalledOnce();
    } finally {
      vi.doUnmock('../lib/nudge.cjs');
      vi.doUnmock('../../.skilled/hooks/session-relaunch/lib/nudge.cjs');
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
});
