# Deep Review Strategy - MCP Retrieval + Causal Review Slice

## 1. OVERVIEW

### Purpose

Review complete. The lineage reached max-iteration synthesis with active release-blocking findings.

---

## 2. TOPIC

MCP retrieval and causal implementation slice covering `memory_search`, `memory_context`, `memory_match_triggers`, `memory_drift_why`, causal stats/link/unlink behavior in the causal graph handler, and automatic causal-link processing.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, broken invariants, edge integrity
- [x] D2 Security, scoped retrieval leaks, ID-only access, trust boundaries
- [x] D3 Traceability, spec/code alignment, checklist evidence, schema/runtime drift
- [x] D4 Maintainability, contract clarity, response shape, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- Reviewed files remained read-only.
- Mutation/save path outside targeted causal handlers was not reviewed.
- Code Graph was unavailable; direct reads and `rg` were used for graphless fallback coverage.

---

## 5. STOP CONDITIONS

- Max iterations reached with active P0 findings.
- Final synthesis verdict: FAIL.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Causal edge endpoint/scope validation is missing. |
| D2 Security | FAIL | 2, 3 | Scoped retrieval fallback and causal graph ID-only access are release-blocking. |
| D3 Traceability | PASS with advisory | 4 | Required protocols covered; public/runtime causal stats schema drift found. |
| D4 Maintainability | FAIL | 5 | Fix lanes are narrow, but active P0s block release readiness. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 2 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 1 active
- **Delta final iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

- Direct comparison of scoped pipeline flow against fallback injection exposed F002 quickly.
- Causal graph review was most productive when split into public handler args, handler SQL, and storage operations.
- Schema/runtime comparison found a contract drift that would be easy to miss in behavior-only review.

---

## 9. WHAT FAILED

- Code Graph was unavailable, so structural impact was reconstructed from direct reads and `rg`.
- Legal stop was blocked twice by active P0 findings; remediation is required before a PASS or CONDITIONAL release-readiness verdict.

---

## 10. EXHAUSTED APPROACHES (do not retry)

- Re-reading normal retrieval pipeline scope filters does not disprove F002; the bypass is after the pipeline.
- Re-checking type schemas does not disprove F003; the missing control is authorization scope, not type validation.

---

## 11. RULED OUT DIRECTIONS

- Treating `memory_context` as independently vulnerable: its direct risk is transitive through `memory_search`; no separate finding was recorded.
- Treating `memory_match_triggers` as leaking scope: the handler applies exact scope filtering before formatting.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Remediation planning for F002, F003, F001, then F004. Re-run this slice after fixes with closed-gate replay for all active P0/P1 findings.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

- `resource-map.md` not present at init; coverage gate skipped.
- Parent spec requests read-only audit of five MCP retrieval/causal handlers and supporting libraries.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 2-7 | Spec review completed, but active P0 findings contradict release-readiness expectations. |
| `checklist_evidence` | core | pass | 4 | No checklist.md exists; no checked items to verify. |
| `skill_agent` | overlay | notApplicable | - | Target type is spec-folder. |
| `agent_cross_runtime` | overlay | notApplicable | - | Target type is spec-folder. |
| `feature_catalog_code` | overlay | partial | 4, 7 | Cataloged retrieval behavior exists; scoped fallback is unsafe. |
| `playbook_capability` | overlay | partial | 4, 7 | Public/runtime causal stats schema drift remains. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | D2, D4, stabilization | 7 | 1 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | final replay | 7 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts` | final replay | 7 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | D1, D2, D3, D4, stabilization | 7 | 1 P0, 1 P1, 1 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | D1, D4, stabilization | 7 | 0 P0, 1 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-codex-5-1780592070774-skng7g, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness state: release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-06-04T16:58:41Z
- Completed: 2026-06-04T17:02:45Z
<!-- MACHINE-OWNED: END -->
