---
title: "VIB-HK-024 -- A request that needs a repository agent spawns it from the .vibe/agents mirror"
description: "This scenario validates that a Vibe session spawns a repository subagent from the .vibe/agents mirror installed in the disposable home's agents directory, judged from the session journal."
version: 1.0.1.0
---

# VIB-HK-024 -- A request that needs a repository agent spawns it from the .vibe/agents mirror

This document captures the operator contract for `VIB-HK-024`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to delegate a prompt rewrite to the `prompt-improver` subagent. After the disposable home receives the `.vibe/agents` mirror and the session restarts, the spawn must carry `config_name = "prompt-improver"`.

### Why This Matters

Vibe discovers agent profiles at session start from the home's `agents` directory, and the runner's scratch project is untrusted. A missing mirror leaves the repository subagents unadvertised, so the main agent either does the work itself or spawns a generic child with no profile. Only the journal shows which agent configuration the spawn named.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that an `agents_spawn` call names `config_name = "prompt-improver"` from the mirror in the disposable home.
- Real user request: `Spawn a child from the prompt-improver agent type (config_name prompt-improver) to rewrite this rough request into a dispatch-ready prompt: make the build faster. One attempt only; report the result.`
- Prompt: `Spawn a child from the prompt-improver agent type (config_name prompt-improver) to rewrite this rough request into a dispatch-ready prompt: make the build faster. One attempt only; report the result.`
- Expected execution process: the runner renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe in a scratch project and types the delegation request naming the agent type. That turn's check copies `.vibe/agents` into `$VIBE_HOME/agents`, which the running process cannot see yet; the next turn restarts the subject into the same session, so the new process discovers the mirrored profiles, and the repeated request spawns the mirrored profile. Vibe calls `agents_spawn` with the mirrored profile name.
- Expected signals: a child session store under the home's session tree that carries the mirrored profile's instructions heading `The Prompt-Improver Agent`, and a spawn record naming the `prompt-improver` agent. Whether the child then finishes its turn is Vibe's own child-session behavior, outside the mirror under test. The subject may spawn through a direct `agents_spawn` call or through a `run_typescript` program, so the check reads the child the spawn created, not the call's spelling.
- Desired user-visible outcome: the session reports the subagent's prompt package.
- Pass/fail: PASS when all three turn checks pass. FAIL when the mirror is missing, the restart fails, or no spawn names the mirrored agent.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Spawn a child from the prompt-improver agent type (config_name prompt-improver) to rewrite this rough request into a dispatch-ready prompt: make the build faster. One attempt only; report the result.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-024 | Agents mirror | Spawn a repository subagent from the `.vibe/agents` mirror in the disposable home | `Spawn a child from the prompt-improver agent type (config_name prompt-improver) to rewrite this rough request into a dispatch-ready prompt: make the build faster. One attempt only; report the result.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/agents-mirror-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-024` | An `agents_spawn` or `agents.spawn` tool call carrying `"config_name":"prompt-improver"` | matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt | PASS when all three checks pass. FAIL when the mirror, the restart or the named spawn is missing. | 1. Read the delegation turn's check.txt and screen.txt. 2. Confirm `$VIBE_HOME/agents/prompt-improver.toml` exists before the restart. 3. Confirm the restarted session lists the profile by calling `agents_list_configs` if needed. |

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
      "id": "delegate-before-mirror",
      "send": "Spawn a child from the prompt-improver agent type (config_name prompt-improver) to rewrite this rough request into a dispatch-ready prompt: make the build faster. One attempt only; report the result.",
      "delay_ms": 1000,
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Ww]ould you like|[Ss]hall I",
          "answer": {
            "reply": "There should be a prompt-improver subagent; try it once more."
          },
          "optional": true
        }
      ],
      "check": "if ls -d \"$VIBE_HOME\"/logs/session/unified/child-* >/dev/null 2>&1; then echo child-spawned-before-mirror; exit 1; fi; mkdir -p \"$VIBE_HOME/agents\" && cp \"$CONVERSATION_REPO_ROOT\"/.vibe/agents/prompt-improver.toml \"$VIBE_HOME/agents/\" && test -f \"$VIBE_HOME/agents/prompt-improver.toml\" && echo agent-mirrored"
    },
    {
      "id": "restart",
      "action": "restart",
      "check": "test -f \"$VIBE_HOME/agents/prompt-improver.toml\" && touch \"$CONVERSATION_TURN_DIR/agent-mirror-ready\" && echo restart-with-agent-mirror"
    },
    {
      "id": "delegate",
      "send": "Spawn a child from the prompt-improver agent type (config_name prompt-improver) to rewrite this rough request into a dispatch-ready prompt: make the build faster. One attempt only; report the result.",
      "delay_ms": 3000,
      "timeout_ms": 420000,
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Ww]ould you like|[Ss]hall I",
          "answer": {
            "reply": "Yes, use the prompt-improver subagent."
          },
          "optional": true
        }
      ],
      "check": "ls -d \"$VIBE_HOME\"/logs/session/unified/child-* >/dev/null 2>&1 && grep -rqsE '\"agent_?[Nn]ame\":\"prompt-improver\"' \"$VIBE_HOME/logs/session/unified\" && grep -rqsF 'The Prompt-Improver Agent' \"$VIBE_HOME\"/logs/session/unified/child-* && echo agent-spawned-from-mirror"
    }
  ]
}
```

The runner's home is created at launch with only `config.toml` and the rendered `hooks.toml`, so the first turn's check copies the mirrored profile in. The first send happens before that copy, so the running process has no `prompt-improver` profile to spawn; the check installs it regardless. Vibe discovers agent profiles once per process, and `/reload` does not rebuild the agent registry, so the restart turn relaunches the subject into the same session and the same home; the new process reads `$VIBE_HOME/agents`, and the repeated send spawns the mirrored profile. The first send is the scenario's own request, so the contract and the script agree. The restart turn's check touches a marker in its own evidence folder, so the delegation check greps only journal files written after the restart; the pre-mirror attempt cannot satisfy it. The check also refuses a run whose post-restart spawn was rejected as an unknown subagent type, because a rejected spawn proves the profile was never registered. The delegation turn's timeout is raised because the subagent runs its own pass before it answers.

### Expected

Turn `delegate-before-mirror` first confirms that no child session exists yet, then installs the profile. Turn `restart` confirms the mirrored profile is still in the home and reloads it. Turn `delegate` finds the child session the post-restart spawn created, running under the mirrored `prompt-improver` profile. Before the mirror exists the spawn is refused, so no child session appears for turn one.

### Evidence

Capture matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt, plus setup.log.

### Pass / Fail

- **Pass**: a child session ran under the mirrored `prompt-improver` profile and carries its instructions.
- **Fail**: the profile is missing, the restart fails, or the spawn is generic or names another agent.

### Failure Triage

1. Read the delegation turn's check.txt and screen.txt.
2. Confirm `$VIBE_HOME/agents/prompt-improver.toml` exists and that its `instructions` value is under the 64 KiB profile limit.
3. Confirm the restarted subject reached the prompt line; a launch timeout leaves the delegation turn NOT_RUN.

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
| `.vibe/agents/prompt-improver.toml` | The mirrored agent profile under test |
| `.vibe/agents/` | The generated agent mirror |
| `.skilled/agents/prompt-improver.md` | The canonical profile source |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs` | The mirror generator |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-024
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/agents-mirror-conversation.md`
