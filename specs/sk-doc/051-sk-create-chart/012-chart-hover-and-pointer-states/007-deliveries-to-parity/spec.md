---
title: "Feature Specification: Bring the six chart deliveries to parity with their parent templates' pointer contracts"
description: "Six delivered charts under assets/examples carry none of the pointer markers their own parent templates use. This phase transfers the working tooltip mechanism into four of them and declares the remaining two inert, closing the gap the research found but the recommendation left unsized."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deliveries to parity with their parent templates' pointer contracts

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
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states |
| **Depends On** | 004-transfer-three-forms, 005-stacked-area-pointed-band, 006-daily-range-endpoints (siblings under this same parent) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six delivered charts live under `assets/examples/`, and measured across all six, none carries `data-chart-tooltip`, `data-chart-legend`, `data-chart-dim` or the `:focus:not(:focus-visible)` hygiene line. Four of the six were built from a template that already answers a pointer with a working hover card, so a reader who opens the delivered file directly gets a static picture the template it was built from does not ship. A fifth gap opens once phase 004-transfer-three-forms lands `daily-line.html`'s card: `orders-after-the-price-change.html`, built from `daily-line`, falls behind the moment its own parent gains the interaction the other three parents already carry.

### Purpose
Every one of the six deliveries under `assets/examples/` carries the same pointer contract its parent template records, either the transferred tooltip mechanism or the `data-chart-inert` declaration, so a delivered file is never behind the template it was built from.

### Non-Goals
- Building a generator that regenerates a delivery from its template automatically. No such generator exists today, and research.md section 9 (O1) found none, so this phase does not build one.
- Re-deriving the tooltip mechanism already shipped in `heat-matrix.html`, `distribution-strip.html` or `scatter.html`. Their code is copied, not redesigned.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Transfer the tooltip mechanism already shipped in `heat-matrix.html`, `distribution-strip.html` and `scatter.html` into their respective deliveries.
- Transfer the tooltip mechanism phase 004-transfer-three-forms lands in `daily-line.html` into `orders-after-the-price-change.html`.
- Add `data-chart-inert`, carrying the same reason its parent template records, to `where-the-budget-went.html` and `staff-hours-by-service.html`.
- Record the delivery-parity decision as one paragraph in `references/template-contract.md`.

