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
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created process propagation task ledger"
    next_safe_action: "Execute T601"
    blockers: []
    key_files: ["../../research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T601 Author `tests/fixtures/handoff-child.ts` with a stdout contract reporting the observed `PI_FAST_MODE_W_SUBAGENT_SUPPORT` value.
- [ ] T602 Confirm the fixture reads a copied parent environment and never mutates the parent's process env.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T603 Add `tests/propagation.test.ts` cases asserting the child observes the parent-set `"1"`, `"0"`, invalid, and unset values at spawn.
- [ ] T604 Add child-local mutation and parent-isolation assertions: after the child writes its own env, the parent process env is unchanged.
- [ ] T605 Update the README handoff section with strict values, precedence, and one-directional ownership.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T606 Run `tests/propagation.test.ts` and `npm run typecheck`.
- [ ] T607 Record the live-probe handoff receipt for integration.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remain.
- [ ] Handoff criteria in `spec.md` are evidenced.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
