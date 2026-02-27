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
  - **Hint**: Classifier features — query length (chars), term count (whitespace-split), trigger phrase presence (exact match against known phrases), semantic complexity heuristic (ratio of stop words to content words)
  - **Sub-step T001a**: Define classification boundaries and thresholds (e.g., simple: ≤3 terms OR trigger match; complex: >8 terms AND no trigger)
  - **Sub-step T001b**: Implement tier-to-channel-subset mapping table (config-driven, not hardcoded)
  - **Acceptance**: Shadow-run both full pipeline and routed pipeline simultaneously; compare results before enabling routing as primary
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

<!-- ANCHOR:pageindex -->
## PageIndex Tasks

- [ ] T008 Implement PI-A2 search strategy degradation fallback chain — three-tier fallback (full hybrid → broadened search → structural search) with automatic threshold-based transitions (top similarity < 0.4 OR result count < 3); preserves R15 min-2-channel constraint at all levels [12-16h] {T001} — PI-A2
  - Tier 1: Full hybrid search (primary, R15-selected channels)
  - Tier 2: Broadened search — relaxed filters, trigger matching enabled, channel constraints loosened
  - Tier 3: Structural search — folder browsing, tier-based listing, no vector requirement
  - Thresholds verified against Sprint 0 eval framework
- [ ] T009 [P] Implement PI-B3 description-based spec folder discovery — generate 1-sentence descriptions from spec.md per folder, cache in descriptions.json, integrate lookup into memory_context orchestration layer before vector queries [4-8h] — PI-B3
<!-- /ANCHOR:pageindex -->

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
