---
title: "Tasks: Phase 45: relaunch-takeover-lock-identity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "relaunch takeover lock identity tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 45: relaunch-takeover-lock-identity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the failing CI run and confirm the step that owns it (`.github/workflows/hooks-node-tests.yml`, run 39577580180)
- [x] T002 Write the pinned-inode test and record the base result, 55 passed of 56, before any fix (`scratch/mutation/base-killer.tap`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write `${process.pid} ${token}` to the mutex `owner` file (`.skilled/hooks/session-relaunch/lib/killer.cjs`, commit `e56248d0ae`)
- [x] T004 Require the recorded inode and the token on release (`.skilled/hooks/session-relaunch/lib/killer.cjs`, commit `e56248d0ae`)
- [x] T005 Skip the cleanup when the owner write fails with `EEXIST` (`.skilled/hooks/session-relaunch/lib/killer.cjs`, commit `f0cb18991e`)
- [x] T006 Rename to a private `.stale-` name, re-read the token and rename a mismatch back (`.skilled/hooks/session-relaunch/lib/killer.cjs`, commit `f0cb18991e`)
- [x] T007 Rename first in the owner-write failure cleanup (`.skilled/hooks/session-relaunch/lib/killer.cjs`, commit `b61416d25c`)
- [x] T008 [P] Test: a replaced directory survives when its inode is reused (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`)
- [x] T009 [P] Test: an owner write that lost the race leaves the directory (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`)
- [x] T010 [P] Test: a directory swapped in after the ownership check is restored (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`)
- [x] T011 [P] Test: a directory taken over during an owner-write failure cleanup survives (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`)
- [x] T012 State the token, the rename-back and the three-killer limit in the hooks README (`.skilled/hooks/session-relaunch/README.md`, commit `32cf4119fe`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run each new test against the code before its fix and record the failure (`scratch/mutation/`)
- [x] T014 Run `killer.test.cjs` 20 consecutive times at 59 passed of 59 (`scratch/killer-20x-r3.txt`)
- [x] T015 Luna review of every change in three rounds, with round findings fixed or recorded (`scratch/luna/`)
- [ ] T016 Push to main and confirm Hook Node Tests green on CI (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` - T016 waits on the push to main
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
