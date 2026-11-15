---
title: "hop-recall-baseline-conversation -- Hop recall baseline conversation"
description: "This scenario records whether a session that claims a handoff note recovers a code the note left out when the history lookup CLI is hidden for the run."
trigger_phrases:
  - "hop recall baseline conversation"
  - "handoff recall baseline"
version: 1.0.0.0
---

# hop-recall-baseline-conversation -- Hop recall baseline conversation

This document captures the hop-recall baseline contract, the operator procedure, the checks and the source anchors.

---

## 1. OVERVIEW

The same conversation as the lookup arm, in a checkout where the built history CLI is moved out of the way for the run. The sender prints 120 one-time codes, then works on an unrelated small task. A low relaunch threshold forces a hop to a fresh session. Once the receiver claims the handoff note, the operator asks it for the code printed for `K073`. The hop prints no lookup offer either way, so this arm records what a receiver does when the CLI is not on disk.

### Why This Matters

The handover starts a fresh session near the context limit, so the receiver holds only the four sections of the handoff note. The history lookup that could recover a missing detail is offered only after a compaction, which the hop is designed to prevent. Nobody has measured whether a receiver recovers such a detail on its own, so the phases that would build an offer rest on an assumption. This pair answers that: the two scenarios differ only in whether the lookup CLI exists in the checkout, so the lookup is reachable in one and hidden in the other.

The conversation runner cannot drive a hop. Its only turn actions are `restart` and `compact` (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md` §3), and `restart` resumes the same session, so it cannot start the fresh session a hop requires. This page is therefore an operator procedure built on the harness script, not a `json conversation` block.

---

## 2. SCENARIO CONTRACT

Operators run this scenario and [hop-recall-conversation](hop-recall-conversation.md) with the same label scheme, then compare their observed lines.

- Feature ID: hop-recall-baseline-conversation
- Objective: records whether a session that claims a handoff note recovers a code the note left out when the history lookup CLI is hidden
- Real user request: a long session hands over to a fresh one, and the user then asks the new session for a value the old session printed.
- Prompt: `Read-only task. Gate 3 is pre-answered D) Skip: you change no file. First run: sh $work/show-codes.sh so the one-time codes are issued (it clears them once shown, which is expected). Then the actual task: report the line count of .skilled/hooks/session-relaunch/README.md and name its first heading. If you are asked to hand over to a fresh session, do that and let the new session finish the task.`
- Expected execution process: the harness writes `codes.txt` and `show-codes.sh`, which prints the 120 codes and deletes `codes.txt`. It moves the built history CLI to `cli.js.hidden` under the run folder, then starts a sender under `skilled-loop` with `SESSION_RELAUNCH_THRESHOLD=0.05`, `SESSION_RELAUNCH_WINDOW_TOKENS=100` and `SESSION_RELAUNCH_MAX_HOPS=1`. The sender runs the script, reports the README line count and first heading, follows the nudge through the handoff steps, and Stop arms the record. The killer ends the sender, the wrapper starts a receiver with the claim seed, and the receiver claims the note. The harness waits 30 seconds after the note reaches `claimed`, asks the question, waits for the reply to settle, and prints one observed line. It restores the CLI on exit.
- Expected signals: `observed=arm=baseline runtime=claude-code answer=<correct|wrong|missing> lookup_attempted=<0|1> native_recall=<0|1> transcript_read=<0|1> note_leaked=<0|1> note_status=<status> counted=<0|1>`. A correct answer here means the note, the compaction summary or a transcript read kept the code without the lookup.
- Desired user-visible outcome: an honest answer, a recorded guess or `UNKNOWN` from a receiver that cannot reach the lookup, and a recorded signal for whether it read the sender's transcript instead.
- Pass/fail: PASS if the run completes, the note reaches `claimed`, `note_leaked=0`, the receiver session differs from the sender, the question was asked, the CLI was present before the run and did not reappear during it, and the observed line records `answer=correct`, `wrong` or `missing`. FAIL if the CLI was missing before the run or reappeared during it, the hop never happens, the note holds the code, or the question is never asked.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Read-only task. Gate 3 is pre-answered D) Skip: you change no file. First run: sh $work/show-codes.sh so the one-time codes are issued (it clears them once shown, which is expected). Then the actual task: report the line count of .skilled/hooks/session-relaunch/README.md and name its first heading. If you are asked to hand over to a fresh session, do that and let the new session finish the task.`
- `$work` is the run's `work/` folder under `scratch/runs/<arm>-<label>/`; the harness fills in the absolute path before it starts the sender.
- The question the operator asks after the claim: `What exact code did show-codes.sh print for K073 in the previous session? Reply with the code only, or UNKNOWN if you cannot determine it. Do not write any file.`

