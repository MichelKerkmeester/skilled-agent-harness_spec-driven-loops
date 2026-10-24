---
title: "CO-046 -- session-relaunch live utilization on OpenCode 1 and 2"
description: "This scenario validates the session-relaunch plugin for `CO-046`. It focuses on the handoff nudge injected into later requests once a skilled loop passes the configured context window."
version: 1.0.5.0
---

# CO-046 -- session-relaunch live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-046`.

---

## 1. OVERVIEW

The `session-relaunch` plugin (`.opencode/plugins/session-relaunch.js`, with its tools under `.opencode/hooks/session-relaunch/`) tracks context usage from assistant `message.updated` events. Inside a `skilled-loop` where `SKILLED_LOOP_ID` is set, and once usage passes the relaunch threshold, it injects a handoff nudge into every model request so a fresh session can continue before auto-compaction runs. When a new user message arrives over a hand-over the session already armed, the plugin withdraws the arm so the killer cannot end the new turn, and the session is owed one more nudge. The supplemental check below covers that path.

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

### Supplemental Check: Withdraw On A New User Message And The Extra Nudge

Inside a skilled loop the plugin withdraws an armed hand-over when a new user message arrives in the session that prepared it. The runner sends one prompt per call, so this check arms a record by hand for the session id the first call printed, sends a second prompt to the same session with `--session` and reads the record, the logs and the captured system prompts. A third call proves the extra nudge a withdrawn session is owed. Everything runs against a sandbox repository and runtime directory, so your relaunch state and hop history stay untouched. Like the main check it needs working gateway credentials. Set `v` to `v1` or `v2`.

~~~bash
v=v1
repo_root="$(git rev-parse --show-toplevel)"
runner=.opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh
export EVIDENCE_DIR="${EVIDENCE_DIR:-$repo_root/.skilled/skills/.state/plugin-utilization}"
sandbox="$(mktemp -d)"
mkdir -p "$sandbox/run" "$sandbox/repo/.skilled/skills/.state/session-relaunch/handoffs"
state="$sandbox/run/skilled-relaunch"
run() {  # run <name> <prompt> [extra opencode args]
  env -u SKILLED_LOOP_HOPS -u SKILLED_LOOP_MANUAL_TEMPLATE -u SKILLED_LOOP_RUNTIME \
    XDG_RUNTIME_DIR="$sandbox/run" SESSION_RELAUNCH_REPO_ROOT="$sandbox/repo" \
    AI_SESSION_CHILD=1 SKILLED_LOOP_ID=probe-loop SESSION_RELAUNCH_WINDOW_TOKENS=100 \
    bash "$runner" "$v" "$@"
}

# 1. the first call creates the session
run wd-first "Run the shell command 'echo relaunch-probe' and then reply with the single word DONE."
sid=$(jq -r 'select(.sessionID != null) | .sessionID' "$EVIDENCE_DIR/wd-first.$v.events.jsonl" | sort -u | head -1)
echo "session: $sid"

# 2. arm a record for that session by hand
note="$sandbox/repo/.skilled/skills/.state/session-relaunch/handoffs/20260101T000000Z-$sid.md"
printf -- '---\nstatus: open\nsession_id: %s\nloop_id: probe-loop\nruntime: opencode\ncwd: %s\nspec_folder: \ncreated_at: 2026-01-01T00:00:00Z\n---\n## Goal\nProbe the OpenCode withdraw path\n## Done\nNothing.\n## Remaining work\nNothing.\n## In-flight state\nNothing.\n' "$sid" "$sandbox" > "$note"
SID=$sid NOTE=$note XDG_RUNTIME_DIR="$sandbox/run" SESSION_RELAUNCH_REPO_ROOT="$sandbox/repo" node -e "
const core = require('$repo_root/.skilled/hooks/session-relaunch/lib/relaunch-core.cjs');
core.preparePending({ loopId: 'probe-loop', handoffPath: process.env.NOTE, sessionId: process.env.SID, runtime: 'opencode', cwd: process.cwd(), hops: 0 });
core.arm({ loopId: 'probe-loop', cwd: process.cwd() });"
grep -oE '"status":"[a-z]*"' "$state/relaunch-probe-loop.json"

# 3. a new user message in the same session
run wd-second "Reply with the single word STAYING." --session "$sid"
grep -oE '"(status|disarmReason)":"[^"]*"' "$state/relaunch-probe-loop.json"
cat "$state/relaunch.log"
cut -f2,3,6 "$sandbox/repo/.skilled/skills/.state/session-relaunch/hop-history.log"
cat "$state/nudge-$sid.json"
~~~

Expected before the second call: `"status":"armed"`. Expected after it:

- The record reads `"status":"disarmed"` and `"disarmReason":"user-message"`.
- `relaunch.log` holds one line, `arm-cancelled loopId=probe-loop sessionId=<sid> reason=user-message`.
- The history row reads `withdrawn`, `opencode` and `Probe the OpenCode withdraw path`, tab separated.
- The nudge file holds the extra nudge as `{"level":1,"rearm":{"floor":<number>}}`. The floor is the fill of the second call's reply plus 0.05.

The third call spends the session's nudge levels first, so a nudge can only come from the extra one, and makes the model call a tool so a later request carries the nudge:

~~~bash
printf '{"level":2,"rearm":{"floor":%s}}\n' "$(grep -oE '"floor":[0-9.]+' "$state/nudge-$sid.json" | cut -d: -f2)" > "$state/nudge-$sid.json"
run wd-third "Run the shell command 'echo staying' and then reply with the single word DONE." --session "$sid"
cat "$state/nudge-$sid.json"
jq -r '.system[]' "$EVIDENCE_DIR/wd-third.$v.capture.jsonl" | grep -o '\[session-relaunch\] Context is[^.]*\.' | sort | uniq -c
rm -rf "$sandbox"
~~~

Expected: the nudge file reads `{"level":2}`, because the delivered nudge removed `rearm`, and the captured system prompts of the later requests hold `[session-relaunch] Context is past the configured window (over 100% full).` Level 2 never nudges again on its own, so the delivery proves the grant. The evidence files `wd-first`, `wd-second` and `wd-third` stay in `EVIDENCE_DIR`.

Evidence: the printed record fields, the log line, the history row, both nudge-file reads and the captured system-prompt count. PASS on both versions when the second call disarms the record with `user-message` and logs `arm-cancelled`, and the third call leaves `{"level":2}` with the nudge sentence in a later request. FAIL when the record stays armed, the log holds no `arm-cancelled` line, the nudge file keeps `rearm` after the third call or no system prompt carries the nudge. Triage: when `rearm` is still there after the third call, the fill did not grow a step between the calls, so rerun the third call with a prompt that makes the model call a tool twice. A missing `sessionID` in the first call's events means the bridge mapping regressed, as in the main check.

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
| `.skilled/hooks/session-relaunch/lib/withdraw.cjs` | Calls off a prepared hand-over: a guarded disarm, the extra nudge and the withdrawn history line |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Decides each nudge and owns the per-session level and extra-nudge state |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-046
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/session-relaunch.md`
