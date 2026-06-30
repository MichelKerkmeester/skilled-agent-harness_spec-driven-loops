---
title: "Spec: Code-Graph Edge Lifecycle Dark-Flag Benchmark"
description: "Benchmarks the code-graph edge-lifecycle cluster of default-off flags. SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS ships nullable valid_at and invalid_at generation columns on code_edges with no read consumer. SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB ships a closed-vocabulary CHECK rebuild of the edges table with only the migration as a consumer. The edge-staleness repair behind SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE force-reparses importers so cross-file edges rebind to a dependency new symbol ids, gated on a fan-in benchmark that was never run. This phase runs that fan-in rebind benchmark against a read-only-by-construction throwaway graph and resolves the staleness verdict with measured rebind correctness, and analyzes feasibility for bitemporal and governance and names the smallest proving consumer for each without building a speculative one."
trigger_phrases:
  - "code graph edge lifecycle benchmark"
  - "edge staleness rebind fan-in benchmark"
  - "code graph bitemporal reads consumer"
  - "code graph edge governance vocab"
  - "reverse dependency force parse rebind"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/006-codegraph-edge-lifecycle"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the fan-in rebind benchmark and authored the three verdicts"
    next_safe_action: "Phase complete, verdicts live in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/edge-staleness-rebind-benchmark.mjs"
      - "results/staleness-metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Code-Graph Edge Lifecycle Dark-Flag Benchmark

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
Three code-graph edge-lifecycle capabilities ship finished but dark behind default-off flags with no measured verdict. The bitemporal schema flag `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` added nullable `valid_at` and `invalid_at` columns to `code_edges`, but the live current-views, the close-and-insert lifecycle writes and the as-of timeline read all wait for a consumer that does not exist. The governance flag `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` rebuilds `code_edges` with a closed-vocabulary `edge_type` CHECK, but the only thing that reads the flag is the migration itself. The edge-staleness repair behind `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` force-reparses a dependency importers so their cross-file edges rebind to the dependency new symbol ids after a rename or move, and the changelog records that this path was held default-off explicitly pending a fan-in re-parse benchmark that was never run. So the staleness work has a stated gate that nobody has measured against, and the two schema flags await a named consumer nobody has named.

### Purpose
Run the fan-in rebind benchmark the staleness work is gated on, and resolve it with a measured number. Build a labeled rename and move and kind-flip fixture, index it with the real production handler against a throwaway graph that never opens the live database, force-reparse the importers under the flag, and measure whether the cross-file edges rebind to the new symbol ids. For the bitemporal and governance flags, analyze feasibility against the live schema read-only and name the smallest consumer that would prove each worthwhile, without building a speculative consumer. Return a graduate, refine or cut verdict per the parent charter gate for each of the three.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A self-contained fan-in rebind benchmark for `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` over a labeled rename, kind-flip and move fixture, measuring cross-file edge rebind correctness under the flag ON versus OFF
- A feasibility analysis for `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` read against the live schema, naming the smallest proving consumer
- A feasibility analysis for `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` read against the live schema, naming the smallest proving consumer
- A graduate, refine or cut verdict for each of the three, with the consumer named for any refine
- The benchmark harness, the metrics rollup and the verdict, all committed in this phase folder

