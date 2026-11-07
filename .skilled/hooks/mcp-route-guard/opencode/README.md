---
title: "MCP Route Guard: OpenCode Plugin Link"
description: "Browsability link to the real OpenCode plugin, which evaluates native MCP calls on tool.execute.before and writes a routing advisory to a bounded log."
trigger_phrases:
  - "opencode mcp route guard"
  - "opencode routing advisory"
  - "opencode plugin link"
version: 1.0.0.0
---

# MCP Route Guard: OpenCode Plugin Link

---

## 1. OVERVIEW

`opencode/` holds one relative symlink. `mcp-route-guard.js` points to `../../../../.opencode/plugins/mcp-route-guard.js`, and OpenCode loads the real plugin from that folder through its flat plugin glob. Nothing loads through this link, it exists so the concern tree shows every runtime. The plugin runs on `tool.execute.before`, calls the same `../lib/mcp-route-guard.cjs` core, and appends a routing advisory to a bounded rotated log. It never writes to the console because the OpenCode TUI paints console output onto the prompt line.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`mcp-route-guard.js`](./mcp-route-guard.js) | Symlink, `tool.execute.before` | Points at `.opencode/plugins/mcp-route-guard.js`. The target evaluates a native MCP call and records the core's advisory in the plugin log. | Fails open. The target never throws and never writes stdout or stderr. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../../../../.opencode/plugins/mcp-route-guard.js`](../../../../.opencode/plugins/mcp-route-guard.js): the real plugin.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core behind the plugin.
