---
title: "Tasks: Vague-Query Model Benchmark [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "vague query model benchmark"
  - "memory search model comparison"
  - "benchmark driver parser"
  - "search behavior harness"
  - "model dispatch matrix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/004-vague-query-model-benchmark"
    last_updated_at: "2026-07-04T17:12:04.504Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored harness, matrix dispatch in progress"
    next_safe_action: "Parse metrics and author the results docs"
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
# Tasks: Vague-Query Model Benchmark

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

- [x] T001 Author the matrix config with four model and variant pairs, the twelve query grid, three samples and concurrency three (`scripts/benchmark-config.json`)
- [x] T002 Pre-seed the nine overlapping pilot cells as sample one so they are reused not re-dispatched (`results/raw/`)
- [x] T003 [P] Confirm the four providers and model slugs in a pre-flight before the run
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build the idempotent async spawn-pool driver with one empty-output retry and a timing sidecar per cell (`scripts/run-benchmark.mjs`)
- [x] T005 Build the event-stream parser that derives per-cell metrics and aggregates to mean plus sample variance (`scripts/extract-metrics.mjs`)
- [x] T006 Sanity-check the parser on the nine pilot cells before committing to the full run
- [x] T007 Run the driver over the remaining cells and confirm the matrix completes (`scripts/run-benchmark.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Parse the completed matrix and confirm metrics.json reports a cell count near the 144 expected, with any launch-race gaps documented (`results/metrics.json`)
- [x] T009 Author the per-cell and aggregate data tables grounded strictly in metrics.json (`benchmark-results.md`)
- [x] T010 Author the per-model profiles, the cross-model robustness finding and the model recommendation (`implementation-summary.md`)
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
