---
title: "Incremental Index Foundation: Schema v31, Memo DAG, and Chunk Identity"
description: "Additive schema migration and library primitives that let the memory store represent canonical input memos, dependency edges, and durable chunk metadata. Handler scan behavior is unchanged; the new planner API is ready for later integration phases."
trigger_phrases:
  - "incremental index foundation"
  - "schema v31 memo tables"
  - "canonical fingerprint chunk identity"
  - "memo dag dependency edges"
  - "027 002/002 001 changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/001-incremental-index-foundation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle`

### Summary

The memory store can now represent canonical input memo records, dependency edges, and durable chunk metadata without changing any handler scan behavior. The foundation adds three new library modules and a `planMemoizedIndexing()` planning API to `incremental-index.ts` so future phases can know what changed before parsing or embedding. The schema advances to v31 via an additive migration that is safe to apply on existing databases.

### Added

- `lib/storage/canonical-fingerprint.ts`: stable JSON canonicalization helpers for input fingerprints and code hashes
- `lib/storage/memo.ts`: memo CRUD, dependency-edge insertion, transitive invalidation, and cycle rejection against sandboxed SQLite databases
- `extractStableMemoryChunks()` API on `lib/parsing/memory-parser.ts`: opt-in anchor-first chunk extraction with fallback to heading slugs and fixed windows, computing chunk fingerprints from chunk-local normalized content
- `planMemoizedIndexing()` export on `lib/storage/incremental-index.ts`: planning API that reports memo hits, chunk hits, and dependency-invalidated paths without touching the current scan flow
- Five new Vitest test files: `canonical-fingerprint.vitest.ts`, `memo-storage.vitest.ts`, `memory-parser-stable-chunks.vitest.ts`, `incremental-index-foundation.vitest.ts`, and `vector-index-schema-incremental-foundation.vitest.ts` contributing 13 focused tests; the verification run below exercises the wider 9-file suite at 70 tests

### Changed

- `lib/search/vector-index-schema.ts`: schema v31 additive migration adds `memoization_records` and `dependency_edges` tables and extends `memory_index` with `chunk_id`, `chunk_fingerprint`, `chunk_kind`, `chunk_start_line`, and `chunk_end_line` columns plus chunk identity and fingerprint indexes
- `lib/parsing/memory-parser.ts`: the stable chunk extraction API is additive and does not change any existing parse output
- `lib/storage/incremental-index.ts`: the memoized planning API is additive and does not change the existing file-level categorization path
- `tests/vector-index-schema-enrichment-v30.vitest.ts`: the v30 marker test was narrowed to marker behavior so the current schema version can advance past v30

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS: `tsc --build && node scripts/finalize-dist.mjs` exited 0 |
| Focused Vitest suites (9 files, 70 tests) | PASS |
| `validate.sh ... --strict` | PASS: 0 errors, 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/search/vector-index-schema.ts` | Modified | v31 additive migration: memo tables, dependency edges, chunk metadata columns, and chunk indexes |
| `mcp_server/lib/storage/canonical-fingerprint.ts` | Created | Deterministic input and code-hash helpers |
| `mcp_server/lib/storage/memo.ts` | Created | Memo CRUD, dependency traversal, invalidation, and cycle rejection |
| `mcp_server/lib/parsing/memory-parser.ts` | Modified | Stable chunk metadata extraction added without changing existing parse output |
| `mcp_server/lib/storage/incremental-index.ts` | Modified | Memoized planning API added while preserving existing categorization behavior |
| `mcp_server/tests/canonical-fingerprint.vitest.ts` | Created | Canonical input and code-hash determinism coverage |
| `mcp_server/tests/memo-storage.vitest.ts` | Created | Memo CRUD, transitive invalidation, and cycle rejection coverage |
| `mcp_server/tests/memory-parser-stable-chunks.vitest.ts` | Created | Anchor-first identity and chunk fingerprint stability coverage |
| `mcp_server/tests/incremental-index-foundation.vitest.ts` | Created | Memo hits, chunk hits, code-hash misses, and dependency invalidation coverage |
| `mcp_server/tests/vector-index-schema-incremental-foundation.vitest.ts` | Created | Fresh schema and existing DB additive migration coverage |
| `mcp_server/tests/vector-index-schema-enrichment-v30.vitest.ts` | Modified | v30 marker test narrowed to allow schema version to advance |

### Follow-Ups

- Handler scan behavior is intentionally unchanged. The `planMemoizedIndexing()` API is ready for the follow-on integration phase when scan behavior will call it.
