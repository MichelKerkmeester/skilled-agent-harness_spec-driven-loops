---
title: "Tasks: Devin goal hooks"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "devin goal hooks tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/003-devin-goal-hooks"
    last_updated_at: "2026-07-29T06:45:00Z"
    last_updated_by: "claude"
    recent_action: "Completed all tasks T001-T011, all unblocked"
    next_safe_action: "Hand parity findings to phases 004/005 (Cursor, Pi)"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/devin/"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-003-devin-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Devin's Stop hook parity tier: verify-and-continue shipped, mechanism confirmed, live evidence-source gap documented."
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

- [x] T001 Confirm phase 001 goal-core API surface is stable (`.opencode/hooks/goal/lib/goal-core.cjs`). (unblocked, API confirmed: `readGoalRecord`/`renderGoalBrief`/`verifyGoalHeuristic`/`recordTurn`/`isPluginDisabled`)
- [x] T002 Read phase 002's capability-probe matrix result for Devin's `Stop` hook. (unblocked, full injection-plus-verify/continue tier confirmed in `002-capability-probes/capability-matrix.md`)
- [x] T003 Scaffold `.opencode/hooks/goal/devin/` with three adapter files (`goal-inject.mjs`, `goal-session-start.mjs`, `goal-verify.mjs` — direct-run `.mjs`, naming refined from this doc's original `.cjs` placeholders per the task brief).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Implement `goal-inject.mjs`: read `active-goal.json`, render the goal brief, return as `additionalContext`, record the turn. (`.opencode/hooks/goal/devin/goal-inject.mjs`)
- [x] T005 [P] Implement `goal-session-start.mjs`: restore active goal state at session start. (`.opencode/hooks/goal/devin/goal-session-start.mjs`)
- [x] T006 Implement `goal-verify.mjs` at the full tier phase 002 confirmed (verify-and-continue). (`.opencode/hooks/goal/devin/goal-verify.mjs`)
- [x] T007 Register all three adapters in `.devin/hooks.v1.json`. (additive-only diff, `SessionStart`/`UserPromptSubmit`/`Stop` event arrays)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Write co-located `node --test` adapter tests covering inject content, restore behavior, and verify/continue logic. (`goal-devin.test.mjs`, 21/21 pass)
- [x] T009 Run a live `devin -p` smoke session; record the goal brief text actually reaching the model. (transcripts `rainbow-poppyseed.json`, `desert-throne.json` — see implementation-summary.md)
- [x] T010 Document the shipped `Stop` hook parity tier honestly in `implementation-summary.md`.
- [x] T011 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and resolve any errors.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T001-T011)
- [x] No `[B]` blocked tasks remaining (T001/T002 unblocked once phases 001/002 shipped)
- [x] Manual verification passed (adapter test suite green, live `devin -p` smoke proof recorded)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
