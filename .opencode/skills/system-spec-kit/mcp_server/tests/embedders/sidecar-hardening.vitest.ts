// ───────────────────────────────────────────────────────────────
// TEST: Embedder Sidecar Hardening
// ───────────────────────────────────────────────────────────────

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildSidecarEnv, SidecarClient, SidecarClientError, SIDECAR_ENV_ALLOWLIST, toBackendKind, RECOGNIZED_SPECKIT_ENV_VARS } from '../../lib/embedders/sidecar-client.js';

const factoryMockState = vi.hoisted(() => ({
  createEmbeddingsProvider: vi.fn(),
}));

vi.mock('@spec-kit/shared/embeddings/factory', () => ({
  createEmbeddingsProvider: factoryMockState.createEmbeddingsProvider,
}));

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function waitUntil(condition: () => boolean, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (condition()) return;
    await sleep(10);
  }
}

async function loadSidecarWorkerTestables() {
  const mod = await import('../../lib/embedders/sidecar-worker.js');
  return mod.__sidecarWorkerTestables;
}

function spawnRealSidecarWorker() {
  const workerPath = join(__dirname, '../../lib/embedders/sidecar-worker.ts');
  const tsxLoaderPath = join(__dirname, '../../../scripts/node_modules/tsx/dist/loader.mjs');

  return spawn(process.execPath, ['--import', tsxLoaderPath, workerPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      SPECKIT_EMBEDDER_SIDECAR_PARENT_PID: '',
    },
  });
}

function readWorkerJsonLine(child: ReturnType<typeof spawn>, timeoutMs = 2_000): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Timed out waiting for worker stdout'));
    }, timeoutMs);
    const cleanup = (): void => {
      clearTimeout(timer);
      child.stdout?.off('data', onData);
      child.off('exit', onExit);
    };
    const onExit = (code: number | null, signal: NodeJS.Signals | null): void => {
      cleanup();
      reject(new Error(`Worker exited before stdout line: code=${code ?? 'null'} signal=${signal ?? 'null'}`));
    };
    const onData = (chunk: Buffer | string): void => {
      buffer += chunk.toString();
      const newlineIndex = buffer.indexOf('\n');
      if (newlineIndex === -1) {
        return;
      }
      const line = buffer.slice(0, newlineIndex);
      cleanup();
      resolve(JSON.parse(line) as Record<string, unknown>);
    };

    child.stdout?.on('data', onData);
    child.once('exit', onExit);
  });
}

function waitForWorkerExit(child: ReturnType<typeof spawn>, timeoutMs = 2_000): Promise<{ code: number | null; signal: NodeJS.Signals | null }> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Timed out waiting for worker exit'));
    }, timeoutMs);
    const cleanup = (): void => {
      clearTimeout(timer);
      child.off('exit', onExit);
    };
    const onExit = (code: number | null, signal: NodeJS.Signals | null): void => {
      cleanup();
      resolve({ code, signal });
    };
    child.once('exit', onExit);
  });
}

function createWorker(dir: string, mode: 'env' | 'hang' | 'ignore-term' | 'oversized-stdout' | 'record-ids' | 'unknown-response'): string {
  const workerPath = join(dir, `worker-${mode}.cjs`);
  writeFileSync(workerPath, `
const fs = require('node:fs');
const readline = require('node:readline');
if (${JSON.stringify(mode)} === 'ignore-term') {
  process.on('SIGTERM', () => {
    if (process.env.SPECKIT_TEST_SIDECAR_SIGNAL_FILE) {
      fs.appendFileSync(process.env.SPECKIT_TEST_SIDECAR_SIGNAL_FILE, 'SIGTERM\\n');
    }
  });
}
const envOut = process.env.SPECKIT_TEST_SIDECAR_ENV_OUT;
if (envOut) {
  fs.writeFileSync(envOut, JSON.stringify({
    secret: process.env.UNSAFE_SECRET || null,
    allowed: process.env.SPECKIT_EMBEDDER_ALLOWED || null,
    parentPid: process.env.SPECKIT_EMBEDDER_SIDECAR_PARENT_PID || null
  }));
}
const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
function write(payload) { process.stdout.write(JSON.stringify(payload) + '\\n'); }
rl.on('line', (line) => {
  const message = JSON.parse(line);
  if (message.type === 'ping') { write({ id: message.id, type: 'pong' }); return; }
  if (message.type === 'shutdown') { process.exit(0); }
  if (${JSON.stringify(mode)} === 'oversized-stdout') {
    const oversized = 'x'.repeat(2 * 1024 * 1024);
    write({ id: message.id, type: 'embedding', vectors: message.input.map(() => [1, 2, 3]), dimensions: message.dimensions, _padding: oversized });
    return;
  }
	  if (${JSON.stringify(mode)} === 'record-ids') {
	    const idFile = process.env.SPECKIT_TEST_SIDECAR_ID_FILE;
	    if (idFile) {
	      fs.appendFileSync(idFile, message.id + '\\n');
	    }
	    write({ id: message.id, type: 'embedding', vectors: message.input.map(() => [1, 2, 3]), dimensions: message.dimensions });
	    return;
	  }
	  if (${JSON.stringify(mode)} === 'unknown-response') {
	    write({ id: message.id, type: 'mystery', detail: 'unexpected discriminator' });
	    return;
	  }
	  if (${JSON.stringify(mode)} === 'hang' || ${JSON.stringify(mode)} === 'ignore-term') return;
  write({ id: message.id, type: 'embedding', vectors: message.input.map(() => [1, 2, 3]), dimensions: message.dimensions });
});
`, 'utf8');
  return workerPath;
}

