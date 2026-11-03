---
title: "DV-024 -- A bound Devin goal guides a later task"
description: "This scenario validates later-turn goal injection for DV-024. It checks that Devin uses a packet goal bound through the session hand-over."
version: 1.0.0.0
---

# DV-024 -- A bound Devin goal guides a later task

This document captures the conversation contract, execution flow, source anchors and metadata for DV-024.

---

## 1. OVERVIEW

This scenario validates the Devin goal hook for DV-024. It focuses on binding a scratch packet goal to Devin's native session and using it on a later turn.

### Why This Matters

Devin has no prompt command for managing its active goal. Its hook binds the packet named by SESSION_RELAUNCH_GOAL_PACKET to the native session when the session starts, then injects the goal on each later prompt.

---

## 2. SCENARIO CONTRACT

Run the prompt and command sequence for DV-024. Check the scratch goal record and captured Devin screen after each turn.

- Objective: Bind a scratch packet goal through Devin's session hand-over, then confirm a later task uses the injected completion marker.
- Real user request: Ask which completion marker to use, then ask Devin to complete the next task.
- Prompt: What completion marker should I use for this Devin session?
- Expected execution process: Create a scratch packet with a unique marker, copy the repository .skilled and .devin trees into the scratch project, keep only the goal adapter's SessionStart and UserPromptSubmit registrations, then set SESSION_RELAUNCH_GOAL_PACKET for the Devin session. Ask for the marker, then send a later task that relies on the same active goal.
- Expected signals: The first turn leaves a Devin record active for packet specs/conversation-goal-probe. The later-task record can stay active or be archived with status complete. Both Devin answer screens contain JUNIPER-WAVE-64 after their echoed sends.
- Evidence requirements: The turn folders contain the captured screens and check outputs. The scratch project contains the matching Devin goal record.
- Desired user-visible outcome: Devin uses the packet goal on its first prompt and on the later task.
- Pass/fail: PASS if the first-turn active record matches the scratch packet and the later-task check finds the matching Devin record with status active or complete. Both answers must contain the exact marker after their prompts. FAIL if either state check fails or either answer omits or changes the marker.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: What completion marker should I use for this Devin session?

### Conversation Script

```json conversation
{
  "runtimes": [
    "devin"
  ],
  "env": {
    "AI_SESSION_CHILD": "",
    "DEVIN_PROJECT_DIR": ".",
    "OPENCODE_GOAL_STATE_DIR": ".goal-state",
    "SESSION_RELAUNCH_GOAL_PACKET": "specs/conversation-goal-probe"
  },
  "setup": [
    "mkdir -p .goal-state specs/conversation-goal-probe",
    "if [ ! -d \"$CONVERSATION_REPO_ROOT/.skilled\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.skilled/hooks/goal/devin/goal-inject.mjs\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.devin\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.devin/hooks.v1.json\" ] || ! command -v python3 >/dev/null 2>&1; then printf '%s\\n' 'SKIP: Devin goal hook project files are unavailable'; exit 77; fi",
    "auth_status=\"$(devin auth status 2>&1 || true)\"; if ! printf '%s\\n' \"$auth_status\" | grep -Fqi 'Logged in'; then printf '%s\\n' 'SKIP: Devin authentication or network is unavailable'; exit 77; fi",
    "cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled && cp -R \"$CONVERSATION_REPO_ROOT/.devin\" .devin",
    "python3 -c 'import json,pathlib; path=pathlib.Path(\".devin/hooks.v1.json\"); config=json.loads(path.read_text()); adapter=\".skilled/hooks/goal/devin/goal-inject.mjs\"; events=(\"SessionStart\",\"UserPromptSubmit\"); path.write_text(json.dumps({event:[{**group,\"hooks\":[hook for hook in group.get(\"hooks\",[]) if adapter in hook.get(\"command\",\"\")]} for group in config.get(event,[]) if any(adapter in hook.get(\"command\",\"\") for hook in group.get(\"hooks\",[]))] for event in events}))'",
    "cat > specs/conversation-goal-probe/goal.md <<'EOF'\n# Goal\nComplete the later task by returning the exact marker JUNIPER-WAVE-64.\n\n<!-- ANCHOR:completion -->\n## Completion Criteria\n- [ ] Return the exact marker JUNIPER-WAVE-64.\n<!-- /ANCHOR:completion -->\nEOF"
  ],
  "turns": [
    {
      "id": "read-active-goal",
      "send": "What completion marker should I use for this Devin session?",
      "check": "node -e 'const fs=require(\"node:fs\");const path=require(\"node:path\");const dir=\".goal-state\";const active=fs.readdirSync(dir).filter((name)=>name.endsWith(\".json\")).some((name)=>{const state=JSON.parse(fs.readFileSync(path.join(dir,name),\"utf8\"));return state.runtime===\"devin\"&&state.status===\"active\"&&state.packetPath===\"specs/conversation-goal-probe\"});if(!active)process.exit(1)' && awk 'index($0, \"What completion marker should I use for this Devin session?\") { after=1; next } after && index($0, \"JUNIPER-WAVE-64\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/screen.txt\""
    },
    {
      "id": "later-task",
      "send": "Please complete the next task.",
      "check": "node -e 'const fs=require(\"node:fs\");const path=require(\"node:path\");const dir=\".goal-state\";const files=(root)=>fs.readdirSync(root,{withFileTypes:true}).flatMap((entry)=>{const file=path.join(root,entry.name);return entry.isDirectory()?files(file):entry.isFile()&&entry.name.endsWith(\".json\")?[file]:[]});const matching=files(dir).some((file)=>{const state=JSON.parse(fs.readFileSync(file,\"utf8\"));return state.runtime===\"devin\"&&(state.status===\"active\"||state.status===\"complete\")&&state.packetPath===\"specs/conversation-goal-probe\"});if(!matching)process.exit(1)' && awk 'index($0, \"Please complete the next task.\") { after=1; next } after && index($0, \"JUNIPER-WAVE-64\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/screen.txt\""
    }
  ]
}
```

