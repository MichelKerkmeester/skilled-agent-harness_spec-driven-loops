---
title: "Tasks: Phase 25: external-surface-priority-research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "external surface priority research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 25: external-surface-priority-research

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

- [x] T001 Read `spec.md`, `goal.md`, the v4.0.0.4 release note and `.skilled/repo-rules/prevent-overengineering.md`
- [x] T002 Configure `/deep:research` as two lineages with the questions from `spec.md` section 2, 10 iterations each, stop policy `max-iterations` (`research/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run all 10 iterations in lineage A, `cli-devin` (`research/lineages/`)
- [x] T004 Run all 10 iterations in lineage B, `cli-codex` (`research/lineages/`)
- [x] T005 Spot-check every cited path:line, rerun every quoted command and rerun the delete experiment
- [x] T006 Write the merged synthesis that `spec.md` REQ-002 to REQ-005 and REQ-008 define (`research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run every criterion in `goal.md` and record the output in its log
- [x] T008 Fill `implementation-summary.md`
- [x] T009 Run strict validation on this folder and the epic
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Round two

- [x] T010 Create the round-two worktree from origin/main and a pristine full-tree base copy outside it (only the compiled-routing closure kept under `specs/`)
- [x] T011 [P] Run 10 iterations in lineage C, `cli-devin` with `swe-2-max` (`research/lineages/swe2max-devin/`)
- [x] T012 [P] Run 10 iterations in lineage D, `cli-codex` `gpt-6-luna` max fast for 1 to 4, then `cli-pi` `openai/gpt-6-luna` xhigh with fast mode for 5 to 10 (`research/lineages/luna-max-fast-r2/`)
- [x] T013 Run the orchestrator's own add-surface copy run (F18 and R1)
- [x] T014 Run `fanout-merge.cjs` over all four lineages and regenerate the fan-out resource map
- [x] T015 Merged synthesis of both rounds, written by the orchestrator's synthesis and verification passes (`research/research.md`)
<!-- /ANCHOR:phase-4 -->

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
