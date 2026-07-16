---
title: "Tasks: Deterministic-Ranking Flag Graduation Benchmark"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deterministic ranking benchmark"
  - "should the determinism flag graduate"
  - "executePipeline flag toggle harness"
  - "embed once reuse ranking"
  - "off vs on divergence harness"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/010-deterministic-ranking-benchmark"
    last_updated_at: "2026-07-04T17:11:55.517Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored harness, matrix run complete"
    next_safe_action: "Compute metrics and author the results docs"
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
# Tasks: Deterministic-Ranking Flag Graduation Benchmark

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

- [x] T001 Take a read-only backup of the live 17,599-row corpus with populated recency columns and no reindex
- [x] T002 Define the twelve benchmark queries with their vagueness class in the harness (`scripts/deterministic-ranking-benchmark.mjs`)
- [x] T003 [P] Confirm the active embedder is `nomic-embed-text-v1.5` before the run
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build the harness to embed each query once and reuse the embedding across all six runs (`scripts/deterministic-ranking-benchmark.mjs`)
- [x] T005 Drive `executePipeline` six times per query, toggling `SPECKIT_DETERMINISTIC_RANKING` off for three runs and on for three through `process.env` (`scripts/deterministic-ranking-benchmark.mjs`)
- [x] T006 Compute the flag-ON determinism and the off-vs-on overlap, Kendall tau and score delta per query (`scripts/deterministic-ranking-benchmark.mjs`)
- [x] T007 Run the harness over all twelve queries, 72 pipeline calls, and write `results/metrics.json` (`results/metrics.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm metrics.json reports 72 calls with a determinism reading per query and the divergence triplet, flag-ON orderings byte-identical across invocations (`results/metrics.json`)
- [x] T009 Author the per-query and aggregate data tables grounded strictly in metrics.json (`benchmark-results.md`)
- [x] T010 Author the graduation verdict and the recommendation (`implementation-summary.md`)
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
