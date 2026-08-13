---
title: "Verification Checklist: Pi goal extension (input-transform injection, session_start restore, turn-end verify)"
description: "Verification Date: pending — phase not yet implemented"
trigger_phrases:
  - "pi goal extension checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/005-pi-goal-hooks"
    last_updated_at: "2026-07-29T04:40:00Z"
    last_updated_by: "claude"
    recent_action: "Verified all checklist items with live evidence"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/pi/goal-context.ts"
      - ".pi/extensions/goal-context.ts"
      - ".opencode/hooks/goal/pi/goal-pi.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-005-pi-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi goal extension (input-transform injection, session_start restore, turn-end verify)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `spec.md` §4 REQ-001..007, Status: Complete]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: `plan.md` §3 Architecture, §4 Implementation Phases, all phases checked]
- [x] CHK-003 [P1] Dependencies identified and available (phase 001 goal core, phase 002 capability matrix, `cli-pi`) [evidence: `.opencode/hooks/goal/lib/goal-core.cjs` present; `002-capability-probes/capability-matrix.md` published; `pi --version` → `0.82.1`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `goal-context.ts` imports only phase 001's goal core; no duplicated state/render/hardening logic. [evidence: `goal-context.ts` dynamic-imports `../../.opencode/hooks/goal/lib/goal-core.cjs` in each handler; no local state read/write/hardening/verifier logic]
- [x] CHK-011 [P0] `.pi/extensions/goal-context.ts` is a relative symlink resolving to the real file at `.opencode/hooks/goal/pi/goal-context.ts`. [evidence: `ls -la .pi/extensions/goal-context.ts` → `-> ../../.opencode/hooks/goal/pi/goal-context.ts`; `os.path.realpath` confirms the real file]
- [x] CHK-012 [P0] All in-file imports resolve correctly against the symlink's directory (not its realpath), per the proven precedent. [evidence: live Pi session loaded the extension with zero import errors — see CHK-021 transcript evidence; `os.path.normpath` confirms `../../.opencode/hooks/goal/lib/goal-core.cjs` resolves from `.pi/extensions/`]
- [x] CHK-013 [P1] Git history preserved on the real file (no delete+add masquerading as a move). [evidence: `git log --follow -- .opencode/hooks/goal/pi/goal-context.ts` returns empty — the file is net-new this phase (never committed before), so there is no prior history to lose]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Co-located `node --test` suite passes for `goal-context.ts`'s state/render/import logic. [evidence: `node --test .opencode/hooks/goal/pi/goal-pi.test.mjs` → `# tests 13 / # pass 13 / # fail 0`]
- [x] CHK-021 [P0] Live smoke proof (`pi --offline -p`) shows the `[active_goal]` brief visibly present in the chat transcript. [evidence: `pi --offline --approve -p "what is my current active goal, if any?"` under an isolated `MK_GOAL_STATE_DIR`+`--session-dir`; the persisted session `.jsonl` transcript's first `role:"user"` message body is `what is my current active goal, if any?\n\n[active_goal:goal-e8ec18af-...]...status: active...objective: Ship the cross-runtime goal hook...[/active_goal]`; the model's reply explicitly cites "the `[active_goal:...]` block at the top of this turn" as its source and states the objective verbatim. Zero extension-load errors (session progressed through 28 transcript lines / multiple turns and tool calls).]
- [x] CHK-022 [P1] Live `session_start` restore verified with pre-existing active-goal state. [evidence: same transcript, line 3 — a `custom_message` with `customType:"goal-context-restore"` carrying the full `[active_goal]` block fired automatically at session start, before the first user turn]
- [x] CHK-023 [P1] Turn-end verify tested since phase 002 confirmed `turn_end`/`agent_end`/`agent_settled`. [evidence: same transcript — 5 `custom_message` entries with `customType:"goal-verify-nudge"` (`verdict=not-met`/`unclear`, reasons from the heuristic verifier) fired across 5 turn ends; the goal record's `turnsUsed` advanced from 0 to 5 via `recordTurn`. The handler never blocked or re-queued a turn — the session's continued activity was the model's own tool-use loop, not a forced continuation, confirming the "observe-only, void-returning" cap is real, not theoretical]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] Finding class: this phase is a `net-new adapter`, not a fix to an existing consumer. [evidence: `.opencode/hooks/goal/pi/` did not exist before this phase]
- [x] CHK-FIX-002 [P1] Consumer inventory: the only consumer of the symlink target is Pi's own fixed auto-discovery directory (`.pi/extensions/`); no other runtime or config references this file. [evidence: `grep -rn "goal-context" .opencode .pi .devin .cursor .codex .claude` (outside this phase's own files) returns no other reference]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials introduced by the extension or its symlink. [evidence: `goal-context.ts` contains no hardcoded credentials/tokens; it only reads goal-core's own `redactEvidence`/`sanitize*`-hardened state]
- [x] CHK-031 [P0] Shared active-goal state file read/write hygiene (0600, atomic temp+rename) preserved via phase 001's core, not re-implemented insecurely here. [evidence: all reads/writes go through `core.readGoalRecord`/`core.recordTurn`, which call phase 001's `writeJsonAtomic` (mode 0600, temp+fsync+rename); `goal-context.ts` performs zero direct `fs` calls]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md/plan.md/tasks.md synchronized with the actual completed work once implemented. [evidence: `spec.md` Status=Complete, all REQs/open-questions resolved; `plan.md` all Definition of Ready/Done + phase checkboxes `[x]`; `tasks.md` T001-T011 all `[x]`, matching the actual delivered files and live-smoke results]
- [x] CHK-041 [P1] `implementation-summary.md` honestly states whether turn-end verify shipped or was omitted per phase 002's verdict. [evidence: `implementation-summary.md` §Verification + §Known Limitations #1 state turn-end verify shipped, observe/record-only, and explicitly cannot force continuation since `turn_end`/`agent_end`/`agent_settled` are `void`-returning]
- [x] CHK-042 [P1] All touched/new documentation in this folder reports 0 issues via `validate_document.py`. [evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/hooks/003-goal-hooks-cross-runtime/005-pi-goal-hooks --strict` → `Summary: Errors: 0  Warnings: 0` / `RESULT: PASSED`; parent packet recursive validate also `Errors: 0  Warnings: 0` across all 8 phase children]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files left in the repo outside the scratchpad. [evidence: live-smoke goal state and Pi session dir were created under the session scratchpad only (`/private/tmp/claude-.../scratchpad/goal-state-smoke`, `.../pi-sessions-smoke`); the shared real `.opencode/skills/.goal-state/` tree shows `goal_present=false` — no leftover record]
- [x] CHK-051 [P1] Only `.opencode/hooks/goal/pi/goal-context.ts` (+ tests) and the single `.pi/extensions/goal-context.ts` symlink are added by this phase — no unrelated extension touched. [evidence: `git status --short .opencode/hooks/goal/ .pi/extensions/` shows this phase's own additions (`.opencode/hooks/goal/pi/goal-context.ts`, `.opencode/hooks/goal/pi/goal-pi.test.mjs`, `.pi/extensions/goal-context.ts`) untouched by any edit of mine; `.opencode/hooks/goal/devin/` and `.opencode/hooks/goal/cursor/` also appear untracked — those are sibling phases 003/004 being built concurrently by other sessions, out of this phase's scope and not created or modified by this work]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
