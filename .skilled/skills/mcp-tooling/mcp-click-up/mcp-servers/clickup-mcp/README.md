---
title: "clickup-mcp"
description: "Vendored install pointer for the official ClickUp MCP server, launched on demand via npx, nothing to vendor locally."
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
| **Works on** | `npx -y mcp-remote https://mcp.clickup.com/mcp` over stdio, launched by Code Mode on demand, then one OAuth approval. |
| **Produces** | Task, document, time-tracking and chat tools under the `clickup_official.clickup_official_*` namespace once registered. Registered in this environment on 2026-10-08, see Section 4. |

---

## 2. OVERVIEW

### Why This Package Exists

mcp-click-up routes document, time-tracking, chat and reminder operations, the surfaces `cupt` cannot reach, to the official ClickUp MCP server. That server is launched on demand by Code Mode and is not vendored as source in this repository, so `npm install` in this folder does nothing useful. `package.json` is a placeholder that documents that fact for anyone who runs `npm install` here by habit.

### What It Does

The `clickup_official` manual registered in `.utcp_config.json` launches the hosted ClickUp server at `https://mcp.clickup.com/mcp` over stdio via `npx -y mcp-remote`, and signs in with OAuth. Earlier versions of this document described the npm package `@clickup/mcp-server`, which returned 404 on 2026-10-08.

---

## 3. QUICK START

**Step 1: Sign in.** On the first launch, approve the ClickUp OAuth prompt in the browser. The `clickup_official` entry in `.utcp_config.json` needs no environment variables.

**Step 2: Confirm registration.**

```typescript
list_tools()
```

Expected: entries prefixed `clickup_official.clickup_official_*`. As of 2026-07-10 this returns none in this environment, see Section 4.

**Step 3: Confirm a callable name before using it.**

```typescript
tool_info("clickup_official.clickup_official_<tool_name>")
```

Never hardcode a tool name without confirming it this way first. See `../../references/mcp-tools.md` for the last-captured inventory.

---

## 4. VERIFICATION

> **Verification status (2026-10-08):** the `clickup_official` manual runs the hosted server through `mcp-remote`, after the npm package `@clickup/mcp-server` returned 404 on 2026-07-10 and again on 2026-10-08. The hosted server registered 61 tools on 2026-10-08.

| Check | Result |
|---|---|
| `list_tools()` shows `clickup_official.*` entries | Confirms the manual is registered and reachable |
| `tool_info("clickup_official.clickup_official_<name>")` resolves | Confirms a specific callable name and schema before first use |

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Runtime routing between `cupt` and the official ClickUp MCP |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Last-captured tool inventory and invocation pattern |
| [`../../INSTALL-GUIDE.md`](../../INSTALL-GUIDE.md) | Step-by-step install with validation checkpoints |
