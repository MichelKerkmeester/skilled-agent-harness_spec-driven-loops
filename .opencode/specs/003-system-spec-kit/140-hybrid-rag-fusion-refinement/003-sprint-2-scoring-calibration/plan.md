---
title: "Implementation Plan: Sprint 2 — Scoring Calibration"
description: "Implement embedding cache, cold-start boost, G2 investigation, and score normalization to resolve 15:1 magnitude mismatch."
trigger_phrases:
  - "sprint 2 plan"
  - "scoring calibration plan"
  - "embedding cache plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Sprint 2 — Scoring Calibration

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
| **Storage** | SQLite (better-sqlite3), sqlite-vec, FTS5 |
| **Testing** | Vitest |

### Overview

This plan implements Sprint 2 — scoring calibration. Four independent features converge to resolve the scoring pipeline's core deficiencies: (1) R18 embedding cache eliminates unnecessary API costs on re-index; (2) N4 cold-start boost makes newly indexed memories visible via exponential decay; (3) G2 investigation resolves the double intent weighting anomaly; (4) score normalization eliminates the 15:1 RRF-vs-composite magnitude mismatch. G2 outcome influences the normalization approach (Phase 4 depends on Phase 3).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Sprint 1 exit gate passed (R4 delta >+2%, edge density measured)
- [ ] R18 cache schema finalized: `CREATE TABLE embedding_cache (content_hash TEXT, model_id TEXT, embedding BLOB, dimensions INT, created_at TEXT, last_used_at TEXT, PRIMARY KEY (content_hash, model_id))`
- [ ] N4 formula confirmed: `boost = 0.15 * exp(-elapsed_hours / 12)`
- [ ] G2 code location identified in `hybrid-search.ts`

### Definition of Done
- [ ] R18 cache hit >90% on re-index of unchanged content
- [ ] N4 dark-run passes (new memories visible, old not displaced)
- [ ] G2 resolved: fixed or documented as intentional
- [ ] Score distributions normalized to [0,1]
- [ ] 8-12 new tests added and passing
- [ ] 158+ existing tests still passing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Four parallel feature tracks with G2 → normalization dependency

### Key Components
- **Embedding cache** (R18): New `embedding_cache` table in primary DB. Schema: `content_hash TEXT, model_id TEXT, embedding BLOB, dimensions INT, created_at TEXT, last_used_at TEXT, PRIMARY KEY (content_hash, model_id)`. Cache lookup on re-index path; miss = normal embedding generation.
- **Cold-start boost** (N4): Applied in `composite-scoring.ts`. Formula: `boost = 0.15 * exp(-elapsed_hours / 12)`. Feature flag: `SPECKIT_NOVELTY_BOOST`. Applied BEFORE FSRS temporal decay. Cap at 0.95 combined score.
- **G2 investigation**: Locate double intent weighting in `hybrid-search.ts`. Determine if intentional (document) or bug (fix).
- **Score normalization**: Depends on G2 outcome. Normalize both RRF (~[0, 0.07]) and composite (~[0, 1]) to [0, 1] range.

### Data Flow
1. **R18 (index-time)**: Content hash computed → cache lookup → hit: use cached embedding; miss: generate + store
2. **N4 (search-time)**: Memory creation timestamp checked → if <48h: boost applied → composite score adjusted → FSRS decay applied separately
3. **G2 (search-time)**: Intent weights traced through pipeline → duplicate application identified → fix or document
4. **Normalization (search-time)**: Post-fusion: RRF and composite scores both mapped to [0, 1] before combination
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Embedding Cache (R18)
- [ ] Create `embedding_cache` table with migration (2-3h)
- [ ] Implement cache lookup + store logic in embedding pipeline (4-6h)
- [ ] Add `last_used_at` update for cache eviction support (1-2h)
- [ ] Verify cache hit rate >90% on re-index of unchanged content (1h)

### Phase 2: Cold-Start Boost (N4)
- [ ] Implement cold-start boost formula in `composite-scoring.ts` (2-3h)
- [ ] Wire behind `SPECKIT_NOVELTY_BOOST` feature flag (0.5-1h)
- [ ] Verify no conflict with FSRS temporal decay (0.5-1h)

### Phase 3: G2 Investigation
- [ ] Trace intent weight application through full pipeline in `hybrid-search.ts` (2-3h)
- [ ] Determine: bug or intentional design (1-2h)
- [ ] If bug: implement fix. If intentional: document rationale (1-2h)

### Phase 4: Score Normalization (depends on Phase 3)
- [ ] Implement normalization for RRF output to [0, 1] (2-3h)
- [ ] Implement normalization for composite output to [0, 1] (1-2h)
- [ ] Dark-run comparison — verify no MRR@5 regression (1h)

### Phase 5: Interference Scoring (TM-01)
- [ ] Add `interference_score` column to `memory_index` via migration (1-2h)
- [ ] Compute interference score at index time — count memories with cosine similarity > 0.75 in same `spec_folder` (2-3h)
- [ ] Apply `-0.08 * interference_score` penalty in `composite-scoring.ts` behind `SPECKIT_INTERFERENCE_SCORE` flag (1-2h)

