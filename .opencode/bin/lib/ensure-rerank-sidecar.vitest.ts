import { createRequire } from 'node:module';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const { ensureRerankSidecar } = require('./ensure-rerank-sidecar.cjs');

type HealthStep = 200 | 'error';

function createHttpMock(steps: HealthStep[]) {
  const get = vi.fn((_options, callback) => {
    const handlers = new Map<string, Function>();
    const req = {
      on: vi.fn((event: string, handler: Function) => {
        handlers.set(event, handler);
        return req;
      }),
      destroy: vi.fn(),
    };

    const step = steps.shift() ?? 'error';
    queueMicrotask(() => {
      if (step === 200) {
        callback({
          statusCode: 200,
          resume: vi.fn(),
        });
        return;
      }
      handlers.get('error')?.(new Error('ECONNREFUSED'));
    });

    return req;
  });

  return { get };
}

function createFsMock(startScriptExists: boolean) {
  return {
    existsSync: vi.fn(() => startScriptExists),
    mkdirSync: vi.fn(),
    openSync: vi.fn(() => 42),
  };
}

function createProcessMock(env: Record<string, string> = {}) {
  return {
    env,
    kill: vi.fn(),
    stderr: { write: vi.fn() },
  };
}

describe('ensureRerankSidecar', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('attaches when the sidecar is already healthy', async () => {
    const spawn = vi.fn();
    const result = await ensureRerankSidecar({
      deps: {
        fs: createFsMock(true),
        http: createHttpMock([200]),
        process: createProcessMock({ SPECKIT_CROSS_ENCODER: 'true' }),
        spawn,
      },
    });

    expect(result).toEqual({ spawned: false, port: 8765, ownerPid: null });
    expect(spawn).not.toHaveBeenCalled();
  });

  it('spawns the sidecar and returns ownerPid after warmup succeeds', async () => {
    const child = { pid: 1234, unref: vi.fn() };
    const spawn = vi.fn(() => child);
    const result = await ensureRerankSidecar({
      deps: {
        fs: createFsMock(true),
        http: createHttpMock(['error', 200]),
        os: { homedir: vi.fn(() => '/tmp/test-home') },
        process: createProcessMock({ SPECKIT_CROSS_ENCODER: 'true' }),
        sleep: vi.fn(async () => undefined),
        spawn,
      },
    });

    expect(spawn).toHaveBeenCalledWith(
      'bash',
      [expect.stringContaining('system-rerank-sidecar/scripts/start.sh')],
      expect.objectContaining({
        detached: true,
        stdio: ['ignore', 42, 42],
      }),
    );
    expect(child.unref).toHaveBeenCalledOnce();
    expect(result).toEqual({ spawned: true, port: 8765, ownerPid: 1234 });
  });

  it('degrades when the sidecar skill start script is not installed', async () => {
    const spawn = vi.fn();
    const result = await ensureRerankSidecar({
      deps: {
        fs: createFsMock(false),
        http: createHttpMock(['error']),
        log: vi.fn(),
        process: createProcessMock({ SPECKIT_CROSS_ENCODER: 'true' }),
        spawn,
      },
    });

    expect(result).toEqual({ spawned: false, port: 8765, fallback: 'no-sidecar-skill' });
    expect(spawn).not.toHaveBeenCalled();
  });

  it('kills the spawned process and degrades when warmup times out', async () => {
    const child = { pid: 5678, unref: vi.fn() };
    const processMock = createProcessMock({ SPECKIT_CROSS_ENCODER: 'true' });
    const result = await ensureRerankSidecar({
      healthTimeoutMs: 1,
      deps: {
        fs: createFsMock(true),
        http: createHttpMock(['error', 'error', 'error']),
        log: vi.fn(),
        os: { homedir: vi.fn(() => '/tmp/test-home') },
        process: processMock,
        sleep: vi.fn(() => new Promise((resolve) => setTimeout(resolve, 2))),
        spawn: vi.fn(() => child),
      },
    });

    expect(processMock.kill).toHaveBeenCalledWith(5678, 'SIGTERM');
    expect(result).toEqual({ spawned: false, port: 8765, fallback: 'warmup-timeout' });
  });

  it('opts out without probing or spawning when SPECKIT_CROSS_ENCODER is false', async () => {
    const http = createHttpMock([200]);
    const spawn = vi.fn();
    const result = await ensureRerankSidecar({
      deps: {
        fs: createFsMock(true),
        http,
        process: createProcessMock({ SPECKIT_CROSS_ENCODER: 'false' }),
        spawn,
      },
    });

    expect(result).toEqual({ spawned: false, port: 8765, fallback: 'cross-encoder-disabled' });
    expect(http.get).not.toHaveBeenCalled();
    expect(spawn).not.toHaveBeenCalled();
  });
});
