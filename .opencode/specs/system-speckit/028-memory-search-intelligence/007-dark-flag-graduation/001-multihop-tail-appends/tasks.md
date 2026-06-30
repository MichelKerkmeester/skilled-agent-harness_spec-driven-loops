---
title: "Tasks: Multi-Hop Tail-Appends Benchmark"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "multihop tail appends benchmark"
  - "completeRecall at K append flags"
  - "tail append harness tasks"
  - "three result floor blocker"
  - "prod path byte identity check"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/001-multihop-tail-appends"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the harness and ran the matrix, run complete"
    next_safe_action: "Author the results docs and the verdict"
    blockers: []
    key_files:
      - "scripts/multihop-tail-appends-benchmark.mjs"
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
# Tasks: Multi-Hop Tail-Appends Benchmark

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

- [x] T001 Trace the production reader from the `memory_search` handler through `executePipeline`, and confirm the append stages C3 and C4 live in `enrichFusedResults` which the pipeline Stage-1 `stopAfterFusion` path skips (`handlers/memory-search.ts`, `lib/search/hybrid-search.ts`)
- [x] T002 Build the labeled multi-target query set from hub docs that cross-reference sibling folders, resolving each target to its indexed spec.md id (`scripts/multihop-tail-appends-benchmark.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the harness with the read-only backup of the database and the active vector shard (`scripts/multihop-tail-appends-benchmark.mjs`)
- [x] T004 Measure completeRecall@K for K of 3, 5 and 8 on the prod `executePipeline` path with both append flags off and on, with repeats (`scripts/multihop-tail-appends-benchmark.mjs`)
- [x] T005 Measure the same on the legacy `searchWithFallback` path that runs the append stages (`scripts/multihop-tail-appends-benchmark.mjs`)
- [x] T006 Capture the prod result count, the append-stage application metadata, the legacy surviving-append count, the prod byte-identity check, and the floor-blocker resolution, and write `results/metrics.json` (`results/metrics.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm the harness runs reproducibly from a read-only backup, exit 0, no write to the live database (`scripts/multihop-tail-appends-benchmark.mjs`)
- [x] T008 Author the per-query and aggregate data tables grounded strictly in metrics.json (`benchmark-results.md`)
- [x] T009 Author the GRADUATE, REFINE or CUT verdict, the floor-blocker answer, and the designed refinement (`implementation-summary.md`)
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
