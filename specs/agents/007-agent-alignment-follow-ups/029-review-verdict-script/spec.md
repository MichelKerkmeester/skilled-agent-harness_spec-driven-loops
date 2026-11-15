---
title: "Feature Specification: Phase 29: review-verdict-script"
description: "The review verdict is derived by the loop agent from a prose algorithm in `deep-review.yaml`, and the fan-out merge repeats the same rule twice in code. This phase puts the rule in one script that the workflow runs and the merge imports."
trigger_phrases:
  - "review verdict script"
  - "phase 29 review verdict script"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 29: review-verdict-script

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
| **Phase** | 29 of 29 |
| **Predecessor** | 028-review-scope-recording |
| **Successor** | None |
| **Handoff Criteria** | The workflow's verdict step runs the script, the merge uses the same function, the final verdict for each input matches today's rule, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 29** of the agent alignment follow-ups. It closes one follow-up phase 25 recorded.

**Scope Boundary**: A new verdict script, `fanout-merge.cjs`, and the verdict step in `deep-review.yaml`. The reducer's mid-run dashboard verdict stays as it is.

**Dependencies**:
- Phase 24's terminal gates, whose failed ids the rule reads

**Deliverables**:
- `review-verdict.cjs`
- The workflow step and the merge on that script
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`step_derive_verdict` is prose: FAIL on an active P0 or a failed required gate at the stop, CONDITIONAL on an active P1, else PASS, with `hasAdvisories` on a PASS that has P2s. The loop agent computes it by reading. `fanout-merge.cjs` holds the same rule twice. The reducer's provisional dashboard verdict also counts search debt as CONDITIONAL, which the contract (`review-mode-contract.yaml:109`) and the final verdict do not.

### Purpose
The final review verdict comes from one function, so the workflow and the merge cannot drift.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/skills/system-deep-loop/runtime/scripts | grep -c -i verdict
0
$ grep -n -A2 'step_derive_verdict:' .skilled/commands/deep/assets/deep-review.yaml
1861:      step_derive_verdict:
1862-        action: "Derive review verdict from accumulated findings"
1863-        algorithm: |
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `review-verdict.cjs` exporting `deriveReviewVerdict({ activeP0, activeP1, activeP2, failedRequiredGateIds })` and a CLI that reads the registry's active findings and the last `terminal_gates` row of the state log, or takes the merged counts and gate ids the fan-out merge bound.
- `fanout-merge.cjs` uses the function in both places.
- `step_derive_verdict` runs the script and binds `verdict` and `has_advisories`.

### Out of Scope
- The reducer's provisional dashboard verdict, which keeps search debt as a mid-run signal (decision record).
- Any change to which inputs give which verdict.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/review-verdict.cjs` | Create | The verdict rule and CLI |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/review-verdict.vitest.ts` | Create | Each verdict, advisories, CLI and the fan-out inputs |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Import the rule |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | The verdict step runs the script |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One function gives the final review verdict. | Tests cover FAIL on P0, FAIL on a failed gate, CONDITIONAL, PASS and PASS with advisories, and the merge's tests still pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The workflow runs the script for the verdict. | `step_derive_verdict` holds a command; the contract recompiles and the drift and parity checks pass |
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
| Risk | The fan-out path binds counts before the verdict step | Medium | The CLI takes bound values as flags; a test covers it |
| Dependency | Contract parity tests in spec-kit | Low | Run them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Final verdicts keep today's rule.
<!-- /ANCHOR:questions -->

---


