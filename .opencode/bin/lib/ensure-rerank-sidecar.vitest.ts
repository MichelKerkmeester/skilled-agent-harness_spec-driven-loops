import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const {
  ensureRerankSidecar,
  loadOrCreateOwnerToken,
  writeLedger,
  healthPayload,
  processLiveness,
} = require('./ensure-rerank-sidecar.cjs');

const MODULE_PATH = fileURLToPath(new URL('./ensure-rerank-sidecar.cjs', import.meta.url));

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
          setEncoding: vi.fn(),
          on: vi.fn((event: string, handler: Function) => {
            if (event === 'data') {
              queueMicrotask(() => handler('{"status":"ok"}'));
            }
            if (event === 'end') {
              queueMicrotask(() => handler());
            }
            return callback;
          }),
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
    fsyncSync: vi.fn(),
    readFileSync: vi.fn(() => ''),
    writeSync: vi.fn(),
    writeFileSync: vi.fn(),
    closeSync: vi.fn(),
    renameSync: vi.fn(),
    unlinkSync: vi.fn(),
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

  it.skip('attaches when the sidecar is already healthy', async () => {
    const spawn = vi.fn();
    const httpMock = createHttpMock([200]);
    const result = await ensureRerankSidecar({
      deps: {
        fs: createFsMock(true),
        http: httpMock,
        process: createProcessMock({ SPECKIT_CROSS_ENCODER: 'true' }),
        spawn,
      },
    });

    expect(result).toEqual({ spawned: false, port: 8765, ownerPid: null });
    expect(spawn).not.toHaveBeenCalled();
  }, 10000);

  it.skip('spawns the sidecar and returns ownerPid after warmup succeeds', async () => {
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

  it.skip('kills the spawned process and degrades when warmup times out', async () => {
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
    expect(result.spawned).toBe(false);
    expect(result.fallback).toBe('warmup-timeout');
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

describe('writeLedger — F13 temp-file security', () => {
  it('uses crypto-random suffix and exclusive-create (wx) flag', () => {
    const fsMock = {
      mkdirSync: vi.fn(),
      openSync: vi.fn(() => 99),
      writeSync: vi.fn(),
      closeSync: vi.fn(),
      renameSync: vi.fn(),
    };

    writeLedger('/fake/dir', [{ pid: 123, port: 8765, ownerToken: 'tok', canonicalConfigHash: 'abc' }], fsMock);

    expect(fsMock.mkdirSync).toHaveBeenCalledWith('/fake/dir', { recursive: true, mode: 0o700 });
    expect(fsMock.openSync).toHaveBeenCalledTimes(2);

    const tmpArg = fsMock.openSync.mock.calls[1][0] as string;
    const flagArg = fsMock.openSync.mock.calls[1][1] as string;

    expect(flagArg).toBe('wx');
    expect(tmpArg).toMatch(/\.tmp\.[0-9a-f]{32}$/);
    expect(fsMock.writeSync).toHaveBeenCalledTimes(1);
    expect(fsMock.closeSync).toHaveBeenCalledWith(99);
    expect(fsMock.renameSync).toHaveBeenCalledTimes(1);
  });

  it('fails with EEXIST when a symlink or file already exists at the temp path', () => {
    const eeexist = Object.assign(new Error('EEXIST: file already exists'), { code: 'EEXIST' });
    const fsMock = {
      mkdirSync: vi.fn(),
      openSync: vi.fn(() => { throw eeexist; }),
      writeSync: vi.fn(),
      closeSync: vi.fn(),
      renameSync: vi.fn(),
    };

    expect(() =>
      writeLedger('/fake/dir', [{ pid: 123, port: 8765, ownerToken: 'tok', canonicalConfigHash: 'abc' }], fsMock),
    ).toThrow('EEXIST');

    expect(fsMock.openSync).toHaveBeenCalledTimes(1);
    expect(fsMock.openSync.mock.calls[0][1]).toBe('wx');
    expect(fsMock.writeSync).not.toHaveBeenCalled();
    expect(fsMock.renameSync).not.toHaveBeenCalled();
  });
});

describe('loadOrCreateOwnerToken — F15 atomic owner token write', () => {
  it('writes a random temp file with exclusive-create, fsyncs, then renames', () => {
    const fsMock = {
      mkdirSync: vi.fn(),
      readFileSync: vi.fn(() => {
        const error = Object.assign(new Error('missing'), { code: 'ENOENT' });
        throw error;
      }),
      openSync: vi.fn(() => 7),
      writeSync: vi.fn(),
      fsyncSync: vi.fn(),
      closeSync: vi.fn(),
      renameSync: vi.fn(),
      unlinkSync: vi.fn(),
    };

    const token = loadOrCreateOwnerToken('/fake/owner-dir', fsMock, createProcessMock());

    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(fsMock.openSync).toHaveBeenCalledWith('/fake/owner-dir/.sidecar-owner-token.lock', 'wx', 0o600);
    expect(fsMock.openSync.mock.calls[1][0]).toMatch(/\.sidecar-owner-token\.tmp\.[0-9a-f]{32}$/);
    expect(fsMock.openSync.mock.calls[1][1]).toBe('wx');
    expect(fsMock.openSync.mock.calls[1][2]).toBe(0o600);
    expect(fsMock.writeSync).toHaveBeenCalledWith(7, `${token}\n`);
    expect(fsMock.fsyncSync).toHaveBeenCalledWith(7);
    expect(fsMock.renameSync).toHaveBeenCalledWith(
      expect.stringMatching(/\.sidecar-owner-token\.tmp\.[0-9a-f]{32}$/),
      '/fake/owner-dir/.sidecar-owner-token',
    );
    expect(fsMock.unlinkSync).toHaveBeenCalledWith('/fake/owner-dir/.sidecar-owner-token.lock');
  });

  it('concurrent two-process creation returns one winner token without corruption', async () => {
    const stateDir = mkdtempSync(path.join(tmpdir(), 'rerank-owner-token-'));

    try {
      const script = `
        const mod = require(process.env.MODULE_PATH);
        const token = mod.loadOrCreateOwnerToken(process.env.STATE_DIR, require('fs'), process);
        process.stdout.write(token + '\\n');
      `;
      const run = () => new Promise<string>((resolve, reject) => {
        const child = spawn(process.execPath, ['-e', script], {
          env: {
            MODULE_PATH,
            STATE_DIR: stateDir,
          },
          stdio: ['ignore', 'pipe', 'pipe'],
        });
        let stdout = '';
        let stderr = '';
        child.stdout.setEncoding('utf8');
        child.stderr.setEncoding('utf8');
        child.stdout.on('data', (chunk) => { stdout += chunk; });
        child.stderr.on('data', (chunk) => { stderr += chunk; });
        child.on('error', reject);
        child.on('exit', (code) => {
          if (code === 0) {
            resolve(stdout.trim());
            return;
          }
          reject(new Error(`child exited ${code}: ${stderr}`));
        });
      });

      const tokens = await Promise.all([run(), run()]);
      const persisted = readFileSync(path.join(stateDir, '.sidecar-owner-token'), 'utf8').trim();

      expect(tokens[0]).toBeTruthy();
      expect(tokens[0]).toBe(tokens[1]);
      expect(persisted).toBe(tokens[0]);
    } finally {
      rmSync(stateDir, { recursive: true, force: true });
    }
  });
});

describe('ensureRerankSidecar — F49 child environment allowlist', () => {
  it('passes allowlisted env keys and strips unrelated parent variables', async () => {
    const child = { pid: 1234, unref: vi.fn() };
    const spawnMock = vi.fn(() => child);

    await ensureRerankSidecar({
      healthTimeoutMs: 1,
      deps: {
        fs: createFsMock(true),
        http: createHttpMock(['error']),
        log: vi.fn(),
        os: { homedir: vi.fn(() => '/tmp/test-home') },
        process: createProcessMock({
          PATH: '/usr/bin:/bin',
          HOME: '/tmp/test-home',
          LANG: 'en_US.UTF-8',
          LC_ALL: 'en_US.UTF-8',
          SPECKIT_CROSS_ENCODER: 'true',
          SPECKIT_ALLOWED_TEST_FLAG: '1',
          RERANK_SIDECAR_OWNER_TOKEN: 'explicit-owner-token',
          RERANK_ALLOWED_MODELS: 'Qwen/Qwen3-Reranker-0.6B',
          CUSTOM_TEST_SECRET: 'must-not-leak',
        }),
        sleep: vi.fn(async () => undefined),
        spawn: spawnMock,
      },
    });

    const env = spawnMock.mock.calls[0][2].env as Record<string, string>;
    expect(env.PATH).toBe('/usr/bin:/bin');
    expect(env.HOME).toBe('/tmp/test-home');
    expect(env.LANG).toBe('en_US.UTF-8');
    expect(env.LC_ALL).toBe('en_US.UTF-8');
    expect(env.SPECKIT_ALLOWED_TEST_FLAG).toBe('1');
    expect(env.RERANK_ALLOWED_MODELS).toBe('Qwen/Qwen3-Reranker-0.6B');
    expect(env.RERANK_SIDECAR_PORT).toBe('8765');
    expect(env.RERANK_SIDECAR_OWNER_TOKEN).toBe('explicit-owner-token');
    expect(env.CUSTOM_TEST_SECRET).toBeUndefined();
  });
});

describe('healthPayload — F85 body cap', () => {
  it.skip('resolves null when response body exceeds MAX_HEALTH_BODY_BYTES (64KB)', async () => {
    let capturedReq: any = null;

    const httpMock = {
      get: vi.fn((_options, callback) => {
        const req = {
          on: vi.fn((event: string, handler: Function) => {
            if (event === 'error') {
              // No error
            }
            if (event === 'timeout') {
              // No timeout
            }
            return req;
          }),
          destroy: vi.fn(),
        };
        capturedReq = req;

        const res = {
          statusCode: 200,
          setEncoding: vi.fn(),
          on: vi.fn((event: string, handler: Function) => {
            if (event === 'data') {
              // Send a chunk that would exceed the cap
              queueMicrotask(() => handler('x'.repeat(70000)));
            }
            if (event === 'end') {
              // Should not be called due to cap
              queueMicrotask(() => handler());
            }
            return res;
          }),
        };
        queueMicrotask(() => callback(res));
        return req;
      }),
    };

    const result = await healthPayload(8765, 2000, { http: httpMock });

    expect(result).toBeNull();
    expect(capturedReq.destroy).toHaveBeenCalled();
  });

  it.skip('accepts response body within MAX_HEALTH_BODY_BYTES (64KB)', async () => {
    const httpMock = {
      get: vi.fn((_options, callback) => {
        const req = {
          on: vi.fn((event: string, handler: Function) => {
            if (event === 'error') {
              // No error
            }
            if (event === 'timeout') {
              // No timeout
            }
            return req;
          }),
          destroy: vi.fn(),
        };

        const res = {
          statusCode: 200,
          setEncoding: vi.fn(),
          on: vi.fn((event: string, handler: Function) => {
            if (event === 'data') {
              queueMicrotask(() => handler('{"status":"ok"}'));
            }
            if (event === 'end') {
              queueMicrotask(() => handler());
            }
            return res;
          }),
        };
        queueMicrotask(() => callback(res));
        return req;
      }),
    };

    const result = await healthPayload(8765, 2000, { http: httpMock });

    expect(result).toEqual({ status: 'ok' });
  });
});

describe('processLiveness — F88 explicit error handling', () => {
  it('returns alive with reason for successful kill signal', () => {
    const processMock = createProcessMock();
    processMock.kill = vi.fn();

    const result = processLiveness(1234, processMock);

    expect(result).toEqual({ alive: true, reason: 'kill-success' });
    expect(processMock.kill).toHaveBeenCalledWith(1234, 0);
  });

  it('returns dead with reason for ESRCH error', () => {
    const processMock = createProcessMock();
    const esrchError = Object.assign(new Error('No such process'), { code: 'ESRCH' });
    processMock.kill = vi.fn(() => { throw esrchError; });

    const result = processLiveness(1234, processMock);

    expect(result).toEqual({ alive: false, reason: 'esrch' });
    expect(processMock.kill).toHaveBeenCalledWith(1234, 0);
  });

  it('returns alive with reason for EPERM error', () => {
    const processMock = createProcessMock();
    const epermError = Object.assign(new Error('Operation not permitted'), { code: 'EPERM' });
    processMock.kill = vi.fn(() => { throw epermError; });

    const result = processLiveness(1234, processMock);

    expect(result).toEqual({ alive: true, reason: 'eperm-other-owner' });
    expect(processMock.kill).toHaveBeenCalledWith(1234, 0);
  });

  it('returns alive with unknown-default-alive reason and logs stderr for unknown error codes (F88)', () => {
    const processMock = createProcessMock();
    const unknownError = Object.assign(new Error('Unknown error'), { code: 'UNKNOWN' });
    processMock.kill = vi.fn(() => { throw unknownError; });

    const result = processLiveness(1234, processMock);

    expect(result).toEqual({
      alive: true,
      reason: 'unknown-default-alive',
      errorCode: 'UNKNOWN',
    });
    expect(processMock.kill).toHaveBeenCalledWith(1234, 0);
    expect(processMock.stderr.write).toHaveBeenCalledWith(
      '[processLiveness] unexpected error code UNKNOWN for pid 1234\n'
    );
  });
});
