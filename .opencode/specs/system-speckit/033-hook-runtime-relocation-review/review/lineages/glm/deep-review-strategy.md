---
title: "Deep Review Strategy — GLM fan-out lineage (re-review after Phase 6 remediation)"
description: "Tracks the 3-iteration re-review of the hook-runtime relocation after Phase 6 P1 remediation. stop_policy=max-iterations forces all 3 iterations regardless of early convergence."
importance_tier: normal
contextType: planning
version: 1.11.0.0
---

# Deep Review Strategy — GLM fan-out lineage

## 2. TOPIC

Re-review of the `.opencode/runtime-hooks/` relocation after Phase 6 P1 remediation. The prior 5-iteration review returned CONDITIONAL (P0=0, P1=6, P2=4). All 6 P1s were remediated in Phase 6 (T017-T024). This re-review verifies: (a) the 6 original P1 fixes are correct and complete, (b) no regressions were introduced by the remediation, and (c) a repo-wide stale-path sweep catches what the prior review's narrow grep missed.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness — verify the 3 code fixes (REQ-008, REQ-009, REQ-010) are logically sound and regression-tested
- [ ] D2 Security — verify the dispatch-guard forgery hardening and credential redaction gap closure are complete
- [ ] D3 Traceability — repo-wide stale-path sweep + spec/checklist/implementation-summary alignment
- [ ] D4 Maintainability — README dependency framing, shared helper extraction, doc references
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Re-litigating the original relocation decision (already committed as `40d5f0d2b3`).
- Re-running the original 5-iteration review (archived under `review-archive/20260728T161859/`).
- Fixing any findings discovered — this is observation-only; findings route to `/speckit:plan`.

## 5. STOP CONDITIONS

- `maxIterations=3` reached (forced, per `stop_policy=max-iterations`).
- Convergence before iteration 3 is telemetry-only — broaden review angles instead of synthesizing early.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet]
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
<!-- MACHINE-OWNED: END -->

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration 1: D1 Correctness — verify the 3 code fixes (Codex multi-file patch, dispatch-guard forgery hardening, credential redaction) and run all affected test suites. Then begin a repo-wide stale-path sweep for broken imports.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers**: `.opencode/runtime-hooks/` tree (4 concern folders + shared/), `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/` spec packet, `.opencode/plugins/tests/` test files, `.opencode/skills/cli-external-orchestration/manual-testing-playbook/` playbook files.
- **Behavior claims**: REQ-008 (Codex multi-file coverage), REQ-009 (dispatch-guard forgery hardening), REQ-010 (credential redaction), REQ-011 (playbook paths), REQ-012 (6-runtimes overclaim), REQ-013 (hook-adapter-shared dependency). REQ-003/CHK-011: "No stale path reference survives outside git history."
- **Reuse and conventions**: `git mv` for history preservation; fail-open pattern throughout hooks; co-located tests in `lib/`.
- **Review risks and gaps**: The prior review's grep sweep was scoped to the 2 playbook files from R4-P1-001, not a repo-wide sweep. The remediation re-ran only directly affected test suites, not a full repo-wide stale-path audit. The `sk-git` and `system-spec-kit` skill trees contain consumers of `dispatch-rule-checks.mjs` that may not have been updated.
- **resource-map.md not present. Skipping coverage gate.**

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Verify REQ-003 (zero stale paths) against shipped state |
| `checklist_evidence` | core | pending | - | Verify CHK-011 [P0] claim matches reality |
| `skill_agent` | overlay | pending | - | N/A for spec-folder target |
| `agent_cross_runtime` | overlay | pending | - | N/A for spec-folder target |
| `feature_catalog_code` | overlay | pending | - | N/A for spec-folder target |
| `playbook_capability` | overlay | pending | - | Verify the 2 fixed playbook files |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs` | - | - | - | pending |
| `.opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs` | - | - | - | pending |
| `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs` | - | - | - | pending |
| `.opencode/runtime-hooks/shared/hook-adapter-shared.cjs` | - | - | - | pending |
| `.opencode/runtime-hooks/README.md` | - | - | - | pending |
| `.opencode/runtime-hooks/mcp-route-guard/{claude,codex,devin}/mcp-route-guard.cjs` | - | - | - | pending |
| `.opencode/runtime-hooks/task-dispatch/{claude,devin}/task-dispatch-guard.cjs` | - | - | - | pending |
| `.opencode/plugins/tests/{mk-post-edit-quality,mk-deep-loop-guard,claude-task-dispatch-guard}.test.cjs` | - | - | - | pending |
| `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/{spec,plan,tasks,checklist,implementation-summary}.md` | - | - | - | pending |
| `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/{cli-dispatch-audit-trail,codex-hook-parity}.md` | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-glm-1785248351785-j63aes, parentSessionId=fanout-glm-1785248351785-j63aes, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-07-28T14:19:11Z
<!-- MACHINE-OWNED: END -->
