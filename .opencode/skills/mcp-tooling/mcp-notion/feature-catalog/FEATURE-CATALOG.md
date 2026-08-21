---
title: "mcp-notion: Feature Catalog"
description: "Current-state capability inventory for the mcp-notion mode — 24 official Notion MCP tools across 6 domains, 5 direct-API gap fills, and the Notion knowledge layer the mode encodes."
trigger_phrases:
  - "notion feature catalog"
  - "notion mcp tools inventory"
  - "notion 24 tools by domain"
  - "notion api gap fills"
last_updated: "2026-08-21"
version: 0.1.0.0
---

# mcp-notion: Feature Catalog

This document combines the current feature inventory for the `mcp-notion` mode into a single reference. The root catalog acts as the system-level directory: it summarizes each capability area, describes what the mode does today, and points to the reference docs that carry deeper implementation and validation detail.

Notion is an **MCP-only** surface: there is no purpose-built CLI. Every operation runs through the official server or a direct Notion REST call, invoked from Code Mode. This catalog is single-file — there are no per-feature leaf files under `feature-catalog/`; implementation and source-anchor detail for every entry below lives in `../SKILL.md` and the `../references/` set linked throughout.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `mcp-notion` feature surface. The numbered sections below group the mode by capability area — backend selection, the six MCP tool domains, the direct-API gap fills, and the knowledge layer — so a reader can move from this top-level summary into the reference docs without losing current-state context.

The `mcp-notion` mode routes Notion work across two backends (§2) and one direct-API escape hatch (§9): the **official Notion MCP** — `@notionhq/notion-mcp-server` (v2.5.x, **24 tools**), registered as the `notion` manual in `.utcp_config.json` and invoked via Code Mode `call_tool_chain({ code: "..." })` — covers all CRUD across pages, blocks, databases/data sources, comments, users, and search; **direct Notion REST calls** fill the 5 capabilities the MCP does not expose.

> **Verification posture.** The tool counts below reflect a source-confirmed inventory of `@notionhq/notion-mcp-server` v2.5.1 (24 tools, 6 domains) — see `../references/mcp-tools.md` for the full per-tool table and its verification status. Exact registered tool identifiers vary between the local stdio server (`create-a-page`, `retrieve-a-page`, …) and the remote server (`notion-create-pages`, …). **Confirm every tool name live** with `list_tools()` / `tool_info()` before composing a `call_tool_chain` — do not guess names from this catalog. The Notion API 2.0.0 migrated to **data sources** as the primary abstraction (replacing "databases"); markdown round-trip tools require API `2026-03-11`, most other tools pin `2025-09-03`.

