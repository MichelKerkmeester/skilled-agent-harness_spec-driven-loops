---
title: "Implementation Plan: Sprint 4 — Feedback Loop"
description: "MPAB chunk aggregation, learned relevance feedback, and shadow scoring infrastructure implementation plan."
trigger_phrases:
  - "sprint 4 plan"
  - "feedback loop plan"
  - "MPAB plan"
  - "R11 plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Sprint 4 — Feedback Loop

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Storage** | SQLite / FTS5 / sqlite-vec |
| **Testing** | Vitest |
| **Feature Flags** | `SPECKIT_DOCSCORE_AGGREGATION`, `SPECKIT_LEARN_FROM_SELECTION` |

### Overview

Implement MPAB chunk-to-memory aggregation operating after RRF fusion and before state filtering. Implement learned relevance feedback writing to a separate `learned_triggers` column at lower weight (0.7x) with 7 strict safeguards. Extend eval infrastructure with shadow scoring, channel attribution, and ground truth Phase B for full A/B evaluation.

### Architecture

R1 MPAB operates after RRF fusion, before state filtering. R11 writes to separate column, queried at lower weight (0.7x). R13-S2 extends eval with shadow scoring.

**R1 MPAB corrected**: `computeMPAB(scores)` -- sorted descending, sMax=sorted[0], remaining=sorted.slice(1), bonus=0.3*sum(remaining)/sqrt(N). Pipeline position: after RRF, before state filter. Metadata: preserve `_chunkHits: scores.length`.

**R11 safeguards**: (1) Separate column, (2) 30-day TTL, (3) 100+ stop words denylist, (4) Max 3 terms/selection + 8 per memory, (5) Only when NOT in top 3, (6) 1-week shadow, (7) Exclude <72h memories.

**Checkpoint recommended before this sprint.**
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Sprint 3 exit gate, R13 2+ eval cycles)
- [ ] Checkpoint created before sprint start

### Definition of Done
- [ ] All acceptance criteria met (REQ-S4-001 through REQ-S4-003)
- [ ] Tests passing (10-15 new tests)
- [ ] Docs updated (spec/plan/tasks)
- [ ] FTS5 contamination test passing
- [ ] Schema migration verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline extension + schema migration — R1 appends aggregation stage, R11 adds learned feedback column, R13-S2 extends eval infrastructure.

### Key Components
- **MPAB Aggregator**: Computes chunk-to-memory score using `sMax + 0.3 * sum(remaining) / sqrt(N)` with N=0 and N=1 guards
- **Learned Feedback Engine**: Writes to `learned_triggers` column with 7-layer safeguard stack
- **Shadow Scoring Engine**: Runs parallel scoring paths for A/B comparison without affecting production results
- **Channel Attribution**: Tags each result with source channel for eval analysis

### Data Flow
1. Chunks scored individually by pipeline
2. R1 MPAB aggregates chunk scores per memory (after RRF, before state filter)
3. R11 observes user selections, writes learned triggers (after 1-week shadow)
4. R13-S2 logs shadow scores + channel attribution for A/B analysis
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: R1 MPAB Chunk Aggregation (8-12h)
- [ ] Implement `computeMPAB(scores)` function with sorted descending logic
- [ ] Add N=0 guard (return 0) and N=1 guard (return score, no bonus)
- [ ] Implement index-based max removal (not value-based, handles ties)
- [ ] Preserve `_chunkHits: scores.length` metadata
- [ ] Add feature flag `SPECKIT_DOCSCORE_AGGREGATION`
- [ ] Position in pipeline: after RRF fusion, before state filtering
- [ ] Verify MRR@5 within 2% and N=1 no regression

