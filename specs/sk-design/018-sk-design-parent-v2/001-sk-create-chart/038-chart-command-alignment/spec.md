---
title: "Feature Specification: align the design chart command with the corpus it routes to"
description: "The /design:chart command named a directory the corpus no longer ships, two YAML filenames that never existed, a presentation file under a name it does not have, a form count three short, and the wrong parent skill for its mode."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: align the design chart command with the corpus it routes to

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
| **Branch** | `scaffold/038-chart-command-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The command that routes to the chart corpus had drifted from it. Both workflow YAMLs declared a
`worked_deliveries` asset at `assets/examples/`, which the corpus removed. The router's workflow
summary named `create-chart-auto.yaml` and `create-chart-confirm.yaml`; the files are
`chart-auto.yaml` and `chart-confirm.yaml`. Both YAMLs told the result step to read
`create-chart-presentation.txt`; the file is `chart-presentation.txt`. The description said 26
forms; there are 29. And both YAMLs declared `skill: sk-doc` for a mode that lives under `sk-design`.

### Purpose
Every path, filename, count and skill the command names is one that exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `chart.md`: the form count and the two YAML filenames in the workflow summary.
- `chart-auto.yaml`, `chart-confirm.yaml`: the `worked_deliveries` key, the presentation filename,
  and the parent skill.

### Out of Scope
- The forbidden-list line "Handing over a gallery page instead of a delivery". The gallery is gone
  and the principle stays true.
- `.claude/commands/design/chart.md`, which is a symlink to the file fixed here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/design/chart.md` | Modify | 29 forms; the YAML names that exist |
| `.opencode/commands/design/assets/chart-auto.yaml` | Modify | Stale asset removed; presentation filename; `skill: sk-design` |
| `.opencode/commands/design/assets/chart-confirm.yaml` | Modify | The same |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every `.opencode/` path the command and its assets name exists on disk |
| REQ-002 | Every filename the router and YAMLs reference by name is the file's actual name |
| REQ-003 | The declared parent skill is the hub that registers the mode |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A path sweep over the four command files reports nothing missing.
- **SC-002**: grep for `26 forms`, `create-chart`, `examples`, `sk-doc` over the four files is empty.
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


