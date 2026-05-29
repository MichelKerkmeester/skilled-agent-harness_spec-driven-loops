---
title: "MCP Embedders Library"
description: "Runtime embedding orchestration and reindexing helpers for mk-spec-memory."
trigger_phrases:
  - "spec kit embedders"
  - "embedding execution router"
  - "embedding reindex"
---

# MCP Embedders Library

## 1. OVERVIEW

`lib/embedders/` owns mk-spec-memory runtime embedding orchestration. It adapts the shared embedder registry into MCP server behavior, routes every provider (ollama, hf-local, cloud) through a single direct factory-backed adapter, and coordinates reindex workflows.

## 2. OWNERSHIP

This folder belongs to `@spec-kit/mcp-server`. Canonical embedder manifests, provider factories and adapter contracts live in `@spec-kit/shared`; this folder owns server-specific execution, schema and lifecycle glue.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `execution-router.ts` | Resolves each provider to a direct factory-backed embedding adapter (ollama, hf-local HTTP client, cloud). |
| `reindex.ts` | Coordinates profile-aware reindex behavior. |
| `schema.ts` | Defines embedder-facing runtime schema helpers. |
| `registry.ts`, `types.ts`, `adapter.ts` | Compatibility re-exports from `@spec-kit/shared`. |

## 4. BOUNDARIES

- Do not define canonical provider manifests here; add those in `shared/embeddings/`.
- Do not write SQLite schema directly here unless the behavior is embedder lifecycle specific.
- Do not import MCP handlers from this folder; handlers call into this folder.

## 5. ENTRYPOINTS

Production callers enter through `execution-router.ts` and `reindex.ts`. Tests use the `*.testables.ts` files for focused coverage without widening runtime exports.

## 6. VALIDATION

Run from `mcp_server/`:

```bash
npm run typecheck
npx vitest run tests/embedders
```
