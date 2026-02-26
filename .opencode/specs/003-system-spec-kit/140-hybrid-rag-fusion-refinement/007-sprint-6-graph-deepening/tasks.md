---
title: "Tasks: Sprint 6 — Graph Deepening"
description: "Task breakdown for Sprint 6: graph centrality, N3-lite consolidation, anchor-aware thinning, entity extraction, spec folder hierarchy"
trigger_phrases:
  - "sprint 6 tasks"
  - "graph deepening tasks"
  - "consolidation tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Sprint 6 — Graph Deepening

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

**Task Format**: `T### [P?] Description [effort] {dependencies} — Requirement`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-a -->
## Phase A: Graph (N2 + N3-lite)

- [ ] T001 Implement graph centrality + community detection — N2 items 4-6 [25-35h] — N2 (REQ-S6-004)
- [ ] T002 Implement N3-lite: contradiction scan + Hebbian strengthening + staleness detection with edge caps [10-15h] — N3-lite (REQ-S6-005)
  - Contradiction scan: similarity >0.85, check conflicting conclusions (~40 LOC)
  - Hebbian strengthening: +0.05 per validation cycle, MAX_STRENGTH_INCREASE=0.05, 30-day decay of 0.1 (~20 LOC)
  - Staleness detection: 90-day unfetched edges (~15 LOC)
  - Edge bounds: MAX_EDGES_PER_NODE=20, auto edges capped at strength=0.5, track `created_by`
<!-- /ANCHOR:phase-a -->

---

<!-- ANCHOR:phase-b -->
## Phase B: Indexing + Spec-Kit (R7, R16, R10, S4)

- [ ] T003 [P] Implement anchor-aware chunk thinning [10-15h] — R7 (REQ-S6-001)
- [ ] T004 [P] Implement encoding-intent capture behind `SPECKIT_ENCODING_INTENT` flag [5-8h] — R16 (REQ-S6-002)
- [ ] T005 [P] Implement auto entity extraction (gated on density <1.0) behind `SPECKIT_AUTO_ENTITIES` flag [12-18h] — R10 (REQ-S6-003)
- [ ] T006 [P] Implement spec folder hierarchy as retrieval structure [6-10h] — S4 (REQ-S6-006)
<!-- /ANCHOR:phase-b -->

---

<!-- ANCHOR:verification -->
## Verification

- [ ] T007 [GATE] Sprint 6 exit gate verification [0h] {T001, T002, T003, T004, T005, T006}
  - [ ] R7 Recall@20 within 10% of baseline
  - [ ] R10 FP rate <20% (if implemented)
  - [ ] N2 graph channel attribution >10%
  - [ ] N3-lite contradiction scan identifies at least 1 known contradiction
  - [ ] N3-lite edge bounds enforced
  - [ ] Active feature flag count <=6
  - [ ] All health dashboard targets checked
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T007 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Sprint 6 exit gate (T007) passed
- [ ] 12-18 new tests added and passing
- [ ] All existing tests still passing
- [ ] Active feature flag count <=6
- [ ] Checkpoint created before sprint start
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
LEVEL 2 TASKS — Phase 7 of 8
- 7 tasks across 3 sections
- Phase A (Graph): T001-T002
- Phase B (Indexing + Spec-Kit): T003-T006 parallelizable
- T007: Sprint exit gate
- Internal phases A and B can run in parallel
-->
