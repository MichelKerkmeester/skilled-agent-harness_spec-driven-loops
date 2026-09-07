---
title: "Feature Specification: CI push gates and runtime document truth"
description: "The spec-kit check and the changed-packet gate run on direct pushes, the workflows README says which gate answers to which trigger, the four standalone rule harnesses run in the validation lane, the skip switch is documented, the save command names the route categories the runtime accepts, and a stale wiring comment is gone."
trigger_phrases:
  - "ci push triggers"
  - "spec-kit check on push"
  - "changed packet validation on push"
  - "route categories save command"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CI push gates and runtime document truth

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 21 |
| **Predecessor** | 002-cli-runtime-utilization |
| **Successor** | None |
| **Handoff Criteria** | Every row of the lane's round-three section in `research/confirmed-findings.md` is fixed, documented, removed or recorded, and the test lanes pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the spec-kit simplification research program: the remediation child for the CLI runtime lane's third round.

**Scope Boundary**: the files listed under Files to Change and nothing beside them.

**Dependencies**:
- The lane's round-three synthesis and its census section
- The earlier remediation children the round verified

**Deliverables**:
- Every confirmed row closed as the census records
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-kit check workflow, which the round-one census presented as closing the CI-invisibility gap, had no push trigger, so on the repository's documented direct-push flow none of its six lanes ran; the changed-packet gate had the same shape. Four rule harnesses under the CLI tests folder ran in no lane. `validate.sh` reads a skip switch no reference documents. The save command listed eight route categories where the runtime folds everything into six, and a comment announced wiring that the lines below it already did.

### Purpose
A direct push meets the same gates a pull request does, every harness in the tests folder runs somewhere, and the documents name what the code reads.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The two workflow triggers, the workflows README, the environment reference, the CLI package scripts and tests README, the save command asset, the workflow comment

### Out of Scope
- The pi adapters' import bases: their README states the symlink base they are written for, and the fallback resolves from it
- The root `.env.example`: it exists; the lane searched only under `.opencode`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/spec-kit-check.yml` | Modify | Push trigger with the same path filter; install step before the mirror checks |
| `.github/workflows/changed-packet-validation.yml` | Modify | Push trigger; base commit chosen by event |
| `.github/workflows/README.md` | Modify | Push versus pull-request table with the reason per gate |
| `runtime/ENV-REFERENCE.md` | Modify | The skip switch row |
| `runtime/cli/package.json` | Modify | The four rule harnesses join the validation lane |
| `runtime/cli/tests/README.md` | Modify | The harnesses named |
| `.opencode/commands/speckit/save.md` | Modify | The six route categories and their aliases |
| `runtime/cli/core/workflow.ts` | Modify | Comment says what the code does |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The spec-kit check and changed-packet workflows declare a push trigger for the release lines |
| REQ-002 | The validation lane runs the four standalone harnesses |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The runtime, CLI, legacy and validation lanes pass and the program validates recursively |
| REQ-004 | The environment reference documents the skip switch and the save command names the runtime's route categories |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both workflow files parse and name push and pull_request
- **SC-002**: The validation lane's output lists the four harnesses
- **SC-003**: The workflows README table names every workflow
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The push trigger costs runner minutes on every skill push | Slower feedback on the release line | The path filter keeps unrelated pushes free; the README records the choice |
| Risk | The changed-packet gate on a first push has no before-sha | The diff has no base | The step falls back to the parent commit |
| Dependency | The workspace install | The mirror checks require the shared package | Added before them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No new process is spawned on any hot path
- **NFR-P02**: CI cost changes only where the census names it

### Security
- **NFR-S01**: No rule became less strict
- **NFR-S02**: No secret or credential is touched

### Reliability
- **NFR-R01**: Every gate result was read from its output
- **NFR-R02**: Every removal was preceded by a consumer search
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an absent optional document changes nothing
- Maximum length: not applicable
- Invalid format: malformed input keeps the existing error paths

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: the private index kept the other session's files out

### State Transitions
- Partial completion: code, tests and documents ship in one commit
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | The files listed above |
| Risk | 10/25 | Small edits behind existing tests |
| Research | 5/20 | Every row re-checked in the main checkout |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
