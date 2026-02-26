---
title: "Implementation Plan: Hybrid RAG Fusion Refinement"
description: "7 metric-gated sprints transforming the spec-kit memory MCP server from a 3-channel system with dormant graph to a 5-channel graph-differentiated, feedback-aware retrieval engine."
trigger_phrases:
  - "hybrid rag plan"
  - "sprint implementation"
  - "metric-gated sprints"
  - "retrieval refinement plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Hybrid RAG Fusion Refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | MCP Server (spec-kit memory context-server v1.7.2) |
| **Storage** | SQLite (primary) + sqlite-vec + FTS5 + new `speckit-eval.db` |
| **Testing** | Jest (158+ existing tests) |

### Overview

This plan implements 30 recommendations across 7 metric-gated sprints (270-395h), transforming the spec-kit memory MCP server's retrieval pipeline. Three non-negotiable principles govern execution: (1) **Evaluation First** — R13 gates all downstream signal improvements; (2) **Density Before Deepening** — edge creation precedes graph traversal sophistication; (3) **Calibration Before Surgery** — score normalization before pipeline refactoring.

### Design Principles

1. **Subsystem coherence** — Maximum 2 subsystems per sprint (minimizes context-switching)
2. **Measure-then-enable** — Build behind flags, measure via R13, then enable
3. **True dependencies only** — Soft dependencies do not block building, only enabling
4. **Go/no-go gates** — Data-driven criteria between sprints, not time-based
5. **Build vs enable separation** — All scoring changes built behind feature flags, enabled by data
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Research synthesis complete (142-FINAL analysis + recommendations)
- [ ] BM25 contingency documented with decision matrix
- [ ] All P0 bug fixes identified with verified code locations
- [ ] Feature flag governance rules established

### Definition of Done (Per Sprint)
- [ ] Sprint exit gate metrics met
- [ ] All new tests pass + 158+ existing tests pass
- [ ] Dark-run comparison shows no regressions (for scoring changes)
- [ ] Feature flag count remains <= 6
- [ ] tasks.md updated with completion status
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Multi-channel hybrid retrieval with staged pipeline processing

### Key Components

- **Candidate Generation (5 channels)**: Vector similarity, FTS5 full-text, BM25 keyword, graph traversal, typed-degree scoring
- **Fusion Layer**: RRF (current) with RSF alternative (R14/N1) — intent-weighted channel combination
- **Reranking**: Cross-encoder reranking + MMR diversity enforcement + MPAB chunk aggregation
- **Post-Processing**: State filtering, session dedup, constitutional guarantee, channel attribution
- **Evaluation Infrastructure**: Separate SQLite DB (`speckit-eval.db`) with 5-table schema for metrics, ground truth, and channel attribution
- **Scoring**: Composite scoring (6 factors: importance, temporal, structural freshness, co-activation, state, cognitive) calibrated to [0,1]

### Data Flow

```
Query → Intent Classification → Complexity Routing (R15)
  → Candidate Generation (5 channels)
    → Fusion (RRF/RSF with intent weights)
      → Rerank (cross-encoder + MMR + MPAB)
        → Filter + Annotate (state, session, constitutional)
          → Results + Channel Attribution
                    ↓
          Eval Logging (R13) → Metrics
```

### Architectural Invariant: Dual Scoring Is Calibration, Not Architecture

The dual scoring systems (RRF ~[0, 0.07] and composite ~[0, 1]) correctly measure orthogonal dimensions:
- **System A (RRF)**: Query-dependent relevance — how well does this memory match THIS query?
- **System B (Composite)**: Query-independent value — how important is this memory in general?

The ~15:1 magnitude mismatch is a calibration problem (normalize both to [0,1]), not an architectural defect requiring pipeline surgery. This distinction reduces cost and risk by 10x. See research/142 - FINAL-analysis §5.

### Stage 4 Invariant

