---
title: "Tasks: Phase 18: json-entry removeItems"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "json entry remove items tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 18: json-entry removeItems

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

`E` is `.skilled/commands/doctor/scripts/overlay-engine.cjs`. `T` is `.skilled/commands/doctor/scripts/tests/overlay-engine-remove-items.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Work on the sk-git worktree (`worktrees/544-upstream-overlay-mechanisms`). Verify: `git branch --show-current` prints that branch.
- [x] T002 Run the gates before any change (`/tmp/upstream-544/gates-before/summary.txt`). Verify: the engine suite passes 548 with 0 failing and the overlay guard 21 of 21.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the layout, idempotence, missing-name, dropped-op and refusal tests (`T`). Verify: on the unchanged `E`, all 23 fail on `unknown operation "removeItems"`.
- [x] T004 Add `removeItems` to the json-entry planner that apply, status and audit share (`E`). Verify: `T` and the whole engine suite exit 0.
- [x] T005 Document the operation with the other json-entry operations and in the sync-state lifecycle paragraph (`references/overlays.md`). Verify: `rg -n 'removeItems' .skilled/skills/system-skilled-doctor/references/overlays.md` prints the lines.
- [x] T006 Name the operation in the presentation asset (`doctor-overlay-presentation.txt`). Verify: `rg -n 'removeItems' .skilled/commands/doctor/assets/doctor-overlay-presentation.txt` prints a line.
- [x] T007 Add playbook scenario SKD-014, its index row and its leaf record (`removed-items-leave-the-file.md`). Verify: `rg -n 'SKD-014' .skilled/skills/system-skilled-doctor/manual-testing-playbook/manual-testing-playbook.md` prints a line and `leaf-manifest.json` names the file.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `@review` over the branch and fix its findings (`E`, `T`). Verify: the verdict is APPROVED with no P0 or P1, and the four P2 fixes land in `7ce755013bb` and `bf022a67b20`.
- [x] T009 Rerun the engine and overlay guard gates on the final branch (`E`). Verify: the engine suite passes 573 with 0 failing and the overlay guard 21 of 21.
- [x] T010 Validate this folder (`018-json-entry-remove-items/`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The review verdict is recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
