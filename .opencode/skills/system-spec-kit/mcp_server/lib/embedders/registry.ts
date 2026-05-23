// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — registry (re-export shim)
// ───────────────────────────────────────────────────────────────
// Canonical MANIFESTS + factory functions live in `@spec-kit/shared`.
// Phase 003/006 of the 016 umbrella.
// ───────────────────────────────────────────────────────────────

export {
  getAdapter,
  getManifest,
  listManifests,
  MANIFESTS,
  NotImplementedError,
} from '@spec-kit/shared/embeddings/registry.js';
