// ───────────────────────────────────────────────────────────────
// TEST: HF local HTTP client provider
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  __hfLocalProviderTestables,
  HfLocalProvider,
} from '../../../shared/embeddings/providers/hf-local.js';

const MODEL = 'nomic-ai/nomic-embed-text-v1.5';
const ORIGINAL_HF_EMBED_SERVER_URL = process.env.HF_EMBED_SERVER_URL;
const ORIGINAL_SPECKIT_IPC_SOCKET_DIR = process.env.SPECKIT_IPC_SOCKET_DIR;
const DEAD_PID = 2_147_483_647;
const ORIGINAL_MEMORY_DB_PATH = process.env.MEMORY_DB_PATH;
const ADVISOR_LAUNCHER_PATH = path.resolve(
  import.meta.dirname,
  '..', '..', '..', '..', '..', '..',
  '.opencode/bin/system-skill-advisor-launcher.cjs',
);

/**
 * The lease file name straight out of the launcher source. The client mirrors this
 * literal rather than importing it, so reading the producer here is what makes the
 * mirror unable to drift silently.
 */
function launcherOwnerLeaseFileName(): string {
  const source = readFileSync(ADVISOR_LAUNCHER_PATH, 'utf8');
  const match = /^const OWNER_LEASE_FILE_NAME = '([^']+)';$/m.exec(source);
  if (!match) {
    throw new Error(`OWNER_LEASE_FILE_NAME not found in ${ADVISOR_LAUNCHER_PATH}`);
  }
  return match[1];
}

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

function createEnoentError(): Error & { code: string } {
  const error = new Error('connect ENOENT') as Error & { code: string };
  error.code = 'ENOENT';
  return error;
}

function useVirtualReadinessClock() {
  const clock = { now: Date.now() };
  vi.spyOn(Date, 'now').mockImplementation(() => clock.now);
  __hfLocalProviderTestables.setSleep(async (ms) => {
    clock.now += ms;
  });
  return clock;
}

function useSocketFixture(): string {
  const socketDir = mkdtempSync(path.join(tmpdir(), 'hf-local-readiness-'));
  delete process.env.HF_EMBED_SERVER_URL;
  process.env.SPECKIT_IPC_SOCKET_DIR = socketDir;
  __hfLocalProviderTestables.setSpawnAuthorityDbDir(socketDir);
  return socketDir;
}

function readinessTransport(clock: { now: number }, readyAt: number | null) {
  type ProviderOptions = NonNullable<ConstructorParameters<typeof HfLocalProvider>[0]>;
  type TransportRequest = Parameters<NonNullable<ProviderOptions['request']>>[0];
  return async (request: TransportRequest) => {
    if (request.path === '/api/health') {
      if (readyAt === null || clock.now < readyAt) {
        throw createEnoentError();
      }
      return jsonResponse(200, { state: 'ready', model: MODEL, dim: 3 });
    }
    return jsonResponse(200, { embeddings: [vector(3)], dim: 3 });
  };
}

function jsonResponse(status: number, body: unknown, statusText = `HTTP ${status}`) {
  return {
    status,
    statusText,
    body,
  };
}

function vector(dim: number, seed = 1): number[] {
  return Array.from({ length: dim }, (_value, index) => seed + index);
}

