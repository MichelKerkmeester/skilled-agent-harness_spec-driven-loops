---
title: "VIB-HK-023 -- A request that needs a repository skill loads it from the .vibe/skills mirror"
description: "This scenario validates that a Vibe session loads a repository skill from the .vibe/skills mirror installed in the disposable home's skills directory, judged from the session journal."
version: 1.0.0.0
---

# VIB-HK-023 -- A request that needs a repository skill loads it from the .vibe/skills mirror

This document captures the operator contract for `VIB-HK-023`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to use the `sk-prompt` skill. After the runner's disposable home receives the `.vibe/skills` mirror, the session's skill tool must load `sk-prompt` from that mirror and render its body.

### Why This Matters

Vibe discovers skills only in the trusted project root and in the home's `skills` directory, and the runner's scratch project is untrusted. A missing or stale home mirror leaves every repository skill unavailable, and the model answers a prompt-engineering request from general knowledge with no `skill` call at all. Only the journal shows that the mirrored skill was offered and loaded.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that a `skill` tool call names `sk-prompt` and renders its body from the mirror in the disposable home.
- Real user request: `Use the sk-prompt skill to turn this rough request into a structured prompt for a coding agent: make the build faster.`
- Prompt: `Use the sk-prompt skill to turn this rough request into a structured prompt for a coding agent: make the build faster.`
- Expected execution process: the runner renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe in a scratch project, then runs the baseline turn's check. That check builds the whole `.vibe/skills` mirror under `$VIBE_HOME/skills` in one rename, which Vibe's skill watch sees and re-derives. The first send then types the skill request, and Vibe calls the `skill` tool with `name = "sk-prompt"`.
- Expected signals: a journal tool call whose `name` is `skill`, the rendered `skill_content` block naming `sk-prompt`, and the mirrored `skills/sk-prompt` path in the tool result.
- Desired user-visible outcome: the session returns a structured prompt built with the skill's checklist.
- Pass/fail: PASS when both turn checks pass. FAIL when the mirror is missing, the skill stays unavailable, or the model never calls the skill tool.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use the sk-prompt skill to turn this rough request into a structured prompt for a coding agent: make the build faster.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-023 | Skills mirror | Load a repository skill from the `.vibe/skills` mirror in the disposable home | `Use the sk-prompt skill to turn this rough request into a structured prompt for a coding agent: make the build faster.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/skills-mirror-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-023` | A `skill` tool call, the `skill_content` body naming `sk-prompt`, and the mirrored `skills/sk-prompt` path | matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt | PASS when both checks pass. FAIL when the mirror or the skill call is missing. | 1. Read the skill turn's check.txt and screen.txt. 2. Confirm `$VIBE_HOME/skills/sk-prompt/SKILL.md` resolves. 3. Confirm `$VIBE_HOME/config.toml` has no `skill_paths` entry. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "mirror-ready",
      "check": "mkdir -p \"$VIBE_HOME/.vibe-skills-mirror\" && for d in \"$CONVERSATION_REPO_ROOT\"/.vibe/skills/*; do ln -s \"$d\" \"$VIBE_HOME/.vibe-skills-mirror/$(basename \"$d\")\"; done && mv \"$VIBE_HOME/.vibe-skills-mirror\" \"$VIBE_HOME/skills\" && test -f \"$VIBE_HOME/skills/sk-prompt/SKILL.md\" && echo mirror-linked"
    },
    {
      "id": "load-skill",
      "send": "Use the sk-prompt skill to turn this rough request into a structured prompt for a coding agent: make the build faster.",
      "delay_ms": 6000,
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "grep -rqs '\"name\":\"skill\"' \"$VIBE_HOME/logs/session/unified\" && grep -rqs 'skill_content' \"$VIBE_HOME/logs/session/unified\" && grep -rqs 'skills/sk-prompt' \"$VIBE_HOME/logs/session/unified\" && echo skill-loaded-from-mirror"
    }
  ]
}
```

The runner's home is created at launch with only `config.toml` and the rendered `hooks.toml`, so the baseline turn's check installs the mirror. The links are built under a hidden directory and renamed to `skills` in one step, because Vibe's skill watch treats a new `skills` directory under the home as a skill change and re-derives the catalogue; the skill turn's six-second pause lets that derivation settle. The baseline turn is a check-only turn, so the first send is the scenario's own request. `skill_paths` is unset in the repository config, so the home's `skills` directory is the only global skill source and the mirror is the only place `sk-prompt` can come from.

### Expected

Turn `mirror-ready` installs the mirror. Turn `load-skill` finds the skill tool call, the rendered body and the mirrored path in the journal.

### Evidence

Capture matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt, plus setup.log.

### Pass / Fail

- **Pass**: the journal holds a `skill` tool call for `sk-prompt` with its rendered body and mirrored path.
- **Fail**: the mirror is missing, or no skill tool call names `sk-prompt`.

### Failure Triage

1. Read the skill turn's check.txt and screen.txt.
2. Confirm `$VIBE_HOME/skills/sk-prompt/SKILL.md` resolves, and `$VIBE_HOME/config.toml` carries no `skill_paths`.
3. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `turn-start`, which is the part that carries the advisor brief.

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
| `.vibe/skills/` | The generated skill mirror under test |
| `.vibe/config.toml` | The project config, with `skill_paths` unset |
| `.vibe/plugins/repo-guards/render-home-hooks.cjs` | The home renderer the adapter calls at launch |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs` | The mirror generator |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-023
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/skills-mirror-conversation.md`
