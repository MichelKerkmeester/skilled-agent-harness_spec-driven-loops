---
title: "Codex, Cursor, Hermes and Devin Session Relaunch"
description: "Automatable and live scenarios for the Codex and Hermes session-relaunch adapters, the Cursor and Devin command-trigger runtimes, the hop history and calling off a prepared hand-over."
trigger_phrases:
  - "Codex session relaunch"
  - "Cursor session relaunch"
  - "Hermes session relaunch"
  - "Devin session relaunch"
  - "session-relaunch-command-runtimes"
  - "skilled-loop codex"
  - "skilled-loop hermes"
version: 1.0.9.0
id: session-relaunch-command-runtimes
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# Codex, Cursor, Hermes and Devin Session Relaunch

---

## 1. OVERVIEW

This scenario covers Codex and Hermes automatic adapters and the Cursor and Devin `/speckit:handoff` command-trigger paths. Automatable checks cover the Codex and Hermes adapter suites, the shared nudge suite and the stub-runtime wrapper suite. Live tmux checks observe a handoff through each runtime.

### Why This Matters

Each runtime uses a different seed argument form, and only two of the four have an automatic arm event. A live run confirms the host delivers the events each adapter needs and the restarted runtime claims the prepared handoff, or that the command-trigger path gives the operator a working manual hop.

---

## 2. SCENARIO CONTRACT

This scenario defines four automatable checks and one live check per runtime. The recorded-results table below captures the operator outcomes from 2026-10-18. A live check marked SKIP was omitted by operator decision.

- Objective: Verify Codex and Hermes adapter loading, event handling, seed injection and matching record arming, verify the Cursor and Devin wrapper arms plus the `/speckit:handoff` command-trigger hop, and verify that a Codex operator prompt or `cancel` calls off a prepared hand-over and that the hop history records the hop.
- Real user request: Carry a short task through a context handoff in Codex or Hermes, or through the handoff command in Cursor or Devin, then finish it in the new session.
- Prompt: `Carry this short task through a context handoff, then finish it in the new session. Tell me when you are ready.`
- Expected execution process: Run the Codex and Hermes adapter suites, the shared nudge suite and the stub-runtime wrapper suite. Then start each runtime in its own tmux session with a low hop cap and follow the generated handoff. The nudge's prepare command includes `--runtime <name>`. On Cursor and Devin, run `/speckit:handoff` and start the hop with the selected runtime's claim command printed by the CLI.
- Expected signals: Automatable commands exit 0. The stub-runtime suite records `codex --no-daemon -m <model> <seed>`, `cursor-agent --model <model> <seed>`, `hermes chat --provider <p> -m <model> -q <seed>` and `devin --model <model> -- <seed>` on relaunch, with valid model and provider values carried on every hop and no resume-family flag passed. Model, name, Pi extension and Pi or Hermes provider scans leave values equal to `--` or starting with `-` in the first launch's arguments and leave them out of relaunch arguments. Each live automatic run arms its matching record and restarts with the claim seed. Each command-trigger run produces a note, a pending record and a runtime-specific manual claim command. If a runtime exits with a record still pending, the wrapper prints its runtime-specific manual command, consumes the record and preserves the runtime exit code. If it cannot decode the record returned by `should-relaunch`, it prints `warning: could not read the relaunch record` and consumes the record. On an approved hop the wrapper relaunches the runtime with the seed. It exits 1 for an unreadable or empty record, which prints no manual claim command. It also exits 1 for an empty cwd, a line break in the cwd or handoff path, or a failed `cd`, and prints the manual claim command in those cases. A runtime exit of 130 prints the manual claim command and exits 130. On a decline the wrapper exits with the runtime's own exit code and prints the manual claim command only for the `not-armed`, `stale` and `hop-cap` reasons. A `withdrawn` decline, where the session called its hand-over off, prints one warning line and no manual claim command. On Codex an operator prompt withdraws an armed record, `should-relaunch` reports `withdrawn`, the session earns one more nudge a step above its fill and `history` shows a `withdrawn` line. A hop shows `handed-over (hop 1)`, `claimed ... by <id>` and `done`. Keep `SESSION_RELAUNCH_THRESHOLD` well above a fresh session's startup fill plus its remaining work. Codex live runs chained at `0.12` because each fresh session reached about 10% on startup alone. `SESSION_RELAUNCH_MAX_HOPS` caps completed relaunches.
- Desired user-visible outcome: The receiving session claims the same handoff and continues the unfinished task.
- Pass/fail: PASS if all four automatable checks pass and each live run that was run shows the matching runtime restart and claim seed, or the command-trigger hop delivering the claim seed by hand, and the Codex checks CX-1 to CX-5 meet their signals. Record an operator-directed SKIP for a live check that was not run. FAIL if a smoke or suite exits non-zero, the wrapper uses the wrong runtime arguments, a live run does not reach the expected handoff or an operator prompt leaves an armed Codex record in place.

