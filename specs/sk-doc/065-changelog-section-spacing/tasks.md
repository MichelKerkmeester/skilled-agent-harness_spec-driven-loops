---
title: "Tasks: Changelog Section Spacing"
description: "Tasks for the changelog section spacing change and the respace of the v4 Skilled releases."
trigger_phrases:
  - "changelog spacing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Changelog Section Spacing

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Find every statement of the separator rule (template, `SKILL.md`, worked examples, both YAMLs)
- [x] T002 Save the three live v4 release bodies to `scratch/release-bodies-before/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite the template's example blocks, separator guideline and release-notes section (`assets/changelog-template.md`)
- [x] T004 Rewrite `SKILL.md` section 8 rule 4, the release-notes block and the section 9 checks, version 1.3.3.0 (`SKILL.md`)
- [x] T005 Respace both worked examples and update the annotations (`references/worked-examples.md`)
- [x] T006 Update the format check and release-notes assembly in both workflows (`create-changelog-auto.yaml`, `create-changelog-confirm.yaml`)
- [x] T007 Write the v1.3.3.0 entry in the new spacing (`changelog/v1.3.3.0.md`)
- [x] T008 Respace the four v4 Skilled entries (`.skilled/changelog/skilled/v4.0.0.*.md`)
- [x] T009 Publish the respaced notes to the three v4 releases, with the full-changelog pointer on all three
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Prove only spacing changed: non-spacing lines identical before and after for all four files and three bodies
- [x] T011 Run `validate_document.py`, `hvr_scan.py`, the playbook validator and `validate_skill_package --strict`, and parse both YAMLs
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



