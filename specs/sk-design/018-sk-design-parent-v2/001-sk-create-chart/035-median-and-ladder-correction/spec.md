---
title: "Feature Specification: the two geometry fixes that did not work"
description: "Two of the three fixes in the packet before this one shipped before the reader who checked them came back, and both were wrong. The median took the page colour rather than a width that was too large, and the axis was thinning a ladder that was never crowded."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: the two geometry fixes that did not work

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-10 |
| **Branch** | `scaffold/035-median-and-ladder-correction` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two geometry fixes shipped on the strength of my own reading of the captures, because the packet
closed before the fresh reader came back. The reader found both had not worked. The box plot's
median was thinned and still read as a hole, because its colour was the page colour and width was
never what made it one. The dumbbell's axis recovered one rung and still left nine of ten rows
inside a single unbroken span, because the thinning rule itself had no reason to exist on a
four-step ladder.

### Purpose
Fix the causes rather than the symptoms, and record that a fix read only by the person who made it
has now failed twice in a row.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The box plot's median stroke colour.
- The dumbbell's tick ladder.
- Changelog v2.3.0.0 and the version field.

### Out of Scope
- The box plot's finding naming three teams while the emphasis marks one. The cluster claim reads
  from the median heights, which the first fix restores, and the emphasis marks the team the
  sentence's one hard number is about.
- The white box being 44% of the plot's ink. Under the line, and it follows from Complex's widest
  quartile range rather than from a colour decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/box-plot.html` | Modify | The median contrasts with its own box and never takes the page colour |
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/dumbbell.html` | Modify | Every rung inside the readings is drawn |
| `.opencode/skills/sk-design/sk-design-chart/{SKILL.md,changelog/v2.3.0.0.md}`, two captures | Modify / Create | Version 2.3.0.0 and the re-rendered figures |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A median reads as a line laid on its box, on both grounds and on both box fills |
| REQ-002 | A reader can place every dot against a labelled rung, and no span of the axis carries a majority of the rows without an interior mark |
| REQ-003 | Both fixes are read by someone who did not make them before the packet closes |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No median stroke resolves to the page colour on either ground.
- **SC-002**: The dumbbell axis reads 0, 20, 40, 60, and the furthest dot sits within one rung of the last label.
- **SC-003**: Corpus, suite and capture coverage all pass from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]
- **NFR-P02**: [Throughput target - e.g., 100 req/sec]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]
- **NFR-R02**: [Error rate - e.g., <1%]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]
- Invalid format: [Validation response]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]
- Concurrent access: [Conflict resolution]

### State Transitions
- Partial completion: [Recovery behavior]
- Session expiry: [User experience]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [/25] | [Files, LOC, systems] |
| Risk | [/25] | [Auth, API, breaking changes] |
| Research | [/20] | [Investigation needs] |
| **Total** | **[/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---


