// TEST: llama-cpp vs hf-local embedding parity
import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';

import { HfLocalProvider } from '@spec-kit/shared/embeddings/providers/hf-local';
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

function repoRoot(): string {
  return path.resolve(__dirname, '..', '..', '..', '..', '..');
}

function representativeChunks(): string[] {
  const root = repoRoot();
  const files = [
    '.opencode/skills/system-spec-kit/shared/embeddings/factory.ts',
    '.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts',
    '.opencode/skills/system-spec-kit/shared/types.ts',
    '.opencode/skills/system-spec-kit/mcp_server/context-server.ts',
    '.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts',
  ];

  const chunks: string[] = [];
  for (const relativePath of files) {
    const content = fs.readFileSync(path.join(root, relativePath), 'utf8');
    const normalized = content
      .replace(/\r\n/g, '\n')
      .split(/\n{2,}/)
      .map((part) => part.trim())
      .filter((part) => part.length > 80);

    for (const part of normalized) {
      chunks.push(part.slice(0, 1200));
      if (chunks.length === 50) {
        return chunks;
      }
    }
  }

  if (chunks.length < 50) {
    throw new Error(`Unable to build 50 representative chunks; got ${chunks.length}`);
  }
  return chunks.slice(0, 50);
}

function cosine(left: Float32Array, right: Float32Array): number {
  if (left.length !== right.length) {
    throw new Error(`Vector length mismatch: ${left.length} !== ${right.length}`);
  }

  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftNorm += left[index] * left[index];
    rightNorm += right[index] * right[index];
  }

  if (leftNorm === 0 || rightNorm === 0) {
    return 0;
  }
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

describeIf('llama-cpp vs hf-local embedding parity', () => {
  it('matches hf-local on the 50-chunk representative panel', async () => {
    const samples = representativeChunks();
    const hfLocal = new HfLocalProvider({
      model: 'onnx-community/embeddinggemma-300m-ONNX',
      dim: 768,
      timeout: 60000,
    });
    const llamaCpp = new LlamaCppProvider({
      modelPath: MODEL_PATH,
      timeout: 60000,
    });

    const scores: number[] = [];
    for (const sample of samples) {
      const reference = await hfLocal.generateEmbedding(sample);
      const candidate = await llamaCpp.generateEmbedding(sample);

      expect(reference).toBeInstanceOf(Float32Array);
      expect(candidate).toBeInstanceOf(Float32Array);
      scores.push(cosine(reference!, candidate!));
    }

    const mean = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    const min = Math.min(...scores);

    console.info(JSON.stringify({
      mean_cosine: mean,
      min_cosine: min,
      samples: scores.length,
    }));

    expect(mean).toBeGreaterThanOrEqual(0.995);
    expect(min).toBeGreaterThanOrEqual(0.99);
  }, 600000);
});
