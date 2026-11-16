---
title: "hop-recall-conversation -- Hop recall conversation"
description: "This scenario measures whether a session that claims a handoff note recovers a code the note left out, and whether it reaches for the history lookup unprompted."
trigger_phrases:
  - "hop recall conversation"
  - "handoff recall with lookup"
version: 1.0.3.0
---

# hop-recall-conversation -- Hop recall conversation

This document captures the hop-recall scenario contract, the operator procedure, the checks and the source anchors.

---

## 1. OVERVIEW

A sender session under `skilled-loop` prints 120 one-time codes, then works on an unrelated small task. A low relaunch threshold forces a hop to a fresh session. Once the receiver claims the handoff note, the operator asks it for the code printed for `K073`. The lookup CLI is on disk, but the hop prints no lookup offer, so this arm records whether the receiver finds and runs the CLI on its own.

### Why This Matters

The handover starts a fresh session near the context limit, so the receiver holds only the four sections of the handoff note. The claim prints a `## History Lookup` section for the sender's session, so the receiver can look up a detail the note left out. This pair measures whether it does: the two scenarios differ only in whether the compiled lookup core exists in the checkout, so the section is printed in one and withheld in the other.

The conversation runner cannot drive a hop. Its only turn actions are `restart` and `compact` (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md` §3), and `restart` resumes the same session, so it cannot start the fresh session a hop requires. This page is therefore an operator procedure built on the harness script, not a `json conversation` block.

---

## 2. SCENARIO CONTRACT

Operators run this scenario and [hop-recall-baseline-conversation](hop-recall-baseline-conversation.md) with the same label scheme, then compare their observed lines.

- Feature ID: hop-recall-conversation
- Objective: measures whether a session that claims a handoff note recovers a code the note left out, and whether it reaches for the history lookup unprompted
- Real user request: a long session hands over to a fresh one, and the user then asks the new session for a value the old session printed.
- Prompt: `Read-only task. Gate 3 is pre-answered D) Skip: you change no file. First run: sh $work/show-codes.sh so the one-time codes are issued (it clears them once shown, which is expected). Then the actual task: report the line count of .skilled/hooks/session-handover/README.md and name its first heading. If you are asked to hand over to a fresh session, do that and let the new session finish the task.`
- Expected execution process: the harness writes `codes.txt` and `show-codes.sh`, which prints the 120 codes and deletes `codes.txt`. It starts a sender under `skilled-loop` with `SESSION_HANDOVER_THRESHOLD=0.05`, `SESSION_HANDOVER_WINDOW_TOKENS=100` and `SESSION_HANDOVER_MAX_HOPS=1`. The sender runs the script, reports the README line count and first heading, follows the nudge through the handoff steps, and Stop arms the record. The killer ends the sender, the wrapper starts a receiver with the claim seed, and the receiver claims the note. The harness waits 30 seconds after the note reaches `claimed`, asks the question, waits for the reply to settle, and prints one observed line.
- Expected signals: `observed=arm=lookup runtime=claude-code answer=<correct|wrong|missing> lookup_attempted=<0|1> native_recall=<0|1> transcript_read=<0|1> note_leaked=<0|1> note_status=<status> counted=<0|1>`. `lookup_attempted=1` means a tool call after the question named the history CLI, without the operator telling it to.
- Desired user-visible outcome: the receiver answers the code, says `UNKNOWN`, or records what it could not recover, and the operator learns whether it tried the lookup or read the sender's transcript.
- Pass/fail: PASS if the run completes, the CLI was on disk, the note reaches `claimed`, `note_leaked=0`, the receiver session differs from the sender, the question was asked, and the observed line records `answer=correct`, `wrong` or `missing`. FAIL if the CLI is missing, the hop never happens, the note holds the code, or the question is never asked.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Read-only task. Gate 3 is pre-answered D) Skip: you change no file. First run: sh $work/show-codes.sh so the one-time codes are issued (it clears them once shown, which is expected). Then the actual task: report the line count of .skilled/hooks/session-handover/README.md and name its first heading. If you are asked to hand over to a fresh session, do that and let the new session finish the task.`
- `$work` is the run's `work/` folder under `scratch/runs/<arm>-<label>/`; the harness fills in the absolute path before it starts the sender.
- The question the operator asks after the claim: `What exact code did show-codes.sh print for K073 in the previous session? Reply with the code only, or UNKNOWN if you cannot determine it. Do not write any file.`

### Operator Procedure

