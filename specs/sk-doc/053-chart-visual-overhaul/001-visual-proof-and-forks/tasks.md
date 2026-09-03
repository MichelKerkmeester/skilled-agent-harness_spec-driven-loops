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

- [x] T001 Capture the baseline corpus check with `--render` before any edit and read the `RESULT:` line (scratch/validator-before.txt). `RESULT: PASSED`, `Summary: errors: 0`, `EXIT=0`, 29 files scanned
- [x] T002 Copy both target templates into `scratch/before/` so the comparison has a control image (scratch/before/). Plus rendered controls at `scratch/shots/daily-line-before.png` and `scratch/shots/bar-columns-before.png`
- [x] T003 Record the current values of every class this phase touches, so the diff is readable later (scratch/chrome-before.txt). Carries the `.grid`, `.tick`, `.area` and `.mark` inventory across all twenty templates, not only the two touched
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 A1: dash the grid at `3 3` in a weakened rule colour, horizontal rules only (assets/templates/daily-line.html:73, assets/templates/bar-columns.html:65). `stroke-dasharray: 3 3` with `stroke-opacity: 0.75` on the existing rule token. No vertical rule was added, because neither form draws one
- [x] T005 A1b: drop the tick ink to muted rather than full strength (assets/templates/daily-line.html:79, assets/templates/bar-columns.html:67). No edit was needed. Both files already set `.tick { fill: var(--chart-muted); }`, and so does every other template in the corpus. Recorded in `scratch/chrome-before.txt`
- [x] T006 A2: move every printed number to a system mono stack with tabular figures, still routed through the file's own formatter (assets/templates/daily-line.html:85, assets/templates/bar-columns.html:72). One grouped rule per file over `.tick`, `.note` and `td.num`. The body face is untouched, so prose stays sans and only figures move
- [x] T007 A2: re-check the label width estimate against mono advances, which are wider than the sans advances it was tuned for (assets/templates/daily-line.html:236-242). A six-character `day 28` at a 0.6em mono advance is about 40 units at 11px, which is what the comment already claimed, so the thinning divisor holds. The widest bar rung is `1,000` at about 33 units against 44 units of room, so that axis holds too
- [x] T008 A7: give the line form small dots per reading and a surface-ringed dot on the point the headline is about (assets/templates/daily-line.html:74, :77, :221-227). The rendered DOM holds 28 circles at `r=2.5` and one at `r=5`, two radii as required
- [x] T009 A9: replace the flat area opacity with a vertical gradient painted from the series token and dissolving at the baseline (assets/templates/daily-line.html:64-68, :97-100, :184-189). Stops resolve through `var(--chart-series-1)` at 0.18 and 0. The gradient is bound to the plot rather than to each path's box, so a series broken by a gap fades on one ramp
- [x] T010 [P] D1: build the stroke weight comparison sheet at 2px, 1px and 0.8px over the same readings (scratch/forks/stroke-weight.html). The rendered DOM shows all three variants holding identical element counts, differing only by the `w-200`, `w-100` and `w-080` class
- [~] T011 [P] D2: ~~build the glow comparison sheet~~. SUPERSEDED by ADR-002. The operator cut the glow on 2026-09-03 before the sheet was built, so no sheet exists and no filter was authored
- [x] T012 Write both forks into `decision-record.md` with the losing argument intact and a disposition field left open (decision-record.md). ADR-001 Proposed with `Disposition: UNANSWERED`, ADR-002 Rejected with `Disposition: ANSWERED, 2026-09-03`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Re-run the corpus check with `--render` from the final state and read the `RESULT:` line (scratch/validator-after.txt). `RESULT: PASSED`, `Summary: errors: 0`, `EXIT=0`. One earlier attempt failed on an untouched example file with a browser start error. That file then rendered twice on its own at exit 0, and the re-run was clean, which is the transient the spec's edge cases describe
- [x] T014 Confirm `git diff --name-only` lists exactly two template files under `assets/`. `assets/templates/bar-columns.html` and `assets/templates/daily-line.html`, nothing else
- [x] T015 Open the comparison sheet in a browser and confirm each variant draws real marks rather than an empty frame. `scratch/shots/stroke-weight-sheet.png` shows three drawn charts, and the dumped DOM counts 5 grid lines, 2 paths, 29 circles and 11 texts in each
- [x] T016 Run `hvr_scan.py` over every document authored in this phase and require zero hard blockers. 0 hard blockers on every document in this folder
- [x] T017 Reconcile spec, plan, tasks and acceptance criteria against what shipped. The glow rows in `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` now point at ADR-002 instead of describing a file that will never exist
- [ ] T018 [B] Record the operator's answer to the weight fork in `decision-record.md` and hand off to phase 002 (decision-record.md). Blocked on the operator reading `scratch/forks/stroke-weight.html`. The glow half is already answered by ADR-002
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, except T011 superseded by ADR-002 and T018 blocked until the operator answers
- [ ] No `[B]` blocked tasks remaining. T018 stays blocked by design, because the phase exists to stop at the fork
- [x] Manual verification passed. Both templates and the comparison sheet were rendered and read as images
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Headless Chrome resolves, so `--render` can run. Found at the first candidate path the check tries
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No colour literal appears outside the palette block in either template. `colour-literals: 884 assertion(s), 0 failure(s)`
- [x] CHK-011 [P0] No console error when either template opens. Both dump a full DOM at exit 0, and the figure region holds its marks
- [x] CHK-012 [P1] Every chrome declaration refers to a `var(--chart-...)` property. The area fill names its gradient through `--chart-area-fill`, and the gradient's own stops carry `var(--chart-series-1)`
- [x] CHK-013 [P1] The gradient stops are painted from series tokens rather than from typed values. `.fade-top` and `.fade-base` at daily-line.html:67-68
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. 12 of 14 met, AC-008 superseded by ADR-002, AC-014 open until the operator answers
- [x] CHK-021 [P0] `check-corpus.cjs --render` prints `RESULT: PASSED`. Scratch/validator-after.txt
- [x] CHK-022 [P1] The comparison sheet opens with no install step and no network. One file, inline style and script, no remote reference
- [x] CHK-023 [P1] The eighteen untouched templates still pass in the same run. The check scans all 29 asset files every run and reported 0 failures across every rule
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each chrome row is classed as `instance-only` for this phase, because it is a proof on two files rather than a rollout
- [x] CHK-FIX-002 [P0] The producer inventory over `.grid`, `.tick`, `.area` and `.mark` is captured across the whole corpus, not only the two touched files. Scratch/chrome-before.txt
- [x] CHK-FIX-003 [P0] The formatter consumer inventory proves the mono change did not bypass `fmt`. Every numeric `textContent` write in both files still goes through `fmt(`, and the mono change is CSS only
- [x] CHK-FIX-005 [P1] The fork matrix lists three weights, and the sheet holds one drawing per weight. The two glow states are superseded by ADR-002
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working-tree state that produced it, named in the acceptance criteria
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No remote resource, no `@import` and no runtime fetch enters either file. `no-external: 145 assertion(s), 0 failure(s)`
- [x] CHK-032 [P1] Nothing is copied from the vendored source, and every value is re-typed against corpus properties. The vendored files were read for the dash pattern and the fade direction, and every declaration here is written against corpus tokens
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria synchronized
- [x] CHK-041 [P1] The decision record carries both losing arguments
- [x] CHK-042 [P2] The template contract is left alone, because no rule changed in this phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Comparison sheets and before-images stay in `scratch/`. Nothing outside the two templates changed under `assets/`
- [x] CHK-051 [P1] `scratch/` is reviewed before the phase closes, and anything the decision record cites is kept
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 8/9 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-03. CHK-020 is the one open P0: it waits on AC-014, which waits on the operator.
<!-- /ANCHOR:summary -->

---
