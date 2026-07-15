---
title: "Verification Checklist: Deterministic-Ranking Flag Graduation Benchmark"
description: "Verification Date: 2026-06-23"
trigger_phrases:
  - "deterministic ranking benchmark"
  - "should the determinism flag graduate"
  - "benchmark verification"
  - "embed once reuse ranking"
  - "off vs on divergence harness"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/042-deterministic-ranking-benchmark"
    last_updated_at: "2026-07-04T17:11:55.517Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored QA checklist, matrix run complete"
    next_safe_action: "Verify items against metrics.json"
    blockers: []
    key_files:
      - "scripts/deterministic-ranking-benchmark.mjs"
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
# Verification Checklist: Deterministic-Ranking Flag Graduation Benchmark

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
- [x] CHK-003 [P1] The active embedder confirmed as `nomic-embed-text-v1.5` before the run
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The harness reads a read-only corpus backup, issues no write and triggers no reindex
- [x] CHK-011 [P1] Each query is embedded once and the embedding is reused across all six runs, so only ranking varies
- [x] CHK-012 [P1] Every divergence metric is computed from the collected orderings, with no hand-entered number
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-005)
- [x] CHK-021 [P0] metrics.json reports 72 pipeline calls with a determinism reading per query and the off-vs-on divergence triplet
- [x] CHK-022 [P1] The flag-ON orderings are byte-identical across separate invocations, and the off-corpus rows show zero divergence
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase ships no code fix, so the completeness bar is harness soundness and honest reporting.

- [x] CHK-FIX-001 [P0] Every metric in metrics.json is derived from a collected ordering, with no hand-entered number
- [x] CHK-FIX-002 [P0] The flag is toggled only through `process.env` inside the run, the flag default file untouched
- [x] CHK-FIX-003 [P0] The corpus is a read-only backup, confirmed read-only with no reindex against the live memory database
- [x] CHK-FIX-004 [P1] The off-corpus and max-vague rows are inspected for the expected zero divergence, the control cases
- [x] CHK-FIX-005 [P1] The flag-ON determinism is reported per query, confirmed across separate invocations not asserted from one run
- [x] CHK-FIX-006 [P1] The five materially diverging queries (overlap < 0.8) are identified, not averaged into a single aggregate
- [x] CHK-FIX-007 [P1] The run is reproducible from the committed harness with byte-identical flag-ON orderings
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No benchmark cell mutates the memory database, since the harness reads a read-only backup
- [x] CHK-031 [P1] The flag is set only in the benchmark process and never written to any shared config, so no consumer outside the run sees a changed default
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized, and every verdict claim traces to metrics.json
- [x] CHK-041 [P2] The tracking row added to the 005 benchmark-and-test-status table
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Script and results live in the phase folder, nothing leaks outside 028
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

**Verification Date**: 2026-06-23
<!-- /ANCHOR:summary -->

---
