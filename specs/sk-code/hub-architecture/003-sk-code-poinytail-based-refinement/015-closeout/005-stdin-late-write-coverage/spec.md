---
title: "Feature Specification: Phase 5: stdin-late-write-coverage"
description: "Drive all seven short-deadline hook entries with a payload written in time and the same payload written late, and record in the hooks README what a late write costs."
trigger_phrases:
  - "stdin late write coverage"
  - "phase 5 stdin late write coverage"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: stdin-late-write-coverage

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/098-post-092-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 9 |
| **Predecessor** | 004-dispatch-guard-and-vitest |
| **Successor** | 006-compiled-route-content-check |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the epic closeout phase parent. It closes items 7 and 12 of the closeout list, the late-write test that covered one short-deadline entry and the 500 ms residual risk.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Drive all seven short-deadline hook entries with a payload written in time and the same payload written late, and record in the hooks README what a late write costs.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
hook-stdin-deadline.test.mjs held seven entries to the 500 ms short-host deadline but tested a late write against only the Claude prompt shim, and the early-write test against four. The hooks README named the deadline without saying what a host that writes late loses.

### Purpose
Each short-deadline entry is proven to act on a payload written at once and to drop the same payload written past its deadline, and the README states the residual risk precisely.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The early-write and late-write tests in hook-stdin-deadline.test.mjs
- A parity check over the three copies of the 500 ms value
- One paragraph in runtime/hooks/README.md
- The system-spec-kit bump for the closeout

### Out of Scope
- Changing the 500 ms deadline
- The seven HVR hard blockers already in the hooks README, which predate this phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` | Modify | Table-driven short-host rows, parity check |
| `.skilled/skills/system-spec-kit/runtime/hooks/README.md` | Modify | Residual-risk paragraph |
| `.skilled/skills/system-spec-kit/SKILL.md and changelog/v2.7.8.0.md` | Modify, Create | Version 2.7.8.0 |
| `.hermes/skills/system-spec-kit/SKILL.md` | Modify | Regenerated |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every short-deadline entry is covered both ways | A rows test asserts the table matches every SHORT_HOST entry |
| REQ-002 | The late test discriminates | With the late write moved to 100 ms all seven late rows fail |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-090 | Strict validation of this phase passes | validate.sh --strict prints RESULT: PASSED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every completion criterion in goal.md passes when the orchestrator reruns it.
- **SC-002**: The phase lands as one conventional commit in the worktree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A change reaches a caller the phase did not name | Med | The gates named in goal.md are rerun from the final state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
