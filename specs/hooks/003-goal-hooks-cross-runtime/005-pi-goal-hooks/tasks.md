---
title: "Tasks: Pi goal extension (input-transform injection, session_start restore, turn-end verify)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi goal extension tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/005-pi-goal-hooks"
    last_updated_at: "2026-07-29T04:40:00Z"
    last_updated_by: "claude"
    recent_action: "Completed T001-T011, all verification evidence live"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/pi/goal-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-005-pi-20260729"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Confirmed phase 001's `goal-core.cjs` API surface is stable (read/write/render/hardening/verifier exports). (`.opencode/hooks/goal/lib/goal-core.cjs`)
- [x] T002 Confirmed phase 002's capability-matrix verdict on Pi's turn-end/agent-loop event: `turn_end`/`agent_end`/`agent_settled` all confirmed, all `void`-returning. (`.opencode/specs/hooks/003-goal-hooks-cross-runtime/002-capability-probes/capability-matrix.md`)
- [x] T003 Re-confirmed the symlink-resolution precedent: `../../.opencode/hooks/goal/lib/goal-core.cjs` written for the `.pi/extensions/` base resolves correctly (verified with `os.path.normpath`), and the same depth pattern is already live in `.opencode/hooks/mcp-route-guard/pi/mcp-route-guard.ts`. [evidence: precedent `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/tasks.md` T042-T044]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Authored `.opencode/hooks/goal/pi/goal-context.ts`: imports phase 001's goal core, implements the `input` transform injection handler with the parameterized "Focused Pi execution agent…" Role line.
- [x] T005 Implemented the `session_start` restore handler in `goal-context.ts`.
- [x] T006 T002 confirmed a usable turn-end event; implemented the gated `turn_end` verify handler wrapping the ported heuristic verifier — observe/record only (`recordTurn` + optional `pi.sendMessage` nudge), no forced continuation since the handler is `void`-returning.
- [x] T007 Created the relative symlink `.pi/extensions/goal-context.ts` -> `../../.opencode/hooks/goal/pi/goal-context.ts`; all in-file imports written for the `.pi/extensions/` base path per T003's confirmed semantics.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Co-located `node --test` suite for `goal-context.ts` (`goal-pi.test.mjs`): render selection (active/none/paused), `isPluginDisabled`, heuristic verifier verdicts, factory export/registration shape, fail-open contract — 13/13 pass.
- [x] T009 Live smoke proof: `pi --offline --approve -p "what is my current active goal, if any?"` with an active goal set. Session transcript shows the `[active_goal]` brief appended to the persisted `role:"user"` message and the model's reply explicitly citing "the `[active_goal:...]` block at the top of this turn" as its source.
- [x] T010 Live `session_start` restore check: the same session's transcript shows a `goal-context-restore` custom message carrying the full `[active_goal]` block, fired automatically at session start before any user turn.
- [x] T011 Ran `validate.sh --strict` on this phase folder and the parent packet: Errors 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T001-T011)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (live Pi injection + restore smoke tests, `node --test` suite, `validate.sh --strict`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: `.opencode/specs/hooks/003-goal-hooks-cross-runtime/spec.md`
- **Symlink-resolution precedent**: `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/tasks.md` T042-T044
<!-- /ANCHOR:cross-refs -->
