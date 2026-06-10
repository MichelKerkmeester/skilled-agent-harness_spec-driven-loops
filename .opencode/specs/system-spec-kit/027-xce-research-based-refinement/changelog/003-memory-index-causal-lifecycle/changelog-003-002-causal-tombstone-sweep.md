---
title: "Causal Edge Tombstones: Audit Trail Before Hard Delete (Schema v32)"
description: "Every active causal-edge deletion now leaves a tombstone row before the active row is removed. All nine production delete paths were updated to route through a central sweep helper. Health reporting gained orphan edge diagnostics. Schema advances to v32 via additive migration."
trigger_phrases:
  - "causal edge tombstones"
  - "schema v32 tombstone migration"
  - "tombstone sweep causal delete"
  - "027 003 002 changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle/002-causal-edge-tombstones` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle`

### Summary

Active causal-edge deletion now leaves an audit trail before the active row disappears. `lib/causal/sweep.ts` centralizes read-before-delete behavior: it snapshots matching active edges, writes tombstones with a monotonic lifecycle generation per source/target/relation, hard-deletes by active edge id, and clears graph caches after durable deletes. Every active production delete path was updated to route through this helper, including single memory delete, folder and tier bulk delete, stale index cleanup, manual unlink, health orphan repair, CLI cleanup, vector-index mutation cleanup, checkpoint scoped restore cleanup, and correction undo cleanup. Health reporting gained orphan edge samples and tombstone counts. The active `causal_edges` table stays simple for graph reads while `causal_edge_tombstones` preserves compact restore metadata for later recovery.

### Added

- `lib/causal/sweep.ts`: central tombstone-then-delete helper with tombstone schema setup and monotonic lifecycle generation per source/target/relation triple
- `mcp_server/tests/causal-edge-tombstones.vitest.ts`: 325-test suite covering single delete, bulk delete, manual unlink, and health orphan repair tombstone paths (16 files)

### Changed

- `lib/search/vector-index-schema.ts`: additive v32 migration adds `causal_edge_tombstones` table and compatibility footprint
- `lib/storage/causal-edges.ts`: storage delete helpers and orphan cleanup routed through tombstone sweep
- `lib/search/vector-index-mutations.ts`: mutation cleanup replaced raw causal-edge delete with sweep helper
- `lib/storage/checkpoints.ts`: tombstones active causal edges during scoped restore cleanup
- `lib/learning/corrections.ts`: tombstones correction-owned edge deletes during undo
- `handlers/memory-crud-delete.ts`: passes delete reason and restore context into causal cleanup
- `handlers/memory-bulk-delete.ts`: passes bulk delete reason and restore context into causal cleanup
- `handlers/memory-crud-health.ts`: reports orphan edge samples and tombstones on confirmed repair; confirmed auto-repair records repaired and tombstoned counts and leaves unconfirmed health reads non-destructive
- `handlers/causal-graph.ts`: manual unlink records tombstone reason and restore context
- `handlers/memory-index.ts`: stale cleanup tombstones with scan-specific context before memory-row delete
- `cli.ts`: CLI bulk delete preserves helper semantics and restore context
- `tests/vector-index-schema-compatibility.vitest.ts`: minimal compatible footprint updated for tombstone schema
- `tests/vector-index-schema-migration-refinements.vitest.ts`: terminal schema version pinned to 32 with v32 migration verified

### Fixed

- Active causal-edge deletes left no audit trail before this phase. All delete paths now snapshot and tombstone before hard-deleting.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS: `tsc --build && node scripts/finalize-dist.mjs` exited 0 |
| Vitest (16 files, 325 tests) | PASS |
| Comment hygiene check | PASS: no output, exit 0 |
| `validate.sh ... --strict` | PASS: 0 errors, 0 warnings |
| Alignment drift checker | FAIL outside scope: pre-existing `canonical-fingerprint.ts` and `memo.ts` lack module headers; not modified by this phase |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/causal/sweep.ts` | Created | Central tombstone-then-delete helper and tombstone schema setup |
| `mcp_server/lib/search/vector-index-schema.ts` | Modified | Additive v32 migration adds `causal_edge_tombstones` table |
| `mcp_server/lib/storage/causal-edges.ts` | Modified | Storage delete helpers and orphan cleanup routed through tombstone sweep |
| `mcp_server/lib/search/vector-index-mutations.ts` | Modified | Mutation cleanup replaced raw delete with sweep helper |
| `mcp_server/lib/storage/checkpoints.ts` | Modified | Tombstones active causal edges during scoped restore cleanup |
| `mcp_server/lib/learning/corrections.ts` | Modified | Tombstones correction-owned edge deletes during undo |
| `mcp_server/handlers/memory-crud-delete.ts` | Modified | Passes delete reason and restore context into causal cleanup |
| `mcp_server/handlers/memory-bulk-delete.ts` | Modified | Passes bulk delete reason and restore context into causal cleanup |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | Reports orphan edge samples and tombstones on confirmed repair |
| `mcp_server/handlers/causal-graph.ts` | Modified | Manual unlink records tombstone reason and restore context |
| `mcp_server/handlers/memory-index.ts` | Modified | Stale cleanup tombstones with scan-specific context before memory-row delete |
| `mcp_server/cli.ts` | Modified | CLI bulk delete preserves helper semantics and restore context |
| `mcp_server/tests/causal-edge-tombstones.vitest.ts` | Created | Single delete, bulk delete, manual unlink, and health orphan repair tombstone coverage |
| `mcp_server/tests/vector-index-schema-compatibility.vitest.ts` | Modified | Minimal compatible footprint updated for tombstone schema |
| `mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` | Modified | Terminal schema version pinned to 32 |

### Follow-Ups

- Historical active edges have no tombstone history for deletes that happened before v32. Audit begins at the first post-migration delete.
- Two pre-existing module-header defects in `canonical-fingerprint.ts` and `memo.ts` remain and are outside this phase's scope.
