---
title: "Feature Specification: The interaction layer for the chart corpus"
description: "The corpus draws twenty forms and none of them answers a pointer. This phase adds a hover tooltip to the mark-dense forms, an in-figure legend to the multi-series forms and a dim on the series a reader is looking at, without letting a static file stop being static on first paint."
trigger_phrases:
  - "chart hover tooltip"
  - "chart in-figure legend"
  - "chart hover dim"
  - "chart interaction layer"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: The interaction layer for the chart corpus

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

Both research lineages read the vendored source and both reported the same absence: the corpus has no interaction layer at all. A reader who wants the value behind a dot, a cell or a box has to leave the picture and find the row in the data table underneath it. This phase closes that gap on the forms where a mark carries a value the picture cannot print, and it leaves the other seven forms alone.

**Key Decisions**: interaction is added per form against a stated reason, never corpus-wide. The determinism rule is read as it is written, which is a ban on automatic variation rather than a ban on a reader choosing to look closer.

**Critical Dependencies**: phase 003 settles the motion layer first, because a reveal wipe and a hover state share the same mask and the same reduce-motion gate.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 7 |
| **Predecessor** | `003-motion-layer` |
| **Successor** | `005-dark-theme` |
| **Handoff Criteria** | Interaction is present on the forms that earn it, no handler reads the clock or a random source, and the corpus check reports zero `determinism` failures with the handlers in place |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the chart visual overhaul. Phases 1 through 3 settled the taste forks by rendered comparison, rolled the agreed chrome across the corpus and added the first-paint motion. Each of those changes the picture. This one changes what the picture does when a reader points at it, which is the first behaviour the corpus has ever carried.

**Scope Boundary**: thirteen files under `.opencode/skills/sk-doc/sk-create-chart/assets/templates/`, plus the template contract where it has to name the new register. `scripts/check-corpus.cjs` is not edited here. Phase 007 owns the checker extension for every invariant phases 004 through 006 introduce, and this phase writes the invariants down so that phase has something to assert.

**Dependencies**:
- Phase 003, which owns the reduce-motion gate the tooltip transition also sits behind.
- `scripts/check-corpus.cjs` as the authoritative gate on every template edit.

**Deliverables**:
- A hover tooltip on seven mark-dense forms, built to the recipe the research names.
- An in-figure legend on five multi-series forms.
- A hover-and-select dim to 0.3 opacity on five forms.
- Two lines of interaction hygiene on every form that gains a pointer.
- A written per-form table stating which of the twenty forms gains interaction and why the rest do not.
- A first-paint determinism proof, recorded as two renders of one file with no pointer input.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Twenty chart forms draw values and none of them respond to a pointer. On a scatter with twenty points, a heat matrix with a hundred cells or a box plot summarising a group, the mark is the only place the value appears in the picture, and the picture cannot print a label on every mark without becoming unreadable. The reader's fallback is the hidden data table, which is the right accessibility floor and the wrong reading experience.

The corpus also has no legend inside the figure. A multi-series form carries its key in the subtitle sentence, which reads well and forces the reader to hold a colour-to-name mapping in their head while scanning the marks.

Both research lineages found the same gap independently, from different halves of the vendored source, and both ranked it high. Neither could find a reason the corpus had left it out, because there is not one. It was never built.

### Purpose

Every form whose marks carry values the picture cannot print answers a pointer with a tooltip, every multi-series form carries its own key, and a reader looking at one series can see it against a dimmed rest. A file that nobody points at draws exactly what it drew before.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A hover tooltip on `scatter`, `heat-matrix`, `calendar-grid`, `candlestick`, `box-plot`, `distribution-strip` and `treemap`.
- An in-figure legend on `grouped-bars`, `stacked-bars`, `stacked-area`, `parallel-axes` and `independent-percentages`.
- A hover-and-select dim to 0.3 on `grouped-bars`, `stacked-bars`, `stacked-area`, `parallel-axes` and `daily-line`.
- Two lines of interaction hygiene on the thirteen forms that gain a pointer.
- The template contract naming the interaction register, so a later author knows what a form may and may not do with an event.

### Out of Scope