describe('HfLocalProvider HTTP client', () => {
  beforeEach(() => {
    __hfLocalProviderTestables.reset();
    __hfLocalProviderTestables.setSleep(async () => undefined);
  });

  afterEach(() => {
    __hfLocalProviderTestables.reset();
    vi.restoreAllMocks();
    restoreEnv('HF_EMBED_SERVER_URL', ORIGINAL_HF_EMBED_SERVER_URL);
    restoreEnv('SPECKIT_IPC_SOCKET_DIR', ORIGINAL_SPECKIT_IPC_SOCKET_DIR);
    restoreEnv('MEMORY_DB_PATH', ORIGINAL_MEMORY_DB_PATH);
  });

  it('applies document and query prefixes before POST /api/embed', async () => {
    const postInputs: string[] = [];
    const provider = new HfLocalProvider({
      dim: 3,
      request: async (request) => {
        if (request.path === '/api/health') {
          return jsonResponse(200, {
            state: 'ready',
            model: MODEL,
            dim: 3,
            device: 'cpu',
            loadTimeMs: 12,
          });
        }

        expect(request.path).toBe('/api/embed');
        const body = request.body as { model: string; input: string[] };
        expect(body.model).toBe(MODEL);
        postInputs.push(body.input[0] ?? '');
        return jsonResponse(200, { embeddings: [vector(3)], dim: 3 });
      },
    });

    await provider.embedDocument('alpha');
    await provider.embedQuery('beta');

    expect(postInputs).toEqual([
      'search_document: alpha',
      'search_query: beta',
    ]);
  });

  it('retries ECONNREFUSED and loading health responses before embedding', async () => {
    let healthCalls = 0;
    const postBodies: unknown[] = [];
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 1000,
      request: async (request) => {
        if (request.path === '/api/health') {
          healthCalls += 1;
          if (healthCalls === 1) {
            const error = new Error('connect ECONNREFUSED') as Error & { code: string };
            error.code = 'ECONNREFUSED';
            throw error;
          }
          if (healthCalls === 2) {
            return jsonResponse(503, { state: 'loading', model: MODEL, dim: null });
          }
          return jsonResponse(200, { state: 'ready', model: MODEL, dim: 3 });
        }

        postBodies.push(request.body);
        return jsonResponse(200, { embeddings: [vector(3)], dim: 3 });
      },
    });

    await expect(provider.embedQuery('retry me')).resolves.toHaveLength(3);

    expect(healthCalls).toBe(3);
    expect(postBodies).toHaveLength(1);
  });

  it('treats a mid-readiness ECONNRESET/EPIPE as retryable instead of fatal', async () => {
    for (const code of ['ECONNRESET', 'EPIPE'] as const) {
      let healthCalls = 0;
      const provider = new HfLocalProvider({
        dim: 3,
        readyTimeout: 1000,
        request: async (request) => {
          if (request.path === '/api/health') {
            healthCalls += 1;
            if (healthCalls === 1) {
              const error = new Error(`socket ${code}`) as Error & { code: string };
              error.code = code;
              throw error;
            }
            return jsonResponse(200, { state: 'ready', model: MODEL, dim: 3 });
          }
          return jsonResponse(200, { embeddings: [vector(3)], dim: 3 });
        },
      });
      await expect(provider.embedQuery(`reset ${code}`)).resolves.toHaveLength(3);
      expect(healthCalls).toBe(2); // first reset retried, second ready
    }
  });

  it('retries the embed POST once when the in-flight request is reaped (ECONNRESET), not just the readiness probe', async () => {
    let postAttempts = 0;
    let healthCalls = 0;
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 1000,
      request: async (request) => {
        if (request.path === '/api/health') {
          healthCalls += 1;
          return jsonResponse(200, { state: 'ready', model: MODEL, dim: 3 });
        }
        postAttempts += 1;
        if (postAttempts === 1) {
          // The server was reaped mid-request: the in-flight POST connection drops.
          const error = new Error('socket hang up') as Error & { code: string };
          error.code = 'ECONNRESET';
          throw error;
        }
        return jsonResponse(200, { embeddings: [vector(3)], dim: 3 });
      },
    });

    await expect(provider.embedDocument('reaped mid-embed')).resolves.toHaveLength(3);
    expect(postAttempts).toBe(2); // first POST reaped, retried against the respawned server
    expect(healthCalls).toBe(2);  // waitForReady re-probed before the retry
  });

  it('reuses a fresh ready latch across back-to-back embeds', async () => {
    let healthCalls = 0;
    let postCalls = 0;
    const provider = new HfLocalProvider({
      dim: 3,
      request: async (request) => {
        if (request.path === '/api/health') {
          healthCalls += 1;
          return jsonResponse(200, { state: 'ready', model: MODEL, dim: 3 });
        }
        postCalls += 1;
        return jsonResponse(200, { embeddings: [vector(3, postCalls)], dim: 3 });
      },
    });

    await provider.embedQuery('first');
    await provider.embedQuery('second');
    await provider.embedQuery('third');

    expect(healthCalls).toBe(1);
    expect(postCalls).toBe(3);
  });

  it('invalidates the ready latch after a reaped embed POST and re-probes before retry', async () => {
    let healthCalls = 0;
    let postAttempts = 0;
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 1000,
      request: async (request) => {
        if (request.path === '/api/health') {
          healthCalls += 1;
          return jsonResponse(200, { state: 'ready', model: MODEL, dim: 3 });
        }
        postAttempts += 1;
        if (postAttempts === 2) {
          const error = new Error('socket hang up') as Error & { code: string };
          error.code = 'ECONNRESET';
          throw error;
        }
        return jsonResponse(200, { embeddings: [vector(3, postAttempts)], dim: 3 });
      },
    });

    await provider.embedDocument('prime latch');
    await expect(provider.embedDocument('reaped after latch')).resolves.toHaveLength(3);

    expect(postAttempts).toBe(3);
    expect(healthCalls).toBe(2);
  });

  it('keeps retrying loading health past the ready timeout and resolves before the load cap', async () => {
    let now = 0;
    let healthCalls = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => now);
    __hfLocalProviderTestables.setSleep(async (ms) => {
      now += ms;
    });

    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 45,
      loadTimeout: 90,
      request: async (request) => {
        if (request.path === '/api/health') {
          healthCalls += 1;
          if (now < 60) {
            return jsonResponse(503, { state: 'loading', model: MODEL, dim: null });
          }
          return jsonResponse(200, { state: 'ready', model: MODEL, dim: 3 });
        }
        return jsonResponse(200, { embeddings: [vector(3)], dim: 3 });
      },
    });

    await expect(provider.embedQuery('slow cold start')).resolves.toHaveLength(3);
    expect(healthCalls).toBeGreaterThan(1);
    expect(now).toBeGreaterThan(45);
  });

  it('throws an actionable "still loading" message only after the load cap', async () => {
    let now = 0;
    let healthCalls = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => now);
    __hfLocalProviderTestables.setSleep(async (ms) => {
      now += ms;
    });

    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 45,
      loadTimeout: 90,
      request: async (request) => {
        if (request.path === '/api/health') {
          healthCalls += 1;
          return jsonResponse(503, { state: 'loading', model: MODEL, dim: null });
        }
        return jsonResponse(200, { embeddings: [vector(3)], dim: 3 });
      },
    });
    await expect(provider.embedQuery('still loading')).rejects.toThrow(
      /still loading the model after 90ms.*SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS/s,
    );
    expect(healthCalls).toBeGreaterThan(1);
    expect(now).toBe(90);
  });

  it('throws an "unreachable" readiness-timeout message when the server never answers', async () => {
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 30,
      request: async (request) => {
        if (request.path === '/api/health') {
          const error = new Error('connect ECONNREFUSED') as Error & { code: string };
          error.code = 'ECONNREFUSED';
          throw error;
        }
        return jsonResponse(200, { embeddings: [vector(3)], dim: 3 });
      },
    });
    await expect(provider.embedQuery('never answers')).rejects.toThrow(/was unreachable after \d+ms/);
  });

  it('fails after the socket startup grace when ENOENT has no live spawn authority', async () => {
    useSocketFixture();
    const clock = useVirtualReadinessClock();
    const startedAt = clock.now;
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 20_000,
      request: readinessTransport(clock, null),
    });

    await expect(provider.embedQuery('no authority')).rejects.toThrow(
      /socket .* is absent and no live launcher or model-server spawn authority exists; not retrying/,
    );
    expect(clock.now - startedAt).toBeGreaterThanOrEqual(5000);
    expect(clock.now - startedAt).toBeLessThan(7000);
  });

  it('keeps retrying ENOENT while a fresh live owner lease can spawn the server', async () => {
    const socketDir = useSocketFixture();
    const clock = useVirtualReadinessClock();
    writeFileSync(path.join(socketDir, __hfLocalProviderTestables.ADVISOR_OWNER_LEASE_FILE_NAME), JSON.stringify({
      ownerPid: process.pid,
      lastHeartbeatIso: new Date(clock.now).toISOString(),
      ttlMs: 60_000,
    }));
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 20_000,
      request: readinessTransport(clock, clock.now + 6000),
    });

    await expect(provider.embedQuery('live owner')).resolves.toHaveLength(3);
  });

  it('reads the live lease under the file name the advisor launcher actually writes', async () => {
    const leaseFileName = launcherOwnerLeaseFileName();
    expect(__hfLocalProviderTestables.ADVISOR_OWNER_LEASE_FILE_NAME).toBe(leaseFileName);

    const socketDir = useSocketFixture();
    const clock = useVirtualReadinessClock();
    writeFileSync(path.join(socketDir, leaseFileName), JSON.stringify({
      ownerPid: process.pid,
      lastHeartbeatIso: new Date(clock.now).toISOString(),
      ttlMs: 60_000,
    }));
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 20_000,
      request: readinessTransport(clock, clock.now + 6000),
    });

    await expect(provider.embedQuery('launcher lease')).resolves.toHaveLength(3);
  });

  it('fails fast when the advisor lease is absent and only a retired lease name is present', async () => {
    const socketDir = useSocketFixture();
    const clock = useVirtualReadinessClock();
    // A fresh, live lease under the decommissioned memory server's file name must not
    // count as spawn authority; only the name the live launcher writes does.
    writeFileSync(path.join(socketDir, '.spec-memory-owner.json'), JSON.stringify({
      ownerPid: process.pid,
      lastHeartbeatIso: new Date(clock.now).toISOString(),
      ttlMs: 60_000,
    }));
    const startedAt = clock.now;
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 20_000,
      request: readinessTransport(clock, null),
    });

    await expect(provider.embedQuery('retired lease name')).rejects.toThrow(/not retrying/);
    expect(clock.now - startedAt).toBeGreaterThanOrEqual(5000);
  });

  it('resolves the spawn-authority directory from the configured database pointer', () => {
    const dbDir = mkdtempSync(path.join(tmpdir(), 'hf-local-advisor-db-'));
    process.env.MEMORY_DB_PATH = path.join(dbDir, 'skill-graph.sqlite');

    expect(__hfLocalProviderTestables.defaultSpawnAuthorityDbDir()).toBe(dbDir);

    delete process.env.MEMORY_DB_PATH;
    expect(__hfLocalProviderTestables.defaultSpawnAuthorityDbDir()).toMatch(
      /runtime[/\\]database$/,
    );
  });

  it('keeps retrying ENOENT while a live respawn lock can spawn the server', async () => {
    const socketDir = useSocketFixture();
    const clock = useVirtualReadinessClock();
    writeFileSync(path.join(socketDir, 'hf-embed-respawn.lock'), JSON.stringify({
      pid: process.pid,
      startedAt: new Date(clock.now).toISOString(),
    }));
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 20_000,
      request: readinessTransport(clock, clock.now + 6000),
    });

    await expect(provider.embedQuery('live respawn lock')).resolves.toHaveLength(3);
  });

  it('keeps retrying ENOENT while a live model-server pid can bind the socket', async () => {
    const socketDir = useSocketFixture();
    const clock = useVirtualReadinessClock();
    writeFileSync(path.join(socketDir, 'hf-embed.pid'), JSON.stringify({
      pid: process.pid,
      startedAt: new Date(clock.now).toISOString(),
      ownerLauncher: 'test',
      socketPath: path.join(socketDir, 'hf-embed.sock'),
    }));
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 20_000,
      request: readinessTransport(clock, clock.now + 6000),
    });

    await expect(provider.embedQuery('live model server')).resolves.toHaveLength(3);
  });

  it('fails fast when the owner heartbeat is expired and lock and pid owners are dead', async () => {
    const socketDir = useSocketFixture();
    const clock = useVirtualReadinessClock();
    writeFileSync(path.join(socketDir, __hfLocalProviderTestables.ADVISOR_OWNER_LEASE_FILE_NAME), JSON.stringify({
      ownerPid: process.pid,
      lastHeartbeatIso: new Date(clock.now - 120_000).toISOString(),
      ttlMs: 1000,
    }));
    writeFileSync(path.join(socketDir, 'hf-embed-respawn.lock'), JSON.stringify({ pid: DEAD_PID }));
    writeFileSync(path.join(socketDir, 'hf-embed.pid'), String(DEAD_PID));
    const startedAt = clock.now;
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 20_000,
      request: readinessTransport(clock, null),
    });

    await expect(provider.embedQuery('stale authority')).rejects.toThrow(/not retrying/);
    expect(clock.now - startedAt).toBeGreaterThanOrEqual(5000);
    expect(clock.now - startedAt).toBeLessThan(7000);
  });

  it('retains the normal readiness timeout for TCP targets returning ENOENT', async () => {
    const socketDir = useSocketFixture();
    const clock = useVirtualReadinessClock();
    process.env.HF_EMBED_SERVER_URL = 'tcp://127.0.0.1:65535';
    writeFileSync(path.join(socketDir, __hfLocalProviderTestables.ADVISOR_OWNER_LEASE_FILE_NAME), '{}');
    const startedAt = clock.now;
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 7000,
      request: readinessTransport(clock, null),
    });

    await expect(provider.embedQuery('tcp timeout')).rejects.toThrow(/was unreachable after 7000ms/);
    expect(clock.now - startedAt).toBe(7000);
  });

  it('adopts the server-reported embedding dimension', async () => {
    const provider = new HfLocalProvider({
      dim: 768,
      request: async (request) => {
        if (request.path === '/api/health') {
          return jsonResponse(200, { state: 'ready', model: MODEL, dim: null });
        }
        return jsonResponse(200, { embeddings: [vector(4)], dim: 4 });
      },
    });

    const embedding = await provider.embedDocument('dimension probe');

    expect(embedding).toHaveLength(4);
    expect(provider.getMetadata().dim).toBe(4);
  });

  it('exposes server timing and queue metadata from health responses', async () => {
    const provider = new HfLocalProvider({
      dim: 3,
      request: async (request) => {
        if (request.path === '/api/health') {
          return jsonResponse(200, {
            state: 'ready',
            model: MODEL,
            dim: 3,
            device: 'cpu',
            loadTimeMs: 12,
            timing: {
              p50Ms: 4.5,
              p95Ms: 9.25,
              lastMs: 5.75,
              count: 3,
            },
            queueDepth: 2,
          });
        }
        return jsonResponse(200, { embeddings: [vector(3)], dim: 3 });
      },
    });

    await provider.embedQuery('timing metadata');

    expect(provider.getMetadata()).toMatchObject({
      inferenceP50Ms: 4.5,
      inferenceP95Ms: 9.25,
      lastInferenceMs: 5.75,
      queueDepth: 2,
    });
  });

  it('sends a multi-text embedBatch as one prefixed POST and increments requestCount by rows', async () => {
    const postBodies: unknown[] = [];
    const provider = new HfLocalProvider({
      dim: 3,
      request: async (request) => {
        if (request.path === '/api/health') {
          return jsonResponse(200, { state: 'ready', model: MODEL, dim: 3 });
        }
        postBodies.push(request.body);
        const body = request.body as { input: string[] };
        return jsonResponse(200, {
          embeddings: body.input.map((_input, index) => vector(3, index + 1)),
          dim: 3,
        });
      },
    });

    const embeddings = await provider.embedBatch(['alpha', 'beta', 'gamma'], 'document');

    expect(embeddings).toHaveLength(3);
    expect(embeddings.every((embedding) => embedding instanceof Float32Array)).toBe(true);
    expect(postBodies).toHaveLength(1);
    expect((postBodies[0] as { input: string[] }).input).toEqual([
      'search_document: alpha',
      'search_document: beta',
      'search_document: gamma',
    ]);
    expect(provider.getMetadata().requestCount).toBe(3);
  });

  it('preserves null slots and chunks each sent item independently in embedBatch', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const postBodies: unknown[] = [];
    const provider = new HfLocalProvider({
      dim: 2,
      maxTextLength: 32,
      request: async (request) => {
        if (request.path === '/api/health') {
          return jsonResponse(200, { state: 'ready', model: MODEL, dim: 2 });
        }
        postBodies.push(request.body);
        const body = request.body as { input: string[] };
        return jsonResponse(200, {
          embeddings: body.input.map((_input, index) => vector(2, index + 1)),
          dim: 2,
        });
      },
    });

    const longA = `alpha ${'x'.repeat(80)}`;
    const longB = `beta ${'y'.repeat(80)}`;
    const embeddings = await provider.embedBatch([longA, '   ', longB], 'query');

    expect(embeddings[0]).toBeInstanceOf(Float32Array);
    expect(embeddings[1]).toBeNull();
    expect(embeddings[2]).toBeInstanceOf(Float32Array);
    expect(postBodies).toHaveLength(1);
    const sent = (postBodies[0] as { input: string[] }).input;
    expect(sent).toHaveLength(2);
    expect(sent.every((input) => input.length <= 32)).toBe(true);
    expect(sent[0]).toContain('search_query: alpha');
    expect(sent[1]).toContain('search_query: beta');
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });

  it('rejects truncated batch responses instead of returning partial embeddings', async () => {
    const provider = new HfLocalProvider({
      dim: 3,
      request: async (request) => {
        if (request.path === '/api/health') {
          return jsonResponse(200, { state: 'ready', model: MODEL, dim: 3 });
        }
        return jsonResponse(200, { embeddings: [vector(3)], dim: 3 });
      },
    });

    await expect(provider.embedBatch(['one', 'two'], 'document')).rejects.toThrow(
      'HF local model server returned 1 embedding rows for 2 inputs',
    );
  });

  it('fires onDimensionResolved once across a multi-text batch for custom models', async () => {
    const resolved: Array<{ dim: number; model: string }> = [];
    const provider = new HfLocalProvider({
      model: 'custom/batched-embedder',
      request: async (request) => {
        if (request.path === '/api/health') {
          return jsonResponse(200, { state: 'ready', model: 'custom/batched-embedder', dim: null });
        }
        return jsonResponse(200, {
          embeddings: [vector(321), vector(321, 2)],
          dim: 321,
        });
      },
      onDimensionResolved: (dim, model) => {
        resolved.push({ dim, model });
      },
    });

    await provider.embedBatch(['first', 'second'], 'document');

    expect(resolved).toEqual([{ dim: 321, model: 'custom/batched-embedder' }]);
    expect(provider.getMetadata().dim).toBe(321);
  });

  it('fires onDimensionResolved once with the server-reported dim on first embed (custom-model drift hook)', async () => {
    const resolved: Array<{ dim: number; model: string }> = [];
    const provider = new HfLocalProvider({
      model: 'custom/unlisted-embedder',
      // Custom model: dim is unknown at construction (starts at 0) and only resolves here.
      request: async (request) => {
        if (request.path === '/api/health') {
          return jsonResponse(200, { state: 'ready', model: 'custom/unlisted-embedder', dim: null });
        }
        return jsonResponse(200, { embeddings: [vector(321)], dim: 321 });
      },
      onDimensionResolved: (dim, model) => {
        resolved.push({ dim, model });
      },
    });

    await provider.embedDocument('first');
    await provider.embedDocument('second');

    // Fired exactly once (deduped by notifiedDim), with the dim the server actually reported.
    expect(resolved).toEqual([{ dim: 321, model: 'custom/unlisted-embedder' }]);
    expect(provider.getMetadata().dim).toBe(321);
  });

  it('maps 404 model-missing responses to the provider-cascade error shape', async () => {
    const provider = new HfLocalProvider({
      model: 'custom/local-embedder',
      request: async (request) => {
        if (request.path === '/api/health') {
          return jsonResponse(200, { state: 'ready', model: MODEL, dim: 3 });
        }
        return jsonResponse(404, {
          error: 'Model custom/local-embedder is not loaded by this hf-local server',
          model: 'custom/local-embedder',
          loadedModel: MODEL,
        }, 'Not Found');
      },
    });

    await expect(provider.embedDocument('missing model')).rejects.toThrow(
      'HF local model is not loaded: requested custom/local-embedder; server loaded nomic-ai/nomic-embed-text-v1.5',
    );
  });

  it('canLoad probes /api/health and treats ready/loading as available', async () => {
    const ready = await HfLocalProvider.canLoad({
      request: async (request) => {
        expect(request.path).toBe('/api/health');
        return jsonResponse(200, { state: 'ready', model: MODEL, dim: 3 });
      },
    });
    const loading = await HfLocalProvider.canLoad({
      request: async () => jsonResponse(503, { state: 'loading', model: MODEL, dim: null }),
    });
    const error = await HfLocalProvider.canLoad({
      request: async () => jsonResponse(200, { state: 'error', model: MODEL, error: 'load failed' }),
    });
    const unreachable = await HfLocalProvider.canLoad({
      request: async () => {
        const connectError = new Error('connect ENOENT') as Error & { code: string };
        connectError.code = 'ENOENT';
        throw connectError;
      },
    });

    expect(ready.available).toBe(true);
    expect(loading.available).toBe(true);
    expect(error.available).toBe(false);
    expect(error.reason).toContain('load failed');
    expect(unreachable.available).toBe(false);
    expect(unreachable.reason).toContain('ENOENT');
  });
});

