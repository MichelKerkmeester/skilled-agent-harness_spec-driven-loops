---
title: "Tasks: Hybrid RAG Fusion Refinement"
description: "73 tasks across 8 metric-gated sprints (314-467h S0-S6, 355-524h S0-S7) organized by workstream with sprint gate verification tasks."
trigger_phrases:
  - "hybrid rag tasks"
  - "sprint tasks"
  - "retrieval refinement tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Hybrid RAG Fusion Refinement

<!-- SPECKIT_LEVEL: 3+ -->
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
| `[GATE]` | Sprint exit gate verification |

**Task Format**: `T### [W-X] Description (subsystem) [effort] {deps} — REC-ID`

**Workstream Tags**: W-A (Quick Wins + Scoring), W-B (Graph), W-C (Measurement + Feedback), W-D (Pipeline + Spec-Kit)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:sprint-0 -->
## Sprint 0: Epistemological Foundation [30-45h]

> **Goal**: Establish that retrieval is measurable. BLOCKING — nothing proceeds without exit gate.
> **Child folder**: `001-sprint-0-epistemological-foundation/`

- [ ] T000a [W-C] Record pre-Sprint-0 performance baseline — current p95 search latency, memory count, existing system behavior snapshot [1-2h] {} — Baseline
- [ ] T000b [W-A] Establish feature flag governance rules — document 6-flag max, 90-day lifespan, naming convention, monthly sunset audit process [1-2h] {} — NFR-O01/O02/O03
  - B8 signal ceiling: max 12 active scoring signals until R13 automated eval; escape clause requires R13 evidence of orthogonal value
- [ ] T000c [W-C] Audit `search-weights.json` — verify `maxTriggersPerMemory` status, smart ranking section behavior [1-2h] {} — OQ-003
- [ ] T001 [W-B] Fix graph channel ID format — convert `mem:${edgeId}` to numeric memory IDs at BOTH locations (`graph-search-fn.ts` lines 110 AND 151) [3-5h] {} — G1
- [ ] T002 [W-A] Fix chunk collapse conditional — dedup on all code paths (`memory-search.ts`) [2-4h] {} — G3
- [ ] T003 [W-A] Add fan-effect divisor to co-activation scoring (`co-activation.ts`) [1-2h] {} — R17
- [ ] T004 [W-C] Create `speckit-eval.db` with 5-table schema (eval_queries, eval_channel_results, eval_final_results, eval_ground_truth, eval_metric_snapshots) [8-10h] {} — R13-S1
- [ ] T004b [W-C] Implement R13 observer effect mitigation — search p95 health check with eval logging on/off [2-4h] {T004} — D4
- [ ] T005 [W-C] Add logging hooks to `memory_search`, `memory_context`, `memory_match_triggers` handlers [6-8h] {T004} — R13-S1
- [ ] T006 [W-C] Implement core metric computation: MRR@5, NDCG@10, Recall@20, Hit Rate@1 + 5 diagnostic metrics + full-context ceiling (A2) + quality proxy formula (B7) [14-21h] {T004} — R13-S1
- [ ] T007 [W-C] Generate synthetic ground truth from trigger phrases (Phase A) [2-4h] {T004} — G-NEW-1/G-NEW-3
- [ ] T008 [W-C] Run BM25-only baseline measurement and record results [4-6h] {T006, T007} — G-NEW-1
- [ ] T009 [GATE] Sprint 0 exit gate verification: graph hit rate >0%, chunk dedup verified, baseline metrics for 50+ queries, BM25 baseline recorded, BM25 contingency decision [0h] {T000a-T008}
<!-- /ANCHOR:sprint-0 -->

---

<!-- ANCHOR:sprint-1 -->
## Sprint 1: Graph Signal Activation [22-31h]

> **Goal**: Make graph the system's differentiating signal.
> **Child folder**: `002-sprint-1-graph-signal-activation/`

