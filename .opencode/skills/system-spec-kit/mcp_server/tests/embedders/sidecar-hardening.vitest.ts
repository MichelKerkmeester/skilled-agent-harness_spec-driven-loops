// ───────────────────────────────────────────────────────────────
// TEST: Embedder Sidecar Hardening
// ───────────────────────────────────────────────────────────────

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildSidecarEnv, SidecarClient } from '../../lib/embedders/sidecar-client.js';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createWorker(dir: string, mode: 'env' | 'hang'): string {
  const workerPath = join(dir, `worker-${mode}.cjs`);
  writeFileSync(workerPath, `
const fs = require('node:fs');
const readline = require('node:readline');
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
  if (${JSON.stringify(mode)} === 'hang') return;
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

    await expect(client.embed(['abc'])).rejects.toThrow('timed out');
    await sleep(80);

    const info = client.getWorkerInfo();
    if (info) {
      expect(existsSync(`/proc/${info.pid}`)).toBe(false);
    }
    await client.shutdown();
  });
});
