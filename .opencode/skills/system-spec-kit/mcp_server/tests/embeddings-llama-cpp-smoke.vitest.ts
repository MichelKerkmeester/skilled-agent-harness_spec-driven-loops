// TEST: llama-cpp embeddings smoke
import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';

import { LlamaCppProvider } from '@spec-kit/shared/embeddings/providers/llama-cpp';

const DEFAULT_MODEL_PATH = path.join(
  os.homedir(),
  '.cache',
  'huggingface',
  'gguf',
  'embeddinggemma-300m',
  'embeddinggemma-300M-Q8_0.gguf',
);
const MODEL_PATH = process.env.LLAMA_CPP_EMBEDDINGS_MODEL_PATH || DEFAULT_MODEL_PATH;

const shouldRun = process.env.EMBEDDINGS_PROVIDER === 'llama-cpp' && fs.existsSync(MODEL_PATH);
const describeIf = shouldRun ? describe : describe.skip;

function l2Norm(vector: Float32Array): number {
  let sum = 0;
  for (const value of vector) {
    sum += value * value;
  }
  return Math.sqrt(sum);
}

describeIf('llama-cpp embeddings smoke', () => {
  it('warms up and returns a normalized 768d embedding', async () => {
    const provider = new LlamaCppProvider({
      modelPath: MODEL_PATH,
      timeout: 60000,
    });

    await expect(provider.warmup()).resolves.toBe(true);

    const embedding = await provider.generateEmbedding('test');
    expect(embedding).toBeInstanceOf(Float32Array);
    expect(embedding).toHaveLength(768);
    expect(l2Norm(embedding!)).toBeCloseTo(1.0, 3);
  }, 120000);
});
