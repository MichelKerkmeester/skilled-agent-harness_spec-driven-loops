---
title: "VIB-HK-015 -- Deep-loop guard refuses a dispatch whose mode disagrees with the registry"
description: "This scenario validates that the Vibe deep-loop-guard pre_tool hook refuses an agents_spawn whose prompt declares a workflow mode the mode registry does not give the target agent, judged from the session journal."
version: 1.0.2.0
---

# VIB-HK-015 -- Deep-loop guard refuses a dispatch whose mode disagrees with the registry

This document captures the operator contract for `VIB-HK-015`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to spawn a subagent with a dispatch prompt that names the `deep-research` agent while declaring `mode=review`. The `deep-loop-guard` `pre_tool` hook must refuse the spawn and say which modes the registry does allow.

### Why This Matters

The guard is the only thing that stops a dispatch from reaching an agent the registry does not give that mode, and a Vibe deny leaves the session at exit 0 with a reply that may paraphrase it. Only the journal shows that the guard judged the spawn, so without this scenario a broken `agents_spawn` binding would let a mis-routed dispatch run unseen.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `deep-loop-guard` refuses an `agents_spawn` whose prompt declares `mode=review` for the `deep-research` agent, which the registry registers for `research` only.
- Real user request: `Please spawn a subagent with this exact message, copied from our review run: Deep Route: workflow=deep-research mode=review target_agent=@deep-research -- review the dist-freshness hook and report findings.`
- Prompt: `Please spawn a subagent with this exact message, copied from our review run: Deep Route: workflow=deep-research mode=review target_agent=@deep-research -- review the dist-freshness hook and report findings.`
- Expected execution process: the runner renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe in a scratch project and types the prompt. The subject calls `agents.spawn` with the message, and the hook resolves the target agent from `config_name` or the prompt's `target_agent=` field, reads the declared mode, and compares both against the checkout's mode registry.
- Expected signals: a journal `hook_completed` record for `pre_tool_call` whose output is a skip naming `Deep Route mode mismatch`, the registry's allowed modes and the declared mode, plus the deny notice naming `deep-loop-guard`.
- Desired user-visible outcome: the session reports that the spawn was refused and that the dispatch names a mode the agent is not registered for.
- Pass/fail: PASS when all three turn checks pass. FAIL when the journal holds no refusal, or the refusal does not name the registry modes and the declared mode.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Please spawn a subagent with this exact message, copied from our review run: Deep Route: workflow=deep-research mode=review target_agent=@deep-research -- review the dist-freshness hook and report findings.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-015 | Deep-loop dispatch guard | Refuse a subagent spawn whose declared mode disagrees with the mode registry | `Please spawn a subagent with this exact message, copied from our review run: Deep Route: workflow=deep-research mode=review target_agent=@deep-research -- review the dist-freshness hook and report findings.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/deep-loop-guard.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-015` | A `pre_tool_call` skip naming `Deep Route mode mismatch`, the registry modes and the declared mode, plus a deny notice naming `deep-loop-guard` | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when both checks pass. FAIL when the refusal record is missing or it does not name both modes. | 1. Read the dispatch turn's check.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `deep-loop-guard` with `match = "agents_spawn"`. 3. Pipe the wire-format spawn payload into the hook by hand. |

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
      "id": "dispatch",
      "send": "Please spawn a subagent with this exact message, copied from our review run: Deep Route: workflow=deep-research mode=review target_agent=@deep-research -- review the dist-freshness hook and report findings.",
      "questions": [
        {
          "match": "[Hh]ow should I|[Ss]hould I|[Pp]roceed|[Rr]etarget|[Dd]ispatch|[Ss]pawn|[Aa]gent|[Rr]eview|[Ss]pec folder|[Dd]ocumentation|[Cc]onfirm|[Ss]top|[Ww]hich",
          "answer": {
            "other": "Stop there. The refusal is the result I wanted, so do not retry the dispatch and do not change the mode token."
          },
          "optional": true
        },
        {
          "match": "[Hh]ow should I|[Ss]hould I|[Pp]roceed|[Rr]etarget|[Dd]ispatch|[Ss]pawn|[Aa]gent|[Rr]eview|[Ss]pec folder|[Dd]ocumentation|[Cc]onfirm|[Ss]top|[Ww]hich",
          "answer": {
            "other": "Nothing more. Leave the dispatch refused and finish the turn."
          },
          "optional": true
        },
        {
          "match": "[Hh]ow should I|[Ss]hould I|[Pp]roceed|[Rr]etarget|[Dd]ispatch|[Ss]pawn|[Aa]gent|[Rr]eview|[Ss]pec folder|[Dd]ocumentation|[Cc]onfirm|[Ss]top|[Ww]hich",
          "answer": {
            "other": "Nothing more. Leave the dispatch refused and finish the turn."
          },
          "optional": true
        }
      ],
      "check": "grep -rqs 'Deep Route mode mismatch' \"$VIBE_HOME/logs/session/unified\" && grep -rqs '\"hookName\":\"deep-loop-guard\"' \"$VIBE_HOME/logs/session/unified\" && echo refused"
    },
    {
      "id": "reason",
      "check": "grep -rqs 'registry modes=' \"$VIBE_HOME/logs/session/unified\" && grep -rqs 'but the prompt declares mode=' \"$VIBE_HOME/logs/session/unified\" && echo reason-recorded"
    },
    {
      "id": "reason-carried",
      "send": "Write the reason the guard gave for refusing that dispatch into reason.txt in this folder, as one line.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Ww]hich|[Ss]hould I|[Cc]onfirm|[Rr]etry",
          "answer": {
            "other": "Do not retry the dispatch; only write reason.txt."
          },
          "optional": true
        }
      ],
      "check": "test -s reason.txt || { echo no-reason-file; exit 1; }; grep -qi 'mode' reason.txt || { echo reason-lacks-mode; exit 1; }; echo \"reason-carried: $(head -c 160 reason.txt)\""
    }
  ]
}
```

The guard reads the registry and the target agent's identity from the checkout, not from the scratch project, so setup needs nothing: the hook's own root is the checkout, and its registry is the one this repository ships. The prompt carries both fields the guard resolves from text, `target_agent=@deep-research` and `mode=review`, because a spawn may arrive with no `config_name` at all. The spec gate is switched off for this run, because the scenario judges only the dispatch guard and a spec-gate refusal would replace the refusal under test. The optional question entries answer the follow-up the subject asks once the refusal leaves it a choice, and they tell it to stop rather than retry with a different mode token.

### Expected

Turn `dispatch` finds the refusal in the journal, and the deny notice names `deep-loop-guard`. Turn `reason` finds the refusal text naming the registry's allowed modes and the declared mode, which is what tells an operator the guard read the registry rather than guessing. Turn `reason-carried` asks the session to write the refusal's reason into `reason.txt`: the file names the mode, which shows the reason reached the model and stayed in the conversation for the next turn.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: the journal holds the `pre_tool_call` skip with the mode mismatch, the deny notice names `deep-loop-guard`, and the reason names the registry modes and the declared mode, and `reason.txt` names the mode from the refusal.
- **Fail**: no refusal record, or a refusal that names neither the registry modes nor the declared mode, or `reason.txt` is missing or does not name the mode.

### Failure Triage

1. Read turns/dispatch/check.txt and screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `deep-loop-guard` with `match = "agents_spawn"`.
3. Pipe a payload with `tool_name` `agents.spawn`, `config_name` `deep-research` and the same message into `.vibe/plugins/repo-guards/deep-loop-guard.mjs` and read its output.

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
| `.vibe/plugins/repo-guards/deep-loop-guard.mjs` | The hook under test |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs` | The runtime-neutral core that indexes the registry and decides the mismatch |
| `.skilled/skills/system-deep-loop/mode-registry.json` | The registry that gives `deep-research` the `research` mode only |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-015
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/deep-loop-guard.md`
