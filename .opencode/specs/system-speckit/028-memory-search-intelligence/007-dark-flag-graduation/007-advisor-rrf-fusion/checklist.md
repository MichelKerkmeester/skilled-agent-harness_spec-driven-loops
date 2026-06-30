---
title: "Verification Checklist: Advisor RRF Fusion Benchmark"
description: "Verification Date: 2026-06-24"
trigger_phrases:
  - "advisor rrf fusion benchmark"
  - "advisor routing verification"
  - "advisor rrf vs weighted sum"
  - "read-only advisor projection copy"
  - "advisor scoreAdvisorPrompt matrix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/007-advisor-rrf-fusion"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored QA checklist, run complete"
    next_safe_action: "Verify items against metrics.json and the benchmark run"
    blockers: []
    key_files:
      - "scripts/advisor-rrf-benchmark.mjs"
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
# Verification Checklist: Advisor RRF Fusion Benchmark

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
- [x] CHK-003 [P1] The production scorer entry point and the dist RRF cluster confirmed before the harness was built
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The benchmark calls the compiled production `scoreAdvisorPrompt` and toggles only the real flag readers, no scorer reimplementation
- [x] CHK-011 [P1] The semantic_shadow lane is left neutral so both arms share an identical live lane set and the comparison isolates the fusion change
- [x] CHK-012 [P1] Each arm clears both flag variables before setting its own, so no arm inherits a previous arm's flag state
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006)
- [x] CHK-021 [P0] The run reproduces exit 0 and the source database hash is unchanged after the run
- [x] CHK-022 [P1] The off-arm is byte-identical across repeated runs over all 33 prompts and the scorer is deterministic
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase is a benchmark, not a code fix, so the completeness bar is a reproducible measurement on the production path and an evidence-grounded verdict.

- [x] CHK-FIX-001 [P0] The cluster is measured on the production routing path, the harness imports the production scorer and projection loader the recommend handler uses
- [x] CHK-FIX-002 [P0] The benchmark reads the corpus read-only, the live database is copied and opened read-only and never written, and the conflict overlay is merged only into the in-memory projection
- [x] CHK-FIX-003 [P0] The phase returns a verdict per seam with evidence, GRADUATE for the RRF core with the conflict-rerank seam and CUT for the self-recommendation guard, grounded in the measured numbers
- [x] CHK-FIX-004 [P1] RRF lifts top-1 from 37 of 42 (0.8810) to 38 of 42 (0.9048) with zero regressions, the exact band rising from 0.8667 to 0.9333
- [x] CHK-FIX-005 [P1] The agreement spread versus baseline is 0.9762, one prompt (q02) moved its top-1 and it moved from wrong to right
- [x] CHK-FIX-006 [P1] The self-recommendation guard moves zero top-1 on four audit prompts built to trigger it, behaviorally redundant with the generic explainer floor and the un-flagged audit penalty, CUT verdict
- [x] CHK-FIX-007 [P1] The conflict-rerank seam, fed real `conflicts_with` mass through the overlay, corrects one top-1 (4 of 5 to 5 of 5) and repairs a regression plain RRF introduces, GRADUATE with the RRF core
- [x] CHK-FIX-008 [P1] The benchmark is reproducible from the committed harness, `node scripts/advisor-rrf-benchmark.mjs` rebuilds metrics.json exit 0
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The harness opens the projection copy read-only and issues no write, and the conflict overlay is merged only into the in-memory projection, so no benchmark cell mutates the live skill-graph database
- [x] CHK-031 [P1] The harness toggles only existing flag environment variables and edits no production scorer, so the measured behavior is the shipped behavior and no flag default is flipped
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized, and every verdict claim traces to metrics.json or the benchmark run
- [x] CHK-041 [P1] The suite tracking row for phase 007 reflects the graduate-and-cut verdicts
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The harness, the labeled set, the conflict overlay and the results live in the phase folder, no production code is edited
- [x] CHK-051 [P1] No temp files left outside the results tree, the loader scratch copy lands in a tmp dir and the results tree carries only metrics.json and the backup copy
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-24
<!-- /ANCHOR:summary -->

---
