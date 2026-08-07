---
title: "010/004: skill-graph-db Writer Cross-Wire to EmbedderAdapter Layer"
description: "Refactored refreshSkillEmbeddings to dispatch on the active embedder pointer, routing through the new EmbedderAdapter layer when set and preserving the legacy factory path for backward compatibility. Shipped with a 4-test round-trip suite and a post-impl deep-review at PASS-with-advisories."
trigger_phrases:
  - "010/004 writer cross-wire"
  - "skill-graph-db refresh refactor"
  - "EmbedderAdapter writer wiring"
  - "refreshSkillEmbeddings dispatcher"
  - "010/002 unblock embedder"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/004-skill-graph-db-writer-cross-wire`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack`

### Summary

After 010/001 shipped the pluggable EmbedderAdapter layer, the read path in `skill-graph-db.ts` was already wired to `vec_<active.dim>` tables, but the write path still called the old `createEmbeddingsProvider()` factory, which has no Ollama provider and cannot produce jina-v3 vectors. This gap was independently flagged by the E deep-review as P1-1 and blocked 010/002 from executing the jina-v3 swap.

`refreshSkillEmbeddings()` was refactored into a dispatcher that branches on `hasActiveEmbedderPointer()`. When an active pointer is set, a new `refreshSkillEmbeddingsViaAdapter()` helper uses `getAdapter(active.name)` to embed and writes to `vec_<active.dim>` via INSERT OR REPLACE, surfacing ADAPTER-UNAVAILABLE and ADAPTER-DIM-MISMATCH warnings on failure. When no pointer is set, the renamed `refreshSkillEmbeddingsLegacy()` preserves existing behavior for fresh installs. A follow-up review pass closed three advisories including a P1 for fail-fast dim mismatch checking. The wiring closes the write-read parity gap and unblocks 010/002.

### Added

- `refreshSkillEmbeddingsViaAdapter()` helper in `skill-graph-db.ts` that uses `getAdapter(active.name)` to produce embeddings and writes to `vec_<active.dim>` via INSERT OR REPLACE with `model_id` and `content_hash` columns
- ADAPTER-UNAVAILABLE warning path when manifest is not found or `getAdapter` throws
- ADAPTER-DIM-MISMATCH early-return guard (P1-1 advisory fix) that fails fast before any per-row embedding calls
- `failed` count populated on ADAPTER-UNAVAILABLE and ADAPTER-DIM-MISMATCH early-returns so consumers see an explicit outage signal
- `console.warn` on both ADAPTER-UNAVAILABLE branches for daemon log visibility
- `tests/skill-graph/refresh-roundtrip.vitest.ts` (NEW): 5 round-trip test cases covering adapter write path, idempotency, unknown manifest, legacy fallback plus dim-mismatch fail-fast

### Changed

- `refreshSkillEmbeddings()` refactored from a single implementation into a dispatcher that branches on `hasActiveEmbedderPointer(database)`
- Existing implementation renamed to `refreshSkillEmbeddingsLegacy()` with behavior unchanged for the FALSE branch
- Imports in `skill-graph-db.ts` extended to include `getAdapter` from `lib/embedders/registry` and `EmbedderAdapter` type from the adapter module
- JSDoc on `refreshSkillEmbeddings()` updated to document dual-path behavior and the active-pointer flag contract

### Fixed

- Write-read parity gap: reads from `vec_<active.dim>` but writes were going to `skill_nodes.embedding` BLOB column via the old factory, making jina-v3 vectors unreachable at query time
- Per-row EMBEDDING-FAILED spam when operator embedder config has a dim mismatch: replaced with a single up-front ADAPTER-DIM-MISMATCH early-return

### Verification

| Check | Result |
|---|---|
| New round-trip tests (`tests/skill-graph/refresh-roundtrip.vitest.ts`) | 5/5 pass |
| Full skill-advisor vitest suite | No new regressions vs task 49 baseline (4 pre-existing failures unrelated to this packet) |
| `npm run build` | Exit 0 (one TS strict-null error caught and fixed during implementation) |
| Strict-validate (`validate.sh --strict`) | Exit 0. Zero errors. Zero warnings. |
| Post-impl deep-review (5-iter cli-devin SWE-1.6) | PASS-with-advisories. 0 P0. 1 P1. 2 P2. All three advisories closed in commit `ab0c7de71b`. |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | Dispatcher split. New `refreshSkillEmbeddingsViaAdapter` helper. Legacy path renamed. New imports. ADAPTER-DIM-MISMATCH guard. ADAPTER-UNAVAILABLE `failed` count. `console.warn` branches. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts` | Created (NEW) | 5 round-trip cases: adapter write, idempotency, unknown manifest, legacy fallback, dim-mismatch fail-fast. |

### Follow-Ups

- Deprecate the `skill_nodes.embedding` BLOB column in a future packet once all active installs have migrated to `vec_<dim>` tables.
- Cache adapter instances at module level if profiling shows repeated `getAdapter` calls during high-frequency refresh.
- Update 010/002 swap-runbook to confirm the write-read parity is closed and the jina-v3 reindex path is now executable end-to-end.
