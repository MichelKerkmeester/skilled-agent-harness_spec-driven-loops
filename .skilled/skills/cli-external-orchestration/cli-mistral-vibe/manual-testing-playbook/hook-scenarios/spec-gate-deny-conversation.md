---
title: "VIB-HK-002 -- Strict spec gate refuses the first write while the gate is open"
description: "This scenario validates that the Vibe spec-gate strict pre_tool hook refuses the first write of a session whose gate was opened by the classify pass, judged from a pre_tool_call skip in the session journal."
version: 1.0.1.0
---

# VIB-HK-002 -- Strict spec gate refuses the first write while the gate is open

This document captures the operator contract for `VIB-HK-002`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to create a scratch file through the file-writing tool while no spec packet is bound. The classify pass opens the gate, and the strict `spec-gate` `pre_tool` hook must refuse the first `write_file` call with the spec-folder reason.

### Why This Matters

A Vibe deny leaves the session running and the reply may paraphrase it, so only the journal shows that the strict hook judged the call. If the two halves disagree about where the session state lives, the write goes through and the gate silently stops guarding anything.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `spec-gate` returns a `pre_tool_call` skip whose reason names the spec-folder question when the first write runs with an open gate.
- Real user request: `Create notes.txt in this project with the line hello from the playbook. Use the file-writing tool rather than a shell command. Do not ask me any questions; just make the write.`
- Prompt: `Create notes.txt in this project with the line hello from the playbook. Use the file-writing tool rather than a shell command. Do not ask me any questions; just make the write.`
- Expected execution process: the runner renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe in the scratch project and types the prompt. The classify pass opens the gate, the subject calls `write_file`, and `spec-gate` reads the open state and refuses the call.
- Expected signals: a journal `pre_tool_call` record with output type `skip` whose reason carries `DENIED: this Write/Edit needs a bound spec folder first` and the `SPEC FOLDER QUESTION` text, plus the hook notice naming `spec-gate`.
- Desired user-visible outcome: the session reports that the write needs a spec folder and does not claim the file was created.
- Follow-up: the operator answers `D`, then asks for the same write again, which must now go through.
- Pass/fail: PASS when all three turn checks pass. FAIL when the first write is allowed, the reason does not name the question, the `D` answer leaves the gate open, or the retried write is still refused.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create notes.txt in this project with the line hello from the playbook. Use the file-writing tool rather than a shell command. Do not ask me any questions; just make the write.`
- Follow-up: `D, then: Now create notes.txt with the line hello from the playbook, using the file-writing tool as before.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-002 | Strict spec gate | Refuse the first write while the classify pass holds the gate open | `Create notes.txt in this project with the line hello from the playbook. Use the file-writing tool rather than a shell command. Do not ask me any questions; just make the write.` | `CONVERSATION_REPO_ROOT="$PWD" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/spec-gate-deny-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-002` | A `pre_tool_call` result of type `skip` whose reason carries `DENIED: this Write/Edit needs a bound spec folder first` and `SPEC FOLDER QUESTION`; a hook notice naming `spec-gate` | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when the journal holds the `pre_tool_call` skip with the spec-folder reason. FAIL when the write is allowed or the reason does not name the question. | 1. Read the write turn's check.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `spec-gate` as strict at `pre_tool`. 3. Read the `pre_tool_call` result and the gate state file in the scratch project. 4. Pipe the same `write_file` payload into `.vibe/plugins/repo-guards/spec-gate.mjs` and read its output. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [],
  "env": {
    "SYSTEM_SPEC_GATE_ENFORCE": "1"
  },
  "turns": [
    {
      "id": "write",
      "send": "Create notes.txt in this project with the line hello from the playbook. Use the file-writing tool rather than a shell command. Do not ask me any questions; just make the write.",
      "questions": [
        {
          "match": "[Ss]pec[- ]folder|SPEC FOLDER|[Dd]ocumentation|[Pp]acket|[Ww]hich applies|[Ww]here should|[Ww]hich folder",
          "answer": {
            "other": "Do not create a packet. Attempt the write now and report exactly what the tool returns."
          },
          "optional": true
        },
        {
          "match": "[Ss]pec[- ]folder|SPEC FOLDER|[Dd]ocumentation|[Pp]acket|[Ww]hich applies|[Ww]here should|[Ww]hich folder",
          "answer": {
            "reply": "Do not create a packet. Attempt the write now and report exactly what the tool returns."
          },
          "optional": true
        }
      ],
      "check": "grep -rqsF '\"hookName\":\"spec-gate\"' \"$VIBE_HOME/logs/session/unified\" && grep -rqsF '\"hook\":\"pre_tool_call\"' \"$VIBE_HOME/logs/session/unified\" && grep -rqsF '\"type\":\"skip\"' \"$VIBE_HOME/logs/session/unified\" && grep -rqsF 'DENIED: this Write/Edit needs a bound spec folder first' \"$VIBE_HOME/logs/session/unified\" && grep -rqsF 'SPEC FOLDER QUESTION' \"$VIBE_HOME/logs/session/unified\" && echo spec-gate-denied"
    },
    {
      "id": "answer-skip",
      "send": "D",
      "check": "s=$(ls .skilled/skills/.state/spec-gate/*.json 2>/dev/null | head -1); [ -n \"$s\" ] && grep -qsF '\"status\": \"skipped\"' \"$s\" && echo gate-closed-by-skip-answer"
    },
    {
      "id": "retry-write",
      "send": "Now create notes.txt with the line hello from the playbook, using the file-writing tool as before.",
      "questions": [
        {
          "match": "[Ss]pec[- ]folder|SPEC FOLDER|[Dd]ocumentation|[Pp]acket",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "for i in $(seq 1 20); do grep -qx 'hello from the playbook' notes.txt 2>/dev/null && echo write-allowed-after-skip && exit 0; sleep 1; done; echo 'notes.txt was not written after the skip answer'; exit 1"
    }
  ]
}
```

The spec gate stays enabled, because the deny is the behavior under test. The prompt names the file-writing tool because the core makes only `write` and `edit` deny-capable; a shell write is advised, never refused, so a shell call would not exercise this path. The prompt also asks for no questions, so the subject attempts the write instead of pausing on the gate's deferred instruction. The optional question entries answer a relayed dialog with "attempt the write", in a dialog or in plain chat, without binding the gate.

### Expected

Turn `write` finds the `pre_tool_call` skip whose reason carries the `DENIED: this Write/Edit needs a bound spec folder first` sentence and the `SPEC FOLDER QUESTION` text, with a hook notice naming `spec-gate`. Turn `answer-skip` sends `D` and finds the gate state reading `skipped`. Turn `retry-write` finds `notes.txt` holding the line.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: the journal holds the `pre_tool_call` skip with the spec-folder reason, the hook notice names `spec-gate`, the `D` answer closes the gate, and the retried write lands.
- **Fail**: no skip record, a skip that names no spec-folder question, a first write that completed, or a retried write that is still refused.

### Failure Triage

1. Read turns/write/check.txt and screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `spec-gate` as strict at `pre_tool` with `match = "re:bash|process_start|write_file|edit"`.
3. Read the `pre_tool_call` result and the gate state file in the scratch project; a classify write under one directory and an enforce read under another is a product bug.
4. Pipe the same `write_file` payload into `.vibe/plugins/repo-guards/spec-gate.mjs` and read its output.

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
| `.vibe/plugins/repo-guards/spec-gate.mjs` | The hook under test |
| `.vibe/plugins/repo-guards/lib/hook-io.mjs` | The payload mapping that hands the core its tool and directory |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | The runtime-neutral enforce core |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/spec-gate-deny-conversation.md`
