---
title: "Feature Specification: shadcn visual upgrade"
description: "Bring the 26 standalone chart templates, their deliveries and the gallery up to the visual register shadcn's chart examples set: card anatomy with a footer line, bare axes, horizontal-only dashed grid, rounded marks, gradient area fills, a bordered tooltip card, legend chips and a fixed light column in the gallery."
trigger_phrases:
  - "chart visual upgrade"
  - "shadcn chart look"
  - "tooltip card"
  - "legend chips"
  - "gallery light column"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: shadcn visual upgrade

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 13 compared shadcn's chart examples with the standalone corpus and phase 14 adopted the three structural ideas worth keeping: keyed series tokens, local readout knobs and declared curves. Neither phase touched how the charts look. The corpus still reads as a monochrome draft: a dot on every data point, flat grey area fills, mono tick text with axis lines, no legend, no card footer, and an SVG-text tooltip. The gallery's light column renders dark because the frame pins `color-scheme` while the templates key their palette off `prefers-color-scheme`. The operator expected the research to produce a visual upgrade of the templates, assets and screenshots, and it did not.

### Purpose
Raise every template, delivery and the gallery to the visual register shadcn's frozen examples set, measured from the phase 13 copy under `../013-shadcn-reference-research/scratch/shadcn/`, while keeping every decision the research said to keep: the form catalogue, the role palettes and their numeric gates, direct paths, the table fallback and the inert-versus-tooltip register. The checker's visual families are retuned to the new system, never removed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Eight visual moves, each applied to all 26 forms where the form has the part, then mirrored into the four deliveries and the gallery:

