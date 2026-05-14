// ---------------------------------------------------------------
// MODULE: Local LLM Embedding Shape Tests
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';

import { getLlamaCppAvailability } from '../../../shared/embeddings/llama-cpp-availability.js';
import { HfLocalProvider } from '../../../shared/embeddings/providers/hf-local.js';
import { LlamaCppProvider } from '../../../shared/embeddings/providers/llama-cpp.js';

const originalEnv = { ...process.env };
// HuggingFace Hub cache convention: ~/.cache/huggingface/hub/models--<org>--<name>/
// (transformers.js + the hub CLI both write here; the older
// ~/.cache/huggingface/transformers/ path is the pre-v3 layout and is not used.)
const hfModelCache = path.join(
  homedir(),
  '.cache',
  'huggingface',
  'hub',
  'models--onnx-community--embeddinggemma-300m-ONNX',
);
let tempDir: string | null = null;

describe('local LLM embedding shape', () => {
  // CLAIM: 028 spec Group 3 — local providers generate 768-dimensional Float32 embeddings and handle empty/long text safely.
  beforeAll(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'spec-kit-test-'));
    writeFileSync(path.join(tempDir, 'claim.txt'), 'embedding-shape');
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.HF_EMBEDDINGS_MODEL;
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

  it.skipIf(!existsSync(hfModelCache))('T1 hf-local generates a 768-dim Float32Array for sample text', async () => {
    const provider = new HfLocalProvider({ timeout: 30_000 });

    const embedding = await provider.generateEmbedding('local embedding shape smoke test');

    expect(embedding).toBeInstanceOf(Float32Array);
    expect(embedding?.length).toBe(768);
  });

  it('T2 hf-local handles empty string with a clear null result and warning', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const provider = new HfLocalProvider();

    const embedding = await provider.generateEmbedding('');

    expect(embedding).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/Empty|invalid/i));
  });

  it.skipIf(!existsSync(hfModelCache))('T3 hf-local handles 5000+ chars without a truncation crash', async () => {
    const provider = new HfLocalProvider({ timeout: 30_000 });
    const longText = 'local embedding long text '.repeat(240);

    const embedding = await provider.generateEmbedding(longText);

    expect(embedding).toBeInstanceOf(Float32Array);
    expect(embedding?.length).toBe(768);
  });

  it.skipIf(!getLlamaCppAvailability().available)('T4 llama-cpp generates a 768-dim Float32Array when GGUF runtime is installed', async () => {
    const provider = new LlamaCppProvider({ timeout: 30_000 });

    const embedding = await provider.generateEmbedding('llama cpp embedding shape smoke test');

    expect(embedding).toBeInstanceOf(Float32Array);
    expect(embedding?.length).toBe(768);
  });
});
