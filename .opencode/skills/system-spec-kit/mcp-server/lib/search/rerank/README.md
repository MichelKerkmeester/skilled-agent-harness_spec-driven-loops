---
title: "Search Rerank Helpers"
description: "Retrieval rescue and rerank-adjacent helpers for memory search quality."
trigger_phrases:
  - "retrieval rescue"
  - "search rerank"
  - "memory reranking"
---

# Search Rerank Helpers

## 1. OVERVIEW

`lib/search/rerank/` contains helpers that improve retrieval quality after the primary candidate set is built.

## 2. OWNERSHIP

The memory search stack owns this folder. Generic ranking algorithms belong in `@spec-kit/shared/algorithms`; this folder owns mk-spec-memory-specific rescue behavior.

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `retrieval-rescue.ts` | Applies rescue behavior for weak or missing high-authority retrieval candidates. |

## 4. BOUNDARIES

- Do not call MCP handlers from this folder.
- Keep cross-package ranking math in `shared/algorithms/`.
- Keep telemetry schemas in `lib/telemetry/`.

## 5. ENTRYPOINTS

Search pipeline modules import `retrieval-rescue.ts` directly when composing ranked results.

## 6. VALIDATION

Run from `mcp-server/`:

```bash
npx vitest run tests/retrieval-rescue.vitest.ts tests/search
npm run typecheck
```
