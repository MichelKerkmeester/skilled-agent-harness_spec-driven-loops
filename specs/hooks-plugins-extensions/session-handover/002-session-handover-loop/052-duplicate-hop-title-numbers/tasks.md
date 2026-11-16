---
title: "Tasks: Phase 52: duplicate-hop-title-numbers"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "duplicate hop title numbers tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 52: duplicate-hop-title-numbers

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

`W` is `.skilled/bin/skilled-loop`. `T` is `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-launch-arguments.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Find every place a relaunched session's name is built (`W`, `.skilled/hooks/session-handover/bin/session-handover.cjs`, `.skilled/hooks/session-handover/lib/context-usage.cjs`). Verify: `rg -n -- '--name' W` shows the only name-setting launch argument, in `append_name_arguments`.
- [x] T002 Baseline both suites with the loop variables removed. Verify: node prints `pass 1045` and `fail 0`, vitest prints `509 passed`.
- [x] T003 Reproduce the stacked name with a three-hop harness run whose third session reports a lagging name. Verify: session 4 launches as `ENGINE LIMITS (2) (4)`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the name and hop-count tests and change the `Phase (7) (2)` test (`T`). Verify: against the original `W`, six of the eight tests fail, among them `'ENGINE LIMITS (2) (4)'`, `'ENGINE LIMITS (2) (2)'`, `'Phase (7) (2)'` and a launch with `SKILLED_LOOP_HOPS=10` that never relaunched.
- [x] T005 Make `name_stem` strip every trailing ` (<digits>)` and drop its sender-number argument (`W`). Verify: `/bin/bash -n W` exits 0.
- [x] T006 Clear `SKILLED_LOOP_HOPS` with the other loop variables at launch (`W`). Verify: the hop-count test passes.
- [x] T007 [P] State the strip rule and the hop reset (`.skilled/hooks/session-handover/runtime-behavior.md`, `.skilled/hooks/session-handover/README.md`). Verify: `rg -n 'every trailing' runtime-behavior.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the wrapper test file (`T`). Verify: prints `pass 68` and `fail 0`.
- [x] T009 Run the node suite (`.skilled/hooks/session-handover/tests/*.test.cjs`). Verify: prints `pass 1051` and `fail 0`.
- [x] T010 Run the hooks vitest config (`.skilled/hooks/vitest.config.ts`). Verify: prints `509 passed`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the reproduced names now carry one number each
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
