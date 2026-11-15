---
title: "VIB-HK-013 -- MCP route guard refuses a native call with a Code Mode manual"
description: "This scenario validates that the Vibe mcp-route-guard pre_tool hook refuses a native MCP call whose family has a Code Mode manual registered, judged from the session journal."
version: 1.0.0.0
---

# VIB-HK-013 -- MCP route guard refuses a native call with a Code Mode manual

This document captures the operator contract for `VIB-HK-013`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to read a project file through a native MCP server whose family the repository's `.utcp_config.json` registers a Code Mode manual for. The `mcp-route-guard` `pre_tool` hook must refuse the native call and point at Code Mode.

### Why This Matters

The `mcp-code-mode` skill mandates one route for every family it can wrap, and a native call is the route that costs the context the wrapper exists to save. A Vibe deny leaves the session at exit 0 and the reply may paraphrase it, so only the journal shows that the hook judged the tool name instead of the model choosing Code Mode on its own. Without this scenario, a broken route name in the hook would leave every native call unadvised with no signal that the guard was ever consulted.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence. The subject reaches a native MCP tool only when its `VIBE_HOME` already holds the server row, which the runner does not build; the run folder's `procedure.md` carries the manual steps for that case.

- Objective: verify that `mcp-route-guard` refuses a native MCP call whose family has a registered Code Mode manual.
- Real user request: `Read the README through the github MCP server and summarize it.`
- Prompt: `Use the github MCP server to read this project's README and summarize it in one line.`
- Expected execution process: an operator prepares a `VIBE_HOME` whose `config.toml` declares a native `github` MCP server, renders the repository hooks into that home, and starts Vibe there. Vibe calls the server's tool, and the hook repacks the route into the core's packed name, matches the family against the checkout's `.utcp_config.json`, and returns `skip` with the routing advisory.
- Expected signals: a journal `hook_completed` record for `pre_tool_call` whose output is `skip` with `Code Mode can route this family via the "github" manual (call_tool_chain)`, and the deny notice naming `mcp-route-guard`.
- Desired user-visible outcome: the session reports the refusal and routes the same read through Code Mode's `call_tool_chain`.
- Pass/fail: PASS when both turn checks pass. FAIL when the journal holds no refusal or the native call reached the server.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use the github MCP server to read this project's README and summarize it in one line.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-013 | MCP route guard | Refuse a native MCP call whose family has a Code Mode manual | `Use the github MCP server to read this project's README and summarize it in one line.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/mcp-route-guard-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-013 --overwrite` | A `pre_tool_call` `skip` naming `Code Mode can route this family via the "github" manual`, plus the deny notice for the refused tool call | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, and the run folder's `procedure.md` when the runner cannot build the home | PASS when both checks pass. FAIL when the refusal record is missing or the native call reached the server. | 1. Read the mcp turn's check.txt and screen.txt. 2. Confirm the subject's VIBE_HOME/config.toml holds an `[[mcp_servers]]` row named `github`. 3. Pipe an `mcp_github.<tool>` payload into `.vibe/plugins/repo-guards/mcp-route-guard.mjs` and read its output. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "printf '# demo project\\n' > README.md"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "mcp",
      "send": "Use the github MCP server to read this project's README and summarize it in one line.",
      "questions": [
        {
          "match": "[Mm][Cc][Pp]|github|[Cc]ode [Mm]ode|which server",
          "answer": {
            "other": "Use the github MCP server's own file tool, not Code Mode."
          },
          "optional": true
        }
      ],
      "check": "grep -rqs 'Code Mode can route this family via the \"github\" manual' \"$VIBE_HOME/logs/session/unified\" && grep -rqs '\"hookName\":\"mcp-route-guard\"' \"$VIBE_HOME/logs/session/unified\" && echo mcp-route-refused"
    },
    {
      "id": "deny-notice",
      "check": "grep -rqs '\"content\":\"Denied tool' \"$VIBE_HOME/logs/session/unified\" && echo deny-notice-recorded"
    }
  ]
}
```

The subject needs a native `github` MCP tool before this scenario can judge the hook, and the runner gives it none: it copies the checkout's `.vibe/config.toml` into a freshly made `VIBE_HOME` at launch and starts Vibe without `--trust`, so a scratch project's own `.vibe/config.toml` is ignored and no `[[mcp_servers]]` row exists. An operator therefore prepares the home by hand, as the run folder's `procedure.md` records; the checks below read the same journal either way. The spec gate is switched off for this run, because the scenario judges only the route guard. The optional question lets the subject confirm the route once the refusal names Code Mode.

### Expected

Turn `mcp` finds the routing advisory and the deny notice in the journal. Turn `deny-notice` finds the notice Vibe records for the refused tool call.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log` and, when the runner cannot build the home, the run folder's `procedure.md`.

### Pass / Fail

- **Pass**: the journal holds the `pre_tool_call` `skip` naming the `github` manual and the deny notice for the refused tool call.
- **Fail**: no refusal record from `mcp-route-guard`, no deny notice, or a reply from the server whose call was refused.

### Failure Triage

1. Read the mcp turn's check.txt and screen.txt.
2. Confirm the subject's VIBE_HOME/config.toml holds an `[[mcp_servers]]` row named `github`.
3. Pipe an `mcp_github.<tool>` payload into `.vibe/plugins/repo-guards/mcp-route-guard.mjs` and read its output.

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
| `.vibe/plugins/repo-guards/mcp-route-guard.mjs` | The hook under test |
| `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs` | The runtime-neutral core that parses the route and matches the family |
| `.utcp_config.json` | The manifest whose `manual_call_templates` register the `github` family |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-013
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/mcp-route-guard-conversation.md`
