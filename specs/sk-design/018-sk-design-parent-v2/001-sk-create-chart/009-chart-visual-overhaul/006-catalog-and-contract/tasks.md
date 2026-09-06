---
title: "Tasks: Catalog and contract corrections for the chart corpus"
description: "Ordered work for the system reassignment, the empty-data notice, the type scale, the gap prose and the shared geometry defaults, with the verification each one owes."
trigger_phrases:
  - "chart catalog tasks"
  - "chart contract correction tasks"
  - "empty data notice tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Catalog and contract corrections for the chart corpus

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

- [x] T001 Capture the baseline corpus check before any edit, and read its `RESULT:` line. Two runs were needed. The first printed `RESULT: FAILED` on one `dark-render` assertion where the browser process died on `waterfall.html` and returned no document. The second, from the same untouched tree, printed `RESULT: PASSED` at 20 checks, 29 files, 0 errors, which is the baseline (.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs)
- [x] T002 Read all twenty catalog rows against the colour document's system definitions and write the verdict per row. All twenty carry a verdict in ADR-001 of `decision-record.md`, which is durable rather than scratch because the reading is the deliverable. No row changes (decision-record.md)
- [x] T003 Record the before-state font-size inventory. Nine distinct sizes across 29 files: 21px x29, 15px x30, 14px x29, 13px x92, 12px x55, 11px x29, and one each of 56px, 34px and 10px (scratch/)
- [x] T004 Record the before-state geometry inventory. Five measurements are identical in all 29 files: the 720-unit frame, the 480px pan floor, the 760px card, the 28px 28px 22px card padding and the 32px 20px page padding. The four plot insets vary per form, from a 4-unit left inset on `progress-single` to 176 on `independent-percentages` (scratch/)
- [x] T005 Capture the before-state pictures. The re-check changes no row, so all twenty forms were rendered instead of one, under a pinned light scheme, which is the wider obligation ADR-006 puts in place of the single before and after (scratch/p006-shots-before/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 No catalog system cell required correction. The re-check found no row disagreeing with the colour document, and the reasoning for the one row that was in doubt is in ADR-001. The `system` column's own description now says the cell mirrors the file rather than judging it, and points at the procedure for settling a row (references/catalog.md)
- [x] T007 No paired edit was required, because no row changed. The consumer inventory was taken anyway and is unchanged: 9 templates declare `neutral`, 8 `categorical` and 3 `ordered`, which matches the catalog column row for row (assets/templates/)
- [x] T008 The colour document now carries a four-step procedure for settling one row against the definitions, including which system wins a tie and what to do with a row that is genuinely ambiguous (references/color-system.md)
- [x] T009 The guard was built on `bar-rows` and proved on three fixtures. An empty array fires it, an array of two rows whose values are `null` and `NaN` fires it, and a single-row block does not. The second fixture failed on the first attempt and caught a real defect: the predicate coerced with `Number()` before testing, and `Number(null)` is zero, so a null reading counted as readable (assets/templates/bar-rows.html)
- [x] T010 The guard is on all twenty forms, each with a predicate written for its own data shape. Every one was rendered with an empty fixture and with its shipped block. Twenty fire, twenty stay silent (assets/templates/)
- [x] T011 Six named roles published in the skeleton section: headline 21px, body 15px, subtitle 14px, label 13px, note 12px, tick 11px, with the three per-form departures named and reasoned (references/template-contract.md)
- [x] T012 Section 6 of the catalog names sankey and radar in a table, and gives the dual-axis composed form its own heading and two paragraphs so the next phase deletes it whole rather than editing it into a row. The section sits outside the machine-read sentinels (references/catalog.md)
- [x] T013 The `GEOMETRY DEFAULTS` block is in all twenty forms and all three proof sheets, byte-identical in every one. No form departs from a value in it, so no departure comment was needed. ADR-003 records why the block is a written record rather than the indirection REQ-007 describes (assets/color/palette-sheet-neutral.html, assets/templates/)
- [x] T014 The operator answered yes on 2026-09-03. The clause is in the colour document with the approved scope, and it is applied on `progress-single`. ADR-002 records why the other two permitted forms carry no sweep (references/color-system.md)
- [x] T015 Section 4 of the contract states the behaviour beside the ceiling notices, including why readability is tested rather than length and the two ways a guard gets that wrong (references/template-contract.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Re-run from the final state. See the acceptance evidence for the read `RESULT:` line
- [x] T017 `catalog` reports 41 assertions and 0 failures, unchanged from the baseline because no row moved
- [x] T018 Twenty fire on an empty block and twenty stay silent on the shipped block, read out of the rendered figure region rather than the document, because a `--dump-dom` run echoes the inline script and the notice text is a literal in it
- [x] T019 The inventory after the phase carries the same nine sizes. Only the 12px count moved, from 55 to 70, which is the fifteen files that gained a `.notice` rule, and 12px is the published `note` role
- [x] T020 The five shared values appear 23 times each with no departure. Every per-form inset is byte-identical to the copy taken before the phase, so nothing moved
- [x] T021 All twenty forms rendered again and compared against the before set. Nineteen are byte-identical and one changed, which is `progress-single` carrying the sweep. Both of its pictures were read by eye, in both themes
- [x] T022 Zero hard blockers on every document in this folder and on all three edited references. The contract's inherited blocker is fixed, which ADR-005 records
- [x] T023 Reconciled, with `decision-record.md` and `implementation-summary.md` added and the spec's SC-001 corrected under ADR-006
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No blocked tasks remain. T014 unblocked on the operator's answer and shipped
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
- [x] CHK-003 [P0] The twenty-row re-check written down before any row was edited. It is in ADR-001, and no row was edited
- [x] CHK-004 [P1] Phases 001 through 005 closed. 005 is committed at `ddc0db1e36`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every touched template passes all fifteen corpus checks. 20 check lines, 29 files, 0 failures
- [x] CHK-011 [P0] No reassignment was made, so no pair could half-land. The consumer inventory is unchanged at 9 neutral, 8 categorical and 3 ordered
- [x] CHK-012 [P0] The guard sits immediately after the shared `node` helper and above every drawing call, and its predicate names only identifiers declared inside the data block
- [x] CHK-013 [P1] `no-external` reports 145 assertions and 0 failures
- [x] CHK-014 [P1] Nineteen of twenty forms render byte-identical to their pre-phase picture. The twentieth changed for the sweep rather than for the block
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Thirteen met and one superseded by ADR-006, with no criterion unmet
- [x] CHK-021 [P0] Run from the final state, redirected to a file and read from the file
- [x] CHK-022 [P0] Twenty fire on an empty fixture, twenty stay silent on shipped data
- [x] CHK-023 [P0] `bar-rows` handed `null` and `NaN` fires. This fixture failed on the first attempt and is what found the coercion defect
- [x] CHK-024 [P1] Proved on two forms. `bar-rows` draws its one bar with its value label, and `bar-columns`, which has a tick ladder, produces 0 to 1,000 in 200-unit steps with the bar at 840
- [x] CHK-025 [P1] Superseded with AC-003 under ADR-006. All twenty forms captured before and after instead of one
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Classed `cross-consumer` and inventoried on both sides, which is what let the audit conclude that neither side needed an edit
- [x] CHK-FIX-002 [P0] Twenty rows read between the sentinels, each with a written verdict
- [x] CHK-FIX-003 [P0] 9 neutral, 8 categorical and 3 ordered, identical before and after, and matching the catalog column row for row
- [x] CHK-FIX-004 [P1] Not applicable. No security, path, parser or redaction surface is touched
- [x] CHK-FIX-005 [P1] All three axes touched and enumerated. The scoped diff is exactly 23 asset files, 3 references and this folder
- [x] CHK-FIX-006 [P1] Nothing here reads process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working tree. Nothing is committed
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets. The only additions are a guard, a comment block and one gradient
- [x] CHK-031 [P1] The notice is one fixed string, identical in all twenty files, with nothing interpolated into it
- [x] CHK-032 [P1] Not applicable. There is no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance criteria, goal, decision record and implementation summary all reconciled
- [x] CHK-041 [P1] A scan of `assets/` for spec ids, requirement ids, task ids, decision ids, packet numbers and spec paths returns nothing
- [x] CHK-042 [P1] Zero of the gap-prose lines sit inside the sentinels, and the sentinel table is unchanged
- [x] CHK-043 [P1] The composed entry has its own heading and two paragraphs, and says in the second that it is written to be deleted whole
- [x] CHK-044 [P2] Flagged in the phase context section of `spec.md` and in the deviations table of `goal.md`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Every temporary file went to the session scratchpad. This folder has no scratch directory and gained no stray file
- [x] CHK-051 [P1] The scoped diff carries only the 23 asset files, the 3 references and this folder's documents
- [x] CHK-052 [P1] Every fixture directory removed after its proof was read
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 16 | 16/16 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-03
<!-- /ANCHOR:summary -->