---

## 3. TEST EXECUTION

### Primary Scenario

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|---|
| session-relaunch-command-runtimes | Codex, Cursor, Hermes and Devin session relaunch | Run four automatable checks and one live check per runtime. | Carry this short task through a context handoff, then finish it in the new session. Tell me when you are ready. | Codex adapter suite -> Hermes adapter suite -> shared nudge suite -> stub-runtime wrapper suite -> live Codex tmux hop -> live Hermes tmux hop -> live Cursor command hop -> live Devin command hop | Automatable commands exit 0. The stub suite records the four relaunch argv forms with valid model and provider values carried and no resume flags. Codex and Hermes live runs arm the matching record and restart with the claim seed. Cursor and Devin produce a note, a pending record and a printed runtime-specific manual command. | Capture command output and exit codes. For each live run capture the tmux transcript, runtime log entries and handoff status from open through claimed. | PASS when every automated check exits 0 and each live check reaches the claim seed by its runtime's trigger. FAIL when an automated check fails, a runtime is mismatched or a live claim seed is not delivered. | 1. Confirm the adapter path and host smoke command. 2. Check adapter event logs and the matching runtime field in the pending record. 3. Check the killer result, hop limit and runtime-specific seed arguments. 4. On command-only runtimes, confirm prepare printed the manual claim command. |

### Automatable Checks

#### Codex adapter suite (Automatable)

~~~bash
node --test .skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs
~~~

Evidence: the suite covers the `UserPromptSubmit` seed path with the carried spec folder, the once-at-threshold and threshold-plus-0.05 nudges on `PostToolUse`, the nudge that stays silent while this session already has a prepared handoff or at the hop limit, unique adapter registration per event, `Stop` arming with the rollout transcript and the kill switch. PASS when every case passes.

#### Hermes adapter suite (Automatable)

~~~bash
node --test .skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs
~~~

Evidence: the suite covers the captured payload fixtures, the Hermes usage fill that counts input and cache tokens and never output, the seed first turn, threshold levels, window-source resolution, `on_session_end` arming with the ancestor pid lookup, pending restore on a failed killer spawn and the kill switch. PASS when every case passes.

#### Shared nudge suite (Automatable)

~~~bash
node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs
~~~

Evidence: the suite covers the shared handoff and seed text, the level rule and `specFolderFromSeed` parsing used by every new adapter. PASS when every case passes.

#### Stub-runtime wrapper arms (Automatable)

~~~bash
node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs
~~~

Evidence: the suite installs stub executables for `claude`, `pi`, `opencode`, `codex`, `cursor-agent`, `hermes` and `devin` into a sandbox bin directory, then records each launch's runtime, arguments and loop environment in `runtime-record.jsonl`. The command-runtime cases assert `codex --no-daemon -m <model> <seed>`, `cursor-agent --model <model> <seed>`, `hermes chat --provider <provider> -m <model> -q <seed>` and `devin --model <model> -- <seed>` on relaunch, valid model and provider values carried on every hop, and none of `resume`, `fork`, `exec`, `queue`, `--resume`, `-r`, `--continue`, `-c`, `--session`, `--create-if-missing`, `--in`, `--no-restore-cwd`, `ls` or a name flag reaching the relaunch arguments. PASS when every case passes.

#### Shell shim resolution (Automatable)

~~~bash
node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs
~~~

Evidence: all 16 tests pass under bash and zsh, including the case where only a wrapped `hermes` launch gets `HERMES_ENABLE_PROJECT_PLUGINS=1`. Plain `codex`, `codex resume --last`, `hermes`, `hermes chat -q <prompt>`, `cursor-agent`, `cursor-agent agent <prompt>`, `devin` and `devin -- <prompt>` resolve the wrapper through a symlinked `.skilled`. `codex exec`, `codex review`, `hermes -z`, `hermes chat --oneshot`, `hermes setup`, `cursor-agent -p`, `cursor-agent login`, `devin -p`, `devin doctor` and `devin <path>` resolve nothing. `cursor-agent` resolves to the wrapper's `cursor` arm. PASS when the run reports 0 failures.

