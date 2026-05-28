---
title: "Tasks: 005 Curator Integration"
description: "Task list for memory curator integration child phase."
trigger_phrases:
  - "027 011 005 tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-coco-memory-context-extras/005-curator-integration"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored child tasks"
    next_safe_action: "Start T001 after child 004"
    blockers: ["004-curator-prompt"]
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-005-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 005 Curator Integration

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

- [ ] T001 Read child 004 curator API [30m]
- [ ] T002 Read `memory-search.ts` limit and formatting flow [1h]
- [ ] T003 Define immutable snapshot fields [30m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement retrieval candidate and presentation budget split [2h]
- [ ] T005 Wire curator hook after deterministic retrieval [2h]
- [ ] T006 Attach `data.curatedContext` only when validated [1h]
- [ ] T007 Add telemetry outcomes [1h]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add budget split tests [1h]
- [ ] T009 Add fallback tests [1h]
- [ ] T010 Add ordering immutability snapshot [1h]
- [ ] T011 Run child strict validation [15m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked complete.
- [ ] Budget, fallback, and ordering tests pass.
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
