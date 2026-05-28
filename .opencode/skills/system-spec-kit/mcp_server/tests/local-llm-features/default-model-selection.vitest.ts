// ---------------------------------------------------------------
// MODULE: Local LLM Default Model Selection Tests
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const originalEnv = { ...process.env };
let tempDir: string | null = null;

async function loadFactory(): Promise<typeof import('../../../shared/embeddings/factory.js')> {
  return import('../../../shared/embeddings/factory.js');
}

describe('local LLM default model selection', () => {
  // CLAIM: post- ship state — hf-local, Ollama, Voyage, and OpenAI each have documented default models and dimensions
  beforeAll(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'spec-kit-test-'));
    writeFileSync(path.join(tempDir, 'claim.txt'), 'default-model-selection');
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.HF_EMBEDDINGS_MODEL;
    delete process.env.VOYAGE_EMBEDDINGS_MODEL;
    delete process.env.OPENAI_EMBEDDINGS_MODEL;
    delete process.env.EMBEDDING_DIM;
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

  it('T1 selects the hf-local nomic default', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'hf-local';

    const { getStartupEmbeddingProfile } = await loadFactory();
    const profile = getStartupEmbeddingProfile();

    // Local-first cascade default per ADR-014: both ollama and hf-local derive
    // from the nomic manifest; hf-local surfaces it as the HF repo path.
    expect(profile.model).toBe('nomic-ai/nomic-embed-text-v1.5');
    expect(profile.dim).toBe(768);
    expect(profile.dtype).toBe('q8');
  });

  it('T2 selects the Ollama Nomic default', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'ollama';

    const { getStartupEmbeddingProfile } = await loadFactory();
    const profile = getStartupEmbeddingProfile();

    expect(profile.model).toBe('nomic-embed-text-v1.5');
    expect(profile.dim).toBe(768);
    expect(profile.dtype).toBeNull();
  });

  it('T3 selects voyage-code-3 for Voyage profiles', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'voyage';

    const { getStartupEmbeddingProfile } = await loadFactory();
    const profile = getStartupEmbeddingProfile();

    expect(profile.model).toBe('voyage-code-3');
    expect(profile.dim).toBe(1024);
    // Cloud providers use synthetic 'cloud' dtype slug for uniform provider/model/dim/dtype contract (029 ship state)
    expect(profile.dtype).toBe('cloud');
  });

  it('T4 selects text-embedding-3-small for OpenAI profiles', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'openai';

    const { getStartupEmbeddingProfile } = await loadFactory();
    const profile = getStartupEmbeddingProfile();

    expect(profile.model).toBe('text-embedding-3-small');
    expect(profile.dim).toBe(1536);
    // Cloud providers use synthetic 'cloud' dtype slug for uniform provider/model/dim/dtype contract (029 ship state)
    expect(profile.dtype).toBe('cloud');
  });
});
