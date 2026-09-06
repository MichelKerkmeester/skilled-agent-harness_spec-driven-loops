---
title: "Tasks: Close every deferral the packet left: repair the pointer-only readings, enforce the readout rule, and require a contract row per form"
description: "Repair three tables so no card outruns its data, add the two corpus rules that make the property enforceable, watch each rule fail before trusting it, then close every open item the parent packet carried."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Close every deferral the packet left: repair the pointer-only readings, enforce the readout rule, and require a contract row per form

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

- [x] T001 Sweep all 27 corpus files with a synthetic pointer walk and record which cards show a value their table does not carry, before changing anything (`assets/templates/`, `assets/examples/`) — Evidence: pointer walk over all 27 files. Two forms failed and one flagged falsely: `distribution-strip` (38, 40, 51, 51, 49, 69, 43, 54 absent from its table), `pick-times-by-depot` (62, 54, 58, 77, 50, 74, 71), and `stacked-area` (851, 769, 502, 244), whose four values proved to be exactly its series-column sums over 24 rows
- [x] T002 Copy the four files this phase edits aside, outside the packet, so every mutation has a byte-identical restore (`assets/templates/distribution-strip.html`, `assets/templates/stacked-area.html`, `assets/examples/pick-times-by-depot.html`, `scripts/check-corpus.cjs`) — Evidence: copies taken to a scratch directory outside the packet; the contract and strip restores below are proven by matching sha256
- [x] T003 Confirm `node scripts/check-corpus.cjs` prints `RESULT: PASSED` on the untouched tree, so a later failure is attributable — Evidence: `RESULT: PASSED` on the untouched tree before the first edit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Give `distribution-strip` a table column carrying every record in sorted order, behind the five-number summary rather than replacing it, and correct the caption and description that both claimed the table carried the summary alone (`assets/templates/distribution-strip.html`) — Evidence: header gains "Every record, sorted", the row builder appends the sorted readings after the four summary cells, and both the caption and the `desc` no longer claim the table holds the summary alone
- [x] T005 [P] Apply the same repair to the delivery, using its own vocabulary of orders and depots (`assets/examples/pick-times-by-depot.html`) — Evidence: same repair in its own vocabulary, "Every order, sorted", caption and `desc` corrected
- [x] T006 [P] Give `stacked-area` a table foot carrying the whole-period total per series, which is what its card reads out and the one figure its monthly rows never state (`assets/templates/stacked-area.html`) — Evidence: `<tfoot>` renders `Total, whole period | 851 | 769 | 502 | 244 | 2,366`, matching an independent column sum of the table body
- [x] T007 Add `pointer-contract-coverage`: read the per-form table out of the contract document, cut at the next heading, and fail a form on disk with no row and a row with no form (`scripts/check-corpus.cjs`) — Evidence: rule lands at 42 assertions, 0 failures on the green corpus (21 forms on disk plus 21 rows declared)
- [x] T008 Add `card-readout`: inside the render pass, write an instrumented copy of each card-carrying file to a temporary directory, drive a pointer across a sample of marks, and fail any card showing a number its table does not carry (`scripts/check-corpus.cjs`) — Evidence: rule lands at 17 assertions, 0 failures under `--render`, one per card-carrying file (13 templates plus 4 deliveries)
- [x] T009 Handle the readout rule's own failure modes as errors rather than silent passes: driver never attached, driver produced nothing, card never opened, form declares a card and carries no table (`scripts/check-corpus.cjs`) — Evidence: four states are errors rather than passes: no `</body>` to attach to, no result node, `card-never-opened`, and a declared card with no table
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Re-sweep all 27 files and confirm no card shows a value its table does not carry (`assets/templates/`, `assets/examples/`) — Evidence: re-sweep of all 27 files reports "all-card-numbers-in-table" on every card-carrying file and "SKIP no marks" on the inert and terminal ones
- [x] T011 Run `node scripts/check-corpus.cjs --render` and read the literal `RESULT:` line (`scripts/check-corpus.cjs`) — Evidence: `RESULT: PASSED`, 0 errors, both new rules green. An earlier run failed `settled-render` on `treemap`; a browser invocation error under load, reproduced clean 3 times in isolation with byte-identical DOM and PNG while 63 Chrome processes from another session were saturating the machine, then clean again on re-run. A second flake of the same class, `dark-render` on `candlestick`, was fixed rather than re-rolled: `openOnce` now retries a failed spawn once, and only the spawn, so a document that disagrees with its twin still fails
- [x] T012 Watch `card-readout` fail: remove a reading from a repaired table, confirm `RESULT: FAILED` names the form and the missing value, restore and confirm `RESULT: PASSED` (`assets/templates/distribution-strip.html`) — Evidence: removing `tr.appendChild(every);` from `distribution-strip` produced `x card-readout: 17 assertion(s), 1 failure(s)` and `FAIL [card-readout] assets/templates/distribution-strip.html: the card shows 7 value(s) the data table does not carry (38, 40, 51, 49, 69, 43, 54)`, then `RESULT: FAILED`. Seven rather than eight because one sampled reading also appears as a summary cell, which is the rule being precise rather than loose. Restored from a byte-identical copy, sha256 `4228625da1b8f3c0` matching the pre-mutation value
- [x] T013 Watch `pointer-contract-coverage` fail in the form-without-a-row direction: delete a row from the contract table, confirm the failure names the form, restore (`references/template-contract.md`) — Evidence: deleting the `treemap` row produced `FAIL [pointer-contract-coverage] assets/templates/treemap.html: this form has no row in the pointer contract table`, then `RESULT: FAILED`. Restored, sha256 matches, `RESULT: PASSED`
- [x] T014 Watch it fail in the row-without-a-form direction: add a row for a form that does not exist, confirm the failure names it, restore (`references/template-contract.md`) — Evidence: adding a `sunburst` row produced `FAIL [pointer-contract-coverage] references/template-contract.md: the contract table has a row for "sunburst" and no such form exists`, then `RESULT: FAILED`. Restored, sha256 `0933871747e3f3e3` matches the pre-mutation value, `RESULT: PASSED`
- [x] T015 Document both rules in section 4 and both mutation recipes in section 5 (`scripts/README.md`) — Evidence: both rules documented in section 4, the bullet count corrected from six to eight, and three mutation recipes added to section 5
- [x] T016 State the readout rule in the contract and correct the `distribution-strip` row, which described a table that no longer exists (`references/template-contract.md`) — Evidence: rule count raised to nineteen with rows 18 and 19 added, a "What a card owes its table" subsection written, and the `distribution-strip` row rewritten from "Shipped and working. No defect found"
- [x] T017 Record the per-file byte delta for the enlarged tables (`assets/templates/`, `assets/examples/`) — Evidence: phase-only deltas, computed against the packet deltas the closure phase measured: `distribution-strip` +571, `stacked-area` +960, `pick-times-by-depot` +570, `check-corpus.cjs` +7,896, `README.md` +2,889, `template-contract.md` +1,874
- [x] T018 Close the parent packet's open items: move its waived criterion to met with this phase's evidence, mark its two deferrals resolved, and close the no-script item as decided against with its reason (`../acceptance-criteria.md`, `../008-closure-and-proof/decision-record.md`, `../spec.md`) — Evidence: parent AC-002 moved from `Waived` to `Met`; ADR-003 and ADR-006 marked resolved; ADR-002 closed as decided against; three Known Limitations rewritten; the parent Status returned to `Complete` and its REQ-002 row rewritten
- [x] T019 Regenerate packet metadata and confirm `validate.sh --strict` prints `RESULT: PASSED` for this phase and the parent (`../`) — Evidence: metadata regenerated for every changed folder; `validate.sh --strict` returns `RESULT: PASSED` for this phase and 10 of 10 across the packet with 0 errors, exit 0. The authoritative corpus gate from the final bytes prints `RESULT: PASSED`, 0 errors, with `card-readout` at 17 assertions and `pointer-contract-coverage` at 42, both 0 failures
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — nineteen of nineteen
- [x] No `[B]` blocked tasks remaining — none used
- [x] Manual verification passed — the pointer sweep, three mutation proofs, and the render gate from the repaired state
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

