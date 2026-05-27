// -------------------------------------------------------------------
// TEST: Embedder sidecar execution
// -------------------------------------------------------------------

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { SidecarClient } from '../lib/embedders/sidecar-client.js';
import {
  getEmbedderAdapter,
  shutdownAllSidecars,
} from '../lib/embedders/execution-router.js';
import { __embedderExecutionRouterTestables } from '../lib/embedders/execution-router.testables.js';

const ORIGINAL_EXECUTION = process.env.SPECKIT_EMBEDDER_EXECUTION;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createWorkerFixture(dir: string): string {
  const workerPath = join(dir, 'mock-sidecar-worker.cjs');
  writeFileSync(workerPath, `
const fs = require('node:fs');
const readline = require('node:readline');

const counterPath = process.env.MOCK_SIDECAR_COUNTER_PATH;
if (counterPath) {
  const next = fs.existsSync(counterPath) ? Number(fs.readFileSync(counterPath, 'utf8')) + 1 : 1;
  fs.writeFileSync(counterPath, String(next));
}

let skipPing = false;
const failPingOncePath = process.env.MOCK_SIDECAR_FAIL_PING_ONCE_PATH;
if (failPingOncePath && fs.existsSync(failPingOncePath)) {
  skipPing = true;
  fs.unlinkSync(failPingOncePath);
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
function write(payload) {
  process.stdout.write(JSON.stringify(payload) + '\\n');
}

rl.on('line', (line) => {
  const message = JSON.parse(line);
  if (message.type === 'ping') {
    if (!skipPing) write({ id: message.id, type: 'pong' });
    return;
  }
  if (message.type === 'shutdown') {
    process.exit(0);
  }
  if (process.env.MOCK_SIDECAR_ERROR === '1') {
    write({ id: message.id, type: 'error', message: 'mock embed failure' });
    return;
  }
  const dimensions = message.dimensions;
  const vectors = message.input.map((text, textIndex) => {
    return Array.from({ length: dimensions }, (_value, dimIndex) => text.length + textIndex + dimIndex);
  });
  write({ id: message.id, type: 'embedding', vectors, dimensions });
});

rl.on('close', () => process.exit(0));
`, 'utf8');
  return workerPath;
}

