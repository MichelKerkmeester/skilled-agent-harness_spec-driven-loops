// ───────────────────────────────────────────────────────────────
// TEST: HF local HTTP client provider
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  __hfLocalProviderTestables,
  HfLocalProvider,
} from '../../../shared/embeddings/providers/hf-local.js';

const MODEL = 'nomic-ai/nomic-embed-text-v1.5';

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

  it('throws an actionable "still loading" readiness-timeout message pointing at the tunable env', async () => {
    const provider = new HfLocalProvider({
      dim: 3,
      readyTimeout: 30,
      request: async (request) => {
        if (request.path === '/api/health') {
          return jsonResponse(503, { state: 'loading', model: MODEL, dim: null });
        }
        return jsonResponse(200, { embeddings: [vector(3)], dim: 3 });
      },
    });
    await expect(provider.embedQuery('still loading')).rejects.toThrow(
      /still loading the model after \d+ms.*HF_EMBED_SERVER_READY_TIMEOUT_MS/s,
    );
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

  it('maps 404 model-missing responses to the provider-cascade error shape', async () => {
    const provider = new HfLocalProvider({
      request: async (request) => {
        if (request.path === '/api/health') {
          return jsonResponse(200, { state: 'ready', model: MODEL, dim: 3 });
        }
        return jsonResponse(404, { error: 'Model missing-model is not loaded by this hf-local server' }, 'Not Found');
      },
    });

    await expect(provider.embedDocument('missing model')).rejects.toThrow('HF local model is not loaded');
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
