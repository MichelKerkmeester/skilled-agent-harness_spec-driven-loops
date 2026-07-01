---
title: "Tasks: Phase 12: regression-test-backfill [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "regression test backfill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/012-regression-test-backfill"
    last_updated_at: "2026-07-01T10:04:52Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks from deep-review + deep-research findings"
    next_safe_action: "Run /speckit:implement on this phase (after 010/011 land)"
    blockers:
      - "Depends on phases 010 and 011 landing first"
    key_files:
      - ".opencode/plugins/__tests__/mk-goal-state.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-032-012"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: regression-test-backfill

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
- [B] T001 Confirm phases 010 and 011 have landed (check their implementation-summary.md for fresh passing evidence) — BLOCKED until both phases close (032-goal-opencode-plugin/010-security-and-correctness-fixes/implementation-summary.md, 032-goal-opencode-plugin/011-command-surface-normalization/implementation-summary.md)
<!-- agent: direct | deps: [T001] | touched-files: [] -->
- [ ] T002 Re-read the current live mk-goal.js factory/event/tool-registration code (~lines 1513-1676) to confirm calling conventions (.opencode/plugins/mk-goal.js)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/__tests__/mk-goal-state.test.cjs"] -->
- [ ] T003 [F-018] Add a test that calls the plugin factory, invokes the real experimental.chat.system.transform hook, and asserts on output.system (.opencode/plugins/__tests__/mk-goal-state.test.cjs)
<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/__tests__/mk-goal-state.test.cjs"] -->
- [ ] T004 [P] [DR-009-P1-002] Add an assertion for the RICCE metadata field/behavior from phase 010's REQ-005 (.opencode/plugins/__tests__/mk-goal-state.test.cjs)
<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs"] -->
- [ ] T005 [F-021] Add tests for session.created, message.updated, permission/question asked+replied, session.deleted, *.disposed via real plugin.event() calls (.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs)
<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/__tests__/mk-goal-continuation.test.cjs"] -->
- [ ] T006 [F-013] Add an autonomy:'smoke' + active-goal integration test firing session.idle and asserting a would_fire/smoke_mode row in .continuation.log (.opencode/plugins/__tests__/mk-goal-continuation.test.cjs)
<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/__tests__/mk-goal-continuation.test.cjs"] -->
- [ ] T007 [P] [DR-003 / DR-009-P1-001] Add a stale-verifier/continuation integration test pinning phase 010's REQ-004 fix (.opencode/plugins/__tests__/mk-goal-continuation.test.cjs)
<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/__tests__/mk-goal-state.test.cjs"] -->
- [ ] T008 [P] [DR-001, DR-005, DR-006 / DR-009-P1-001] Add 3 regression tests pinning phase 010's injection-clamp, sanitizer-hardening, and redaction fixes (.opencode/plugins/__tests__/mk-goal-state.test.cjs)
<!-- agent: direct | deps: [T005] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [ ] T009 [F-019] If needed to make the error path observable/testable, add minimal MK_GOAL_DEBUG-gated logging to the event() catch block, then assert on it (.opencode/plugins/mk-goal.js)
<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/__tests__/mk-goal-export-contract.test.cjs"] -->
- [ ] T010 [P] [F-020] Replace the truthy-only __test contract check with assert.deepEqual on the sorted full key list (.opencode/plugins/__tests__/mk-goal-export-contract.test.cjs)
<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/__tests__/mk-goal-tool-path.test.cjs"] -->
- [ ] T011 [P] [F-022] Add a test invoking plugin.tool.mk_goal.execute directly via the factory-returned hooks (.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs)
<!-- agent: direct | deps: [] | touched-files: [".opencode/plugins/__tests__/mk-goal-tool-path.test.cjs"] -->
- [ ] T012 [P] [DR-009-P1-003 / DR-009-P2-001] Add a command/overlay-doc contract test and a phase graph-metadata key_files drift check (.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- agent: direct | deps: [T003, T004, T005, T006, T007, T008, T009, T010, T011, T012] | touched-files: [] -->
- [ ] T013 Run the full test suite (existing + new) freshly: `for f in .opencode/plugins/__tests__/mk-goal-*.test.cjs; do node "$f"; echo "exit: $?"; done` — all must exit 0
<!-- agent: direct | deps: [T013] | touched-files: [] -->
- [ ] T014 SC-002 spot-check: temporarily revert ONE phase-010 fix locally, confirm the corresponding new test (T007 or T008) fails, then restore the fix and re-confirm the suite passes
<!-- agent: direct | deps: [T014] | touched-files: ["032-goal-opencode-plugin/012-regression-test-backfill/implementation-summary.md"] -->
- [ ] T015 Fill implementation-summary.md with fresh T013/T014 evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (T001 must clear before this phase can complete)
- [ ] Full suite (existing + new) passes on a fresh run (T013)
- [ ] At least one new test verified capable of failing (T014)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../review/review-report.md` §3 (DR-009 cluster); `../research/iterations/iteration-00{5,7,8}.md` (F-013, F-018 through F-022)
<!-- /ANCHOR:cross-refs -->
