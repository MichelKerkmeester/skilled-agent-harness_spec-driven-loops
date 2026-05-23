// ───────────────────────────────────────────────────────────────
// TEST: Embedder Sidecar Hardening
// ───────────────────────────────────────────────────────────────

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildSidecarEnv, SidecarClient } from '../../lib/embedders/sidecar-client.js';

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

function createWorker(dir: string, mode: 'env' | 'hang' | 'ignore-term' | 'oversized-stdout'): string {
  const workerPath = join(dir, `worker-${mode}.cjs`);
  writeFileSync(workerPath, `
const fs = require('node:fs');
const readline = require('node:readline');
if (${JSON.stringify(mode)} === 'ignore-term') {
  process.on('SIGTERM', () => {});
}
const envOut = process.env.MOCK_SIDECAR_ENV_OUT;
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

  it('filters inherited environment while preserving explicit sidecar values', () => {
    const env = buildSidecarEnv({
      PATH: '/bin',
      UNSAFE_SECRET: 'nope',
      SPECKIT_EMBEDDER_ALLOWED: 'yes',
      LC_TEST: 'locale',
    });

    expect(env.PATH).toBe('/bin');
    expect(env.SPECKIT_EMBEDDER_ALLOWED).toBe('yes');
    expect(env.LC_TEST).toBe('locale');
    expect(env.UNSAFE_SECRET).toBeUndefined();
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
        MOCK_SIDECAR_ENV_OUT: envOut,
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

    await client.ready();
    const pid = client.getWorkerInfo()?.pid;
    expect(pid).toBeGreaterThan(0);

    await expect(client.embed(['abc'])).rejects.toThrow('timed out');
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

    await client.ready();
    const pid = client.getWorkerInfo()?.pid;
    expect(pid).toBeGreaterThan(0);

    await expect(client.embed(['abc'])).rejects.toThrow('timed out');
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

    await client.ready();
    const pid = client.getWorkerInfo()?.pid;
    expect(pid).toBeGreaterThan(0);

    const embedPromise = client.embed(['abc']);
    await waitUntil(() => !pidAlive(pid!), 3_000);

    expect(pidAlive(pid!)).toBe(false);
    expect(client.getWorkerInfo()).toBeNull();

    const result = await embedPromise.catch((error: Error) => error.message);
    expect(result).toMatch(/timed out|exited/);
    await client.shutdown();
  });
});
