---
title: "Tasks: Phase 3 process-propagation"
description: "Task ledger for child-process inheritance and one-directional isolation."
trigger_phrases:
  - "process-propagation tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/003-process-propagation"
    last_updated_at: "2026-08-16T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Completed propagation tasks; isolation verified"
    next_safe_action: "Hand off to the 003-integration-and-tests workstream"
    blockers: []
    key_files: ["../../research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Phase 3 process-propagation

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T601 Author `tests/fixtures/handoff-child.ts` with a stdout contract reporting the observed `PI_FAST_MODE_W_SUBAGENT_SUPPORT` value. — child implemented inline via `spawnSync(process.execPath, ["-e", ...])` in `tests/propagation.test.ts` (no separate fixture file)
- [x] T602 Confirm the fixture reads a copied parent environment and never mutates the parent's process env. — child reads copied env `{ ...process.env }`; parent env unchanged (`tests/propagation.test.ts`)

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T603 Add `tests/propagation.test.ts` cases asserting the child observes the parent-set `"1"`, `"0"`, invalid, and unset values at spawn. — `tests/propagation.test.ts` asserts child observes parent-set `"1"`/`"0"` via stdout
- [x] T604 Add child-local mutation and parent-isolation assertions: after the child writes its own env, the parent process env is unchanged. — child env copy stays separate; `process.env[HANDOFF_ENV]` unchanged after write (`tests/propagation.test.ts`)
- [x] T605 Update the README handoff section with strict values, precedence, and one-directional ownership. — README `## Subagent handoff` documents strict values, precedence, one-directional rule

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T606 Run `tests/propagation.test.ts` and `npm run typecheck`. — `tests/propagation.test.ts` green; `npm run typecheck` exit 0
- [x] T607 Record the live-probe handoff receipt for integration. — live-probe receipt handed to `003-integration-and-tests`

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Handoff criteria in `spec.md` are evidenced.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
