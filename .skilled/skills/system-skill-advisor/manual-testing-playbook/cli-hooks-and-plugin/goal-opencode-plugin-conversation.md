---
title: "CL-008 -- Goal OpenCode Later-Turn Injection"
description: "This scenario validates later-turn active-goal context in the OpenCode goal plugin for CL-008. It focuses on carrying the active goal prompt into a later request."
stage: routing
version: 1.0.0.0
---

# CL-008 -- Goal OpenCode Later-Turn Injection

This document captures the multi-turn conversation contract, execution flow, source anchors and metadata for CL-008.

---

## 1. OVERVIEW

This scenario validates later-turn active-goal injection for CL-008. It focuses on whether OpenCode carries an active goal into a separate request in the same session.

### Why This Matters

CL-007 checks goal state and injection preview within one request. A later task checks whether the active goal prompt is present when the next request reaches the runtime.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for CL-008 and confirm the expected signals without contradictory evidence.

- Objective: Bind an isolated goal in a fresh OpenCode session and verify its marker appears in the response to a later task.
- Real user request: Bind my current session to its goal and carry its guidance into my next request.
- Prompt: `/goal-opencode bind specs/conversation-goal-probe`
- Expected execution process: Setup skips the whole run with a one-line reason when the OpenCode CLI, its login, network access or a required fixture is missing. Otherwise the runner copies OpenCode configuration and skills into a fresh scratch project and creates a goal packet with a unique marker. The first turn binds that packet, and its check finds a matching active goal record in the scratch project's state files. The second turn asks for release-readiness checks without mentioning the goal or marker, and its check searches the current screen frame after the echoed send for the marker in the reply.
- Expected signals: The first turn reports a successfully set active goal. The later turn response contains GOAL-CONTEXT-CL008.
- Desired user-visible outcome: The response to a later request follows the active goal prompt and begins with its required marker.
- Pass/fail: PASS if both checks succeed. FAIL if the goal is not active after the first turn or the later response omits the marker.

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
    "if [ ! -d \"$CONVERSATION_REPO_ROOT/.skilled\" ]; then printf '%s\\n' 'Repository skills fixture is missing'; exit 77; fi",
    "if [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/plugins/opencode-goal.js\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/commands/goal-opencode.md\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/hooks/shared/hook-flags.cjs\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/hooks/goal/lib/goal-slice.cjs\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/hooks/goal/lib/goal-core.cjs\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode/node_modules/zod\" ]; then printf '%s\\n' 'OpenCode goal plugin fixtures are missing'; exit 77; fi",
    "if [ ! -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ]; then printf '%s\\n' 'OpenCode project config fixture is missing'; exit 77; fi",
    "cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled",
    "cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode",
    "cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json",
    "mkdir -p node_modules && cp -R \"$CONVERSATION_REPO_ROOT/.opencode/node_modules/zod\" node_modules/zod",
    "mkdir -p specs/conversation-goal-probe && cat > specs/conversation-goal-probe/goal.md <<'EOF'\n# Goal\nProvide concise release-readiness guidance.\n\n<!-- ANCHOR:completion -->\n## Completion Criteria\n- [ ] Begin the next response with the exact marker GOAL-CONTEXT-CL008 and list release-readiness checks in one concise sentence.\n<!-- /ANCHOR:completion -->\nEOF"
  ],
  "turns": [
    {
      "id": "bind-goal",
      "send": "/goal-opencode bind specs/conversation-goal-probe",
      "questions": [{ "match": "[Ss]pec.{0,40}[Ff]older|[Ff]older.{0,40}[Ss]pec", "answer": { "reply": "D" }, "optional": true }],
      "check": "node -e 'const fs=require(\"node:fs\"),path=require(\"node:path\"),dirs=[process.cwd()];let found=false;while(dirs.length){const dir=dirs.pop();for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(!entry.isDirectory())continue;const next=path.join(dir,entry.name);if(entry.name===\"goal\"&&path.basename(dir)===\".state\"&&path.basename(path.dirname(dir))===\"skills\"){const files=[next];while(files.length&&!found){const current=files.pop();for(const child of fs.readdirSync(current,{withFileTypes:true})){const file=path.join(current,child.name);if(child.isDirectory())files.push(file);else if(child.isFile()&&file.endsWith(\".json\")){try{const state=JSON.parse(fs.readFileSync(file,\"utf8\"));if(state.status===\"active\"&&state.packetPath===\"specs/conversation-goal-probe\"&&state.boundAtMs!=null){found=true;break}}catch{}}}}}else dirs.push(next);if(found)break;}}process.exit(found?0:1)'"
    },
    {
      "id": "later-task",
      "send": "List release-readiness checks.",
      "questions": [{ "match": "[Ss]pec.{0,40}[Ff]older|[Ff]older.{0,40}[Ss]pec", "answer": { "reply": "D" }, "optional": true }],
      "check": "awk 'index($0, \"List release-readiness checks.\") { after=1; next } after && index($0, \"GOAL-CONTEXT-CL008\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/screen.txt\""
    }
  ]
}
```

- The first `send` matches the scenario contract prompt.
- The `bind-goal` check searches beneath the scratch project for JSON files under a `skills/.state/goal/` directory. It passes only when one file has `status` set to `active`, `packetPath` set to `specs/conversation-goal-probe` and `boundAtMs` set. It reads state and does not depend on transient TUI output.
- The `later-task` check searches the current `screen.txt` frame after the echoed request for `GOAL-CONTEXT-CL008`. The marker must appear in the visible reply, and the check does not depend on retained scrollback.
- Both checks only read state or turn evidence and do not modify the scratch project or repository.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin-conversation.md --runtime opencode --scratch "/tmp/system-skill-advisor-cl008-scratch-$$" --out "/tmp/system-skill-advisor-cl008-evidence-$$"`

