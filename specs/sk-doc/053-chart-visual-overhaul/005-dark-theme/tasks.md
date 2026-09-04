---
title: "Tasks: A dark theme for the chart corpus"
description: "Ordered work for the contract amendment, the dark palette derivation, the checker extension and the twenty-nine second blocks, with the verification each one owes."
trigger_phrases:
  - "chart dark theme tasks"
  - "dark palette tasks"
  - "palette block amendment tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->
# Tasks: A dark theme for the chart corpus

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 The operator answered yes on 2026-09-03. The sentence is in the contract and in ADR-002, and the phase log carries the answer beside the draft it was answering
- [x] T002 Baseline captured before the first edit: 29 files, 18 checks, 0 failures, `RESULT: PASSED`, exit 0, taken with `--render`
- [x] T003 Before-state inventory taken from `HEAD` rather than from a mutated tree: 286 six-digit hex values across `assets/` and `references/`, and no eight-digit value anywhere
- [x] T004 Phase 002 closed at `28d3defea8` and phases 003 and 004 landed after it, so the light values the dark twin answers were final before a single dark value was derived

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 The derivation rule now names the theme boundary as the one place a hue may be re-chosen, states the rule the dark values were chosen under, and gives the arithmetic reason a hue has to move. Version 1.2.0.0 to 1.3.0.0
- [x] T006 Rule 4 reads "one palette block per theme, two at most, each matching its own projection of the source in both directions". The skeleton, section 6, the authoring step and the limits section all carry the second block. Version 1.4.0.0 to 1.5.0.0
- [x] T007 `chromeDark` is surface `#161513`, ink `#F2F0EC` at 16.03:1, muted `#A8A5A0` at 7.43:1 and rule `#F2F0EC17`. The alpha was solved for rather than copied: nine percent is what composites to 1.26:1, which is the ratio the light edge holds against paper
- [x] T008 `neutral` runs `#E2E1DE`, `#B0AEAA`, `#8A8783`, `#686561` at 13.95, 8.24, 5.10 and 3.15 to 1, mirroring the light ladder of 13.91, 8.23, 5.10 and 3.20. Emphasis `#DD6336` reads 5.14:1 and 2.72:1 against series[0]
- [x] T009 `ordered` runs `#A1D4DC`, `#47AFBE`, `#318893`, `#28646A`, `#1F4649`, reproducing the light ladder exactly at 11.27, 7.08, 4.41, 2.71 and 1.76 to 1, with separations of 1.59, 1.61, 1.63 and 1.54. The array runs from the value furthest from the ground to the value nearest it, checked rather than assumed
- [x] T010 `categorical` rotates every slot, because a hue lands in the slot whose lightness it can reach with its chroma intact: navy 212, rust 21, green 108 and violet 282 become gold 44, cyan 192, rose 8 and violet-blue 258, at 10.00, 6.87, 4.77 and 3.38 to 1. The luminance spread that carries greyscale is the light set's spread, mirrored
- [x] T011 The gates run from one routine over a table of two themes. The run prints `palette-source` at 38 assertions and `palette-source-dark` at 34, each with its own count, and neither can be read as covering the other
- [x] T012 The check gates the end by its distance from that theme's ground rather than by its position in the array, and it asserts the array's ordering first, so a reversed ramp cannot pass by having its ends relabelled. The failure message names which end it tested
- [x] T013 `palette-block` reads a table of two regions, asserts each sentinel pair is used once, matches each region against its own projection in both directions, and rejects a dark block that carries no `prefers-color-scheme` query. 29 assertions became 116
- [x] T014 Both strippers take the region list and remove every region before judging what is left, slicing from the last region backwards so earlier offsets still hold. `colour-literals` stayed at 906 assertions and 0 failures with 256 more values in the corpus
- [x] T015 Six mutations, each watched failing on its own check. A dark value below the mark gate: 1 failure on `palette-source-dark`, light line still green. The dark ramp reversed: 5 failures on the same line. One dark value drifted in a template: `palette-block`. The dark block's media query replaced with `@media screen`: `palette-block`. The dark sentinel pair used twice: `palette-block`, and `colour-literals` caught the unstripped copy as well. The block left intact under a condition that can never be true: `dark-render` alone, on that file
- [x] T016 Every mutation restored from a copy taken before it, never from a checkout, and the check returned to `RESULT: PASSED` after each
- [x] T017 The three proof sheets first, since `palette-sheet-neutral.html` is the skeleton every future template copies
- [x] T018 Twenty forms, pasted from the exact text the check printed for each file rather than from a second implementation of the projection
- [x] T019 Six deliveries, the same way. `grep -l` returns 20, 6 and 3
- [x] T020 The gate table says the gates run once per theme against that theme's own surface, names which end of a ramp each gate holds on each ground, and says plainly that two of the gate names now read wrong on one of them

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Final `--render` run from the final state read from a file rather than through a pipe: 20 checks, 0 failures, `RESULT: PASSED`
- [x] T022 `palette-source` 38 assertions and `palette-source-dark` 34, both at 0 failures, and neither at zero assertions
- [x] T023 20 under `assets/templates/`, 6 under `assets/examples/`, 3 under `assets/color/`, 29 in total, and the same 29 carry `prefers-color-scheme: dark`
- [x] T024 Two deliveries read under a pinned dark scheme, one categorical and one neutral. The categorical delivery paints a near-black ground with gold, cyan, rose and violet squares that stay separable, a legible source line and a visible card edge. The neutral delivery paints near-white dots with the orange emphasis carrying the median marks
- [x] T025 `where-the-budget-went.html` printed to PDF from a browser pinned dark. The page carries `#1A1917`, `#52504E`, `#E0DFDC`, `#FAF8F5` and the four light category values, and no dark value at all. A probe page whose only difference between themes is a text colour printed the light branch from the same browser, which is what confirms the browser resolves the query as light while printing
- [x] T026 286 six-digit hex values became 542, all of them inside a palette region, plus 30 copies of the one eight-digit value. An independent scan that strips both regions and then looks for any hex found none
- [x] T027 `hvr_scan.py` run over every document in this folder: 0 hard blockers on each
- [x] T028 Spec, plan, tasks, acceptance criteria, goal, decision record and implementation summary reconciled against the evidence rather than against each other

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:architecture-tasks -->
## Phase 4: Architecture Tasks