- `scripts/check-corpus.cjs`. Phase 007 asserts every invariant this phase introduces, and this phase states them in a form that phase can assert.
- The draggable range window on dense series. The adjudication allows it last and only where a form is genuinely dense, which puts it in phase 007.
- A loading state. A static file never fetches, so the async phase a loading state covers cannot happen, and the generator behind it is random and would fail the determinism rule.
- Removing keyboard focus from anything a reader can reach with a tab. One lineage proposed suppressing focus outlines corpus-wide and the other rejected it, and section 10 records how the two are reconciled.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/scatter.html` | Modify | Tooltip and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/heat-matrix.html` | Modify | Tooltip and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/calendar-grid.html` | Modify | Tooltip and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/candlestick.html` | Modify | Tooltip and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/box-plot.html` | Modify | Tooltip and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/distribution-strip.html` | Modify | Tooltip and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/treemap.html` | Modify | Tooltip and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html` | Modify | Legend, dim and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-bars.html` | Modify | Legend, dim and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-area.html` | Modify | Legend, dim and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/parallel-axes.html` | Modify | Legend, dim and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/independent-percentages.html` | Modify | Legend and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html` | Modify | Dim and hygiene |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | The interaction register, and what an event handler may not do |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The seven mark-dense forms carry a hover tooltip at roughly 128px minimum width, with a hairline border at half the rule alpha, about 12px text, and values in a system mono face with tabular figures |
| REQ-002 | Every value a tooltip prints goes through the file's own formatter, and no file in the packet calls `toLocaleString` |
| REQ-003 | The five multi-series forms carry an in-figure legend with a small rounded swatch, and the subtitle keeps its job as the caption rather than becoming the key |
| REQ-004 | Hovering or selecting one series dims the others to 0.3 opacity on the five named forms |
| REQ-005 | A file that gained a pointer paints identically on first load, proven by two renders with no pointer input |
| REQ-006 | `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state, with zero `determinism` failures |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Every form that gains a pointer carries the two lines of interaction hygiene, scoped so no keyboard focus indicator is removed |
| REQ-008 | The plan states per form whether it gains interaction, and each of the seven that stay static carries the reason it needs none |
| REQ-009 | Every document authored in this phase reports zero hard blockers under `hvr_scan.py` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -l 'data-chart-tooltip' .opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html | wc -l` prints `7`.
- **SC-002**: `grep -l 'data-chart-legend' .opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html | wc -l` prints `5`.
- **SC-003**: `grep -rn 'toLocaleString' .opencode/skills/sk-doc/sk-create-chart/` prints nothing.
- **SC-004**: `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A tooltip border typed as a colour literal | The `colour-literals` check fails, and a palette edit reaches half the file | Derive the hairline from `var(--chart-rule)` with `color-mix`, so the only colour value stays in the palette block |
| Risk | An overlay positioned against the page rather than the pannable figure region | The tooltip drifts away from its mark the moment a narrow screen scrolls the figure sideways | Position the overlay inside the drawing, in the same coordinate space as the mark it describes |
| Risk | The tooltip becoming the only place a value appears | Rule 10 fails for a screen reader, and the accessibility floor drops | The hidden data table already carries every value, and it is not touched here |
| Risk | Element ids colliding after the same overlay lands in thirteen files | The `unique-ids` check fails, or two overlays render into one container | Namespace every new id with the form id, which is already unique across the corpus |
| Risk | The determinism rule read as a ban on event handlers | The phase gets refused for a rule it does not break | Rule 12 names randomness and a clock. The proof is two renders with no pointer input, recorded in the implementation summary |
| Dependency | Headless Chrome for `--render` | Template edits cannot be proven, so none may be applied | The corpus check reports whether the render pass ran, and a structural pass is never claimed as a rendering pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A form with a pointer stays one self-contained file that opens with no build step and no network.
- **NFR-P02**: A tooltip on the heat matrix binds one hundred cells at most, and binding stays a single delegated listener on the drawing rather than one listener per mark.

### Accessibility
- **NFR-A01**: The hidden data table remains the complete reading of the chart, and nothing moves into the tooltip that is only available there.
- **NFR-A02**: No element a reader can reach with a keyboard loses its focus indicator.

### Reliability
- **NFR-R01**: The corpus check is the authority on whether a template edit shipped correctly, and a failing run blocks the claim.

---

## 8. EDGE CASES

### Input Boundaries
- A touch device that never hovers: the tooltip opens on tap and closes on a second tap or on a tap elsewhere.
- A mark against the right or top edge of the drawing: the tooltip flips to the other side of the mark rather than overflowing the viewBox.
- Two marks close enough to overlap: the mark under the pointer wins, and the loser is not left in a hovered state.

### Error Scenarios
- A mark whose value is missing: the tooltip prints the em dash the formatter already returns for a value that is not a finite number, rather than printing `NaN`.
- A pointer that leaves the drawing while a series is dimmed: the dim clears on the drawing's own leave event, so a form is never left permanently dimmed.

---

## 9. COMPLEXITY ASSESSMENT

Scored with `bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh --loc 800 --files 15 --architectural`, which returned Level 2 at 68 of 100 and did not recommend further phasing.

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: 13 templates plus the contract, Systems: 1 |
| Risk | 9/25 | Auth: N, API: N, Breaking: N, contract-bounded template edits |
| Research | 8/20 | The recommendations are already adjudicated, and no new research runs here |
| Multi-Agent | 2/15 | No dispatch |
| Coordination | 6/15 | Dependencies: phase 003 and the corpus check |
| **Total** | **41/100** | **Level 2** |

---

## 10. OPEN QUESTIONS

- Whether `independent-percentages` is genuinely a multi-series form. One lineage lists it among the forms that earn a legend and the corpus describes it as several percentages that share no whole, which is a set of independent measures rather than a set of series. If the implementer reads it as single-series, the legend count drops to four and the per-form table records the change.
- How far the interaction hygiene should reach. One lineage adopts focus-outline suppression and text selection locking from the vendored source, and the other rejects the same two rules with the argument that a delivered chart is a document rather than a dashboard, so keyboard focus and copyable numbers are features. This phase carries the hygiene scoped to pointer-driven marks only and removes no keyboard focus indicator, which honours the recommendation without paying the cost the objection names. An operator who reads the objection as decisive can cut the rows outright.
- Whether the legend on `stacked-area` should also drive the dim, given that the same form already carries a per-period total the dim would obscure.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Durable Directive**: See `goal.md`
