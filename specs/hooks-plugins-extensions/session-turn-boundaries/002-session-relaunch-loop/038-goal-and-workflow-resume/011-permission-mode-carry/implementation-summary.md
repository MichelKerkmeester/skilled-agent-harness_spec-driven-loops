---
title: "Implementation Summary"
description: "A Claude session that changed permission mode after launch restarts in that mode after a hop, or in the launch mode with one reason when the live mode cannot be replayed safely."
trigger_phrases:
  - "permission mode carry implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry"
    last_updated_at: "2026-11-14T07:10:00Z"
    last_updated_by: "implementation-agent"
    recent_action: "Rewrote the two limitation rows the live checks of 2026-11-13 had made stale"
    next_safe_action: "None. AC-001 is Met and the bypass question is recorded as a limitation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-permission-mode-carry"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-permission-mode-carry |
| **Completed** | 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Claude session that switched permission mode after launch, for example with Shift+Tab into `acceptEdits`, now restarts in that mode after a hop. When the live mode cannot be replayed safely, the receiver starts in the launch mode and the wrapper prints one stderr line saying why.

### Phase 11: permission-mode-carry

The mode travels the same road the live model already uses. The Claude Stop adapter stamps `payload.permission_mode` on the armed record, the relaunch core keeps it, `consume` prints it, and `skilled-loop` replays it as `--permission-mode` on a Claude hop and in the manual claim command. A launch `--permission-mode` is captured into `SKILLED_LOOP_PERMISSION_MODE`, so a hop without a usable live mode keeps the value the operator launched with.

Two safety rules hold the replay back. A live `plan` mode stays out of the record-backed path and keeps the launch mode, because a receiver in plan mode would stall on its first claim; the operator chose that option B on 2026-11-13. A live `bypassPermissions` is replayed only when the launch line already carried `--dangerously-skip-permissions` or `--allow-dangerously-skip-permissions`, and the wrapper never adds an unlocking flag of its own.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modified | Passes a non-empty `payload.permission_mode` to `arm` as `settings.permissionMode`. |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | Keeps `permissionMode` on the armed record with the other live settings and names it in the JSDoc. |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | Prints `permissionMode` from `consume` when the record holds a non-empty value. |
| `.skilled/bin/skilled-loop` | Modified | Captures the launch mode, validates the live one, replays it after the effort and before the seed, and applies the same rules to the manual command. |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modified | Adds the stamp and no-stamp Stop arm tests. |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Adds the keep-the-mode arm test, including a later arm with a new model. |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | Adds the consume print test; the old consume test stays unchanged. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-model-effort.test.cjs` | Modified | Adds the replay, unknown-mode, plan, bypass, launch-order and manual-command tests. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modified | Moves the launch mode ahead of the seed in three expected argument lists. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` | Modified | Lets the runtime stub write `permissionMode` from `RECORD_PERMISSION_MODE` and report the child's launch mode. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every source edit followed a recorded failing test. The red runs are in `scratch/red.txt` (Stop arm `fail 1`, core `fail 1`, consume `fail 1`, six wrapper tests `fail 6`, launch-arguments `fail 1`) and the green runs are in `scratch/green.txt`. Each task's `Verify:` command ran in order, and T006 was rechecked after T008 because the core owns the record key.

The full five files passed with 493 tests, 493 pass and `fail 0` on exit 0. The whole `.skilled/hooks/session-relaunch/tests` suite passed with 913 tests and `fail 0`. `bash -n .skilled/bin/skilled-loop` and `node --check bin/session-relaunch.cjs` both exited 0, and the Codex adapter holds no `permissionMode`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Option B for a live `plan` mode | A receiver in plan mode would stall on the claim that writes the note, so the receiver stays in the launch mode and one note line explains it. The operator chose this on 2026-11-13. |
| Conservative fallback for the unrecorded live facts | The build ran without a live Claude session, so the accepted set is the six `claude --help` choices only, and a live bypass needs an unlocking flag the launch line already carried. Both choices keep the launch mode instead of guessing. |
| Record-carried setting | The mode uses the same Stop, `arm`, record, `consume` and wrapper road as the live model, so one owner decides what the receiver starts with. |
| No unlocking flag from the wrapper | Replaying a mode is safe only while the permission the operator chose stays the same, and a wrapper-added flag would grant more than the launch line did. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Five test files in full | 493 tests, 493 pass, `fail 0`, exit 0 |
| Whole session-relaunch suite | 913 tests, 913 pass, `fail 0` |
| `bash -n .skilled/bin/skilled-loop` | Exit 0 |
| `node --check bin/session-relaunch.cjs` | Exit 0 |
| Codex untouched | `rg -n "permissionMode" .../codex` printed nothing, exit 1 |
| Strict validation | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The two live facts were recorded after the build, not before it.** T001 and T002 need a live Claude session, which the build did not have. The orchestrator ran both on Claude Code 2.1.323 on 2026-11-13, `scratch/live-checks.md` holds the four result lines and AC-001 is Met. One question stays open: the bypass run passed with no second flag, but on a machine whose settings already default to `bypassPermissions`, so it does not show whether the flag is needed elsewhere. The wrapper keeps the stricter rule and replays a live `bypassPermissions` only beside a launch unlocking flag.
2. **The planned baseline moved.** The plan recorded 158 `session-relaunch-cli` tests; the tree held 162 when the build started because work landed after planning. The final five-file total is 493, not the planned 489.
3. **A live `default` mode is carried.** The live checks showed that the Stop payload reports `default` and that the CLI accepts `--permission-mode default` (`scratch/live-checks.md`), although `claude --help` does not list it. The wrapper accepts it as a seventh value (`permission_mode_is_valid` in `.skilled/bin/skilled-loop`), and the wrapper test `a live default permission mode replaces the launch mode` shows the hop carrying `--permission-mode default`.
<!-- /ANCHOR:limitations -->

---
