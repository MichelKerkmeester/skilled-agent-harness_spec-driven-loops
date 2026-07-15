---
title: "Verification Checklist: Retrieval-Class Channel Weights"
description: "Verification Date: 2026-06-24"
trigger_phrases:
  - "retrieval class channel weights verification"
  - "SPECKIT_RETRIEVAL_CLASS_ROUTING checklist"
  - "single-hop precision multi-hop recall verification"
  - "channel suppression benchmark checklist"
  - "retrieval class routing cut verdict checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/002-retrieval-class-weights"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored QA checklist, run complete"
    next_safe_action: "Verify items against metrics.json and the harness run"
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
# Verification Checklist: Retrieval-Class Channel Weights

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
- [x] CHK-003 [P1] The flag, the always-on classifier, and the SingleHop suppression short-circuit confirmed against the source before the harness was built
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The benchmark measures the flag on the production path through `executePipeline`, not only the unforced eval path
- [x] CHK-011 [P1] The result metric is grounded in the actual channel suppression, the `routeQuery` channel set is recorded per query under each flag state
- [x] CHK-012 [P1] The harness edits no shared production code, it imports the dist build read-only and toggles the flag only through the environment
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006)
- [x] CHK-021 [P0] The harness reproduces exit 0 and rebuilds metrics.json from the read-only corpus backup
- [x] CHK-022 [P1] The single-hop precision delta and the multi-hop recall delta are stable across three runs
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase ships a measurement and a verdict, not a code fix, so the completeness bar is a reproducible prod-path benchmark and a verdict grounded strictly in the numbers.

- [x] CHK-FIX-001 [P0] The benchmark question is answered with real-corpus numbers, single-hop precision at one and multi-hop recall at ten, flag-off vs flag-on
- [x] CHK-FIX-002 [P0] Default-off byte-identity is verified on the production path, every multi-hop channel set and top-K is identical flag-off vs flag-on
- [x] CHK-FIX-003 [P0] The phase returns one of GRADUATE, REFINE, or CUT with evidence, the verdict is CUT
- [x] CHK-FIX-004 [P1] The single-hop precision falls from 0.90 to 0.80, a stable -0.10, so there is no measured precision win
- [x] CHK-FIX-005 [P1] The multi-hop recall holds at 0.75 with no flag effect, so the recall-preservation claim is true but moot
- [x] CHK-FIX-006 [P1] The one precision flip is inspected by hand, graph and degree put the correct packet at rank one off and suppression dropped it on
- [x] CHK-FIX-007 [P1] The refinement considered, an entity-density-aware suppression, is recorded as not-pursued with its reason
- [x] CHK-FIX-008 [P1] The benchmark is reproducible from the committed harness, `node scripts/retrieval-class-routing-benchmark.mjs` rebuilds metrics.json exit 0
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The harness reads a read-only corpus backup and issues no write, so no benchmark cell mutates the memory database
- [x] CHK-031 [P1] No production default is flipped, the flag is toggled only in-process and restored to off after each pair
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized, and every verdict claim traces to metrics.json or the harness run
- [x] CHK-041 [P2] The suite tracking row in `benchmark-and-test-status.md` updated with the CUT verdict
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The harness and results live in the phase folder, no shared production file is edited
- [x] CHK-051 [P1] No temp files left outside the results tree, the eval copy is created in the OS temp dir and removed after the run
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-24
<!-- /ANCHOR:summary -->

---
