---
title: "Feature Specification: Give stacked-area a hover card naming the pointed band"
description: "stacked-area carries a legend and a dim but no tooltip. Its bands are full-width paths, so a pointer identifies a series and never an x position. This phase transfers the pointer excerpt unchanged, registers each band as its own mark and amends the contract row phase 1 wrote so the recorded contract matches the pointed-band readout that was actually built."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
  - "stacked-area tooltip"
  - "pointed band readout"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Give stacked-area a hover card naming the pointed band

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
| **Branch** | `scaffold/005-stacked-area-pointed-band` |
| **Parent Packet** | `sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states` |
| **Predecessor** | `003-excerpt-and-grouped-bars` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`stacked-area` carries a legend and a dim but no tooltip. Its band and total values exist only as thickness, and the axis ladder is the only number the drawing prints (`stacked-area.html:301-305`). A band is a single path spanning the whole time axis (`stacked-area.html:343-346`), so registering it the way every other form registers a mark gives series identity only, never an x position. The readout research first proposed, all four band values plus the total at the pointed x, cannot be built on this mechanism without per-x hit targets, which is machinery this corpus has never carried (`research/research.md` section 9, item O4).

### Purpose
`stacked-area` opens the same hover card the other five forms open. It names the pointed band and reports one value for it, so a pointer answers something the geometry alone cannot, without adding a new kind of machinery to the corpus.

### Non-Goals
- Per-x hit targets or any new hit-testing mechanism. Ruled out in `research/research.md` sections 9 and 10.
- Reworking how a band is drawn, its data or its colour.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Transfer the excerpt unchanged into `stacked-area.html`.
- Register each of the four band paths (`stacked-area.html:343-346`) as its own mark, `TIP_ROWS = 1`.
- The card names the band by its series name and reports one row: its total across the period, summed the same way the table's own `Total` column is summed, along the other axis (`stacked-area.html:421`).
- Amend the `stacked-area` row phase 1 records in `references/template-contract.md`'s 21-row contract table, changing its readout from "all four band values plus the total" (`TIP_ROWS = 5`) to "the pointed band and its value" (`TIP_ROWS = 1`).
- Hover walk, pin walk, reduced-motion check and no-script check.
- Byte delta measurement.

### Out of Scope
- Per-x hit targets or any new hit-testing machinery.
- Any change to how a band is drawn, its data or its colour.
- `stacked-bars`, `daily-line` and `bar-line-composed` (`004-transfer-three-forms`) and `daily-range` (`006-daily-range-endpoints`).
- Regenerating `assets/examples/*`, the `--render` run, the packet-wide byte-delta table and the acceptance-criteria reconciliation - phase 7/8.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-area.html` | Modify | Add the tooltip excerpt, register each of the four band paths |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | Amend the `stacked-area` contract row phase 1 wrote, from the four-band-plus-total readout to the pointed-band readout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Copy the CSS block, markup, card script and full listener block, including the click-pin and document-dismissal pair, verbatim into `stacked-area.html`, exactly as phases 4 and 6 do. Maps to parent REQ-006. |
| REQ-002 | Register each of the four band paths (`stacked-area.html:343-346`) as its own mark with `markable()`, `TIP_ROWS = 1`. The card names the band by its series name and reports one row: its total across the period, computed the same way the table's per-month `Total` column is computed (`stacked-area.html:421`), summed along the other axis. Maps to parent REQ-006. |
| REQ-003 | Amend the `stacked-area` row in `references/template-contract.md`'s 21-row contract table, the row phase 1 writes, so its recorded readout and `TIP_ROWS` match the pointed-band contract rather than the four-band-plus-total readout research first proposed. Maps to parent REQ-001 and REQ-006. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Label the card's row so the number reads as a period total and not as a reading at the hovered x. Maps to parent REQ-002. |
| REQ-005 | No decorative element, an axis grid line (`stacked-area.html:301-305`) or a neighbouring band, intercepts the pointer meant for a band. Where the hover walk shows one does, its class gains `pointer-events: none`. Maps to parent REQ-005. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/check-corpus.cjs` prints `RESULT: PASSED` on `stacked-area.html` with zero `interaction-hygiene`, `interaction-state` and `number-format` failures. Contributes to parent AC-008.
- **SC-002**: The hover, pin, reduced-motion and no-script walks all pass. Contributes to parent AC-008 and AC-009.
- **SC-003**: `references/template-contract.md`'s `stacked-area` row reads the amended contract, and `ls assets/templates/*.html` still counts 21 rows against the table. Contributes to parent AC-001.
- **SC-004**: The byte delta is measured and recorded, feeding parent AC-011.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `003-excerpt-and-grouped-bars` | The excerpt has to exist and be proven before it is copied here | Do not start until phase 3 reports `RESULT: PASSED` on `grouped-bars.html` |
| Dependency | Phase 1's `stacked-area` contract row must already exist in `references/template-contract.md` | REQ-003 has nothing to amend until phase 1 has written it | Confirm the row exists before starting the amendment task |
| Parallel | `004-transfer-three-forms`, `006-daily-range-endpoints` | None expected: disjoint template files | Confirm the file list stays disjoint before starting |
| Risk | A reported total is misread as a value at the hovered x | Medium: a reader assumes the number tracks the pointer along the band | REQ-004: label the row explicitly, for example "Total, whole period" |
| Risk | The axis grid lines sit close to a band's edge near its thinnest point | Low: a hover that opens the axis instead of the band | Verified per band during the hover walk (REQ-005) |
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
- **NFR-R01**: With scripting unavailable, `stacked-area` renders exactly the static figure and table it renders today.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A band whose thickness narrows toward zero in some months, for example perpetual narrowing to 18 (`stacked-area.html:167-168`): confirm hovering near it still resolves to that band rather than its neighbour.
- A run with a gap (`stacked-area.html` comment on runs with holes): confirm a series with more than one run registers each run as its own mark rather than only the first.

### Error Scenarios
- Scripting unavailable: the figure and table must still read exactly as they do today.

### State Transitions
- The card's reported total does not change as the pointer moves to a different x along the same band, since the value is fixed at registration and not read per x. This is expected behaviour, not a defect, and must read that way to a tester who has not seen this document.
- A tap pins a card on one band. A tap on a different band re-pins it. A tap outside the drawing dismisses it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One template plus one contract-document amendment |
| Risk | 8/25 | One resolved judgement call, what "the band's value" means, recorded in REQ-002 and REQ-004 rather than left open |
| Research | 3/20 | The mechanism decision is settled. The exact reported number is decided here, not in the research |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None left blocking. One judgement call is recorded rather than left open: REQ-002 defines "its value" as the band's total across the period, reusing the file's own Total concept along the other axis, because the mechanism cannot deliver a genuine per-x reading without hit-target machinery this phase does not build (`research/research.md` section 9, item O4).
<!-- /ANCHOR:questions -->
