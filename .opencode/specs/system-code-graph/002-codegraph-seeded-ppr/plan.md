---
title: "Implementation Plan: Code-Graph Seeded-PPR Impact Ranking Benchmark"
description: "Builds a read-only benchmark that reconstructs the removed seeded-PPR mechanism from its recorded constants and measures it against the flat reverse impact walk on real change-impact queries over the live code graph. Both rankers rank the same multi-hop candidate pool so a difference is a ranking-quality difference, with precision recall and nDCG at K of 3 5 and 8 plus a damping calibration sweep, against a backup copy. Confirms default-off byte-identity since the flag and code are absent from the serving path. Rejects a recall comparison over different candidate sets as the wrong fit because it would credit PPR for reach not ranking."
trigger_phrases:
  - "code graph seeded ppr benchmark plan"
  - "seeded pagerank vs flat impact walk"
  - "shared candidate pool ranking comparison"
  - "ppr damping calibration sweep"
  - "reconstruct removed ppr mechanism"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/002-codegraph-seeded-ppr"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the harness and the shared-pool comparison, run complete"
    next_safe_action: "Compute metrics and write the verdict"
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
# Implementation Plan: Code-Graph Seeded-PPR Impact Ranking Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | A Node ESM `.mjs` benchmark over the code-graph SQLite graph through the code-graph server better-sqlite3 |
| **Framework** | A read-only backup copy of the live code graph, a faithful in-harness reconstruction of the removed seeded-PPR mechanism, no production import |
| **Storage** | A read-only code-graph backup and a single metrics.json rollup |
| **Testing** | A deterministic 20-query labeled set, a five-point damping sweep, an exit-0 reproducibility re-run |

### Overview
This phase benchmarks the dark code-graph mechanism `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` against the flat reverse impact walk it was held against. The harness backs up the live code graph read-only, derives a labeled change-impact set from real reverse CALLS and IMPORTS edges, and ranks a shared multi-hop candidate pool two ways. The flat pool ranker orders the pool by the structural impact prior the flat walk encodes, nearer hops first. The PPR ranker reconstructs `computeBoundedPersonalizedPageRank` and `collectSeededPprImpactRanking` from the constants recorded in the code-graph source at 657a0f6a3e, seeded from the changed symbol over an undirected projection of the impact edges with the confidence-folded and reliability-folded transition weights. Both rank the same pool, so any difference is a ranking-quality difference and not a reachability artifact. The harness scores precision@K recall@K and nDCG@K at K of 3 5 and 8 against the 1-hop direct-impact ground truth and an inverse-hop graded relevance, sweeps the damping across a grid bracketing the shipped 0.85, and records that the flag and PPR symbol are absent from the live source so the served impact ranker is the flat walk unconditionally. A recall comparison over different candidate sets was considered and rejected: it would credit PPR for reaching multi-hop files the flat 1-hop walk cannot, which measures reach not ranking, so the shared pool is the fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A read-only reconstruction benchmark over a shared candidate pool. The harness never imports or edits production code. It copies the live graph, rebuilds both the served flat walk and the removed PPR mechanism in-harness from the recorded source, and ranks one shared pool with each so the comparison isolates ranking quality. The metrics and the verdict live entirely in this phase folder.

### Key Components
- **`scripts/seeded-ppr-impact-benchmark.mjs`**: the harness. Backs up code-graph.sqlite read-only, derives the labeled set, ranks the shared pool with the flat pool ranker and the reconstructed PPR, scores the metrics, sweeps the damping and writes metrics.json.
- **The shared candidate pool**: every file reverse-reachable from the changed symbol through CALLS and IMPORTS within maxHops, tagged with its minimum hop. Both rankers rank this same pool.
- **The ground truth**: the direct impacted files, the files holding a 1-hop reverse dependent, for precision and recall, plus an inverse-hop graded relevance for nDCG.
- **The reconstructed PPR**: `computeBoundedPersonalizedPageRank` and `collectSeededPprImpactRanking` rebuilt from the constants at 657a0f6a3e, over the undirected projection with the confidence-folded and reliability-folded transition weights.

