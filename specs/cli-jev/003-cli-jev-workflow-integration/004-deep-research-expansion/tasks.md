---
title: "Tasks: Research Phase 2 for the Council-Revised Jev Recommendations"
description: "Ordered tasks for the round-1 re-synthesis, the round-2 preparation, the four-lineage fan-out, the final synthesis and the reconciliation of the Planned build phases."
trigger_phrases:
  - "jev research round 2 tasks"
  - "jev re-synthesis tasks"
  - "four lineage fan-out tasks"
  - "jev phase reconciliation tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Research Phase 2 for the Council-Revised Jev Recommendations

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

- [x] T001 Scaffold this phase and write its spec, plan, tasks and goal (`./`)
- [x] T002 Dispatch a fresh Opus 5.5 xhigh leaf to re-synthesize round 1 from the council review (`../001-deep-research/research/research.md`)
- [x] T003 Reopen three claims the re-synthesis keeps from the council
- [ ] T004 Dispatch an Opus 5.5 high leaf for 20 angles, a draft topic and the synthesis brief (`context/research-angles.md`, `scratch/synthesis-brief.md`)
- [ ] T005 Tighten the topic with the prompt-improver on Sonnet and save it as one clean line (`scratch/research-topic.txt`)
- [ ] T006 Ping all four executors and preview each lineage prompt through `buildLoopPrompt`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Run the four-lineage fan-out in the background (`research/`)
- [ ] T008 Rerun alone any lineage that ends short of 5 iterations
- [ ] T009 Run the merge and resource-map steps (`research/`)
- [ ] T010 Dispatch a fresh Opus 5.5 max leaf to write the final synthesis (`research/research.md`)
- [ ] T011 Run `step_convergence_report` and record its event
- [ ] T012 Reconcile the Planned build phases with the final synthesis, one Opus 5.5 high leaf per phase (`../NNN-*/`)
- [ ] T013 Update the parent binding table and phase map (`../goal.md`, `../spec.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Confirm each lineage state log holds 5 iteration records ending `maxIterationsReached`
- [ ] T015 Reopen five citations and three recommendations from the final synthesis
- [ ] T016 Review containment advisories and `git status` for writes outside the allowed paths
- [ ] T017 Run `validate.sh --strict --recursive` on the parent until it prints `RESULT: PASSED`, and `check-goal.cjs` on every folder
- [ ] T018 Fill `implementation-summary.md`, save continuity and commit on the worktree branch
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

---
