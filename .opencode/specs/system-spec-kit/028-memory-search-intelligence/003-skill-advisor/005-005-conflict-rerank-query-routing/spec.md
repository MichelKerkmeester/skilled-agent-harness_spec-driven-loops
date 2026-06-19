---
title: "Feature Specification: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)"
description: "Three deferred routing-quality refinements for the Skill Advisor 5-lane fusion scorer, all gated behind the 001 RRF determinism spine. C1 lifts the conflicts_with mass into a post-fusion demotion (latent: every skill declares conflicts_with []). QCR adds an intent class to per-lane weights (benchmark-gated speculation, no demonstrated mis-routing). C6 re-scores the fused top-K with full-precision cosine (needs C3's rank-based survivor set). Promote only when each gate materializes."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/005-005-conflict-rerank-query-routing"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author C1/QCR/C6 deferred-routing impl sub-phase spec (re-plan; all PENDING)"
    next_safe_action: "Hold until 001 RRF spine ships and each candidate gate materializes"
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
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/003-skill-advisor |
| **Candidates** | C1 (split-conflict re-rank), QCR (query-class lane-weight router), C6 (cross-lane semantic exact-rerank) |
| **Status (all)** | PENDING — none shipped in 030 Wave-0 (`git log 1ecc531431..ab5459fb6d` has no advisor/conflict/query-class/rerank commit; 030 §14 table has no advisor C1/QCR/C6 row). Each is a deferred routing refinement gated on the 001 RRF spine plus its own un-materialized condition |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Skill Advisor fuses five lanes — `explicit_author 0.42 / lexical 0.28 / graph_causal 0.13 / derived_generated 0.12 / semantic_shadow 0.05` (`lane-registry.ts:8-19`) — via a raw-score weighted SUM (`weightedScore = rawScore * weights[lane]` at `fusion.ts:366`; `score = Σ weightedScore` at `fusion.ts:372`) [CONFIRMED: research.md Internal Baseline; iter-001 F5/F6]. The research campaign catalogued three routing-quality refinements that ALL ride the 001 RRF determinism spine (sibling sub-phase `001-001-rrf-determinism-spine`, candidate C3 — "import the shared `fuseResultsMulti` so fusion reads RANK, not raw score") and are each individually un-actionable today for a distinct reason:

- **C1 (conflict-suppression re-rank)** is *latent until a skill declares a reciprocal `conflicts_with` edge.* The `graph_causal` lane carries a signed `conflicts_with: -0.35` multiplier (`graph-causal.ts:18`) that emits a negative score but is never enqueued for further BFS (`graph-causal.ts:77` `if (signed > 0)`) [CONFIRMED: iter-001 F6; iter-002 F16]. That negative mass has no rank-fusion meaning, so a naive RRF port would silently drop conflict suppression; C1 lifts it OUT of the lane sum into a deterministic post-fusion demotion in the sort comparator (the same surface `primaryIntentBonus` already uses at `fusion.ts:428-430`) [CONFIRMED: iter-006]. But the path is DORMANT: the live `skill-graph.sqlite` has ZERO `conflicts_with` edges (only `depends_on=9`, `enhances=33`, `prerequisite_for=10/11`, `siblings=22`) and all 20+ real-skill `graph-metadata.json` declare `"conflicts_with": []` — so C1 changes zero observable routing until a reciprocal conflict edge exists [CONFIRMED: iter-010 decisive finding; verified live 2026-06-19].

- **QCR (query-class → lane-weight router)** is *benchmark-gated speculation with no demonstrated mis-routing.* Intent enters the scorer today only via two ad-hoc surfaces: the `TASK_INTENT`/breadth/multi-concern regexes for confidence + abstention (`fusion.ts:44-56,484-513`) and the hand-maintained per-`(phrase,skill)` `primaryIntentBonus` table (`fusion.ts:259-332,428-430`) [CONFIRMED: iter-001 F5]. QCR would classify a query into a small intent class set and feed per-class lane-weight multipliers through the existing `effectiveScorerWeights` merge point (`fusion.ts:69-82`), additively, never replacing the dominant `explicit_author` lane [CONFIRMED: iter-001 Q1; iter-004 QCR row]. It is the highest-ceiling candidate but the costliest error is a misrouted class that demotes the right skill, and the research never produced a held-out routing-quality measurement: the class taxonomy, per-class multipliers, and a benchmark all remain open [CONFIRMED: roadmap.md:75,193; iter-004 residual note].

