---
title: "Tasks: Code-Graph Seeded-PPR Impact Ranking Benchmark"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "code graph seeded ppr benchmark tasks"
  - "seeded pagerank vs flat impact walk"
  - "shared candidate pool ranking comparison"
  - "ppr damping calibration sweep"
  - "reconstruct removed ppr mechanism"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/005-codegraph-seeded-ppr"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the harness and the shared-pool comparison, run complete"
    next_safe_action: "Compute metrics and author the results docs"
    blockers: []
    key_files:
      - "scripts/seeded-ppr-impact-benchmark.mjs"
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
# Tasks: Code-Graph Seeded-PPR Impact Ranking Benchmark

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

- [x] T001 Locate the live code graph and confirm the CALLS and IMPORTS edge metadata shape (`scripts/seeded-ppr-impact-benchmark.mjs`)
- [x] T002 Recover the removed PPR constants and the transition-weight and reliability functions from the code-graph source at 657a0f6a3e (`scripts/seeded-ppr-impact-benchmark.mjs`)
- [x] T003 [P] Confirm the flag and the PPR symbol are absent from the live source and dist (`results/metrics.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the read-only backup and the edge and node readers over the eval copy (`scripts/seeded-ppr-impact-benchmark.mjs`)
- [x] T005 Derive the labeled change-impact set, the shared multi-hop pool and the direct-impact ground truth from real reverse edges (`scripts/seeded-ppr-impact-benchmark.mjs`)
- [x] T006 Reconstruct the flat pool ranker and the bounded seeded PPR over the undirected projection with the recorded transition weights (`scripts/seeded-ppr-impact-benchmark.mjs`)
- [x] T007 Score precision recall and nDCG at K of 3 5 and 8 for both rankers and sweep the damping grid into `results/metrics.json` (`results/metrics.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm the benchmark reproduces exit 0, the aggregate numbers are stable, the live DB mtime is unchanged and no eval copy leaks (`scripts/seeded-ppr-impact-benchmark.mjs`)
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
