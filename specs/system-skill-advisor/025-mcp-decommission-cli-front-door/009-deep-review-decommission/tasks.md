---
title: "Tasks: Phase 1: deep-review-decommission"
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
# Tasks: Phase 1: deep-review-decommission

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

- [x] T001 Review packet scaffolded with prompts/ and review/ lineage directories
- [x] T002 Deep-loop runtime available; fan-out runner reachable
- [x] T003 Executor bound: cli-pi, deepseek-v4.1-flash, max reasoning
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Target written through the prompt improver so the run hunts claims, not tokens
- [x] T005 First audit run: 6 iterations, CONDITIONAL, 0 P0 / 9 P1 / 8 P2, each finding reproduced
- [x] T006 Confirming audit re-run under the parent's parameters: 5 of 5 iterations, convergence off
- [x] T007 Findings classified live surface versus historical record, so changelogs keep their old names
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Three findings re-verified by hand before any fix was dispatched; all three held
- [x] T009 Pre-existing failures named in the target so they were not reported as regressions
- [x] T010 Both review reports written under `review/lineages/`; the first run archived under `review/_archive/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: findings sampled and reproduced independently
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



