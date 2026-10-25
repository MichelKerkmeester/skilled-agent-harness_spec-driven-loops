---
title: "Pi and OpenCode Session Relaunch"
description: "Automatable and live scenarios for the Pi and OpenCode session-relaunch adapters, including the hop history, withdrawn hand-overs and cancel."
trigger_phrases:
  - "Pi session relaunch"
  - "OpenCode session relaunch"
  - "session-relaunch-pi-opencode"
  - "skilled-loop pi"
  - "skilled-loop opencode"
version: 1.0.12.0
id: session-relaunch-pi-opencode
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# Pi and OpenCode Session Relaunch

---

## 1. OVERVIEW

This scenario validates Pi and OpenCode adapter loading, event handling, wrapper relaunch arguments and live handoffs. Automatable checks cover extension or plugin loading and the adapter and wrapper suites. Live tmux checks observe a handoff through a fresh runtime session.

### Why This Matters

The adapters use different host events and seed argument forms while sharing handoff state and `skilled-loop`. A live run confirms the host delivers those events and the restarted runtime claims the prepared handoff.

---

## 2. SCENARIO CONTRACT

Operators run five automatable checks and one live hop in each runtime. They verify adapter imports, regression suites, runtime-specific wrapper arguments and the live handoff lifecycle. Live results below record the observed Pi and OpenCode handoffs and the operator inputs each receiving session needed.

- Objective: Verify Pi and OpenCode adapter loading, event handling, seed injection, matching record arming and wrapper relaunch behavior, plus the hop history and calling off a prepared hand-over with a new turn or `cancel`.
- Real user request: Carry a short task through a context handoff in Pi or OpenCode, then finish it in the new session.
- Prompt: `Carry this short task through a context handoff, then finish it in the new session. Tell me when you are ready.`
- Expected execution process: Run the Pi extension smoke with -ne -e, the OpenCode import smoke, both adapter suites and the wrapper runtime suite. Start Pi with its provider, model and explicit extension selection. Start OpenCode with its model selection. Use separate tmux sessions with a low hop cap, follow each generated handoff and observe the wrapper relaunch.
- Expected signals: Automatable commands exit 0. Pi loads the extension with `-ne -e`. OpenCode import prints `object`. Adapter suites pass. Wrapper tests record `SKILLED_LOOP_RUNTIME` and the Pi and OpenCode seed arguments. Each live handoff is prepared and armed for its matching runtime, then the wrapper starts a fresh runtime with the claim seed.
- Desired user-visible outcome: The receiving session claims the same handoff and continues the unfinished task.
- Pass/fail: PASS if all five automatable checks pass, both live runs show the matching runtime restart and claim seed and checks PO-1 to PO-6 meet their signals. FAIL if a smoke or suite exits non-zero, the wrapper uses the wrong runtime arguments, either live run does not reach the expected handoff or a new turn leaves an armed record in place.

---

## 3. TEST EXECUTION

### Primary Scenario

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| session-relaunch-pi-opencode | Pi and OpenCode session relaunch adapters | Run five automatable checks and one live handoff in each runtime. | Carry this short task through a context handoff, then finish it in the new session. Tell me when you are ready. | Pi extension smoke -> OpenCode import smoke -> Pi adapter suite -> OpenCode adapter suite -> wrapper runtime suite -> live Pi tmux hop -> live OpenCode tmux hop | Automatable commands exit 0. The Pi smoke loads its extension with `-ne -e`. OpenCode import prints `object`. The wrapper tests show Pi name ordering and OpenCode `--prompt` without a name flag. Each live run arms the matching record and starts a fresh runtime with the claim seed. `history` shows `handed-over (hop 1)`, `claimed ... by <id>` and `done` (PO-1). A new turn over an armed record disarms it with `user-message`, logs `arm-cancelled` and leaves a `withdrawn` history line (PO-2). | Capture command output and exit codes. For each live run capture the tmux transcript, runtime log entries and handoff status from open through claimed. | PASS when every automated check exits 0 and both live sessions claim their prepared handoff after the matching wrapper relaunch. FAIL when an automated check fails, a runtime is mismatched or a live claim seed is not delivered. | 1. Confirm the adapter path and host smoke command. 2. Check adapter event logs and the matching runtime field in the pending record. 3. Check the killer result, hop limit and runtime-specific seed arguments. |

### Automatable Checks

#### Pi extension load smoke (Automatable)

Run the extension smoke from the repository root. The `-ne -e` flags load the extension without the default Pi startup path. A prior default smoke hit a pre-existing conflict because the user-global `pi-fast-mode-w-subagent-support` extension and the repository extension both register `--fast`.

~~~bash
set -euo pipefail
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT
pi --offline --approve -ne -e .pi/extensions/session-relaunch.ts --session-dir "$scratch" -p "list your available tools" </dev/null
~~~

Evidence: exit code 0 confirms Pi loads the extension in this smoke mode. It does not verify positional seed auto-send in the TUI.

#### OpenCode plugin import smoke (Automatable)

~~~bash
node -e "import('./.opencode/plugins/session-relaunch.js').then(m=>console.log(typeof m.default))"
~~~

Evidence: stdout is `object` and the command exits 0. The module's default export is the dual-plugin object that `dualPlugin` returns, with the keys `id`, `server` and `setup`, so `typeof m.default` is `object`. It printed `function` only while the export was still the bare plugin function.

#### Pi adapter suite (Automatable)

~~~bash
./.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
~~~

Evidence: Vitest reports the Pi adapter suite passed. The cases cover threshold nudges, seed injection, `agent_end` arming and `agent_end respawns one killer for an armed record whose killer is gone`.

#### OpenCode adapter suite (Automatable)

~~~bash
node --test .opencode/plugins/tests/session-relaunch.test.cjs
~~~

Evidence: Node reports the OpenCode adapter suite passed. The cases cover plugin import, events, transform injection, seed handling, idle arming and `session.idle respawns one killer for an armed record whose killer is gone`.

#### Wrapper runtime arms (Automatable)

