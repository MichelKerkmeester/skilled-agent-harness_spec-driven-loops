// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — registry
// ───────────────────────────────────────────────────────────────

import type { EmbedderAdapter } from './adapter.js';
import { LlamaCppBaselineAdapter } from './adapters/llama-cpp-baseline.js';
import { OllamaAdapter } from './adapters/ollama.js';
import type { BackendKind, EmbedderManifest } from './types.js';

export const DEFAULT_EMBEDDER_NAME = 'jina-embeddings-v3';
export const BASELINE_EMBEDDER_NAME = 'embeddinggemma-300m';

export const MANIFESTS: ReadonlyArray<EmbedderManifest> = Object.freeze([
  {
    name: BASELINE_EMBEDDER_NAME,
    dim: 768,
    backend: 'llama-cpp',
    modelPath: 'unsloth-embeddinggemma-300m-GGUF/embeddinggemma-300m-Q8_0.gguf',
    notes: 'Legacy skill-advisor semantic-shadow baseline via shared embedding provider cascade.',
  },
  {
    name: DEFAULT_EMBEDDER_NAME,
    dim: 1024,
    backend: 'ollama',
    ollamaName: 'hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M',
    maxInputChars: 8000,
    notes: 'Default for skill-advisor parity; 016/004 ADR-012 production winner.',
  },
  {
    name: 'nomic-embed-text-v1.5',
    dim: 768,
    backend: 'ollama',
    ollamaName: 'nomic-embed-text:v1.5',
    prefixQuery: 'search_query: ',
    prefixDocument: 'search_document: ',
    maxInputChars: 5000,
    notes: '768-dim retrieval specialist. Requires query/document prefix tokens.',
  },
  {
    name: 'jina-embeddings-v2-base-code',
    dim: 768,
    backend: 'ollama',
    ollamaName: 'jina/jina-embeddings-v2-base-code:latest',
    maxInputChars: 8000,
    notes: 'Code-oriented Jina alternative for tool and script-heavy skill metadata.',
  },
  {
    name: 'mxbai-embed-large-v1',
    dim: 1024,
    backend: 'ollama',
    ollamaName: 'mxbai-embed-large:latest',
    maxInputChars: 1200,
    notes: 'Paraphrase-strong 1024-dim candidate from the 016 comparison stack.',
  },
  {
    name: 'bge-m3',
    dim: 1024,
    backend: 'ollama',
    ollamaName: 'bge-m3:latest',
    maxInputChars: 8000,
    notes: 'Multilingual dense retrieval candidate.',
  },
]);

export class NotImplementedError extends Error {
  constructor(backend: BackendKind) {
    super(`Embedder backend is not implemented yet: ${backend}`);
    this.name = 'NotImplementedError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function getManifest(name: string): EmbedderManifest | undefined {
  return MANIFESTS.find((manifest) => manifest.name === name);
}

export function listManifests(): ReadonlyArray<EmbedderManifest> {
  return MANIFESTS;
}

export function listSupportedDimensions(): ReadonlyArray<number> {
  return Array.from(new Set(MANIFESTS.map((manifest) => manifest.dim))).sort((left, right) => left - right);
}

export function getAdapter(name: string): EmbedderAdapter | undefined {
  const manifest = getManifest(name);
  if (!manifest) {
    return undefined;
  }

  switch (manifest.backend) {
    case 'ollama':
      return new OllamaAdapter(manifest);
    case 'llama-cpp':
      if (manifest.name !== BASELINE_EMBEDDER_NAME) {
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