- [x] T029 ADR-001 accepted, in `plan.md` and in the decision record. The re-hue was only proven once every dark value cleared its own gate, which it did on the first full run
- [x] T030 ADR-002 records the operator's yes, the sentence as it now reads in the contract, and what the old rule was protecting

<!-- /ANCHOR:architecture-tasks -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All thirty tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining. T001 was the only one, and the operator's answer cleared it
- [x] Manual verification passed: two deliveries read under a dark scheme, and one printed from a dark browser
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P0] The operator answered yes on 2026-09-03, before the first edit. ADR-002 records the answer and the sentence
- [x] CHK-004 [P1] Phase 002 closed at `28d3defea8`, with 003 and 004 landed after it
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All twenty check names report 0 failures from the final state, across 29 files
- [x] CHK-011 [P0] `colour-literals: 906 assertion(s), 0 failure(s)`, and an independent scan that strips both regions and looks for any hex found none
- [x] CHK-012 [P0] `palette-block: 116 assertion(s), 0 failure(s)`, four per file, two per theme, each direction watched failing on a drifted value
- [x] CHK-013 [P1] `no-external: 145 assertion(s), 0 failure(s)`, unchanged. The dark block sits inside the style element that was already there
- [x] CHK-014 [P1] Asserted rather than assumed: the check counts both sentinel pairs and was watched failing on a file carrying the dark pair twice
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Thirteen of thirteen met, none waived and none superseded
- [x] CHK-021 [P0] Run from the final state, redirected to a file and read from the file: `RESULT: PASSED`
- [x] CHK-022 [P0] `palette-source` 38 assertions, `palette-source-dark` 34, both 0 failures
- [x] CHK-023 [P0] Six mutations, each watched failing on its own check, each restored from a copy, with a green run after every restore
- [x] CHK-024 [P1] Two read, one categorical and one neutral, under a pinned dark scheme
- [x] CHK-025 [P1] A delivery printed to PDF from a dark browser carries the light ink, the light rule and the four light category values, and no dark value
- [x] CHK-026 [P1] Monotonic on both, in opposite directions, and the check asserts the direction rather than the lightness. A reversal was watched failing five times
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Classed `cross-consumer`. Fifty-eight projections now, two per file, and one checker reading the source
- [x] CHK-FIX-002 [P0] `chromeDark` plus `seriesDark` and `emphasisDark` on all three systems, read back from the file
- [x] CHK-FIX-003 [P0] 20 under templates, 6 under examples, 3 under color, 29 in total
- [x] CHK-FIX-004 [P1] Not applicable. No security, path, parser or redaction surface is touched
- [x] CHK-FIX-005 [P1] Those, plus the scripts README and the manual playbook, which both carried statements the amendment falsified
- [x] CHK-FIX-006 [P1] The file reads nothing. The render pins the scheme with a browser flag, because inheriting the machine's setting made the check mean different things on different machines
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working tree. This phase commits nothing
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret. The values added are colours
- [x] CHK-031 [P1] Not applicable. A template takes no input at runtime
- [x] CHK-032 [P1] Not applicable. There is no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance criteria, goal, decision record and implementation summary reconciled
- [x] CHK-041 [P1] No spec path, packet number, requirement id or task id appears in any comment added to the checker or to an asset
- [x] CHK-042 [P1] Rule 4 states the per-theme rule and the ceiling. The derivation rule names the theme boundary and gives the arithmetic reason a hue moves
- [x] CHK-043 [P1] The table says the gates run once per theme, the run prints two lines, and the colour document says which end of a ramp each gate holds on each ground
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp file was written under this folder. Working files stayed in the session scratchpad
- [x] CHK-051 [P1] No `scratch/` exists in this folder, so nothing needed cleaning. The evidence lives in the implementation summary instead
- [x] CHK-052 [P0] All six restored from copies, each confirmed by a green run, and the final render is green from the restored state
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 26 | 26/26 |
| P2 Items | 6 | 6/6 |

