// ───────────────────────────────────────────────────────────────
// TEST: Sidecar Worker — F47 bounded stdin + input-array validation
// ───────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it, vi } from 'vitest';

const factoryMockState = vi.hoisted(() => ({
  createEmbeddingsProvider: vi.fn(),
}));

vi.mock('@spec-kit/shared/embeddings/factory', () => ({
  createEmbeddingsProvider: factoryMockState.createEmbeddingsProvider,
}));

import { __sidecarWorkerTestables } from '../../lib/embedders/sidecar-worker.js';

const {
  getProvider,
  parseRequest,
  resetProviderCacheForTests,
} = __sidecarWorkerTestables;

describe('sidecar-worker bounded parsing', () => {
  const originalProvider = process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER;
  const originalModel = process.env.SPECKIT_EMBEDDER_SIDECAR_MODEL;

  beforeEach(() => {
    resetProviderCacheForTests();
    factoryMockState.createEmbeddingsProvider.mockReset();
    factoryMockState.createEmbeddingsProvider.mockResolvedValue({
      embedDocument: vi.fn(async () => new Float32Array([1, 2, 3])),
      embedQuery: vi.fn(async () => new Float32Array([4, 5, 6])),
    });
    if (originalProvider === undefined) {
      delete process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER;
    } else {
      process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER = originalProvider;
    }
    if (originalModel === undefined) {
      delete process.env.SPECKIT_EMBEDDER_SIDECAR_MODEL;
    } else {
      process.env.SPECKIT_EMBEDDER_SIDECAR_MODEL = originalModel;
    }
  });

  it('rejects an embed request with input.length exceeding MAX_INPUT_ITEMS (500)', () => {
    const oversizedInput = Array.from({ length: 501 }, (_v, i) => `text-${i}`);
    const line = JSON.stringify({
      id: 42,
      type: 'embed',
      input: oversizedInput,
      model: 'test-model',
      dimensions: 768,
    });

    expect(() => parseRequest(line)).toThrow(
      'Embed request input exceeds maximum of 500 items',
    );
  });

  it('accepts an embed request with input.length exactly at MAX_INPUT_ITEMS (500)', () => {
    const atCapInput = Array.from({ length: 500 }, (_v, i) => `text-${i}`);
    const line = JSON.stringify({
      id: 42,
      type: 'embed',
      input: atCapInput,
      model: 'test-model',
      dimensions: 768,
    });

    const request = parseRequest(line);
    expect(request.type).toBe('embed');
    expect((request as { input: string[] }).input).toHaveLength(500);
  });

  it('accepts a normal embed request with a small input array', () => {
    const line = JSON.stringify({
      id: 1,
      type: 'embed',
      input: ['hello', 'world'],
      model: 'test-model',
      dimensions: 768,
    });

    const request = parseRequest(line);
    expect(request.type).toBe('embed');
    expect((request as { input: string[] }).input).toEqual(['hello', 'world']);
  });

  it('rejects an embed request where input is not a string array', () => {
    const line = JSON.stringify({
      id: 1,
      type: 'embed',
      input: [1, 2, 3],
      model: 'test-model',
      dimensions: 768,
    });

    expect(() => parseRequest(line)).toThrow(
      'Embed request input must be string[]',
    );
  });

  it('accepts a ping request', () => {
    const line = JSON.stringify({ id: 1, type: 'ping' });
    const request = parseRequest(line);
    expect(request.type).toBe('ping');
  });

  it('accepts a shutdown request', () => {
    const line = JSON.stringify({ id: 1, type: 'shutdown' });
    const request = parseRequest(line);
    expect(request.type).toBe('shutdown');
  });

  it('rejects an unknown request type', () => {
    const line = JSON.stringify({ id: 1, type: 'unknown' });
    expect(() => parseRequest(line)).toThrow(
      'Unknown sidecar request type: unknown',
    );
  });

  it('rejects a request with a missing id', () => {
    const line = JSON.stringify({ type: 'ping' });
    expect(() => parseRequest(line)).toThrow(
      'Invalid sidecar request envelope',
    );
  });

  it('rejects a request with a missing type', () => {
    const line = JSON.stringify({ id: 1 });
    expect(() => parseRequest(line)).toThrow(
      'Invalid sidecar request envelope',
    );
  });

  it('rejects invalid dimensions instead of falling back in the worker (F10)', async () => {
    process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER = 'hf-local';
    const request = parseRequest(JSON.stringify({
      id: 1,
      type: 'embed',
      input: ['hello'],
      model: 'test-model',
      dimensions: 0,
    }));

    await expect(getProvider(request)).rejects.toThrow(
      'Sidecar request dimensions must be a positive integer, got 0',
    );
    expect(factoryMockState.createEmbeddingsProvider).not.toHaveBeenCalled();
  });

  it('requires an upstream-provided sidecar provider instead of defaulting (F71)', async () => {
    delete process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER;
    const request = parseRequest(JSON.stringify({
      id: 1,
      type: 'embed',
      input: ['hello'],
      model: 'test-model',
      dimensions: 3,
    }));

    await expect(getProvider(request)).rejects.toThrow(
      'SPECKIT_EMBEDDER_SIDECAR_PROVIDER is required',
    );
    expect(factoryMockState.createEmbeddingsProvider).not.toHaveBeenCalled();
  });

  it('consolidates sidecar provider aliases before factory creation (F75)', async () => {
    process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER = 'sentence-transformers';
    const request = parseRequest(JSON.stringify({
      id: 1,
      type: 'embed',
      input: ['hello'],
      model: 'test-model',
      dimensions: 3,
    }));

    await getProvider(request);

    expect(factoryMockState.createEmbeddingsProvider).toHaveBeenCalledWith({
      provider: 'hf-local',
      model: 'test-model',
      dim: 3,
      warmup: false,
    });
  });
});
