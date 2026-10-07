---
title: "Tasks: Phase 006 — Sub-headings, advisor + code-graph"
description: "Task breakdown for applying H3 sub-headings to long HOW IT WORKS sections in skill-advisor and code-graph."
trigger_phrases:
  - "subheadings advisor codegraph tasks"
  - "advisor section subheadings task list"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Phase 006 — Sub-headings, advisor + code-graph

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

- [ ] T001 Filter the audit CSV to system-skill-advisor and system-code-graph
- [ ] T002 Prepare one agent pass per skill
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add H3 sub-headings to the flagged skill-advisor files
- [ ] T004 Add H3 sub-headings to the flagged code-graph files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Re-run the audit for both skills
- [ ] T006 Confirm zero remaining flagged files
- [ ] T007 Review the diff for `### ` additions only
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
