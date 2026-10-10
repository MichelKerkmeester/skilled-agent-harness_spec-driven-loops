---
title: "Tasks: Phase 14: skill-authoring-ux-research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "skill authoring ux research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 14: skill-authoring-ux-research

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

- [x] T001 Scaffold the packet and add the parent rows (spec.md, ../spec.md, ../goal.md)
- [x] T002 Author goal.md with sk-create-goal (goal.md)
- [x] T003 Write the research config with one cli-pi lineage (research/deep-research-config.json)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run up to ten iterations through fanout-run.cjs (research/lineages/)
- [x] T005 Rerun the load-bearing claims: advisor battery, leaf-manifest check, doctor checks (research/research.md)
- [x] T006 Write the synthesis with root causes, rejected ideas and ranked phases (research/research.md)
- [x] T007 Record failures and fallbacks in the goal log (goal.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Check every [SOURCE:] tag in research.md resolves to an existing line
- [x] T009 Fill implementation-summary.md and run repair-derived.cjs --apply
- [x] T010 Strict-validate the packet and commit in the worktree
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



