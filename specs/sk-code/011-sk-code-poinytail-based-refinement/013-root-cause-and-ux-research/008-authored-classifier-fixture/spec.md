---
title: "Feature Specification: Phase 8: authored-classifier-fixture"
description: "The authored cli-classifier canary fixture still carried the cases for the removed cli-deem mode, so the next compiled-route rebuild would have served a fixture whose canary fails."
trigger_phrases:
  - "authored classifier fixture"
  - "phase 8 authored classifier fixture"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: authored-classifier-fixture

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/094-root-cause-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | 007-remediation-deep-review |
| **Successor** | 009-pi-guard-classification |
| **Handoff Criteria** | Every criterion in this phase's `goal.md` passes and the phase is committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the root cause and UX research packet, which builds the ranked fixes from `../research/research.md` and remediates its review.

**Scope Boundary**: One file: the authored cli-classifier canary fixture under specs/sk-doc/z_archive. The served copy is not touched.

**Dependencies**:
- `../007-remediation-deep-review/review/review-report.md` finding P1-1

**Deliverables**:
- An authored fixture byte-identical to the served one
- An authored-tree canary run with 0 failures

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 001 fixed the authored harness but not the authored fixture beside it. The authored fixture kept `deem-choice-single` and `deem-verb-narrowness`, while the served copy has `classifier-verb-narrowness`. The rebuild copies every traced authored file byte for byte, and `--check` and the guard compare no content, so both stayed green. Running the hub canaries over the authored tree threw `gold mismatch for deem-choice-single: action defer but expected route`.

### Purpose
Make the authored closure match what is served, so a rebuild publishes a passing fixture.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Overwrite the authored fixture with the served bytes
- A scratch canary runner pointed at the authored tree, as proof

### Out of Scope
- Making `--check` compare content, a larger change to a generator owned by another track
- The archived compiled outputs, which are historical

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json` | Modify | Match the served fixture |
| `scratch/t2-authored-canaries.cjs` | Create | The all-canaries runner pointed at the authored tree |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The authored fixture equals the served one | `cmp` exits 0 |
| REQ-002 | The authored tree's canaries pass | The authored runner prints `all hubs failures 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Serving stays green | `--check` exit 0, guard exit 0, served canaries 0 failures |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 55 files `--check` traces are byte-identical between authored and served.
- **SC-002**: No hub version changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Another traced file drifts later the same way | Medium | The phase compared all 55 traced files; a content check in `--check` is recorded as out of scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the phase.
<!-- /ANCHOR:questions -->

---
