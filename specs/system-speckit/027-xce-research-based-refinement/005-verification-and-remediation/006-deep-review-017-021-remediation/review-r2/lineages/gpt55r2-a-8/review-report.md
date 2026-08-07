# Deep Review Report - Search Retrieval Scope

## Executive Summary
Verdict: **FAIL**

Active findings: P0=1, P1=1, P2=0. `hasAdvisories=false`.

Stop reason: `maxIterationsReached` after 1 configured iteration. Release readiness: `release-blocking`.

The review found one active governed-retrieval bypass in the default-on retrieval rescue layer and one required correctness fix in the community fallback filter replay path.

## Planning Trigger
Route to remediation planning before release. F001 blocks release because it can expose rows outside tenant/user/agent scope after the pipeline has already determined that governed retrieval filtering is required.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P0 | security | Retrieval rescue bypasses governed scope after Stage 1 filtering | `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:292-319`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1369-1373` | active |
| F002 | P1 | correctness | Community fallback appends rows outside caller retrieval filters | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1177-1183`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1214-1219` | active |

## Remediation Workstreams
1. Scope preservation for retrieval rescue: pass normalized scope and caller filters into `applyRetrievalRescueLayer()`, enforce them in backfill and sibling queries or immediately post-fetch, and add governed retrieval regression coverage.
2. Community fallback filter replay: filter `rawMemberRows` by `specFolder`, `tier`, `contextType`, archive policy, and quality threshold before append. Add tests for weak-result fallback under scoped and filtered calls.
3. End-to-end fallback safety: add a regression that executes `memory_search` with governed scope and forced rescue/community fallback, then asserts every returned row satisfies the same boundary as the primary pipeline.

## Spec Seed
- Require every post-Stage-1 candidate injection path to replay tenant/user/agent governance and caller-supplied retrieval filters before rows can enter the final result set.
- Define `specFolder` as a hard retrieval filter for fallback paths unless a caller explicitly requests global retrieval and the response marks the result as global.

## Plan Seed
- T1: Extend retrieval rescue options with normalized scope plus `specFolder`, `tier`, `contextType`, `includeArchived`, and quality threshold.
- T2: Apply the same filter helper to rescue backfill, rescue sibling rows, and community fallback rows.
- T3: Add tests covering governed rescue leakage, scoped community fallback leakage, and cache-key stability for filtered fallback responses.
- T4: Re-run search/retrieval unit tests and this audit scope.

## Traceability Status
| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | partial | hard | Scoped retrieval behavior partially contradicts fallback implementation. |
| checklist_evidence | pass | hard | No checklist exists in the review-scope packet. |
| feature_catalog_code | partial | advisory | Governed retrieval exists in Stage 1 but is not preserved by retrieval rescue. |
| playbook_capability | partial | advisory | Weak-result fallback needs scoped-filter replay coverage. |

## Deferred Items
- Maintainability dimension was not fully covered because this fan-out lineage was capped at one iteration.
- Numeric calibration and BM25 weight review had no active finding in this pass.

## Audit Appendix
| Iteration | Focus | Dimensions | Findings | Stop |
|-----------|-------|------------|----------|------|
| 1 | fallback scope-boundary audit | security, correctness, traceability | P0=1 P1=1 P2=0 | maxIterationsReached |

Replay summary: JSONL contains a config record, one iteration record, one passed claim-adjudication event, and one synthesis event. Final verdict is FAIL because activeP0=1.

Continuity save: skipped because the fan-out instruction forbids writes outside the lineage artifact directory.
