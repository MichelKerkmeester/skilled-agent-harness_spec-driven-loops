---
title: "Feature Specification: mark policies, tooltip indicator kinds, reference lines and cursor guides"
description: "Per-form declarations the research asked for: a sparse-point policy, a meaningful-zero signed-area policy, per-series tooltip indicator kinds, declared reference lines, and a cursor guide earned by density, each held by a checker family."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: mark policies, tooltip indicator kinds, reference lines and cursor guides

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
Mark choices that carry meaning are still implicit per template: whether a short series shows its points, whether an area may split at zero, whether a composed form's line is shown with a bar-shaped swatch in the tooltip, whether a target or event line exists, and whether a dense multi-series form guides the cursor. The research named each as a declaration, not a restyle.

### Purpose
Every mark decision that a reader can misread is declared once in the form and held by the checker, and the two interaction refinements the references show are available where the data earns them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `MARKS` block in the geometry region: `points` (`sparse` shows dots below a declared count, `none`), `fill` (`gradient`, `flat`), `zero` (`meaningful`, `baseline`), with signed areas splitting fills at zero when meaningful.
- `READOUT.indicator` per series: `swatch`, `rule`, `none`; the tooltip draws the kind the mark has.
- A `REFERENCE` block: zero or more lines with value, label and dashed rule, on cartesian forms; bullet's target moves onto it.
- A cursor guide (hairline at the hovered x with the active marker highlighted) on forms that declare `guide: true`, permitted only when the form has two or more series or more than 20 points.
- Families `mark-policy`, `tooltip-indicator`, `reference-line` and `cursor-guide`, each proved on a mutated copy; contract and changelog v1.9.0.0; captures.

### Out of Scope
- New forms - phase 024.
- Palette values and gates - unchanged.
- Smooth interpolation, gradient stacks, universal dots - ruled out by the research.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/*.html`, `assets/examples/*.html` | Modify | The declarations and rendering |
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modify | The new families |
| `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md`, `catalog.md` | Modify | The contract |
| `.opencode/skills/sk-design/sk-design-chart/changelog/v1.9.0.0.md`, `SKILL.md`, `README.md` | Modify | Version 1.9.0.0 |
| `.opencode/skills/sk-design/sk-design-chart/screenshots/**` | Regenerate | Captures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every form declares `MARKS`, every tooltip series an `indicator`, every cartesian form a `REFERENCE` block (possibly empty), and `guide` where permitted; the four families fail their mutated copies |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Static and render gates pass, including card-readout and pointer-reach with the guide on |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-corpus.cjs --render` prints RESULT: PASSED with the four families listed.
- **SC-002**: Captures show a split signed area, a rule indicator on the composed form, a reference line on bullet, and a guide on daily-line.
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


