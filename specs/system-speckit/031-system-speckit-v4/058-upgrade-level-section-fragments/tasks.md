---
title: "Tasks: Phase 58: Upgrade-level section fragments"
description: "Ordered tasks to make upgrade-level.sh add whole sections and leave a freshly upgraded packet passing strict validation."
trigger_phrases:
  - "upgrade level tasks"
  - "section fragment tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 58: Upgrade-level section fragments

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

- [x] T001 Reproduce the defect on a level 1 packet rendered from the templates
  - Evidence: after an upgrade to level 3, each of spec.md, plan.md and tasks.md has a second `title:` line and extra level markers, spec.md has a stray `| **Level** |` row and no `## EXECUTIVE SUMMARY`, and tasks.md has a doubled divider.
- [x] T002 Baseline the existing shell test (`runtime/cli/tests/test-upgrade-level.sh`)
  - Evidence: 14 passed, 0 failed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Derive each level's additions as whole sections, with one heading key (`runtime/cli/spec/upgrade-level.sh`)
  - Evidence: `filter_markdown_sections` backs `filter_sections_absent_from`, `fragment_section` and `fragment_without_section`; `derive_addendum_fragment` no longer diffs lines. The spec, plan and tasks callers keep a fragment's anchors instead of stripping its leading comments.
- [x] T004 Put a new document's level marker under its H1 (`runtime/cli/spec/upgrade-level.sh`)
  - Evidence: `update_markers` finds the H1 after the frontmatter instead of writing at line 3.
- [x] T005 Stamp a created document with the packet's identity (`runtime/cli/spec/upgrade-level.sh`)
  - Evidence: `stamp_created_doc`, called where the upgrade creates implementation-summary.md and acceptance-criteria.md.
- [x] T006 Add the document-shape test (`runtime/cli/tests/upgrade-level-sections.vitest.ts`)
  - Evidence: upgrades to levels 2 and 3 check titles, markers, headings, anchors, dividers and tables; acceptance-criteria.md and a recreated implementation-summary.md are checked for filled identity.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the upgrade tests
  - Evidence: `bash -n` exit 0; `test-upgrade-level.sh` 14 passed, 0 failed; `upgrade-level-sections.vitest.ts` 3 passed.
- [x] T008 Negative control against the previous script
  - Evidence: all 3 tests fail, first on `spec title lines: expected 2 to be 1`.
- [x] T009 Strict-validate freshly upgraded packets
  - Evidence: a level 1 packet upgraded to 2, and one upgraded to 3, both `RESULT: PASSED`; under the previous script both `RESULT: FAILED` with 2 errors.
- [x] T010 Update documentation
  - Evidence: `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` in this phase.
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
