---
title: "CO-046 -- session-relaunch live utilization on OpenCode 1 and 2"
description: "This scenario validates the session-relaunch plugin for `CO-046`. It focuses on the handoff nudge injected into later requests once a skilled loop passes the configured context window."
version: 1.0.4.0
---

# CO-046 -- session-relaunch live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-046`.

---

## 1. OVERVIEW

The `session-relaunch` plugin (`.opencode/plugins/session-relaunch.js`, with its tools under `.opencode/hooks/session-relaunch/`) tracks context usage from assistant `message.updated` events. Inside a `skilled-loop` where `SKILLED_LOOP_ID` is set, and once usage passes the relaunch threshold, it injects a handoff nudge into every model request so a fresh session can continue before auto-compaction runs.

### Why This Matters

The nudge is the only signal that tells a long loop to hand off before the context window closes. If usage is never recorded, the plugin stays silent and a loop that should relaunch keeps running into compaction. A live run is the only way to prove the event path and the system-prompt delivery work together on each OpenCode version.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-046` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the plugin records context usage inside a skilled loop and injects the `[session-relaunch]` handoff nudge into a later request.
- Real user request: `Check whether the context-relaunch nudge actually reaches the model during a loop.`
- Prompt: `Run the shell command 'echo relaunch-probe' and then reply with the single word DONE.`
- Expected execution process: Start a run with a loop id and a tiny window, let the first request finish and record usage, then read the system prompt of the next captured request.
- Expected signals: The tool call `echo relaunch-probe` completes, and a later request's system prompt holds `[session-relaunch] Context is past the configured window`.
- Evidence requirements: The capture file's request count and matching system line, the events file's tool call, and the run's exit status.
- Desired user-visible outcome: A PASS or FAIL verdict citing the captured system line and the request it arrived on.
- Pass/fail: PASS if a request after the first carries the marker; FAIL if no later request carries it.
- Failure triage: Inspect the events for `message.updated` and its properties first. On v2 the bridge adds a top-level `sessionID` and `info.time.completed`, taken from the step event's time, so a missing field means the bridge mapping regressed and usage was never recorded.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: confirm the plugin and its hook directory exist, and export `EVIDENCE_DIR`.
2. v1 run: run the runner with `AI_SESSION_CHILD=1`, `SKILLED_LOOP_ID=probe-loop` and `SESSION_RELAUNCH_WINDOW_TOKENS=2000`.
3. v1 check: read the captured system prompts, the tool call and the exit status.
4. v2 run: repeat the same runner call with `v2`.
5. v2 check: repeat the same checks against the v2 evidence files.
6. Cleanup: delete any handoff note under `.skilled/skills/.state/session-relaunch/handoffs/`.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
AI_SESSION_CHILD=1 SKILLED_LOOP_ID=probe-loop SESSION_RELAUNCH_WINDOW_TOKENS=2000 \
  bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v1 session-relaunch "Run the shell command 'echo relaunch-probe' and then reply with the single word DONE."
jq -r '.system[]' "$EVIDENCE_DIR/session-relaunch.v1.capture.jsonl" | grep -E '\[session-relaunch\] Context is past the configured window'
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/session-relaunch.v1.events.jsonl"
cat "$EVIDENCE_DIR/session-relaunch.v1.exit"

AI_SESSION_CHILD=1 SKILLED_LOOP_ID=probe-loop SESSION_RELAUNCH_WINDOW_TOKENS=2000 \
  bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v2 session-relaunch "Run the shell command 'echo relaunch-probe' and then reply with the single word DONE."
jq -r '.system[]' "$EVIDENCE_DIR/session-relaunch.v2.capture.jsonl" | grep -E '\[session-relaunch\] Context is past the configured window'
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/session-relaunch.v2.events.jsonl"
cat "$EVIDENCE_DIR/session-relaunch.v2.exit"
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-046 | session-relaunch | Confirm the handoff nudge reaches a later request inside a skilled loop | `Run the shell command 'echo relaunch-probe' and then reply with the single word DONE.` | 1. `AI_SESSION_CHILD=1 SKILLED_LOOP_ID=probe-loop SESSION_RELAUNCH_WINDOW_TOKENS=2000 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 session-relaunch "<prompt>"` -> 2. `jq -r '.system[]' "$EVIDENCE_DIR/session-relaunch.v1.capture.jsonl" \| grep -E '\[session-relaunch\] Context is past the configured window'` -> 3. Repeat 1 and 2 with `v2` | A later request's system prompt holds `[session-relaunch] Context is past the configured window`; the `echo relaunch-probe` tool call completes | `session-relaunch.v1.capture.jsonl`, `session-relaunch.v1.events.jsonl`, `session-relaunch.v1.exit` and the v2 equivalents | PASS if a request after the first carries the marker; FAIL if no later request carries it | Inspect `message.updated` properties; on v2 the bridge adds a top-level `sessionID` and `info.time.completed`, taken from the step event's time, so a missing field means the bridge mapping regressed and usage was never recorded |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `plugin-utilization/session-relaunch.md` | Canonical per-feature execution contract |
| `plugin-utilization/run-plugin-scenario.sh` | Runs one live session through the capture proxy and writes events, capture, effects and exit files |
| `plugin-utilization/capture-proxy.mjs` | Records every model request's system prompt, tools and tool results |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/session-relaunch.js` | The plugin that records usage and injects the handoff nudge |
| `.opencode/hooks/session-relaunch/` | The tool and helper modules the plugin drives |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-046
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/session-relaunch.md`