~~~bash
node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs
~~~

Evidence: the wrapper suite records `SKILLED_LOOP_RUNTIME`, Pi `--name` before the seed and OpenCode `--prompt` without `--name`.

#### Shell shim resolution (Automatable)

~~~bash
node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs
~~~

Evidence: all 18 tests pass under bash and zsh. The suite holds nine cases and runs each under both shells. Plain `pi`, `pi --model <m> "<prompt>"`, `opencode` and `opencode -m <model>` resolve the wrapper through a symlinked `.skilled`. `pi -p`, `pi install`, `pi --mode rpc`, `opencode run` and `opencode serve` resolve nothing. The outside-loop note-only nudge for both adapters is the `a nudge outside skilled-loop asks for keep and never prepare` case in `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` for OpenCode and in the Pi suite's conformance block.

### Live Checks

Each live launch overrides the threshold and window-token limit then sets the hop cap to one. These values are test overrides only. Defaults stay unchanged. Submit the exact prompt from the scenario contract and then wait for the nudge, which reaches the model without an operator turn. Pi holds it from `message_end` to `agent_end` and delivers it as a follow-up that starts its own turn. OpenCode carries it in the system prompt on the session's next request. Follow the adapter's generated handoff and `prepare` instructions. Observe the record arm, process handoff and claim seed in the receiving TUI.

#### Recorded Results

`loopId` is the wrapper run id. A pass means the receiving session claimed its note. The packet has no saved `relaunch.log` copy for OpenCode A or C, so those evidence entries come from the ledger.

| Runtime | Run ID | Result | `relaunch.log` evidence | Operator inputs |
|---|---|---|---|---|
| Pi | Run 1 (`loopId=5810`) | Pass: one counted hop. The second attempt reached the hop cap. | `2026-10-17T12:21:37.096Z prepare loopId=5810 status=pending sessionId=01a149c7-c583-71e9-b0aa-b4e377ac39a8`<br>`2026-10-17T12:22:29.438Z killer-signal targetPid=5853 signal=SIGTERM`<br>`2026-10-17T12:22:29.545Z relaunch loopId=5810 reason=ready`<br>`2026-10-17T12:37:39.364Z prepare loopId=5810 status=pending sessionId=01a149d0-4aa1-72c8-a9f3-c7a8ee155ba1`<br>`2026-10-17T12:38:35.528Z killer-signal targetPid=27665 signal=SIGTERM`<br>`2026-10-17T12:38:35.637Z decline loopId=5810 reason=hop-cap` | Sent `Continue the live test.` to start the nudge turn. After relaunch, answered Gate 3 with A and LOGIC-SYNC with option 1, claim without prepare. |
| Pi | Run 2 (`loopId=66040`) | Pass. | `2026-10-17T14:07:07.786Z prepare loopId=66040 status=pending sessionId=01a14a18-1760-77cc-8fea-31b2ee97a2f8`<br>`2026-10-17T14:08:14.614Z killer-signal targetPid=66057 signal=SIGTERM`<br>`2026-10-17T14:08:14.746Z relaunch loopId=66040 reason=ready`<br>`2026-10-17T14:21:58.232Z decline loopId=66040 reason=no-file` | Withdrew the instruction to leave `spec_folder` empty and ran `/speckit:save` with the 002 folder. After relaunch, answered Gate 3 with A and the `/speckit:resume` menu with A. |
| OpenCode | Run D (`loopId=18795`) | Pass. | `2026-10-17T12:55:14.333Z prepare loopId=18795 status=pending sessionId=ses_eb61236dbffeJIAGr440Q3hdVT`<br>`2026-10-17T12:55:27.400Z killer-signal targetPid=18858 signal=SIGTERM`<br>`2026-10-17T12:55:27.589Z relaunch loopId=18795 reason=ready` | Answered Gate 3 with A. After the claim, told the session not to prepare and to complete the task. |
| OpenCode | Run E (`loopId=66034`) | Pass. | `2026-10-17T13:42:01.958Z prepare loopId=66034 status=pending sessionId=ses_eb5e7ae9cffe88hvn2m9fkmscW`<br>`2026-10-17T13:42:12.628Z killer-signal targetPid=66052 signal=SIGTERM`<br>`2026-10-17T13:42:12.820Z relaunch loopId=66034 reason=ready`<br>`2026-10-17T14:21:30.627Z decline loopId=66034 reason=no-file` | Answered Gate 3 with A. After the claim, told the session the test had no task and to complete. |
| OpenCode | Run F (`loopId=49691`) | Pass. | `2026-10-17T16:32:59.469Z prepare loopId=49691 status=pending sessionId=ses_eb55200afffeBCSDET2x5MbmO4`<br>`2026-10-17T16:33:12.721Z killer-signal targetPid=49710 signal=SIGTERM`<br>`2026-10-17T16:33:12.884Z relaunch loopId=49691 reason=ready`<br>`2026-10-17T16:34:42.303Z decline loopId=49691 reason=no-file` | Before relaunch, the orchestrator allowed the continuity writer once. After relaunch: none. The seed carried the folder answer. The session claimed and completed without a question or reply. |
| OpenCode | Run A (no `loopId` recorded) | Not a hop: the one-shot system transform was absent when OpenCode rebuilt the prompt for the next request, so the model did not write a note. The claim instructions now repeat on every request until the note leaves `open`, so that cause no longer applies. | No saved `relaunch.log` copy. The ledger records that 0.05 did not fire. At 0.02, the nudge reached level 1. No note or prepare followed, so there was no hop. Wrapper exit: 0. | No follow-up input recorded. |
| OpenCode | Run B (`loopId=36553`) | Not a hop: Bun set `process.execPath` to `opencode.exe`, so the spawn launched OpenCode instead of the killer. A second Ctrl-C interrupted the fresh session before it claimed the note. | `2026-10-17T11:54:16.759Z prepare loopId=36553 status=pending sessionId=ses_eb64a06c2ffe6wXkUEP2W7PJwK`<br>`2026-10-17T12:01:05.149Z relaunch loopId=36553 reason=ready`<br>No `killer-signal` line. | Manually exited after the killer failed to run. Sent a second Ctrl-C two seconds after the relaunch, interrupting the fresh session before the claim. |
| OpenCode | Run C (no `loopId` recorded) | Not a hop: the model ran a made-up `prepare.mjs` command, which failed with `MODULE_NOT_FOUND`. The nudge stopped after the note existed. | No saved `relaunch.log` copy. The ledger records `decline reason=no-file` and `WRAPPER_EXIT=0`. No claim or relaunch was recorded. | Sent one Ctrl-C to end the session after the command failed. |