After pipeline refactor (R6), Stage 4 NEVER changes scores or ordering. Stages 1-3 handle ALL score computation. Stage 4 is exclusively filtering and formatting. This prevents recurrence of the double-weighting anti-pattern. See research/142 - FINAL-recommendations §3, Sprint 5.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Sprint 0: Epistemological Foundation [BLOCKING]

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 0.1 | **G1:** Fix graph channel ID format | 3-5 | Graph | — |
| 0.2 | **G3:** Fix chunk collapse dedup | 2-4 | Search handlers | — |
| 0.3 | **R17:** Fan-effect divisor | 1-2 | Graph/co-activation | — |
| 0.4 | **R13-S1:** Eval DB + logging hooks + pipeline instrumentation | 20-28 | Evaluation (new) | `SPECKIT_EVAL_LOGGING` |
| 0.5 | **G-NEW-1:** BM25-only baseline measurement | 4-6 | Evaluation | — |
| | **Total** | **30-45h** | | |

**Exit Gate:**
- [ ] Graph hit rate > 0% (G1 verified)
- [ ] No duplicate chunk rows in default search mode (G3 verified)
- [ ] Baseline MRR@5, NDCG@10, Recall@20 computed for at least 50 queries
- [ ] BM25-only baseline MRR@5 recorded

**Partial Advancement:** G1+G3+R17 and R13-S1+G-NEW-1 are independent tracks. Sprint 1 (R4) MAY begin in parallel with R13-S1 completion — R4 can be *built and unit-tested* without eval infrastructure but MUST NOT be *enabled* until R13-S1 metrics are available.

**If gate fails:** Do not proceed. Escalate as infrastructure crisis.

**BM25 Contingency Decision (Sprint 0 Exit):**

| BM25 vs Hybrid MRR@5 | Action | Roadmap Impact |
|----------------------|--------|----------------|
| >= 80% of hybrid | PAUSE multi-channel optimization | Sprints 3-7 deferred |
| 50-80% of hybrid | PROCEED; rationalize to 3 channels | Scope may reduce |
| < 50% of hybrid | PROCEED with full roadmap | No change |

---

### Sprint 1: Graph Signal Activation

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 1.1 | **R4:** Typed-weighted degree as 5th RRF channel | 12-16 | Graph | `SPECKIT_DEGREE_BOOST` |
| 1.2 | Edge density measurement | 2-3 | Evaluation | — |
| 1.3 | **G-NEW-2:** Agent-as-consumer UX analysis | 8-12 | Evaluation | — |
| 1.4 | Enable R4 if dark-run passes | 0 | — | — |
| | **Total** | **22-31h** | | |

**Exit Gate:**
- [ ] R4 dark-run: no single memory appears in >60% of results
- [ ] R4 MRR@5 delta > +2% absolute (or +5% relative) vs Sprint 0 baseline
- [ ] Edge density measured: if < 0.5 edges/node, escalate R10 priority
- [ ] G-NEW-2: Agent consumption instrumentation active

**If gate fails:** Graph too sparse. Prioritize R10 for edge density.

---

### Sprint 2: Scoring Calibration + Operational Efficiency

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 2.1 | **R18:** Embedding cache for instant rebuild | 8-12 | Indexing | — |
| 2.2 | **N4:** Cold-start boost with exponential decay | 3-5 | Scoring | `SPECKIT_NOVELTY_BOOST` |
| 2.3 | **G2:** Investigate double intent weighting | 4-6 | Fusion | — |
| 2.4 | Score normalization (both systems to [0,1]) | 4-6 | Scoring | — |
| | **Total** | **19-29h** | | |

**Exit Gate:**
- [ ] R18 cache hit rate > 90% on re-index of unchanged content
- [ ] N4 dark-run: new memories surface without displacing highly relevant older results
- [ ] G2 resolved: fixed or documented as intentional
- [ ] Score distributions normalized to comparable ranges

---

### Sprint 3: Query Intelligence + Fusion Alternatives

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 3.1 | **R15:** Query complexity router | 10-16 | Pipeline | `SPECKIT_COMPLEXITY_ROUTER` |
| 3.2 | **R14/N1:** Relative Score Fusion parallel to RRF | 10-14 | Fusion | `SPECKIT_RSF_FUSION` |
| 3.3 | **R2:** Channel minimum-representation constraint | 6-10 | Fusion | `SPECKIT_CHANNEL_MIN_REP` |
| | **Total** | **26-40h** | | |

