---
title: "Implementation Plan: Phase 5: post-alignment-doc-fixes"
description: "Two documentation edits found by the alignment review: the skills index counts and the v4.2.0.0 release-note coverage of the removal."
trigger_phrases:
  - "cli orca post alignment doc fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: post-alignment-doc-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and plain text |
| **Framework** | sk-create-changelog for the release notes |
| **Storage** | None |
| **Testing** | `validate_document.py`, `ls` counts |

### Overview
Correct one table cell in the skills index, then add the removal to the open release notes in the shape the Hermes removal used: a summary line, a breaking-change entry, overview rows and a section.
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
- [x] `validate_document.py` on `v4.2.0.0.md` prints `Total issues: 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation only.

### Key Components
- **Skills index**: `.skilled/skills/README.txt`, the catalog front door.
- **Root release notes**: `.skilled/changelog/skilled/v4.2.0.0.md`, open until v4.2.0.0 ships.

### Data Flow
None.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The changelog validator on the release notes, and a recount of the skill folders against the index line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The alignment report at `~/.local/state/local-skilled-alignment/536-provision-dev-dependencies/20261124T123940Z/report.md`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert` the commit.
<!-- /ANCHOR:rollback -->

---
