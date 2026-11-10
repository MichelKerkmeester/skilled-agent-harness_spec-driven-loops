---
title: "Feature Specification: Phase 6: compiled-route-content-check"
description: "Make compiled-route-sync.cjs --check compare every traced authored file with its served copy and fail on a missing or different one."
trigger_phrases:
  - "compiled route content check"
  - "phase 6 compiled route content check"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: compiled-route-content-check

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
| **Phase** | 6 of 9 |
| **Predecessor** | 005-stdin-late-write-coverage |
| **Successor** | 007-review-reducer-missing-config |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the epic closeout phase parent. It closes item 5 of the closeout list, compiled-route-sync.cjs --check passing while a served copy differs from its authored file.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Make compiled-route-sync.cjs --check compare every traced authored file with its served copy and fail on a missing or different one.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`compiled-route-sync.cjs --check` traced the authored closure and listed its files, but never opened the served copies under .skilled/bin/lib/compiled-routing. An authored file edited after the last build, or a served file edited by hand, passed the check while serving ran different code.

### Purpose
`--check` exits 1 and names each file whose served copy is missing or differs, and exits 0 only when all traced files match.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- check() in .skilled/bin/compiled-route-sync.cjs and its usage text
- A test in .skilled/bin/tests/compiled-route-manifest.test.cjs
- The --check line of .skilled/bin/README.md

### Out of Scope
- The build, verify, finalize and revert modes
- Files the serving root holds that the trace does not reach, such as fence state and the closure manifest

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/compiled-route-sync.cjs` | Modify | Byte comparison in check() |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | Modify | Missing and different served copy |
| `.skilled/bin/README.md` | Modify | --check description |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A different served copy fails --check | Test asserts the throw names the file |
| REQ-002 | A missing served copy fails --check | Test asserts the throw |
| REQ-003 | Today's tree passes | --check prints all 55 served copies match |

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
