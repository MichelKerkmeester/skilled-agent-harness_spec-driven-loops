---
title: "VIB-HK-025 -- A mirrored prompt from .vibe/prompts runs by name"
description: "This scenario records how a mirrored prompt from .vibe/prompts runs by name as a Vibe system prompt, and that the interactive runner cannot put it into a new session process, so the row is operator-only with a written procedure."
version: 1.0.0.0
---

# VIB-HK-025 -- A mirrored prompt from .vibe/prompts runs by name

This document captures the operator contract for `VIB-HK-025`.

---

## 1. OVERVIEW

This scenario records how a mirrored prompt from `.vibe/prompts` runs by name. Vibe resolves a custom prompt id only as a config value (`system_prompt_id`, `compaction_prompt_id` or `title_prompt_id`), read from the project's `.vibe/prompts` or the home's `prompts` directory. It has no command loader and no prompt tool, so an interactive session cannot invoke a mirrored prompt by typing its name.

### Why This Matters

The mirror is only useful if a run actually reads it. A missing prompt directory or an unresolved id changes the session's system instructions without any failing command, and only the first model input shows which prompt the session ran. The runner creates its home at launch, its restart resumes the existing session, and `/new` keeps the same Core, so no runner step can hand the mirrored prompt to a new session process; this row is operator-only, and `scratch/live/VIB-HK-025/procedure.md` carries the manual steps and the three observed limitations.

---

## 2. SCENARIO CONTRACT

Operators run the manual procedure, then read the session journal's first model input.

- Objective: verify that a mirrored `.vibe/prompts/create-goal.md` runs by name as a new session's system prompt.
- Real user request: `In one sentence, tell me which instructions you are following right now.`
- Prompt: `In one sentence, tell me which instructions you are following right now.`
- Expected execution process: the operator creates a disposable home outside the checkout, copies the repository config and the rendered hooks into it, copies `.vibe/prompts/create-goal.md` into `$VIBE_HOME/prompts`, starts Vibe with `VIBE_SYSTEM_PROMPT_ID=create-goal`, and types the request. Vibe resolves the prompt by name when the new session process is created.
- Expected signals: the journal's `core_system_instructions` value carries the stub's `# Mistral Vibe prompt: /create-goal` line and its `The vibe dispatcher appends the user request below this line.` closing line.
- Desired user-visible outcome: the session reports the prompt it is following.
- Pass/fail: PASS when the first model input carries the mirrored prompt text. FAIL when the session runs the built-in CLI prompt or refuses the id.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `In one sentence, tell me which instructions you are following right now.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-025 | Prompts mirror | Run a mirrored prompt from `.vibe/prompts` by name | `In one sentence, tell me which instructions you are following right now.` | `See scratch/live/VIB-HK-025/procedure.md` | `core_system_instructions` carrying `# Mistral Vibe prompt: /create-goal` and the dispatcher line | The session journal's first model input, plus the procedure log | PASS when the first model input carries the mirrored prompt text. FAIL when the built-in CLI prompt runs instead. | 1. Confirm `$VIBE_HOME/prompts/create-goal.md` exists before launch. 2. Confirm the home config or environment sets `system_prompt_id = "create-goal"`. 3. Resolve the id with the repository's own loader before launching Vibe. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1",
    "VIBE_SYSTEM_PROMPT_ID": "create-goal"
  },
  "turns": [
    {
      "id": "run-prompt",
      "send": "In one sentence, tell me which instructions you are following right now.",
      "delay_ms": 1000,
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Ww]ould you like|[Ss]hall I|[Ww]hich instructions",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "grep -rqs 'Mistral Vibe prompt: /create-goal' \"$VIBE_HOME/logs/session/unified\" && grep -rqs 'core_system_instructions' \"$VIBE_HOME/logs/session/unified\" && echo prompt-in-first-input"
    }
  ]
}
```

The script records the operator contract, not a runner path. The runner has no setup step that runs after the home exists and before launch: `prepareVibeHome()` creates the home inside the launch callback, copies only `.vibe/config.toml` and the rendered `hooks.toml`, and the first turn's check runs after Vibe has already validated `system_prompt_id`. A prompt copied by a later check cannot satisfy the id at launch; the runner's restart resumes the session, whose Core keeps the prompt it was created with; and the built-in `/new` command keeps the same Core, as the two experiments in the procedure record. The manual steps, the loader proof and the observed failed runs are in `scratch/live/VIB-HK-025/procedure.md`.

### Expected

The new session's first model input carries the mirrored prompt text as its system instructions.

### Evidence

Capture the session journal's `core_system_instructions` value and the operator's procedure log.

### Pass / Fail

- **Pass**: the first model input carries `# Mistral Vibe prompt: /create-goal`.
- **Fail**: the built-in CLI prompt runs instead, or Vibe refuses the id.

### Failure Triage

1. Confirm `$VIBE_HOME/prompts/create-goal.md` exists before launch.
2. Confirm the home config or `VIBE_SYSTEM_PROMPT_ID` names `create-goal`.
3. Resolve the id with the repository's own loader before launching Vibe.

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
| `.vibe/prompts/create-goal.md` | The mirrored prompt under test |
| `.skilled/commands/create/goal.md` | The canonical command the stub points at |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs` | The mirror generator |
| The installed Vibe `core/prompts` module | The prompt id resolver |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner that cannot install the prompt before launch |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-025
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/prompts-mirror-conversation.md`
