---
title: "Implementation Plan: Sprint 1 — Graph Signal Activation"
description: "Implement typed-weighted degree as 5th RRF channel, measure edge density, and add agent consumption instrumentation."
trigger_phrases:
  - "sprint 1 plan"
  - "graph signal plan"
  - "R4 plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Sprint 1 — Graph Signal Activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Node.js MCP server |
| **Storage** | SQLite (better-sqlite3), sqlite-vec, causal_edges table |
| **Testing** | Vitest |

### Overview

This plan implements Sprint 1 — graph signal activation. The primary deliverable is R4: typed-weighted degree scoring as a 5th RRF channel. The degree formula computes `typed_degree(node) = SUM(weight_t * count_t)` per edge type, normalized via `log(1 + typed_degree) / log(1 + MAX_TYPED_DEGREE)`. The channel runs behind a feature flag (`SPECKIT_DEGREE_BOOST`) with a dark-run phase before enablement. Secondary deliverables include edge density measurement and G-NEW-2 agent consumption instrumentation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Sprint 0 exit gate passed (graph functional, eval infrastructure operational)
- [ ] BM25 baseline MRR@5 recorded (Sprint 0 deliverable)
- [ ] Edge type weights confirmed: caused=1.0, derived_from=0.9, enabled=0.8, contradicts=0.7, supersedes=0.6, supports=0.5

### Definition of Done
- [ ] R4 dark-run passes — MRR@5 delta >+2% absolute
- [ ] No single memory in >60% of dark-run results
- [ ] Edge density measured; R10 escalation decision documented
- [ ] 6-10 new tests added and passing
- [ ] 158+ existing tests still passing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Channel extension — adding a 5th signal to existing RRF fusion pipeline

### Key Components
- **Degree computation** (`graph-search-fn.ts`): SQL query to compute typed-weighted degree per memory ID from `causal_edges` table. Formula: `typed_degree(node) = SUM(weight_t * count_t)`. Edge type weights: caused=1.0, derived_from=0.9, enabled=0.8, contradicts=0.7, supersedes=0.6, supports=0.5.
- **Normalization**: `log(1 + typed_degree) / log(1 + MAX_TYPED_DEGREE)`. MAX_TYPED_DEGREE=15 (computed global with fallback). Capped at DEGREE_BOOST_CAP=0.15.
- **RRF integration** (`rrf-fusion.ts`): Degree scores fed as 5th channel into Reciprocal Rank Fusion.
- **Feature flag**: `SPECKIT_DEGREE_BOOST` — disabled by default; dark-run comparison before enabling.
- **Degree cache**: Computed once per graph mutation, not per query. Invalidated when `causal_edges` table changes.

### Data Flow
1. Query arrives at hybrid search
2. Existing 4 channels execute (vector, FTS5, trigger, graph-traverse)
3. If `SPECKIT_DEGREE_BOOST` enabled: degree computation SQL runs on `causal_edges`
4. Degree scores normalized and capped
5. 5-channel RRF fusion produces final ranking
6. Results logged to R13 eval infrastructure for dark-run comparison
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Degree Computation
- [ ] Implement typed-weighted degree SQL query against `causal_edges` table (4-5h)
- [ ] Add TypeScript normalization + capping logic (2-3h)
- [ ] Implement degree cache with mutation-triggered invalidation (2-3h)

### Phase 2: RRF Integration
- [ ] Integrate degree as 5th channel in `rrf-fusion.ts` behind `SPECKIT_DEGREE_BOOST` flag (2-3h)
- [ ] Wire degree scores into `hybrid-search.ts` pipeline (2-3h)

### Phase 3: Measurement
- [ ] Compute edge density (edges/node) from `causal_edges` data (2-3h)
- [ ] Document R10 escalation decision based on density threshold (included)

### Phase 4: Agent UX + Signal Vocabulary
- [ ] G-NEW-2: Agent consumption instrumentation — add logging for consumption patterns (4-6h)
- [ ] G-NEW-2: Initial pattern analysis and report (4-6h)
- [ ] TM-08: Expand importance signal vocabulary in `trigger-extractor.ts` — add CORRECTION signals ("actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want") based on true-mem's 8-category vocabulary (2-4h)

