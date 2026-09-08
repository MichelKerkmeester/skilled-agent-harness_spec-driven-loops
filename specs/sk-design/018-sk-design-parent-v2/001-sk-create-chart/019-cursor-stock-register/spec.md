---
title: "Feature Specification: cursor bundle as the stock chart register"
description: "Make the cursor Style Reference the stock chart register: the palette source, every stock palette block, the body typeface and the corner ladder are derived from it, with four values moved by the least amount that clears a gate and named in the source."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cursor bundle as the stock chart register

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
The operator asked for the best Style Reference in the library to be the initial default styling of charts. Phase 16 made the cursor bundle the default for themed copies only; the stock templates, deliveries and proof sheets still painted with the hand-authored systems, so a plain template and a themed copy of it looked different for no reason.

### Purpose
The palette source, every stock palette block, the body typeface and the corner ladder come from the cursor reference, so the stock corpus and a `--default` themed copy are the same register.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `palettes.json`: chrome (parchment, ink, ash darkened, stone), dark chrome (ink as ground, parchment, mist, ink at alpha), corner ladder (2, 4, 4, 4, 8), and the three systems: neutral from the reference's neutral tones with ember as emphasis, categorical from ember, verdant, crimson and amber with ink as emphasis, ordered as an ember ramp toward each ground with ink or parchment as emphasis. Every gate in the source still holds.
- The palette blocks of all 35 stock HTML files regenerated from the source in the checker's canonical form; the body font stack set to the reference's typeface with its substitutes.
- `color-system.md` gains a provenance section naming the reference and the four moved values; `template-contract.md` records the ladder; `design-md-theming.md` says the default and the stock now agree; changelog v1.5.0.0 and the version fields.
- Gallery, proof sheets and every capture regenerated.

### Out of Scope
- The stripe-themed delivery - it carries its own design-md block and is unchanged.
- The checker - no assertion or gate changes; the rebase is proved by the existing families.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json` | Modify | Cursor-derived values and provenance note |
| `.opencode/skills/sk-design/sk-design-chart/assets/{templates,examples,color}/*.html` (35) | Modify | Regenerated stock blocks; body typeface |
| `.opencode/skills/sk-design/sk-design-chart/references/{color-system,template-contract,design-md-theming}.md` | Modify | Provenance, ladder, default note |
| `.opencode/skills/sk-design/sk-design-chart/changelog/v1.5.0.0.md`, `SKILL.md`, `README.md` | Modify | Version 1.5.0.0 |
| `.opencode/skills/sk-design/sk-design-chart/scripts/build-gallery.cjs` | Modify | Reads the form heading from the `<desc>` label the figures carry since phase 17 |
| `.opencode/skills/sk-design/sk-design-chart/screenshots/**`, `assets/gallery.html` | Regenerate | Captures and gallery of the new register |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every value in `palettes.json` is a cursor table value or one of the four minimal moves named in the source, and every gate in the source holds on both grounds |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | All 35 stock files carry the regenerated canonical blocks and the reference typeface, and the corpus passes the static and render gates with every capture regenerated |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A stock template and its `--default` themed copy paint the same chrome and series.
- **SC-002**: The static and render gates print RESULT: PASSED and the captures show the cursor register.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The cursor bundle in the style library | Source of every value | Vendored in the repository |
| Risk | The ember ordered ramp is a warm ramp where the old one was teal | Low | Ordered forms read by lightness; the hue is the brand hue and the gates hold |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rebase is one script run; no template grows and the settled-render budget is unchanged.

### Security
- **NFR-S01**: No file gains an external reference; the typeface is named, never linked.

### Reliability
- **NFR-R01**: The palette source stays the single source of truth; every stock block is a canonical projection the checker compares both ways.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable; the reference table is complete.
- Maximum length: the ordered ramp holds exactly five rungs, so the far end is drawn out to fit them above the ground.
- Invalid format: a value that is not a six-digit hex fails `palette-source` before any block is written.

### Error Scenarios
- External service failure: none; the reference is vendored.
- Network timeout: not applicable.
- Concurrent access: not applicable; one script writes the source and the blocks in sequence.

### State Transitions
- Partial completion: the rebase script rewrites every stock block on each run, so a half-applied state is repaired by running it again.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Files: 41, LOC: a few hundred, Systems: 1 |
| Risk | 6/25 | Every stock look changes; gates and captures prove it |
| Research | 4/20 | Library survey done in phase 16 |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


