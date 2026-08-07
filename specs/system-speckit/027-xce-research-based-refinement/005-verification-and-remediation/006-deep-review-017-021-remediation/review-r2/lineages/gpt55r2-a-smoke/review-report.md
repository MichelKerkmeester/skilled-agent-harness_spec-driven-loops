# Deep Review Report - gpt55r2-a-smoke

## Executive Summary
Verdict: CONDITIONAL

Active findings: P0=0, P1=2, P2=0. `hasAdvisories=false`.

Scope: `.opencode/skills/system-spec-kit/mcp_server/` search and retrieval code, using the review-scope target `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md`.

Stop reason: `maxIterationsReached`. This lineage completed one configured iteration and found two active P1 defects in the default-on memory summary retrieval channel.

## Planning Trigger
Route to remediation planning before release confidence claims. Both active findings affect retrieval recall/scope behavior, and the review did not complete all requested dimensions because `config.maxIterations=1` stopped the loop after one pass.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| F001 | P1 | correctness/performance | Summary embedding search ranks only an arbitrary capped prefix | `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167-175`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:190-192`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:309-314` | active |
| F002 | P1 | traceability | Summary lane uses weaker active/scope filtering than the primary retrieval lanes | `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1322-1343`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:84-92`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:183-205` | active |

## Remediation Workstreams
| Workstream | Findings | Required Outcome |
| --- | --- | --- |
| Summary candidate retrieval semantics | F001 | Compute summary-nearest candidates over the complete eligible corpus or an indexed/scoped candidate set before applying the caller limit. |
| Summary scope and active-row parity | F002 | Apply active-memory projection and subtree specFolder semantics consistently with vector/FTS before summary candidates enter Stage 1. |

## Spec Seed
- Add an acceptance criterion that summary-embedding retrieval applies active projection and subtree `specFolder` filtering before candidate admission.
- Add an acceptance criterion that summary-embedding top-K is computed over all eligible rows, not an arbitrary capped prefix.

## Plan Seed
- Update `querySummaryEmbeddings()` to accept scope options or move summary search into a SQL query that joins `memory_index` and `active_memory_projection` before limiting.
- Replace `applyFolderFilter()` exact equality with the existing `specFolderLikePattern()` subtree predicate or remove it after pre-scoped SQL makes it redundant.
- Add regression tests with more than `fetchCap` summary rows where the relevant row appears outside the insertion-order prefix.
- Add regression tests for parent `specFolder` matching a descendant child folder through the summary channel.

## Traceability Status
| Protocol | Status | Notes |
| --- | --- | --- |
| spec_code | partial | The audit scope requested search/retrieval defects; F001/F002 are directly within the named summary/recall/scope surface. |
| checklist_evidence | partial | The scope folder contains only `spec.md`; no checklist was available. |
| feature_catalog_code | partial | Feature-catalog comments were present in reviewed search modules. |
| playbook_capability | skipped | No playbook artifact in scope. |

## Deferred Items
- Security review remains incomplete.
- Concurrency/cancellation review remains incomplete.
- Maintainability review remains incomplete.
- Confidence calibration was sampled but not exhaustively audited in this one-iteration lineage.

## Audit Appendix
| Field | Value |
| --- | --- |
| Iterations | 1 |
| Stop reason | maxIterationsReached |
| Claim adjudication | passed for F001 and F002 |
| Resource map present | false |
| Dimension coverage | 3/6 configured dimensions |
| Convergence replay | Not converged; maxIterations forced synthesis with active P1 findings. |

Final verdict: CONDITIONAL
