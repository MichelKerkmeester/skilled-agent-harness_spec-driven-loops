---
title: "MCP Embedders Library"
description: "Runtime embedding orchestration, reindexing and sidecar execution helpers for mk-spec-memory."
trigger_phrases:
  - "spec kit embedders"
  - "embedding execution router"
  - "embedding reindex"
---

# MCP Embedders Library

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP](#2--ownership)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)

## 1. OVERVIEW

`lib/embedders/` owns mk-spec-memory runtime embedding orchestration. It adapts the shared embedder registry into MCP server behavior, routes local versus sidecar execution, and coordinates reindex workflows.

## 2. OWNERSHIP

This folder belongs to `@spec-kit/mcp-server`. Canonical embedder manifests, provider factories and adapter contracts live in `@spec-kit/shared`; this folder owns server-specific execution, schema and lifecycle glue.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `execution-router.ts` | Chooses in-process or sidecar-backed embedding execution. |
| `reindex.ts` | Coordinates profile-aware reindex behavior. |
| `schema.ts` | Defines embedder-facing runtime schema helpers. |
| `sidecar-client.ts` | Talks to the sidecar worker process. |
| `sidecar-worker.ts` | Runs embedding work outside the MCP request path. |
| `registry.ts`, `types.ts`, `adapter.ts` | Compatibility re-exports from `@spec-kit/shared`. |

## 4. BOUNDARIES

- Do not define canonical provider manifests here; add those in `shared/embeddings/`.
- Do not write SQLite schema directly here unless the behavior is embedder lifecycle specific.
- Do not import MCP handlers from this folder; handlers call into this folder.

## 5. ENTRYPOINTS

Production callers enter through `execution-router.ts`, `reindex.ts` and `sidecar-client.ts`. Tests use the `*.testables.ts` files for focused coverage without widening runtime exports.

## 6. VALIDATION

Run from `mcp_server/`:

```bash
npm run typecheck
npx vitest run tests/embedders
```