**Exit Gate:**
- [ ] R15 p95 latency for simple queries < 30ms
- [ ] R14/N1 shadow comparison: minimum 100 queries, Kendall tau computed
- [ ] R2 dark-run: top-3 precision within 5% of baseline

**OFF-RAMP MARKER: After Sprint 2+3 completion, evaluate "good enough" thresholds (MRR@5 >= 0.7, constitutional surfacing >= 95%, cold-start detection >= 90%). If all met, further sprints are optional.**

---

### Sprint 4: Feedback Loop + Chunk Aggregation

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 4.1 | **R1:** MPAB chunk-to-memory aggregation | 8-12 | Scoring | `SPECKIT_DOCSCORE_AGGREGATION` |
| 4.2 | **R11:** Learned relevance feedback (full safeguards) | 16-24 | Search handlers | `SPECKIT_LEARN_FROM_SELECTION` |
| 4.3 | **R13-S2:** Shadow scoring + channel attribution + ground truth Phase B | 15-20 | Evaluation | — |
| | **Total** | **39-56h** | | |

**Prerequisite:** R13 must have completed at least 2 full eval cycles.

**Exit Gate:**
- [ ] R1 dark-run: MRR@5 within 2%; no regression for N=1 memories
- [ ] R11 shadow log: < 5% noise rate in learned triggers
- [ ] R13-S2 operational: full A/B comparison infrastructure running

---

### Sprint 5: Pipeline Refactor + Spec-Kit Logic

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 5.1 | Checkpoint: `memory_checkpoint_create("pre-pipeline-refactor")` | — | — | — |
| 5.2 | **R6:** 4-stage pipeline refactor (dark-run) | 40-55 | Pipeline | `SPECKIT_PIPELINE_V2` |
| 5.3 | **R9:** Spec folder pre-filter | 5-8 | Pipeline | — |
| 5.4 | **R12:** Embedding-based query expansion | 10-15 | Search handlers | `SPECKIT_EMBEDDING_EXPANSION` |
| 5.5 | **S2:** Template anchor optimization | 5-8 | Spec-Kit logic | — |
| 5.6 | **S3:** Validation signals as retrieval metadata | 4-6 | Spec-Kit logic | — |
| | **Total** | **64-92h** | | |

**Internal Phasing:**
- **Phase A (Pipeline):** R6 pipeline refactor (40-55h) — checkpoint before start; 0 ordering differences gate
- **Phase B (Search + Spec-Kit):** R9, R12, S2, S3 (24-37h) — Phase A must pass "0 ordering differences" before Phase B begins

**Exit Gate:**
- [ ] R6 dark-run: identical result ordering on full eval corpus
- [ ] All 158+ tests pass
- [ ] R9 cross-folder queries produce identical results
- [ ] R12 expansion does not degrade simple query latency

---

### Sprint 6: Graph Deepening + Index Optimization

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 6.1 | **R7:** Anchor-aware chunk thinning | 10-15 | Indexing | — |
| 6.2 | **R16:** Encoding-intent capture | 5-8 | Indexing/scoring | `SPECKIT_ENCODING_INTENT` |
| 6.3 | **R10:** Auto entity extraction (gated on density) | 12-18 | Graph/indexing | `SPECKIT_AUTO_ENTITIES` |
| 6.4 | **N2 (4-6):** Graph centrality + community detection | 25-35 | Graph | — |
| 6.5 | **N3-lite:** Contradiction scan + Hebbian strengthening | 10-15 | Background/graph | `SPECKIT_CONSOLIDATION` |
| 6.6 | **S4:** Spec folder hierarchy as retrieval structure | 6-10 | Spec-Kit logic | — |
| | **Total** | **68-101h** | | |

**Internal Phasing:**
- **Phase A (Graph):** N2 items 4-6, N3-lite — 35-50h
- **Phase B (Indexing + Spec-Kit):** R7, R16, R10, S4 — 33-51h
- Phases A and B may run in parallel (non-overlapping subsystems)

