// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — barrel
// ───────────────────────────────────────────────────────────────
// Packet 016/001: re-exports for external consumers.
// Phase 016/002 will add: ollama adapter, schema helpers, getAdapter().
// Phase 016/003 will add: MCP tool handlers + reindex orchestrator.
// ───────────────────────────────────────────────────────────────

export type { BackendKind, EmbedderManifest } from './types.js';
export type { EmbedderAdapter } from './adapter.js';
export { getManifest, listManifests, listSupportedDimensions } from './registry.js';
