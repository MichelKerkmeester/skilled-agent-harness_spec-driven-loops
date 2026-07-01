---
title: "Tasks: mk-deep-loop-guard Loop-Detection + Identity-Resolution Hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "mk-deep-loop-guard hardening implementation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/017-loop-guard-implementation"
    last_updated_at: "2026-07-01T21:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 14 tasks complete; validate.sh --strict passing"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-017-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: mk-deep-loop-guard Loop-Detection + Identity-Resolution Hardening

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

- [x] T001 Re-read `mk-goal.js` directly to confirm the atomic-write pattern (temp file suffixed `.{pid}.{timestamp}.tmp`, `writeFileSync`, `renameSync`) this phase's `writeLoopStateAtomic()` follows.
- [x] T002 Re-read `orchestrate.md`'s Priority table + dispatch template directly to confirm every row sets `subagent_type: "general"` and the real identity travels via `Agent: @X` / `Deep Route: ... target_agent=@X` prompt text.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implemented `resolveTargetIdentity(subagentType, promptText)` in `.opencode/plugins/mk-deep-loop-guard.js`: parses `target_agent=@X` first, then `Agent: @X`, then falls back to raw `subagentType` only when it isn't the literal `"general"` placeholder.
- [x] T004 Rewired Check 1 (mode-mismatch) to call `registry.get(resolveTargetIdentity(...))` instead of `registry.get(args.subagent_type)`, fixing the silent no-op on real `orchestrate`-routed dispatches.
- [x] T005 Implemented Check 2 (loop-repeat): `sessionStateKey()`, `loopStatePath()`, `readLoopState()`, `writeLoopStateAtomic()`, `recordLoopDispatch()`, `loopRepeatDetail()` — session-scoped state at `.opencode/skills/.loop-guard-state/{hex(sessionID)}.json`.
- [x] T006 Wired `ITERATION_MARKER_REGEX` (`Iteration: N of M` / `STATE SUMMARY`) as the command-driven exemption; only non-command-driven dispatches increment the counter.
- [x] T007 Wired threshold logic: 1st non-command-driven hand-off silent, 2nd+ warn via `console.error`, 3rd+ additionally throws when `MK_DEEP_LOOP_GUARD_REJECT_LOOP=1`.
- [x] T008 Self-caught and fixed two real bugs before running any test: an erroneous `new Date(0)` placeholder timestamp (should be `new Date().toISOString()`), and a double `"mk-deep-loop-guard:"` prefix in the loop-repeat throw message (matched against the existing single-prefix mode-mismatch pattern).
- [x] T009 Ran `check-comment-hygiene.sh` on the rewritten plugin; caught and fixed one violation (a JSDoc line referencing "phase 016 research Open Questions" — rewritten to state the durable technical limitation without the spec-path reference).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Ran the original 8-scenario hermetic test file unmodified after the rewrite: all 8 pass (no regression).
- [x] T011 Extended `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` with identity-resolution (Deep Route, `Agent:` line, unresolvable no-op), loop-repeat threshold (1st/2nd/3rd, warn vs. `MK_DEEP_LOOP_GUARD_REJECT_LOOP`), command-driven exemption, non-loop-executor exemption, cross-session isolation, and fail-open (state-dir path collision) scenarios.
- [x] T012 Fixed two bugs surfaced while getting the extended suite to pass cleanly: a duplicate `let warned` declaration colliding with the pre-existing mode-mismatch test's variable (renamed the reuse to a plain reassignment), and a stale `.loop-guard-state` directory left over from an earlier test block that broke the fail-open fixture's `writeFileSync` (fixed by `rmSync`-ing the path before writing the blocking file). Full suite now exits 0: "all assertions passed".
- [x] T013 Ran `check-comment-hygiene.sh` on the test file (clean) and `verify_alignment_drift.py --root .opencode/plugins` (PASS, 0 findings across 13 scanned files).
- [x] T014 Live re-verification against the real installed `opencode` v1.17.11: dispatched `opencode run --agent general --dangerously-skip-permissions "Use the task tool..."` with a prompt requesting a Task dispatch containing `Agent: @ai-council` + a deliberately mismatched `mode=research`, with `MK_DEEP_LOOP_GUARD_REJECT=1` set. The calling agent set `subagent_type="ai-council"` directly (not the literal `"general"`), exercising `resolveTargetIdentity()`'s `subagentType !== "general"` fallback branch under real host conditions. Result: `[Error: mk-deep-loop-guard: Deep Route mode mismatch -- dispatch targets subagent_type="ai-council" ...]`, the outer `task` tool call status became `"error"` ("Run requested agent failed"), and the agent's own reply reported "Tool call failed: deep-loop guard reported a mode mismatch." Confirmed the throw-blocks-dispatch mechanism has zero regression post-rewrite. Confirmed no `.loop-guard-state/` file was created for this `ai-council` dispatch (correctly excluded — not a `LOOP_EXECUTOR_AGENTS` member).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Hermetic suite passes with 0 regressions and full new-scenario coverage (T010-T012).
- [x] Live re-verification confirms no regression in the pre-existing mode-mismatch + reject mechanism, exercising a new code path (T014).
- [x] Comment hygiene and alignment drift both clean (T009, T013).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Predecessor**: `../016-mk-deep-loop-guard-hardening/` (research + design options)
- **Original plugin**: `../011-deep-route-guard-plugin/`
<!-- /ANCHOR:cross-refs -->

---
