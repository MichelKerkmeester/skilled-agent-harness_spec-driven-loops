---
title: "Implementation Plan: Sprint 3 — Query Intelligence"
description: "Query complexity routing, RSF evaluation, and channel min-representation implementation plan."
trigger_phrases:
  - "sprint 3 plan"
  - "query intelligence plan"
  - "complexity router plan"
  - "RSF plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Sprint 3 — Query Intelligence

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
| **Testing** | Jest |
| **Feature Flags** | `SPECKIT_COMPLEXITY_ROUTER`, `SPECKIT_RSF_FUSION`, `SPECKIT_CHANNEL_MIN_REP` |

### Overview

Implement a query complexity router that classifies queries into 3 tiers (simple/moderate/complex) and routes to appropriate channel subsets for latency optimization. Evaluate Relative Score Fusion as an alternative to RRF across all 3 fusion variants with shadow comparison on 100+ queries. Enforce channel min-representation post-fusion to guarantee retrieval diversity.

### Architecture

Query classifier --> tier routing --> channel subset selection --> fusion (RRF or RSF) --> R2 enforcement
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Sprint 2 exit gate)

### Definition of Done
- [ ] All acceptance criteria met (REQ-S3-001 through REQ-S3-003)
- [ ] Tests passing (10-14 new tests)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Off-ramp evaluation documented
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline extension — classifier stage prepended to existing pipeline; RSF runs as shadow alongside RRF; R2 appended post-fusion.

### Key Components
- **Query Classifier**: Classifies queries into simple/moderate/complex based on query features (length, term count, trigger phrase presence)
- **Tier Router**: Maps classification to channel subset (simple=2 channels, moderate=3-4, complex=5)
- **RSF Engine**: All 3 fusion variants (single-pair, multi-list, cross-variant) running in shadow mode
- **R2 Enforcer**: Post-fusion min-representation with quality floor 0.2, only for channels that returned results

### Data Flow
1. Query enters classifier --> tier assigned
2. Tier router selects channel subset (min 2 channels)
3. Selected channels execute in parallel
4. RRF fuses results (RSF runs shadow)
5. R2 enforcer checks channel representation in top-k
6. Results returned with classification metadata
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: R15 Query Complexity Router (10-16h)
- [ ] Design classifier features (query length, term count, trigger presence, semantic complexity)
- [ ] Implement 3-tier classification logic
- [ ] Implement tier-to-channel-subset routing (min 2 channels enforced)
- [ ] Add feature flag `SPECKIT_COMPLEXITY_ROUTER`
- [ ] Wire into pipeline entry point
- [ ] Verify p95 <30ms for simple queries

### Phase 2: R14/N1 Relative Score Fusion (10-14h)
- [ ] Implement RSF single-pair variant (foundation)
- [ ] Implement RSF multi-list variant
- [ ] Implement RSF cross-variant variant
- [ ] Add feature flag `SPECKIT_RSF_FUSION`
- [ ] Shadow mode: RSF runs alongside RRF, results logged but not used

### Phase 3: R2 Channel Min-Representation (6-10h)
- [ ] Implement post-fusion channel representation check
- [ ] Add quality floor (0.2 threshold)
- [ ] Only enforce for channels that returned results
- [ ] Add feature flag `SPECKIT_CHANNEL_MIN_REP`
- [ ] Verify top-3 precision within 5% of baseline

### Phase 4: Shadow Comparison + Verification
- [ ] Run RSF vs RRF shadow comparison on 100+ queries
- [ ] Compute Kendall tau correlation
- [ ] Document RSF decision (tau <0.4 = reject RSF)
- [ ] Run off-ramp evaluation (MRR@5, constitutional, cold-start)
- [ ] Sprint 3 exit gate verification
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | R15 classification accuracy (10+ queries/tier) | Jest | 4-6 tests |
| Unit | R15 minimum 2-channel enforcement | Jest | 1-2 tests |
| Unit | R14/N1 all 3 RSF variants | Jest | 3-4 tests |
| Unit | R2 empty channels + quality floor | Jest | 2-3 tests |
| Integration | RSF shadow comparison (100+ queries) | Jest + eval infra | 1 test |

**Total**: 10-14 new tests (350-500 LOC)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 2 exit gate | Internal | Yellow | Cannot begin — scoring calibration must be verified |
| Eval infrastructure (R13-S1) | Internal | Green | Required for shadow comparison metrics |
| Feature flag system | Internal | Green | Required for all 3 flags |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: R15 misclassification causes >5% recall degradation; RSF diverges significantly from RRF; R2 degrades precision >5%
- **Procedure**: Disable 3 flags together (R15+R2+R14/N1 interact); verify independent rollback behavior
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (R15 Router) ──────┐
                            ├──► Phase 3 (R2 Min-Rep) ──► Phase 4 (Shadow + Verify)
Phase 2 (R14/N1 RSF) ──────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (R15) | Sprint 2 exit gate | Phase 3, Phase 4 |
| Phase 2 (R14/N1) | Sprint 2 exit gate | Phase 4 |
| Phase 3 (R2) | Phase 1 | Phase 4 |
| Phase 4 (Shadow) | Phase 1, Phase 2, Phase 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: R15 Router | Medium | 10-16h |
| Phase 2: R14/N1 RSF | Medium | 10-14h |
| Phase 3: R2 Min-Rep | Low-Medium | 6-10h |
| Phase 4: Shadow + Verify | Low | included |
| **Total** | | **26-40h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Sprint 2 exit gate verified
- [ ] All 3 feature flags configured and defaulting to OFF
- [ ] Eval infrastructure operational for shadow comparison

### Rollback Procedure
1. Disable all 3 flags: `SPECKIT_COMPLEXITY_ROUTER`, `SPECKIT_RSF_FUSION`, `SPECKIT_CHANNEL_MIN_REP`
2. Verify full 5-channel pipeline resumes for all queries
3. Verify independent flag rollback (3-5h testing)
4. Check eval metrics for regression confirmation

### Rollback Risk: MEDIUM
- R15+R2+R14/N1 interact — must verify each flag can be independently disabled
- Independent rollback testing estimated at 3-5h

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no schema changes in Sprint 3
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN — Phase 4 of 8
- Core + L2 addendums (Phase deps, Effort, Enhanced rollback)
- Sprint 3: Query Intelligence
-->
