---
title: mcp-notion
description: Operates a Notion workspace from an agent or Code Mode: the official Notion MCP for all page, block, data-source, comment and user CRUD, plus direct Notion REST API calls for the five capabilities the MCP does not expose, with a knowledge layer and dual-backend routing.
trigger_phrases:
  - "notion"
  - "notion mcp"
  - "notion workspace"
  - "notion database"
  - "notion page"
version: 0.1.0.0
---

# mcp-notion

> Notion is a cloud workspace with no headless CLI and no plugin ecosystem. This skill makes it safe to drive from an agent: the official Notion MCP for every CRUD operation, direct Notion REST API calls for the five gaps the MCP leaves open, and a knowledge layer for Notion's relational and computed model.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Notion page, block, data-source, comment, user and search operations through the official MCP, plus file uploads, views, non-truncated property items, async-task polling and daily-note conventions through direct API calls |
| **Invoke with** | "notion", "notion mcp", "notion workspace", "notion database", "notion page" or auto-routing on Notion keywords |
| **Works on** | Any Notion workspace shared with an internal integration; the local stdio MCP server via `NOTION_TOKEN` for headless and Code Mode work, the remote OAuth MCP for interactive sessions |
| **Produces** | Created and updated pages, filtered data-source queries, appended blocks, comments and gap operations through one MCP path and one direct-API path |

---

## 2. OVERVIEW

### Why This Skill Exists

Notion is cloud-only. There is no headless filesystem to edit, no third-party plugin ecosystem to wrap, and no daily-driver CLI equivalent to ClickUp's `cupt`. The official Notion MCP covers every CRUD operation across pages, blocks, data sources, comments and users in 24 tools, but it leaves five capabilities unexposed and it does nothing to protect an agent from Notion's relational and computed model. A blind property write against a mismatched schema fails validation, and a burst of calls trips the 3-requests-per-second rate limit. A thin transport cannot fill the five gaps or route between Notion's two server backends, and Notion's lack of a plugin layer makes a full file-layer skill unnecessary. So this skill is a light workflow mode: the MCP for what it covers, direct API calls for what it does not, and a knowledge layer so both paths write correct data.

### What It Does

This skill drives Notion through two complementary paths. The official Notion MCP handles all CRUD through Code Mode: page create, retrieve, update, archive, move and markdown round-trip; block read, append, update and delete; data-source query, retrieve, update and create; comments, users and search. Direct Notion REST API calls fill the five capabilities the MCP does not expose. An operation-based routing rule picks the path for the work at hand, and a knowledge layer supplies the hierarchy, property-type and relational semantics that keep every write valid. A page create never bypasses the schema. A file upload never fails because the MCP has no tool for it.

The MCP transport is owned by `mcp-code-mode`. This skill consumes Code Mode as a provider. It does not implement the transport. For the generated application code that integrates Notion, `sk-code` owns the standards and tests.

### The Notion Operation Layer

| Capability | What the skill knows how to operate |
|---|---|
| **Pages and blocks** | create, retrieve, update, archive and move pages, append, update and delete blocks, and round-trip page content as Markdown through the official MCP |
| **Databases and data sources** | query, retrieve, update and create data sources under the API 2.0 data-source model, and read database metadata for data-source IDs |
| **Relational and computed model** | operate 22 property types, single and dual relations, rollups (14 functions) and Formulas 2.0 (about 50 functions) with correct schema, value, filter and sort semantics |
| **Tooling gaps** | perform file uploads, view operations, non-truncated property-item reads and async-task polling through direct Notion REST API calls |

---

## 3. QUICK START

**Step 1: Provide the integration token.**

The Code Mode registration already exists. The `notion` manual is defined in `.utcp_config.json` (stdio, `npx -y @notionhq/notion-mcp-server`, `NOTION_TOKEN` from `${notion_NOTION_TOKEN}`), and `.env.example` carries the `notion_NOTION_TOKEN=` line. Create an internal integration in Notion, copy its token (it starts with `ntn_`), and set it in `.env`:

```bash
# .env
notion_NOTION_TOKEN=ntn_YOUR_INTEGRATION_TOKEN_HERE
```

**Step 2: Share the pages and databases the integration needs.**

An internal integration sees only what is explicitly shared with it. In Notion, open each page or database, use the connection menu and add your integration. A page that is not shared returns HTTP 403, not an empty result.

**Step 3: Call through Code Mode.**

Code Mode servers are configured in `.utcp_config.json`, not `opencode.json` (that file is for native, non-Code-Mode MCP tools). The Notion manual is `notion`, launched over stdio and authenticated with the `NOTION_TOKEN` env var, so run operations inside `call_tool_chain({ code })`:

```typescript
call_tool_chain({
  code: `
    // Tool naming follows notion.notion_{tool_name}. The underlying MCP tool ids are
    // hyphenated (retrieve-a-page, create-a-page, query-data-source, ...). Confirm the
    // exact callable form with list_tools()/tool_info() before calling — never guess.
    const me = await notion.notion_retrieve_bot_user({})
    return me
  `
})
// Expected: the bot user identity for your integration (confirms the token works)
```