- [x] CHK-001 [P0] Requirements documented in spec.md — four blockers and three required, each naming the deferral it closes
- [x] CHK-002 [P0] Technical approach defined in plan.md — the instrumented-copy mechanism and the comma-then-space matcher are both stated there, because both are where this phase could quietly go wrong
- [x] CHK-003 [P1] Dependencies identified and available — Node and the headless Chrome the render pass already uses; nothing installed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — no linter exists for this corpus; `node --check scripts/check-corpus.cjs` parses and the authoritative gate, `check-corpus.cjs --render`, prints `RESULT: PASSED`
- [x] CHK-011 [P0] No console errors or warnings — every repaired table rendered its rows in the pointer sweep, which a throw during draw would have prevented
- [x] CHK-012 [P1] Error handling implemented — the readout rule treats all four of its own failure modes as errors rather than passes, which is the failure a checker is most likely to hide
- [x] CHK-013 [P1] Code follows project patterns — new rules use the file's own `tally`/`record` pair and its lowercase section banners; the repairs reuse each form's existing `fmt` and row-building idiom
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — nine of nine, each with observed evidence
- [x] CHK-021 [P0] Manual testing complete — pointer sweep over all 27 corpus files before and after the repair, and both contract-coverage mutations watched failing by name
- [x] CHK-022 [P1] Edge cases tested — the list cell against the thousands separator, which is the case that made the first sweep report a false failure on the very files it had just repaired
- [x] CHK-023 [P1] Error scenarios validated — three mutations run against real files in place, each restored and each restore proven
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase is a fix, so these rows apply in full rather than being marked N/A.

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` — class-of-bug. The instance was `distribution-strip`; the class is any card that can show a value its table lacks, and `card-readout` closes the class rather than the instance
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — all 27 corpus files swept for the same class before any repair. Three carried it, two genuinely and one in the weaker derived-aggregate form; all three repaired
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — the checker is consumed by the corpus gate alone. The contract document gained a consumer it did not have: the checker now reads its per-form table, which is why a malformed heading would be an error rather than a silent skip
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — the parser-adjacent surface here is the number matcher, and it was given the adversarial case that actually bites: a cell holding a comma-separated list against a cell holding a thousands separator. A no-op case (a form with no card) and a fallback case (a card that never opens) are both covered as explicit branches
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — the matrix is 27 files by one property, listed in full in the sweep output rather than summarised
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — the rules read no process-wide state. The readout rule writes only into a temporary directory it creates and removes, and never touches a corpus file
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — evidence is pinned to the pre-change working tree and to sha256 values for each mutation restore, not to a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the diff adds table cells, two rules and prose; the corpus `no-external` check passed at 180 assertions
- [x] CHK-031 [P0] Input validation implemented — the readout rule validates its own driver output before trusting it: a missing result node, unparseable JSON and every non-ok state are errors
- [ ] CHK-032 [P1] Auth/authz working correctly — left unticked: not applicable, static files and a shell-run checker carry no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all three written for this phase and agreeing; the parent's documents reconciled as the last task
- [x] CHK-041 [P1] Code comments adequate — each new comment states the durable why, and `check-comment-hygiene.sh` exits 0 on every changed file
- [x] CHK-042 [P2] README updated — both rules in section 4 with the bullet count corrected, three mutation recipes in section 5
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — this phase wrote its walk harness and mutation backups outside the packet entirely; `scratch/` holds only `.gitkeep`
- [x] CHK-051 [P1] scratch/ cleaned before completion — empty but for `.gitkeep`; the mutation restores are already proven by sha256, so no rollback copy needs retaining
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-09-06
<!-- /ANCHOR:summary -->

---



