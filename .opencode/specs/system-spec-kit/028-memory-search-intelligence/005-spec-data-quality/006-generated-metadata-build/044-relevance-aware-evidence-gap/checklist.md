---
title: "Verification Checklist: Relevance-Aware Evidence Gap"
description: "Verification Date: 2026-06-23"
trigger_phrases:
  - "relevance aware evidence gap"
  - "fix the gap detector over-capping"
  - "evidence gap verification"
  - "noise floor subtracted relevance gap"
  - "embedder seam stage4 detector"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/044-relevance-aware-evidence-gap"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored QA checklist, run complete"
    next_safe_action: "Verify items against metrics.json and the test run"
    blockers: []
    key_files:
      - "scripts/gap-relevance-rebenchmark.mjs"
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
# Verification Checklist: Relevance-Aware Evidence Gap

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
- [x] CHK-003 [P1] The 043 finding and the 18 labeled queries confirmed as the baseline before the fix
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The relevance-aware path is gated behind `SPECKIT_RELEVANCE_AWARE_GAP` default-off
- [x] CHK-011 [P1] The gated decision is `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD`, reusing `resolveNoiseFloor` and `LOW_THRESHOLD`
- [x] CHK-012 [P1] The relevance-aware path fails closed to the Z-score path when no floor resolves
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-005)
- [x] CHK-021 [P0] tsc clean and the five focused tests plus the 124 in the nearest suites pass
- [x] CHK-022 [P1] The off path is byte-identical to the Z-score detector, proven empirically across the test distributions
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase ships a code fix for the 043 over-capping finding, so the completeness bar is a verified gated path and a re-benchmark that confirms the fix.

- [x] CHK-FIX-001 [P0] The root cause is addressed at the source, the gap decision now reads relevance not Z-score peakedness when the flag is on
- [x] CHK-FIX-002 [P0] The change is gated default-off and byte-identical when off, so no consumer sees a change until a separate graduation decision
- [x] CHK-FIX-003 [P0] The relevance-aware path fails closed to the Z-score path when no floor resolves, so the detector always returns a decision
- [x] CHK-FIX-004 [P1] The should-good false-positive rate drops from 0.67 to 0.00, the over-capping eliminated
- [x] CHK-FIX-005 [P1] The agreement with the verdict gap band rises from 0.61 to 1.00, the NEW path fires only on `oauth`
- [x] CHK-FIX-006 [P1] The off-corpus high-background queries (`kafka`, `terraform`) are recorded as a separate noise-floor calibration follow-up, not a defect of this change
- [x] CHK-FIX-007 [P1] The re-benchmark is reproducible from the committed harness, `node scripts/gap-relevance-rebenchmark.mjs` rebuilds metrics.json exit 0
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The re-benchmark reads a read-only corpus backup and issues no write, so no benchmark cell mutates the memory database
- [x] CHK-031 [P1] The flag is default-off and read only in-process, so no consumer outside an explicit flip sees the relevance-aware path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized, and every verdict claim traces to metrics.json or the test run
- [x] CHK-041 [P2] `SPECKIT_RELEVANCE_AWARE_GAP` registered in `mcp_server/ENV_REFERENCE.md` default false
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The re-benchmark script and results live in the phase folder, the production edits stay confined to the search library and the flag registry
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
