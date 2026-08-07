# Iteration 1: Search/Retrieval Correctness and Performance

## Focus
Reviewed the `A-search-retrieval` scope against the shipped search and retrieval implementation, emphasizing numeric correctness, scope-then-limit behavior, and read-path work in the hybrid retrieval stack.

## Scorecard
- Dimensions covered: correctness, performance, traceability
- Files reviewed: 6
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
None.

### P1, Required
- **F001**: SQLite lexical engine runs FTS twice and double-counts keyword evidence as BM25. In default `auto` mode, `shouldUseSqliteLexicalEngine()` returns true when `memory_fts` exists [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:1479-1491]. In that mode, `bm25Search()` delegates to `ftsSearch()` and relabels the same results as `bm25` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:435-453]. `collectAndFuseHybridResults()` still executes both the FTS lane and the BM25 lane [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1401-1418], then concatenates both arrays into the single keyword fusion list [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1497-1584]. Impact: the read path does duplicate SQLite lexical work and inflates keyword evidence for the same documents when sqlite lexical routing is active.

```json
{
  "findingId": "F001",
  "claim": "In auto/sqlite lexical mode, bm25Search delegates to ftsSearch while collectAndFuseHybridResults still runs ftsSearch and bm25Search and merges both into the keyword list, overweighting lexical matches and doing duplicate SQL on the read path.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:1479-1491",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:435-453",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1401-1418",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1497-1584"
  ],
  "counterevidenceSought": "Checked lexical engine routing, BM25 fallback behavior, channel collection, and keyword fusion construction. The code has no guard that suppresses the BM25 lane when it is backed by the same sqlite FTS query already used by the FTS lane.",
  "alternativeExplanation": "The duplicate lane could be intended as lexical convergence evidence, but in sqlite mode both lanes are the same backend and same query, so it is not independent channel agreement.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if sqlite-backed BM25 is intentionally disabled whenever FTS is active, or if fusion deduplicates same-backend lexical rows before ranking with a regression test covering auto+memory_fts.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

- **F002**: Summary embedding channel limits globally before applying scope and only exact-matches spec folders. `querySummaryEmbeddings()` fetches up to `fetchCap` rows from `memory_summaries` without a scope join or ordering [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167-175], ranks that global pool, and returns only the global top `limit` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:190-192]. Stage 1 calls it with only `(db, summaryEmbedding, limit)` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1309-1310], then applies `applyFolderFilter()` afterward; that helper only accepts `rowSpecFolder === specFolder` and does not include descendants [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147], before the post-query filters run [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1341-1343]. Impact: scoped parent-folder searches can lose valid child-folder summary hits, and any scoped search can return too few results because global top-K is selected before scope.

```json
{
  "findingId": "F002",
  "claim": "The summary-embedding channel computes an unscoped top-K first, then applies an exact spec-folder filter in Stage 1, so scoped searches can lose valid in-scope or child-folder summary hits before ranking.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167-175",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:190-192",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1309-1343",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147"
  ],
  "counterevidenceSought": "Compared summary search scoping with vector/FTS scoped patterns and searched for other applyFolderFilter call sites. The only summary filter is post-query and exact-match only.",
  "alternativeExplanation": "The summary channel may be designed as a broad recall lane, but Stage 1 still applies caller scope afterward, so the unscoped pre-limit changes observable scoped recall rather than merely adding broad candidates.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if querySummaryEmbeddings accepts and applies specFolder/governance scope before ranking/limit, including descendant folder semantics, with a regression test for parent-folder scoped search.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion
None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:6-13` | Scope resolved; two shipped-code retrieval defects found. |
| checklist_evidence | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:1-18` | Scope folder contains no checklist.md. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, performance, traceability
- Novelty justification: both findings identify current search/retrieval behavior not already represented in this lineage state.

## Ruled Out
- P0 severity: neither finding demonstrates data loss, an exploitable security boundary bypass, or a hard gate contradiction in the reviewed evidence.

## Dead Ends
- None.

## Recommended Next Focus
Fix scoped summary retrieval before global limiting, then suppress or deduplicate the sqlite-backed BM25 lane when the FTS lane already ran. Add regression coverage for scoped parent-folder retrieval and sqlite lexical auto-mode fusion.
Review verdict: CONDITIONAL
