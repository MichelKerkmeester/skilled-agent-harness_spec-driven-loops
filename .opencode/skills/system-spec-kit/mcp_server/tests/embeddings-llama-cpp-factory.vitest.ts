// TEST: llama-cpp provider factory wire-up
import { afterEach, describe, expect, it } from 'vitest';

import { createEmbeddingsProvider, resolveProvider } from '@spec-kit/shared/embeddings/factory';

const ORIGINAL_PROVIDER = process.env.EMBEDDINGS_PROVIDER;

function restoreEnv(): void {
  if (ORIGINAL_PROVIDER === undefined) {
    delete process.env.EMBEDDINGS_PROVIDER;
  } else {
    process.env.EMBEDDINGS_PROVIDER = ORIGINAL_PROVIDER;
  }
}

describe('llama-cpp provider factory wire-up', () => {
  afterEach(() => {
    restoreEnv();
  });

  it('resolves explicit EMBEDDINGS_PROVIDER=llama-cpp', () => {
    process.env.EMBEDDINGS_PROVIDER = 'llama-cpp';

    const resolution = resolveProvider();

    expect(resolution.name).toBe('llama-cpp');
    expect(resolution.reason).toContain('Explicit EMBEDDINGS_PROVIDER');
  });

  it('creates the llama-cpp provider without changing default auto resolution', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'llama-cpp';

    const provider = await createEmbeddingsProvider({
      provider: 'llama-cpp',
      warmup: false,
    });

    expect(provider.getProviderName()).toBe('llama-cpp');
    expect(provider.getMetadata()).toMatchObject({
      provider: 'llama-cpp',
      dim: 768,
    });
  });
});
