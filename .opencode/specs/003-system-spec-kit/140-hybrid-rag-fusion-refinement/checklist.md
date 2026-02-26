---
title: "Verification Checklist: Hybrid RAG Fusion Refinement"
description: "~67 verification items across program-level checks, sprint exit gates (P0-P2 aligned with off-ramp), and L3+ governance."
trigger_phrases:
  - "hybrid rag checklist"
  - "sprint verification"
  - "retrieval refinement checklist"
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: Hybrid RAG Fusion Refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

**Priority alignment with off-ramp**: Sprint 0-1 gates are P0 (blocking). Sprint 2-4 gates are P1. Sprint 5-6 gates are P2. If you stop at Sprint 2+3 (recommended minimum), only P0+P1 items need verification.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Research synthesis complete (142-FINAL analysis + recommendations reviewed)
- [ ] CHK-002 [P0] BM25 contingency decision matrix documented with action paths
- [ ] CHK-003 [P1] Feature flag governance rules established (6-flag max, 90-day lifespan)
- [ ] CHK-004 [P1] Migration safety protocol confirmed (backup, nullable defaults, atomic execution)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All bug fixes (G1, G3) produce verifiable behavior change (graph hit rate >0%, no duplicate chunks)
- [ ] CHK-011 [P0] Stage 4 "no score changes" invariant enforced in R6 pipeline refactor
- [ ] CHK-012 [P1] Feature flag naming follows convention: `SPECKIT_{FEATURE}`
- [ ] CHK-013 [P1] All new columns nullable with sensible defaults
- [ ] CHK-014 [P1] No destructive migrations in forward path
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] 158+ existing tests pass after every sprint completion
- [ ] CHK-021 [P0] Dark-run comparison executed for every scoring change before enabling
- [ ] CHK-022 [P1] New tests added per sprint per expansion strategy (See plan.md §5)
- [ ] CHK-023 [P1] Flag interaction testing at appropriate level (isolation → pair → group)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] FTS5 contamination test: verify `learned_triggers` column is NOT indexed by FTS5 (R11)
- [ ] CHK-031 [P0] Separate eval database (`speckit-eval.db`) — no eval queries touch primary DB
- [ ] CHK-032 [P1] R11 denylist expanded from 25 to 100+ stop words
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized after each sprint
- [ ] CHK-041 [P1] Sprint exit gate results documented in tasks.md
- [ ] CHK-042 [P2] Research document section references verified accurate
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Each child sprint folder contains spec.md, plan.md, tasks.md, checklist.md
- [ ] CHK-051 [P1] No scratch files left in child folders after completion
- [ ] CHK-052 [P2] Memory saves completed via `generate-context.js` after significant sprints
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:sprint-gates -->
## Sprint Exit Gates

### Sprint 0: Epistemological Foundation [P0 — BLOCKING]

- [ ] CHK-S00 [P0] Graph hit rate > 0% (G1 verified — `channelAttribution` shows graph results)
- [ ] CHK-S01 [P0] No duplicate chunk rows in default search mode (G3 verified)
- [ ] CHK-S02 [P0] Baseline MRR@5, NDCG@10, Recall@20 computed for at least 50 eval queries
- [ ] CHK-S03 [P0] BM25-only baseline MRR@5 recorded
- [ ] CHK-S04 [P0] BM25 contingency decision made (>=80% pause / 50-80% proceed reduced / <50% proceed full)
- [ ] CHK-S05 [P0] Fan-effect divisor (R17) reduces hub domination in co-activation results

### Sprint 1: Graph Signal Activation [P0]

- [ ] CHK-S10 [P0] R4 dark-run: no single memory in >60% of results
- [ ] CHK-S11 [P0] R4 MRR@5 delta > +2% absolute (or +5% relative) vs Sprint 0 baseline
- [ ] CHK-S12 [P0] Edge density measured; if < 0.5 edges/node, R10 priority escalated
- [ ] CHK-S13 [P1] G-NEW-2: Agent consumption instrumentation active; initial pattern report drafted

### Sprint 2: Scoring Calibration [P1]

- [ ] CHK-S20 [P1] R18 embedding cache hit rate > 90% on re-index of unchanged content
- [ ] CHK-S21 [P1] N4 dark-run: new memories (<48h) surface when relevant without displacing older results
- [ ] CHK-S22 [P1] G2 resolved: double intent weighting fixed or documented as intentional
- [ ] CHK-S23 [P1] Score distributions from RRF and composite normalized to comparable [0,1] ranges

### Sprint 3: Query Intelligence [P1]

- [ ] CHK-S30 [P1] R15 p95 latency for simple queries < 30ms
- [ ] CHK-S31 [P1] R14/N1 shadow comparison: minimum 100 queries, Kendall tau computed (tau < 0.4 = reject RSF)
- [ ] CHK-S32 [P1] R2 dark-run: top-3 precision within 5% of baseline
- [ ] CHK-S33 [P1] Off-ramp evaluation: check MRR@5 >= 0.7, constitutional >= 95%, cold-start >= 90%

