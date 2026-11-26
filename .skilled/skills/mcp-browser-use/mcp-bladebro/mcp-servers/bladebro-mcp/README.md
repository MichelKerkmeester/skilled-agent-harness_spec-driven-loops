---
title: "bladebro-mcp"
description: "Setup pointer for the Bladebro MCP server (bladebro mcp, local stdio) and the registered bladebro Code Mode manual, with the discovery steps and the synchronous-call rule."
trigger_phrases:
  - "bladebro mcp server"
  - "bladebro utcp manual"
  - "bladebro code mode setup"
  - "register bladebro mcp"
version: 1.0.1.0
---

# bladebro-mcp

> Nothing to install here. The Bladebro MCP server is built into the `bladebro` binary and launched on demand as `bladebro mcp` over stdio. The `bladebro` manual is already registered in `.utcp_config.json`, so verify it rather than adding it again.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Reaching the five Bladebro tools from Code Mode when the CLI is unavailable, or when browser work chains with other Code Mode tools or needs parallel isolated sessions. |
| **Invoke with** | `call_tool_chain()` with a synchronous call such as `return bladebro.bladebro_see({...})`, after discovery confirms the name. |
| **Works on** | `bladebro mcp` over local stdio, spawned by the client from the installed binary; no URL, port or credential. |
| **Produces** | A runtime-discovered tool surface: `act`, `see`, `state`, `run` and `vision`, the same handlers the CLI calls. |

### Why This Package Exists

mcp-bladebro routes composition work through the Bladebro MCP server. That server is not vendored source: it ships inside the `bladebro` binary, which [`../bladebro-cli/README.md`](../bladebro-cli/README.md) installs. The packet states the registered manual's JSON in one place, [`assets/utcp-bladebro-manual.md`](../../assets/utcp-bladebro-manual.md), and this folder links there instead of copying it.

### What It Does

The registered manual is a stdio server that runs `bladebro mcp` with an empty `env`, because the server needs no credential. `BLADE_HOME` or `BLADE_FRESH` go in that `env` only for a task that needs an isolated data root, as a reviewed configuration change. Launching through `npx -y bladebro@4.8.2 mcp` instead pulls the package at launch, which counts as an install and needs an operator yes.

---

## 2. VERIFY AND DISCOVER

**Step 1: Confirm the registration.** The command must print exactly the object in the asset.

```bash
jq '.manual_call_templates[] | select(.name == "bladebro")' .utcp_config.json
```

**Step 2: Probe the server over stdio.** The packet's read-only doctor sends `initialize` and `tools/list`, expects the five tools and closes the process: `bash ../../scripts/doctor.sh`.

**Step 3: Discover in Code Mode.** In a session that loaded the manual, run `list_tools()` or `search_tools("bladebro")`, then `tool_info()` on the match, and use the `Access as:` form it prints. The live macOS run found `bladebro.bladebro_{act,see,state,run,vision}`. Names can change with the installed version, so confirm them in every session.

**Step 4: Call synchronously.** Code Mode wraps the code in a synchronous function, so write `return bladebro.bladebro_see({ mode: 'content', url: 'https://example.com' })`. A call written with `await` fails with `await is only valid in async functions`. Wrap browser work in `try/finally` so the stdio process closes.

---

## 3. PARALLEL ISOLATED SESSIONS

Each MCP server process owns one Bladebro data root. Parallel isolated sessions need one process per `BLADE_HOME` or `BLADE_FRESH=1`. A second manual for that purpose is a configuration change the operator approves, and none is registered.

---

## 4. RELATED DOCUMENTS

- [`../../references/mcp-wiring.md`](../../references/mcp-wiring.md): when the MCP lane applies and the discovery steps
- [`../../assets/utcp-bladebro-manual.md`](../../assets/utcp-bladebro-manual.md): the registered manual JSON and its checks
- [`../../scripts/doctor.sh`](../../scripts/doctor.sh): the read-only stdio handshake and manual check
- [`../bladebro-cli/README.md`](../bladebro-cli/README.md): installing the binary that hosts this server
- Upstream: `https://github.com/dondai44423/bladebro` (`docs/setup.md`, MCP section)
