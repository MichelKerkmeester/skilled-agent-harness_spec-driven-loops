---
title: "Implementation Summary"
description: "Receivers on Pi, Devin, Cursor and OpenCode bind the hand-over goal packet on their first turn when they have no goal of their own; Hermes already does through its spec-folder variable."
trigger_phrases:
  - "goal rebind shared core opencode implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/026-goal-rebind-shared-core-and-opencode"
    last_updated_at: "2026-10-25T01:30:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Built the bind-if-unbound core step, the Pi, Devin, Cursor and OpenCode callers, and their tests"
    next_safe_action: "Phase 27 binds Claude and Codex; skilled-loop exports HERMES_SPEC_FOLDER for a Hermes receiver"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-26-goal-rebind-shared-core-and-opencode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 026-goal-rebind-shared-core-and-opencode |
| **Completed** | 2026-10-25, uncommitted on top of 6b745c4f12 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A relaunched session on Pi, Devin, Cursor or OpenCode that the hand-over told a goal packet now binds that packet on its first turn, injects the goal from `goal.md` like any bound session, and sends no text. It binds only when it has no goal of its own, and `SESSION_RELAUNCH_GOAL=0` turns it off. Hermes needed no code, and one launcher change is still needed before a hop to Hermes binds.

### Phase 26: goal-rebind-shared-core-and-opencode

The shared core gained `bindGoalIfUnbound` and `bindRelaunchGoal`. The first refuses a packet that is not a repo-relative directory, takes the scope lock, and binds only when the scope holds no live record, no archived one and no record it cannot read. The archive check matters: a completed or cleared goal removes its live record, so a record check alone would hand a second goal to a session that had just ended its first. The second reads `SESSION_RELAUNCH_GOAL_PACKET` and the switch (`SESSION_RELAUNCH_GOAL`, from the environment or the flags file) and does nothing until a packet is named. `bindGoal` now delegates to a lock-free inner function so the new step holds the lock once.

Devin and Cursor call it before their usual read on every hook run, Pi on `session_start` and on the first `input`, with a per-session set that spares repeat reads. OpenCode has its own record handling, so its plugin mirrors the behavior: at `session.created` it binds the first top-level session of the process through its own `bindGoal`, using the core's switch reader and packet check. Child sessions and later sessions never bind.