### Phase 6: Classification-Based Decay (TM-03)
- [ ] Modify `fsrs-scheduler.ts` with decay policy multipliers by `context_type`: decisions=no decay, research=2x stability, implementation/discovery/general=standard (2-3h)
- [ ] Add `importance_tier` multipliers: constitutional/critical=no decay, important=1.5x, normal=standard, temporary=0.5x (1-2h)

### Phase 7: Verification
- [ ] N4 dark-run — new memories visible, old not displaced (included)
- [ ] TM-01 dark-run — interference penalty applied correctly, no false penalties (included)
- [ ] Sprint 2 exit gate verification (included)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | R18 cache hit/miss paths, content_hash key correctness | Vitest | 2-3 tests |
| Unit | N4 boost formula at 0h, 12h, 24h, 48h, >48h | Vitest | 2-3 tests |
| Unit | N4 + FSRS interaction — no double-penalty | Vitest | 1 test |
| Unit | Score normalization — both systems output [0, 1] | Vitest | 1-2 tests |
| Integration | G2 intent weight trace through full pipeline | Vitest | 1-2 tests |
| Manual | Dark-run comparison for N4 and normalization | Manual | N/A |

**Total**: 8-12 new tests, estimated 200-350 LOC
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 1 exit gate | Internal | Pending | Cannot start Sprint 2 |
| R13-S1 eval infrastructure | Internal | Pending (Sprint 0) | Cannot measure dark-run results |
| Embedding API (for cache miss path) | External | Green | Cache miss = normal flow |
| Feature flag system | Internal | Green | Env var based — `SPECKIT_NOVELTY_BOOST` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N4 dark-run fails, or score normalization causes MRR@5 regression
- **Procedure**: Disable `SPECKIT_NOVELTY_BOOST` flag; `DROP TABLE embedding_cache`; revert normalization and G2 changes
- **Estimated time**: 2-3h
- **Difficulty**: LOW — cache is additive; N4 is flag-gated; normalization is isolated
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (R18 Cache) ──────────────────────────────────────────┐
Phase 2 (N4 Cold-Start) ──────────────────────────────────────┤
Phase 3 (G2 Investigation) ──► Phase 4 (Normalization) ──────►├──► Phase 5 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (R18 Cache) | Sprint 1 gate | Phase 7 |
| Phase 2 (N4 Cold-Start) | Sprint 1 gate | Phase 7 |
| Phase 3 (G2 Investigation) | Sprint 1 gate | Phase 4 |
| Phase 4 (Normalization) | Phase 3 | Phase 7 |
| Phase 5 (TM-01 Interference Scoring) | Sprint 1 gate | Phase 7 |
| Phase 6 (TM-03 Classification Decay) | Sprint 1 gate | Phase 7 |
| Phase 7 (Verification) | Phase 1, Phase 2, Phase 4, Phase 5, Phase 6 | Sprint 3 (next sprint) |

**Note**: Phases 1, 2, 3, 5, and 6 are independent — they can execute in parallel. Phase 4 depends on Phase 3 (G2 outcome influences normalization approach).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (R18 Cache) | Medium | 8-12h |
| Phase 2 (N4 Cold-Start) | Low-Medium | 3-5h |
| Phase 3 (G2 Investigation) | Medium | 4-6h |
| Phase 4 (Normalization) | Medium | 4-6h |
| Phase 5 (TM-01 Interference Scoring) | Medium | 4-6h |
| Phase 6 (TM-03 Classification Decay) | Medium | 3-5h |
| Phase 7 (Verification) | Low | Included |
| **Total** | | **26-40h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Feature flag `SPECKIT_NOVELTY_BOOST` configured and defaults to disabled
- [ ] R18 cache table migration tested (create + drop)
- [ ] Pre-normalization score distributions captured for comparison

### Rollback Procedure
1. **Immediate**: Set `SPECKIT_NOVELTY_BOOST=false` — N4 instantly disabled
2. **Cache removal**: `DROP TABLE IF EXISTS embedding_cache` — no impact on search
3. **Revert code**: `git revert` for normalization and G2 changes
4. **Verify rollback**: Run 158+ existing tests; verify MRR@5 matches pre-Sprint-2 baseline

### Data Reversal
- **Has data migrations?** Yes — `CREATE TABLE embedding_cache` in primary DB
- **Reversal procedure**: `DROP TABLE embedding_cache`. No other schema changes. Primary DB data untouched.
- **Migration protocol**: Backup before `ALTER TABLE`; nullable defaults; atomic execution
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Plan**: See `../plan.md`
- **Predecessor Plan**: See `../002-sprint-1-graph-signal-activation/plan.md`

---

<!--
LEVEL 2 PLAN — Phase 3 of 8
- Core + L2 addendums (Phase Dependencies, Effort, Enhanced Rollback)
- Sprint 2: Scoring calibration — R18, N4, G2, normalization
- Off-ramp: Recommended minimum viable stop after Sprint 2+3 (phases 3+4)
-->
