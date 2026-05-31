---
title: "Tasks: Feature Catalog Template Improvements"
description: "Task tracking for the 14 targeted changes across two template files."
trigger_phrases:
  - "feature catalog template tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Feature Catalog Template Improvements

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Snippet Template Rewrite

- [x] T001 Rewrite feature_catalog_snippet_template.md — full structural overhaul to 5 H2 sections with all missing fields added

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Master Template Edits

- [x] T002 Add quick-jump callout after H1 in feature_catalog_template.md
- [x] T003 Convert §2 WHEN TO CREATE from prose bullets to decision table
- [x] T004 Update §4 root catalog scaffold: add trigger_phrases to frontmatter
- [x] T005 Update §5 per-feature scaffold: add trigger_phrases, importance_tier, template marker, H1 with tool name, Related references
- [x] T006 Expand §6 AUTHORING NOTES: add two bullets for trigger_phrases and importance_tier

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Read snippet template back — confirm 5 H2 sections, trigger_phrases, template marker, lowercase filename, checklist
- [x] T008 Read master template back — confirm all 5 changes present
- [x] T009 Run git diff --stat to confirm only 2 files changed

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked [x]
- [x] Snippet template: 5 numbered H2 sections, trigger_phrases in scaffold, template marker, lowercase filename, checklist
- [x] Master template: quick-jump, decision table §2, updated §4 scaffold, updated §5 scaffold, expanded §6 notes

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->
