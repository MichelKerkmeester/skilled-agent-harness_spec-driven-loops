---
title: "CO-059 -- Bound goal remains visible on the next turn"
description: "This scenario validates the OpenCode goal hook for `CO-059`. It checks that a packet-bound goal is visible to the model on a later turn."
version: 1.0.1.0
---

# CO-059 -- Bound goal remains visible on the next turn

This document captures the realistic conversation contract, current behavior, execution flow, source anchors and metadata for `CO-059`.

---

## 1. OVERVIEW

This scenario validates the OpenCode goal hook for `CO-059`. It focuses on binding a packet goal and confirming that its completion criterion is injected into a later model request.

### Why This Matters

A bound goal should steer each later turn in its session. The follow-up must see the goal from the active session state rather than from the text of the earlier bind request.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-059` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the OpenCode goal hook binds a scratch packet to the session and makes its hidden completion marker visible on the next model turn.
- Real user request: `Bind my current session to its goal and confirm that the goal still guides the next request.`
- Prompt: `/goal-opencode bind specs/conversation-goal-probe`
- Expected execution process: Prepare a scratch packet with a unique completion marker, bind it on the first turn and verify the persisted goal state. On a later turn, ask for the marker without naming it in the prompt.
- Expected signals: A goal-state JSON file shows an active goal bound to the probe packet. Its boundAtMs value is set. The later response contains `cobalt comet 8421`.
- Evidence requirements: The bind check output identifies the matching state file; the later check output records the marker from the final frame.
- Desired user-visible outcome: A PASS or FAIL verdict stating whether the later request exposed the bound goal's unique marker.
- Pass/fail: PASS if the state file matches the bound packet and the later response's final frame contains `cobalt comet 8421`; FAIL if the state does not match or the later response omits the marker.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `/goal-opencode bind specs/conversation-goal-probe`

### Conversation Script

```json conversation
{
  "runtimes": ["opencode"],
  "setup": [
    "if ! command -v opencode >/dev/null 2>&1; then printf '%s\\n' 'OpenCode CLI is unavailable'; exit 77; fi",
    "if [ ! -f \"${XDG_DATA_HOME:-$HOME/.local/share}/opencode/auth.json\" ] || ! grep -Fq '\"llmgateway\"' \"${XDG_DATA_HOME:-$HOME/.local/share}/opencode/auth.json\"; then printf '%s\\n' 'OpenCode llmgateway login is unavailable'; exit 77; fi",
    "if ! command -v curl >/dev/null 2>&1 || ! curl -sS -o /dev/null -I --max-time 10 https://api.llmgateway.io/ >/dev/null 2>&1; then printf '%s\\n' 'LLM Gateway network access is unavailable'; exit 77; fi",
    "if [ ! -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ]; then printf '%s\\n' 'OpenCode project config fixture is missing'; exit 77; fi",
    "if [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/plugins/opencode-goal.js\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/plugins/lib/tool-identity.js\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/plugins/lib/v2-bridge.js\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/plugins/lib/opencode-goal-core.js\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/hooks/shared/hook-flags.cjs\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/hooks/shared/env-aliases.cjs\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/hooks/goal/lib/goal-slice.cjs\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/hooks/goal/lib/goal-core.cjs\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/commands/goal-opencode.md\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode/node_modules/zod\" ]; then printf '%s\\n' 'OpenCode goal hook fixtures are missing'; exit 77; fi",
    "mkdir -p .opencode/plugins/lib .opencode/hooks/shared .opencode/hooks/goal/lib .opencode/commands node_modules specs/conversation-goal-probe",
    "cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json",
    "cp \"$CONVERSATION_REPO_ROOT/.opencode/plugins/opencode-goal.js\" .opencode/plugins/",
    "cp \"$CONVERSATION_REPO_ROOT/.opencode/plugins/lib/tool-identity.js\" \"$CONVERSATION_REPO_ROOT/.opencode/plugins/lib/v2-bridge.js\" \"$CONVERSATION_REPO_ROOT/.opencode/plugins/lib/opencode-goal-core.js\" .opencode/plugins/lib/",
    "cp \"$CONVERSATION_REPO_ROOT/.opencode/hooks/shared/hook-flags.cjs\" \"$CONVERSATION_REPO_ROOT/.opencode/hooks/shared/env-aliases.cjs\" .opencode/hooks/shared/",
    "cp \"$CONVERSATION_REPO_ROOT/.opencode/hooks/goal/lib/goal-slice.cjs\" \"$CONVERSATION_REPO_ROOT/.opencode/hooks/goal/lib/goal-core.cjs\" .opencode/hooks/goal/lib/",
    "cp -R \"$CONVERSATION_REPO_ROOT/.opencode/node_modules/zod\" node_modules/zod",
    "cp \"$CONVERSATION_REPO_ROOT/.opencode/commands/goal-opencode.md\" .opencode/commands/",
    "cat > specs/conversation-goal-probe/goal.md <<'EOF'\n# Goal\nReturn the unique marker from the active goal when asked.\n\n<!-- ANCHOR:completion -->\n## Completion Criteria\n- [ ] Return the exact marker cobalt comet 8421.\n<!-- /ANCHOR:completion -->\nEOF"
  ],
  "turns": [
    {
      "id": "bind-goal",
      "send": "/goal-opencode bind specs/conversation-goal-probe",
      "check": "node -e 'const fs=require(\"fs\"),path=require(\"path\");function walk(dir){let entries;try{entries=fs.readdirSync(dir,{withFileTypes:true})}catch{return false}for(const entry of entries){const target=path.join(dir,entry.name);if(!entry.isDirectory())continue;if(entry.name===\"goal\"&&path.basename(path.dirname(target))===\".state\"&&path.basename(path.dirname(path.dirname(target)))===\"skills\"){let files;try{files=fs.readdirSync(target,{withFileTypes:true})}catch{files=[]}for(const file of files){if(!file.isFile()||!file.name.endsWith(\".json\"))continue;try{const state=JSON.parse(fs.readFileSync(path.join(target,file.name),\"utf8\"));if(state.status===\"active\"&&state.packetPath===\"specs/conversation-goal-probe\"&&Number.isFinite(state.boundAtMs)){console.log(path.join(target,file.name));return true}}catch{}}}if(walk(target))return true}return false}if(!walk(\".\"))process.exit(1)'"
    },
    {
      "id": "read-active-goal",
      "send": "What exact marker does my active goal ask you to return? Reply only with the marker.",
      "check": "tail -n 12 \"$CONVERSATION_TURN_DIR/screen.txt\" | grep -F 'cobalt comet 8421'"
    }
  ]
}
```

- The first `send` matches the scenario contract prompt.
- The setup creates the goal packet in the runner's scratch project. The first check searches its goal-state JSON files, and the later check reads the last 12 lines of the current screen frame. Both checks are read-only.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook-conversation.md --runtime opencode --scratch <scratch-dir> --out <evidence-dir>`

