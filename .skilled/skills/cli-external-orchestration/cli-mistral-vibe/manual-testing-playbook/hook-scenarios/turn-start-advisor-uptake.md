---
title: "VIB-HK-028 -- The model loads the skill the turn-start advisor brief names"
description: "This scenario validates that a Vibe session acts on the skill advisor brief: a request that names no skill gets a brief naming one, and the model loads that skill through its skill tool, judged from the session journal."
version: 1.0.0.0
---

# VIB-HK-028 -- The model loads the skill the turn-start advisor brief names

This document captures the operator contract for `VIB-HK-028`.

---

## 1. OVERVIEW

This scenario sends a prompt-engineering request that names no skill. The `turn-start` composer adds the skill advisor brief, which names the skill the advisor routes the request to, and the model must then load that same skill from the `.vibe/skills` mirror in the disposable home.

### Why This Matters

`VIB-HK-003` proves the brief is delivered, and `VIB-HK-023` proves a skill loads when the request names it. Neither proves the model follows the brief. A brief the model ignores costs context on every turn and routes nothing. In one `VIB-HK-003` run the model loaded Vibe's bundled `skill-creator` while the brief named `sk-doc`, because the repository skills were not mirrored into that home. Only the journal ties the brief's skill to the skill the model loaded.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that the skill the advisor brief names is the skill the model loads with its skill tool.
- Real user request: `Improve this prompt so a coding agent can act on it: make the build faster.`
- Prompt: `Improve this prompt so a coding agent can act on it: make the build faster.`
- Expected execution process: the runner renders the repository hooks into a fresh `VIBE_HOME` and starts Vibe in a scratch project. The baseline turn's check links the whole `.vibe/skills` mirror under `$VIBE_HOME/skills` in one rename. The first send types the request; `turn-start` adds `Advisor: <state>; use <skill> …`, and the model calls the `skill` tool for that skill.
- Expected signals: a journal record carrying the brief `Advisor: … use <skill>`, then a `skill` tool call whose result names the mirrored `skills/<skill>` path, for the same skill.
- Desired user-visible outcome: the session returns an improved prompt, and a second turn writes it into `prompt.md`.
- Pass/fail: PASS when all three turn checks pass. FAIL when no brief names a skill, when the model loads no skill, or when it loads a different one.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Improve this prompt so a coding agent can act on it: make the build faster.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-028 | Advisor brief uptake | Load the skill the turn-start advisor brief names, for a request that names no skill | `Improve this prompt so a coding agent can act on it: make the build faster.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-advisor-uptake.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/023-vibe-review-remediation/scratch/live/VIB-HK-028` | The brief `Advisor: … use <skill>`, then a `skill` tool call loading the mirrored `skills/<skill>` | matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt | PASS when all three checks pass. FAIL when the brief names no skill or the model loads another skill or none. | 1. Read the uptake turn's check.txt for the advised skill. 2. Confirm `$VIBE_HOME/skills/<skill>/SKILL.md` resolves. 3. Run the advisor on the prompt with `node .skilled/bin/skill-advisor.cjs advisor_recommend`. |

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
      "id": "uptake",
      "send": "Improve this prompt so a coding agent can act on it: make the build faster.",
      "delay_ms": 6000,
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation",
          "answer": {
            "reply": "D"
          },
          "optional": true
        },
        {
          "match": "[Ww]hich|[Pp]roject|[Ss]tack|[Bb]uild",
          "answer": {
            "other": "Assume a generic Node.js project; just improve the prompt."
          },
          "optional": true
        }
      ],
      "check": "s=$(grep -rhoE 'Advisor: [a-z]+; use [a-z0-9-]+' \"$VIBE_HOME/logs/session/unified\" | head -1 | sed 's/.* use //'); [ -n \"$s\" ] || { echo no-brief-names-a-skill; exit 1; }; echo \"advised=$s\"; grep -rqs '\"name\":\"skill\"' \"$VIBE_HOME/logs/session/unified\" || { echo no-skill-call; exit 1; }; grep -rqsF \"skills/$s/\" \"$VIBE_HOME/logs/session/unified\" || { echo \"advised-skill-not-loaded loaded=$(grep -rhoE 'skills/[a-z0-9-]+/SKILL' \"$VIBE_HOME/logs/session/unified\" | sort -u | tr '\\n' ' ')\"; exit 1; }; echo advised-skill-loaded"
    },
    {
      "id": "carry-prompt",
      "send": "Write the improved prompt you just produced into prompt.md in this folder.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "test -s prompt.md || { echo no-prompt-file; exit 1; }; grep -qi 'build' prompt.md || { echo prompt-lacks-request; exit 1; }; echo \"prompt-carried lines=$(wc -l < prompt.md | tr -d ' ')\""
    }
  ]
}
```

The request names no skill on purpose, so a skill call can only come from the model's own choice, and the check compares that choice with the brief rather than with a skill the scenario guessed. The advisor routes this request to `sk-prompt` at the time of writing; a later router change that names another skill still passes, as long as the model loads the skill the brief named. The mirror goes in before the first send, as in `VIB-HK-023`, because without it no repository skill is available and the model can only fall back on Vibe's bundled ones.

### Expected

Turn `mirror-ready` links the mirror. Turn `uptake` reads the skill the brief named and finds a `skill` call that loaded that skill's mirrored `SKILL.md`. Turn `carry-prompt` finds the improved prompt in `prompt.md`.

### Evidence

Capture matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt.

### Pass / Fail

- **Pass**: the brief names a skill, the journal holds a `skill` call that loaded that skill from the mirror, and `prompt.md` names the build request.
- **Fail**: no brief names a skill, the model loads no skill, it loads a different skill, or `prompt.md` is missing.

### Failure Triage

1. Read turns/uptake/check.txt: `advised=` names the brief's skill, and a failure lists the skills that were loaded.
2. Confirm `$VIBE_HOME/skills/<skill>/SKILL.md` resolves.
3. Run `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Improve this prompt so a coding agent can act on it: make the build faster."}' --format json` and compare its top skill with the brief.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| [`guards-and-hooks.md`](../../references/guards-and-hooks.md) | Vibe hook and plugin classification |
| [`turn-start-advisor.md`](turn-start-advisor.md) | Brief delivery, which this scenario builds on |
| [`skills-mirror.md`](skills-mirror.md) | Skill loading from the mirror when the request names the skill |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | The composer that adds the advisor part |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | The brief builder under the `vibe` runtime label |
| `.vibe/skills/` | The generated skill mirror |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-028
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/turn-start-advisor-uptake.md`
