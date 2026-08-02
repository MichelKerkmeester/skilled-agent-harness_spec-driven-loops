---
title: "obsidian-mcp"
description: "Config-only install pointer for the Obsidian MCP server (cyanheads obsidian-mcp-server), launched on demand via npx — nothing to vendor locally."
trigger_phrases:
  - "obsidian mcp server"
  - "obsidian-mcp-server install"
  - "obsidian manual"
  - "official obsidian mcp install"
version: 1.0.0.0
---

# obsidian-mcp

> Nothing to install here. The Obsidian MCP server runs on demand via `npx`, configured entirely in `.utcp_config.json`.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Confirming how the Obsidian MCP server is configured. There is no local package to install. |
| **Invoke with** | Code Mode `call_tool_chain({ code: "..." })` once the `obsidian` manual is registered. |
| **Works on** | `npx -y obsidian-mcp-server@latest` (cyanheads, v3.2.9) over stdio, launched by Code Mode on demand. |
| **Produces** | Note, search and tag tools under the `obsidian.obsidian_*` namespace once registered. Registered by a later phase, see Section 4. |

---

## 2. OVERVIEW

### Why This Package Exists

mcp-obsidian routes app-backed vault operations — reading, writing, searching and tagging notes against a live Obsidian instance — to the `obsidian-mcp-server` MCP server. That server is launched on demand by Code Mode and is not vendored as source in this repository, so `npm install` in this folder does nothing useful. `package.json` is a placeholder that documents that fact for anyone who runs `npm install` here by habit.

### What It Does

The default server is **`obsidian-mcp-server`** (cyanheads, npm **v3.2.9**). The `obsidian` manual registered in `.utcp_config.json` launches it over **stdio** via `npx -y obsidian-mcp-server@latest`. It talks to Obsidian through the **Local REST API** community plugin, so it needs:

- Obsidian **Local REST API plugin v4.0.0+** enabled, with an API key generated
- A **running Obsidian app** (the plugin serves the REST API from inside it)

It reads three environment variables (interpolated by the manual, see Section 3):

| Variable | Required | Default |
|---|---|---|
| `OBSIDIAN_API_KEY` | Yes | — (Local REST API bearer token) |
| `OBSIDIAN_BASE_URL` | No | `http://127.0.0.1:27123` |
| `OBSIDIAN_VERIFY_SSL` | No | `false` |

It exposes 14 `obsidian_*` tools, including `obsidian_get_note`, `obsidian_write_note`, `obsidian_search_notes`, `obsidian_manage_tags`, and `obsidian_delete_note`.

### Headless Alternative

For filesystem-based access with **no running app and no token**, the headless alternative is **`obsidian-mcp`** (StevenStavrakis, npm **v1.0.6**). It operates on the vault filesystem directly rather than through the Local REST API. Confirm its no-app / no-token behavior before asserting it in a given environment (mark `VERIFY` if unconfirmed).

---

## 3. QUICK START

**Step 1: Prepare the app.** In Obsidian, install and enable the **Local REST API** plugin (v4.0.0+), generate an API key, and keep the app running. Note the base URL (default `http://127.0.0.1:27123`).

**Step 2: Set credentials.** The `.env.example` at the repo root documents the keys the `obsidian` manual interpolates (the `obsidian_` prefix matches the manual name):

```bash
obsidian_OBSIDIAN_API_KEY=          # Local REST API bearer token
obsidian_OBSIDIAN_BASE_URL=http://127.0.0.1:27123
obsidian_OBSIDIAN_VERIFY_SSL=false
```

**Step 3: Confirm registration.** The `obsidian` manual is registered in `.utcp_config.json` by a later phase — this folder does not edit that file. Once registered:

```typescript
list_tools()
```

Expected: entries prefixed `obsidian.obsidian_*`.

**Step 4: Confirm a callable name before using it.**

```typescript
tool_info("obsidian.obsidian_<tool_name>")
```

Never hardcode a tool name without confirming it this way first. See `../../references/mcp-tools.md` for the last-captured inventory.

---

## 4. VERIFICATION

> **Registration note:** the `obsidian` manual is registered in `.utcp_config.json` by a later gated phase, not by this folder. For reference, the manual it registers is:

```json
{
  "name": "obsidian",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "obsidian": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "obsidian-mcp-server@latest"],
        "env": {
          "OBSIDIAN_API_KEY": "${obsidian_OBSIDIAN_API_KEY}",
          "OBSIDIAN_BASE_URL": "${obsidian_OBSIDIAN_BASE_URL}",
          "OBSIDIAN_VERIFY_SSL": "${obsidian_OBSIDIAN_VERIFY_SSL}"
        }
      }
    }
  }
}
```

| Check | Result |
|---|---|
| `list_tools()` shows `obsidian.*` entries | Confirms the manual is registered and reachable |
| `tool_info("obsidian.obsidian_<name>")` resolves | Confirms a specific callable name and schema before first use |
| Local REST API reachable at `OBSIDIAN_BASE_URL` | Confirms the running app + plugin serve the API the server calls |

Tools are called via Code Mode `call_tool_chain` as `obsidian.obsidian_<tool>`.

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Runtime routing between the CLI profiles and the Obsidian MCP |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Last-captured tool inventory and invocation pattern |
| [`../../INSTALL-GUIDE.md`](../../INSTALL-GUIDE.md) | Step-by-step install with validation checkpoints |
