---
title: "Feature Specification: close every recorded item across the chart phases"
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
# Feature Specification: close every recorded item across the chart phases

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
| **Branch** | `scaffold/028-closeout` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four phases closed with items recorded rather than done. Two were checks that could not fire, one
was a paragraph describing a palette that no longer ships, one was the derivation the whole corpus
rests on being documented rather than held, and one was a test suite depending on a sibling library
it does not own.

### Purpose
Nothing is left recorded-and-not-done, and what remains open is a boundary a check cannot cross
rather than work nobody did.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `metric-block` guard that compared a relative label against an absolute path.
- The categorical rotation paragraph in `references/color-system.md`.
- A `derivation` block in the palette source and the `palette-derivation` family that holds it.
- The reverse direction of the `points` assertion, with an unreadable construction treated as an error.
- Vendoring the four borrowed test references and covering the two carried ones.
- Changelog v1.12.0.0 and the version field.

### Out of Scope
- The declared boundaries: the guide's per-reading requirement, reference lines shipping empty, typefaces resolving to substitutes, and the four forms the applicator refuses. Each is restated in the summary with why it is not a gap.
- The repository trigger index, whose staleness belongs to other packets' surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modify | The guard, the new family, the reverse direction |
| `.opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json` | Modify | The derivation block |
| `.opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs`, `scripts/tests/**` | Modify / Create | The export the tests need, vendored fixtures, three new tests |
| `.opencode/skills/sk-design/sk-design-chart/references/color-system.md`, `SKILL.md`, `README.md`, `changelog/v1.12.0.0.md` | Modify / Create | The corrected prose and version 1.12.0.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every item recorded as not-done across the preceding phases is either closed or restated as a boundary with its reason, and each new or repaired assertion fails a mutation that previously passed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The work is reviewed by a fresh reader, its findings verified here, and the corpus, the render gate and the test suite all pass from the final state |
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