| Metric | Value |
|--------|-------|
| Official MCP tools | 24 (pages 7, blocks 5, databases/data-sources 6, comments 2, users 3, search 1) |
| Direct-API gap fills | 5 (file uploads, views, page property items, async tasks, daily notes) |
| Total capabilities | 29 (24 MCP tools + 5 direct-API gap fills) |
| CLI | None — Notion is MCP-only |
| MCP server | `notion` — `@notionhq/notion-mcp-server` via `npx -y`, `NOTION_TOKEN` env var, registered in `.utcp_config.json` |
| MCP invocation | `notion.notion_<tool_name>` via Code Mode — confirm every name with `tool_info()` / `list_tools()`, do not guess |
| Env key | `notion_NOTION_TOKEN` (resolved into the manual's `NOTION_TOKEN`) |

Routing is **operation-based**: CRUD operations go through the MCP (§3-§8); the 5 gap capabilities go through direct REST (§9). Backend selection and the full routing pseudocode live in §2 and `../SKILL.md`.

---

## 2. BACKEND SELECTION

Notion ships two backends. They split cleanly by runtime, and the mode routes between them. Smart-router selection: interactive + OAuth available → remote MCP; else headless + `NOTION_TOKEN` → local stdio plus direct API for the 5 gaps; else escalate to the install guide. See `../SKILL.md` for the full routing pseudocode.

### Local stdio backend (registered)

#### Description

The `notion` manual in `.utcp_config.json` targets `npx @notionhq/notion-mcp-server`, authenticated with `NOTION_TOKEN`. Tool names are hyphenated (`create-a-page`, `retrieve-a-page`, …).

#### Current Reality

Headless-capable — the only backend Code Mode can drive, since Code Mode has no browser. Notion is deprecating the open-source local server in favor of the remote one; this is a **known risk to track**, not a wrong choice.

---

### Remote backend (recommended by Notion)

#### Description

`https://mcp.notion.com/mcp`, authenticated via OAuth. Tool names use a `notion-` prefix (`notion-create-pages`, …) plus async-task tools the local server lacks.

#### Current Reality

Interactive-only — the OAuth flow requires a browser, so it cannot run headless in Code Mode. Use for interactive sessions with a browser, not for the mode's default headless path.

---

## 3. PAGES (7 TOOLS)

Page create/read/update, trash lifecycle, and Markdown round-trip.

### Create a page

#### Description

Create a page under a parent page or data source, with initial properties and content.

#### Current Reality

Runs under API `2025-09-03`; the parent may be a `page_id` or a `data_source_id`.

---

### Retrieve a page

#### Description

Read a page's properties and metadata by ID.

#### Current Reality

Property values past ~25 items truncate — use the direct-API page-property-item gap fill (§9) for the full paginated list.

---

### Update page properties

#### Description

Patch a page's property values.

#### Current Reality

Runs under API `2025-09-03`; only the supplied properties change.

---

### Archive a page

#### Description

Move a page to trash.

#### Current Reality

A soft, reversible delete — there is no hard-delete endpoint for pages.

---

### Move a page

#### Description

Move a page to a different parent page or data source.

#### Current Reality

`POST /v1/pages/{page_id}/move`; runs under API `2025-09-03`.

---

### Fetch page as Markdown

#### Description

Render a page's block content to Markdown.

#### Current Reality

Requires API `2026-03-11` — the default `2025-09-03` pin does not expose this tool.

---

### Update page from Markdown

#### Description

Write Markdown content into a page's blocks.

#### Current Reality

Requires API `2026-03-11`, matching `Fetch page as Markdown`.

---

## 4. BLOCKS (5 TOOLS)

Block-level content read and mutation. Blocks are the paragraphs, headings, lists, and embeds that make up page content.

### Retrieve a block

#### Description

Read a single block by ID.

#### Current Reality

Runs under API `2025-09-03`, the pin shared by every non-markdown tool.

---

### Retrieve block children

#### Description

List the child blocks of a page or block.

#### Current Reality

Paginated — a full listing may need repeated calls with a continuation cursor.

---

### Append block children

#### Description

Add one or more blocks to a page or block.

#### Current Reality

Accepts multiple block objects in one call; runs under API `2025-09-03`.

---

### Update a block

#### Description

Edit a block's type-specific content.

#### Current Reality

The payload shape is type-specific — a paragraph block and a heading block take different fields.

---

### Delete a block

#### Description

Move a block to trash.

#### Current Reality

Reversible, matching the page-level archive/restore model.

---

## 5. DATABASES AND DATA SOURCES (6 TOOLS)

The Notion API 2.0.0 abstraction: a **database** is a container that holds one or more **data sources**, and a data source carries the schema and rows (each row is a page). Query targets the data source.

### Create a data source

#### Description

Create a new data source (schema) under a database or parent.

#### Current Reality

Defines the schema only; rows are added afterward via `Create a page` targeting the new data source.

---

### Retrieve a data source

#### Description

Read a data source's schema and property definitions.

#### Current Reality

Runs under API `2025-09-03`; the returned schema drives every property write and filter against it.

---

### Update a data source

#### Description

Edit a data source's schema and properties.

#### Current Reality

Schema edits apply to all existing rows immediately.

---

### Query a data source

#### Description

Filter and sort the rows (pages) of a data source.

#### Current Reality

Targets a data-source ID, not a database ID — the v2.0.0 breaking change this catalog's data model is built around.

---

### Create a database

#### Description

Create the database container that holds data sources.

#### Current Reality

Creates the container only; call `Create a data source` afterward to define its schema.

---

### Retrieve a database

#### Description

Read a database container's metadata and its data-source list.

#### Current Reality

Row-level reads still go through the data-source tools above, not this one.

---

## 6. COMMENTS (2 TOOLS)

Page and discussion-thread comments.

### Create a comment

#### Description

Add a comment to a page or an existing discussion thread.

#### Current Reality

Runs under API `2025-09-03`.

---

### Retrieve comments

#### Description

List the comments on a block or page.

#### Current Reality

Paginated, matching the block-children listing pattern.

---

## 7. USERS (3 TOOLS)

Workspace user directory and integration identity.

### List users

#### Description

Enumerate the workspace's users.

#### Current Reality

Paginated.

---

### Retrieve a user

#### Description

Read a single user by ID.

#### Current Reality

Runs under API `2025-09-03`.

---

### Retrieve your bot user

#### Description

Read the integration's own bot user — the owner of the `NOTION_TOKEN`.

#### Current Reality

Use as a connectivity/auth preflight before other calls.

---

## 8. SEARCH (1 TOOL)

Workspace-wide discovery of shared pages and data sources.

### Search

#### Description

Find pages and data sources the integration can access.

#### Current Reality

**Title-only** — there is no full-text content search. A structural platform limit, not a fillable gap.

---

## 9. API-GAP FILLS (5 DIRECT-API CAPABILITIES)

Five capabilities the MCP does not expose. Each is reachable with a direct Notion REST call using the same `NOTION_TOKEN`. These are **tooling gaps** — fillable — as opposed to the structural gaps (hard delete, full-text search, headless views on the remote backend) which are inherent and out of scope.

### File uploads

#### Description

5 REST endpoints (create upload, send contents, complete multi-part, attach) with no MCP tool.

#### Current Reality

Direct API, then attach the file object to a page or block.

---

### Views

#### Description

6+ REST endpoints for database views with no MCP tool.

#### Current Reality

Direct API.

---

### Page property items (non-truncated)

#### Description

`retrieve-a-page` truncates relation, rollup, and people properties past ~25 items.

#### Current Reality

The direct-API property-item endpoint returns the full paginated list.

---

### Async-task polling

#### Description

The local backend does not expose long-running task status (e.g. large exports or duplications).

#### Current Reality

Direct API poll on the task, or use the remote MCP (§2), which exposes async-task tools natively.

---

### Daily notes

#### Description

No API endpoint exists for daily notes.

#### Current Reality

Knowledge-layer convention: `create-a-page` into a "Daily Notes" data source keyed by date.

---

## 10. KNOWLEDGE-LAYER REFERENCES

Operating a Notion workspace correctly requires more than tool calls. The mode encodes three knowledge pillars plus operational doctrine; the reference docs linked below carry the detail.

### Hierarchy

#### Description

The database → data-source → page model.

#### Current Reality

Queries target data sources, not databases — see `../references/database-model.md`.

---

### Property types

#### Description

The 22 Notion property types with their schema, value, filter, and sort semantics.

#### Current Reality

Full detail in `../references/property-types.md`.

---

### Relational and computed model

#### Description

Relations (single and dual), rollups (14 aggregation functions), and Formulas 2.0 (~50 functions).

#### Current Reality

Full detail in `../references/database-model.md`.

---

### Operational doctrine

#### Description

Rate limits and per-operation API-version pinning.

#### Current Reality

3 requests/second per integration (honor `Retry-After` with backoff and jitter); `2025-09-03` for most tools, `2026-03-11` for the Markdown round-trip. Full detail in `../references/troubleshooting.md`.
