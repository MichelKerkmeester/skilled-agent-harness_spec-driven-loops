// ---------------------------------------------------------------
// MODULE: Local LLM Health Reporting Tests
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { HfLocalProvider } from '../../../shared/embeddings/providers/hf-local.js';

const originalEnv = { ...process.env };
let tempDir: string | null = null;

describe('local LLM health reporting', () => {
  // CLAIM: 028 spec Group 6 — provider health surfaces provider, model, dimension, and dtype.
  beforeAll(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'spec-kit-test-'));
    writeFileSync(path.join(tempDir, 'claim.txt'), 'health-reporting');
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.HF_EMBEDDINGS_DTYPE;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  afterAll(() => {
    if (tempDir && existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('T1 HfLocalProvider metadata reports name, model, dimension, and dtype', () => {
    const provider = new HfLocalProvider();

    const metadata = provider.getMetadata();

    expect(metadata).toMatchObject({
      provider: 'hf-local',
      model: 'BAAI/bge-base-en-v1.5',
      dim: 768,
      dtype: 'q8',
    });
  });

  it('T2 provider.healthCheck returns truthy when a loadable extractor is already present', async () => {
    const provider = new HfLocalProvider();
    provider.extractor = vi.fn(async () => ({ data: new Float32Array(768).fill(0.01) }));

    await expect(provider.healthCheck()).resolves.toBe(true);
  });

  it('T3 memory_health response shape can include provider, dtype, and dimension fields', () => {
    const provider = new HfLocalProvider();
    const metadata = provider.getMetadata();
    const memoryHealthPayload = {
      embeddings: {
        provider: metadata.provider,
        model: metadata.model,
        dtype: metadata.dtype,
        dimension: metadata.dim,
        healthy: metadata.healthy,
      },
    };

    expect(memoryHealthPayload.embeddings).toMatchObject({
      provider: 'hf-local',
      dtype: 'q8',
      dimension: 768,
    });
  });
});
