---
title: "Spec: Code-Graph Seeded-PPR Impact Ranking Benchmark"
description: "Benchmarks the dark code-graph mechanism SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING against the flat reverse impact walk on labeled change-impact queries over the live code graph. Reconstructs the removed bounded seeded personalized PageRank from its recorded constants, ranks the same multi-hop candidate pool both ways, and measures impact-ranking precision recall and nDCG against a real edge-derived ground truth. The result is a verdict grounded in numbers rather than the inherited claim. PPR ties the flat walk on every quality metric at every K and degrades it at high damping, because every CALLS edge carries identical weight so PPR centrality collapses to the flat walk's hop ordering. Verdict CUT, confirmed by measurement, the flag and code stay deleted."
trigger_phrases:
  - "code graph seeded ppr benchmark"
  - "SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING flag"
  - "seeded pagerank vs flat impact walk"
  - "impact ranking precision recall benchmark"
  - "personalized pagerank code graph cut"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/002-codegraph-seeded-ppr"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the seeded-PPR vs flat-impact-walk benchmark and authored the CUT verdict"
    next_safe_action: "Phase complete, verdict lives in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/seeded-ppr-impact-benchmark.mjs"
      - "results/metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Code-Graph Seeded-PPR Impact Ranking Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-graph impact path shipped a bounded seeded personalized PageRank mechanism behind the default-off flag `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` in commit 657a0f6a3e. The changelog held it dark with damping cap and reliability-weight calibration noted as pending and a verdict deferred until a code-graph retrieval benchmark existed. No such benchmark was ever built. A later flag-resolution pass removed the flag and the code in commit 277c35344c with the one-line reason that PPR went negative on the real forward-CALLS graph where uniform edges make it equal to the prior ranking, but that reckoning recorded a conclusion without a reproducible per-query measurement of impact-ranking quality. This phase closes that gap. It asks the question the dark flag was held against on real change-impact queries, with numbers, so the CUT either stands on measured evidence or is overturned.

### Purpose
Measure whether bounded seeded personalized PageRank beats the flat reverse impact walk on impact-ranking quality for real change-impact queries over the live code graph, and return a graduate refine or cut verdict grounded strictly in the measured numbers. Reconstruct the removed PPR mechanism faithfully from its recorded constants, rank the same multi-hop candidate pool both ways so any difference is a ranking-quality difference and not a reachability artifact, score precision recall and nDCG against an edge-derived ground truth, sweep the damping to test whether calibration unlocks a win, and confirm the default-off state is exact since the flag and code are absent from the serving path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A self-contained read-only benchmark harness that backs up the live code graph and reconstructs the removed seeded-PPR mechanism plus the flat impact walk without importing or editing production code
- A labeled change-impact set derived from real reverse CALLS and IMPORTS edges, with the true impacted files defined as the 1-hop reverse dependents and a shared multi-hop candidate pool both rankers rank
- The impact-ranking metrics precision@K recall@K and nDCG@K at K of 3 5 and 8 for the flat walk and for PPR, plus a damping calibration sweep
- A verified default-off byte-identity statement, since the flag and the PPR symbol are absent from the live source and the served impact ranker is the flat walk unconditionally
- A graduate refine or cut verdict written into benchmark-results.md grounded strictly in the metrics