- **C6 (cross-lane semantic exact-rerank)** *needs C3's rank-based survivor set.* The `semantic_shadow` lane (weight 0.05) already computes EXACT full-precision cosine over every projected skill (`cosineSimilarity` iterating raw `Float32Array` at `semantic-shadow.ts:47-69`; brute-force `projection.skills.map(...)` then `score <= COSINE_THRESHOLD (0.2)` at `semantic-shadow.ts:11,213-220`) [CONFIRMED: iter-003 F1/F2]. There is no ANN stage to "graduate" — so the real lever is to re-score only the fused top-K survivors with full-precision cosine as a bounded tiebreak/boost, bypassing the 0.2 cutoff for that subset, letting the 0.05 lane RESOLVE ties instead of diluting the sum [CONFIRMED: iter-003 F3/F4, C6 candidate]. This is meaningful only once C3 produces a stable rank-based survivor set and the deterministic id tiebreak that keeps C6's re-order byte-stable; on today's weighted-sum it would re-order a non-deterministic set.

### Purpose
Hold C1, QCR, and C6 as documented, evidence-cited deferred refinements — each PENDING with an explicit gate — so they are not silently lost, and promote each one only when its gating condition materializes (a declared reciprocal conflict edge for C1; a demonstrated mis-routing case plus a held-out benchmark for QCR; the shipped 001 RRF spine for C6).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **C1** — lift the `conflicts_with: -0.35` mass out of the `graph_causal` lane sum into a deterministic, auditable post-fusion demotion in the sort comparator (mirroring `primaryIntentBonus`), with its own applied-counter; ship ONLY once a reciprocal conflict edge exists in the graph.
- **QCR** — a query-class classifier mapping each query to a small intent class, feeding per-class lane-weight multipliers through `effectiveScorerWeights` (`fusion.ts:69-82`), additive and keeping `explicit_author` dominant; ship behind shadow weights and gate on a held-out routing-quality benchmark.
- **C6** — a cross-lane exact-rerank pass over the fused top-K survivors using full-precision cosine (bypassing the 0.2 cutoff for that subset only), as a bounded tiebreak/boost with a deterministic skill-id tiebreak; ship after the 001 RRF spine (C3) lands.
- Per-candidate gate tracking and the materialization conditions that unblock each one.

