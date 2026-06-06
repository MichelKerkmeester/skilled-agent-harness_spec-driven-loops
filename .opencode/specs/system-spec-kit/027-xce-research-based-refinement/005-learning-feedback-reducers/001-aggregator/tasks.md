---
title: "Tasks — 001 Shared Feedback Aggregation"
description: "Task list for the shared feedback aggregation child packet."
trigger_phrases:
  - "005 aggregator tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/001-aggregator"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 0
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

- [ ] T001 Confirm Phase 002 dependency has landed before implementation starts.
- [ ] T002 Define `FeedbackAggregate` and window option types.
- [ ] T003 Define `FeedbackLedgerQuality` summary fields for malformed rows, missing memory ids, duplicate events, support counts, and replay-window coverage.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Reuse/extend `batch-learning.ts:195-241` (`aggregateEvents`) instead of creating a duplicate `mcp_server/lib/feedback/feedback-aggregation.ts`.
- [ ] T005 Reuse the existing strong/medium/weak bucket mapping; add only buckets it does not already produce.
- [ ] T006 Implement sessions, queries, firstSeen, and lastSeen tracking, extending the existing aggregate where fields are missing.
- [ ] T007 Reconcile the weighted-hit formula with the existing `weightedScore`/`computedBoost`, keeping the zero floor and avoiding a parallel formula.
- [ ] T008 Emit ledger quality metrics and low-support gating metadata.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Add Vitest coverage for formula edge cases.
- [ ] T010 Add run-twice idempotency test.
- [ ] T011 Add quality summary tests for skipped, malformed, duplicate, and low-support rows.
- [ ] T012 Run child strict validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete.
- [ ] Tests pass.
- [ ] Strict validation exits 0.
- [ ] Downstream consumers have quality metrics available for promotion gates.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`
- `plan.md`
- `checklist.md`
<!-- /ANCHOR:cross-refs -->
