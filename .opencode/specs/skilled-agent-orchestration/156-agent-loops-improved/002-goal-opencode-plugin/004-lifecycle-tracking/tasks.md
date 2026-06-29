---
title: "Tasks: Phase 4: lifecycle-tracking [template:level_1/tasks.md]"
description: "Lifecycle tracking tasks for goal event handling, usage accounting, prompt blocking, and verification."
trigger_phrases:
  - "goal lifecycle tasks"
  - "account usage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/004-lifecycle-tracking"
    last_updated_at: "2026-06-28T21:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed lifecycle tracking tasks"
    next_safe_action: "Use these lifecycle fields from supervisor and continuation phases"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-m2-lifecycle-20260628"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: lifecycle-tracking

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

- [x] T001 Read current goal plugin and research design.
- [x] T002 Capture baseline unit and syntax checks.
- [x] T003 [P] Confirm local OpenCode plugin event hook shape.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add lifecycle `event` switch to `.opencode/plugins/mk-goal.js`.
- [x] T005 Add assistant activity and verifier evidence capture.
- [x] T006 Add guarded usage accounting with message-id dedupe.
- [x] T007 Add prompt blocker state and volatile lock cleanup.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add lifecycle unit test for account usage and budget transition.
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