### Out of Scope
- **C3 (import the shared deterministic RRF `fuseResultsMulti`)** — the determinism spine itself, tracked under the sibling sub-phase `001-001-rrf-determinism-spine`. C1/QCR/C6 are downstream consumers of it, not the spine [CONFIRMED: roadmap.md:36,44; research.md C3 row; iter-004 F9].
- **C5 / C5a / AMB (runtime lane-health & graceful lane-degrade)** — tracked under the sibling sub-phase `002-002-runtime-lane-health-degrade` [CONFIRMED: roadmap.md:90-91].
- **C4 (Beta-posterior lane auto-tune) and the SA-two-gate / cold-start / held-out / un-promotion chain** — a from-scratch Beta build (the live estimator is raw-frequency, NO Beta math), a separate Phase-2/3 track [CONFIRMED: BROADENING §2; iter-014 G14-03].
- **SA-outcome-weighted-ranking** (procedural Beta reliability over skill-execution outcomes) — a follow-on packet; proxy-only today, no execution-success emitter exists [CONFIRMED: synthesis 01-go-candidates.md:109; roadmap.md:268].
- Building skill `conflicts_with` edges — declaring reciprocal conflict relationships between skills is a separate authoring decision that unblocks C1; this sub-phase does NOT fabricate conflict edges.
- The other three subsystems (Memory MCP, Code Graph, Deep Loop) — each tracked under its own 028 subsystem.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modify (when promoted) | C1: add a post-fusion `conflicts_with` demotion in the ranking comparator (`:425-433`), beside `primaryIntentBonus` (`:428-430`), with its own applied-counter. QCR: compute a class→lane-multiplier and feed it through `effectiveScorerWeights` (`:69-82`) before the per-skill loop. C6: a top-K exact-rerank tiebreak after the fused ranking (`:425+`) |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts` | Modify (when C1 promoted) | C1: stop folding the negative `conflicts_with: -0.35` (`:18`) into the lane sum; surface the conflict mass separately for the post-fusion demotion |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Reuse (when C6 promoted) | C6: reuse `cosineSimilarity` + the cached full-precision vectors (`:47-69,194-199`) for the top-K rerank; no change to the lane's pre-fusion 0.2-cutoff path |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/*.vitest.ts` | Create (when promoted) | Per-candidate fixtures: C1 conflict demotion is deterministic + inert when no conflict edge exists; QCR class routing keeps `explicit_author` dominant + shadow-only by default; C6 top-K re-order is byte-stable via the skill-id tiebreak |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each candidate carries an explicit PENDING status and a named gate | C1 gate = `dormant-data` (needs a reciprocal `conflicts_with` edge) + `shared-infra-dep` (001 RRF spine); QCR gate = `needs-benchmark` (held-out routing-quality) + `shared-infra-dep`; C6 gate = `shared-infra-dep` (001 RRF spine / C3 rank-based survivor set). No candidate is implemented while its gate is unmet [CONFIRMED: iter-010; roadmap.md:75,193; iter-003 C6] |
| REQ-002 | C1, when promoted, applies conflict suppression as a deterministic post-fusion demotion, NOT a fused rank term | The `conflicts_with: -0.35` mass is lifted out of the `graph_causal` lane sum and applied in the sort comparator (like `primaryIntentBonus`, `fusion.ts:428-430`) with its own applied-counter and a deterministic tiebreak; it is inert (zero observable change) while every skill declares `conflicts_with []` [CONFIRMED: iter-002 C1; iter-006; iter-010] |
| REQ-003 | QCR, when promoted, is additive and never replaces the `explicit_author` lane | Per-class lane multipliers feed through `effectiveScorerWeights` (`fusion.ts:69-82`); `explicit_author` stays dominant; QCR ships behind shadow weights and is gated on a held-out routing-quality benchmark before any live weight change [CONFIRMED: iter-001 Q1; iter-004 QCR; roadmap.md:75] |
| REQ-004 | C6, when promoted, depends on the 001 RRF spine and is byte-stable | C6 re-scores only the fused top-K survivors from C3's rank-based set with full-precision cosine (bypassing the 0.2 cutoff for that subset), as a bounded tiebreak; the re-order is deterministic via a skill-id tiebreak, preserving the byte-identical-output property [CONFIRMED: iter-003 C6, F3/F4; iter-004 C6 row] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The C1 dormancy is verified against live data before any promotion | A live `skill-graph.sqlite` check confirms `conflicts_with` edge count is still 0 (and the `graph-metadata.json` files still declare `[]`) before promoting C1; promotion is justified only by a NEW reciprocal conflict edge [CONFIRMED: iter-010 — live `skill_edges` GROUP BY shows no `conflicts_with` row; 20 metadata files declare `[]`, verified 2026-06-19] |
| REQ-006 | QCR's class taxonomy and per-class multipliers are calibrated, not guessed | The class set and per-class lane-weight values are derived from a routing-quality benchmark on a representative prompt corpus, not hand-picked; the costly error (a misrouted class demoting the right skill) is measured before go [CONFIRMED: iter-001 Q1 risk; roadmap.md:75 "false positive that hurts single-hop precision"; iter-004 residual] |
| REQ-007 | C6 does not regress the exhaustive semantic pass | The top-K rerank is a NARROWING/tiebreak move layered on the existing exact-cosine lane; it must not reduce recall vs the current exhaustive pass, and the 0.2 cutoff bypass applies ONLY to the top-K subset [CONFIRMED: iter-003 F2 ("narrowing, not an accuracy gain over the exhaustive pass"), F4] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: C1, QCR, and C6 each remain documented with a cited gate and stay PENDING until their gate materializes — none is implemented prematurely (REQ-001 met). C1's dormancy is re-verified live (REQ-005).
- **SC-002**: When promoted, each candidate honors its invariant — C1 is a deterministic post-fusion demotion inert under empty conflict edges (REQ-002), QCR is additive and `explicit_author`-dominant behind a benchmark (REQ-003/REQ-006), C6 is a byte-stable top-K tiebreak on C3's survivor set with no recall regression (REQ-004/REQ-007).
- **SC-003**: The dependency on the 001 RRF spine (sibling `001-001-rrf-determinism-spine`, candidate C3) is explicit for all three candidates, and C1/QCR additionally name their non-RRF gates (declared conflict edge; held-out benchmark).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | C1 hardens a code path that changes ZERO observable routing until a reciprocal conflict edge exists | Low now — wasted effort if shipped speculatively | Keep C1 PENDING; do not prioritize above the C4 gate work; promote only when a reciprocal `conflicts_with` edge is declared [CONFIRMED: iter-010 "Do NOT prioritize C1 above the C4 gate"] |
| Risk | QCR misroutes a class and demotes the right skill (the costly false positive) | High if shipped without a benchmark | Gate QCR on a held-out routing-quality benchmark; ship behind shadow weights first; keep `explicit_author` dominant [CONFIRMED: roadmap.md:75; iter-001 Q1 risk] |
| Risk | C6 re-orders a non-deterministic survivor set if built on today's weighted sum | Med — breaks the byte-identical-output property | Build C6 only after the 001 RRF spine (C3) lands; require a deterministic skill-id tiebreak on the rerank [CONFIRMED: iter-003 C6 risk; iter-004 F9] |
| Risk | C6 over-narrows and reduces recall vs the exhaustive cosine pass | Med — the lane is already an exact oracle bounded by recall scope | Treat C6 as a tiebreak/boost over the top-K only; do not replace the exhaustive pass; verify no recall regression (REQ-007) [CONFIRMED: iter-003 F1/F2] |
| Dependency | 001 RRF determinism spine (sibling `001-001-rrf-determinism-spine`, candidate C3) | HARD — all three candidates ride it (C6 needs the rank-based survivor set; C1's demotion tiebreak and QCR's ordering inherit the deterministic spine) | Sequence this sub-phase after C3 ships; C1/QCR/C6 are downstream consumers, not the spine [CONFIRMED: research.md C3 "determinism spine for C1/C2/C6"; iter-004 F9] |
| Dependency | A declared reciprocal `conflicts_with` skill edge (unblocks C1) | HARD for C1 — currently absent (0 edges live; all metadata `[]`) | C1 stays PENDING until an edge exists; this sub-phase does NOT fabricate conflict edges [CONFIRMED: iter-010; verified live 2026-06-19] |
| Dependency | A held-out routing-quality benchmark + class taxonomy (unblocks QCR) | HARD for QCR — neither exists yet | QCR stays PENDING until the benchmark + calibrated taxonomy exist [CONFIRMED: roadmap.md:193; iter-004 residual] |
| Dependency | External model — aionforge query-class router (`retrieval.md:107-143`) + dense exact-rerank (`retrieval.md:25-31`) | Reference pattern for QCR + C6 | `external/aionforge-memory-development/docs/retrieval.md` (5-class router; approximate-then-Flat-oracle rerank) [CONFIRMED: iter-001 F9; iter-003 step 5] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: QCR's per-class lane-weight computation runs once per recommendation call at the `effectiveScorerWeights` merge point (`fusion.ts:69-82`), before the per-skill loop — O(1) in the number of skills, no added per-skill cost.
- **NFR-P02**: C6's exact-rerank is bounded to the fused top-K (e.g. K=10) survivors, NOT all projected skills — it reuses already-cached full-precision vectors (`semantic-shadow.ts:194-199`), so it adds at most K full-precision cosine computations per call.

