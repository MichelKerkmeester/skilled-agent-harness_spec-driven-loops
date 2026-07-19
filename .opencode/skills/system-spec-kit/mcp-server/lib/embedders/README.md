---
title: "MCP Embedders Library"
description: "Runtime embedding orchestration, reindexing and reconciliation helpers for mk-spec-memory."
trigger_phrases:
  - "spec kit embedders"
  - "embedding execution router"
  - "embedding reindex"
---

# MCP Embedders Library

## 1. OVERVIEW

`lib/embedders/` owns mk-spec-memory runtime embedding orchestration. It adapts the shared embedder registry into MCP server behavior, routes every provider (ollama, hf-local, cloud) through a single direct factory-backed adapter, coordinates reindex workflows, and reconciles stored embeddings against the active embedder. `index.ts` is the public barrel that MCP handlers and tests import.

Current state:

- `execution-router.ts` resolves each provider to a direct factory-backed adapter and caches adapters per embedding dimension, so a dimension change yields a fresh adapter instead of reusing a stale one.
- `reindex.ts` runs profile-aware reindex jobs through a staging shard that is atomically swapped into place on success, and re-reads the cancel flag during long runs so a cancel request takes effect mid-job.
- Canonical embedder manifests, provider factories and adapter contracts live in `@spec-kit/shared`; this folder owns server-specific execution, schema, reconciliation and lifecycle glue.

---

## 2. OWNERSHIP

This folder belongs to `@spec-kit/mcp-server`. Canonical embedder manifests, provider factories and adapter contracts live in `@spec-kit/shared`; this folder owns server-specific execution, schema, reconciliation and lifecycle glue.

---

## 3. DIRECTORY TREE

```text
embedders/
+-- index.ts                       # Public barrel: registry, schema, reindex exports
+-- execution-router.ts            # Provider to adapter resolution, dimension-aware cache
+-- reindex.ts                     # Profile-aware reindex jobs, staging-shard atomic swap
+-- embedding-reconcile.ts         # Reconcile stored embeddings against active embedder
+-- schema.ts                      # Active-embedder + per-dimension vec table helpers
+-- registry.ts                    # Re-export of shared embedder registry
+-- adapter.ts                     # Re-export of shared EmbedderAdapter contract
+-- types.ts                       # Re-export of shared BackendKind and contracts
+-- execution-router.testables.ts  # Test-only surface for execution-router internals
+-- reindex.testables.ts           # Test-only surface for reindex internals
+-- adapters/                      # Provider-specific adapter implementations
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Public barrel re-exporting `getAdapter`, `getManifest`, `listManifests`, the schema helpers, and the reindex job API. |
| `execution-router.ts` | Resolves each provider to a direct factory-backed embedding adapter (ollama, hf-local HTTP client, cloud) with a dimension-aware adapter cache. |
| `reindex.ts` | Coordinates profile-aware reindex jobs with a staging-shard atomic swap and mid-job cancel re-read. |
| `embedding-reconcile.ts` | Reconciles stored embedding rows against the active embedder profile. |
| `schema.ts` | Defines active-embedder selection and per-dimension vector table helpers. |
| `registry.ts`, `types.ts`, `adapter.ts` | Compatibility re-exports from `@spec-kit/shared`. |
| `execution-router.testables.ts`, `reindex.testables.ts` | Test-only surfaces that expose internals without widening runtime exports. |
| `adapters/` | Provider-specific adapter implementations behind the execution router. |

---

## 5. BOUNDARIES

- Do not define canonical provider manifests here; add those in `shared/embeddings/`.
- Do not write SQLite schema directly here unless the behavior is embedder lifecycle specific.
- Do not import MCP handlers from this folder; handlers call into this folder.

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `getAdapter` | Function | Resolve the active embedder adapter for a provider. |
| `startReindex` | Function | Begin a profile-aware reindex job. |
| `cancelJob` | Function | Request mid-job cancellation of a running reindex. |
| `getJobStatus` / `getActiveJob` / `estimateEta` | Function | Inspect reindex progress and timing. |
| `ensureActiveEmbedder` / `setActiveEmbedder` / `getActiveEmbedder` | Function | Select and read the active embedder profile. |
| `ensureVecTableForDim` | Function | Ensure a per-dimension vector table exists. |
| `index.ts` | Module | First file to open for the public surface. |

---

## 7. VALIDATION

Run from `mcp-server/`:

```bash
npm run typecheck
npx vitest run tests/embedders
```

Expected result: typecheck passes and the embedders test suite is green.

---

## 8. RELATED

- [`mcp-server/lib/`](../README.md)
- [`@spec-kit/shared embeddings`](../../../shared/embeddings/)
