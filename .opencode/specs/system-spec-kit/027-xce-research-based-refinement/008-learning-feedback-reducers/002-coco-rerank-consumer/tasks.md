---
title: "Tasks — 002 Coco Rerank Consumer"
description: "Task list for the Python coco rerank consumer."
trigger_phrases:
  - "009 coco rerank tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/002-coco-rerank-consumer"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 0
---
# Tasks: Coco Rerank Feedback Consumer

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

- [ ] T001 Confirm `001-aggregator` is available.
- [ ] T002 Design `feedback_rerank_weights` schema.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create `feedback_reducer.py`.
- [ ] T004 Create SQLite table helper.
- [ ] T005 Implement support threshold and clamped delta formula.
- [ ] T006 Integrate delta lookup into `_ranked_result()`.
- [ ] T007 Add `SPECKIT_COCOINDEX_FEEDBACK_RERANK` flag gate.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add pytest coverage for cold start and missing table.
- [ ] T009 Add pytest coverage for min support and clamping.
- [ ] T010 Verify privacy: no raw comments in table schema.
- [ ] T011 Run child strict validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Flag-off behavior unchanged.
- [ ] Tests pass.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`
- `plan.md`
- `checklist.md`
<!-- /ANCHOR:cross-refs -->