describe('SidecarClient', () => {
  let tmpDir: string;
  let workerPath: string;
  let counterPath: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join('/private/tmp', 'embedder-sidecar-'));
    workerPath = createWorkerFixture(tmpDir);
    counterPath = join(tmpDir, 'spawns.txt');
  });

  afterEach(async () => {
    await shutdownAllSidecars();
    __embedderExecutionRouterTestables.clear();
    if (ORIGINAL_EXECUTION === undefined) {
      delete process.env.SPECKIT_EMBEDDER_EXECUTION;
    } else {
      process.env.SPECKIT_EMBEDDER_EXECUTION = ORIGINAL_EXECUTION;
    }
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function createClient(extraEnv: NodeJS.ProcessEnv = {}, idleMs = 1_000): SidecarClient {
    return new SidecarClient({
      provider: 'hf-local',
      model: 'BAAI/bge-base-en-v1.5',
      dimensions: 3,
      workerPath,
      idleMs,
      pingTimeoutMs: 500,
      env: {
        ...process.env,
        MOCK_SIDECAR_COUNTER_PATH: counterPath,
        ...extraEnv,
      },
    });
  }

  it('spawns the worker lazily on the first embed call', async () => {
    const client = createClient();

    expect(client.getWorkerInfo()).toBeNull();
    const vectors = await client.embed(['abc']);

    expect(vectors[0]).toEqual(new Float32Array([3, 4, 5]));
    expect(client.getWorkerInfo()?.pid).toBeGreaterThan(0);
    expect(readFileSync(counterPath, 'utf8')).toBe('1');
    await client.shutdown();
  });

  it('reuses the same worker for sequential embeds', async () => {
    const client = createClient();

    await client.embed(['one']);
    const firstPid = client.getWorkerInfo()?.pid;
    await client.embed(['two']);

    expect(client.getWorkerInfo()?.pid).toBe(firstPid);
    expect(client.getWorkerInfo()?.request_count).toBe(2);
    expect(readFileSync(counterPath, 'utf8')).toBe('1');
    await client.shutdown();
  });

  it('idle-evicts and respawns on the next request', async () => {
    const client = createClient({}, 20);

    await client.embed(['one']);
    const firstPid = client.getWorkerInfo()?.pid;
    await sleep(80);

    expect(client.getWorkerInfo()).toBeNull();
    await client.embed(['two']);

    expect(client.getWorkerInfo()?.pid).not.toBe(firstPid);
    expect(readFileSync(counterPath, 'utf8')).toBe('2');
    await client.shutdown();
  });

  it('respawns when the health ping times out', async () => {
    const failPingOncePath = join(tmpDir, 'fail-ping-once');
    writeFileSync(failPingOncePath, '1', 'utf8');
    const client = createClient({ MOCK_SIDECAR_FAIL_PING_ONCE_PATH: failPingOncePath });

    await client.embed(['abc']);

    expect(readFileSync(counterPath, 'utf8')).toBe('2');
    expect(client.getWorkerInfo()?.request_count).toBe(1);
    await client.shutdown();
  });

  it('sends shutdown without leaving a worker registered', async () => {
    const client = createClient();

    await client.embed(['abc']);
    await client.shutdown();

    expect(client.getWorkerInfo()).toBeNull();
  });

  it('rejects embed promises when the worker returns an error response', async () => {
    const client = createClient({ MOCK_SIDECAR_ERROR: '1' });

    await expect(client.embed(['abc'])).rejects.toThrow('mock embed failure');
    await client.shutdown();
  });

  it('handles repeated embed requests on one worker before idle eviction', async () => {
    const client = createClient({}, 20);

    for (let index = 0; index < 5; index += 1) {
      await client.embed([`text ${index}`]);
    }
    const firstPid = client.getWorkerInfo()?.pid;

    expect(readFileSync(counterPath, 'utf8')).toBe('1');
    expect(client.getWorkerInfo()?.request_count).toBe(5);
    await sleep(80);
    await client.embed(['after idle']);

    expect(client.getWorkerInfo()?.pid).not.toBe(firstPid);
    expect(readFileSync(counterPath, 'utf8')).toBe('2');
    await client.shutdown();
  });
});

describe('execution router', () => {
  afterEach(async () => {
    await shutdownAllSidecars();
    __embedderExecutionRouterTestables.clear();
    if (ORIGINAL_EXECUTION === undefined) {
      delete process.env.SPECKIT_EMBEDDER_EXECUTION;
    } else {
      process.env.SPECKIT_EMBEDDER_EXECUTION = ORIGINAL_EXECUTION;
    }
  });

  it('direct policy returns a direct adapter', () => {
    process.env.SPECKIT_EMBEDDER_EXECUTION = 'direct';

    const adapter = getEmbedderAdapter('hf-local', 'BAAI/bge-base-en-v1.5');

    expect(adapter).not.toBeInstanceOf(SidecarClient);
  });

  it('sidecar policy wraps any provider with SidecarClient', () => {
    process.env.SPECKIT_EMBEDDER_EXECUTION = 'sidecar';

    const adapter = getEmbedderAdapter('ollama', 'nomic-embed-text-v1.5');

    expect(adapter).toBeInstanceOf(SidecarClient);
  });

  it('auto policy sidecars local providers and keeps ollama direct', () => {
    process.env.SPECKIT_EMBEDDER_EXECUTION = 'auto';

    const local = getEmbedderAdapter('hf-local', 'BAAI/bge-base-en-v1.5');
    const ollama = getEmbedderAdapter('ollama', 'nomic-embed-text-v1.5');

    expect(local).toBeInstanceOf(SidecarClient);
    expect(ollama).not.toBeInstanceOf(SidecarClient);
  });
});
