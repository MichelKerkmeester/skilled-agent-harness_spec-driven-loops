---
title: "Spec: Retrieval-Class Channel Weights Benchmark"
description: "Benchmarks the default-off SPECKIT_RETRIEVAL_CLASS_ROUTING flag on the production search path. The five-class query classifier runs always-on. This flag gates the per-class channel suppression that drops the graph and degree channels for a narrow single-hop find-one-item query. The question is whether suppressing those channels raises precision at rank one on single-hop queries without costing recall on multi-hop queries. A labeled set split into ten single-hop find-one queries and eight multi-hop queries runs through the production executePipeline flag-off vs flag-on against a read-only backup of the live corpus. The measured result is single-hop precision at one of 0.90 off and 0.80 on, a 0.10 drop, and multi-hop recall at ten of 0.75 in both states with every multi-hop channel set and top-K byte-identical. The graph and degree channels were helping at least one single-hop query, so suppression lowers precision with no recall benefit. Verdict CUT."
trigger_phrases:
  - "retrieval class channel weights"
  - "SPECKIT_RETRIEVAL_CLASS_ROUTING benchmark"
  - "single-hop channel suppression precision"
  - "graph degree channel suppression single-hop"
  - "retrieval class routing graduation verdict"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/004-dark-flag-graduation/002-retrieval-class-weights"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the prod-path benchmark, authored spec, plan, tasks, results and verdict"
    next_safe_action: "Phase complete, verdict CUT lives in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/retrieval-class-routing-benchmark.mjs"
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
# Spec: Retrieval-Class Channel Weights Benchmark

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
| **Branch** | `system-speckit/004-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`SPECKIT_RETRIEVAL_CLASS_ROUTING` is built, default-off, and never measured against the real corpus on the production path. The five-class query classifier runs always-on. This flag gates one behavior. For a narrow single-hop find-one-item query it suppresses the graph and degree channels before the intent and entity-density preservation checks run, on the theory that those two channels add noise to a query where one exact item is the answer. The flag is byte-identical when off. Nobody knows whether suppressing those channels is a latent precision win, a near-miss that one refinement would rescue, or dead weight to cut. The hypothesis has never been tested where it has to count, which is the truncation-active production path against the live corpus, not the unforced eval path.

### Purpose
Measure the flag on the production path and return a graduate, refine, or cut verdict backed by real-corpus numbers. The benchmark asks one question. Does suppressing the graph and degree channels for single-hop queries raise precision at rank one without costing recall on multi-hop queries. It measures single-hop precision at one and multi-hop recall at ten, flag-off vs flag-on, through the production `executePipeline` against a read-only backup of the live memory corpus, and grounds the verdict strictly in the measured deltas and the run-to-run stability.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A labeled set of ten single-hop find-one queries with a labeled target spec folder and eight multi-hop queries with a labeled relevant folder set
- A self-contained benchmark harness that drives the production `executePipeline` flag-off vs flag-on against a read-only corpus backup
- Single-hop precision at one and multi-hop recall at ten for both flag states, plus the routeQuery channel set per query that proves the graph and degree suppression
- A default-off byte-identity check on the production path, read from the multi-hop rows where the channel set and the top-K must stay identical flag-off vs flag-on
- A graduate, refine, or cut verdict for `SPECKIT_RETRIEVAL_CLASS_ROUTING` grounded in the measured deltas

### Out of Scope
- Flipping `SPECKIT_RETRIEVAL_CLASS_ROUTING` to default-on or off. No production default is touched. The verdict is a recommendation, not a flip
- Editing shared production code. The harness reads production code to import it, it never modifies the query router, the search flags, or any other feature's files
- Re-indexing the corpus. The harness reads a read-only backup of the live database and its active vector shard as-is
- Re-tuning the per-class channel weights or the classifier patterns. The flag under test gates only the SingleHop graph and degree suppression, and the benchmark measures that behavior as shipped

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scripts/retrieval-class-routing-benchmark.mjs | Create | The benchmark harness over the labeled single-hop and multi-hop set, flag-off vs flag-on, on the production path |
| results/metrics.json | Create | The per-query and aggregate metric rollup |
| benchmark-results.md | Create | The full data tables and the graduation verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The benchmark measures the flag on the production path, not only the unforced eval path | each query runs through `executePipeline` under shipped default flags with only `SPECKIT_RETRIEVAL_CLASS_ROUTING` toggled, so a precision or recall number proves a prod-path keep |
| REQ-002 | The harness reads the corpus read-only and is reproducible from committed config | the live database and active vector shard are backed up read-only to a temporary eval copy and never opened for writes, and `node scripts/retrieval-class-routing-benchmark.mjs` rebuilds metrics.json exit 0 |
| REQ-003 | The phase returns one of GRADUATE, REFINE, or CUT with evidence | benchmark-results.md states the verdict and every claim traces to a value in metrics.json |
| REQ-004 | Default-off byte-identity is verified for the flag on the production path | every multi-hop row keeps an identical channel set and an identical top-K flag-off vs flag-on, the off-equals-baseline evidence the suite requires |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The measured deltas are confirmed stable against run-to-run variance | the single-hop precision delta and the multi-hop recall delta repeat across three runs, so the verdict reflects a stable signal not noise |
| REQ-006 | The result-level metric is grounded in the actual channel suppression | metrics.json records, per single-hop query, whether the flag suppressed graph and degree, so the precision delta is tied to the routing change rather than asserted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A runnable, reproducible benchmark that measures `SPECKIT_RETRIEVAL_CLASS_ROUTING` on the production path against a read-only corpus backup
- **SC-002**: Single-hop precision at one and multi-hop recall at ten for both flag states, with the per-query channel suppression recorded, showing the precision delta is -0.10 and the recall delta is 0.00
- **SC-003**: A graduation verdict for `SPECKIT_RETRIEVAL_CLASS_ROUTING`, grounded strictly in the measured deltas and the byte-identity check, stating whether the flag is ready to become the default
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A win measured on the unforced eval path vanishes on the truncation-active prod path | A false graduate that regresses production | The harness reads the production `executePipeline` under shipped defaults, so the precision and recall numbers are prod-path numbers |
| Risk | The labeled targets are expectations not external ground truth, so a folder label could be wrong | A precision or recall number that scores the wrong target | Each target is grounded in the corpus titles and spec folders, the match is a folder startsWith so a parent label matches any doc under it, and the flipped query is inspected by hand against its rank-1 folder |
| Risk | The harness mutates the live corpus | A benchmark cell corrupts the memory database | The live database and shard are backed up read-only to a temporary eval copy and every search runs against the copy, no write and no reindex |
| Dependency | The production `executePipeline`, `routeQuery`, and the active embedder | Internal | The benchmark cannot run the prod path or resolve channels without them, all present and green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The harness runs eighteen queries through the pipeline twice each, once per flag state, with the embedding computed once per query, so the run completes in seconds against the read-only copy
- **NFR-P02**: The wide pipeline limit prevents the Stage-4 final cap from trimming, so a suppressed channel is the only reason a row leaves the result between the off and on states

### Security
- **NFR-S01**: The harness reads a read-only corpus backup and issues no write, so no benchmark cell mutates the live memory database
- **NFR-S02**: The flag is toggled only in-process through the environment and restored to off after each pair, so no state leaks across the live runtime

### Reliability
- **NFR-R01**: The search path is deterministic for a fixed corpus, so the measured deltas repeat run-to-run, confirmed across three runs
- **NFR-R02**: The harness never edits shared production code, it imports it read-only, so the benchmark cannot perturb the system under test
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A single-hop query that already routes without graph: the flag suppresses nothing for it, so its result is identical flag-off vs flag-on, and it contributes the same precision in both states
- A single-hop query where graph and degree were preserved by intent or entity density: the flag suppresses both, which is where the precision effect surfaces
- An Entity-class query phrased like a find-one: the classifier reads it Entity not SingleHop, so the suppression short-circuit never fires and the channel set is identical flag-off vs flag-on

### Error Scenarios
- A multi-hop query: the classifier reads it MultiHop or Neutral, never SingleHop, so the suppression never fires, the channel set and the top-K stay byte-identical, and recall is preserved by construction
- The skill-advisor-daemon single-hop query: graph and degree pulled the correct packet to rank one, so suppressing them drops the correct packet and the rank-1 folder flips to a wrong one, the one query that lowers precision under the flag

### State Transitions
- Flag off to on: a single-hop query with graph preserved loses the graph and degree channels and its top reshuffles, a multi-hop query sees no change at all
- Channel preserved to suppressed: when graph was preserved the suppression removes it and the result changes, when graph was never preserved the suppression is a no-op and the result is identical
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One benchmark harness, one labeled set, no production edit |
| Risk | 4/25 | Read-only backup, no default flip, no shared-code edit, the only judgment risk is the labels which are inspected |
| Research | 18/20 | A prod-path benchmark over eighteen labeled queries with per-query channel suppression, precision and recall deltas, and a three-run stability check |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether an entity-density-aware suppression that keeps graph and degree when the single-hop query hits high-degree memory rows would recover the skill-advisor-daemon precision while still trimming noise elsewhere, a refinement the verdict notes but does not pursue since the flat suppression as built shows no win
- Whether a larger labeled set or a different corpus snapshot would move the single-hop precision delta, since the measured -0.10 rests on one flipped query out of ten
<!-- /ANCHOR:questions -->
