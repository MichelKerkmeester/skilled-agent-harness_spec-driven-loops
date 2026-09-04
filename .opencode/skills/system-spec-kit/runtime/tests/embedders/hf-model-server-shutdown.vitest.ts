// -------------------------------------------------------------------
// TEST: hf-model-server busy-shutdown failsafe timing (live subprocess)
// -------------------------------------------------------------------
// Spawns the real hf-model-server.cjs shutdown wiring (via the fixture
// harness, which injects only a fake/delay-controllable loadModel — the
// signal handling, failsafe timer, and dispose() drain logic under test are
// entirely production code) as a real child process and sends it a real
// OS-level SIGTERM, so this exercises actual process-level signal delivery,
// not an in-process simulation.
//
// Pre-fix, hf-model-server.cjs armed a single unconditional 1500ms SIGKILL
// failsafe on every shutdown, regardless of whether an embed was mid-flight.
// The busy-shutdown case below uses a fake embed that deliberately takes
// longer than 1500ms; against the pre-fix fixed timer, the process would be
// SIGKILLed around ~1500ms, well before the embed (and dispose()'s real
// drain wait) ever finishes. This was confirmed by running the case against
// the pre-fix fixed-1500ms shutdown() during implementation (see the
// packet's implementation-summary.md for the recorded A/B result).

import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const harnessPath = resolve(here, '__fixtures__', 'hf-model-server-shutdown-harness.cjs');

// The pre-fix fixed failsafe. Busy-shutdown assertions below probe a point
// past this value to prove the process is still alive there (which the
// pre-fix code could never guarantee once an embed ran longer than this).
const PRE_FIX_FIXED_FAILSAFE_MS = 1500;

interface HarnessHandle {
  child: ChildProcessWithoutNullStreams;
  endpoint: string;
}

const children: ChildProcessWithoutNullStreams[] = [];

afterEach(async () => {
  while (children.length > 0) {
    const child = children.pop();
    if (child && child.exitCode === null && child.signalCode === null) {
      child.kill('SIGKILL');
    }
  }
  // Let the event loop flush any pending exit handlers from the kills above.
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 25));
});

function waitForListeningEndpoint(child: ChildProcessWithoutNullStreams, timeoutMs = 5000): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    let buffer = '';
    const timer = setTimeout(() => {
      reject(new Error(`Timed out waiting for harness to report a listening endpoint. stderr so far: ${buffer}`));
    }, timeoutMs);
    const onData = (chunk: Buffer) => {
      buffer += chunk.toString('utf8');
      const match = buffer.match(/listening at (\S+)/);
      if (match) {
        clearTimeout(timer);
        child.stderr.off('data', onData);
        resolvePromise(match[1]);
      }
    };
    child.stderr.on('data', onData);
  });
}

async function spawnHarness(env: Record<string, string>): Promise<HarnessHandle> {
  const child = spawn(process.execPath, [harnessPath], {
    env: { ...process.env, ...env },
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  children.push(child);
  const endpoint = await waitForListeningEndpoint(child);
  return { child, endpoint };
}

function toHostPort(endpoint: string): { host: string; port: number } {
  const url = new URL(endpoint);
  return { host: url.hostname, port: Number.parseInt(url.port, 10) };
}

function requestJson(
  endpoint: string,
  method: string,
  path: string,
  body?: unknown,
): Promise<{ statusCode: number; body: Record<string, unknown> }> {
  const { host, port } = toHostPort(endpoint);
  const payload = body !== undefined ? JSON.stringify(body) : undefined;
  return new Promise((resolvePromise, reject) => {
    const request = http.request(
      {
        host,
        port,
        method,
        path,
        headers: payload
          ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) }
          : undefined,
      },
      (response) => {
        let raw = '';
        response.on('data', (chunk) => {
          raw += chunk;
        });
        response.on('end', () => {
          try {
            resolvePromise({ statusCode: response.statusCode ?? 0, body: raw ? JSON.parse(raw) : {} });
          } catch (error) {
            reject(error);
          }
        });
      },
    );
    request.on('error', reject);
    if (payload) {
      request.write(payload);
    }
    request.end();
  });
}

async function waitForReady(endpoint: string, timeoutMs = 2000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    const health = await requestJson(endpoint, 'GET', '/api/health');
    if (health.body.state === 'ready') {
      return;
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 10));
  }
  throw new Error('Timed out waiting for harness server to reach ready state');
}

