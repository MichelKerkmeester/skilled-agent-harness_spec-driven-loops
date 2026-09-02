---
title: "Tasks: Phase 5: ripgrep-retrieval-research"
description: "The five research iterations, the synthesis and the fold-in into phases 001 and 004, with evidence paths."
trigger_phrases:
  - "research tasks"
  - "iteration evidence"
  - "synthesis fold-in"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: ripgrep-retrieval-research

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

- [x] T001 Write the operator topic, executor pin and stop policy (`research/deep-research-config.json`)
- [x] T002 Open the detached lineage and its state ledger (`research/lineages/luna-max/deep-research-state.jsonl`)
- [x] T003 Retire run 1, which nested `codex exec` inside its own sandbox, and pin in-process execution in the topic (`scratch/failed-run-1-nested-codex-dispatch`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Iteration 1: confirm the `exactTriggerSearch` baseline and the index shape it has to match (`research/lineages/luna-max/iterations/iteration-001.md`)
- [x] T005 Iteration 2: ripgrep flags, exclusions and exit mapping for the three retrieval shapes (`research/lineages/luna-max/iterations/iteration-002.md`)
- [x] T006 Iteration 3: corpus conventions that make grep precise and the capability boundary (`research/lineages/luna-max/iterations/iteration-003.md`)
- [x] T007 Iteration 4: parity harness, frozen prompt set and latency protocol (`research/lineages/luna-max/iterations/iteration-004.md`)
- [x] T008 Iteration 5: failure modes, eliminated alternatives and acceptance gates (`research/lineages/luna-max/iterations/iteration-005.md`)
- [x] T009 Reduce the five deltas into the synthesis and the ranked amendment brief (`research/lineages/luna-max/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirm five iteration files, five deltas and the receipts are on disk (`research/lineages/luna-max/events/synthesis-committed.json`)
- [x] T011 Confirm the stop reason is `maxIterationsReached` and the ratios ran 0.92 to 0.68 (`research/lineages/luna-max/research.md` section 17)
- [x] T012 Confirm sections 11 and 12 cite a file and a line for every ranked amendment (`research/lineages/luna-max/research.md`)
- [ ] T013 In progress, owned by other agents: fold the amendments into phases 001 and 004 so their spec, plan, tasks and acceptance docs cite this research where they changed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The research itself is complete: five iterations and one synthesis, all on disk
- [x] No `[B]` blocked tasks remaining
- [ ] T013 closes when both build phases cite this research
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Synthesis**: See `research/lineages/luna-max/research.md`
<!-- /ANCHOR:cross-refs -->

---
