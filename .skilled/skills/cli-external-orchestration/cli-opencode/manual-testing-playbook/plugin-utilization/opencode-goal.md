---
title: "CO-044 -- opencode-goal live utilization on OpenCode 1 and 2"
description: "This scenario validates opencode-goal for `CO-044`. It focuses on confirming that a live session can set a goal, read its status and see the goal injected into a later request on both OpenCode versions."
version: 1.0.0.0
---

# CO-044 -- opencode-goal live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-044`.

---

## 1. OVERVIEW

The `opencode-goal` plugin registers the `opencode_goal` and `opencode_goal_status` tools, an `event` hook, and an `experimental.chat.system.transform` hook. The deep contract is CO-039 in `../goal-hook/goal-hook.md`; this scenario only proves that a live session on each OpenCode version can use the tools and that the transform injects the active goal.

### Why This Matters

A goal that can be set but never reaches the model is worse than no goal, because the operator believes the session is steered when it is not. This scenario checks the live path end to end: the tool envelope, the state file on disk, and the `[active_goal:goal-<uuid>]` line in a later request. On OpenCode 2 the tools arrive through the Code Mode `execute` tool, so the same check also proves the bridge exposes them.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-044` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that a live session sets goal `Probe goal canary 7Q4Z`, persists it to `$OPENCODE_GOAL_STATE_DIR`, and injects `[active_goal:goal-<uuid>]` into a later request on OpenCode 1 and OpenCode 2.
- Real user request: `Can a live session actually set a goal, keep it on disk, and have the model see it in the next request, or does the tool answer while the goal never reaches the prompt?`
- Prompt: `Call the opencode_goal tool with action 'set' and objective 'Probe goal canary 7Q4Z'. Then call the opencode_goal_status tool. Then reply with the single word DONE.`
- Expected execution process: Point `OPENCODE_GOAL_STATE_DIR` at a fresh temporary directory, run the prompt on v1 and then on v2 with `AI_SESSION_CHILD=1`, and read the tool results, the state file and the captured system prompt for each version.
- Expected signals: a tool result holds `STATUS=OK ACTION=set` and `goal_present=true`; one `<64 hex>.json` file in `$OPENCODE_GOAL_STATE_DIR` contains `7Q4Z`; a later request's system prompt holds `[active_goal:goal-<uuid>]`.
- Evidence requirements: Capture events, capture JSON, effects and exit for both versions, plus the state directory listing and the matching JSON file.
- Desired user-visible outcome: A per-version verdict naming the tool envelope lines, the state filename and the injected `[active_goal]` line.
- Pass/fail: PASS if the `set` envelope is `STATUS=OK ACTION=set`, one state file holds the canary, and a later request carries `[active_goal:goal-<uuid>]` on that version. FAIL if any of the three is missing or the run exits non-zero.
- Failure triage: Confirm `OPENCODE_GOAL_STATE_DIR` is exported to both runs so the state is not shared with an earlier session. On v2, read the `execute` tool result, because both tools arrive through Code Mode rather than as direct calls.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: `export OPENCODE_GOAL_STATE_DIR=$(mktemp -d)` so each run has a clean state directory.
2. v1 run: run the exact prompt through the scenario runner on v1 with `AI_SESSION_CHILD=1` and the state directory exported.
3. v1 check: read the `opencode_goal` result, list the state directory, grep the state file for `7Q4Z`, and grep the capture file for `[active_goal:goal-`.
4. v2 run: run the same prompt through the scenario runner on v2 with the same environment.
5. v2 check: repeat all four reads against the v2 evidence and state files.
6. Cleanup: `rm -rf "$OPENCODE_GOAL_STATE_DIR"`.

### Exact Command Sequence

```bash
export EVIDENCE_DIR=${EVIDENCE_DIR:-${TMPDIR:-/tmp}/plugin-utilization}
export OPENCODE_GOAL_STATE_DIR=$(mktemp -d)
AI_SESSION_CHILD=1 OPENCODE_GOAL_STATE_DIR="$OPENCODE_GOAL_STATE_DIR" bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 opencode-goal "Call the opencode_goal tool with action 'set' and objective 'Probe goal canary 7Q4Z'. Then call the opencode_goal_status tool. Then reply with the single word DONE."
AI_SESSION_CHILD=1 OPENCODE_GOAL_STATE_DIR="$OPENCODE_GOAL_STATE_DIR" bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 opencode-goal "Call the opencode_goal tool with action 'set' and objective 'Probe goal canary 7Q4Z'. Then call the opencode_goal_status tool. Then reply with the single word DONE."
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/opencode-goal.v1.events.jsonl"
ls "$OPENCODE_GOAL_STATE_DIR"
grep -l '7Q4Z' "$OPENCODE_GOAL_STATE_DIR"/*.json
jq -r '.system[]' "$EVIDENCE_DIR/opencode-goal.v1.capture.jsonl" | grep -E '\[active_goal:goal-'
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/opencode-goal.v2.events.jsonl"
jq -r '.system[]' "$EVIDENCE_DIR/opencode-goal.v2.capture.jsonl" | grep -E '\[active_goal:goal-'
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-044 | opencode-goal live utilization on OpenCode 1 and 2 | Confirm a live session sets, persists and injects a goal on both versions | `Call the opencode_goal tool with action 'set' and objective 'Probe goal canary 7Q4Z'. Then call the opencode_goal_status tool. Then reply with the single word DONE.` | 1. Export a fresh `OPENCODE_GOAL_STATE_DIR` -> 2. Run `opencode-goal` on v1 -> 3. Read the tool envelope, state file and system prompt -> 4. Run on v2 -> 5. Repeat the reads | `STATUS=OK ACTION=set` with `goal_present=true`; one 64-hex JSON file holds `7Q4Z`; a later request holds `[active_goal:goal-<uuid>]` | `opencode-goal.v1.txt`, `opencode-goal.v2.txt` | PASS if all three signals appear on that version; FAIL if any is missing | Confirm the state directory is exported to both runs; on v2 read the `execute` result |

### Recorded Run (2026-10-20)

- v1: PASS (tools called directly). The `set` envelope was `STATUS=OK ACTION=set`, the state file held `7Q4Z`, and a later request carried `[active_goal:goal-<uuid>]`.
- v2: PASS (tools reached through `execute`). The same envelope and injected line were present.
- Evidence: `opencode-goal.v1.txt` and `opencode-goal.v2.txt` under `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/`.

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
| `plugin-utilization/run-plugin-scenario.sh` | Runs one live session per version and writes the evidence files |
| `plugin-utilization/capture-proxy.mjs` | Capture proxy that records each model request's system prompt |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-044
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/opencode-goal.md`
