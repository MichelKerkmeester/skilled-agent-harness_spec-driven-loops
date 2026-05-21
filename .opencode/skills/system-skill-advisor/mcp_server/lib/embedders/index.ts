// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — barrel
// ───────────────────────────────────────────────────────────────
// Re-exports both shared canonical surface (via local shims) and
// skill-advisor-specific schema helpers.
//
// Phase 003/006 of the 016 umbrella removed the LlamaCppBaselineAdapter
// export and the `DEFAULT_EMBEDDER_NAME` / `BASELINE_EMBEDDER_NAME`
// constants. The active default is now the `'auto'` sentinel; the new
// `ensureActiveEmbedder()` helper invokes the shared cascade
// (`@spec-kit/shared/embeddings/auto-select.ts`) on first daemon start
// and persists the winner. Cascade picks at runtime: Ollama → hf-local
// → OpenAI → Voyage (ADR-014 local-first).
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
