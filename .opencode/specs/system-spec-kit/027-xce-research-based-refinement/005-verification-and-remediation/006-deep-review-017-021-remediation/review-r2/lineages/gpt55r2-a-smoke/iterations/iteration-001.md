# Iteration 001: Search And Retrieval Summary-Lane Review

## Focus
Dimensions covered: correctness, performance, traceability.

Files reviewed:
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`

## Scorecard
- Dimensions covered: correctness, performance, traceability
- Files reviewed: 7
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
No P0 findings.

### P1, Required
- **F001**: Summary embedding search ranks only an arbitrary capped prefix. `querySummaryEmbeddings()` caps the SQL read to `Math.max(limit * 10, 1000)` and selects from `memory_summaries` with `LIMIT ?` before any similarity ordering, scope filtering, or active projection. It then computes cosine similarity and returns top results only from that preselected prefix. On any corpus where a highly relevant summary row lands outside that arbitrary prefix, the default-on summary channel cannot return it, creating a recall hole exactly in the large-corpus case that activates the feature. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167-175] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:190-192] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:309-314]
- **F002**: Summary lane uses weaker active/scope filtering than the primary retrieval lanes. Stage 1 hydrates summary hits with `SELECT ... FROM memory_index WHERE id IN (...)` and no `active_memory_projection` join, then applies `applyFolderFilter()`, which requires exact `rowSpecFolder === specFolder`. Vector and FTS paths apply subtree scope predicates before returning rows, and vector joins `active_memory_projection`. This means the summary lane can score/hydrate IDs under different active-row semantics and can drop descendant spec-folder hits that primary lanes retain. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1322-1343] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:84-92] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:432-455] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:183-205]

### P2, Suggestion
No P2 findings.

## Claim Adjudication Packets
```json
{
  "findingId": "F001",
  "claim": "querySummaryEmbeddings computes top-K summary matches from only an arbitrary capped prefix of memory_summaries, so high-similarity rows outside that prefix cannot be returned.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167-175",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:190-192"
  ],
  "counterevidenceSought": "Checked the caller in stage1-candidate-gen.ts and the summary module for a later corpus-wide rerank, scoped prefilter, ORDER BY, active projection join, or vector-index nearest-neighbor path; none is present before the LIMIT.",
  "alternativeExplanation": "The LIMIT is an intentional hot-path performance guard. That does not preserve top-K semantics because the cosine sort happens after the capped read rather than before or through an indexed nearest-neighbor query.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if the summary channel scopes to eligible rows and computes nearest neighbors over the complete eligible set before applying the caller limit.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery with direct code evidence"
    }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "Stage 1 rehydrates summary-channel IDs from memory_index without active_memory_projection and then applies exact spec_folder equality, giving the summary lane different active/subtree semantics from vector and FTS retrieval.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1322-1343",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:84-92",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:183-205"
  ],
  "counterevidenceSought": "Compared summary hydration and folder filtering against vector and FTS code paths. Vector and FTS use active projection/subtree predicates before returning rows; summary hydration does not, and its local folder filter is exact equality only.",
  "alternativeExplanation": "Later response formatting may drop some non-canonical rows, but it cannot restore descendant summary hits removed by exact equality or guarantee inactive IDs never affect scoring/telemetry before formatting.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if summary hydration joins active_memory_projection and uses the same specFolder subtree predicate as vector/FTS before scoring or before adding candidates.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery with direct code evidence"
    }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:6-15` | Scope requested broad search/retrieval audit; this iteration covered summary channel recall/scope. |
| checklist_evidence | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:4` | No checklist exists in the review-scope folder. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, performance, traceability
- Novelty justification: Both findings are new active defects in the summary-embedding channel, not restatements of the round-1 fix list.

## Ruled Out
- Confidence scoring weight drift: weights and calibration guards were read; no direct defect was confirmed in this iteration.
- FTS spec-folder subtree drift: FTS uses `specFolderLikePattern()` with an escaped subtree predicate.

## Dead Ends
- Full security/cancellation pass: not completed because maxIterations=1.

## Recommended Next Focus
Continue with security and cancellation review, then replay F001/F002 after fixing summary-channel corpus/scoping semantics.
Review verdict: CONDITIONAL
