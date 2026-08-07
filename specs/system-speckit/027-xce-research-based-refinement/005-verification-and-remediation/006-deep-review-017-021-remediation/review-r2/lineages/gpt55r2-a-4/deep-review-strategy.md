# Deep Review Strategy - gpt55r2-a-4

## 1. Topic
Fan-out deep review of `.opencode/skills/system-spec-kit/mcp_server/` search and retrieval code for the `A-search-retrieval` review scope.

## 2. Review Dimensions (Remaining)
- [ ] D4 Maintainability, patterns, documentation quality, safe follow-on change cost

## 3. Non-Goals
- Do not implement fixes.
- Do not mutate code under review.
- Do not write outside the supplied lineage artifact directory.
- Do not treat sibling lineage findings as ground truth without reopening source evidence.

## 4. Stop Conditions
- Stop after `config.maxIterations=1`.
- Stop if a confirmed P0 is found after recording adversarial self-check evidence.
- Stop after synthesis writes the review report and state packet.

## 5. Completed Dimensions
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Summary embedding retrieval performs global top-K before scoped filtering, causing scoped recall loss. |
| D2 Security | CONDITIONAL | 1 | Community fallback can append cross-specFolder rows because it never applies the caller's specFolder scope. |
| D3 Traceability | CONDITIONAL | 1 | Scope spec maps to the reviewed shipped files; checklist evidence is partial because the review-scope folder has no checklist. |

## 6. Running Findings
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +2 P1, +0 P2

## 7. What Worked
- Exact Grep plus direct reads found the fallback and scope-filtering seams despite stale code graph readiness.
- Re-reading downstream formatting and canonical filtering prevented over-claiming F001 as a tenant governance bypass.
- Comparing summary retrieval against vector/FTS scope predicates separated intended broad recall from a real scope-then-limit defect.

## 8. What Failed
- Code graph structural queries were not trusted because `code_graph_status` reported stale readiness; direct evidence was used instead.
- The single-iteration cap left maintainability and broader cancellation/read-path resilience unswept.

## 9. Exhausted Approaches
- None. This lineage stopped because `maxIterations=1`, not because the search surface was saturated.

## 10. Ruled Out Directions
- P0 for F001: no tenant/user/agent governance bypass was confirmed; the handler filters those fields before appending rows.
- P0 for F002: no data loss or security breach was demonstrated; the defect is scoped recall degradation and inconsistent retrieval semantics.

## 11. Next Focus
If this lineage continued, sweep `stage3-rerank.ts`, `stage4-filter.ts`, recovery payload shaping, and cancellation/read-path resilience. Remediation should first apply `specFolder` scope to community fallback member lookup and make summary embedding retrieval scope-aware before top-K limiting.

## 12. Known Context
- Scope file: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md`.
- The scope says this is a review-only audit of shipped search/retrieval code and a clean PASS is valid if no real defects are found.
- Code graph trust state: stale. Fallback evidence: direct reads and exact grep.
- Resource map at scope init: absent; coverage gate skipped for scope-local `resource-map.md`.

## 13. Cross-Reference Status
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Scope resolved to shipped search/retrieval code; F001 and F002 are directly inside the named surface. |
| `checklist_evidence` | core | partial | 1 | Review-scope folder has only `spec.md`; no checklist exists to verify. |
| `feature_catalog_code` | overlay | partial | 1 | Search/retrieval feature behavior partially audited in one iteration. |
| `playbook_capability` | overlay | notApplicable | 1 | No playbook surface in this review scope. |

## 14. Files Under Review
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts` | D2, D3 | 1 | supports F001 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | D2, D3 | 1 | F001 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | D2, D3 | 1 | supports F001 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts` | D1, D3 | 1 | F002 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | D1, D3 | 1 | F002 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | D1, D3 | 1 | comparator for F002 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` | D1, D3 | 1 | comparator for F002 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts` | D1, D3 | 1 | comparator for F002 | partial |

## 15. Review Boundaries
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-gpt55r2-a-4-1781761314338-6u1ztm, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-06-18T05:54:11Z
