// ───────────────────────────────────────────────────────────────────
// MODULE: Local LLM Cascade Resolution Tests
// ───────────────────────────────────────────────────────────────────

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { getLlamaCppAvailability } from '../../../shared/embeddings/llama-cpp-availability.js';

vi.mock('../../../shared/embeddings/llama-cpp-availability.js', () => ({
  getLlamaCppAvailability: vi.fn(),
  LLAMA_CPP_DEFAULT_MODEL_PATH: '/tmp/spec-kit-test-missing.gguf',
  resolveLlamaCppModelPath: vi.fn(() => '/tmp/spec-kit-test-missing.gguf'),
  resolveWorkspaceNodeLlamaCppEntrypoint: vi.fn(() => null),
}));

type ProviderName = 'voyage' | 'openai' | 'hf-local' | 'llama-cpp';

const originalEnv = { ...process.env };
let tempDir: string | null = null;

async function loadFactory(): Promise<typeof import('../../../shared/embeddings/factory.js')> {
  return import('../../../shared/embeddings/factory.js');
}

async function activeProfileProvider(): Promise<ProviderName> {
  const { getStartupEmbeddingProfile } = await loadFactory();
  return getStartupEmbeddingProfile().provider as ProviderName;
}

describe('local LLM cascade resolution', () => {
  // CLAIM: shared/embeddings/factory.ts resolveProvider — cascade order is Voyage -> OpenAI -> llama-cpp -> hf-local, with explicit EMBEDDINGS_PROVIDER winning.
  beforeAll(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'spec-kit-test-'));
    writeFileSync(path.join(tempDir, 'claim.txt'), 'cascade-resolution');
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.EMBEDDINGS_PROVIDER;
    delete process.env.VOYAGE_API_KEY;
    delete process.env.OPENAI_API_KEY;
    vi.mocked(getLlamaCppAvailability).mockReturnValue({ available: false, reason: 'fixture unavailable' });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterAll(() => {
    if (tempDir && existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('T1 resolves Voyage when VOYAGE_API_KEY is the only credential', async () => {
    process.env.VOYAGE_API_KEY = 'voyage_test_key_1234567890';

    const { resolveProvider } = await loadFactory();

    expect(await activeProfileProvider()).toBe('voyage');
    expect(resolveProvider()).toMatchObject({ name: 'voyage' });
  });

  it('T2 resolves OpenAI when OPENAI_API_KEY is set and Voyage is absent', async () => {
    process.env.OPENAI_API_KEY = 'openai_test_key_1234567890';

    const { resolveProvider } = await loadFactory();

    expect(await activeProfileProvider()).toBe('openai');
    expect(resolveProvider()).toMatchObject({ name: 'openai' });
  });

  it('T3 resolves llama-cpp when no cloud keys exist and the availability probe passes', async () => {
    vi.mocked(getLlamaCppAvailability).mockReturnValue({ available: true });

    const { resolveProvider } = await loadFactory();

    expect(await activeProfileProvider()).toBe('llama-cpp');
    expect(resolveProvider()).toMatchObject({ name: 'llama-cpp' });
  });

  it('T4 resolves hf-local when no cloud keys exist and llama-cpp is unavailable', async () => {
    vi.mocked(getLlamaCppAvailability).mockReturnValue({ available: false, reason: 'GGUF model not found' });

    const { resolveProvider } = await loadFactory();

    expect(await activeProfileProvider()).toBe('hf-local');
    expect(resolveProvider()).toMatchObject({ name: 'hf-local' });
  });

  it('T5 keeps explicit hf-local even when higher-priority environment is present', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'hf-local';
    process.env.VOYAGE_API_KEY = 'voyage_test_key_1234567890';
    process.env.OPENAI_API_KEY = 'openai_test_key_1234567890';
    vi.mocked(getLlamaCppAvailability).mockReturnValue({ available: true });

    const { resolveProvider } = await loadFactory();

    expect(await activeProfileProvider()).toBe('hf-local');
    expect(resolveProvider()).toMatchObject({ name: 'hf-local' });
  });

  it('T6 explicit llama-cpp bypasses the cascade and fails clearly when runtime loading is unavailable', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'llama-cpp';
    // Point the provider at a definitely-missing GGUF path so construction fails even when
    // node-llama-cpp is installed on the test machine. The vi.mock above stubs the resolver
    // for factory probing, but the actual provider constructor reads its own env-var path.
    process.env.LLAMA_CPP_EMBEDDINGS_MODEL_PATH = '/tmp/spec-kit-test-definitely-missing-' + Date.now() + '.gguf';
    vi.mocked(getLlamaCppAvailability).mockReturnValue({ available: false, reason: 'GGUF model not found' });

    const { createEmbeddingsProvider, resolveProvider } = await loadFactory();

    expect(resolveProvider()).toMatchObject({ name: 'llama-cpp' });
    await expect(createEmbeddingsProvider({ provider: 'llama-cpp', warmup: false })).rejects.toThrow(
      /llama-cpp|GGUF|not installed|model|not found|enoent|ENOENT/i,
    );
  });
});
