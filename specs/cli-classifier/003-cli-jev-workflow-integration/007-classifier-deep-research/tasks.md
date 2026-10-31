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
- [x] T005 Tighten the topic with the prompt-improver on Sonnet and save it as one clean line (`scratch/research-topic.txt`). Done: `scratch/research-topic.txt`, 805 characters on one line.
- [x] T006 [P] Ping all five executors, reading the reply text. Done: all five executors answered, and GLM's first reply drifted, so it was retried until clean.
- [x] T007 [P] Dispatch the five lineage leads and record each lead's prompt preview (goal log). Done: five Opus 5.5 high leads previewed their lineage prompts, and their pre-launch refinements became `context/research-angles.md` §7.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Run the five-lineage fan-out in the background (`research/`). Done: launched 2026-09-27T06:27:32Z from `506e4e6430`. The runner exited 0 with 5 of 5 lineages fulfilled on the first attempt and no containment advisory (`research/orchestration-summary.json`).
- [x] T009 Report each new iteration to its lineage's lead, and confirm each review lands in `steer.md` (`research/lineages/<label>/steer.md`). Done: every iteration went to its lead, and each `steer.md` holds one review per iteration plus a lineage summary. Iterations read the steering only sometimes (goal log).
- [x] T010 Let the loaded schedule keep Deem current during the run, since updates land outside the repository. Leave `context/deem-local.md` unedited until the run settles, then re-measure if the served commit changed and append the numbers with that commit. Done: no release landed during the run (model `8cbabbb`, source `6755b30`). The later measurements and `deem-ctl` fixes are in `context/deem-local.md`.
- [x] T011 Have each lead rerun alone any lineage that ends short of its cap. Done: no lineage ended short, so there was nothing to rerun. The glm lead judged no glm iteration worth a rerun.
- [x] T012 Run the merge and resource-map steps (`research/`). Done: `fanout-merge.cjs` merged 5 lineages into 57 key findings, and `reduce-state.cjs` wrote `research/resource-map.md` from 45 delta sources.
- [x] T013 Dispatch a fresh Opus 5.5 max leaf to write the final synthesis (`research/research.md`). Done: a fresh Opus 5.5 max leaf wrote `research/research.md` (1,665 lines) from the corrected `scratch/synthesis-brief.md`. It found 2 build-now, 4 next, 18 later and 1 drop, and checked 136 citations: 130 resolved, 2 drifted and 4 failed.
- [x] T014 Run `step_convergence_report` and record its event. Done: recorded `synthesis_incomplete` in `research/deep-research-state.jsonl`, as in rounds 1 and 2 (57 of 173 count-only findings rebuilt), and filled section 18 of `research.md`.
- [x] T015 Amend 002, 003, 005 and 006 for both backends, one Opus 5.5 high leaf per phase (`../002-*/`, `../003-*/`, `../005-*/`, `../006-*/`). Done: one Opus 5.5 high leaf each amended 002, 003, 005 and 006 from `research.md` section 14. Each folder passes strict validation and `check-goal`.
- [x] T016 Author each new phase the synthesis proposes as a Planned child, the `cli-classifier` hub and `cli-deem` included, one Opus 5.5 high leaf per phase (`../NNN-*/`). Done: `008-cli-classifier-hub` and `009-cli-jev-hub-move`, scaffolded by `create.sh` and authored by one Opus 5.5 high leaf each.
- [x] T017 Update the parent binding table and phase map (`../goal.md`, `../spec.md`). Done: binding rows 008 and 009 in `../goal.md` (3,905 durable characters), and phase-map and handoff rows in `../spec.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Confirm four lineages hold 10 iteration records and `glm` holds 5, each ending `maxIterationsReached`. Verified: `grok`, `deepseek`, `mimo` and `swe` hold 10 iteration files each and `glm` holds 5, and each state log ends `synthesis_complete` with `maxIterationsReached`.
- [x] T019 Confirm each `steer.md` holds one lead review per iteration. Verified: each `steer.md` has one `Review of iteration N` heading per iteration and a closing lineage summary.
- [x] T020 Reopen five citations and three recommendations from the final synthesis. Verified: six citations resolve (`deem_server.py:535-545` and `:995-997`, `opencode-goal.js:49`, 002 `spec.md:87`, `dispatch-audit.mjs:46`, `resolve.cjs:36-44`). R1, R19 and R23 hold against the code, and R23 also against a live wire test: Deem answers `jev-cli`-shaped `choice` and `score` with HTTP 400 and `noul` with 200 under `value`.
- [x] T021 Review containment advisories and `git status` for writes outside the allowed paths. Verified: no containment advisory, and `git status` showed changes only inside `007-classifier-deep-research/`.
- [x] T022 Run `validate.sh --strict --recursive` on the parent until it prints `RESULT: PASSED`, and `check-goal.cjs` on every folder. Verified: `RESULT: PASSED` on all 10 folders with 0 errors and 0 warnings, and `check-goal.cjs` 4/4 on the parent and every child.
- [x] T023 Fill `implementation-summary.md`, save continuity and commit on the worktree branch. Done: summary filled, continuity saved with `generate-context.js`, and the packet committed path-scoped on the worktree branch. Nothing pushed.
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
