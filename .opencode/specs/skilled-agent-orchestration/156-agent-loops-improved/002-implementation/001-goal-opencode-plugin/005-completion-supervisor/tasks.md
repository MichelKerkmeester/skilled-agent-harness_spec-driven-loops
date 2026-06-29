---
title: "Tasks: Phase 5: completion-supervisor [template:level_1/tasks.md]"
description: "Supervisor verifier tasks for idle verification, verdict normalization, completion source tracking, and redacted status output."
trigger_phrases:
  - "goal supervisor tasks"
  - "maybe verify goal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/001-goal-opencode-plugin/005-completion-supervisor"
    last_updated_at: "2026-06-28T21:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed supervisor verifier tasks"
    next_safe_action: "Call verifier before active continuation prompts"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-supervisor.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-m2-supervisor-20260628"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: completion-supervisor

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

- [x] T001 Confirm lifecycle evidence capture exists.
- [x] T002 Confirm manual completion source behavior.
- [x] T003 [P] Define strict verifier verdict mapping.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `maybeVerifyGoal(sessionID)` to `.opencode/plugins/mk-goal.js`.
- [x] T005 Normalize absent and ambiguous evidence to `not_met`.
- [x] T006 Add supervisor and manual completion source handling.
- [x] T007 Add redacted verifier fields to status output.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add supervisor verdict mapping unit test.
- [x] T009 Run full plugin unit tests.
- [x] T010 Run syntax, alignment, and spec validation checks.
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
