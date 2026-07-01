---
title: "Tasks: Phase 6: active-continuation"
description: "Task list for default-off active continuation, JSONL observability, idle wiring, and continuation tests."
trigger_phrases:
  - "goal continuation tasks"
  - "maybe continue goal tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/006-active-continuation"
    last_updated_at: "2026-06-28T21:46:31Z"
    last_updated_by: "codex"
    recent_action: "Completed active continuation tasks"
    next_safe_action: "Run a live MK_GOAL_AUTONOMY=smoke session.idle smoke in opencode serve"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-continuation.test.cjs"
    session_dedup:
      fingerprint: "sha256:6b15815b5e910bb38b1c05ad18d1dc3dd65351fc572deb73ed362f2763e24c92"
      session_id: "goal-m3-continuation-20260628"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Live one-shot session.idle observability"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: active-continuation

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

- [x] T001 Read current `.opencode/plugins/mk-goal.js`.
- [x] T002 Read goal plugin research synthesis.
- [x] T003 [P] Read existing goal plugin tests.
- [x] T004 Run baseline plugin tests and syntax checks.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add continuation constants, env handling, and JSONL log helpers.
- [x] T006 Normalize continuation counters and reason fields in stored goal state.
- [x] T007 Add `maybeContinueGoal(sessionID)` with ordered gates.
- [x] T008 Reserve `autoTurnsUsed` before active `promptAsync` dispatch.
- [x] T009 Wire `session.idle` to run verifier first and continuation second.
- [x] T010 Track `session.status`, permission blocks, and prompt replies.
- [x] T011 Add continuation status fields to `mk_goal_status`.
- [x] T012 Add continuation unit test.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run full plugin unit tests.
- [x] T014 Run Node syntax checks.
- [x] T015 Run OpenCode alignment drift check.
- [x] T016 Run strict spec validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed except for the documented live serve/TUI idle-smoke gap
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
