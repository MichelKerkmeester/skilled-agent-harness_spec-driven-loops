---
title: Manual Testing Playbook Conversation Scenarios
description: How to script orchestrator and subject conversations in a manual testing playbook.
trigger_phrases:
  - "conversation scenario"
  - "json conversation block"
  - "multi-turn playbook scenario"
  - "orchestrator subject test"
  - "conversation script schema"
importance_tier: normal
contextType: implementation
version: 1.0.1.0
---

# Manual Testing Playbook Conversation Scenarios

This reference defines the closed script format for conversation scenarios in a manual testing playbook. The validator checks the script, and the runner executes the same parsed script.

---

## 1. OVERVIEW

Write a conversation scenario when the behavior depends on multiple prompts, scripted answers, runtime actions, or state checks across a session. One prompt is enough when a single request and its result capture the full behavior. The ordered decision rule, the runtime requirements and the cost of each style live in `SKILL.md` §6, Choosing the Scenario Style.

The script is one fenced `json conversation` block in section 3 of the scenario file. The block is the source of truth for the conversation turns.

---

## 2. ROLES

- **Orchestrator**: The runner or an operator who runs the script by hand. It plays the human by pausing, typing each turn, answering expected questions, and running the state check.
- **Subject**: The runtime's interactive session under test, started in a scratch project. It never sees the script, only what the orchestrator types.

---

## 3. BLOCK SCHEMA

The validator accepts only the keys in this table. Any other key is an error, so a misspelled key cannot fall back to a default.

| Key | Type | Required | Meaning |
|-----|------|----------|---------|
| `runtimes` | array of strings | Yes | The runtimes this script is written for, from `claude-code`, `opencode`, `codex`, `pi` and `devin` |
| `setup` | array of strings | No | Runs before the subject starts. Exit 77 skips the runtime with the first non-empty output line as the blocker. Other nonzero exits refuse the run as `SETUP_FAILED` |
| `env` | object of strings | No | Variables added to the subject's environment, such as a kill switch |
| `trust_hooks` | boolean | No | When true, the runner trusts the project's hooks on a runtime that asks, which is Codex today, so they fire during the run. The runner records each trust entry for the run's scratch project that the subject adds to or changes in the operator's Codex config, removes or restores it after the run, and writes the result to `hook-trust.json`. Entries for other folders, which another Codex session may be writing, are listed under `outside_project` and left alone. Codex's review screen also lists the user's own changed global hooks, so the runner picks "Trust all" only when the screen's count of new or changed hooks is no larger than the handlers in the project's `.codex/hooks.json`; otherwise it continues without trusting and fails the run with `HOOK_TRUST_OUTSIDE_PROJECT`. Defaults to false, which leaves hooks untrusted |
| `turns` | array of turn objects | Yes | The conversation, in order. The first turn holding `send` or `action` must be a `send` |
| `turns[].id` | string | No | Name used for the turn's evidence folder. Defaults to the 1-based position. Unique |
| `turns[].send` | string | At most one of `send` or `action` | What the human types, on one line. A turn with neither is a check-only turn, such as a baseline before the first send |
| `turns[].action` | `restart` or `compact` | At most one of `send` or `action` | Restart the subject into the same session, or compact its context. Compaction followed by a send is two turns |
| `turns[].delay_ms` | integer 0 or more, or `[min, max]` | No | The human's pause before the turn starts. A pair draws from a generator seeded by the runner's `--seed`. Defaults to 2000 |
| `turns[].timeout_ms` | integer, 1 or more | No | The longest the turn may run before it fails. Defaults to 300000 |
| `turns[].retry` | 0 or 1 | No | Run a failed turn once more before the failure ends the run. Defaults to 0 |
| `turns[].questions` | array | No | The questions the subject should ask during this turn, each with its scripted answer |
| `turns[].questions[].match` | string | Yes | A regular expression tested against the question text. A question that wraps onto several screen lines is joined into one line first |
| `turns[].questions[].answer` | object | Yes | Exactly one of `select`, `other` or `reply` |
| `answer.select` | array of strings, not empty | | Option labels to choose in a question-tool dialog. Two or more labels need `multi: true`. A label matches an option exactly, ignoring case, or else the one option that contains it, so `Skip` chooses `D) Skip documentation (Recommended)`. A label that fits several options fails the turn |
| `answer.multi` | boolean | No | Marks a multi-select. Only valid beside `select`. Defaults to false |
| `answer.other` | string | | Text typed into the dialog's free-text row |
| `answer.reply` | string | | A plain chat message, for a question the subject asked in chat |
| `turns[].questions[].delay_ms` | integer 0 or more, or `[min, max]` | No | The human's pause after the question renders and before answering. Defaults to 1000 |
| `turns[].questions[].optional` | boolean | No | When true, the turn still passes if the subject never asks. Defaults to false |
| `turns[].check` | string | Yes | A shell command run in the scratch project after the turn settles |

