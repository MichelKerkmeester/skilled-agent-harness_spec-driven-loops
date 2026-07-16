# Deep Review Report - gpt55r2-a-4

## Executive Summary
Verdict: CONDITIONAL

The review stopped at `maxIterations=1` with two active P1 findings, zero P0 findings, and zero P2 advisories. Both findings are in the search/retrieval scope: community fallback can bypass caller `specFolder` scope, and summary embedding retrieval applies global top-K before scoped filtering. Code graph readiness was stale, so the review used direct reads and exact grep fallback.

- Active P0: 0
- Active P1: 2
- Active P2: 0
- hasAdvisories: false
- Stop reason: `maxIterationsReached`
- Release readiness: `in-progress`

## Planning Trigger
Route to remediation planning before release confidence claims. F001 affects scoped retrieval integrity for `memory_search`, and F002 affects scoped recall and summary-channel consistency. The one-iteration cap also means the full search/retrieval surface was not saturated.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | security | Community fallback ignores `specFolder` scope | `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124-170`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1160-1218`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:271-302`, `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:846-850` | active |
| F002 | P1 | correctness | Summary embedding channel ranks a global capped prefix before scoped filtering | `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167-192`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1309-1348`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:84-92`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:183-205` | active |

## Remediation Workstreams
| Workstream | Findings | Action |
|------------|----------|--------|
| Scoped community fallback | F001 | Pass `specFolder` into community fallback or apply the same descendant-aware `specFolder` predicate during member-row lookup before appending fallback rows. Include `spec_folder` in selected member rows and preserve response metadata. |
| Scoped summary retrieval | F002 | Make summary embedding retrieval scope-aware before ranking/limiting, join or otherwise honor `active_memory_projection`, and use descendant folder semantics consistent with vector and FTS lanes. |
| Regression coverage | F001, F002 | Add tests for weak primary results with scoped community fallback, parent-folder scoped summary retrieval, and out-of-scope rows competing for summary top-K. |

## Spec Seed
- Add an acceptance criterion that every retrieval channel honoring `specFolder` applies the same subtree semantics: `specFolder` and `specFolder/%` with escaped LIKE patterns.
- Add an acceptance criterion that fallback lanes must not broaden `specFolder` scope unless the response explicitly labels an intentional global fallback mode.
- Add an acceptance criterion that summary embedding candidate selection applies caller scope before top-K limiting.

## Plan Seed
1. Thread `specFolder` through `searchCommunities()` or filter community member IDs through a scoped `memory_index` join before row hydration.
2. Include `spec_folder` in community fallback member-row SELECTs and add a guard that formatted fallback rows retain correct scope metadata.
3. Extend `querySummaryEmbeddings()` to accept scope constraints or move summary ranking behind a scope-aware join with `memory_index` and active projection.
4. Replace exact-only `applyFolderFilter()` with descendant-aware scoped matching or reuse the canonical `specFolderLikePattern()` predicate before summary candidates enter Stage 1.
5. Add regression tests for scoped `memory_search` with community fallback enabled and for scoped parent-folder summary retrieval.

## Traceability Status
| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | partial | hard | Scope requested search/retrieval audit; F001/F002 are in scope and backed by code evidence. |
| checklist_evidence | partial | hard | The review-scope folder has no checklist.md; no checklist completion marks can be verified. |
| feature_catalog_code | partial | advisory | Search/retrieval features were partially audited in one iteration. |
| playbook_capability | notApplicable | advisory | No playbook surface is part of this review target. |

## Deferred Items
- Maintainability dimension was not covered because `maxIterations=1` stopped the lineage.
- Additional search surfaces remain unswept: recovery payloads, stage3 rerank, stage4 filtering, trigger embedding backfill, and cancellation/read-path resilience.
- Code graph trust was stale; structural graph checks were not used for final evidence.

## Audit Appendix
| Iteration | Focus | P0 | P1 | P2 | Verdict |
|-----------|-------|----|----|----|---------|
| 1 | Search/retrieval correctness, scope, and fallback semantics | 0 | 2 | 0 | CONDITIONAL |

Convergence replay:
- `maxIterations=1` reached after iteration 1, so synthesis is terminal by hard ceiling.
- Dimension coverage: 3/4 (`correctness`, `security`, `traceability`; missing `maintainability`).
- Required protocol coverage: partial.
- Claim adjudication: passed for both P1 findings.
- Final verdict logic: no P0 and active P1 > 0 -> CONDITIONAL.

Evidence mode:
- Code graph trust state: stale.
- Fallback methods: exact grep, direct read, comparator reads against vector and FTS retrieval lanes.
