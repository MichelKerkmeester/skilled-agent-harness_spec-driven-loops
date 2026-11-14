---
title: "Tasks: Remove the file-total line ceiling from release notes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "remove release size limit tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Remove the file-total line ceiling from release notes

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

- [x] T001 Record the shape-test baseline (`.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py`). Verify: `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py` prints `20 passed`. [EVIDENCE: `20 passed`]
- [x] T002 Record the sk-doc suite baseline (`.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh`). Verify: `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `1 failing: test_validation_switch.py`. [EVIDENCE: `1 failing: test_validation_switch.py` on origin/main before any edit]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove the `file-total` rule and its constant (`.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py`). Verify: `rg -c "EXPANDED_MAX_BODY_LINES|file-total" .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` prints nothing. [EVIDENCE: no match]
- [x] T004 Replace the 280-line test with a 1,000-line pass test (`.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py`). Verify: the new test fails against the previous checker and passes against the new one. [EVIDENCE: `OLD: failed as expected`, then `20 passed`]
- [x] T005 Drop both file-total rows and name the absence of a line ceiling (`.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md`). Verify: `rg -c "file total" .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` prints nothing. [EVIDENCE: no match]
- [x] T006 Drop the 240-line target from both workflow files (`.skilled/commands/create/assets/create-changelog-auto.yaml`). Verify: `rg -c "240 lines" .skilled/commands/create/assets` prints nothing and both files parse with `yaml.safe_load`. [EVIDENCE: no match, `YAML OK` twice]
- [x] T007 Raise the versions and write the two release notes (`.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.5.1.0.md`). Verify: `check_changelog_shape.py` prints `SUMMARY files=2 pass=2 fail=0` on both notes. [EVIDENCE: `SUMMARY files=2 pass=2 fail=0`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the 281-line entry through the checker (`.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py`). Verify: it prints `PASS` and exits 0, where the previous checker printed `[file-total] 281 lines` and exited 1. [EVIDENCE: before `FAIL`, exit 1. After `PASS`, exit 0]
- [x] T009 Rerun the sk-doc suite (`.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh`). Verify: it prints `1 failing: test_validation_switch.py`, the baseline. [EVIDENCE: the same single failure]
- [x] T010 Validate the changed documents and the hub (`.skilled/skills/sk-doc/SKILL.md`). Verify: `validate_document.py` prints `Total issues: 0` on the six changed docs, and `parent-skill-check.cjs .skilled/skills/sk-doc` prints `all hard invariants passed`. [EVIDENCE: six `VALID`, hub check passed with 0 warnings]
- [x] T011 Align the workflow ceiling line with the checker and test it (`.skilled/commands/create/assets/create-changelog-auto.yaml`). Verify: `test_the_workflow_ceilings_match_the_checker` fails on the old 26 and 12 and passes on 32 and 14, and the shape tests print `21 passed`. [EVIDENCE: `1 failed` on the old files, `21 passed` after]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the 281-line entry passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



