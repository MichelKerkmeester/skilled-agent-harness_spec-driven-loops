---
title: "VIB-HK-020 -- An answered question becomes one decision record"
description: "This scenario validates that the Vibe decision-capture post_tool hook turns one answered ask_user_question call into one queue record keyed on the tool call id, judged from the queue file and the session journal."
version: 1.0.0.0
---

# VIB-HK-020 -- An answered question becomes one decision record

This document captures the operator contract for `VIB-HK-020`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to settle one small policy question through the question tool. The `decision-capture-ask` `post_tool` hook must append exactly one queue record, keyed on the call id the model used to ask, before any save runs.

### Why This Matters

The operator's own answer is the part of a session nothing else keeps in a durable form, and a save-time sweep exists for answers the hook missed. If the live hook wrote a different key than the sweep, one answer would become two decision entries; only the queue file shows which key the live path wrote.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn check and the queue file.

- Objective: verify that one answered `ask_user_question` call leaves one queue record whose key is the runtime, session id, tool call id and question index.
- Real user request: `I'm wiring the upload retry policy. Before you write anything, ask me one thing: should a failed upload retry three times or five?`
- Prompt: `I'm wiring the upload retry policy. Before you write anything, ask me one thing: should a failed upload retry three times or five?`
- Expected execution process: the runner creates a scratch project, renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe and types the prompt. The subject calls `ask_user_question`, the runner answers the box with a typed answer, and the `post_tool` hook normalizes the result and appends one record to the queue under the scratch project.
- Expected signals: exactly one `.jsonl` row under the scratch project's `.skilled/skills/.state/decision-capture`, whose `key` equals `vibe:<session_id>:<tool_use_id>:0`, and whose `tool_use_id` appears in the session journal as a call id beside the question tool.
- Desired user-visible outcome: the subject carries the answer forward and no save is needed for the answer to be recorded.
- Pass/fail: PASS when the turn check passes. FAIL when the queue holds no row, more than one row, or a key that is not built from the record's session id and tool call id.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I'm wiring the upload retry policy. Before you write anything, ask me one thing: should a failed upload retry three times or five?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-020 | Decision capture on ask | Record one answered question as one queue row keyed on the tool call id | `I'm wiring the upload retry policy. Before you write anything, ask me one thing: should a failed upload retry three times or five?` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/decision-capture-ask-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-020` | One queue row whose key is `vibe:<session_id>:<tool_use_id>:0`, and that call id present in the journal | `matrix.md`, `checkpoints.tsv`, the turn's `screen.txt` and `check.txt`, the queue file under the scratch project | PASS when the check passes. FAIL when the queue is empty, holds more than one row, or holds a key the record's own identity does not build. | 1. Read the turn's check.txt. 2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `decision-capture-ask`. 3. Read the queue file and the journal's question call. 4. Pipe a `post_tool` payload for an answered question into `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs` and read the queue it writes. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "answer-question",
      "send": "I'm wiring the upload retry policy. Before you write anything, ask me one thing: should a failed upload retry three times or five?",
      "questions": [
        {
          "match": "[Rr]etry|[Tt]hree|[Ff]ive|upload|attempt",
          "answer": {
            "other": "Three attempts is enough."
          }
        },
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Pp]acket",
          "answer": {
            "other": "Skip the documentation question."
          },
          "optional": true
        }
      ],
      "check": "node -e 'const fs=require(\"fs\"),path=require(\"path\");const qd=path.join(process.cwd(),\".skilled/skills/.state/decision-capture\");if(!fs.existsSync(qd)){console.log(\"no-queue-dir\");process.exit(1);}const files=[];(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())w(p);else if(e.name.endsWith(\".jsonl\")&&e.name!==\"consumed.jsonl\")files.push(p);}})(qd);const rows=files.flatMap(f=>fs.readFileSync(f,\"utf8\").split(\"\\n\").filter(Boolean).map(l=>JSON.parse(l)));if(rows.length!==1){console.log(\"records=\"+rows.length);process.exit(1);}const r=rows[0];const want=\"vibe:\"+r.session_id+\":\"+r.tool_use_id+\":0\";if(r.key!==want){console.log(\"key=\"+r.key+\" want=\"+want);process.exit(1);}let raw=\"\";(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())w(p);else if(/\\.(json|jsonl)$/.test(e.name))raw+=fs.readFileSync(p,\"utf8\");}})(path.join(process.env.VIBE_HOME,\"logs/session/unified\"));if(!raw.includes(r.tool_use_id)){console.log(\"call-id-not-in-journal\");process.exit(1);}if(!raw.includes(\"ask_user_question\")){console.log(\"no-question-tool-in-journal\");process.exit(1);}console.log(\"one-record keyed on \"+r.tool_use_id);'"
    }
  ]
}
```

The prompt asks one question, so one call carries one question and the record index is `0`. The check reads the queue the hook wrote, not the reply: it requires one row, rebuilds the expected key from that row's own `session_id` and `tool_use_id`, and then proves the `tool_use_id` is a real call id in the session journal beside the question tool. The spec gate is switched off because the subject may write a file after it has the answer.

### Expected

Turn `answer-question` leaves one queue row whose key is `vibe:<session_id>:<tool_use_id>:0`, and the journal names that call id beside `ask_user_question`.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, the turn's `screen.txt` and `check.txt`, plus `setup.log` and the queue file under the scratch project's `.skilled/skills/.state/decision-capture`.

### Pass / Fail

- **Pass**: one queue row exists and its key is built from the record's session id and tool call id, which the journal names beside the question tool.
- **Fail**: no queue row, more than one row, or a key that does not match the record's identity.

### Failure Triage

1. Read turns/answer-question/check.txt and turns/answer-question/screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `decision-capture-ask` and that its `match` names `ask_user_question`.
3. Read the queue file under the scratch project's `.skilled/skills/.state/decision-capture` and the journal's `action_intent` for the question call.
4. Pipe a `post_tool` payload with an answered question into `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs` and read the queue it writes.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| [`guards-and-hooks.md`](../../references/guards-and-hooks.md) | Vibe hook and plugin classification |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs` | The hook under test |
| `.skilled/hooks/decision-capture/bin/sweep-vibe.mjs` | The answer mapper the hook and the save-time sweep share |
| `.skilled/hooks/decision-capture/lib/capture-core.mjs` | The queue path, key builder and deduplicated append |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-020
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/decision-capture-ask-conversation.md`
