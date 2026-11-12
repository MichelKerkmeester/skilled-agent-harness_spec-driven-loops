---
title: "Tasks: Phase 6: append-lock-stale-reclaim"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "append lock stale reclaim tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: append-lock-stale-reclaim

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

No shell variables are used. Every task names a repository-relative path in full.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the stale reclaim and the release in `relaunch-core.cjs` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`). Verify: `rg -n 'APPEND_LOCK_STALE_MS|rmdirSync\(lockPath\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints five lines: the constant, the first age check, the reclaim directory's age check, the second age check with the reclaim removal, and the release.
- [x] T002 Read the takeover-mutex rename and inode check in `killer.cjs` (`.skilled/hooks/session-relaunch/lib/killer.cjs`). Verify: `rg -n 'renameSync\(mutexPath, staleMutexPath\)|renamedInode === mutexInode' .skilled/hooks/session-relaunch/lib/killer.cjs` prints line 427 and line 536.
- [x] T003 Run the current test file (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with no failing case.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the failing-first case `two waiters never hold the append lock together` (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`). Verify: `node --test --test-name-pattern 'two waiters never hold the append lock together' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 1 with an overlapping critical section before the reclaim changes.
- [x] T005 Replace the stale reclaim with a reclaim under a reclaim directory that reads the age again (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`). Verify: `rg -c 'const reclaimPath' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 1.
- [x] T014 Add the failing-first case `eight waiters never hold the append lock together` (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`). Verify: `node --test --test-name-pattern 'eight waiters never hold the append lock together' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 after the reclaim change.
- [x] T012 Add the failing case `an unsafe state directory gets no lock directory` (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`). Verify: `node --test --test-name-pattern 'unsafe state directory gets no lock directory' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits non-zero before the fix.
- [x] T013 Add `withStateLock`, which skips the lock when the state directory fails `inspectStateDir`, and use it in the five record callers, `arm` among them (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`). Verify: `node --test --test-name-pattern 'unsafe state directory gets no lock directory' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the two-waiter case (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`). Verify: `node --test --test-name-pattern 'two waiters never hold the append lock together' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with one passing case.
- [x] T007 Run the full test file (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with no failing case.
- [x] T008 Confirm the lock path is removed only in the reclaim and the release (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`). Verify: `rg -c 'rmdirSync\(lockPath\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 2.
- [x] T009 Confirm the wait bound is unchanged (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`). Verify: `rg -n 'APPEND_LOCK_WAIT_MS = 2000' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints one line.
- [x] T010 Confirm the reclaim reads the age again under the reclaim directory (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`). Verify: `rg -c 'staleAgainMs' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 2.
- [x] T011 Run strict validation on the packet (`specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim/spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with the two-waiter case passing
- [x] The strict packet validator prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task stays `[B]` and blocks close. It is unblocked only when the blocker is recorded in `goal.md` section 4.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Verify: `rg -c 'REQ-00[1-4]' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim/spec.md` prints 4.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Verify: `rg -n '^## 4. IMPLEMENTATION PHASES' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim/plan.md` prints one line.
- [x] CHK-003 [P1] Dependencies identified and available. Verify: `rg -n '^\| Dependency \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim/spec.md` prints one row.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The module parses. Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0.
- [x] CHK-011 [P0] The test file parses. Verify: `node --check .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [x] CHK-012 [P1] The lock path is removed only in the reclaim and the release. Verify: `rg -c 'rmdirSync\(lockPath\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 2.
- [x] CHK-013 [P1] The reclaim is exclusive. Verify: `rg -c 'const reclaimPath' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 1.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The two-waiter case passes. Verify: `node --test --test-name-pattern 'two waiters never hold the append lock together' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [x] CHK-021 [P0] The full test file passes. Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [x] CHK-022 [P1] The cases exercise a stale age. Verify: `rg -c 'staleSeconds = ' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` prints 2, one planted lock sixty seconds old in each waiter case.
- [x] CHK-023 [P1] The wait-bound fallback stays. Verify: `rg -n 'APPEND_LOCK_WAIT_MS = 2000' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints one line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding 6 is recorded with its class. Verify: `rg -n 'algorithmic' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim/plan.md` prints one line.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is complete. Verify: `rg -c 'rmdirSync\(lockPath\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 2, the reclaim and the release sites.
- [x] CHK-FIX-003 [P0] The consumer inventory is complete. Verify: `rg -n 'withAppendLock' .skilled/hooks/session-relaunch` prints the definition and every call site.
- [x] CHK-FIX-004 [P0] The adversarial contention case is present. Verify: `rg -c 'waiters never hold the append lock together' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` prints 2, the two-waiter and the eight-waiter case.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed. Verify: `rg -n 'Matrix axes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim/plan.md` prints one line.
- [x] CHK-FIX-006 [P1] N/A: The helper reads no process environment and no global state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to an explicit diff. Verify: `git diff --stat -- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` prints the two changed files.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret entered the change. Verify: `rg -n '(api[_-]?key|password|secret)[[:space:]]*=' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` prints nothing.
- [x] CHK-031 [P0] N/A: The reclaim touches no input that crosses a trust boundary.
- [x] CHK-032 [P1] N/A: The helper makes no authentication or authorization decision.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks are synchronized. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim --strict --quiet` prints `RESULT: PASSED`.
- [x] CHK-041 [P1] The changed comment explains why the age is read again under the reclaim directory. Verify: `rg -c 'age is read again' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 1.
- [x] CHK-042 [P2] N/A: Finding 6 names one module and its test, so this phase has no README edit.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scratch holds evidence only. Verify: `ls specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim/scratch` prints the red and green run files and the review diff.
- [x] CHK-051 [P1] Scratch sits inside the untracked packet. Verify: `git status --porcelain -- specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim/scratch` prints the folder as untracked and nothing else.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