The scratch directory is outside the repository.

### Expected

- The first turn's state check finds an active goal JSON record with `packetPath` set to `specs/conversation-goal-probe` and `boundAtMs` set.
- The second turn's current `screen.txt` frame contains `GOAL-CONTEXT-CL008` after the echoed request, confirming the marker appears in the visible reply.
- Missing plugin fixtures, OpenCode credentials, network access or the OpenCode CLI make setup skip the whole run with a one-line reason, and no subject turn starts.
- The runtime evidence records the two turn checks and a PASS result.

### Evidence

Review the OpenCode runtime's `result.json`, `checkpoints.tsv` and each turn's `check.txt`. Inspect the matching goal JSON record for the bind check and the later turn's `screen.txt` frame for the reply marker after the echoed request.

### Pass / Fail

- **Pass**: Both turn checks exit 0, confirming the goal state is active and the marker appears in the later visible reply.
- **Fail**: No matching active goal record exists, or the later visible reply does not contain the marker.

### Failure Triage

If a required fixture, credential, network access or the OpenCode CLI is missing, setup reports `SKIP` with a one-line reason and the subject never starts. Otherwise, inspect JSON files beneath the scratch project's `skills/.state/goal/` directory when the bind-state check fails. If binding state passes but the second check fails, inspect the later turn's current `screen.txt` frame after the echoed request and report a missing marker as an injection failure.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [goal-opencode-plugin.md](goal-opencode-plugin.md) | Existing CL-007 goal plugin scenario |
| [goal-opencode-plugin.md](../../feature-catalog/hooks-and-plugin/goal-opencode-plugin.md) | Feature-catalog source describing the goal plugin contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/opencode-goal.js` | OpenCode goal plugin and active-goal prompt injection |
| `.opencode/plugins/tests/opencode-goal-state.test.cjs` | Regression tests for active-goal state and injection rendering |

---

## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-hooks-and-plugin/goal-opencode-plugin-conversation.md`
