---
title: "Verification Checklist: Save-Reconsolidation Merge Precision"
description: "Verification Date: 2026-06-24"
trigger_phrases:
  - "save reconsolidation merge precision checklist"
  - "SPECKIT_RECONSOLIDATION_ENABLED verification"
  - "reconsolidation precision verification"
  - "reconsolidation gate write verification"
  - "near duplicate merge precision corpus"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/004-save-reconsolidation"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored QA checklist, run complete"
    next_safe_action: "Verify items against the metrics rollups and the harness runs"
    blockers: []
    key_files:
      - "scripts/recon-precision-benchmark.mjs"
      - "scripts/recon-gate-and-writes.mjs"
      - "results/precision-metrics.json"
      - "results/gate-metrics.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Save-Reconsolidation Merge Precision

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
- [x] CHK-003 [P1] The destructive-path safety rule confirmed as read-only backup plus in-memory writes before any run
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The harnesses read `MERGE_THRESHOLD` and `CONFLICT_THRESHOLD` from the production module and never reimplement them
- [x] CHK-011 [P1] The precision harness routes every labeled pair through the production `determineAction` and the production `mergeContent`
- [x] CHK-012 [P1] The gate harness drives `reconsolidate`, `hasReconsolidationCheckpoint` and the merge and deprecate writers from dist
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-007)
- [x] CHK-021 [P0] Both harnesses exit 0 and the gate harness reports all twelve checks passing
- [x] CHK-022 [P1] Merge precision and conflict precision are measured over the labeled fixture and reported in `precision-metrics.json`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase ships a benchmark of a destructive default-off path, so the completeness bar is a measured precision-and-recall verdict with the safety controls proven.

- [x] CHK-FIX-001 [P0] The benchmark question is answered with a measured number, merge precision 0.017 on the production same-folder scope
- [x] CHK-FIX-002 [P0] Recall preservation is measured and the real distinct-information-loss mechanism is named, predecessor deprecation not line truncation
- [x] CHK-FIX-003 [P0] The checkpoint gate, the default-off byte-identity and the merge and deprecate writes are verified passing
- [x] CHK-FIX-004 [P1] The duplicate and distinct cosine separation is quantified and the zero-false-positive threshold reported
- [x] CHK-FIX-005 [P1] The verdict is CUT and every verdict claim traces to a number in `precision-metrics.json` or `gate-metrics.json`
- [x] CHK-FIX-006 [P1] The safe alternatives (content-hash exact-duplicate merge, assistive shadow path) are recorded as follow-up
- [x] CHK-FIX-007 [P1] Both harnesses are reproducible, `node scripts/recon-precision-benchmark.mjs` and `node scripts/recon-gate-and-writes.mjs` rebuild the rollups exit 0
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The precision harness reads a read-only backup and the active vector shard copy, and the live database file mtime is unchanged after the run
- [x] CHK-031 [P0] The destructive writes run only on a throwaway in-memory database, so no benchmark cell mutates the live memory database
- [x] CHK-032 [P1] No production default is flipped and no other feature's files are touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized, and every verdict claim traces to a metrics rollup or a harness run
- [x] CHK-041 [P1] The CUT verdict is recorded in this phase folder. The parent suite tracking row is left for the suite owner to fill, since this phase is scope-locked to its own folder and must not edit the shared parent doc in the parallel benchmark pass

Suite-row note: the parent `benchmark-and-test-status.md` row for phase 004 reads verdict PENDING. Updating it would edit a file outside this phase folder, which the parallel-safety scope lock forbids, so the verdict lives here and in `benchmark-results.md` for the suite owner to roll up.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The harnesses and results live in the phase folder, no production code is edited
- [x] CHK-051 [P1] No temp files left outside the scratchpad and the results tree
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
