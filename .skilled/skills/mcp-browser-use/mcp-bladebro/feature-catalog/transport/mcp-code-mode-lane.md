---
title: "MCP lane through Code Mode"
description: "`bladebro mcp` is a local stdio server with the same five tools, reached from Code Mode through the registered `bladebro` manual with synchronous calls."
trigger_phrases:
  - "mcp lane through code mode"
  - "bladebro mcp"
  - "bladebro code mode"
  - "bladebro call_tool_chain"
version: 1.0.1.0
---

# MCP lane through Code Mode (bladebro mcp)

## 1. OVERVIEW

`bladebro mcp` is a local stdio server with the same five tools, reached from Code Mode through the registered `bladebro` manual with synchronous calls.

The MCP lane changes the transport, not the capability. It is the route when the binary is unavailable to the caller, or when browser work has to chain with other Code Mode tools or run in parallel isolated sessions.

---

## 2. HOW IT WORKS

### The Manual

`.utcp_config.json` carries one manual named `bladebro`: a stdio server that runs `bladebro mcp` with an empty `env`, because the server needs no credential. The packet states the exact JSON once, in `assets/utcp-bladebro-manual.md`, and checks it with `jq` instead of adding it again. Launching through `npx -y bladebro@4.8.2 mcp` pulls the package at launch, which counts as an install and needs an operator yes.

### Discovery Before Invocation

A Code Mode session that loaded the manual runs `list_tools()` or `search_tools("bladebro")`, then `tool_info()` on the match, and calls the `Access as:` form it prints. The live macOS run found `bladebro.bladebro_{act,see,state,run,vision}`. Names can change with the installed version, so they are confirmed in every session rather than hardcoded.

### Synchronous Calls

Code Mode wraps the code in a synchronous function, so a call is written as `return bladebro.bladebro_see({...})`. A call written with `await` failed with `await is only valid in async functions`. Browser work sits in `try/finally` so the stdio process closes.

### Parallel Isolated Sessions

Each MCP server process owns one Bladebro data root. Parallel isolated sessions need one process per `BLADE_HOME` or `BLADE_FRESH=1`. A second manual for that purpose is an operator-approved configuration change, and none is registered.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/mcp-wiring.md` | Shared | The manual, discovery steps and parallel sessions |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/assets/utcp-bladebro-manual.md` | Shared | The registered manual JSON, stated once |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh` | Script | Read-only stdio handshake and manual check |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/mcp-lane/mcp-tools-and-code-mode.md` | Manual playbook | Stdio tool list, Code Mode discovery and one live call |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Recorded discovery output and the synchronous-call finding |

---

## 4. SOURCE METADATA

- Group: Transport
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `transport/mcp-code-mode-lane.md`

Related references:
- [cli-lane-and-output-envelope.md](cli-lane-and-output-envelope.md) - The default CLI transport
