---
title: "Feature Specification: Phase 23: release-update-symlink-parent"
description: "/doctor:update aborted with 'path parent is not a real directory' whenever a release added a file below a path the checkout keeps as a symlink, even for a check scoped elsewhere. The engine now reports that file as a symlink-parent conflict that only keep-local can answer, so it never writes through the link."
trigger_phrases:
  - "release update symlink parent"
  - "doctor update symlinked folder"
  - "symlink-parent conflict"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 23: release-update-symlink-parent

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 23 of 23 |
| **Predecessor** | 022-doctor-playbook-environment-migration |
| **Successor** | None |
| **Handoff Criteria** | An unscoped check in the update fixture finishes with no workaround commit, and adopt-release is refused for a symlink-parent file |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of the doctor audit follow-ups. Building the update fixture in phase 021 showed that every v4.0.0.0 install crashes when it checks v4.0.0.2 or main, because v4.0.0.0 ships `.skilled/changelog/sk-design` as a symlink and later releases ship a folder. The operator chose a fixture workaround first and this engine fix second.

**Scope Boundary**: `release-update.cjs` read path and decision rules, one regression test, the align eligibility wording, and the fixture commits and docs that described the workaround.

**Dependencies**:
- The update fixture from `021-doctor-test-environments`
- The existing three-way classification in `release-update.cjs`

**Deliverables**:
- The `symlink-parent` conflict kind in `release-update.cjs`
- A regression test in `release-update.test.cjs`
- The fixture without its workaround commit, carrying the fixed updater

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`safeResolve` rejects any path whose parent is a symlink, which is right for writes. `worktreeEntry` used it for reads too, so `check`, `align` and `record-base` threw on the first such release path and reported nothing for any unit.

### Purpose
Report the case as a conflict the operator can see and answer, and keep refusing to write through the link.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `worktreeEntry` returns an unsupported entry marked `symlinkParent` instead of throwing
- `classifyFile` reports that entry as `conflict` with `conflictKind: symlink-parent`
- The plan records no local state for it, and the recommended answer is keep-local
- adopt-release stays refused for it, because it is not an adoptable conflict
- The fixture drops its symlink workaround and carries the fixed updater

### Out of Scope
- Following or replacing the symlink automatically - the operator removes it and re-runs align if they want the release files
- Write-path changes - `safeResolve` still refuses to write through a symlink

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/release-update.cjs` | Modify | Report a symlinked parent on read as a `symlink-parent` conflict |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modify | Regression test for the symlinked folder case |
| `.skilled/commands/doctor/assets/doctor-update-align.yaml` | Modify | Name keep-local as the only answer for the new conflict |
| `doctor-commands/README.md`, DOC-379 | Modify | Describe the fixed fixture and drop the workaround step |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A symlinked parent no longer aborts a read | `check` and `align` exit 0 and report the unit as `conflict` |
| REQ-002 | Nothing is written through the link | adopt-release on a `symlink-parent` file is refused and the link target is unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The fixture needs no workaround | The workaround commit is reverted and the four fixture statuses still hold |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new test fails on the old engine and passes on the new one.
- **SC-002**: The whole engine suite stays green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A real file later appears where the symlink was | Low | The next check reads it as an ordinary file, because the conflict comes only from a symlinked parent |
| Risk | Other readers assume a present local entry has content | Med | The plan records no local state for the entry, so `withLocalContent` and the apply drift check treat it as absent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

