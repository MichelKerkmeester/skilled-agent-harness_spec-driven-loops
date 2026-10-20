---
title: "Pi and OpenCode Session Relaunch"
description: "Automatable and live scenarios for the Pi and OpenCode session-relaunch adapters."
trigger_phrases:
  - "Pi session relaunch"
  - "OpenCode session relaunch"
  - "session-relaunch-pi-opencode"
  - "skilled-loop pi"
  - "skilled-loop opencode"
version: 1.0.4.0
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

- Objective: Verify Pi and OpenCode adapter loading, event handling, seed injection, matching record arming and wrapper relaunch behavior.
- Real user request: Carry a short task through a context handoff in Pi or OpenCode, then finish it in the new session.
- Prompt: `Carry this short task through a context handoff, then finish it in the new session. Tell me when you are ready.`
- Expected execution process: Run the Pi extension smoke with -ne -e, the OpenCode import smoke, both adapter suites and the wrapper runtime suite. Start Pi with its provider, model and explicit extension selection. Start OpenCode with its model selection. Use separate tmux sessions with a low hop cap, follow each generated handoff and observe the wrapper relaunch.
- Expected signals: Automatable commands exit 0. Pi loads the extension with `-ne -e`. OpenCode import prints `function`. Adapter suites pass. Wrapper tests record `SKILLED_LOOP_RUNTIME` and the Pi and OpenCode seed arguments. Each live handoff is prepared and armed for its matching runtime, then the wrapper starts a fresh runtime with the claim seed.
- Desired user-visible outcome: The receiving session claims the same handoff and continues the unfinished task.
- Pass/fail: PASS if all five automatable checks pass and both live runs show the matching runtime restart and claim seed. FAIL if a smoke or suite exits non-zero, the wrapper uses the wrong runtime arguments or either live run does not reach the expected handoff.

---

## 3. TEST EXECUTION

### Primary Scenario

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| session-relaunch-pi-opencode | Pi and OpenCode session relaunch adapters | Run five automatable checks and one live handoff in each runtime. | Carry this short task through a context handoff, then finish it in the new session. Tell me when you are ready. | Pi extension smoke -> OpenCode import smoke -> Pi adapter suite -> OpenCode adapter suite -> wrapper runtime suite -> live Pi tmux hop -> live OpenCode tmux hop | Automatable commands exit 0. The Pi smoke loads its extension with `-ne -e`. OpenCode import prints `function`. The wrapper tests show Pi name ordering and OpenCode `--prompt` without a name flag. Each live run arms the matching record and starts a fresh runtime with the claim seed. | Capture command output and exit codes. For each live run capture the tmux transcript, runtime log entries and handoff status from open through claimed. | PASS when every automated check exits 0 and both live sessions claim their prepared handoff after the matching wrapper relaunch. FAIL when an automated check fails, a runtime is mismatched or a live claim seed is not delivered. | 1. Confirm the adapter path and host smoke command. 2. Check adapter event logs and the matching runtime field in the pending record. 3. Check the killer result, hop limit and runtime-specific seed arguments. |

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

Evidence: stdout is `function` and the command exits 0.

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

Evidence: all 14 tests pass under bash and zsh. Plain `pi`, `pi --model <m> "<prompt>"`, `opencode` and `opencode -m <model>` resolve the wrapper through a symlinked `.skilled`. `pi -p`, `pi install`, `pi --mode rpc`, `opencode run` and `opencode serve` resolve nothing. The outside-loop silence for both adapters is the `a nudge stays silent outside skilled-loop at a fill above the threshold` case in `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` for OpenCode and in the Pi suite's conformance block.

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

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root index and execution verdict rules. |
| `../../feature-catalog/context-preservation/session-relaunch-loop.md` | Shared handoff implementation and runtime coverage. |
| `../../../../hooks/session-relaunch/README.md` | Adapter matrix, launch syntax and known live-TUI limits. |
| `../../../../../specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md` | Section 11 contract for events and seed syntax. |
| `../../../../../specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/scratch/spike/SPIKE-REPORT.md` | Adapter spike verdicts and UNVERIFIED items. |
| `../../../../../specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md` | Recorded Pi smoke and pre-existing `--fast` conflict. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Pi event adapter. |
| `.opencode/plugins/session-relaunch.js` | OpenCode plugin adapter. |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Shared nudge and seed text. |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Shared runtime usage and window calculations. |
| `.skilled/bin/skilled-loop` | Runtime selection, environment export and relaunch arguments. |
| `.skilled/bin/skilled-loop-shell.sh` | Starts a plain `pi` or `opencode` launch under the nearest wrapper, a symlinked `.skilled` included. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Shell shim resolution and terminal hand-off tests. |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Pi adapter regression suite. |
| `.opencode/plugins/tests/session-relaunch.test.cjs` | OpenCode adapter regression suite. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Wrapper runtime relaunch argument tests. |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Prepare runtime recording tests. |

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
