---
title: mcp-notion
description: "Operates a Notion workspace from an agent or Code Mode: the official Notion MCP for all page, block, data-source, comment and user CRUD, plus direct Notion REST API calls for the four capabilities the MCP does not expose and a convention for daily notes, with a knowledge layer and dual-backend routing."
trigger_phrases:
  - "notion"
  - "notion mcp"
  - "notion workspace"
  - "notion database"
  - "notion page"
version: 0.1.5.0
---

# mcp-notion

> Run Notion work from an agent without schema errors, with the official MCP for covered operations and direct API calls for the rest.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Pages, blocks, data sources, comments, users and search in Notion |
| **Invoke with** | "notion", "notion mcp", "notion page" or any Notion keyword |
| **Works on** | A Notion workspace shared with an internal integration token |
| **Produces** | Pages, rows, comments, uploaded files and query results |

### What It Does

This skill runs Notion work through the official Notion MCP server, called from Code Mode with `call_tool_chain({ code })`. The server covers pages, blocks, data sources, comments, users and search in 24 tools. Five capabilities sit outside that surface, and the skill covers them with direct Notion REST calls or, for daily notes, a convention built from MCP calls. A schema reference set sits behind both paths so a property write matches the data source schema.

The MCP transport belongs to `mcp-code-mode`. This skill supplies the Notion operations, the gap calls and the schema knowledge. Application code that reads or writes Notion data is `sk-code`'s work.

### Why This Skill Exists

Notion is cloud-only. There is no filesystem to edit and no daily-driver CLI. An agent that writes a property in the wrong shape gets HTTP 400 `validation_error`, and a burst of calls gets HTTP 429. This skill pairs the MCP with a schema layer so writes validate, and it names the rate limit so a loop backs off instead of failing.

### The Notion Operation Layer

| Capability | What the skill knows how to operate |
|---|---|
| **Pages and blocks** | create, retrieve, update, archive and move pages, then append, update and delete blocks |
| **Data sources** | query, retrieve, create and update data sources, then read database metadata for data-source ids |
| **Schema model** | 22 property types, single and dual relations, rollups and Formulas 2.0 |
| **Tooling gaps** | file uploads, saved views, non-truncated property items and async-task polling through direct REST calls |

---

## 2. QUICK START

**Step 1: Give Code Mode a token.** Create an internal integration in Notion, copy its token (it starts with `ntn_`) and set it under the key `notion_NOTION_TOKEN` in `.env`. The `notion` manual in `.utcp_config.json` reads `NOTION_TOKEN`, and Code Mode fills that value from the prefixed key. Share every page or data source the work touches with the integration, because an unshared object fails with 403 or 404 rather than an empty result.

**Step 2: Check the runtime and the registration.**

```bash
bash .skilled/skills/mcp-tooling/mcp-notion/scripts/doctor.sh
```

Expected output: one `✓` line per passing check. The manual line reads `✓ Code Mode Notion manual registered in .utcp_config.json (official @notionhq/notion-mcp-server, local stdio)`. When the key is missing, the auth line reads `notion_NOTION_TOKEN is not set. Export it before use: export notion_NOTION_TOKEN="ntn_..."`. The script changes nothing and prints no secret.

**Step 3: Confirm the token with a call.**

```typescript
await call_tool_chain({
  code: `return await notion["notion_retrieve-bot-user"]({});`
});
```

Expected output: the bot user object for your integration, which proves the token resolves. Confirm the callable name with `list_tools()` first. Notion tool ids contain hyphens, so bracket access is the safe form until the listing shows the exact identifier.

---

## 3. HOW IT WORKS

A Notion request enters the skill and gets scored against weighted intent signals. A page or block request loads the MCP catalog. A schema or relation request loads the schema references before any write. An upload or view request loads the gap recipes. The router then picks a path and a backend, and the call runs.

