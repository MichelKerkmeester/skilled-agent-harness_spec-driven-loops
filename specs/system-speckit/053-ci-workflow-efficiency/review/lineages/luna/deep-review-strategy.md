---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Review target: specs/system-speckit/053-ci-workflow-efficiency. Review the phase-parent packet and its nine phase children, including their canonical goals and planning evidence.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
No implementation changes, repository-wide validation, CI runs, or continuity save. Named implementation files are read-only evidence for packet traceability.

---

## 5. STOP CONDITIONS
Run all five iterations even if convergence signals clear the threshold early. Stop at iteration 5 with stopReason maxIterationsReached.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Root handover.md, implementation-summary.md, and resource-map.md are absent. The root spec.md and goal.md are the parent-level sources; child goals bind each phase. The scope contains 64 canonical packet documents. The root goal's continuity was last updated 2026-10-24, while several child goals carry 2026-10-25 updates, so status synchronization is a review risk.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `specs/system-speckit/053-ci-workflow-efficiency/001-research/acceptance-criteria.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/001-research/goal.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/001-research/implementation-summary.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/001-research/plan.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/001-research/spec.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/001-research/tasks.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/acceptance-criteria.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/decision-record.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/goal.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/implementation-summary.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/plan.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/spec.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/tasks.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/acceptance-criteria.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/decision-record.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/goal.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/implementation-summary.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/plan.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/spec.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/tasks.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/acceptance-criteria.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/decision-record.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/goal.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/implementation-summary.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/plan.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/spec.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/tasks.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/acceptance-criteria.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/decision-record.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/goal.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/implementation-summary.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/plan.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/spec.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/tasks.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/acceptance-criteria.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/decision-record.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/goal.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/implementation-summary.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/plan.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/spec.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/tasks.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/acceptance-criteria.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/decision-record.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/goal.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/implementation-summary.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/plan.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/spec.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/tasks.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/acceptance-criteria.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/decision-record.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/goal.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/implementation-summary.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/plan.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/spec.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/tasks.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/acceptance-criteria.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/decision-record.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/goal.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/implementation-summary.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/plan.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/spec.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/tasks.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/goal.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
| `specs/system-speckit/053-ci-workflow-efficiency/spec.md` | — | — | 0 P0, 0 P1, 0 P2 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-luna-1792944728998-0esx2f, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-10-25T16:21:33Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