async function waitForInFlight(endpoint: string, timeoutMs = 2000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    const health = await requestJson(endpoint, 'GET', '/api/health');
    if (typeof health.body.inFlight === 'number' && health.body.inFlight > 0) {
      return;
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 5));
  }
  throw new Error('Timed out waiting for an in-flight embed to register');
}

function waitForExit(child: ChildProcessWithoutNullStreams, timeoutMs: number): Promise<{ code: number | null; signal: NodeJS.Signals | null; elapsedMs: number }> {
  const startedAt = Date.now();
  return new Promise((resolvePromise, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timed out after ${timeoutMs}ms waiting for the harness process to exit`));
    }, timeoutMs);
    child.once('exit', (code, signal) => {
      clearTimeout(timer);
      resolvePromise({ code, signal, elapsedMs: Date.now() - startedAt });
    });
  });
}

describe('hf-model-server.cjs shutdown failsafe (live subprocess)', () => {
  it('009-REQ-001/002/003: SIGTERM mid-embed does not SIGKILL before the fake embed drains, and exits cleanly', async () => {
    const embedDelayMs = 3000;
    const { child, endpoint } = await spawnHarness({
      HF_EMBED_SERVER_URL: 'tcp://127.0.0.1:0',
      TEST_HF_FAKE_LOAD_DELAY_MS: '0',
      TEST_HF_FAKE_EMBED_DELAY_MS: String(embedDelayMs),
    });
    await waitForReady(endpoint);

    // close() destroys the HTTP server's active sockets immediately (a
    // pre-existing, out-of-scope behavior — see 005's shutdown-crash
    // mitigation), so this request's connection is expected to be reset
    // before a response arrives. What actually matters for this test is the
    // underlying native run dispose() drains, which is independent of the
    // client socket's lifecycle — tracked separately below via /api/health.
    const embedPromise = requestJson(endpoint, 'POST', '/api/embed', { input: ['slow-embed'] }).catch(() => undefined);
    await waitForInFlight(endpoint);

    child.kill('SIGTERM');

    // Still alive well past the pre-fix fixed failsafe — the busy-shutdown
    // tier must have armed instead of the idle one.
    await new Promise((resolvePromise) => setTimeout(resolvePromise, PRE_FIX_FIXED_FAILSAFE_MS + 300));
    expect(child.exitCode).toBeNull();
    expect(child.signalCode).toBeNull();

    const exit = await waitForExit(child, embedDelayMs + 2000);
    expect(exit.code).toBe(0);
    expect(exit.signal).toBeNull();
    await embedPromise;
  }, 15000);

  it('009-REQ-001 (NFR-001): idle SIGTERM still exits quickly, not materially slower than the pre-fix ~1.5s ceiling', async () => {
    const { child, endpoint } = await spawnHarness({
      HF_EMBED_SERVER_URL: 'tcp://127.0.0.1:0',
      TEST_HF_FAKE_LOAD_DELAY_MS: '0',
      TEST_HF_FAKE_EMBED_DELAY_MS: '0',
    });
    await waitForReady(endpoint);

    child.kill('SIGTERM');
    const exit = await waitForExit(child, PRE_FIX_FIXED_FAILSAFE_MS + 1000);

    expect(exit.code).toBe(0);
    expect(exit.signal).toBeNull();
    expect(exit.elapsedMs).toBeLessThan(PRE_FIX_FIXED_FAILSAFE_MS + 500);
  }, 10000);

  it('009-REQ-002: repeated signals during shutdown do not re-arm a second failsafe timer', async () => {
    const embedDelayMs = 2000;
    const { child, endpoint } = await spawnHarness({
      HF_EMBED_SERVER_URL: 'tcp://127.0.0.1:0',
      TEST_HF_FAKE_LOAD_DELAY_MS: '0',
      TEST_HF_FAKE_EMBED_DELAY_MS: String(embedDelayMs),
    });
    await waitForReady(endpoint);

    const embedPromise = requestJson(endpoint, 'POST', '/api/embed', { input: ['slow-embed'] }).catch(() => undefined);
    await waitForInFlight(endpoint);

    child.kill('SIGTERM');
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 50));
    child.kill('SIGINT');

    const exit = await waitForExit(child, embedDelayMs + 3000);
    expect(exit.code).toBe(0);
    expect(exit.signal).toBeNull();
    await embedPromise;
  }, 15000);
});
