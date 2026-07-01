---
title: "Tasks: Phase 3: goal-command [template:level_1/tasks.md]"
description: "Completed tasks for the root /goal command, mk_goal mutation tool, mk_goal_status read tool, and status verification."
trigger_phrases:
  - "goal command tasks"
  - "mk_goal tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/003-goal-command"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed goal command task documentation"
    next_safe_action: "Use this passive command surface before lifecycle phases"
    blockers: []
    key_files:
      - ".opencode/commands/goal_opencode.md"
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-state.test.cjs"
      - ".opencode/plugins/__tests__/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:b15e83014f4ba349f944d4384ec4211923491d1798115fcf6c06dfca018bdf31"
      session_id: "goal-m1-goal-command-20260629"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: goal-command

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

- [x] T001 Define root `/goal` argument routing rules.
- [x] T002 Reuse state helpers and injection renderer.
- [x] T003 [P] Define status and failure output envelopes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create `.opencode/commands/goal_opencode.md`.
- [x] T005 Add `mk_goal` tool with `set`, `show`, `clear`, `complete`, and `pause`.
- [x] T006 Add `mk_goal_status` read tool.
- [x] T007 Add `injection_preview` and state fields to tool output.
- [x] T008 Add command hard rules forbidding direct state edits, shell execution, and session-id inference.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify set, status, preview, transform parity, and clear through tests.
- [x] T010 Verify tool-context session resolution.
- [x] T011 Run full plugin unit tests.
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
