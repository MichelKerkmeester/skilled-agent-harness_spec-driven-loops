---
title: "Verification Checklist: Deep-Loop Gauge Flood-Test and Dedup Scale-Test"
description: "Verification Date: 2026-06-24"
trigger_phrases:
  - "deep loop gauge flood test verification"
  - "fanout dedup scale test checklist"
  - "progress heartbeat cadence verification"
  - "near dup dedup false collapse checklist"
  - "gauge default decision verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/009-deep-loop-gauges-dedup-scale"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the QA checklist, both harnesses run green"
    next_safe_action: "Validate the phase strict"
    blockers: []
    key_files:
      - "scripts/gauge-flood-test.mjs"
      - "scripts/dedup-scale-test.mjs"
      - "results/gauge-flood-metrics.json"
      - "results/dedup-scale-metrics.json"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deep-Loop Gauge Flood-Test and Dedup Scale-Test

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
- [x] CHK-003 [P1] The 009 research sections 3.5 and 3.6 and the production gauge and merge code paths read before building the harnesses
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The dedup is scale-tested on the production merge exports, not a reimplementation
- [x] CHK-011 [P0] The gauges are flood-tested through the real `fanout-run.cjs` CLI and the production `runCappedPool`
- [x] CHK-012 [P1] The labeled set carries a ground-truth point and wording mode per finding
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (the spec REQUIREMENTS list)
- [x] CHK-021 [P0] Both harnesses run exit 0 and the numbers reproduce across re-runs
- [x] CHK-022 [P1] The dedup off path is byte-identical to the production default across re-runs
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase carries measurement, a gauge-default decision, AND two production fixes (each behind its default-off flag, byte-identical off).

- [x] CHK-FIX-001 [P0] The 009 0.05s flood is reproduced on the real runner (440 records / 2s, ~645K records/h projected)
- [x] CHK-FIX-002 [P0] A seconds-scale cadence is chosen (30s) and OBSERVED to inform within budget across all ten in-flight lineages (20 records / 75s, ~955 records/h)
- [x] CHK-FIX-003 [P0] The lag metric is redefined to a true stall detector (deep-review P1-7): the same healthy 10-wide pool that false-fired at 1500ms under the old metric is now silent, the detector fires once on a genuine 5s stall, and it is byte-identical when the gauge is off
- [x] CHK-FIX-004 [P0] The title-only false-collapse is fixed (deep-review P2-15): the title-aware match drops the title-only false-collapse rate from 0.50 to 0, byte-identical when the dedup flag is off
- [x] CHK-FIX-005 [P0] The body-distinguished dedup false-collapse rate is 0 and distinct-finding recall is 1.0 on the 60-research-finding six-worker set; identical-dup still collapses (7/7)
- [x] CHK-FIX-006 [P1] All 8 near-miss distinct findings survive and the review path keeps the strongest severity on every collapse (4/4)
- [x] CHK-FIX-007 [P1] The committed pool test is migrated to stall semantics with two new silent-direction cases; the committed dedup off-path tests pass unchanged
- [x] CHK-FIX-008 [P1] The full deep-loop regression suite is green (49 files, 428 tests)
- [x] CHK-FIX-009 [P1] The content-identity semantic under-merge limit is surfaced explicitly (2/2 varied-wording clusters stay separate, the one remaining known limit)
- [x] CHK-FIX-010 [P1] The harnesses are reproducible, `node scripts/gauge-flood-test.mjs` and `node scripts/dedup-scale-test.mjs` rebuild their metrics exit 0
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The harnesses read or spawn only the production modules and in-memory or OS-temp fixtures, so no cell opens the corpus, the graph, or the memory database
- [x] CHK-031 [P0] No committed production default is flipped; the two fan-out fixes are within `deep-loop-runtime/**` scope, each behind its default-off flag and byte-identical off
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, and tasks synchronized, and every verdict claim traces to the metrics files
- [x] CHK-041 [P1] The recommended gauge values and the enable-by-default decision are documented with the flood-test numbers in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The harnesses and results live in the phase folder, and the production modules are read-only
- [x] CHK-051 [P1] No temp files left outside the results tree; the gauge temp dirs are removed at the end
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-24
<!-- /ANCHOR:summary -->

---
