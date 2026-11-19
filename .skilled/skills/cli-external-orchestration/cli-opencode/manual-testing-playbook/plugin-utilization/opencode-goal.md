---
title: "CO-044 -- opencode-goal live utilization on OpenCode 2"
description: "This scenario validates opencode-goal for `CO-044`. It focuses on confirming that a live session can set a goal, read its status and see the goal injected into a later request on OpenCode 2."
version: 1.0.6.0
---

# CO-044 -- opencode-goal live utilization on OpenCode 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-044`.

---

## 1. OVERVIEW

The `opencode-goal` plugin registers the `opencode_goal` and `opencode_goal_status` tools, an `event` hook, and an `experimental.chat.system.transform` hook. The deep contract is CO-039 in `../goal-hook/goal-hook.md`; this scenario only proves that a live session on each OpenCode version can use the tools and that the transform injects the active goal.

### Why This Matters

A goal that can be set but never reaches the model is worse than no goal, because the operator believes the session is steered when it is not. This scenario checks the live path end to end: the tool envelope, the state file on disk, and the `[active_goal:goal-<uuid>]` line in a later request. On OpenCode 2 the tools arrive through the Code Mode `execute` tool, so the same check also proves the bridge exposes them.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-044` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that a live session sets goal `Probe goal canary 7Q4Z`, persists it to `$OPENCODE_GOAL_STATE_DIR`, and injects `[active_goal:goal-<uuid>]` into a later request on OpenCode 2.
- Real user request: `Can a live session actually set a goal, keep it on disk, and have the model see it in the next request, or does the tool answer while the goal never reaches the prompt?`
- Prompt: `Call the opencode_goal tool with action 'set' and objective 'Probe goal canary 7Q4Z'. Then call the opencode_goal_status tool. Then reply with the single word DONE.`
- Expected execution process: Point `OPENCODE_GOAL_STATE_DIR` at a fresh temporary directory for the run, run the prompt with `AI_SESSION_CHILD=1`, read the tool results, the state file and the captured system prompt for the run, and remove the directory after the check.
- Expected signals: a tool result holds `STATUS=OK ACTION=set` and `goal_present=true`; one `<64 hex>.json` file in `$OPENCODE_GOAL_STATE_DIR` contains `7Q4Z`; a later request's system prompt holds `[active_goal:goal-<uuid>]`.
- Evidence requirements: Capture events, capture JSON, effects and exit for the run, plus the state directory listing and the matching JSON file.
- Desired user-visible outcome: A verdict naming the tool envelope lines, the state filename and the injected `[active_goal]` line.
- Pass/fail: PASS if the `set` envelope is `STATUS=OK ACTION=set`, one state file holds the canary, and a later request carries `[active_goal:goal-<uuid>]` on the run. FAIL if any of the three is missing or the run exits non-zero.
- Failure triage: Confirm `OPENCODE_GOAL_STATE_DIR` is exported fresh for each run so the state is not shared with an earlier session. Read the `execute` tool result, because both tools arrive through Code Mode rather than as direct calls.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: `export OPENCODE_GOAL_STATE_DIR="$(mktemp -d)"` before the run so it has a clean state directory, and install an `EXIT` trap that removes it if the run is interrupted.
2. Run: run the exact prompt through the scenario runner with `AI_SESSION_CHILD=1` and the state directory exported.
3. Check: read the `opencode_goal` result, list the state directory, grep the state file for `7Q4Z`, grep the capture file for `[active_goal:goal-`, then `rm -rf "$OPENCODE_GOAL_STATE_DIR"`.
4. Cleanup: the state directory is removed right after the check, and the `EXIT` trap removes it if the run is interrupted.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
OPENCODE_GOAL_STATE_DIR="$(mktemp -d)" || exit 1; [ -d "$OPENCODE_GOAL_STATE_DIR" ] || exit 1; export OPENCODE_GOAL_STATE_DIR
trap 'rm -rf "$OPENCODE_GOAL_STATE_DIR"' EXIT
AI_SESSION_CHILD=1 OPENCODE_GOAL_STATE_DIR="$OPENCODE_GOAL_STATE_DIR" bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh opencode-goal "Call the opencode_goal tool with action 'set' and objective 'Probe goal canary 7Q4Z'. Then call the opencode_goal_status tool. Then reply with the single word DONE."
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/opencode-goal.events.jsonl"
ls "$OPENCODE_GOAL_STATE_DIR"
grep -l 7Q4Z "$OPENCODE_GOAL_STATE_DIR"/*.json
jq -r '.system[]' "$EVIDENCE_DIR/opencode-goal.capture.jsonl" | grep -E '\[active_goal:goal-'
rm -rf "$OPENCODE_GOAL_STATE_DIR"
trap - EXIT
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-044 | opencode-goal live utilization on OpenCode 2 | Confirm a live session sets, persists and injects a goal on OpenCode 2 | `Call the opencode_goal tool with action 'set' and objective 'Probe goal canary 7Q4Z'. Then call the opencode_goal_status tool. Then reply with the single word DONE.` | 1. Export a fresh `OPENCODE_GOAL_STATE_DIR` -> 2. Run `opencode-goal` -> 3. Read the tool envelope, state file and system prompt, then remove the directory | `STATUS=OK ACTION=set` with `goal_present=true`; one 64-hex JSON file holds `7Q4Z`; a later request holds `[active_goal:goal-<uuid>]` | `opencode-goal.txt` | PASS if all three signals appear on the run; FAIL if any is missing | Confirm the state directory is exported fresh for the run; read the `execute` result |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `plugin-utilization/opencode-goal.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/opencode-goal.js` | Plugin entry: `tool`, `event` and `experimental.chat.system.transform` hooks |
| `plugin-utilization/run-plugin-scenario.sh` | Runs one live session and writes the evidence files |
| `plugin-utilization/capture-proxy.mjs` | Capture proxy that records each model request's system prompt |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-044
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/opencode-goal.md`