The validator parses the block but never runs `setup` or `check` commands.

---

## 4. TURN OUTCOMES

- A setup command that exits 77 skips the runtime and records its first non-empty output line as the blocker. The subject is not launched. Other nonzero exits refuse the run as `SETUP_FAILED`.
- A question that matches no entry fails the turn. A required question entry that the subject never asks also fails the turn. An entry with `optional: true` does not fail the turn when the subject never asks.
- A check that exits 0 passes the turn. Exit 77 skips that turn, records `SKIP` and uses the first non-empty output line as its blocker. Any other exit fails the turn.
- The last non-empty output line from the check is the observed value.
- A failed turn with `retry: 1` runs once more. Both attempts are recorded. After a failure ends the runtime's run, later turns are recorded as `NOT_RUN`.
- A skipped turn does not end the runtime's run.
- A check-only turn has neither `send` nor `action`. The first turn with either field must use `send`.
- When a launch or a turn has already failed, the runner reads the screen once, and a line that matches a usage-limit message names the failure `QUOTA_EXHAUSTED` and becomes its blocker. A passing turn is never reclassified, and only Codex's wording (`You've hit your usage limit`) is confirmed from a recorded screen, while the other runtimes' patterns are their known wording, not yet seen live.

---

## 5. EVIDENCE EACH TURN LEAVES

Each turn leaves the following evidence:

- The screen after the turn settles.
- The screen at each question.
- The check's output and exit code.
- The turn's slice of raw pane output in `raw-pane.log`.
- The pane's full plain-text scrollback in `history.txt`.
- One line per keystroke group in the run's action log.
- The turn's start and end times.
- One `checkpoints.tsv` row per turn with the turn id, status, attempts, evidence folder, and observed value.

The raw pane slice and `history.txt` exist when the check runs, so a check can read both from `$CONVERSATION_TURN_DIR`. `history.txt` holds the full plain-text scrollback and is the right file to search for text that a long reply may have scrolled off the 50-row `screen.txt`. `raw-pane.log` carries terminal escape codes between words, so a plain `grep` on it is unreliable.

---

## 6. COMPLETE EXAMPLE

```json conversation
{
  "runtimes": ["claude-code", "opencode", "pi", "devin"],
  "turns": [
    {
      "id": "pick-color",
      "send": "Ask me which color to use with your question tool, offering red, green and blue, then write my answer to answers.txt.",
      "delay_ms": 3000,
      "questions": [{ "match": "colou?r", "answer": { "select": ["green"] } }],
      "check": "grep -qx green answers.txt"
    },
    { "id": "resume", "action": "restart", "check": "test -s answers.txt" }
  ]
}
```

---

## 7. AUTHORING RULES

- Start the scenario file from `assets/manual-testing-playbook-conversation-snippet-template.md`.
- Put one `json conversation` block in each scenario file under `### Conversation Script` in section 3.
- The first `send` must equal the scenario contract prompt.
- A second scratch project or a different `env` is a separate scenario file and runner invocation.
- Compaction followed by a send is two turns: one turn with `action: compact` and its check, then a turn with the send.
- A turn with neither `send` nor `action` is check-only. The first turn holding one of those fields must be a `send`.
- The validator checks the block but never runs `setup` or `check` commands.
- Never match a model reply with `grep -x` or `grep -Fx` on `screen.txt`. Runtime prefixes prevent an exact line match: Claude replies start with `⏺ `, Codex with `• `, Pi with ` ● `, Devin with a leading space and OpenCode with five spaces. Use `grep -F` with a distinctive marker.
- `screen.txt` shows a visible 50-row pane that retains earlier turns and the current turn's echoed send. Inspect only text after that turn's echoed send by using the `awk` pattern in [the session resume example](../../../../skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/resume-specific-session-by-id-conversation.md), or check a marker the model can learn only by reading a file. Never put the expected marker in a `send`.
- A check can read the turn's evidence from `$CONVERSATION_TURN_DIR`. The raw pane slice in `raw-pane.log` and the full plain-text scrollback in `history.txt` both exist before the check runs. `history.txt` is the right file to search for text that a long reply may have scrolled off the 50-row `screen.txt`. `raw-pane.log` carries terminal escape codes between words, so a plain `grep` on it is unreliable.
- The scratch project inherits the global `~/.claude/CLAUDE.md`, so before any file write the model asks the spec-folder question in plain chat. For every turn that writes, add a `questions` entry with `"answer": {"reply": "D"}` and `"optional": true`. An `other` answer belongs only in a runtime question dialog, never in plain chat. Use `reply` for chat questions.
- The scratch starts without skills. When a scenario needs a skill, setup must copy the repository skills and the runtime project configuration into scratch with `cp -R "$CONVERSATION_REPO_ROOT/.skilled" .skilled` and `cp -R "$CONVERSATION_REPO_ROOT/.claude" .claude`, replacing `.claude` with `.opencode`, `.pi` or `.devin` when that runtime requires it. Their relative symlinks resolve after `.skilled` is copied. Never symlink into the repository because the runner refuses the run with `CONTAINMENT_ESCAPED`.
- Do not coach the behavior under test. Each `send` must be the plain user request. Do not tell the model to ask a question, pause, refuse or name which tool it used.
- A question's `match` regular expression must identify the question asked and must not match any text in the echoed `send`.
- If a required precondition is missing, such as a fixture, credential, tool or network access, setup must exit with status `77` and print a one-line reason to skip the runtime. Its first non-empty output line is the blocker. A check can exit `77` to skip its turn.
- Checks must only read state. Nothing may write under `$CONVERSATION_REPO_ROOT`.

