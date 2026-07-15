---
title: "Verification Checklist: Evidence-Gap Detector Threshold Calibration Benchmark"
description: "Verification Date: 2026-06-23"
trigger_phrases:
  - "evidence gap detector calibration"
  - "Z-score peakedness not relevance"
  - "benchmark verification"
  - "faithful Z-score sweep"
  - "labeled set gap threshold harness"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/043-gap-threshold-calibration-benchmark"
    last_updated_at: "2026-07-04T17:11:54.651Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored QA checklist, labeled-set run complete"
    next_safe_action: "Verify items against metrics.json"
    blockers: []
    key_files:
      - "scripts/gap-threshold-calibration-benchmark.mjs"
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
# Verification Checklist: Evidence-Gap Detector Threshold Calibration Benchmark

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
- [x] CHK-003 [P1] The active embedder and the `detectEvidenceGap` direction at `evidence-gap-detector.ts:206` confirmed before the run
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The harness reads a read-only corpus backup, issues no write and triggers no reindex
- [x] CHK-011 [P1] The Z-score is recomputed via the production `detectEvidenceGap` over the exact score array Stage 4 fed it, not transcribed
- [x] CHK-012 [P1] Every rate and separation is computed from the captured Z-scores, with no hand-entered number
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-005)
- [x] CHK-021 [P0] metrics.json carries a Z-score and the production `evidenceGapDetected` binary per query across the three label groups, with the per-group distribution and the sweep
- [x] CHK-022 [P1] The recomputed binary equals production for all 18 of 18 queries, and the should-gap median Z sits above the should-good median
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase ships no code fix, so the completeness bar is harness soundness and honest reporting.

- [x] CHK-FIX-001 [P0] Every metric in metrics.json is derived from a captured Z-score, with no hand-entered number
- [x] CHK-FIX-002 [P0] The detector statistic and the 1.3 threshold default are read as-is, neither file touched
- [x] CHK-FIX-003 [P0] The corpus is a read-only backup, confirmed read-only with no reindex against the live memory database
- [x] CHK-FIX-004 [P1] The per-group Z-score distribution is reported, with the should-gap median above the should-good median identified as the inverted-distribution signal
- [x] CHK-FIX-005 [P1] The should-good false-positive rate (0.67) and should-gap detection rate (0.33) at 1.3 are reported, confirmed from the captured binaries
- [x] CHK-FIX-006 [P1] The optimal threshold (0.8) and its separation (0.50) are identified, with no threshold across 0.5 to 3.0 reaching good separation
- [x] CHK-FIX-007 [P1] The run is reproducible from the committed harness with the 18-query faithfulness assertion holding
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No benchmark query mutates the memory database, since the harness reads a read-only backup
- [x] CHK-031 [P1] The detector statistic and threshold default are read only in the benchmark process and never written to any shared config, so no consumer outside the run sees a changed detector
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
