import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { HfLocalProvider, __hfLocalProviderTestables } from '@spec-kit/shared/embeddings/providers/hf-local.js';

const ORIGINAL_MODEL_ENV = process.env.HF_EMBEDDINGS_MODEL;

function jsonResponse(status: number, body: unknown) {
  return { status, statusText: `HTTP ${status}`, body };
}

describe('HfLocalProvider model identity', () => {
  beforeEach(() => {
    __hfLocalProviderTestables.reset();
    __hfLocalProviderTestables.setSleep(async () => undefined);
    process.env.HF_EMBEDDINGS_MODEL = 'requested/model';
  });

  afterEach(() => {
    __hfLocalProviderTestables.reset();
    if (ORIGINAL_MODEL_ENV === undefined) delete process.env.HF_EMBEDDINGS_MODEL;
    else process.env.HF_EMBEDDINGS_MODEL = ORIGINAL_MODEL_ENV;
  });

  it('reports a ready server that serves another model as unavailable', async () => {
    const availability = await HfLocalProvider.canLoad({
      model: 'requested/model',
      request: async () => jsonResponse(200, { state: 'ready', model: 'resident/other', dim: 3 }),
    });
    expect(availability.available).toBe(false);
    expect(String((availability as { reason?: string }).reason)).toContain('resident/other');
  });

  it('resolves the requested model from the environment when the probe names none', async () => {
    const availability = await HfLocalProvider.canLoad({
      request: async () => jsonResponse(200, { state: 'ready', model: 'resident/other', dim: 3 }),
    });
    expect(availability.available).toBe(false);
  });

  it('accepts a ready server that serves the requested model, and a loading server', async () => {
    const ready = await HfLocalProvider.canLoad({
      model: 'requested/model',
      request: async () => jsonResponse(200, { state: 'ready', model: 'requested/model', dim: 3 }),
    });
    expect(ready.available).toBe(true);
    const loading = await HfLocalProvider.canLoad({
      model: 'requested/model',
      request: async () => jsonResponse(200, { state: 'loading' }),
    });
    expect(loading.available).toBe(true);
  });

  it('refuses readiness against a resident that serves a different model', async () => {
    const provider = new HfLocalProvider({
      model: 'requested/model',
      dim: 3,
      request: async (request) => {
        if (request.path === '/api/health') {
          return jsonResponse(200, { state: 'ready', model: 'resident/other', dim: 3 });
        }
        throw new Error('embed must not be reached when the model does not match');
      },
    });
    await expect(provider.embedDocument('text')).rejects.toThrow('HF local model is not loaded: requested requested/model; server loaded resident/other');
  });
});