---

## 8. RUNNING A SCRIPT

Run the script from the repository root:

```bash
node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario <file.md> --runtime <id[,id...]> --scratch <scratch-dir> --out <evidence-dir> [--seed N] [--overwrite] [--no-sandbox]
```

The runtime list accepts `claude-code`, `opencode`, `codex`, `pi` and `devin`. The scratch directory must be outside the repository. The evidence directory gets one subfolder per requested runtime.

Exit status `0` means every runtime passed or skipped. Exit status `1` means at least one runtime failed. Exit status `2` means a usage error or a refused run.

Each runtime folder contains `result.json`, `actions.jsonl`, `raw-pane.log`, `setup.log`, `repo-before.txt`, `repo-after.txt` and `checkpoints.tsv`. Each turn folder contains `screen.txt`, `history.txt`, its `raw-pane.log` slice, one `question-N.txt` file per detected question and `check.txt`. The evidence root contains `matrix.md`, with one verdict and evidence path per requested runtime.

The runner sets `CONVERSATION_RUNTIME`, `CONVERSATION_REPO_ROOT`, `CONVERSATION_RUN_DIR` (the runtime's evidence folder) and `CONVERSATION_TURN_DIR` (the turn's evidence folder) for each `check` command. A check defaults to 60 seconds. Set `CONVERSATION_CHECK_TIMEOUT_MS` to override that bound. An overrun fails as `CHECK_TIMEOUT`. Each `setup` command has 120 seconds. An overrun refuses the run as `SETUP_TIMEOUT`. Exit 77 skips the runtime with its first non-empty output line as the blocker. The runner sets `CONVERSATION_REPO_ROOT` and `CONVERSATION_RUNTIME` for every `setup` command too, so setup can copy project files from the repository without any variable set by hand. `CONVERSATION_REPO_ROOT` is the repository the run snapshots, which `--repo-root` can point at a worktree.

Use `--seed N` to replay random delays declared as `[min, max]`. The runner records the seed in `result.json`. Use `--overwrite` to replace existing per-runtime evidence folders. Without it, the runner refuses a non-empty runtime folder.

Before and after each runtime run, the runner hashes the repository's `specs/` folder and its watched `.skilled/skills/.state/` subfolders by path, size and SHA-256. The watched subfolder is `decision-capture` by default. Set `CONVERSATION_WATCH` to a comma-separated list of subfolder names to watch others. A difference fails that runtime as `REPO_CHANGED` and keeps both snapshots in its evidence folder.

