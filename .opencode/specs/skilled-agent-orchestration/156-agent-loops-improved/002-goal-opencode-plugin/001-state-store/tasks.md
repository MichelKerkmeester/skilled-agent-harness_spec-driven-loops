---
title: "Tasks: Phase 1: state-store [template:level_1/tasks.md]"
description: "Completed tasks for per-session goal state, atomic writes, queued mutation, and state verification."
trigger_phrases:
  - "goal state store tasks"
  - "atomic write tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/001-state-store"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed state store task documentation"
    next_safe_action: "Use state helpers as the base contract for later goal phases"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-state.test.cjs"
      - ".opencode/plugins/__tests__/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-m1-state-store-20260629"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: state-store

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

- [x] T001 Define session-keyed goal state ownership.
- [x] T002 Identify `.opencode/skills/.goal-state` as the runtime state directory.
- [x] T003 [P] Define missing-session behavior as fail-closed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `ensureGoalStateDir` to `.opencode/plugins/mk-goal.js`.
- [x] T005 Add `goalPathForSession` with hex session-id file names.
- [x] T006 Add `readGoal` and stored-goal normalization.
- [x] T007 Add `writeGoalAtomic` with temp file, fsync, rename, and directory fsync.
- [x] T008 Add queued `mutateGoal`, `setGoal`, and `clearGoal`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Add state isolation and missing-session tests.
- [x] T010 Add tool-context session resolution regression test.
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
