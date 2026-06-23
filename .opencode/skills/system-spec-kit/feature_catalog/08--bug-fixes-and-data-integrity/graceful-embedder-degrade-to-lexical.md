---
title: "Graceful embedder-degrade to lexical"
description: "Tracks the change that degrades search to lexical candidate generation and reports embedder_available:false when the embedding model is unavailable, instead of throwing and returning empty."
trigger_phrases:
  - "graceful embedder degrade"
  - "embedder unavailable lexical fallback"
  - "embedder_available false"
  - "vector search skipped"
  - "search degrade to bm25"
version: 3.6.0.1
---

# Graceful embedder-degrade to lexical

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Tracks the change that degrades search to lexical candidate generation and reports `embedder_available:false` when the embedding model is unavailable, instead of throwing and returning empty.

When the embedding model is unavailable, search used to fail internally and return nothing. Now it falls back to plain keyword search and tells you the embedder was skipped, so you still get the lexical matches instead of an empty result.

---

## 2. HOW IT WORKS

When Stage 1 candidate generation gets a null or empty embedding back from the provider, it no longer throws and collapses to empty candidates. It detects the unavailable embedder, runs lexical (BM25/FTS) candidate generation with `useVector=false`, and the search handler reports `embedder_available:false` and `vector_search_skipped:true` on the response so callers can see the degraded mode. The embedder-success path is byte-identical.

As a documented benign scope addition in the same seam, pre-existing input errors (more than 5 concepts, an empty query or concept, an unknown search type) now surface as a typed `Stage1InputError` that propagates to the caller, plus a defensive handler-level concept guard, instead of being swallowed to an empty result. This matches the orchestrator's existing contract that a Stage 1 failure is mandatory.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Embedder-unavailable detection, lexical fallback, and typed `Stage1InputError` propagation |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Degraded-mode metadata fields |
| `mcp_server/handlers/memory-search.ts` | Handler | Reports `embedder_available:false` / `vector_search_skipped:true` and the handler concept guard |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/stage1-embedder-degrade.vitest.ts` | Automated test | Lexical-degrade behavior and typed input-error cases |
| `mcp_server/tests/gate-d-regression-embedding-semantic-search.vitest.ts` | Automated test | Envelope assertion guarding semantic-search regression |

---

## 4. SOURCE METADATA
- Group: Bug Fixes And Data Integrity
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--bug-fixes-and-data-integrity/graceful-embedder-degrade-to-lexical.md`
Related references:
- [graph-channel-id-fix.md](graph-channel-id-fix.md) — Graph channel ID fix
