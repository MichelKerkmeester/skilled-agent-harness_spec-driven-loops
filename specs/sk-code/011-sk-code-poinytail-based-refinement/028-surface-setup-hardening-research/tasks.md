---
title: "Tasks: Phase 28: surface-setup-hardening-research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "surface setup hardening research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 28: surface-setup-hardening-research

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

- [x] T001 Read `spec.md`, `goal.md`, the 025 synthesis and `.skilled/repo-rules/prevent-overengineering.md`
- [x] T002 Build a pristine full-tree base copy under the scratchpad's `028/` folder and confirm its control run is green
- [x] T003 Configure `/deep:research` as two lineages, five iterations each, stop policy `max-iterations` (`research/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Run five iterations in lineage `deepseek-max` (`research/lineages/deepseek-max/`)
- [x] T005 [P] Run five iterations in lineage `swe-max` (`research/lineages/swe-max/`)
- [x] T006 Merge the two registries with `fanout-merge.cjs` and emit the resource map
- [x] T007 Check every load-bearing finding against the tree and rerun reported experiments in a throwaway copy
- [x] T008 Write the synthesis `spec.md` REQ-002 to REQ-007 define (`research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run every criterion in `goal.md` and record the output in its log
- [x] T010 Fill `implementation-summary.md`
- [x] T011 Run strict validation on this folder and the epic
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every criterion in `goal.md` passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
