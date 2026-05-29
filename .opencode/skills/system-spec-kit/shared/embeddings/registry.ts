// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — registry (shared contract surface)
// ───────────────────────────────────────────────────────────────
// Canonical MANIFESTS + factory functions shared by mk-spec-memory and
// skill-advisor. Both skills' local `mcp_server/lib/embedders/registry.ts`
// re-export from here.
//
// Promoted from mk-spec-memory's mcp_server/lib/embedders/registry.ts.
// Text-tuned embedder manifests are intentionally kept
// separate from future code-tuned consumers.
// ───────────────────────────────────────────────────────────────

import type { EmbedderAdapter } from './adapter.js';
import { OllamaAdapter } from './adapters/ollama.js';
import type { BackendKind, EmbedderManifest } from './types.js';

/**
 * Frozen list of supported embedder manifests.
 *
 * Keep nomic first: local canonical fallbacks derive from MANIFESTS[0].
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
 * Uses this to know which `vec_<dim>` tables may need
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
// Canonical per-provider fallback
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
 *   the registry's declaration order is the single source of truth. For
 *   hf-local the name is prefixed with the
 *   HuggingFace org (`nomic-ai/...`) because hf-local resolves models from
 *   the HF Hub, not the Ollama tag namespace.
 * - For `voyage` and `openai`, a single canonical string per provider lives
 *   in `CLOUD_CANONICAL` above — cloud providers do not have a registry
 *   array because the spec-memory bake-off is local-first.
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

// Reranking is fully removed (local cross-encoder + cloud voyage/cohere paths deleted).
// The former RERANKER_CANONICAL / getRerankerFallback dead config was removed;
// re-introduce a reranker registry here if reranking ever returns.
