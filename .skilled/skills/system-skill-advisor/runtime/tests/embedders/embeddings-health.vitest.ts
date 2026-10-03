// ───────────────────────────────────────────────────────────────
// MODULE: Embeddings Health Probe Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  readEmbeddingsHealth,
  type HealthTarget,
  type ProviderInfoLike,
} from '../../lib/embedders/embeddings-health.js';

const PROVIDER_INFO: ProviderInfoLike = {
  requestedProvider: 'local',
  effectiveProvider: 'local',
  fallbackReason: null,
  dimensionChanged: false,
  reason: 'configured',
};

const READY_PAYLOAD = {
  state: 'ready',
  model: 'test-model',
  dim: 768,
  device: 'cpu',
  loadTimeMs: 12,
  loadStartedAt: '2026-10-03T00:00:00.000Z',
  loadProgressAt: '2026-10-03T00:00:01.000Z',
  lastSuccessfulEmbedAt: '2026-10-03T00:00:02.000Z',
  inFlight: 0,
  queueDepth: 0,
  timing: { ignored: true },
  error: null,
};

const LOADING_PAYLOAD = {
  state: 'loading',
  model: 'nomic-ai/nomic-embed-text-v1.5',
  dim: null,
  device: null,
  loadTimeMs: null,
  loadStartedAt: 1791011409147,
  loadProgressAt: 1791011409994,
  lastSuccessfulEmbedAt: null,
  inFlight: 0,
  queueDepth: 0,
  timing: { p50Ms: null, p95Ms: null, lastMs: null, count: 0 },
};

describe('readEmbeddingsHealth', () => {
  it('reports a reachable ready model server and omits timing', async () => {
    const health = await readEmbeddingsHealth({
      providerInfo: () => PROVIDER_INFO,
      request: async () => READY_PAYLOAD,
    });

    expect(health.modelServer.state).toBe('reachable');
    if (health.modelServer.state !== 'reachable') throw new Error('expected a reachable model server');
    expect(health.modelServer.serverState).toBe('ready');
    expect(health.modelServer).not.toHaveProperty('timing');
  });

  it('reports a loading server whose timestamps are epoch milliseconds', async () => {
    const health = await readEmbeddingsHealth({
      providerInfo: () => PROVIDER_INFO,
      request: async () => LOADING_PAYLOAD,
    });

    expect(health.modelServer.state).toBe('reachable');
    if (health.modelServer.state !== 'reachable') throw new Error('expected a reachable model server');
    expect(health.modelServer.serverState).toBe('loading');
    expect(health.modelServer.model).toBe('nomic-ai/nomic-embed-text-v1.5');
    expect(health.modelServer.loadStartedAt).toBe(new Date(1791011409147).toISOString());
  });

  it('maps a missing socket to the unreachable error class', async () => {
    const error = Object.assign(new Error('missing socket'), { code: 'ENOENT' });
    const health = await readEmbeddingsHealth({
      providerInfo: () => PROVIDER_INFO,
      request: async () => { throw error; },
    });

    expect(health.modelServer).toMatchObject({ state: 'unavailable', errorClass: 'unreachable' });
  });

  it('bounds a transport that does not resolve', async () => {
    const health = await readEmbeddingsHealth({
      timeoutMs: 20,
      providerInfo: () => PROVIDER_INFO,
      request: () => new Promise<unknown>(() => {}),
    });

    expect(health.modelServer).toMatchObject({ state: 'unavailable', errorClass: 'timeout' });
  });

  it('keeps provider resolution unavailable without failing the model-server probe', async () => {
    const health = await readEmbeddingsHealth({
      providerInfo: () => { throw new Error('provider lookup failed'); },
      request: async () => READY_PAYLOAD,
    });

    expect(health.provider).toMatchObject({ state: 'unavailable', error: 'provider lookup failed' });
    expect(health.modelServer.state).toBe('reachable');
  });

  it('resolves a tcp health target from HF_EMBED_SERVER_URL', async () => {
    let resolvedTarget: HealthTarget | undefined;
    const health = await readEmbeddingsHealth({
      env: { HF_EMBED_SERVER_URL: 'tcp://127.0.0.1:9' },
      providerInfo: () => PROVIDER_INFO,
      request: async (target) => {
        resolvedTarget = target;
        return READY_PAYLOAD;
      },
    });

    expect(health.modelServer.state).toBe('reachable');
    expect(resolvedTarget).toEqual({
      protocol: 'tcp',
      target: 'tcp://127.0.0.1:9',
      host: '127.0.0.1',
      port: 9,
    });
  });
});
