---
title: "Feature Specification: fixes from the fresh Opus review of the chart packets"
description: "A fresh Opus review of the three chart packets returned CONDITIONAL with five P1s; every P1 and the cheap P2s are fixed here: hex-only themed roles, a series distinguishability gate, mapper parity with the reference, category-headed tooltip cards, corrected evidence, relative provenance, stack-aware fonts, dead exports removed, generated scratch dropped, the figure label id renamed."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: fixes from the fresh Opus review of the chart packets

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete |
| **Created** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An independent Opus review of packets 015, 016 and 017 found that the checker's design-md branch skipped every gate when a role was not a six-digit hex, that two of the cursor default's series were the same green, that the reference described a series rule the mapper did not implement, that three evidence cells in 016 pointed at wrong lines and a stale capture, and that multi-series tooltip cards named the series in the header and "Value" on the row instead of the category and the series. It also listed an absolute home path baked into provenance, positional font replacement, dead exports, six hundred kilobytes of generated scratch, and a `<desc>` still carrying a title id.

### Purpose
Every P1 is fixed with a mutation or a regenerated artefact proving it, the P2s that cost minutes are fixed, and the packet records the two P2s left as they are.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Checker: a themed role that is not a six-digit hex is an error, never a skipped gate; any two series must differ by the separation ratio or thirty degrees of hue; the unused exports are gone.
- Mapper: the same distinguishability rule when admitting a series; provenance paths relative to the repository root; font stacks replaced by what the declaration already is (monospace or body), not by position; the reference states the rule the code implements.
- Tooltip cards on grouped bars, stacked bars and the stripe delivery name the category in the header and the series on the row.
- Evidence: 016's acceptance citations repointed to the lines that hold, the test count corrected, the six themed captures regenerated from the committed script, the generated themed sets removed from scratch.
- `fig-title` renamed `fig-label` on the `<desc>` and its `aria-labelledby` in all 33 files.
- The chart type scale moved from the checker into `palettes.json`; the `sourceRows` alias removed from the mapper.

### Out of Scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modify | Hex-only roles, distinguishability gate, `hueGap`, exports removed |
| `.opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs` | Modify | Distinguishability on admit, relative provenance, stack-aware fonts |
| `.opencode/skills/sk-design/sk-design-chart/references/design-md-theming.md` | Modify | The series rule as implemented, the hex rule, the font rule |
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/{grouped-bars,stacked-bars}.html`, `assets/examples/grouped-bars-stripe-style.html` | Modify | Category-headed cards |
| `.opencode/skills/sk-design/sk-design-chart/assets/**/*.html` | Modify | `fig-label` |
| `.opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json` | Modify | `typeScale` carries the chart roles, departures and the sheet scale |
| `.opencode/skills/sk-design/sk-design-chart/screenshots/**` | Regenerate | Captures of the fixed corpus |
| `../016-design-md-theming/{acceptance-criteria,implementation-summary}.md`, `scratch/captures/` | Modify | Corrected evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The checker errors on a non-hex or eight-digit themed role and on an indistinguishable series pair | `scratch/mutations.txt` holds the three FAIL lines |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Multi-series cards show the category in the header and the series on the row; provenance is repository-relative; fonts are replaced by kind | hover capture; `path=.opencode/...` in a themed copy; `node --test` 6/6 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three mutations fail with the recorded lines and the corpus, the default-themed set and the tests are green.
- **SC-002**: 016 validates strict with the AC coverage line at 9/9.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packets 015 to 017 | These are fixes inside them | None needed |
| Risk | The distinguishability gate refuses a bundle that used to pass | Low | The mapper applies the same rule, so a passing derivation always passes the checker |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The type scale question was closed on the operator's instruction to apply every fix: the chart roles and departures now live in `palettes.json` under `typeScale`, the proof sheets keep theirs under `sheetRoles`, and the checker reads both.
<!-- /ANCHOR:questions -->

---


