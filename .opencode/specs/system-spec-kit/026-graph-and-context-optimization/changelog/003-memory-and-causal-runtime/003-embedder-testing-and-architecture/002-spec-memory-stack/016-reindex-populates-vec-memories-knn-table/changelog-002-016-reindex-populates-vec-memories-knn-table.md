---
title: "Phase 016: reindex dual-write and factory shard fallback restore memory_search semantic confidence"
description: "Root-cause fix for memory_search Z=1.2 degraded confidence. Reindex now dual-writes vec_memories alongside vec_dim. The factory follows the ADR-012 shard split when resolving the active ollama embedder."
trigger_phrases:
  - "vec_memories knn backfill"
  - "reindex dual-write vec_768"
  - "factory adr-012 shard fallback"
  - "memory_search z-score degraded fix"
  - "writeVectorsToShard patch"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

`memory_search` was returning RRF score distributions with Z near 1.2, below the evidence-gap threshold of 1.5, which forced the response policy into `broaden_or_ask` and blocked confident citation of results. Two cooperating bugs were responsible. The reindex path wrote only to `vec_<dim>` and never populated the `vec_memories` vec0 virtual table that the runtime KNN actually queries. Separately, the factory looked for `vec_<dim>` in the main database while ADR-012 had relocated that table into the per-embedder shard, causing the factory to default to the wrong model and dimension.

Both layers were patched in one commit (`fix(016/002/016): reindex dual-write + factory shard fallback`): `writeVectorsToShard` now dual-writes into `vec_<dim>` and `vec_memories` in the same transaction. `readActiveOllamaEmbedderFromDb` now falls back to the shard path when the main database lacks the dim-tagged table. A one-shot backfill restored confidence immediately for the running daemon without waiting for the next full reindex.

### Added

- `writeVectorsToKnn` helper in `reindex.ts` that performs a DELETE then INSERT per row into the vec0 virtual table `vec_memories` (vec0 does not accept `INSERT OR REPLACE`)
- sqlite-vec import in `reindex.ts` with graceful try-catch so reindex falls back to `vec_<dim>`-only writes when the extension is unavailable
- Shard-path fallback branch in `readActiveOllamaEmbedderFromDb` that resolves the active ollama embedder from `<db_dir>/vectors/context-vectors__ollama__<name>__<dim>.sqlite` when the main database lacks the dim-tagged table

### Changed

- `writeVectorsToShard` in `lib/embedders/reindex.ts` now dual-writes every reindex batch into both `vec_<dim>` and `vec_memories` within the same shard transaction
- `readActiveOllamaEmbedderFromDb` in `shared/embeddings/factory.ts` now checks both the main database and the shard path. The cascade warning only fires when both locations lack the table.

### Fixed

- `vec_memories` was sitting at zero rows while `vec_768` held 3808 rows. The vector contribution to RRF was zero, leaving only FTS5 to feed the ranker and flattening the score distribution.
- Factory returned null for the active ollama embedder because it scanned the main database for `vec_<dim>` after ADR-012 moved that table into the shard. The daemon defaulted to `jina-embeddings-v3` at 1024 dim instead of the active nomic at 768 dim.

### Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit -p tsconfig.json` on mcp_server | PASS |
| `npx tsc --noEmit -p tsconfig.json` on shared | PASS |
| `npm run build` on shared and mcp_server | PASS |
| Daemon restart via Python double-fork plus setsid | PASS. New PIDs 16589 launcher and 16591 context-server. Bridge socket re-listening at `/tmp/mk-spec-memory/daemon-ipc.sock`. |
| Daemon startup log scan for `factory.*points to vec_768.*missing` | PASS. Zero matches. |
| Patched factory resolution simulation | PASS. Resolves to nomic-embed-text-v1.5 at 768 dim via shard path. |
| `vec_memories` row count after backfill | PASS. 3808 rows matching `vec_768`. |
| KNN self-probe on backfilled `vec_memories` | PASS. Rank 1 distance 0 plus 4 real neighbors at distance 0.55 to 0.58. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified | Dual-write `vec_<dim>` and `vec_memories` per reindex batch. Added `writeVectorsToKnn` helper. Added sqlite-vec import with graceful try-catch. |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modified | Resolve the active ollama embedder via the shard subdirectory when main database lacks `vec_<dim>`. |
| `.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` | Modified (data) | One-shot backfill. 3808 rows added to `vec_memories`. |

### Follow-Ups

- Extend the shard-aware factory lookup to non-ollama providers (hf-local, voyage, openai) when they adopt the same `vec_metadata` active-embedder pointer convention.
- Add a migration script under `database/migrations/` to remove the legacy top-level `vec_metadata` table from `context-index.sqlite` once the shard layout is fully deployed.
- Other shards that were not backfilled inherit the dual-write behavior on their next reindex run. No manual backfill is needed for those shards.
