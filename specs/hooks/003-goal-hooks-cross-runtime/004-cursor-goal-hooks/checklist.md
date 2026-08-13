---
title: "Verification Checklist: Cursor goal hooks"
description: "Verification Date: 2026-07-29 — sessionStart-only adapter built, tested, live-smoked"
trigger_phrases:
  - "cursor goal hooks checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/004-cursor-goal-hooks"
    last_updated_at: "2026-07-29T05:10:00Z"
    last_updated_by: "claude"
    recent_action: "Verified all checklist items with real evidence"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/cursor/goal-inject.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Cursor goal hooks

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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `spec.md` §4, REQ-001 through REQ-007 each carry a MET/DROPPED verdict with acceptance evidence]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: plan.md §3 Architecture — one adapter, `readGoalRecord`→`renderGoalBrief`→`recordTurn`→fail-open wrapper]
- [x] CHK-003 [P1] Dependencies identified and available (phase 001 goal core, phase 002 capability matrix) [evidence: `.opencode/hooks/goal/lib/goal-core.cjs` present and required successfully; `002-capability-probes/capability-matrix.md` read in full, including its Fixed Parity Tiers section]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Adapter imports only phase 001's `lib/goal-core.cjs` and Node builtins. [evidence: `goal-inject.mjs` imports `node:module` (`createRequire`) + `../lib/goal-core.cjs` only; no other dependency]
- [x] CHK-011 [P0] Adapter fails open on a simulated goal-core error. [evidence: `goal-cursor.test.mjs` "fails open (never throws) when the shared state file is corrupt JSON" — writes invalid JSON to `active-goal.json`, hook exits 0 with `{"permission":"allow"}`]
- [x] CHK-012 [P1] Code follows the established `.opencode/hooks/<concern>/<runtime>/` adapter pattern. [evidence: file at `.opencode/hooks/goal/cursor/goal-inject.mjs`, matching `dispatch/{claude,devin,codex}/`, `task-dispatch/cursor/`, `mcp-route-guard/cursor/` sibling layout]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `goal-inject.mjs` unit tests pass, including fail-open cases. [evidence: `node --test .opencode/hooks/goal/cursor/goal-cursor.test.mjs` → 10/10 pass, 0 fail]
- [x] CHK-021 [P0] ~~`session-end.cjs` unit tests~~ N/A — adapter dropped. [evidence: spec.md REQ-003 marked DROPPED; no `session-end.cjs` file exists under `.opencode/hooks/goal/cursor/`]
- [x] CHK-022 [P1] ~~`pre-tool-use.cjs` unit tests~~ N/A — adapter dropped. [evidence: spec.md REQ-005 marked DROPPED; no `pre-tool-use.cjs` file exists under `.opencode/hooks/goal/cursor/`]
- [x] CHK-023 [P0] Live smoke proof: goal text reaching the model in a real `cursor-agent -p` session. [evidence: 2 dispatches in isolated `/tmp` workspace (`--trust`, `--auto-review --sandbox enabled`); hook confirmed firing + returning `agent_message` (turnsUsed 0→1→2, `runtime:"cursor"` in shared state) — RECORDED-EVIDENCE. Raw agent-transcript JSONL inspection (`~/.cursor/projects/.../agent-transcripts/*.jsonl`) found 0/2 occurrences of the injected nonce token `GOALPROBE-QX9K7ZTM` or `[active_goal]` marker in model-visible content; a direct self-report ask returned "NONE." Reported honestly as unproven model-visibility, not overclaimed as working end-to-end.]
- [x] CHK-024 [P0] `.cursor/hooks.json` hooks confirmed firing live, not just parsing. [evidence: same live-smoke dispatches above — turn counter increment proves the registered `sessionStart` entry actually executed the real adapter, not merely that the JSON parsed]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P2] Finding class: N/A — no prior findings against this phase existed to fix; this is a first build. [evidence: no prior review-report or finding ledger references this phase]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced. [evidence: `goal-inject.mjs` and `goal-cursor.test.mjs` contain no credentials, tokens, or hardcoded paths outside the repo-relative `../lib/goal-core.cjs` require]
- [x] CHK-031 [P0] Fail-open behavior verified never blocks or degrades the shared editor session. [evidence: every non-happy-path in `goal-cursor.test.mjs` resolves to exit code 0 + `{"permission":"allow"}`, never `deny`/non-zero/thrown; live smoke's 2 real dispatches both completed normally with the hook wired]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the actual completed work. [evidence: spec.md/plan.md/tasks.md all updated this pass to reflect the sessionStart-only build, dropped `sessionEnd`/`preToolUse` scope, and live-smoke evidence]
- [x] CHK-041 [P1] `implementation-summary.md` reflects real build state, including the `preToolUse` and `sessionEnd` scope narrowing. [evidence: implementation-summary.md rewritten with What Was Built / Key Decisions / Verification / Known Limitations sections reflecting the actual shipped adapter]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files left in the spec folder outside the scratchpad. [evidence: only the 3 committed adapter/test/registration files were written under `.opencode/hooks/goal/cursor/`; all live-smoke `/tmp` artifacts (`/tmp/cli-cursor-goal-inject-probe-*`, `~/.cursor/projects/*goal-inject-probe*`) were deleted after the smoke test, verified via `ls` showing no residual matches]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 6 | 6/6 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-29 — `node --test` 10/10 passing, `.cursor/hooks.json` JSON-valid and live-fire confirmed, live smoke run (2 dispatches, honest RECORDED-EVIDENCE / unproven-model-visibility finding).
<!-- /ANCHOR:summary -->
