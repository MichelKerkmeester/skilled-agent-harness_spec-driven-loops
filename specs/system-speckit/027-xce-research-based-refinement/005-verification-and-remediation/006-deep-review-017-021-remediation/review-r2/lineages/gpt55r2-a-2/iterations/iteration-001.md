# Iteration 001: Correctness and Scoped Retrieval

## Focus
Reviewed the search/retrieval scope with emphasis on scoped retrieval correctness, post-pipeline fallback paths, and optional recall channels.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 10 sampled, 6 directly cited
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.60
- Code graph: stale, so findings are based on direct `Glob`, `Grep`, and `Read` evidence.

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Community fallback ignores `specFolder` and can append cross-scope memories. `searchCommunities()` scans every community summary and returns member IDs without a `specFolder` input or filter [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124-170]. `handleMemorySearch()` then fetches those member rows with `WHERE id IN (...)`, omitting both a `spec_folder` predicate and the `spec_folder` column from the selected fields [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1171-1183]. The only fallback filter applied after that is tenant/user/agent governance scope, not the caller's `specFolder` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1185-1198]. New community rows are appended directly into `resultsForFormatting` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1214-1218], and the formatter maps every supplied row into the response without re-filtering by the `specFolder` argument [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:846-850]. A scoped `memory_search` with `retrievalLevel: "auto"` or `"global"` and weak primary results can therefore return canonical rows from unrelated spec folders.

```json
{
  "findingId": "F001",
  "claim": "The community fallback path in memory_search can append canonical memories outside the caller's specFolder because community member lookup and post-lookup filtering do not apply specFolder scope.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124-170",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1171-1183",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1185-1198",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1214-1218",
    ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:846-850"
  ],
  "counterevidenceSought": "Checked the community search implementation for a specFolder parameter, the fallback row lookup for a spec_folder predicate, the post-lookup filters for specFolder enforcement, and formatter behavior for downstream re-filtering.",
  "alternativeExplanation": "Community retrieval may be intentionally global, but memory_search exposes specFolder as a scope filter and this code provides no explicit opt-out or response marker that global fallback is allowed to override it.",
  "finalSeverity": "P1",
  "confidence": 0.89,
  "downgradeTrigger": "Downgrade if the handler is changed to apply `(spec_folder = ? OR spec_folder LIKE ? ESCAPE '\\')` to community member rows, or if the public contract explicitly documents global community fallback as outside specFolder scope and the response marks it as such.",
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
- **F002**: Summary-embedding channel filters scoped parent folders by exact equality only. The helper used for summary hits returns `rowSpecFolder === specFolder` and does not accept descendants [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147]. The summary path first queries summary embeddings without passing `specFolder` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1309-1309], then fetches candidate memory rows by ID without a `spec_folder` predicate [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1320-1323], and only afterwards applies the exact-match folder filter [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1341-1343]. Other scoped search paths use the canonical descendant-aware pattern `${folder}/%` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:33-35]. This can silently drop summary-channel hits from child phase folders when the caller searches a parent spec folder.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:7-15` | Scope requests search/retrieval audit; direct code findings found. |
| checklist_evidence | skipped | hard | none | No checklist.md exists in the review-scope folder. |

## Assessment
- New findings ratio: 0.60
- Dimensions addressed: correctness
- Novelty justification: F001 is a post-pipeline fallback seam not covered by Stage 4 final limit/scope enforcement. F002 is an optional summary-channel recall defect.
- Verdict mapping: P1 present, no P0, so iteration verdict is CONDITIONAL.

## Ruled Out
- Stage 4 normal pipeline limit cap exists and is not the cause of F001 [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:305-309].
- Formatter receives `specFolder` for recovery payload context, but it formats supplied rows and does not apply a scope filter [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:782-850].

## Dead Ends
- Code graph structural queries were skipped because code graph status was stale and required full scan.

## Recommended Next Focus
Run a security/performance pass over global/community retrieval paths and verify whether community fallback should be scoped before member lookup or explicitly contractually global.
Review verdict: CONDITIONAL
