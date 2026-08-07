# Iteration 001: Correctness

## Focus
Reviewed packed BM25 index construction, async database warmup, and compaction behavior.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 2
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Async rebuild never compacts the final warmup batch. `rebuildFromDatabase()` only calls `finalizePackedPostings()` when a scheduled `processBatch()` starts with an empty batch, but after processing the final non-empty batch it sets `warmupHandle = null` and does not schedule another callback. That leaves `packedMutablePostings` resident after normal startup warmup, while `finalizePackedPostings()` is the only path that clears those construction arrays. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:510-519] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:604-617]

```json
{
  "findingId": "F001",
  "claim": "The normal async rebuild path processes the final non-empty batch without calling finalizePackedPostings(), so mutable packed postings remain resident after warmup.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:510-519",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:604-617"
  ],
  "counterevidenceSought": "Checked the final-batch branch, the empty-batch branch, direct benchmark helper, and tests around rebuildFromDatabase().",
  "alternativeExplanation": "Search can lazily materialize dirty postings later, but that does not clear the full mutable postings map and does not satisfy the startup memory-boundary claim.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If rebuildFromDatabase() finalizes immediately after the last non-empty batch and a regression test asserts mutable construction state is released, downgrade to resolved.",
  "transitions": [{ "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }]
}
```

### P2, Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:604-617` | Memory-bounded fallback claim is incomplete for production startup rebuild. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: Found one new P1 control-flow issue in the warmup lifecycle.

## Ruled Out
- P0 data corruption: search can still lazily read dirty postings, so the confirmed impact is memory-budget and lifecycle correctness, not ranking corruption.

## Dead Ends
- Direct benchmark path: it calls `finalizePackedPostings()` manually and does not represent `context-server` startup warmup.

## Recommended Next Focus
Security review of query sanitization and SQL/engine routing.
Review verdict: CONDITIONAL