**Exit Gate:**
- [ ] R7 Recall@20 within 10% of baseline
- [ ] R10 false positive rate < 20%
- [ ] N2 graph channel attribution > 10%
- [ ] N3-lite detects at least 1 known contradiction
- [ ] Feature flag count <= 6

---

### Sprint 7: Long Horizon (As Needed)

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 7.1 | **R8:** Memory summaries (only if > 5K memories) | 15-20 | Indexing | `SPECKIT_MEMORY_SUMMARIES` |
| 7.2 | **S1:** Smarter memory content generation | 8-12 | Spec-Kit logic | — |
| 7.3 | **S5:** Cross-document entity linking | 8-12 | Graph/indexing | — |
| 7.4 | **R13-S3:** Full reporting + ablation studies | 12-16 | Evaluation | — |
| 7.5 | Evaluate R5 (INT8 quantization) need | 2 | Decision gate | — |
| | **Total** | **45-62h** | | |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Sprint | New Tests | Test Focus | Est. Test LOC |
|--------|-----------|------------|---------------|
| S0 | 8-12 | G1 numeric IDs, G3 chunk dedup, R17 bounds, R13-S1 schema/hooks/metrics, G-NEW-1 BM25 path | 200-300 |
| S1 | 6-10 | R4 degree SQL, normalization, cache invalidation, constitutional exclusion; G-NEW-2 hooks | 250-400 |
| S2 | 8-12 | R18 cache hit/miss/eviction/model invalidation; N4 decay curve; G2 weight count; normalization | 200-350 |
| S3 | 10-14 | R15 classification accuracy (10+ queries/tier), 2-channel min; R14/N1 all 3 variants; R2 floor | 350-500 |
| S4 | 10-15 | R1 MPAB N=0/1/2/10, metadata; R11 column isolation/TTL/denylist/cap/eligibility; R13-S2 | 400-550 |
| S5 | 15-20 | R6 full corpus regression, stage boundaries, Stage 4 invariant; R9/R12/S2/S3 | 500-700 |
| S6 | 12-18 | R7 recall; R10 false positives; N2 attribution; N3-lite bounds/contradiction; S4 hierarchy | 350-500 |
| **Total** | **~70-100** | Approximately doubling the 158+ existing suite | **2250-3300** |

**Flag interaction testing (5 levels):** See research/142 - FINAL-recommendations §10.2 item 5.
- Level 1 (unit): Each flag in isolation — 24 tests, ~5 min
- Level 2 (pair): Documented interaction pairs — 12 pairs x 2 states, ~10 min
- Level 3 (group): Group A combinations — 256 tests, ~45 min
- Level 4 (cross-group): A x B critical paths — ~50 selected, ~2 hours
- Level 5 (phase): End state per sprint — manual validation, ~1 day each
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SQLite 3.35.0+ (DROP COLUMN support) | Internal | Green | S4 rollback requires manual column handling |
| sqlite-vec extension | Internal | Green | Vector search already operational |
| FTS5 extension | Internal | Green | Full-text search already operational |
| Jest test framework | Internal | Green | 158+ existing tests |
| BM25 channel | Internal | Green | Already operational (used in G-NEW-1) |

**All dependencies are internal.** No external services, APIs, or packages are required.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Sprint | Difficulty | Method | Time |
|--------|-----------|--------|------|
| S0 | LOW | Revert 3 functions; delete eval DB | 1-2h |
| S1 | LOW | Disable `SPECKIT_DEGREE_BOOST`; revert R4 | 1-2h |
| S2 | LOW | Drop cache table; disable `SPECKIT_NOVELTY_BOOST` | 2-3h |
| S3 | MEDIUM | Disable 3 flags together (R15+R2+R14/N1 interact) | 3-5h |
| S4 | MEDIUM-HIGH | Disable R11 flag; clear learned_triggers; R1 independent | 4-6h |
| S5 | HIGH | Restore from checkpoint (5.1); revert R6; re-run tests | 8-12h |
| S6 | HIGH | Edge deletions from N3-lite destructive; use `created_by` provenance | 12-20h |

