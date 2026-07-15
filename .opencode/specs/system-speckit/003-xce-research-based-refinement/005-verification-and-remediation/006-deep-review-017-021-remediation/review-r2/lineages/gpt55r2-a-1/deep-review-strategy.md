# Deep Review Strategy - Search/Retrieval Fan-out Lineage

## 1. Topic
Fan-out deep review of `.opencode/skills/system-spec-kit/mcp_server/` search and retrieval code for the `A-search-retrieval` review scope.

## 2. Review Dimensions (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D2 Security, trust boundaries, scoped retrieval leakage, secrets exposure
- [ ] D4 Maintainability, clarity, testability, and safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 3. Non-Goals
No fixes are implemented in this lineage. Target code remains read-only. This lineage does not claim full convergence because `config.maxIterations` is 1.

## 4. Stop Conditions
Stop after `config.maxIterations=1` or earlier convergence. This run stopped at the iteration cap and moved to synthesis with active P1 findings.

## 5. Completed Dimensions
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Scoped recall and lexical fusion defects found. |
| Performance | CONDITIONAL | 1 | Default sqlite lexical routing performs duplicate FTS work through the BM25 lane. |
| D3 Traceability | PARTIAL | 1 | Review scope was resolved, but no checklist artifact exists in the scope folder. |
<!-- MACHINE-OWNED: END -->

## 6. Running Findings
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +2 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 7. What Worked
- Reading the live search pipeline and lexical fallback path exposed two cross-module retrieval defects with direct file:line evidence.
- Comparing the scope handling in vector/FTS paths against the summary-embedding channel exposed a scope-then-limit mismatch.

## 8. What Failed
- No runnable workflow reducer was invoked in this fan-out leaf; outputs were written directly into the lineage artifact directory per the operator override.
- Full security and maintainability sweeps did not complete because the lineage was capped at one iteration.

## 9. Exhausted Approaches (do not retry)
None.

## 10. Ruled Out Directions
- P0 classification was ruled out for both findings because the observed impact is retrieval degradation/ranking bias, not demonstrated data loss, security breach, or a hard release-gate contradiction.

## 11. Next Focus
<!-- MACHINE-OWNED: START -->
Remediation should first address F002 because it violates scoped retrieval semantics, then F001 because it biases keyword fusion and adds duplicate synchronous read-path work. If another review iteration is allowed, sweep `stage3-rerank.ts`, `stage4-filter.ts`, and the handler formatter/recovery path for security and maintainability coverage.
<!-- MACHINE-OWNED: END -->

## 12. Known Context
The scope file says this is an independent review of search/retrieval shipped code, not an implementation verification task. Round 1 already covered targeted 017-021 fixes; this round broadens to the whole search/retrieval surface.

Resource-map note: `resource-map.md` was not present in the scope folder at init. Skipping coverage gate.

## 13. Cross-Reference Status
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Scope resolved to shipped search/retrieval files; F001 and F002 are in scope. |
| `checklist_evidence` | core | partial | 1 | Scope folder has no checklist.md to validate completion marks. |
| `skill_agent` | overlay | notApplicable | 1 | Target type is spec-folder, not skill. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | Target type is spec-folder, not agent. |
| `feature_catalog_code` | overlay | partial | 1 | Search/retrieval feature claims remain partially covered after one iteration. |
| `playbook_capability` | overlay | partial | 1 | No playbook-specific validation completed in this capped lineage. |
<!-- MACHINE-OWNED: END -->

## 14. Files Under Review
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | D1, Performance | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` | D1, Performance | 1 | supports F001 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | D1 | 1 | supports F002 | partial |
| `.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts` | D1 | 1 | supports F001 impact | reference-only |
<!-- MACHINE-OWNED: END -->

## 15. Review Boundaries
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-gpt55r2-a-1-1781761314338-6u1ztm, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: capped by fan-out instruction
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-06-18T05:46:20Z
<!-- MACHINE-OWNED: END -->