### Live Checks

The example launches override the threshold and window-token limit. `SESSION_RELAUNCH_MAX_HOPS` sets the chain length. Submit the exact prompt from the scenario contract. Follow the adapter's generated handoff and `prepare` instructions. Observe the record arm, process handoff and claim seed in the receiving session. Results below record each operator-run outcome.

#### Recorded Results

Two 2026-10-19 benchmark reports hold the outcomes, operator inputs and evidence paths for the Codex live check: [`2026-10-19--manual-testing-playbook--session-relaunch-final-code/`](../../benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-final-code/README.md) records the final-code round, and [`2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/`](../../benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/README.md) records the earlier runs made while the gaps were being fixed. A third record, [`2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/`](../../benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/README.md), covers the run with no Gate 3 answer on Claude, Pi and OpenCode, not Codex. Codex and Devin passed live checks. Hermes and Cursor were not run by operator decision.

| Runtime | Run date | Result | `relaunch.log` evidence | Operator inputs |
|---|---|---|---|---|
| Codex | 2026-10-18 | PASS | Two hops, each note `open -> claimed -> done`, claimed unaided with Gate 3 Skip carried | Threshold `0.25` |
| Hermes | Not run | SKIP | Not run by operator decision | Operator decision |
| Cursor | Not run | SKIP | Not run by operator decision | Operator decision |
| Devin | 2026-10-18 | PASS | Handoff note moved `open -> claimed -> done` | Model `swe-2-max` |

#### Live Codex hop in tmux (Live, PASS 2026-10-18)

Run from the repository root:

~~~bash
set -euo pipefail
repo_root=$PWD
session_name="session-relaunch-codex-$$"
tmux_command="cd '$repo_root' && PATH='$repo_root/.skilled/bin':\$PATH SESSION_RELAUNCH_THRESHOLD=0.25 SESSION_RELAUNCH_MAX_HOPS=4 skilled-loop codex -m gpt-6-luna"
tmux new-session -d -s "$session_name" "$tmux_command"
tmux attach -t "$session_name"
~~~

Observe the `UserPromptSubmit` or `PostToolUse` nudge, `Stop` arming with the rollout transcript, the killer ending the Codex process and the wrapper restarting `codex --no-daemon -m <model> "<seed>"`. The check's recorded run used Codex's own context window and completed two hops, and each of its notes went `open -> claimed -> done` without operator help and with Gate 3 Skip carried. An earlier run at `0.12` chained four hops but never finished the task, because each fresh session's startup alone reached about 10%. A re-nudge keeps the note path the session already has open, so the follow-up instructions name an existing open note instead of a fresh path. If a hook cannot resolve its adapter, the event still answers. Every session-relaunch Codex registration carries a drift fallback: `Stop` prints `{"systemMessage": ...}` and the prompt and tool-use hooks keep `hookSpecificOutput`, because Codex rejects an unknown key such as `mkHookDrift`.

#### Live Hermes hop in tmux (Live, SKIP 2026-10-18)

Operator decision: this live check was not run. For a future run, start from the repository root. Hermes needs `HERMES_ENABLE_PROJECT_PLUGINS=1` and `repo-guards` under `plugins.enabled` in the user config, the same operator steps `.hermes/SYNC.md` documents.

~~~bash
set -euo pipefail
repo_root=$PWD
session_name="session-relaunch-hermes-$$"
tmux_command="cd '$repo_root' && PATH='$repo_root/.skilled/bin':\$PATH HERMES_ENABLE_PROJECT_PLUGINS=1 SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 skilled-loop hermes chat --provider llmgateway -m gpt-6-luna"
tmux new-session -d -s "$session_name" "$tmux_command"
tmux attach -t "$session_name"
~~~

Observe `post_api_request` usage recording, the `pre_llm_call` nudge on the next prompt, `on_session_end` arming after a message ends and the wrapper restarting `hermes chat --provider llmgateway -m <model> -q "<seed>"`. Confirm the receiving session claims the note and continues the task.

#### Live Cursor hop by command (Live, SKIP 2026-10-18)

Operator decision: this live check was not run. Cursor is command-only: its spike evidence is source-only and `stop` is not wired in the repo's `.cursor/hooks.json`. For a future run, start from the repository root:

