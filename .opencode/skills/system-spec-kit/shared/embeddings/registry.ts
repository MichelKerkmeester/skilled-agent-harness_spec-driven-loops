// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — registry (shared contract surface)
// ───────────────────────────────────────────────────────────────
// Canonical MANIFESTS + factory functions shared by mk-spec-memory and
// skill-advisor. Both skills' local `mcp_server/lib/embedders/registry.ts`
// re-export from here.
//
// Promoted from mk-spec-memory's mcp_server/lib/embedders/registry.ts in
// phase 003/006. 7 text-tuned embedder manifests are intentionally kept
// separate from future code-tuned consumers.
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

// ───────────────────────────────────────────────────────────────
// Canonical per-provider fallback (ADR-013/014)
// ───────────────────────────────────────────────────────────────
// Single source of truth for "what model do we use when no env var is set,
// no `vec_metadata.active_embedder_name` row exists, and the cascade probe
// has not run yet". Replaces scattered `DEFAULT_MODEL` constants across
// embeddings.ts, hf-local.ts, ollama.ts, sidecar-worker.ts, factory.ts.
//
// Local providers (ollama, hf-local) derive their canonical name from
// MANIFESTS[0] so adding a new winner to the registry automatically updates
// every fallback site. Cloud providers (voyage, openai) hold a single
// canonical string each — they are out of the local-first cascade.

export type CanonicalProvider = 'voyage' | 'openai' | 'hf-local' | 'ollama';

class EmbedderNotConfiguredError extends Error {
  constructor(detail: string) {
    super(`Embedder not configured: ${detail}`);
    this.name = 'EmbedderNotConfiguredError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export { EmbedderNotConfiguredError };

const CLOUD_CANONICAL: Readonly<Record<'voyage' | 'openai', string>> = Object.freeze({
  voyage: 'voyage-code-3',
  openai: 'text-embedding-3-small',
});

/**
 * Return the canonical fallback model name for a provider.
 *
 * - For `ollama` and `hf-local`, the name is derived from `MANIFESTS[0]` so
 *   the registry's declaration order is the single source of truth (per
 *   ADR-013/014 ordering). For hf-local the name is prefixed with the
 *   HuggingFace org (`nomic-ai/...`) because hf-local resolves models from
 *   the HF Hub, not the Ollama tag namespace.
 * - For `voyage` and `openai`, a single canonical string per provider lives
 *   in `CLOUD_CANONICAL` above — cloud providers do not have a registry
 *   array because the spec-memory bake-off (016/004) is local-first.
 *
 * Throws `EmbedderNotConfiguredError` if MANIFESTS is empty (programmer
 * error — should never happen in production).
 *
 * Callers SHOULD log a warning when this fallback fires so future drift
 * is visible. See `sidecar-worker.ts:getModelName()` for the existing
 * warning pattern.
 */
export function getCanonicalFallback(provider: CanonicalProvider): string {
  if (provider === 'voyage' || provider === 'openai') {
    return CLOUD_CANONICAL[provider];
  }

  const first = MANIFESTS[0];
  if (!first) {
    throw new EmbedderNotConfiguredError(
      'MANIFESTS array is empty; cannot derive canonical fallback for local provider. Add at least one entry to shared/embeddings/registry.ts.',
    );
  }

  if (provider === 'ollama') {
    // Ollama tag form (e.g. 'nomic-embed-text:v1.5') — but expose the
    // registry's canonical name (e.g. 'nomic-embed-text-v1.5'). The
    // factory.resolveConfiguredModel + auto-select cascade handle the
    // tag→name translation via the manifest's ollamaName field.
    return first.name;
  }

  // hf-local: HuggingFace path form. The registry stores Ollama-style
  // names; for hf-local we need the HF org/name. nomic-embed-text-v1.5
  // is `nomic-ai/nomic-embed-text-v1.5` on HuggingFace.
  return `nomic-ai/${first.name}`;
}

// ───────────────────────────────────────────────────────────────
// Canonical reranker model names (ADR-022 audit P1)
// ───────────────────────────────────────────────────────────────
// Single source of truth for reranker model defaults used by
// cross-encoder.ts PROVIDER_CONFIG entries. P1 audit closure
// eliminates the hardcoded "cross-encoder/ms-marco-MiniLM-L-6-v2"
// string duplicated from PROVIDER_CONFIG.local.model.
//
// Reranking is REMOVED as of the 014 deprecation: the mk-spec-memory local
// cross-encoder path was removed in 003 and the local rerank sidecar skill was
// deleted in 004 (cloud rerankers voyage/cohere were already removed in 022/013).
// These canonical names are now dead config defaults with no live importers —
// retained only as a reference should a reranker ever be re-introduced.

export type RerankerProvider = 'local';

const RERANKER_CANONICAL: Readonly<Record<RerankerProvider, string>> = Object.freeze({
  local: 'cross-encoder/ms-marco-MiniLM-L-6-v2',
});

export function getRerankerFallback(provider: RerankerProvider): string {
  return RERANKER_CANONICAL[provider];
}
