---
title: "Implementation Plan: Sprint 6 — Graph Deepening"
description: "Graph centrality, community detection, N3-lite consolidation, anchor-aware thinning, encoding-intent capture, auto entity extraction, and spec folder hierarchy."
trigger_phrases:
  - "sprint 6 plan"
  - "graph deepening plan"
  - "consolidation plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Sprint 6 — Graph Deepening

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
| **Storage** | SQLite (better-sqlite3), FTS5, sqlite-vec |
| **Testing** | Jest |

### Overview

This plan implements Sprint 6 — graph deepening and indexing optimization. Two internal phases run in parallel: Phase A (Graph) covers N2 centrality/community detection and N3-lite consolidation (contradiction scan, Hebbian strengthening, staleness detection). Phase B (Indexing + Spec-Kit) covers R7 anchor-aware chunk thinning, R16 encoding-intent capture, R10 auto entity extraction (gated on density), and S4 spec folder hierarchy retrieval. Total effort: 68-101h.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Sprint 5 pipeline refactor complete and exit gate passed
- [ ] Evaluation infrastructure operational (from Sprint 0)
- [ ] Edge density measured (determines R10 gating)
- [ ] Checkpoint created before sprint start

### Definition of Done
- [ ] Sprint 6 exit gate passed — all requirements verified
- [ ] 12-18 new tests added and passing
- [ ] All existing tests still passing
- [ ] Active feature flag count <=6
- [ ] All health dashboard targets checked
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two parallel internal phases converging at sprint exit gate

### Key Components
- **Graph analysis module** (Phase A): Centrality algorithms (betweenness/PageRank), community detection, channel attribution scoring
- **Consolidation module** (Phase A): N3-lite — weekly contradiction scan (~40 LOC), Hebbian edge strengthening (~20 LOC), staleness detection (~15 LOC)
- **Indexing pipeline** (Phase B): R7 anchor-aware chunk thinning, R16 encoding-intent metadata capture
- **Entity extraction module** (Phase B): R10 auto entity extraction with density gating and `created_by='auto'` tagging
- **Spec-kit retrieval** (Phase B): S4 spec folder hierarchy traversal for structured retrieval

### Data Flow
1. **Phase A (Graph)**: N2 centrality/community → graph scoring enhancement → N3-lite consolidation (weekly batch)
2. **Phase B (Indexing)**: R7 anchor-aware thinning → R16 intent capture → R10 entity extraction (if gated) → S4 hierarchy traversal
3. **Convergence**: Both phases verified via Sprint 6 exit gate metrics

### N3-lite Implementation Details
1. **Contradiction scan** (weekly): Find memory pairs with similarity >0.85, check for conflicting conclusions (~40 LOC)
2. **Hebbian strengthening**: +0.05 per validation cycle, MAX_STRENGTH_INCREASE=0.05, 30-day decay of 0.1 (~20 LOC)
3. **Staleness detection** (weekly): Flag edges unfetched for 90+ days (~15 LOC)
4. **Edge growth bounds**: MAX_EDGES_PER_NODE=20, auto edges capped at strength=0.5, all auto-edges track `created_by`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Graph (N2 + N3-lite) — 35-50h
- [ ] N2 items 4-6: Implement graph centrality + community detection (25-35h)
- [ ] N3-lite: Implement contradiction scan + Hebbian strengthening + staleness detection with edge caps (10-15h)

### Phase B: Indexing + Spec-Kit (R7, R16, R10, S4) — 33-51h
- [ ] R7: Implement anchor-aware chunk thinning (10-15h)
- [ ] R16: Implement encoding-intent capture behind `SPECKIT_ENCODING_INTENT` flag (5-8h)
- [ ] R10: Implement auto entity extraction behind `SPECKIT_AUTO_ENTITIES` flag — gated on density <1.0 (12-18h)
- [ ] S4: Implement spec folder hierarchy as retrieval structure (6-10h)

### R10 Gating
- Only implement if Sprint 1 exit showed edge density <1.0 edges/node
- If density >=1.0, skip R10 and document decision

