---
title: "Tasks: 002 Exemplars Retriever"
description: "Task list for Coco exemplar retriever child phase."
trigger_phrases:
  - "027 011 002 tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/008-coco-memory-context-extras/002-exemplars-retriever"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored child tasks"
    next_safe_action: "Start T001 after child 001"
    blockers: ["001-exemplars-schema"]
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-002-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 002 Exemplars Retriever

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read child 001 schema exports [30m]
- [ ] T002 Read Coco query response path [45m]
- [ ] T003 Define retriever result type [30m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `exemplar_retriever.py` [2h]
- [ ] T005 Implement top-3 and threshold filtering [1h]
- [ ] T006 Add stale identity suppression in retriever [1h]
- [ ] T007 Wire optional `exemplars` group in query response [2h]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add cold-start test [30m]
- [ ] T009 Add threshold and cap tests [1h]
- [ ] T010 Add flag-off parity snapshot [1h]
- [ ] T011 Run child strict validation [15m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked complete.
- [ ] Flag-off parity test passes.
- [ ] Child strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
