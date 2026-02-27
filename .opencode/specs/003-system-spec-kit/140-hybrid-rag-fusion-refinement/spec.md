---
title: "Feature Specification: Hybrid RAG Fusion Refinement"
description: "Graph channel broken (0% hit rate), dual scoring 15:1 mismatch, zero evaluation metrics. 43-recommendation program (+ 8 PageIndex-derived) across 8 metric-gated sprints to achieve graph-differentiated, feedback-aware retrieval."
trigger_phrases:
  - "hybrid rag fusion"
  - "graph channel fix"
  - "retrieval evaluation"
  - "spec-kit memory refinement"
  - "scoring calibration"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Hybrid RAG Fusion Refinement

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

The spec-kit memory MCP server's graph channel produces a 0% hit rate due to an ID format mismatch, its dual scoring systems have a 15:1 magnitude mismatch, and it has zero retrieval quality metrics despite 15+ scoring signals. This specification defines a 43-recommendation program (+ 8 PageIndex-derived recommendations, IDs PI-A1 through PI-B3) across 8 metric-gated sprints (343-516h for S0-S6, 388-596h including S7; +52-80h for PageIndex items) to transform the system into a graph-differentiated, feedback-aware retrieval engine with measurable quality.

**Key Decisions**: Evaluation first (R13 gates all improvements), calibration before surgery (normalize scores before pipeline refactor), density before deepening (edge creation before graph traversal sophistication).

