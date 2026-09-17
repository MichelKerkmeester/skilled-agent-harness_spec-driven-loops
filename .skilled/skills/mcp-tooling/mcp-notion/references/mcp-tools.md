---
title: "Official Notion MCP Tools Reference"
description: "Reference for the official Notion MCP server (@notionhq/notion-mcp-server v2.5.1): the 24-tool catalog across 6 API domains, priority table, Code Mode invocation pattern, and the 5 uncovered domains that route to direct API calls."
trigger_phrases:
  - "notion mcp"
  - "notion tools"
  - "notion page"
  - "notion database"
  - "notion data source"
  - "notion markdown"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# Official Notion MCP Tools Reference

**MCP Server:** `notion` manual — the `@notionhq/notion-mcp-server` package (v2.5.1, published 2026-08-04) launched over stdio via `npx -y @notionhq/notion-mcp-server`, registered as a Code Mode manual in `.utcp_config.json`. This is the local open-source server, not the hosted `https://mcp.notion.com/mcp` OAuth server; the dual-backend split is documented in `../mcp-servers/notion-mcp/README.md`.
**Auth:** `NOTION_TOKEN` environment variable (an internal integration token, prefix `ntn_`), interpolated into `.utcp_config.json`. Not OAuth — there is no browser authorization step on the local stdio backend.
**Invocation:** Code Mode `call_tool_chain({ code: "..." })` via `mcp__code_mode__call_tool_chain` — a single TypeScript code string with direct access to registered tools as hierarchical functions, not an array of `{tool, input}` records.
**Tool naming:** Code Mode namespaces every registered tool as `<manual_name>.<manual_name>_<tool_name>`. For this manual the pattern is `notion.notion_<tool_name>`. Notion tool names contain hyphens (e.g. `create-a-page`), which are not valid JavaScript dot-identifiers — see the invocation note in Section 8 about hyphen handling. Do not guess a tool name or its exact callable form — confirm each with `tool_info()`/`list_tools()` before calling.

> **Verification status (2026-08-21):** the 24 tool names below were confirmed verbatim against the official README (`https://raw.githubusercontent.com/makenotion/notion-mcp-server/main/README.md`, fetched 2026-08-21). The `notion` manual is NOT yet registered in this environment — `NOTION_TOKEN` is unset and `list_tools()` returns zero `notion.*` entries — so no name here has been live-reconfirmed through Code Mode. Treat the tool set as source-confirmed but not runtime-confirmed: re-run `list_tools()` / `tool_info("notion.notion_<name>")` once the manual is registered before hardcoding any callable. The README's prose still states "Total tools now: 22 (was 19 in v1.x)" — that count predates the two markdown tools (`retrieve-page-markdown`, `update-page-markdown`) added in a later minor release; the actual tools table lists 24, matching a third-party benchmark that counted "24 tools (one per endpoint)".

---

## 1. OVERVIEW

The official Notion MCP server exposes **24 tools across 6 API domains** — one tool per Notion REST endpoint, generated from the Notion OpenAPI spec. It mutates the Notion workspace (creates pages, manages data sources, appends content), so mcp-notion is a light **workflow** mode, not a read-only transport.

The 6 covered domains are: **Pages (7), Blocks (5), Databases / Data Sources (6), Comments (2), Users (3), Search (1)**.

Use this reference when:
- Routing a Notion request to a specific MCP tool (see the priority table in Section 6 and the operation table in the mode `SKILL.md`).
- Writing Code Mode `call_tool_chain({ code: "..." })` invocations against the `notion` manual.
- Confirming whether a capability is covered by the MCP or falls into one of the 5 uncovered domains that require direct API calls (Section 7 → `api-gap-tools.md`).

---

## 2. PREREQUISITES

- Code Mode MCP configured, with the `notion` manual in `.utcp_config.json` (not `opencode.json`, `.mcp.json`, or `claude_desktop_config.json` — those hold native, non-Code-Mode MCP tools).
- `NOTION_TOKEN` set in the environment Code Mode runs in — an internal integration token (prefix `ntn_`) created in the Notion integrations dashboard, with the target pages/databases shared to that integration.
- AI client restarted after the config change.
- Node.js 18+ and `npx` available (the manual launches `@notionhq/notion-mcp-server` on demand via `npx -y`).

