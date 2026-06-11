---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Shipped causal traversal BFS read path: shared BFS helper replaces recursive CTE traversal consumers, with exact equivalence and latency evidence."
trigger_phrases:
  - "012-causal-traversal-bfs summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs"
    last_updated_at: "2026-06-11T06:30:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Remediated review findings: multi-root parity, advisory latency gate, p95 evidence"
    next_safe_action: "No in-scope implementation work remains; track out-of-scope alignment drift separately"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/memo.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ship-012-causal-traversal-bfs"
      parent_session_id: "scaffold-012-causal-traversal-bfs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "BFS cutover proceeded after exact CTE equivalence passed in test."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-causal-traversal-bfs |
| **Completed** | 2026-06-10 |
| **Level** | 1 |
| **Status** | Shipped |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Shipped one shared app-level BFS traversal module for the two recursive traversal read paths in the memory backend.

### Shared BFS Helper

`mcp_server/lib/graph/bfs-traversal.ts` now exposes two production modes:

- `collectCausalWeightedNeighbors(database, seeds, maxHops, relationWeights)`: hop-capped weighted undirected walk for causal neighbor boosts. It uses separate indexed source and target reads per hop and preserves independent per-node min-hop and max-walk-score aggregation.
- `collectDependencyReachability(database, roots)`: directed unbounded reachability for memo dependency invalidation and cycle checks.

### Call Site Cutover

- `mcp_server/lib/search/causal-boost.ts`: `getNeighborBoosts` now calls the BFS helper; the recursive CTE was removed from production source.
- `mcp_server/lib/storage/memo.ts`: `collectDependents` and cycle checks now call the directed reachability helper. The store caches dependency edge count at construction and skips traversal queries for the first insert when `dependency_edges` is empty.

### Tests Added

| File | Purpose |
|------|---------|
| `mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts` | Exact CTE-vs-BFS equivalence, call-site behavior, multi-root dependents parity, zero-row fast path, and benchmark coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The helper was implemented as a generic BFS core plus SQLite readers. For causal boosts, the reader avoids the old recursive join with `source_id = node OR target_id = node` by querying source and target directions separately. For memo storage, the directed reader walks `dependency_edges` from parent to child and returns sorted output at the call site to preserve the prior result order.

The equivalence test kept the old recursive SQL in the test file only. It compares BFS output against current CTE output exactly for node membership, seed exclusion, per-node minimum hop, maximum walk score, relation/strength weighting, and multi-root dependents membership (a root reached through an edge from another root is returned, matching the CTE). A floating-point multiplication-order mismatch was caught by the test and fixed by matching SQLite's left-to-right multiplication order.

The latency benchmark logs mean and p95 per traversal and warns when BFS falls behind. It only hard-asserts when `SPECKIT_BENCH_GATE=1` is set, so CI never flakes on wall-clock noise while the equivalence assertions stay hard.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep recursive CTE SQL only in the equivalence test | The production source no longer depends on recursive SQL, while the test preserves the exact behavioral oracle |
| Use count caching for memo zero-row fast path | The empty dependency table path avoids per-insert reachability queries and updates the count after successful inserts |
| Remove the temporary cutover flag after green equivalence | The P0 equivalence suite passed exactly, so retaining a production CTE fallback would keep unnecessary complexity |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` in `mcp_server` | PASS, exit 0 |
| `npx vitest run tests/causal-traversal-bfs-equivalence.vitest.ts --reporter verbose` | PASS, 1 file, 5 tests |
| `npx vitest run tests/causal-boost.vitest.ts tests/memo-storage.vitest.ts` | PASS, 2 files, 10 tests |
| `npx vitest run tests/storage-ports-contract.vitest.ts tests/incremental-index-foundation.vitest.ts` | PASS, 2 files, 34 tests |
| Source scan for production recursive CTEs | PASS, no `WITH RECURSIVE` matches in `mcp_server/lib` |
| Comment hygiene on modified code/test files | PASS, no output from checker |
| Alignment drift | In-scope files clean; out-of-scope `mcp_server/lib/storage/canonical-fingerprint.ts` still lacks a module header |

### Equivalence Evidence

The new suite passed exact equality for BFS output against the current recursive CTE output on a live-shaped fixture:

- Fixture: 10,240 causal edges, max degree 20, 5 seeds, 2 hops.
- Compared fields: node membership, seed exclusion, per-node minimum hop, per-node maximum walk score, relation weighting, strength weighting, and multi-root dependents membership.
- Result: 5/5 tests passed, no divergences.

### Latency Benchmark

Recorded by the verbose test run. Both p95 (the SC-002 statistic) and mean are collected from per-iteration samples; the comparison is advisory and logged, not a hard CI gate.

| Fixture Edges | Max Degree | Seeds | Hops | Recursive CTE p95 | Recursive CTE Mean | BFS p95 | BFS Mean |
|---------------|------------|-------|------|-------------------|--------------------|---------|----------|
| 10,240 | 20 | 5 | 2 | 1.523ms | 1.391ms | 1.509ms | 1.143ms |

Across four repeated local runs, BFS mean stayed consistently about 0.2ms below the CTE mean (1.143-1.179ms vs 1.365-1.391ms). The p95 values overlapped within run-to-run noise (BFS 1.396-1.511ms vs CTE 1.436-1.523ms, each side above the other on at least one run), which is why the wall-clock comparison is advisory rather than a hard assertion.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The benchmark fixture uses max degree 20, which stays under the measured live max degree 22 while preserving the 10,240 edge scale.
2. Alignment drift still reports `mcp_server/lib/storage/canonical-fingerprint.ts` missing a module header. That file is outside this phase's allowed write paths and was not modified.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
