// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — adapter (re-export shim)
// ───────────────────────────────────────────────────────────────
// Canonical EmbedderAdapter contract lives in `@spec-kit/shared`. This file
// is a thin re-export shim so existing relative-path imports continue to
// resolve. Phase 003/006 of the 016 umbrella moved the contract surface to
// `.opencode/skills/system-spec-kit/shared/embeddings/`.
// ───────────────────────────────────────────────────────────────

export * from '@spec-kit/shared/embeddings/adapter.js';