### Data Flow
A changed symbol enters the harness. The reverse-reach walk builds the shared pool and the ground truth from real edges. The flat pool ranker orders the pool hop-first. The PPR ranker expands the undirected projection, runs the bounded power iteration seeded at the symbol and orders the same pool by PPR score. The metric helpers score precision recall and nDCG at each K against the ground truth and the graded relevance. The damping sweep reruns PPR across the grid. All rows aggregate into metrics.json, the single source for the data tables and the verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase is a read-only benchmark, not a fix. It touches no shared production surface. It reads the code-graph database read-only through a backup copy and reads the production source for reconstruction without importing or editing it. The table records the surfaces the harness reads so the read-only boundary is auditable.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-code-graph/mcp_server/database/code-graph.sqlite` | The live code graph | read-only through a backup copy | the live DB mtime is unchanged after the run, every read runs against the temporary copy |
| `system-code-graph/mcp_server/lib/code-graph-context.ts` | The served flat impact walk and the removed PPR mechanism | read as the reconstruction source, never imported or edited | the served impact path is mirrored as the flat walk, the PPR constants and functions are copied verbatim |
| `scripts/seeded-ppr-impact-benchmark.mjs` | The benchmark harness | create inside this phase folder | the harness writes only metrics.json and the temporary eval copy, cleaned up after the run |

Required inventories:
- Same-class producers: the served flat walk lives in `code-graph-context.ts` case impact, the removed PPR lived in `computeBoundedPersonalizedPageRank` and `collectSeededPprImpactRanking` at 657a0f6a3e, both reconstructed in-harness.
- Consumers of changed symbols: none, no production code is changed, the harness is self-contained.
- Matrix axes: 20 labeled change-impact queries by reverse fan-in, two rankers (flat pool and PPR), three metrics (precision recall nDCG), three K values (3 5 8), five damping points (0.5 to 0.95).
- Algorithm invariant: both rankers rank the same shared multi-hop pool, the PPR constants match the recorded source, and the served impact ranker is the flat walk unconditionally because the flag and PPR code are absent from the live tree.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate the live code graph and confirm the CALLS and IMPORTS edge metadata shape
- [x] Recover the removed PPR constants and the transition-weight and reliability functions from the code-graph source at 657a0f6a3e
- [x] Confirm the flag and the PPR symbol are absent from the live source and dist

### Phase 2: Core Implementation
- [x] Write the read-only backup and the edge and node readers over the eval copy
- [x] Derive the labeled change-impact set, the shared multi-hop pool and the direct-impact ground truth from real reverse edges
- [x] Reconstruct the flat pool ranker and the bounded seeded PPR over the undirected projection with the recorded transition weights
- [x] Score precision recall and nDCG at K of 3 5 and 8 for both rankers and sweep the damping grid

### Phase 3: Verification
- [x] Confirm the benchmark reproduces exit 0 and the aggregate numbers are stable across runs
- [x] Confirm the live DB mtime is unchanged and no temporary eval copy leaks
- [x] Author the results tables and the graduation verdict grounded strictly in metrics.json
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The metric helpers behave, nDCG drops below one on a hop-scrambled order so a 1.0 is a real ideal ordering not an artifact | an inline nDCG discrimination check |
| Integration | The harness backs up the live graph read-only, ranks the shared pool both ways and writes a well-formed metrics.json | a full `node scripts/seeded-ppr-impact-benchmark.mjs` run, exit 0 |
| Manual | Spot-check that PPR ties the flat walk on every quality metric and that no damping unlocks a win | reading the aggregate deltas and the calibration sweep in metrics.json |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The live code graph and its CALLS and IMPORTS edges | Internal | Green | The benchmark cannot derive a labeled set or measure either ranker |
| The code-graph server better-sqlite3 native module | Internal | Green | The harness cannot open or back up the graph without it |
| The recorded PPR constants and functions at 657a0f6a3e | Internal | Green | The reconstruction cannot match the removed mechanism without them |
| The git history of the seeded-PPR build and removal | Internal | Green | The reconstruction source and the removal context come from 657a0f6a3e and 277c35344c |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The benchmark proves unsound or the phase is abandoned.
- **Procedure**: Delete this phase folder. Nothing in the serving path changed, the harness is read-only and self-contained, so there is no production rollback to perform.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **4-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The harness opens the live graph read-only and runs every read against a backup copy
- [x] The harness imports no production code and edits nothing outside this phase folder
- [x] The benchmark reproduces exit 0 with stable aggregate numbers before any claim

### Rollback Procedure
1. Delete this phase folder, the harness is read-only and self-contained
2. Confirm the live code graph mtime is unchanged, since the benchmark only read a copy
3. No flag flip and no code restore happened, so the serving path needs no reversal

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the benchmark reads a code-graph backup without writing it and changes no production default
<!-- /ANCHOR:enhanced-rollback -->

---
