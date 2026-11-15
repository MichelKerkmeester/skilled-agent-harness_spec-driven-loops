---
title: "Mistral Vibe Session Handover"
description: "Automatable and live scenarios for the Vibe automatic relaunch tier, the operator prompt that withdraws a hop and the switch-off control that leaves the turn alone."
trigger_phrases:
  - "Vibe session handover"
  - "session-handover-vibe"
  - "skilled-loop vibe handover"
  - "Vibe automatic relaunch tier"
  - "Vibe handover withdraw"
version: 1.0.1.0
id: session-handover-vibe
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# Mistral Vibe Session Handover

---

## 1. OVERVIEW

This scenario covers the Vibe automatic relaunch tier. One automatable check covers the adapter suite, and three live checks observe a full hop, a withdraw and the switch-off control that leaves the turn alone.

### Why This Matters

Vibe writes its context usage to a numbered journal segment and keeps its own `compaction_threshold` in the runtime state of the session's current generation. A reader that opens the wrong segment or the wrong generation either never nudges or nudges late, and neither shows in a reply. The turn end is the only arm event Vibe offers. A missing arm leaves the note open with the session still running, and a withdraw that never fires ends a turn the operator just started. Only the relaunch log and the note's own status separate those cases.

---

## 2. SCENARIO CONTRACT

This scenario defines one automatable check and three live checks. A live check that was not run is marked SKIP with its named blocker.

- Objective: Verify that the automatic tier nudges past the measured threshold, arms the record at the turn end, ends Vibe and relaunches on the claim seed, verify that an operator prompt typed after the arm withdraws the hop, and verify that the switch off leaves the turn alone while a hand-typed request still prints the claim command.
- Real user request: Carry a short task through a context handoff, then finish it in the new session.
- Prompt: `Carry this short task through a context handoff, then finish it in the new session. Start by reading README.md and reporting its first heading. Gate 3: D) Skip, no spec folder.`
- Precondition: The session-handover concern ships off for Vibe. Every check that expects a nudge, an arm or a hop runs with `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1` in its environment. The fill is the journal's measured `input_tokens` against `SESSION_HANDOVER_WINDOW_TOKENS` when it holds a value, and against the session's own `compaction_threshold` when it does not. `SESSION_HANDOVER_THRESHOLD` sets the nudge level, and its default is `0.80`.
- Expected execution process: Run the adapter suite. Start the wrapper with the low threshold and window overrides, submit the prompt, let the turn-start or post-tool nudge arrive, follow its prepare command, and watch the turn end, the killer and the relaunch. Repeat with an operator prompt after the arm and with the switch off.
- Expected signals: The suite exits 0. The relaunch log holds `prepare loopId=<id> status=pending`, `killer-signal targetPid=<pid> signal=SIGTERM` and `relaunch loopId=<id> reason=ready`. The note ends at `status: done`, and the hop history holds `handed-over`, `claimed` and `done`. The withdraw leaves `withdrawn loopId=<id> sessionId=<id> reason=user-message` with no `killer-signal`. The switch-off run holds no `prepare` line and no `killer-signal`, and a hand-typed request under the switch prints the claim command.
- Desired user-visible outcome: The receiving session claims the note and finishes the remaining step in the same terminal.
- Pass/fail: PASS when the suite exits 0 and each live check that was run meets its signals. Record an operator-directed SKIP with the named blocker for a live check that was not run. FAIL when the suite fails, the record stays pending with the switch on, an operator prompt leaves an armed record in place, or a switch-off run writes a record.

---

## 3. TEST EXECUTION

### Primary Scenario

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| session-handover-vibe | Vibe automatic session handover | Run the adapter suite and three live checks for the hop, the withdraw and the switch off. | Carry this short task through a context handoff, then finish it in the new session. Start by reading README.md and reporting its first heading. Gate 3: D) Skip, no spec folder. | Vibe adapter suite -> VB-1 full hop -> VB-2 withdraw -> VB-3 switch off | The suite exits 0. The log holds `prepare`, `killer-signal` and `relaunch reason=ready` for VB-1, `withdrawn` and no `killer-signal` for VB-2, and no `prepare` line for VB-3 part A. The note ends at `status: done`. | Capture command output and exit codes. For each live check capture the relaunch log lines, the hop history and the note's frontmatter. | PASS when the suite exits 0 and each live check reaches its named signals. FAIL when the suite fails, the record stays pending with the switch on, or a switch-off run writes a record. | 1. Confirm the journal segment and the generation the reader opens. 2. Check the record's `sessionId` against the hook payload's session id. 3. Read the killer lines for `killer-no-armed-record`, `killer-stale` and `killer-hop-cap`. 4. Read the note's `status` and the hop history. |

