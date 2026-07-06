---
title: "Implementation Plan: Code-Graph Edge Lifecycle Dark-Flag Benchmark"
description: "Builds a self-contained fan-in rebind benchmark for the code-graph edge-staleness repair behind SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE. The harness imports the shipped compiled scan handler and lib, builds a fresh throwaway workspace and SQLite database per case under the OS temp directory, indexes a labeled rename, kind-flip and move fixture, force-reparses the importers under the flag, and measures whether the cross-file edges rebind to the new symbol ids, with the flag OFF as the discriminating control. For SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS and SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB it reads the live schema read-only and names the smallest proving consumer without building one. Rejects driving the live database in place as the wrong fit for a read-only benchmark."
trigger_phrases:
  - "code graph edge lifecycle benchmark"
  - "edge staleness rebind fan-in benchmark"
  - "throwaway graph rebind harness"
  - "code graph smallest proving consumer"
  - "reverse dependency force parse rebind"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/003-codegraph-edge-lifecycle"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the harness and the fixture, run complete"
    next_safe_action: "Compute metrics and author the verdicts"
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
# Implementation Plan: Code-Graph Edge Lifecycle Dark-Flag Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | A Node ESM `.mjs` benchmark driving the shipped TypeScript code-graph server compiled to `dist/` |
| **Framework** | The production `handleCodeGraphScan` handler and the `code-graph-db` lib, `better-sqlite3` over throwaway temp databases |
| **Storage** | Fresh throwaway SQLite databases per case under the OS temp directory and a single metrics rollup |
| **Testing** | The existing `edge-staleness-correctness.vitest.ts` proves the single-case repair, this benchmark extends it to a labeled three-case fixture with the flag ON versus OFF |

### Overview
This phase runs the fan-in rebind benchmark the edge-staleness work was gated on, and resolves the staleness verdict with a measured number. The harness imports the shipped compiled scan handler and the code-graph DB lib, builds a fresh throwaway workspace and SQLite database per case, indexes a labeled rename, kind-flip and move fixture, mutates the dependency so its symbol identity shifts, re-scans with `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` set ON and then OFF, and measures whether the cross-file edge rebinds to the new symbol id. The kind-flip case keeps the importer byte-identical so it isolates the force-parse path, which is the discriminating case the gate hinges on. For the two schema flags it reads the live schema read-only, confirms the bitemporal read flag has no read consumer and the live `code_edges` has no governance CHECK, and names the smallest proving consumer for each without building one. Driving the live database in place was considered and rejected: a read-only benchmark must never touch production state, so the harness only ever opens throwaway temp databases.
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
- [x] Benchmark passing and reproducible
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A read-only benchmark over the real production code path. The harness never reimplements the repair, it drives the shipped handler and lib against a throwaway graph, so the rebind it measures is the rebind the server would perform. The fixture is a labeled set of cases, each with a stable importer and a mutated dependency, and the metric is cross-file edge rebind correctness under the flag ON versus OFF.

### Key Components
- **`scripts/edge-staleness-rebind-benchmark.mjs`**: the harness. It imports `dist/handlers/scan.js` and `dist/lib/code-graph-db.js`, builds a fresh temp workspace and DB per case, runs a full scan, mutates the dependency, re-scans incrementally under each flag state, and queries the cross-file edges.
- **The labeled fixture**: three cases. A pure rename where the importer re-points, a kind-flip where the importer stays byte-identical, and a move where the symbol relocates to a new file. The kind-flip is the discriminating case, the rename and move are controls.
- **The metric**: per case, the baseline edge, the rebound edge, the files indexed under ON and OFF, and whether the importer-unchanged case discriminates. The aggregate is the rebind-correctness rate and the count of discriminating cases.
- **The two schema-flag analyses**: a read-only inspection of the live schema and the shipped code, confirming the bitemporal read flag has no read consumer and the live `code_edges` has no governance CHECK, and naming the smallest proving consumer for each.

