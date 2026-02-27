---
title: "Tasks: Sprint 1 — Graph Signal Activation"
description: "Task breakdown for Sprint 1: typed-weighted degree as 5th RRF channel, edge density, agent UX"
trigger_phrases:
  - "sprint 1 tasks"
  - "graph signal tasks"
  - "R4 tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Sprint 1 — Graph Signal Activation

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
## Phase 1: Degree Computation

- [ ] T001 Implement typed-weighted degree computation — SQL query against `causal_edges` + TypeScript normalization (`graph-search-fn.ts`) [8-10h] — R4 (REQ-S1-001)
  - Formula: `typed_degree(node) = SUM(weight_t * count_t)`
  - Normalized: `log(1 + typed_degree) / log(1 + MAX_TYPED_DEGREE)`
  - Edge type weights: caused=1.0, derived_from=0.9, enabled=0.8, contradicts=0.7, supersedes=0.6, supports=0.5
  - MAX_TYPED_DEGREE=15 (computed global with fallback)
  - MAX_TOTAL_DEGREE=50 cap
  - DEGREE_BOOST_CAP=0.15
  - Constitutional memory exclusion
  - Acceptance: Degree SQL returns correct scores for known test graph; normalization output in [0, 0.15] range; constitutional memories return 0
  - Implementation hint: SQL should GROUP BY source_id/target_id and JOIN on `relation` type for weight lookup. Use `SELECT source_id, SUM(CASE relation WHEN 'caused' THEN 1.0 ... END * strength) FROM causal_edges GROUP BY source_id` pattern.
  - Sub-steps:
    1. Write degree computation SQL query (2-3h)
    2. Add TypeScript normalization + capping wrapper (2-3h)
    3. Implement degree cache with mutation-triggered invalidation (2-3h)
    4. Add constitutional memory exclusion filter (1h)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: RRF Integration

- [ ] T002 Integrate degree as 5th RRF channel behind `SPECKIT_DEGREE_BOOST` feature flag (`rrf-fusion.ts`, `hybrid-search.ts`) [4-6h] {T001} — R4 (REQ-S1-001)
  - Acceptance: 5-channel RRF fusion produces rankings; flag=false yields identical results to 4-channel; flag=true shows degree influence in results
  - Implementation hint: In `rrf-fusion.ts`, add degree scores as 5th array in the channel list; in `hybrid-search.ts`, wire degree computation call into the search pipeline gated by `process.env.SPECKIT_DEGREE_BOOST`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Measurement

- [ ] T003 [P] Measure edge density (edges/node) from `causal_edges` data; document R10 escalation decision if density < 0.5 [2-3h] — Edge density (REQ-S1-002)
  - Acceptance: Density ratio computed; if < 0.5, R10 escalation documented with timeline recommendation
  - Implementation hint: `SELECT CAST(COUNT(*) AS REAL) / (SELECT COUNT(DISTINCT id) FROM memory_index) FROM causal_edges`
- [ ] T003a [P] Increase co-activation boost strength — raise base multiplier from 0.1x to 0.25-0.3x (configurable coefficient); dark-run verifiable [2-4h] {T001} — A7 (REQ-S1-004)
  - Acceptance: Graph channel effective contribution >=15% at hop 2 (up from ~5%); dark-run verified
  - Implementation hint: Modify co-activation multiplier constant in `co-activation.ts`; make configurable via `SPECKIT_COACTIVATION_STRENGTH` env var
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Agent UX + Signal Vocabulary

- [ ] T004 [P] Agent-as-consumer UX analysis + consumption instrumentation — log consumption patterns, generate initial report [8-12h] — G-NEW-2 (REQ-S1-003)
  - Acceptance: Consumption patterns logged with query text, result count, selected IDs, ignored IDs; pattern report generated
  - Sub-steps:
    1. Add instrumentation hooks to `memory_search`, `memory_context`, `memory_match_triggers` responses (3-4h)
    2. Design consumption log schema (query, results returned, results used by agent) (1-2h)
    3. Collect initial data and analyze patterns (2-3h)
    4. Generate pattern report with >=5 identified consumption categories (2-3h)
- [ ] T005a [P] Expand importance signal vocabulary in `trigger-extractor.ts` — add CORRECTION signals ("actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want") from true-mem's 8-category vocabulary [2-4h] — TM-08 (REQ-S1-005)
<!-- /ANCHOR:phase-4 -->

---

## Phase 5 (PI-A3): Pre-Flight Token Budget Validation

- [ ] T007 [P] Implement pre-flight token budget validation — estimate total tokens across candidate result set before response assembly; truncate to highest-scoring candidates if total exceeds configured budget; handle `includeContent=true` single-result overflow with summary fallback; log all overflow events (query_id, candidate_count, total_tokens, budget_limit, truncated_to_count) to eval infrastructure (`hybrid-search.ts` or result assembler) [4-6h] — PI-A3
  - Truncation strategy: greedy highest-scoring first (never round-robin)
  - Single-result budget overflow: return summary, not raw truncated content
  - Overflow log extends R-004 baseline scoring benchmark dataset

## Phase 4: Dark-Run and Verification

- [ ] T005 Enable R4 in dark-run mode — shadow scoring alongside 4-channel results; verify MRR@5 delta >+2% and no single memory >60% presence [included] {T002, T003, T003a, T004, T005a}— R4 (REQ-S1-001)
- [ ] T006 [GATE] Sprint 1 exit gate verification [0h] {T001, T002, T003, T003a, T004, T005, T005a}
  - [ ] R4 MRR@5 delta >+2% absolute
  - [ ] No single memory >60% of dark-run results
  - [ ] Edge density measured; R10 escalation decision documented
  - [ ] G-NEW-2 instrumentation active

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T006 (including T003a and T005a) marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Sprint 1 exit gate (T006) passed
- [ ] 6-10 new tests added and passing
- [ ] 158+ existing tests still passing
- [ ] Feature flag `SPECKIT_DEGREE_BOOST` enabled (or decision to keep disabled documented)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../tasks.md`
- **Predecessor Tasks**: See `../001-sprint-0-epistemological-foundation/tasks.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 2 of 8
- 7 tasks across 4 phases
- T001-T002: Sequential R4 implementation
- T003-T003a-T004: Parallelizable measurement + co-activation boost + UX
- T005-T006: Dark-run verification + exit gate
-->
