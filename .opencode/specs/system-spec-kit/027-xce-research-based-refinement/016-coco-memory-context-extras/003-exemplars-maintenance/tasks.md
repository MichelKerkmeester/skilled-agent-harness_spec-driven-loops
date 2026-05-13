---
title: "Tasks: 003 Exemplars Maintenance"
description: "Task list for Coco exemplar maintenance child phase."
trigger_phrases:
  - "027 011 003 tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-coco-memory-context-extras/003-exemplars-maintenance"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored child tasks"
    next_safe_action: "Start T001 after children 001 and 002"
    blockers: ["001-exemplars-schema", "002-exemplars-retriever"]
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-003-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 003 Exemplars Maintenance

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

- [ ] T001 Read schema table constants [20m]
- [ ] T002 Read retriever identity validation [30m]
- [ ] T003 Confirm clear operation registration surface [30m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `exemplar_maintenance.py` [1h]
- [ ] T005 Implement TTL cleanup [1h]
- [ ] T006 Implement storage cap enforcement [1h]
- [ ] T007 Implement stale reconciliation [2h]
- [ ] T008 Implement clear operation [1h]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Add TTL and cap tests [1h]
- [ ] T010 Add file/range/hash stale tests [1h]
- [ ] T011 Add clear safety test [45m]
- [ ] T012 Run child strict validation [15m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked complete.
- [ ] Maintenance tests pass.
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
