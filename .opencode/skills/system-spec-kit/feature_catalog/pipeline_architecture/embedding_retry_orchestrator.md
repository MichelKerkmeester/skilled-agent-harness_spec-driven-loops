---
title: "Embedding retry orchestrator"
description: "The embedding retry orchestrator runs background batch retries for memories with failed embedding generation, using cache dedup and progressive backoff."
trigger_phrases:
  - "embedding retry orchestrator"
  - "background embedding retries"
  - "failed embedding generation"
  - "progressive backoff embeddings"
  - "batch retry with cache dedup"
version: 3.6.0.13
---

# Embedding retry orchestrator

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The embedding retry orchestrator runs background batch retries for memories with failed embedding generation, using cache dedup and progressive backoff.

Creating a numerical fingerprint (embedding) for each spec-doc record requires calling an external service that can sometimes be unavailable. When that service fails, the record is saved without an embedding and queued for a retry. A background worker periodically picks up these queued items and tries again. This way, a temporary service outage does not permanently prevent your indexed continuity from being fully searchable.

---

## 2. HOW IT WORKS

The retry manager (`lib/providers/retry-manager.ts`) orchestrates background retry of failed embedding operations. When the primary embedding provider is unavailable or returns errors during `memory_save` or `memory_index_scan`, the affected memories are marked with `embedding_status = 'pending'` and stored without vectors (lexical-only fallback). The retry manager runs as a background job with configurable interval and batch size, picking up pending memories and re-attempting embedding generation.

Each retry attempt uses the embedding cache to avoid redundant API calls for content that was previously embedded successfully. The retry stats (`pending`, `retry`, `failed` counts) are exposed for monitoring. Failed memories increment a `retry_count` for progressive backoff. On success, the retry manager itself updates `memory_index`, clears any prior `vec_memories` row for the spec-doc record, and inserts the refreshed embedding buffer as part of its transaction.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/providers/retry-manager.ts` | Lib | Background retry job with batch processing |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding cache for retry dedup |
| `mcp_server/lib/search/vector-index.ts` | Lib | Memory row lookup and DB access used by retry orchestration |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/retry-manager.vitest.ts` | Automated test | Retry manager tests |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `pipeline_architecture/embedding_retry_orchestrator.md`
Related references:
- [atomic-write-then-index-api.md](atomic_write_then_index_api.md) — Atomic write-then-index API
- [7-layer-tool-architecture-metadata.md](7_layer_tool_architecture_metadata.md) — 7-layer tool architecture metadata
