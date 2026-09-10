---
title: "Feature Specification: every capture read by a fresh reviewer, and what that found"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: every capture read by a fresh reviewer, and what that found

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete |
| **Created** | 2026-09-10 |
| **Branch** | `scaffold/033-visual-verification` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The palette was replaced wholesale and the checks stayed green throughout, which proves that colour
values clear their ratios and that declarations match code. It proves nothing about whether a figure
reads. Two captures had been looked at; thirty-seven had not.

### Purpose
Every rendered capture is read by someone who did not make the change, and what that finds is fixed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A visual review of all thirty-nine figures plus the contact sheet, by fresh reviewers.
- Every defect they raised, verified here and fixed.
- A rule the operator set during the round: a figure never spends its data marks on the ink.
- A checker family for prose that names a lightness direction.
- Changelog v2.1.0.0 and the version field.

### Out of Scope
- Three judgements the reviewers raised and this packet leaves alone, each recorded with why.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json` | Modify | The carrying series takes the hue |
| `.opencode/skills/sk-design/sk-design-chart/assets/{templates,examples,color}/*.html` | Modify | Repainted, and nine forms repaired |
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modify | The `ramp-prose` family and the ranked ordering rule |
| `.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs` | Modify | The contact sheet is no longer captured |
| `.opencode/skills/sk-design/sk-design-chart/scripts/tests/**`, `references/color-system.md`, `SKILL.md`, `README.md`, `changelog/v2.1.0.0.md` | Modify / Create | Coverage, the rule, version 2.1.0.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every figure is read by a reviewer who did not make the change, and every defect they raise is verified here before it is acted on |
| REQ-002 | No figure draws its readings in the ink with a single accent on the exception |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]
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


