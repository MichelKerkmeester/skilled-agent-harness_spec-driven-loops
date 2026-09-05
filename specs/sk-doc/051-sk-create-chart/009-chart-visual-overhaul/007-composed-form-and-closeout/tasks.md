---
title: "Tasks: The composed form and the packet closeout"
description: "Ordered work for the checker extension, the composed form, the scenario audit and the closeout, with the verification each one owes."
trigger_phrases:
  - "composed form tasks"
  - "chart checker extension tasks"
  - "chart closeout tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: The composed form and the packet closeout

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

- [x] T001 Answered yes by the operator on 2026-09-03 and recorded in `goal.md` decision D1a. The catalog gains the composed form, taking the corpus to twenty-one
- [x] T002 `RESULT: PASSED` at 20 checks, 29 files, 20 forms, 0 errors, exit 0, captured before any edit. `scratch/baseline-render.txt`
- [x] T003 Inventory read against the check before any assertion was coded. Two of the eight planned rows were already enforced by `palette-block` and `palette-source-dark`, and a third was narrowed to the half `settled-render` cannot see. Full mapping in ADR-003
- [x] T004 Recorded, and it overturned the premise the task rested on. Nineteen files carry a version and they are per-document rather than seven copies of one number. ADR-005
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 `interaction-hygiene`, at 60 assertions. Phase 004's ADR-002 settled the hygiene as one line rather than two, so the check asserts that line and separately rejects the two widenings that would take a focus ring or a copyable number away. Watched failing on `grouped-bars` and on `scatter`
- [x] T006 `number-format`, at 180 assertions over five locale routes plus the hover-card formatter rule. Watched failing on `heat-matrix` and on `treemap`
- [x] T007 `settled-render` has compared two loads since phase 003, so this became `interaction-state`, which holds the half a render comparison cannot see: a file that ships already dimmed agrees with itself on both pointer-free opens. Watched failing on `stacked-bars`
- [x] T008 Already asserted by `palette-block`, which counts regions per theme, rejects a repeated sentinel pair and matches each region against its own projection in both directions. No second check written. ADR-003
- [x] T009 Already asserted by `palette-source-dark`, which prints its own line at 34 assertions. No second check written. ADR-003
- [x] T010 `catalog-system`, at 22 assertions. Watched failing on a `scatter` row switched to `categorical`
- [x] T011 `empty-notice`, at 63 assertions over the sentinel pair, its position below the data block and the labelled block plus break that let it stop the drawing. Watched failing twice on `bar-rows`, once with the block deleted and once with only the break removed
- [x] T012 `gradient-sweep`, at 33 assertions. Stops are resolved through the classes that carry them, a fade at one series value is left alone, and it was watched failing on `daily-line`'s fade given a second series value
- [x] T013 `diff -r` against the kept copy reports one difference across `assets/` and `references/`, the `typeScale` object added on purpose, and the check prints `RESULT: PASSED`
- [x] T014 Authored from the skeleton through the contract's own eight-step route. It inherits the chrome, the corner ladder, both palette blocks, the geometry record, the empty guard, the key, the dim, the hygiene line and the reveal wipe
- [x] T015 The file divides the larger peak by the smaller and draws the right ladder at ten or more. The arithmetic sits under a heading in the drawing code with the shipped numbers worked through. Exercised on both sides. ADR-002
- [x] T016 Headline states the finding rather than the subject. `accessibility` passes over the new file, and the table carries both series as text
- [x] T017 Row added under `relationship`, gap entry deleted whole as it was written to be, and section 6's count corrected from three forms to two. ADR-001
- [x] T018 Six verdicts with the headline quoted each, in the implementation summary. All six pass and nothing was changed
- [x] T019 Refused on two grounds, with a per-form density table and the contract clause that survives a raised ceiling. ADR-006
- [x] T020 Eight documents moved, each by one step from where it actually was rather than to a single shared string. ADR-005 records why the shared string was the wrong target
- [x] T021 Section 4 gained all eight and section 5 gained break recipes for them. Four of the recipes were then run verbatim against the file they name
- [x] T022 Written, covering all seven phases, including the version convention and the one rename this release carries forward
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 `RESULT: PASSED`, read from a file rather than through a pipe. `scratch/final-render-rerun.txt`. The run before it flaked on one browser open and both are kept
- [x] T024 `chart forms under assets/templates: 21`, with `catalog` and `catalog-system` both at zero failures
- [x] T025 Four fixtures rendered and read. The gap notice was drawn outside the frame on the first pass and the frame now grows for it
- [x] T026 Confirmed by `diff -r` against the kept copy rather than against the last commit, since nothing here is committed
- [x] T027 Re-run, and the criterion it serves was replaced. One string everywhere would require a changelog entry to misname the release it documents. ADR-005
- [x] T028 Zero hard blockers on every document in this folder and on all nine edited package documents
- [x] T029 This folder reconciled. The parent phase map is the orchestrator's to reconcile and is flagged in the goal log
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining. The operator answered yes, so T014 and T017 were built rather than refused
- [x] Manual verification passed
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
- [x] CHK-003 [P0] Written first, and it shortened the list before it lengthened it. Two rows were already asserted. ADR-003
- [x] CHK-004 [P0] Answered yes on 2026-09-03, recorded as D1a before the row was written
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All 28 named checks at 0 failures, over a run that includes the eight added here
- [x] CHK-011 [P0] Both ceilings come from the series peaks through the corpus ladder, and the second ladder appears only when the peaks are an order apart. Exercised on both sides and at a rate above one hundred
- [x] CHK-012 [P0] Fourteen mutations, each red before it was green. `scratch/negative-controls.txt`
- [x] CHK-013 [P1] `no-external` passes over the new file at 150 assertions corpus-wide
- [x] CHK-014 [P1] `card-parts` and `identity` both pass, and the file declares `categorical` once
- [x] CHK-015 [P1] In the drawing code under its own heading, with the arithmetic and the shipped numbers worked through
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Twelve `Met` and one `Superseded` by ADR-005, none `Unmet`
- [x] CHK-021 [P0] `RESULT: PASSED`, read from `scratch/final-render-rerun.txt`, over twenty-one forms. The first run flaked on a browser open and was discriminated by opening the named file by hand
- [x] CHK-022 [P0] Fourteen mutations across the eight, each restored from the kept copy rather than from a checkout
- [x] CHK-023 [P1] At a spread of 510 and at a spread of 6.4, both rendered and read
- [x] CHK-024 [P1] The zero period keeps its slot with no column, and the line crosses it. This fixture also found the clipped gap notice
- [x] CHK-025 [P1] A peak of 131 raises the right ladder to 160
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Nineteen files carry a version, not seven, and they are per-document rather than copies of one string. The class holds and the target changed. ADR-005
- [x] CHK-FIX-002 [P0] Run before and after. Eight documents moved by one step each and eleven correctly did not
- [x] CHK-FIX-003 [P0] `catalog` rose from 41 to 43, which is the row and the file, and `catalog-system` reports 22
- [x] CHK-FIX-004 [P1] Not applicable, and still true after the build
- [x] CHK-FIX-005 [P1] Enumerated, with two additions recorded in the spec's file table: the palette source and the playbook
- [x] CHK-FIX-006 [P1] `determinism` passes over thirty files
- [x] CHK-FIX-007 [P1] Nothing committed, and every restore was verified against a kept copy rather than against a commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The data block holds eight weeks of demo figures and two series names
- [x] CHK-031 [P1] Not applicable, and still true
- [x] CHK-032 [P1] Not applicable, and still true
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec status, success criteria, open questions and file table reconciled, and this document carries evidence per row
- [x] CHK-041 [P1] No spec path, packet number, requirement id or task id appears in the new template or in the checker additions
- [x] CHK-042 [P1] All eight described in section 4, with break recipes in section 5 and four of them run verbatim
- [x] CHK-043 [P1] All seven, plus the version convention and the one rename carried forward
- [x] CHK-044 [P1] All six, each quoting its headline, and all six needed nothing
- [x] CHK-045 [P2] The audit changed no delivery, so the parent's row is correct as it stands. The parent phase map still needs this phase marked Complete, flagged in the goal log
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Every fixture, kept copy and run output is under `scratch/`
- [x] CHK-051 [P1] Kept: the baseline run, two intermediate runs, both final runs, the negative-control log and the four boundary fixtures with their renders. All of it is cited evidence. The working copy the restores were verified against was removed once the final comparison was written into the log, since it was a duplicate of the corpus rather than a record of anything
- [x] CHK-052 [P0] `diff -r` against the kept copy reports one difference across `assets/` and `references/`, the `typeScale` object added on purpose, and the check prints `RESULT: PASSED`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 18 | 18/18 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-03
<!-- /ANCHOR:summary -->
