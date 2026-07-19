// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — registry (re-export shim)
// ───────────────────────────────────────────────────────────────
// Canonical MANIFESTS + factory functions live in `@spec-kit/shared`.
// Skill-advisor was aligned to
// mk-spec-memory's canonical registry. The previous skill-advisor-specific
// constants (`DEFAULT_EMBEDDER_NAME`, `BASELINE_EMBEDDER_NAME`) were
// removed because the alignment also flips `DEFAULT_ACTIVE_EMBEDDER` to
// the `'auto'` sentinel — the cascade picks at runtime instead of a
// hardcoded constant. The previous skill-advisor entries `embeddinggemma-300m`
// and `jina-embeddings-v2-base-code` are gone (purged for shared-registry parity).
// ───────────────────────────────────────────────────────────────

export * from '@spec-kit/shared/embeddings/registry.js';