### Out of Scope
- Building a generator that regenerates a delivery from its template automatically, no such generator exists and this phase does not build one.
- Re-deriving the tooltip mechanism already shipped in the three donor templates, their code is copied and not redesigned.
- Any delivery not named in this document, and any change to a template beyond what phases 001 through 006 already make.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/calls-by-day-and-hour.html` | Modify | Gains the tooltip CSS, markup group and script transferred from `heat-matrix.html` |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/pick-times-by-depot.html` | Modify | Gains the tooltip mechanism transferred from `distribution-strip.html` |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/van-age-against-repair-cost.html` | Modify | Gains the tooltip mechanism transferred from `scatter.html`, including its two-row readout |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/orders-after-the-price-change.html` | Modify | Gains the tooltip mechanism phase 004-transfer-three-forms lands in `daily-line.html` |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/where-the-budget-went.html` | Modify | Gains `data-chart-inert` with `unit-grid.html`'s reason |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/staff-hours-by-service.html` | Modify | Gains `data-chart-inert` with `bar-rows.html`'s reason |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | One paragraph stating that a delivery's pointer contract matches its parent template's |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `calls-by-day-and-hour.html`, `pick-times-by-depot.html` and `van-age-against-repair-cost.html` each carry the same tooltip mechanism (CSS, markup group and script) as their parent template, adapted to that delivery's own marks and data. Maps to parent REQ-001 and REQ-006. |
| REQ-002 | `orders-after-the-price-change.html` carries the tooltip mechanism phase 004-transfer-three-forms builds for `daily-line.html`. Maps to parent REQ-001 and REQ-006. |
| REQ-003 | `where-the-budget-went.html` and `staff-hours-by-service.html` carry `data-chart-inert` with the same reason recorded for `unit-grid.html` and `bar-rows.html`. Maps to parent REQ-001. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `references/template-contract.md` states, in one paragraph a reader can disagree with, that a delivery's pointer contract matches its parent template's. Maps to parent REQ-001 and REQ-005. |
| REQ-005 | None of the four transfers or two declarations introduces an external runtime, a framework, a CDN reference or a build step. Maps to parent REQ-008. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the six deliveries still renders the same readable static figure with scripting unavailable after the change. Maps to parent AC-003.
- **SC-002**: `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED` reading the full corpus of 30 files, the 21 templates, the 6 examples and the 3 palette sheets, not the 21 templates alone. Maps to parent AC-007.
- **SC-003**: A grep of the six deliveries for external `src`, `href` and `import` targets returns the same count as before this phase. Maps to parent AC-010.
- **SC-004**: `references/template-contract.md` names the delivery-parity decision in a stated sentence, not in silence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 004-transfer-three-forms, 005-stacked-area-pointed-band and 006-daily-range-endpoints, siblings under this same parent | `orders-after-the-price-change.html`'s transfer consumes the card phase 004 builds for `daily-line.html` | Do not start this phase until all three report `RESULT: PASSED` at their own final state |
| Dependency | Phase 002-annotate-inert-forms landing the exact reason strings on `unit-grid.html` and `bar-rows.html` | The two `data-chart-inert` declarations in this phase copy those strings rather than restate them | Read the landed attribute value from the template before writing the delivery's copy |
| Risk | A delivery's drawing code names its variables and loops differently from its parent template's | Copying the registration call verbatim could fail to register the intended marks | Read the delivery's own drawing loop before adapting the `markable(...)` call, per file, rather than assuming a byte-for-byte copy of the whole script block |
| Risk | The corpus's own history warns against an exemption nobody verified (`checkEmptyNotice`, removed after it was checked and found unearned) | A delivery-parity change that skips the render run or the scripting-disabled read would repeat that history | Run `node scripts/check-corpus.cjs --render` and the scripting-disabled read before claiming this phase complete |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: First paint stays static for all six deliveries. No pointer logic runs before each figure is readable, exactly as the parent packet's NFR-P01 already requires.
- **NFR-P02**: The per-file size increase from each of the four transfers is measured with `wc -c` before and after, and reported for phase 008-closure-and-proof's byte table rather than assumed negligible.

### Security
- **NFR-S01**: No external fetch, no CDN, no remote font or script in any of the six deliveries after the change.

### Reliability
- **NFR-R01**: With scripting unavailable, all six deliveries degrade to the same readable figure they render today.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A delivery's demo data differs from its parent template's, so the transferred `TIP_ROWS` count and row content must match the delivery's own readout, not the template's placeholder numbers.
- `van-age-against-repair-cost.html` inherits a two-row readout (`TIP_ROWS = 2`) from `scatter.html`, while the other three transferred forms carry a one-row readout.

### Error Scenarios
- A delivery whose drawing loop does not expose a single mark-creating call the way its template does. Read the delivery's own script before adapting the registration, rather than assuming the template's shape applies unchanged.
- A headless browser missing on the machine running `--render`. `check-corpus.cjs` errors rather than skipping, so treat the absence as a blocking condition to report.

### State Transitions
- A tap pinning a mark in one of the four transferred deliveries while a hover is already open elsewhere, out of scope here since each delivery is a single self-contained file with one drawing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Six files plus one paragraph, but the pattern repeats four times with no new mechanism |
| Risk | 6/25 | Presentation-layer only, contained to `sk-doc/sk-create-chart`, no shared runtime |
| Research | 3/20 | Fully resolved by research.md sections 2, 6 and 9 |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator resolved this phase's only open decision, transfer versus record-as-position, choosing transfer (research.md section 9, O1, and phase-recommendation.md PHASE 7).
<!-- /ANCHOR:questions -->
