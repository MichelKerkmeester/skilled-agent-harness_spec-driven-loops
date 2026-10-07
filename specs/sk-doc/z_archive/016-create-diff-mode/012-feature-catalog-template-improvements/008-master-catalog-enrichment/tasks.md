---
title: "Tasks: Phase 008 — Master Catalog Enrichment, All Skills"
description: "Task breakdown for enriching the three master feature catalog files."
trigger_phrases:
  - "master catalog enrichment tasks"
  - "master catalog frontmatter task list"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Phase 008 — Master Catalog Enrichment, All Skills

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

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
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Prepare the `trigger_phrases` and `last_updated` frontmatter additions for the three master catalogs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Edit the skill-advisor master catalog frontmatter
- [ ] T003 Edit the code-graph master catalog frontmatter
- [ ] T004 Edit the spec-kit master catalog frontmatter
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Confirm `trigger_phrases:` is present in all three master catalogs
- [ ] T006 Confirm no uppercase `FEATURE_CATALOG.md` references remain
- [ ] T007 Review `git diff --stat` for frontmatter-only changes
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
