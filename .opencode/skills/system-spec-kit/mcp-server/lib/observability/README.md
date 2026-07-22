---
title: "Retrieval Observability"
description: "In-process counters and trace builders for ranker provenance, vector-index degradation and maintenance-tool runs."
---

# Retrieval Observability

---

## 1. OVERVIEW

`lib/observability/` holds in-memory observability state for the retrieval and maintenance path. It does not own retrieval logic itself. It records what the pipeline and maintenance tools already decided, so a caller can explain a ranking (`buildWhyRankedTrace`), surface a degraded vector shard or report the last `memory_index_scan` / `memory_embedding_reconcile` / `memory_retention_sweep` run.

Current state:

- Ranker provenance: `buildWhyRankedTrace` turns a raw pipeline row into a per-channel (`vector`, `bm25`, `fts`, `graph`, `trigger`) and per-signal (`fsrs`, `importance`, `recency`) trace.
- Vector degradation: a module-level `degradedVectorHealthSnapshot` tracks shard probe failures, quarantines and rebuild lifecycle state (`healthy` to `rebuild_failed`), recorded by `recordVectorShard*` functions.
- Maintenance run counters: a fixed-key record per maintenance tool tracks last run time, last status and per-call counts.
- Conflict warnings: `findInlineConflictWarnings` flags result pairs whose documents `contradicts` or `supersedes` each other before a caller applies them.
- `__testables` exposes internal state resets for tests only.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `retrieval-observability.ts` | All ranker-trace, vector-degradation, maintenance-run and conflict-warning observability state and accessors. |

## 3. CONSUMERS

- `formatters/search-results.ts`
- `lib/search/vector-index-store.ts`
- `lib/embedders/reindex.ts`
- `handlers/embedder-status.ts`, `handlers/memory-embedding-reconcile.ts`, `handlers/memory-index.ts`, `handlers/memory-search.ts`, `handlers/memory-crud-health.ts`

## 4. TESTS

- `tests/openltm-retrieval-observability.vitest.ts`

## 5. RELATED

- [`../README.md`](../README.md)
