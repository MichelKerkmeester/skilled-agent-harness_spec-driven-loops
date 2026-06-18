# Deep Review Strategy - 020-maintenance-grace-background-embedding

## 2. TOPIC
Review the implementation of 020-maintenance-grace-background-embedding: a shared, reference-counted maintenance marker module that protects both the reindex scan and the post-scan background-embedding queue from launcher re-election.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS
- This review does not re-audit the 019 launcher-side adopt/reap guard.
- This review does not evaluate live deploy verification; it audits code and tests only.
- This review does not require fixes to be implemented; findings are reported only.

## 5. STOP CONDITIONS
- maxIterations reached (1).
- Convergence if all dimensions covered (not expected with maxIterations=1).

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 1 | No P0/P1 correctness findings; one P2 advisory about test-helper cleanup |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 1 active
- **Delta this iteration:** +0 P0, +0 P1, +1 P2

[F001] Test-only reset helper leaves on-disk marker behind — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:87-91`
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
- Direct code-path review of the three changed files against spec.md requirements.
- Cross-referencing spec.md REQ-001/REQ-002/REQ-003/REQ-004 with implementation lines.

## 9. WHAT FAILED
- N/A (first iteration).

## 10. EXHAUSTED APPROACHES (do not retry)
- N/A.

## 11. RULED OUT DIRECTIONS
- N/A.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Dimension coverage is incomplete due to maxIterations=1. Recommended next focus (if continued): D3 Traceability — verify checklist evidence and spec.md alignment for the remaining acceptance criteria.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
- 020 is a follow-on to 019-maintenance-grace-daemon-survives-reelection.
- Implementation summary reports build PASS, marker unit test PASS, scan-job + launcher-guard suites PASS, and deploy verification PASS.
- A pre-existing cross-file test-isolation flake in retry-manager.vitest.ts T49 is noted, not introduced by this phase.
- resource-map.md not present. Skipping coverage gate.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Correctness claims verified; traceability claims not yet audited |
| `checklist_evidence` | core | blocked | - | checklist.md absent at target; evidence in implementation-summary.md |
| `skill_agent` | overlay | notApplicable | - | Target is spec-folder, not skill |
| `agent_cross_runtime` | overlay | notApplicable | - | Target is spec-folder, not agent |
| `feature_catalog_code` | overlay | notApplicable | - | No feature catalog claims in scope |
| `playbook_capability` | overlay | notApplicable | - | No playbook scenarios in scope |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-p020-kimi-1-1781721166412-nlwse6, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-06-17T18:05:00Z
<!-- MACHINE-OWNED: END -->
