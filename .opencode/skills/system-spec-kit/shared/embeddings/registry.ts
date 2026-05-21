// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — registry (shared contract surface)
// ───────────────────────────────────────────────────────────────
// Canonical MANIFESTS + factory functions shared by mk-spec-memory and
// skill-advisor. Both skills' local `mcp_server/lib/embedders/registry.ts`
// re-export from here.
//
// Promoted from mk-spec-memory's mcp_server/lib/embedders/registry.ts in
// phase 003/006. 7 text-tuned embedder manifests. CocoIndex's code-tuned
// embedders live in Python at `cocoindex_code/embedders/registered_embedders.py`
// and are intentionally separate — the content-type split is preserved.
// ───────────────────────────────────────────────────────────────

import type { EmbedderAdapter } from './adapter.js';
import { OllamaAdapter } from './adapters/ollama.js';
import type { BackendKind, EmbedderManifest } from './types.js';

/**
 * Frozen list of supported embedder manifests. Add a new model = append a
 * row here + ensure the manifest's `backend` adapter exists.
 *
 * Order keeps the ADR-012 local fallback candidates grouped by provider.
 */
const MANIFESTS: ReadonlyArray<EmbedderManifest> = Object.freeze([
  {
    name: 'nomic-embed-text-v1.5',
    dim: 768,
    backend: 'ollama',
    ollamaName: 'nomic-embed-text:v1.5',
    prefixQuery: 'search_query: ',
    prefixDocument: 'search_document: ',
    maxInputChars: 5000,
    notes: 'Drop-in 768-dim swap candidate. Retrieval-specialist trained on 235M pairs with hard negatives. Requires prefix tokens. Local-first cascade default per ADR-014.',
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
  {
    name: 'bge-m3',
    dim: 1024,
    backend: 'ollama',
    ollamaName: 'bge-m3:latest',
    maxInputChars: 8000,
    notes: 'BAAI multilingual hybrid (dense+sparse+colbert), 8192 context, top MTEB multilingual.',
  },
  {
    name: 'snowflake-arctic-embed-l-v2.0',
    dim: 1024,
    backend: 'ollama',
    ollamaName: 'snowflake-arctic-embed2:latest',
    maxInputChars: 8000,
    notes: 'Snowflake late-2024 flagship. 8192 context, multilingual, top MTEB retrieval scores at release.',
  },
]);

export class NotImplementedError extends Error {
  constructor(backend: BackendKind) {
    super(`Embedder backend is not implemented yet: ${backend}`);
    this.name = 'NotImplementedError';
    Object.setPrototypeOf(this, new.target.prototype);
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
 * List all registered manifests in declaration order.
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
    case 'api':
    case 'sentence-transformers':
      throw new NotImplementedError(manifest.backend);
    default: {
      const unreachable: never = manifest.backend;
      throw new NotImplementedError(unreachable);
    }
  }
}

/**
 * Re-export the canonical MANIFESTS reference for callers that need direct
 * access to the frozen array (e.g. INSTALL_GUIDE truth-checks).
 */
export { MANIFESTS };
