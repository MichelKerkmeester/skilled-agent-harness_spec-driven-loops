# Deep Review Report - gpt55r2-a-7

## Executive Summary
Verdict: CONDITIONAL.

Active findings: P0=0, P1=3, P2=1. `hasAdvisories=true`.

Scope: audit-only review of search/retrieval code under `.opencode/skills/system-spec-kit/mcp_server/`, with emphasis on fallback channels, scope containment, numeric correctness, confidence/recovery surfaces, and unbounded read-path work.

The review found no P0. It found three P1 issues where fallback/reformulation channels do not preserve retrieval constraints, plus one P2 parent-folder recall inconsistency in the summary-embedding channel.

## Planning Trigger
Route to remediation planning because active P1 findings remain. The highest-priority lane is scope containment for fallback channels that run after or outside the canonical retrieval filters.

## Active Finding Registry
### F001 - P1 - Community fallback appends members without requested search constraints
Evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1166-1183`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1185-1198`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1215-1218`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1238-1240`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:271-302`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101-172`.

Risk: weak-result fallback fetches community member rows by ID only, applies tenant/user/agent scope, then appends them after Stage 4. It does not reapply `specFolder`, `tier`, `contextType`, archived/deprecated defaults, or caller `limit`. The later canonical-source filter only classifies source type, not request constraints.

### F002 - P1 - Summary embedding channel can reintroduce deprecated rows into default search
Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:132-137`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:170-175`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1320-1323`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1341-1353`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:157-198`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:183-188`.

Risk: `querySummaryEmbeddings()` ranks all stored summary embeddings, Stage 1 fetches the corresponding `memory_index` rows by ID without a tier predicate, and `applyArchiveFilter()` currently returns rows unchanged. Other default retrieval paths explicitly exclude deprecated rows unless archival retrieval is enabled; the summary channel can bypass that contract.

### F003 - P1 - LLM reformulation grounds prompts with unscoped corpus seed excerpts
Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:103-121`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1170-1174`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:149-176`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:201-219`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:448-454`.

Risk: deep-mode reformulation retrieves seed excerpts with global BM25/FTS and sends them in the prompt to a configured LLM endpoint. The call path does not accept `specFolder`, tenant, user, or agent scope, so scoped searches can leak unrelated corpus excerpts when an endpoint is configured.

### F004 - P2 - Summary embedding folder filter drops descendant folders for parent-scoped searches
Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1341-1343`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:84-93`.

Risk: the summary channel's `applyFolderFilter()` requires exact equality while canonical vector scoping accepts the folder or descendants via `LIKE '<folder>/%'`. Parent-scoped searches can therefore miss summary hits under child folders.

## Remediation Workstreams
1. Scope community fallback with the same request constraints used by Stage 1 and Stage 4, and reapply caller `limit` after community append.
2. Add summary-channel predicates for deprecated/archive defaults and descendant `specFolder` semantics before merging summary hits.
3. Extend LLM reformulation seed retrieval to accept and enforce `specFolder`, tenant, user, and agent scope before prompt construction.
4. Add regression tests for community fallback folder/tier/context/limit containment, summary deprecated exclusion, summary descendant inclusion, and LLM seed scoping.

## Spec Seed
- Search fallback channels must preserve all request constraints: `specFolder`, governance scope, `tier`, `contextType`, archived/deprecated inclusion policy, and `limit`.
- External LLM reformulation must never receive seed excerpts outside the caller-visible retrieval scope.

## Plan Seed
- Add shared helper for post-fallback result filtering, or reuse the Stage 1 helper set in the handler fallback path.
- Change `cheapSeedRetrieve()` to accept scope options and pass them through to `fts5Bm25Search()` plus governance filters.
- Replace summary `applyFolderFilter()` exact match with descendant-aware matching equivalent to `appendSpecFolderScope()`.
- Implement tests in `tests/community-search.vitest.ts` and stage-1 pipeline tests.

## Traceability Status
| Protocol | Status | Evidence | Notes |
|----------|--------|----------|-------|
| `spec_code` | partial | scope file lines 7-15 plus F001-F004 evidence | Code under review has real drift against requested retrieval constraints. |
| `checklist_evidence` | pass | scope file line 4 | Audit-only target, no implementation checklist. |
| `feature_catalog_code` | partial | default-on flags and fallback code evidence | Default-on fallback channels miss canonical constraints. |

## Deferred Items
- No P0 found.
- P2 F004 can be addressed with F002 because both live in the summary-embedding Stage 1 filter seam.
- `buildGraphExpandedFallback()` was not reported because no formatter call site currently invokes it.

## Audit Appendix
| Iteration | Verdict | P0 | P1 | P2 | Notes |
|-----------|---------|----|----|----|-------|
| 1 | CONDITIONAL | 0 | 3 | 1 | One configured fanout pass completed. |

Coverage: 10 selected files read, 6 configured dimensions covered, 2 core traceability protocols assessed.

Stop reason: `maxIterations=1` reached. Final release-readiness state remains `in-progress` because active P1 findings require remediation.