**Key insight:** Always create `memory_checkpoint_create()` before Sprint 4 (R11 mutations), Sprint 5 (pipeline refactor), and Sprint 6 (graph mutations).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Sprint 0 (Foundation) ─────► Sprint 1 (Graph Signal) ─────► Sprint 2 (Calibration)
         │                            │                              │
         │ BM25 contingency          │ Edge density check          │
         │ decision at exit          │ at exit                     │
         ▼                            ▼                              ▼
    If BM25 >= 80%:              If sparse:                   Sprint 3 (Query Intel)
    PAUSE S3-S7                  escalate R10                        │
                                                                     │ OFF-RAMP
                                                                     ▼
                                                              Sprint 4 (Feedback)
                                                                     │ requires R13 2 cycles
                                                                     ▼
                                                              Sprint 5 (Pipeline)
                                                                     │ checkpoint before
                                                                     ▼
                                                              Sprint 6 (Graph Deep)
                                                                     │
                                                                     ▼
                                                              Sprint 7 (Long Horizon)
```

| Sprint | Depends On | Blocks |
|--------|------------|--------|
| S0 | None | S1, S2, S3 (all via exit gate) |
| S1 | S0 exit gate | S2 |
| S2 | S1 exit gate | S3 |
| S3 | S2 exit gate | S4 (+ off-ramp check) |
| S4 | S3 exit gate + R13 2 cycles | S5 |
| S5 | S4 exit gate | S6 |
| S6 | S5 exit gate | S7 |
| S7 | S6 exit gate | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Sprint | Complexity | Estimated Effort |
|--------|------------|------------------|
| Sprint 0: Epistemological Foundation | High (blocking) | 30-45h |
| Sprint 1: Graph Signal Activation | Medium | 22-31h |
| Sprint 2: Scoring Calibration | Medium | 19-29h |
| Sprint 3: Query Intelligence | Medium-High | 26-40h |
| Sprint 4: Feedback Loop | High | 39-56h |
| Sprint 5: Pipeline Refactor | Very High | 64-92h |
| Sprint 6: Graph Deepening | Very High | 68-101h |
| Sprint 7: Long Horizon | Medium | 45-62h |
| **Total (S0-S6)** | | **268-394h** |
| **Total (S0-S7)** | | **313-456h** |

**Resource Planning:**
- Solo developer (~15h/week): 18-26 weeks (S0-S6)
- Dual developers: 9-13 weeks (independent tracks A-G assigned)
- Critical path: G1→R4→R13-S1→R14/N1→R6 = ~90-125h sequential regardless of parallelism
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `memory_checkpoint_create()` before Sprint 4, 5, and 6
- [ ] Feature flags configured for all scoring changes
- [ ] R13 eval logging active before any dark-run

### Rollback Procedure
1. Disable relevant feature flag(s) — immediate effect
2. If schema changes: restore from backup or clear new columns
3. Verify rollback via 158+ test suite + R13 eval metrics
4. Update tasks.md with rollback status

### Schema Changes Inventory

| Sprint | Change | Rollback Method |
|--------|--------|-----------------|
| S0 | `CREATE DATABASE speckit-eval.db` (5 tables) | Delete file |
| S2 | `CREATE TABLE embedding_cache` | `DROP TABLE embedding_cache` |
| S4 | `ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'` | `DROP COLUMN` (SQLite 3.35.0+) |

