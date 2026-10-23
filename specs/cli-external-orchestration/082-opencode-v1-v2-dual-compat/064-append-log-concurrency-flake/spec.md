---
title: "Feature Specification: Phase 64: append-log-concurrency-flake"
description: "The Hook Node Tests case 'appendLog keeps every line when eight processes append concurrently' failed once in CI on ubuntu-latest: the log held 201 lines where the test expected 200, every worker exited 0, and the next attempt passed. `appendLog` peeks the log's last byte and prepends a newline when that byte is not one, and on Linux a concurrent appender's in-flight write can make the size end mid-line, so the peek added a spurious empty line. A mkdir-based lock now spans the peek, the write and the fsync, and a new regression test simulates an in-flight append."
trigger_phrases:
  - "append log concurrency flake"
  - "phase 64 append log concurrency flake"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 64: append-log-concurrency-flake

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-23 |
| **Branch** | `worktrees/209-append-log-concurrency-flake` |
| **Parent Spec** | ../spec.md |
| **Phase** | 64 of 64 |
| **Predecessor** | 063-v4-0-0-13-final-changelog |
| **Successor** | None |
| **Handoff Criteria** | `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` holds a mkdir-based `relaunch.log.lock` across `appendLog`'s last-byte peek, its write and its fsync, waiting in 2 ms steps up to `APPEND_LOCK_WAIT_MS` of 2000, reclaiming a lock older than `APPEND_LOCK_STALE_MS` of 10000, and appending without the lock on timeout or any lock error. The new regression test 'appendLog waits for an in-flight append before peeking the last byte' fails 5 of 5 on the old code and 0 of 5 on the fixed code. The concurrency test passes 100 of 100 runs, the stress run of 16 workers by 300 lines by 30 rounds finds 0 bad rounds, the hook node suite passes 915 of 915 from a baseline of 914, the hooks vitest suite passes 461 of 461 and `relaunch-core.test.cjs` passes 102 of 102. The commit, push and CI run remain open. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 64** of the OpenCode v1 and v2 dual compatibility packet. It is the last phase, and it closes a single CI flake in the session-relaunch hook's history log rather than a compatibility gap.