### Operator Procedure

The conversation runner cannot drive a hop: its only turn actions are `restart` and `compact` (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md` §3), and `restart` resumes the same session. This page is therefore an operator procedure built on the harness script, not a `json conversation` block.

1. Confirm `tmux`, `node` and a logged-in Claude Code are available. The history CLI must exist before the run, because the harness moves it aside; if it is missing, build it with `cd .skilled/skills/system-spec-kit/runtime && npm run build`.
2. Run the arm from the repository root with a label that names the runtime and the attempt, for example `baseline claude-1`. The harness captures the pane every 5 seconds, answers the folder-trust and hook-review dialogs itself, and prints nothing until the run ends.
3. Wait for the observed line. The default bound is 540 seconds; pass a third argument to change it.
4. Read `result.json` and `pane.txt` under `scratch/runs/<arm>-<label>/` before writing a row. `result.json` holds the sender and receiver session ids, the note name and status, `sender_saw_code`, the answer, the three signals, `cliReappeared` and the receiver's last reply.
5. Copy the observed line's fields into one row of `### Recorded Results`. A run counts only under the rule below.
6. Run the other arm with the same label suffix, so the pair differs only in the arm. Run the two arms one after the other, never in parallel: the baseline arm moves a file the lookup arm needs.

### Commands

1. Baseline arm:
   ```bash
   bash specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh baseline <label>
   ```
2. Lookup arm, for the paired run:
   ```bash
   bash specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh lookup <label>
   ```
3. Optional timeout: add a third argument in seconds; the default is 540.
4. The harness leaves its run under `scratch/runs/<arm>-<label>/`. It starts the sender with `--model sonnet --effort medium` and the tmux session name `hoprecall-<arm>-<label>`.
5. After an interrupted baseline run, restore the CLI by hand. The harness restores it on exit, but a SIGKILL skips the trap:
   ```bash
   mv specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/runs/baseline-<label>/cli.js.hidden .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js
   ```

### Expected

No lookup CLI is on disk, so the receiver answers from the handoff note, re-runs the emptied script, reads a runtime transcript itself or says it cannot tell. The observed line records which, and fails only when the CLI was reachable. The baseline hides only the built CLI, not the TypeScript source or the offer gate; the hop prints no offer either way, so the arm measures the receiver without the CLI rather than the absence of an offer.

### Evidence

The harness leaves `scratch/runs/<arm>-<label>/` holding `pane.txt` (the captured scrollback), `relaunch.log` (the run's slice of the relaunch log), `note.md` (a copy of the handoff note), `result.json` (the scored fields), `cli.js.hidden` while the run hides the CLI, and `work/` (the script and, if the sender never ran it, `codes.txt`). The observed line is the last line the harness prints; `result.json` holds the scored fields (`sender`, `receiver`, `note`, `note_status`, `note_leaked`, `sender_saw_code`, `answer`, `lookup_attempted`, `native_recall`, `transcript_read`, `reply`) plus `arm`, `label`, `runtime`, `asked`, `trustDialogs` and `cliReappeared`. `counted` is printed only in the observed line; recompute it from the rule below. The harness does not record the model, so note the model Claude Code reports beside the row.

### Pass / Fail

- **Pass**: the run completes, the note reaches `claimed`, `note_leaked=0`, the receiver session differs from the sender, the question was asked, the CLI was present before the run and did not reappear during it, and the observed line records `answer=correct`, `wrong` or `missing`.
- **Fail**: the CLI was missing before the run or reappeared during it, the hop never happens, the note holds the code, or the question is never asked. A wrong or missing answer is a recorded result, not a failure of the run.

### Failure Triage

1. **The CLI reappeared in the baseline arm.** `cliReappeared=1` in `result.json`, or the observed line reads `counted=0` with the CLI back on disk. The harness moves `cli.js` to `cli.js.hidden` before launch and restores it on exit; a build, another arm or a hook that rebuilds the runtime can put it back. Confirm with `test -f .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js`; the run is not counted, and the pair must be rerun one arm at a time.
2. **The hop never happened.** `result.json` has no `receiver`, or `note_status` stays `open` or `pending`. Read `relaunch.log` for `prepare-declined`, `killer-timeout`, `killer-hop-cap` or `should-relaunch`; confirm the sender ran under `skilled-loop` and that `SYSTEM_SESSION_RELAUNCH_ENABLED=1` reached it. The harness sets the flag, so a missing hop is usually a hook that did not fire or a note that never armed.
3. **The note leaked the code.** `note_leaked=1` means the note holds `PDSNMMBW`; the run is not counted. Read `note.md` and the sender's `pane.txt` to see whether the sender wrote the code into Goal, Done, Remaining work or In-flight state. Rerun with a fresh label.
4. **The question was never asked.** `asked=0` in `result.json` means the note never reached `claimed` before the timeout. Inspect the receiver's pane and the note status; a receiver that never claims leaves the question unasked, and the run is not counted.
5. **The answer is `pending`.** The question was asked but no reply was captured before the loop ended. Read the receiver's pane; rerun rather than writing a row, because the table records only `correct`, `wrong` or `missing`.
6. **The sender never ran the script.** `codes.txt` still exists under the run's `work/` folder, or `sender_saw_code=0` in `result.json`. The codes never entered the conversation, so there is nothing to recall; rerun.
7. **The CLI was already missing.** The harness hides the CLI only when it exists; a checkout with no build silently runs the baseline with nothing to hide. Build it first, so the arm proves the CLI was present and then removed.

### Counting Rule

A run counts only when all of these hold:

- the note reached `claimed` (the harness also accepts `done`, a claimed note whose work finished);
- `note_leaked=0`;
- the receiver session id differs from the sender's;
- the question was asked (`asked=1`);
- the CLI did not reappear (`cliReappeared=0`).

The harness prints `counted=1` only when all of these hold. `answer` is not part of the rule: a wrong or missing answer is the measurement, not a failed run.

### Recorded Results

One row per run, measured on Claude Code (Sonnet, medium effort). In every counted run the receiver replied `UNKNOWN`.

| arm | runtime | run | answer | lookup_attempted | native_recall | transcript_read | note_leaked | counted |
|---|---|---|---|---|---|---|---|---|
| baseline | claude-code | r1 | missing | 0 | 0 | 0 | 0 | 1 |
| baseline | claude-code | r2 | missing | 0 | 0 | 0 | 0 | 1 |
| baseline | claude-code | r3 | missing | 0 | 0 | 0 | 0 | 1 |

### Optional Follow-Ups

Pi, OpenCode and Codex are optional follow-ups after Claude Code. They need `SYSTEM_SESSION_RELAUNCH_ENABLED=1`, because the session-relaunch hooks ship on only for Claude Code. Codex also needs its hooks trusted (`trust_hooks`), because untrusted project hooks never run and the sender never gets a nudge. The harness as written is Claude-only: it launches `skilled-loop claude`, scores the Claude project transcripts, and hardcodes `runtime=claude-code` in the observed line. A follow-up run needs a runtime argument and the matching transcript reader before its rows can be compared with these.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root playbook and scenario index |
| [hop-recall-conversation](hop-recall-conversation.md) | The same hop with the lookup CLI on disk |
| [compaction-history-recall-baseline-conversation](compaction-history-recall-baseline-conversation.md) | The compaction baseline this pair adapts to a hop |
| [session-relaunch-loop](../../feature-catalog/context-preservation/session-relaunch-loop.md) | Feature contract for the handover and the wrapper |
| [session-relaunch-claude](session-relaunch-claude.md) | The live hop procedure and its recorded results |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh` | Runs one arm: hides the CLI, generates the codes, starts the sender, waits for the claim, asks the question, prints the observed line |
| `specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/analyze.py` | Scores one run from the Claude transcripts and the handoff note |
| `.skilled/hooks/session-relaunch/README.md` | The handoff protocol, the claim seed and the four note sections |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md` | The lookup CLI, its locator and the `locator_missing` refusal |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md` | The runner's turn actions, which exclude a hop |

Provenance: manual only - a live hop in tmux, driven by the harness script, with the observed line written by hand into the table

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: hop-recall-baseline-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/hop-recall-baseline-conversation.md
