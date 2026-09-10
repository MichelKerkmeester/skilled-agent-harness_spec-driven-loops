---
title: "Feature Specification: emphasis budget and the second visual verification round"
description: "The repaint in v2.1.0.0 landed after the reviewers had read the captures, so eighteen forms shipped in colours nobody had looked at. A second round found three defects, and the first of them turned out to rest on a rule the corpus kept by habit rather than by check."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: emphasis budget and the second visual verification round

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
| **Branch** | `scaffold/034-emphasis-budget` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The rule that data never wears the ink arrived mid-round in the packet before this one, and the
repaint it forced landed after the reviewers had already read the captures. Eighteen forms shipped
in colours nobody had looked at. Separately, the corpus had been spending its emphasis colour on
exactly one mark per form for its whole life, and nothing checked it.

### Purpose
Read the repainted forms at their current colours, fix what that finds, and freeze the emphasis
rule the first fix turned out to depend on.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A second visual review of the eighteen repainted forms and the neutral proof sheet.
- Every defect raised, verified here before acting.
- The `emphasis-budget` family, its two mutation cases, and the rule written into the colour system.
- Changelog v2.2.0.0 and the version field.

### Out of Scope
- The neutral ladder's tightest rung. A reviewer flagged the third and fourth dark steps as the pair
  that would blur first at small mark size. They sit 1.33:1 apart against a 1.3:1 floor, and no form
  paints them: the ten forms drawing both a third and fourth series carry the ordered ramp, covered
  by the magnitude gate, or the categorical set, which separates by hue.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modify | The `emphasis-budget` family |
| `.opencode/skills/sk-design/sk-design-chart/scripts/tests/corpus-mutations.test.cjs` | Modify | Two mutation cases proving it fires |
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html` | Modify | One-subject sentence to match one-subject paint |
| `.opencode/skills/sk-design/sk-design-chart/assets/examples/staff-hours-by-service.html` | Modify | The same |
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/box-plot.html` | Modify | The median marks the box instead of cutting it |
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/dumbbell.html` | Modify | The thinned ladder still reaches the readings |
| `.opencode/skills/sk-design/sk-design-chart/references/color-system.md` | Modify | The emphasis budget as a stated rule |
| `.opencode/skills/sk-design/sk-design-chart/{SKILL.md,changelog/v2.2.0.0.md}`, four captures | Modify / Create | Version 2.2.0.0 and the re-rendered figures |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every repainted form is read at its current colours by a reviewer who did not repaint it, and every defect raised is verified here before it is acted on |
| REQ-002 | No form spends the emphasis colour on more than one mark, and the corpus check fails a form that does |
| REQ-003 | Where a figure's sentence and its paint disagree, they are made to agree without putting the emphasis colour on most of the ink |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-corpus.cjs` reports `RESULT: PASSED` with the `emphasis-budget` family present.
- **SC-002**: Both new mutation cases fail on a green baseline for their own family and pass in the suite.
- **SC-003**: The four changed figures are re-rendered and re-read, and no figure puts the emphasis colour on more than one mark.
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


