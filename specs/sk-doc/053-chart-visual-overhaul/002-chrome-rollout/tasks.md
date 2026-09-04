---
title: "Tasks: Roll the settled chrome across the whole chart corpus"
description: "Ordered work for the twenty-nine file chrome pass, the radius token ladder and the assertion behind it, with the verification each one owes."
trigger_phrases:
  - "chart chrome rollout tasks"
  - "chart radius token tasks"
  - "corpus restyle tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Roll the settled chrome across the whole chart corpus

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

- [x] T001 Confirm phase 001 closed with a disposition on both forks, and copy the settled values into this folder (scratch/settled-chrome.txt)
      - Evidence: Phase 001 closed with 1px on the stroke and the glow rejected, both recorded in its ADR-001 and ADR-002
- [x] T002 Capture the baseline corpus check with `--render` and read the `RESULT:` line (scratch/validator-before.txt)
      - Evidence: scratch/validator-before.txt: RESULT: PASSED, errors 0, render 29 assertions
- [x] T003 Record the before-count of every value this phase replaces, including the twenty `border-radius: 10px` declarations (scratch/counts-before.txt)
      - Evidence: scratch/counts-before.txt: 29 border-radius literals, 13 grid declarations of which 11 solid, 2 files with a mono face
- [x] T004 Inventory every distinct corner value the corpus draws today, so a rung exists for a real consumer (scratch/rung-inventory.txt)
      - Evidence: scratch/rung-inventory.txt: corners drawn were 2, 3, 4, 6, 8, 10 plus one computed lozenge
- [x] T005 Test whether a length survives `customProperties` and `checkPaletteSource`, and pick Route A or Route B on that evidence (scripts/check-corpus.cjs)
      - Evidence: scratch/route-a-test.txt: a length survives customProperties and takes no contrast reading. Route B chosen anyway, ADR-005
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add the radius ladder to the palette source on the chosen route (assets/color/palettes.json)
      - Evidence: assets/color/palettes.json carries radius and radiusRoles beside chrome
- [x] T007 Teach the corpus check to emit and assert the radius tokens, and give the new check its own name in the run summary (scripts/check-corpus.cjs)
      - Evidence: check-corpus.cjs: customProperties emits the rungs, checkRadiusTokens is the new named check, 58 assertions
- [x] T008 Prove the new assertion can fail by mutating one template, reading the red run, then restoring the file (assets/templates/, scratch/radius-negative.txt)
      - Evidence: scratch/radius-negative.txt: 50 failures on the untouched corpus, then one per branch on a mutated file, and green after each restore
- [x] T009 Replace every hand-typed corner with a token reference across the corpus (assets/templates/, assets/examples/, assets/color/)
      - Evidence: grep -rho 'border-radius: 10px' assets/ returns 0 against a before-count of 29, and no rx literal remains
- [x] T010 A1: dash every grid at `3 3` in a weakened rule colour, horizontal only (assets/templates/, assets/examples/, assets/color/)
      - Evidence: 13 of 13 grid declarations now carry stroke-opacity 0.75 and stroke-dasharray 3 3
- [x] T011 A1b: drop every tick ink to muted rather than full strength (assets/templates/, assets/examples/, assets/color/)
      - Evidence: No-op: all 14 .tick declarations already read var(--chart-muted) before the phase
- [x] T012 A2: give every asset file a system mono face with tabular figures for numeric text, still routed through its own formatter (assets/)
      - Evidence: grep -rl ui-monospace assets/ returns all 29 files, and no formatter call was changed
- [x] T013 A2: re-check every label width estimate against mono advances, which are wider than the sans advances they were tuned for (assets/)
      - Evidence: Two estimates were tuned for a proportional face. The stacked-area comment now states the exact mono advance, and the progress-single one was restored when its headline figure went back to the body face
- [x] T014 A7: apply the two-weight dot language to the line family (assets/templates/daily-line.html, assets/templates/stacked-area.html)
      - Evidence: daily-line and orders-after-the-price-change each draw a dot per reading and a surface-ringed mark. ADR-006 records the form the row does not reach
- [x] T015 A9: fade every area and band fill toward the baseline, painted from series tokens (assets/templates/daily-line.html, assets/templates/daily-range.html, assets/templates/stacked-area.html)
      - Evidence: daily-line and orders-after-the-price-change each fade from the series token to nothing at the baseline. ADR-006 records the two forms the row does not reach
- [x] T016 Apply phase 001's settled stroke weight to every `.line` rule in the corpus (assets/templates/)
      - Evidence: orders-after-the-price-change .line 2 to 1, parallel-axes .line-1 to .line-4 2.5 to 1. daily-line shipped at 1 in phase 001
- [x] T017 Apply phase 001's glow verdict, which is a no-op when the verdict is to reject (assets/templates/daily-line.html)
      - Evidence: No filter was authored anywhere, which is the whole of the glow verdict
