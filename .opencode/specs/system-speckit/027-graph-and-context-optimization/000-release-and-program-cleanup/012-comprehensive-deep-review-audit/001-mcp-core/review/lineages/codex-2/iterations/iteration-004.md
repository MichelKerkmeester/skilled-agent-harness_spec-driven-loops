# Iteration 4: Maintainability

## Focus
Reviewed extracted save modules, especially atomic write/index ordering and retry cleanup behavior.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.2941

## Findings

### P0, Blocker
None.

### P1, Required
- **F003**: Atomic save can commit a DB row before the pending file is promoted. `atomicIndexMemory` writes the pending file [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360`], calls `indexPrepared` before promotion [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:362`], then promotes with `renameSync` afterward [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378`]. In `memory-save.ts`, `indexPrepared` calls `processPreparedMemory()` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3581`], whose write transaction commits the memory row before returning [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2534`]. If promotion fails, the catch only restores the final file when `promotedToFinalPath` is true [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:394`], so a failed rename after a committed index can leave DB state ahead of disk state.

### P2, Suggestion
None.

## Claim Adjudication Packets
```json
{
  "findingId": "F003",
  "claim": "A pending-file promotion failure after indexPrepared succeeds can leave an indexed DB row for content that was never promoted to disk.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360-378",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:387-409",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3581-3616",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2534-2639"
  ],
  "counterevidenceSought": "Read atomic-index-memory tests and memory-save processPreparedMemory; existing tests cover indexing failures before promotion and retry success, but no promotePendingFile failure after successful indexing is covered.",
  "alternativeExplanation": "If promotion failures are considered impossible after pending write, the path is rare; however renameSync can fail due to permissions, cross-device paths, file locks, or directory races, and the helper has explicit failure handling elsewhere.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "Downgrade if file promotion is moved before DB commit, or if indexPrepared returns a transaction/compensating cleanup handle that deletes the new row when promotion fails, with a promote-failure regression.",
  "transitions": [
    {
      "iteration": 4,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3480` | Atomic save contract claims rollback guarded indexing; promotion-after-index weakens that contract. |

## Assessment
- New findings ratio: 0.2941
- Dimensions addressed: maintainability
- Novelty justification: one new P1 in the atomic save helper.

## Ruled Out
- Save path entity-density invalidation: standard save invalidates after commit and after background enrichment [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2703`].

## Dead Ends
- No new issue retained from dedup or embedding cache paths.

## Recommended Next Focus
Stabilization replay across all active findings and stop-gate evidence.
Review verdict: CONDITIONAL