See the mode `INSTALL-GUIDE.md` and `../mcp-servers/notion-mcp/README.md` for the dual-backend (local stdio vs remote OAuth) configuration.

---

## 3. AUTHENTICATION

`NOTION_TOKEN` (an internal integration token, prefix `ntn_`) is interpolated into `.utcp_config.json` for the `notion` manual. Not OAuth — the local stdio backend has no browser authorization step. Each integration only sees pages and databases that have been explicitly shared with it in the Notion UI; a `restricted_resource` / 404 usually means the page was never shared with the integration, not that it does not exist.

The remote backend (`https://mcp.notion.com/mcp`) uses OAuth instead and is interactive-only — see the server README for when to route to it.

---

## 4. API VERSION PINNING

The server sources the `Notion-Version` header per-operation from the OpenAPI spec:

| API version | Tools that use it |
|---|---|
| `2025-09-03` | The 22 non-markdown tools (all Pages except the two markdown tools, all Blocks, all Data Sources, Comments, Users, Search). This version introduced **data sources** as the primary database abstraction (v2.0.0 breaking change: `data_source_id` replaces `database_id` for query/update/create). |
| `2026-03-11` | `retrieve-page-markdown` and `update-page-markdown` only. The markdown round-trip requires the newer version; calling these against an older pinned version fails. |

Async task polling also requires `2026-03-11`, but no async-task tool exists in the local server — see Section 7.

---

## 5. TOOL INVENTORY (24 TOOLS, 6 DOMAINS)

Names below are confirmed against the official README (2026-08-21) but not runtime-confirmed in this environment (see the verification status note above). Append the bare name to the `notion.notion_` namespace and confirm the exact callable form with `tool_info()` before use.

### Pages (7 tools)

| Tool | Endpoint | Purpose | Key inputs |
|------|----------|---------|-----------|
| `create-a-page` | POST /v1/pages | Create a page under a parent page or data source | `parent` (`page_id` or `data_source_id`/`database_id`), `properties`, `children` (blocks), `icon`, `cover` |
| `retrieve-a-page` | GET /v1/pages/{page_id} | Get a page's properties and metadata | `page_id`, optional `filter_properties` |
| `update-page-properties` | PATCH /v1/pages/{page_id} | Update page properties, icon, cover, or trash state | `page_id`, `properties`, `icon`, `cover`, `in_trash`/`archived` |
| `archive-a-page` | PATCH /v1/pages/{page_id} (`archived: true`) | Soft-delete (move a page to trash) | `page_id` |
| `move-page` | POST /v1/pages/{page_id}/move | Move a page to a different parent | `page_id`, new parent (`page_id` or `data_source_id`) |
| `retrieve-page-markdown` | GET /v1/pages/{page_id}/markdown | Read full page content as token-efficient Markdown (requires API 2026-03-11) | `page_id` |
| `update-page-markdown` | PATCH /v1/pages/{page_id}/markdown | Edit a page via Markdown — full replace or targeted find-and-replace (requires API 2026-03-11) | `page_id`, `replace_content` OR `update_content` (find-and-replace) |

### Blocks (5 tools)

| Tool | Endpoint | Purpose | Key inputs |
|------|----------|---------|-----------|
| `retrieve-a-block` | GET /v1/blocks/{block_id} | Get a single block object | `block_id` |
| `retrieve-block-children` | GET /v1/blocks/{block_id}/children | List a block's (or page's) child blocks, paginated | `block_id`, `start_cursor`, `page_size` |
| `append-block-children` | PATCH /v1/blocks/{block_id}/children | Append new blocks to a parent block or page | `block_id`, `children[]`, optional `after` |
| `update-a-block` | PATCH /v1/blocks/{block_id} | Update a block's content or archive it | `block_id`, block-type payload, `archived` |
| `delete-a-block` | DELETE /v1/blocks/{block_id} | Move a block to trash | `block_id` |