On macOS the runner starts Claude Code, OpenCode, Pi and Devin through `/usr/bin/sandbox-exec` with a profile that denies writes under the repository root, under the checkout the runner lives in and under the git common dir. Codex is not wrapped, because it keeps its own `--sandbox workspace-write` and one seatbelt profile cannot be applied inside another. `--no-sandbox` turns the wrapper off. Each runtime's `result.json` gains a `sandbox` key holding `seatbelt`, `codex-workspace-write`, `off` or `unavailable`. When `sandbox-exec` is missing or the host is not macOS, the value is `unavailable` and the runner writes one stderr line saying the subject runs unsandboxed. The snapshot check still runs either way.

---

## 9. PER-RUNTIME NOTES

| Runtime | Probe status | Recorded behavior |
|---------|--------------|-------------------|
| Claude Code | probed | Version 2.1.316. The `AskUserQuestion` dialog supports single-select, multi-select and a free-text Other row. The probe records arrow and Enter navigation, `/compact` and resume through the same session ID. |
| OpenCode | probed | Version 2.1.4. Session ids must start with `ses_`, so the runner derives one from its UUID and the same `--session` flag resumes it. The `question` dialog toggles a multi-select row with Enter and submits from its Submit tab; the free-text row opens with Enter. The model comes from the root `opencode.json`, which setup must copy. |
| Codex | probed | Version 0.164.0. Start-up can show a folder-trust screen, an update offer (always skipped) and a hook review. Hooks stay untrusted unless the script sets `trust_hooks`; then the runner picks "Trust all and continue" and undoes those trust entries after the run. `request_user_input` offers one choice per question, so several choices or an Other answer are typed as a note on its `None of the above` row. Restart uses `codex resume --last` in the scratch folder. Enter must wait 500 ms after typed text, or it lands inside the paste. |
| Pi | probed | Version 1.4.0. Two question tools: `question` draws a pick list ending in `Done (...)`, and `ask_user_question` draws a dialog with Space to toggle and a Submit row. The run quits with `/quit`, because `/exit` is sent to the model. `/compact` refuses a session that is still small. |
| Devin | probed | Version 3000.11.234. A folder-trust screen opens the first run. The dialog toggles a multi-select row with Space and confirms with Enter; the Other row takes typed text directly. Restart uses `devin --continue` in the scratch folder. Enter must wait 500 ms after typed text. |

Each live MTP-007 run must record the model used by every runtime beside `matrix.md`. If a runtime does not expose its model, record `UNKNOWN` and note what you checked.

---

## 10. MULTI-RUNTIME LIVE TESTS

Use the script fields below to cover a multi-runtime live test:

| Need | Script form |
|------|-------------|
| Single-select, multi-select or Other tool question | Use `answer.select` with one or several labels, or `answer.other` for free text. Set `multi: true` when selecting several labels. |
| Question asked in plain chat | Use `answer.reply`. |
| Process question that must leave no trace | Add an expected question entry, usually `optional: true` when runtimes differ. The turn check asserts that the captured state has no trace. |
| Mid-run or final save | Use a `send` turn that requests the save, then a `check` that copies saved files into `$CONVERSATION_TURN_DIR`. |
| Restart or compaction | Use `action: "restart"` or `action: "compact"`, followed by a state check. |
| Kill switch | Put the switch in a separate scenario file's `env` and check that the run wrote nothing. |
| Named stages and per-turn state copies | Give each turn an `id` and use its `check` to copy state into `$CONVERSATION_TURN_DIR`. |
| Runtime results | Pass a comma-separated `--runtime` list. Review each row and evidence path in `matrix.md`. |
| Model used | Record each runtime's model next to `matrix.md`. The runner matrix does not have a model column. |

The scenario's `setup` must copy each available runtime project configuration from `$CONVERSATION_REPO_ROOT` into the scratch project: `.claude/`, `.opencode/`, the root `opencode.json`, `.codex/`, `.pi/` and `.devin/`. Skip a configuration directory when it is missing. The live test then exercises the same project instructions the runtime would read in the repository.

---

## 11. RELATED RESOURCES

- [../SKILL.md](../SKILL.md) - Scenario design and validation rules
- [../assets/manual-testing-playbook-conversation-snippet-template.md](../assets/manual-testing-playbook-conversation-snippet-template.md) - Per-feature conversation scenario scaffold
- [../scripts/run-conversation-scenario.cjs](../scripts/run-conversation-scenario.cjs) - The shared conversation runner this reference documents
- [../manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md](../manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md) - The runner's own conversation scenario
