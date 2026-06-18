# Iteration 1: Search Retrieval Scope, Fallbacks, and Summary Candidates

## Focus
Reviewed the `A-search-retrieval` scope against shipped search/retrieval code under `.opencode/skills/system-spec-kit/mcp_server/`. The pass emphasized scoped retrieval correctness, fallback semantics, scope-then-limit ordering, and comparator behavior in primary retrieval lanes.

Code graph status was stale (`code_graph_status` reported stale readiness), so this iteration used graphless fallback with exact Grep/Glob and direct file reads.

## Scorecard
- Dimensions covered: correctness, security, traceability
- Files reviewed: 9
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00
- Iteration verdict: CONDITIONAL

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Community fallback ignores `specFolder` scope. `searchCommunities()` scans every `community_summaries` row and returns member IDs without accepting or applying a `specFolder` filter [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124-170]. `handleMemorySearch()` enables that fallback for `retrievalLevel === 'global' || retrievalLevel === 'auto'` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1160-1165], then fetches the member rows with `WHERE id IN (...)` and no `spec_folder` predicate while also omitting `spec_folder` from the selected fields [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1171-1183]. The only fallback filter applied afterward is tenant/user/agent governance scope, not caller `specFolder` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1185-1198], and new rows are appended to the response set [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1214-1218]. The later canonical-source filter only classifies source type [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:271-302], and the formatter maps whatever rows it receives into response envelopes without a `specFolder` check [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:846-850]. Impact: a scoped `memory_search` can return canonical rows from unrelated spec folders when primary retrieval is weak and community fallback is enabled.

```json
{
  "findingId": "F001",
  "claim": "The community fallback path in memory_search can append canonical memories outside the caller's specFolder because community member lookup and post-lookup filtering do not apply specFolder scope.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124-170",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1160-1218",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:271-302",
    ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:846-850"
  ],
  "counterevidenceSought": "Checked downstream canonical-source filtering and response formatting for a later specFolder filter; checked governance filtering and found only tenant/user/agent scope is applied on the fallback rows.",
  "alternativeExplanation": "Community fallback might be intended as a global recall lane, but memory_search exposes specFolder as a scope filter and the fallback does not mark an explicit opt-out or re-scope rows before returning them.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if the community fallback is explicitly made global by contract and response metadata, or if member lookup/filtering applies the same specFolder subtree predicate as the primary pipeline before rows are appended.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

- **F002**: Summary embedding channel ranks a global capped prefix before scoped filtering. `querySummaryEmbeddings()` fetches `LIMIT fetchCap` rows from `memory_summaries` without scope, active projection, or deterministic ordering [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167-175], computes cosine similarity over that prefix, sorts it, and returns only the global top `limit` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:190-192]. Stage 1 calls it with only `(db, summaryEmbedding, limit)` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1309-1309], hydrates those IDs from `memory_index` without joining `active_memory_projection` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1321-1323], then applies `applyFolderFilter()` after the global top-K [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1341-1348]. That helper requires exact folder equality and excludes descendants [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147]. By contrast, vector/FTS scoped lanes use descendant-aware `specFolder`/`specFolder/%` predicates before limiting [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:84-92] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:183-205], and vector joins `active_memory_projection` before ranking [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:452-455]. Impact: parent-folder scoped searches can drop valid child-folder summary hits, and any scoped search can return too few summary candidates because out-of-scope rows consume the global top-K before the caller scope is applied.

```json
{
  "findingId": "F002",
  "claim": "The summary embedding channel selects a global capped top-K before applying caller scope and active-row semantics, so scoped searches can silently lose valid in-scope summary candidates.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167-192",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1309-1348",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:84-92",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:452-455",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:183-205"
  ],
  "counterevidenceSought": "Checked the summary query, Stage 1 hydration/filtering, primary vector scope helpers, and FTS scope predicates for a pre-ranking specFolder filter, descendant scope semantics, or active projection join in the summary lane; none was present before top-K selection.",
  "alternativeExplanation": "The summary channel may be intended as broad recall, but Stage 1 still applies caller scope after retrieving only global top-K summary hits, so the broad lane changes scoped recall rather than merely contributing extra candidates.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if summary retrieval accepts specFolder/scope input, applies active projection and descendant folder semantics before ranking/limiting, and has regression coverage for parent-folder scoped searches.",
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
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:6-15` | Scope requests search/retrieval audit; F001/F002 are in named retrieval surfaces. |
| checklist_evidence | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:4` | The review-scope folder contains no checklist.md; no completion checklist can be verified. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1296-1359` | Summary channel behavior partially audited. |
| playbook_capability | notApplicable | advisory | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:1-18` | No playbook is part of this review scope. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability
- Novelty justification: both findings are newly recorded in this lineage and were verified by opening the cited live source files.
- Verdict mapping: any P1 and no P0 -> `Review verdict: CONDITIONAL`.

## Ruled Out
- P0 classification for F001: tenant/user/agent filtering is applied to fallback rows before append; no cross-tenant leak was shown.
- P0 classification for F002: evidence shows retrieval degradation/scope drift, not data loss or direct security breach.
- Clean PASS: rejected because both P1 findings have direct file/line evidence and affect retrieval semantics named by the scope.

## Dead Ends
- Code graph structural traversal: unavailable for trusted use because graph readiness was stale; direct read fallback supplied evidence.
- Full surface saturation: impossible under `maxIterations=1`; maintainability and additional recovery/cancellation paths remain search debt.

## Recommended Next Focus
Remediate F001 before claiming `specFolder` scoped retrieval integrity, then make summary embedding retrieval scope-aware before top-K limiting. If another review iteration is allowed, sweep recovery payloads, stage3/stage4 filters, and cancellation/read-path resilience.
Review verdict: CONDITIONAL
