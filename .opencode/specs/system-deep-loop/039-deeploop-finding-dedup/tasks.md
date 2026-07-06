---
title: "Tasks: Deep-Loop Finding Dedup Benchmark"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep loop finding dedup benchmark"
  - "fanout near dup dedup tasks"
  - "SPECKIT_FANOUT_NEAR_DUP_DEDUP tasks"
  - "lag ceiling progress heartbeat tasks"
  - "fanout dedup harness tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deeploop-finding-dedup"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran both harnesses and authored the verdict docs"
    next_safe_action: "Validate the phase strict"
    blockers: []
    key_files:
      - "scripts/dedup-benchmark.mjs"
      - "scripts/gauge-benchmark.mjs"
      - "results/dedup-metrics.json"
      - "results/gauge-metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep-Loop Finding Dedup Benchmark

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

- [x] T001 Confirm the production merge, pool, and runner exports and the real research and review registry field shapes (`scripts/dedup-benchmark.mjs`)
- [x] T002 Build the labeled research and review fan-out sets with a ground-truth near-duplicate and distinct cluster map (`scripts/dedup-benchmark.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the dedup harness over `mergeResearchRegistries` and `mergeReviewRegistries` scoring precision, distinct-finding recall, noise reduction, severity preservation, and byte-identity (`scripts/dedup-benchmark.mjs`)
- [x] T004 Write the lag-ceiling case over `runCappedPool` with the one-shot warning and silence-when-off assertions (`scripts/gauge-benchmark.mjs`)
- [x] T005 Write the progress-heartbeat case over the spawned `fanout-run.cjs` CLI with the steady-cadence and silence-when-off assertions (`scripts/gauge-benchmark.mjs`)
- [x] T006 Run both harnesses and write the metric rollups (`results/dedup-metrics.json`, `results/gauge-metrics.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm both harnesses exit 0, the dedup numbers reproduce across re-runs, and the dedup off path is byte-identical to the production default (`scripts/dedup-benchmark.mjs`)
- [x] T008 Author the per-path and aggregate data tables grounded strictly in the metrics files (`benchmark-results.md`)
- [x] T009 Author the three graduation verdicts and the recommendation (`implementation-summary.md`)
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
