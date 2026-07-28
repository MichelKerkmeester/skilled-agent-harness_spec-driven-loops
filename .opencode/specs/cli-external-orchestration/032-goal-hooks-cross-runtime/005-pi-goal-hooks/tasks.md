---
title: "Tasks: Pi goal extension (input-transform injection, session_start restore, turn-end verify)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi goal extension tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/005-pi-goal-hooks"
    last_updated_at: "2026-07-28T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Authored task list for the Pi goal extension"
    next_safe_action: "Await phase 001 and phase 002 completion before starting T001"
    blockers:
      - "Blocked on phase 001 (goal core) and phase 002 (capability matrix)."
    key_files:
      - ".opencode/hooks/goal/pi/goal-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-005-pi-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Pi goal extension (input-transform injection, session_start restore, turn-end verify)

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

- [ ] T001 [B] Confirm phase 001's `goal-core.cjs` API surface is stable (read/write/render/hardening/verifier exports). (`.opencode/hooks/goal/lib/goal-core.cjs`)
- [ ] T002 [B] Confirm phase 002's capability-matrix verdict on Pi's turn-end/agent-loop event. (`.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/002-capability-probes/`)
- [ ] T003 Re-confirm the symlink-resolution precedent (real file outside `.pi/extensions/`, imports resolved against the symlink path) still holds for the installed Pi version. [evidence: precedent `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/tasks.md` T042-T044]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author `.opencode/hooks/goal/pi/goal-context.ts`: import phase 001's goal core, implement the `input` transform injection handler with the parameterized "Focused Pi execution agent…" Role line.
- [ ] T005 Implement the `session_start` restore handler in `goal-context.ts`.
- [ ] T006 [B] If T002 confirmed a usable turn-end event: implement the gated turn-end verify handler wrapping the ported heuristic verifier. If not: add an explicit code comment recording the honest absence and skip to T007.
- [ ] T007 Create the relative symlink `.pi/extensions/goal-context.ts` -> `../../.opencode/hooks/goal/pi/goal-context.ts`; write all in-file imports for the `.pi/extensions/` base path per T003's confirmed semantics.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Co-located `node --test` suite for `goal-context.ts`: state read/render logic, symlink-relative import resolution.
- [ ] T009 Live smoke proof: `pi --offline -p` (or `pi -p` if offline mode is unsuitable) with an active goal set, confirming the `[active_goal]` brief appears in the visible chat transcript.
- [ ] T010 Live `session_start` restore check: start a fresh Pi session with pre-existing active-goal state and confirm the goal is restored without operator re-entry.
- [ ] T011 Run `validate.sh --strict` on this phase folder; fix any Errors and re-run until Errors: 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T001-T011)
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (live Pi injection + restore smoke tests, `node --test` suite, `validate.sh --strict`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: `.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/spec.md`
- **Symlink-resolution precedent**: `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/tasks.md` T042-T044
<!-- /ANCHOR:cross-refs -->
