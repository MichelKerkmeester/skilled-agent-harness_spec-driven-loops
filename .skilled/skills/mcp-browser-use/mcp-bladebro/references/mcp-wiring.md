---
title: "Bladebro MCP Wiring"
description: "The bladebro Code Mode manual in .utcp_config.json, when the MCP lane applies, and the discovery steps that must run before any call_tool_chain invocation."
trigger_phrases:
  - "bladebro mcp wiring"
  - "bladebro code mode manual"
importance_tier: normal
contextType: reference
version: 1.1.3.0
---

# Bladebro MCP Wiring

How the MCP lane reaches Bladebro through Code Mode. The server is `bladebro mcp`, a local stdio process with five tools: `act`, `see`, `state`, `run` and `vision`.

---

## 1. OVERVIEW

### Purpose

States the manual, the trigger for using it and the discovery the agent must run first.

### When to Use

Load this file when the lane rule chose MCP: the binary is unavailable, or the task needs composition with other Code Mode tools, parallel isolated sessions or an MCP-only capability.

### Core Principle

The MCP lane changes the transport, not the capability. Both lanes call the same handlers.

---

## 2. THE MANUAL

`.utcp_config.json` carries one manual named `bladebro`, in the same shape as the `aside` manual: a stdio server that runs `bladebro mcp` with an empty `env`. The exact JSON lives once, in [`../assets/utcp-bladebro-manual.md`](../assets/utcp-bladebro-manual.md).

Confirm it is registered rather than adding a second one:

```bash
jq -c '.manual_call_templates[] | select(.name=="bladebro")' .utcp_config.json
```

The manual launches the installed binary. Without a global install, an MCP client can launch it through npm with `"command": "npx"` and `"args": ["-y", "bladebro@4.8.2", "mcp"]`, pinned to the exact release, but that pulls the package at launch, which is an install under R-SEC-3 and needs an operator yes. Set `BLADE_HOME` or `BLADE_FRESH` in `env` when a task needs isolation.

---

## 3. DISCOVERY BEFORE INVOCATION

The live macOS run on 2026-11-21 observed `bladebro.bladebro_{act,see,state,run,vision}` through Code Mode, and the call had to be synchronous (`return bladebro.bladebro_see({...})`); see `benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/`. Names can change with the installed version, so confirm them each session.

1. Start a Code Mode session that loaded the `bladebro` manual.
2. Run `list_tools()` or `search_tools("bladebro")`, then `tool_info()` on the match.
3. Use the `Access as:` form that `tool_info()` prints inside `call_tool_chain`.
4. Wrap browser work in `try/finally` so the stdio process closes.

The mcp-code-mode naming convention predicts a `bladebro.bladebro_<tool>` callable. That is a prediction to confirm, not a contract.

---

## 4. PARALLEL ISOLATED SESSIONS

Each MCP server process owns one Bladebro data root. For parallel isolated sessions, give each process its own `BLADE_HOME` or `BLADE_FRESH=1`. A second manual for that purpose is a configuration change the operator approves; it is not registered here.

---

## 5. RELATED RESOURCES

- [`cli-reference.md`](./cli-reference.md): the actions behind each tool.
- [`install-and-verify.md`](./install-and-verify.md): the MCP lane probe.
- `mcp-code-mode` skill: Code Mode discovery and `call_tool_chain`.
- Upstream `docs/setup.md` (MCP section) at `https://github.com/dondai44423/bladebro`.
