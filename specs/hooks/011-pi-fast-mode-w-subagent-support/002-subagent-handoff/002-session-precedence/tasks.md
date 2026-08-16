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
    last_updated_at: "2026-08-16T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Completed precedence tasks; matrix rows verified"
    next_safe_action: "Continue the 002-subagent-handoff workstream"
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
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 2 session-precedence

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T501 Identify and record the Pi flag/argv presence API the wiring depends on — the API that distinguishes an explicitly supplied flag from its boolean default (presence vs value). Evidence: presence via `pi.getFlag("fast")`; wired in `session_start` (`src/index.ts:126-130`).
- [x] T502 Write the complete flag/env/config precedence matrix in `plan.md`. — precedence matrix authored in `plan.md` (6 rows)

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T503 Wire normalized env writes after `/fast` and explicit `--fast`/`--no-fast` state changes (single writer). — `writeHandoff(process.env, config.enabled)` after save (`src/index.ts:111-113`)
- [x] T504 Implement session-start precedence resolution and persist/write ordering; children read only. — `session_start` resolves explicit > `readHandoff` > `config.enabled` (`src/index.ts:126-135`)
- [x] T505 Keep model/target gating authoritative in the request path. — model/target gate unchanged; `tests/payload-status.test.ts` green

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T506 Author `tests/precedence.test.ts` exercising every precedence-matrix row (explicit `--fast` true, explicit `/fast off`, inherited `"1"`, inherited `"0"`, invalid env, unset env). — `tests/precedence.test.ts` covers explicit/inherited rows; `npm test` green
- [x] T507 Run `npm run typecheck` and `npm test`; verify every precedence row, invalid/unset rows, and target-gating negative cases. — `npm run typecheck` exit 0; `npm test` 76 passed
- [x] T508 Record the explicit-false decision for the process child and README owner. — `/fast off` explicit-false decision recorded in `implementation-summary.md`

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
