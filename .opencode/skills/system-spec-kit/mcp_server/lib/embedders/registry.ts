// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — registry
// ───────────────────────────────────────────────────────────────
// Packet 016/001: name → manifest lookup. Phase 016/002 wires
// concrete adapter construction via `getAdapter(name)`; this phase
// only ships the manifests (the static declaration) so phase 002 has
// a stable surface to implement against.
//
// See: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/
//      016-pluggable-embedder-architecture/001-embedder-adapter-interface/spec.md
// ───────────────────────────────────────────────────────────────

import {
  generateEmbedding,
  getEmbeddingDimension,
  isModelLoaded,
} from '../providers/embeddings.js';
import type { EmbedderAdapter } from './adapter.js';
import { OllamaAdapter } from './adapters/ollama.js';
import type { BackendKind, EmbedderManifest } from './types.js';

/**
 * Frozen list of supported embedder manifests. Add a new model = append a
 * row here + ensure the manifest's `backend` adapter exists.
 *
 * Order matches the spec.md §3 candidate table (current baseline first,
 * then 5 alternatives ranked by likely paraphrase-recall improvement).
 */
const MANIFESTS: ReadonlyArray<EmbedderManifest> = Object.freeze([
  {
    name: 'embeddinggemma-300m',
    dim: 768,
    backend: 'llama-cpp',
    modelPath: 'unsloth-embeddinggemma-300m-GGUF/embeddinggemma-300m-Q8_0.gguf',
    notes: 'Current baseline. q8 quantization. General-purpose embedding model from Google.',
  },
  {
    name: 'nomic-embed-text-v1.5',
    dim: 768,
    backend: 'ollama',
    ollamaName: 'nomic-embed-text:v1.5',
    prefixQuery: 'search_query: ',
    prefixDocument: 'search_document: ',
    maxInputChars: 5000,
    notes: 'Drop-in 768-dim swap candidate. Retrieval-specialist trained on 235M pairs with hard negatives. Requires prefix tokens.',
  },
  {
    name: 'mxbai-embed-large-v1',
    dim: 1024,
    backend: 'ollama',
    ollamaName: 'mxbai-embed-large:latest',
    maxInputChars: 1200,
    notes: 'Phase 016/004 target. AnglE loss explicitly optimizes paraphrase cosine — directly addresses 008/cat-24/409 LLM-made-memory recall.',
  },
  {
    name: 'bge-small-en-v1.5',
    dim: 384,
    backend: 'ollama',
    ollamaName: 'bge-small-en-v1.5:latest',
    notes: 'Compact 33M-param baseline. Fast but limited paraphrase capacity. Schema migration to vec_384 required.',
  },
  {
    name: 'bge-large-en-v1.5',
    dim: 1024,
    backend: 'ollama',
    ollamaName: 'bge-large-en-v1.5:latest',
    notes: 'BAAI flagship retrieval model. Schema migration to vec_1024 required.',
  },
  {
    name: 'jina-embeddings-v3',
    dim: 1024,
    backend: 'ollama',
    ollamaName: 'hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M',
    maxInputChars: 8000,
    notes: 'Multilingual + paraphrase-tuned. Matryoshka representation allows 256/512/768/1024 truncation.',
  },
]);

export class NotImplementedError extends Error {
  constructor(backend: BackendKind) {
    super(`Embedder backend is not implemented yet: ${backend}`);
    this.name = 'NotImplementedError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class LlamaCppBaselineAdapter implements EmbedderAdapter {
  readonly name: string;
  readonly dim: number;
  readonly backend: BackendKind = 'llama-cpp';
  readonly prefixQuery?: string;
  readonly prefixDocument?: string;

  constructor(private readonly manifest: EmbedderManifest) {
    this.name = manifest.name;
    this.dim = manifest.dim;
    this.prefixQuery = manifest.prefixQuery;
    this.prefixDocument = manifest.prefixDocument;
  }

  async embed(texts: ReadonlyArray<string>): Promise<Float32Array[]> {
    const results: Float32Array[] = [];
    for (const text of texts) {
      const embedding = await generateEmbedding(text);
      if (!embedding) {
        throw new Error(`llama-cpp embedding provider returned no embedding for ${this.name}`);
      }
      if (embedding.length !== this.dim) {
        throw new Error(
          `llama-cpp embedding dimension mismatch for ${this.name}: expected ${this.dim}, got ${embedding.length}`,
        );
      }
      results.push(embedding);
    }
    return results;
  }

  async ready(): Promise<boolean> {
    return isModelLoaded() && getEmbeddingDimension() === this.dim;
  }
}

/**
 * Look up an embedder manifest by canonical name.
 * Returns the frozen manifest, or `undefined` if no match.
 */
export function getManifest(name: string): EmbedderManifest | undefined {
  return MANIFESTS.find((m) => m.name === name);
}

/**
 * List all registered manifests in declaration order. The first entry is
 * the legacy baseline (`embeddinggemma-300m`); subsequent entries are
 * candidates evaluated in phase 016/004.
 */
export function listManifests(): ReadonlyArray<EmbedderManifest> {
  return MANIFESTS;
}

/**
 * Convenience: return only the unique dimensions across all manifests.
 * Phase 016/002 uses this to know which `vec_<dim>` tables may need
 * eventual creation (lazy — only on first reference).
 */
export function listSupportedDimensions(): ReadonlyArray<number> {
  return Array.from(new Set(MANIFESTS.map((m) => m.dim))).sort((a, b) => a - b);
}

/**
 * Construct the concrete adapter for a registered embedder.
 * Unknown names return `undefined`; known-but-unwired backends throw so
 * callers can distinguish typo from unsupported backend.
 */
export function getAdapter(name: string): EmbedderAdapter | undefined {
  const manifest = getManifest(name);
  if (!manifest) {
    return undefined;
  }

  switch (manifest.backend) {
    case 'ollama':
      return new OllamaAdapter(manifest);
    case 'llama-cpp':
      if (manifest.name !== 'embeddinggemma-300m') {
        throw new NotImplementedError(manifest.backend);
      }
      return new LlamaCppBaselineAdapter(manifest);
    case 'api':
    case 'sentence-transformers':
      throw new NotImplementedError(manifest.backend);
    default: {
      const unreachable: never = manifest.backend;
      throw new NotImplementedError(unreachable);
    }
  }
}
