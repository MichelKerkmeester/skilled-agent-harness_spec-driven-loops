---
title: "Async ingestion job lifecycle"
description: "Covers the SQLite-persisted async job queue for batch ingestion with start, status and cancel tools."
trigger_phrases:
  - "async ingestion job lifecycle"
  - "memory_ingest_start"
  - "batch ingest with job queue"
  - "SQLite-persisted ingestion queue"
  - "ingest ETA forecast"
version: 3.6.0.18
---

# Async ingestion job lifecycle

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Covers the SQLite-persisted async job queue for batch ingestion with start, status and cancel tools.

When you need to import a large batch of files, this feature queues them up and processes them one at a time in the background. You can start the import, check its progress and cancel it if needed. It works like a print queue: you submit the jobs and the system works through them at its own pace while you continue doing other things.

---

## 2. HOW IT WORKS

### Core Behavior

**IMPLEMENTED (Sprint 019).** Ingestion moves to a SQLite-persisted job queue (`lib/ops/job-queue.ts`) with lifecycle states `queued → parsing → embedding → indexing → complete/failed/cancelled`, a single sequential worker (one job processing at a time, rest queued), and three new tools: `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`. Coexists with the existing `asyncEmbedding` path in `memory_save` as an alternative for batch operations.

### Post-Action Behavior

`memory_ingest_status` now also returns an advisory `forecast` object with `etaSeconds`, `etaConfidence`, `failureRisk`, `riskSignals`, and `caveat`. Terminal jobs return deterministic terminal forecasts, sparse queues degrade to null or low-confidence values instead of throwing, and forecast derivation failures fall back to a safe `"Forecast unavailable: ..."` response rather than failing the handler.

When extended telemetry is enabled, ingest-status responses also record lifecycle forecast diagnostics so ETA/risk behavior can be inspected without turning the forecast itself into a blocking dependency.

### Edge Cases & Caveats