The local stdio server runs headless with `NOTION_TOKEN`, which is why Code Mode uses it. The remote OAuth server at `mcp.notion.com` cannot run headless. Restart your AI client after editing `.env`.

---

## 4. HOW IT WORKS

### The Operation Router

The skill reads your request, scores it against weighted intent signals and loads only the reference files relevant to the chosen path. A keyword such as "page", "block", "query" or "comment" routes to an official MCP tool. A keyword such as "upload", "view", "property item" or "task status" routes to a direct API gap call. A schema, relation, rollup or formula question loads the knowledge-layer references before any write. If the token is missing or the backend is unclear, the router loads the install guide first.

### The Official MCP Path

The official server is `@notionhq/notion-mcp-server` (v2.5.1, 24 tools), registered through Code Mode: `.utcp_config.json` defines the `notion` manual, launched over stdio via `npx -y @notionhq/notion-mcp-server` and authenticated with the `NOTION_TOKEN` env var. The 24 tools span six domains: pages (7), blocks (5), databases and data sources (6), comments (2), users (3) and search (1). You reach them through Code Mode with `call_tool_chain({ code: "..." })`. The callable form follows `notion.notion_{tool_name}`, but the underlying tool ids are hyphenated (`retrieve-a-page`, `create-a-page`, `query-data-source`), so always confirm the exact name with `list_tools()`/`tool_info()` before calling. Do not guess it from the tool's description.

Notion API 2.0 migrated to **data sources** as the primary abstraction that replaced "databases": query a data source with `query-data-source`, not a removed database-query tool. Most tools pin API version `2025-09-03`; the two markdown round-trip tools (`retrieve-page-markdown`, `update-page-markdown`) require `2026-03-11`. The server sources the `Notion-Version` header per operation, so a mixed workflow does not need a single global version.

### The Direct API Path

Five capabilities are not exposed by the MCP and are filled with direct Notion REST API calls: **file uploads** (five upload endpoints), **views** (view create, update, delete and query), **non-truncated page property items** (`GET /v1/pages/{page_id}/properties/{property_id}` for values the page object truncates), **async-task polling** (for long-running operations such as duplicate-page) and **daily notes** (a knowledge-layer convention, not a single endpoint). These calls use the same `Authorization: Bearer {token}` header and a `Notion-Version` header, and they obey the same rate limit as the MCP path.

### The Knowledge Layer

Operating Notion safely means encoding its model. Three pillars: the **database to data-source to page hierarchy**; the **22 property types** with their schema, value, filter and sort semantics; and the **relational and computed model** of single and dual relations, rollups (14 functions) and Formulas 2.0 (about 50 functions). Read the knowledge-layer references before authoring a property write, a relation or a rollup, so the write passes Notion's server-side validation the first time.

### Dual-Backend Routing

Notion ships two MCP backends, and the mode routes between them by runtime context.

| Backend | Transport and auth | Headless | Use when |
|---|---|---|---|
| **Local stdio** (deprecated) | `npx @notionhq/notion-mcp-server`, `NOTION_TOKEN` bearer token | Yes | Headless work and Code Mode |
| **Remote** (recommended) | `mcp.notion.com`, OAuth 2.0 with PKCE | No, interactive only | Interactive sessions with a browser |

Code Mode uses the local stdio server, because the remote OAuth server cannot complete its browser authorization step in a headless context. The local server is deprecated but still functional; treat that as a known risk to plan a migration around, not a wrong choice for headless automation.

### Agent Safety Invariants

Always share a page or database with the integration before operating on it. An unshared target returns HTTP 403, and a missing share is the single most common cause of "not found" confusion. Always respect the rate limit: about 3 requests per second per integration, with bursts allowed. On HTTP 429 (`rate_limited`) or 529 (`service_overload`), honor the `Retry-After` header and back off with jitter; centralize retries in the HTTP layer, not per tool. Always let the server pin the API version per operation, and never hardcode a single version across markdown and non-markdown tools. Treat tokens as opaque strings; do not validate them with a regex. Never auto-modify `opencode.json`, the Code Mode config lives in `.utcp_config.json`. Confirm every tool name with `tool_info()`; never guess it. An empty `search` result is valid and common, do not fabricate pages.

### Preflight Check

Start every Notion session by confirming the token resolves and the integration is authenticated.

```typescript
call_tool_chain({
  code: `
    const me = await notion.notion_retrieve_bot_user({})
    return me   // Expected: bot user identity — the token and connection work
  `
})
```

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this skill when you need to create, read, update or organize Notion pages, blocks, data sources, comments or users from an agent. Reach for the official MCP path for any CRUD operation in its six domains. Reach for the direct API path when the work is a file upload, a view operation, a non-truncated property read or an async-task poll. Reach for the knowledge-layer references before authoring any property, relation, rollup or formula write.

The MCP path and the direct API path cover different operation sets by design. Neither is a drop-in for the other. For "create a page" or "query this database with a filter", the official MCP is the right answer. For "upload this file to a page" or "read the full multi-select values that got truncated", only a direct API call will work.

