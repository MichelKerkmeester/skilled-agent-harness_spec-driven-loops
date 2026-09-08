---
title: "Feature Specification: visual review fixes after the shadcn upgrade"
description: "Operator review of the shadcn visual upgrade: numeric table headers right-aligned with their cells, the tooltip card freed of the native browser title and of wrapping labels, single-series cards without decorative indicators, and daily-line reworked so the line is the mark."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: visual review fixes after the shadcn upgrade

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
The operator reviewed the shipped shadcn register and found four defects the gates did not catch. Numeric table columns right-align their cells but left-align their headers. Hovering a mark shows the browser's own title tooltip over the card, because the SVG carries a `<title>`, and long labels wrap inside the card. On a single-series form every card row shows the same grey indicator square. Daily-line reads as a grey wall under a white line, prints only two rungs, and prints its low-point label on top of the marker.

### Purpose
Every table header sits over its numbers, the tooltip card is the only thing that appears on hover and reads on one line per row, single-series cards carry no decorative indicators, and daily-line reads as a line chart.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `th.num { text-align: right; }` in every file and `class="num"` on every header whose column's body cells are numeric, including headers built by script.
- The SVG `<title id="fig-title">` becomes `<desc id="fig-title">`; the accessible name still resolves through `aria-labelledby`, and no native tooltip appears.
- `.tip-label` no longer wraps; on a single-series form the card carries `data-single-series` and hides its indicator column.
- Daily-line: a neutral series fades at 0.35 to 0.04 instead of 0.8 to 0.1, every rung up to the peak prints, and the low-point label sits under the marker, centred.

### Out of Scope
- Any change to a palette value, gate or checker family - the fixes are inside the existing contracts.
- The categorical-palette question for single-series forms - recorded in phase 15 and unchanged here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/*.html` | Modify | Header classes and rule, desc, tooltip rules, single-series attribute |
| `.opencode/skills/sk-design/sk-design-chart/assets/examples/*.html` | Modify | The same, so deliveries follow their templates |
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html` | Modify | Fade, rungs, label position |
| `.opencode/skills/sk-design/sk-design-chart/screenshots/**` | Regenerate | Captures of the fixed corpus |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every header over a numeric column is right-aligned; the SVG carries no `<title>`; card labels do not wrap; single-series cards show no indicator | the fixed captures show each; static gate RESULT: PASSED |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Daily-line prints every rung up to the peak, fades lightly under a neutral line, and places the low-point label clear of the marker | `screenshots/templates/daily-line.png` shows four rungs, a light fade and the label under the marker |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Captures of calendar-grid, box-plot on hover, and daily-line show the four fixes.
- **SC-002**: `check-corpus.cjs --render` prints RESULT: PASSED with zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 15 register | These are fixes inside it | None needed |
| Risk | The desc swap changes the accessible name | Low | `aria-labelledby` resolves the same text; accessibility family green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