**Critical Dependencies**: Sprint 0 exit gate (BM25 baseline) determines the trajectory of all subsequent sprints. Off-ramp recommended at Sprint 2+3.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 (Sprint 0), P1 (Sprints 1-3), P2 (Sprints 4-7) |
| **Status** | Draft |
| **Created** | 2026-02-26 |
| **Complexity** | 90/100 |
| **Branch** | `140-hybrid-rag-fusion-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The spec-kit memory MCP server suffers from three compounding failures: (1) the graph channel produces 0% hit rate in production due to an ID format mismatch (`mem:${edgeId}` strings vs numeric IDs), making the system operate as a 3-channel system despite being designed as 4-channel; (2) the dual scoring systems (RRF fusion ~[0, 0.07] and composite scoring ~[0, 1]) have a ~15:1 magnitude mismatch where composite dominates purely due to scale, not quality; (3) zero retrieval quality metrics exist despite 15+ implemented scoring signals, making every tuning decision speculation.

### Purpose

Transform the system into a measurably improving, graph-differentiated, feedback-aware retrieval engine where the graph channel — the most orthogonal signal — is fully activated, scoring is calibrated, and every improvement is validated by metric gates.

### Three Non-Negotiable Design Principles

1. **Evaluation First** (ADR-004) — R13 gates all downstream signal improvements. No scoring change goes live without pre/post measurement.
2. **Calibration Before Surgery** — Normalize scores before pipeline refactoring. The ~15:1 mismatch is calibration, not architecture.
3. **Density Before Deepening** (ADR-003) — Fix G1, measure graph density, prioritize edge creation before investing in graph traversal sophistication.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**43 active recommendations (+ 8 PageIndex-derived, PI-A1 — PI-B3) across 8 subsystems (S0-S7):**

| Subsystem | Recommendations | Sprint(s) |
|-----------|----------------|-----------|
| **Graph** | G1, R4, R10, N2 (items 4-6), N3-lite | S0, S1, S6 |
| **Search handlers** | G3, R12 | S0, S5 |
| **Evaluation (new)** | R13 (S1-S3), G-NEW-1, G-NEW-2, G-NEW-3 | S0-S4 |
| **Scoring** | R1, N4, R16 | S2, S4, S6 |
| **Fusion** | G2, R2, R14/N1 | S2, S3 |
| **Pipeline** | R6, R9, R15 | S3, S5 |
| **Indexing** | R7, R8, R18 | S2, S6, S7 |
| **Spec-Kit logic** | S1, S2, S3, S4, S5 | S5-S7 |
| **Memory quality** (NEW) | TM-01, TM-02, TM-03, TM-04, TM-05, TM-06, TM-08 | S0, S1, S2, S4, S5 |

### Out of Scope

- **R3 (SKIP)** — R5 subsumes normalization; irreversible data risk; sqlite-vec handles internally
- **R5 (DEFER)** — 5.32% recall loss significant; 3MB storage irrelevant at current scale; activation condition: 10K+ memories OR >50ms latency
- **N5 (DROP)** — Two-model ensemble doubles storage/cost; 4-5 channels already provide signal diversity
- **R6-Stage4 (PARKED)** — Post-process stage must NOT change scores; enforced via "no score changes in Stage 4" invariant
- **Gen5 "Self-Improving" (PARKED)** — Marketing language; requires R13 running 8+ weeks with demonstrated positive feedback signal
- **HNSW indexing** — Irrelevant below 10K memories
- **LLM calls in search hot path** — Latency budget violation (500ms p95 hard limit)

### Files to Change

| Subsystem | Key Files | Change Type |
|-----------|-----------|-------------|
| Graph | `graph-search-fn.ts`, `causal_edges` schema | Modify |
| Search handlers | `memory-search.ts`, `hybrid-search.ts` | Modify |
| Evaluation | `speckit-eval.db` (new), eval handlers | Create |
| Scoring | `composite-scoring.ts`, `co-activation.ts`, `vector-index-impl.ts` | Modify |
| Fusion | `rrf-fusion.ts`, `hybrid-search.ts`, `intent-classifier.ts`, `adaptive-fusion.ts` | Modify |
| Pipeline | `memory-search.ts` (refactored stages) | Modify |
| Indexing | `memory_index` schema, embedding pipeline | Modify |
| Spec-Kit logic | Template processing, validation handlers | Modify |
| Memory quality (NEW) | `memory-save.ts`, `composite-scoring.ts`, `fsrs-scheduler.ts`, `trigger-extractor.ts` | Modify |
<!-- /ANCHOR:scope -->

---

<!-- SPECKIT_ADDENDUM: Phase - Parent Section -->
<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Scope | Dependencies | Status |
|-------|--------|-------|--------------|--------|
| 1 | `001-sprint-0-epistemological-foundation/` | G1, G3, R17, R13-S1, G-NEW-1 (47-73h) | None (BLOCKING) | Pending |
| 2 | `002-sprint-1-graph-signal-activation/` | R4, A7, density measurement, G-NEW-2 (26-39h) | Sprint 0 gate | Pending |
| 3 | `003-sprint-2-scoring-calibration/` | R18, N4, G2, score normalization (28-43h) | Sprint 1 gate | Pending |
| 4 | `004-sprint-3-query-intelligence/` | R15, R14/N1, R2 (34-53h) | Sprint 2 gate | Pending |
| 5 | `005-sprint-4-feedback-loop/` | R1, R11, R13-S2 (72-109h) | Sprint 3 gate + R13 2 eval cycles | Pending |

> **Sprint 4 Split Recommendation:** Sprint 4 should be considered for decomposition into two sub-phases:
> - **S4a** (R1/MPAB + R13-S2 enhanced eval, ~25-35h): Lower-risk scoring and evaluation work that can proceed immediately after Sprint 3 gate.
> - **S4b** (R11 learned relevance feedback + TM-04 + TM-06, ~47-74h): Higher-risk work containing R11 with its CRITICAL FTS5 contamination risk (MR1). R11 should not share a sprint with 4 other deliverables given its irreversible failure mode. S4b also requires the R13 calendar dependency (minimum 28 days of eval logging before R11 activation).
> This split isolates R11's contamination risk and allows S4a to complete faster, providing R13-S2 channel attribution data earlier.
| 6 | `006-sprint-5-pipeline-refactor/` | R6, R9, R12, S2, S3 (68-98h) | Sprint 4 gate | Pending |
| 7 | `007-sprint-6-graph-deepening/` | R7, R16, R10, N2, N3-lite, S4 (68-101h) | Sprint 5 gate | Pending |
| 8 | `008-sprint-7-long-horizon/` | R8, S1, S5, R13-S3, R5 eval (45-62h) | Sprint 6 gate | Pending |

### Phase Transition Rules

- Each phase MUST pass its sprint exit gate (metric-gated) before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume 140-hybrid-rag-fusion-refinement/NNN-sprint-*/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- **HARD SCOPE CAP (Sprint 2+3)**: Sprints 0-3 constitute the approved scope. Sprints 4-7 require a NEW spec approval based on demonstrated need from Sprint 0-3 metrics. Approval must include: (a) evidence that remaining work addresses measured deficiencies identified by R13 evaluation data, (b) updated effort estimates based on Sprint 0-3 actuals (not original estimates), (c) updated ROI assessment comparing remaining investment to demonstrated improvements so far. Without this approval, Sprints 4-7 do not proceed.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-sprint-0 | 002-sprint-1 | Graph hit rate >0%, chunk dedup verified, BM25 baseline MRR@5 recorded, ground truth corpus meets diversity requirements (see below) | R13 eval metrics |

**Sprint 0 Ground Truth Diversity Requirement (HARD GATE):**
Ground truth corpus MUST include >=15 manually curated natural-language queries covering: graph relationship queries ("what decisions led to X?"), temporal queries ("what was discussed last week about Y?"), cross-document queries ("how does A relate to B?"), and hard negatives (queries where specific memories should NOT rank highly). Minimum: >=5 queries per intent type, >=3 query complexity tiers (simple single-concept, moderate multi-concept, complex cross-document/temporal). This diversity requirement is a hard exit gate criterion alongside the existing "at least 50 queries" minimum — both must be satisfied.
| 002-sprint-1 | 003-sprint-2 | R4 MRR@5 delta >+2% absolute, edge density measured | R13 eval metrics |
| 003-sprint-2 | 004-sprint-3 | Cache hit >90%, score distributions normalized, G2 resolved | R13 eval metrics |
| 004-sprint-3 | 005-sprint-4 | R15 p95 <30ms, RSF Kendall tau computed, R2 precision within 5% | R13 eval metrics |
| 005-sprint-4 | 006-sprint-5 | R1 MRR@5 within 2%, R11 noise <5%, R13-S2 operational | R13 eval metrics |
| 006-sprint-5 | 007-sprint-6 | R6 0 ordering differences, 158+ tests pass | R13 eval + test suite |
| 007-sprint-6 | 008-sprint-7 | Graph attribution >10%, N3-lite contradiction detection verified | R13 eval metrics |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Sprint |
|----|-------------|---------------------|--------|
| REQ-001 | **G1:** Fix graph channel ID format mismatch — convert `mem:${edgeId}` to numeric memory IDs at BOTH locations (`graph-search-fn.ts` lines 110 AND 151) | Graph channel contributes ≥1 result in top-10 for ≥5% of first 100 post-fix eval queries, logged in R13 channel_attribution | S0 |
| REQ-002 | **G3:** Fix chunk collapse conditional — dedup on all code paths including `includeContent=false` | No duplicate chunk rows in default search mode | S0 |
| REQ-003 | **R13-S1:** Evaluation infrastructure — separate SQLite DB with 5-table schema, logging hooks, core metrics (MRR@5, NDCG@10, Recall@20, Hit Rate@1) | Baseline metrics computed for at least 50 queries | S0 |
| REQ-004 | **G-NEW-1:** BM25-only baseline comparison | BM25 baseline MRR@5 recorded and compared to hybrid | S0 |
| REQ-035 | **B7:** Quality proxy formula for automated regression detection | Quality proxy formula operational for automated regression detection in Sprint 0 | S0 |
| REQ-036 | **D4:** Observer effect mitigation for R13 eval logging | Search p95 increase ≤10% with eval logging enabled | S0 |
| REQ-039 | **TM-02:** Content-hash fast-path deduplication — SHA256 hash check BEFORE embedding generation in memory_save pipeline | Hash check rejects exact duplicate on save; no duplicate content_hash entries in same spec_folder | S0 |
| REQ-005 | **R4:** Typed-weighted degree as 5th RRF channel with MAX_TYPED_DEGREE=15, MAX_TOTAL_DEGREE=50 | R4 dark-run passes; MRR@5 delta > +2% absolute; no single memory appears in >60% of results (hub domination check). **Prerequisite: G1 (REQ-001) must be complete before R4 activation.** Cross-ref: interacts with MR2 (preferential attachment), MR5 (degree cap), MR8 (three-way interaction with N3+R10). | S1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Sprint |
|----|-------------|---------------------|--------|
| REQ-006 | **R17:** Fan-effect divisor in co-activation scoring | Co-activation hub bias Gini coefficient decreases ≥15% vs pre-R17 baseline on 50-query eval set | S0 |
| REQ-007 | **R18:** Embedding cache for instant rebuild | Cache hit rate > 90% on re-index of unchanged content | S2 |
| REQ-008 | **N4:** Cold-start boost with exponential decay (12h half-life) | New memories (<48h) surface when relevant without displacing highly relevant older results | S2 |
| REQ-009 | **G2:** Investigate double intent weighting — determine if intentional | Resolved: fixed or documented as intentional design | S2 |
| REQ-010 | **R15:** Query complexity router (minimum 2 channels for simple queries) | Simple query p95 latency < 30ms | S3 |
| REQ-011 | **R14/N1:** Relative Score Fusion parallel to RRF (all 3 fusion variants) | Shadow comparison: minimum 100 queries, Kendall tau computed | S3 |
| REQ-012 | **R2:** Channel minimum-representation constraint (post-fusion, quality floor 0.2) | Dark-run top-3 precision within 5% of baseline | S3 |
| REQ-013 | **R1:** MPAB chunk-to-memory aggregation with N=0/N=1 guards | Dark-run MRR@5 within 2%; no regression for N=1 memories | S4 |
| REQ-014 | **R11:** Learned relevance feedback with separate `learned_triggers` column and 7 safeguards | Shadow log noise rate < 5%; FTS5 contamination test passes; learned triggers stored exclusively in `learned_triggers` column (never in `trigger_phrases`). Cross-ref: MR1 (CRITICAL FTS5 contamination), MR6 (R13 dependency), ADR-005 (separate column decision). **Calendar constraint:** R13 must have logged >=28 calendar days of eval data before R11 activation (see F10 in plan.md). | S4 |
| REQ-015 | **R13-S2:** Shadow scoring + channel attribution + ground truth Phase B | Full A/B comparison infrastructure operational | S4 |
| REQ-016 | **G-NEW-2:** Agent-as-consumer UX analysis + consumption instrumentation | R13 logs ≥5 distinct consumption-pattern categories with ≥10 query examples each; consumption instrumentation active | S1 |
| REQ-017 | **G-NEW-3:** Feedback bootstrap strategy (Phase A synthetic, Phase B implicit, Phase C LLM-judge) | Defined phases with minimum 200 query-selection pairs before R11 activation | S0/S4 |
| REQ-032 | **A7:** Co-activation boost strength increase (0.1x→0.25x) | Effective co-activation boost at hop 2 ≥15% | S1 |
| REQ-033 | **A4:** Negative feedback / confidence activation (demotion multiplier, floor=0.3) | `memory_validate(wasUseful: false)` causes measurable ranking reduction | S4 |
| REQ-034 | **B2:** Chunk ordering preservation in reassembly | Collapsed chunks appear in `chunk_index` order | S4 |
| REQ-037 | **A2:** Full-context ceiling evaluation (LLM baseline comparison) | Full-context ceiling MRR@5 recorded; 2x2 decision matrix (A2 × G-NEW-1) evaluated at Sprint 0 exit | S0 |
| REQ-038 | **B8:** Signal count ceiling governance (max 12 active scoring signals) | Signal ceiling policy documented and enforced; escape clause requires R13 orthogonal-value evidence | Cross-cutting |
| REQ-040 | **TM-01:** Interference scoring signal — negative weight penalizing memories with high-similarity competitors in same spec_folder | Interference score computed at index time; composite scoring includes -0.08 * interference factor behind feature flag | S2 |
| REQ-041 | **TM-03:** Classification-based decay policies — FSRS decay multipliers vary by context_type and importance_tier (decisions: no decay, temporary: fast decay) | Decay behavior differs measurably between context_types; decisions/constitutional memories show 0 decay over 30 days | S2 |
| REQ-042 | **TM-04:** Pre-storage quality gate — multi-layer validation pipeline (structural + content quality + semantic dedup) BEFORE embedding generation | Quality score computed for every save; saves below 0.4 threshold rejected; near-duplicates (>0.92 similarity) flagged | S4 |
| REQ-043 | **TM-06:** Reconsolidation-on-save — automatic duplicate/conflict/complement decision when saving memories similar to existing ones | Similarity >=0.88 merges (frequency increment); 0.75-0.88 replaces (with supersedes edge); <0.75 stores as new | S4 |
| REQ-044 | **TM-05:** Dual-scope injection strategy — memory auto-surface at multiple lifecycle points (context load, tool dispatch, compaction) | Memory injection hooks active at >=2 lifecycle points beyond explicit search | S5 |
| REQ-045 | **TM-08:** Importance signal vocabulary expansion — add CORRECTION and PREFERENCE signal categories to trigger extraction | Trigger extraction recognizes correction signals ("actually", "wait", "I was wrong") and preference signals ("prefer", "like", "want") | S1 |

### P2 - Desired (complete OR defer with documented reason)

| ID | Requirement | Acceptance Criteria | Sprint |
|----|-------------|---------------------|--------|
| REQ-018 | **R6:** 4-stage pipeline refactor with "no score changes in Stage 4" invariant | 0 ordering differences on eval corpus; 158+ tests pass. **Note: R6 is conditional — required only if Sprint 2 score normalization fails exit gate, OR Stage 4 invariant deemed architecturally necessary regardless.** | S5 |
| REQ-019 | **R9:** Spec folder pre-filter | Cross-folder queries produce identical results | S5 |
| REQ-020 | **R12:** Embedding-based query expansion (suppressed when R15="simple") | No degradation of simple query latency | S5 |
| REQ-021 | **S2:** Template anchor optimization | Anchor-aware retrieval metadata available | S5 |
| REQ-022 | **S3:** Validation signals as retrieval metadata | Validation metadata integrated in scoring | S5 |
| REQ-023 | **R7:** Anchor-aware chunk thinning | Recall@20 within 10% of baseline | S6 |
| REQ-024 | **R16:** Encoding-intent capture | Intent metadata captured at index time | S6 |
| REQ-025 | **R10:** Auto entity extraction (gated on edge density < 1.0) | False positive rate < 20% on manual review | S6 |
| REQ-026 | **N2 (items 4-6):** Graph centrality + community detection | Graph channel attribution increase > 10% | S6 |
| REQ-027 | **N3-lite:** Contradiction scan + Hebbian strengthening | Detects ≥50% of contradictions in curated 10-pair test set with FP rate <30% | S6 |
| REQ-028 | **S4:** Spec folder hierarchy as retrieval structure | Hierarchy traversal functional | S6 |

### P3 - Future (implement when conditions met)

| ID | Requirement | Acceptance Criteria | Sprint |
|----|-------------|---------------------|--------|
| REQ-029 | **R8:** Memory summary generation (only if > 5K memories) | Summary pre-filtering reduces search space | S7 |
| REQ-030 | **S1:** Smarter memory content generation | Content generation matches template schema for ≥95% of test cases | S7 |
| REQ-031 | **S5:** Cross-document entity linking | ≥3 cross-document entity links verified by manual review | S7 |

### PageIndex-Derived Recommendations (PI-A1 — PI-B3)

> **Research Evidence:** Derived from PageIndex research documents 9 (deep analysis: true-mem source code) and 10 (recommendations: true-mem patterns). These recommendations are ADDITIVE to the 43 core recommendations above.

#### Memory MCP Server (PI-A1 to PI-A5)

| ID | Recommendation | Formula / Mechanism | Sprint | Effort | Risk |
|----|----------------|---------------------|--------|--------|------|
| PI-A1 | **Folder-Level Relevance Scoring via DocScore Aggregation** — aggregate per-memory scores into a per-folder relevance signal | `FolderScore = (1/sqrt(M+1)) * SUM(MemoryScore(m))` where M = memory count; discounts over-represented folders | S2 | 4-8h | Low |
| PI-A2 | **Search Strategy Degradation with Fallback Chain** — 3-tier fallback when primary search returns insufficient results | Tier 1: full hybrid search → Tier 2: broadened (relaxed filters, lower threshold) → Tier 3: structural-only (trigger match + folder) | S3 | 12-16h | Medium |
| PI-A3 | **Pre-Flight Token Budget Validation** — enforce token budget constraint before result assembly, not after | Validate `SUM(token_count(m))` against budget limit before assembling final result set; truncate candidate list early | S1 | 4-6h | Low |
| PI-A4 | **Constitutional Memory as Expert Knowledge Injection** — format constitutional memories as retrieval directives, not just high-priority results | Inject constitutional memories as system-level context (domain knowledge) before ranked results; separate display slot | S4 | 8-12h | Low-Medium |
| PI-A5 | **Verify-Fix-Verify for Memory Quality** — bounded quality loop with fallback for memory_save validation | Verify quality → if below threshold, attempt auto-fix (trim, restructure) → re-verify → if still failing, save with warning flag (never drop silently) | S0 | 12-16h | Medium |

#### Spec-Kit Logic (PI-B1 to PI-B3)

| ID | Recommendation | Formula / Mechanism | Sprint | Effort | Risk |
|----|----------------|---------------------|--------|--------|------|
| PI-B1 | **Tree Thinning for Spec Folder Consolidation** — bottom-up merge of small spec files into parent | If `token_count(child) < MIN_CHILD_TOKENS` AND `token_count(parent + child) < MAX_MERGED_TOKENS`, merge child into parent section | S5 | 10-14h | Low |
| PI-B2 | **Progressive Validation for Spec Documents** — 4-level progressive fix pipeline for spec document validation | Level 1: schema check → Level 2: anchor integrity → Level 3: cross-reference validation → Level 4: semantic consistency; each level runs only if prior passes | S5 | 16-24h | Medium |
| PI-B3 | **Description-Based Spec Folder Discovery** — generate and cache a 1-sentence description per spec folder for search-time folder routing | At index time, generate `folder_description` = LLM summary of spec folder purpose; cache in spec folder index; use for pre-search folder routing | S3 | 4-8h | Low |

**PageIndex Totals by Sprint:**

| Sprint | PI Items | Added Effort |
|--------|----------|--------------|
| S0 | PI-A5 | +12-16h |
| S1 | PI-A3 | +4-6h |
| S2 | PI-A1 | +4-8h |
| S3 | PI-A2, PI-B3 | +16-24h |
| S4 | PI-A4 | +8-12h |
| S5 | PI-B1, PI-B2 | +26-38h |
| **Total** | **8 items** | **+70-104h** |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: MRR@5 improves +10-15% over Sprint 0 baseline by Sprint 6 completion
- **SC-002**: Graph channel hit rate exceeds 20% (from 0% baseline)
- **SC-003**: Channel diversity (unique sources in top-5) exceeds 3.0 (from ~2.0 baseline)
- **SC-004**: Search latency p95 remains < 300ms for complex queries (500ms hard limit)
- **SC-005**: Active feature flags remain at 6 or fewer at any time
- **SC-006**: Evaluation ground truth exceeds 500 query-relevance pairs
- **SC-007**: Graph edge density exceeds 1.0 edges/node
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Previously Missing Risks (MR1-MR7)

| Risk ID | Risk | Severity | Affected Recs | Mitigation |
|---------|------|----------|---------------|------------|
| MR1 | FTS5 trigger contamination from R11 — `[learned:]` prefix stripped by tokenizer; **irreversible** without full re-index | CRITICAL | R11 | Separate `learned_triggers` column (not indexed by FTS5) |
| MR2 | R4+N3 preferential attachment loop — well-connected memories get boosted, get more edges, get more boosted | HIGH | R4, N3 | MAX_TOTAL_DEGREE=50, MAX_STRENGTH_INCREASE=0.05/cycle, edge provenance tracking |
| MR3 | Feature flag explosion — 24 flags = 16.7M possible states; combinatorial testing impossibility | HIGH | All | Maximum 6 simultaneous flags; 90-day lifespan; governance rules (See research/142 - FINAL-recommendations §10) |
| MR4 | R1-MPAB div-by-zero at N=0 — `sqrt(0)` causes NaN propagation | HIGH | R1 | Guard clause: `if (scores.length <= 1) return scores[0] ?? 0` |
| MR5 | R4 MAX_TYPED_DEGREE undefined — no degree cap = unbounded boost | MEDIUM | R4 | Computed global with fallback=15 (See research/142 - FINAL-recommendations §4.2) |
| MR6 | R11 hidden dependency on R13 query provenance — "not in top 3" safeguard impossible without logging | MEDIUM | R11 | R13 must complete 2 eval cycles before R11 mutations enabled |
| MR7 | R15 violates R2 channel diversity guarantee — single-channel routes cannot satisfy diversity | MEDIUM | R15, R2 | Minimum 2 channels even for "simple" queries |
| MR8 | R4+N3+R10 three-way interaction — spurious R10 auto-extracted entities strengthened by N3 Hebbian learning, boosted by R4 degree scoring | HIGH | R4, N3, R10 | Entity extraction quality gate (FP <20%); N3 strength cap (MAX_STRENGTH_INCREASE=0.05/cycle); R4 degree normalization |
| MR9 | S5 rollback conflates DB checkpoint and code rollback — both needed for safe reversion of R6 pipeline refactor | HIGH | R6 | Dual rollback protocol: (1) `checkpoint_restore` for data, (2) git revert for code; document both in rollback procedure |
| MR10 | S6 N3-lite Hebbian weight modifications not tracked by `created_by` provenance — only new edges tracked, not weight changes to existing edges | HIGH | N3-lite | Add `weight_history` audit column or log weight changes to eval DB for rollback capability |
| MR11 | TM-06 reconsolidation auto-replacement — miscalibrated similarity thresholds could auto-replace valuable content with inferior newer content | MEDIUM | TM-06 | Feature flag + checkpoint required before enabling; log all reconsolidation decisions for R13 review |
| MR12 | TM-04 quality gate over-filtering — overly strict thresholds could reject legitimate memory saves | MEDIUM | TM-04 | Start with warn-only mode (log scores, don't reject) for 2 weeks; tune thresholds based on false-rejection rate |

### Dangerous Interaction Pairs

| Pair | Risk | Mitigation |
|------|------|------------|
| R1 + N4 | Double-boost for new chunked memories | Apply N4 BEFORE MPAB; cap combined boost at 0.95 |
| R4 + N3 | Feedback loop — hub domination | Edge caps, strength caps, provenance tracking |
| R15 + R2 | Guarantee violation | R15 minimum = 2 channels |
| R12 + R15 | Contradictory logic | Mutual exclusion: R15="simple" suppresses R12 |
| N4 + R11 | Transient artifact learning | Exclude memories < 72h old from R11 eligibility |
| TM-01 + R17 | Double fan-effect penalty | TM-01 penalizes in composite scoring; R17 penalizes in co-activation. Cap combined penalty at 0.15 |
| R13 + R15 | Metrics skew by complexity | R13 records query_complexity; metrics per tier |

### Deploy Disaster Scenario (R11)

A developer searches "deploy to production" and selects a migration memory. R11 learns "deploy" and "production" as triggers. Without the separate column fix, FTS5 indexes both words — every deployment query matches the migration memory on multiple channels for 30 days. See research/142 - FINAL-recommendations §6.4 for full scenario.

### Dependencies

All dependencies are internal. Three dependencies from original research were corrected:
- R4→R13: OVERSTATED (soft, not hard — build without, enable after measurement)
- R6→R7: INCORRECT (orthogonal subsystems — index-time vs search-time)
- R8→R7: INCORRECT (different comparison targets — embeddings vs summaries)

See research/142 - FINAL-recommendations §5 for corrected dependency graph.
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Search response MUST NOT exceed 500ms p95 during any phase including dark-run
- **NFR-P02**: Simple query (R15) target: < 30ms p95; Moderate: < 100ms; Complex: < 300ms
- **NFR-P03**: Dark-run overhead per sprint: S1 +10ms, S2 +2ms, S3 +50ms, S4 +15ms, S5 +100ms (See research/142 - FINAL-recommendations §14)

### Data Integrity
- **NFR-D01**: All new columns MUST be nullable with sensible defaults (e.g., `DEFAULT '[]'`)
- **NFR-D02**: No destructive migrations — never DROP COLUMN or ALTER COLUMN TYPE in forward migrations
- **NFR-D03**: Separate eval database (`speckit-eval.db`) — prevents observer effect on search performance
- **NFR-D04**: Atomic migration execution — failure = full rollback, no partial state

### Operational
- **NFR-O01**: Maximum 6 simultaneous active feature flags at any time
- **NFR-O02**: Maximum flag lifespan: 90 days from creation to permanent decision
- **NFR-O03**: Monthly flag sunset audit required
- **NFR-O04**: All scoring changes MUST use dark-run comparison before enabling

---

## 8. EDGE CASES

### BM25 Contingency (Sprint 0 Exit)
- **BM25 >= 80% of hybrid MRR@5**: PAUSE multi-channel optimization; investigate why single-channel performs comparably. Sprints 3-7 deferred
- **BM25 50-80% of hybrid MRR@5**: PROCEED with hybrid optimization; rationalize to 3 channels (drop weakest)
- **BM25 < 50% of hybrid MRR@5**: PROCEED with full roadmap — multi-channel clearly earning complexity

### A2 Full-Context Ceiling Interpretation (jointly with G-NEW-1 BM25 Baseline)

| | BM25 >= 80% of hybrid | BM25 < 50% of hybrid |
|---|---|---|
| **Full-context >= 90% of hybrid** | Strong PAUSE signal: system may be over-engineered | Retrieval near ceiling — PROCEED with lower urgency |
| **Full-context < 60% of hybrid** | BM25 catches essentials; graph may add noise | Hybrid earning its complexity — PROCEED confidently |

### Triple Boost (R1 + N4 + Constitutional)
A newly indexed constitutional memory with multiple chunks, within first 12 hours, receives MPAB bonus + cold-start boost + constitutional tier guarantee. Can dominate all results for 12-48h. Mitigation: composite boost cap at 0.95 before tier adjustment.

### Deploy Disaster (R11)
FTS5 contamination from learned triggers pollutes lexical search for 30 days. Mitigated by separate `learned_triggers` column. See research/142 - FINAL-recommendations §6.4.

### N=0 / N=1 MPAB
- N=0 chunks: `computeMPAB([]) = 0`
- N=1 chunk: `computeMPAB([score]) = score` (no penalty, no bonus)

### Empty Graph
If graph has 0 edges after G1 fix, R4 produces zero scores for all memories. This is correct behavior — R4 should not boost when no graph data exists. R10 (entity extraction) becomes higher priority.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | 20+ files across 8 subsystems, 316-472h, schema changes |
| Risk | 22/25 | CRITICAL FTS5 contamination, 0% graph hit rate, irreversible migration risks |
| Research | 18/20 | 13-agent synthesis, 3 waves, cross-system analysis |
| Multi-Agent | 13/15 | 7 independent tracks (A-G), parallel sprint execution |
| Coordination | 14/15 | 7 metric-gated sprints, BM25 contingency branching, off-ramps |
| **Total** | **90/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | FTS5 trigger contamination (MR1) | Critical | High (if separate column not used) | Separate `learned_triggers` column |
| R-002 | Preferential attachment loop (MR2) | High | Medium | Degree caps + provenance tracking |
| R-003 | Feature flag explosion (MR3) | High | High (24 proposed flags) | 6-flag maximum governance |
| R-004 | MPAB div-by-zero (MR4) | High | High (N=1 memories common) | Guard clause in `computeMPAB` |
| R-005 | BM25 >= 80% of hybrid (contingency) | High | Unknown | Sprint 0 measurement + decision matrix |
| R-006 | Effort variance (316-472h range) | Medium | Medium | Metric-gated sprints enable early stopping |
| R-007 | R6 pipeline refactor regression | High | Medium | Checkpoint before start; 0-diff gate; off-ramp |
| R-008 | Eval ground truth contamination from biased trigger-phrase synthetic data (MR-bias) | Medium | Medium | Diversify ground truth sources; add manual review sample |
| R-009 | Solo developer bottleneck — 18-26 weeks, no absence protocol | Medium | High | Document bus factor plan; identify critical path items for potential delegation |
| R-010 | Cumulative dark-run overhead — concurrent runs could reach 177ms p95 by S5 | Medium | Medium | Sequential dark-runs; disable prior sprint dark-runs before starting new ones |
| R-011 | BM25 measurement reliability — 50 queries may be biased, no diversity requirement | Medium | Medium | Require query diversity: ≥5 queries per intent type, ≥3 query complexity tiers |
| R-012 | Graph topology power-law distribution after G1 fix — bimodal R4 scoring | Medium | Low | R4 degree normalization (log-scale or percentile-based) |

---

## 11. USER STORIES

### US-001: Graph Channel Contribution (Priority: P0)

**As an** AI agent consuming memory context, **I want** the graph channel to contribute structural relationship signals to search results, **so that** memories connected by causal, derivation, or contradiction edges surface alongside content-similar results.

**Acceptance Criteria**:
1. Given a query about a topic with causal edges, When searching, Then graph channel results appear in `channelAttribution`
2. Given the R4 degree channel is enabled, When searching, Then well-connected memories receive measurable ranking boost

### US-002: Measurable Retrieval Quality (Priority: P0)

**As a** developer maintaining the retrieval system, **I want** automated evaluation metrics (MRR@5, NDCG@10, Recall@20), **so that** every scoring change can be validated as improvement or regression.

**Acceptance Criteria**:
1. Given R13 eval infrastructure is deployed, When running eval queries, Then MRR@5, NDCG@10, Recall@20 are computed and stored
2. Given a BM25-only baseline exists, When comparing against hybrid, Then the marginal value of multi-channel fusion is quantified

### US-003: New Memory Discoverability (Priority: P1)

**As an** AI agent, **I want** newly indexed memories to be discoverable within 48 hours, **so that** recently saved context is available for retrieval without waiting for temporal decay to stabilize.

**Acceptance Criteria**:
1. Given N4 cold-start boost is enabled, When a memory is < 48h old, Then it receives a visibility boost that decays exponentially (12h half-life)
2. Given the boost expires after 48h, When the memory ages past 48h, Then normal FSRS temporal decay governs ranking

### US-004: Zero-Cost Re-Index (Priority: P1)

**As a** developer, **I want** re-indexing unchanged content to skip embedding generation, **so that** bulk re-index operations complete without API costs or latency.

**Acceptance Criteria**:
1. Given R18 embedding cache is operational, When re-indexing content with unchanged `content_hash + model_id`, Then embedding generation is skipped entirely
2. Given cache hit rate > 90%, When performing full re-index, Then total time is reduced by > 90% for unchanged content

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Project Lead | Pending | |
| Architecture Review (ADRs) | Project Lead | Pending | |
| Sprint 0 Gate Review | Project Lead | Pending | |
| Sprint 1 Gate Review | Project Lead | Pending | |
| Sprint 2+3 Gate Review (off-ramp decision) | Project Lead | Pending | |
| Sprint 4 Gate Review | Project Lead | Pending | |
| Sprint 5 Gate Review | Project Lead | Pending | |
| Sprint 6 Gate Review | Project Lead | Pending | |

---

## 13. COMPLIANCE CHECKPOINTS

### Migration Safety
- [ ] All schema changes follow migration protocol (See research/142 - FINAL-recommendations §13)
- [ ] Nullable defaults on all new columns
- [ ] Backup before ALTER TABLE
- [ ] Forward-compatible reads (handle column not existing)
- [ ] Backup `speckit-eval.db` before each sprint gate review

### Dark-Run Compliance
- [ ] Every scoring change undergoes dark-run comparison
- [ ] p95 latency stays below 500ms during dark-run phases
- [ ] Dark-run results logged via R13 infrastructure

### Feature Flag Governance
- [ ] Maximum 6 simultaneous active flags
- [ ] 90-day lifespan enforced
- [ ] Monthly sunset audit conducted
- [ ] Flag naming convention: `SPECKIT_{FEATURE}`

#### Feature Flag Sunset Schedule

Each sprint exit gate MUST include a flag disposition decision for all prior flags. The plan introduces 7+ flags by Sprint 3, which already exceeds the 6-flag maximum (SC-005, NFR-O01). The following sunset schedule ensures compliance:

| Sprint Exit | Flags Introduced This Sprint | Flags to Permanently Enable or Remove | Max Active After Gate |
|-------------|------------------------------|---------------------------------------|----------------------|
| S0 | `SPECKIT_EVAL_LOGGING`, `SPECKIT_VERIFY_FIX_VERIFY` | None (first sprint) | 2 |
| S1 | `SPECKIT_DEGREE_BOOST` | `SPECKIT_EVAL_LOGGING` → permanent (remove flag, always-on) | 2 |
| S2 | `SPECKIT_NOVELTY_BOOST`, `SPECKIT_INTERFERENCE_SCORE`, `SPECKIT_FOLDER_SCORE` | `SPECKIT_VERIFY_FIX_VERIFY` → permanent (remove flag) | 4 |
| S3 | `SPECKIT_COMPLEXITY_ROUTER`, `SPECKIT_RSF_FUSION`, `SPECKIT_CHANNEL_MIN_REP`, `SPECKIT_SEARCH_FALLBACK` | `SPECKIT_DEGREE_BOOST` → permanent; `SPECKIT_NOVELTY_BOOST` → permanent | 6 (at ceiling) |
| S4 | `SPECKIT_DOCSCORE_AGGREGATION`, `SPECKIT_LEARN_FROM_SELECTION`, `SPECKIT_SAVE_QUALITY_GATE`, `SPECKIT_RECONSOLIDATION`, `SPECKIT_CONSTITUTIONAL_INJECT` | `SPECKIT_INTERFERENCE_SCORE` → permanent; `SPECKIT_FOLDER_SCORE` → permanent; `SPECKIT_COMPLEXITY_ROUTER` → permanent | 6 (at ceiling) |
| S5 | `SPECKIT_PIPELINE_V2`, `SPECKIT_EMBEDDING_EXPANSION`, `SPECKIT_PROGRESSIVE_VALIDATION` | `SPECKIT_RSF_FUSION` → decide (permanent or remove based on Kendall tau data); `SPECKIT_CHANNEL_MIN_REP` → permanent; `SPECKIT_SEARCH_FALLBACK` → permanent | <=6 |
| S6 | `SPECKIT_ENCODING_INTENT`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_CONSOLIDATION` | `SPECKIT_DOCSCORE_AGGREGATION` → permanent; `SPECKIT_LEARN_FROM_SELECTION` → decide (permanent or remove based on noise rate); `SPECKIT_SAVE_QUALITY_GATE` → permanent | <=6 |

