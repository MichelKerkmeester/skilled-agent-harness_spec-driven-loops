---
title: "Semantic Trigger Fallback 001: Schema v34 and Default-Off Trigger Embedding Backfill"
description: "Additive schema v34 migration adds the memory_trigger_embeddings derived table and a resumable, default-off out-of-band backfill helper. Lexical trigger matching is unchanged. The semantic stage requires later child phases to activate."
trigger_phrases:
  - "027 phase 002/003 001 schema backfill"
  - "memory_trigger_embeddings table"
  - "trigger embedding backfill"
  - "schema v34 semantic trigger"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/001-schema-backfill` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback`

### Summary

The semantic trigger fallback required a storage substrate before any matching logic could ship. This leaf adds a `memory_trigger_embeddings` derived table to `vector-index-schema.ts`, reuses the existing `embedding_cache` BLOB store for actual vectors, and wires a resumable per-memory backfill helper into `memory-index.ts`. Schema version advances from 33 to 34 via an additive migration.

The save-time hook and runtime matcher are intentionally out of scope. Default-off behavior is enforced: the backfill flag must be explicitly enabled for population, and the scan completion path only calls the helper when the flag is set. No lexical trigger behavior changed.

### Added

- `mcp_server/lib/search/trigger-embedding-backfill.ts` — default-off resumable backfill helper; profile-keyed; prevents duplicate rows on re-run; makes no provider call when the flag is off
- `mcp_server/tests/trigger-embedding-backfill.vitest.ts` — proves default-off behavior, resumable re-run without duplicates, and no ready row before a durable store write

### Changed

- `mcp_server/lib/search/vector-index-schema.ts` — `SCHEMA_VERSION` bumped to 34; additive migration bootstraps `memory_trigger_embeddings`; compatibility checks updated
- `mcp_server/handlers/memory-index.ts` — calls the backfill helper from scan completion; returns backfill outcome data in the handler response
- `mcp_server/tests/vector-index-schema-compatibility.vitest.ts` — requires the new table in the minimal compatible schema footprint
- `mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` — terminal schema assertions updated to v34; v34 migration path covered

### Fixed

- None. This leaf is additive storage infrastructure only.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` (mcp_server workspace) | PASS (exit 0) |
| `npx vitest run tests/trigger-embedding-backfill.vitest.ts tests/vector-index-schema-compatibility.vitest.ts tests/vector-index-schema-migration-refinements.vitest.ts` | PASS (3 files / 18 tests) |
| Targeted regression suite (7 files / 69 tests) | PASS |
| Resumability proof: re-run produces no duplicate rows, no extra provider calls | PASS |
| Default-off proof: disabled backfill creates no rows, makes no provider call | PASS |
| `validate.sh --strict` on spec folder | PASS (exit 0) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/search/vector-index-schema.ts` | Modified | `SCHEMA_VERSION` to 34; additive `memory_trigger_embeddings` migration and bootstrap |
| `mcp_server/lib/search/trigger-embedding-backfill.ts` | Created | Default-off profile-keyed resumable trigger phrase embedding backfill |
| `mcp_server/handlers/memory-index.ts` | Modified | Backfill helper called from scan completion; backfill outcome returned |
| `mcp_server/tests/vector-index-schema-compatibility.vitest.ts` | Modified | New table required in minimal compatible schema footprint |
| `mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` | Modified | Terminal schema asserts updated to v34; v34 migration path added |
| `mcp_server/tests/trigger-embedding-backfill.vitest.ts` | Created | Default-off, resumability, and no-durable-before-ready tests |

### Follow-Ups

- The save-time hook (populating trigger embeddings on memory write) was deferred outside this leaf's approved write scope. It remains unimplemented until a later phase needs it.
- The semantic matcher, hybrid handler behavior, and shadow/promotion evaluation are for child phases 002 through 004.
