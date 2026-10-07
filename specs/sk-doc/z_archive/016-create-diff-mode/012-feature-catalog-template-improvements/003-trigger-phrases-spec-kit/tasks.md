---
title: "Tasks: Phase 003 — Trigger Phrases, system-spec-kit"
description: "Task breakdown for adding trigger_phrases to the system-spec-kit catalog snippets."
trigger_phrases:
  - "trigger phrases spec kit tasks"
  - "catalog trigger phrases task list"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Phase 003 — Trigger Phrases, system-spec-kit

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

- [ ] T001 Prepare the category order from the plan pass list
- [ ] T002 Collect the root catalog H3 headings per category as the canonical name input
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Process the small-category validation pass
- [ ] T004 Process the medium category passes
- [ ] T005 Process the large category passes
- [ ] T006 Split the largest category into sub-batches
- [ ] T007 Write or improve `trigger_phrases` in each snippet frontmatter only
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the per-category missing `trigger_phrases` greps
- [ ] T009 Run the total gap check across all categories
- [ ] T010 Run the minimum phrase count check
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
