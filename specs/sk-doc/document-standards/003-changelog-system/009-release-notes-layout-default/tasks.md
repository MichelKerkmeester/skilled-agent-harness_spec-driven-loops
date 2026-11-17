---
title: "Tasks: Phase 9: release-notes-layout-default"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "release notes layout default tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: release-notes-layout-default

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the model entry and every changelog with the phase 8 checker (`check_changelog_shape.py`). Verify: v4.0.2.1 prints two `[spec-position]` lines and a skipped glance-order note.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Read the glance table, the folded spec list and skip HTML lines (`.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py`). Verify: v4.0.2.1 prints `PASS` with no note.
- [x] T003 Test the three checker changes (`.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py`). Verify: the new tests fail on the phase 8 checker and pass on this one.
- [x] T004 Rewrite the template for the new layout (`.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md`). Verify: `hvr_scan.py` reports 0 hard blockers.
- [x] T005 Update the contract, rules and validation lists (`.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`). Verify: `validate_document.py` reports 0 issues.
- [x] T006 Update both workflows (`create-changelog-auto.yaml`, `create-changelog-confirm.yaml`). Verify: both parse as YAML.
- [x] T007 Update the skill README, scripts README and playbook scenario (`README.md`, `scripts/README.md`, `check-expanded-shape.md`). Verify: the playbook's `sed` copy fails with `[glance-order]`.
- [ ] T008 Rewrite the worked examples in the new layout (`references/worked-examples.md`). Verify: each example passes the shape check.
- [ ] T009 Move the spec-folder line to the end of the five entries with content after it. Verify: the checker prints no `content follows` line.
- [ ] T010 Insert the missing `&nbsp;` line before the spec-folder line, in its own commit. Verify: the checker prints no `[spec-position]` line over every entry.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the changelog tests (`.skilled/skills/sk-doc/scripts/tests/`). Verify: pytest reports 47 passed and no failure.
- [ ] T012 Validate the packet (`009-release-notes-layout-default/`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
