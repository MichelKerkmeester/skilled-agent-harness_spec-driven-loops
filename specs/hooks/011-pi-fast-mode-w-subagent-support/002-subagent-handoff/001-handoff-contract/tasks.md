---
title: "Tasks: Phase 1 handoff-contract"
description: "Task ledger for the strict fast-mode handoff environment contract."
trigger_phrases:
  - "handoff-contract tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/001-handoff-contract"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created handoff contract tasks"
    next_safe_action: "Execute T401"
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

# Tasks: Phase 1 handoff-contract

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T401 Grep `PI_*` names across installed packages, pinned sources, and user `.pi` (baseline ~25 occupied, research Section 6); record that no `PI_FAST_MODE*` exists, so `PI_FAST_MODE_W_SUBAGENT_SUPPORT` is collision-free.
- [ ] T402 Confirm the parent-write/child-read ownership rule; document the POLICY here and defer its wiring to `002-session-precedence`.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T403 Add the `HANDOFF_ENV` key constant (value `PI_FAST_MODE_W_SUBAGENT_SUPPORT`) to `src/types.ts`; create strict `readHandoff`/`writeHandoff` helpers in `src/handoff.ts` mirroring `context/pi-gpt-fast-mode/src/handoff.ts:1-19`.
- [ ] T404 [P] Add pure Vitest cases in `tests/handoff.test.ts`: `"1"` → true, `"0"` → false, unset → undefined, `"true"`/`"2"`/`""` → undefined, and writer emits exact `"1"`/`"0"`.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T405 Run `tests/handoff.test.ts` under raw-TS Vitest and `npm run typecheck` (exit 0).
- [ ] T406 Record the contract handoff receipt for `002-session-precedence`: parse matrix and parent-only ownership with evidence.

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