### Phase Parallelization
- Phase A and Phase B may run in parallel — no dependencies between them
- Phase A operates on graph subsystem only; Phase B operates on indexing/retrieval
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | R7 recall verification, anchor-aware thinning logic | Jest | 2-3 tests |
| Unit | R10 entity extraction, FP rate, density gating | Jest | 2-3 tests |
| Unit | N2 centrality computation, community detection | Jest | 2-3 tests |
| Unit | N3-lite contradiction scan, Hebbian bounds/caps, staleness | Jest | 3-4 tests |
| Unit | S4 hierarchy traversal | Jest | 1-2 tests |
| Integration | N2 attribution in end-to-end retrieval | Jest | 1-2 tests |
| Integration | R7 + R16 combined indexing pipeline | Jest | 1-2 tests |

**Total**: 12-18 new tests, estimated 350-500 LOC
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 5 pipeline refactor | Internal | Green (assumed) | Blocks all Sprint 6 work |
| Evaluation infrastructure (Sprint 0) | Internal | Green (assumed) | Cannot verify metrics |
| Edge density measurement (Sprint 1) | Internal | Green (assumed) | Cannot determine R10 gating |
| better-sqlite3 | Internal | Green | Required for graph operations |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N3-lite edge mutations cause data corruption, R10 FP rate exceeds threshold, or flag count exceeds 6
- **Procedure**: Disable feature flags (`SPECKIT_CONSOLIDATION`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_ENCODING_INTENT`), selectively remove auto-created edges via `created_by='auto'` tag, restore from pre-sprint checkpoint
- **Estimated time**: 12-20h (HIGH rollback difficulty due to edge mutations)
- **Difficulty**: HIGH — edge deletions from N3-lite are destructive; R10 auto-entities tagged with `created_by='auto'` for selective removal
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A (Graph) ──────────────────────┐
  N2 centrality/community (25-35h)   │
  N3-lite consolidation (10-15h)     ├──► Sprint 6 Exit Gate
                                      │
Phase B (Indexing + Spec-Kit) ────────┘
  R7 (10-15h) ─┐
  R16 (5-8h) ──┤── all parallelizable
  R10 (12-18h) ┤
  S4 (6-10h) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase A (Graph) | Sprint 5 exit gate | Sprint 6 exit gate |
| Phase B (Indexing + Spec-Kit) | Sprint 5 exit gate | Sprint 6 exit gate |
| Sprint 6 Exit Gate | Phase A, Phase B | Sprint 7 (next sprint) |

**Note**: Phase A and Phase B are independent — they can execute in parallel. Items within Phase B are also parallelizable.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase A: N2 (items 4-6) | High | 25-35h |
| Phase A: N3-lite | Medium | 10-15h |
| Phase B: R7 | Medium | 10-15h |
| Phase B: R16 | Low | 5-8h |
| Phase B: R10 (gated) | Medium-High | 12-18h |
| Phase B: S4 | Low-Medium | 6-10h |
| **Total** | | **68-101h** |

**Note**: Checkpoint recommended before this sprint due to HIGH rollback difficulty.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Checkpoint created before sprint start
- [ ] Edge density measured (R10 gating decision)
- [ ] Feature flags configured: `SPECKIT_CONSOLIDATION`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_ENCODING_INTENT`
- [ ] All existing tests verified passing before changes
- [ ] Current feature flag count documented (must be <=6 post-sprint)

### Rollback Procedure
1. **Immediate**: Disable feature flags — `SPECKIT_CONSOLIDATION`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_ENCODING_INTENT`
2. **Selective cleanup**: Remove auto-created edges via `created_by='auto'` query
3. **Selective cleanup**: Remove auto-extracted entities via `created_by='auto'` query
4. **Full rollback**: Restore from pre-sprint checkpoint if selective cleanup insufficient
5. **Verify rollback**: Run full test suite + eval metrics comparison

### Data Reversal
- **Has data migrations?** Yes — N3-lite modifies edge strengths; R10 creates new entity nodes/edges
- **Reversal procedure**: `created_by` provenance field enables selective removal of all auto-created/modified edges and entities. Full checkpoint restore available as fallback.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Plan**: See `../plan.md`

---

<!--
LEVEL 2 PLAN — Phase 7 of 8
- Core + L2 addendums (Phase Dependencies, Effort, Enhanced Rollback)
- Sprint 6: Graph deepening + indexing optimization
- Two parallel internal phases: Phase A (Graph) + Phase B (Indexing + Spec-Kit)
- HIGH rollback difficulty — checkpoint recommended
-->
