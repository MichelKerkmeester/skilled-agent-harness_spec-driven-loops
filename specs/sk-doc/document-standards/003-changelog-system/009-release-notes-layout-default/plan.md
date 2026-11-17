---
title: "Implementation Plan: Release-Notes Layout Default"
description: "Rewrites the changelog template and contract around the v4.0.2.1 layout, teaches the shape check that layout and moves old spec-folder lines into place."
trigger_phrases:
  - "release notes layout default plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Release-Notes Layout Default

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 and Markdown/YAML docs |
| **Framework** | None |
| **Storage** | None |
| **Testing** | pytest |

### Overview
The template, SKILL.md and both workflows change to the v4.0.2.1 layout. The shape check learns the glance table and the folded spec-folder list, so the model entry passes unedited. The changelog tests and a checker run over every entry prove it.
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
- [x] `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/ -k changelog` passes with no failure
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: rule changes inside a single-file checker, plus document edits

### Key Components
- **`read_shape`**: reads the glance table's Section column as well as tagged bullets
- **`check_spec_position`**: lets the tag lines of a closing details block sit around the spec-folder line
- **`NOT_PROSE`**: leaves HTML tag lines out of the sentence count

### Data Flow
`check_entry` reads the entry, `read_shape` records glance rows and spec lines outside code fences, and each rule reads what it needs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup measures the model entry and every changelog with the phase 8 checker. Implementation changes the checker and tests, then the template, SKILL.md, workflows and docs, then the old entries. Verification reruns the tests and the checker. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md` prints `PASS` with no note. Each new test fails on the phase 8 checker and passes on this one.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the checker fails an entry the template allows, or the bulk edit changes more than the spec-folder lines. Revert the matching commit. The bulk edit sits in its own commit.
<!-- /ANCHOR:rollback -->

---
