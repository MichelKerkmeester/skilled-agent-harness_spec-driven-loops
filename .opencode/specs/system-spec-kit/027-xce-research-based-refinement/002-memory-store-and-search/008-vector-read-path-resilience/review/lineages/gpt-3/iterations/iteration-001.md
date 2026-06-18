# Iteration 001: Correctness

## Focus

Reviewed shard integrity probing, quarantine, repair reindex, and the fault-injection test around live self-heal behavior.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 3
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Repair swap leaves the live connection attached to the stale shard, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:608`. The repair job writes vectors to a staging shard, then renames that staging file over the active shard path at `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:593-608`. It then calls `attachActiveVectorShard(jobDb, targetProfile)` at `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:650-652`, but the attach path short-circuits when `attachedPath === path.resolve(shardPath)` and only probes/ensures the already-attached handle at `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1233-1242`. On POSIX, replacing the file path does not make an existing SQLite attached database handle start reading the new inode. The fault-injection test verifies `vectorIds(shardPath)` by opening the file path after repair, but it does not query the same connection's `active_vec` surface after repair completion at `.opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts:149-160`. This can leave the live daemon's current connection serving an empty or stale `active_vec` until restart or explicit detach/reattach, violating the zero-manual self-heal intent.

```json
{
  "findingId": "F001",
  "claim": "After vector shard repair, the current database connection can remain attached to the pre-swap shard handle instead of the rebuilt shard file.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1233-1242",
    ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:593-608",
    ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:650-652",
    ".opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts:149-160"
  ],
  "counterevidenceSought": "Checked the attachActiveVectorShard branch for explicit DETACH when the attached path equals the target path, checked the repair completion block for detach-before-reattach, and checked the fault-injection test for a same-connection active_vec or vector_search assertion after repair.",
  "alternativeExplanation": "SQLite might transparently refresh an attached database after path replacement, but the code provides no explicit detach/attach boundary and the test only opens the replaced file by path, so the safer reading is that the live handle remains stale.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if SQLite/better-sqlite3 evidence or a same-connection regression test shows the attached schema observes the renamed replacement without detach, or if repair completion detaches and reattaches active_vec before health becomes healthy.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

### P2, Suggestion

- None.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `spec.md:104`; `reindex.ts:593-608` | REQ-001 self-heal is partial while live attachment can remain stale. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: one new live-handle correctness defect class.

## Ruled Out

- Rebuild staging partial-write concern: staging cleanup and rename discipline are present in `reindex.ts:531-608`.

## Dead Ends

- None.

## Recommended Next Focus

Check whether the issue creates security exposure or remains correctness-only.

Review verdict: CONDITIONAL
