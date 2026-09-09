---
title: "Feature Specification: metric and delta header block for scalar and time-series forms"
description: "An optional metric-and-delta block in the header zone of scalar and time-series forms: a 24 to 28px value from the data block, a signed 12px delta in verdant or crimson, a period label, and a direction cue, with the new size added to the published type scale and every value still in the chart table."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: metric and delta header block for scalar and time-series forms

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
Both research lanes found the same anatomy gap: our scalar and time-series forms carry their reading only as 14px prose while Apple, Vercel and Tremor lead with a value and a signed delta. The corpus has no place for a prominent number except progress-single and unit-ring, and the type scale has no rung for one.

### Purpose
A form that has a meaningful baseline can lead with its number and its change, declared once, held by the checker, and never invented: the value is a literal from the data block and appears in the table.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `METRIC` sentinel block beside `READOUT`: `value`, `delta`, `period`, `baseline` (the table cell the value comes from) and `trend`; forms without a meaningful baseline declare `METRIC` as absent and keep the prose header.
- A header block above the plot: value at the new type-scale rung, semibold, ink; delta signed at 12px in verdant for up and crimson for down; period label at 12px muted; the direction cue reuses the phase 22 arrow.
- A new `metric` rung in `palettes.json` `typeScale.roles` (24px or 28px, decided in the build against the captures) so the `type-scale` family accepts it.
- A `metric-block` assertion: value and delta are literals present in the table, trend matches the sign of the delta, the block is absent on forms whose data has no baseline; proved on a mutated copy first.
- The contract states the block; changelog v1.7.0.0; captures regenerated.

### Out of Scope
- New forms - phase 024.
- Mark and indicator policies - phase 025.
- Palette values and contrast gates - unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/*.html`, `assets/examples/*.html` | Modify | The declarations and rendering |
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modify | The new families |
| `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md`, `catalog.md` | Modify | The contract |
| `.opencode/skills/sk-design/sk-design-chart/changelog/v1.7.0.0.md`, `SKILL.md`, `README.md` | Modify | Version 1.7.0.0 |
| `.opencode/skills/sk-design/sk-design-chart/screenshots/**` | Regenerate | Captures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every scalar and time-series form declares `METRIC` present or absent; a present block renders the header and its values exist in the table; `metric-block` fails a mutated copy |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The `metric` rung exists in the palette source and the `type-scale` family accepts the header sizes; static and render gates pass |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-corpus.cjs --render` prints RESULT: PASSED with `metric-block` listed and no family below baseline.
- **SC-002**: Captures of daily-line, progress-single and bar-columns show the header where declared and unchanged prose where not.
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


