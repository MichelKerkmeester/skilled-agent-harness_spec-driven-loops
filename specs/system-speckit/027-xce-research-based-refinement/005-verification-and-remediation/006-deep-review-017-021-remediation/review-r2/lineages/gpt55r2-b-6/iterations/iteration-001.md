# Iteration 001: Correctness/Data-Integrity Write Lifecycle

## Focus

Dimension covered: correctness.

Scope investigated: memory write/index lifecycle, background index scan cancellation, mutation hook invalidation, stale cleanup, atomic save ordering, and incremental mtime decisions.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 11
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

No P0 findings.

### P1, Required

- **F001**: Cancelled index scans can persist writes while skipping mutation invalidation. The scan loop writes/indexes files inside `processBatches()` before any later cancellation checks [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1028-1056], then updates successful file mtimes [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1186-1188]. If cancellation is observed during metadata promotion or just before post-processing, the handler returns `cancelledScanEnvelope()` immediately [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1191-1204] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1231-1232]. The mutation hooks that clear trigger, semantic trigger, tool, constitutional, graph, coactivation, and entity-density caches run only later [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1351-1372] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:127-180]. A cancel request after partial persisted writes can therefore report cancellation while leaving stale read caches and no result counts for the applied writes.

```json
{
  "findingId": "F001",
  "claim": "A background index scan can persist memory_index changes and mtime updates, then return cancelled before scan mutation hooks invalidate dependent caches.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1028-1056",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1186-1188",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1191-1204",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1231-1232",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1351-1372",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:127-180"
  ],
  "counterevidenceSought": "Read the later scan post-processing and mutation hook path, and checked the background job completion path for a compensating invalidation on cancelled results; none was present before the early cancelled returns.",
  "alternativeExplanation": "A cancelled scan might be intended to suppress all follow-up work, but the memory_index writes and mtime updates have already landed before the cancellation branch, so suppressing invalidation hides real mutations.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if cancelled scan exits after writes are changed to run mutation invalidation with the accumulated statediff actions, or if index writes become transactional and roll back on cancellation.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

- **F002**: Stale cleanup deletes causal edges before the memory delete is confirmed. `deleteIndexedRecordIds()` calls `causalEdges.deleteEdgesForMemory()` before calling `vectorIndex.deleteMemory()` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:593-615]. `deleteMemory()` itself already removes ancillary causal rows inside its delete transaction [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:717-780] via `deleteAncillaryMemoryRows()` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:159-208]. Other delete paths keep tombstone/delete and edge cleanup inside one database transaction [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:129-178]. The scan stale-cleanup path is therefore the outlier: if the pre-delete edge sweep succeeds but the memory delete fails or returns false, causal lineage for a still-present memory has already been removed.

```json
{
  "findingId": "F002",
  "claim": "The memory_index_scan stale-record cleanup path performs causal edge cleanup before confirming the corresponding memory row delete, so a failed memory delete can leave a live memory without its causal edges.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:593-615",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:717-780",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:159-208",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:129-178"
  ],
  "counterevidenceSought": "Read vector-index delete internals and memory-crud delete transaction wiring to see whether the pre-sweep was necessary or rolled back with deleteMemory; deleteMemory already sweeps causal edges transactionally, while memory-index pre-sweeps outside that transaction.",
  "alternativeExplanation": "The pre-sweep may have been intended as defense-in-depth stale cleanup, but it duplicates the transactional delete path and creates a new failure window before the memory row delete is known to succeed.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade if deleteIndexedRecordIds removes the pre-delete sweep, or wraps edge cleanup and memory deletion in one transaction that rolls back on delete failure.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

- **F003**: Atomic `memory_save` stores mtime before the pending file is promoted. `atomicIndexMemory()` writes the pending file and calls `indexPrepared()` before `promotePendingFile()` renames the pending file into the final path [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360-379]. The `memory_save` call path indexes the prepared memory during that pre-promotion window [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3918-3953]. `createMemoryRecord()` stores `file_mtime_ms` from the final target path during index creation [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts:368-392], but that final path is still old or absent until promotion. Incremental scans treat mismatched mtimes as modified without first checking content hash [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:191-227]. The result is unnecessary repeat scan/reindex work after atomic saves until a later scan corrects the mtime.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:6-14` | Representative write/index lifecycle code was reviewed; breadth incomplete due maxIterations=1. |
| checklist_evidence | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:1-17` | No checklist.md exists in the supplied scope folder. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: all findings are first-seen in this lineage and cite concrete code evidence.
- Iteration verdict: CONDITIONAL because P1 findings were found and no P0 findings were found in this iteration.

## Ruled Out

- Retention soft-delete active-row behavior: not recorded as a finding because the current tests explicitly cover the flag-enabled behavior; this needs a stronger source-of-truth contradiction.

## Dead Ends

- Full security and maintainability coverage: blocked by `maxIterations=1`.

## Recommended Next Focus

Prioritize F001 and F002 remediation. If the lineage continues, run a security/concurrency pass over path validation, retention, provenance, idempotency, and async job cancellation.
Review verdict: CONDITIONAL