1. **Card anatomy.** Header with a 16px semibold title and a 14px muted description; content; footer carrying a one-line finding in the ink colour and a muted description line below it, separated from the content by the rule. The source line stays in the footer. Measured from `chart-area-interactive.tsx:157-185` and the 56 examples that carry a footer.
2. **Bare axes.** No axis line, no tick line, 8px tick margin, 12px muted tick labels in the body typeface with tabular numerals; category ticks shortened to what fits. Measured from `tickLine={false}`, `axisLine={false}`, `tickMargin={8}` across the examples.
3. **Grid.** Horizontal dashed rules only, at the rule colour, no vertical rules. Measured from `vertical={false}` in 27 examples.
4. **Marks.** Bars take a 4px radius on their free corners and 8px when a single bar fills the band; stacked bars round only the outer ends; lines are 2px with no per-point dot unless the form's contract names the point; the highlighted point keeps its marker. Measured from `radius={[4, 4, 0, 0]}`, `strokeWidth={2}`, `dot={false}`.
5. **Area fills.** A vertical gradient from the series colour at 0.8 alpha at the top to 0.1 at the baseline, with stacked areas at 0.4 flat; stroke stays the series colour at 2px. Measured from the `linearGradient` examples and `fillOpacity={0.4}`.
6. **Tooltip card.** A bordered card with the ground colour, 8px radius, 10px by 6px padding, 12px text, a soft shadow; one row per series with an 8px square indicator at a 2px radius in the series colour, a muted label and a mono tabular value; no crosshair cursor. The card is a positioned HTML element inside the template, not an SVG text group, and it keeps reading `READOUT`. Measured from `chart.tsx:186-260`.
7. **Legend chips.** For multi-series forms, a centred row below the plot of 8px squares at a 2px radius with muted 12px labels and a 16px gap. Measured from `chart.tsx:286-330`.
8. **Colour use.** Single-series cartesian forms paint their primary mark with the first series token of their own colour system, and the emphasis token stays for the one highlighted mark; the neutral and ordered roles keep their current jobs. The palette values and their contrast, ramp-step and emphasis gates do not change. (Amended during the build: the original wording said the first *categorical* token. Switching a neutral form to the categorical system would replace its orange emphasis with the categorical system's ink emphasis and lose the highlighted mark, so the form keeps its own system.)

Also in scope: the gallery pins its light and dark frames so each column renders its own scheme; `screenshots/` is regenerated for every form, both schemes, plus the gallery; `template-contract.md` gains the visual system in its own voice; the checker's `type-scale`, `radius`, `card-parts` and `interaction-hygiene` families are retuned to the new values with the same coverage; a changelog entry records the version bump.

### Out of Scope

- Any new chart form, radar and pie included; any change to the form catalogue.
- Natural curves, the raw five-token ramp, external resources of any kind; phase 14's contracts stay as written.
- Loosening any contrast, ramp-step, emphasis or source-equality gate, or the accessibility floor (role, label, table).
- The four policy-gated items in phase 14's section 10.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/*.html` | Modify | The eight visual moves, per form |
| `.opencode/skills/sk-design/sk-design-chart/assets/examples/*.html` | Modify | Deliveries follow their templates |
| `.opencode/skills/sk-design/sk-design-chart/assets/gallery.html`, `scripts/build-gallery.cjs` | Modify | Per-frame scheme pinning the templates honour; regenerated page |
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modify | Visual families retuned to the new system; a `legend` assertion for multi-series forms; a `tooltip-card` assertion for tooltip forms |
| `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md`, `color-system.md` | Modify | The visual system stated where authors read it; the single-series colour rule |
| `.opencode/skills/sk-design/sk-design-chart/screenshots/**` | Regenerate | Every form in both schemes plus the gallery |
| `.opencode/skills/sk-design/sk-design-chart/changelog/v1.3.0.0.md`, `SKILL.md`, `README.md` | Modify | Version bump and the visual system named in the skill's own words |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every template carries the card anatomy of section 3 item 1, the bare axes of item 2 and the horizontal-only grid of item 3 where the form has an axis; `check-corpus.cjs` holds the type scale and card parts at the new values for all 26 forms |
| REQ-002 | Every bar form rounds its free corners, every line form draws a 2px path without per-point dots, every area form uses the gradient fill, per section 3 items 4 and 5; the `radius` family holds the new values |
| REQ-003 | Every tooltip-bearing form renders the tooltip as the bordered HTML card of section 3 item 6, reading its rows from `READOUT`; a new `tooltip-card` assertion fails a tooltip form without it, and the card-readout render check still passes |
| REQ-004 | Every multi-series form carries the legend chips of section 3 item 7 keyed to its declared series; a new `legend` assertion fails a multi-series form without one |
| REQ-005 | `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` with zero errors on the final corpus, and each new assertion is shown failing on a mutated copy first |
| REQ-006 | The gallery renders its light column light and its dark column dark; `screenshots/gallery.png` shows both |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `screenshots/` holds a fresh light and dark capture of every form and every delivery, produced from the final corpus |
| REQ-008 | `template-contract.md` and `color-system.md` state the visual system and the single-series colour rule in their own voice; `changelog/v1.3.0.0.md` records the bump and the skill front matter carries it |
| REQ-009 | No palette value, contrast, ramp-step, emphasis or source-equality gate is loosened; no template gains an external reference; phase 14's three contracts still hold |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-corpus.cjs --render` prints `RESULT: PASSED`, its family list includes `legend` and `tooltip-card`, and the five render-dependent families report zero failures.
- **SC-002**: A mutation of each new kind, a multi-series form without a legend and a tooltip form with the old SVG text group, each turns the run to `RESULT: FAILED` naming the assertion.
- **SC-003**: Opening `screenshots/gallery.png` shows a light column and a dark column that differ, and opening any template capture shows the card footer, bare axes, rounded marks and, where the form has them, legend chips.
- **SC-004**: An independent reviewer comparing three template captures against three shadcn examples of the same form finds the same card anatomy, axis treatment, mark radius and tooltip card, and finds no palette change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The frozen shadcn copy under `../013-shadcn-reference-research/scratch/shadcn/` | Source of every measured value | Cite file and line for each value; do not fetch anything |
| Dependency | Phase 14's contracts (`READOUT`, `CURVE`, keyed series) | The tooltip card and legend read them | Build on the blocks; never bypass them |
| Risk | Retuning `type-scale`, `radius` and `card-parts` silently drops coverage | High | Assertion counts per family must not fall; the diff is reviewed for removed checks |
| Risk | An HTML tooltip escapes the SVG and breaks pointer reach or the narrow-viewport family | Med | `--render` after every form; pointer-reach and narrow-viewport stay in the gate |
| Risk | Gradient fills or coloured single series fail the existing contrast gates | Med | Gates are numeric and unchanged; a failing form is fixed in the form, not the gate |
| Risk | The gallery fix changes how the checker's `gallery` family reads frames | Low | Run the family after the fix; adjust the assertion to the new pin, keeping its count |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each template stays a single file under the existing size and the settled-render budget of 3000ms.

### Security
- **NFR-S01**: No template gains an external reference; the `no-external` family keeps erroring on any.

### Reliability
- **NFR-R01**: Two opens of any form still paint the same picture; the `determinism` and settled-render families stay green.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: the empty notice keeps its place inside the new card anatomy.
- Maximum length: legend chips wrap to a second row at the narrow viewport instead of overflowing.

### Error Scenarios
- External service failure: none; everything is local.
- Network timeout: not applicable.

### State Transitions
- Tooltip open and closed states keep the existing hygiene rules; the card is hidden from assistive technology when closed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: about 35, LOC: about a thousand, Systems: 1 |
| Risk | 6/20 | Auth: N, API: N, Breaking: N; checker families retuned across every template |
| Research | 2/10 | Values measured in phase 13's frozen copy |
| Coordination | 8/15 | Templates, deliveries, gallery, checker, references and screenshots move together |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None block the build. Two are recorded for the operator:

- Should the 21px headline of the current cards survive as the title size, or does the 16px shadcn card title win? The build takes 16px; the operator can reverse it in one token.
- Should single-series neutral forms move to the categorical palette so a lone line or bar carries a hue? Decided no during the build (section 3 item 8): the categorical system's emphasis token is ink, so the orange highlighted mark would be lost. Reversible by changing one form's `chart-color-system` and palette block.
<!-- /ANCHOR:questions -->

---