### Sprint 4: Feedback Loop [P1]

- [ ] CHK-S40 [P1] R13 has completed at least 2 full eval cycles (prerequisite for R11)
- [ ] CHK-S41 [P1] R1 dark-run: MRR@5 within 2%; no regression for N=1 memories
- [ ] CHK-S42 [P1] R11 shadow log: noise rate < 5% in learned triggers
- [ ] CHK-S43 [P1] R13-S2 operational: full A/B comparison infrastructure running
- [ ] CHK-S44 [P1] R11 FTS5 contamination test passes (learned triggers NOT in FTS5 index)

### Sprint 5: Pipeline Refactor [P2]

- [ ] CHK-S50 [P2] Checkpoint created before R6 (`pre-pipeline-refactor`)
- [ ] CHK-S51 [P2] R6 dark-run: 0 ordering differences on full eval corpus
- [ ] CHK-S52 [P2] All 158+ existing tests pass with `SPECKIT_PIPELINE_V2` enabled
- [ ] CHK-S53 [P2] R9 cross-folder queries produce identical results
- [ ] CHK-S54 [P2] R12 expansion does not degrade simple query latency

### Sprint 6: Graph Deepening [P2]

- [ ] CHK-S60 [P2] R7 Recall@20 within 10% of baseline
- [ ] CHK-S61 [P2] R10 false positive rate < 20% on manual review
- [ ] CHK-S62 [P2] N2 graph channel attribution > 10% of final top-K
- [ ] CHK-S63 [P2] N3-lite: contradiction scan identifies at least 1 known contradiction
- [ ] CHK-S64 [P2] Active feature flag count <= 6
- [ ] CHK-S65 [P2] All health dashboard targets met (MRR@5 +10-15%, graph hit >20%, channel diversity >3.0)
<!-- /ANCHOR:sprint-gates -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 (Calibration not Architecture) implemented: score normalization used, not pipeline merge
- [ ] CHK-101 [P1] ADR-002 (Metric-Gated Sprints) followed: each sprint has data-driven exit gate
- [ ] CHK-102 [P1] ADR-003 (Density Before Deepening) followed: N2/N3 deferred until density measured
- [ ] CHK-103 [P2] ADR-005 (Separate learned_triggers) implemented: separate column, not prefix-based
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P0] Search response time MUST NOT exceed 500ms p95 during any dark-run phase
- [ ] CHK-111 [P1] Dark-run overhead within per-sprint budget (S1: +10ms, S2: +2ms, S3: +50ms, S4: +15ms, S5: +100ms)
- [ ] CHK-112 [P1] R13 cumulative health dashboard operational after Sprint 2
- [ ] CHK-113 [P2] Per-complexity-tier latency targets met (simple <30ms, moderate <100ms, complex <300ms)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested for each sprint (See plan.md §7)
- [ ] CHK-121 [P0] Feature flags configured for all scoring changes (build → dark-run → shadow → enable → permanent)
- [ ] CHK-122 [P1] Checkpoint created before Sprint 4 (R11 mutations), Sprint 5 (pipeline), Sprint 6 (graph)
- [ ] CHK-123 [P1] Schema migration protocol followed (8 rules from plan.md L2: Enhanced Rollback)
- [ ] CHK-124 [P1] Feature flag lifecycle enforced: 90-day max lifespan, monthly sunset audit
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Migration safety checklist completed for S0 (eval DB), S2 (cache table), S4 (learned_triggers)
- [ ] CHK-131 [P1] All new columns nullable with defaults; no NOT NULL additions to existing tables
- [ ] CHK-132 [P1] Forward-compatible reads: code handles missing columns for rollback scenarios
- [ ] CHK-133 [P2] Version tracking implemented (schema_version table or pragma)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized across parent and 8 child folders
- [ ] CHK-141 [P1] Research document section references verified accurate
- [ ] CHK-142 [P2] Memory context saved after significant sprints (S0, S3, S6)
- [ ] CHK-143 [P2] Phase-child-header links resolve correctly in all child spec.md files
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Project Lead | Gate decisions, BM25 contingency, off-ramp | [ ] Approved | |
| Developer | Implementation, testing, flag management | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | [ ]/20 |
| P1 Items | 34 | [ ]/34 |
| P2 Items | 13 | [ ]/13 |
| **Total** | **67** | **[ ]/67** |

**Verification Date**: [YYYY-MM-DD]

**Minimum viable verification (off-ramp at S2+S3)**: All P0 items (20) + P1 items through Sprint 3 (CHK-S30 to CHK-S33) = ~34 items
<!-- /ANCHOR:summary -->

---

<!--
Level 3+ checklist — Full verification + architecture + sprint gates
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Sprint gate priorities aligned with off-ramp: S0-S1 = P0, S2-S4 = P1, S5-S6 = P2
-->
