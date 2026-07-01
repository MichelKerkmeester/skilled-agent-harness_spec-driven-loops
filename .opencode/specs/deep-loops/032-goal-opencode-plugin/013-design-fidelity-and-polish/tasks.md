---
title: "Tasks: Phase 13: design-fidelity-and-polish [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "design fidelity polish"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/013-design-fidelity-and-polish"
    last_updated_at: "2026-07-01T10:04:53Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Recorded operator decision (wire); unblocked T003, replaced T004"
    next_safe_action: "Run /speckit:implement on this phase"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-032-013"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "REQ-001: operator chose wire-the-detector over collapse-the-enum"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: design-fidelity-and-polish

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
- [x] T001 Read `research/iterations/iteration-006.md` F-003/F-014 for the full trade-off writeup (both forks) (032-goal-opencode-plugin/research/iterations/iteration-006.md)
<!-- agent: direct | deps: [T001] | touched-files: ["032-goal-opencode-plugin/013-design-fidelity-and-polish/implementation-summary.md"] -->
- [x] T002 [P0] Present both usage_limited forks (collapse vs wire) to the operator with the documented trade-offs and get an explicit decision — DECIDED: wire the detector. Record this in implementation-summary.md when filling it in.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- agent: direct | deps: [T002] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T003 [REQ-002] Add a `recordProviderUsageLimit(sessionID, goalID, rawOptions)` function mirroring `recordContinuationBudgetStop` (mk-goal.js:1211), setting `status: 'usage_limited'`, `continuationSuppressed: true`, `continuationSuppressedReason: 'usage_limited'`. Wire it from `recordMessageUpdated` (mk-goal.js:1004): extract the assistant message's `error` field, call it when `error.name === 'APIError' && error.data.statusCode === 429` (.opencode/plugins/mk-goal.js)
<!-- agent: direct | deps: [T003] | touched-files: [".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"] -->
- [x] T004 [REQ-002] Add 2 tests: a `message.updated` event with a synthetic `ApiError`/`statusCode: 429` payload transitions the goal to `usage_limited` + suppresses continuation; a `message.updated` event with a non-429 error (e.g. `ProviderAuthError`, or `ApiError` with a different `statusCode`) does NOT trigger the transition (.opencode/plugins/tests/mk-goal-lifecycle.test.cjs)
<!-- agent: direct | deps: [] | touched-files: ["032-goal-opencode-plugin/001-state-store/", "032-goal-opencode-plugin/002-injection-plugin/", "032-goal-opencode-plugin/003-goal-command/", "032-goal-opencode-plugin/004-lifecycle-tracking/", "032-goal-opencode-plugin/005-completion-supervisor/", "032-goal-opencode-plugin/006-active-continuation/", "032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/", "032-goal-opencode-plugin/008-system-spec-kit-integration/"] -->
- [x] T005 [P] [REQ-003] Recompute real session_dedup.fingerprint values across all 8 original phase docs' frontmatter (032-goal-opencode-plugin/00{1-8}-*/)
<!-- agent: direct | deps: [] | touched-files: ["032-goal-opencode-plugin/006-active-continuation/implementation-summary.md"] -->
- [x] T006 [P] [REQ-004] Downgrade phase 006's completion_pct (100 -> <=90) and align recent_action wording with next_safe_action (032-goal-opencode-plugin/006-active-continuation/implementation-summary.md)
<!-- agent: direct | deps: [] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T007 [P] [REQ-005] Add MK_GOAL_DEBUG-gated logging to fsyncDirectory's currently-silent error swallowing (.opencode/plugins/mk-goal.js)
<!-- agent: direct | deps: [] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T008 [P] [REQ-006] Add a store-health/session-liveness field to goalStateLines (shared by /goal show and mk_goal_status) (.opencode/plugins/mk-goal.js)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- agent: direct | deps: [T003, T004, T007, T008] | touched-files: [] -->
- [x] T009 Run `node --check .opencode/plugins/mk-goal.js` and the full test suite (existing + phase 012's additions + T004's new tests), freshly executed, all exit 0
<!-- agent: direct | deps: [T005] | touched-files: [] -->
- [x] T010 `grep -rn "sha256:0000000000000000000000000000000000000000000000000000000000000000"` across the 8 phase docs — must return zero hits
<!-- agent: direct | deps: [T007, T008] | touched-files: [] -->
- [x] T011 Manually confirm the new store-health field appears in status output and a simulated fsync failure produces a log line under MK_GOAL_DEBUG=1
<!-- agent: direct | deps: [T009, T010, T011] | touched-files: ["032-goal-opencode-plugin/013-design-fidelity-and-polish/implementation-summary.md"] -->
- [x] T012 Fill implementation-summary.md with fresh T009/T010/T011 evidence and the T002 decision record
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Operator's usage_limited decision explicitly recorded (T002) — wire the detector
- [x] Full test suite passes on a fresh run (T009)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../research/iterations/iteration-004.md` (F-010, F-012), `../research/iterations/iteration-006.md` (F-003, F-014), `../research/iterations/iteration-007.md` (F-016, F-017)
<!-- /ANCHOR:cross-refs -->
