---
title: "Tasks: Phase 007 — Related References, All Skills"
description: "Task breakdown for adding prev/next related-reference links to the catalog snippets."
trigger_phrases:
  - "related references tasks"
  - "snippet neighbor links task list"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Phase 007 — Related References, All Skills

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

- [ ] T001 Author `add_related_references.py` per the plan script specification
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Dry-run the script and review the output
- [ ] T003 Execute the script across the three skill roots
- [ ] T004 Skip singleton categories and files that already carry related references
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Run the missing-references check
- [ ] T006 Review `git diff --stat` for scope
- [ ] T007 Commit the related-reference additions
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
