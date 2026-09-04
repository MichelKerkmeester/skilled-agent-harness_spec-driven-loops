---
title: "Tasks: The interaction layer for the chart corpus"
description: "Ordered work for the tooltip, the legend, the dim and the hygiene, with the verification each one owes before it is claimed."
trigger_phrases:
  - "chart interaction tasks"
  - "chart tooltip tasks"
  - "chart legend tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: The interaction layer for the chart corpus

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

- [x] T001 Baseline captured before the first edit: `RESULT: PASSED`, `Summary: errors: 0`, exit 0, 29 files, 18 checks. `scratch/baseline-render.txt`
- [x] T002 The committed picture of each interactive form captured with `git show HEAD:<path>`, never a checkout, and rendered with the corpus check's own window and budget. `scratch/first-paint.txt`, before-paint column
- [x] T003 Settled as no legend, in ADR-001. Read the file first: each row names itself in the gutter and prints its own value, and colour marks emphasis rather than identity. Per-form table updated, counts now 7 / 4 / 5 / 12 / 8
- [x] T004 Not confirmable. The vendored tree the recipe cites is not present in this checkout, so every cited line is unopened. The recipe was applied as written in `plan.md` and the numbers it carries are recorded there. The citation itself stays unverified and the implementation summary says so
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Built on `scatter` alone and proven before it moved: structural check `RESULT: PASSED`, then a headless hover on mark 15 returned `CARD=249.4x64`, `TEXT=Squad 16 | People in the squad | 14 | Tickets closed per person, per week | 9`
- [x] T006 Every card value goes through the file's own `fmt`. The em dash path proved on a scratchpad copy of `calendar-grid` carrying `NaN` in one week: the card printed `Deployments | \u2014` where the unmutated file printed `27`. `calendar-grid` was chosen because its value drives colour rather than position, so the mark still draws
- [x] T007 All six carry it. Each probed in a headless browser and each opened with real text: `scratch/pointer-touch-keyboard.txt`, and the card contents in the implementation summary
- [x] T008 One `pointermove`, one `pointerleave` and one `click` on the drawing per file, resolving the mark with `closest('[data-mark]')`. No listener is attached to a mark. `calendar-grid` binds 364 marks through three listeners
- [x] T009 Flip observed on `scatter` mark 17, the rightmost point: the card is 256.6 wide and opened at x 425.9 rather than at 717.5, which is the mark's right edge. Top and bottom are clamped to the viewBox in the same block
- [x] T010 All seven walked with synthetic touch pointers: rest closed, one tap open, held across a pointer leave, second tap closed, a tap elsewhere in the figure closed, a tap off the chart closed. 7 of 7 on every line. `scratch/pointer-touch-keyboard.txt`
- [x] T011 Built on `grouped-bars` first and proven, then carried to `stacked-bars`, `stacked-area` and `parallel-axes`. `independent-percentages` was dropped by ADR-001 rather than built. Three of the four already had a key inside the figure and it was rebuilt to the recipe, and ADR-003 records that reading
- [x] T012 Three rewritten. `grouped-bars` dropped "the darker bar of each pair is this year" for the gap inside a pair. `stacked-bars` dropped the ceiling sentence for what the shared baseline does. `stacked-area` dropped the no-substitute sentence for the crossing. `parallel-axes` already stated the range and the argument and carried no colour key, so it was left alone
- [x] T013 All five walked in a headless browser: rest 1, hover 0.3, click latched 0.3 with `aria-pressed=true`, second click cleared, Enter latched. On `daily-line` the two groups are the run of days and the day the headline is about
- [x] T014 `pointerleave` on the drawing clears a hover on all five. The probe reads 0.3 on hover and 1 after the leave, and the latched state is deliberately held across a leave, which is what a reader who clicked asked for
- [x] T015 One line, not two, on twelve forms. ADR-002 dropped the text-selection half. `grep -l ':focus:not(:focus-visible)'` lists exactly the twelve interactive forms, and `user-select` computes to `auto` on all twelve drawings
- [x] T016 Every new id is `tip-<form>` or `legend-<form>`. `unique-ids` rose from 129 assertions to 140 with 0 failures
- [x] T017 Contract section 10 names the three registers and the hygiene line, lists four things a handler may do and six it may not, and says plainly that none of it is checked. Section 9 gained a line saying the render path never points at anything. Version 1.3.0.0 to 1.4.0.0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 `RESULT: PASSED`, `Summary: errors: 0`, exit 0, with `determinism` 29/0, `settled-render` 58/0, `render` 29/0, `colour-literals` 906/0 and `unique-ids` 140/0. `scratch/check-after.txt`
- [x] T019 All twelve paint the same picture on two opens with no pointer input. Eight of them, the seven tooltip forms and `daily-line`, also paint byte-identically to the committed state. The four legend forms differ because the legend and the subtitle are this phase's deliverable. `scratch/first-paint.txt`
- [x] T020 `grep -rn 'toLocaleString' .opencode/skills/sk-doc/sk-create-chart/` printed nothing and exited 1
- [x] T021 Confirmed as exact sets rather than counts, at 7, 4 and 5, with hygiene at 12. The lists are in the implementation summary and each matches the per-form table name for name
- [x] T022 Walked headlessly, not by hand. Pointer and touch are fully exercised on all twelve. The keyboard walk covers what a synthetic event can reach: every control focuses, matches `:focus-visible`, and computes `outline-style: auto`. The pointer half of the focus rule cannot be reached headlessly, because `:focus-visible` keys on trusted input, and it stays derived from the selector rather than observed
- [x] T023 Run over all seven documents in this folder. Result in `scratch/hvr.txt`
- [x] T024 All five reconciled, plus a decision record and this implementation summary. `validate.sh --strict` prints `RESULT: PASSED` with Errors 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed, with the one gap named: the pointer half of the focus rule is derived from `:focus-visible` rather than observed, because that selector keys on trusted input
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md, with the legend count corrected to four
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the three recipes and the per-form table
- [x] CHK-003 [P1] Phase 003 closed. Its gate covers the five dim forms. The seven tooltip forms had no reduce-motion block and each gained one, because the card fades
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All eighteen check names report 0 failures from the final state
- [x] CHK-011 [P0] `render: 29 assertion(s), 0 failure(s)`, and `script-parses` 29/0
- [x] CHK-012 [P0] `colour-literals: 906 assertion(s), 0 failure(s)`, up from 890. The border is a `color-mix` on `var(--chart-rule)`
- [x] CHK-013 [P1] `no-external: 145 assertion(s), 0 failure(s)`, unchanged from the baseline
- [x] CHK-014 [P1] `card-parts: 116 assertion(s), 0 failure(s)`. No new `data-chart-part` attribute was added
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Fifteen `Met`, one `Superseded` by ADR-001
- [x] CHK-021 [P0] Redirected to `scratch/check-after.txt` and read from the file: `RESULT: PASSED`, errors 0, exit 0
- [x] CHK-022 [P0] Twelve files, not one. Same figure region and same picture on both opens, and `settled-render` agrees at 58/0
- [x] CHK-023 [P1] No render failure occurred. One probe anomaly on `daily-line` was traced to a control clipped away by the reveal animation, not to the file
- [x] CHK-024 [P1] Pointer and touch exercised on all twelve. The keyboard covers what a synthetic event can reach, and the pointer half of the focus rule stays derived
- [x] CHK-025 [P1] Proved on a scratchpad copy of `calendar-grid` carrying `NaN`. The card printed an em dash where the unmutated file printed 27
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Read as protecting the data, per ADR-003. No mark, axis label or printed value moves, and the eight forms that gain no legend paint byte-identically to the committed state. The four legend forms move their own key, which is the deliverable
- [x] CHK-FIX-002 [P0] Producer inventory taken as exact file sets rather than counts, at 7, 4 and 5, each matching the per-form table name for name
- [x] CHK-FIX-003 [P0] Taken as occurrences rather than matching lines. Level on eleven forms, up 4 to 5 on `distribution-strip`, and down on none. `scratch/formatter-inventory.txt`
- [x] CHK-FIX-004 [P1] Not applicable. No security, path, parser or redaction surface is touched
- [x] CHK-FIX-005 [P1] The axes are the twelve interactive templates and the template contract, both enumerated in plan.md
- [x] CHK-FIX-006 [P1] `determinism: 29 assertion(s), 0 failure(s)`, and the rule was watched failing on a deliberately randomised card position before being trusted
- [x] CHK-FIX-007 [P1] Every run is against the working tree. The committed state is read with `git show`, which never writes to it
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret entered any file. The data blocks are untouched
- [x] CHK-031 [P0] Every card string is assigned through `textContent`. No `innerHTML` and no markup assembly anywhere in the phase's code
- [x] CHK-032 [P1] Not applicable. There is no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance criteria, goal and the decision record all agree on 7, 4, 5, 12 and 8
- [x] CHK-041 [P1] No spec path, packet number, requirement id or task id appears in any comment this phase wrote. The comments carry the reason instead
- [x] CHK-042 [P1] Contract section 10, plus a line in section 9 saying the render path never points at anything
- [ ] CHK-043 [P2] Deferred. The playbook is out of this phase's scope boundary, which is twelve templates and the contract. The walks are recorded in `scratch/pointer-touch-keyboard.txt` for whoever writes the playbook entry
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-03. The one P2 is deferred with its reason above.
<!-- /ANCHOR:summary -->
