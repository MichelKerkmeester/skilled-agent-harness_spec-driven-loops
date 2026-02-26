---
title: "Tasks: Sprint 7 — Long Horizon"
description: "Task breakdown for Sprint 7: memory summaries, content generation, entity linking, full reporting, R5 INT8 evaluation"
trigger_phrases:
  - "sprint 7 tasks"
  - "long horizon tasks"
  - "R5 evaluation tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Sprint 7 — Long Horizon

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

<!-- ANCHOR:implementation -->
## Implementation (all parallelizable)

- [ ] T001 [P] Implement memory summary generation (gated on >5K memories) behind `SPECKIT_MEMORY_SUMMARIES` flag [15-20h] — R8 (REQ-S7-001)
  - Summary generation algorithm
  - Pre-filter integration into search pipeline
  - Gate: skip if <5K memories — document decision
- [ ] T002 [P] Implement smarter memory content generation from markdown [8-12h] — S1 (REQ-S7-002)
  - Improved content extraction heuristics
  - Quality verification via manual review
- [ ] T003 [P] Implement cross-document entity linking [8-12h] — S5 (REQ-S7-003)
  - Entity resolution strategy (coordinates with R10 output from Sprint 6)
  - Cross-document entity matching and link graph
- [ ] T004 [P] Implement R13-S3: full reporting dashboard + ablation study framework [12-16h] — R13-S3 (REQ-S7-004)
  - Full reporting dashboard
  - Ablation study framework (per-channel, per-sprint attribution)
- [ ] T005 Evaluate R5 (INT8 quantization) need [2h] — R5 (REQ-S7-005)
  - Measure: memory count, search latency, embedding dimensions
  - Activation criteria: >10K memories OR >50ms latency OR >1536 dimensions
  - Document decision with rationale
  - If implementing: use custom quantized BLOB (NOT `vec_quantize_i8`)
- [ ] T006 [GATE] Sprint 7 exit gate verification: R8 summary pre-filtering verified (if activated), S1 content quality improved, S5 entity links established, R13-S3 dashboard operational, R5 decision documented, final feature flag sunset audit completed [0h] {T001-T005}
<!-- /ANCHOR:implementation -->

---

<!-- ANCHOR:completion -->
## Program Completion

- [ ] T007 Program completion verification [0h] {T001, T002, T003, T004, T005, T006}
  - [ ] R13-S3 full reporting operational
  - [ ] R13-S3 ablation study framework functional
  - [ ] R8 gating verified (if applicable)
  - [ ] S1 content quality improved (manual review)
  - [ ] S5 entity links established
  - [ ] R5 decision documented
  - [ ] All health dashboard targets reviewed
  - [ ] Final feature flag audit: sunset all sprint-specific flags

---

## Completion Criteria

- [ ] All tasks T001-T007 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Sprint 7 exit gate verification (T006) passed
- [ ] Program completion verification (T007) passed
- [ ] All existing tests still passing
- [ ] Final feature flag audit complete — sprint-specific flags sunset
- [ ] All health dashboard targets reviewed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:pageindex-xrefs -->
## PageIndex Cross-References (from Earlier Sprints)

- [ ] T-PI-S7 Review and integrate PageIndex patterns from earlier sprints [2-4h] — Cross-reference (non-blocking)
  - PI-A5 (Sprint 0): Incorporate verify-fix-verify pattern into long-horizon quality monitoring and R13-S3 reporting loop
  - PI-B1 (Sprint 5): Apply tree thinning approach to R8 summary generation and R13-S3 ablation traversal for large accumulated spec folders
  - Status: Pending
  - Research evidence: See `9 - analysis-pageindex-systems-architecture.md`, `9 - recommendations-pageindex-patterns-for-speckit.md`, `9 - pageindex-tree-search-analysis.md` in the parent research/ folder
<!-- /ANCHOR:pageindex-xrefs -->

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
LEVEL 2 TASKS — Phase 8 of 8 (FINAL)
- 7 tasks: T001-T005 implementation (all parallelizable), T006 exit gate, T007 program completion
- All items independent — no internal dependencies
- R5 decision gate: implement only if activation criteria met
-->