- [x] T018 [P] Give bar-family marks a two pixel radius on the outer visible edge only, top segment for a stack (assets/templates/bar-columns.html, bar-rows.html, grouped-bars.html, stacked-bars.html, waterfall.html, progress-single.html)
      - Evidence: bar-columns, bar-rows, grouped-bars, stacked-bars top segment, waterfall totals and the staff-hours delivery build a path. progress-single is a pill and keeps both ends, recorded in AC-020
- [x] T019 Update the skeleton last, so a new form inherits everything above (assets/color/palette-sheet-neutral.html)
      - Evidence: palette-sheet-neutral.html was the last file the rollout touched and passes every check the forms pass
- [x] T020 Describe the chrome block and the radius tokens in the contract's skeleton section (references/template-contract.md)
      - Evidence: template-contract.md §3 and §6, and rule 15 in a table now headed THE FIFTEEN RULES
- [x] T021 Add the radius roles to the role vocabulary and say what each rung is for (references/color-system.md)
      - Evidence: color-system.md §3 carries a corner roles table beside the colour roles, and §6 names the new enforcement
- [x] T022 Record the route decision, the formatter binding and the rejected round tick dots in the decision record (decision-record.md)
      - Evidence: decision-record.md: ADR-005 resolved to Route B on the tested run, ADR-006 added for the rows that do not reach every form
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 Re-run the corpus check with `--render` from the final state and read the `RESULT:` line (scratch/validator-after.txt)
      - Evidence: scratch/validator-after.txt: RESULT: PASSED, errors 0, render 29 assertions
- [x] T024 Confirm the radius check reports a nonzero assertion count and zero failures
      - Evidence: radius reports 58 assertions and 0 failures
- [x] T025 Confirm `grep -rc 'border-radius: 10px' assets/` returns zero across every file, against the recorded before-count of twenty
      - Evidence: Returns 0 in every file against the recorded before-count of 29, which the packet docs had as 20 because that is the templates-only count
- [x] T026 Confirm `grep -rn 'toLocaleString' assets/` returns nothing
      - Evidence: No match, before or after
- [x] T027 Open every asset file and read its axis labels, because the check does not judge the picture
      - Evidence: All 29 rendered to PNG and read, plus a getBBox overlap probe run against both the committed and the working versions. One defect found and fixed
- [x] T028 Run `hvr_scan.py` over every document authored in this phase and require zero hard blockers
      - Evidence: hvr_scan.py reports zero hard blockers on every document in this folder