### Migration Protocol (8 Rules)
1. Backup before migration
2. Nullable with defaults on all new columns
3. Forward-compatible reads (handle column not existing)
4. Separate database preference for new subsystems
5. Migration ordering: S0 eval independent, S2 cache independent, S4 depends on S0 eval operational
6. No destructive migrations (never DROP COLUMN in forward path)
7. Atomic execution — failure = full rollback
8. Version tracking via `schema_version` table or pragma
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
                     G1 (Fix graph IDs) ──── URGENT, UNBLOCKS GRAPH
                      │
                      ▼
                     R4 (Degree channel) ──── can build before R13
                      │
                      ▼
              R13-S1 (Eval Sprint 1) ──── ENABLE R4 based on data
             /    │    \       \
            ▼     ▼     ▼       ▼
          R1    R14/N1  R11    R15 (all measurable via R13)
                                │
                                ▼
                          R12 (suppressed when R15 = "simple")

  INDEPENDENT TRACKS (no cross-dependencies):

  Track A (Quick wins):       G3, R17, N4, R18
  Track B (Graph):            G1 → R4 → N2(4-6)
  Track C (Measurement):      R13-S1 → R13-S2 → R13-S3
  Track D (Scoring tweaks):   R1, R14/N1, R2, R16
  Track E (Pipeline/Index):   R6, R7, R8, R9 (all independent of each other)
  Track F (Feedback loop):    R11 (needs R13 data accumulation, not R13 code)
  Track G (Advanced):         R10 (gated on density), N3, S1-S5
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| G1 (graph ID fix) | None | Functional graph channel | R4, all graph work |
| R4 (degree channel) | G1 | 5th RRF channel | N2, graph deepening |
| R13-S1 (eval core) | None | Metrics, BM25 baseline | R4 enable, R11, R14/N1 |
| R6 (pipeline refactor) | R13-S1 (for measurement) | Staged pipeline | Sprint 6 work |
| R11 (learned feedback) | R13-S1 (query provenance) | Feedback loop | N/A |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **G1** (Fix graph IDs) — 3-5h — CRITICAL
2. **R4** (Typed-degree channel) — 12-16h — CRITICAL
3. **R13-S1** (Eval infrastructure) — 25-35h — CRITICAL
4. **R14/N1** (Relative Score Fusion) — 10-14h — CRITICAL
5. **R6** (Pipeline refactor) — 40-55h — CRITICAL

**Total Critical Path**: 90-125h

**Parallel Opportunities**:
- Track A (G3, R17, N4, R18) runs entirely in parallel with critical path
- Track C (R13 phases) can begin during Sprint 0 alongside bug fixes
- Track D (scoring tweaks) parallelizes with Track B (graph work)
- Sprint 6 Phase A and Phase B run in parallel (non-overlapping subsystems)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M0 | Sprint 0 Complete | Graph functional, eval baseline recorded, BM25 compared | S0 exit |
| M1 | Sprint 0+1 Complete | 5-channel hybrid operational with measurable graph signal | S1 exit |
| **M2** | **Sprint 2+3 Complete (Recommended Stop)** | **Calibrated scoring, cold-start, query routing, RSF evaluated** | **S3 exit** |
| M3 | Sprint 4+5 Complete | Feedback loop closed, pipeline refactored | S5 exit |
| M4 | Sprint 6+7 Complete | Graph deepened, long-horizon features, full optimization | S7 exit |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Calibration, Not Architecture

**Status**: Accepted

**Context**: The dual scoring systems (RRF ~[0, 0.07] and composite ~[0, 1]) were diagnosed as "disconnected systems requiring architectural integration."

**Decision**: Treat as a calibration problem (normalize both to [0,1] scale), not an architectural defect requiring pipeline surgery.

**Consequences**:
- ~50 LOC score normalization vs 400+ LOC pipeline refactor
- Lower risk, more reversible
- R6 pipeline refactor becomes optional optimization, not prerequisite

**Alternatives Rejected**:
- Full pipeline merge: 10x cost increase, higher regression risk

### ADR-002: Metric-Gated Sprints Over Risk Phases

**Status**: Accepted

**Context**: Original roadmap proposed 4 risk-grouped phases. Each phase mixed 3-4 subsystems.

**Decision**: Use 7 metric-gated sprints with max 2 subsystems each and data-driven go/no-go gates.

**Consequences**:
- Reduced context-switching (subsystem coherence)
- Built-in off-ramps at every sprint boundary
- Each sprint independently verifiable

**Alternatives Rejected**:
- 4 risk-grouped phases: lacked go/no-go criteria; 3-4 subsystem context switches per phase

### ADR-003: Density Before Deepening

**Status**: Accepted

**Context**: Original roadmap sequenced graph traversal sophistication (centrality, communities) before edge density work.

**Decision**: Fix G1 → Measure graph density → If sparse, prioritize R10 → Only then invest in centrality/communities.

