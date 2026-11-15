---
title: "VIB-HK-001 -- Spec gate classify opens the gate for an unbound write request"
description: "This scenario validates that the Vibe spec-gate-classify pre_agent hook records an open gate state file for an operator request that would mutate a file with no bound spec packet, judged from the session journal and the hook-written state."
version: 1.0.1.0
---

# VIB-HK-001 -- Spec gate classify opens the gate for an unbound write request

This document captures the operator contract for `VIB-HK-001`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to add a line to a scratch file while no spec packet is bound. The `spec-gate-classify` `pre_agent` hook must classify the prompt as a file mutation, open the session's gate and persist the open state where the strict `spec-gate` `pre_tool` hook will read it.

### Why This Matters

The strict gate never sees the operator's prompt, so it can only refuse a write when this pass persisted an open gate first. A classifier that stays silent, or writes its state to a directory the enforce pass does not read, leaves the write unguarded with no error anywhere. Only the journal and the state file show that the classifier ran and what it decided.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `spec-gate-classify` runs at `pre_agent` and persists an open gate state file for an unbound file-mutation request.
- Real user request: `Add a line to notes.txt by running: printf 'hello from the playbook\n' > notes.txt. Do not ask me any questions; just run that command.`
- Prompt: `Add a line to notes.txt by running: printf 'hello from the playbook\n' > notes.txt. Do not ask me any questions; just run that command.`
- Expected execution process: the runner renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe in the scratch project and types the prompt. Vibe runs the `pre_agent` hooks, and `spec-gate-classify` classifies the prompt, writes the session's gate state and adds the deferred instruction as turn-start context.
- Expected signals: a journal `pre_agent_turn` record whose binding ids name `user:spec-gate-classify`, and a hook-written gate state file under the scratch project's `.skilled/skills/.state/spec-gate` whose status is `open`.
- Desired user-visible outcome: the session carries the deferred spec-folder instruction and does not lose the request, and the gate is ready for the first mutation.
- Follow-up: the operator answers `D` on the next turn, and the hook must read that answer and close the gate as skipped.
- Pass/fail: PASS when both turn checks pass. FAIL when either first-turn signal is missing, the state landed outside the scratch project, or the `D` answer leaves the gate open.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add a line to notes.txt by running: printf 'hello from the playbook\n' > notes.txt. Do not ask me any questions; just run that command.`
- Follow-up: `D`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-001 | Spec gate classify | Record an open gate for an unbound file-mutation request | `Add a line to notes.txt by running: printf 'hello from the playbook\n' > notes.txt. Do not ask me any questions; just run that command.` | `CONVERSATION_REPO_ROOT="$PWD" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/spec-gate-classify-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-001` | A `pre_agent_turn` record naming `user:spec-gate-classify`; a gate state file under the scratch project's `.skilled/skills/.state/spec-gate` whose status is `open` | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when the journal names the classify hook in a `pre_agent_turn` record and the gate state file reads open. FAIL when either signal is missing or the state landed outside the scratch project. | 1. Read the request turn's check.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `spec-gate-classify` at `pre_agent`. 3. Confirm the scratch project's `.skilled/skills/.state/spec-gate` holds a state file and read its status. 4. Pipe a `pre_agent` payload with the same session id and project directory into `.vibe/plugins/repo-guards/spec-gate-classify.mjs` and read its output and state write. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [],
  "env": {},
  "turns": [
    {
      "id": "request",
      "send": "Add a line to notes.txt by running: printf 'hello from the playbook\\n' > notes.txt. Do not ask me any questions; just run that command.",
      "questions": [
        {
          "match": "[Ss]pec[- ]folder|SPEC FOLDER|[Dd]ocumentation|[Pp]acket|[Ww]here should",
          "answer": {
            "other": "Skip the documentation question for this scratch project and keep going."
          },
          "optional": true
        },
        {
          "match": "[Ss]pec[- ]folder|SPEC FOLDER|[Dd]ocumentation|[Pp]acket|[Ww]here should",
          "answer": {
            "reply": "Skip the documentation question for this scratch project and keep going."
          },
          "optional": true
        }
      ],
      "check": "grep -rqsF 'user:spec-gate-classify' \"$VIBE_HOME/logs/session/unified\" && grep -rqsF '\"hook\":\"pre_agent_turn\"' \"$VIBE_HOME/logs/session/unified\" && s=$(ls .skilled/skills/.state/spec-gate/*.json 2>/dev/null | head -1) && [ -n \"$s\" ] && grep -qsF '\"status\": \"open\"' \"$s\" && echo spec-gate-open"
    },
    {
      "id": "answer-skip",
      "send": "D",
      "check": "s=$(ls .skilled/skills/.state/spec-gate/*.json 2>/dev/null | head -1); [ -n \"$s\" ] && grep -qsF '\"status\": \"skipped\"' \"$s\" && echo gate-closed-by-skip-answer"
    }
  ]
}
```

The spec gate is deliberately left enabled here, because this scenario judges the classify half: the request must still be classified before any refusal can happen. The prompt names the exact shell line and asks for no questions, so the mutation is concrete and the subject does not answer the gate on this turn; the open state survives to the check. The classify hook adds only a deferral, not the full question, so the subject can keep working on the turn. The optional question entries remain only as a safety net if the subject asks anyway, in a dialog or in plain chat.

### Expected

Turn `request` finds a `pre_agent_turn` journal record that names `user:spec-gate-classify`, and the scratch project's `.skilled/skills/.state/spec-gate` holds a state file whose status is `open`. Turn `answer-skip` sends `D` and finds the same state file reading `skipped`.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: the journal names the classify hook in a `pre_agent_turn` record, the gate state file in the scratch project reads open, and after the `D` answer it reads skipped.
- **Fail**: no `pre_agent_turn` record for the hook, no state file, a state file outside the scratch project, or a gate the `D` answer did not close.

### Failure Triage

1. Read turns/request/check.txt and screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `spec-gate-classify` at `pre_agent`.
3. Confirm the scratch project's `.skilled/skills/.state/spec-gate` holds a state file and read its status.
4. Pipe a `pre_agent` payload with the same session id and project directory into `.vibe/plugins/repo-guards/spec-gate-classify.mjs` and read its output and state write.

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
| `.vibe/plugins/repo-guards/spec-gate-classify.mjs` | The hook under test |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | The runtime-neutral classify core and its state writer |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/spec-gate-classify-conversation.md`
