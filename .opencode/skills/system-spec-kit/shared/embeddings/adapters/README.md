---
title: "Shared Embedder Adapters"
description: "Canonical provider adapter implementations shared by mk-spec-memory and advisor consumers."
trigger_phrases:
  - "shared embedder adapters"
  - "canonical ollama adapter"
  - "embedding adapter contract"
---

# Shared Embedder Adapters

## 1. OVERVIEW

`shared/embeddings/adapters/` contains canonical embedder adapter implementations that can be consumed by multiple packages.

## 2. OWNERSHIP

The `@spec-kit/shared` package owns these adapters. Server packages may re-export them for compatibility, but the implementation lives here.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `ollama.ts` | Implements the shared Ollama adapter contract. |

## 4. BOUNDARIES

- Keep package-specific runtime wiring out of this folder.
- Do not read MCP server environment defaults directly here.
- Keep adapter contracts aligned with `shared/embeddings/adapter.ts`.

## 5. ENTRYPOINTS

Consumers import through `@spec-kit/shared/embeddings/adapters/ollama.js` or compatibility re-exports in server packages.

## 6. VALIDATION

Run from `shared/`:

```bash
npm run typecheck
npm run build
```
