---
title: "Feature Specification: Phase 4: dispatch-enforcement-ci-guard"
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
# Feature Specification: Phase 4: dispatch-enforcement-ci-guard

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-09-15 |
| **Branch** | `scaffold/016-dispatch-enforcement-ci-guard` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-wire-executor-builders |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the Dispatch preflight parity implementation specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every defect the earlier phases closed shares one shape: something looked enforced and enforced nothing. A check with no implementation. An implementation no packet declared. A predicate that only ever saw commands it accepted. A whole runtime whose dispatch shape matched none of its own commands. None of them failed anything, because nothing asserted that enforcement was reachable end to end. The suite that would have caught them also ran in no gate: it was collected only by a report-only runner, where a failure cannot fail a build.

### Purpose
A dispatch rule that stops discriminating, loses its implementation, or loses its declaration fails a blocking gate instead of going quiet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A fixture pair per check, so every check names a command it accepts and one it refuses.
- A bijection assertion in both directions between declared rules and implemented checks.
- A per-packet assertion that every CLI packet declares at least one usable rule at a known severity.
- A blocking workflow so the suite can fail a build rather than report into a log.

### Out of Scope
- The eighteen pre-existing failures in unrelated suites that the shared runner reports; fixing them is not this packet's scope and they are named rather than absorbed.
- The three model-default divergences and the codex service tier, which remain operator decisions.
- The quoted-payload false positive, still recorded and open.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | The three guard assertions and the fixture table |
| `.github/workflows/dispatch-enforcement-guard.yml` | Create | A blocking job for the two dispatch suites |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A check added without a fixture pair fails the guard |
| REQ-002 | A predicate loosened to accept its own violation fails the guard |
| REQ-003 | A packet dropping a declared rule fails the guard |
| REQ-004 | The suite runs in a job that can fail the build, and fails closed if the suite is deleted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A rule declared at an unknown severity fails the guard |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The guard is green on the current tree and red under each of four hand mutations.
- **SC-002**: Both workflow steps run successfully from the repository root exactly as written.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A fixture pair could be written so both halves pass | High: the guard would certify a check nobody exercises | The guard asserts the two commands differ and that one is accepted while the other is refused |
| Risk | Deleting the suite would disable its own gate | High | The job fails closed when the suite file is absent |
| Dependency | The shared report-only runner | It collects this suite but cannot fail a build | The blocking job is separate and narrow, so unrelated failures elsewhere do not gate this one |
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


