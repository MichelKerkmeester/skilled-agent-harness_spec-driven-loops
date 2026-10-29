---
title: "Tasks: Orphan sweeper: reap abandoned temp and scratch processes and install the LaunchAgent"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "orphan sweep temp processes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Orphan sweeper: reap abandoned temp and scratch processes and install the LaunchAgent

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

`W` is `.skilled/scripts/orphan-mcp-sweeper.sh`. `R` is `.skilled/skills/system-spec-kit/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the orphan baseline and the agent state (`spec.md` Measured Behavior). Verify: `launchctl list | grep -i orphan` prints nothing.
- [x] T002 Dry-run the unmodified rules from inside a session (`W`). Verify: output proposes `kill` for this session's pid 86738.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the `temp-path-orphan` class, its pre-signal recheck and the listener exception (`W`). Verify: `/bin/bash -n W` and `shellcheck -S warning W` exit 0.
- [x] T004 Pass `-a` to pgrep on Darwin in `build_session_trees` (`W`, implemented by DeepSeek V4.1 Flash via Pi). Verify: dry run prints `reason=live-session-tree pid=86738`.
- [x] T005 Preserve the advisor launcher and its launcher-parented server (`W`, implemented by DeepSeek V4.1 Flash via Pi). Verify: dry run prints `advisor-self-idle-timeout` and `advisor-launcher-child`.
- [x] T006 Add the regression tests (`R/tests/orphan-sweeper-temp-path.vitest.ts`, session-tree block by DeepSeek V4.1 Flash via Pi). Verify: `npx vitest run orphan-sweeper` passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run every sweeper suite (`R`). Verify: `npx vitest run orphan-sweeper launcher-stop-hook-orphan-sweep` prints `Test Files  3 passed (3)` and `Tests  18 passed (18)`.
- [x] T008 Dry-run the final script on the live process list (`W`). Verify: no `kill` line names a live session helper or the advisor.
- [x] T009 Install the LaunchAgent live (`~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist`). Verify: `launchctl list com.michelkerkmeester.orphan-sweep` succeeds, its `ProgramArguments` carry no `--dry-run`, and a `launchctl kickstart` run logs `dry_run=false` and `exit_code=0`.
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