The conversation runner cannot drive a hop: its only turn actions are `restart` and `compact` (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md` §3), and `restart` resumes the same session. This page is therefore an operator procedure built on the harness script, not a `json conversation` block.

1. Confirm `tmux`, `node` and a logged-in Claude Code are available, and that the history CLI is built: `test -f .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js && echo built`. This arm needs it on disk.
2. Run the arm from the repository root with a label that names the runtime and the attempt, for example `lookup claude-1`. The harness captures the pane every 5 seconds, answers the folder-trust and hook-review dialogs itself, and prints nothing until the run ends.
3. Wait for the observed line. The default bound is 540 seconds; pass a third argument to change it.
4. Read `result.json` and `pane.txt` under `scratch/runs/<arm>-<label>/` before writing a row. `result.json` holds the sender and receiver session ids, the note name and status, `sender_saw_code`, the answer, the three signals and the receiver's last reply.
5. Copy the observed line's fields into one row of `### Recorded Results`. A run counts only under the rule below.
6. Run the other arm with the same label suffix, so the pair differs only in the arm.

### Commands

1. Lookup arm:
   ```bash
   bash specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh lookup <label>
   ```
2. Baseline arm, for the paired run:
   ```bash
   bash specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh baseline <label>
   ```
3. Optional timeout: add a third argument in seconds; the default is 540.
4. The harness leaves its run under `scratch/runs/<arm>-<label>/`. It starts the sender with `--model sonnet --effort medium` and the tmux session name `hoprecall-<arm>-<label>`.

### Expected

The sender prints the codes, the nudge arrives almost immediately because the window is 100 tokens, the sender prepares the note, Stop arms it, and the wrapper starts a receiver that claims the note. The receiver answers `PDSNMMBW`, guesses another code, or says `UNKNOWN`; the observed line records which, and whether it ran the history CLI or read the sender's transcript. The claim mints a fresh locator for the sender, so a receiver that runs the printed command gets a reply and can answer from it.

### Evidence

The harness leaves `scratch/runs/<arm>-<label>/` holding `pane.txt` (the captured scrollback), `relaunch.log` (the run's slice of the relaunch log), `note.md` (a copy of the handoff note), `result.json` (the scored fields) and `work/` (the script and, if the sender never ran it, `codes.txt`). The observed line is the last line the harness prints; `result.json` holds the scored fields (`sender`, `receiver`, `note`, `note_status`, `note_leaked`, `sender_saw_code`, `answer`, `lookup_attempted`, `native_recall`, `transcript_read`, `reply`) plus `arm`, `label`, `runtime`, `asked`, `trustDialogs` and `cliReappeared`. `counted` is printed only in the observed line; recompute it from the rule below. The harness does not record the model, so note the model Claude Code reports beside the row.

### Pass / Fail

- **Pass**: the run completes, the CLI was on disk, the note reaches `claimed`, `note_leaked=0`, the receiver session differs from the sender, the question was asked, and the observed line records `answer=correct`, `wrong` or `missing`.
- **Fail**: the CLI is missing, the hop never happens, the note holds the code, or the question is never asked. A wrong or missing answer is a recorded result, not a failure of the run.

### Failure Triage

1. **The hop never happened.** `result.json` has no `receiver`, or `note_status` stays `open` or `pending`. Read `relaunch.log` for `prepare-declined`, `killer-timeout`, `killer-hop-cap` or `should-relaunch`; confirm the sender ran under `skilled-loop` and that `SYSTEM_SESSION_HANDOVER_ENABLED=1` reached it. The harness sets the flag, so a missing hop is usually a hook that did not fire or a note that never armed.
2. **The note leaked the code.** `note_leaked=1` means the note holds `PDSNMMBW`; the run is not counted. Read `note.md` and the sender's `pane.txt` to see whether the sender wrote the code into Goal, Done, Remaining work or In-flight state. Rerun with a fresh label.
3. **The question was never asked.** `asked=0` in `result.json` means the note never reached `claimed` before the timeout. Inspect the receiver's pane and the note status; a receiver that never claims leaves the question unasked, and the run is not counted.
4. **The answer is `pending`.** The question was asked but no reply was captured before the loop ended. Read the receiver's pane; rerun rather than writing a row, because the table records only `correct`, `wrong` or `missing`.
5. **`lookup_attempted=1` with `answer=missing`.** Confirm the tool call in `pane.txt` and read the refusal code in the reply. The receiver ran the lookup and the CLI refused, so rerun the printed command by hand from the checkout root to see the code, and treat a `store_unreadable` reply as a reader defect to report.
6. **The sender never ran the script.** `codes.txt` still exists under the run's `work/` folder, or `sender_saw_code=0` in `result.json`. The codes never entered the conversation, so there is nothing to recall; rerun.
7. **The CLI is missing.** This arm needs `.skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js`. Build it with `cd .skilled/skills/system-spec-kit/runtime && npm run build` and rerun, because a run without it is not the lookup arm. If the build cannot be made, record the run as a skip with the missing build as its blocker.

### Counting Rule

A run counts only when all of these hold:

- the note reached `claimed` (the harness also accepts `done`, a claimed note whose work finished);
- `note_leaked=0`;
- the receiver session id differs from the sender's;
- the question was asked (`asked=1`);
- in the baseline arm, the CLI did not reappear (`cliReappeared=0`).

The harness prints `counted=1` only when all of these hold. `answer` is not part of the rule: a wrong or missing answer is the measurement, not a failed run.

### Recorded Results

One row per run, measured on Claude Code (Sonnet, medium effort). The `before` rows were measured while the lookup was offered only after a compaction, and in each the receiver replied `UNKNOWN`. The `claim offer` rows were measured with the section printed at the claim. In the two that answered `missing`, the receiver ran the lookup and the CLI refused with `store_unreadable`, because the transcript reader rejected a sender message that made two tool calls. The `reader fixed` rows were measured after that reader was corrected.

| arm | runtime | run | answer | lookup_attempted | native_recall | transcript_read | note_leaked | counted |
|---|---|---|---|---|---|---|---|---|
| lookup, before | claude-code | r2 | missing | 0 | 0 | 0 | 0 | 1 |
| lookup, before | claude-code | r3 | missing | 0 | 0 | 0 | 0 | 1 |
| lookup, before | claude-code | r4 | missing | 0 | 0 | 0 | 0 | 1 |
| lookup, claim offer | claude-code | after-r2 | missing | 1 | 0 | 0 | 0 | 1 |
| lookup, claim offer | claude-code | after-r3 | correct | 1 | 0 | 0 | 0 | 1 |
| lookup, claim offer | claude-code | after-r4 | missing | 1 | 0 | 0 | 0 | 1 |
| lookup, reader fixed | claude-code | after-r5 | correct | 1 | 0 | 0 | 0 | 1 |
| lookup, reader fixed | claude-code | after-r6 | correct | 1 | 0 | 0 | 0 | 1 |
| lookup, reader fixed | claude-code | after-r7 | correct | 1 | 0 | 0 | 0 | 1 |

Run `r1` used an earlier prompt that told the sender a follow-up question about the output would come. The sender copied all 120 codes into the note, the receiver answered `correct` from the note, and the run is not counted (`note_leaked=1`). Its evidence is in the packet's `scratch/runs/lookup-r1/`. Run `after-r1` is not counted for the same reason: the sender copied the codes into the note.

### Optional Follow-Ups

Pi, OpenCode and Codex are optional follow-ups after Claude Code. They need `SYSTEM_SESSION_HANDOVER_ENABLED=1`, because the session-handover hooks ship on only for Claude Code. Codex also needs its hooks trusted (`trust_hooks`), because untrusted project hooks never run and the sender never gets a nudge. The harness as written is Claude-only: it launches `skilled-loop claude`, scores the Claude project transcripts, and hardcodes `runtime=claude-code` in the observed line. A follow-up run needs a runtime argument and the matching transcript reader before its rows can be compared with these.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root playbook and scenario index |
| [hop-recall-baseline-conversation](hop-recall-baseline-conversation.md) | The same hop with the lookup CLI hidden |
| [session-handover-loop](../../feature-catalog/context-preservation/session-handover-loop.md) | Feature contract for the handover and the wrapper |
| [session-handover-claude](session-handover-claude.md) | The live hop procedure and its recorded results |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh` | Runs one arm: generates the codes, starts the sender, waits for the claim, asks the question, prints the observed line |
| `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/analyze.py` | Scores one run from the Claude transcripts and the handoff note |
| `.skilled/hooks/session-handover/handoff-protocol.md` | The handoff protocol, the claim seed and the four note sections |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md` | The lookup CLI, its locator and its refusal codes |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md` | The runner's turn actions, which exclude a hop |

Provenance: manual only - a live hop in tmux, driven by the harness script, with the observed line written by hand into the table

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: hop-recall-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/hop-recall-conversation.md
