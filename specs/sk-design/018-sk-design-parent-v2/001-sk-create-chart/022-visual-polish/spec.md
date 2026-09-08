---
title: "Feature Specification: visual polish pass on the chart corpus"
description: "A visual polish pass on the chart corpus from the operator review and the two-lane research: the authoring note leaves the visible source line, plots grow toward the reference 16:9 proportion, the data table sits behind a disclosure, the finding carries a direction cue, ticks and cards format large numbers compactly with units, and the contract text matches the shipped fade."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: visual polish pass on the chart corpus

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
Six things make a rendered chart read as a template rather than a product. The source line ends with an instruction to the author that ships in the card. Plots sit at a median 43 percent of frame width against the reference register's 56. The data table follows the card in full, so a chart is a wall of rows. The finding sentence carries no direction cue where every reference footer does. Ticks and cards print raw integers where the references write 628k and name the unit. And the contract still states the area fade as 0.8 to 0.1 while the templates ship 0.35 to 0.04.

### Purpose
Every form and delivery reads as a finished product card: clean source line, a taller plot, a folded table, a directional finding, compact numbers with units, and a contract that describes what ships.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Source line: the sentence "Replace the data block at the top of the script and nothing else." leaves every visible source line and moves into a script comment beside `CHART_DATA`; the checker's `card-parts` family still finds the source part.
- Plot proportion: every cartesian form's viewBox height rises so the plot sits between 50 and 56 percent of frame width where its data allows; the geometry-block record and the narrow-viewport pan floor are updated together; ordered and non-cartesian forms keep their proportions where a taller frame would only add empty ground.
- Table disclosure: the data table sits inside a native `details` element with a `summary` reading "Show the data", open by default when the form is inert and closed when it has a tooltip; `data-chart-table` stays on the table so the accessibility and card-readout checks keep reading it.
- Direction cue: the footer finding gains an inline SVG arrow before the sentence, up, down or none, declared in a `FINDING` sentinel block beside `READOUT` with a `trend` field; the arrow takes the emphasis colour for up and down and is absent for none.
- Compact numbers and units: `READOUT` gains a `unit` field printed after the value in the card and once on the axis title or tick; a hand-written compact formatter renders ticks at or above five digits as 12k, 1.2M with one decimal at most; the number-format family keeps forbidding `toLocaleString` and `Intl`.
- Contract text: `template-contract.md` states the shipped fade figures and the new `FINDING` and `unit` fields; the changelog records v1.6.0.0.

### Out of Scope
- The metric-and-delta header - it needs a type-scale rung and is phase 023.
- New forms, mark policies, reference lines and cursor guides - phases 024 and 025.
- Any palette value or gate - unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/*.html`, `assets/examples/*.html` | Modify | Source line, viewBox, disclosure, finding cue, unit, compact ticks |
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modify | Assertions for the disclosure, the `FINDING` block and the clean source line; geometry record updated |
| `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md` | Modify | Fade figures, `FINDING`, `unit`, the disclosure |
| `.opencode/skills/sk-design/sk-design-chart/changelog/v1.6.0.0.md`, `SKILL.md`, `README.md` | Modify | Version 1.6.0.0 |
| `.opencode/skills/sk-design/sk-design-chart/screenshots/**`, `assets/gallery.html` | Regenerate | The polished corpus |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No visible source line carries an authoring instruction; a new `source-line` assertion fails a template whose source text contains "Replace the data block" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Every cartesian form's plot height is between 50 and 56 percent of frame width, recorded per form in `scratch/proportions.md`, and the corpus passes the static and render gates |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-corpus.cjs --render` prints RESULT: PASSED with the new `source-line`, `finding-cue` and `table-disclosure` families listed and no family below its baseline count.
- **SC-002**: Captures of daily-line, grouped-bars and calendar-grid show the taller plot, the folded table, the arrow before the finding, compact ticks with a unit, and a source line that ends at the source.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 15 to 19 register | The polish sits inside it | None |
| Risk | A taller viewBox breaks the narrow-viewport pan floor or the card-readout render check | Med | Change viewBox and geometry record together; run the render gate after every few forms |
| Risk | A closed disclosure hides the table from the card-readout driver | Med | The driver reads the DOM, not the paint; the test on one form decides before the sweep |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No template grows past its settled-render budget.
- **NFR-P02**: [Throughput target - e.g., 100 req/sec]

### Security
- **NFR-S01**: No external reference; the arrow is inline SVG.
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: Two opens still paint the same picture; the formatter is pure.
- **NFR-R02**: [Error rate - e.g., <1%]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: the empty notice keeps its place in the taller figure.
- Maximum length: a tick at or above five digits renders compactly; a value in the card keeps full digits with separators.
- Invalid format: a `FINDING.trend` outside up, down, none fails the `finding-cue` assertion.

### Error Scenarios
- External service failure: none.
- Network timeout: not applicable.
- Concurrent access: not applicable.

### State Transitions
- Partial completion: the checker names the form left half-polished.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Files: about 40, LOC: about a thousand |
| Risk | 6/25 | Every template changes shape; gates prove it |
| Research | 3/20 | Done in phase 21 |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the disclosure default open for every form rather than only inert ones? The build takes open for inert, closed for tooltip forms, and it is one attribute per file to reverse.
<!-- /ANCHOR:questions -->

---