```text
        ┌──────────────────────────────┐
        │ Notion request               │
        └───────────────┬──────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Route by intent              │
        └────────┬─────────────┬───────┘
                 │
                 │             └─────────────────────────────────────────────┬
                 ▼                                                           ▼
        ┌──────────────────────────────┐              ┌──────────────────────────────┐
        │ Covered by the MCP?          │              │ Load matched references      │
        └──────┬─────────────────┬─────┘              └──────┬───────────────┬───────┘
          [YES]│             [NO]│                           │               │
               │                 └───────────────────────────┼─────────┬     │
               │          ┬──────────────────────────────────┘         │     │
               ▼          ▼                                            ▼     ▼
        ┌──────────────────────────────┐              ┌──────────────────────────────┐
        │ Call the tool over Code Mode │              │ Call the REST API directly   │
        └──────────────────────────────┘              └──────────────────────────────┘
```

### The Operation Router

The router scores seven intents: `NOTION_PAGES`, `NOTION_DATA`, `NOTION_API_GAP`, `NOTION_KNOWLEDGE`, `NOTION_MIGRATION`, `INSTALL` and `TROUBLESHOOT`. It loads exactly the reference files the winning intent maps to. A prompt that scores nothing returns `UNKNOWN_FALLBACK` with a disambiguation checklist instead of a silent default. The intent weights, the resource map and the two routing decisions are in [`ROUTER.md`](./ROUTER.md).

### The Official MCP Path

The `notion` manual launches `@notionhq/notion-mcp-server` (v2.5.1) over stdio with `npx -y`. Its 24 tools split by domain: 7 pages, 5 blocks, 6 data sources, 2 comments, 3 users and 1 search. Most tools pin `Notion-Version: 2025-09-03`, the version that made data sources the query target. The markdown pair, `retrieve-page-markdown` and `update-page-markdown`, needs `2026-03-11`. The server sources the version per operation, so a mixed workflow needs no global pin.

Two limits shape the work. Search matches titles only, never page content. Pages archive to the trash and have no hard delete.

### The Direct API Path

Five capabilities have no MCP tool: file uploads, saved views, non-truncated page property items, async-task polling and the daily-notes convention. Each direct call carries the same bearer token and a `Notion-Version` header. File uploads need `2026-03-11`. Views and async-task polls need the same version. Page property items work on `2025-09-03`.

Daily notes use no endpoint at all. The convention queries a Daily Notes data source for today's date, then creates the page when the query comes back empty. Direct calls share the MCP rate limit, so a batch loop spaces its requests. The recipes sit in [`references/api-gap-tools.md`](./references/api-gap-tools.md).

### Backend Choice

Notion ships two MCP backends, and the skill picks one by runtime context.

| Backend | Transport and auth | Headless | When to use |
|---|---|---|---|
| **Local stdio** (deprecated) | `npx -y @notionhq/notion-mcp-server`, `NOTION_TOKEN` | Yes | Code Mode and automated sessions |
| **Remote** (recommended by Notion) | `https://mcp.notion.com/mcp`, OAuth in a browser | No | Interactive sessions with a browser |

Code Mode uses the local server because the remote one cannot finish a browser authorization step headless. Notion marks the local server deprecated and still ships it, so plan the move to remote for interactive work. The migration notes sit in [`references/troubleshooting.md`](./references/troubleshooting.md).

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this skill when the request names Notion or one of its surfaces and the work needs a write or a query. A page create with typed properties goes through the MCP. A file upload or a saved view goes through the direct API. A relation or formula write loads the schema references first.

The skill uses only the official server, never a community Notion MCP server. The Notion to Obsidian import itself runs inside the Obsidian desktop app, so this skill owns the read-side inventory and `mcp-obsidian` owns the write side.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Owns the MCP transport. This skill calls its Notion tools through `call_tool_chain()`. |
| `sk-code` | Owns application-code standards and tests for code that reads or writes Notion data. |
| `mcp-click-up` | Structural sibling: a light workflow mode with operation-based routing and, unlike Notion, a daily-driver CLI. |
| `mcp-obsidian` | Migration counterpart: it owns the write-side reconstruction for a Notion to Obsidian import. |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| HTTP 401 `unauthorized` | Token missing, wrong or revoked | Re-copy the `ntn_` token and set `notion_NOTION_TOKEN` in `.env` |
| HTTP 403 on a page you can open | The object is not shared with the integration, or its capabilities are too narrow | Add the integration to the object, or widen its capabilities in the Notion dashboard |
| HTTP 404 `object_not_found` | Wrong id, or the object is not shared | Check the id and share the object with the integration |
| HTTP 429 `rate_limited` or 529 `service_overload` | Over about 3 requests per second, or Notion is overloaded | Honor `Retry-After` and back off with jitter |
| HTTP 400 `validation_error` naming `data_source_id` | A database id was used where the API expects a data-source id | Read the database with `retrieve-a-database` and retry with its data-source id |
| HTTP 400 on a property write | The property type or option does not match the schema | Read the data source with `retrieve-a-data-source` before composing values |
| `list_tools()` shows no `notion.*` entries | The manual did not register, or the token is unset | Run `doctor.sh`, set `notion_NOTION_TOKEN`, then restart the client |

