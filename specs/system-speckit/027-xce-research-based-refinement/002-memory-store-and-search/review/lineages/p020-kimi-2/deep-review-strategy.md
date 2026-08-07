# Deep Review Strategy - 020-maintenance-grace-background-embedding

## 1. TOPIC

Review of the reference-counted maintenance-marker implementation that widens marker coverage from the scan job to the post-scan background-embedding queue.

## 2. REVIEW DIMENSIONS (remaining)

<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 3. NON-GOALS

- This review does not execute the build or test suites (read-only audit).
- It does not evaluate the 019 launcher-side adopt/reap guard, which is unchanged.
- It does not judge the deploy-time live reindex confirmation.

## 4. STOP CONDITIONS

- Max iterations reached (1).
- A single correctness-focused pass completes with findings recorded.
- No P0 findings requiring immediate escalation.

## 5. COMPLETED DIMENSIONS

<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Two P1 findings: synchronous scan path unprotected; marker write errors unhandled. Two P2 advisories. |
<!-- MACHINE-OWNED: END -->

## 6. RUNNING FINDINGS

<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active
- **P2 (Minor):** 2 active
- **Delta this iteration:** +0 P0, +2 P1, +2 P2
<!-- MACHINE-OWNED: END -->

## 7. WHAT WORKED

- Reading the three changed source files and the spec docs in parallel gave a clear scope picture.
- The background-embedding queue wiring in retry-manager.ts closely matches the spec wording.

## 8. WHAT FAILED

- No significant failed approaches in this single-iteration pass.

## 9. EXHAUSTED APPROACHES (do not retry)

[None yet]

## 10. RULED OUT DIRECTIONS

- Security: no new secrets or trust boundaries introduced; secrets-sanitization logic in retry-manager.ts already existed and is unchanged.
- Maintainability: code is reasonably clear; deferred to a future pass.

## 11. NEXT FOCUS

<!-- MACHINE-OWNED: START -->
Iteration budget exhausted (maxIterations=1). Proceed to synthesis.
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Phase 020 is the direct follow-on to 019.
- 019 protected the scan job; 020 widens marker coverage to the post-scan embedding queue.
- The shared marker module is new; scan and embedding queue are refactored onto it.
- No checklist.md or resource-map.md exists in the spec folder.

## 13. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Most claims verified; synchronous scan path protection gap vs spec wording |
| `checklist_evidence` | core | notApplicable | 1 | No checklist.md present |
| `skill_agent` | overlay | notApplicable | 1 | Target is a spec folder, not a skill |
| `agent_cross_runtime` | overlay | notApplicable | 1 | Target is a spec folder, not an agent |
| `feature_catalog_code` | overlay | notApplicable | 1 | No feature catalog drift detected |
| `playbook_capability` | overlay | notApplicable | 1 | No playbook scenarios reviewed |
<!-- MACHINE-OWNED: END -->

## 14. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `mcp_server/lib/storage/maintenance-marker.ts` | D1 | 1 | 1 P1, 1 P2 | partial |
| `mcp_server/handlers/memory-index.ts` | D1, D3 | 1 | 1 P1, 1 P2 | partial |
| `mcp_server/lib/providers/retry-manager.ts` | D1 | 1 | 0 | partial |
| `mcp_server/tests/maintenance-marker.vitest.ts` | D1 | 1 | 0 | partial |
| `spec.md` | D3 | 1 | 0 | partial |
| `plan.md` | D3 | 1 | 0 | partial |
| `implementation-summary.md` | D3 | 1 | 0 | partial |
<!-- MACHINE-OWNED: END -->

## 15. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-p020-kimi-2-1781721166412-nlwse6, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls max
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code,checklist_evidence], overlay=[feature_catalog_code,playbook_capability]
- Started: 2026-06-17T16:00:00Z
<!-- MACHINE-OWNED: END -->