### Out of Scope
- Restoring the removed flag or the PPR code to the tree, which a graduate verdict would recommend but this phase does not enact
- Any change to the served flat impact walk in code-graph-context.ts, which is read and reconstructed as-is
- A new richer edge weighting that would give PPR a non-uniform substrate to differentiate on, which is a separate design question this benchmark only motivates if the verdict points there
- A reindex of the code graph, the benchmark reads a read-only backup as-is

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scripts/seeded-ppr-impact-benchmark.mjs | Create | The read-only benchmark harness that backs up the live graph, reconstructs both rankers and writes the metrics |
| results/metrics.json | Create | The per-query and aggregate metric rollup plus the calibration sweep and the byte-identity record |
| benchmark-results.md | Create | The full data tables and the graduation verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The benchmark measures PPR against the flat impact walk on the production-shaped impact path over the live code graph, read-only | the harness backs up code-graph.sqlite read-only and every read runs against the copy, the live DB mtime is unchanged after the run |
| REQ-002 | Both rankers rank the same candidate pool so a difference is a ranking-quality difference | the shared pool is every file reverse-reachable within maxHops, both the flat pool ranker and PPR rank that same pool, recorded per query |
| REQ-003 | The phase returns one of GRADUATE REFINE or CUT with evidence | benchmark-results.md states the verdict and every claim traces to a value in metrics.json |
| REQ-004 | Default-off byte-identity is verified | the flag and the PPR symbol are confirmed absent from the live source and dist, the served impact ranker is the flat walk unconditionally, recorded in metrics.json |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The damping calibration is swept to test whether tuning unlocks a win | metrics.json reports nDCG@K and precision@K for a damping grid bracketing the shipped 0.85 and whether any value beats the flat walk |
| REQ-006 | The benchmark is reproducible from the committed harness | `node scripts/seeded-ppr-impact-benchmark.mjs` rebuilds metrics.json exit 0 and the aggregate numbers are stable across runs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reproducible read-only benchmark that ranks a real edge-derived change-impact pool with both the flat walk and the reconstructed seeded PPR and reports precision recall and nDCG at K of 3 5 and 8
- **SC-002**: A measured answer to whether PPR beats the flat walk on impact-ranking quality, with the per-K deltas and the calibration sweep showing whether any damping unlocks a win
- **SC-003**: A graduation verdict for `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` grounded strictly in the measured numbers, stating whether the prior CUT stands on evidence
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A recall comparison over different candidate sets credits PPR for reaching multi-hop files the flat 1-hop walk structurally cannot, which is a reachability artifact not a ranking win | A false GRADUATE | Both rankers rank the same shared multi-hop pool, so the comparison isolates ranking quality from reachability |
| Risk | The reconstructed PPR drifts from the removed production algorithm | A verdict on a different mechanism than the one that shipped | The constants and the transition-weight and reliability functions are copied verbatim from the code-graph source at 657a0f6a3e and the algorithm mirrors computeBoundedPersonalizedPageRank and collectSeededPprImpactRanking |
| Dependency | The live code-graph database and its CALLS and IMPORTS edges | The benchmark cannot derive a labeled set or measure either ranker without real edges | The harness reads code-graph.sqlite read-only through a backup copy and derives the labels from real reverse edges |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The harness runs the full 20-query benchmark plus a five-point damping sweep against an in-memory-shaped read-only copy in a few seconds, since the graph is small relative to the bounded maxHops and iteration cap
- **NFR-P02**: The PPR power iteration honors the recorded iteration cap of 20 and the epsilon of 1e-6, so a query never runs an unbounded walk

### Security
- **NFR-S01**: The harness opens the live code graph read-only and runs every read against a temporary backup copy, so no benchmark cell mutates the live graph
- **NFR-S02**: The harness imports no production code and edits nothing outside this phase folder, so the serving path is untouched

### Reliability
- **NFR-R01**: The benchmark is deterministic, the labeled set the rankings and the metrics are stable across runs because the graph copy and the tie-breaks are fully ordered
- **NFR-R02**: The harness cleans up its temporary eval copy and leaves no files outside the results tree
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A symbol with a large reverse fan-in and a deep pool (resolve, 130 direct callers, a 194-file pool): both rankers still order the pool hop-first, so the quality metrics match
- A symbol whose pool is mostly 1-hop direct dependents: precision stays near one for both rankers because almost every pool member is a true impacted file
- A symbol with too few direct dependents or no multi-hop pool: excluded from the labeled set, since ranking it is not a real choice

### Error Scenarios
- The PPR working graph is empty or trivial after expansion: the harness returns an empty PPR ranking for that query rather than guessing, and the metric helpers return null for an empty top-K
- A high damping that lets the walk dominate the teleport: the sweep records that PPR nDCG falls below the flat walk at damping 0.95, which is the calibration answer, not an error

### State Transitions
- Flag absent to present: the flag and the PPR code are absent today so the served path is the flat walk, a present state would only matter after a separate restore decision the verdict does not make
- Damping low to high: at low and mid damping PPR collapses to the flat hop ordering and ties it, at high damping the walk component adds cross-tier noise and PPR falls behind, so no damping graduates the mechanism
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One read-only harness plus the metrics and the verdict, no production file touched |
| Risk | 4/25 | Read-only, no flag flip, no code restore, the only judgment risk is the comparison design which the shared pool mitigates |
| Research | 18/20 | A reconstructed mechanism, a real edge-derived labeled set, three metrics at three K values and a damping calibration sweep |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether a richer non-uniform edge weighting (resolved call targets, observed-versus-inferred provenance, real strength signals) would give PPR a substrate it could differentiate on, which would change the question but is a separate design not measured here
- Whether the flat walk should itself expand past 1 hop for impact queries, since the pool ranker already shows a hop-stratified multi-hop order is well-formed, a separate enhancement this benchmark only motivates
<!-- /ANCHOR:questions -->