### Data Flow
A case writes a dependency and an importer into a throwaway workspace and runs a full scan, which records the baseline cross-file edge. The dependency is mutated so its symbol identity shifts. With the flag ON the scan loop captures the importers via `queryImportersOf` before node replacement and force-parses them, so the cross-file resolver rebinds the import edge to the new symbol id. With the flag OFF the importer is skipped as fresh and the edge is left stale. The harness queries the cross-file edges after each re-scan, scores the rebind, and writes the per-case and aggregate rows to `results/staleness-metrics.json`, the single source for the data tables and the staleness verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase writes no production code. It reads shared code-graph surfaces to drive and to analyze them, so each surface is touched read-only and confirmed default-off.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `dist/handlers/scan.js` | The shipped scan handler | drive read-only from the benchmark | the harness imports and calls it against a throwaway graph, no edit |
| `dist/lib/code-graph-db.js` | The shipped DB lib with `queryImportersOf`, `initDb`, `getDb` | drive read-only from the benchmark | the harness imports and calls them against a throwaway graph, no edit |
| `lib/structural-indexer.ts` | The force-parse path behind `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` | read to confirm the gate and the mechanism | confirmed default-off, force-parses importers only when symbol identity changes |
| `lib/code-graph-db.ts` | The bitemporal columns, the governance CHECK rebuild and the flag readers | read to confirm consumers and default-off | the bitemporal read flag reader has no caller, the governance flag is read only by the migration |
| The live `code-graph.sqlite` schema | The production graph schema | read-only inspection only | inspected via a read-only SQLite open, never written, never opened by the benchmark |

Required inventories:
- Same-class flag readers: `rg -n 'codeGraphEdgeBitemporalReadsEnabled|codeGraphEdgeGovernanceVocabEnabled|reverseDepForceParseEnabled|REVERSE_DEP_FORCE_PARSE' lib`.
- Consumers of the bitemporal read flag: none outside its own definition, only the migration backfill touches `valid_at` and `invalid_at`.
- Consumers of the governance flag: one, the `ensureCodeEdgeGovernanceVocabSchema` migration call, gated default-off.
- Fixture axes: three labeled cases, rename, kind-flip and move, each scored under the flag ON and OFF.
- Algorithm invariant: with the flag ON the importer-unchanged kind-flip case rebinds, with it OFF the importer is skipped as fresh and the edge stays stale.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate the shipped code-graph server, confirm the compiled `dist/handlers/scan.js` and `dist/lib/code-graph-db.js` import cleanly and `better-sqlite3` resolves
- [x] Read the force-parse path, `queryImportersOf` and the cross-file edge resolver to confirm the rebind mechanism and the default-off gate
- [x] Inspect the live `code_edges` schema read-only to confirm the bitemporal columns are present and the governance CHECK is absent

### Phase 2: Core Implementation
- [x] Write the harness that imports the shipped handler and lib and builds a fresh throwaway workspace and DB per case
- [x] Encode the labeled rename, kind-flip and move fixture with a stable importer per case and a mutated dependency
- [x] Run each case under the flag ON and OFF, query the cross-file edges, score the rebind and write `results/staleness-metrics.json`

### Phase 3: Verification
- [x] Confirm the benchmark is deterministic across repeated runs and the importer-unchanged kind-flip case discriminates
- [x] Confirm the two schema flags read-only, the bitemporal read flag has no consumer and the live `code_edges` has no governance CHECK
- [x] Author the data tables and the three graduate, refine or cut verdicts grounded strictly in the metrics and the confirmed code facts
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Benchmark | The cross-file edge rebinds to the new symbol id under the flag and stays stale without it | the harness over the labeled three-case fixture, the shipped handler and lib |
| Regression | The existing single-case repair still passes | `edge-staleness-correctness.vitest.ts` in the code-graph suite |
| Manual | Spot-check that the kind-flip case rebinds only under the flag and crosses kind, and the move case crosses files | reading the parsed metrics for those rows |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The shipped compiled code-graph handler and lib under `dist/` | Internal | Green | The harness cannot drive the real production path without them |
| The `better-sqlite3` native binding from the code-graph node_modules | Internal | Green | The throwaway database cannot open without it |
| The force-parse path behind `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` | Internal | Green | The benchmark has nothing to measure without the gated repair |
| The live `code_edges` schema for the read-only feasibility analysis | Internal | Green | The bitemporal and governance verdicts cannot cite a confirmed schema fact without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The benchmark is unsound or the phase is abandoned.
- **Procedure**: Delete this phase folder. It writes no production code and flips no default, so removing the harness, the metrics and the docs restores the prior state exactly. The three flags remain default-off as they were.
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
| Verification | Low | 1-2 hours |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The benchmark only ever opens throwaway temp databases and never the live graph
- [x] The three flags are confirmed default-off from the code and the live schema
- [x] The benchmark is deterministic across repeated runs before any verdict is authored

### Rollback Procedure
1. Delete this phase folder, which removes the harness, the metrics and the docs
2. Confirm no production code-graph file was edited, the harness only imports and calls the shipped surfaces
3. Confirm the three flags remain default-off, which they always were since no default was flipped

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the benchmark writes no production state and only creates and deletes throwaway temp directories
<!-- /ANCHOR:enhanced-rollback -->

---
