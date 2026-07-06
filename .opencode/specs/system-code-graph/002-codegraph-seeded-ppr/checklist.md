---
title: "Verification Checklist: Code-Graph Seeded-PPR Impact Ranking Benchmark"
description: "Verification Date: 2026-06-24"
trigger_phrases:
  - "code graph seeded ppr benchmark checklist"
  - "seeded pagerank vs flat impact walk"
  - "ppr benchmark verification"
  - "shared candidate pool ranking comparison"
  - "ppr damping calibration sweep"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/002-codegraph-seeded-ppr"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored QA checklist, run complete"
    next_safe_action: "Verify items against metrics.json and the run"
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
# Verification Checklist: Code-Graph Seeded-PPR Impact Ranking Benchmark

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
- [x] CHK-003 [P1] The removed PPR mechanism and its constants confirmed from the code-graph source at 657a0f6a3e before reconstruction
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The reconstructed PPR matches the recorded constants damping 0.85 maxHops 3 maxIterations 20 epsilon 1e-6 and the INFERRED transition factor 0.45
- [x] CHK-011 [P1] Both rankers rank the same shared multi-hop candidate pool so a difference is a ranking-quality difference not a reachability artifact
- [x] CHK-012 [P1] The ground truth and the candidate pool are derived from real reverse CALLS and IMPORTS edges, no human labels
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006)
- [x] CHK-021 [P0] The benchmark reproduces exit 0 and the aggregate numbers are stable across runs
- [x] CHK-022 [P1] The nDCG metric is shown to drop below one on a hop-scrambled order, so a 1.0 is a real ideal ordering not a metric artifact
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase ships a benchmark and a verdict, not a code fix. The completeness bar is a reproducible measurement and a verdict that traces to it.

- [x] CHK-FIX-001 [P0] The question is measured on real change-impact queries over the live code graph, PPR versus the flat walk on the shared pool
- [x] CHK-FIX-002 [P0] The benchmark reads the code graph read-only through a backup copy and changes no production default
- [x] CHK-FIX-003 [P0] The phase returns a single verdict GRADUATE REFINE or CUT with every claim traced to metrics.json
- [x] CHK-FIX-004 [P1] PPR ties the flat walk on precision recall and nDCG at every K, delta 0.0, so it shows no quality lift
- [x] CHK-FIX-005 [P1] The damping calibration sweep shows no value beats the flat walk and damping 0.95 makes PPR worse, so tuning does not unlock a win
- [x] CHK-FIX-006 [P1] The uniform-edge root cause is recorded, every CALLS edge carries identical weight so PPR centrality collapses to the flat walk hop ordering
- [x] CHK-FIX-007 [P1] The benchmark is reproducible from the committed harness, `node scripts/seeded-ppr-impact-benchmark.mjs` rebuilds metrics.json exit 0
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The harness opens the live code graph read-only and runs every read against a backup copy, the live DB mtime is unchanged after the run
- [x] CHK-031 [P1] The harness imports no production code and edits nothing outside this phase folder, so the serving path is untouched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized, and every verdict claim traces to metrics.json or the run
- [x] CHK-041 [P2] The default-off byte-identity is recorded, the flag and PPR symbol are absent from the live source and dist
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The benchmark harness and results live in this phase folder, no production file is edited
- [x] CHK-051 [P1] No temp files left outside the results tree, the eval copy is cleaned up after the run
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-24
<!-- /ANCHOR:summary -->

---
