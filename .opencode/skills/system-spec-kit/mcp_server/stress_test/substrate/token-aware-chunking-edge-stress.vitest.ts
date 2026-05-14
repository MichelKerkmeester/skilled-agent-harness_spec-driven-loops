import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  __llamaCppTestables,
  LlamaCppProvider,
  type LlamaCppRuntimeState,
} from '../../../shared/embeddings/providers/llama-cpp';

function vector768(): number[] {
  return Array.from({ length: 768 }, (_value, index) => (index === 0 ? 1 : 0));
}

function charTokenize(text: string): string[] {
  return Array.from(text);
}

function createRuntime(tokenBudget: number, receivedInputs: string[]): LlamaCppRuntimeState {
  return {
    llama: {
      loadModel: vi.fn(),
      gpu: null,
    },
    model: {
      trainContextSize: tokenBudget,
      tokenize: charTokenize,
      detokenize(tokens: unknown[]): string {
        return (tokens as string[]).join('');
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
    contextSize: tokenBudget,
  };
}

afterEach(() => {
  __llamaCppTestables.resetRuntimeForTesting();
  vi.restoreAllMocks();
});

describe('token-aware chunking edge stress', () => {
  it('sends a 99% token-budget input as one embedding request', async () => {
    const receivedInputs: string[] = [];
    const budget = 1000;
    const input = 'a'.repeat(Math.floor(budget * 0.99));
    __llamaCppTestables.setRuntimeOverride(createRuntime(budget, receivedInputs));

    const provider = new LlamaCppProvider({ maxTextLength: 8_000 });
    await expect(provider.generateEmbedding(input)).resolves.toBeInstanceOf(Float32Array);

    expect(receivedInputs).toEqual([input]);
  });

  it('truncates a 101% token-budget input at a tokenizer boundary', async () => {
    const receivedInputs: string[] = [];
    const budget = 1000;
    const input = 'b'.repeat(Math.ceil(budget * 1.01));
    __llamaCppTestables.setRuntimeOverride(createRuntime(budget, receivedInputs));

    const provider = new LlamaCppProvider({ maxTextLength: 8_000 });
    await expect(provider.generateEmbedding(input)).resolves.toBeInstanceOf(Float32Array);

    expect(receivedInputs).toHaveLength(1);
    expect(charTokenize(receivedInputs[0])).toHaveLength(budget);
    expect(input.startsWith(receivedInputs[0])).toBe(true);
  });

  it('bounds a 500% token-budget input without exceeding the tokenizer budget', async () => {
    const receivedInputs: string[] = [];
    const budget = 1000;
    const input = 'c'.repeat(budget * 5);
    __llamaCppTestables.setRuntimeOverride(createRuntime(budget, receivedInputs));

    const provider = new LlamaCppProvider({ maxTextLength: 8_000 });
    await expect(provider.generateEmbedding(input)).resolves.toBeInstanceOf(Float32Array);

    expect(receivedInputs).toHaveLength(1);
    expect(charTokenize(receivedInputs[0]).length).toBeLessThanOrEqual(budget);
    expect(input.startsWith(receivedInputs[0])).toBe(true);
  });

  it('treats empty input as non-embeddable and avoids the runtime call', async () => {
    const receivedInputs: string[] = [];
    __llamaCppTestables.setRuntimeOverride(createRuntime(1000, receivedInputs));

    const provider = new LlamaCppProvider({ maxTextLength: 8_000 });
    await expect(provider.generateEmbedding('   ')).resolves.toBeNull();

    expect(receivedInputs).toEqual([]);
  });

  it('preserves high-entropy CJK and emoji token boundaries after tokenizer truncation', async () => {
    const receivedInputs: string[] = [];
    const budget = 120;
    const atom = '漢字かなカナ🙂🚀';
    const input = atom.repeat(40);
    __llamaCppTestables.setRuntimeOverride(createRuntime(budget, receivedInputs));

    const provider = new LlamaCppProvider({ maxTextLength: 8_000 });
    await expect(provider.generateEmbedding(input)).resolves.toBeInstanceOf(Float32Array);

    expect(receivedInputs).toHaveLength(1);
    expect(charTokenize(receivedInputs[0])).toHaveLength(budget);
    expect(input.startsWith(receivedInputs[0])).toBe(true);
    expect(receivedInputs[0]).not.toContain('\uFFFD');
  });
});
