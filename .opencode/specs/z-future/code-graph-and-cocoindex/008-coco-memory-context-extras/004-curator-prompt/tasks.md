---
title: "Tasks: 004 Curator Prompt"
description: "Task list for memory curator prompt child phase."
trigger_phrases:
  - "027 011 004 tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/008-coco-memory-context-extras/004-curator-prompt"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored child tasks"
    next_safe_action: "Start T001"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-004-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 004 Curator Prompt

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

- [ ] T001 Read `llm-cache.ts` and reformulation precedent [45m]
- [ ] T002 Define package schema and candidate summary shape [45m]
- [ ] T003 Decide validator implementation approach [30m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `context_curator.ts` prompt builder [1h]
- [ ] T005 Implement JSON parser and candidate ID validation [2h]
- [ ] T006 Extend cache key mode for context curation [1h]
- [ ] T007 Add timeout/fallback helper shape for child 005 [1h]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add parser and invented-ID tests [1h]
- [ ] T009 Add cache key tests [45m]
- [ ] T010 Add prompt snapshot test [45m]
- [ ] T011 Run child strict validation [15m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked complete.
- [ ] Parser, cache, and prompt tests pass.
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
