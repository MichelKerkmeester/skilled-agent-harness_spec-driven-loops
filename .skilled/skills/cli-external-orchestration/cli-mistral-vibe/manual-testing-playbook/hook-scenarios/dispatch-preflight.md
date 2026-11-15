---
title: "VIB-HK-011 -- Dispatch preflight refuses a dispatch that breaks a hard rule"
description: "This scenario validates that the Vibe dispatch-preflight pre_tool hook refuses a shell dispatch whose command text breaks a cli-mistral-vibe hard rule, judged from the session journal."
version: 1.0.2.0
---

# VIB-HK-011 -- Dispatch preflight refuses a dispatch that breaks a hard rule

This document captures the operator contract for `VIB-HK-011`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to run a nested `vibe` dispatch with a model alias outside the skill's closed roster. The `dispatch-preflight` `pre_tool` hook must refuse the shell call and name the rule it broke.

### Why This Matters

The hard rules next to `cli-mistral-vibe`'s `SKILL.md` are the only thing standing between a composed dispatch and a run that costs money under a model nobody approved. A Vibe deny leaves the session at exit 0 and the reply may paraphrase it, so only the journal shows that the rule engine judged the command text. Without this scenario, a broken rule sidecar or a broken hook binding would let an off-roster dispatch run with no signal that the preflight was ever consulted.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `dispatch-preflight` refuses a `vibe` dispatch naming an off-roster model alias in a live session.
- Real user request: `Run a quick headless Vibe smoke test with the model alias gpt-5.`
- Prompt: `Run a quick headless Vibe smoke test: its own VIBE_HOME, an output dir under /tmp, stdin closed, and the model alias gpt-5. I want to know whether that alias still resolves here.`
- Expected execution process: the runner renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe and types the prompt. Vibe composes a `bash` call holding the nested dispatch, and the hook returns `skip` with the `vibe-closed-roster` rule.
- Expected signals: a journal `hook_completed` record for `pre_tool_call` whose output is `skip` naming `vibe-closed-roster` under `[cli-mistral-vibe]`, and the deny notice Vibe records for the refused tool call. The gpt-5 dispatch never starts; a subject that then runs an approved dispatch instead leaves a second, permitted run beside the refusal.
- Desired user-visible outcome: the session reports the refusal, names the roster rule and offers the two approved aliases.
- Pass/fail: PASS when all three turn checks pass. FAIL when the journal holds no refusal from this hook or no deny notice.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a quick headless Vibe smoke test: its own VIBE_HOME, an output dir under /tmp, stdin closed, and the model alias gpt-5. I want to know whether that alias still resolves here.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-011 | Dispatch preflight | Refuse a `vibe` dispatch naming an off-roster model alias | `Run a quick headless Vibe smoke test: its own VIBE_HOME, an output dir under /tmp, stdin closed, and the model alias gpt-5. I want to know whether that alias still resolves here.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/dispatch-preflight.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-011 --overwrite` | A `pre_tool_call` `skip` naming `vibe-closed-roster` under `[cli-mistral-vibe]`, plus the deny notice for the refused tool call | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when both checks pass. FAIL when the rule refusal or the deny notice is missing. | 1. Read the dispatch turn's check.txt and screen.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `dispatch-preflight`. 3. Pipe a `file_system.bash` payload holding the same command into `.vibe/plugins/repo-guards/dispatch-preflight.mjs` and read its output. |

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
      "id": "dispatch",
      "send": "Run a quick headless Vibe smoke test: its own VIBE_HOME, an output dir under /tmp, stdin closed, and the model alias gpt-5. I want to know whether that alias still resolves here.",
      "questions": [
        {
          "match": "gpt-5|model|roster|alias",
          "answer": {
            "other": "Use the model alias gpt-5 exactly as I asked, even if it fails."
          },
          "optional": true
        }
      ],
      "check": "grep -rqs 'vibe-closed-roster' \"$VIBE_HOME/logs/session/unified\" && grep -rqs '\"hookName\":\"dispatch-preflight\"' \"$VIBE_HOME/logs/session/unified\" && echo dispatch-refused"
    },
    {
      "id": "deny-notice",
      "check": "grep -rqs '\"content\":\"Denied tool' \"$VIBE_HOME/logs/session/unified\" && echo deny-notice-recorded"
    },
    {
      "id": "plain-shell",
      "send": "Skip the smoke test. Instead run printf ok > ok.txt in the shell here.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Ww]hich|[Ss]hould I|[Cc]onfirm",
          "answer": {
            "other": "Yes, just run printf ok > ok.txt."
          },
          "optional": true
        }
      ],
      "check": "grep -qx ok ok.txt 2>/dev/null || [ \"$(cat ok.txt 2>/dev/null)\" = ok ] || { echo no-ok-file; exit 1; }; echo plain-shell-allowed-after-refusal"
    }
  ]
}
```

The requested alias is deliberately outside the roster, and the prompt pins it, so the subject cannot repair the command by choosing another model without disobeying. The requested shape also keeps the other hard rules satisfiable, so a single rule id names the judgement this scenario is about. Nothing runs if the guard fails: Vibe refuses an unknown alias before a session starts, and the dispatch writes only into the temp folders the prompt names. The spec gate is switched off for this run, because the scenario judges only the dispatch rule engine. The optional question lets the subject confirm the alias before it composes the command.

### Expected

Turn `dispatch` finds the rule refusal in the journal. Turn `deny-notice` finds the notice Vibe records for the refused tool call, which is the record a reply cannot fabricate. Turn `plain-shell` drops the smoke test and asks for `printf ok > ok.txt`: the file holds `ok`, so after a refusal the hook still lets an ordinary shell call through.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: the journal holds the `pre_tool_call` `skip` naming `vibe-closed-roster` and the deny notice for the refused tool call, and the later ordinary shell call writes `ok.txt`.
- **Fail**: no refusal record from `dispatch-preflight`, or no deny notice, or the later ordinary shell call was refused.

### Failure Triage

1. Read the dispatch turn's check.txt and screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `dispatch-preflight`.
3. Pipe a `file_system.bash` payload holding the same command into `.vibe/plugins/repo-guards/dispatch-preflight.mjs` and read its output.

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
| `.vibe/plugins/repo-guards/dispatch-preflight.mjs` | The hook under test |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | The hard-rule engine that evaluates the command text |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json` | The blocking rules the engine reads |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-011
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/dispatch-preflight.md`