This skill uses only Notion's official MCP server (`@notionhq/notion-mcp-server`, launched over stdio). It never reaches for a community MCP server. The MCP transport and the `call_tool_chain()` invocation are owned by `mcp-code-mode`. This skill orchestrates the Notion surface. It does not implement the transport.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Owns the MCP transport. This skill consumes Code Mode as a provider and calls Notion tools through `call_tool_chain()`. |
| `sk-code` | Owns application-code standards and tests. This skill operates on Notion data that sk-code may produce or consume. |
| `mcp-click-up` | Structural sibling. Both skills own a light workflow orchestrator with operation-based routing; Notion is MCP-only with no CLI, where ClickUp adds the `cupt` CLI. |
| `mcp-obsidian` | Migration counterpart. This skill's knowledge layer reads a live Notion workspace's structure to drive a Notion-to-Obsidian import. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| HTTP 401 `unauthorized` | Token missing, wrong or revoked | Re-copy the `ntn_` token from Notion settings and set `notion_NOTION_TOKEN` in `.env` |
| HTTP 403 on a real page | The page is not shared with the integration | Open the page, use the connection menu and add the integration |
| HTTP 404 `object_not_found` | Wrong ID, or the object is not shared with the integration | Verify the page or database ID and confirm it is shared |
| HTTP 429 `rate_limited` | Over the ~3 requests/second per-integration limit | Honor the `Retry-After` header and back off with jitter |
| HTTP 529 `service_overload` | Notion is overloaded | Retry with the same backoff as a 429 |
| HTTP 400 `validation_error` | Property schema or formula value is invalid | Read the data-source schema first; check property types and formula syntax |
| MCP: connection refused | `notion` manual missing, or `npx` / `NOTION_TOKEN` unavailable | Fix the manual in `.utcp_config.json`, verify `npx -y @notionhq/notion-mcp-server`, set `notion_NOTION_TOKEN` |
| MCP: tool not found | Wrong tool name, or version drift | Confirm with `list_tools()`/`tool_info()`; the callable form is `notion.notion_{tool_name}` |

---

## 7. FAQ

**Q: Is there a Notion CLI like ClickUp's `cupt`?**

A: No. Notion is cloud-only with no headless filesystem and no daily-driver CLI equivalent, so this mode is MCP-only. Every operation runs through the official MCP over Code Mode, with direct Notion REST API calls filling the five gaps the MCP does not expose. That is the deliberate difference from `mcp-click-up`, which adds the `cupt` CLI for daily task operations.

**Q: Local stdio server or remote OAuth server: which do I use?**

A: Use the local stdio server for headless and Code Mode work; it authenticates with a static `NOTION_TOKEN` and needs no browser. Use the remote OAuth server at `mcp.notion.com` for interactive sessions where a human can complete the OAuth flow. Code Mode runs headless, so it uses the local server. The local server is deprecated but still functional: plan a migration to remote for interactive use, and keep local for automation until a headless remote path exists.

**Q: My page or database returns 403 or "not found" even though it exists. Why?**

A: An internal integration sees only what is explicitly shared with it. Open the page or database in Notion, use the connection menu and add your integration. Sharing a parent page does not always cascade: share the specific object the call targets.

**Q: My `search` came back empty. Is that an error?**

A: No. An empty `search` result is valid, and `search` matches titles only, not full page content. Before you escalate, confirm the target is shared with the integration and that you are searching a title fragment. If the object is genuinely absent from the shared set, report it clearly and do not fabricate pages.

**Q: Which Notion API version does the mode use?**

A: Most tools pin `2025-09-03`, the version that introduced data sources. The two markdown round-trip tools require `2026-03-11`. The local server sources the `Notion-Version` header per operation, so you do not set one global version, let the server pin it.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/mcp-tooling/mcp-notion/README.md --type readme` reports zero issues |
| Install guide structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/mcp-tooling/mcp-notion/INSTALL-GUIDE.md --type install_guide` reports zero issues |
| Token and connection | A `call_tool_chain(...)` call to `notion.notion_retrieve_bot_user` returns the bot identity for your integration |
| MCP health | Confirm the `notion` tools appear in `list_tools()` and a `notion.notion_retrieve-a-database` call via `call_tool_chain(...)` returns database metadata for a shared database |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the operation router, dual-backend routing and the full agent safety invariants |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Step-by-step setup for `NOTION_TOKEN`, the Code Mode registration and the dual-backend config with validation checkpoints |
| [`references/mcp-tools.md`](./references/mcp-tools.md) | The 24-tool official MCP catalog by domain, with `call_tool_chain()` invocation |
| [`references/api-gap-tools.md`](./references/api-gap-tools.md) | Direct Notion REST API calls for the five gap capabilities the MCP does not expose |
| [`references/property-types.md`](./references/property-types.md) | The 22 property types with schema, value, filter and sort semantics |
| [`references/database-model.md`](./references/database-model.md) | The database, data-source and page hierarchy, relations, rollups (14 functions) and Formulas 2.0 |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Error reference and recovery for auth, sharing, rate limits, API version and the local-server deprecation migration |
