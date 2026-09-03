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

- [ ] T001 [B] Put the catalog decision from spec section 10 to the operator, and record the answer in `goal.md`
- [ ] T002 Capture the baseline corpus check before any edit, and read its `RESULT:` line (.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs)
- [ ] T003 Write down every invariant phases 004, 005 and 006 introduced, and mark which already carry an assertion (scratch/)
- [ ] T004 Record the before-state version inventory with `grep -rn '^version:'` over the packet (scratch/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Assert that every file carrying an interaction marker also carries both hygiene rules, and prove it fails on a mutated copy (scripts/check-corpus.cjs)
- [ ] T006 Assert that no file calls a locale-dependent number formatter, and prove it fails on a mutated copy (scripts/check-corpus.cjs)
- [ ] T007 Assert that an interactive file paints the same figure region across two loads, and prove it fails on a mutated copy (scripts/check-corpus.cjs)
- [ ] T008 Assert the palette-region count per file and the projection match per region, and prove it fails on a drifted block (scripts/check-corpus.cjs)
- [ ] T009 Assert that every contrast gate ran per theme, and prove it fails when the dark run is suppressed (scripts/check-corpus.cjs)
- [ ] T010 Assert that every catalog row's system matches the file's own declaration and exists in the palette source, and prove it fails on a mismatched row (scripts/check-corpus.cjs)
- [ ] T011 Assert that every form carries the empty-data guard above its drawing code, and prove it fails on a form with the guard removed (scripts/check-corpus.cjs)
- [ ] T012 Assert that a stroke gradient appears only on an ordered-system form, and prove it fails on a categorical form given one (scripts/check-corpus.cjs)
- [ ] T013 Revert every mutation from T005 through T012 and confirm the check is green again (scratch/)
- [ ] T014 [B] Author `bar-line-composed.html` through the documented workflow, starting from the skeleton (assets/templates/bar-line-composed.html)
- [ ] T015 Compute both scales from the data block, and draw the second axis only when the two maxima differ by an order, with the arithmetic written beside the condition (assets/templates/bar-line-composed.html)
- [ ] T016 Write the headline as a conclusion, and give the form a title, an accessible role, a resolving label and a hidden data table carrying both series (assets/templates/bar-line-composed.html)
- [ ] T017 [B] Add the catalog row and remove the composed gap entry phase 006 wrote (references/catalog.md)
- [ ] T018 Read each of the six family deliveries against the headline-as-argument rule and write a verdict per delivery, fixing only what the verdict says is wrong (assets/examples/)
- [ ] T019 Record the disposition on the draggable range window, with the arithmetic that decides whether any form is dense enough to need one (goal.md)
- [ ] T020 Bump the version across `SKILL.md`, `README.md`, the four reference documents and `scripts/README.md` (.opencode/skills/sk-doc/sk-create-chart/)
- [ ] T021 Describe the new checks in the scripts README, so a reader knows what a green run now covers (scripts/README.md)
- [ ] T022 Write `changelog/v1.2.0.0.md` covering all seven phases of the overhaul (changelog/v1.2.0.0.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T023 Re-run the corpus check with `--render` from the final state and read the `RESULT:` line
- [ ] T024 Confirm the run reports twenty-one chart forms and zero `catalog` failures
- [ ] T025 Exercise the composed form at both sides of the order-of-magnitude condition and at a zero period
- [ ] T026 Confirm every mutation from the failure proofs is reverted, by a clean working tree diff over `scratch/`
- [ ] T027 Re-run the version inventory and confirm one string appears everywhere
- [ ] T028 Run `hvr_scan.py` over every document in this folder and record zero hard blockers on each
- [ ] T029 Reconcile spec, plan, tasks, acceptance criteria and goal, and confirm the parent phase map reads Complete for this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining, or T014 and T017 recorded as refused with the operator's answer
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P0] The invariant inventory written down before any assertion was coded
- [ ] CHK-004 [P0] The operator answered the catalog decision before the form gained a row
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The new form passes every corpus check, including the ones added in this phase
- [ ] CHK-011 [P0] Both scales are computed from the data block, so an editor changing the numbers still gets a chart that fits
- [ ] CHK-012 [P0] Every new assertion was watched failing before it was trusted
- [ ] CHK-013 [P1] The new form gained no remote dependency and no runtime fetch
- [ ] CHK-014 [P1] The new form follows the four-part card order and carries one colour system
- [ ] CHK-015 [P1] The second-scale condition is visible where an editor will meet it, with its arithmetic beside it
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] `check-corpus.cjs --render` run and its `RESULT:` line read, over twenty-one forms
- [ ] CHK-022 [P0] Each of the eight new assertions proved to fail on a mutated fixture, then restored
- [ ] CHK-023 [P1] The composed form exercised on both sides of the order-of-magnitude condition
- [ ] CHK-024 [P1] The composed form exercised with a zero period, so the bar has no height and the line still draws
- [ ] CHK-025 [P1] A rate above one hundred percent confirmed to raise the axis rather than clip
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The version bump is classed `cross-consumer`: seven files carry the string and a reader trusts the first one they find
- [ ] CHK-FIX-002 [P0] Producer inventory completed by `grep -rn '^version:'` over the packet, before and after
- [ ] CHK-FIX-003 [P0] Consumer inventory completed by the corpus check's `catalog` assertion count, which rises by the new row in both directions
- [ ] CHK-FIX-004 [P1] Not applicable. No security, path, parser or redaction surface is touched
- [ ] CHK-FIX-005 [P1] The axes are the new template, the catalog, the checker, the six deliveries and seven version-bearing files, all enumerated in plan.md
- [ ] CHK-FIX-006 [P1] Nothing here reads process-wide state, a clock or a random source
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the working-tree state, since this phase commits nothing
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. The new template carries literal chart data and nothing else
- [ ] CHK-031 [P1] Not applicable. A template takes no input at runtime
- [ ] CHK-032 [P1] Not applicable. There is no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] No ephemeral artifact label entered any code comment
- [ ] CHK-042 [P1] The scripts README describes what the new checks cover, so a green run is not read as more than it is
- [ ] CHK-043 [P1] The changelog entry covers all seven phases rather than this one
- [ ] CHK-044 [P1] The scenario audit verdict recorded per delivery, including the ones that needed nothing
- [ ] CHK-045 [P2] The parent's aggregate file table flagged for reconciliation, since it omits this phase for the family deliveries
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P0] Every mutated fixture from the failure proofs removed, confirmed by a green run and a clean diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 18 | 0/18 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
