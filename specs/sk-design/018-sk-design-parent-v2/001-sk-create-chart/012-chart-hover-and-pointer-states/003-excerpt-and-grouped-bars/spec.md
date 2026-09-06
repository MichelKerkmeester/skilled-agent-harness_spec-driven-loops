---
title: "Feature Specification: Extract the excerpt and transfer it to grouped-bars"
description: "box-plot.html carries a working hover-and-pin mechanism nothing else in the corpus reuses, because there is no shared runtime. This phase proves the mechanism transfers by copying it into grouped-bars, the simplest of the six forms gaining a tooltip, and measures what one copy costs."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Extract the excerpt and transfer it to grouped-bars

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
| **Parent Packet** | `sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states` |
| **Depends On** | `001-register-and-contract` (the recorded contract and readout table for `grouped-bars`) |
| **Runs With** | `002-annotate-inert-forms`. Disjoint files: this phase touches one template that gains code and no attribute, phase 2 touches six templates that gain an attribute and no code |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`box-plot.html` carries a complete, working hover card, a click-to-pin path, a reduced-motion guard and a no-script fallback, all self-contained, because `REQ-008` forbids any file in this corpus from depending on a shared runtime. `grouped-bars.html` declares `data-chart-tooltip` in phase 1's contract table (it gains one, per the decided contract) but carries none of this mechanism today: its column values are plotted as geometry with nothing printed on the mark, and its axis ticks only bracket a reading rather than giving one. Copying `box-plot`'s mechanism into five more forms without first proving it on one, simplest form risks compounding the same mistake five times before anyone notices it.

### Purpose
`grouped-bars.html` opens a hover card naming the pointed column's series and value, a tap pins and unpins it exactly as `box-plot.html`'s does, the corpus still prints `RESULT: PASSED`, and the per-file byte cost of the copied mechanism is measured and recorded rather than assumed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Copy the hover-card mechanism (CSS, markup, card-building script, listeners and the pin) from `box-plot.html` into `grouped-bars.html`, adapted to this form's own data, formatter and node helper.
- Register each column mark with `markable()`, naming its series and printing its value through the file's own `fmt()`.
- Add the reduced-motion guard line to `grouped-bars.html`'s existing `@media (prefers-reduced-motion: reduce)` block.
- Measure the file's byte size before and after the change with `wc -c`, and record the delta.
- Manually verify hover, pin, reduced motion and the no-script fallback.

