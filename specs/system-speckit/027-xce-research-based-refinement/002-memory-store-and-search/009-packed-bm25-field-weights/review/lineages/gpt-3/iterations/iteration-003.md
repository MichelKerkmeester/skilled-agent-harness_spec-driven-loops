# Iteration 003: Traceability

## Focus
Compared the spec's fallback relevance-equivalence claim with the in-memory fallback routing and FTS5 SQL path.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 3
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F002**: Fallback scoped BM25 limits before applying DB-side filters. The in-memory fallback asks the index for `limit` global results first, then resolves `spec_folder` and `importance_tier` metadata and filters afterward. The FTS5 path applies spec-folder and deprecated-tier filters inside SQL before `LIMIT`. That means packed fallback can return fewer than requested, or miss in-scope matches entirely, whenever out-of-scope/deprecated rows occupy the global top-N. This is not relevance-equivalent to the primary FTS5 lexical lane. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:427-483] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:179-200]

```json
{
  "findingId": "F002",
  "claim": "In-memory fallback BM25 applies scope and deprecated-tier filtering after the top-N limit, unlike FTS5 which filters before LIMIT, so scoped fallback results are not FTS5-equivalent.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:427-483",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:179-200"
  ],
  "counterevidenceSought": "Checked the BM25 fallback search wrapper, the FTS5 query builder, and the spec-folder filtering comments around the fallback path.",
  "alternativeExplanation": "The fallback may be intended as approximate breadth coverage, but this packet's stated success criteria require fallback relevance parity and FTS5-equivalent field weighting behavior.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "If the fallback over-fetches until enough post-filter rows remain, or pushes scope/tier filters into the candidate set before limiting, and a regression test covers this scenario, downgrade to resolved.",
  "transitions": [{ "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }]
}
```

### P2, Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/spec.md:64-78` | Fallback equivalence claim is partially unmet for scoped fallback retrieval. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/tasks.md:50-81` | Evidence rows exist for Level 1 tasks. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: traceability
- Novelty justification: Found a new FTS5-equivalence gap not covered by fixture relevance tests.

## Ruled Out
- Cross-scope data leak: current fallback fails closed on metadata lookup errors and filters out mismatched rows; the issue is under-returning, not leaking. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:434-483]

## Dead Ends
- Fixture engine comparison: it compares unscoped in-memory engine scores and does not exercise hybrid fallback metadata filtering.

## Recommended Next Focus
Maintainability and regression-test coverage around startup rebuild and scoped fallback edge cases.
Review verdict: CONDITIONAL
