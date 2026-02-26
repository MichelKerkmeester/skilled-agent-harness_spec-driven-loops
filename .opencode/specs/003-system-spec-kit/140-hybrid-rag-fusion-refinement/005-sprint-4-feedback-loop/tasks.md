---
title: "Tasks: Sprint 4 — Feedback Loop"
description: "Task breakdown for MPAB chunk aggregation, learned relevance feedback, and shadow scoring."
trigger_phrases:
  - "sprint 4 tasks"
  - "feedback loop tasks"
  - "MPAB tasks"
  - "R11 tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Sprint 4 — Feedback Loop

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

<!-- ANCHOR:phase-1 -->
## Phase 1: R1 MPAB Chunk Aggregation

- [ ] T001 [P] Implement MPAB chunk-to-memory aggregation — `computeMPAB(scores)` with N=0/N=1 guards, index-based max removal, `_chunkHits` metadata, behind `SPECKIT_DOCSCORE_AGGREGATION` flag [8-12h] — R1
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: R11 Learned Relevance Feedback

- [ ] T002 Implement learned relevance feedback — schema migration (`learned_triggers` column) + separate column isolation + 7 safeguards (provenance, TTL 30d, denylist 100+, cap 3/8, threshold top-3, shadow 1 week, eligibility 72h) + 0.7x query weight, behind `SPECKIT_LEARN_FROM_SELECTION` flag [16-24h] — R11
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: R13-S2 Shadow Scoring

- [ ] T003 Implement R13-S2 — shadow scoring + channel attribution + ground truth Phase B [15-20h] — R13-S2
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [ ] T004 Verify R1 dark-run: MRR@5 within 2%, N=1 no regression [included] {T001}
- [ ] T005 Analyze R11 shadow log: noise rate <5% [included] {T002}
- [ ] T006 [GATE] Sprint 4 exit gate verification [0h] {T001, T002, T003, T004, T005}
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] R1 MRR@5 within 2% of baseline verified
- [ ] R11 noise rate <5% verified
- [ ] R11 FTS5 contamination test passing
- [ ] R13-S2 A/B infrastructure operational
- [ ] Schema migration completed successfully
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
LEVEL 2 TASKS — Phase 5 of 8
- Sprint 4: Feedback Loop
- 6 tasks across 4 phases
-->
