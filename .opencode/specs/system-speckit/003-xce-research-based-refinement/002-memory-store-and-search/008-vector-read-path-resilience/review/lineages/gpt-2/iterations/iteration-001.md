# Iteration 001: Correctness

## Focus

Dimension: correctness. Files reviewed: `vector-index-store.ts`, `reindex.ts`, and `vector-shard-read-path-resilience.vitest.ts`.

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

- **F001**: Repair completion leaves the live connection attached to the pre-swap shard handle. The repair worker atomically renames the completed staging shard over the active shard path, then calls `attachActiveVectorShard(jobDb, targetProfile)` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:598-608] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:650-651]. If that same `jobDb` already has `active_vec` attached at the same path, `attachActiveVectorShard` enters the `attachedPath === path.resolve(shardPath)` branch and probes/ensures schema without detaching and reattaching the file [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1233-1256]. On POSIX filesystems, renaming over an open SQLite database path does not make the existing connection read the replacement inode; the active daemon connection can continue using the empty fresh shard created after quarantine while health reports healthy. The existing fault-injection test validates `vectorIds(shardPath)` by opening a new `Database(shardPath)` rather than querying through the same live `db` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts:67-75] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts:152-160].

```json
{
  "findingId": "F001",
  "claim": "After repair reindex completes, the active process can remain attached to the old shard handle because the staged shard is renamed over the live path before attachActiveVectorShard runs and the same-path attach branch does not detach and reattach.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:598-608",
    ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:650-651",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1233-1256",
    ".opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts:152-160"
  ],
  "counterevidenceSought": "Checked the post-swap attachActiveVectorShard branch, detachActiveVectorShard, vector_search tests, and the fault-injection test assertions for a same-connection post-repair query or forced detach/reattach after rename.",
  "alternativeExplanation": "SQLite might reopen the path transparently after rename, but the code does not request that behavior and SQLite attachments are connection handles, so this explanation is rejected without a same-connection regression.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if attachActiveVectorShard explicitly detaches/re-attaches after repair swap or a same-process vector_search regression proves the current connection reads the rebuilt shard after rename.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

- None.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `reindex.ts:598-608`, `vector-index-store.ts:1233-1256` | REQ-001 self-heal is not proven for the live connection. |

## Assessment

- New findings ratio: 1.00.
- Dimensions addressed: correctness.
- Novelty justification: new correctness gap in the repair completion path.

## Ruled Out

- P0 severity: not enough evidence of data loss; rebuilt shard file exists and new connections can read it.

## Dead Ends

- File-level rebuild success is not enough evidence for same-process recovery.

## Recommended Next Focus

Review security and path handling around quarantine and staged shard swap.
Review verdict: CONDITIONAL
