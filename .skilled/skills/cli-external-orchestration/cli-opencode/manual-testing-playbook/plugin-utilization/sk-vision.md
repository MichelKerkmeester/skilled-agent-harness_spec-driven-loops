---
title: "CO-050 -- sk-vision live utilization on OpenCode 1 and 2"
description: "This scenario validates the sk-vision plugin for `CO-050`. It focuses on the autoinspect tools registering and answering with the local photon runtime."
version: 1.0.0.0
---

# CO-050 -- sk-vision live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-050`.

---

## 1. OVERVIEW

The `sk-vision` plugin (`.opencode/plugins/sk-vision.js`, a symlink to `../skills/sk-vision/vision-runtime/dist/plugin.js` built by `bun run build` and gitignored) has a native dual export and no bridge. It registers `/vision` always, and with `SK_VISION_AUTOINSPECT=1` also registers 13 `sk_vision_*` tools and automatic image inspection.

### Why This Matters

The vision tools are only useful if they are registered in the live session and can reach the local runtime. A build that is missing, or a tool that registers but cannot answer, leaves the session without vision while a registration check still reports the plugin as active. This scenario proves the tool answers on each OpenCode version.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-050` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the `sk_vision_status` tool is reachable and reports the local photon runtime under `SK_VISION_AUTOINSPECT=1`.
- Real user request: `Check that the vision tools are actually available in this session and that the local runtime answers.`
- Prompt: `Call the sk_vision_status tool with no arguments. Print the first 8 lines of its raw output, then reply DONE.`
- Expected execution process: Confirm the built bundle exists, start a run with `SK_VISION_AUTOINSPECT=1`, let the model call the status tool, then read the tool result from the events file.
- Expected signals: The tool result starts `provider: photon` and carries `model:`, `device:` and `loaded:` lines. The v1 tool is `sk_vision_status`; on v2 the model uses the `execute` tool running `tools.sk_vision_status()`.
- Evidence requirements: The tool call and its result from `events.jsonl`, the resolved bundle target, and the exit status.
- Desired user-visible outcome: A PASS or FAIL verdict citing the result's first lines.
- Pass/fail: PASS if the tool result starts `provider: photon` with the model, device and loaded lines; FAIL if the tool is missing or the runtime does not answer.
- Failure triage: Confirm `.opencode/plugins/sk-vision.js` resolves to an existing bundle. A missing target means the build step was skipped and is a blocker, not a plugin failure.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: `ls -l .opencode/plugins/sk-vision.js` resolves to an existing file, and export `EVIDENCE_DIR`.
2. v1 run: run the runner with `AI_SESSION_CHILD=1` and `SK_VISION_AUTOINSPECT=1`.
3. v1 check: read the tool call and result from the events file.
4. v2 run: repeat the same runner call with `v2`.
5. v2 check: repeat the same check against the v2 events file, where the tool is `execute`.
6. Cleanup: none.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${TMPDIR:-/tmp}/plugin-utilization"
ls -l .opencode/plugins/sk-vision.js
AI_SESSION_CHILD=1 SK_VISION_AUTOINSPECT=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v1 sk-vision "Call the sk_vision_status tool with no arguments. Print the first 8 lines of its raw output, then reply DONE."
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/sk-vision.v1.events.jsonl"

AI_SESSION_CHILD=1 SK_VISION_AUTOINSPECT=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v2 sk-vision "Call the sk_vision_status tool with no arguments. Print the first 8 lines of its raw output, then reply DONE."
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/sk-vision.v2.events.jsonl"
```

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
|| CO-050 | sk-vision | Confirm the vision status tool answers with the local photon runtime | `Call the sk_vision_status tool with no arguments. Print the first 8 lines of its raw output, then reply DONE.` | 1. `ls -l .opencode/plugins/sk-vision.js` -> 2. `AI_SESSION_CHILD=1 SK_VISION_AUTOINSPECT=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 sk-vision "<prompt>"` -> 3. `jq -c 'select(.type=="tool_use") \| [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/sk-vision.v1.events.jsonl"` -> 4. Repeat 2 and 3 with `v2` | The result starts `provider: photon` with `model:`, `device:` and `loaded:` lines; v1 calls `sk_vision_status`, v2 calls `execute` | `sk-vision.v1.events.jsonl`, `sk-vision.v1.exit` and the v2 equivalents, plus the resolved bundle target | PASS if the result starts `provider: photon` with the model, device and loaded lines; FAIL if the tool is missing or the runtime does not answer | Confirm the symlink resolves to an existing bundle; a missing target means the build step was skipped |

### Recorded Run (2026-10-20)

- v1: PASS.
- v2: PASS.
- Evidence files: `sk-vision.v1.txt`, `sk-vision.v2.txt` under the packet's `scratch/live-runs/`.

---

## 4. SOURCE FILES

### Playbook Sources

|| File | Role |
|---|---|
|| `manual-testing-playbook.md` | Root directory page and scenario summary |
|| `plugin-utilization/sk-vision.md` | Canonical per-feature execution contract |
|| `plugin-utilization/run-plugin-scenario.sh` | Runs one live session through the capture proxy and writes events, capture, effects and exit files |
|| `plugin-utilization/capture-proxy.mjs` | Records every model request's system prompt, tools and tool results |

### Implementation And Test Anchors

|| File | Role |
|---|---|
|| `.opencode/plugins/sk-vision.js` | The plugin symlink that registers `/vision` and the autoinspect tools |
|| `../skills/sk-vision/vision-runtime/dist/plugin.js` | The built bundle the symlink resolves to |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-050
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/sk-vision.md`
