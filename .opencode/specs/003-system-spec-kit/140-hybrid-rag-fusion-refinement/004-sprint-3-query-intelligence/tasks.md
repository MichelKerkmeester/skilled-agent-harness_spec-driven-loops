---
title: "Tasks: Sprint 3 — Query Intelligence"
description: "Task breakdown for query complexity routing, RSF evaluation, and channel min-representation."
trigger_phrases:
  - "sprint 3 tasks"
  - "query intelligence tasks"
  - "complexity router tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Sprint 3 — Query Intelligence

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
## Phase 1: R15 Query Complexity Router

- [ ] T001 [P] Implement query complexity router — 3-tier classifier (simple/moderate/complex) + tier-to-channel-subset routing (min 2 channels) behind `SPECKIT_COMPLEXITY_ROUTER` flag [10-16h] — R15
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: R14/N1 Relative Score Fusion

- [ ] T002 [P] Implement Relative Score Fusion — all 3 variants (single-pair, multi-list, cross-variant) in shadow mode behind `SPECKIT_RSF_FUSION` flag [10-14h] — R14/N1
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: R2 Channel Min-Representation

- [ ] T003 Implement channel min-representation constraint — post-fusion enforcement, quality floor 0.2, only when channel returned results, behind `SPECKIT_CHANNEL_MIN_REP` flag [6-10h] {T001} — R2
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-3b -->
## Phase 3b: Query Optimization

- [ ] T006 Implement confidence-based result truncation — adaptive top-K cutoff based on score confidence gap between consecutive results [5-8h] {T001} — R15 extension
  - Score gap threshold: if gap between rank N and N+1 exceeds 2x median gap, truncate at N
  - Must respect minimum result count (3) regardless of confidence
- [ ] T007 [P] Implement dynamic token budget allocation — adjust returned context size by query complexity tier [3-5h] {T001} — R15 extension (FUT-7)
  - Simple: 1500 tokens | Moderate: 2500 tokens | Complex: 4000 tokens
  - Budget applies to total returned content, not per-result
<!-- /ANCHOR:phase-3b -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Shadow Comparison + Verification

- [ ] T004 Run shadow comparison: RSF vs RRF on 100+ queries, compute Kendall tau [included] {T002}
- [ ] T005 [GATE] Sprint 3 exit gate + off-ramp evaluation [0h] {T001, T002, T003, T004, T006, T007}
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T007 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] R15 p95 <30ms for simple queries verified
- [ ] RSF Kendall tau computed (tau <0.4 = reject RSF)
- [ ] R2 top-3 precision within 5% of baseline verified
- [ ] Off-ramp evaluated: MRR@5 >= 0.7, constitutional >= 95%, cold-start >= 90%
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
LEVEL 2 TASKS — Phase 4 of 8
- Sprint 3: Query Intelligence
- 7 tasks across 5 phases (including Phase 3b)
-->
