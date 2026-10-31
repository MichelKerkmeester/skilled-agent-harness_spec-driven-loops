---
title: "Tasks: Research Phase for Pi Skill Orchestrator Against System Skill Advisor"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi skill orchestrator research tasks"
  - "fan-out research verification"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Research Phase for Pi Skill Orchestrator Against System Skill Advisor

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

- [x] T001 Convert the packet folder into a phase parent with this research child (`../spec.md`). Evidence: `create.sh --phase --phases 1` scaffolded the parent and `001-deep-research/`
- [x] T002 Write the research brief with the reading list, RQ1 to RQ7 and the answer shape (`spec.md`)
- [x] T003 Check both executors before launch (`plan.md`). Evidence: `devin auth status` printed `Logged in (via Devin)`, and a MiMo ping through `pi -p --offline` replied `OK`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Launch the two-executor fan-out through `/deep:research:auto` (`research/deep-research-config.json`). Evidence: `research/orchestration-summary.json` records run `1790404524761-xsg1vq`, 2 CLI lineages, 2 succeeded, 0 failed.
- [x] T005 [P] Run the `mimo` lineage for 10 iterations (`research/lineages/mimo/`). Evidence: 10 iteration records in `research/lineages/mimo/deep-research-state.jsonl`, terminal `stopReason` `maxIterationsReached`.
- [x] T006 [P] Run the `swe2max` lineage for 5 iterations (`research/lineages/swe2max/`). Evidence: 5 iteration records in `research/lineages/swe2max/deep-research-state.jsonl`, terminal `stopReason` `maxIterationsReached`.
- [x] T007 Merge both lineages and write the ranked synthesis (`research/research.md`). Evidence: the merged registry holds 50 key findings; `research/research.md` answers RQ1 to RQ7 and ranks R1 to R12, synthesized by Opus 5.5 at max effort.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Count iteration records in each lineage state log and read each terminal `stopReason` (`research/lineages/*/deep-research-state.jsonl`). Evidence: 10 and 5 iteration records, both `maxIterationsReached`. The orchestration summary flags timestamp anomalies in 11 of 11 MiMo records and 2 of 7 SWE-2 MAX records, so no timestamp is used as evidence.
- [x] T009 Open every citation in the ranked list and record it as resolved or failed (`research/research.md`). Evidence: section 14 of `research/research.md`, 576 ranges checked, 548 resolved, 20 drifted, 8 failed, 0 not checked.
- [x] T010 Confirm no change outside `research/` came from the run (`git status`). Evidence: the research commit `5eb9a33763` holds only packet files plus the derived track index `specs/system-skill-advisor/graph-metadata.json`. The two containment advisories name `write-containment.ts` and `specs/sk-doc/059-skill-changelog-retrofit/description.json`, both already modified before the run began.
- [x] T011 Run `validate.sh --strict` on this phase and the parent, and require `RESULT: PASSED`. Evidence: strict recursive validation of the parent passes in all five folders.
- [x] T012 Update the parent phase map and `implementation-summary.md` with the outcome (`../spec.md`). Evidence: the parent map lists phases 2 to 4 as the adopted recommendations, and `implementation-summary.md` records the outcome.
- [x] T013 Run the workflow close: the convergence report, the generated findings block in `spec.md`, config status `complete` and the continuity save (`.skilled/commands/deep/assets/deep-research-auto.yaml`). Evidence: the fan-out dashboard fix below unblocked `step_convergence_report`, which recorded `synthesis_complete` through the append gateway (ledger sequence 1, 15 iterations, 7 of 7 questions). Section 17 of `research/research.md` holds the report. The findings fence sits under the `questions` anchor of `spec.md`, recorded as `spec_mutation` (ledger sequence 2), and targeted validation printed `RESULT: PASSED`. The config reads `complete`
- [x] T014 Require the root dashboard only for runs without lineage logs, in both research workflows (`.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`). Evidence: two new cases in `run-now-yaml-control.vitest.ts`; the nine test files that read these workflows pass 146 of 146; reverting the auto workflow fails the fan-out case; `check-contract-drift.cjs` prints `OK commands=3` after the compiled contract was regenerated
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
