---
title: "VIB-HK-025 -- A mirrored prompt from .vibe/prompts runs by name"
description: "This scenario validates that a mirrored prompt from .vibe/prompts runs by name as a live Vibe session's system prompt and that the session acts on its content."
version: 1.0.2.0
---

# VIB-HK-025 -- A mirrored prompt from .vibe/prompts runs by name

This document captures the operator contract for `VIB-HK-025`.

---

## 1. OVERVIEW

This scenario runs a mirrored prompt from `.vibe/prompts` by name in a live session, then asks the session to act on it. Vibe has no command loader and no prompt tool, so an interactive session cannot invoke a mirrored prompt by typing its name. In Vibe 3.1.2 a prompt file runs as a session's system prompt only through an agent profile that names it with `system_prompt_id`: the top-level `system_prompt_id` in `config.toml` is read as a server-side experiment variant, and an unknown name falls back to the built-in prompt without reading any file (the installed Vibe package builds the system instructions in its app server runtime module with `build_vibe_code_system_instructions`).

### Why This Matters

The mirror is only useful if a run actually reads it. A missing prompt directory or an unresolved id changes the session's system instructions without any failing command, and only the first model input shows which prompt the session ran. A restart resumes the existing session and `/new` keeps the same Core, so the prompt must be in place before Vibe starts; the script's `launch_setup` installs it then, with an agent profile that names it and a `default_agent` that selects that profile. The scenario proves the mirror's content runs as a session's system prompt from a Vibe home; it does not prove discovery from a trusted checkout's own `.vibe/prompts`, because the runner starts Vibe in an untrusted scratch project.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the session journal's model input.

- Objective: verify that a mirrored `.vibe/prompts/create-goal.md` runs by name as a new session's system prompt.
- Real user request: `In one sentence, tell me which instructions you are following right now.`, then `Write the path of the command file your instructions point to into path.txt.`
- Prompt: `In one sentence, tell me which instructions you are following right now.`
- Expected execution process: the runner renders the repository config and hooks into a fresh `VIBE_HOME`, and `launch_setup` copies `.vibe/prompts/create-goal.md` into `$VIBE_HOME/prompts`, writes `$VIBE_HOME/agents/mirrored-goal.toml` with `system_prompt_id = "create-goal"`, and prepends `default_agent = "mirrored-goal"` to the home config. Vibe resolves the prompt by name when the session starts on that agent; `--auto-approve` keeps a custom agent and only adds the approval bypass. The follow-up turn asks the session to act on the prompt's content.
- Expected signals: the journal's `core_system_instructions` value carries the stub's `# Mistral Vibe prompt: /create-goal` line, and `path.txt` names `.skilled/commands/create/goal.md`, the path only the stub carries.
- Desired user-visible outcome: the session reports the prompt it is following, then writes the command path the prompt names.
- Pass/fail: PASS when both turn checks pass. FAIL when the session runs the built-in CLI prompt, refuses the id, or writes no `path.txt` naming the command file.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `In one sentence, tell me which instructions you are following right now.`
- Follow-up: `Write the path of the command file your instructions point to into a new file named path.txt, and nothing else.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-025 | Prompts mirror | Run a mirrored prompt from `.vibe/prompts` by name | `In one sentence, tell me which instructions you are following right now.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/prompts-mirror.md --runtime vibe --scratch "$(mktemp -d)" --out /tmp/vib-hk-025` | `core_system_instructions` carrying `# Mistral Vibe prompt: /create-goal`, then `path.txt` naming the command file | `matrix.md`, `checkpoints.tsv`, `launch-setup.log`, each turn's `screen.txt` and `check.txt` | PASS when both checks pass. FAIL when the built-in CLI prompt runs instead or `path.txt` is missing. | 1. Read launch-setup.log and confirm `$VIBE_HOME/prompts/create-goal.md` and `$VIBE_HOME/agents/mirrored-goal.toml` were written. 2. Confirm the home config starts with `default_agent = "mirrored-goal"`. 3. Resolve the id with the repository's own loader before launching Vibe. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "launch_setup": [
    "mkdir -p \"$VIBE_HOME/prompts\" \"$VIBE_HOME/agents\" && cp \"$CONVERSATION_REPO_ROOT/.vibe/prompts/create-goal.md\" \"$VIBE_HOME/prompts/create-goal.md\"",
    "printf 'description = \"Runs the mirrored create-goal prompt as its system prompt\"\\nsystem_prompt_id = \"create-goal\"\\n' > \"$VIBE_HOME/agents/mirrored-goal.toml\"",
    "{ printf 'default_agent = \"mirrored-goal\"\\n'; cat \"$VIBE_HOME/config.toml\"; } > \"$VIBE_HOME/config.next\" && mv \"$VIBE_HOME/config.next\" \"$VIBE_HOME/config.toml\""
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
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
      "check": "for i in $(seq 1 20); do grep -rhoE '\"core_system_instructions\":\"[^\"]{0,250}' \"$VIBE_HOME/logs/session/unified\" | grep -q 'Mistral Vibe prompt: /create-goal' && echo mirrored-prompt-is-system-input && exit 0; sleep 1; done; echo 'the system input is not the mirrored prompt'; exit 1"
    },
    {
      "id": "act-on-prompt",
      "send": "Write the path of the command file your instructions point to into a new file named path.txt, and nothing else.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Ww]ould you like|[Ss]hall I|[Ww]hich",
          "answer": {
            "reply": "Just write path.txt."
          },
          "optional": true
        }
      ],
      "check": "grep -qF '.skilled/commands/create/goal.md' path.txt && echo path-from-mirrored-prompt"
    }
  ]
}
```

Vibe reads the agent's prompt when the session starts, and a restart or `/new` keeps the prompt the session started with, so `launch_setup` installs the prompt, the agent profile and the `default_agent` pin after the runner writes the home and before Vibe starts. A top-level `system_prompt_id` would be accepted and recorded, then ignored, which a headless probe on Vibe 3.1.2 showed: the session config read `create-goal` while the system input was the built-in prompt. The first check reads the system input from the journal, so a reply that only paraphrases instructions cannot pass it. The second check reads a file the session wrote from what only the mirrored prompt says.

### Expected

Turn `run-prompt` finds the mirrored prompt text as the session's system instructions. Turn `act-on-prompt` finds `path.txt` naming `.skilled/commands/create/goal.md`.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, `launch-setup.log`, and each turn's `screen.txt` and `check.txt`.

### Pass / Fail

- **Pass**: the system input carries `# Mistral Vibe prompt: /create-goal`, and `path.txt` names the command file.
- **Fail**: the built-in CLI prompt runs instead, Vibe refuses the id, or `path.txt` is missing or wrong.

### Failure Triage

1. Read launch-setup.log and confirm `$VIBE_HOME/prompts/create-goal.md` and `$VIBE_HOME/agents/mirrored-goal.toml` were written.
2. Confirm the home config starts with `default_agent = "mirrored-goal"`.
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
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner, whose `launch_setup` installs the prompt before launch |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-025
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/prompts-mirror.md`
