---
title: "Codex, Cursor, Hermes and Devin Session Relaunch"
description: "Automatable and live scenarios for the Codex and Hermes session-relaunch adapters and the Cursor and Devin command-trigger runtimes."
trigger_phrases:
  - "Codex session relaunch"
  - "Cursor session relaunch"
  - "Hermes session relaunch"
  - "Devin session relaunch"
  - "session-relaunch-command-runtimes"
  - "skilled-loop codex"
  - "skilled-loop hermes"
version: 1.0.5.0
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

- Objective: Verify Codex and Hermes adapter loading, event handling, seed injection and matching record arming, and verify the Cursor and Devin wrapper arms plus the `/speckit:handoff` command-trigger hop.
- Real user request: Carry a short task through a context handoff in Codex or Hermes, or through the handoff command in Cursor or Devin, then finish it in the new session.
- Prompt: `Carry this short task through a context handoff, then finish it in the new session. Tell me when you are ready.`
- Expected execution process: Run the Codex and Hermes adapter suites, the shared nudge suite and the stub-runtime wrapper suite. Then start each runtime in its own tmux session with a low hop cap and follow the generated handoff. The nudge's prepare command includes `--runtime <name>`. On Cursor and Devin, run `/speckit:handoff` and start the hop with the selected runtime's claim command printed by the CLI.
- Expected signals: Automatable commands exit 0. The stub-runtime suite records `codex --no-daemon -m <model> <seed>`, `cursor-agent --model <model> <seed>`, `hermes chat --provider <p> -m <model> -q <seed>` and `devin --model <model> -- <seed>` on relaunch, with valid model and provider values carried on every hop and no resume-family flag passed. Model, name, Pi extension and Pi or Hermes provider scans leave values equal to `--` or starting with `-` in the first launch's arguments and leave them out of relaunch arguments. Each live automatic run arms its matching record and restarts with the claim seed. Each command-trigger run produces a note, a pending record and a runtime-specific manual claim command. If a runtime exits with a record still pending, the wrapper prints its runtime-specific manual command, consumes the record and preserves the runtime exit code. If it cannot decode the record returned by `should-relaunch`, it prints `warning: could not read the relaunch record` and consumes the record. On an approved hop the wrapper relaunches the runtime with the seed. It exits 1 for an unreadable or empty record, which prints no manual claim command. It also exits 1 for an empty cwd, a line break in the cwd or handoff path, or a failed `cd`, and prints the manual claim command in those cases. A runtime exit of 130 prints the manual claim command and exits 130. On a decline the wrapper exits with the runtime's own exit code and prints the manual claim command only for the `not-armed`, `stale` and `hop-cap` reasons. Keep `SESSION_RELAUNCH_THRESHOLD` well above a fresh session's startup fill plus its remaining work. Codex live runs chained at `0.12` because each fresh session reached about 10% on startup alone. `SESSION_RELAUNCH_MAX_HOPS` caps completed relaunches.
- Desired user-visible outcome: The receiving session claims the same handoff and continues the unfinished task.
- Pass/fail: PASS if all four automatable checks pass and each live run that was run shows the matching runtime restart and claim seed, or the command-trigger hop delivering the claim seed by hand. Record an operator-directed SKIP for a live check that was not run. FAIL if a smoke or suite exits non-zero, the wrapper uses the wrong runtime arguments or a live run does not reach the expected handoff.

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

Evidence: all 14 tests pass under bash and zsh. Plain `codex`, `codex resume --last`, `hermes`, `hermes chat -q <prompt>`, `cursor-agent`, `cursor-agent agent <prompt>`, `devin` and `devin -- <prompt>` resolve the wrapper through a symlinked `.skilled`. `codex exec`, `codex review`, `hermes -z`, `hermes chat --oneshot`, `hermes setup`, `cursor-agent -p`, `cursor-agent login`, `devin -p`, `devin doctor` and `devin <path>` resolve nothing. `cursor-agent` resolves to the wrapper's `cursor` arm. PASS when the run reports 0 failures.

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

Repeat with `HERMES_ENABLE_PROJECT_PLUGINS=1 hermes chat --provider llmgateway -m gpt-6-luna`, `cursor-agent` and `devin --model swe-2-max` in place of the Codex command. Codex and Hermes hop on their own: the nudge arrives, the record arms and the wrapper restarts the runtime with the claim seed in the same pane. Cursor and Devin are command-only: run `/speckit:handoff`, end the session and confirm the wrapper prints the manual claim command when the runtime exits, which proves the plain command started under the wrapper. In every case the first session's shell tool prints a loop id for `echo $SKILLED_LOOP_ID`. PASS when Codex and Hermes reach a done note and Cursor and Devin print the wrapper's manual claim command at exit. FAIL when `SKILLED_LOOP_ID` is empty or prepare exits 3. Record a runtime as SKIP when its credentials block the launch.

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
| `.skilled/hooks/session-relaunch/codex/shared.mjs` | Shared Codex payload, threshold and emit logic. |
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
