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
Review: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
Live tmux runs and runner execution are excluded by the dispatch. Reviewed source files remain read-only, and all workflow writes stay in this lineage.

---

## 5. STOP CONDITIONS
Stop at legal convergence or iteration 7. The user explicitly excluded tmux and live runner execution. Record workflow steps that would write outside this lineage as conflicts and skip those writes.

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
- P0 (Blockers): 2
- P1 (Required): 4
- P2 (Suggestions): 2
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
### checklist_evidence: PARTIAL — AC-005 evidence is incomplete; AC-011/T018 remains Unmet. -- BLOCKED (iteration 7, 4 attempts)
- What was tried: checklist_evidence: PARTIAL — AC-005 evidence is incomplete; AC-011/T018 remains Unmet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: PARTIAL — AC-005 evidence is incomplete; AC-011/T018 remains Unmet.

### checklist_evidence: PARTIAL — AC-005 is marked Met without the specs-write case in its test; AC-011/T018 is Unmet. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: checklist_evidence: PARTIAL — AC-005 is marked Met without the specs-write case in its test; AC-011/T018 is Unmet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: PARTIAL — AC-005 is marked Met without the specs-write case in its test; AC-011/T018 is Unmet.

### checklist_evidence: PARTIAL — AC-011/T018 remain marked unmet. No validation command was run. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: checklist_evidence: PARTIAL — AC-011/T018 remain marked unmet. No validation command was run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: PARTIAL — AC-011/T018 remain marked unmet. No validation command was run.

### checklist_evidence: PARTIAL — AC-011/T018 remain marked unmet. Validation was not run under the dispatch's no-repository-tooling boundary. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: checklist_evidence: PARTIAL — AC-011/T018 remain marked unmet. Validation was not run under the dispatch's no-repository-tooling boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: PARTIAL — AC-011/T018 remain marked unmet. Validation was not run under the dispatch's no-repository-tooling boundary.

### spec_code: FAIL — active cleanup, snapshot, scratch and privilege findings conflict with requirements. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: spec_code: FAIL — active cleanup, snapshot, scratch and privilege findings conflict with requirements.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: FAIL — active cleanup, snapshot, scratch and privilege findings conflict with requirements.

### spec_code: FAIL — active containment, privilege, cleanup, and snapshot findings conflict with the packet's guarantees. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: spec_code: FAIL — active containment, privilege, cleanup, and snapshot findings conflict with the packet's guarantees.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: FAIL — active containment, privilege, cleanup, and snapshot findings conflict with the packet's guarantees.

### spec_code: FAIL — active scratch, privilege, cleanup, and snapshot findings conflict with stated guarantees. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: spec_code: FAIL — active scratch, privilege, cleanup, and snapshot findings conflict with stated guarantees.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: FAIL — active scratch, privilege, cleanup, and snapshot findings conflict with stated guarantees.

### spec_code: FAIL — NFR-S02's confinement assumption does not hold for Codex's no-sandbox launch; REQ-001 also misses the project-child symlink path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: spec_code: FAIL — NFR-S02's confinement assumption does not hold for Codex's no-sandbox launch; REQ-001 also misses the project-child symlink path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: FAIL — NFR-S02's confinement assumption does not hold for Codex's no-sandbox launch; REQ-001 also misses the project-child symlink path.

### spec_code: FAIL — REQ-001, REQ-007, and REQ-008 have the mismatches described above. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: spec_code: FAIL — REQ-001, REQ-007, and REQ-008 have the mismatches described above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: FAIL — REQ-001, REQ-007, and REQ-008 have the mismatches described above.

### spec_code: FAIL — REQ-001, REQ-007, REQ-008 and NFR-S02 have the mismatches documented in the active findings. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: spec_code: FAIL — REQ-001, REQ-007, REQ-008 and NFR-S02 have the mismatches documented in the active findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: FAIL — REQ-001, REQ-007, REQ-008 and NFR-S02 have the mismatches documented in the active findings.

### spec_code: FAIL — scratch-boundary, privilege, cleanup, and snapshot guarantees remain contradicted by implementation paths. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: spec_code: FAIL — scratch-boundary, privilege, cleanup, and snapshot guarantees remain contradicted by implementation paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: FAIL — scratch-boundary, privilege, cleanup, and snapshot guarantees remain contradicted by implementation paths.

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
Continuity ladder: implementation-summary.md, spec.md, plan.md, tasks.md and acceptance-criteria.md read. The packet records a completed fake-subject suite, five probe-derived adapters and standalone MTP-007 runs; a single five-runtime matrix was rerun as matrix3. The phase remains in progress because strict packet validation is outstanding. resource-map.md is absent at init, so the resource-map coverage gate is skipped.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: the five focus files listed in Files Under Review, plus recorded probe screens and spec.md, plan.md, tasks.md, acceptance-criteria.md, and implementation-summary.md as context.
- Behavior claims: REQ-001 through REQ-008 and REQ-015, with AC-001 through AC-007, AC-012, AC-014 and CHK-011, CHK-030, CHK-031, CHK-023 as the primary checks.
- Reuse and conventions: the runner imports parseConversationScript and CONVERSATION_RUNTIMES; the validator owns JSON conversation parsing; all runtime adapters are driven from the checked-in probe screens.
- Review risks and gaps: implementation summary contains stale early limitation text before the current handoff; T018 and AC-011 remain open. No code graph is seeded because its workflow step writes outside the lineage. No live runner, tmux, or test command is permitted in this review.

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
Five declared focus files. Supporting probe screens and packet requirements are read as evidence; no live runner or tmux command will be run.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs | [] | 0 | 0 | pending |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs | [] | 0 | 0 | pending |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs | [] | 0 | 0 | pending |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs | [] | 0 | 0 | pending |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs | [] | 0 | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-luna-xhigh-1793613625067-f04kmf, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-02T10:05:06Z
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
