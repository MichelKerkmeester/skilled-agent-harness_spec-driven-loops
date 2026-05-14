// TEST: llama-cpp token-budget truncation
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  __llamaCppTestables,
  LlamaCppProvider,
  type LlamaCppRuntimeState,
  type NodeLlamaCppModule,
} from '../../shared/embeddings/providers/llama-cpp.js';
import { normalizeContentForEmbedding } from '../lib/parsing/content-normalizer.js';

function vector768(): number[] {
  return Array.from({ length: 768 }, (_value, index) => (index === 0 ? 1 : 0));
}

function repoRoot(): string {
  return path.resolve(__dirname, '..', '..', '..', '..', '..');
}

function charTokenize(text: string): unknown[] {
  return Array.from(text);
}

function createRuntime(tokenBudget: number, receivedInputs: string[]): LlamaCppRuntimeState {
  return {
    llama: {
      loadModel: vi.fn(),
      gpu: null,
    },
    model: {
      trainContextSize: 2048,
      tokenize: charTokenize,
      detokenize(tokens: unknown[]): string {
        return tokens.join('');
      },
      createEmbeddingContext: vi.fn(),
    },
    context: {
      getEmbeddingFor: vi.fn(async (input: string) => {
        receivedInputs.push(input);
        return { vector: vector768() };
      }),
    },
    modelPath: '/tmp/mock-llama-cpp.gguf',
    loadTimeMs: 0,
    gpu: null,
    tokenBudget,
    contextSize: 2048,
  };
}

afterEach(() => {
  __llamaCppTestables.resetRuntimeForTesting();
  vi.restoreAllMocks();
});

describe('llama-cpp token budget', () => {
  it('T030-01 truncates generated input to the injected token budget', async () => {
    const receivedInputs: string[] = [];
    __llamaCppTestables.setRuntimeOverride(createRuntime(200, receivedInputs));

    const provider = new LlamaCppProvider({ maxTextLength: 8_000 });
    const result = await provider.generateEmbedding('x'.repeat(500));

    expect(result).toBeInstanceOf(Float32Array);
    expect(result).toHaveLength(768);
    expect(receivedInputs).toHaveLength(1);
    expect(charTokenize(receivedInputs[0]).length).toBeLessThanOrEqual(200);
  });

  it('T030-02 accepts an 8000-character markdown fixture and sends at most the budget', async () => {
    const receivedInputs: string[] = [];
    __llamaCppTestables.setRuntimeOverride(createRuntime(320, receivedInputs));

    const fixture = (`# Token Budget Fixture\n\n${'markdown content '.repeat(700)}`).slice(0, 8_000);
    const provider = new LlamaCppProvider({ maxTextLength: 8_000 });

    await expect(provider.generateEmbedding(fixture)).resolves.toBeInstanceOf(Float32Array);
    expect(receivedInputs).toHaveLength(1);
    expect(charTokenize(receivedInputs[0]).length).toBeLessThanOrEqual(320);
  });

  it('T030-03 creates an auto context bounded by the model train context size', async () => {
    const tempDir = mkdtempSync(path.join(os.tmpdir(), 'llama-cpp-token-budget-'));
    const modelPath = path.join(tempDir, 'mock.gguf');
    writeFileSync(modelPath, 'mock model');

    const createEmbeddingContext = vi.fn(async () => ({
      getEmbeddingFor: vi.fn(async () => ({ vector: vector768() })),
    }));
    const moduleOverride: NodeLlamaCppModule = {
      getLlama: vi.fn(async () => ({
        gpu: 'mock',
        loadModel: vi.fn(async () => ({
          trainContextSize: 2048,
          tokenize: charTokenize,
          detokenize(tokens: unknown[]): string {
            return tokens.join('');
          },
          createEmbeddingContext,
        })),
      })),
    };

    try {
      __llamaCppTestables.setNodeLlamaCppModule(moduleOverride);
      const runtime = await __llamaCppTestables.loadRuntime(modelPath);

      expect(runtime.tokenBudget).toBe(Math.floor(2048 * 0.9));
      expect(runtime.contextSize).toBe(2048);
      expect(createEmbeddingContext).toHaveBeenCalledWith({
        contextSize: 'auto',
        minContextSize: 512,
        maxContextSize: 2048,
        batchSize: 512,
      });
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  const smokeIt = existsSync(__llamaCppTestables.DEFAULT_MODEL_PATH) && process.env.EMBEDDINGS_PROVIDER === 'llama-cpp'
    ? it
    : it.skip;

  smokeIt('T030-04 embeds the normalized 027 checklist fixture with the real llama-cpp runtime', async () => {
    const checklistPath = path.join(
      repoRoot(),
      '.opencode',
      'specs',
      'system-spec-kit',
      '027-xce-research-based-refinement',
      '002-feedback-p0-correctness',
      'checklist.md',
    );
    const fixture = normalizeContentForEmbedding(readFileSync(checklistPath, 'utf8')).slice(0, 2_831);
    const provider = new LlamaCppProvider({
      modelPath: __llamaCppTestables.DEFAULT_MODEL_PATH,
      timeout: 60_000,
    });

    const embedding = await provider.embedDocument(fixture);

    expect(embedding).toBeInstanceOf(Float32Array);
    expect(embedding).toHaveLength(768);
  }, 120_000);
});