**Rule:** Any sprint that would exceed 6 active flags MUST sunset prior flags at the sprint's entry (not exit). If a flag cannot be confidently resolved, it counts against the 6-flag budget and a lower-priority new flag must be deferred.

### B8 Signal Ceiling
- **B8 Signal Ceiling**: Maximum 12 active scoring signals until R13 provides automated evaluation data. Escape clause: R13 evidence that a new signal provides orthogonal value overrides the ceiling. Re-evaluate at Sprint 4 off-ramp when R13-S2 channel attribution data is available.

### Test Suite Non-Regression
- [ ] 158+ existing tests pass after every sprint
- [ ] New tests added per sprint (See research/142 - FINAL-recommendations §12)
- [ ] Flag interaction testing at appropriate level (1-5)

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Project Lead | Gate decisions, off-ramp calls, BM25 contingency | High | Per-sprint gate reviews |
| Developer(s) | Implementation, testing, flag management | High | Per-sprint status via tasks.md |
| AI Agent Consumers | Primary retrieval users | High | Quality measured via R13 metrics |

---

## 15. CHANGE LOG

### v1.0 (2026-02-26)
**Initial specification** from research synthesis of 13 independent agent investigations across 3 waves. Supersedes all prior 140/141 analyses and recommendations.

### v1.1 (2026-02-26)
**true-mem pattern integration** — Added 7 recommendations (TM-01 through TM-06, TM-08) from true-mem research (research/9 + research/10). New REQ-039 to REQ-045. New risks MR11, MR12. Deferred TM-07 as DEF-015. Effort increased by +27-44h (~8-9%).

