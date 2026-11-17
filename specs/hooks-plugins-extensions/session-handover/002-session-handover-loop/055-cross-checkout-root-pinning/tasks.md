---
title: "Tasks: Phase 55: cross-checkout-root-pinning"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cross checkout root pinning tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 55: cross-checkout-root-pinning

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

`T` is `.skilled/hooks/session-handover/tests/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm every root-dependent CLI path reads `resolveRepoRoot()` (`.skilled/hooks/session-handover/bin/session-handover.cjs`). Verify: `rg -n 'resolveRepoRoot' .skilled/hooks/session-handover/bin/session-handover.cjs` lists the handoffs check, the goal roots and the spec-folder check.
- [x] T002 Record the suite baselines (`T`). Verify: `node --test T*.test.cjs` prints `pass 1055`, the OpenCode suite `pass 75` and hooks vitest `509 passed`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the two-checkout shim tests (`T/skilled-loop-shell.test.cjs`). Verify: against the unchanged shim they print `fail 4`.
- [x] T004 Carry the earlier checkout into the trusted list and resolve `skilled-loop` through the trust check (`.skilled/bin/skilled-loop-shell.sh`). Verify: `node --test T/skilled-loop-shell.test.cjs` prints `pass 41` and `fail 0`.
- [x] T005 Add the root and outside-root wrapper tests (`T/skilled-loop-wrapper-repo-root.test.cjs`). Verify: against the unchanged wrapper they print `fail 3` and the old `note is missing` warning.
- [x] T006 Report `outside-root` with both roots from consume (`.skilled/hooks/session-handover/bin/session-handover.cjs`). Verify: the consume tests in `T/session-handover-cli.test.cjs` print `fail 0`.
- [x] T007 Pin the root and print the pinned claim command (`.skilled/bin/skilled-loop`). Verify: `node --test T/skilled-loop-wrapper-repo-root.test.cjs` prints `pass 4`.
- [x] T008 Build `CLI_COMMAND` from the absolute CLI path and route both cancel commands through it (`.skilled/hooks/session-handover/lib/nudge.cjs`). Verify: the `CLI command` tests in `T/nudge.test.cjs` failed before and print `fail 0` after.
- [x] T009 Document the startup block, the pinned root and the outside-root state (`.skilled/hooks/session-handover/runtime-behavior.md`). Verify: the documented block sources under bash and zsh and the documented `sed` removes only that block.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rerun the node suite (`T`). Verify: `node --test T*.test.cjs` prints `pass 1065` and `fail 0`.
- [x] T011 Rerun the OpenCode plugin suite and hooks vitest (`.opencode/plugins/tests/session-handover.test.cjs`). Verify: `pass 75` and `509 passed`.
- [x] T012 Shellcheck the wrapper and the shim (`.skilled/bin/`). Verify: the same findings as the unchanged files, 1 info on the wrapper and 3 SC1007 warnings on the shim.
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
