---
title: "Byte-Bounded Profile-Aware Embedding Cache"
description: "Embedding cache migrated from a global row-count cap to byte-bounded, profile-keyed, document/query-split storage. Four budget controls govern global, per-profile and query-only limits. Health telemetry now reports real SQLite bytes per profile."
trigger_phrases:
  - "byte-bounded embedding cache"
  - "profile-aware embedding cache"
  - "embedding cache byte budgets"
  - "input kind document query cache"
  - "embedding cache profile key migration"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/009-byte-bounded-embedding-cache` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

The persistent `embedding_cache` table was keyed only by content hash, model and dimensions with a global row-count cap. Embeddings accumulated across inactive profiles with no byte ceiling. Document vectors and search-query vectors shared the same cache rows without discrimination.

The cache schema was migrated to carry `profile_key` and `input_kind` columns. Document writes now land under `input_kind='document'` and search queries under `input_kind='query'`. Four configurable byte budgets replace the count-only eviction: a global limit, a per-profile limit, a query-row limit plus a secondary per-profile entry cap. LRU deletion targets the oldest-touched rows first and calls `PRAGMA shrink_memory` after each eviction run.

Health telemetry in full `memory_health` reports switched from rough byte estimates to real SQLite byte totals and added an `embedding_cache_by_profile` breakdown with document and query sub-totals. Legacy callers using the three-field lookup remain compatible through a fallback path.

### Added

- `profile_key` and `input_kind` columns in the `embedding_cache` schema via idempotent migration
- Scoped `lookupEmbedding` and `storeEmbedding` options accepting profile key and input kind
- Four byte-budget env vars: global cap, per-profile cap, query-row cap plus a secondary per-profile entry cap
- `embedding_cache_by_profile` field in full `memory_health` reports with document/query breakdowns
- `embedding-cache-byte-bounded.vitest.ts` (NEW): 10-test suite covering migration, keying, budget enforcement and pragma behavior
- Profile-aware caching section in `embedder_architecture.md` operator docs

### Changed

- Cache eviction replaced count-only deletion with byte-budget LRU eviction running after each store call
- `memory_health` full-report byte estimate replaced with real SQLite byte totals per profile
- Document save pipeline now passes active profile key and `input_kind='document'` on every lookup and store call
- Query embedding wrapper now checks the query cache before invoking the adapter, then stores on miss under `input_kind='query'`

### Fixed

- Global row-count cap allowed unbounded SQLite growth when multiple embedder profiles accumulated entries. Byte budgets cap growth regardless of profile count.
- Document and query vectors were cached with the same key shape, making cross-task reuse silently unsafe. The `input_kind` column prevents this category of collision.

### Verification

| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS |
| `npx vitest --run embedding-cache-byte-bounded` | PASS. 1 file / 10 tests |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <009> --strict` | PASS. `RESULT: PASSED` |
| `npx vitest --run embedding-cache` | PASS. 2 files / 24 tests |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | PASS |
| Integration probe | PASS. 60 MiB inserted across 2 profiles. Retained 49 rows. `approxBytes=51387574`, `shrinkMemoryCalls=11` |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit` | PASS. 0 errors / 44 existing warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` | Modified | Profile/input-kind schema migration, byte-budget eviction, scoped cache API |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts` | Modified | Document cache key wiring with profile key and input kind |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Modified | Query embedding cache lookup and store on miss |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Real byte estimates and per-profile breakdown in full health report |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedding-cache-byte-bounded.vitest.ts` | Created (NEW) | Migration, keying, budget enforcement and pragma tests |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modified | Profile-aware caching operator docs |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Four cache budget env vars documented |

### Follow-Ups

- Legacy unscoped lookups remain ambiguous when multiple profiles share the same content, model and dimension tuple. Callers outside the scoped save and search paths should migrate to the explicit options when convenient.
- Embedding cache rows are recomputable from source text. A rollback that needs a clean cache can truncate `embedding_cache` and let the next run repopulate.