- [ ] T010 [W-B] Implement typed-weighted degree as 5th RRF channel with edge type weights, MAX_TYPED_DEGREE=15, MAX_TOTAL_DEGREE=50 behind `SPECKIT_DEGREE_BOOST` flag [12-16h] {T009} — R4
  - T010a [P] Increase co-activation boost strength from 0.1x to 0.25-0.3x [2-4h] {T003} — A7
- [ ] T011 [W-C] Measure edge density from R13 data (edges/node metric) [2-3h] {T009} — R4 dependency check
- [ ] T012 [W-C] Agent-as-consumer UX analysis + consumption instrumentation [8-12h] {T009} — G-NEW-2
- [ ] T013 [W-B] Enable R4 if dark-run passes hub domination and MRR@5 criteria [0h] {T010, T011} — R4
- [ ] T014 [GATE] Sprint 1 exit gate verification: R4 MRR@5 delta >+2%, edge density measured, no single memory >60% presence, G-NEW-2 instrumentation active [0h] {T010-T013}
<!-- /ANCHOR:sprint-1 -->

---

<!-- ANCHOR:sprint-2 -->
## Sprint 2: Scoring Calibration + Operational Efficiency [19-29h]

> **Goal**: Resolve dual scoring magnitude mismatch; enable zero-cost re-indexing.
> **Child folder**: `003-sprint-2-scoring-calibration/`

- [ ] T015 [P] [W-A] Implement embedding cache (`embedding_cache` table) for instant rebuild [8-12h] {T014} — R18
- [ ] T016 [P] [W-A] Implement cold-start boost with exponential decay (12h half-life) behind `SPECKIT_NOVELTY_BOOST` flag [3-5h] {T014} — N4
- [ ] T017 [W-A] Investigate double intent weighting (G2) — determine if intentional design [4-6h] {T014} — G2
- [ ] T018 [W-A] Implement score normalization (both RRF and composite to [0,1] scale) [4-6h] {T017} — Score calibration
- [ ] T019 [W-C] Verify dark-run results for N4 and score normalization via R13 [included] {T016, T018}
- [ ] T020a [P] [W-A] Investigate RRF K-value sensitivity — grid search K ∈ {20, 40, 60, 80, 100} [2-3h] {T014} — FUT-5
- [ ] T020 [GATE] Sprint 2 exit gate verification: cache hit >90%, N4 dark-run passes, G2 resolved, score distributions normalized [0h] {T015-T019}
<!-- /ANCHOR:sprint-2 -->

---

<!-- ANCHOR:sprint-3 -->
## Sprint 3: Query Intelligence + Fusion Alternatives [26-40h]

> **Goal**: Add query routing and evaluate fusion alternatives.
> **Child folder**: `004-sprint-3-query-intelligence/`

- [ ] T021 [P] [W-D] Implement query complexity router (3-tier: simple/moderate/complex, min 2 channels) behind `SPECKIT_COMPLEXITY_ROUTER` flag [10-16h] {T020} — R15
- [ ] T022 [P] [W-D] Implement Relative Score Fusion parallel to RRF (all 3 fusion variants) behind `SPECKIT_RSF_FUSION` flag [10-14h] {T020} — R14/N1
- [ ] T023 [W-D] Implement channel minimum-representation constraint (post-fusion, quality floor 0.2) behind `SPECKIT_CHANNEL_MIN_REP` flag [6-10h] {T020} — R2
- [ ] T024 [W-C] Run shadow comparison: R14/N1 vs RRF on 100+ queries, compute Kendall tau [included] {T022}
- [ ] T025a [W-B] Implement confidence-based result truncation — adaptive top-K cutoff [5-8h] {T021} — R15 extension
- [ ] T025b [P] [W-B] Implement dynamic token budget allocation by complexity tier [3-5h] {T021} — FUT-7
- [ ] T025 [GATE] Sprint 3 exit gate verification: R15 p95 <30ms simple, RSF Kendall tau computed, R2 precision within 5% [0h] {T021-T024}

**OFF-RAMP: After T025, evaluate "good enough" thresholds (MRR@5 >= 0.7, constitutional surfacing >= 95%, cold-start detection >= 90%). If all met, Sprints 4-7 are optional.**
<!-- /ANCHOR:sprint-3 -->

