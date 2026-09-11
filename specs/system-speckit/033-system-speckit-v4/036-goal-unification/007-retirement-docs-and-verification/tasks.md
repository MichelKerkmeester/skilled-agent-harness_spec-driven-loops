---
title: "Tasks: Retirement, docs and verification"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Retirement, docs and verification

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

- [x] T001 Read ADR-2; write the rollback sentence and ask before deleting
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Retire or demote the store; write the migration note (.opencode/skills/.state/goal/)
- [x] T003 Rewrite README.md and goal-plugin.md via sk-create-readme (.opencode/hooks/goal/)
- [x] T004 Update SKILL.md, hook-system.md, feature catalog via sk-create-skill
- [x] T005 Changelog entry and MEMORY.md policy note
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 validate.sh --strict recursive on 036
- [x] T007 node --test goal suites, plugin tests, verify_alignment_drift.py, hygiene gate
- [x] T008 /deep:review over touched surfaces
- [x] T009 Reconcile all implementation-summary.md and the parent goal log
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification tasks passed with recorded output
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



