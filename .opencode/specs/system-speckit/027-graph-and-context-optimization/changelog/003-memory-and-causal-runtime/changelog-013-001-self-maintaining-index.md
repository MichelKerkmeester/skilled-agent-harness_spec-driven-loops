---
title: "013/001 memory_index_scan Self-Maintaining Index: coalescing, async drain, move reconciliation, active-row uniqueness"
description: "The self-maintaining memory index: coalescing caller contract (no raw E429), phased async execution with outage-safe vector drain (removes -32001), job-layer single-writer + move reconciliation, and an active-row uniqueness guard (v28 partial unique index) with multi-tenant scope isolation."
trigger_phrases:
  - "self-maintaining index changelog"
  - "memory_index_scan coalescing async drain"
  - "active-row uniqueness v28 partial index"
  - "move reconciliation packet_id identity"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/001-self-maintaining-index` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation`

### Summary

Shipped the self-maintaining `memory_index_scan` index in four gated phases (Phases 1-3 on 2026-05-31, Phase 4 council follow-up on 2026-06-01). Phase 1: coalescing caller contract (no raw `E429`) + a `memory_health.index` freshness block + a bounded global orphan sweep. Phase 2: phased async execution (walk → commit-lexical → async vector drain) with outage-safe drain that removes the index vector-drain outage `-32001` class only (the launcher retryable-recycle `-32001` is unaffected/live). Phase 3: job-layer single-writer concurrency + move reconciliation by `packet_id` identity + auto-reindex triggers. Phase 4: an active-row uniqueness guard (deprecate-before-insert + a v28 partial unique index) plus multi-tenant scope isolation. Commit `942ad78d9c`; a clean index rebuild produced 9614 rows / 9614 vectors / 0 missing (`healthy_fresh`).

### Added

- `memory_health.index` freshness block + a bounded global orphan sweep (Phase 1).
- Phased async execution mode (walk → commit-lexical → async vector drain) + outage-safe drain (Phase 2).
- Job-layer single-writer concurrency + `packet_id`-identity move reconciliation + auto-reindex triggers (Phase 3).
- Active-row uniqueness guard: deprecate-before-insert + a v28 partial unique index; multi-tenant scope isolation (Phase 4).

### Changed

- Coalescing caller contract so callers no longer surface raw `E429` (Phase 1).
- Schema bumped to v28 for the active-row partial unique index (Phase 4).

### Fixed

- The `-32001` outage class on the vector-drain path (Phase 2, outage-safe async drain).
- Duplicate active rows on re-index / move via the uniqueness guard + reconciliation (Phases 3-4).

### Verification

- Per-phase: tsc 0 errors; 14/14 tests (Phase 1) and council follow-up tests (Phase 4) green; merged 2026-05-31 / 2026-06-01.
- Clean index rebuild on the production database: 9614 rows / 9614 vectors / 0 missing-vector (`healthy_fresh`).

### Files Changed

| File | Change |
|------|--------|
| `mcp_server/lib/storage/lineage-state.ts` | Modify — move reconciliation / lineage identity |
| `mcp_server/lib/search/vector-index-schema.ts` | Modify — v28 active-row partial unique index |
| `mcp_server/handlers/memory-save.ts` | Modify — active-row uniqueness (deprecate-before-insert) |
| `mcp_server/handlers/memory-index.ts` · `lib/search/*` | Modify — coalescing, async drain, single-writer, orphan sweep |

### Follow-Ups

- Checkpoint-v2 (item D) and MCP front-proxy (item E) were re-deferred from this packet and shipped separately (see `013/002` and `013/003`). Now complete.