`memory_ingest_start` now canonicalizes and deduplicates requested paths before queueing. Duplicate inputs no longer create redundant work items: the handler reports `duplicatePathCount`, emits a hint that duplicates were removed before queueing, and starts the job with only the unique normalized file paths that passed validation.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp_server/handlers/memory-ingest.ts` | Handler | Ingestion handler |
| `mcp_server/handlers/types.ts` | Handler | Type definitions |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/ops/job-queue.ts` | Lib | Async job queue |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/vector-index-aliases.ts` | Lib | Vector index aliases |
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations |
| `mcp_server/lib/search/vector-index-queries.ts` | Lib | Vector index query methods |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Vector index schema |
| `mcp_server/lib/search/vector-index-store.ts` | Lib | Vector index storage |
| `mcp_server/lib/search/vector-index-types.ts` | Lib | Vector index type definitions |
| `mcp_server/lib/search/vector-index.ts` | Lib | Vector index facade |
| `mcp_server/lib/telemetry/retrieval-telemetry.ts` | Lib | Ingest forecast telemetry diagnostics |
| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
| `mcp_server/lib/utils/format-helpers.ts` | Lib | Format utility helpers |
| `mcp_server/lib/utils/logger.ts` | Lib | Logger utility |
| `mcp_server/lib/utils/path-security.ts` | Lib | Path security validation |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input schemas |
| `mcp_server/tool-schemas.ts` | Core | Tool schema definitions |
| `mcp_server/utils/batch-processor.ts` | Util | Batch processing utility |
| `mcp_server/utils/db-helpers.ts` | Util | Database helpers |
| `mcp_server/utils/index.ts` | Util | Module barrel export |
| `mcp_server/utils/json-helpers.ts` | Util | JSON utility helpers |
| `mcp_server/utils/tool-input-schema.ts` | Util | Tool Input Schema |
| `mcp_server/utils/validators.ts` | Util | Input validators |
| `shared/chunking.ts` | Shared | Content chunking |
| `shared/config.ts` | Shared | Shared configuration |
| `shared/embeddings.ts` | Shared | Embedding utilities |
| `shared/embeddings/factory.ts` | Shared | Embedding provider factory |
| `shared/embeddings/profile.ts` | Shared | Embedding profile configuration |
| `shared/embeddings/providers/hf-local.ts` | Shared | HuggingFace local provider |
| `shared/embeddings/providers/openai.ts` | Shared | OpenAI embedding provider |
| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |
| `shared/utils/path-security.ts` | Shared | Shared path security |
| `shared/utils/retry.ts` | Shared | Shared retry utility |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/batch-processor.vitest.ts` | Automated test | Batch processor tests |
| `mcp_server/tests/bm25-index.vitest.ts` | Automated test | BM25 index operations |
| `mcp_server/tests/cognitive-gaps.vitest.ts` | Automated test | Cognitive gap analysis |
| `mcp_server/tests/config-cognitive.vitest.ts` | Automated test | Cognitive config tests |
| `mcp_server/tests/consumption-logger.vitest.ts` | Automated test | Consumption logger tests |
| `mcp_server/tests/content-normalizer.vitest.ts` | Automated test | Content normalization tests |
| `mcp_server/tests/db-state-graph-reinit.vitest.ts` | Automated test | DB state graph reinit |
| `mcp_server/tests/embedding-cache.vitest.ts` | Automated test | Embedding cache tests |
| `mcp_server/tests/embeddings.vitest.ts` | Automated test | Embedding provider tests |
| `mcp_server/tests/envelope.vitest.ts` | Automated test | Response envelope tests |
| `mcp_server/tests/eval-logger.vitest.ts` | Automated test | Eval logger tests |
| `mcp_server/tests/full-spec-doc-indexing.vitest.ts` | Automated test | Full spec doc indexing |
| `mcp_server/tests/handler-memory-index-cooldown.vitest.ts` | Automated test | Index cooldown validation |
| `mcp_server/tests/handler-memory-index.vitest.ts` | Automated test | Index handler validation |
| `mcp_server/tests/handler-memory-ingest.vitest.ts` | Automated test | Ingest handler validation |
| `mcp_server/tests/handler-memory-ingest-edge.vitest.ts` | Automated test | Ingest boundary/error edge coverage |
| `mcp_server/tests/incremental-index-v2.vitest.ts` | Automated test | Incremental index behavioral tests |
| `mcp_server/tests/incremental-index.vitest.ts` | Automated test | Focused incremental-index coverage (supplemental to `incremental-index-v2.vitest.ts`; concrete fast-path assertions) |
| `mcp_server/tests/interference.vitest.ts` | Automated test | Interference scoring tests |
| `mcp_server/tests/job-queue.vitest.ts` | Automated test | Job queue tests |
| `mcp_server/tests/job-queue-state-edge.vitest.ts` | Automated test | Job queue state-transition edge coverage |
| `mcp_server/tests/mcp-response-envelope.vitest.ts` | Automated test | MCP envelope tests |
| `mcp_server/tests/memory-types.vitest.ts` | Automated test | Memory type tests |
| `mcp_server/tests/recovery-hints.vitest.ts` | Automated test | Recovery hint tests |
| `mcp_server/tests/regression-010-index-large-files.vitest.ts` | Automated test | Large file indexing regression |
| `mcp_server/tests/retry-manager.vitest.ts` | Automated test | Retry manager tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Automated test | Score normalization tests |
| `mcp_server/tests/scoring.vitest.ts` | Automated test | General scoring tests |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Automated test | Tool input schema tests |
| `mcp_server/tests/trigger-config-extended.vitest.ts` | Automated test | Trigger config extended |
| `mcp_server/tests/trigger-setAttentionScore.vitest.ts` | Automated test | Trigger attention scoring |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Automated test | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Automated test | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Automated test | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Automated test | Normalization unit tests |
| `mcp_server/tests/unit-path-security.vitest.ts` | Automated test | Path security unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Automated test | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Automated test | Transaction metric types |
| `mcp_server/tests/vector-index-impl.vitest.ts` | Automated test | Vector index implementation |

---

## 4. SOURCE METADATA
- Group: Lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `lifecycle/async_ingestion_job_lifecycle.md`
Related references:
- [checkpoint-deletion-checkpointdelete.md](checkpoint_deletion_checkpointdelete.md) — Checkpoint deletion (checkpoint_delete)
- [startup-pending-file-recovery.md](startup_pending_file_recovery.md) — Startup pending-file recovery
