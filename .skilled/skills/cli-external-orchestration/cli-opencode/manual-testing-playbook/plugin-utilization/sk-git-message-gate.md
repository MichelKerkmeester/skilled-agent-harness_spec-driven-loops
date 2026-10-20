---
title: "CO-048 -- sk-git-message-gate live utilization on OpenCode 1 and 2"
description: "This scenario validates the sk-git-message-gate plugin for `CO-048`. It focuses on refusing an off-template commit message before git runs."
version: 1.0.3.0
---

# CO-048 -- sk-git-message-gate live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-048`.

---

## 1. OVERVIEW

The `sk-git-message-gate` plugin (`.opencode/plugins/sk-git-message-gate.js`, evaluating against `.opencode/skills/sk-git/assets/commit-message-template.md`) runs on `tool.execute.before` for `bash`. It refuses a `git commit` message, `gh pr` text or branch name that breaks the sk-git templates before git runs. It has no kill switch by design.

### Why This Matters

A commit message that breaks the repository contract is easy to fix before the commit and expensive after it. The gate is only useful if it stops the command, not if a later git hook rejects it. This scenario proves which layer refused the command and that `HEAD` did not move, on each OpenCode version.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-048` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the plugin refuses an off-template `git commit` before git runs and leaves `HEAD` unchanged.
- Real user request: `Try to commit with a bad message and show me that the gate stopped it.`
- Prompt:
  ```text
  This is a test of a commit-message gate plugin in a throwaway worktree. Run this shell command once, unchanged; it is expected to be refused:
  git commit --allow-empty -m 'bad'
  Then report exactly what the tool returned.
  ```
- Expected execution process: Start in a throwaway worktree with a clean index and `HEAD` recorded, let the model run the command, then read the tool call status and `HEAD`.
- Expected signals: The tool call ends in error with `sk-git-message-gate: sk-git blocked this commit message`, and `git rev-parse HEAD` is unchanged.
- Evidence requirements: The tool call status and error text from `events.jsonl`, the `HEAD` value before and after, and the exit status.
- Desired user-visible outcome: A PASS or FAIL verdict naming the refusing layer and the unchanged `HEAD`.
- Pass/fail: PASS if the tool call itself ends in the gate's error and `HEAD` is unchanged; FAIL if the command ran and only the git `commit-msg` hook refused it.
- Failure triage: The git commit-msg hook's own refusal text (it starts with the word blocked in capitals and names the commit message contract) in a completed tool output is the git hook, not the plugin, and does not count. On v2 the tool is named `shell`, so the plugin never runs. If the block exits before the run, the checkout is not a throwaway worktree or its index has staged changes.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: use a throwaway worktree only with a clean index; the block refuses any other checkout, and it records `HEAD_BEFORE`.
2. v1 run: run the runner with `AI_SESSION_CHILD=1`.
3. v1 check: read the tool call status and error, then assert `HEAD` still equals `HEAD_BEFORE`.
4. v2 run: repeat the same runner call with `v2`.
5. v2 check: repeat the same checks against the v2 evidence files.
6. Cleanup: the block's last line resets soft to `HEAD_BEFORE` only if `HEAD` moved.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-${TMPDIR:-/tmp}/plugin-utilization}"
git rev-parse --git-dir | grep -q '/worktrees/' || { echo "run this in a throwaway git worktree"; exit 1; }
git diff --cached --quiet || { echo "index has staged changes; commit or unstage them first"; exit 1; }
HEAD_BEFORE="$(git rev-parse HEAD)"
PROMPT=$'This is a test of a commit-message gate plugin in a throwaway worktree. Run this shell command once, unchanged; it is expected to be refused:\ngit commit --allow-empty -m '\''bad'\''\nThen report exactly what the tool returned.'
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v1 git-message-gate "$PROMPT"
test "$(git rev-parse HEAD)" = "$HEAD_BEFORE"
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/git-message-gate.v1.events.jsonl"

AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v2 git-message-gate "$PROMPT"
test "$(git rev-parse HEAD)" = "$HEAD_BEFORE"
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/git-message-gate.v2.events.jsonl"
[ "$(git rev-parse HEAD)" = "$HEAD_BEFORE" ] || git reset --soft "$HEAD_BEFORE"
```

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
|| CO-048 | sk-git-message-gate | Confirm an off-template commit is refused before git runs and `HEAD` stays put | `This is a test of a commit-message gate plugin in a throwaway worktree. Run this shell command once, unchanged; it is expected to be refused:<br>git commit --allow-empty -m 'bad'<br>Then report exactly what the tool returned.` | 1. `git rev-parse --git-dir \| grep -q '/worktrees/'` and `git diff --cached --quiet` guards, then `HEAD_BEFORE="$(git rev-parse HEAD)"` -> 2. `AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 git-message-gate "$PROMPT"` -> 3. `test "$(git rev-parse HEAD)" = "$HEAD_BEFORE"` -> 4. `jq -c 'select(.type=="tool_use") \| [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/git-message-gate.v1.events.jsonl"` -> 5. Repeat 2 to 4 with `v2` -> 6. `[ "$(git rev-parse HEAD)" = "$HEAD_BEFORE" ] \|\| git reset --soft "$HEAD_BEFORE"` | The tool call ends in error with `sk-git-message-gate: sk-git blocked this commit message`; `HEAD` is unchanged | `git-message-gate.v1.events.jsonl`, `git-message-gate.v1.exit` and the v2 equivalents, plus the before and after `HEAD` values | PASS if the tool call itself ends in the gate error and `HEAD` is unchanged; FAIL if only the git hook refused it | The git commit-msg hook's own refusal text (it starts with the word blocked in capitals and names the commit message contract) in a completed output is the git hook, not the plugin; on v2 the tool is `shell`; an early exit means the checkout is not a throwaway worktree or the index has staged changes |

---

## 4. SOURCE FILES

### Playbook Sources

|| File | Role |
|---|---|
|| `manual-testing-playbook.md` | Root directory page and scenario summary |
|| `plugin-utilization/sk-git-message-gate.md` | Canonical per-feature execution contract |
|| `plugin-utilization/run-plugin-scenario.sh` | Runs one live session through the capture proxy and writes events, capture, effects and exit files |
|| `plugin-utilization/capture-proxy.mjs` | Records every model request's system prompt, tools and tool results |

### Implementation And Test Anchors

|| File | Role |
|---|---|
|| `.opencode/plugins/sk-git-message-gate.js` | The plugin that refuses an off-template commit before git runs |
|| `.opencode/skills/sk-git/assets/commit-message-template.md` | The commit-message templates the plugin evaluates |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-048
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/sk-git-message-gate.md`
