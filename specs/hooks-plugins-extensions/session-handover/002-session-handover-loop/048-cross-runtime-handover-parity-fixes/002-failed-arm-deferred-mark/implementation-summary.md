---
title: "Implementation Summary: Phase 2: failed-arm-deferred-mark"
description: "A hand-over that Codex, Pi or OpenCode cannot arm is now marked, so the operator's next prompt withdraws it instead of leaving it to relaunch later from an out-of-date note."
trigger_phrases:
  - "failed arm deferred mark implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/002-failed-arm-deferred-mark"
    last_updated_at: "2026-11-15T21:25:54Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the deferred mark on Codex, Pi and OpenCode"
    next_safe_action: "Commit worktree 420 and merge it to main"
    packet_purpose: "Purpose: On every looped runtime, a hop that could not arm is called off by the operator's next prompt."
    blockers: []
    key_files:
      - ".skilled/hooks/session-handover/codex/stop-arm.mjs"
      - ".skilled/hooks/session-handover/pi/session-handover.ts"
      - ".opencode/plugins/session-handover.js"
    session_dedup:
      fingerprint: "sha256:22b0fe35dd338c84c267be9afb7952458c69cc73b7bbd4e00cea804d2b2a7cee"
      session_id: "scaffold-002-failed-arm-deferred-mark"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "b726ec67-1d85-4833-b219-c038e184d696"
      workspace: "/Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes"
      savedAt: "2026-11-15T21:25:54Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 2: failed-arm-deferred-mark

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-failed-arm-deferred-mark |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When Codex, Pi or OpenCode reaches the end of a turn but cannot arm the prepared hand-over, the record is now stamped deferred, and the operator's next prompt withdraws it. Before, the record waited unmarked, and a later turn end could relaunch the session from a note that no longer matched the work.

### Phase 2: failed-arm-deferred-mark

On Codex, the Stop hook has three ways to fail: no transcript path, no session process below the loop, or an arm that throws. Each now stamps `deferredAt` and prints one `systemMessage` that names the cause and says the next prompt withdraws the hand-over. On Pi and OpenCode, an arm that throws at `agent_settled` or `session.idle` is now caught, logged and stamped. The new-turn withdraw on all three runtimes uses the shared helper's default policy. That policy withdraws an armed record or a deferred one, and still leaves alone a prepared record no arm event has reached yet. Claude and Vibe already behaved this way.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-handover/codex/stop-arm.mjs` | Modified | Mark and notice on each failed branch |
| `.skilled/hooks/session-handover/codex/shared.mjs` | Modified | Prompt withdraw uses the default policy |
| `.skilled/hooks/session-handover/pi/session-handover.ts` | Modified | Catch and mark a failed arm, default withdraw policy |
| `.opencode/plugins/session-handover.js` | Modified | Same, at `session.idle` and on a new user message |
| Codex, Pi and OpenCode test files, `tests/adapter-conformance.test.cjs` | Modified | Branch, withdraw and arm-throws tests, and the Codex stamp row |
| `.skilled/hooks/session-handover/README.md` | Modified | The deferred mark and withdraw for each runtime |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Vibe CLI on deepseek-flash built the changes from four one-change briefs in worktree 420, and each diff was read before the next brief. Mutation checks then removed each mark and restored each `pending: 'none'`, and tests failed every time. A fresh Opus medium review read the whole diff. It found that the Codex notices promised a later Stop would retry, which cannot happen on Codex, and the text was fixed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the helper's default withdraw policy instead of a new flag | The default already withdraws exactly the armed and deferred records, and Claude has used it from the start |
| Codex notices promise a fresh nudge, not a retry | Codex sends no background-task completions as prompts, so every later Stop follows a prompt, and that prompt has already withdrawn the record |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Handover suite | PASS: `tests 1039`, `fail 0` |
| Pi vitest | PASS: `69 passed`, against a baseline of 67 |
| OpenCode plugin suite | PASS: `tests 75`, `fail 0`, against a baseline of 73 |
| Pi typecheck | PASS: `tsc -p tsconfig.pi.json --noEmit` prints nothing, exit 0 |
| Mutations | Codex marks removed: four tests fail. Pi and OpenCode mark removed: one test fails on each. `pending: 'none'` restored: one test fails on each of Codex, Pi and OpenCode |
| Live hops | `../scratch/runs/live1-pi` and `live1-opencode` both armed and relaunched, 5/5 |
| Drift guards | PASS: `all 4 guards PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The test suites inherit `AI_SESSION_CHILD`.** The Codex, Pi and OpenCode test sandboxes do not strip that variable, so the suites fail when run from a dispatched worker. Run them with `env -u AI_SESSION_CHILD`. This was there before this phase and is left for a separate change.
<!-- /ANCHOR:limitations -->
