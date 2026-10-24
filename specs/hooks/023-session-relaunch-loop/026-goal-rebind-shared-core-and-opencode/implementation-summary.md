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

Devin and Cursor call it before their usual read on every hook run, Pi on `session_start` and on the first `input`, with a per-session set that spares repeat reads. OpenCode has its own record handling, so its plugin mirrors the behavior: at `session.created` it binds the first top-level session of the process through its own `bindGoal`, using the core's switch reader and packet check. In-process child sessions and later sessions never bind.

Hermes: probe D showed the existing plugin already binds `HERMES_SPEC_FOLDER` to a session with no goal, so the plan's Hermes call was dropped. The launcher exports only `SESSION_RELAUNCH_GOAL_PACKET`, so for a hop to bind on Hermes `skilled-loop` must also export that packet as `HERMES_SPEC_FOLDER`. I did not touch `skilled-loop`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/goal/lib/goal-core.cjs` | Modified | `bindGoalIfUnbound`, `bindRelaunchGoal`, `relaunchGoalEnabled`, the packet shape check, and the lock split in `bindGoal`; remediation: `relaunchSessionIsChild` and the `child-session` refusal |
| `.skilled/hooks/goal/lib/goal-core.test.cjs` | Modified | 9 tests (11 after remediation, 2 for the child marker, one on an explicit environment and one on the live one): bind, idempotence, active and paused kept, completed and cleared kept, unparseable record, switch and variable, flags file, 11 bad packets, kill switch |
| `.skilled/hooks/goal/pi/goal-context.ts` | Modified | Bind at `session_start` and the first `input` |
| `.skilled/hooks/goal/pi/goal-pi.test.mjs` | Modified | 4 tests (5 after remediation), and the hand-over variables, `AI_SESSION_CHILD` included, scrubbed per case |
| `.skilled/hooks/goal/devin/goal-inject.mjs` | Modified | Bind before the read, one stderr line for an unusable packet |
| `.skilled/hooks/goal/devin/goal-devin.test.mjs` | Modified | 3 tests (4 after remediation), and the variables, `AI_SESSION_CHILD` included, scrubbed from the hook environment |
| `.skilled/hooks/goal/cursor/goal-inject.mjs` | Modified | Same as Devin |
| `.skilled/hooks/goal/cursor/goal-cursor.test.mjs` | Modified | 3 tests (4 after remediation), and the variables, `AI_SESSION_CHILD` included, scrubbed from the hook environment |
| `.opencode/plugins/opencode-goal.js` | Modified | `bindRelaunchGoal` and the one `session.created` call; remediation: the child check, the single-lock check-and-bind, and the shared `packetBoundRecord` |
| `.opencode/plugins/tests/opencode-goal-handover.test.cjs` | Created | 9 tests (11 after remediation: a dispatched child, and a goal that lands while the bind waits for the lock) |
| `.skilled/skills/.state/goal/README.md` | Modified | The continuation checks no longer list the retired caps |
| `.skilled/hooks/goal/goal-plugin.md`, `.skilled/hooks/goal/README.md` | Modified | When a hop binds and when it does not, two variables, the import line |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md` | Modified | Stated suite count 155/155 across eight files, now 166/166 across nine (164/164 before the remediation) |

### Review remediation

A review of the first build confirmed three defects, all fixed in the same working tree.

1. Dispatched children bound the parent's packet. Every process a receiver spawns inherits `SESSION_RELAUNCH_GOAL_PACKET`, and the first build only checked that variable. Devin and Cursor bound any new session id, Pi deduped per session id, and OpenCode skipped in-process children with a parent session but not a dispatched `opencode run`, whose first session is top-level. `bindRelaunchGoal` in the core now returns `child-session` when `AI_SESSION_CHILD` is `1`, through the new exported `relaunchSessionIsChild`, and the OpenCode helper makes the same check, so a child never binds on any of the five paths. `AI_SESSION_CHILD=1` is the repository's one marker for a dispatched child session. The goal docs now say which sessions bind: the receiver only, meaning no `AI_SESSION_CHILD=1`, no parent session in OpenCode and the first top-level session of the process.
2. OpenCode checked and bound in two steps. It read the record, then called `bindGoal`, which rebinds an existing active or paused record, so a goal set between the two calls was overwritten. The helper now does the whole decision inside one `mutateGoal` turn, which holds the plugin's in-process queue and the cross-process session lock: a live record or an archive entry ends the turn with no write, and the write builds a fresh record, so the bind can never replace one. The record-building lines moved out of `bindGoal` into `packetBoundRecord`, which both callers share.
3. The state folder README listed an auto-turn cap, a wall-clock cap and a token budget as continuation checks. The plugin's continuation decision (`maybeContinueGoal`) checks the active status, the verifier result, a recorded suppression, prompt blockers, busy or retrying session status and the cooldown, and none of the three caps; `RETIRED_SUPPRESSION_REASONS` only lets resume release a record an older version saved. The line now says that.
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
| A session with `AI_SESSION_CHILD=1` never binds, on every runtime | A dispatched child inherits the packet variable from the receiver. The marker is the repository's one signal for a dispatched child, so the check lives in the shared core and the OpenCode helper reads the same function. It cannot see a child launched without the marker |
| OpenCode decides inside the mutation turn and writes a fresh record | Check and write under one lock means a concurrent `set` is kept. Reusing `bindGoal` could not give that, because it rebinds an existing active or paused record |
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
| Remediation: hooks gate, same six suites | Before 178 of 178, after 183 of 183, exit 0, with `AI_SESSION_CHILD` unset and with it set to 1 in the calling shell. Delta +5 |
| Remediation: `.opencode/plugins/tests/*.test.cjs` | Before 549 of 549, after 551 of 551, exit 0, both environments. Delta +2 (the playbook count is now 166/166 and the contract test confirms it) |
| Remediation: the 7 new tests against the pre-fix `goal-core.cjs` and `opencode-goal.js` | All 7 fail there (core 2, Pi 1, Cursor 1, Devin 1, OpenCode 2) and pass on the fixed code. The pre-fix copy was the two source files restored from `HEAD` in this worktree, then put back |
| Remediation: `run-all-drift-guards.sh`, `check-rule-copies.test.sh` | Exit 0, 4 of 4 guards PASSED with 10 non-blocking warnings; all rule-canary cases passed |
| Remediation: `check-comment-hygiene.sh`, `verify_alignment_drift.py --fail-on-warn` over `.skilled/hooks/goal`, `node --check` | Exit 0 and no findings, 0 findings, clean |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | `RESULT: PASSED`, see the line below |

Run on the final state with `--strict` after `repair-derived.cjs --apply`: Errors 0, Warnings 0, `RESULT: PASSED`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Required follow-up: `.skilled/bin/skilled-loop` must export the hand-over packet as `HERMES_SPEC_FOLDER` for a Hermes receiver (and only while `SESSION_RELAUNCH_GOAL` is on). Until it does, a hop to Hermes binds nothing, although the plugin side works as probe D showed. The file belongs to another phase's working set.
2. The first turn is the earliest the bind can run, so a hook that fires before the first turn sees no goal. OpenCode binds at session start, one event earlier.
3. Pi, Devin and Cursor bind on each hook run or turn for any session that carries the variable and is not marked `AI_SESSION_CHILD=1`. `AI_SESSION_CHILD=1` is the only signal the core reads, so a child or subagent launched without it (a hand-started one, or a runtime that spawns subagents in the same process without exporting the marker) still inherits the packet and binds its own record to it. Residual risk, not closed here.
4. A session whose archive entries were pruned by retention would read as having no goal. The archive retention is 90 days.
5. Resolved in the remediation: the OpenCode path used to check, then bind, in two steps, and a goal set in between could be overwritten. The check and the write now share one `mutateGoal` turn, the same guarantee the core has under `withScopeMutation`.
6. The live proof on each runtime, and the tmux hop itself, belong to phase 28.
<!-- /ANCHOR:limitations -->

---