describe('HfLocalProvider model-server socket resolution', () => {
  const { resolveHfLocalServerTarget } = __hfLocalProviderTestables;
  // The shared model server owns this rendezvous; the client must reach it without a
  // database directory existing anywhere, so every case below passes an explicit env.
  const SHARED_DEFAULT_SOCKET = path.join('/tmp/system-hf-embed', 'hf-embed.sock');

  it('falls back to the shared model-server socket when nothing is configured', () => {
    expect(resolveHfLocalServerTarget({})).toEqual({
      kind: 'socket',
      socketPath: SHARED_DEFAULT_SOCKET,
    });
  });

  it('ignores the memory database env vars when locating the socket', () => {
    const target = resolveHfLocalServerTarget({
      SPEC_KIT_DB_DIR: '/tmp/spec-kit-db-dir-fixture',
      SPECKIT_DB_DIR: '/tmp/speckit-db-dir-fixture',
      MEMORY_DB_PATH: '/tmp/memory-db-fixture/context-index.sqlite',
    });

    expect(target).toEqual({ kind: 'socket', socketPath: SHARED_DEFAULT_SOCKET });
  });

  it('still lets SPECKIT_IPC_SOCKET_DIR win over the shared default', () => {
    const target = resolveHfLocalServerTarget({
      SPECKIT_IPC_SOCKET_DIR: '/tmp/explicit-socket-dir',
      SPEC_KIT_DB_DIR: '/tmp/spec-kit-db-dir-fixture',
    });

    expect(target).toEqual({
      kind: 'socket',
      socketPath: path.join('/tmp/explicit-socket-dir', 'hf-embed.sock'),
    });
  });

  it('still lets HF_EMBED_SERVER_URL win over SPECKIT_IPC_SOCKET_DIR', () => {
    const target = resolveHfLocalServerTarget({
      HF_EMBED_SERVER_URL: 'tcp://127.0.0.1:9931',
      SPECKIT_IPC_SOCKET_DIR: '/tmp/explicit-socket-dir',
    });

    expect(target).toEqual({ kind: 'tcp', host: '127.0.0.1', port: 9931 });
  });
});
