---
title: "Tasks: Cursor goal hooks"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cursor goal hooks tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/004-cursor-goal-hooks"
    last_updated_at: "2026-07-28T20:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec, plan, tasks, checklist, implementation-summary"
    next_safe_action: "Wait for phase 002's capability matrix before starting Phase 1"
    blockers:
      - "Depends on phase 002's capability-probe matrix for the preToolUse refresh cadence decision."
    key_files:
      - ".opencode/hooks/goal/cursor/session-start.cjs"
      - ".cursor/hooks.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Cursor goal hooks

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

- [ ] T001 [B] Confirm phase 001's `lib/goal-core.cjs` API surface by reading the shipped module. (`.opencode/hooks/goal/lib/goal-core.cjs`)
- [ ] T002 [B] Read phase 002's capability matrix for the Cursor `preToolUse` cadence finding. (`.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/002-capability-probes/`)
- [ ] T003 Read the current `.cursor/hooks.json` schema and confirm the hook-entry shape expected. (`.cursor/hooks.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build `session-start.cjs`: prebind-style injection rendering the parameterized `[active_goal]` block, wrapped fail-open. (`.opencode/hooks/goal/cursor/session-start.cjs`)
- [ ] T005 Build `session-end.cjs`: ported heuristic verifier against shared state, wrapped fail-open. (`.opencode/hooks/goal/cursor/session-end.cjs`)
- [ ] T006 [B] Build `pre-tool-use.cjs` only if phase 002 confirms cadence support; otherwise skip and document the narrowing. (`.opencode/hooks/goal/cursor/pre-tool-use.cjs`)
- [ ] T007 Register all built adapters in `.cursor/hooks.json`. (`.cursor/hooks.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 [P] Co-located `node --test` for `session-start.cjs`, including a forced-error fail-open case. (`.opencode/hooks/goal/cursor/session-start.test.cjs`)
- [ ] T009 [P] Co-located `node --test` for `session-end.cjs`, including a met-goal and unmet-goal case plus a fail-open case. (`.opencode/hooks/goal/cursor/session-end.test.cjs`)
- [ ] T010 [P] Co-located `node --test` for `pre-tool-use.cjs` if built. (`.opencode/hooks/goal/cursor/pre-tool-use.test.cjs`)
- [ ] T011 Live smoke proof: goal text reaching the model via `cursor-agent -p`, or an editor session if CLI auth is unavailable (documented honestly).
- [ ] T012 Confirm `.cursor/hooks.json` hooks actually fire live, not just parse.
- [ ] T013 Update `spec.md`, `checklist.md`, and `implementation-summary.md` with real evidence from T008-T012.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All adapter unit tests passing, including fail-open cases
- [ ] Live smoke proof recorded
- [ ] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
