---
title: "Tasks: Phase 2 session-precedence"
description: "Task ledger for lifecycle handoff writes and presence-aware state precedence."
trigger_phrases:
  - "session-precedence tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/002-session-precedence"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created lifecycle precedence task ledger"
    next_safe_action: "Execute T501"
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
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 2 session-precedence

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T501 Identify and record the Pi flag/argv presence API the wiring depends on — the API that distinguishes an explicitly supplied flag from its boolean default (presence vs value).
- [ ] T502 Write the complete flag/env/config precedence matrix in `plan.md`.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T503 Wire normalized env writes after `/fast` and explicit `--fast`/`--no-fast` state changes (single writer).
- [ ] T504 Implement session-start precedence resolution and persist/write ordering; children read only.
- [ ] T505 Keep model/target gating authoritative in the request path.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T506 Author `tests/precedence.test.ts` exercising every precedence-matrix row (explicit `--fast` true, explicit `/fast off`, inherited `"1"`, inherited `"0"`, invalid env, unset env).
- [ ] T507 Run `npm run typecheck` and `npm test`; verify every precedence row, invalid/unset rows, and target-gating negative cases.
- [ ] T508 Record the explicit-false decision for the process child and README owner.

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
