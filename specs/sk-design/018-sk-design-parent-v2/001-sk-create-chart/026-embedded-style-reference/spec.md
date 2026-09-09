---
title: "Feature Specification: embed the stock Style Reference in the chart skill and keep the generator override"
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
# Feature Specification: embed the stock Style Reference in the chart skill and keep the generator override

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
| **Branch** | `scaffold/026-embedded-style-reference` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every colour, corner and type size in the corpus is a gated derivation of one Style Reference, and
that reference lives in a sibling skill's library of roughly twelve hundred captures that the
library regenerates. A regeneration of this one capture would change what `--default` themes to
without a diff, and leave the stock palette derived from a file that no longer exists.

### Purpose
The packet carries the reference it was derived from, so the stock is owned rather than borrowed,
while any other reference can still be applied by naming its path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `assets/style-reference/cursor/` holding the capture verbatim, with an `origin.md` recording where it came from and pinning each file by hash.
- `apply-design-md.cjs` `--default` reading the local copy instead of reaching into the sibling skill.
- The provenance paths in `palettes.json`, `references/color-system.md` and `references/design-md-theming.md`, and the resource tables in `SKILL.md` and `README.md`.
- Changelog v1.10.0.0 and the version field.

### Out of Scope
- The palette values themselves, and the four documented departures - unchanged.
- The override path - it already takes any local `DESIGN.md` and needs no change.
- The test suite's borrowed fixtures, which deliberately exercise four references this packet does not own.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/assets/style-reference/cursor/**` | Create | The capture and its origin record |
| `.opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs` | Modify | The default path |
| `.opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json`, `references/color-system.md`, `references/design-md-theming.md` | Modify | Provenance |
| `.opencode/skills/sk-design/sk-design-chart/SKILL.md`, `README.md`, `changelog/v1.10.0.0.md` | Modify / Create | Version 1.10.0.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The capture is carried verbatim inside `assets/`, `--default` reads it, and themed output is byte-identical to before the move apart from the recorded reference path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Overriding with any other `DESIGN.md` path still works, and every provenance path in the packet names the local copy |
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


