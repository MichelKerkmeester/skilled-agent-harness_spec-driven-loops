---
title: "CO-049 -- sk-git-preflight-advisory live utilization on OpenCode 1 and 2"
description: "This scenario validates the sk-git-preflight-advisory plugin for `CO-049`. It focuses on the advisory for a git command that fails a warn rule and on its delivery in the next request."
version: 1.0.1.0
---

# CO-049 -- sk-git-preflight-advisory live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-049`.

---

## 1. OVERVIEW

The `sk-git-preflight-advisory` plugin (`.opencode/plugins/sk-git-preflight-advisory.js`, evaluating through `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs` against `.opencode/skills/sk-git/hard-rules.json`) runs on `tool.execute.before` for `bash`. It evaluates a git command against the sk-git warn rules and adds the advisory to the next request. It never blocks.

### Why This Matters

The advisory is the only warning an operator gets for a git command that will fail or drop work, and it is useless if it never reaches the agent. This scenario proves the warn rule fires on the real command shape and that the advisory arrives in the next request rather than being printed or lost.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-049` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the plugin adds the `add-pathspec-matches-nothing` advisory to the next request after a git command that matches no files.
- Real user request: `Run that failing git add and tell me if the advisory shows up on the next turn.`
- Prompt:
  ```text
  This is a test of a git advisory plugin. Run this shell command once, unchanged; it is expected to fail:
  git add no-such-path-preflight-probe.txt
  Then reply with the single word DONE.
  ```
- Expected execution process: Start a run, let the model run the failing `git add`, then read the next captured request's system prompt.
- Expected signals: The next request's system prompt holds `[add-pathspec-matches-nothing] This pathspec matches no files`, and `git status --short` shows nothing staged.
- Evidence requirements: The matching system-prompt line in `capture.jsonl`, the tool call in `events.jsonl`, `git status --short`, and the exit status.
- Desired user-visible outcome: A PASS or FAIL verdict naming the advisory line.
- Pass/fail: PASS if the next request carries the advisory; FAIL if it does not.
- Failure triage: Put the command on its own line. A trailing ` .` in a one-line prompt became `git add ... .`, which the rule skips. On v2 the tool is named `shell`, so the plugin never runs.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: confirm the plugin, the rule checks and the rules file exist, and export `EVIDENCE_DIR`.
2. v1 run: run the runner with `AI_SESSION_CHILD=1` and the command on its own line.
3. v1 check: read the captured system prompts and confirm nothing is staged.
4. v2 run: repeat the same runner call with `v2`.
5. v2 check: repeat the same checks against the v2 evidence files.
6. Cleanup: `git status --short` shows nothing staged.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${TMPDIR:-/tmp}/plugin-utilization"
PROMPT=$'This is a test of a git advisory plugin. Run this shell command once, unchanged; it is expected to fail:\ngit add no-such-path-preflight-probe.txt\nThen reply with the single word DONE.'
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v1 git-preflight "$PROMPT"
jq -r '.system[]' "$EVIDENCE_DIR/git-preflight.v1.capture.jsonl" | grep -E '\[add-pathspec-matches-nothing\] This pathspec matches no files'
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/git-preflight.v1.events.jsonl"
git status --short

AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v2 git-preflight "$PROMPT"
jq -r '.system[]' "$EVIDENCE_DIR/git-preflight.v2.capture.jsonl" | grep -E '\[add-pathspec-matches-nothing\] This pathspec matches no files'
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/git-preflight.v2.events.jsonl"
git status --short
```

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
|| CO-049 | sk-git-preflight-advisory | Confirm the `add-pathspec-matches-nothing` advisory reaches the next request | `This is a test of a git advisory plugin. Run this shell command once, unchanged; it is expected to fail:<br>git add no-such-path-preflight-probe.txt<br>Then reply with the single word DONE.` | 1. `AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 git-preflight "$PROMPT"` -> 2. `jq -r '.system[]' "$EVIDENCE_DIR/git-preflight.v1.capture.jsonl" \| grep -E '\[add-pathspec-matches-nothing\] This pathspec matches no files'` -> 3. `git status --short` -> 4. Repeat 1 to 3 with `v2` | The next request holds `[add-pathspec-matches-nothing] This pathspec matches no files`; nothing is staged | `git-preflight.v1.capture.jsonl`, `git-preflight.v1.events.jsonl`, `git-preflight.v1.exit` and the v2 equivalents | PASS if the next request carries the advisory; FAIL if it does not | Put the command on its own line; a trailing ` .` is skipped by the rule; on v2 the tool is `shell` |

---

## 4. SOURCE FILES

### Playbook Sources

|| File | Role |
|---|---|
|| `manual-testing-playbook.md` | Root directory page and scenario summary |
|| `plugin-utilization/sk-git-preflight-advisory.md` | Canonical per-feature execution contract |
|| `plugin-utilization/run-plugin-scenario.sh` | Runs one live session through the capture proxy and writes events, capture, effects and exit files |
|| `plugin-utilization/capture-proxy.mjs` | Records every model request's system prompt, tools and tool results |

### Implementation And Test Anchors

|| File | Role |
|---|---|
|| `.opencode/plugins/sk-git-preflight-advisory.js` | The plugin that adds the advisory to the next request and never blocks |
|| `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs` | The shared rule checks the plugin imports |
|| `.opencode/skills/sk-git/hard-rules.json` | The rule set the checks evaluate |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-049
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/sk-git-preflight-advisory.md`
