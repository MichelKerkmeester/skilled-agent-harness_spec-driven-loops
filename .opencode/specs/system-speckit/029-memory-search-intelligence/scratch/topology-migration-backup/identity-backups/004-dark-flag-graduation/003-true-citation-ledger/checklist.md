---
title: "Verification Checklist: True-Citation Ledger Density Benchmark"
description: "Verification Date: 2026-06-24"
trigger_phrases:
  - "true citation ledger benchmark"
  - "SPECKIT_TRUE_CITATION_EMITTER density"
  - "citation ledger verification"
  - "session scoped firing trigger ceiling"
  - "bare integer reference hit rate"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/004-dark-flag-graduation/003-true-citation-ledger"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored QA checklist, run complete"
    next_safe_action: "Verify items against metrics.json and the harness run"
    blockers: []
    key_files:
      - "scripts/citation-ledger-feasibility.mjs"
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
# Verification Checklist: True-Citation Ledger Density Benchmark

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
- [x] CHK-003 [P1] The 024 PREREQ-A ledger-density prerequisite confirmed as the bar before the benchmark
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The harness reads the live database read-only and the only write lands on a scratch copy
- [x] CHK-011 [P1] The harness imports the compiled production emitter and never edits it
- [x] CHK-012 [P1] The replay forces the flag on inside the harness process only, never on the live server
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-008)
- [x] CHK-021 [P0] The scratch replay proves the emit pipe writes a correct 3-used 2-not-used split
- [x] CHK-022 [P1] The flag-off emit is a no-op that returns zeros and does not create the shadow table
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase ships a read-only benchmark and a verdict, so the completeness bar is a reproducible measurement and a verdict grounded strictly in the numbers.

- [x] CHK-FIX-001 [P0] The emitter is measured on the production corpus, the live `search_shown` rows the search handler writes
- [x] CHK-FIX-002 [P0] The firing-trigger ceiling is measured as the session-scoped shown count, reported as 0 of 1711 on the live corpus
- [x] CHK-FIX-003 [P0] The verdict is one of GRADUATE, REFINE, or CUT and cites values present in metrics.json
- [x] CHK-FIX-004 [P1] The used-versus-unused separation is measured, the replay proves the pipe and the reference scan measures the real echo rate
- [x] CHK-FIX-005 [P1] The short-id collisions are visible as noise via the digit-length buckets and the sampled context, not counted as citations
- [x] CHK-FIX-006 [P1] The REFINE refinement names the firing-trigger and the reference-key changes with the exact production seam each touches
- [x] CHK-FIX-007 [P1] The harness is reproducible, `node scripts/citation-ledger-feasibility.mjs` rebuilds metrics.json
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The live database is never opened for writes, proven by the absent `true_citation_events` table after the run
- [x] CHK-031 [P1] The scratch copy lives in a temporary directory and is removed after the run
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, and tasks synchronized, and every verdict claim traces to metrics.json or the harness run
- [x] CHK-041 [P2] The firing-trigger and reference-key refinement carried into the open questions for the follow-up
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The harness and results live in the phase folder, no production file edited
- [x] CHK-051 [P1] No temp files left outside the results tree, the scratch copy removed after the run
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-24
<!-- /ANCHOR:summary -->

---
