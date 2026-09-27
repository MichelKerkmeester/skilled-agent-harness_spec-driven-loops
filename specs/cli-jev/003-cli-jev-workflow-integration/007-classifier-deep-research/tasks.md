---
title: "Tasks: Research Phase 3 for Classifier Models, Jev and a Local Deem"
description: "Ordered tasks for the Deem check, the round-3 preparation, the five-lineage fan-out with lead steering, the final synthesis, the reconciliation of the Planned build phases and verification."
trigger_phrases:
  - "jev research round 3 tasks"
  - "five lineage fan-out tasks"
  - "lineage lead review tasks"
  - "deem phase reconciliation tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Research Phase 3 for Classifier Models, Jev and a Local Deem

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

- [x] T001 Scaffold this phase and write its goal (`./`)
- [x] T002 Check online for a Deem CLI and a Mac serving route, and record the result (`implementation-summary.md`)
- [x] T003 Put the Deem install plan with its rollback to the operator, install on the yes (the operator chose the 0.8B in bf16) and measure its health check, latency and memory (`context/deem-local.md`)
- [x] T004 Dispatch an Opus 5.5 high leaf for the spec, plan, tasks, 45 angles, a topic draft and the synthesis brief (`spec.md`, `plan.md`, `tasks.md`, `context/research-angles.md`, `scratch/`)
- [ ] T005 Tighten the topic with the prompt-improver on Sonnet and save it as one clean line (`scratch/research-topic.txt`)
- [ ] T006 [P] Ping all five executors, reading the reply text
- [ ] T007 [P] Dispatch the five lineage leads and record each lead's prompt preview (goal log)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Run the five-lineage fan-out in the background (`research/`)
- [ ] T009 Report each new iteration to its lineage's lead, and confirm each review lands in `steer.md` (`research/lineages/<label>/steer.md`)
- [ ] T010 Let the loaded schedule keep Deem current during the run, since updates land outside the repository. Leave `context/deem-local.md` unedited until the run settles, then re-measure if the served commit changed and append the numbers with that commit
- [ ] T011 Have each lead rerun alone any lineage that ends short of its cap
- [ ] T012 Run the merge and resource-map steps (`research/`)
- [ ] T013 Dispatch a fresh Opus 5.5 max leaf to write the final synthesis (`research/research.md`)
- [ ] T014 Run `step_convergence_report` and record its event
- [ ] T015 Amend 002, 003, 005 and 006 for both backends, one Opus 5.5 high leaf per phase (`../002-*/`, `../003-*/`, `../005-*/`, `../006-*/`)
- [ ] T016 Author each new phase the synthesis proposes as a Planned child, the `cli-classifier` hub and `cli-deem` included, one Opus 5.5 high leaf per phase (`../NNN-*/`)
- [ ] T017 Update the parent binding table and phase map (`../goal.md`, `../spec.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Confirm four lineages hold 10 iteration records and `glm` holds 5, each ending `maxIterationsReached`
- [ ] T019 Confirm each `steer.md` holds one lead review per iteration
- [ ] T020 Reopen five citations and three recommendations from the final synthesis
- [ ] T021 Review containment advisories and `git status` for writes outside the allowed paths
- [ ] T022 Run `validate.sh --strict --recursive` on the parent until it prints `RESULT: PASSED`, and `check-goal.cjs` on every folder
- [ ] T023 Fill `implementation-summary.md`, save continuity and commit on the worktree branch
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
