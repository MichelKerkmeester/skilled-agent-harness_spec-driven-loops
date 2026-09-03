---
title: "Tasks: Prove the chrome on two forms and settle the weight and glow forks"
description: "Ordered work for the five chrome rows, the two comparison sheets and the decision record, with the verification each one owes."
trigger_phrases:
  - "chart chrome proof tasks"
  - "fork comparison tasks"
  - "chart decision tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Prove the chrome on two forms and settle the weight and glow forks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the baseline corpus check with `--render` before any edit and read the `RESULT:` line (scratch/validator-before.txt)
- [ ] T002 Copy both target templates into `scratch/before/` so the comparison has a control image (scratch/before/)
- [ ] T003 Record the current values of every class this phase touches, so the diff is readable later (scratch/chrome-before.txt)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 A1: dash the grid at `3 3` in a weakened rule colour, horizontal rules only (assets/templates/daily-line.html, assets/templates/bar-columns.html)
- [ ] T005 A1b: drop the tick ink to muted rather than full strength (assets/templates/daily-line.html, assets/templates/bar-columns.html)
- [ ] T006 A2: move every printed number to a system mono stack with tabular figures, still routed through the file's own formatter (assets/templates/daily-line.html, assets/templates/bar-columns.html)
- [ ] T007 A2: re-check the label width estimate against mono advances, which are wider than the sans advances it was tuned for (assets/templates/daily-line.html, assets/templates/bar-columns.html)
- [ ] T008 A7: give the line form small dots per reading and a surface-ringed dot on the point the headline is about (assets/templates/daily-line.html)
- [ ] T009 A9: replace the flat area opacity with a vertical gradient painted from the series token and dissolving at the baseline (assets/templates/daily-line.html)
- [ ] T010 [P] D1: build the stroke weight comparison sheet at 2px, 1px and 0.8px over the same readings (scratch/forks/stroke-weight.html)
- [ ] T011 [P] D2: build the glow comparison sheet, one low-opacity blur layer behind the emphasis line against no layer (scratch/forks/emphasis-glow.html)
- [ ] T012 Write both forks into `decision-record.md` with the losing argument intact and a disposition field left open (decision-record.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Re-run the corpus check with `--render` from the final state and read the `RESULT:` line (scratch/validator-after.txt)
- [ ] T014 Confirm `git diff --name-only` lists exactly two template files under `assets/`
- [ ] T015 Open both comparison sheets in a browser and confirm each variant draws real marks rather than an empty frame
- [ ] T016 Run `hvr_scan.py` over every document authored in this phase and require zero hard blockers
- [ ] T017 Reconcile spec, plan, tasks and acceptance criteria against what actually shipped
- [ ] T018 [B] Record the operator's answer to both forks in `decision-record.md` and hand off to phase 002 (decision-record.md)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, except T018 which stays blocked until the operator answers
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Headless Chrome resolves, so `--render` can run
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No colour literal appears outside the palette block in either template
- [ ] CHK-011 [P0] No console error when either template opens
- [ ] CHK-012 [P1] Every chrome declaration refers to a `var(--chart-...)` property
- [ ] CHK-013 [P1] The gradient stops are painted from series tokens rather than from typed values
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] `check-corpus.cjs --render` prints `RESULT: PASSED`
- [ ] CHK-022 [P1] Both comparison sheets open with no install step and no network
- [ ] CHK-023 [P1] The eighteen untouched templates still pass in the same run
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each chrome row is classed as `instance-only` for this phase, because it is a proof on two files rather than a rollout
- [ ] CHK-FIX-002 [P0] The producer inventory over `.grid`, `.tick`, `.area` and `.mark` is captured across the whole corpus, not only the two touched files
- [ ] CHK-FIX-003 [P0] The formatter consumer inventory proves the mono change did not bypass `fmt`
- [ ] CHK-FIX-005 [P1] The fork matrix lists three weights and two glow states, and the sheet holds one cell per combination it claims
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the working-tree state that produced it, named in the acceptance criteria
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No remote resource, no `@import` and no runtime fetch enters either file
- [ ] CHK-032 [P1] Nothing is copied from the vendored source, and every value is re-typed against corpus properties
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria synchronized
- [ ] CHK-041 [P1] The decision record carries both losing arguments
- [ ] CHK-042 [P2] The template contract is left alone, because no rule changed in this phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Comparison sheets and before-images stay in `scratch/`
- [ ] CHK-051 [P1] `scratch/` is reviewed before the phase closes, and anything the decision record cites is kept
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->

---