### Automatable Checks

#### Vibe adapter suite (Automatable)

~~~bash
node --test .skilled/hooks/session-handover/tests/vibe-adapters.test.cjs
~~~

Evidence: the suite covers the once-at-threshold nudge on `pre_agent` and the silence below it, the `post_tool` nudge that leaves an armed record alone, the claim seed that expands at `pre_agent` and beats a nudge, the withdraw of an armed record with the notice alone, the re-arm floor the withdraw prompt records, the turn-end arm with the killer on the newest numbered journal segment, the lock file the journal reader ignores, the subagent payload that neither nudges nor arms, and the switch that silences both parts. PASS when every case passes.

### Live Checks

The launch line below sets the switch and the test overrides. `SESSION_HANDOVER_THRESHOLD=0.05` and `SESSION_HANDOVER_WINDOW_TOKENS=100` make the first tool call cross the threshold, and `SESSION_HANDOVER_MAX_HOPS=1` stops the chain after one hop. Vibe's `--model` is headless only, so a relaunch carries the seed alone and the receiver keeps the configured model. Submit the exact prompt from the scenario contract.

#### VB-1 A full automatic hop (Live)

Run from the repository root and leave the prompt in the command:

~~~bash
SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1 SESSION_HANDOVER_THRESHOLD=0.05 SESSION_HANDOVER_WINDOW_TOKENS=100 SESSION_HANDOVER_MAX_HOPS=1 bash .skilled/bin/skilled-loop vibe --trust --agent auto-approve "Carry this short task through a context handoff, then finish it in the new session. Start by reading README.md and reporting its first heading. Gate 3: D) Skip, no spec folder."
~~~

Follow the nudge. The session writes the note, runs `prepare --runtime vibe`, and ends its turn. The turn end arms the record, the killer signals Vibe after the journal has been quiet, and the wrapper starts a second `vibe` on the claim seed. Read the result:

~~~bash
if [ -n "${XDG_RUNTIME_DIR:-}" ]; then state="$XDG_RUNTIME_DIR/skilled-relaunch"; else state="${TMPDIR:-/tmp}/skilled-relaunch-$(id -u)"; fi
grep -E ' (prepare|killer-signal|relaunch) ' "$state/relaunch.log" | tail -6
node .skilled/hooks/session-handover/bin/session-handover.cjs history --last 3
grep -m1 '^status:' .skilled/skills/.state/session-handover/handoffs/<note file>.md
~~~

Expected:

~~~text
prepare loopId=<id> status=pending sessionId=<session id>
killer-signal targetPid=<pid> signal=SIGTERM
relaunch loopId=<id> reason=ready
~~~

The hop history adds `handed-over` with `(hop 1)`, then `claimed` with `by <id>`, then `done`, all naming the same note. The note's frontmatter ends at `status: done` with a `completed_at` value.

Evidence: the three log lines, the three history lines and the note's frontmatter. PASS when all three log lines appear and the note ends done. FAIL when the record stays pending, the killer never signals, the wrapper declines the relaunch, or the receiver never claims the note. Triage: `stop-arm-error` with `stage=target-pid` means the loop child was not found and the record stays pending. `missing-transcript-path` means the session folder held no numbered journal segment. `decline reason=hop-cap` means the hop count already reached the cap.

#### VB-2 An operator prompt withdraws the armed hand-over (Live, withdraw)

The turn end arms the record, and the killer signals after the journal has been quiet for 3 s. A prompt typed inside that window must withdraw the record and leave the session running. Run the wrapper in a detached tmux session so one shell can type into it and read it:

~~~bash
repo_root="$(git rev-parse --show-toplevel)"
if [ -n "${XDG_RUNTIME_DIR:-}" ]; then state="$XDG_RUNTIME_DIR/skilled-relaunch"; else state="${TMPDIR:-/tmp}/skilled-relaunch-$(id -u)"; fi
session_name="relaunch-vibe-$$"
tmux new-session -d -s "$session_name" "cd '$repo_root' && SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1 SESSION_HANDOVER_THRESHOLD=0.05 SESSION_HANDOVER_WINDOW_TOKENS=100 SESSION_HANDOVER_MAX_HOPS=1 bash .skilled/bin/skilled-loop vibe --trust --agent auto-approve 'Carry this short task through a context handoff, then finish it in the new session. Start by reading README.md and reporting its first heading. Gate 3: D) Skip, no spec folder.'"
tmux set-option -w -t "$session_name" remain-on-exit on
say() { tmux send-keys -t "$session_name" -l "$1"; sleep 0.5; tmux send-keys -t "$session_name" Enter; }
screen() { tmux capture-pane -p -S -120 -t "$session_name"; }
record=""
for _ in $(seq 1 3000); do
  record=$(grep -lE '"status":"armed"' "$state"/relaunch-*.json 2>/dev/null | head -1)
  [ -n "$record" ] && break
  sleep 0.1
done
printf '%s\n' "$record"
say "Keep going and run the shell command 'echo staying'."
sleep 8
grep -oE '"(status|disarmReason)":"[^"]*"' "$record"
grep -E ' (withdrawn|killer-signal|relaunch|killer-no-armed-record) ' "$state/relaunch.log" | tail -5
node .skilled/hooks/session-handover/bin/session-handover.cjs history --last 2
screen | tail -20
~~~

The prompt must reach the session within two seconds of the moment the poll prints the record. The poll names the record as soon as the turn end arms it, and the killer's 3 s idle wait starts from there.

Expected:

- The record holds `"status":"disarmed"` and `"disarmReason":"user-message"`.
- The relaunch log holds `withdrawn loopId=<id> sessionId=<id> reason=user-message` and no `killer-signal` line after it.
- The killer logs `killer-no-armed-record` and stands down.
- The session keeps running in the same terminal and shows the notice that the prepared hand-over was withdrawn.
- The hop history ends with a `withdrawn` line for the note, and the note stays `open`.

The withdraw grants the session one extra nudge, so a later tool call can ask for a fresh note. That is not a failure. Judge the check by the `withdrawn ... reason=user-message` line and the record fields.

Then exit the session and read the wrapper:

~~~bash
say "/exit"
sleep 5
screen | grep -E 'warning|claim and continue'
tmux display -p -t "$session_name" '#{pane_dead_status}'
tmux kill-session -t "$session_name"
~~~

Expected: one warning line that carries `the prepared hand-over was withdrawn in the session` and names the note path as open and out of date, no line that carries `claim and continue handoff`, and `0` for the pane status.

Evidence: the record fields, the log lines, the history line, the pane text and the wrapper line. PASS when the record is disarmed with `user-message`, the log holds `withdrawn` and no `killer-signal`, the session keeps running, and the wrapper prints the single warning. FAIL when the record stays armed, the log shows `killer-signal`, a second Vibe starts with a seed, or the wrapper prints a claim command. Triage: if the pane shows a relaunch already, the prompt landed after the idle wait, so rerun. If the poll never prints a record, read the log for `stop-arm-error` and `missing-transcript-path`.

#### VB-3 The switch off leaves the turn alone and the hand-typed request prints the claim command (Live, switch off)

Part A starts the wrapper with the switch off for the whole session. Every hand-over part returns before it reads the journal, so no nudge arrives, no record is written and no signal is sent:

~~~bash
repo_root="$(git rev-parse --show-toplevel)"
if [ -n "${XDG_RUNTIME_DIR:-}" ]; then state="$XDG_RUNTIME_DIR/skilled-relaunch"; else state="${TMPDIR:-/tmp}/skilled-relaunch-$(id -u)"; fi
session_name="relaunch-vibe-off-$$"
log_start=$(wc -l < "$state/relaunch.log" 2>/dev/null || printf '0')
tmux new-session -d -s "$session_name" "cd '$repo_root' && SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=0 bash .skilled/bin/skilled-loop vibe --trust --agent auto-approve"
tmux set-option -w -t "$session_name" remain-on-exit on
say() { tmux send-keys -t "$session_name" -l "$1"; sleep 0.5; tmux send-keys -t "$session_name" Enter; }
screen() { tmux capture-pane -p -S -120 -t "$session_name"; }
say "Carry this short task through a context handoff, then finish it in the new session. Start by reading README.md and reporting its first heading. Gate 3: D) Skip, no spec folder."
sleep 20
say "/speckit-handoff"
sleep 60
tail -n "+$((log_start + 1))" "$state/relaunch.log" | grep -E ' (prepare|killer-signal|relaunch|withdrawn) ' || echo no-handover-lines
screen | tail -25
~~~

