---
title: "Tasks: Code-Graph Edge Lifecycle Dark-Flag Benchmark"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "code graph edge lifecycle benchmark"
  - "edge staleness rebind fan-in benchmark"
  - "throwaway graph rebind harness"
  - "code graph smallest proving consumer"
  - "reverse dependency force parse rebind"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/027-code-graph-edge-lifecycle"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the harness and ran the benchmark"
    next_safe_action: "Compute metrics and author the verdicts"
    blockers: []
    key_files:
      - "scripts/edge-staleness-rebind-benchmark.mjs"
      - "results/staleness-metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Code-Graph Edge Lifecycle Dark-Flag Benchmark

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

- [x] T001 Confirm the shipped `dist/handlers/scan.js` and `dist/lib/code-graph-db.js` import cleanly and `better-sqlite3` resolves (`dist/`)
- [x] T002 Read the force-parse path, `queryImportersOf` and the cross-file edge resolver to confirm the rebind mechanism and the default-off gate (`lib/structural-indexer.ts`)
- [x] T003 [P] Inspect the live `code_edges` schema read-only, confirm the bitemporal columns present and the governance CHECK absent (`database/code-graph.sqlite`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the harness that imports the shipped handler and lib and builds a fresh throwaway workspace and DB per case (`scripts/edge-staleness-rebind-benchmark.mjs`)
- [x] T005 Encode the labeled rename, kind-flip and move fixture with a stable importer and a mutated dependency per case (`scripts/edge-staleness-rebind-benchmark.mjs`)
- [x] T006 Run each case under the flag ON and OFF, query the cross-file edges, score the rebind and write the rollup (`results/staleness-metrics.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm the benchmark is deterministic across repeated runs and the importer-unchanged kind-flip case discriminates (`results/staleness-metrics.json`)
- [x] T008 Confirm the bitemporal read flag has no read consumer and the live `code_edges` has no governance CHECK, read-only (`lib/code-graph-db.ts`)
- [x] T009 Author the data tables and the three graduate, refine or cut verdicts grounded strictly in the metrics and the confirmed code facts (`benchmark-results.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Benchmark reproducible and verdicts authored
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
