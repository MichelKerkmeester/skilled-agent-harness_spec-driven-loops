---
title: "mcp-notion: Feature Catalog"
description: "Current-state capability inventory for the mcp-notion mode — 24 official Notion MCP tools across 6 domains, 5 direct-API gap fills, and the Notion knowledge layer the mode encodes."
trigger_phrases:
  - "notion feature catalog"
  - "notion mcp tools inventory"
  - "notion 24 tools by domain"
  - "notion api gap fills"
importance_tier: "important"
contextType: "reference"
version: 0.1.0.0
---

# mcp-notion: Feature Catalog

Capability inventory for the `mcp-notion` mode. This catalog describes **what the mode reaches today** — the official Notion MCP tool surface plus the direct-API calls that fill its documented gaps. Execution detail (exact prompts, round-trip steps, pass/fail criteria) lives in the manual testing playbook.

Notion is an **MCP-only** surface: there is no purpose-built CLI. Every operation runs through the official server or a direct Notion REST call, invoked from Code Mode.

---

## 1. OVERVIEW

The `mcp-notion` mode routes Notion work across two backends and one direct-API escape hatch:

- **Official Notion MCP** — `@notionhq/notion-mcp-server` (v2.5.x, **24 tools**), registered as the `notion` manual in `.utcp_config.json` and invoked via Code Mode `call_tool_chain({ code: "..." })`. Covers all CRUD across pages, blocks, databases/data sources, comments, users, and search.
- **Direct Notion REST API** — for the **5 capabilities the MCP does not expose** (file uploads, views, non-truncated page property items, async-task polling on the local backend, and daily-note conventions). Called with the same `NOTION_TOKEN` used by the local server.

> **Verification posture.** The tool counts below come from the `014` deep-research synthesis (`@notionhq/notion-mcp-server` v2.5.1, 24 tools, 6 domains). Exact registered tool identifiers vary between the local stdio server (`create-a-page`, `retrieve-a-page`, …) and the remote server (`notion-create-pages`, …). **Confirm every tool name live** with `list_tools()` / `tool_info()` before composing a `call_tool_chain` — do not guess names from this catalog. The Notion API 2.0.0 migrated to **data sources** as the primary abstraction (replacing "databases"); markdown round-trip tools require API `2026-03-11`, most other tools pin `2025-09-03`.