### Phase 2: R11 Learned Relevance Feedback (16-24h)
- [ ] Schema migration: `ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'`
- [ ] Implement safeguard 1: Separate column (NOT in FTS5 index)
- [ ] Implement safeguard 2: 30-day TTL on learned terms
- [ ] Implement safeguard 3: 100+ stop words denylist
- [ ] Implement safeguard 4: Max 3 terms/selection + 8 per memory cap
- [ ] Implement safeguard 5: Only when memory NOT in top 3 results
- [ ] Implement safeguard 6: 1-week shadow period (log but don't apply)
- [ ] Implement safeguard 7: Exclude memories <72h old
- [ ] Add feature flag `SPECKIT_LEARN_FROM_SELECTION`
- [ ] Query learned_triggers at 0.7x weight

### Phase 3: R13-S2 Shadow Scoring + Ground Truth Phase B (15-20h)
- [ ] Implement shadow scoring infrastructure
- [ ] Add channel attribution to results
- [ ] Implement ground truth Phase B (expanded annotations)
- [ ] Full A/B comparison infrastructure

### Phase 4: Verification
- [ ] Verify R1 dark-run (MRR@5 within 2%, N=1 no regression)
- [ ] Analyze R11 shadow log (noise rate <5%)
- [ ] Verify FTS5 contamination test
- [ ] Sprint 4 exit gate verification
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | R1 MPAB: N=0, N=1, N=2, N=10, metadata preservation | Vitest | 4-5 tests |
| Unit | R11: column isolation, TTL, denylist, cap, eligibility, shadow | Vitest | 5-7 tests |
| Integration | R11 FTS5 contamination test | Vitest | 1 test |
| Integration | R13-S2 shadow scoring + attribution | Vitest | 2-3 tests |

**Total**: 10-15 new tests (400-550 LOC)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 3 exit gate | Internal | Yellow | Cannot begin — query intelligence must be verified |
| R13 2+ eval cycles | Internal | Yellow | Blocks R11 mutations (P0 prerequisite) |
| SQLite 3.35.0+ | External | Green | Required for `DROP COLUMN` rollback |
| Checkpoint infrastructure | Internal | Green | Recommended before sprint start |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: R1 MRR@5 regression >2%; R11 noise >5%; FTS5 contamination detected; schema migration failure
- **Procedure**: Disable flags, clear `learned_triggers` column, restore from checkpoint if needed
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (R1 MPAB) ──────────────────┐
                                      ├──► Phase 4 (Verify)
Phase 2 (R11 Learned Feedback) ──────┤
                                      │
Phase 3 (R13-S2 Shadow Scoring) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (R1) | Sprint 3 exit gate | Phase 4 |
| Phase 2 (R11) | Sprint 3 exit gate, R13 2+ eval cycles | Phase 4 |
| Phase 3 (R13-S2) | Sprint 3 exit gate | Phase 4 |
| Phase 4 (Verify) | Phase 1, Phase 2, Phase 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: R1 MPAB | Medium | 8-12h |
| Phase 2: R11 Learned Feedback | High | 16-24h |
| Phase 3: R13-S2 Shadow Scoring | Medium-High | 15-20h |
| Phase 4: Verification | Low | included |
| **Total** | | **39-56h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Checkpoint created before sprint start
- [ ] R13 2+ eval cycles verified (P0 gate)
- [ ] Feature flags configured and defaulting to OFF
- [ ] Schema backup taken

### Rollback Procedure
1. Disable flags: `SPECKIT_DOCSCORE_AGGREGATION`, `SPECKIT_LEARN_FROM_SELECTION`
2. Clear `learned_triggers` column: `UPDATE memory_index SET learned_triggers = '[]'`
3. R1 is independently rollbackable — flag controls aggregation
4. Verify metrics return to pre-sprint values
5. If schema rollback needed: `ALTER TABLE memory_index DROP COLUMN learned_triggers` (SQLite 3.35.0+)

### Rollback Risk: MEDIUM-HIGH
- R11 schema change requires SQLite 3.35.0+ for `DROP COLUMN`
- R1 independent rollback (flag only) estimated at 1-2h
- Full rollback including schema revert estimated at 4-6h

### Data Reversal
- **Has data migrations?** Yes — `ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'`
- **Reversal procedure**: `ALTER TABLE memory_index DROP COLUMN learned_triggers` (SQLite 3.35.0+) or restore from checkpoint
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN — Phase 5 of 8
- Core + L2 addendums (Phase deps, Effort, Enhanced rollback)
- Sprint 4: Feedback Loop
-->
