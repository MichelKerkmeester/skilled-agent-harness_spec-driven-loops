---
title: "Tasks: Devin goal hooks"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "devin goal hooks tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase tasks for Devin goal hook adapters"
    next_safe_action: "Implement after phase 002 fixes the Stop-hook parity tier"
    blockers:
      - "Phase 002 capability-probe matrix must land before adapter code starts."
    key_files:
      - ".opencode/hooks/goal/devin/"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-003-devin-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether Devin's Stop hook can block/continue per the phase 002 probe (undetermined)."
    answered_questions: []
---
# Tasks: Devin goal hooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] [B] T001 Confirm phase 001 goal-core API surface is stable (`.opencode/hooks/goal/lib/goal-core.cjs`). (blocked on phase 001)
- [ ] [B] T002 Read phase 002's capability-probe matrix result for Devin's `Stop` hook. (blocked on phase 002)
- [ ] T003 Scaffold `.opencode/hooks/goal/devin/` with three adapter stubs (`user-prompt-submit.cjs`, `session-start.cjs`, `stop.cjs`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Implement `user-prompt-submit.cjs`: read `active-goal.json`, render the goal brief, return as `additionalContext`. (`.opencode/hooks/goal/devin/user-prompt-submit.cjs`)
- [ ] T005 [P] Implement `session-start.cjs`: restore active goal state at session start. (`.opencode/hooks/goal/devin/session-start.cjs`)
- [ ] T006 Implement `stop.cjs` at the tier fixed by phase 002 (verify-only, or verify-and-continue). (`.opencode/hooks/goal/devin/stop.cjs`)
- [ ] T007 Register all three adapters in `.devin/hooks.v1.json`. (`.devin/hooks.v1.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Write co-located `node --test` adapter tests covering inject content, restore behavior, and verify/continue logic.
- [ ] T009 Run a live `devin -p` smoke session; record the goal brief text actually reaching the model.
- [ ] T010 Document the shipped `Stop` hook parity tier honestly in `implementation-summary.md`.
- [ ] T011 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and resolve any errors.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T001-T011)
- [ ] No `[B]` blocked tasks remaining (T001/T002 unblock once phases 001/002 ship)
- [ ] Manual verification passed (adapter test suite green, live `devin -p` smoke proof recorded)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
