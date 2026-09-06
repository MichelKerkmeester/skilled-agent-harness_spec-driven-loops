---
title: "Feature Specification: Transfer the pointer mechanism to stacked-bars, daily-line and bar-line-composed"
description: "Three of the seven partial forms already carry a legend or a dim but no tooltip. This phase copies the proven box-plot pointer mechanism into stacked-bars.html, daily-line.html and bar-line-composed.html unchanged, registering each form's own marks against its own readout."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
  - "stacked-bars tooltip transfer"
  - "bar-line-composed tooltip transfer"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Transfer the pointer mechanism to stacked-bars, daily-line and bar-line-composed

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
| **Branch** | `scaffold/004-transfer-three-forms` |
| **Parent Packet** | `sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states` |
| **Predecessor** | `003-excerpt-and-grouped-bars` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`stacked-bars`, `daily-line` and `bar-line-composed` each carry a legend, a dim or both, but none of the three opens a hover card. Their values exist only as geometry. A segment under 22 units prints no number and the form draws no tick ladder to read one off (`stacked-bars.html:333`). The day-line prints only its emphasised low and leaves the other 27 dots as position only (`daily-line.html:380`). The composed form draws two ladders on one shared gridline set, so a reader converting an off-scale height cannot trust the result (`research/research.md` section 2, rows 8, 11, 12).

### Purpose
Each of the three forms opens the same hover card that `003-excerpt-and-grouped-bars` proves on `grouped-bars`, filled with the reading that form's own contract requires, so a pointer answers what the geometry alone cannot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Transfer the excerpt phase 3 extracts (CSS, markup, card script, listeners including the click-pin and document-dismissal pair) into `stacked-bars.html`, `daily-line.html` and `bar-line-composed.html`, unchanged.
- Register `stacked-bars`' own segment marks, `TIP_ROWS = 1`, restating the printed number for a segment at or above the 22-unit gate and supplying it for one below.
- Register `daily-line`'s own day marks, `TIP_ROWS = 1`.
- Register `bar-line-composed`'s own period marks, `TIP_ROWS = 2`, each row tagged with the ladder (count or rate) it reads against.
- The hover walk, pin walk, reduced-motion check and no-script check per form.
- The per-file byte delta measurement.

### Out of Scope
- Any change to how a mark is drawn, its data or its colour - only the pointer surface is added.
- `stacked-area` and `daily-range` - separate phases (`005-stacked-area-pointed-band`, `006-daily-range-endpoints`).
- Regenerating `assets/examples/*` - phase 7's decision.
- The `--render` run, the packet-wide byte-delta table and the acceptance-criteria reconciliation - phase 8.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-bars.html` | Modify | Add the tooltip excerpt, register every segment |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html` | Modify | Add the tooltip excerpt, register every day's dot |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-line-composed.html` | Modify | Add the tooltip excerpt, register every period's column and dot, tag each row with its ladder |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Copy the CSS block (`box-plot.html:124-150`), the empty `<g data-chart-tooltip id="tip-<form>">` markup (`box-plot.html:161`, placed after each file's `<desc>`), the card-building script (`box-plot.html:235-317`) and the full listener block including the click-pin and document-dismissal pair (`box-plot.html:381-418`) into all three files, unchanged. Maps to parent REQ-006. |
| REQ-002 | Register every mark each form's own readout requires: `stacked-bars` segments at `TIP_ROWS = 1`, `daily-line` day dots at `TIP_ROWS = 1`, `bar-line-composed` period columns and rate dots at `TIP_ROWS = 2`. Maps to parent REQ-006. |
| REQ-003 | `bar-line-composed`'s card tags each of its two rows with the ladder it reads against, count or rate, because the two ladders share one gridline set and an untagged pair reproduces the ambiguity the card exists to resolve. Maps to parent REQ-002 and REQ-006. |
| REQ-004 | `stacked-bars`'s card restates the printed number for a segment at or above the 22-unit gate (`stacked-bars.html:333`) and supplies the number the figure omits for a segment below it. Maps to parent REQ-006. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Every value the card can show is already present in that form's `data-chart-table`. Maps to parent REQ-002, satisfied structurally since all three tables are already complete. |
| REQ-006 | No decorative element painted over a registered mark intercepts the pointer meant for that mark. Where the hover walk shows one does, its class gains `pointer-events: none`, mirroring `box-plot.html:140`. Maps to parent REQ-005. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/check-corpus.cjs` prints `RESULT: PASSED` after each of the three files is changed, with `interaction-hygiene`, `interaction-state` and `number-format` reporting zero failures. Contributes to parent AC-008.
- **SC-002**: On each form, a hover walk, a pin walk, a reduced-motion check and a no-script check all pass. Contributes to parent AC-008 and AC-009.
- **SC-003**: The per-file byte delta is measured and recorded for all three files, feeding parent AC-011.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `003-excerpt-and-grouped-bars` | The excerpt has to exist and be proven before it is copied a third and fourth time | Do not start until phase 3 reports `RESULT: PASSED` on `grouped-bars.html` |
| Parallel | `005-stacked-area-pointed-band`, `006-daily-range-endpoints` | None expected: disjoint template files, all three consume the same excerpt without changing it | Confirm the file list stays disjoint before starting |
| Risk | A decorative line or label painted over a mark intercepts its pointer events | Medium: a hover that opens the wrong card or none at all | Verified per form during the hover walk (REQ-006), fixed with `pointer-events: none` on the intercepting class as box-plot already does |
| Risk | `bar-line-composed`'s two ladders read as one number if the tag is dropped | High: the card would reproduce the exact ambiguity it exists to resolve | REQ-003 is a P0 blocker, not a nice-to-have |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No pointer listener attaches before the drawing is built. `svg.appendChild(tipLayer)` stays the last statement in each file's script, exactly as in `box-plot.html:418`.
- **NFR-P02**: The byte delta per file is measured with `wc -c` before and after and reported as a number, not assumed to match the 7,016-byte measurement from `box-plot.html` exactly.

### Security
- **NFR-S01**: No external fetch, CDN, remote font or script is added. The excerpt is inline CSS, markup and script only.

### Reliability
- **NFR-R01**: With scripting unavailable, all three forms render exactly the static figure and table they render today.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A `stacked-bars` segment exactly at the 22-unit gate: confirm the card and the printed label agree rather than one rounding differently than the other.
- A `bar-line-composed` period with a missing rate (`Number.isFinite(d.rate)` false, `bar-line-composed.html:397`): confirm no mark is registered for a reading that does not exist, rather than a card opening on a gap.
- A `daily-line` day with a missing value: the low-search already filters to `Number.isFinite` readings (`daily-line.html:356`). Confirm the same filter keeps an unregistered gap from opening a card.

### Error Scenarios
- Scripting unavailable: all three figures and tables must still read exactly as they do today.
- A decorative path or label drawn over a mark's area: the hover walk must confirm the correct mark opens, not the decoration.

### State Transitions
- A tap pins a card on one of the three forms. A tap on a different mark on the same form re-pins it. A tap outside the drawing dismisses it. Hover does nothing while pinned.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three files, one proven excerpt, no new mechanism |
| Risk | 6/25 | Presentation-layer only. The one open question is per-mark overlap, checked by hand per form |
| Research | 2/20 | Fully decided. Nothing here awaits a finding |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None. The mechanism, the per-form readout and the row counts are decided in `research/research.md` section 6.6 and carried into this spec unchanged.
<!-- /ANCHOR:questions -->
