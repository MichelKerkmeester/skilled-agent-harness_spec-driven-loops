---
title: "Tasks: Phase 2: injection-plugin [template:level_1/tasks.md]"
description: "Completed tasks for passive active-goal injection, transform append behavior, and injection preview verification."
trigger_phrases:
  - "goal injection tasks"
  - "system transform tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/002-injection-plugin"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed injection task documentation"
    next_safe_action: "Use injection preview from command status output"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-state.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-m1-injection-plugin-20260629"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: injection-plugin

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Reuse state helper contract from Phase 1.
- [x] T002 Define active-goal injection block shape.
- [x] T003 [P] Define transform failure behavior as fail-open.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `renderGoalInjection` to `.opencode/plugins/mk-goal.js`.
- [x] T005 Add sanitized and capped objective, verifier, usage, and directive fields.
- [x] T006 Add `appendGoalBrief` with duplicate-marker protection.
- [x] T007 Register `experimental.chat.system.transform`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify `injection_preview` from `mk_goal_status`.
- [x] T009 Verify transform output matches the injection preview.
- [x] T010 Run full plugin unit tests.
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