~~~bash
set -euo pipefail
repo_root=$PWD
session_name="session-relaunch-cursor-$$"
tmux_command="cd '$repo_root' && PATH='$repo_root/.skilled/bin':\$PATH SESSION_RELAUNCH_MAX_HOPS=1 skilled-loop cursor"
tmux new-session -d -s "$session_name" "$tmux_command"
tmux attach -t "$session_name"
~~~

Run `/speckit:handoff` inside the session. Confirm the note is written and prepare records a pending record. Because no Cursor arm event is wired, end the session and start the hop by hand with the command printed by `prepare --handoff <note-path> --runtime cursor`: `skilled-loop cursor "[session-relaunch] claim and continue handoff <note-path>"`. If the path contains `!`, keep the printed `"'!'"` quote sequence intact so interactive Bash preserves it when history expansion is on. Confirm the receiving `cursor-agent` session claims the note and continues the task. If `cursor-agent` still fails authentication on this machine, record the run as SKIP with the credential blocker, matching the spike's caveat.

#### Live Devin hop by command (Live, PASS 2026-10-18)

Devin is command-only: its hook usage is unverified. There is no command surface, so a Devin session reads `.skilled/commands/speckit/handoff.md` directly and follows it. Run from the repository root:

~~~bash
set -euo pipefail
repo_root=$PWD
session_name="session-relaunch-devin-$$"
tmux_command="cd '$repo_root' && PATH='$repo_root/.skilled/bin':\$PATH SESSION_RELAUNCH_MAX_HOPS=1 skilled-loop devin --model swe-2-max"
tmux new-session -d -s "$session_name" "$tmux_command"
tmux attach -t "$session_name"
~~~

The live Devin command hop passed on 2026-10-18 with model `swe-2-max`. The handoff note moved `open -> claimed -> done`. For a future run, use `/speckit:handoff`, end the session and start the hop by hand with the command printed by `prepare --handoff <note-path> --runtime devin`: `skilled-loop devin -- "[session-relaunch] claim and continue handoff <note-path>"`. The `--` is required because Devin treats a bare positional value as a workspace path. If the path contains `!`, keep the printed `"'!'"` quote sequence intact so interactive Bash preserves it when history expansion is on.

#### Symlinked repository through the shell shim (Live)

Build a repository that links this checkout's `.skilled` and the runtime's config folder, source the shim in a fresh shell and start the plain runtime command there:

~~~bash
repo_root="$(git rev-parse --show-toplevel)"
linked_repo="$(mktemp -d)/linked-repo"
mkdir -p "$linked_repo" && git -C "$linked_repo" init -q
for folder in .skilled .codex .hermes .cursor .devin; do ln -s "$repo_root/$folder" "$linked_repo/$folder"; done
tmux new-session -d -s shim-codex "zsh -c 'source \"$repo_root/.skilled/bin/skilled-loop-shell.sh\" && cd \"$linked_repo\" && export SESSION_RELAUNCH_THRESHOLD=0.25 SESSION_RELAUNCH_MAX_HOPS=1 && codex -m gpt-6-luna'"
tmux attach -t shim-codex
~~~

Repeat with `hermes chat --provider llmgateway -m gpt-6-luna`, which the shim starts with `HERMES_ENABLE_PROJECT_PLUGINS=1`, `cursor-agent` and `devin --model swe-2-max` in place of the Codex command. Codex and Hermes hop on their own: the nudge arrives, the record arms and the wrapper restarts the runtime with the claim seed in the same pane. Cursor and Devin are command-only: run `/speckit:handoff`, end the session and confirm the wrapper prints the manual claim command when the runtime exits, which proves the plain command started under the wrapper. In every case the first session's shell tool prints a loop id for `echo $SKILLED_LOOP_ID`. PASS when Codex and Hermes reach a done note and Cursor and Devin print the wrapper's manual claim command at exit. FAIL when `SKILLED_LOOP_ID` is empty or prepare exits 3. Record a runtime as SKIP when its credentials block the launch.

### Codex Withdraw, Cancel And History Checks

These checks call a Codex hand-over off, or let it run, and read the result from the record, the logs and the hop history. Codex runs through `skilled-loop` in a detached tmux session so one shell can type into it and read it. The code paths are covered by the suites listed under CX-5. The live steps were authored from that code and the sandbox probe in CX-4, so record your own run before you rely on a timing.

What applies to each runtime in this file:

| Runtime | Prompt withdraws a hand-over | `cancel` | Notes |
|---|---|---|---|
| Codex | Yes, an armed record, on any prompt that is not a seed | Yes | Codex delivers no background-task completions as prompts, so there is no `<task-notification>` case |
| Hermes | No, its adapter does not withdraw | Yes | Its hand-over is armed at session end, so `cancel` is the only way to call it off |
| Cursor and Devin | Not applicable, nothing arms the record | Yes | A cancelled pending record makes the wrapper print the withdrawn warning instead of the manual claim command |

#### CX-0 Live setup shared by CX-1 to CX-3 (Live)

Run from the repository root with `tmux`, `node` and a Codex install that has the repository hooks in `.codex/hooks.json`. A shell that is itself inside a loop works, because the launch command drops the inherited hop count. Paste this block once per shell:

~~~bash
repo_root="$(git rev-parse --show-toplevel)"
if [ -n "${XDG_RUNTIME_DIR:-}" ]; then state="$XDG_RUNTIME_DIR/skilled-relaunch"; else state="${TMPDIR:-/tmp}/skilled-relaunch-$(id -u)"; fi
cli() { node "$repo_root/.skilled/hooks/session-relaunch/bin/session-relaunch.cjs" "$@"; }
session_name="relaunch-codex-$$"

