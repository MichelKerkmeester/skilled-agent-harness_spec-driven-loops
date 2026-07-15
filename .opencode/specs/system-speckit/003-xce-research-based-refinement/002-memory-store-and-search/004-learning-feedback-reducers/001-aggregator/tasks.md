---
title: "Tasks — 001 Shared Feedback Aggregation"
description: "Task list for the shared feedback aggregation child packet."
trigger_phrases:
  - "005 aggregator tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/001-aggregator"
    last_updated_at: "2026-06-10T11:06:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Extended aggregateEvents with read-only reducer fields"
    next_safe_action: "Proceed to consumer reducers after shadow gates"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 100
---
# Tasks: Shared Feedback Aggregation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete, `[P]` parallelizable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm Phase 002 dependency has landed before implementation starts. Evidence: dependency summary reports 100% completion.
- [x] T002 Define aggregate extension fields and preserve the window API. Evidence: `AggregatedSignal` now has optional consumer fields.
- [x] T003 Confirm ledger rows expose event `type` for per-type counts without schema changes. Evidence: `FeedbackEventRow` and `SELECT *` include `type`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reuse/extend `batch-learning.ts:195-241` (`aggregateEvents`) instead of creating a duplicate `mcp_server/lib/feedback/feedback-aggregation.ts`. Evidence: no new aggregator module added.
- [x] T005 Reuse the existing strong/medium/weak bucket mapping; add only buckets it does not already produce. Evidence: existing confidence counters remain unchanged.
- [x] T006 Implement sessions, queries, firstSeen, and lastSeen tracking, extending the existing aggregate where fields are missing. Evidence: tests cover `queryCount`, `firstSeen`, and `lastSeen`.
- [x] T007 Reconcile the weighted-hit formula with the existing `weightedScore`/`computedBoost`, keeping the zero floor and avoiding a parallel formula. Evidence: `weightedHitCount` is additive and tests cover formula cases.
- [x] T008 Keep broader quality metrics out of this additive aggregator scope. Evidence: no new quality API or writes were added.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Add Vitest coverage for formula edge cases. Evidence: positive-only, negative-only, mixed, and floor cases pass.
- [x] T010 Add run-twice idempotency test. Evidence: repeated aggregation output equality passes.
- [x] T011 Add scoped read-only and ledger-semantics tests. Evidence: empty window, no write, and empty memory-id grouping pass.
- [x] T012 Run child strict validation. Evidence: strict validation exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete.
- [x] Tests pass.
- [x] Strict validation exits 0.
- [x] Downstream consumers have additive aggregate fields available for promotion gates.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`
- `plan.md`
- `checklist.md`
<!-- /ANCHOR:cross-refs -->
