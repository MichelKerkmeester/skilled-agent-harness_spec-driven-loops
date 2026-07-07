---
title: "Feature Specification: Skill Advisor - Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)"
description: "Three Skill Advisor routing-quality refinements implemented as default-off scorer seams. C1 preserves conflicts_with mass as a post-fusion demotion and counter, QCR adds flag-gated query-class lane multipliers and C6 adds flag-gated top-K exact semantic rerank. Live/default promotion still needs conflict-edge and benchmark evidence."
trigger_phrases:
  - "advisor conflict rerank query routing"
  - "C1 conflicts_with post-fusion demotion"
  - "QCR query class lane weights"
  - "C6 semantic exact rerank top-K"
  - "skill advisor deferred routing refinements"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/002-skill-advisor-runtime/005-conflict-rerank-query-routing"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented default-off scorer seams for C1/QCR/C6 with deterministic unit coverage"
    next_safe_action: "Run live conflict and benchmark gates"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-005-conflict-rerank-query-routing"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Feature Specification: Skill Advisor, Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | complete |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | system-skill-advisor/012-skill-advisor-tuning/002-skill-advisor-runtime |
| **Candidates** | C1 (split-conflict re-rank), QCR (query-class lane-weight router), C6 (cross-lane semantic exact-rerank) |
| **Status (all)** | Default-off scorer seams implemented in this phase. Packet 030 remains untouched. Live/default promotion remains gated on C1 conflict-edge evidence, QCR held-out routing-quality evidence and benchmark acceptance for any ranking flip |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Skill Advisor fuses five lanes, `explicit_author 0.42 / lexical 0.28 / graph_causal 0.13 / derived_generated 0.12 / semantic_shadow 0.05` (`lane-registry.ts:8-19`), via a raw-score weighted SUM by default, with an opt-in RRF spine behind `SPECKIT_ADVISOR_RRF_FUSION`. The research campaign catalogued three routing-quality refinements that ride that spine and need live evidence before default promotion:

- **C1 (conflict-suppression re-rank)** is *latent until a skill declares a reciprocal `conflicts_with` edge.* The `graph_causal` lane carries a signed `conflicts_with: -0.35` multiplier (`graph-causal.ts:18`) that emits a negative score but is never enqueued for further BFS (`graph-causal.ts:77` `if (signed > 0)`) [CONFIRMED: iter-001 F6. Iter-002 F16]. That negative mass has no rank-fusion meaning, so a naive RRF port would silently drop conflict suppression. C1 lifts it OUT of the lane sum into a deterministic post-fusion demotion in the sort comparator (the same surface `primaryIntentBonus` already uses at `fusion.ts:428-430`) [CONFIRMED: iter-006]. But the path is DORMANT: the live `skill-graph.sqlite` has ZERO `conflicts_with` edges (only `depends_on=9`, `enhances=33`, `prerequisite_for=10/11`, `siblings=22`) and all 20+ real-skill `graph-metadata.json` declare `"conflicts_with": []`, so C1 changes zero observable routing until a reciprocal conflict edge exists [CONFIRMED: iter-010 decisive finding. Verified live 2026-06-19].

- **QCR (query-class → lane-weight router)** is *benchmark-gated speculation with no demonstrated mis-routing.* Intent enters the scorer today only via two ad-hoc surfaces: the `TASK_INTENT`/breadth/multi-concern regexes for confidence + abstention (`fusion.ts:44-56,484-513`) and the hand-maintained per-`(phrase,skill)` `primaryIntentBonus` table (`fusion.ts:259-332,428-430`) [CONFIRMED: iter-001 F5]. QCR would classify a query into a small intent class set and feed per-class lane-weight multipliers through the existing `effectiveScorerWeights` merge point (`fusion.ts:69-82`), additively, never replacing the dominant `explicit_author` lane [CONFIRMED: iter-001 Q1. Iter-004 QCR row]. It is the highest-ceiling candidate but the costliest error is a misrouted class that demotes the right skill, and the research never produced a held-out routing-quality measurement: the class taxonomy, per-class multipliers and a benchmark all remain open [CONFIRMED: roadmap.md:75,193. Iter-004 residual note].

