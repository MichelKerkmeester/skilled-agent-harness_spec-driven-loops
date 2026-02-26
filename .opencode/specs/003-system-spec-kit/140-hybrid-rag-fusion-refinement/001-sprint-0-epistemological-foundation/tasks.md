---
title: "Tasks: Sprint 0 — Epistemological Foundation"
description: "Task breakdown for Sprint 0: graph ID fix, chunk collapse, eval infrastructure, BM25 baseline"
trigger_phrases:
  - "sprint 0 tasks"
  - "epistemological foundation tasks"
  - "eval infrastructure tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Sprint 0 — Epistemological Foundation

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
| `[GATE]` | Sprint exit gate |

**Task Format**: `T### [P?] Description (file path) [effort] {dependencies} — Requirement`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Bug Fixes (Track 1)

- [ ] T001 [P] Fix graph channel ID format — convert `mem:${edgeId}` to numeric memory IDs at BOTH locations (`graph-search-fn.ts` lines 110 AND 151) [3-5h] — G1 (REQ-S0-001)
- [ ] T002 [P] Fix chunk collapse conditional — dedup on ALL code paths including `includeContent=false` (`memory-search.ts`) [2-4h] — G3 (REQ-S0-002)
- [ ] T003 [P] Add fan-effect divisor to co-activation scoring (`co-activation.ts`) [1-2h] — R17 (REQ-S0-005)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Eval Infrastructure (Track 2)

- [ ] T004 Create `speckit-eval.db` with 5-table schema: `eval_queries`, `eval_relevance`, `eval_results`, `eval_metrics`, `eval_runs` [8-10h] — R13-S1 (REQ-S0-003)
- [ ] T005 Add logging hooks to search, context, and trigger handlers [6-8h] {T004} — R13-S1 (REQ-S0-003)
- [ ] T006 Implement core metric computation: MRR@5, NDCG@10, Recall@20, Hit Rate@1 [4-6h] {T004} — R13-S1 (REQ-S0-003)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Baseline

- [ ] T007 Generate synthetic ground truth from trigger phrases — minimum 50 query-relevance pairs [2-4h] {T004} — G-NEW-1 / G-NEW-3 (REQ-S0-004)
- [ ] T008 Run BM25-only baseline measurement and record MRR@5 [4-6h] {T006, T007} — G-NEW-1 (REQ-S0-004)
<!-- /ANCHOR:phase-3 -->

---

## Phase 4: Verification

- [ ] T009 [GATE] Sprint 0 exit gate verification [0h] {T001, T002, T003, T004, T005, T006, T007, T008}
  - [ ] Graph hit rate > 0%
  - [ ] No duplicate chunk rows in default search
  - [ ] Baseline metrics for 50+ queries computed and stored
  - [ ] BM25 baseline MRR@5 recorded
  - [ ] BM25 contingency decision made and documented

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T009 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Sprint 0 exit gate (T009) passed
- [ ] 8-12 new tests added and passing
- [ ] 158+ existing tests still passing
- [ ] BM25 contingency decision recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../tasks.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 1 of 8
- 9 tasks across 4 phases
- Track 1 (Bug Fixes): T001-T003 parallelizable
- Track 2 (Eval): T004-T008 sequential
- T009: Sprint exit gate
-->
