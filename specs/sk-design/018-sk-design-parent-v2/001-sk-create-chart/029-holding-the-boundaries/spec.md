---
title: "Feature Specification: hold the boundaries that turned out to be reachable"
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
# Feature Specification: hold the boundaries that turned out to be reachable

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete |
| **Created** | 2026-09-09 |
| **Branch** | `scaffold/029-holding-the-boundaries` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The previous phase closed everything it could and recorded five things as boundaries a check cannot
reach. Four of them were reachable. Two were called uncheckable without the idiom being examined,
one was an exemption naming an arithmetic nobody verified, and one was a traceability gap that only
needed the source carried.

### Purpose
Only what genuinely cannot be held is recorded as a boundary, and the one that remains says why in
measured terms rather than as an open question.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The evenness of the ramp interiors, which is the arithmetic they were exempted under.
- The per-reading requirement a guide depends on, held through the registration idiom.
- The evilcharts source blocks, carried and pinned so the reference is traceable.
- A test for the reference-drawing path that no shipped data exercises.
- The corner ladder question, measured and settled in the theming reference.
- Changelog v1.13.0.0 and the version field.

### Out of Scope
- Inventing reference-line targets for forms whose data has none.
- Changing the corner mapping, which the measurement rejects.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modify | The evenness and per-reading assertions |
| `.opencode/skills/sk-design/sk-design-chart/scripts/tests/apply-design-md.test.cjs` | Modify | The rendered reference-line test |
| `.opencode/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/**` | Create / Modify | The carried source blocks and their pin |
| `.opencode/skills/sk-design/sk-design-chart/references/design-md-theming.md`, `SKILL.md`, `README.md`, `changelog/v1.13.0.0.md` | Modify / Create | The settled mapping and version 1.13.0.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each boundary that turned out reachable is held by an assertion that fails a mutation which previously passed, and the one that remains carries a measured reason |
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