Hermes: probe D showed the existing plugin already binds `HERMES_SPEC_FOLDER` to a session with no goal, so the plan's Hermes call was dropped. The launcher exports only `SESSION_RELAUNCH_GOAL_PACKET`, so for a hop to bind on Hermes `skilled-loop` must also export that packet as `HERMES_SPEC_FOLDER`. I did not touch `skilled-loop`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/goal/lib/goal-core.cjs` | Modified | `bindGoalIfUnbound`, `bindRelaunchGoal`, `relaunchGoalEnabled`, the packet shape check, and the lock split in `bindGoal` |
| `.skilled/hooks/goal/lib/goal-core.test.cjs` | Modified | 9 tests: bind, idempotence, active and paused kept, completed and cleared kept, unparseable record, switch and variable, flags file, 11 bad packets, kill switch |
| `.skilled/hooks/goal/pi/goal-context.ts` | Modified | Bind at `session_start` and the first `input` |
| `.skilled/hooks/goal/pi/goal-pi.test.mjs` | Modified | 4 tests, and the hand-over variables scrubbed per case |
| `.skilled/hooks/goal/devin/goal-inject.mjs` | Modified | Bind before the read, one stderr line for an unusable packet |
| `.skilled/hooks/goal/devin/goal-devin.test.mjs` | Modified | 3 tests, and the variables scrubbed from the hook environment |
| `.skilled/hooks/goal/cursor/goal-inject.mjs` | Modified | Same as Devin |
| `.skilled/hooks/goal/cursor/goal-cursor.test.mjs` | Modified | 3 tests, and the variables scrubbed from the hook environment |
| `.opencode/plugins/opencode-goal.js` | Modified | `bindRelaunchGoal` and the one `session.created` call |
| `.opencode/plugins/tests/opencode-goal-handover.test.cjs` | Created | 9 tests |
| `.skilled/hooks/goal/goal-plugin.md`, `.skilled/hooks/goal/README.md` | Modified | When a hop binds and when it does not, two variables, the import line |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md` | Modified | Stated suite count 155/155 across eight files, now 164/164 across nine |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines came first: hooks gate 159 of 159, plugins folder 540 of 540, Hermes 61 of 62 with one failure that predates this phase. The 28 tests were written next, then the code. Against a `git archive HEAD` copy, 23 of the 28 fail; the other 5 pin unchanged behavior and pass there by design. The gates then ran again from the final state, once in a clean environment and once with `SESSION_RELAUNCH_GOAL_PACKET` set to a real packet. No relaunch hop was run by hand: the suites drive the real hook processes, the real Pi extension and the real plugin, and the live proof is phase 28.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The receiver binds without asking, and `SESSION_RELAUNCH_GOAL=0` is the off switch (operator default) | The sender's own goal is the consent signal, and the launcher already drops the export when the switch is off |
| "No goal" includes an archived record and an unreadable one | A completed or cleared goal leaves no live record, and a corrupt one parses as none, so a record check alone would overwrite or re-grant a goal |
| The step is one core function with the lock held once | The new function must check and bind under one lock, and `bindGoal` already takes it |
| Hermes gets no code | Probe D: the existing plugin already binds the packet in `HERMES_SPEC_FOLDER`; the plan's default was a call, and the evidence won |
| OpenCode binds only for the first top-level session | `session.created` also fires for child sessions and for later sessions in the same process, and neither is the receiver |
| Pi, Devin and Cursor log an unusable packet only where a stderr line is safe | Pi's terminal UI would show it, so Pi stays silent, OpenCode logs under its debug variable |
| The new OpenCode tests live in their own file | Adding to the lifecycle file would grow an already long suite, and the playbook count follows the file set either way |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hooks gate (`node --test --test-reporter=tap` over the core, CLI, Pi, Cursor, Devin and hook-flags suites) | Before 159 of 159, after 178 of 178, exit 0 both. Delta +19, 0 failures |
| `.opencode/plugins/tests/*.test.cjs` (includes the doc-contract and export-contract suites) | Before 540 of 540, after 549 of 549, exit 0 both. Delta +9. One intermediate run failed two contract tests (a stale playbook count and the pinned helper list); the playbook was updated and the plugin helper was left unexported |
| Both gates with `SESSION_RELAUNCH_GOAL_PACKET` set to a real packet | 178 of 178 and 549 of 549 |
| Hermes `pytest .hermes/plugins/repo-guards/tests` | 61 of 62 before and after. The one failure, `test_session_end_reaps_the_mcp_helpers_under_its_own_pid`, was already failing: it expects one core call at session end and sees two. Not touched |
| The new tests against the code before this phase | 23 of the 28 fail on a `git archive HEAD` copy; 5 guard tests for unchanged behavior pass |
| `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` | Exit 0, 4 of 4 guards PASSED, 10 non-blocking warnings, none in a changed file |
| `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` | Exit 0, all rule-canary cases passed |
| `verify_alignment_drift.py --fail-on-warn` over `.skilled/hooks/goal` | 0 findings. Over `.opencode/plugins` it reports only two missing `'use strict'` warnings in files this phase did not touch |
| `check-comment-hygiene.sh` over the ten changed code files, `node --check` | Exit 0, no findings |
| `validate_document.py` on the goal README and plugin doc | 0 issues, and a type-fallback warning on the plugin doc that predates this phase |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | `RESULT: PASSED`, see the line below |

Run on the final state with `--strict` after `repair-derived.cjs --apply`: Errors 0, Warnings 0, `RESULT: PASSED`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Required follow-up: `.skilled/bin/skilled-loop` must export the hand-over packet as `HERMES_SPEC_FOLDER` for a Hermes receiver (and only while `SESSION_RELAUNCH_GOAL` is on). Until it does, a hop to Hermes binds nothing, although the plugin side works as probe D showed. The file belongs to another phase's working set.
2. The first turn is the earliest the bind can run, so a hook that fires before the first turn sees no goal. OpenCode binds at session start, one event earlier.
3. Pi, Devin and Cursor bind on each hook run or turn for any session that carries the variable, so a Devin subagent with its own session id gets its own record bound to the same packet.
4. A session whose archive entries were pruned by retention would read as having no goal. The archive retention is 90 days.
5. The OpenCode path checks, then binds, in two steps. Only that session's own plugin writes its record, so no second writer exists in practice, but the check is not under one lock as it is in the core.
6. The live proof on each runtime, and the tmux hop itself, belong to phase 28.
<!-- /ANCHOR:limitations -->

---
