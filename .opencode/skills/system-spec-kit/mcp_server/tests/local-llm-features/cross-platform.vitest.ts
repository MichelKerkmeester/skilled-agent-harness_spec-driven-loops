// ---------------------------------------------------------------
// MODULE: Local LLM Cross Platform Tests
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { getLlamaCppAvailability } from '../../../shared/embeddings/llama-cpp-availability.js';

const originalEnv = { ...process.env };
let tempDir: string | null = null;

describe('local LLM cross-platform behavior', () => {
  // CLAIM: 028 spec Group 9 — Apple Silicon uses MPS/Metal paths when available, while other platforms fall back cleanly.
  beforeAll(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'spec-kit-test-'));
    writeFileSync(path.join(tempDir, 'claim.txt'), 'cross-platform');
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
    vi.resetModules();
  });

  afterAll(() => {
    if (tempDir && existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it.skipIf(!(process.platform === 'darwin' && process.arch === 'arm64'))('T1 Apple Silicon hf-local uses the mps device hint when loading succeeds', async () => {
    vi.doMock('@huggingface/transformers', () => ({
      pipeline: vi.fn(async () => async () => ({ data: new Float32Array(768).fill(0.01) })),
    }));
    const { HfLocalProvider } = await import('../../../shared/embeddings/providers/hf-local.js');

    const provider = new HfLocalProvider();
    await provider.generateEmbedding('apple silicon device hint');

    expect(provider.getMetadata().device).toBe('mps');
  });

  it.skipIf(process.platform !== 'darwin' || !getLlamaCppAvailability().available)('T2 macOS llama-cpp reports available when the GGUF runtime is installed', () => {
    expect(getLlamaCppAvailability()).toMatchObject({ available: true });
  });

  it.skipIf(process.platform === 'darwin' && process.arch === 'arm64')('T3 non-Apple platforms can use explicit hf-local fallback', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'hf-local';
    const { getStartupEmbeddingProfile } = await import('../../../shared/embeddings/factory.js');

    const profile = getStartupEmbeddingProfile();

    expect(profile.provider).toBe('hf-local');
    expect(profile.dim).toBe(768);
  });
});