### v1.2 (2026-02-26)
**PageIndex-derived recommendations** — Added 8 recommendations (PI-A1 through PI-A5, PI-B1 through PI-B3) from PageIndex analysis of true-mem source code (research/9 + research/10). Distributed across S0-S5. Effort increased by +70-104h. See §4 PageIndex-Derived Recommendations table.

---

## 16. OPEN QUESTIONS

- **OQ-001**: BM25 baseline performance — unknown until Sprint 0 measurement. If >= 80% of hybrid, roadmap fundamentally changes. **Decision context:** This is the single most consequential unknown. The BM25 contingency matrix (§8) defines three branches. G-NEW-1 (REQ-004) and A2 (REQ-037) jointly determine the 2x2 decision space. Resolved at: Sprint 0 exit gate.
- **OQ-002**: INT8 recall loss contradiction — 1-2% (Spec 140) vs 5.32% (Spec 141). Requires in-system ablation. Blocks R5 activation decision. **Decision context:** The discrepancy likely stems from different evaluation corpora and embedding models. In-system ablation with R13 infrastructure will produce authoritative measurement. Resolved at: Sprint 7 (R5 eval, REQ-031).
- **OQ-003**: `search-weights.json` audit — `maxTriggersPerMemory` is active; smart ranking section status unknown. **Decision context:** May reveal undocumented scoring signals that count against the B8 signal ceiling (REQ-038). Audit should be completed during Sprint 0 as part of R13-S1 instrumentation.
- **OQ-004**: G2 investigation outcome — double intent weighting may be intentional design, not a bug. **Decision context:** If intentional, document the rationale in ADR format and adjust G2 scope (REQ-009) from "fix" to "document." If unintentional, the fix is straightforward removal. Resolved at: Sprint 2 (REQ-009).
- **OQ-005**: Feedback bootstrap accumulation rate — R11 activation timeline depends on interaction data volume. **Decision context:** G-NEW-3 (REQ-017) defines a three-phase bootstrap (synthetic → implicit → LLM-judge). The 200 query-selection pair minimum before R11 activation may take 4-8 weeks of normal usage, or can be accelerated via synthetic replay. The 28-day calendar constraint (F10) may be the binding constraint rather than data volume.