- **C6 (cross-lane semantic exact-rerank)** *needs C3's rank-based survivor set.* The `semantic_shadow` lane (weight 0.05) already computes EXACT full-precision cosine over every projected skill (`cosineSimilarity` iterating raw `Float32Array` at `semantic-shadow.ts:47-69`, brute-force `projection.skills.map(...)` then `score <= COSINE_THRESHOLD (0.2)` at `semantic-shadow.ts:11,213-220`) [CONFIRMED: iter-003 F1/F2]. There is no ANN stage to "graduate", so the real lever is to re-score only the fused top-K survivors with full-precision cosine as a bounded tiebreak/boost, bypassing the 0.2 cutoff for that subset, letting the 0.05 lane RESOLVE ties instead of diluting the sum [CONFIRMED: iter-003 F3/F4, C6 candidate]. This is meaningful only once C3 produces a stable rank-based survivor set and the deterministic id tiebreak that keeps C6's re-order byte-stable. On today's weighted-sum it would re-order a non-deterministic set.

### Purpose
Ship the code seams as reversible, default-off scorer changes so they are testable without changing live routing. Promote each one only when its gating condition materializes: a declared reciprocal conflict edge for C1, a demonstrated mis-routing case plus held-out benchmark for QCR and benchmark/recall acceptance before any C6/default flip.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **C1**, lift the `conflicts_with: -0.35` mass out of the opt-in `graph_causal` RRF lane sum into a deterministic, auditable post-fusion demotion in the sort comparator (mirroring `primaryIntentBonus`), with its own applied-counter. Live effect still requires reciprocal conflict data.
- **QCR**, a query-class classifier mapping each query to a small intent class, feeding per-class lane-weight multipliers through `effectiveScorerWeights` (`fusion.ts:69-82`), additive and keeping `explicit_author` dominant. It is disabled unless `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING=true`. Live/default promotion still needs held-out routing-quality evidence.
- **C6**, a cross-lane exact-rerank pass over the fused top-K survivors using full-precision cosine (bypassing the 0.2 cutoff for that subset only), as a bounded tiebreak with a deterministic skill-id fallback. It is disabled unless both RRF and `SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK=true`.
- Per-candidate gate tracking and the materialization conditions that unblock each one.