### Phase 5: Dark-Run and Verification
- [ ] Enable R4 in dark-run mode — shadow scoring alongside existing 4-channel results (included)
- [ ] Verify MRR@5 delta >+2% absolute; no single memory >60% presence (included)
- [ ] Enable R4 permanently if dark-run passes (0h — flag flip)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | Degree SQL correctness — known edge data produces expected scores | Vitest | 2-3 tests |
| Unit | Normalization bounds — output in [0, 0.15] range | Vitest | 1-2 tests |
| Unit | Cache invalidation — stale after mutation | Vitest | 1 test |
| Unit | Constitutional exclusion — no degree boost for constitutional memories | Vitest | 1 test |
| Integration | 5-channel RRF fusion end-to-end | Vitest | 1-2 tests |
| Manual | Dark-run comparison via R13 metrics | Manual | N/A |

**Total**: 6-10 new tests, estimated 250-400 LOC
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 0 exit gate | Internal | Pending | Cannot start Sprint 1 |
| R13-S1 eval infrastructure | Internal | Pending (Sprint 0) | Cannot measure dark-run results |
| `causal_edges` table | Internal | Green | Already exists; G1 fix makes it queryable |
| Feature flag system | Internal | Green | Env var based — `SPECKIT_DEGREE_BOOST` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: R4 dark-run fails (MRR@5 delta <+2%), or hub domination detected despite caps
- **Procedure**: Disable `SPECKIT_DEGREE_BOOST` flag; revert R4 code changes in 3 files
- **Estimated time**: 1-2h
- **Difficulty**: LOW — feature flag provides instant disable; code changes are additive
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Degree Computation) ──► Phase 2 (RRF Integration) ──► Phase 5 (Dark-Run)
                                                                       ▲
Phase 3 (Measurement) ──────────────────────────────────────────────────┘
Phase 4 (Agent UX) ─────────────────────────────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Degree Computation) | Sprint 0 gate | Phase 2 |
| Phase 2 (RRF Integration) | Phase 1 | Phase 5 |
| Phase 3 (Measurement) | Sprint 0 gate | Phase 5 |
| Phase 4 (Agent UX) | Sprint 0 gate | Phase 5 |
| Phase 5 (Dark-Run) | Phase 2, Phase 3, Phase 4 | Sprint 2 (next sprint) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Degree Computation) | Medium | 8-10h |
| Phase 2 (RRF Integration) | Medium | 4-6h |
| Phase 3 (Measurement) | Low | 2-3h |
| Phase 4 (Agent UX + Signal Vocabulary) | Medium | 10-16h |
| Phase 5 (Dark-Run) | Low | Included |
| **Total** | | **24-35h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Feature flag `SPECKIT_DEGREE_BOOST` configured and defaults to disabled
- [ ] Dark-run comparison baseline captured before enabling R4
- [ ] Degree cache invalidation tested

### Rollback Procedure
1. **Immediate**: Set `SPECKIT_DEGREE_BOOST=false` — R4 instantly disabled
2. **Revert code**: `git revert` for degree computation, RRF integration, and search pipeline changes
3. **Verify rollback**: Run 158+ existing tests; confirm 4-channel RRF fusion works as before
4. **Cache cleanup**: Clear degree cache entries (optional — they become unused)

### Data Reversal
- **Has data migrations?** No — R4 reads from existing `causal_edges` table; no schema changes
- **Reversal procedure**: N/A — no data to reverse; disable flag is sufficient
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Plan**: See `../plan.md`
- **Predecessor Plan**: See `../001-sprint-0-epistemological-foundation/plan.md`

---

<!--
LEVEL 2 PLAN — Phase 2 of 8
- Core + L2 addendums (Phase Dependencies, Effort, Enhanced Rollback)
- Sprint 1: Graph signal activation via R4 typed-degree 5th channel
- Feature flag gated with dark-run verification
-->