### Out of Scope
- Flipping any of the three flags to default-on, which is a separate evidence-gated decision the verdicts inform but do not enact
- Building any of the named consumers. The bitemporal as-of reader, a governance ingest validator and any other speculative consumer are named but not built in this pass
- Editing any shared production code in the code-graph server. The harness drives the shipped compiled handler and lib read-only against a throwaway database
- A reindex of the live code graph. The benchmark builds fresh throwaway workspaces and databases and never opens the live `code-graph.sqlite`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scripts/edge-staleness-rebind-benchmark.mjs | Create | The fan-in rebind benchmark over the labeled rename, kind-flip and move fixture |
| results/staleness-metrics.json | Create | The per-case and aggregate rebind-correctness rollup |
| benchmark-results.md | Create | The data tables and the three graduate, refine or cut verdicts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The fan-in rebind benchmark runs the staleness repair on the production code path against a throwaway graph that never opens the live database | the harness imports the shipped compiled scan handler and lib, builds a fresh temp workspace and temp SQLite database per case, and the live `code-graph.sqlite` is never referenced |
| REQ-002 | The benchmark measures cross-file edge rebind correctness with the flag ON versus OFF on a labeled rename, kind-flip and move fixture | `staleness-metrics.json` records per case the baseline edge, the rebound edge, the files indexed under each flag state, and whether the importer-unchanged case discriminates |
| REQ-003 | Each of the three flags returns one verdict with evidence: GRADUATE, REFINE or CUT | `benchmark-results.md` states a verdict per flag, with the smallest proving consumer named for any REFINE |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Default-off byte-identity is confirmed for each flag still behind a gate | the staleness flag-OFF path leaves the importer skipped and the edge stale, the bitemporal read flag has no read consumer, and the live `code_edges` has no governance CHECK, each confirmed from the code or the live schema read-only |
| REQ-005 | Every verdict claim traces to a measured number or a confirmed code fact | each claim in `benchmark-results.md` and `implementation-summary.md` cites a value in `staleness-metrics.json`, a file and line in the shipped code, or a live-schema read |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The fan-in rebind benchmark runs reproducibly and answers the gated question, force-reparsing importers rebinds cross-file edges to the new symbol ids after a rename, kind-flip or move
- **SC-002**: The benchmark discriminates, the importer-unchanged case rebinds under the flag and stays stale without it, so the repair is proven to be the thing that makes the rebind happen
- **SC-003**: Each of the three flags has a graduate, refine or cut verdict grounded in a measured number or a confirmed code fact, with the smallest proving consumer named for any refine
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The benchmark accidentally opens the live code graph | A benchmark that mutates production state | The harness only ever calls `initDb` on a fresh temp directory and never references the live database path, so the live graph is read-only by construction |
| Risk | An importer that also edits its own text masks the repair | A rebind that the ordinary incremental scan would do anyway, falsely crediting the flag | The kind-flip case keeps the importer byte-identical so only the dependency symbol identity shifts, isolating the force-parse path, and the rename and move cases are recorded as controls |
| Dependency | The shipped compiled code-graph handler and lib under `dist/` | The harness drives the real production path through them | The harness imports `dist/handlers/scan.js` and `dist/lib/code-graph-db.js`, so it exercises the same code the server runs |
| Dependency | The `better-sqlite3` native binding resolved from the code-graph node_modules | The temp database cannot open without it | The harness runs from the code-graph server working directory where the binding resolves, the same context the test suite uses |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The benchmark builds a small fixture per case so the fan-in re-parse cost is the marginal cost of force-parsing a handful of importers, which the harness records as the files-indexed delta between the flag ON and OFF runs
- **NFR-P02**: The benchmark is deterministic, the symbol ids derive from a content hash of file path, qualified name and kind, so repeated runs produce the same rebind outcome with zero run-to-run variance

### Security
- **NFR-S01**: The benchmark issues no write to the live code graph, it only creates and deletes throwaway temp directories, so no benchmark cell mutates production state
- **NFR-S02**: The three flags read from `process.env` only and default-off, so no consumer sees the bitemporal reads, the governance CHECK or the force-parse repair until a flag is explicitly set

### Reliability
- **NFR-R01**: The staleness flag-OFF path is byte-identical to the ordinary incremental scan, the importer is skipped as fresh and the stale edge is left untouched, confirmed by the benchmark
- **NFR-R02**: The benchmark cleans up every temp tree in a finally block and restores the flag environment variable to its original value after each case, so a failure leaves no residue
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A pure rename where the importer re-points its import: the importer is independently stale by its own content hash, so the edge rebinds with or without the flag, recorded as a control
- A kind-flip where the imported symbol changes kind and the importer stays byte-identical: only the dependency symbol identity shifts, so the rebind happens only under the flag, the discriminating case
- A move where the symbol relocates to a new file and the importer re-points: the importer is independently stale, so the edge rebinds and crosses files with or without the flag, recorded as a control

### Error Scenarios
- The flag is OFF and the importer is byte-identical: the importer is skipped as fresh and the edge target node is gone, so the cross-file join yields no live edge, the stale-edge outcome the repair removes
- The dependency body changes but its symbol ids do not: no importer is force-parsed because the symbol identity did not change, so a body-only edit pays no fan-in cost

### State Transitions
- Flag OFF to ON for the kind-flip case: the same mutation leaves a stale edge with the flag off and a correctly rebound edge with it on, so the transition is the only behavior change
- Symbol present to absent: when the dependency symbol identity changes, the importers are captured before node replacement and force-parsed after, so the edges rebind rather than dangling
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | One benchmark harness and three docs, no production edit, three flags analyzed |
| Risk | 6/25 | Read-only by construction, throwaway temp databases, no live-graph write, no default flipped |
| Research | 18/20 | A fan-in rebind benchmark over a labeled three-case fixture plus a feasibility and smallest-consumer analysis for two schema flags |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the bitemporal as-of read deserves a real consumer at all, given that default writes still replace edges so the validity windows record nothing past `valid_at`, a question the consumer-naming analysis answers but the eventual build decides
- Whether the governance closed-vocab CHECK should graduate alone or ride with a producer that can actually emit an out-of-vocab `edge_type`, since the live data is already vocab-compliant and no current producer can violate the CHECK
<!-- /ANCHOR:questions -->
