# Iteration 1: Search Retrieval Fallback Constraint Audit

## Focus
Reviewed the `A-search-retrieval` scope across correctness, security, performance, concurrency/cancellation, maintainability, and spec-vs-code drift. The pass focused on fallback channels and cross-module seams where canonical pipeline constraints can be lost.

## Scorecard
- Dimensions covered: correctness, security, performance, concurrency/cancellation, maintainability, spec-vs-code drift
- Files reviewed: 10
- New findings: P0=0 P1=3 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.85

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Community fallback appends members without requested search constraints. The fallback runs when the pipeline result set is weak, fetches member rows by ID only, applies only tenant/user/agent governance scope, then appends rows after the canonical Stage 4 limit and filters. Evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1166-1183`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1185-1198`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1215-1218`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1238-1240`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:271-302`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101-172`. Finding class: cross-consumer. Risk: scoped searches can return out-of-folder, wrong-tier, wrong-context, deprecated, or over-limit rows.

```json
{
  "findingId": "F001",
  "claim": "The community fallback preserves tenant/user/agent governance scope but does not preserve other memory_search constraints before appending fallback rows.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1166-1183",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1185-1198",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1215-1218",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1238-1240",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:271-302",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101-172"
  ],
  "counterevidenceSought": "Checked filterCanonicalSourceRows and community-search tests; canonical filtering only classifies source kind and existing tests cover governance scope only, not specFolder/tier/context/includeArchived/limit containment.",
  "alternativeExplanation": "The fallback may be intended as global retrieval for retrievalLevel=global, but it also runs for retrievalLevel=auto and still receives specFolder/tier/context arguments from the caller's memory_search request.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if a later response layer is proven to enforce specFolder, tier, contextType, archive/deprecated policy, and limit on community rows before formatting.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

- **F002**: Summary embedding channel can reintroduce deprecated rows into default search. `querySummaryEmbeddings()` reads all summaries without a tier predicate, Stage 1 fetches the matched `memory_index` rows by ID, and `applyArchiveFilter()` is a no-op before the summary hits are merged. Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:132-137`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:170-175`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1320-1323`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1341-1353`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:157-198`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:183-188`. Finding class: class-of-bug. Risk: deprecated memories can surface through the summary channel even though default vector/FTS/structural paths exclude them.

```json
{
  "findingId": "F002",
  "claim": "The summary embedding channel can return deprecated memory rows because the only archive/deprecated filtering helper used on that path returns its input unchanged.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:132-137",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:170-175",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1320-1323",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1341-1353",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:157-198",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:183-188"
  ],
  "counterevidenceSought": "Checked querySummaryEmbeddings, the Stage 1 memory_index fetch, summary hit filtering, hybrid hard-exclusion metadata, and FTS deprecated-tier filtering; no upstream summary predicate excludes deprecated rows.",
  "alternativeExplanation": "BM25 has comments about including cold rows in some modes, but this handler sets includeArchived compatibility to false and other default paths still carry explicit deprecated-tier filters.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if summary rows are proven to be generated only for non-deprecated memories or if a later default response gate excludes deprecated rows before return.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

- **F003**: LLM reformulation grounds prompts with unscoped corpus seed excerpts. Deep-mode reformulation calls `cheapSeedRetrieve(query, { limit: 3 })`; that helper runs `fts5Bm25Search(db, query, { limit })` without `specFolder` or governance scope, then prompt construction embeds the seed snippets and sends the prompt to the configured LLM endpoint. Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:103-121`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1170-1174`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:149-176`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:201-219`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:448-454`. Finding class: cross-consumer. Risk: a scoped deep-mode search can send unrelated or private corpus excerpts to an external LLM reformulation endpoint when configured.

```json
{
  "findingId": "F003",
  "claim": "Deep-mode LLM reformulation can send seed excerpts outside the caller's retrieval scope to the configured LLM endpoint.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:103-121",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1170-1174",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:149-176",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:201-219",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:448-454"
  ],
  "counterevidenceSought": "Checked cheapSeedRetrieve options, Stage 1 caller arguments, prompt construction, endpoint dispatch, and feature flag docs; no scope parameter is available or passed on this seed path.",
  "alternativeExplanation": "The feature only performs network dispatch when LLM_REFORMULATION_ENDPOINT is configured; however the scoped-data leak exists in exactly that supported configuration.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if the endpoint is guaranteed local-only by runtime policy or if cheapSeedRetrieve enforces specFolder and governance filters before prompt construction.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion
- **F004**: Summary embedding folder filter drops descendant folders for parent-scoped searches. The summary channel calls `applyFolderFilter()`, which accepts only exact `rowSpecFolder === specFolder`, while canonical vector scoping accepts both the folder and descendant paths via `LIKE '<folder>/%'`. Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1341-1343`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:84-93`. Finding class: instance-only. Risk: parent/track-scoped searches can lose summary-channel recall from child folders.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:7-15` | Scope requested retrieval correctness/security/drift; F001-F004 are confirmed. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:4` | Audit-only scope, no implementation checklist. |

## Assessment
- New findings ratio: 0.85
- Dimensions addressed: correctness, security, performance, concurrency/cancellation, maintainability, spec-vs-code drift
- Novelty justification: all findings are outside the prior round's stated focus on cancel-delay, PAV pooling, cache mtime invalidation, and confidence weight fixes.

## Ruled Out
- `buildGraphExpandedFallback()` user-visible leak: grep found no production caller in the formatter path.
- Multi-concept `tier`/`contextType` propagation: Stage 1 applies post-collection filters before constitutional injection.

## Dead Ends
- No P0 was supported after evidence review.

## Recommended Next Focus
Remediate fallback constraint propagation and add regression coverage for scoped community fallback, summary-channel deprecated exclusion, summary descendant scoping, and scoped LLM reformulation seeds.
Review verdict: CONDITIONAL