| Metric | Value |
|--------|-------|
| Official MCP tools | 24 (pages 7, blocks 5, databases/data-sources 6, comments 2, users 3, search 1) |
| Direct-API gap fills | 5 (file uploads, views, page property items, async tasks, daily notes) |
| CLI | None — Notion is MCP-only |
| MCP server | `notion` — `@notionhq/notion-mcp-server` via `npx -y`, `NOTION_TOKEN` env var, registered in `.utcp_config.json` |
| MCP invocation | `notion.notion_<tool_name>` via Code Mode — confirm every name with `tool_info()` / `list_tools()`, do not guess |
| Env key | `notion_NOTION_TOKEN` (resolved into the manual's `NOTION_TOKEN`) |

Routing is **operation-based**: CRUD operations go through the MCP; the 5 gap capabilities go through direct REST. See `../SKILL.md` for the routing pseudocode and smart-router backend selection.

---

## 2. BACKEND SELECTION

Notion ships two backends. They split cleanly by runtime, and the mode routes between them.

| Backend | Transport / auth | Headless? | Tool naming | Use when |
|---------|------------------|-----------|-------------|----------|
| **Local stdio** (registered) | `npx @notionhq/notion-mcp-server`, `NOTION_TOKEN` | Yes | `create-a-page`, `retrieve-a-page`, … | Headless / Code Mode (the default here) |
| **Remote** (recommended by Notion) | `https://mcp.notion.com/mcp`, OAuth | No (interactive browser only) | `notion-create-pages`, … + async-task tools | Interactive sessions with a browser |

The `notion` manual in `.utcp_config.json` targets the **local stdio server** because Code Mode is headless and the remote OAuth server cannot run headless. Notion is deprecating the open-source local server in favor of the remote one; this is a **known risk to track**, not a wrong choice. Smart-router selection: interactive + OAuth available → remote MCP; else headless + `NOTION_TOKEN` → local stdio plus direct API for the 5 gaps; else escalate to the install guide.

---

## 3. PAGES (7 TOOLS)

Page create/read/update, trash lifecycle, and Markdown round-trip.

| Operation | What it does |
|-----------|--------------|
| Create a page | Create a page under a parent page or data source, with initial properties and content. |
| Retrieve a page | Read a page's properties and metadata by ID (property values over ~25 items truncate — see §9). |
| Update page properties | Patch a page's property values. |
| Archive a page | Move a page to trash — a soft, reversible delete (no hard delete exists). |
| Restore a page | Un-trash a previously archived page. |
| Fetch page as Markdown | Render a page's block content to Markdown (requires API `2026-03-11`). |
| Update page from Markdown | Write Markdown content into a page's blocks (requires API `2026-03-11`). |

---

## 4. BLOCKS (5 TOOLS)

Block-level content read and mutation. Blocks are the paragraphs, headings, lists, and embeds that make up page content.

| Operation | What it does |
|-----------|--------------|
| Retrieve a block | Read a single block by ID. |
| Retrieve block children | List the child blocks of a page or block (paginated). |
| Append block children | Add one or more blocks to a page or block. |
| Update a block | Edit a block's type-specific content. |
| Delete a block | Move a block to trash (reversible). |

---

## 5. DATABASES AND DATA SOURCES (6 TOOLS)

The Notion API 2.0.0 abstraction: a **database** is a container that holds one or more **data sources**, and a data source carries the schema and rows (each row is a page). Query targets the data source.

| Operation | What it does |
|-----------|--------------|
| Create a data source | Create a new data source (schema) under a database or parent. |
| Retrieve a data source | Read a data source's schema and property definitions. |
| Update a data source | Edit a data source's schema and properties. |
| Query a data source | Filter and sort the rows (pages) of a data source. |
| Create a database | Create the database container that holds data sources. |
| Retrieve a database | Read a database container's metadata and its data-source list. |

---

## 6. COMMENTS (2 TOOLS)

Page and discussion-thread comments.

| Operation | What it does |
|-----------|--------------|
| Create a comment | Add a comment to a page or an existing discussion thread. |
| Retrieve comments | List the comments on a block or page (paginated). |

---

## 7. USERS (3 TOOLS)

Workspace user directory and integration identity.

| Operation | What it does |
|-----------|--------------|
| List users | Enumerate the workspace's users (paginated). |
| Retrieve a user | Read a single user by ID. |
| Retrieve your bot user | Read the integration's own bot user — the owner of the `NOTION_TOKEN`. Use as a connectivity/auth preflight. |

---

## 8. SEARCH (1 TOOL)

| Operation | What it does |
|-----------|--------------|
| Search | Find pages and data sources the integration can access. **Title-only** — there is no full-text content search (a structural platform limit, not a fillable gap). |

---

## 9. API-GAP FILLS (5 DIRECT-API CAPABILITIES)

Five capabilities the MCP does not expose. Each is reachable with a direct Notion REST call using the same `NOTION_TOKEN`. These are **tooling gaps** — fillable — as opposed to the structural gaps (hard delete, full-text search, headless views on the remote backend) which are inherent and out of scope.

| Capability | Gap detail | Resolution |
|------------|-----------|------------|
| File uploads | 5 REST endpoints (create upload, send contents, complete multi-part, attach) with no MCP tool. | Direct API, then attach the file object to a page or block. |
| Views | 6+ REST endpoints for database views with no MCP tool. | Direct API. |
| Page property items (non-truncated) | `retrieve-a-page` truncates relation / rollup / people properties past ~25 items; the property-item endpoint returns the full paginated list. | Direct API call to the page-property-item endpoint. |
| Async-task polling | The local backend does not expose long-running task status (e.g. large exports/duplications). | Direct API poll on the task, or use the remote MCP (which exposes async-task tools natively). |
| Daily notes | No API endpoint exists. | Knowledge-layer convention: `create-a-page` into a "Daily Notes" data source keyed by date. |

---

## 10. KNOWLEDGE-LAYER REFERENCES

Operating a Notion workspace correctly requires more than tool calls. The mode encodes three knowledge pillars plus operational doctrine; the reference docs under `../references/` carry the detail.

- **Hierarchy** — the database → data-source → page model, and why queries target data sources, not databases.
- **Property types** — the 22 Notion property types with their schema, value, filter, and sort semantics.
- **Relational and computed model** — relations (single and dual), rollups (14 aggregation functions), and Formulas 2.0 (~50 functions).
- **Operational doctrine** — rate limits (**3 requests/second** per integration; honor `Retry-After` with backoff and jitter) and **per-operation API-version pinning** (`2025-09-03` for most tools, `2026-03-11` for Markdown round-trip).

---

## 11. CAPABILITY COUNT SUMMARY

| Domain | Tools |
|--------|-------|
| Pages | 7 |
| Blocks | 5 |
| Databases and data sources | 6 |
| Comments | 2 |
| Users | 3 |
| Search | 1 |
| **Official MCP subtotal** | **24** |
| Direct-API gap fills | 5 |
| **Total capabilities** | **29** |
