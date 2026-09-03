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

- [ ] T001 Capture the baseline corpus check before any edit, and read its `RESULT:` line (.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs)
- [ ] T002 Read all twenty catalog rows against the colour document's system definitions and write the verdict per row, including the rows that stay as they are (scratch/)
- [ ] T003 Record the before-state font-size inventory with `grep -rn 'font-size' assets/`, so the published type scale can be checked against what the corpus does (scratch/)
- [ ] T004 Record the before-state geometry inventory: every margin, gutter and plot inset per template, so the shared block records reality rather than a preference (scratch/)
- [ ] T005 Capture a screenshot of any form whose system the re-check will change, since this phase owes a before and after for the one correction that redraws a chart (scratch/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Correct the system cell of every catalog row the re-check found wrong (references/catalog.md)
- [ ] T007 Correct the `chart-color-system` meta tag and the palette block of each template whose row changed, taking the block the check prints (assets/templates/)
- [ ] T008 Restate the three system definitions in the colour document so a future catalog row cannot disagree with them silently (references/color-system.md)
- [ ] T009 Build the empty-data guard on one form and prove it on a fixture with an empty block and on the shipped block (assets/templates/bar-rows.html)
- [ ] T010 [P] Carry the proven guard to the other nineteen forms, proving each on its own fixture (assets/templates/)
- [ ] T011 Publish the type scale as named roles in the contract skeleton section, matching the sizes the corpus already uses (references/template-contract.md)
- [ ] T012 Write the catalog gap prose for sankey, the dual-axis composed form and radar, with the composed entry written so phase 007 removes it rather than editing it (references/catalog.md)
- [ ] T013 Add the shared geometry defaults block to the skeleton, then point every template at it, leaving a comment beside any form whose numbers genuinely differ (assets/color/palette-sheet-neutral.html, assets/templates/)
- [ ] T014 [B] Draft the gradient clause into the colour document as a proposal, and apply it only if the operator answers the multi-hue decision yes (references/color-system.md)
- [ ] T015 State the empty-data notice as a contract behaviour beside the existing ceiling notices, so a new form inherits it (references/template-contract.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Re-run the corpus check with `--render` from the final state and read the `RESULT:` line
- [ ] T017 Confirm the `catalog` check reports zero failures in both directions after every reassignment
- [ ] T018 Confirm every one of the twenty forms fires the notice on an empty fixture and stays silent on its shipped data
- [ ] T019 Re-run the font-size inventory and confirm the published roles match what the corpus does
- [ ] T020 Re-run the geometry inventory and confirm every difference from the shared block carries a comment saying why
- [ ] T021 Capture the after screenshot of the reassigned form and put it beside the before in the phase record
- [ ] T022 Run `hvr_scan.py` over every document in this folder and record zero hard blockers on each
- [ ] T023 Reconcile spec, plan, tasks, acceptance criteria and goal
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining, or T014 recorded as drafted with the operator's answer pending
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
- [ ] CHK-003 [P0] The twenty-row re-check written down before any row was edited
- [ ] CHK-004 [P1] Phases 001 through 005 closed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every touched template passes all fifteen corpus checks
- [ ] CHK-011 [P0] Every system reassignment landed as a paired edit, catalog cell and template together
- [ ] CHK-012 [P0] The empty-data guard sits above the drawing code and reads only the data block
- [ ] CHK-013 [P1] No template gained a remote dependency or a runtime fetch
- [ ] CHK-014 [P1] The shared geometry block ships no visual change, since it records what the corpus already does
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] `check-corpus.cjs --render` run and its `RESULT:` line read
- [ ] CHK-022 [P0] Every one of the twenty forms exercised with an empty fixture and with its shipped data
- [ ] CHK-023 [P0] A form handed an array of non-finite values fires the notice, since length alone is not readability
- [ ] CHK-024 [P1] A form handed one row does not fire the notice, and its axis ladder still produces a readable scale
- [ ] CHK-025 [P1] The reassigned form captured before and after
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The system reassignment is classed `cross-consumer`: a row and a file both name the system
- [ ] CHK-FIX-002 [P0] Producer inventory completed by reading the catalog rows between the sentinels
- [ ] CHK-FIX-003 [P0] Consumer inventory completed by `grep -h 'chart-color-system' assets/templates/*.html | sort | uniq -c`, before and after
- [ ] CHK-FIX-004 [P1] Not applicable. No security, path, parser or redaction surface is touched
- [ ] CHK-FIX-005 [P1] The axes are the three references, the twenty templates and the three proof sheets, all enumerated in plan.md
- [ ] CHK-FIX-006 [P1] Nothing here reads process-wide state
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the working-tree state, since this phase commits nothing
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Templates carry literal chart data and nothing else
- [ ] CHK-031 [P1] The empty-data notice is a fixed string rather than an echo of the data block, so a crafted value cannot reach the picture as text
- [ ] CHK-032 [P1] Not applicable. There is no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] No ephemeral artifact label entered any code comment
- [ ] CHK-042 [P1] The catalog gap prose sits outside the machine-read sentinels, where prose is free to change
- [ ] CHK-043 [P1] The composed gap entry is written to be removed by phase 007 rather than edited
- [ ] CHK-044 [P2] The parent's aggregate file table is flagged for reconciliation, since it omits this phase for templates and proof sheets
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P1] Every empty-data fixture removed once its proof is recorded
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 16 | 0/16 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