**Scope Boundary**: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` and `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`, this phase's four docs and the parent packet's phase-map and handoff rows. No other hook, skill, suite or CI workflow is touched.

**Dependencies**:
- The failing CI run itself, on main commit `9c4de85d6f`, run `39880116448`, attempt 1, job 'Hook node:test suites', on ubuntu-latest, which is the only evidence of the defect.
- The `appendLog` peek behavior as it stood, which is the code the fix wraps.

**Deliverables**:
- `withAppendLock(logPath, fn)` in `relaunch-core.cjs`, and `appendLog` running its peek, write and fsync inside it.
- The regression test 'appendLog waits for an in-flight append before peeking the last byte'.
- This phase's four docs, filled with the work, its verification record and the open delivery tasks.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Hook Node Tests case 'appendLog keeps every line when eight processes append concurrently' failed once in CI. It ran on main commit `9c4de85d6f`, run `39880116448`, attempt 1, job 'Hook node:test suites', on ubuntu-latest, and the assertion error was `201 !== 200` at line 987, the line count, with every worker exiting 0. Attempt 2 passed. `appendLog` peeks the log's last byte, through fstat size and a readSync at size-1, and prepends `\n` when that byte is not `\n`, so an event after a truncated line starts on its own line. On Linux a concurrent appender's in-flight write can make the size end mid-line, so the peek sees a non-newline byte and prepends a spurious `\n`. When the other write completes the file holds an empty line, which is the 201st line. Writes with O_APPEND are atomic, so no event line was split; only the peek raced.

### Purpose
Hold one lock across the peek and the write, so a concurrent append can no longer leave an empty line in the relaunch log.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new helper `withAppendLock(logPath, fn)` that holds a mkdir-based lock at `relaunch.log.lock` across the peek, the write and the fsync.
- A wait in 2 ms steps up to `APPEND_LOCK_WAIT_MS` of 2000, with a lock older than `APPEND_LOCK_STALE_MS` of 10000 reclaimed.
- Appending without the lock on timeout or any lock error, because the history log must never block a hook.
- The deadline checked on every retry path, and the sleep buffer hoisted to one module constant.
- A new regression test, 'appendLog waits for an in-flight append before peeking the last byte', which simulates an in-flight writer with a `torn` line that has no newline and the lock held, then checks that the child waits and that the file holds `torn-completed` and then the child's line, with no empty line.
- This phase's four docs and the parent packet's phase-map and handoff rows.

### Out of Scope
- The stale-lock reclaim race between two waiters, which is rare and needs a crash-left lock first. Recorded, not fixed.
- The unlocked fallback after 2 s, which is accepted as fail-open. Recorded, not fixed.
- Windows `rmdir` EPERM and EBUSY. Recorded, not fixed.
- The regression test's ability to pass vacuously when the child starts after the lock is released, which cannot false-fail. Recorded, not fixed.
- Any other hook, skill, suite or CI workflow.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Add `withAppendLock`, run `appendLog`'s peek, write and fsync under it, check the deadline on every retry path and hoist the sleep buffer to one module constant |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Add the regression test 'appendLog waits for an in-flight append before peeking the last byte' |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 064 and the 063 to 064 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `appendLog`'s last-byte peek and its write share one lock. | A new helper `withAppendLock(logPath, fn)` holds a mkdir-based lock at `relaunch.log.lock` across the peek, the write and the fsync. It waits in 2 ms steps up to `APPEND_LOCK_WAIT_MS` of 2000 and reclaims a lock older than `APPEND_LOCK_STALE_MS` of 10000. |
| REQ-002 | A lock failure never blocks a hook. | On timeout or any lock error, `appendLog` appends without the lock. The deadline is checked on every retry path and the sleep buffer is one module constant. |
| REQ-003 | A test reproduces the race against the old code. | 'appendLog waits for an in-flight append before peeking the last byte' simulates an in-flight writer with a `torn` line and the lock held, then checks that the child waits and that the file holds `torn-completed` and then the child's line, with no empty line. On the old code it failed 5 of 5 runs; on the fixed code it failed 0 of 5, and 0 of 100 in a later loop. |
| REQ-004 | The suites the change touches are green. | The concurrency test passed 100 of 100 runs, the stress run of 16 workers by 300 lines by 30 rounds found 0 bad rounds, the hook node suite passed 915 of 915 from a baseline of 914, the hooks vitest suite passed 461 of 461 and `relaunch-core.test.cjs` passed 102 of 102. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A separate read-only review checks the fix. | One separate read-only DeepSeek session returned VERDICT: PASS with 5 P2 findings. The deadline skipped on the retry paths and the per-poll buffer allocation were fixed; the stale-lock reclaim race, the unlocked fallback, Windows `rmdir` EPERM/EBUSY and the vacuous-pass case are recorded and not fixed. |
| REQ-006 | This phase's records match the final state. | All four docs replace every scaffold placeholder, keep the template anchors and frontmatter, and carry status In Progress with the push and CI tasks unticked. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A concurrent append can no longer leave an empty line in the relaunch log, and the concurrency test passes 100 of 100 runs.
- **SC-002**: The history log still never blocks a hook, because a lock that cannot be taken falls through to an unlocked append.
- **SC-003**: A test fails on the old code and passes on the new one, so the race is reproducible rather than inferred.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The one failing CI run on ubuntu-latest, main commit `9c4de85d6f` | High | The failure is the only evidence, since macOS APFS does not show the torn size and the test passed 100 of 100 local runs before the fix |
| Dependency | O_APPEND writes staying atomic | High | No event line was split in the failure, so the fix guards the peek rather than the write |
| Risk | A lock held too long stalls a hook | Med | The wait is bounded at 2 s and every timeout falls through to an unlocked append |
| Risk | A crashed appender leaves a lock behind | Med | A lock older than 10 s is reclaimed, and the reclaim race between two waiters is recorded as a rare P2 |
| Risk | The regression test passes without exercising the race | Low | The test cannot false-fail; the vacuous-pass case is recorded as a P2 |
| Risk | Windows behaves differently for `rmdir` on a held lock | Low | EPERM and EBUSY are recorded as a P2; the failure path falls through to an unlocked append |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The facts came from the CI failure, the reproduction and the read-only review. The open tasks are delivery, not decisions.
<!-- /ANCHOR:questions -->

---