**Consequences**:
- Prevents investment in sophistication over a sparse graph
- R10 priority dynamically determined by density measurement
- N2 items 4-6 deferred to Sprint 6 (gated on density > 1.0)

### ADR-004: Evaluation First

**Status**: Accepted

**Context**: System has 15+ scoring signals with zero retrieval quality metrics.

**Decision**: R13 (evaluation infrastructure) is the epistemological prerequisite. No scoring change goes live without pre/post measurement.

**Consequences**:
- Sprint 0 is blocking — nothing proceeds without eval capability
- Every recommendation becomes testable
- BM25 baseline reveals whether hybrid system earns its complexity

### ADR-005: Separate learned_triggers Column

**Status**: Accepted

**Context**: R11's `[learned:]` prefix is stripped by FTS5 tokenizer, causing irreversible contamination of lexical search.

**Decision**: Store learned triggers in a separate `learned_triggers` column (not indexed by FTS5), not appended to `trigger_phrases`.

**Consequences**:
- Eliminates FTS5 contamination risk entirely
- Separate TTL, weight, and cleanup logic
- Requires schema migration (S4) but reversible

**Alternatives Rejected**:
- Prefix-based marking in trigger_phrases: FTS5 strips brackets, contamination irreversible

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Sprint**: S0
**Duration**: 30-45h
**Agent**: Primary (sequential — blocking prerequisites)
**Rationale**: G1, G3, R17 are bug fixes requiring careful verification. R13-S1 establishes measurement infrastructure. No parallelization within Sprint 0.

### Tier 2: Parallel Execution
| Track | Focus | Sprints | Items |
|-------|-------|---------|-------|
| Track A | Quick wins + Scoring | S0-S2 | G3, R17, N4, R18 |
| Track B | Graph | S0-S6 | G1 → R4 → N2(4-6) |
| Track C | Measurement + Feedback | S0-S7 | R13-S1 → R13-S2 → R13-S3 |
| Track D | Pipeline + Advanced | S3-S6 | R15, R6, R7, R8, R9 |

**Sync Points**: Sprint exit gates serve as sync points between tracks.

### Tier 3: Integration
**Agent**: Primary
**Task**: Sprint exit gate verification, off-ramp decisions, BM25 contingency
**Trigger**: After each sprint completion, before next sprint begins
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Sprints | Status |
|----|------|-------|---------|--------|
| W-A | Quick Wins + Scoring | Primary | S0-S2 | Pending |
| W-B | Graph Activation + Deepening | Primary | S0-S1, S6 | Pending |
| W-C | Measurement + Feedback | Primary | S0-S4, S7 | Pending |
| W-D | Pipeline + Spec-Kit | Primary | S3, S5-S6 | Pending |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | Sprint 0 exit gate | All workstreams | BM25 contingency decision |
| SYNC-002 | Sprint 1 exit gate | W-B, W-C | Edge density assessment |
| SYNC-003 | Sprint 3 exit gate | All workstreams | Off-ramp decision |
| SYNC-004 | Sprint 5 exit gate | W-D | Pipeline V2 go/no-go |

### File Ownership Rules
- Each recommendation targets specific subsystem files
- Cross-subsystem changes (R11 touching Search + Evaluation) require sprint-level coordination
- Conflicts resolved at sprint exit gate reviews
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Sprint**: Status update in tasks.md + exit gate verification
- **Per Sprint**: R13 metrics dashboard review
- **At Off-Ramp (S3)**: "Good enough" threshold evaluation
- **Blockers**: Immediate escalation to Project Lead

### Escalation Path
1. Sprint gate failure → Investigate root cause; attempt 1 fix cycle → If persistent, escalate
2. BM25 contingency (>= 80%) → Architecture review before Sprint 1+
3. R6 ordering regression → Revert to checkpoint; evaluate off-ramp
4. Feature flag count > 6 → Mandatory sunset audit
<!-- /ANCHOR:communication -->

---

<!--
LEVEL 3+ PLAN
- Core + L2 + L3 + L3+ addendums
- AI execution framework, workstream coordination
- Full communication plan
- 7 metric-gated sprints with ADRs
-->
