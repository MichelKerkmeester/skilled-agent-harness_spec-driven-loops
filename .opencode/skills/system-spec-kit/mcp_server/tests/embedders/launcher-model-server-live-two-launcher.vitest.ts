// ───────────────────────────────────────────────────────────────
// TEST: live hf-model-server integration (real spawned process)
// ───────────────────────────────────────────────────────────────
// Spawns the REAL .opencode/bin/hf-model-server.cjs over a unix socket and exercises the
// transport/route/reclaim machinery 001/002/005 hardened. The transport subset (bind, route-404,
// SIGKILL stale-socket lingering) runs everywhere — it needs no model. The embed-success and
// model-mismatch-404 cases need a working extractor + loaded model; they are gated behind
// SPECKIT_LIVE_MODEL_TEST=1 (and a model-ready precheck) so default CI stays green. In this
// checkout the model path cannot load (`onnxruntime-common` is unresolvable in the
// @huggingface/transformers tree), which is why the flag-flip stays gated — see 005 spec.

import { spawn, type ChildProcess } from 'node:child_process';
import { request } from 'node:http';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const SERVER = fileURLToPath(new URL('../../../../../bin/hf-model-server.cjs', import.meta.url));
const LIVE = process.env.SPECKIT_LIVE_MODEL_TEST === '1';

interface Spawned {
  readonly child: ChildProcess;
  readonly socketPath: string;
  readonly dir: string;
}

const spawned: Spawned[] = [];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Minimal UDS HTTP client (Node http over socketPath). Returns {status, body}.
function httpOverSocket(
  socketPath: string,
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
): Promise<{ status: number; body: unknown }> {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? undefined : Buffer.from(JSON.stringify(body));
    const req = request(
      {
        socketPath,
        method,
        path,
        headers: payload ? { 'content-type': 'application/json', 'content-length': payload.length } : {},
        timeout: 5000,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c as Buffer));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let parsed: unknown = text;
          try {
            parsed = text ? JSON.parse(text) : '';
          } catch {
            /* leave as text */
          }
          resolve({ status: res.statusCode ?? 0, body: parsed });
        });
      },
    );
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('request timeout')));
    if (payload) req.write(payload);
    req.end();
  });
}

async function spawnServer(model = 'nomic-ai/nomic-embed-text-v1.5'): Promise<Spawned> {
  const dir = mkdtempSync(join(tmpdir(), 'hf-live-'));
  const socketPath = join(dir, 'hf-embed.sock');
  const child = spawn(process.execPath, [SERVER], {
    env: {
      ...process.env,
      HF_EMBED_SERVER_URL: `unix://${socketPath}`,
      HF_EMBEDDINGS_MODEL: model,
    },
    stdio: 'ignore',
  });
  const rec: Spawned = { child, socketPath, dir };
  spawned.push(rec);
  return rec;
}

// Poll until /api/health answers (transport-ready — NOT necessarily state==='ready'); the socket
// binds before the model loads, so this gate is model-independent.
async function waitForTransport(socketPath: string, capMs = 15000): Promise<{ status: number; body: unknown }> {
  const deadline = Date.now() + capMs;
  let lastErr: unknown = null;
  while (Date.now() < deadline) {
    if (existsSync(socketPath)) {
      try {
        return await httpOverSocket(socketPath, 'GET', '/api/health');
      } catch (err) {
        lastErr = err;
      }
    }
    await sleep(100);
  }
  throw new Error(`server transport not ready in ${capMs}ms: ${lastErr ? String(lastErr) : 'no socket'}`);
}

async function waitForModelReady(socketPath: string, capMs = 120000): Promise<boolean> {
  const deadline = Date.now() + capMs;
  while (Date.now() < deadline) {
    try {
      const health = await httpOverSocket(socketPath, 'GET', '/api/health');
      const state = (health.body as { state?: string } | undefined)?.state;
      if (state === 'ready') return true;
      if (state === 'error') return false;
    } catch {
      /* keep polling */
    }
    await sleep(500);
  }
  return false;
}

afterEach(async () => {
  while (spawned.length > 0) {
    const rec = spawned.pop()!;
    try {
      rec.child.kill('SIGKILL');
    } catch {
      /* already dead */
    }
    try {
      rmSync(rec.dir, { recursive: true, force: true });
    } catch {
      /* best effort */
    }
  }
  await sleep(50);
});

describe('hf-model-server live integration (real spawned process)', () => {
  it('spawns and binds the unix socket, answering GET /api/health 200', async () => {
    const { socketPath } = await spawnServer();
    const health = await waitForTransport(socketPath);
    expect(health.status).toBe(200);
    expect(health.body).toMatchObject({ state: expect.any(String) });
  });

  it('returns 404 for unknown routes (transport-level, model-independent)', async () => {
    const { socketPath } = await spawnServer();
    await waitForTransport(socketPath);
    const getNope = await httpOverSocket(socketPath, 'GET', '/nope');
    const postOther = await httpOverSocket(socketPath, 'POST', '/api/other', { x: 1 });
    expect(getNope.status).toBe(404);
    expect(postOther.status).toBe(404);
  });

  it('leaves the socket file behind after SIGKILL (the stale-socket the launcher reclaims)', async () => {
    const rec = await spawnServer();
    await waitForTransport(rec.socketPath);
    rec.child.kill('SIGKILL');
    await sleep(300);
    // A hard-killed server cannot clean up its UDS node — this lingering socket is exactly what
    // the launcher's EADDRINUSE live-pid guard + reclaim path (model-server-supervision.cjs) handles.
    expect(existsSync(rec.socketPath)).toBe(true);
  });

  it.skipIf(!LIVE)('embeds a document end-to-end (LIVE: needs a loadable model)', async () => {
    const { socketPath } = await spawnServer('onnx-community/embeddinggemma-300m-ONNX');
    await waitForTransport(socketPath);
    const ready = await waitForModelReady(socketPath);
    expect(ready).toBe(true);
    const res = await httpOverSocket(socketPath, 'POST', '/api/embed', {
      model: 'onnx-community/embeddinggemma-300m-ONNX',
      input: ['hello world'],
    });
    expect(res.status).toBe(200);
    expect((res.body as { embeddings: number[][] }).embeddings).toHaveLength(1);
  });

  it.skipIf(!LIVE)('returns 404 when the requested model is not the loaded model (LIVE)', async () => {
    const { socketPath } = await spawnServer('onnx-community/embeddinggemma-300m-ONNX');
    await waitForTransport(socketPath);
    const ready = await waitForModelReady(socketPath);
    expect(ready).toBe(true);
    const res = await httpOverSocket(socketPath, 'POST', '/api/embed', {
      model: 'some/other-model',
      input: ['x'],
    });
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ loadedModel: 'onnx-community/embeddinggemma-300m-ONNX' });
  });
});
