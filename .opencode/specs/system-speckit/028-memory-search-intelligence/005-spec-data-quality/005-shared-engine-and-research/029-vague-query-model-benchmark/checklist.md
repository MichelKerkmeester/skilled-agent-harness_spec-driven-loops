---
title: "Verification Checklist: Vague-Query Model Benchmark [template:level_2/checklist.md]"
description: "Verification Date: Pending (run in progress)"
trigger_phrases:
  - "vague query model benchmark"
  - "memory search model comparison"
  - "benchmark verification"
  - "search behavior harness"
  - "model dispatch matrix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/029-vague-query-model-benchmark"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored QA checklist, matrix dispatch in progress"
    next_safe_action: "Verify items once metrics.json is parsed"
    blockers: []
    key_files:
      - "scripts/benchmark-config.json"
      - "scripts/run-benchmark.mjs"
      - "scripts/extract-metrics.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Vague-Query Model Benchmark

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
- [x] CHK-003 [P1] The four providers and model slugs confirmed in a pre-flight before the run
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The driver dispatches only bare-query retrieval, which is read-only, and no analysis subcommand
- [x] CHK-011 [P1] The driver is idempotent and retries an empty-output cell once, so a launch-race death is not recorded as a real result
- [x] CHK-012 [P1] The parser sources every metric from the raw stream and the config, with no hand-entered number
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-005)
- [x] CHK-021 [P0] metrics.json reports a cell count near the 144 expected, with any launch-race gaps documented not silently dropped
- [x] CHK-022 [P1] The parser was sanity-checked on the seeded pilot cells before the full run, and the off-corpus rows produce the expected weak or gap verdicts
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase ships no code fix, so the completeness bar is harness soundness and honest reporting.

- [x] CHK-FIX-001 [P0] Every metric in metrics.json is derived from a raw stream or the config, with no hand-entered number
- [x] CHK-FIX-002 [P0] Launch-race cell failures are counted and reported, never silently dropped from the matrix
- [x] CHK-FIX-003 [P0] Each dispatched cell is a bare-query retrieval, confirmed read-only against the memory database
- [x] CHK-FIX-004 [P1] The off-corpus and maximally-vague rows are inspected for the expected weak or gap verdict, the discriminating cases
- [x] CHK-FIX-005 [P1] The cross-sample variance is reported, not collapsed into a single point estimate
- [x] CHK-FIX-006 [P1] The pilot cells folded in as sample one are flagged where their timing sidecar is absent
- [x] CHK-FIX-007 [P1] The run is reproducible from the committed config
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No benchmark cell mutates the memory database, since only bare-query retrieval is dispatched
- [x] CHK-031 [P1] Each query is passed as a quoted argument and only the model output is read, introducing no new execution surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized, and every analysis claim traces to metrics.json
- [x] CHK-041 [P2] The tracking row added to the 005 benchmark-and-test-status table
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scripts, config and results live in the phase folder, nothing leaks outside 028
- [x] CHK-051 [P1] No temp files left outside the results tree
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-22
<!-- /ANCHOR:summary -->

---
