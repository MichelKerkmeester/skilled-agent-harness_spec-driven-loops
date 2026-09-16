---
title: "Feature Specification: Phase 1: recorded-adjacent-defects"
description: "The seven defects earlier phases measured and recorded as belonging to another surface, closed, so the packet's own decision that nothing is deferred holds."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: recorded-adjacent-defects

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-missing-stress-fixture-root |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the close the defects earlier phases recorded but did not fix specification.

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
Four phases of this packet each ended by recording defects they had measured but not fixed, on the reasoning that the surface belonged to another track. The packet's frozen decision says nothing is deferred, so those records were a deferral the decision does not allow. Seven survived verification: a runtime that did not compile, a comment promising a revert the guard never performs, a reducer that dropped a finding whose severity it did not recognise without saying so, a rater contract that never reached the rater, a duplicated line that left four of six agent trees unchecked in a stress scenario, ten command references pointing at files a refactor deleted, and a push gate that validated a tree nobody would receive.

### Purpose
Every defect this packet measured is either fixed or refuted, with nothing left recorded as somebody else's.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The executor config schema, which never gained the field its flag-support table already declared
- The runner comment claiming a containment revert the default mode does not perform
- The reducer's silent drop of an out-of-scale severity, at the producer rather than per caller
- The severity collapse rule, carried into all six agent trees
- The stress scenario's duplicated tree check
- The command references a diagram refactor and a chart move left dangling
- The push gate's blindness to a commit that differs from the validated tree

### Out of Scope
- Restating the persona name grammar in the schema - the dispatcher owns it and two copies would drift
- Re-ranking an out-of-scale severity - the scale has no tier to give it and guessing would hide the defect twice
- Repointing the deleted diagram templates - a refactor merged them into a form library and no one-to-one successor exists, so the dead block goes rather than a guessed mapping

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| ``.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`` | Modify | The persona field the flag-support table already named, plus its place in the unsupported-field scan |
| ``.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`` | Modify | The devin comment describes what the guard does |
| ``.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`` | Modify | An unrecognised severity is named once per value before its findings are dropped |
| ``.opencode/agents/deep-review.md` and `.claude/agents/deep-review.md`` | Modify | The collapse rule, in the two authored trees; the generated and symlinked four follow |
| ``.opencode/skills/system-deep-loop/deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/proposal-only-boundary.md`` | Modify | A duplicated check replaced by the four trees it left unchecked |
| ``.opencode/commands/design/assets/*.yaml`` | Modify | The dead template block removed, the palettes repointed at their successor |
| ``.opencode/scripts/git-hooks/pre-push`` | Modify | The pushed commit must carry the routing bytes the guard approved |
| ``.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` and `tests/unit/deep-review-state-reducer.vitest.ts`` | Modify | Coverage for the two behaviour changes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The runtime typechecks |
| REQ-002 | No comment claims a containment revert the default mode does not perform |
| REQ-003 | A severity outside the scale is named before its findings are dropped, once per distinct value |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The collapse rule reaches all six agent trees, and every mirror gate stays green |
| REQ-005 | Every command reference resolves |
| REQ-006 | A push whose commit differs from the validated tree in a routing byte is blocked |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The typecheck, the command-reference checker and the whole suite each exit zero
- **SC-002**: The push gate fires on the commit that actually broke routing and stays quiet on a clean one
- **SC-003**: Nothing remains recorded as an unfixed defect belonging to another surface
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding a schema field changes a shape an exact-match test asserts | Handled | The defaults test was updated rather than loosened, so it still asserts the whole shape |
| Risk | A hook change blocks pushes for the wrong reason | Handled | It adds a check rather than replacing one, and anything git cannot resolve is skipped rather than blocked |
| Risk | Removing a config block breaks a consumer | Handled | The block was declared in two files and read by none |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The push check is a path-scoped diff against the pushed commit, not a checkout, so it costs no measurable time

### Security
- **NFR-S01**: A finding can no longer disappear between the lane that wrote it and the report that reads it

### Reliability
- **NFR-R01**: The routing failure that published silently three times is now caught before it publishes
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- An absent severity: left to the record-shape warnings that already cover a missing field
- The same unrecognised value across many findings: named once

### Error Scenarios
- A pushed sha git cannot resolve: skipped, because a hook that guesses is worse than one that misses
- A persona on a kind that does not declare it: rejected at parse rather than ignored at dispatch

### State Transitions
- A generated agent tree: regenerated from its authored source, never hand-edited
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Eight files across the runtime, two agent trees, command assets and a git hook |
| Risk | 14/25 | A shared push gate and a release-governing reducer |
| Research | 10/20 | Seven defects, each verified against the tree before editing |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