**Verification Date**: 2026-09-03. The counts in the original table were written before the checklist was, and they undercounted it. Nothing is deferred.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] ADR-001 accepted, in `plan.md` and in the decision record
- [x] CHK-101 [P0] ADR-002 carries the yes, the sentence and what the old rule was protecting
- [x] CHK-102 [P1] Lightening and a single neutral palette rejected in ADR-001. A neutral dark ground rejected in ADR-003. A gate-key rename proposed rather than folded in, in ADR-005
- [x] CHK-103 [P2] Not applicable. Nothing here migrates
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] `no-external` unchanged at 145 assertions and 0 failures, and every file still renders from a `file://` URL
- [x] CHK-111 [P2] Not applicable. There is no throughput target
- [x] CHK-112 [P2] Not applicable. There is no load to test
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback is a checkout of the touched files, documented in plan.md. Nothing here is committed
- [x] CHK-121 [P1] Not applicable. There is no feature flag
- [x] CHK-122 [P1] Not applicable. Nothing here is deployed or monitored
- [x] CHK-123 [P1] Scenario CHT-009 added under delivery and routing, and the package validator passes at 9 scenarios with 0 violations
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] The vendored tree is not present in this checkout, so nothing could be copied. The construction was taken from the research record and every value was derived here
- [x] CHK-131 [P1] Text at 4.5:1 and marks at 3:1 hold on both grounds, computed from the palette file on every run
- [x] CHK-132 [P2] Not applicable. There is no web application surface
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P2] Not applicable. There is no API
- [x] CHK-142 [P2] Neither carries a statement the amendment falsified. The scripts README and the manual playbook did, and both were corrected
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Contract amendment | [x] Approved | 2026-09-03 |
| Operator | Technical Lead | [ ] Approved | |
| Corpus check | QA Lead | [x] Approved | 2026-09-03 |
<!-- /ANCHOR:sign-off -->
