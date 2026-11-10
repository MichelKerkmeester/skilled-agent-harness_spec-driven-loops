---
title: "Tasks: Release writing defaults: changelog detail, short sentences and release sync without being asked"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "release writing defaults tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Release writing defaults: changelog detail, short sentences and release sync without being asked

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

`C` is `.skilled/skills/sk-doc/sk-create-changelog`. `T` is `.skilled/skills/sk-doc/scripts/tests`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure sentence length in the accepted and rejected v4.0.2.1 texts. Verify: accepted mean 7.8 and max 18, rejected means 11.7 and 11.1.
- [x] T002 Confirm nothing reruns the shape check on old entries. Verify: `rg -l check_changelog_shape .github` prints nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the `checked-section`, `sentence-max` and `sentence-mean` rules (`C/scripts/check_changelog_shape.py`). Verify: the check on `.skilled/changelog/skilled/v4.0.1.0.md` prints all three rule names.
- [x] T004 Exempt `## How It Was Checked` from the test-count rule (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`). Verify: `validate_document.py .skilled/changelog/skilled/v4.0.2.1.md` prints `Total issues: 0`.
- [x] T005 Cover the new rules (`T/test_check_changelog_shape.py`, `T/test_changelog_validator.py`). Verify: pytest on both prints `38 passed`.
- [x] T006 Rewrite the template and the skill contract (`C/assets/changelog-template.md`, `C/SKILL.md`). Verify: `rg -c "How It Was Checked" C/SKILL.md` prints a count above 0.
- [x] T007 Align both workflows, release step 7 included (`.skilled/commands/create/assets/create-changelog-*.yaml`). Verify: `yaml.safe_load` reads both files.
- [x] T008 Update the READMEs and scenario CHG-015 (`C/README.md`, `C/scripts/README.md`, `C/manual-testing-playbook/`). Verify: the CHG-015 command sequence exits 0 then 1.
- [x] T009 Write the component entries and raise the hub version (`C/changelog/v1.5.0.0.md`, `.skilled/skills/sk-doc/changelog/v2.9.8.0.md`). Verify: both print `PASS` from the shape check.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the sk-doc suite. Verify: `run-script-tests.sh` prints 56 `PASS` lines and names one failing file, `test_readme_verdict_parity.py`, whose output is identical before this change.
- [x] T011 Check the hub. Verify: `parent-skill-check.cjs .skilled/skills/sk-doc` ends `all hard invariants passed, 0 warnings`.
- [x] T012 Gate every changed doc. Verify: `validate_document.py` prints `VALID` for each and the HVR scan adds no hard blocker.
- [x] T013 Apply the confirmed findings of a read-only DeepSeek review (`C/scripts/check_changelog_shape.py`, `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `C/SKILL.md`). Verify: six new tests pass, and against HEAD's code the wrap, colon, list-number and closing-hash tests fail.
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