Expected: the filtered log prints `no-handover-lines`. The pane holds no nudge. The `/speckit-handoff` reply names `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED` as the switch that turned the concern off, and no record file and no note are written. Then exit the session and read the wrapper:

~~~bash
say "/exit"
sleep 5
screen | grep -c 'claim and continue' || true
tmux kill-session -t "$session_name"
~~~

Expected: `0` claim command lines.

Part B starts a fresh loop with the switch on and types the same request by hand. The command prepares the record under a generated id, the turn end matches only the hook payload's session id, so the record stays pending and the wrapper prints the claim command:

~~~bash
session_name="relaunch-vibe-manual-$$"
say() { tmux send-keys -t "$session_name" -l "$1"; sleep 0.5; tmux send-keys -t "$session_name" Enter; }
screen() { tmux capture-pane -p -S -120 -t "$session_name"; }
tmux new-session -d -s "$session_name" "cd '$repo_root' && SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1 bash .skilled/bin/skilled-loop vibe --trust --agent auto-approve"
tmux set-option -w -t "$session_name" remain-on-exit on
say "Carry this short task through a context handoff, then finish it in the new session. Start by reading README.md and reporting its first heading. Gate 3: D) Skip, no spec folder."
sleep 20
say "/speckit-handoff"
sleep 60
say "/exit" 2>/dev/null || true
sleep 8
grep -E ' (prepare|killer-signal|relaunch) ' "$state/relaunch.log" | tail -4
screen | grep 'claim and continue' || true
ls -t .skilled/skills/.state/session-handover/handoffs/*.md | head -1 | xargs grep -m1 '^status:'
tmux kill-session -t "$session_name" 2>/dev/null || true
~~~

Expected: one `claim and continue handoff <note path>` line, no `killer-signal` line, and the note still `open`. The printed command is the manual tier that the Vibe package scenario `VIB-HK-026` records in full.

Evidence: the filtered log, the pane text, the wrapper line and the note status. PASS when part A writes no hand-over line and prints no claim command, and part B prints the claim command with no signal. FAIL when a switch-off run writes a record or a claim command, or a hand-typed request arms the record. Triage: a switch-off run that logs `prepare` means the switch was set in the environment of an already running session, so restart the wrapper. A hand-typed request that logs `killer-signal` and relaunches means the record carried the hook payload's session id, which the manual route does not do.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root index and execution verdict rules. |
| `../../feature-catalog/context-preservation/session-handover-loop.md` | Shared handoff implementation and runtime coverage. |
| `../../../../hooks/session-handover/README.md` | Runtime adapter matrix, launch syntax and the automatic tier. |
| `../../../cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/relaunch-automatic-tier-conversation.md` | The Vibe package scenario for the same tier. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | The turn-start nudge, seed expansion, withdraw and turn-end arm. |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | The one `pre_agent` entry that composes the turn-start parts. |
| `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` | The one `post_agent` entry that runs the hand-over part last. |
| `.skilled/hooks/session-handover/lib/context-usage.cjs` | `readVibeUsage` and `resolveVibeWindow`. |
| `.skilled/hooks/session-handover/lib/killer.cjs` | The killer that signals the Vibe process. |
| `.skilled/hooks/session-handover/lib/withdraw.cjs` | The shared withdraw helper and its re-arm grant. |
| `.skilled/bin/skilled-loop` | The wrapper that relaunches `vibe` on the claim seed. |
| `.vibe/hooks.toml` | The hook bindings a Vibe session runs. |
| `.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs` | The adapter suite for this scenario. |

Provenance: .skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

---

## 5. SOURCE METADATA

- Group: Plugins and Hooks
- Playbook ID: session-handover-vibe
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/session-handover-vibe.md`

Related references:
- [Session handover feature entry](../../feature-catalog/context-preservation/session-handover-loop.md)
- [Codex, Cursor and Devin session handover scenarios](session-handover-command-runtimes.md)
- [Vibe automatic tier conversation](../../../cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/relaunch-automatic-tier-conversation.md)
