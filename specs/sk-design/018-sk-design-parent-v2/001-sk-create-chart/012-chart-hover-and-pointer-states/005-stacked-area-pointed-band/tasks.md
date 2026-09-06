---
title: "Tasks: Give stacked-area a hover card naming the pointed band"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Give stacked-area a hover card naming the pointed band

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

- [x] T001 `003-excerpt-and-grouped-bars` is complete: the finished excerpt is present in `grouped-bars.html` and renders green in every corpus run this phase ran. Baseline captured on the untouched corpus: `node scripts/check-corpus.cjs` printed `RESULT: PASSED` (0 errors), `--render` also `RESULT: PASSED` (3m11s) (`scripts/check-corpus.cjs`)
- [x] T002 Confirmed by reading the row: `references/template-contract.md:463` already reads "the pointed band's series name | its total across the period … | 1", and the paragraph at the table's foot already overrides the research figure. T006 is therefore a verification, not an amendment (`references/template-contract.md`)
- [x] T003 Pre-change copies taken outside the working tree: `/tmp/phase005-baseline/stacked-area.pre.html` (24188 bytes) and `/tmp/phase005-baseline/template-contract.pre.md` (`assets/templates/stacked-area.html`, `references/template-contract.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Excerpt transferred verbatim from `grouped-bars.html`: hover-card CSS block, reduced-motion tooltip line, `<g data-chart-tooltip id="tip-stacked-area">` after the legend `<g>`, card script with `TIP_ROWS = 1` (id changed to `tip-stacked-area`, everything else byte-identical by diff), full listener block ending in `svg.appendChild(tipLayer)` as the last drawing statement (`assets/templates/stacked-area.html`)
- [x] T005 Each band path inside `runs.forEach` wrapped with `markable(...)`, named by series. One row: label `Total, whole period`, value the series total across the period, `DATA.reduce` over every period exactly the way the table's Total column sums across series (`stacked-area.html:421`). Observed values 851 / 769 / 502 / 244, re-derived longhand from the data block, matching. A series with more than one run registers each run (observed: 8 marks with a mid-series hole) (`assets/templates/stacked-area.html`)
- [x] T006 Verify-only: the row phase 1 wrote already records the pointed-band readout and `TIP_ROWS` = 1, so there is nothing to amend; the file was read, not changed. `ls assets/templates/*.html` counts 21 forms against the table (`references/template-contract.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Post-change runs, read in full: structural `RESULT: PASSED` (0 errors; `interaction-hygiene` 120/0, `interaction-state` 60/0, `number-format` 180/0) and `--render` `RESULT: PASSED` (3m08s then 3m10s from the final state) (`scripts/check-corpus.cjs`)
- [x] T008 Hover walk passed under both pinned schemes (light and dark, scheme pin proven by body background 250,248,245 vs 22,21,19): card opens over each band with the correct name; hovering Training at the right edge flips the card to x = 0 inside the frame rather than opening past it (`assets/templates/stacked-area.html`)
- [x] T009 Pin walk passed under both pinned schemes via CDP-synthesized taps on the real file: tap pins, tap on another band re-pins, second tap on the pinned band clears, tap outside the drawing clears, hover works again after dismissal (`assets/templates/stacked-area.html`)
- [x] T010 Reduced-motion passed in both schemes: card opens and `getComputedStyle` reads `transition-duration: 0s` on the tooltip layer and `animation-name: none` on the figure (scheme pin proven per run) (`assets/templates/stacked-area.html`)
- [x] T011 No-script passed in both schemes: script execution disabled, figure holds the static frame (title, desc, empty legend), tooltip layer empty, table body empty. Pre-change file shows the same reading minus the empty tooltip `<g>` the excerpt adds, so the static picture is unchanged (`assets/templates/stacked-area.html`)
- [x] T012 Form-specific check passed: value stays 769 while the pointer moves along Subscription from x 375 to x 200, and every card value was re-derived longhand from the data block (851/769/502/244). Gap case observed too: a nulled reading turns the total to 801, matching what the table's own Total shows for that state (`stacked-area.html:421`) (`assets/templates/stacked-area.html`)
- [x] T013 No interception found: the grid rung under a band resolves to the band (`path[band band-2]`), the legend entries open no card, the space above the stack opens no card, and the Perpetual band narrowed toward 18 still resolves to `band-1`. No `pointer-events: none` needed (`assets/templates/stacked-area.html`)
- [x] T014 Byte delta recorded: 24188 -> 31164 = +6976 bytes (`wc -c`, before copy in `/tmp/phase005-baseline/stacked-area.pre.html`) (`assets/templates/stacked-area.html`)
- [x] T015 Negative control run on the real file in place: the `markable()` wrapper removed from the band registration made every hover open no card (0 marks, `open:false` on both probe bands); restored from the pre-break copy, `diff` proved byte-identity, and the same walk then opened the card naming the hovered band. Registration, not proximity, drives the card (`assets/templates/stacked-area.html`)
- [x] T016 Negative control run on the real file in place: the reduced-motion guard selector misspelled to `.tip` made `motion` report `1 failure(s)` and the run print `RESULT: FAILED`, naming exactly this defect; restored byte-identically and re-confirmed `RESULT: PASSED` (`scripts/check-corpus.cjs`)
- [x] T017 21 template files on disk against the 21-row contract table; the `stacked-area` row and the readout table beneath it read the pointed-band contract (`references/template-contract.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (the corpus check is this packet's gate: `script-parses` 30/0 and the full run green; no separate linter exists here)
- [x] CHK-011 [P0] No console errors or warnings (CDP `Runtime.exceptionThrown`, `consoleAPICalled` and `Log.entryAdded` captured across the main walk: none)
- [x] CHK-012 [P1] Error handling implemented (the file's own empty-data guard was exercised: all-null data block drew the notice, registered no marks and opened no card, with no page exception)
- [x] CHK-013 [P1] Code follows project patterns (excerpt verbatim from the finished `grouped-bars.html`; diff shows no residue beyond the tip id)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (SC-001 through SC-004 each observed and recorded in the task rows above; the packet-level reconciliation in `acceptance-criteria.md` stays with phase 8)
- [x] CHK-021 [P0] Manual testing complete (hover, pin, reduced-motion, no-script walks passed under both pinned schemes)
- [x] CHK-022 [P1] Edge cases tested (mid-series gap producing two runs, prefix gap, all-null data, band narrowed toward 18, right-edge flip)
- [x] CHK-023 [P1] Error scenarios validated (no-script state compared against the pre-change file; empty-data guard observed)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Not a fix: this phase transfers a proven interaction excerpt and registers marks; no finding was actioned, so there is no finding class to assign
- [x] CHK-FIX-002 [P0] Not a fix, instance-only by construction: the change is confined to one template
- [x] CHK-FIX-003 [P0] Consumers inventoried: the excerpt's only external consumer is the `tip-stacked-area` markup id and the `fmt`/`node`/`svg` locals the file already defines; the contract table row was read and already matches
- [ ] CHK-FIX-004 [P1] N/A for this phase: no security, path, parser or redaction change exists to test
- [x] CHK-FIX-005 [P1] Matrix axes walked and listed: 4 bands x {hover, pin, re-pin, dismiss} x {light, dark}, plus grid/legend/above-stack/thin-band probes; 2 schemes x {reduced-motion, no-script}
- [x] CHK-FIX-006 [P1] No host/global state is read by the change; the walks were run as fresh browser processes each time
- [ ] CHK-FIX-007 [P1] No fix SHA applies: evidence is pinned to the pre-change copy at `/tmp/phase005-baseline/` and the diff against it instead
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (nothing secret-shaped exists in a chart template; the diff adds only markup, CSS and drawing script)
- [x] CHK-031 [P0] Input validation implemented (no new input surface: the card reads values registered from the file's own data block and prints them through the file's own `fmt`, em dash included)
- [x] CHK-032 [P1] Auth/authz N/A: a static chart file has none
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (spec REQ-002/REQ-004 readout matches what was built; plan's Definition of Done holds; tasks ticked with evidence; the packet-wide reconciliation stays with phase 8)
- [x] CHK-041 [P1] Code comments adequate (the card script and registration carry the durable why: fixed value at registration, one row, gap arithmetic mirroring the table; no task or spec ids embedded)
- [x] CHK-042 [P2] README not applicable: no script or workflow changed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (all harnesses and copies live in `/tmp/phase005-baseline/`, outside the tree; the packet's own `scratch/` holds only its pre-existing `.gitkeep`)
- [x] CHK-051 [P1] scratch/ cleaned before completion (nothing was written under the packet; nothing to clean)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 11/13 (CHK-FIX-004 and CHK-FIX-007 are N/A for a feature-transfer phase, recorded in place) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---
