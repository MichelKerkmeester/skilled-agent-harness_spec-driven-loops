# Deep Review Report: Search and Retrieval Scope

## Executive Summary
Verdict: CONDITIONAL

Active findings: P0=0, P1=1, P2=1. `hasAdvisories=true`.

This lineage ran one configured iteration and stopped because `config.maxIterations=1`, not because the full review converged. The iteration found one required correctness remediation in the `memory_search` community fallback path: scoped searches can append community fallback members without applying the caller's `specFolder` scope.

## Planning Trigger
Route to remediation planning for F001. The defect affects scoped retrieval semantics, and the fix should add a regression test where weak scoped results trigger community fallback while a matched community contains members outside the requested folder.

## Active Finding Registry
| ID | Severity | Status | Title | Evidence |
| --- | --- | --- | --- | --- |
| F001 | P1 | active | Community fallback ignores `specFolder` and can append cross-scope memories | `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124-170`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1171-1183`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1185-1198`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1214-1218`; `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:846-850` |
| F002 | P2 | active | Summary-embedding channel filters scoped parent folders by exact equality only | `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1309-1323`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1341-1343`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:33-35` |

## Remediation Workstreams
| Workstream | Findings | Suggested Direction |
| --- | --- | --- |
| Scoped community fallback | F001 | Apply the same descendant-aware specFolder predicate to fallback member lookup, or filter `memberRows` with `row.spec_folder === specFolder || row.spec_folder.startsWith(specFolder + '/')` after selecting `spec_folder`. Add a regression for `retrievalLevel: "auto"` and weak primary results. |
| Scoped summary recall | F002 | Replace the exact-only `applyFolderFilter` with descendant-aware filtering, preferably reusing `specFolderLikePattern` semantics or a shared helper for in-memory folder matching. |

## Spec Seed
- Clarify whether `memory_search.specFolder` is a hard retrieval boundary for every retrieval level, including `global` and `auto` community fallback.
- If global fallback is intentionally allowed to cross folder boundaries, require explicit response provenance and opt-in semantics instead of silent mixing.

## Plan Seed
1. Add a unit/integration test where `memory_search({ specFolder, retrievalLevel: "auto" })` hits weak primary results, the matched community has both in-scope and out-of-scope members, and only in-scope rows are returned.
2. Update the community fallback member query or post-query filter to enforce descendant-aware specFolder scope.
3. Add a summary-channel test for parent specFolder queries returning child-phase summary hits.
4. Re-run the search/retrieval test subset and a scoped live-envelope regression.

## Traceability Status
| Protocol | Status | Gate | Notes |
| --- | --- | --- | --- |
| spec_code | partial | hard | The scope requested real search/retrieval defects; F001 and F002 are backed by file:line evidence. |
| checklist_evidence | skipped | hard | No checklist.md exists in the review-scope folder. |
| feature_catalog_code | partial | advisory | Search/retrieval files were sampled; one iteration did not exhaust all catalog paths. |
| playbook_capability | skipped | advisory | No playbook target in this scope. |

## Deferred Items
- P2 F002 is an advisory recall gap unless parent-folder scoped summary retrieval is a hard acceptance criterion.
- Security, performance, concurrency/cancellation, maintainability, and full spec-vs-code drift dimensions remain for sibling lineages or follow-up iterations.
- Code graph was stale; no structural graph claims are made.

## Audit Appendix
| Field | Value |
| --- | --- |
| Artifact dir | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/lineages/gpt55r2-a-2` |
| Iterations | 1 |
| Stop reason | maxIterations_reached |
| Dimension coverage | 1/6 configured dimensions |
| Replay validation | JSONL and registry agree on P0=0, P1=1, P2=1 and verdict CONDITIONAL. |
| Code graph | Stale; direct file evidence used. |
| Resource map | Not present in review-scope folder; coverage gate skipped. |

Final verdict: CONDITIONAL
