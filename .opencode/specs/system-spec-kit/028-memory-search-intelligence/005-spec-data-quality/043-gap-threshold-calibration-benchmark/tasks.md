---
title: "Tasks: Evidence-Gap Detector Threshold Calibration Benchmark"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "evidence gap detector calibration"
  - "Z-score peakedness not relevance"
  - "executePipeline detector recomputation harness"
  - "faithful Z-score sweep"
  - "labeled set gap threshold harness"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/043-gap-threshold-calibration-benchmark"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored harness, labeled-set run complete"
    next_safe_action: "Sweep the threshold and author the results docs"
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
# Tasks: Evidence-Gap Detector Threshold Calibration Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Take a read-only backup of the live corpus with no reindex
- [x] T002 Define the eighteen labeled queries across the should-good, should-gap and boundary groups in the harness (`scripts/gap-threshold-calibration-benchmark.mjs`)
- [x] T003 [P] Confirm the active embedder and the production `detectEvidenceGap` direction at `evidence-gap-detector.ts:206` before the run
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build the harness to run the production `executePipeline` once per query and capture the Stage-4 score array and `evidenceGapDetected` binary (`scripts/gap-threshold-calibration-benchmark.mjs`)
- [x] T005 Recompute the continuous Z-score via the production `detectEvidenceGap` and assert the recomputed binary equals production for all eighteen queries (`scripts/gap-threshold-calibration-benchmark.mjs`)
- [x] T006 Compute the per-group Z-score distribution, the should-good false-positive rate and should-gap detection rate at 1.3, and sweep the threshold from 0.5 to 3.0 (`scripts/gap-threshold-calibration-benchmark.mjs`)
- [x] T007 Run the harness over all eighteen labeled queries and write `results/metrics.json` (`results/metrics.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm the 18 of 18 faithfulness assertion holds and metrics.json carries a Z-score and binary per query with the per-group distribution and the sweep (`results/metrics.json`)
- [x] T009 Author the per-group and sweep data tables grounded strictly in metrics.json (`benchmark-results.md`)
- [x] T010 Author the calibration verdict and the relevance-aware redesign recommendation (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
