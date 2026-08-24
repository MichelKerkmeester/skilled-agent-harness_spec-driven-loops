---
title: "notion-mcp"
description: "Vendored install pointer for the official Notion MCP server, launched on demand via npx — nothing to vendor locally, with dual-backend (local stdio vs remote OAuth) notes."
trigger_phrases:
  - "notion mcp server"
  - "notion official mcp"
  - "notion manual"
  - "official notion mcp install"
version: 0.1.0.0
---

# notion-mcp

> Nothing to install here. The official Notion MCP server runs on demand via `npx`, configured entirely in `.utcp_config.json`.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Confirming how the official Notion MCP server is configured. There is no local package to install. |
| **Invoke with** | Code Mode `call_tool_chain({ code: "..." })` once the `notion` manual is registered. |
| **Works on** | `npx -y @notionhq/notion-mcp-server` over stdio (local backend), launched by Code Mode on demand. |
| **Produces** | 24 page, block, data-source, comment, user, and search tools under the `notion.notion_*` namespace once registered. Unregistered in this environment as of 2026-08-21, see Section 4. |

---

## 2. OVERVIEW

### Why This Package Exists

mcp-notion routes Notion page, block, database, comment, user, and search operations to the official Notion MCP server. That server is launched on demand by Code Mode and is not vendored as source in this repository, so `npm install` in this folder does nothing useful. Any `package.json` here is a placeholder that documents that fact for anyone who runs `npm install` by habit.

### What It Does

The `notion` manual registered in `.utcp_config.json` launches `@notionhq/notion-mcp-server` (v2.5.1) over stdio via `npx -y`, authenticated with the `NOTION_TOKEN` environment variable (an internal integration token, prefix `ntn_`). This is not OAuth on the local backend, and there is no browser authorization step.

### Dual Backend: Local stdio vs Remote OAuth

Notion ships two MCP surfaces, and the mode routes between them by runtime context:

| Backend | Endpoint | Auth | When to use |
|---|---|---|---|
| **Local stdio** | `npx -y @notionhq/notion-mcp-server` | `NOTION_TOKEN` env var (no browser step) | Headless / Code Mode / automated sessions. The Code-Mode-compatible path. |
| **Remote MCP** | `https://mcp.notion.com/mcp` (Streamable HTTP) | OAuth (interactive browser authorization) | Interactive sessions where a browser is available; Notion's recommended surface. |

The local stdio backend with `NOTION_TOKEN` is the default for this manual because it is the only headless-compatible path.

### Deprecation Note

Notion is prioritizing the remote MCP and states it "may sunset this local MCP server repository in the future," with issues and pull requests on the open-source repo not actively monitored. The local server remains functional (v2.5.1, published 2026-08-04) but is on a deprecation track. Prefer the remote backend for interactive use, keep the local backend for headless use, and plan migration to remote when the operator moves to OAuth. See `../../references/troubleshooting.md` for the migration path.

---

## 3. QUICK START

**Step 1: Set credentials.** Create an internal integration in the Notion integrations dashboard, copy its token (prefix `ntn_`), and export it as `NOTION_TOKEN` in the environment Code Mode runs in. Share the target pages and databases with that integration in the Notion UI. See the `notion` entry in `.utcp_config.json` for the exact variable name it interpolates.

**Step 2: Confirm registration.**

```typescript
list_tools()
```

Expected: entries prefixed `notion.notion_*`. As of 2026-08-21 this returns none in this environment, see Section 4.

**Step 3: Confirm a callable name before using it.**

```typescript
tool_info("notion.notion_<tool_name>")
```

Never hardcode a tool name without confirming it this way first. Notion tool names contain hyphens (e.g. `create-a-page`), so also confirm the exact callable form (bracket access vs underscore-sanitized). See `../../references/mcp-tools.md` for the 24-tool inventory and the hyphen-handling note.

---

## 4. VERIFICATION

> **Verification status (2026-08-21):** the `notion` manual is not yet registered in this environment. `NOTION_TOKEN` is unset, and a live `list_tools()` call returns zero `notion.*` entries. The 24 tool names in `../../references/mcp-tools.md` were confirmed verbatim against the official README (`https://raw.githubusercontent.com/makenotion/notion-mcp-server/main/README.md`, fetched 2026-08-21) but have not been runtime-reconfirmed through Code Mode. Re-run `list_tools()` / `tool_info()` once the manual is registered before hardcoding any callable.

| Check | Result |
|---|---|
| `list_tools()` shows `notion.*` entries | Confirms the manual is registered and reachable |
| `tool_info("notion.notion_<name>")` resolves | Confirms a specific callable name, hyphen form, and schema before first use |

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Runtime routing between local and remote Notion backends |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | 24-tool inventory, priority table, and Code Mode invocation pattern |
| [`../../references/api-gap-tools.md`](../../references/api-gap-tools.md) | Direct API calls for the 5 uncovered domains (file uploads, views, property items, async tasks, daily notes) |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Rate limits, auth errors, API-version issues, and local-to-remote migration |
