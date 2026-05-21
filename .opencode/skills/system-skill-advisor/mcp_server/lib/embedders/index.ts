// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — barrel
// ───────────────────────────────────────────────────────────────
// Re-exports both shared canonical surface (via local shims) and
// skill-advisor-specific schema helpers.
//
// Phase 003/006 of the 016 umbrella removed the LlamaCppBaselineAdapter
// export and the `DEFAULT_EMBEDDER_NAME` / `BASELINE_EMBEDDER_NAME`
// constants (the active default is now the `'auto'` sentinel; cascade
// picks at runtime).
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