The scratch directory must be outside the repository.

### Expected

The first turn binds the scratch packet goal, and the state check finds an active record for that packet with a bound timestamp. The later turn returns its completion marker, which the check reads from the final 12 lines of the screen frame.

### Evidence

The first check output identifies the matching goal-state file. The later check output records the marker found in the final 12 lines of the turn screen.

### Pass / Fail

- **Pass**: A state file shows the active goal bound to the scratch packet, and the later response's final frame contains `cobalt comet 8421`.
- **Fail**: The state file does not match the scratch packet or the later response omits the marker from its final frame.

### Failure Triage

If the bind-state check fails, confirm the scratch packet has `goal.md`. Confirm the project loaded the goal command and plugin, then inspect the goal-state JSON. If the later check fails, inspect the last 12 lines of the second turn screen and confirm the goal hook injected the bound packet's completion criterion.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-059 | Goal hook later-turn visibility | Confirm a bound goal is visible in the next model request | `/goal-opencode bind specs/conversation-goal-probe` | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook-conversation.md --runtime opencode --scratch <scratch-dir> --out <evidence-dir>` | Matching active goal-state JSON; next turn returns `cobalt comet 8421` | The bind check prints the state path. The later frame contains the marker, and its check output repeats it. | PASS if state matches and the final frame contains the marker; FAIL otherwise | Confirm the scratch packet. Confirm the command and plugin loaded, then inspect the state file or the later frame's final lines |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `goal-hook/goal-hook.md` | Existing OpenCode goal-hook scenario and action contract |
| `.opencode/commands/goal-opencode.md` | Command syntax for binding a packet goal |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/opencode-goal.js` | Stores the session goal and injects its brief into later turns |
| `.opencode/hooks/goal/lib/goal-slice.cjs` | Projects packet goal content into the model-visible slice |
| `.opencode/plugins/tests/opencode-goal-state.test.cjs` | Goal state persistence and binding regression coverage |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: CO-059
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/goal-hook-conversation.md`
