---
title: "Tasks: Phase 14: goal-state-cleanup-and-archive"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "goal state cleanup"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/014-goal-state-cleanup-and-archive"
    last_updated_at: "2026-07-01T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks for the goal-state cleanup/archive finding"
    next_safe_action: "Run /speckit:implement on this phase"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:373a1456c5d1f6b0dfab5b9836194ec533f0c12f1154cdbd4e80413161f2d6b0"
      session_id: "scaffold-032-014"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 14: goal-state-cleanup-and-archive

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

<!-- agent: direct | deps: [] | touched-files: [] -->
- [x] T001 Re-read `deleteGoalFile`, `ensureGoalStateDir`, `flushVolatileLocks`, and the `session.deleted`/`session.created` branches in `handleEvent` to confirm exact current line numbers and signatures (.opencode/plugins/mk-goal.js)
<!-- agent: direct | deps: [T001] | touched-files: [] -->
- [x] T002 Run the existing 6-file test suite once as a pre-change baseline: `for f in .opencode/plugins/tests/mk-goal-*.test.cjs; do node "$f"; echo "exit: $?"; done` — all should exit 0 (.opencode/plugins/tests/*.test.cjs)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T003 [REQ-001] Add `archiveGoalStateFile(sessionID, rawOptions)`: move (via `rename`, already imported) the session's state file into `.goal-state/.archive/` (creating it via `mkdir(..., {recursive: true, mode: 0o700})` if needed); ENOENT-tolerant (no error if the file doesn't exist), mirroring `deleteGoalFile`'s try/catch shape (.opencode/plugins/mk-goal.js)
<!-- agent: direct | deps: [T003] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T004 [REQ-002] Add `pruneArchive(rawOptions)`: list `.archive/` entries, unlink any whose mtime exceeds `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS` (new env var, default 90); call it at the end of `archiveGoalStateFile` (.opencode/plugins/mk-goal.js)
<!-- agent: direct | deps: [T003, T004] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T005 [REQ-001] Wire `archiveGoalStateFile` into the `session.deleted` branch of `handleEvent`, alongside the existing `flushVolatileLocks(sessionID)` call (.opencode/plugins/mk-goal.js)
<!-- agent: direct | deps: [T003] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T006 [REQ-003] Add `sweepOrphanedActiveStates(rawOptions, runtimeState)`: list active `.goal-state/*.json` entries (excluding `.archive/`), archive (via `archiveGoalStateFile`) any whose stored `updatedAtMs` exceeds `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS` (new env var, default 30); throttle via a new `runtimeState.lastSweepAtMs` timestamp checked against `MK_GOAL_STATE_SWEEP_INTERVAL_MS` (new env var, default 3600000ms) (.opencode/plugins/mk-goal.js)
<!-- agent: direct | deps: [T006] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T007 [REQ-003] Wire the throttled `sweepOrphanedActiveStates` call into the `session.created` branch of `handleEvent`, alongside the existing `restoreActiveGoal` call (.opencode/plugins/mk-goal.js)
<!-- agent: direct | deps: [T005, T007] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T008 [REQ-004] Wrap the new archive/prune/sweep calls in fail-open try/catch at their `session.deleted`/`session.created` call sites so a failure never throws out of `plugin.event()` (.opencode/plugins/mk-goal.js)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- agent: direct | deps: [T008] | touched-files: [".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"] -->
- [x] T009 [P] Add a test: `session.deleted` on a session with an existing state file results in the file moving from `.goal-state/` to `.goal-state/.archive/`; a session with no state file produces no error (.opencode/plugins/tests/mk-goal-lifecycle.test.cjs)
<!-- agent: direct | deps: [T008] | touched-files: [".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"] -->
- [x] T010 [P] Add a test: archive entries with a synthetic old mtime (beyond `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`) get pruned; entries within the window survive (.opencode/plugins/tests/mk-goal-lifecycle.test.cjs)
<!-- agent: direct | deps: [T008] | touched-files: [".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"] -->
- [x] T011 [P] Add a test: an active state file with a synthetic old `updatedAtMs` (beyond `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`) gets archived on a due `session.created` sweep; a recent active state survives (.opencode/plugins/tests/mk-goal-lifecycle.test.cjs)
<!-- agent: direct | deps: [T008] | touched-files: [".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"] -->
- [x] T012 [P] Add a test: a second `session.created` fired inside `MK_GOAL_STATE_SWEEP_INTERVAL_MS` of the first does not re-scan the active directory (assert on a call/scan counter, not wall-clock timing) (.opencode/plugins/tests/mk-goal-lifecycle.test.cjs)
<!-- agent: direct | deps: [T009, T010, T011, T012] | touched-files: [] -->
- [x] T013 Run `node --check .opencode/plugins/mk-goal.js` and the full test suite (existing 6 + phase 012's additions + T009-T012's new tests), freshly executed, all exit 0
<!-- agent: direct | deps: [T013] | touched-files: ["032-goal-opencode-plugin/014-goal-state-cleanup-and-archive/implementation-summary.md"] -->
- [x] T014 Fill `implementation-summary.md` with fresh T013 evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Full test suite (existing + new) passes on a fresh run (T013)
- [x] Each new requirement (REQ-001 through REQ-004) has a dedicated passing test
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: operator-reported during this session, not from either completed audit
<!-- /ANCHOR:cross-refs -->
