---
title: "Feature Specification: Phase 5: hooks-vitest-scope"
description: "Restrict the hooks vitest include to the hooks tree so a filtered run from .skilled/hooks collects only hooks suites and leaves the tree clean."
trigger_phrases:
  - "hooks vitest scope"
  - "phase 5 hooks vitest scope"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: hooks-vitest-scope

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
| **Branch** | `worktrees/099-residual-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-battery-misses |
| **Successor** | 006-closeout-deep-review |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the residual closeout phase parent. It closes item 5 of the residual list: the hooks vitest config that collects archived spec tests.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Restrict the hooks vitest include to the hooks tree so a filtered run from .skilled/hooks collects only hooks suites and leaves the tree clean.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/hooks/vitest.config.ts` sets `root` to the repository root so hook imports resolve, and it sets no `include`. A filtered run such as `npx vitest run dispatch` from `.skilled/hooks` therefore matched every test path in the repository containing `dispatch`, including archived spec tests. One of them, `specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/072-speckit-template-memory-ranking-release/tests/spec-070-composite.test.js`, rewrites the tracked `test-results-composite.md` and fails.

### Purpose
The same command exits 0, collects only hooks files, and leaves `git status` clean, while every hooks suite the config collected before is still collected.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One `include` entry in `.skilled/hooks/vitest.config.ts`

### Out of Scope
- The archived spec tests themselves
- The node:test exclusion the config already makes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/vitest.config.ts` | Modify | `include` limited to the hooks tree |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The reported command is clean | `npx vitest run dispatch` from `.skilled/hooks` exits 0 and `git status` stays clean |
| REQ-002 | No hooks suite is lost | `vitest list` over `.skilled/hooks` returns the same five files before and after |

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
