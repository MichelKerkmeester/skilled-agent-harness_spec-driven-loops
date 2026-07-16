---
title: "Verification Checklist: Code-Graph Edge Lifecycle Dark-Flag Benchmark"
description: "Verification Date: 2026-06-24"
trigger_phrases:
  - "code graph edge lifecycle benchmark"
  - "edge staleness rebind verification"
  - "throwaway graph rebind harness"
  - "code graph smallest proving consumer"
  - "reverse dependency force parse rebind"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/027-code-graph-edge-lifecycle"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored QA checklist, run complete"
    next_safe_action: "Verify items against the metrics and the confirmed code facts"
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
# Verification Checklist: Code-Graph Edge Lifecycle Dark-Flag Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The fan-in benchmark gate and the three flags confirmed as the scope before the harness
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The benchmark drives the shipped handler and lib, not a reimplementation of the repair
- [x] CHK-011 [P1] The kind-flip case keeps the importer byte-identical so it isolates the force-parse path
- [x] CHK-012 [P1] The harness restores the flag environment variable and deletes every temp tree in a finally block
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-005)
- [x] CHK-021 [P0] The fan-in rebind benchmark runs reproducibly and exits 0
- [x] CHK-022 [P1] The benchmark is deterministic across repeated runs with zero run-to-run variance
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase resolves the fan-in benchmark gate the staleness work was held on, so the completeness bar is a measured rebind number and three verdicts.

- [x] CHK-FIX-001 [P0] The gated question is answered, force-reparsing importers rebinds cross-file edges to the new symbol ids after a rename, kind-flip or move
- [x] CHK-FIX-002 [P0] The benchmark is read-only by construction, the live `code-graph.sqlite` is never opened, only throwaway temp databases
- [x] CHK-FIX-003 [P0] The benchmark discriminates, the importer-unchanged kind-flip case rebinds under the flag and stays stale without it
- [x] CHK-FIX-004 [P1] The rebind-correctness rate is 3 of 3 with the flag ON, every case rebinds to the new symbol id
- [x] CHK-FIX-005 [P1] The bitemporal read flag has no read consumer and the live `code_edges` has no governance CHECK, confirmed read-only
- [x] CHK-FIX-006 [P1] The smallest proving consumer is named for each flag that earns a REFINE verdict
- [x] CHK-FIX-007 [P1] The benchmark is reproducible from the committed harness, `node scripts/edge-staleness-rebind-benchmark.mjs` rebuilds the metrics exit 0
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The benchmark issues no write to the live code graph, it only creates and deletes throwaway temp directories
- [x] CHK-031 [P1] The three flags read from `process.env` only and default-off, so no consumer sees them until an explicit set
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized, and every verdict claim traces to the metrics or a confirmed code fact
- [x] CHK-041 [P2] The suite tracking row for 006 is updated with the staleness verdict and the two consumer verdicts
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The benchmark script and the metrics live in this phase folder, no production code-graph file is edited
- [x] CHK-051 [P1] No temp files left outside the results tree, the harness cleans its temp directories
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-24
<!-- /ANCHOR:summary -->

---
