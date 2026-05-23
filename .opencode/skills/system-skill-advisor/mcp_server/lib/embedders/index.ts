// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — barrel
// ───────────────────────────────────────────────────────────────
// Re-exports both shared canonical surface (via local shims) and
// skill-advisor-specific schema helpers.
//
// The active default is the `'auto'` sentinel; `ensureActiveEmbedder()`
// invokes the shared cascade (`@spec-kit/shared/embeddings/auto-select.ts`)
// on first daemon start and persists the winner. Cascade picks at runtime:
// Ollama → hf-local → OpenAI → Voyage (ADR-014 local-first).
// ───────────────────────────────────────────────────────────────

export type { BackendKind, EmbedderManifest } from './types.js';
export type { EmbedderAdapter, EmbedderInputType, EmbedderOptions } from './adapter.js';
export {
  getAdapter,
  getManifest,
  listManifests,
  listSupportedDimensions,
  MANIFESTS,
  NotImplementedError,
} from './registry.js';
export {
  DEFAULT_ACTIVE_EMBEDDER,
  ensureActiveEmbedder,
  ensureVecMetadataTable,
  ensureVecTableForDim,
  getActiveEmbedder,
  hasActiveEmbedderPointer,
  setActiveEmbedder,
  vecTableNameForDim,
} from './schema.js';
export type { ActiveEmbedder, EnsureActiveEmbedderOptions } from './schema.js';
export {
  OllamaAdapter,
  OllamaAdapterError,
  OllamaBackendUnreachableError,
  OllamaDimensionMismatchError,
  OllamaModelNotLoadedError,
} from './adapters/ollama.js';