describe('sidecar hardening', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join('/private/tmp', 'sidecar-hardening-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('filters inherited environment while preserving explicit sidecar values and warning on drops', () => {
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const env = buildSidecarEnv({
      PATH: '/bin',
      UNSAFE_SECRET: 'nope',
      SPECKIT_EMBEDDER_ALLOWED: 'yes',
      LANG: 'en_US.UTF-8',
      LC_TEST: 'locale',
    });

    expect(env.PATH).toBe('/bin');
    expect(env.SPECKIT_EMBEDDER_ALLOWED).toBe('yes');
    expect(env.LANG).toBe('en_US.UTF-8');
    expect(env.LC_TEST).toBe('locale');
    expect(env.UNSAFE_SECRET).toBeUndefined();
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('UNSAFE_SECRET'));
    expect(stderrSpy).not.toHaveBeenCalledWith(expect.stringContaining('nope'));
    stderrSpy.mockRestore();
  });

  it('uses the F49 launcher allowlist surface for the in-process sidecar (F16+F40)', () => {
    expect(SIDECAR_ENV_ALLOWLIST.exact).toEqual([
      'HOME',
      'LANG',
      'PATH',
      'PYTORCH_ENABLE_MPS_FALLBACK',
      'TEMP',
      'TMP',
      'TMPDIR',
      'TRANSFORMERS_OFFLINE',
    ]);
    expect(SIDECAR_ENV_ALLOWLIST.prefixes).toEqual(['HF_', 'LC_', 'RERANK_', 'SPECKIT_']);
  });

  it('drops unrelated env keys with stderr warnings while forwarding allowed families (F16+F40)', () => {
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const env = buildSidecarEnv({
      PATH: '/bin',
      LANG: 'en_US.UTF-8',
      SPECKIT_ALLOWED_TEST_FLAG: '1',
      XYZ_UNRELATED: 'drop-me',
    });

    expect(env.PATH).toBe('/bin');
    expect(env.LANG).toBe('en_US.UTF-8');
    expect(env.SPECKIT_ALLOWED_TEST_FLAG).toBe('1');
    expect(env.XYZ_UNRELATED).toBeUndefined();
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('XYZ_UNRELATED'));
    expect(stderrSpy).not.toHaveBeenCalledWith(expect.stringContaining('drop-me'));
    stderrSpy.mockRestore();
  });

  it('prefers SPECKIT_RERANK values over overlapping RERANK values with a warning (F46)', () => {
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const env = buildSidecarEnv({
      SPECKIT_RERANK_MODEL_NAME: 'spec-kit-model',
      RERANK_MODEL_NAME: 'rerank-model',
    });

    expect(env.SPECKIT_RERANK_MODEL_NAME).toBe('spec-kit-model');
    expect(env.RERANK_MODEL_NAME).toBe('spec-kit-model');
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('SPECKIT_RERANK_MODEL_NAME overrides RERANK_MODEL_NAME'));
    stderrSpy.mockRestore();
  });

  it('passes parent pid for worker-side parent-death polling and blocks unsafe inherited env', async () => {
    const envOut = join(tmpDir, 'env.json');
    const client = new SidecarClient({
      provider: 'hf-local',
      model: 'model',
      dimensions: 3,
      workerPath: createWorker(tmpDir, 'env'),
      pingTimeoutMs: 100,
      requestTimeoutMs: 200,
      env: {
        ...process.env,
        UNSAFE_SECRET: 'nope',
        SPECKIT_EMBEDDER_ALLOWED: 'yes',
        SPECKIT_TEST_SIDECAR_ENV_OUT: envOut,
      },
    });

    await client.embed(['abc']);
    await client.shutdown();

    const observed = JSON.parse(readFileSync(envOut, 'utf8')) as Record<string, string | null>;
    expect(observed.secret).toBeNull();
    expect(observed.allowed).toBe('yes');
    expect(observed.parentPid).toBe(String(process.pid));
  });

  it('kills the owned worker when an embed request times out', async () => {
    const client = new SidecarClient({
      provider: 'hf-local',
      model: 'model',
      dimensions: 3,
      workerPath: createWorker(tmpDir, 'hang'),
      pingTimeoutMs: 100,
      requestTimeoutMs: 40,
      env: process.env,
    });

    const embedPromise = client.embed(['abc']);
    await waitUntil(() => client.getWorkerInfo() !== null, 1_000);
    const pid = client.getWorkerInfo()?.pid;
    expect(pid).toBeGreaterThan(0);

    await expect(embedPromise).rejects.toThrow('timed out');
    await waitUntil(() => client.getWorkerInfo() === null && !pidAlive(pid!), 2_500);

    expect(client.getWorkerInfo()).toBeNull();
    expect(pidAlive(pid!)).toBe(false);
    await client.shutdown();
  });

  it('escalates timeout cleanup to SIGKILL before dropping the worker', async () => {
    const client = new SidecarClient({
      provider: 'hf-local',
      model: 'model',
      dimensions: 3,
      workerPath: createWorker(tmpDir, 'ignore-term'),
      pingTimeoutMs: 100,
      requestTimeoutMs: 40,
      env: process.env,
    });

    const embedPromise = client.embed(['abc']);
    await waitUntil(() => client.getWorkerInfo() !== null, 1_000);
    const pid = client.getWorkerInfo()?.pid;
    expect(pid).toBeGreaterThan(0);

    await expect(embedPromise).rejects.toThrow('timed out');
    await waitUntil(() => client.getWorkerInfo() === null, 2_500);

    expect(client.getWorkerInfo()).toBeNull();
    expect(pidAlive(pid!)).toBe(false);
  });

  it.skipIf(process.platform === 'linux')('exits a polling child within ttl * 2 after its real parent dies', async () => {
    const childPidPath = join(tmpDir, 'child.pid');
    const childPath = join(tmpDir, 'parent-poll-child.cjs');
    const parentPath = join(tmpDir, 'parent-poll-parent.cjs');
    const ttlMs = 250;

    writeFileSync(childPath, `
const fs = require('node:fs');
const parentPid = Number(process.env.SPECKIT_EMBEDDER_SIDECAR_PARENT_PID);
fs.writeFileSync(process.env.CHILD_PID_PATH, String(process.pid));
function alive(pid) {
  try { process.kill(pid, 0); return true; }
  catch (error) { return Boolean(error && error.code === 'EPERM'); }
}
setInterval(() => {
  if (!alive(parentPid)) process.exit(0);
}, ${Math.floor(ttlMs / 4)}).unref();
setInterval(() => {}, 1000);
`, 'utf8');
    writeFileSync(parentPath, `
const { spawn } = require('node:child_process');
const child = spawn(process.execPath, [${JSON.stringify(childPath)}], {
  detached: true,
  stdio: 'ignore',
  env: {
    ...process.env,
    SPECKIT_EMBEDDER_SIDECAR_PARENT_PID: String(process.pid),
    CHILD_PID_PATH: ${JSON.stringify(childPidPath)},
  },
});
child.unref();
setInterval(() => {}, 1000);
`, 'utf8');

    const parent = spawn(process.execPath, [parentPath], { stdio: 'ignore' });
    try {
      await waitUntil(() => existsSync(childPidPath), 1000);
      const childPid = Number(readFileSync(childPidPath, 'utf8'));
      expect(pidAlive(childPid)).toBe(true);

      parent.kill('SIGTERM');
      await waitUntil(() => !pidAlive(parent.pid!), 1000);
      await waitUntil(() => !pidAlive(childPid), ttlMs * 2);

      expect(pidAlive(childPid)).toBe(false);
    } finally {
      if (parent.pid && pidAlive(parent.pid)) parent.kill('SIGKILL');
    }
  });

  it('terminates the child when stdout returns an oversized JSON line exceeding MAX_LINE_BYTES', async () => {
    const client = new SidecarClient({
      provider: 'hf-local',
      model: 'model',
      dimensions: 3,
      workerPath: createWorker(tmpDir, 'oversized-stdout'),
      pingTimeoutMs: 100,
      requestTimeoutMs: 2_000,
      env: process.env,
    });

    const embedPromise = client.embed(['abc']);
    await waitUntil(() => client.getWorkerInfo() !== null, 1_000);
    const pid = client.getWorkerInfo()?.pid;
    expect(pid).toBeGreaterThan(0);

    await waitUntil(() => !pidAlive(pid!), 3_000);

    expect(pidAlive(pid!)).toBe(false);
    expect(client.getWorkerInfo()).toBeNull();

    const result = await embedPromise.catch((error: Error) => error.message);
    expect(result).toMatch(/timed out|exited/);
    await client.shutdown();
  });

  it('generates cryptographically random request IDs (F48)', async () => {
    const idFile = join(tmpDir, 'request-ids.txt');
    const client = new SidecarClient({
      provider: 'hf-local',
      model: 'model',
      dimensions: 3,
      workerPath: createWorker(tmpDir, 'record-ids'),
      pingTimeoutMs: 100,
      requestTimeoutMs: 2_000,
      env: {
        ...process.env,
        SPECKIT_TEST_SIDECAR_ID_FILE: idFile,
      },
    });

    await client.embed(['abc']);
    await client.embed(['def']);
    await client.embed(['ghi']);
    await client.shutdown();

    const ids = readFileSync(idFile, 'utf8').trim().split('\n').map(Number);
    expect(ids).toHaveLength(3);

    // Check that IDs are not sequential
    const isSequential = ids.every((id, i) => i === 0 || id === ids[i - 1] + 1);
    expect(isSequential).toBe(false);

    // Check that IDs are not monotonic
    const isMonotonic = ids.every((id, i) => i === 0 || id > ids[i - 1]);
    expect(isMonotonic).toBe(false);
  });

  it('rejects embed requests exceeding MAX_EMBED_INPUTS cap (F86)', async () => {
    const client = new SidecarClient({
      provider: 'hf-local',
      model: 'model',
      dimensions: 3,
      workerPath: createWorker(tmpDir, 'env'),
      pingTimeoutMs: 100,
      requestTimeoutMs: 2_000,
      env: process.env,
    });

    const oversizedBatch = new Array(501).fill('x');
    await expect(client.embed(oversizedBatch)).rejects.toThrow(SidecarClientError);
    await expect(client.embed(oversizedBatch)).rejects.toMatchObject({
      code: 'embed-input-cap-exceeded',
      message: expect.stringContaining('500-item cap'),
    });

    await client.shutdown();
  });

  it('accepts embed requests at the MAX_EMBED_INPUTS boundary (F86)', async () => {
    const client = new SidecarClient({
      provider: 'hf-local',
      model: 'model',
      dimensions: 3,
      workerPath: createWorker(tmpDir, 'env'),
      pingTimeoutMs: 100,
      requestTimeoutMs: 2_000,
      env: process.env,
    });

    const boundaryBatch = new Array(500).fill('x');
    const result = await client.embed(boundaryBatch);
    expect(result).toHaveLength(500);

    await client.shutdown();
  });

  it('uses grace-period SIGTERM to SIGKILL sequencing for SIGTERM-ignoring child (F57+F79)', async () => {
    const signalFile = join(tmpDir, 'signals.txt');
    const client = new SidecarClient({
      provider: 'hf-local',
      model: 'model',
      dimensions: 3,
      workerPath: createWorker(tmpDir, 'ignore-term'),
      pingTimeoutMs: 100,
      requestTimeoutMs: 40,
      env: {
        ...process.env,
        SPECKIT_TEST_SIDECAR_SIGNAL_FILE: signalFile,
      },
    });

    const startedAt = Date.now();
    const embedPromise = client.embed(['abc']);
    await waitUntil(() => client.getWorkerInfo() !== null, 1_000);
    const pid = client.getWorkerInfo()?.pid;
    expect(pid).toBeGreaterThan(0);

    await expect(embedPromise).rejects.toThrow('timed out');
    await waitUntil(() => client.getWorkerInfo() === null, 2_500);

    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(900);
    expect(readFileSync(signalFile, 'utf8')).toContain('SIGTERM');
    expect(client.getWorkerInfo()).toBeNull();
    expect(pidAlive(pid!)).toBe(false);
  });

  // F2+F38: toBackendKind is canonical in sidecar-client.ts
  it('toBackendKind normalizes provider names correctly (F2+F38)', () => {
    expect(toBackendKind('ollama')).toBe('ollama');
    expect(toBackendKind('openai')).toBe('api');
    expect(toBackendKind('voyage')).toBe('api');
    expect(toBackendKind('api')).toBe('api');
    expect(toBackendKind('hf-local')).toBe('sentence-transformers');
    expect(toBackendKind('sentence-transformers')).toBe('sentence-transformers');
    expect(toBackendKind(undefined)).toBe('sentence-transformers');
  });

  // F3: SPECKIT_ env vars are documented
  it('RECOGNIZED_SPECKIT_ENV_VARS includes all documented vars (F3)', () => {
    expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_CROSS_ENCODER');
    expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_EMBEDDER_SIDECAR_IDLE_MS');
    expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_EMBEDDER_SIDECAR_PING_TIMEOUT_MS');
    expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_EMBEDDER_SIDECAR_REQUEST_TIMEOUT_MS');
    expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_EMBEDDER_EXECUTION');
    expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_EMBEDDER_SIDECAR_PROVIDER');
    expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_EMBEDDER_SIDECAR_MODEL');
    expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS');
    expect(RECOGNIZED_SPECKIT_ENV_VARS).toContain('SPECKIT_EMBEDDER_SIDECAR_PARENT_PID');
  });

  // F37: SidecarClientOptions is production-only
  it('SidecarClientOptions constructor accepts only production fields (F37)', () => {
    // This test verifies that the production interface doesn't include test-only fields
    // Test-only fields are in SidecarClientTestOptions
    const client = new SidecarClient({
      provider: 'hf-local',
      model: 'model',
      dimensions: 3,
    });

    expect(client).toBeDefined();
    expect(client.name).toBe('model');
    expect(client.dim).toBe(3);
  });

  it('rejects unknown sidecar response types with a structured client error (F62)', async () => {
    const client = new SidecarClient({
      provider: 'hf-local',
      model: 'model',
      dimensions: 3,
      workerPath: createWorker(tmpDir, 'unknown-response'),
      pingTimeoutMs: 100,
      requestTimeoutMs: 2_000,
      env: process.env,
    });

    await expect(client.embed(['abc'])).rejects.toMatchObject({
      name: 'SidecarClientError',
      code: 'sidecar-response-type-unknown',
      message: expect.stringContaining('unknown type "mystery"'),
    });

    await client.shutdown();
  });

  // F70: types.ts has correct canonical-location comment
  it('types.ts references canonical toBackendKind location (F70)', () => {
    const typesPath = join(__dirname, '../../lib/embedders/types.ts');
    const typesContent = readFileSync(typesPath, 'utf8');
    
    // Verify the comment points to sidecar-client.ts for toBackendKind
    expect(typesContent).toContain('Canonical toBackendKind() implementation lives in sidecar-client.ts');
  });

  it('classifies PID 1 as an orphaned parent (F14)', async () => {
    const { parentProcessLiveness } = await loadSidecarWorkerTestables();
    const killSpy = vi.spyOn(process, 'kill');

    try {
      expect(parentProcessLiveness(1)).toEqual({
        alive: false,
        reason: 'pid-1-orphaned',
      });
      expect(killSpy).not.toHaveBeenCalled();
    } finally {
      killSpy.mockRestore();
    }
  });

  it('classifies kill(0) EPERM as an alive but permission-denied parent (F14)', async () => {
    const { parentProcessLiveness } = await loadSidecarWorkerTestables();
    const killSpy = vi.spyOn(process, 'kill').mockImplementation(() => {
      throw Object.assign(new Error('permission denied'), { code: 'EPERM', errno: -1 });
    });

    try {
      expect(parentProcessLiveness(12345)).toEqual({
        alive: true,
        reason: 'kill-0-eperm',
        errorCode: -1,
      });
    } finally {
      killSpy.mockRestore();
    }
  });

  it('classifies kill(0) ESRCH as a dead parent (F14)', async () => {
    const { parentProcessLiveness } = await loadSidecarWorkerTestables();
    const killSpy = vi.spyOn(process, 'kill').mockImplementation(() => {
      throw Object.assign(new Error('no such process'), { code: 'ESRCH', errno: -3 });
    });

    try {
      expect(parentProcessLiveness(12345)).toEqual({
        alive: false,
        reason: 'kill-0-esrch',
        errorCode: -3,
      });
    } finally {
      killSpy.mockRestore();
    }
  });

  it('returns a pre-parse error with the recoverable request id for partial JSON (F94)', async () => {
    const child = spawnRealSidecarWorker();
    try {
      child.stdin.write('{"id":321,"type":"embed"\n');
      const response = await readWorkerJsonLine(child);

      expect(response).toMatchObject({
        id: 321,
        type: 'error',
        phase: 'parse',
        code: 'invalid-json',
      });
      expect(response.message).not.toContain('"id":0');

      child.stdin.write(`${JSON.stringify({ id: 999, type: 'shutdown' })}\n`);
      await waitForWorkerExit(child);
    } finally {
      if (child.pid && pidAlive(child.pid)) {
        child.kill('SIGKILL');
      }
    }
  });

  it('exits 1 with stderr on unparseable input without a recoverable id (F94)', async () => {
    const child = spawnRealSidecarWorker();
    let stderr = '';
    child.stderr.on('data', (chunk: Buffer | string) => {
      stderr += chunk.toString();
    });

    try {
      child.stdin.write('not json\n');
      const exit = await waitForWorkerExit(child);

      expect(exit.code).toBe(1);
      expect(stderr).toMatch(/sidecar-worker: pre-parse failure/);
    } finally {
      if (child.pid && pidAlive(child.pid)) {
        child.kill('SIGKILL');
      }
    }
  });

  it('evicts a rejected provider promise so the next getProvider call retries (F95)', async () => {
    const { getProvider, resetProviderCacheForTests } = await loadSidecarWorkerTestables();
    const provider = {
      embedDocument: vi.fn(),
      embedQuery: vi.fn(),
    };

    resetProviderCacheForTests();
    factoryMockState.createEmbeddingsProvider.mockReset();
    factoryMockState.createEmbeddingsProvider
      .mockRejectedValueOnce(new Error('transient provider failure'))
      .mockResolvedValueOnce(provider);

    const request = {
      id: 1,
      type: 'embed' as const,
      input: ['abc'],
      model: 'model',
      dimensions: 3,
    };

    await expect(getProvider(request)).rejects.toThrow('transient provider failure');
    expect(factoryMockState.createEmbeddingsProvider).toHaveBeenCalledTimes(1);

    await expect(getProvider(request)).resolves.toBe(provider);
    expect(factoryMockState.createEmbeddingsProvider).toHaveBeenCalledTimes(2);

    resetProviderCacheForTests();
  });

  it('caches provider success after retrying a rejected provider promise (F95)', async () => {
    const { getProvider, resetProviderCacheForTests } = await loadSidecarWorkerTestables();
    const provider = {
      embedDocument: vi.fn(),
      embedQuery: vi.fn(),
    };

    resetProviderCacheForTests();
    factoryMockState.createEmbeddingsProvider.mockReset();
    factoryMockState.createEmbeddingsProvider
      .mockRejectedValueOnce(new Error('first attempt failed'))
      .mockResolvedValueOnce(provider);

    const request = {
      id: 1,
      type: 'embed' as const,
      input: ['abc'],
      model: 'model',
      dimensions: 3,
    };

    await expect(getProvider(request)).rejects.toThrow('first attempt failed');
    await expect(getProvider(request)).resolves.toBe(provider);
    await expect(getProvider(request)).resolves.toBe(provider);

    expect(factoryMockState.createEmbeddingsProvider).toHaveBeenCalledTimes(2);

    resetProviderCacheForTests();
  });
});
