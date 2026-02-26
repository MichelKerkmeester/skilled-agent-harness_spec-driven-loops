---
title: "Tasks: Sprint 5 — Pipeline Refactor"
description: "Task breakdown for 4-stage pipeline refactor, spec folder pre-filter, query expansion, and spec-kit retrieval metadata."
trigger_phrases:
  - "sprint 5 tasks"
  - "pipeline refactor tasks"
  - "R6 tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Sprint 5 — Pipeline Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] — requirement`

**Dependency Format**: `{T###}` = depends on task T###
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-a -->
## Phase A: R6 Pipeline Refactor

- [ ] T001 Create checkpoint: `memory_checkpoint_create("pre-pipeline-refactor")` [0h]
- [ ] T002 Implement 4-stage pipeline refactor — Stage 1 (Candidate Gen), Stage 2 (Fusion + Signal Integration), Stage 3 (Rerank + Aggregate), Stage 4 (Filter + Annotate — NO score changes), behind `SPECKIT_PIPELINE_V2` flag [40-55h] {T001} — R6
- [ ] T003 Verify R6 dark-run: 0 ordering differences on full eval corpus [included] {T002}
- [ ] T004 Verify all 158+ tests pass with `SPECKIT_PIPELINE_V2` enabled [included] {T002}
<!-- /ANCHOR:phase-a -->

---

<!-- ANCHOR:phase-b -->
## Phase B: Search + Spec-Kit (after Phase A passes)

- [ ] T005 [P] Implement spec folder pre-filter [5-8h] {T004} — R9
- [ ] T006 [P] Implement query expansion with R15 mutual exclusion, behind `SPECKIT_EMBEDDING_EXPANSION` flag [10-15h] {T004} — R12
- [ ] T007 [P] Implement template anchor optimization [5-8h] {T004} — S2
- [ ] T008 [P] Implement validation signals as retrieval metadata [4-6h] {T004} — S3
- [ ] T009a [P] Add memory auto-surface hooks at tool dispatch and session compaction lifecycle points in `hooks/auto-surface.ts` — per-point token budget 4000 max; config/logic change in Spec-Kit integration layer [4-6h] {T004} — TM-05 (REQ-S5-006)
<!-- /ANCHOR:phase-b -->

---

<!-- ANCHOR:phase-c -->
## Phase C: Verification

- [ ] T010 [GATE] Sprint 5 exit gate verification [0h] {T002, T003, T004, T005, T006, T007, T008, T009a}
<!-- /ANCHOR:phase-c -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] R6: 0 ordering differences verified
- [ ] All 158+ existing tests pass with PIPELINE_V2
- [ ] Stage 4 invariant verified: no score modifications
- [ ] R9 cross-folder identical results verified
- [ ] R12+R15 mutual exclusion enforced
- [ ] R12 no simple query latency degradation
- [ ] Intent weights applied ONCE in Stage 2 (G2 prevention)
- [ ] TM-05 auto-surface fires at tool dispatch and session compaction; 4000-token budget enforced
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Parent Plan**: See `../plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 6 of 8
- Sprint 5: Pipeline Refactor
- 9 tasks across 3 phases (A, B, C)
-->
