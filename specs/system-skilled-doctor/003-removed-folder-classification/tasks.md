---
title: "Tasks: Overlay engine treats upstream files inside a skill-root remove folder as removed, not live-edited; verify Barter items 1 to 5"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "removed folder classification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Overlay engine treats upstream files inside a skill-root remove folder as removed, not live-edited; verify Barter items 1 to 5

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

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
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Create the worktree and packet. Verify: `ls specs/system-skilled-doctor/003-removed-folder-classification` lists spec.md. Evidence: worktree 331 from main.
- [x] T002 Capture the baseline. Verify: the four overlay suites print `pass 58 fail 0`. Evidence: 58/58, run-all 7 suites passed.
- [x] T003 Confirm the cited lines did not move since 96153b476b. Verify: `git diff --stat 96153b476b HEAD -- overlay-engine.cjs` prints nothing. Evidence: only track-roots.mjs changed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Add failing tests (`overlay-engine-sync.test.cjs`, `overlay-engine-repin.test.cjs`). Verify: against the old engine they print `pass 0 fail 4`. Evidence: observed.
- [x] T005 Tag declared removals and classify them (`overlay-engine.cjs`). Verify: the four suites print `pass 62 fail 0`.
- [x] T006 Report removal ownership in capture and the guard (`overlay-engine.cjs`). Verify: capture on a removed path refuses with "scheduled for removal by overlay".
- [x] T007 Update the `live-edited` rows and release v1.1.2.0 (`overlays.md`, presentation asset, changelog, SKILL.md). Verify: `check_changelog_shape.py` prints PASS.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Reproduce Barter's case in a temp tree. Verify: status shows two `overlay-edited` lines with fix `apply`, apply exits 0, second status ends `RESULT: PASSED`. Evidence: observed; the old engine refused even the first apply.
- [x] T009 Run the full doctor gate. Verify: `run-all.sh` prints `7 suite(s) passed, 0 failed`. Evidence: 1077/1077 node tests.
- [x] T010 Verify Barter items 1 to 5. Verify: each stated check. Evidence: 64/64, 59/59, 19/19, lookup exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