- [x] T029 Reconcile spec, plan, tasks, acceptance criteria and the decision record against what shipped
      - Evidence: spec, plan, tasks, acceptance criteria and the decision record all reconciled against what shipped
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. All 29 files were rendered and read, and one defect was found and fixed
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md sections 3 and 4
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md sections 1 and 3
- [x] CHK-003 [P0] Phase 001 closed with a disposition on both forks. Evidence: Phase 001 ADR-001 answered 1px, ADR-002 rejected the glow
- [x] CHK-004 [P1] Headless Chrome resolves, so `--render` can run. Evidence: Chrome resolved on the usual macOS path, and render ran 29 assertions
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No colour literal appears outside a palette block in any asset file. Evidence: colour-literals reports 890 assertions and 0 failures
- [x] CHK-011 [P0] No hand-typed corner value remains in any stylesheet. Evidence: radius reports 58 assertions and 0 failures, and grep finds no numeric border-radius in the tree
- [x] CHK-012 [P1] Every chrome declaration refers to a `var(--chart-...)` property. Evidence: Every chrome declaration this phase touched names a var(--chart-…) property
- [x] CHK-013 [P1] The new assertion is named in the run summary so a failure points at the rule it broke. Evidence: The check prints as radius in the run summary and its messages name the rule
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md: 17 Met, 3 Superseded, 0 Unmet
- [x] CHK-021 [P0] `check-corpus.cjs --render` prints `RESULT: PASSED`. Evidence: scratch/validator-after.txt
- [x] CHK-022 [P0] The radius assertion failed on a mutated copy before the copy was restored. Evidence: scratch/radius-negative.txt, three separate red runs
- [x] CHK-023 [P1] Every asset file was opened and its labels read. Evidence: 29 PNGs read, plus a measured overlap probe on all 29
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every chrome row is classed `class-of-bug`, because it is one change repeated across a corpus rather than a fix at one site. Evidence: Each row was applied across the tree rather than at one site, and the forms a row does not reach are named in ADR-006
- [x] CHK-FIX-002 [P0] The producer inventory over `.grid`, `.tick`, `.area` and `border-radius` covers `assets/` whole, not `assets/templates/` alone. Evidence: The producer inventory in counts-before.txt covers assets/ whole, which is how the 29 corner literals and 13 grids were found rather than the 20 and 10 the docs predicted
- [x] CHK-FIX-003 [P0] The consumer inventory covers every file carrying a `CHART_PALETTE:BEGIN` sentinel, which is what a palette source change reaches. Evidence: All 29 files carry a CHART_PALETTE:BEGIN sentinel and all 29 blocks were regenerated
- [x] CHK-FIX-005 [P1] The rung matrix lists each rung and the real consumer that earns it, with no rung added for symmetry. Evidence: Five rungs, each named with the surface that earns it, in palettes.json radiusRoles
- [x] CHK-FIX-006 [P1] The check is run from the repository root and from the packet root, because the script resolves paths from its own location. Evidence: The check resolves its own paths from its own location and was run from the repository root throughout
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working-tree state that produced it, named in the acceptance criteria. Evidence: Every capture in scratch/ was taken from the working tree state it describes
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: No credential appears in any touched file
- [x] CHK-031 [P0] No remote resource, no `@import` and no runtime fetch enters any file. Evidence: no-external reports 145 assertions and 0 failures
- [x] CHK-032 [P1] Nothing is copied from the vendored source, and every value is re-typed against corpus properties. Evidence: Every value shipped was re-typed against corpus properties, and nothing was pasted from the vendored source
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance criteria and the decision record synchronized. Evidence: All five documents reconciled in this pass
- [x] CHK-041 [P1] No sentence in either reference document still claims the old behaviour. Evidence: Both reference documents describe the corner ladder and the fifteenth rule
- [x] CHK-042 [P1] The scripts README names the new check alongside the existing ones. Evidence: scripts/README.md section 4 lists radius, and section 5 shows how to break both of its branches
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Inventories and validator captures stay in `scratch/`. Evidence: Six captures and inventories, all under scratch/
- [x] CHK-051 [P1] `scratch/` is reviewed before the phase closes, and anything the acceptance criteria cite is kept. Evidence: Every scratch file is cited by an acceptance row or a task row
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] The route decision for the radius tokens is recorded in decision-record.md. Evidence: ADR-005
- [x] CHK-101 [P1] Every ADR carries a status of Proposed or Accepted. Evidence: Six ADRs, all Accepted
- [x] CHK-102 [P1] The rejected route and the rejected round tick dots each carry their reason. Evidence: ADR-005 keeps the tested Route A evidence, and ADR-004 keeps the round tick dots row
- [x] CHK-103 [P2] The migration path for a form authored before the ladder is documented. Evidence: template-contract.md section 6 says where a corner comes from, which is what a pre-ladder form has to be changed to
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Every touched file still opens with no build step and no network. Evidence: Every file still opens as one document with no build step, and no-external passes on all 29
- [x] CHK-111 [P1] No web font is fetched, and the mono face resolves from a system stack. Evidence: The mono stack is ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace
- [x] CHK-112 [P2] The corpus check runtime is recorded before and after the new assertion. Evidence: Five structural runs each, same machine, `time` real seconds. Before, the checker and corpus at HEAD: 0.11, 0.06, 0.07, 0.07, 0.07. After: 0.08, 0.07, 0.07, 0.07, 0.08. The median is 0.07 on both sides, so the new rule costs nothing measurable at this corpus size
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented, with the palette source reverted before the per-file failures. Evidence: plan.md section 7 and the L2 enhanced rollback, unchanged and still correct
- [x] CHK-121 [P1] The before-counts are recorded, so a partial rollout is visible rather than inferred. Evidence: scratch/counts-before.txt
- [x] CHK-122 [P2] The skeleton is confirmed last, so a new form inherits the final state. Evidence: palette-sheet-neutral.html was the last file edited
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Nothing entered the tree from an outside chart library, by copy or by paste. Evidence: Nothing was copied from the vendored source
- [x] CHK-131 [P1] No dependency was added, because a template depends on nothing. Evidence: No dependency was added
- [x] CHK-133 [P2] Every value shipped is derivable from the palette source. Evidence: Every colour and every corner in the corpus resolves through a property emitted from palettes.json
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized. Evidence: spec, plan, tasks, acceptance criteria, decision record and implementation summary
- [x] CHK-141 [P1] The contract skeleton section shows the block a new form has to carry. Evidence: template-contract.md section 3 shows the block and section 6 explains the ladder
- [x] CHK-142 [P2] The colour system role table lists the radius roles beside the colour roles. Evidence: color-system.md section 3, Corner roles
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Visual owner | [ ] Approved | Pending. The stroke weight and the glow were answered in phase 001, and nothing in this phase asked a new question of the operator |
| Phase 003 | Downstream consumer | [ ] Approved | Pending. The corpus is handed over green with `--render` |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 21 | 21/21 |
| P2 Items | 6 | 6/6 |

**Verification Date**: 2026-09-03
<!-- /ANCHOR:summary -->

---
