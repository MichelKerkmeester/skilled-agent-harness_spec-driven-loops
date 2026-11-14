---
title: "Implementation Plan: Remove the file-total line ceiling from release notes"
description: "Remove the file-total rule from the changelog shape check and every doc line that states a release-note line ceiling."
trigger_phrases:
  - "remove release size limit plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Remove the file-total line ceiling from release notes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3, Markdown, YAML |
| **Framework** | None |
| **Storage** | None |
| **Testing** | pytest |

### Overview
Delete the `file-total` branch and its constant from `check_changelog_shape.py`. Remove the line-ceiling statements from the template, the mode docs and the two workflow files. Prove it with a 281-line entry that failed before and passes now, and a test at 1,000 lines.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py` prints `20 passed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single rule removal.

### Key Components
- **`check_changelog_shape.py`**: the gate that loses its `file-total` rule.
- **`changelog-template.md`**: the length table the gate's constants are tested against.

### Data Flow
`/create:changelog` drafts an entry, the shape check reads it and prints `PASS` or one line per broken rule.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the shape tests and the sk-doc suite for a baseline. Implementation removes the rule, its test and every line-ceiling statement. Verification reruns both, checks the 281-line entry and greps for leftover ceilings. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`test_an_expanded_entry_has_no_line_ceiling` builds a 1,000-line expanded entry and expects no violation. Run against the previous checker, it fails, so it guards the change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. No package is added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the operator wants the ceiling back. Revert the one commit with `git revert`.
<!-- /ANCHOR:rollback -->

---