### Databases / Data Sources (6 tools)

| Tool | Endpoint | Purpose | Key inputs |
|------|----------|---------|-----------|
| `retrieve-a-database` | GET /v1/databases/{database_id} | Get database container metadata, including its data source IDs | `database_id` |
| `retrieve-a-data-source` | GET /v1/data_sources/{data_source_id} | Get a data source's schema and property definitions | `data_source_id` |
| `query-data-source` | POST /v1/data_sources/{data_source_id}/query | Query rows with filter + sort, paginated | `data_source_id`, `filter`, `sorts`, `start_cursor`, `page_size` |
| `update-a-data-source` | PATCH /v1/data_sources/{data_source_id} | Update a data source's title, description, or property schema | `data_source_id`, `title`, `description`, `properties` (schema) |
| `create-a-data-source` | POST /v1/data_sources | Create a new data source under a page or database | `parent` (`page_id` or `database_id`), `title`, `properties` (schema) |
| `list-data-source-templates` | GET /v1/data_sources/{data_source_id}/templates | List a data source's page templates | `data_source_id` |

### Comments (2 tools)

| Tool | Endpoint | Purpose | Key inputs |
|------|----------|---------|-----------|
| `create-a-comment` | POST /v1/comments | Add a page-level comment or reply to a discussion thread | `parent` (`page_id`) OR `discussion_id`, `rich_text` |
| `list-comments` | GET /v1/comments | List unresolved comments on a page or block | `block_id` (page or block), `start_cursor` |

### Users (3 tools)

| Tool | Endpoint | Purpose | Key inputs |
|------|----------|---------|-----------|
| `list-all-users` | GET /v1/users | List workspace users, paginated | `start_cursor`, `page_size` |
| `retrieve-a-user` | GET /v1/users/{user_id} | Get a single user by ID | `user_id` |
| `retrieve-bot-user` | GET /v1/users/me | Get the bot/integration identity for the current token | (none) |

### Search (1 tool)

| Tool | Endpoint | Purpose | Key inputs |
|------|----------|---------|-----------|
| `search` | POST /v1/search | Search shared pages and data sources by **title** (not full-text content) | `query` (title text), `filter` (page vs data_source), `sort`, `start_cursor`, `page_size` |

---

## 6. PRIORITY TABLE

Rough routing priority for an AI agent operating a Notion workspace. High = the common read/write path; Medium = structural and schema work; Low = infrequent lookups.

| Priority | Tools | Typical use |
|----------|-------|-------------|
| **High** | `retrieve-page-markdown`, `update-page-markdown`, `create-a-page`, `retrieve-a-page`, `query-data-source`, `append-block-children`, `search` | Read/write page content and query database rows — the markdown round-trip is the most token-efficient way to read and edit a page |
| **Medium** | `update-page-properties`, `retrieve-block-children`, `update-a-block`, `retrieve-a-data-source`, `create-a-data-source`, `update-a-data-source`, `retrieve-a-database`, `move-page`, `archive-a-page`, `create-a-comment` | Manage properties, block-level edits, database schema, and page organization |
| **Low** | `retrieve-a-block`, `delete-a-block`, `list-data-source-templates`, `list-comments`, `list-all-users`, `retrieve-a-user`, `retrieve-bot-user` | Occasional lookups, template listing, user directory, and comment reads |

---

## 7. UNCOVERED DOMAINS (DIRECT API CALLS)

Five capability areas are **not** exposed as MCP tools by the local server. They are fillable with direct Notion REST API calls — documented in `api-gap-tools.md`:

