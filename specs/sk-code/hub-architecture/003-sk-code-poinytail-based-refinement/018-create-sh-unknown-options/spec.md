---
title: "Feature Specification: Phase 18: create-sh-unknown-options"
description: "create.sh added any argument it did not recognize to the spec folder title, so a misspelled flag such as --goal became part of the folder name and the run still exited 0."
trigger_phrases:
  - "create sh unknown options"
  - "phase 18 create sh unknown options"
  - "create.sh unknown option error"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 18: create-sh-unknown-options

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
| **Branch** | `worktrees/101-create-sh-unknown-flags` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-release-changelog |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the sk-code Ponytail 5 refinement phase parent. It fixes a silent argument bug in the spec folder scaffolder that the epic's own phase work hit: `create.sh --goal` was accepted and glued onto the title.

**Scope Boundary**: The argument loop of `create.sh`, one new vitest, the two docs that passed a flag the parser never had, and the system-spec-kit release entry.

**Dependencies**:
- None. The fix is local to the argument loop.

**Deliverables**:
- An unknown-option error in `create.sh` and a test that fails on the old script.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The argument loop's catch-all branch appended every unrecognized argument to the title words. `create.sh --goal "My feature"` therefore produced the title "--goal My feature", wrote no goal.md and exited 0. The literal-naming playbook scenario and its feature catalog entry passed `--phase-count`, which never existed, and hit the same silent path.

### Purpose
A mistyped option stops `create.sh` with a clear error before anything is written.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One unknown-option branch in the argument loop, exiting 1 like the script's other argument errors
- A vitest that covers `--with-goal` and the `--goal` failure
- Callers that passed a flag the parser does not handle, when the flag was a silent bug of the same kind

### Out of Scope
- A `--goal` alias or a did-you-mean table, because one unknown-option error covers the whole class
- A `--` end-of-options marker, because no caller passes a title that starts with a dash

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Refuse an unknown option |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts` | Create | Happy path and edge case |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md` | Modify | `--phase-count` to `--phases` |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md` | Modify | `--phase-count` to `--phases` |
| `.skilled/skills/system-spec-kit/changelog/v2.7.10.0.md` and `SKILL.md` | Create/Modify | Release entry and version |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An argument that starts with `-` and matches no option fails before any write | `create.sh --goal "X"` exits 1, prints `Error: unknown option '--goal'` and a `--help` pointer on stderr, and creates no folder |
| REQ-002 | `--with-goal` keeps working | The new vitest's happy path finds goal.md in the created folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The edge test fails on the pre-fix script | Running it against the old create.sh reports 1 failed test |
| REQ-004 | No caller passes an option the parser lacks | The caller sweep finds no live caller left with an unknown flag |
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
| Risk | A caller relies on a title that starts with a dash | Low | The sweep found none, so refusing such a title is safe |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
