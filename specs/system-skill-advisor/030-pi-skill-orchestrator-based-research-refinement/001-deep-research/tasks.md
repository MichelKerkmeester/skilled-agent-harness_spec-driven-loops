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

- [ ] T004 Launch the two-executor fan-out through `/deep:research:auto` (`research/deep-research-config.json`)
- [ ] T005 [P] Run the `mimo` lineage for 10 iterations (`research/lineages/mimo/`)
- [ ] T006 [P] Run the `swe2max` lineage for 5 iterations (`research/lineages/swe2max/`)
- [ ] T007 Merge both lineages and write the ranked synthesis (`research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Count iteration records in each lineage state log and read each terminal `stopReason` (`research/lineages/*/deep-research-state.jsonl`)
- [ ] T009 Open every citation in the ranked list and record it as resolved or failed (`research/research.md`)
- [ ] T010 Confirm no change outside `research/` came from the run (`git status`)
- [ ] T011 Run `validate.sh --strict` on this phase and the parent, and require `RESULT: PASSED`
- [ ] T012 Update the parent phase map and `implementation-summary.md` with the outcome (`../spec.md`)
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