| Uncovered domain | Why it matters | Fill |
|------------------|----------------|------|
| **File uploads** | Attaching images, PDFs, and files to pages/blocks (5 API endpoints: create, send, complete, retrieve, list) | Direct API → `api-gap-tools.md` |
| **Views** | Creating/querying saved database views (table, board, calendar, etc.; 6+ endpoints) | Direct API → `api-gap-tools.md` |
| **Page property items** | Non-truncated retrieval of individual paginated properties (`GET /v1/pages/{page_id}/properties/{property_id}`) | Direct API → `api-gap-tools.md` |
| **Async tasks** | Polling status of long operations such as page duplication (`GET /v1/async_tasks/{task_id}`; requires API 2026-03-11) | Direct API → `api-gap-tools.md` |
| **Daily notes** | Convention, not an endpoint — a date-titled page workflow analogous to Obsidian daily notes | Knowledge-layer convention → `api-gap-tools.md` |

Other API domains (agents, sessions, custom emojis, meeting notes) and structural limits (hard delete — archive only; full-text content search — title-only) are inherent platform differences, not tooling gaps; see the mode `SKILL.md` and `troubleshooting.md`.

---

## 8. INVOCATION PATTERN (CODE MODE)

`call_tool_chain` takes a single `code` string (TypeScript), not an array of `{tool, input}` records. It has direct access to every registered tool as a hierarchical function under the `notion` namespace.

> **Hyphen handling — VERIFY before first call.** Notion tool names use hyphens (`create-a-page`), so `notion.notion_create-a-page` is NOT valid JavaScript with dot notation (it parses as subtraction). Code Mode manuals resolve this in one of two ways: bracket access that preserves the hyphen (`notion["notion_create-a-page"]`), or an underscore-sanitized identifier (`notion.notion_create_a_page`). Which one this manual uses cannot be confirmed until the manual is registered. Run `list_tools()` once the `notion` manual is live and read the exact callable identifier it prints, or `tool_info("notion.notion_create-a-page")`, before hardcoding either form. The bracket form below is the hyphen-safe default until confirmed.

```typescript
// Single tool call (bracket form is hyphen-safe until list_tools() confirms the callable)
const result = await call_tool_chain({
  code: `
    const page = await notion["notion_retrieve-page-markdown"]({
      page_id: "PAGE_ID",
    });
    return page;
  `,
});

// Chained: create a page, then append a heading block to it
const result = await call_tool_chain({
  code: `
    const page = await notion["notion_create-a-page"]({
      parent: { data_source_id: "DATA_SOURCE_ID" },
      properties: { title: [{ text: { content: "New Feature Spec" } }] },
    });
    const appended = await notion["notion_append-block-children"]({
      block_id: page.id,
      children: [
        { heading_2: { rich_text: [{ text: { content: "About" } }] } },
      ],
    });
    return { page, appended };
  `,
});
```

Confirm every callable name and its exact form with `tool_info()` / `list_tools()` before hardcoding it — the names above are source-confirmed from the official README, not runtime-verified in this environment (see the verification status note).

---

## 9. ERROR HANDLING

Common error patterns and recovery:

| Error | Code | Recovery |
|-------|------|---------|
| Unauthorized / connection fails | 401 | Check `NOTION_TOKEN` is set and valid — there is no browser step on the local backend |
| Resource not found / not shared | 404 | The page/database was likely never shared with the integration — share it in the Notion UI, then retry |
| Insufficient permissions | 403 | The integration's capabilities (read/update/insert) may be too narrow; widen them in the integrations dashboard |
| Rate limited | 429 | Notion allows ~3 requests/second per integration — wait for the `Retry-After` header value, then retry with backoff and jitter |
| Service overloaded | 529 | Transient — retry with exponential backoff |
| Wrong API version for markdown | 400 | `retrieve-page-markdown` / `update-page-markdown` require API `2026-03-11` (Section 4) |
| Tool not found | n/a | Manual not registered, or the callable name/hyphen form has changed — run `list_tools()` / `tool_info()` before retrying |

```typescript
// Rate-limit-aware retry pattern
try {
  const result = await call_tool_chain({
    code: `
      return await notion["notion_query-data-source"]({ data_source_id: "${dataSourceId}" });
    `,
  });
  return result;
} catch (error) {
  if (error.code === 429) {
    await delay(retryAfterSeconds * 1000);
    return retry();
  }
  throw error;
}
```