---

## 17. DEFERRED ITEMS

Items evaluated in the 144 gap analysis but deferred pending future data or off-ramp decisions:

| ID | Item | Earliest Sprint | Gate / Condition |
|----|------|----------------|-----------------|
| DEF-001 | FUT-4: Working Memory → Search feedback (bidirectional cognitive signals) | S4/S6 | Needs R13 data + ADR-001 compatibility analysis |
| DEF-002 | Learned Fusion Weight Optimization (ML-based: LambdaMART/RankNet — subsumes per-query-type weights) | Post-S4 | Requires 500+ feedback triples + R13 channel attribution data |
| DEF-003 | Negative Feedback / Suppression (query-type-specific) | Post-S4 | **Requires A4 first** (confidence signal activated in S4) |
| DEF-004 | Session Query History (session context vector, rolling average of query embeddings) | Post-S3 | Architectural change; needs ADR-001 justification |
| DEF-005 | Topical Diversity Control (cross-folder result diversity) | Post-S3 | Evaluate after R2 channel diversity operational |
| DEF-006 | Monitoring / Observability (latency percentiles, cache hit rates + retrieval-specific: score collapse, dead channels, confidence calibration) | Any | Important but orthogonal to retrieval quality |
| DEF-007 | Embedding Model Abstraction (model-agnostic embedding layer) | S7+ | Premature unless model switching imminent |
| DEF-008 | Decouple Spec-Kit Scripts from MCP Server Internals | S5+ | S5 already 64-92h; defer unless S5 splits |
| DEF-009 | Formal Interface Contract (Spec-Kit ↔ MCP Server) | S5+ | Depends on DEF-008 |
| DEF-010 | Embedding Quality Monitoring (dimension checks, distribution drift, provider health) | S2+ | R13 detects quality degradation indirectly |
| DEF-011 | Two-Pass Gleaning for Causal Link Extraction | S6 | LLM latency concern at index time |
| DEF-012 | Weighted Chunk Selection via Reference Frequency | S6 | Subject to B8 signal ceiling governance |
| DEF-013 | Context Drift Detection (periodic validity audits for old memories) | S6 | Long-term maintenance concern |
| DEF-014 | structuralFreshness() Decision (dead code: keep or remove) | S7 | Evaluate during S7 planning |
| DEF-015 | TM-07: Role-aware extraction weights (10x human message weight for conversation-sourced memories) | Post-S7 | Auto-extraction feature is planned and under development |

**Evaluation trigger**: Re-assess at Sprint 3 off-ramp and Sprint 6 planning.

---

## 18. RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Research (Analysis)**: See `research/142 - FINAL-analysis-hybrid-rag-fusion-architecture.md`
- **Research (Recommendations)**: See `research/142 - FINAL-recommendations-hybrid-rag-fusion-refinement.md`
- **Research (true-mem Analysis)**: See `research/9 - deep-analysis-true-mem-source-code.md` *(source for PI-A1 — PI-B3 PageIndex recommendations)*
- **Research (true-mem Recommendations)**: See `research/10 - recommendations-true-mem-patterns.md` *(source for PI-A1 — PI-B3 PageIndex recommendations)*

---

<!--
LEVEL 3+ SPEC
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
- Phase Documentation Map with 8 sprint phases
-->
