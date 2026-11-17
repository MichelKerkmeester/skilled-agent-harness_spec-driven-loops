---
title: "Tasks: Phase 8: spec-line-position-gates"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "spec line position gates tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: spec-line-position-gates

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

- [x] T001 Read the checker, its tests and the three checklists (`check_changelog_shape.py`). Verify: the measured probe in `spec.md` prints `PASS` and exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T002 Add the `spec-position` rule (`.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py`). Verify: the measured probe prints a `[spec-position]` line and exits 1.
- [x] T003 Move the fixture's spec line to the end and test the rule (`.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py`). Verify: the new tests fail on the old checker and pass on the new one.
- [x] T004 Name the position in validation item 4 and the shape-gate item (`.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`). Verify: `rg -n "closes the entry" SKILL.md` prints the item 4 line.
- [x] T005 Name the position in both workflows' format checks (`create-changelog-auto.yaml`, `create-changelog-confirm.yaml`). Verify: `rg -n "closing the entry"` prints one line in each file.
- [x] T006 List the rule in the scripts README and correct `PUBLIC-RELEASE.md` (`scripts/README.md`, `PUBLIC-RELEASE.md`). Verify: `rg -n "ends with upgrade notes" PUBLIC-RELEASE.md` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T007 Run the shape-check and changelog-validator tests (`.skilled/skills/sk-doc/scripts/tests/`). Verify: pytest reports one failure, `test_the_model_entry_passes_every_rule`, the same one it reported before this phase.
- [ ] T008 Validate the packet (`008-spec-line-position-gates/`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



