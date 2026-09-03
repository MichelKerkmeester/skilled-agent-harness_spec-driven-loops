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

- [ ] T001 Capture the baseline corpus check before any edit, and read its `RESULT:` line (.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs)
- [ ] T002 Capture the figure-region hash of each of the thirteen forms that will gain a pointer, so the first-paint proof has a before state (scratch/)
- [ ] T003 Settle the `independent-percentages` question from spec section 10, and record the answer in the per-form table (plan.md)
- [ ] T004 Confirm every recipe value in plan.md section 3 opens at the vendored line it cites (specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Build the tooltip on `scatter` alone, to the full recipe, and prove it against the corpus check before it goes anywhere else (assets/templates/scatter.html)
- [ ] T006 Route every tooltip value through the file's own `fmt`, and confirm the em dash path for a value that is not a finite number (assets/templates/scatter.html)
- [ ] T007 [P] Carry the proven tooltip to `heat-matrix`, `calendar-grid`, `candlestick`, `box-plot`, `distribution-strip` and `treemap` (assets/templates/)
- [ ] T008 Bind each tooltip through one delegated listener on the drawing rather than one listener per mark (assets/templates/)
- [ ] T009 Add the edge flip so a tooltip near the right or top edge opens on the other side of its mark rather than overflowing the viewBox (assets/templates/)
- [ ] T010 Add the tap path so a touch device opens the tooltip on tap and closes it on a second tap or a tap elsewhere (assets/templates/)
- [ ] T011 Build the in-figure legend on `grouped-bars` first, then carry it to `stacked-bars`, `stacked-area`, `parallel-axes` and `independent-percentages` (assets/templates/)
- [ ] T012 Rewrite the subtitle on each of the five legend forms so it states the range and the argument and stops carrying the colour key (assets/templates/)
- [ ] T013 Add the hover dim and the legend-click latch to `grouped-bars`, `stacked-bars`, `stacked-area`, `parallel-axes` and `daily-line` (assets/templates/)
- [ ] T014 Clear the dim on the drawing's own leave event, so no form can be left permanently dimmed (assets/templates/)
- [ ] T015 Add the two lines of interaction hygiene to the thirteen forms that gained a pointer, scoped so no keyboard focus indicator is removed (assets/templates/)
- [ ] T016 Namespace every new element id with the form id, so thirteen copies of one overlay cannot collide (assets/templates/)
- [ ] T017 Write the interaction register into the template contract, naming what an event handler may do and what it may not (references/template-contract.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Re-run the corpus check with `--render` from the final state and read the `RESULT:` line
- [ ] T019 Render each interactive form twice with no pointer input and compare the figure-region hashes against T002
- [ ] T020 Confirm `grep -rn 'toLocaleString'` over the packet returns nothing
- [ ] T021 Confirm the tooltip, legend and dim counts match the per-form table, at 7, 5 and 5
- [ ] T022 Walk each interactive form in a browser with a pointer, with a touch emulator and with the keyboard alone
- [ ] T023 Run `hvr_scan.py` over every document in this folder and record zero hard blockers on each
- [ ] T024 Reconcile spec, plan, tasks, acceptance criteria and goal
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
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
- [ ] CHK-003 [P1] Phase 003 closed, so the reduce-motion gate already exists
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every touched template passes all fifteen corpus checks
- [ ] CHK-011 [P0] No script in a touched template throws on open, proven by the render check
- [ ] CHK-012 [P0] No colour literal appears outside a palette block, so the hairline border is derived rather than typed
- [ ] CHK-013 [P1] No template gained a remote dependency or a runtime fetch
- [ ] CHK-014 [P1] Every touched template still follows the four-part card order
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] `check-corpus.cjs --render` run and its `RESULT:` line read
- [ ] CHK-022 [P0] Two renders of one interactive file with no pointer input produce the same figure region
- [ ] CHK-023 [P1] A render failure was classified as browser flake or as a chart drawing nothing before being acted on
- [ ] CHK-024 [P1] Each interactive form exercised with a pointer, with touch and with the keyboard alone
- [ ] CHK-025 [P1] The em dash path proved on a fixture carrying a value that is not a finite number
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The interaction layer is classed `additive`: no existing mark, label or value changes position
- [ ] CHK-FIX-002 [P0] Producer inventory completed by `grep -l 'data-chart-tooltip\|data-chart-legend\|data-chart-dim' assets/templates/*.html`
- [ ] CHK-FIX-003 [P0] Consumer inventory completed by `grep -c 'fmt(' assets/templates/*.html`, before and after
- [ ] CHK-FIX-004 [P1] Not applicable. No security, path, parser or redaction surface is touched
- [ ] CHK-FIX-005 [P1] The axes are the thirteen interactive templates and the template contract, both enumerated in plan.md
- [ ] CHK-FIX-006 [P1] No handler reads process-wide state, a clock or a random source
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the working-tree state, since this phase commits nothing
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Templates carry literal chart data and nothing else
- [ ] CHK-031 [P0] A tooltip renders text through the DOM text path rather than through markup assembly, so a label in a data block cannot inject nodes
- [ ] CHK-032 [P1] Not applicable. There is no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] No ephemeral artifact label entered any code comment
- [ ] CHK-042 [P1] The template contract names the interaction register, so a later author is not guessing
- [ ] CHK-043 [P2] The manual testing playbook covers the pointer, touch and keyboard walks
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
| P0 Items | 10 | 0/10 |
| P1 Items | 14 | 0/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
