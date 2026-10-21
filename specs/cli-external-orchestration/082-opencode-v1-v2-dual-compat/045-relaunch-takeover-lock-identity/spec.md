---
title: "Feature Specification: Phase 45: relaunch-takeover-lock-identity"
description: "Hook Node Tests run 39577580180 failed `killer leaves a takeover directory a contender replaced while it was held` on every Linux run and passed on macOS. The killer recognised its takeover mutex directory by inode alone, and Linux reuses a deleted directory's inode, so it could remove a mutex another killer had recreated."
trigger_phrases:
  - "relaunch takeover lock identity"
  - "relaunch takeover lock identity owner token instead"
  - "takeover mutex inode reuse"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 45: relaunch-takeover-lock-identity

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/188-relaunch-takeover-lock-identity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 45 of 45 |
| **Predecessor** | 043-v2-default-model-and-follow-ups |
| **Successor** | None |
| **Handoff Criteria** | Hook Node Tests passes on CI at the pushed main commit, and every killer built after this phase writes and reads the mutex `owner` file as `<pid> <token>` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 45** of the OpenCode v1 and v2 dual compatibility specification. It repairs the Linux-only takeover failure the new Hook Node Tests job surfaced in phase 43, without changing the takeover protocol the rest of the killer reads.

**Scope Boundary**: `lib/killer.cjs`, its test file and the hooks README paragraph that describes the takeover mutex. The killer lock file, the relaunch record and every other session-relaunch file stay as they are.

**Dependencies**:
- Hook Node Tests run 39577580180 at `db82fdfd62`, which failed `killer.test.cjs` on `ubuntu-latest` and passed locally on macOS.
- 043's Known Limitation 5, which named the inode-only check and proposed a per-holder token as the repair.

**Deliverables**:
- A mutex `owner` file that records `<pid> <token>`, with release requiring both the recorded inode and the token.
- A release that renames the directory to a private `.stale-` name before it removes anything, and an owner-write failure cleanup that does the same.
- Four tests, one per race, and a README paragraph that states the remaining three-killer limit.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.github/workflows/hooks-node-tests.yml` failed `killer leaves a takeover directory a contender replaced while it was held` in `killer.test.cjs` on every Linux run of run 39577580180, and the same suite passed on macOS. The killer recognised its takeover mutex directory by inode alone, so it removed the path while the recorded inode still matched, but Linux hands a deleted directory's inode number straight to its replacement. The killer could therefore remove a mutex another killer had just recreated, which let two killers take over the same loop.

### Purpose
A killer removes only the takeover directory it created, proven by the inode and the token it wrote there, so a contender's mutex survives on Linux and macOS and Hook Node Tests goes green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `lib/killer.cjs`: write `${process.pid} ${token}` to the mutex `owner` file, and require that token on release alongside the recorded inode.
- `lib/killer.cjs`: rename the directory to a private `.stale-<pid>-<uuid>` name before removing it, read the token again from the renamed directory, and rename a mismatch back.
- `lib/killer.cjs`: skip the cleanup when the owner write fails with `EEXIST`, and make the other owner-write cleanup rename first before it judges the directory.
- `killer.test.cjs`: four tests, one for each race the review found.
- The hooks README paragraph that describes the takeover mutex, its ownership proof and the remaining limit.

### Out of Scope
- The killer lock file's own release. It already checks the recorded owner pid, and this phase does not change it.
- Atomic compare-and-delete for directories. No filesystem primitive offers it, so the three-killer window is documented instead of closed.
- Replacing the directory mutex with a lock file or `flock`. Every killer and the stale sweep read the `<lock>.takeover` directory format, so that is a protocol change this failure does not require.
- Every other file under `.skilled/hooks/session-relaunch/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modify | Write and verify an owner token, rename before removing, and keep a contender's directory on an `EEXIST` owner write |
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs` | Modify | Four race tests, and the file moves from 55 to 59 tests |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Describe the token, the rename-back and the remaining three-killer limit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A release removes the mutex only when the recorded inode and the owner token still match. | "killer leaves a replaced takeover directory even when its inode is reused" fails at 55 passed of 56 on the base (`scratch/mutation/base-killer.tap`), and the suite reports 59 passed of 59 after (`scratch/after-killer-r3.tap`). |
| REQ-002 | Hook Node Tests passes on Linux at the pushed main commit. | The `Hook node:test suites` job on `ubuntu-latest` passes, and its run id is recorded in `implementation-summary.md`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | An owner write that loses the race leaves the contender's directory in place. | "killer does not remove a takeover directory whose owner write lost the race" fails at 56 passed of 58 before its fix (`scratch/mutation/r1-killer.tap`) and passes after. |
| REQ-004 | A release never removes a directory by path after the ownership check. | "killer restores a takeover directory swapped in after its ownership check" fails in the same 56 of 58 capture and passes after. |
| REQ-005 | The cleanup after a failed owner write renames first and keeps a directory a contender took over. | "killer keeps a takeover directory a contender took over during an owner-write failure cleanup" is the one failure at 58 passed of 59 before its fix (`scratch/mutation/r2-killer.tap`) and passes after. |
| REQ-006 | The hooks README states the token, the rename-back and the remaining limit. | The paragraph names the `<pid> <token>` owner file, the rename-back and the three-killer window, and commit `32cf4119fe` carries it. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `killer.test.cjs` reports 59 passed of 59, from 55 passed of 56 at the base, and 20 consecutive runs each report 59 passed of 59 (`scratch/killer-20x-r3.txt`).
- **SC-002**: Hook Node Tests passes on CI at the pushed main commit, after failing on every Linux run of run 39577580180.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `fs.renameSync` on the same filesystem | High | The rename stays inside the lock's own directory, and a failure logs `killer-mutex-release-error` without undoing the takeover |
| Dependency | The pid stays the first field of the mutex `owner` file | High | Every reader parses the pid from that field, so a two-field owner file stays readable by a killer built before this phase |
| Risk | The pinned-inode test stubs `fs.statSync` and could pass while the real filesystem behaves differently | Med | The test asserts the behavioural outcome, the 20-run capture repeats it, and the same test ran red on the base before the fix |
| Risk | The rename-back loses the path to a third killer and leaves a directory under `.stale-` | Med | The stale sweep removes `.stale-` directories older than 30 s under the mutex, and the accepted window is stated in the README and in `implementation-summary.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. The remaining three-killer window has no cheap fix, and it is recorded under Known Limitations in `implementation-summary.md` and in the hooks README.
<!-- /ANCHOR:questions -->

---
