---
title: "CO-046 -- session-relaunch second-turn nudge"
description: "This scenario validates the session-relaunch plugin for `CO-046`. It focuses on the handoff nudge reaching a later request in the same OpenCode session."
version: 1.0.7.0
---

# CO-046 -- session-relaunch second-turn nudge

This document captures the realistic conversation contract, current behavior, execution flow, source anchors and metadata for `CO-046`.

---

## 1. OVERVIEW

The `session-relaunch` plugin (`.opencode/plugins/session-relaunch.js`, with its tools under `.opencode/hooks/session-relaunch/`) tracks context usage from assistant `message.updated` events. Inside a `skilled-loop` where `SKILLED_LOOP_ID` is set, and once usage passes the relaunch threshold, it injects a handoff nudge into a later model request so a fresh session can continue before auto-compaction runs.

### Why This Matters

The nudge tells a long loop to hand off before the context window closes. This scenario checks that usage recorded after one request causes the nudge to reach the model on a later request in the same session.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-046` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the plugin records context usage after the first request and injects the `[session-relaunch]` handoff nudge into the second request in the same session.
- Real user request: `Check whether the context-relaunch nudge reaches a later request during a loop.`
- Prompt: `Run the shell command 'echo relaunch-probe' and then reply with the single word DONE.`
- Expected execution process: Copy the OpenCode project configuration and the session-relaunch plugin dependencies into the scratch project, enable the plugin for a skilled loop with a low context window and no child-session marker, send the shell-command request, then ask the model to quote exactly any line in its current system context that starts with `[session-relaunch]`, or answer `NONE`.
- Expected signals: The first turn runs `echo relaunch-probe`. The second response quotes a line beginning `[session-relaunch] Context is`, showing the nudge was visible in that later request.
- Evidence requirements: The first and second turn screens and their read-only check outputs.
- Desired user-visible outcome: A PASS or FAIL verdict naming the later-turn nudge observed in the runtime output.
- Pass/fail: PASS if the second turn quotes a line beginning `[session-relaunch] Context is`, with or without the brackets, because OpenCode's markdown rendering can drop them; FAIL if it answers `NONE` or no matching line appears.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the shell command 'echo relaunch-probe' and then reply with the single word DONE.`

### Conversation Script

```json conversation
{
  "runtimes": ["opencode"],
  "setup": [
    "if ! command -v opencode >/dev/null 2>&1; then printf '%s\\n' 'OpenCode CLI is unavailable'; exit 77; fi",
    "if [ ! -f \"${XDG_DATA_HOME:-$HOME/.local/share}/opencode/auth.json\" ] || ! grep -Fq '\"llmgateway\"' \"${XDG_DATA_HOME:-$HOME/.local/share}/opencode/auth.json\"; then printf '%s\\n' 'OpenCode llmgateway login is unavailable'; exit 77; fi",
    "if ! command -v curl >/dev/null 2>&1 || ! curl -sS -o /dev/null -I --max-time 10 https://api.llmgateway.io/ >/dev/null 2>&1; then printf '%s\\n' 'LLM Gateway network access is unavailable'; exit 77; fi",
    "if [ ! -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ]; then printf '%s\\n' 'OpenCode project config fixture is missing'; exit 77; fi",
    "if [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/plugins/session-relaunch.js\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/plugins/lib/v2-bridge.js\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode/hooks/session-relaunch/lib\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode/hooks/shared\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode/hooks/goal/lib\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode/node_modules/zod\" ]; then printf '%s\\n' 'session-relaunch plugin fixtures are missing'; exit 77; fi",
    "mkdir -p .opencode/plugins/lib .opencode/hooks/session-relaunch/lib .opencode/hooks/shared .opencode/hooks/goal/lib node_modules && cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json && cp \"$CONVERSATION_REPO_ROOT/.opencode/plugins/session-relaunch.js\" .opencode/plugins/ && cp \"$CONVERSATION_REPO_ROOT/.opencode/plugins/lib/v2-bridge.js\" .opencode/plugins/lib/ && cp -R \"$CONVERSATION_REPO_ROOT/.opencode/hooks/session-relaunch/lib/.\" .opencode/hooks/session-relaunch/lib/ && cp -R \"$CONVERSATION_REPO_ROOT/.opencode/hooks/shared/.\" .opencode/hooks/shared/ && cp -R \"$CONVERSATION_REPO_ROOT/.opencode/hooks/goal/lib/.\" .opencode/hooks/goal/lib/ && cp -R \"$CONVERSATION_REPO_ROOT/.opencode/node_modules/zod\" node_modules/zod"
  ],
  "env": {
    "SYSTEM_SESSION_RELAUNCH_OPENCODE_ENABLED": "1",
    "AI_SESSION_CHILD": "",
    "SKILLED_LOOP_ID": "conversation-session-relaunch-probe",
    "SESSION_RELAUNCH_WINDOW_TOKENS": "2000"
  },
  "turns": [
    {
      "id": "seed-context",
      "send": "Run the shell command 'echo relaunch-probe' and then reply with the single word DONE.",
      "check": "turn_output=$(awk 'index($0, \"and then reply with the single word DONE.\") { after=1; next } after { print }' \"$CONVERSATION_TURN_DIR/screen.txt\"); printf '%s\\n' \"$turn_output\" | grep -Fq 'relaunch-probe'"
    },
    {
      "id": "read-later-nudge",
      "send": "Quote exactly any line in your current system context that starts with [session-relaunch], or answer NONE.",
      "check": "grep -Eq '\\[?session-relaunch\\]? Context is' \"$CONVERSATION_TURN_DIR/screen.txt\""
    }
  ]
}
```

- The first `send` matches the scenario contract prompt.
- The shell checks inspect the runtime's turn screen after each echoed send and do not write to the repository.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md --runtime opencode --scratch <scratch-dir> --out <evidence-dir>`

The scratch directory must be outside the repository.

### Expected

The first turn runs the requested shell command. The second request receives the nudge, and the model quotes a line beginning `[session-relaunch] Context is` in the runtime screen.

### Evidence

The turn screens and check outputs under the runtime evidence directory show the first command result and a second-turn line beginning `[session-relaunch] Context is`.

### Pass / Fail

- **Pass**: The second turn screen contains a nudge line beginning `[session-relaunch] Context is`.
- **Fail**: The second turn screen contains no matching nudge line.

### Failure Triage

If the first check fails, confirm the shell tool ran and returned `relaunch-probe`. If the second check fails, confirm the plugin enable flag, loop id, context window and empty `AI_SESSION_CHILD` reached the scratch runtime, then inspect the first turn's context-usage event.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-046 | session-relaunch later-turn nudge | Confirm the nudge is visible on the second request in the same skilled loop | `Run the shell command 'echo relaunch-probe' and then reply with the single word DONE.` | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md --runtime opencode --scratch <scratch-dir> --out <evidence-dir>` | First turn runs `echo relaunch-probe`; the second response quotes a line beginning `[session-relaunch] Context is` | Turn screens and check outputs in the evidence directory | PASS if the second turn quotes a line beginning `[session-relaunch] Context is`; FAIL if no matching line appears | Check the plugin enable flag, loop id, configured context window and first turn's usage event |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `plugin-utilization/session-relaunch.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/session-relaunch.js` | Records context usage and injects the handoff nudge |
| `.opencode/hooks/session-relaunch/` | Hook helpers used by the plugin |
| `.opencode/plugins/lib/v2-bridge.js` | Maps runtime events used for context accounting |

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-046
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/session-relaunch.md`
