// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — registry (re-export shim)
// ───────────────────────────────────────────────────────────────
// Canonical MANIFESTS + factory functions live in `@spec-kit/shared`.
// Shared embedder registry helpers live in `@spec-kit/shared`.
// ───────────────────────────────────────────────────────────────

export {
  getAdapter,
  getManifest,
  listManifests,
  MANIFESTS,
  NotImplementedError,
} from '@spec-kit/shared/embeddings/registry.js';
