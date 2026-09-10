---
title: "Feature Specification: make evilcharts the stock register and fix the ranked ladder"
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
# Feature Specification: make evilcharts the stock register and fix the ranked ladder

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
| **Branch** | `scaffold/032-evilcharts-stock` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator asked for a custom evilcharts Style Reference. One was written and then left as an
option that themes copies on demand, so every shipped template still looked like the cursor capture
it was derived from. Two of those templates also drew a pair a reader could not tell apart, because
the ranked ladder's dark steps sat under the readability floor and nothing checked it.

### Purpose
The corpus is derived from evilcharts, the pair reads as a pair, and the ladder that produced it
cannot ship under the floor again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A stock palette derived from evilcharts: chrome, both grounds, three systems, the ramp, the corner ladder.
- A warmed dark ground, recorded as a decision rather than a gate.
- Repainting every form and proof sheet from the palette source.
- `population-pyramid` moved to the categorical system.
- Step separation held for ranked systems, not only for magnitude ones.
- `--default` reading the stock; the cursor capture recorded as the alternative.
- Changelog v2.0.0.0 and the version field.

### Out of Scope
- The type scale and the font stacks, which are the corpus's own reading register and would churn every type assertion for no gain the operator asked for.
- Removing the cursor capture, which now costs nothing and answers a different question.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json` | Modify | The derived palette and its derivation |
| `.opencode/skills/sk-design/sk-design-chart/assets/{templates,examples,color}/*.html` | Modify | Repainted from the source |
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/population-pyramid.html`, `references/catalog.md` | Modify | The system it declares |
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs`, `scripts/apply-design-md.cjs`, `scripts/tests/**` | Modify | The separation check, the new origin, the default, three re-aimed cases |
| `.opencode/skills/sk-design/sk-design-chart/assets/style-reference/**`, `SKILL.md`, `README.md`, `changelog/v2.0.0.0.md` | Modify / Create | Provenance and version 2.0.0.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every shipped form is painted from a palette derived from evilcharts, and every value clears its gate on both grounds |
| REQ-002 | A ranked system whose adjacent steps fall under the readability floor fails the corpus check |
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


