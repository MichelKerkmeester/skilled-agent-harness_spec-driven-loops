---
title: "Feature Specification: Restyle every existing form and replace demo data with realistic figures"
description: "Twenty-one templates carry figures labelled demo, which makes the corpus read as a specimen sheet rather than as work someone would copy. This child replaces those figures with believable ones and then restyles within the tokens the checker already enforces, as two separately gated stages so a restyle can never quietly move a number."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Restyle every existing form and replace demo data with realistic figures

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

[2-3 sentence high-level overview for stakeholders who need quick context]

**Key Decisions**: [Major decision 1], [Major decision 2]

**Critical Dependencies**: [Blocking dependency]

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `010-corpus-expansion-and-gallery` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

All 21 templates print `Source: demo figures`, and the numbers behind them are placeholder-grade.
A reader opening the corpus sees a specimen sheet rather than work they would copy, and a form
whose numbers are obviously invented teaches nothing about how the form reads when the data is
real: a stack whose segments are 62, 21 and 11 is tidier than any month a business ever had.

The six deliveries already carry believable scenarios, so this is a template problem.

### Purpose

Every form reads as finished work, and the restyle improves how a form is composed without
touching what it says.

### Non-Goals

- Changing the palette, the type scale, or the radius rungs. The checker enforces all three, and a
  restyle that fights them is a different packet.
- Changing any pointer contract, card readout or table shape. Those were decided and enforced in
  the phases before this one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Two stages, gated separately, in this order

**Stage A, the data.** Replace the figures inside each template's `CHART_DATA` block with
believable ones. Nothing outside the block moves. This is safe by construction: every table in the
corpus is generated from the same `DATA` the figure draws from, so the table cannot disagree with
the chart unless something outside the block is touched, and that is exactly what the verification
checks.

**Stage B, the restyle.** Composition only, inside the tokens the checker already enforces:
spacing, mark proportion, grid and tick treatment, label placement, whitespace. Colour, type size
and corner radius are not available to it, which is what keeps the stage bounded.

Running data before style means a restyle is never blamed for a number that moved, and a moved
number is never hidden by a restyle.

### In Scope
- The 21 templates' data blocks and their source lines.
- The 21 templates' composition, within the enforced tokens.

### Out of Scope
- The six deliveries' data. They already carry believable scenarios.
- Anything the palette, type-scale or radius rules own.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html` | Modify | Stage A the data block, stage B the composition |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | In stage A the diff for every template touches only the `CHART_DATA` block and the source line. Verified mechanically, per file, not by reading. |
| REQ-002 | Figures are internally coherent: totals that are stated add up, ranges contain their own endpoints, percentages that claim to sum do, and a series described as declining declines. |
| REQ-003 | The corpus gate prints `RESULT: PASSED` from the final state of each stage independently. |
| REQ-004 | No form gains an external runtime, framework, CDN reference or build step. |

### P1 - Required

| ID | Requirement |
|----|-------------|
| REQ-005 | The stage B restyle changes no number and no table cell, proven by diffing rendered table text before and after. |
| REQ-006 | Each form keeps a data block a reader can replace, and keeps saying so. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Stage A diffs touch only the data block and the source line, on all 21 templates.
- **SC-002**: Gate prints `RESULT: PASSED` after stage A and again after stage B.
- **SC-003**: Rendered table text is identical before and after stage B on every form.
- **SC-004**: No template still reads `Source: demo figures`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A worker edits outside the data block | High: a silent change to drawing code would ship behind a data change | The diff check is mechanical and per file; anything outside the delimiters fails the stage |
| Risk | Numbers that look real but do not add up | High: a chart that contradicts its own table is worse than an obvious placeholder | Coherence is a stated blocker, and totals are checked against the rendered table rather than the source |
| Risk | The restyle drifts into colour or type | Medium: those are enforced tokens and a fight with the checker | Stage B is composition only, and the palette and type-scale rules fail it if not |
| Dependency | Child 001 | The resolver and its rule are in every mark-carrying file | Complete, gate green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [/25] | [Files: X, LOC: Y, Systems: Z] |
| Risk | [/25] | [Auth: Y/N, API: Y/N, Breaking: Y/N] |
| Research | [/20] | [Investigation needs] |
| Multi-Agent | [/15] | [Workstreams: X] |
| Coordination | [/15] | [Dependencies: X] |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | [Risk] | [H/M/L] | [H/M/L] | [Strategy] |

---

## 11. USER STORIES

### US-001: [Title] (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: [Title] (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
