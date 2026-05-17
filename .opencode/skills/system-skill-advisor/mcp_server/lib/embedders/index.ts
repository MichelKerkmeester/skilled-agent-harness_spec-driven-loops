// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — barrel
// ───────────────────────────────────────────────────────────────

export type { BackendKind, EmbedderManifest } from './types.js';
export type { EmbedderAdapter, EmbedderInputType, EmbedderOptions } from './adapter.js';
export {
  BASELINE_EMBEDDER_NAME,
  DEFAULT_EMBEDDER_NAME,
  getAdapter,
  getManifest,
  listManifests,
  listSupportedDimensions,
  MANIFESTS,
  NotImplementedError,
} from './registry.js';
export {
  DEFAULT_ACTIVE_EMBEDDER,
  ensureVecMetadataTable,
  ensureVecTableForDim,
  getActiveEmbedder,
  hasActiveEmbedderPointer,
  setActiveEmbedder,
  vecTableNameForDim,
} from './schema.js';
export type { ActiveEmbedder } from './schema.js';
export {
  OllamaAdapter,
  OllamaAdapterError,
  OllamaBackendUnreachableError,
  OllamaDimensionMismatchError,
  OllamaModelNotLoadedError,
} from './adapters/ollama.js';
export { LlamaCppBaselineAdapter } from './adapters/llama-cpp-baseline.js';