The 2026-10-19 benchmark reports for this scenario hold the outcomes, operator inputs and evidence paths: [`2026-10-19--manual-testing-playbook--session-relaunch-final-code/`](../../benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-final-code/README.md) records the final-code round, and [`2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/`](../../benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/README.md) records the earlier runs made while the gaps were being fixed. A third record, [`2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/`](../../benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/README.md), covers the run with no Gate 3 answer on Pi and OpenCode.

#### Recorded Results, 2026-10-22

Pi 1.3.0 and OpenCode 1.19.3 with `openai/gpt-6-luna`, live in tmux at a 0.05 threshold against a 200,000-token window. The live runs found three defects, each fixed with a failing test first and then rerun: OpenCode sessions started in the same second planned the same note, and on both runtimes a turn started just after the arm was signalled mid-turn. The full matrix, commits and evidence paths are in the [runtime-certainty implementation summary](../../../../../specs/hooks/023-session-relaunch-loop/022-runtime-certainty-claude-pi-opencode/implementation-summary.md). After Pi moved to 1.4.0 the same day, S1, S3 and S6 were rerun on it and passed.

| Situation | Pi | OpenCode |
|---|---|---|
| Full hop with model carry and spec folder | Pass | Pass |
| One nudge and one re-nudge | Pass | Pass |
| Keep, `/compact`, claim, complete | Pass, `compact-pointer` on `session_compact` | Pass, `compact-pointer` on `session.compacted` |
| Hop cap, stale record, kill switch | Pass | Pass |
| Busy at arm time | Pass after the `agent_start` withdrawal | Pass after the user-message withdrawal |
| Live shell child at prepare | Pass | Pass for a compound command; a single exec'd command is not detected |
| Sub-agent | Not applicable, Pi has none | Pass, the `task` child session got no state |
| Two loops at once | Pass | Pass |
| Started from a subdirectory, and through the shim in a linked repository | Pass | Pass |
| Interrupt after relaunch, before claim | Pass, wrapper exit 130 | Pass, wrapper exit 0 |
| Nested run inside a loop | Pass, `loop-nested-run` logged | Not run: the model refused to start OpenCode nested |

#### Live Pi hop in tmux (Live)

Run from the repository root:

~~~bash
set -euo pipefail
repo_root=$PWD
session_name="session-relaunch-pi-$$"
tmux_command="cd '$repo_root' && PATH='$repo_root/.skilled/bin':\$PATH SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 skilled-loop pi"
tmux new-session -d -s "$session_name" "$tmux_command"
tmux attach -t "$session_name"
~~~

Observe Pi's `message_end` nudge, the seed injection at `before_agent_start` and matching-record arming at `agent_end`. Pi only decides the nudge at `message_end` and holds the text until `agent_end`, which re-checks the record and the hop limit before sending it as a follow-up that starts a turn. Confirm the killer ends the current Pi process and `skilled-loop` starts Pi with the prepared claim seed. Confirm the receiving TUI claims that note and continues the task. The 2026-10-19 benchmark report for this scenario records the seed claims those runs made in the receiving TUI.

#### Live OpenCode hop in tmux (Live)

Run from the repository root:

~~~bash
set -euo pipefail
repo_root=$PWD
session_name="session-relaunch-opencode-$$"
tmux_command="cd '$repo_root' && PATH='$repo_root/.skilled/bin':\$PATH SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 skilled-loop opencode"
tmux new-session -d -s "$session_name" "$tmux_command"
tmux attach -t "$session_name"
~~~

Observe `message.updated` usage handling, `message.part.updated` seed capture and the system transform. The claim instructions stay in the system prompt for every request until the note leaves `open` or a new non-seed user message arrives, so an auxiliary request that consumes the first copy no longer drops them. Confirm a matching record arms on `session.idle`, the killer ends the current OpenCode process and the wrapper restarts it with `--prompt "<seed>"` and no name flag. Confirm the receiving TUI claims the note and continues the task. The 2026-10-19 benchmark report for this scenario records the claim and completion those runs reached. `session.idle` on TUI quit remains UNVERIFIED.

### Live Withdraw, Cancel And History Checks

These checks call a Pi or OpenCode hand-over off, or let it run, and read the result from the record, the logs and the hop history. Each runtime runs through `skilled-loop` in a detached tmux session so one shell can type into it and read it. The code paths are covered by the suites listed under PO-6. The live steps were authored from that code, so record your own run before you rely on a timing. The Pi commands in PO-5 were run as written while this file was authored, and the OpenCode flow in CO-046 was run on OpenCode 1 and 2. The tmux checks PO-1 to PO-4 were not.

Both runtimes withdraw an armed record when a new turn starts, and neither withdraws a pending one. Pi acts on `agent_start` and OpenCode on a `message.updated` event for a user message it has not seen. Neither tells the model: the model gets no withdraw notice, `relaunch.log` records `arm-cancelled` where Claude and Codex record `withdrawn`, and the extra nudge comes after the next assistant message that grows the fill by a step. Neither runtime has background-task completion prompts, so there is no `<task-notification>` case.

#### PO-0 Live setup shared by PO-1 to PO-4 (Live)

Run from the repository root with `tmux`, `node` and the runtime you test. A shell that is itself inside a loop works, because the launch commands drop the inherited hop count. Paste this block once per shell, then set `runtime` to `pi` or `opencode`:

~~~bash
repo_root="$(git rev-parse --show-toplevel)"
if [ -n "${XDG_RUNTIME_DIR:-}" ]; then state="$XDG_RUNTIME_DIR/skilled-relaunch"; else state="${TMPDIR:-/tmp}/skilled-relaunch-$(id -u)"; fi
cli() { node "$repo_root/.skilled/hooks/session-relaunch/bin/session-relaunch.cjs" "$@"; }
runtime=pi   # or opencode
session_name="relaunch-$runtime-$$"

start_runtime() {
  tmux new-session -d -s "$session_name" "cd '$repo_root' && env -u SKILLED_LOOP_HOPS SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 bash .skilled/bin/skilled-loop $runtime"
  tmux set-option -w -t "$session_name" remain-on-exit on
}
say() { tmux send-keys -t "$session_name" -l "$1"; sleep 0.5; tmux send-keys -t "$session_name" Enter; }
screen() { tmux capture-pane -p -S -120 -t "$session_name"; }
wait_for_record() {  # waits up to 5 minutes, prints the loop id of the first record in one of the given states
  local pattern="$1" file="" tries=0
  while [ -z "$file" ] && [ "$tries" -lt 3000 ]; do
    file=$(find "$state" -maxdepth 1 -name 'relaunch-*.json' -exec grep -lE "\"status\":\"($pattern)\"" {} + 2>/dev/null | head -1)
    [ -n "$file" ] || { sleep 0.1; tries=$((tries + 1)); }
  done
  [ -n "$file" ] || return 1
  file=${file##*/relaunch-}
  echo "${file%.json}"
}
record_field() { grep -oE "\"$2\":\"[^\"]*\"" "$state/relaunch-$1.json"; }
~~~

`SESSION_RELAUNCH_THRESHOLD=0.05` and `SESSION_RELAUNCH_WINDOW_TOKENS=100` are test overrides that make the first reply cross the threshold, and `SESSION_RELAUNCH_MAX_HOPS=1` stops the chain after one hop. Pi decides the nudge when a message ends and sends it as a follow-up turn, so the first prompt needs no second one. OpenCode carries the nudge in the system prompt of its next request, so the first prompt must make the model call a tool. The files the checks read:

| Path | Holds |
|---|---|
| `$state/relaunch.log` | One line per hook, wrapper and killer event |
| `$state/relaunch-<loop id>.json` | The relaunch record. The loop id is the wrapper's pid |
| `$state/nudge-<session id>.json` | The session's nudge level and any extra nudge it is owed (`rearm`) |
| `.skilled/skills/.state/session-relaunch/hop-history.log` | The persistent hop history that `history` prints |
| `.skilled/skills/.state/session-relaunch/handoffs/` | The handoff notes |

Run one check at a time and only one looped session at once, because `wait_for_record` takes the first record it finds. Every check leaves a gitignored note and history lines behind. End each check with `tmux kill-session -t "$session_name"`. The first prompt for both runtimes is:

~~~bash
first_prompt="Gate 3 is answered: D) Skip. Run the shell command 'echo probe'. When the [session-relaunch] instructions arrive, follow them: write the note with spec_folder none, run prepare and end your turn."
~~~

#### PO-1 Hop history after a live hop (Live)

Run the live Pi or OpenCode hop above, or start the runtime with `start_runtime` and say `$first_prompt`. Let the receiving session claim and complete the note, then read the history:

~~~bash
cli history --last 3
~~~

Expected, with the time and your folder name in place of the examples:

~~~text
2026-10-24T15:06:21.723Z  handed-over  pi        my-repo (hop 1)  <first line of the note Goal>  [<stamp>-<sender session id>.md]
2026-10-24T15:06:21.856Z  claimed      pi        my-repo by 01a149d0  <same Goal>  [<same note>]
2026-10-24T15:06:21.909Z  done         pi        my-repo  <same Goal>  [<same note>]
~~~

The runtime column reads `opencode` for OpenCode. The `handed-over` line comes from the wrapper, which writes it through `hand-over --handoff <note> --hop 1 --runtime <runtime>` only after it read an open note. Neither runtime exports a session id variable, so the receiving session passes its own id to `claim --session`, and `by <id>` is the first eight characters of that id. `relaunch.log` holds `prepare loopId=<id> status=pending`, then `relaunch loopId=<id> reason=ready`.

Evidence: the three history lines and the two log lines. PASS when the three lines name the same note in the order `handed-over`, `claimed`, `done`, the `handed-over` line carries `(hop 1)` and the `by <id>` value differs from the sender's id in the note file name. FAIL when a line is missing, when `claimed` shows no `by <id>` or when a `handed-over` line exists for a hop the wrapper declined.

#### PO-2 A new turn withdraws an armed hand-over (Live)

Pi arms on `agent_end` and OpenCode on `session.idle`. OpenCode's killer has no transcript and waits a fixed 3 s, and Pi's reads the session file. A prompt typed inside that window must withdraw the record, so the check types it as soon as the record is armed.

~~~bash
start_runtime
say "$first_prompt"
loop_id=$(wait_for_record armed)
say "Stay in this session. Reply with the single word STAYING."
sleep 8
record_field "$loop_id" status; record_field "$loop_id" disarmReason
cli should-relaunch --loop-id "$loop_id"; echo "exit $?"
grep -E ' (arm-cancelled|killer-signal|relaunch) ' "$state/relaunch.log" | tail -5
cli history --last 2
screen | tail -20
~~~

Expected:

- The record reads `"status":"disarmed"` and `"disarmReason":"user-message"`.
- `should-relaunch` prints `{"relaunch":false,"reason":"withdrawn",...}` and `exit 1`.
- `relaunch.log` holds `arm-cancelled loopId=<id> sessionId=<id> reason=user-message` and no `killer-signal` line after it. There is no `withdrawn` line, because that event name belongs to Claude and Codex.
- `history` ends with a `withdrawn` line that carries `by <first eight characters of the session id>`, then `open notes: 1 withdrawn note still with its session`.
- The pane shows the runtime answering STAYING in the same session.

Then end the session and read the wrapper. Use `/quit` in Pi and `/exit` in OpenCode. If the runtime does not know the command, send `tmux send-keys -t "$session_name" C-c C-c` instead.

~~~bash
say "/quit"
sleep 5
screen | grep -E 'warning|claim and continue'
tmux display -p -t "$session_name" '#{pane_dead_status}'
~~~

Expected: one line `warning: the prepared hand-over was withdrawn in the session; <note path> stays open and out of date`, no line that carries `claim and continue handoff` (the manual claim command) and the runtime's own exit status for the pane.

Evidence: the command output, the pane text and `relaunch.log`. PASS when the record is disarmed with `user-message`, `should-relaunch` reports `withdrawn`, the session kept running and the wrapper printed the single warning without a claim command. FAIL when the record stays armed, the log shows `killer-signal`, a second runtime starts with a seed or the wrapper prints a manual claim command. Triage: if the pane shows the relaunch already, the prompt landed after the killer's wait, so rerun. If `wait_for_record armed` never returns, read `relaunch.log` for `prepare-declined`, `session-idle-arm-error` or `stop-arm-error`.

#### PO-3 The extra nudge arrives after a withdraw (Live)

The check spends the session's nudge levels before the withdraw, so a nudge can only come from the extra one.

~~~bash
start_runtime
say "$first_prompt"
loop_id=$(wait_for_record armed)
session_id=$(grep -oE '"sessionId":"[^"]*"' "$state/relaunch-$loop_id.json" | cut -d'"' -f4)
printf '{"level":2}\n' > "$state/nudge-$session_id.json"
say "Run the shell command 'echo staying' and reply STAYING."
sleep 30
record_field "$loop_id" disarmReason
cat "$state/nudge-$session_id.json"
~~~

Expected after the withdraw turn: `"disarmReason":"user-message"` and a nudge file that holds `"rearm":{"floor":<number>}`. The floor is the fill at the first assistant message after the withdraw plus 0.05. Now send a second turn that grows the fill:

~~~bash
say "Run the shell command 'echo again' and reply AGAIN."
sleep 30
cat "$state/nudge-$session_id.json"
screen | tail -30
~~~

Expected: the nudge file ends as `{"level":2}`, because the delivered nudge removed `rearm`. Level 2 never nudges again on its own, so the delivery proves the grant. In Pi the nudge arrives as a follow-up turn after the reply, so the pane shows the model starting a handoff turn on its own. In OpenCode it enters the system prompt of the next request, so the model may write a note instead of answering AGAIN. Either way the model may prepare a new hand-over, which is the extra nudge doing its job. End the check with `tmux kill-session -t "$session_name"`.

Evidence: both nudge-file reads and the pane text. PASS when the first read holds `rearm`, the second does not and the model acted on the nudge. FAIL when `rearm` never appears after the withdraw, stays after the second turn or no nudge arrives. Triage: when `rearm` is still there after the second turn, the fill did not grow a step, so send one more tool-calling prompt. For OpenCode, PO-5 captures the system prompt itself.

#### PO-4 Cancel a prepared hand-over (Live)

`cancel` withdraws a pending or armed record from outside the session. The check runs it as soon as the record exists.

~~~bash
start_runtime
say "$first_prompt"
loop_id=$(wait_for_record 'pending|armed')
cli cancel --loop-id "$loop_id"; echo "exit $?"
cli cancel --loop-id "$loop_id"; echo "exit $?"
sleep 8
record_field "$loop_id" disarmReason
cli should-relaunch --loop-id "$loop_id"; echo "exit $?"
grep -E ' (cancel|decline|killer-signal) ' "$state/relaunch.log" | tail -4
cli history --last 1
screen | tail -15
~~~

Expected:

- The first `cancel` prints `cancelled the prepared hand-over for <note file name>; the note stays open` and `exit 0`. The second prints `no prepared hand-over to cancel` and `exit 1`.
- `"disarmReason":"cancelled"`, then `should-relaunch` prints `{"relaunch":false,"reason":"withdrawn",...}` with `exit 1`.
- `relaunch.log` holds `cancel loopId=<id> status=pending` or `status=armed`, whichever the record was in, and no `killer-signal`.
- `history` ends with a `withdrawn` line and the `open notes:` line.
- The pane shows the runtime idle in the same session and no relaunch starts. End it as in PO-2 and read the wrapper: one withdrawn warning and no claim command.

Evidence: the command output, the log lines and the pane. PASS when both exit codes match, the record ends `cancelled` and the session keeps running. FAIL when the first `cancel` exits 1, the second exits 0, a relaunch starts or `should-relaunch` reports `not-armed`. Triage: `cancel` exiting 1 on the first call means the record was already gone, which happens when the killer won the race. Rerun.

#### PO-5 Withdraw run without a terminal (Automatable)

These runs use the runtime's non-interactive mode, a sandbox repository and runtime directory, and a record armed by hand for a session id you control. They touch neither your relaunch state nor your hop history. They send real model requests, so they need working credentials for the runtime.

For Pi, `--session-id` creates a session with the id you name, so the record can be armed before the run. The fake loop id `probe-loop` is enough for a withdraw. Arming through the model's own `prepare` would start a killer, which logs `killer-error` for a loop id that is not a number, and that line is harmless.

~~~bash
repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"
sandbox="$(mktemp -d)"
export XDG_RUNTIME_DIR="$sandbox/run" SESSION_RELAUNCH_REPO_ROOT="$sandbox/repo"
mkdir -p "$XDG_RUNTIME_DIR" "$sandbox/sessions" "$SESSION_RELAUNCH_REPO_ROOT/.skilled/skills/.state/session-relaunch/handoffs"
sid=11111111-2222-4333-8444-555555555555
note="$SESSION_RELAUNCH_REPO_ROOT/.skilled/skills/.state/session-relaunch/handoffs/20260101T000000Z-$sid.md"
printf -- '---\nstatus: open\nsession_id: %s\nloop_id: probe-loop\nruntime: pi\ncwd: %s\nspec_folder: \ncreated_at: 2026-01-01T00:00:00Z\n---\n## Goal\nProbe the Pi withdraw path\n## Done\nNothing.\n## Remaining work\nNothing.\n## In-flight state\nNothing.\n' "$sid" "$sandbox" > "$note"
SID=$sid NOTE=$note node -e "
const core = require('$repo_root/.skilled/hooks/session-relaunch/lib/relaunch-core.cjs');
core.preparePending({ loopId: 'probe-loop', handoffPath: process.env.NOTE, sessionId: process.env.SID, runtime: 'pi', cwd: process.cwd(), hops: 0 });
core.arm({ loopId: 'probe-loop', cwd: process.cwd() });"
state="$XDG_RUNTIME_DIR/skilled-relaunch"
probe_field() { grep -oE "\"$1\":\"[^\"]*\"" "$state/relaunch-probe-loop.json"; }
probe_field status

# run 1: a new turn starts over the armed record
env -u SKILLED_LOOP_HOPS -u SKILLED_LOOP_MANUAL_TEMPLATE SKILLED_LOOP_ID=probe-loop SKILLED_LOOP_RUNTIME=pi SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 \
  pi --offline --approve -ne -e .pi/extensions/session-relaunch.ts --session-dir "$sandbox/sessions" --session-id "$sid" -p "Reply with the single word STAYING." </dev/null
probe_field status; probe_field disarmReason
cat "$state/relaunch.log"
cut -f2,3,6 "$SESSION_RELAUNCH_REPO_ROOT/.skilled/skills/.state/session-relaunch/hop-history.log"
cat "$state/nudge-$sid.json"
~~~

Expected after run 1: `"status":"armed"` before and `"status":"disarmed"` with `"disarmReason":"user-message"` after, an `arm-cancelled loopId=probe-loop sessionId=<sid> reason=user-message` line, a history row `withdrawn	pi	Probe the Pi withdraw path` and a nudge file like `{"level":0,"rearm":{"floor":96.81}}`. The model answers STAYING. Now spend the levels and run a turn that grows the fill:

~~~bash
printf '{"level":2,"rearm":{"floor":%s}}\n' "$(grep -oE '"floor":[0-9.]+' "$state/nudge-$sid.json" | cut -d: -f2)" > "$state/nudge-$sid.json"
env -u SKILLED_LOOP_HOPS -u SKILLED_LOOP_MANUAL_TEMPLATE SKILLED_LOOP_ID=probe-loop SKILLED_LOOP_RUNTIME=pi SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 \
  pi --offline --approve -ne -e .pi/extensions/session-relaunch.ts --session-dir "$sandbox/sessions" --session-id "$sid" -p "Run the shell command 'echo staying' and then reply with the single word DONE." </dev/null
cat "$state/nudge-$sid.json"
grep -c "Context is past the configured window" "$sandbox"/sessions/*.jsonl
rm -rf "$sandbox"
~~~

Expected after run 2: the nudge file reads `{"level":2}` and the session file holds the nudge text once. The model then follows the nudge, so it writes a note under the sandbox and runs `prepare`, and its reply reports that. That is the extra nudge doing its job.

For OpenCode the equivalent runs go through the capture runner, which also records the system prompt of every request. They are the second scenario of `CO-046` in [session-relaunch](../../../cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md). They arm a record for the OpenCode session id that a first run printed, send a second user message to that session with `--session`, and then read the nudge from the captured system prompt.

Evidence: the printed fields, log, history row and nudge file for each run. PASS when run 1 disarms the record with `user-message` and logs `arm-cancelled`, and run 2 delivers the nudge and removes `rearm`. FAIL when the record stays armed, no `arm-cancelled` line appears or the nudge file keeps `rearm` after run 2.

#### PO-6 Withdraw suites (Automatable)

Run both suites and read the named cases:

~~~bash
./.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
node --test .opencode/plugins/tests/session-relaunch.test.cjs .skilled/hooks/session-relaunch/tests/withdraw.test.cjs .skilled/hooks/session-relaunch/tests/hop-history.test.cjs
~~~

Evidence: both commands exit 0 and these cases pass.

- Pi: `agent_start disarms the armed record this session owns`, `agent_start leaves another session's armed record alone`, `agent_start before the arm leaves a pending record pending`, `agent_start lists the withdrawn note in the hop history`, `agent_start grants one more nudge a step above the fill it next sees` and `tells a session whose arm a new turn withdrew not to claim the stale note`.
- OpenCode: `a new user message disarms the armed record it owns`, `a user message in another session leaves the armed record alone`, `a user message before the arm does not disarm`, `a new user message that withdraws an arm lists the note as withdrawn in the hop history`, `a withdrawn arm drops the held nudge and grants one more a step above the fill`, `a compaction after a withdrawn arm tells the session not to claim the stale note` and `the stale-note text ends once the session has updated the withdrawn note`.
- Shared: the `withdraw.test.cjs` cases and `history renders a withdrawn line with the session that withdrew the hand-over`.

PASS when every named case passes. FAIL when a case is missing from the run or fails.

#### Symlinked repository through the shell shim (Live)

Build a repository that links this checkout's `.skilled` and the runtime's config folder, source the shim in a fresh shell and start the plain runtime command there:

~~~bash
repo_root="$(git rev-parse --show-toplevel)"
linked_repo="$(mktemp -d)/linked-repo"
mkdir -p "$linked_repo" && git -C "$linked_repo" init -q
ln -s "$repo_root/.skilled" "$linked_repo/.skilled"
ln -s "$repo_root/.pi" "$linked_repo/.pi"
ln -s "$repo_root/.opencode" "$linked_repo/.opencode"
tmux new-session -d -s shim-pi "zsh -c 'source \"$repo_root/.skilled/bin/skilled-loop-shell.sh\" && cd \"$linked_repo\" && export SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 && pi'"
tmux attach -t shim-pi
~~~

Repeat with `opencode` in place of `pi` and a session name of `shim-opencode`. Evidence: the first session's shell tool prints a loop id for `echo $SKILLED_LOOP_ID`, so the shim started the runtime under the wrapper. The nudge arrives, the record arms, the killer ends the process and the wrapper restarts the runtime with the claim seed in the same pane. PASS when the note reaches done on each runtime. FAIL when `SKILLED_LOOP_ID` is empty, prepare exits 3 or the pane returns to the shell prompt without a relaunch.

### Goal Carry-Over Checks

A hand-over note can carry the sender's goal as a `goal_packet` line. `skilled-loop` exports it as `SESSION_RELAUNCH_GOAL_PACKET` to the relaunched session, and a Pi or OpenCode receiver with no goal of its own binds that packet on its first turn. `SESSION_RELAUNCH_GOAL=0` turns it off, and a dispatched child (`AI_SESSION_CHILD=1`) never binds. These checks run in a throwaway checkout that holds copies of the real hooks, wrapper and goal hooks, because a goal bound in this repository would start real work. The harness is kept with the packet that recorded the runs: `specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/`. The relaunch CLI is refused to a sub-agent, so from an agent session the harness script is what runs `prepare`, against its own note and runtime directory.

#### GR-P1 A Pi hop carries the goal (Live)

Run from the repository root with `tmux`, `node` and `pi` signed in to the `openai` provider:

~~~bash
repo_root="$(git rev-parse --show-toplevel)"
harness="$repo_root/specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness"
sandbox="$(mktemp -d)/sandbox"; out="$(mktemp -d)"
bash "$harness/build-sandbox.sh" pi "$sandbox" 3990 "$repo_root"
bash "$harness/run-hop.sh" pi "$sandbox" "$out" goal
bash "$harness/finish-run.sh" pi "$out"
~~~

`run-hop.sh` starts the sender under `skilled-loop pi -ne -e <session-relaunch> -e <goal-context> --model openai/gpt-6-luna`, types `/goal-pi bind specs/demo/001-demo`, writes a note, runs `prepare`, sends one more prompt so `agent_end` arms, and lets the wrapper relaunch. It drops the host's `SKILLED_LOOP_*` and `SESSION_RELAUNCH_GOAL*` variables, uses its own tmux socket and `XDG_RUNTIME_DIR`, and kills its tmux server on exit. `finish-run.sh` reduces the session logs to an extract and deletes the raw files.

Evidence, read from the receiver and not the sender:

- `summary.txt` shows `note goal_packet line: goal_packet: specs/demo/001-demo`, so `prepare` proved the sender's goal from its goal record.
- The receiver's extract shows a `custom_message/goal-context-restore` entry that names an `[active_goal:<id>]` block, and its id differs from the sender's. `goal-records.txt` lists two records for the packet, the second created at the relaunch.
- `GOALENV.marker` holds `specs/demo/001-demo`, the value the receiver's own `printenv SESSION_RELAUNCH_GOAL_PACKET` printed. `GOALSEEN.marker` is the model's own report and weaker than the extract.

PASS when all three hold. FAIL when the receiver's session log has no goal block, when `goal-records.txt` shows no second record or when the note never leaves `open`.

#### GR-P2 The controls leave the receiver with no goal (Live)

~~~bash
bash "$harness/build-sandbox.sh" pi "$sandbox-b" 3990 "$repo_root"
bash "$harness/run-hop.sh" pi "$sandbox-b" "$out-b" switch-off SESSION_RELAUNCH_GOAL=0
bash "$harness/build-sandbox.sh" pi "$sandbox-c" 3990 "$repo_root"
NO_GOAL=1 bash "$harness/run-hop.sh" pi "$sandbox-c" "$out-c" no-goal
~~~

In the switch-off run the note keeps its `goal_packet` line, because only the launch environment is switched off. The receiver has no goal block in its log, `goal-records.txt` still lists only the sender's record and `GOALENV.marker` holds `EMPTY`. In the no-goal run the sender never bound a goal, so the note has no `goal_packet` line and the store holds no record. Both controls claim and complete the note.

PASS when both receivers have no goal block and `GOALENV.marker` holds `EMPTY`. FAIL when either receiver binds a goal.

#### GR-O1 An OpenCode hop (Live, FAIL 2026-10-25 on OpenCode 2.1.4)

OpenCode 2 is a TUI that talks to a server, and the harness starts it with `--standalone` so the server is private. The sender's `prepare` wrote the `goal_packet` line from its goal record, the killer logged `killer-signal`, and no `relaunch` line followed: the TUI stayed up showing `Connection lost... Reconnecting to the server automatically` and the note stayed `open`. The plugin passes its own `process.pid` to the killer, and the likely cause is that this pid belongs to the server child and not to the TUI. That cause is inferred from the process tree and the plugin source, so confirm it by capturing the tree before the kill. `skilled-loop` also relaunches with `-m <model>`, which the OpenCode 2 root command rejects, so a hop that carries a model fails there as well. Run it again with the harness once a hop reaches OpenCode 2:

~~~bash
bash "$harness/build-sandbox.sh" opencode "$sandbox" 3990 "$repo_root"
bash "$harness/run-hop.sh" opencode "$sandbox" "$out" goal
~~~

PASS needs the same three signals as GR-P1, with the `goal_packet` line, a second goal record and `GOALENV.marker` holding the packet. FAIL when the killer logs a signal and no `relaunch` line follows.

#### GR-O2 An OpenCode receiver binds the packet (Live, receiver half only)

This check is not a hop. It starts one OpenCode 2 session with the hand-over variable set by hand and reads what the session says and what the goal store holds:

~~~bash
bash "$harness/build-sandbox.sh" opencode "$sandbox" 3990 "$repo_root"
bash "$harness/run-oc-receiver.sh" "$sandbox" "$out" SESSION_RELAUNCH_GOAL_PACKET=specs/demo/001-demo
~~~

Evidence: the model quotes an `[active_goal:<id>]` line whose id matches the one record in `goal-records.txt`, with `packetPath=specs/demo/001-demo`. Repeat with `SESSION_RELAUNCH_GOAL=0` added and with no packet: both must answer `NONE` and leave the store empty.

PASS when the three runs match. FAIL when a control binds a goal or the packet run binds none.

#### GR-P3 Goal carry-over suites (Automatable)

~~~bash
node --test \
  .skilled/hooks/goal/lib/goal-core.test.cjs \
  .skilled/hooks/goal/pi/goal-pi.test.mjs \
  .opencode/plugins/tests/opencode-goal-handover.test.cjs \
  .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs
~~~

Evidence: exit code 0 and these cases pass.

- `goal-pi.test.mjs`: `a receiver with no goal is bound to the hand-over packet at session start and injects from goal.md`, `a goal of the session own is never replaced, and a cleared one is not handed back` and `a dispatched child session that inherited the packet binds nothing in Pi`.
- `opencode-goal-handover.test.cjs`: `a receiver with no goal is bound to the hand-over packet at session start and injects from goal.md`, `no variable, an empty one or the switch off binds nothing` and `a dispatched child process binds nothing, even as the first top-level session it sees`.
- `goal-core.test.cjs`: `a dispatched child session binds nothing, whatever packet its environment carries` and `the kill switch stops the hand-over bind and the plain bind keeps its own semantics`.
- `skilled-loop.test.cjs`: `wrapper drops the previous hop goal packet when the next note carries none`.

PASS when the command exits 0 and each named case ran. FAIL when a case is missing or fails.

#### Recorded Results, 2026-10-25

Pi 1.4.0 with `openai/gpt-6-luna` and OpenCode 2.1.4, live in tmux with a private runtime directory per run. Evidence lives in `specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/`.

| Run | Result | Receiver | Evidence folder |
|---|---|---|---|
| Pi goal (GR-P1) | Pass | `goal-context-restore` named a goal id different from the sender's, two records, `GOALENV.marker` is the packet, note `done` | `pi-a-goal/` |
| Pi switch off (GR-P2) | Pass | Note carried the packet, no goal block in the receiver log, one record, `GOALENV.marker` is `EMPTY`, note `done` | `pi-b-switch-off/` |
| Pi switch off at `prepare` too | Pass | Note carried no packet, no goal block in the receiver log | `pi-b2-switch-off-at-prepare/` |
| Pi no goal (GR-P2) | Pass | No `goal_packet`, no records, no goal block, note `done` | `pi-c-no-goal/` |
| OpenCode hop (GR-O1) | Fail | Killer signalled, no relaunch, note stayed `open` | `opencode-a-hop-attempt/`, `opencode-process-tree.txt` |
| OpenCode receiver, goal (GR-O2) | Pass, receiver half only | Model quoted the goal id of the one record | `opencode-receiver-a-goal/` |
| OpenCode receiver, switch off and no goal (GR-O2) | Pass, receiver half only | Model answered `NONE`, no record | `opencode-receiver-b-switch-off/`, `opencode-receiver-c-no-goal/` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root index and execution verdict rules. |
| `../../feature-catalog/context-preservation/session-relaunch-loop.md` | Shared handoff implementation and runtime coverage. |
| `../../../cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md` | OpenCode runner scenario with the withdraw and extra-nudge steps. |
| `../../../../hooks/session-relaunch/README.md` | Adapter matrix, launch syntax and known live-TUI limits. |
| `../../../../../specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md` | Section 11 contract for events and seed syntax. |
| `../../../../../specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/scratch/spike/SPIKE-REPORT.md` | Adapter spike verdicts and UNVERIFIED items. |
| `../../../../../specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md` | Recorded Pi smoke and pre-existing `--fast` conflict. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Pi event adapter, including the withdraw of an armed record on `agent_start`. |
| `.opencode/plugins/session-relaunch.js` | OpenCode plugin adapter, including the withdraw of an armed record on a new user message. |
| `.skilled/hooks/session-relaunch/lib/withdraw.cjs` | Calls off a prepared hand-over for every runtime and `cancel`: a guarded disarm, the extra nudge and the withdrawn history line. |
| `.skilled/hooks/session-relaunch/lib/hop-history.cjs` | Records each hop event, prints the history and lists withdrawn notes apart from unclaimed ones. |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Shared nudge and seed text. |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Shared runtime usage and window calculations. |
| `.skilled/bin/skilled-loop` | Runtime selection, environment export and relaunch arguments. |
| `.skilled/bin/skilled-loop-shell.sh` | Starts a plain `pi` or `opencode` launch under the nearest wrapper, a symlinked `.skilled` included. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Shell shim resolution and terminal hand-off tests. |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Pi adapter regression suite. |
| `.opencode/plugins/tests/session-relaunch.test.cjs` | OpenCode adapter regression suite. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Wrapper runtime relaunch argument tests. |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Prepare runtime recording and cancel tests. |
| `.skilled/hooks/session-relaunch/tests/withdraw.test.cjs` | Shared withdraw helper tests. |
| `.skilled/hooks/session-relaunch/tests/hop-history.test.cjs` | Hop history, history command and withdrawn-note tests. |
| `.skilled/hooks/goal/pi/goal-context.ts` | Pi goal extension: binds the hand-over packet at `session_start` and the first `input`. |
| `.opencode/plugins/opencode-goal.js` | OpenCode goal plugin: binds the hand-over packet at `session.created`. |
| `specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/` | The throwaway-checkout harness behind the goal carry-over checks and their recorded runs. |

Provenance: .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts

---

## 5. SOURCE METADATA

- Group: Plugins and Hooks
- Playbook ID: session-relaunch-pi-opencode
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/session-relaunch-pi-opencode.md`

Related references:
- [Session relaunch feature entry](../../feature-catalog/context-preservation/session-relaunch-loop.md)
- [Claude session relaunch scenarios](session-relaunch-claude.md)
