# Deep Review Strategy - gpt55r2-a-7

## 1. Overview
Audit-only fanout lineage for scope `A-search-retrieval`.

## 2. Topic
Search and retrieval subsystem under `.opencode/skills/system-spec-kit/mcp_server/`, focused on pipeline candidate generation, confidence/recovery surfaces, fallback channels, handlers, and cross-module scope boundaries.

## 3. Review Dimensions
<!-- MACHINE-OWNED: START -->
- [x] Correctness
- [x] Security
- [x] Performance
- [x] Concurrency/cancellation
- [x] Maintainability
- [x] Spec-vs-code drift
<!-- MACHINE-OWNED: END -->

## 4. Non-Goals
- No implementation changes.
- No remediation planning beyond seed workstreams.
- No writes outside `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/lineages/gpt55r2-a-7`.

## 5. Stop Conditions
- Stop after exactly one configured iteration.
- Stop immediately on confirmed P0. No P0 was found.

## 6. Completed Dimensions
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 1 | Summary embeddings can bypass default deprecated-row exclusion. |
| Security | CONDITIONAL | 1 | Community fallback and LLM reformulation seed path miss required scope containment. |
| Performance | PASS | 1 | No new unbounded synchronous read-path blocker found beyond scoped fallback issues. |
| Concurrency/cancellation | PASS | 1 | Trigger embedding backfill is chunked/yielding and cancellation-aware. |
| Maintainability | PASS | 1 | Findings are localized to fallback/filter helper seams. |
| Spec-vs-code drift | PASS_WITH_ADVISORY | 1 | Summary embedding folder filter uses exact equality instead of descendant semantics. |
<!-- MACHINE-OWNED: END -->

## 7. Running Findings
<!-- MACHINE-OWNED: START -->
- P0: 0 active
- P1: 3 active
- P2: 1 active
- Delta this iteration: +0 P0, +3 P1, +1 P2
<!-- MACHINE-OWNED: END -->

## 8. What Worked
- Constraint tracing from handler fallback injection to final formatter showed F001 is not contained by later canonical-source filtering.
- Comparing summary channel helpers against vector/FTS hard exclusion paths showed F002 and F004.
- Tracing deep-mode LLM reformulation from seed retrieval through prompt dispatch showed F003.

## 9. What Failed
- `buildGraphExpandedFallback` was investigated as a possible leak but is not currently called by the formatter path, so no active finding was recorded.

## 10. Exhausted Approaches
- Recovery-payload graph fallback: ruled out as active user-visible behavior in this pass because call-site grep found no production caller.

## 11. Ruled Out Directions
- Multi-concept `tier` and `contextType` propagation: ruled out because Stage 1 applies post-collection filters before constitutional injection.

## 12. Next Focus
<!-- MACHINE-OWNED: START -->
Remediation should first close F001 and F003 scope leaks, then align summary-embedding filters with the canonical vector/FTS folder and deprecated-tier predicates.
<!-- MACHINE-OWNED: END -->

## 13. Known Context
- Scope file: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md`.
- Memory trigger lookup with the supplied session id failed earlier with `E_SESSION_SCOPE`; retry without `session_id` found no relevant triggers.
- Artifact binding: direct `fanout_lineage_artifact_dir` override, `resolveArtifactRoot` intentionally skipped.

## 14. Cross-Reference Status
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Scope requested retrieval correctness/security and drift; F001-F004 are direct code findings. |
| `checklist_evidence` | core | pass | 1 | Audit-only scope has no implementation checklist. |
| `feature_catalog_code` | overlay | partial | 1 | Default-on fallback channels drift from canonical scope/filter contracts. |
<!-- MACHINE-OWNED: END -->

## 15. Files Under Review
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | correctness, security, drift | 1 | F001 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts` | correctness, security | 1 | F001 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | correctness, security, drift | 1 | F002, F003, F004 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts` | correctness, performance | 1 | F002 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts` | security, drift | 1 | F003 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | correctness, drift | 1 | F004 evidence | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | correctness | 1 | F002 evidence | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` | correctness | 1 | F002 evidence | complete |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | correctness, security | 1 | containment checked | complete |
| `.opencode/skills/system-spec-kit/mcp_server/tests/community-search.vitest.ts` | test coverage | 1 | scope-only test gap | complete |
<!-- MACHINE-OWNED: END -->

## 16. Review Boundaries
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Session lineage: sessionId=`fanout-gpt55r2-a-7-1781761314338-6u1ztm`, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness state: in-progress
- Severity threshold: P2
- Started: 2026-06-18T06:20:54Z
<!-- MACHINE-OWNED: END -->
