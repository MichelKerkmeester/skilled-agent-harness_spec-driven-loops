---
title: "Tasks: Phase 37: relaunch-test-speed"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "relaunch test speed tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 37: relaunch-test-speed

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline (`.skilled/hooks/session-relaunch/tests`). Verify: `scratch/before-relaunch.txt` holds `tests 868` and `duration_ms 130123`.
- [x] T002 Time each test of the old file (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`). Verify: the tap run lists 185 tests.
- [x] T003 [P] Pick three cut points that give four parts of about 33 seconds. Verify: each cut is a top-level `test(` with a literal title.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Cut the old file into four files and the harness (`.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-*.cjs`). Verify: `node --check` exits 0 on all five.
- [x] T005 Delete the old file (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`). Verify: `ls .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` reports no such file.
- [x] T006 Set an empty loop id in the symlinked-directory nudge test (`.skilled/hooks/session-relaunch/tests/nudge.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` inside a looped session prints `pass 75`.
- [x] T007 Replace the old file name in five documents (`.skilled/hooks/session-relaunch/tests/README.md` and four more). Verify: `rg -n 'skilled-loop\.test' .skilled -g '*.md' -g '!**/changelog/**'` prints no line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Compare the test titles before and after (`.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-*.test.cjs`). Verify: 185 before, 185 after, sorted titles equal.
- [x] T009 Run the whole suite three times clean and once with ambient loop variables (`.skilled/hooks/session-relaunch/tests`). Verify: each run prints `tests 868`, `pass 868`, `fail 0`.
- [x] T010 Run the two sibling suites (`.opencode/plugins/tests/session-relaunch.test.cjs`, `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts`). Verify: 65 pass and 59 passed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
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



