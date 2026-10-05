---
title: "Implementation Plan: Changelog Section Spacing"
description: "Rewrite the separator rule in the changelog standard and its two workflows, then respace the v4 Skilled entries and their published release notes."
trigger_phrases:
  - "changelog spacing plan"
  - "respace skilled releases"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Changelog Section Spacing

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and YAML |
| **Framework** | sk-doc changelog workflow |
| **Storage** | None |
| **Testing** | sk-doc validators and a content-identity diff |

### Overview
The separator rule lives in four places: the template, `SKILL.md`, the worked examples and the two YAML workflows. Each gets the same new wording. The v4 Skilled entries and their live release notes are then respaced by a script that drops `---` and `&nbsp;` lines outside code fences and puts one `&nbsp;` before every H2.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation standard plus the workflows that apply it

### Key Components
- **Changelog standard**: the template and `SKILL.md`, which define the entry layout
- **Workflows**: the `:auto` and `:confirm` YAMLs, which check the layout and assemble release notes

### Data Flow
An entry is written from the template, checked by the workflow, then stripped of frontmatter and title and published as the release body with the full-changelog pointer appended.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The sk-doc validators on every edited file, a YAML parse of both workflows and a comparison of every non-spacing line before and after the respace.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`gh` authenticated for the Skilled repository, to edit the three release bodies.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit for the files. For the live releases, run `gh release edit <tag> --notes-file scratch/release-bodies-before/<tag>.md` for each of the three tags.
<!-- /ANCHOR:rollback -->

---