### Out of Scope
- Any other form. Phases 4, 5 and 6 transfer the same mechanism to `stacked-bars`, `daily-line`, `bar-line-composed`, `stacked-area` and `daily-range`, each with its own readout shape.
- Any change to `check-corpus.cjs`, `references/template-contract.md` or `scripts/README.md` - those are phase 1's files.
- Writing a shared file, a partial or an include for the mechanism. `REQ-008` and `spec.md` section 3's constraint forbid a shared runtime, so the mechanism is copied, not referenced.
- The final byte table across all six forms - that is phase 8's job (`AC-011`), which reports every changed file's real number. This phase reports its own single number as evidence for that later table.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html` | Modify | Add the hover-card CSS, the empty tooltip group, the card-building script, the listeners and pin, and register each column mark |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `grouped-bars`, one of the seven partial forms, gains the hover card its decided contract promises, proving the shared mechanism transfers to a form that did not have it before phases 4 through 6 repeat the copy five more times. |
| NFR-P02 | The per-file byte-size increase from copying the mechanism into `grouped-bars.html` is measured with `wc -c` and reported as a number, not assumed small. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/check-corpus.cjs` prints `RESULT: PASSED`, with `interaction-hygiene`, `interaction-state` and `number-format` each reporting zero failures on `grouped-bars.html` (contributes to AC-008).
- **SC-002**: Opening `grouped-bars.html` with no network, the card opens on hover over any column, names the correct series and value, and flips to the other side of a mark near the right edge of the frame rather than opening past it (contributes to AC-008).
- **SC-003**: A tap pins the card, a tap on another column re-pins it, a second tap on the pinned column clears it, and a tap outside the drawing clears it. Hover does nothing while a mark is pinned (contributes to AC-008, AC-009).
- **SC-004**: With the system set to reduced motion, the card appears with no fade rather than a fast one (contributes to AC-008).
- **SC-005**: With scripting disabled, the figure and its table read exactly as they did before this phase (contributes to AC-003).
- **SC-006**: The `wc -c` byte delta for `grouped-bars.html` is recorded as a number (feeds AC-011's phase 8 table).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-register-and-contract` | This phase's readout shape (series name as card name, one value row) comes from phase 1's readout table | Confirm phase 1's readout table names `grouped-bars`'s shape before starting, and use it rather than re-deriving the shape from `box-plot.html` alone |
| Risk | Getting the excerpt wrong here means five more forms inherit the same mistake in phases 4 through 6 | High for the packet, contained for this phase | Walk every verification step by hand before calling this phase done: hover, pin, reduced motion, no-script. This is the one phase where a shortcut compounds |
| Risk | `checkNumberFormat` (`check-corpus.cjs:1201`) requires a file carrying `data-chart-tooltip` to define its own `fmt()` | Low: `grouped-bars.html` already defines one at `:233` | Confirm the existing `fmt()` is reused rather than a second one being added by mistake |
| Risk | The reduced-motion guard selector must be spelled `[data-chart-tooltip]` exactly, since the `motion` check matches guards per selector after collapsing whitespace, which is stricter than CSS | Medium: a differently-spelled but equivalent selector reads as a different rule to the check and fails it | Add the line verbatim as `[data-chart-tooltip] { transition: none; }` inside the existing `@media (prefers-reduced-motion: reduce)` block at `grouped-bars.html:155-158`, not a new media block |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No pointer logic runs before the figure is readable. The listeners attach after the drawing is built, and `svg.appendChild(tipLayer)` is the last statement the script runs, matching `box-plot.html`'s own ordering.
- **NFR-P02**: Measured. `grouped-bars.html` is 19,671 bytes before this phase. Report the exact post-change size and the delta. Expect it near the excerpt's measured 7,016 bytes plus this form's own registration code (five `markable()` calls, one per drawn column, since `DATA` in this file holds 5 categories times 2 series values).

### Security
- **NFR-S01**: No external fetch, CDN reference or remote resource is introduced. The copied mechanism is inline CSS and inline script, matching every other form in the corpus.

### Reliability
- **NFR-R01**: With scripting unavailable, `grouped-bars.html` renders the same readable static figure and table it renders today. The tooltip group ships empty, and the drawing code, which never runs without script, is what fills it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A column pair near the right edge of the drawing: the card must flip to the left of the mark rather than clipping past the frame, exactly as `box-plot.html:341-345`'s flip logic already does.
- The legend entries already carry `tabindex`, `role="button"` and `aria-pressed` and are not marks. Confirm the new `markable()` calls target only the column `<path>` elements (`grouped-bars.html:336-340`) and never the legend group.

### Error Scenarios
- Scripting unavailable: the empty tooltip group ships with no content, so there is nothing to hide and nothing for `checkInteractionState` to flag.
- No decorative element overlaps a column mark in this form (unlike `box-plot`'s whisker and median lines), so no `pointer-events: none` exemption is needed here. Confirm this by inspection rather than assuming it, since a future data change could add one.

### State Transitions
- Pointer leaves the figure while the card is open and not pinned: the card closes, per the `pointerleave` listener copied from `box-plot.html:380-382`.
- Focus moves by keyboard to a legend entry while the card is open: the two are independent controls and neither should suppress the other, since the legend's dim behaviour and the tooltip's hover behaviour are unrelated registers.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One file, but four distinct blocks (CSS, markup, card script, listeners) all have to transfer correctly together |
| Risk | 10/25 | This is the form every later phase copies from, so a mistake here propagates to five more forms in phases 4 through 6 |
| Research | 2/20 | The mechanism, its exact line ranges and this form's readout shape are all decided in phase 1's contract and readout tables |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None outstanding for this phase. The mechanism, the readout shape and the byte-cost expectation are all decided ahead of the build. The one thing this phase discovers rather than decides is the exact measured byte delta.
<!-- /ANCHOR:questions -->