- The first send matches the contract prompt.
- Setup skips the run when the goal-hook project files or Devin authentication are unavailable; otherwise it writes only the runner's scratch project. The first check requires an active Devin record. The later-task check recursively searches `.goal-state` for the matching Devin record with status `active` or `complete`. It then checks for JUNIPER-WAVE-64 after the echoed send.

### Commands

1. node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook-conversation.md --runtime devin --scratch <scratch-dir-outside-repository> --out <evidence-dir>

Keep the scratch directory outside the repository.

### Expected

The goal hook binds the scratch packet to Devin's native session. Devin returns JUNIPER-WAVE-64 on the first request and again after the later task request.

### Evidence

The first-turn goal record in .goal-state/ identifies the active Devin packet. After the later task, the record may stay active or move under the archive with status complete. The later-task check searches .goal-state/ recursively. The turn folders contain the captured screens and check results.

### Pass / Fail

- Pass: The first-turn active record names the scratch packet and the later-task check finds the matching Devin record with status active or complete. Both answer screens must contain JUNIPER-WAVE-64 after their echoed sends.
- Fail: Either state check fails or either answer omits or changes the marker.
- Skip: Devin is unavailable, cannot authenticate or reach its service, or the goal-hook fixture is unavailable. Record the blocker.

### Failure Triage

Confirm the scratch .devin/hooks.v1.json registers the goal adapter for both events. Then check that SESSION_RELAUNCH_GOAL_PACKET points inside the scratch workspace and AI_SESSION_CHILD is empty. Inspect .goal-state/ before changing the adapter.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-024 | Devin goal on a later task | Bind a scratch goal to the native session and use its marker on a later turn | What completion marker should I use for this Devin session? | node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook-conversation.md --runtime devin --scratch <scratch-dir-outside-repository> --out <evidence-dir> | The first turn has an active Devin record for the scratch packet. The later record has status active or complete. Both answer screens show the marker after their prompts. | Goal record plus the two turn folders with screens and check outputs | PASS if both state checks pass and both answers contain the marker after their prompts. FAIL if a state check or answer misses its expected value. | Check hook registration and the hand-over environment. Then inspect the scratch goal record. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root index and goal-hook summary |
| [goal-hook.md](goal-hook.md) | Existing command-level Devin goal hook scenario |
| [README.md](../../../../../hooks/goal/README.md) | Cross-runtime binding and Devin support details |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [goal-inject.mjs](../../../../../hooks/goal/devin/goal-inject.mjs) | Binds the hand-over packet and injects the active goal |
| [goal-core.cjs](../../../../../hooks/goal/lib/goal-core.cjs) | Session-scoped goal records and hand-over binding |
| [hooks.v1.json](../../../../../../.devin/hooks.v1.json) | Registers the adapter for Devin lifecycle events |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: DV-024
- Canonical root source: manual-testing-playbook.md
- Feature file path: goal-hook/goal-hook-conversation.md
