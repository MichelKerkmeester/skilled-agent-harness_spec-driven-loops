# Iteration 1: Correctness

## Focus
Reviewed update cache invalidation and embedding reconcile preview/apply parity.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 6
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0000

## Findings

### P0, Blocker
None.

### P1, Required
- **F001**: `memory_update` leaves entity-density cache stale after title or trigger phrase changes. The update handler accepts title and trigger phrase mutations [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91`], the low-level update writes those fields [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:489`], but the transaction only clears the generic search cache before returning [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:619`]. The entity-density module documents an explicit invalidation API for fresh routing [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:153`].
- **F002**: `memory_embedding_reconcile` dry-run undercounts success rows missing only the active dimension vector. `computeSuccessCoverage()` counts success rows missing `vec_memories_rowids` only [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`], and dry-run reports that count as the planned repair rows [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:361`]. Apply mode repairs rows missing either rowids or the active `vec_<dim>` row [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:417`], so dry-run can under-report actual apply mutations.

### P2, Suggestion
None.

## Claim Adjudication Packets
```json
{
  "findingId": "F001",
  "claim": "memory_update can leave entity-density routing stale because title and trigger phrase updates do not call invalidateEntityDensityCache.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:489-495",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:619-625",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:153-159"
  ],
  "counterevidenceSought": "Searched for invalidateEntityDensityCache call sites across handlers, lib/search, and tests; save, bulk-delete, relation backfill, and delete helpers call it, but update_memory does not.",
  "alternativeExplanation": "Delete paths are covered through lower-level delete helpers, but update changes the title/trigger terms that entity-density indexes, so the missing update invalidation is still relevant.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if update_memory or runPostMutationHooks starts calling invalidateEntityDensityCache and a regression proves title/trigger updates rebuild without waiting for the 60s TTL.",
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

```json
{
  "findingId": "F002",
  "claim": "Dry-run success-coverage planning uses a narrower missing-vector predicate than apply mode.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281-286",
    ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:361-363",
    ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:417-420"
  ],
  "counterevidenceSought": "Compared computeSuccessCoverage, plannedMutations, and the apply UPDATE predicate; no shared predicate or dim-table check appears in the dry-run coverage count.",
  "alternativeExplanation": "The rowids table could be intended as the sole vector-presence source, but the apply repair predicate explicitly treats the dimension table as required surface too.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if computeSuccessCoverage uses the same rowid OR dimension-table absence predicate as apply and a dim-missing regression covers dry-run/apply parity.",
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

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/spec.md:35` | Correctness drift found in scoped implementation files. |

## Assessment
- New findings ratio: 1.0000
- Dimensions addressed: correctness
- Novelty justification: two independent correctness bugs with concrete source evidence.

## Ruled Out
- Delete-specific entity-density stale cache: `delete_memory_from_database` invalidates entity-density after successful delete [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:699`].

## Dead Ends
- No P0 found; neither issue directly causes data loss or security exposure.

## Recommended Next Focus
Security review of reconcile shard verification, path handling, and mutation SQL construction.
Review verdict: CONDITIONAL