### Security
- **NFR-S01**: None of C1/QCR/C6 introduce a new untrusted-input path; the query text is already the scorer's input, and QCR classifies it for weighting only (no execution, no storage).

### Reliability
- **NFR-R01**: Each candidate is reversible (branch-only) and, when its gate is unmet, INERT: C1's demotion is a no-op under empty conflict edges; QCR ships behind shadow weights (no live weight change); C6 is absent until C3 lands.
- **NFR-R02**: When all three are unbuilt, the scorer's behavior is exactly today's weighted-sum fusion — this sub-phase adds no default-on behavior.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty `conflicts_with` edges (today's state): C1's post-fusion demotion contributes zero mass — the ranking is byte-identical to no-C1.
- Single skill matched: QCR's per-class multipliers still apply to the lane weights but cannot reorder a one-item list; C6's top-K rerank is a no-op below K survivors.
- All-cosine-below-0.2 subset: C6's cutoff bypass lets mid-range cosine break ties among strong candidates that the pre-fusion 0.2 cutoff would otherwise suppress (the exact case C6 targets).

### Error Scenarios
- Skill-graph rebuild in flight (graph_causal returns `[]`): C1's conflict mass is absent anyway (it rides graph edges); C1 stays inert. (The liveTotal degrade for this window is the sibling C5 sub-phase's concern, not C1's.)
- QCR class misclassification: degrades gracefully to a usable ordering (aionforge's "misclassification degrades gracefully"); the class is reported in the explanation; `explicit_author` dominance bounds the damage.
- C6 on a non-deterministic survivor set (pre-C3): MUST NOT ship — building C6 before C3 violates the byte-stable invariant.

### State Transitions
- Gate materializes (a reciprocal conflict edge is declared / a QCR benchmark is run / C3 ships): the corresponding candidate moves PENDING → promotable; re-verify the live precondition (REQ-005 for C1) before implementing.
- Partial promotion: C6 may ship as soon as C3 lands even if C1/QCR stay PENDING — the three are independent downstream of the shared spine.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three scorer-seam candidates in `fusion.ts` (+ `graph-causal.ts` for C1, `semantic-shadow.ts` reuse for C6); each effort M per research, but ALL deferred — this sub-phase authors the deferred plan, not code |
| Risk | 12/25 | QCR alters weighting on every call (Med conflict-risk, benchmark-gated); C1 is Low-risk (inert under empty edges); C6 ordering-stability depends on C3; no schema migration |
| Research | 6/20 | Fully researched (18-iteration campaign, adversarial-verified); residual is calibration/benchmark detail, not investigation |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What reciprocal `conflicts_with` skill relationship, if any, justifies promoting C1? Today none exists (0 live edges; all metadata `[]`); C1 is latent until a real conflict pair is declared [CONFIRMED: iter-010].
- What is QCR's class taxonomy and the per-class lane-weight multipliers, and does a held-out routing-quality benchmark show a net gain over the current fixed split + `primaryIntentBonus` table? Both are open and gate QCR [CONFIRMED: roadmap.md:193; iter-004 residual].
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
- **Synthesis**: `../../research/synthesis/01-go-candidates.md` (Advisor C4/C5 needs-validation :59; procedural follow-up :109)
- **Sibling sub-phase (hard dep)**: `../001-001-rrf-determinism-spine/spec.md` (C3 — the RRF determinism spine all three ride)
- **Sibling sub-phase**: `../002-002-runtime-lane-health-degrade/spec.md` (C5/C5a/AMB — separate degrade unit)
- **Parent spec**: `../spec.md`
- **Wave-0 shipped record (evidence none done)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (no advisor C1/QCR/C6 row) + the candidate-status table (lines 213-226 cover only Memory/Code-Graph Wave-0 candidates)
<!-- /ANCHOR:related-docs -->