---

## 6. FAQ

### Is there a Notion CLI like ClickUp's `cupt`?

No. Notion has no headless filesystem and no daily-driver CLI, so every operation runs through the MCP over Code Mode or through a direct REST call. `mcp-click-up` adds the `cupt` CLI for daily task work, and this skill has no equivalent.

### Local stdio or remote OAuth: which one should I use?

Use the local stdio server for Code Mode and any automated run, because it authenticates with a static `NOTION_TOKEN` and needs no browser. Use the remote server at `https://mcp.notion.com/mcp` for an interactive session where someone can finish the OAuth step. Notion recommends the remote server and deprecates the local one, so plan that move when the work becomes interactive.

### Why does a page that exists return 403 or 404?

An internal integration sees only what is explicitly shared with it. Open the page or data source in Notion, use the connection menu and add the integration. A 404 often means the same missing share rather than a wrong id, so check the share first.

### Which API version does each call use?

Most MCP tools pin `2025-09-03`. The two markdown tools need `2026-03-11`. File uploads need `2026-03-11`. Views and async-task polls need that version too. Page property items work on either version. The server sets the header per operation, so you never pick one version for the whole workflow.

---

## 7. VERIFICATION

| Check | Result |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/mcp-tooling/mcp-notion/README.md --type readme` prints `✅ VALID` with `Total issues: 0` |
| Runtime and registration | `bash .skilled/skills/mcp-tooling/mcp-notion/scripts/doctor.sh` prints a `✓` line for the platform, Node, npx and the manual, then reports whether `notion_NOTION_TOKEN` is set |
| Tool surface | `list_tools()` lists `notion.notion_*` entries, which confirms the manual is reachable |
| Token and connection | A `call_tool_chain` call to `notion["notion_retrieve-bot-user"]` returns the bot user for your integration |
| Manual scenarios | The 33 scenarios in the [manual testing playbook](./manual-testing-playbook/manual-testing-playbook.md) run read-only or against a scratch workspace |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the two surfaces and the rules the agent follows |
| [`ROUTER.md`](./ROUTER.md) | Machine router: intent signals, resource map and loading levels |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Token setup, Code Mode registration and the dual-backend comparison |
| [`references/mcp-tools.md`](./references/mcp-tools.md) | The 24-tool catalog by domain, the API versions and the Code Mode call pattern |
| [`references/api-gap-tools.md`](./references/api-gap-tools.md) | Direct REST recipes for the five gaps |
| [`references/property-types.md`](./references/property-types.md) | The 22 property types with schema, value, filter and sort shapes |
| [`references/database-model.md`](./references/database-model.md) | The database to data-source hierarchy, relations, rollups and Formulas 2.0 |
| [`references/migration-inventory.md`](./references/migration-inventory.md) | The read-side inventory method for a Notion to Obsidian import |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Error recovery, rate limits, version mismatch and the local-to-remote migration |
| [`scripts/README.md`](./scripts/README.md) | The setup and diagnostic scripts, with their flags |
| [`examples/README.md`](./examples/README.md) | Code Mode workflow examples for common page and data-source work |
| [`mcp-servers/notion-mcp/README.md`](./mcp-servers/notion-mcp/README.md) | Server configuration notes and the deprecation status |
| [`feature-catalog/FEATURE-CATALOG.md`](./feature-catalog/FEATURE-CATALOG.md) | The 29-capability inventory behind the 24 tools and 5 gap fills |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The 33 read-only and scratch-safe test scenarios |
