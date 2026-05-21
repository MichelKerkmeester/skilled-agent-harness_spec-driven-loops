// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — registry (re-export shim)
// ───────────────────────────────────────────────────────────────
// Canonical MANIFESTS + factory functions live in `@spec-kit/shared`.
// Phase 003/006 of the 016 umbrella aligned skill-advisor to
// mk-spec-memory's canonical registry. The previous skill-advisor-specific
// constants (`DEFAULT_EMBEDDER_NAME`, `BASELINE_EMBEDDER_NAME`) were
// removed because phase 003/006 also flips `DEFAULT_ACTIVE_EMBEDDER` to
// the `'auto'` sentinel — the cascade picks at runtime instead of a
// hardcoded constant. The previous skill-advisor entries `embeddinggemma-300m`
// and `jina-embeddings-v2-base-code` are gone (phase 007 purge parity).
// ───────────────────────────────────────────────────────────────

export * from '@spec-kit/shared/embeddings/registry.js';
