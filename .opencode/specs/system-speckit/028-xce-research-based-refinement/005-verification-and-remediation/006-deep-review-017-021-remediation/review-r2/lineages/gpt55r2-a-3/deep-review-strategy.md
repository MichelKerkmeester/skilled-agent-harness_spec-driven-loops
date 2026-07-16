# Deep Review Strategy - gpt55r2-a-3

## 1. Topic

Fan-out deep review of `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval`.

## 2. Review Dimensions Remaining

<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, logic errors, retrieval invariants, score behavior
- [x] D2 Security, trust boundaries and scoped retrieval behavior
- [x] D3 Traceability, public schema and review-scope alignment
- [x] D4 Maintainability, bounded read-path work and drift risk
<!-- MACHINE-OWNED: END -->

## 3. Non-Goals

- Do not implement fixes.
- Do not modify target code under review.
- Do not write outside the bound lineage artifact directory.
- Do not run `resolveArtifactRoot`; artifact_dir is bound directly from `config.fanout_lineage_artifact_dir`.

## 4. Stop Conditions

- Stop after `config.maxIterations = 1`.
- Synthesize regardless of convergence because this is a fan-out lineage pass.

## 5. Completed Dimensions

<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 1 | Found two P1 retrieval correctness/scope defects. |
| Security | PASS | 1 | No credential/auth exploit found; F001 is a scoped-retrieval boundary defect rather than tenant leak evidence. |
| Traceability | PASS with advisory | 1 | Public includeArchived schema conflicts with handler/sourceContract behavior. |
| Maintainability | CONDITIONAL | 1 | Summary-channel sampling and community fallback make recall behavior hard to reason about at scale. |
<!-- MACHINE-OWNED: END -->

## 6. Running Findings

<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active
- **P2 (Minor):** 1 active
- **Delta this iteration:** +0 P0, +2 P1, +1 P2
<!-- MACHINE-OWNED: END -->

## 7. What Worked

- Cross-checking public tool schema against the handler and fallback paths exposed a scoped retrieval boundary defect. (iteration 1)
- Reading the recall-recovery channel from activation gate to candidate injection exposed the first-1000 summary sampling defect. (iteration 1)

## 8. What Failed

- Code graph structural queries were not used for claims because code graph readiness was stale (`git HEAD changed: 8b9ff540 -> 2b64f293; 442 stale files exceed selective threshold`). Direct Grep/Glob/Read fallback was used. (iteration 1)
- Spec Memory context calls rejected the supplied/generated session ids with `E_SESSION_SCOPE`; direct scope/spec reads were used instead. (iteration 1)

## 9. Exhausted Approaches

- Confidence-calibration monotonicity: read `confidence-calibration.ts`; no actionable defect recorded in one pass.
- Stage2 intent weighting recurrence: read `stage2-fusion.ts`; hybrid guard remains explicit.

## 10. Ruled Out Directions

- P0 escalation was ruled out: no finding demonstrates data loss, security breach, or hard release gate failure in this one-pass evidence set.

## 11. Next Focus

<!-- MACHINE-OWNED: START -->
Remediation planning should start with F001, because a scoped `memory_search({ specFolder })` can append community fallback rows that were not constrained by the requested folder. Then fix F002 by replacing arbitrary summary-row prefix sampling with an indexed or prefiltered candidate path.
<!-- MACHINE-OWNED: END -->

## 12. Known Context

- Scope file says this is an audit-only review of the search/retrieval subsystem and that clean PASS is valid when supported by evidence.
- Round 1 already covered cancel-delay, PAV pooling, cache mtime invalidation, and confidence weights; this pass broadened to recall/scope seams.
- `resource-map.md` not present. Skipping coverage gate.

## 13. Cross-Reference Status

<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Scope-to-code audit completed for selected search/retrieval seams; broad codebase surface not fully exhausted in one fan-out iteration. |
| `checklist_evidence` | core | pass | 1 | Not applicable: scope target has no checklist and states there is no new implementation to verify. |
| `skill_agent` | overlay | notApplicable | 1 | Target is a spec-folder review scope, not a skill. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | Target is not an agent. |
| `feature_catalog_code` | overlay | partial | 1 | Public memory_search schema drift recorded as F003. |
| `playbook_capability` | overlay | notApplicable | 1 | No playbook target in scope. |
<!-- MACHINE-OWNED: END -->

## 14. Files Under Review

<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | D1, D2, D3, D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts` | D1, D2, D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts` | D1, D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | D1, D3, D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | D3 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts` | D3 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | D1, D4 | 1 | 0 P0, 0 P1, 0 P2 | sampled |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` | D1, D4 | 1 | 0 P0, 0 P1, 0 P2 | sampled |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | D1, D3 | 1 | 0 P0, 0 P1, 0 P2 | sampled |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | sampled |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | sampled |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/recovery-payload.ts` | D1, D2 | 1 | 0 P0, 0 P1, 0 P2 | sampled |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts` | D4 | 1 | 0 P0, 0 P1, 0 P2 | sampled |
<!-- MACHINE-OWNED: END -->

## 15. Review Boundaries

<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-gpt55r2-a-3-1781761314338-6u1ztm, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-06-18T05:54:16Z
<!-- MACHINE-OWNED: END -->
