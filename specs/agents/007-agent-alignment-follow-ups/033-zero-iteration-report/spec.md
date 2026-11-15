---
title: "Feature Specification: Phase 33: zero-iteration-report"
description: "A deep review that stops before any iteration runs, for example on its wall-clock budget, still gets a full report that asks for `/speckit:plan` and a remediation workstream, although nothing was examined. This phase adds a zero-iteration branch to the report step so the report says the review did not run and names a rerun as the next step."
trigger_phrases:
  - "zero iteration report"
  - "phase 33 zero iteration report"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 33: zero-iteration-report

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 33 of 33 |
| **Predecessor** | 032-traceability-reserve-iteration |
| **Successor** | None. Last phase of the Fable 5.2 fixes |
| **Handoff Criteria** | The report step has a zero-iteration branch, the contract notes it, a playbook scenario covers it, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 33** of the agent alignment follow-ups. It builds one fix from the Fable 5.2 report on the four known limits.

**Scope Boundary**: `deep-review.yaml` report step, a note in `review-mode-contract.yaml`, one new manual testing playbook scenario and its index entry, and the recompiled contract. Phase 25's recorded report stays as written.

**Dependencies**:
- Phase 25's live run, which produced the report this phase corrects for future runs

**Deliverables**:
- A zero-iteration branch in the report step
- A contract note
- Playbook scenario DRV-069
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`step_compile_review_report` (.skilled/commands/deep/assets/deep-review.yaml) has one shape for every stop. Phase 25's live review stopped on `maxDurationReached` with 0 of 3 iterations dispatched; its report (`specs/agents/007-agent-alignment-follow-ups/025-stop-path-live-proof/review/review-report.md`) gives FAIL from the coverage gate, correctly, but then asks for `/speckit:plan` and a remediation workstream.

### Purpose
Make a review that never ran say so, keep its verdict as the script derived it, and point the reader at a rerun instead of a plan.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 17,19p specs/agents/007-agent-alignment-follow-ups/025-stop-path-live-proof/review/review-report.md
- **Active findings:** P0 = 0, P1 = 0, P2 = 0
- **Stop reason:** `maxDurationReached` at 1 elapsed minute against a 1 minute budget
- **Iterations dispatched:** 0 of 3
$ sed -n 28p specs/agents/007-agent-alignment-follow-ups/025-stop-path-live-proof/review/review-report.md
**`/speckit:plan` is required.** The verdict is FAIL and a required quality gate is unresolved, so the next step is a remediation plan ...
# a run that examined nothing asks for a remediation plan; the report step has no branch for zero iterations
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- In `step_compile_review_report` (.skilled/commands/deep/assets/deep-review.yaml), when the state log (lineage logs on a fan-out root) holds no line with `type` `iteration`, the report opens with 'Review did not run', states the stop reason and 0 iterations dispatched, keeps the verdict from `step_derive_verdict`, says the counts mean not examined, sets the Planning Packet's `triggered` to false with `reviewDidNotRun: true` and empty workstreams, and names `/deep:review` with a budget or cap that allows one pass as the next step
- A comment above the verdicts in `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` notes that a zero-iteration FAIL comes from the coverage gate and routes to a rerun
- New scenario `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/synthesis-save-and-guardrails/zero-iteration-review-report.md` (DRV-069) and its entry in `manual-testing-playbook.md`

### Out of Scope
- Changing the verdict of a zero-iteration run; the script keeps FAIL from the failed coverage gate
- Rewriting phase 25's recorded report

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | Zero-iteration branch in the report step |
| `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` | Modify | Comment on the zero-iteration verdict |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/synthesis-save-and-guardrails/zero-iteration-review-report.md` | Create | Scenario DRV-069 |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index entry |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Modify | Recompiled |
| `.skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs` | Modify | Version constant matches the committed snapshot |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A review with zero iterations reports that it did not run. | The report step names the zero-iteration condition, keeps the derived verdict, sets `triggered` false with `reviewDidNotRun: true`, and names a `/deep:review` rerun; the contract recompiles with drift and parity passing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The behaviour is documented for manual testing. | Scenario DRV-069 exists with the playbook's sections and is linked from the index; the documentation drift check passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime suite fails nothing that passed at baseline, plus the new tests.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An agent drops the verdict for a run that did not run | Low | The branch keeps the verdict from `step_derive_verdict` and says so |
| Dependency | Contract parity tests | Low | Run them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