start_codex() {
  tmux new-session -d -s "$session_name" "cd '$repo_root' && env -u SKILLED_LOOP_HOPS SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 bash .skilled/bin/skilled-loop codex -m gpt-6-luna"
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

`SESSION_RELAUNCH_THRESHOLD=0.05` and `SESSION_RELAUNCH_WINDOW_TOKENS=100` are test overrides that make the first tool call cross the threshold, and `SESSION_RELAUNCH_MAX_HOPS=1` stops the chain after one hop, because the receiving session would otherwise nudge at once as well. Codex shows an approval prompt for shell commands. Answer it in `tmux attach -t "$session_name"` (detach with Ctrl-B then D) or start Codex with the approval options you normally use. The files the checks read:

| Path | Holds |
|---|---|
| `$state/relaunch.log` | One line per hook, wrapper and killer event |
| `$state/relaunch-<loop id>.json` | The relaunch record. The loop id is the wrapper's pid |
| `$state/nudge-<session id>.json` | The session's nudge level and any extra nudge it is owed (`rearm`) |
| `.skilled/skills/.state/session-relaunch/hop-history.log` | The persistent hop history that `history` prints |
| `.skilled/skills/.state/session-relaunch/handoffs/` | The handoff notes |

Run one check at a time and only one looped session at once, because `wait_for_record` takes the first record it finds. Every check leaves a gitignored note and history lines behind. End each check with `tmux kill-session -t "$session_name"`.

#### CX-1 Hop history after a live Codex hop (Live)

Run the live Codex hop above, or start Codex with `start_codex` and say: `Gate 3 is answered: D) Skip. Run the shell command 'echo probe'. When the [session-relaunch] instructions arrive, follow them: write the note with spec_folder none, run prepare and end your turn.` Let the receiving session claim and complete the note, then read the history:

~~~bash
cli history --last 3
~~~

Expected, with the time and your folder name in place of the examples:

~~~text
2026-10-24T15:06:21.723Z  handed-over  codex     my-repo (hop 1)  <first line of the note Goal>  [<stamp>-<sender session id>.md]
2026-10-24T15:06:21.856Z  claimed      codex     my-repo by 019a2c4e  <same Goal>  [<same note>]
2026-10-24T15:06:21.909Z  done         codex     my-repo  <same Goal>  [<same note>]
~~~

The `handed-over` line comes from the wrapper, which writes it through `hand-over --handoff <note> --hop 1 --runtime codex` only after it read an open note. Codex has no session-id variable, so the receiving session passes its own id to `claim --session`, and the `by <id>` value is the first eight characters of that id. `relaunch.log` holds `prepare loopId=<id> status=pending`, then `relaunch loopId=<id> reason=ready`.

Evidence: the three history lines and the two log lines. PASS when the three lines name the same note in the order `handed-over`, `claimed`, `done`, the `handed-over` line carries `(hop 1)` and the `by <id>` value differs from the sender's id in the note file name. FAIL when a line is missing, when `claimed` shows no `by <id>` or when a `handed-over` line exists for a hop the wrapper declined.

#### CX-2 An operator prompt withdraws an armed hand-over and the extra nudge arrives (Live)

Stop arms the record, and the killer ends the session after the rollout has been quiet for 3 s. A prompt typed inside that window must withdraw the record, so the check types it as soon as the record is armed. It also spends the session's nudge levels first, so a nudge can only come from the extra one.

~~~bash
start_codex
say "Gate 3 is answered: D) Skip. Run the shell command 'echo probe'. When the [session-relaunch] instructions arrive, follow them: write the note with spec_folder none, run prepare and end your turn."
loop_id=$(wait_for_record armed)
session_id=$(grep -oE '"sessionId":"[^"]*"' "$state/relaunch-$loop_id.json" | cut -d'"' -f4)
printf '{"level":2}\n' > "$state/nudge-$session_id.json"
say "Run the shell command 'echo staying'. Then quote, word for word, the first sentence of every [session-relaunch] message you received since my last message, and reply STAYING."
sleep 30
record_field "$loop_id" status; record_field "$loop_id" disarmReason
cli should-relaunch --loop-id "$loop_id"; echo "exit $?"
grep -E ' (withdrawn|killer-signal|relaunch) ' "$state/relaunch.log" | tail -5
cat "$state/nudge-$session_id.json"
cli history --last 2
screen | tail -30
~~~

Expected:

- The record reads `"status":"disarmed"` and `"disarmReason":"user-message"`.
- `should-relaunch` prints `{"relaunch":false,"reason":"withdrawn",...}` and `exit 1`.
- `relaunch.log` holds `withdrawn loopId=<id> sessionId=<id> reason=user-message` and no `killer-signal` line after it.
- Codex quotes two sentences. The first is the withdraw notice, `The prepared hand-over was withdrawn because a new prompt arrived before it took effect.` The second is the extra nudge, `Context is past the configured window (over 100% full).` Level 2 never nudges again on its own, so the second sentence proves the grant.
- The nudge file ends as `{"level":2}`. Right after the withdraw it held a `rearm` field, and the nudge that was delivered removed it.
- `history` ends with a `withdrawn` line that carries `by <first eight characters of the session id>`, then `open notes: 1 withdrawn note still with its session`.

Then end the session and read the wrapper:

~~~bash
say "/quit"
sleep 5
screen | grep -E 'warning|claim and continue'
tmux display -p -t "$session_name" '#{pane_dead_status}'
~~~

Expected: one line `warning: the prepared hand-over was withdrawn in the session; <note path> stays open and out of date`, no line that carries `claim and continue handoff` (the manual claim command) and `0` for the pane status.

Evidence: the command output, the pane text and `relaunch.log`. PASS when the record is disarmed with `user-message`, the prompt carried the notice, the tool call carried the extra nudge, the session kept running and the wrapper printed the single warning without a claim command. FAIL when the record stays armed, the log shows `killer-signal`, a second Codex starts with a seed, no extra nudge arrives or the nudge file still holds `rearm` after Codex quoted the nudge. Triage: if the pane shows the relaunch already, the prompt landed after the 3 s idle wait, so rerun. If `wait_for_record armed` never returns, read `relaunch.log` for `stop-arm-error`, `missing-transcript-path` or `prepare-declined`. If the quote lists only the notice, the tool call finished before the fill grew a step, so send one more prompt that runs a tool.

#### CX-3 Cancel a prepared Codex hand-over (Live)

`cancel` withdraws a pending or armed record from outside the session. The check runs it as soon as the record exists.

~~~bash
start_codex
say "Gate 3 is answered: D) Skip. Run the shell command 'echo probe'. When the [session-relaunch] instructions arrive, follow them: write the note with spec_folder none, run prepare and end your turn."
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
- The pane shows Codex idle in the same session and no relaunch starts. End it with `say "/quit"` and read the wrapper as in CX-2: one withdrawn warning and no claim command.

Evidence: the command output, the log lines and the pane. PASS when both exit codes match, the record ends `cancelled` and the session keeps running. FAIL when the first `cancel` exits 1, the second exits 0, a relaunch starts or `should-relaunch` reports `not-armed`. Triage: `cancel` exiting 1 on the first call means the record was already gone, which happens when the killer won the race. Rerun.

#### CX-4 Withdraw and cancel probe without a model (Automatable)

This probe feeds real hook payloads to the Codex prompt adapter in a sandbox repository and runtime directory, so it touches neither your relaunch state nor your hop history. It checks the Codex rules for an operator prompt over a pending record, a seed prompt over an armed one, an operator prompt over an armed one and `cancel`. Run it from the main session. The Claude sub-agent guard denies `prepare`, `claim`, `keep` and `complete` commands from a sub-agent.

~~~bash
bash <<'BASH'
set -euo pipefail
repo_root="$(git rev-parse --show-toplevel)"
sandbox="$(mktemp -d)"
trap 'rm -rf "$sandbox"' EXIT
unset SKILLED_LOOP_HOPS SKILLED_LOOP_MANUAL_TEMPLATE SKILLED_LOOP_NAME SKILLED_LOOP_MODEL SKILLED_LOOP_PROVIDER
export XDG_RUNTIME_DIR="$sandbox/run" SESSION_RELAUNCH_REPO_ROOT="$sandbox/repo" SKILLED_LOOP_ID=$$ SKILLED_LOOP_RUNTIME=codex
mkdir -p "$XDG_RUNTIME_DIR" "$SESSION_RELAUNCH_REPO_ROOT/.skilled/skills/.state/session-relaunch/handoffs"
hooks="$repo_root/.skilled/hooks/session-relaunch"
cli() { node "$hooks/bin/session-relaunch.cjs" "$@"; }
state="$XDG_RUNTIME_DIR/skilled-relaunch"
record="$state/relaunch-$SKILLED_LOOP_ID.json"
sid=probe-codex-0001
note="$SESSION_RELAUNCH_REPO_ROOT/.skilled/skills/.state/session-relaunch/handoffs/20260101T000000Z-$sid.md"
printf -- '---\nstatus: open\nsession_id: %s\nloop_id: %s\nruntime: codex\ncwd: %s\nspec_folder: \ncreated_at: 2026-01-01T00:00:00Z\n---\n## Goal\nProbe the withdraw path\n## Done\nNothing.\n## Remaining work\nNothing.\n## In-flight state\nNothing.\n' "$sid" "$SKILLED_LOOP_ID" "$sandbox" > "$note"

check() { if eval "$2"; then echo "PASS: $1"; else echo "FAIL: $1"; exit 1; fi; }
prompt() { printf '{"hook_event_name":"UserPromptSubmit","session_id":"%s","cwd":"%s","prompt":"%s"}' "$sid" "$sandbox" "$1" | node "$hooks/codex/prompt-seed.mjs"; }
arm() { node -e "require('$hooks/lib/relaunch-core.cjs').arm({loopId: process.env.SKILLED_LOOP_ID, cwd: '$sandbox'})"; }

cli prepare --handoff "$note" --session "$sid" --runtime codex > /dev/null
check "an operator prompt leaves a pending record alone" \
  'prompt "keep going" > /dev/null && grep -q "\"status\":\"pending\"" "$record"'
arm
check "a seed prompt leaves an armed record alone" \
  'prompt "[session-relaunch] claim and continue handoff $note" > /dev/null && grep -q "\"status\":\"armed\"" "$record"'
out="$(prompt "keep going, one more thing")"
check "an operator prompt withdraws the armed record" \
  'grep -q "\"disarmReason\":\"user-message\"" "$record"'
check "the session is told it was withdrawn" \
  'printf "%s" "$out" | grep -q "The prepared hand-over was withdrawn"'
decision="$(cli should-relaunch --loop-id "$SKILLED_LOOP_ID")" && status=0 || status=$?
check "should-relaunch reports withdrawn and exits 1" \
  '[ "$status" = 1 ] && printf "%s" "$decision" | grep -q "\"reason\":\"withdrawn\""'
check "the nudge state holds one extra nudge" 'grep -q "\"rearm\"" "$state/nudge-$sid.json"'
shown="$(cli history --last 1)"
check "the hop history lists a withdrawn line" 'printf "%s" "$shown" | grep -q " withdrawn "'
check "the log holds a withdrawn line and no killer signal" \
  'grep -q " withdrawn " "$state/relaunch.log" && ! grep -q "killer-signal" "$state/relaunch.log"'

cli prepare --handoff "$note" --session "$sid" --runtime codex > /dev/null
cancel_out="$(cli cancel)"
check "cancel names the note and says it stays open" \
  'printf "%s" "$cancel_out" | grep -q "cancelled the prepared hand-over for .*; the note stays open"'
check "the record is disarmed with reason cancelled" 'grep -q "\"disarmReason\":\"cancelled\"" "$record"'
again="$(cli cancel)" && status=0 || status=$?
check "a second cancel finds nothing and exits 1" \
  '[ "$status" = 1 ] && [ "$again" = "no prepared hand-over to cancel" ]'
BASH
~~~

Evidence: the eleven `PASS:` lines and exit code 0. PASS when all eleven print and the shell exits 0. FAIL on the first `FAIL:` line, which exits 1.

#### CX-5 Codex withdraw suites (Automatable)

Run the suites and read the named cases:

~~~bash
node --test \
  .skilled/hooks/session-relaunch/tests/withdraw.test.cjs \
  .skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs \
  .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs \
  .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs \
  .skilled/hooks/session-relaunch/tests/nudge.test.cjs \
  .skilled/hooks/session-relaunch/tests/hop-history.test.cjs
~~~

Evidence: exit code 0 and these cases pass.

- `codex-adapters.test.cjs`: `UserPromptSubmit withdraws an armed handoff when the operator sends a prompt`.
- `withdraw.test.cjs`: `an armed record is withdrawn with a pending grant and a history line` and `a pending record counts only as the caller's policy says`.
- `session-relaunch-cli.test.cjs`: the `cancel` cases, `cancel disarms the loop prepared hand-over named by the loop environment` and `cancel exits one when the loop has no prepared hand-over`.
- `skilled-loop.test.cjs`: `wrapper reports a cancelled hand-over as withdrawn and prints no claim command`, the same case for `user-message`, and the stub-runtime cases for `codex --no-daemon`.
- `nudge.test.cjs`: `a withdrawn hand-over grants one more nudge, one step above the fill it was withdrawn at`.
- `hop-history.test.cjs`: `history renders a withdrawn line with the session that withdrew the hand-over`.

PASS when every named case passes. FAIL when a case is missing from the run or fails.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|---|
| `manual-testing-playbook.md` | Root index and execution verdict rules. |
| `../../feature-catalog/context-preservation/session-relaunch-loop.md` | Shared handoff implementation and runtime coverage. |
| `../../../../hooks/session-relaunch/README.md` | Runtime adapter matrix, launch syntax and command-only reasons. |
| `../../../../../specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md` | Section 12 contract for the four runtimes. |
| `../../../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-codex.md` | Codex spike verdict and captured payloads. |
| `../../../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-cursor-hermes.md` | Cursor and Hermes spike verdicts and caveats. |
| `../../../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-devin.md` | Devin spike verdict and unverified items. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/session-relaunch/codex/prompt-seed.mjs` | Codex `UserPromptSubmit` entry point. |
| `.skilled/hooks/session-relaunch/codex/context-nudge.mjs` | Codex `PostToolUse` entry point. |
| `.skilled/hooks/session-relaunch/codex/shared.mjs` | Shared Codex payload, threshold and emit logic, and the withdraw of an armed record on an operator prompt. |
| `.skilled/hooks/session-relaunch/lib/withdraw.cjs` | Calls off a prepared hand-over for every runtime and `cancel`: a guarded disarm, the extra nudge and the withdrawn history line. |
| `.skilled/hooks/session-relaunch/codex/stop-arm.mjs` | Codex `Stop` arm and killer spawn. |
| `.skilled/hooks/session-relaunch/hermes/context-nudge.mjs` | Hermes `pre_llm_call` bridge target. |
| `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs` | Hermes `on_session_end` arm and killer spawn. |
| `.hermes/plugins/repo-guards/__init__.py` | Plugin bridge and per-session usage records. |
| `.skilled/bin/skilled-loop` | Runtime selection, environment export and relaunch arguments. |
| `.skilled/bin/skilled-loop-shell.sh` | Starts a plain `codex`, `hermes`, `cursor-agent` or `devin` launch under the nearest wrapper, a symlinked `.skilled` included. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Shell shim resolution and terminal hand-off tests. |
| `.skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs` | Codex adapter regression suite. |
| `.skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs` | Hermes adapter regression suite. |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Shared nudge text and level suite. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Stub-runtime wrapper relaunch argument tests. |
| `.skilled/hooks/session-relaunch/tests/withdraw.test.cjs` | Shared withdraw helper tests. |
| `.skilled/hooks/session-relaunch/tests/hop-history.test.cjs` | Hop history, history command and withdrawn-note tests. |

Provenance: .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs

---

## 5. SOURCE METADATA

- Group: Plugins and Hooks
- Playbook ID: session-relaunch-command-runtimes
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/session-relaunch-command-runtimes.md`

Related references:
- [Session relaunch feature entry](../../feature-catalog/context-preservation/session-relaunch-loop.md)
- [Claude session relaunch scenarios](session-relaunch-claude.md)
- [Pi and OpenCode session relaunch scenarios](session-relaunch-pi-opencode.md)
