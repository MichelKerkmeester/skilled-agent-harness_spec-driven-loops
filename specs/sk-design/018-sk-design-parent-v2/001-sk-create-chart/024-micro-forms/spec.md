---
title: "Feature Specification: spark, tracker and bar-list forms"
description: "Three question-first micro-forms the library has and the catalogue lacks: spark (line, area and bar variants as one family) for the compact trend, tracker for discrete status over time in the categorical role, and bar-list as a compact ranked list sharing bar-rows semantics; each a template with every corpus contract, a catalogue row and a capture."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: spark, tracker and bar-list forms

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
Tremor, Vercel and LayerChart answer three reader questions our 26 forms do not: a trend at KPI size, a run of discrete statuses over time, and a ranked list where long names beat the bar. The research ruled these in and ruled progress circles and radial rings out because existing forms answer those honestly.

### Purpose
Three new forms that pass every existing family and read as the corpus does, each with a reader question in the catalogue and a delivery that shows it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `spark.html` with `CHART_DATA`, `SERIES`, palette, geometry, `READOUT`, `CURVE`, `FINDING` blocks; variants line, area and bar declared in the geometry block as one form family under one catalogue question.
- `tracker.html`: equal blocks per period, status from the categorical role only, a legend of statuses, tooltip per block.
- `bar-list.html`: ranked horizontal bars with the label inside the bar and the value at the right edge, sharing `bar-rows` data semantics.
- Catalogue rows with the reader question each answers and the forms it substitutes for; the identity, catalog and catalog-system families updated; keyed-series registration where a form declares series.
- A delivery per form under `assets/examples/`; captures; changelog v1.8.0.0.

### Out of Scope
- Progress circles and radial rings - existing forms answer those questions.
- A KPI card as a catalogue form - the metric header is phase 023.
- Palette values and gates - unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/*.html`, `assets/examples/*.html` | Modify | The declarations and rendering |
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modify | The new families |
| `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md`, `catalog.md` | Modify | The contract |
| `.opencode/skills/sk-design/sk-design-chart/changelog/v1.8.0.0.md`, `SKILL.md`, `README.md` | Modify | Version 1.8.0.0 |
| `.opencode/skills/sk-design/sk-design-chart/screenshots/**` | Regenerate | Captures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each new form passes every checker family the corpus applies to its class, static and render, and appears in the catalogue with its reader question |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Each new form has a delivery with real data and a real headline, a capture in both schemes, and the gallery lists it |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-corpus.cjs --render` prints RESULT: PASSED with 29 forms scanned.
- **SC-002**: The catalogue names the question each form answers and the gallery renders all three.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 022 visual polish | Shares the footer cue and the READOUT shape | Build after 022 lands |
| Risk | A new declaration breaks an existing family | Med | Assertion first; checker after every form |
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
- **NFR-S01**: No external reference enters any template.
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: Two opens paint the same picture.
- **NFR-R02**: [Error rate - e.g., <1%]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: the empty notice keeps its place.
- Maximum length: bounded by the existing capacity gates.
- Invalid format: a declaration outside its set fails its family.

### Error Scenarios
- External service failure: none.
- Network timeout: not applicable.
- Concurrent access: not applicable.

### State Transitions
- Partial completion: the checker names the form left half-done.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Files: about 40 |
| Risk | 6/25 | Every template changes; gates prove it |
| Research | 3/20 | Done in phase 21 |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None until the build starts; phase 022 must land first.
<!-- /ANCHOR:questions -->

---


