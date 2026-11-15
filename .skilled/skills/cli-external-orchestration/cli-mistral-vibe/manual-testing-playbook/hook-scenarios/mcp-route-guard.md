---
title: "VIB-HK-013 -- MCP route guard refuses a native call with a Code Mode manual"
description: "This scenario validates that the Vibe mcp-route-guard pre_tool hook refuses a native MCP call whose family has a Code Mode manual registered, judged from the session journal."
version: 1.0.2.0
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

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence. The script's `launch_setup` registers the native server in the subject's `VIBE_HOME` before Vibe starts.

- Objective: verify that `mcp-route-guard` refuses a native MCP call whose family has a registered Code Mode manual.
- Real user request: `Read the README through the github MCP server and give me its first line.`, then `Copy its second line into notes.txt with your own tools.`
- Prompt: `Use the github MCP server's get_file tool to read README.md, then reply with the first line it returned.`
- Expected execution process: the runner renders the repository hooks into a fresh `VIBE_HOME`, and `launch_setup` appends an `[[mcp_servers]]` row named `github` that starts `.vibe/plugins/repo-guards/fixtures/mcp-route-guard/stdio-server.cjs`, a dependency-free stdio server with one `get_file` tool. The server logs each request method to `$VIBE_HOME/mcp-fixture.log`. Vibe names the call `mcp_github.get_file`, and the hook repacks it into the core's packed name, matches the family against the checkout's `.utcp_config.json`, and returns `skip` with the routing advisory. The follow-up turn asks for a write through the session's own tools.
- Expected signals: the fixture log shows `tools/list`; the journal holds the routing advisory `Code Mode can route this family via the "github" manual (call_tool_chain)` and Vibe's `Denied tool` notice; the fixture log never shows `tools/call`; and the follow-up writes `notes.txt`.
- Desired user-visible outcome: the session reports the refusal, then writes the second line to `notes.txt` with its own tools.
- Pass/fail: PASS when all three turn checks pass. FAIL when the server never listed its tools, the journal holds no refusal, the native call reached the server, or the follow-up leaves no `notes.txt`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use the github MCP server's get_file tool to read README.md, then reply with the first line it returned.`
- Follow-up: `Now copy the second line of README.md into a new file named notes.txt, using your own file tools rather than an MCP server.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-013 | MCP route guard | Refuse a native MCP call whose family has a Code Mode manual | `Use the github MCP server's get_file tool to read README.md, then reply with the first line it returned.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/mcp-route-guard.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-013 --overwrite` | `tools/list` in the fixture log, the advisory naming the `github` manual, the deny notice, no `tools/call`, then `notes.txt` | `matrix.md`, `checkpoints.tsv`, `launch-setup.log`, each turn's `screen.txt` and `check.txt` | PASS when all three checks pass. FAIL on any other outcome. | 1. Read the mcp turn's check.txt and screen.txt. 2. Read launch-setup.log and `$VIBE_HOME/mcp-fixture.log`; no `tools/list` line means Vibe never started the server. 3. Pipe an `mcp_github.<tool>` payload into `.vibe/plugins/repo-guards/mcp-route-guard.mjs` and read its output. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "printf '# demo project\\nhello from the readme\\n' > README.md"
  ],
  "launch_setup": [
    "printf '\\n[[mcp_servers]]\\nname = \"github\"\\ntransport = \"stdio\"\\ncommand = \"node\"\\nargs = [\"%s\"]\\ncwd = \"%s\"\\nenv = { MCP_FIXTURE_LOG = \"%s\" }\\n' \"$CONVERSATION_REPO_ROOT/.vibe/plugins/repo-guards/fixtures/mcp-route-guard/stdio-server.cjs\" \"$(pwd -P)\" \"$VIBE_HOME/mcp-fixture.log\" >> \"$VIBE_HOME/config.toml\"",
    "grep -qx 'name = \"github\"' \"$VIBE_HOME/config.toml\""
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "mcp",
      "send": "Use the github MCP server's get_file tool to read README.md, then reply with the first line it returned.",
      "questions": [
        {
          "match": "[Mm][Cc][Pp]|github|[Cc]ode [Mm]ode|which server",
          "answer": {
            "other": "Use the github MCP server's own get_file tool, not Code Mode."
          },
          "optional": true
        }
      ],
      "check": "grep -qx tools/list \"$VIBE_HOME/mcp-fixture.log\" || { echo 'the fixture server never listed its tools'; exit 1; }; for i in $(seq 1 30); do grep -rqs 'Code Mode can route this family via the .\\{0,2\\}github.\\{0,2\\} manual' \"$VIBE_HOME/logs/session/unified\" && echo mcp-route-refused && exit 0; sleep 1; done; echo 'no routing advisory in the journal'; exit 1"
    },
    {
      "id": "deny-notice",
      "check": "grep -rqs 'Denied tool' \"$VIBE_HOME/logs/session/unified\" || { echo 'no deny notice'; exit 1; }; if grep -qx tools/call \"$VIBE_HOME/mcp-fixture.log\"; then echo 'the refused call reached the server'; exit 1; fi; echo deny-notice-and-no-server-call"
    },
    {
      "id": "follow-up",
      "send": "Now copy the second line of README.md into a new file named notes.txt, using your own file tools rather than an MCP server.",
      "questions": [
        {
          "match": "[Mm][Cc][Pp]|github|[Cc]ode [Mm]ode|which",
          "answer": {
            "other": "Use your own file tools to write notes.txt."
          },
          "optional": true
        }
      ],
      "check": "grep -qx 'hello from the readme' notes.txt || { echo 'notes.txt does not hold the second line'; exit 1; }; if grep -qx tools/call \"$VIBE_HOME/mcp-fixture.log\"; then echo 'an MCP call reached the server'; exit 1; fi; echo notes-written-without-mcp"
    }
  ]
}
```

Vibe reads a native server row only from its home config, so `launch_setup` appends the row after the runner writes that config and before Vibe starts. The server's request log tells a server that never started apart from a guard that never fired, and the absence of `tools/call` proves the refused call never reached the server. The spec gate is switched off for this run, because the scenario judges only the route guard.

### Expected

Turn `mcp` finds `tools/list` in the fixture log and the routing advisory in the journal. Turn `deny-notice` finds Vibe's deny notice and no `tools/call` in the fixture log. Turn `follow-up` finds `notes.txt` holding the README's second line, still with no `tools/call`.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log` and `launch-setup.log`.

### Pass / Fail

- **Pass**: the server listed its tools, the journal holds the advisory naming the `github` manual and the deny notice, the server never received `tools/call`, and the follow-up writes `notes.txt`.
- **Fail**: any of those is missing.

### Failure Triage

1. Read the mcp turn's check.txt and screen.txt.
2. Read launch-setup.log and `$VIBE_HOME/mcp-fixture.log`. No `tools/list` line means Vibe never started the server.
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
| `.vibe/plugins/repo-guards/fixtures/mcp-route-guard/stdio-server.cjs` | The native stdio server with one `get_file` tool |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner, its `vibe` adapter and `launch_setup` |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-013
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/mcp-route-guard.md`
