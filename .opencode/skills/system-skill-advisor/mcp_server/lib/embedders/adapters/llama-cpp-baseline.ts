// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — llama.cpp baseline adapter
// ───────────────────────────────────────────────────────────────

import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory.js';
import type { EmbedderAdapter, EmbedderOptions } from '../adapter.js';
import type { BackendKind, EmbedderManifest } from '../types.js';

export class LlamaCppBaselineAdapter implements EmbedderAdapter {
  readonly name: string;
  readonly dim: number;
  readonly backend: BackendKind = 'llama-cpp';
  readonly prefixQuery?: string;
  readonly prefixDocument?: string;

  constructor(private readonly manifest: EmbedderManifest) {
    if (manifest.backend !== 'llama-cpp') {
      throw new TypeError(`LlamaCppBaselineAdapter requires a llama-cpp manifest, got ${manifest.backend}`);
    }

    this.name = manifest.name;
    this.dim = manifest.dim;
    this.prefixQuery = manifest.prefixQuery;
    this.prefixDocument = manifest.prefixDocument;
  }

  async embed(texts: ReadonlyArray<string>, options: EmbedderOptions = {}): Promise<Float32Array[]> {
    const provider = await createEmbeddingsProvider();
    const results: Float32Array[] = [];

    for (const text of texts) {
      const embedding = options.inputType === 'query'
        ? await provider.embedQuery(text)
        : await provider.embedDocument(text);
      if (!embedding) {
        throw new Error(`baseline embedding provider returned no embedding for ${this.name}`);
      }
      if (embedding.length !== this.dim) {
        throw new Error(
          `baseline embedding dimension mismatch for ${this.name}: expected ${this.dim}, got ${embedding.length}`,
        );
      }
      results.push(embedding instanceof Float32Array ? embedding : Float32Array.from(embedding));
    }

    return results;
  }

  async ready(): Promise<boolean> {
    try {
      const provider = await createEmbeddingsProvider();
      const profile = provider.getProfile();
      return profile.dim === this.dim;
    } catch {
      return false;
    }
  }
}
