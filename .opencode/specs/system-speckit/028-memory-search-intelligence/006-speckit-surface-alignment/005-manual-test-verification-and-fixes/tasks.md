---
title: "Tasks: Manual Test Verification and Fixes"
description: "Completed task ledger for the manual verification run, shipped fixes, recovery checks, and documentation."
trigger_phrases:
  - "manual verification tasks"
  - "Fable-5 fix tasks"
  - "bm25 regression fix tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/006-speckit-surface-alignment/005-manual-test-verification-and-fixes"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Record manual verification and shipped fixes"
    next_safe_action: "Run strict validation for the surface-alignment parent"
    completion_pct: 100
---
# Tasks: Manual Test Verification and Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or evidence) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Run deep-loop-runtime scoring and coverage-graph scenarios: 8/8 PASS [completed]
- [x] T002 [P] Run deep-loop observability and convergence scenarios: 7/7 PASS [completed]
- [x] T003 [P] Run system-code-graph 05/06/08 scenarios: 5 PASS, 1 FAIL, 3 BLOCKED before recovery [completed]
- [x] T004 [P] Run `012-fix` stress harness suites: substrate/durability/matrix PASS, search-quality one failing file before BM25 fix [completed]
- [x] T005 Summarize runnable scope: 25 PASS, 2 FAIL, 3 BLOCKED across approximately 30 runnable items from approximately 510 total scenarios [completed]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Fix gold-battery path in `system-code-graph/mcp_server/lib/gold-query-verifier.ts` (`bda7f57879`) [completed]
- [x] T007 Restore corpus-bounded BM25 candidate fill in `system-spec-kit/mcp_server/lib/search/hybrid-search.ts` (`e4fcccc320`) [completed]
- [x] T008 Preserve BM25 performance saving through rank-ordered incremental metadata resolution in 500-id batches with early exit at `limit` survivors (`e4fcccc320`) [completed]
- [x] T009 Fix `bm25-scope-then-limit-stress.vitest.ts` test drift for `deleted_at` and intercept string (`e4fcccc320`) [completed]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify `stress:harness`: 45/45 after fix, baseline was 42/45 [completed]
- [x] T011 Verify `hybrid-search.vitest`: 102/102 [completed]
- [x] T012 Verify `tsc` clean [completed]
- [x] T013 Verify regression baseline delta 0 [completed]
- [x] T014 Run `code_graph_scan` to move graph stale to fresh/ready/live [completed]
- [x] T015 Recheck blocked code-graph scenarios; `blast_radius` moved BLOCKED to ok [completed]
- [x] T016 Cold-start spec-memory daemon and verify `memory_search "surface alignment remediation"` returns 3 hits [completed]
- [x] T017 Record lexical-overlap-quality-gate 18/20 FAIL as pre-existing, origin-parity delta 0, deferred to FTS/016 owner [completed]
- [x] T018 Record `exactTriggerSearch limit*3` as confirmed safe because filtering happens in SQL `WHERE` before `LIMIT` [completed]
- [x] T019 Author `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and `decision-record.md` for this phase [completed]
- [x] T020 Generate `description.json` and `graph-metadata.json` for the new phase [completed]
- [x] T021 Add the `015` row to the parent phase documentation map [completed]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain in this documentation phase.
- [x] Open/deferred technical findings are recorded without being claimed fixed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Summary**: See `implementation-summary.md`.
- **Decision**: See `decision-record.md`.
<!-- /ANCHOR:cross-refs -->