---

<!-- ANCHOR:sprint-4 -->
## Sprint 4: Feedback Loop + Chunk Aggregation [39-56h]

> **Goal**: Close the feedback loop; aggregate chunk scores safely.
> **Prerequisite**: R13 must have completed at least 2 full eval cycles.
> **Child folder**: `005-sprint-4-feedback-loop/`

- [ ] T026 [P] [W-A] Implement MPAB chunk-to-memory aggregation with N=0/N=1 guards behind `SPECKIT_DOCSCORE_AGGREGATION` flag [8-12h] {T025} — R1
  - T026a Preserve chunk ordering within documents during reassembly [2-4h] — B2
- [ ] T027 [W-C] Implement learned relevance feedback with separate `learned_triggers` column and all 7 safeguards behind `SPECKIT_LEARN_FROM_SELECTION` flag [16-24h] {T025, R13 2-cycle prerequisite} — R11
- [ ] T027a [W-C] Implement G-NEW-3 Phase B: implicit feedback collection from user selections for ground truth [4-6h] {T025, R13 2-cycle prerequisite} — G-NEW-3
- [ ] T027b [W-C] Implement G-NEW-3 Phase C: LLM-judge ground truth generation — minimum 200 query-selection pairs before R11 activation [4-6h] {T027a} — G-NEW-3
  - T027c Implement memory importance auto-promotion (threshold-based tier promotion on validation count) [5-8h]
  - T027d Activate negative feedback confidence signal (demotion multiplier, floor=0.3) [4-6h] — A4
- [ ] T028 [W-C] Implement R13-S2: shadow scoring + channel attribution + ground truth Phase B [15-20h] {T025} — R13-S2
  - T028a Implement Exclusive Contribution Rate metric per channel [2-3h]
- [ ] T029 [W-C] Verify R1 dark-run (MRR@5 within 2%, N=1 no regression) [included] {T026}
- [ ] T030 [W-C] Analyze R11 shadow log (noise rate < 5%) [included] {T027}
- [ ] T031 [GATE] Sprint 4 exit gate verification: R1 within 2%, R11 noise <5%, R13-S2 operational [0h] {T026-T030}
<!-- /ANCHOR:sprint-4 -->

---

<!-- ANCHOR:sprint-5 -->
## Sprint 5: Pipeline Refactor + Spec-Kit Logic [64-92h]

> **Goal**: Modernize pipeline architecture; add spec-kit retrieval optimizations.
> **Child folder**: `006-sprint-5-pipeline-refactor/`

**Phase A (Pipeline): R6 — 40-55h**
- [ ] T032 Create checkpoint: `memory_checkpoint_create("pre-pipeline-refactor")` [0h] {T031}
- [ ] T033 [W-D] Implement 4-stage pipeline refactor (Candidate → Fusion → Rerank → Filter) with Stage 4 "no score changes" invariant behind `SPECKIT_PIPELINE_V2` flag [40-55h] {T032} — R6
- [ ] T034 [W-C] Verify R6 dark-run: 0 ordering differences on full eval corpus [included] {T033}
- [ ] T035 Verify all 158+ existing tests pass with PIPELINE_V2 enabled [included] {T033}

**Phase B (Search + Spec-Kit): 24-37h — Phase A must pass before starting**
- [ ] T036 [P] [W-D] Implement spec folder pre-filter [5-8h] {T035} — R9
- [ ] T037 [P] [W-D] Implement embedding-based query expansion (suppressed when R15="simple") behind `SPECKIT_EMBEDDING_EXPANSION` flag [10-15h] {T035} — R12
- [ ] T038 [P] [W-D] Implement template anchor optimization [5-8h] {T035} — S2
- [ ] T039 [P] [W-D] Implement validation signals as retrieval metadata [4-6h] {T035} — S3
- [ ] T040 [GATE] Sprint 5 exit gate verification: R6 0 differences, 158+ tests pass, R9 cross-folder equivalent, R12 no latency degradation [0h] {T033-T039}
<!-- /ANCHOR:sprint-5 -->

