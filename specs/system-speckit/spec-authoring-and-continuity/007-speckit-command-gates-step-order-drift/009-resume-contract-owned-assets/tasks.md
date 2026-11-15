---
title: "Tasks: Phase 9: resume-contract-owned-assets"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "resume contract owned assets tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: resume-contract-owned-assets

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

`G` is `.skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs`. `C` is `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Reproduce the drift on `d3f08a81ac` (`G`). Verify: `node G --check` prints `routers=42 clean=41 path-drift=1 shape-drift=0` and exits 1.
- [x] T002 Reproduce the failing test (`.skilled/skills/system-spec-kit/runtime/cli/tests/typo-flags.vitest.ts`). Verify: the vitest run prints `Tests  1 failed | 33 passed (34)`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 Drop the resume `auto_workflow` and `confirm_workflow` rows and add `/speckit:resume` to the speckit `workflow` row (`C`). Verify: `python3 -m json.tool C` exits 0 and `rg -n 'speckit-<name>-(auto|confirm)' C` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T004 Rerun the drift check (`G`). Verify: `node G --check` prints `routers=42 clean=42 path-drift=0 shape-drift=0` and exits 0.
- [x] T005 Rerun the typo-flags test and CLI vitest shard 2 (`.skilled/skills/system-spec-kit/runtime/cli/tests/`). Verify: typo-flags prints `Tests  34 passed (34)` and shard 2 prints `Tests  1135 passed | 8 skipped (1143)` with exit 0.
- [x] T006 Run the doctor contract tests (`.skilled/commands/doctor/scripts/tests/`). Verify: `node --test` over `doctor-*-contract.test.cjs` prints `pass 190` and `fail 0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The drift check exits 0 with all 42 routers clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