### Out of Scope
- **C3 (import the shared deterministic RRF `fuseResultsMulti`)**, the determinism spine itself, tracked under the sibling sub-phase `001-rrf-determinism-spine`. C1/QCR/C6 are downstream consumers of it, not the spine [CONFIRMED: roadmap.md:36,44. Research.md C3 row. Iter-004 F9].
- **C5 / C5a / AMB (runtime lane-health & graceful lane-degrade)**, tracked under the sibling sub-phase `002-runtime-lane-health-degrade` [CONFIRMED: roadmap.md:90-91].
- **C4 (Beta-posterior lane auto-tune) and the SA-two-gate / cold-start / held-out / un-promotion chain**, a from-scratch Beta build (the live estimator is raw-frequency, NO Beta math), a separate Phase-2/3 track [CONFIRMED: BROADENING §2. Iter-014 G14-03].
- **SA-outcome-weighted-ranking** (procedural Beta reliability over skill-execution outcomes), a follow-on packet. Proxy-only today, no execution-success emitter exists [CONFIRMED: synthesis 01-go-candidates.md:109. Roadmap.md:268].
- Building skill `conflicts_with` edges, declaring reciprocal conflict relationships between skills is a separate authoring decision that unblocks C1. This sub-phase does NOT fabricate conflict edges.
- The other three subsystems (Memory MCP, Code Graph, Deep Loop), each tracked under its own 028 subsystem.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | C1: post-fusion `conflicts_with` demotion counter. QCR: flag-gated class→lane multipliers through `effectiveScorerWeights`. C6: flag-gated top-K exact semantic rerank within a bounded score window |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts` | Reused | C1 uses the existing split output: positive matches feed RRF, conflict matches feed the comparator demotion |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Modified | C6 adds exact subset scoring that reuses full-precision vectors and bypasses the 0.2 cutoff only for requested top-K skill ids |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts` | Modified | Adds the graph conflict demotion applied-counter definition |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/conflict-query-rerank.vitest.ts` | Created | Per-candidate fixtures: conflict counter, QCR default-off/dominance, exact subset cutoff bypass, and C6 deterministic bounded rerank |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each candidate carries an explicit live-promotion gate | C1 gate = `dormant-data` (needs a reciprocal `conflicts_with` edge) + `shared-infra-dep` (RRF spine). QCR gate = `needs-benchmark` (held-out routing-quality) + `shared-infra-dep`. C6 gate = `shared-infra-dep` plus benchmark/recall acceptance. Code seams may exist only when default-off and byte-identical with flags disabled |
| REQ-002 | C1, when promoted, applies conflict suppression as a deterministic post-fusion demotion, NOT a fused rank term | The `conflicts_with: -0.35` mass is lifted out of the `graph_causal` lane sum and applied in the sort comparator (like `primaryIntentBonus`, `fusion.ts:428-430`) with its own applied-counter and a deterministic tiebreak. It is inert (zero observable change) while every skill declares `conflicts_with []` [CONFIRMED: iter-002 C1, iter-006, iter-010] |
| REQ-003 | QCR, when promoted, is additive and never replaces the `explicit_author` lane | Per-class lane multipliers feed through `effectiveScorerWeights` (`fusion.ts:69-82`). `explicit_author` stays dominant. QCR ships behind shadow weights and is gated on a held-out routing-quality benchmark before any live weight change [CONFIRMED: iter-001 Q1, iter-004 QCR, roadmap.md:75] |
| REQ-004 | C6, when promoted, depends on the 001 RRF spine and is byte-stable | C6 re-scores only the fused top-K survivors from C3's rank-based set with full-precision cosine (bypassing the 0.2 cutoff for that subset), as a bounded tiebreak. The re-order is deterministic via a skill-id tiebreak, preserving the byte-identical-output property [CONFIRMED: iter-003 C6, F3/F4, iter-004 C6 row] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The C1 dormancy is verified against live data before any promotion | A live `skill-graph.sqlite` check confirms `conflicts_with` edge count is still 0 (and the `graph-metadata.json` files still declare `[]`) before promoting C1. Promotion is justified only by a NEW reciprocal conflict edge [CONFIRMED: iter-010, live `skill_edges` GROUP BY shows no `conflicts_with` row, 20 metadata files declare `[]`, verified 2026-06-19] |
| REQ-006 | QCR's class taxonomy and per-class multipliers are calibrated, not guessed | The class set and per-class lane-weight values are derived from a routing-quality benchmark on a representative prompt corpus, not hand-picked. The costly error (a misrouted class demoting the right skill) is measured before go [CONFIRMED: iter-001 Q1 risk, roadmap.md:75 "false positive that hurts single-hop precision", iter-004 residual] |
| REQ-007 | C6 does not regress the exhaustive semantic pass | The top-K rerank is a NARROWING/tiebreak move layered on the existing exact-cosine lane. It must not reduce recall vs the current exhaustive pass, and the 0.2 cutoff bypass applies ONLY to the top-K subset [CONFIRMED: iter-003 F2 ("narrowing, not an accuracy gain over the exhaustive pass"), F4] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: C1, QCR and C6 are implemented only as default-off seams. Live/default promotion remains gated and packet 030 remains untouched.
- **SC-002**: Each implemented seam honors its invariant, C1 is a deterministic post-fusion demotion counter path, QCR is additive and `explicit_author`-dominant and C6 is a bounded top-K tiebreak on the RRF survivor set with deterministic fallback.
- **SC-003**: The dependency on the RRF spine is explicit for all three candidates, and C1/QCR additionally name their non-RRF live gates (declared conflict edge, held-out benchmark).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | C1 hardens a code path that changes ZERO observable routing until a reciprocal conflict edge exists | Low now, wasted effort if shipped speculatively | Keep C1 PENDING. Do not prioritize above the C4 gate work. Promote only when a reciprocal `conflicts_with` edge is declared [CONFIRMED: iter-010 "Do NOT prioritize C1 above the C4 gate"] |
| Risk | QCR misroutes a class and demotes the right skill (the costly false positive) | High if shipped without a benchmark | Gate QCR on a held-out routing-quality benchmark. Ship behind shadow weights first. Keep `explicit_author` dominant [CONFIRMED: roadmap.md:75, iter-001 Q1 risk] |
| Risk | C6 re-orders a non-deterministic survivor set if built on today's weighted sum | Med, breaks the byte-identical-output property | Build C6 only after the 001 RRF spine (C3) lands. Require a deterministic skill-id tiebreak on the rerank [CONFIRMED: iter-003 C6 risk, iter-004 F9] |
| Risk | C6 over-narrows and reduces recall vs the exhaustive cosine pass | Med, the lane is already an exact oracle bounded by recall scope | Treat C6 as a tiebreak/boost over the top-K only. Do not replace the exhaustive pass. Verify no recall regression (REQ-007) [CONFIRMED: iter-003 F1/F2] |
| Dependency | 001 RRF determinism spine (sibling `001-rrf-determinism-spine`, candidate C3) | HARD, all three candidates ride it (C6 needs the rank-based survivor set, C1's demotion tiebreak and QCR's ordering inherit the deterministic spine) | Sequence this sub-phase after C3 ships. C1/QCR/C6 are downstream consumers, not the spine [CONFIRMED: research.md C3 "determinism spine for C1/C2/C6", iter-004 F9] |
| Dependency | A declared reciprocal `conflicts_with` skill edge (unblocks C1 live effect) | HARD for C1 live promotion, currently absent in prior evidence (0 edges live, all metadata `[]`) | C1's default-off seam exists, but live/default promotion stays pending until an edge exists. This sub-phase does NOT fabricate conflict edges |
| Dependency | A held-out routing-quality benchmark + class taxonomy calibration (unblocks QCR live/default use) | HARD for QCR live promotion, neither exists yet | QCR's default-off seam exists, but live/default promotion stays pending until the benchmark + calibrated taxonomy exist |
| Dependency | External model, aionforge query-class router (`retrieval.md:107-143`) + dense exact-rerank (`retrieval.md:25-31`) | Reference pattern for QCR + C6 | `external/aionforge-memory-development/docs/retrieval.md` (5-class router, approximate-then-Flat-oracle rerank) [CONFIRMED: iter-001 F9, iter-003 step 5] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: QCR's per-class lane-weight computation runs once per recommendation call at the `effectiveScorerWeights` merge point (`fusion.ts:69-82`), before the per-skill loop, O(1) in the number of skills, no added per-skill cost.
- **NFR-P02**: C6's exact-rerank is bounded to the fused top-K (e.g. K=10) survivors, NOT all projected skills, it reuses already-cached full-precision vectors (`semantic-shadow.ts:194-199`), so it adds at most K full-precision cosine computations per call.

### Security
- **NFR-S01**: None of C1/QCR/C6 introduce a new untrusted-input path. The query text is already the scorer's input, and QCR classifies it for weighting only (no execution, no storage).

### Reliability
- **NFR-R01**: Each candidate is reversible and, when its live gate is unmet, default-inert. C1's demotion is a no-op under empty conflict edges. QCR is disabled by default. C6 is disabled by default and requires the RRF path.
- **NFR-R02**: With all new flags disabled, the scorer's behavior is exactly today's weighted-sum fusion, this sub-phase adds no default-on behavior.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty `conflicts_with` edges (today's state): C1's post-fusion demotion contributes zero mass, the ranking is byte-identical to no-C1.
- Single skill matched: QCR's per-class multipliers still apply to the lane weights but cannot reorder a one-item list. C6's top-K rerank is a no-op below K survivors.
- All-cosine-below-0.2 subset: C6's cutoff bypass lets mid-range cosine break ties among strong candidates that the pre-fusion 0.2 cutoff would otherwise suppress (the exact case C6 targets).

### Error Scenarios
- Skill-graph rebuild in flight (graph_causal returns `[]`): C1's conflict mass is absent anyway (it rides graph edges). C1 stays inert. (The liveTotal degrade for this window is the sibling C5 sub-phase's concern, not C1's.)
- QCR class misclassification: degrades gracefully to a usable ordering (aionforge's "misclassification degrades gracefully"). The class is reported in the explanation. `explicit_author` dominance bounds the damage.
- C6 on a non-deterministic survivor set (pre-C3): MUST NOT ship, building C6 before C3 violates the byte-stable invariant.

### State Transitions
- Gate materializes (a reciprocal conflict edge is declared / a QCR benchmark is run / C3 ships): the corresponding candidate moves PENDING → promotable. Re-verify the live precondition (REQ-005 for C1) before implementing.
- Partial promotion: C6 may ship as soon as C3 lands even if C1/QCR stay PENDING, the three are independent downstream of the shared spine.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three scorer-seam candidates in `fusion.ts` (+ `graph-causal.ts` for C1, `semantic-shadow.ts` reuse for C6). Each effort M per research. Default-off code seams shipped; live/default promotion remains gated on conflict-edge evidence, held-out benchmark and C3 spine |
| Risk | 12/25 | QCR alters weighting on every call (Med conflict-risk, benchmark-gated). C1 is Low-risk (inert under empty edges). C6 ordering-stability depends on C3. No schema migration |
| Research | 6/20 | Fully researched (18-iteration campaign, adversarial-verified). Residual is calibration/benchmark detail, not investigation |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What reciprocal `conflicts_with` skill relationship, if any, justifies promoting C1? Today none exists (0 live edges, all metadata `[]`). C1 is latent until a real conflict pair is declared [CONFIRMED: iter-010].
- What is QCR's class taxonomy and the per-class lane-weight multipliers, and does a held-out routing-quality benchmark show a net gain over the current fixed split + `primaryIntentBonus` table? Both are open and gate QCR [CONFIRMED: roadmap.md:193. Iter-004 residual].
- For C6, what is the right top-K (K=10 is a research example, not a tuned value), and does bypassing the 0.2 cosine cutoff for the top-K subset improve tie-resolution without reducing recall? Needs the C3 survivor set to measure [CONFIRMED: iter-003 F3/F4].
- Should QCR's class buckets be reused as the distinct-source dimension for the C4 held-out attestation gate (iter-007 raised this cross-candidate reuse)? Out of scope here but worth tracking [CONFIRMED: iter-007].
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research evidence**: `../research/research.md` (Internal Baseline; Candidate Catalog; Broadening Addendum), `../research/iterations/iteration-001.md` (F5/F6/F9, Q1/Q2 hypotheses), `../research/iterations/iteration-002.md` (F16 critical gap, C1, F18), `../research/iterations/iteration-003.md` (Q4 F1-F4, C6), `../research/iterations/iteration-004.md` (C1/QCR/C6 ranked rows, F9), `../research/iterations/iteration-006.md` (C1 reframe + conflicts_with dormancy flag), `../research/iterations/iteration-010.md` (conflicts_with DORMANT decisive finding)
- **Deltas**: `../research/deltas/iter-002.jsonl` (C1, F16/F18), `../research/deltas/iter-003.jsonl` (C6), `../research/deltas/iter-004.jsonl` (QCR/C6 rows), `../research/deltas/iter-010.jsonl` (conflicts_with=0)
- **Roadmap**: `../../research/roadmap.md` (QCR row :75; C1/C3 spine :36,44,193; Skill Advisor open items :193)
- **Synthesis**: `../../research/synthesis/01-go-candidates.md` (Advisor C4/C5 needs-validation :59. Procedural follow-up :109)
- **Sibling sub-phase (hard dep)**: `../001-rrf-determinism-spine/spec.md` (C3, the RRF determinism spine all three ride)
- **Sibling sub-phase**: `../002-runtime-lane-health-degrade/spec.md` (C5/C5a/AMB, separate degrade unit)
- **Parent spec**: `../spec.md`
- **Wave-0 shipped record (evidence none done)**: Wave-0 record (no advisor C1/QCR/C6 row) + the candidate-status table (lines 213-226 cover only Memory/Code-Graph Wave-0 candidates)
<!-- /ANCHOR:related-docs -->