---

<!-- ANCHOR:sprint-6 -->
## Sprint 6: Graph Deepening + Index Optimization [68-101h]

> **Goal**: Complete measurement infrastructure; deepen graph; evaluate deferred items.
> **Child folder**: `007-sprint-6-graph-deepening/`

**Phase A (Graph): 35-50h**
- [ ] T041 [W-B] Implement graph centrality + community detection (N2 items 4-6) [25-35h] {T040} — N2
  - T041a N2a: Graph Momentum (temporal degree delta) [8-12h]
  - T041b N2b: Causal Depth Signal (max-depth path normalization) [5-8h]
  - T041c N2c: Community Detection (label propagation/Louvain) [12-15h]
- [ ] T042 [W-B] Implement N3-lite: contradiction scan + Hebbian strengthening with edge caps [10-15h] {T040} — N3-lite
  - T042a Contradiction cluster surfacing — surface all cluster members [3-5h]

**Phase B (Indexing + Spec-Kit): 33-51h — may run in parallel with Phase A**
- [ ] T043 [P] [W-D] Implement anchor-aware chunk thinning [10-15h] {T040} — R7
- [ ] T044 [P] [W-D] Implement encoding-intent capture behind `SPECKIT_ENCODING_INTENT` flag [5-8h] {T040} — R16
- [ ] T045 [P] [W-B] Implement auto entity extraction (gated: only if density < 1.0) behind `SPECKIT_AUTO_ENTITIES` flag [12-18h] {T040} — R10
- [ ] T046 [P] [W-D] Implement spec folder hierarchy as retrieval structure [6-10h] {T040} — S4
- [ ] T047 [GATE] Sprint 6 exit gate verification: R7 Recall@20 within 10%, R10 FP <20%, N2 attribution >10%, N3-lite contradiction detection, flag count <=6 [0h] {T041-T046}
<!-- /ANCHOR:sprint-6 -->

---

<!-- ANCHOR:sprint-7 -->
## Sprint 7: Long Horizon [45-62h]

> **Goal**: Address scale-dependent features and complete evaluation infrastructure.
> **Child folder**: `008-sprint-7-long-horizon/`

- [ ] T048 [P] [W-D] Implement memory summary generation (only if >5K memories) behind `SPECKIT_MEMORY_SUMMARIES` flag [15-20h] {T047} — R8
- [ ] T049 [P] [W-D] Implement smarter memory content generation [8-12h] {T047} — S1
- [ ] T050 [P] [W-B] Implement cross-document entity linking [8-12h] {T047} — S5
- [ ] T051 [W-C] Implement R13-S3: full reporting + ablation studies [12-16h] {T047} — R13-S3
- [ ] T052 [W-C] Evaluate R5 (INT8 quantization) need based on memory count and latency [2h] {T047} — R5 decision
- [ ] T053 [GATE] Sprint 7 exit gate verification: R8 summary pre-filtering verified (if activated), S1 content quality improved, S5 entity links established, R13-S3 dashboard operational, R5 decision documented, final feature flag sunset audit completed [0h] {T048-T052}
<!-- /ANCHOR:sprint-7 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All sprint exit gates (T009, T014, T020, T025, T031, T040, T047, T053) passed
- [ ] No `[B]` blocked tasks remaining
- [ ] Feature flag count <= 6
- [ ] R13 cumulative health dashboard meets targets (MRR@5 +10-15%, graph hit >20%, channel diversity >3.0)
- [ ] All 158+ original tests + ~70-100 new tests passing

**Minimum viable completion**: T025 (Sprint 3 gate) — see off-ramp criteria
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research (Recommendations)**: See `research/142 - FINAL-recommendations-hybrid-rag-fusion-refinement.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3+ TASKS
- 73 tasks across 8 metric-gated sprints
- Workstream tags (W-A through W-D)
- Sprint gate tasks (T009, T014, T020, T025, T031, T040, T047, T053)
- Off-ramp marker after Sprint 3
-->
