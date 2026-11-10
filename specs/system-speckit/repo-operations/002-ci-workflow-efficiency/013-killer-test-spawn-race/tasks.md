---
title: "Tasks: killer test spawn race"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "killer test spawn race tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: killer test spawn race

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

`K` is `.skilled/hooks/session-relaunch/tests/killer.test.cjs`. `S` is the session scratchpad `forced/` folder outside the repo.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline (`K`). Verify: `node --test K` prints `pass 64`, `fail 0` in 38.2 s.
- [x] T002 Copy the old file to `S` with a 600 ms busy wait ahead of the handler in both target scripts. Verify: the two probe tests fail with `ENOENT ... target-signal`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write a `sigterm-handler-ready` line after `process.on('SIGTERM')` in `startTarget` and `startCountingTarget`, with stdout piped (`K`). Verify: `rg -n "TARGET_READY_LINE" K` prints 4 lines.
- [x] T004 Add `waitForTargetReady` with exit, error and 15 s timeout rejections (`K`). Verify: `node --check K` exits 0.
- [x] T005 Replace the `once('spawn')` waits of every `startTarget` / `startCountingTarget` target and the one inside the `Promise.all` (`K`). Verify: the 17 waits left on `startPersistentProcess` targets and the 2 inside `waitForSpawn` are the only `once('spawn'` lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Forced race on the fixed file (`S`). Verify: both probe tests print `✔` under the 600 ms delay.
- [x] T007 Run the whole file ten times (`K`). Verify: every run prints `pass 64` and `fail 0` with exit 0.
- [x] T008 Validate the folders. Verify: `validate.sh --recursive --strict` on this folder and on the parent print `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Ten consecutive full runs pass and the forced-delay copy of the fixed file passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
