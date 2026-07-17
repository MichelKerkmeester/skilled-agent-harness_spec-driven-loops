---
title: "clickup-mcp"
description: "Vendored install pointer for the official ClickUp MCP server, launched on demand via npx — nothing to vendor locally."
trigger_phrases:
  - "clickup mcp server"
  - "clickup official mcp"
  - "clickup_official manual"
  - "official clickup mcp install"
version: 1.0.0.0
---

# clickup-mcp

> Nothing to install here. The official ClickUp MCP server runs on demand via `npx`, configured entirely in `.utcp_config.json`.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Confirming how the official ClickUp MCP server is configured. There is no local package to install. |
| **Invoke with** | Code Mode `call_tool_chain({ code: "..." })` once the `clickup_official` manual is registered. |
| **Works on** | `npx -y @clickup/mcp-server` over stdio, launched by Code Mode on demand. |
| **Produces** | Task, document, time-tracking and chat tools under the `clickup_official.clickup_official_*` namespace once registered. Unregistered in this environment as of 2026-07-10, see Section 4. |

---

## 2. OVERVIEW

### Why This Package Exists

mcp-click-up routes document, time-tracking, chat and reminder operations, the surfaces `cupt` cannot reach, to the official ClickUp MCP server. That server is launched on demand by Code Mode and is not vendored as source in this repository, so `npm install` in this folder does nothing useful. `package.json` is a placeholder that documents that fact for anyone who runs `npm install` here by habit.

### What It Does

The `clickup_official` manual registered in `.utcp_config.json` launches `@clickup/mcp-server` over stdio via `npx -y`, authenticated with `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` environment variables. This is not OAuth, and not the hosted `https://mcp.clickup.com/mcp` server that earlier versions of this document described.

---

## 3. QUICK START

**Step 1: Set credentials.** Export `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` in the environment Code Mode runs in. See the `clickup_official` entry in `.utcp_config.json` for the exact variable names it interpolates.

**Step 2: Confirm registration.**

```typescript
list_tools()
```

Expected: entries prefixed `clickup_official.clickup_official_*`. As of 2026-07-10 this returns none in this environment, see Section 4.

**Step 3: Confirm a callable name before using it.**

```typescript
tool_info("clickup_official.clickup_official_<tool_name>")
```

Never hardcode a tool name without confirming it this way first. See `../../references/mcp_tools.md` for the last-captured inventory.

---

## 4. VERIFICATION

> **Verification status (2026-07-10):** the `clickup_official` manual is currently unregistered in this environment. No `CLICKUP_API_KEY`/`CLICKUP_TEAM_ID` are set, and a live `list_tools()` call returns zero `clickup_official.*` entries. Separately, the npm package name configured in `.utcp_config.json` (`@clickup/mcp-server`) returned `404 Not Found` on the public npm registry when checked directly. A real, differently-named ClickUp MCP server package does exist on npm (for example `@taazkareem/clickup-mcp-server`), but reconciling the configured package name is an infrastructure change outside this document's scope.

| Check | Result |
|---|---|
| `list_tools()` shows `clickup_official.*` entries | Confirms the manual is registered and reachable |
| `tool_info("clickup_official.clickup_official_<name>")` resolves | Confirms a specific callable name and schema before first use |

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Runtime routing between `cupt` and the official ClickUp MCP |
| [`../../references/mcp_tools.md`](../../references/mcp_tools.md) | Last-captured tool inventory and invocation pattern |
| [`../../references/INSTALL-GUIDE.md`](../../references/INSTALL-GUIDE.md) | Step-by-step install with validation checkpoints |
