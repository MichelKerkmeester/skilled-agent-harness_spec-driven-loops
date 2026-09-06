---
title: "Feature Specification: Give daily-range its first pointer contract, low and high, never a midpoint"
description: "daily-range carries no interaction register at all today. Each day's minimum and maximum exist only as the two endpoints of its bar. This phase transfers the pointer excerpt, adds the hygiene line this file alone is missing and registers every drawable bar with two rows, low then high, never a midpoint."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
  - "daily-range tooltip"
  - "daily-range hygiene line"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Give daily-range its first pointer contract, low and high, never a midpoint

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-05 |
| **Branch** | `scaffold/006-daily-range-endpoints` |
| **Parent Packet** | `sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states` |
| **Predecessor** | `003-excerpt-and-grouped-bars` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`daily-range` carries no interaction register at all today. It has zero occurrences of `data-chart-tooltip`, `data-chart-legend`, `data-chart-dim` and zero occurrences of the `:focus:not(:focus-visible)` hygiene line. Each day's minimum and maximum exist only as the two endpoints of its bar (`daily-range.html:263-264`). The day number and the axis rungs are the only text the drawing prints.

### Purpose
`daily-range` opens the same hover card the other five forms open. It names the day and gives its low and its high. It never gives a midpoint, because a midpoint is the average this form exists to refuse, and its own subtitle already says so.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Transfer the excerpt into `daily-range.html`.
- Add the `.figure svg :focus:not(:focus-visible) { outline: none; }` hygiene line, since this file is the only one of the six forms in this packet that is missing it.
- Register every drawable day's bar (`daily-range.html:263-264`), `TIP_ROWS = 2`, rows are low then high, never a midpoint.
- Hover walk, pin walk, reduced-motion check and no-script check.
- Byte delta measurement.

### Out of Scope
- A midpoint, an average or any single-number summary of the range. This form exists to refuse exactly that reading.
- Any change to which days are drawable or to the days-undrawn notice.
- `stacked-bars`, `daily-line` and `bar-line-composed` (`004-transfer-three-forms`) and `stacked-area` (`005-stacked-area-pointed-band`).
- Regenerating `assets/examples/*`, the `--render` run, the packet-wide byte-delta table and the acceptance-criteria reconciliation - phase 7/8.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-range.html` | Modify | Add the tooltip excerpt including the hygiene line, register every drawable day's bar |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Copy the CSS block, markup, card script and full listener block, including the click-pin and document-dismissal pair, verbatim into `daily-range.html`, exactly as phases 4 and 5 do. Maps to parent REQ-006. |
| REQ-002 | Add the `.figure svg :focus:not(:focus-visible) { outline: none; }` hygiene line (`box-plot.html:145`) in the same change that adds the register, since `daily-range.html` is the only one of the six forms in this packet without it and adding a register alone would turn `interaction-hygiene` red (`check-corpus.cjs:1146`). Maps to parent REQ-005. |
| REQ-003 | Register every drawable day's bar (`daily-range.html:263-264`) with `markable()`, `TIP_ROWS = 2`, naming the day and giving its low then its high. Never a midpoint. Maps to parent REQ-006. |
| REQ-004 | A day excluded from `drawable` (`daily-range.html:261`, the days-undrawn notice) gets no mark and no card. The notice text stays unchanged. Maps to parent REQ-002. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | No decorative element intercepts the pointer meant for a bar. Where the hover walk shows one does, its class gains `pointer-events: none`. Maps to parent REQ-005. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/check-corpus.cjs` prints `RESULT: PASSED` on `daily-range.html` with zero `interaction-hygiene`, `interaction-state` and `number-format` failures. Contributes to parent AC-008.
- **SC-002**: Deleting the hygiene line alone, temporarily, makes `interaction-hygiene` fail on `daily-range.html`, proving the line is doing work rather than sitting there. Restoring it returns `RESULT: PASSED`. Contributes to parent AC-006.
- **SC-003**: The hover, pin, reduced-motion and no-script walks pass, and the card never shows a value that is not the day's low or its high. Contributes to parent AC-008 and AC-009.
- **SC-004**: The byte delta is measured and recorded, feeding parent AC-011.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `003-excerpt-and-grouped-bars` | The excerpt has to exist and be proven before it is copied here | Do not start until phase 3 reports `RESULT: PASSED` on `grouped-bars.html` |
| Parallel | `004-transfer-three-forms`, `005-stacked-area-pointed-band` | None expected: disjoint template files | Confirm the file list stays disjoint before starting |
| Risk | This is the first register `daily-range.html` has ever carried, so it is the one form in this trio where the focus-ring requirement is newly triggered rather than already satisfied | High: adding the register without the hygiene line turns the corpus red | REQ-002 is a P0 blocker with its own proof, SC-002 |
| Risk | A reader misreads the card's two rows as a range or an average rather than two independent bounds | Medium: the form's whole reason for existing, refusing an average, gets undone by its own card | Label the rows Low and High explicitly. Never a single combined figure |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No pointer listener attaches before the drawing is built. `svg.appendChild(tipLayer)` stays the last statement in the script, exactly as in `box-plot.html:418`.
- **NFR-P02**: The byte delta is measured with `wc -c` before and after and reported as a number.

### Security
- **NFR-S01**: No external fetch, CDN, remote font or script is added.

### Reliability
- **NFR-R01**: With scripting unavailable, `daily-range` renders exactly the static figure and table it renders today.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A day with no complete range, excluded from `drawable`: confirm it gets no mark, per REQ-004.
- The widest day (`d === widest`, styled `range-wide`): confirm its card still reports low then high like every other bar, not a third "widest" row that is not part of the decided readout.

### Error Scenarios
- Scripting unavailable: the figure and table must still read exactly as they do today.

### State Transitions
- A tap pins a card on one bar. A tap on another bar re-pins it. A tap outside the drawing dismisses it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One file, but the one gaining both a register and its hygiene line for the first time |
| Risk | 7/25 | First-time focus-ring trigger. A mislabelled midpoint would defeat the form's whole purpose |
| Research | 2/20 | Fully decided. Nothing here awaits a finding |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None. The row count, the never-a-midpoint rule and the hygiene-line gap are decided in `research/research.md` section 2 row 13 and section 6.6, and in `research/phase-recommendation.md` PHASE 6.
<!-- /ANCHOR:questions -->
