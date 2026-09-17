---
title: "Hermes MCP Policy"
description: "How MCP servers reach a Hermes session: user-level configuration through hermes mcp add, the code-mode stdio launcher, deny-by-default per tool, and what a dispatch may and may not assume."
trigger_phrases:
  - "hermes mcp"
  - "hermes mcp add"
  - "hermes mcp deny by default"
  - "hermes code mode server"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Hermes MCP Policy

Hermes hosts MCP servers, but only from the operator's configuration. This is a structural difference from every sibling runtime, which registers servers in a repo dotfolder.

## 1. OVERVIEW

MCP servers reach a Hermes session only from the operator's user-level configuration; this reference records that boundary, the one operator step, the deny-by-default posture and what a dispatch may assume.

---

## 2. WHERE MCP LIVES

`mcp_servers:` is read from `~/.hermes/config.yaml` only (source-read: `hermes_cli/mcp_config.py`). `hermes mcp add|remove|list|test|configure` manage it; `hermes tools list|disable|enable` toggle tools with `server:tool` notation. `--safe-mode` disables all MCP servers for a run, and the `chat` path waits for MCP cold start before its first tool snapshot, so a configured server adds startup latency to every dispatch.

---

## 3. THE OPERATOR STEP

To reach the repo's code-mode server from Hermes, the operator runs, once:

```bash
printf 'Y\n' | hermes mcp add code_mode --command node --env UTCP_CONFIG_FILE=.utcp_config.json --args .skilled/bin/mcp-code-mode-launcher.cjs
hermes mcp list
```

Observed 2026-09-14: `--args` must be the last option, the command connects and discovers seven tools, and the "Enable all tools?" prompt needs an answer on stdin (a closed stdin cancels the add). A dispatch never runs these. A session reaches the server only when its name appears in the `-t` list (`-t search,todo,code_mode`).

---

## 4. DENY BY DEFAULT

After adding a server, disable every tool and enable the few a task needs:

```bash
hermes tools disable code_mode
hermes tools enable code_mode:search_tools code_mode:call_tool_chain
```

Pre-spawn security filters drop configurations shaped like exfiltration; OAuth device flow covers remote servers. `hermes mcp serve` (Hermes as an MCP server) has no consumer in this repo and is not part of this policy.

---

## 5. WHAT A DISPATCH MAY ASSUME

Nothing about MCP unless `hermes mcp list` shows the server. A prompt that needs a tool from a server checks the list first, and stops with a report if the server is absent. The packet's hard rule `mcp-config-operator-required` states this boundary.
